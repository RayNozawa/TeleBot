import TelegramBot from 'node-telegram-bot-api';
import path from 'path';
import Func from './functions.js';
import axios from 'axios';
import { readdir, stat } from 'fs/promises';
import { resolve, basename } from 'path';
import fs from 'fs'
import { exec  } from 'child_process';
import https from 'https';

export const makeTelegramBot = (token, options = {}) => {
 let conn = new TelegramBot(token, {
   polling: true
  });
 conn.reply = async (chatId, text, msg, parse_mode = "Markdown", buttons) => {
    const MAX_LENGTH = 4096;
    text = text.length > MAX_LENGTH ? text.slice(0, MAX_LENGTH - 10) + '...' : text;

    let replyOptions = { parse_mode, };
    if (msg?.message_id) {
      replyOptions.reply_to_message_id = msg.message_id;
    }
    
    let replyMarkup = null
    if (buttons) {
      replyMarkup = {
        reply_markup: {
            inline_keyboard: buttons
        }
      };
      const data = conn.sendMessage(chatId, text, { ...replyOptions, ...replyMarkup });
      return data;
    }
    
    try {
      const data = await conn.sendMessage(chatId, text, replyOptions);
      return data;
    } catch (e) {
      const data = await conn.sendMessage(chatId, text);
      return data;
    }
  };
  
  conn.sendButton = async (chatId, buttons, source, filename = "", caption = "", msg, artist = "Unknown Artist", parse_mode = "Markdown", cover = "https://files.catbox.moe/6uirz2.jpg") => {
  try {
    const MAX_LENGTH = 1024;
    caption = caption.length > MAX_LENGTH ? caption.slice(0, MAX_LENGTH - 10) + '...' : caption;
    
    let replyMarkup = {
        reply_markup: {
            inline_keyboard: buttons.map(btn => [
              Object.fromEntries(
                Object.entries(btn).map(([key, value]) => {
                  if (key === "name") return ["text", value]
                  if (key === "command") return ["callback_data", value]
                  return [key, value]
                })
              )
            ])
        }
    };
    let replyOptions = {};
    if (msg?.message_id) {
        replyOptions.reply_to_message_id = msg.message_id;
    }
    
    let fileData = await Func.getFile(source, filename);
    if (!fileData.status) throw new Error("Gagal mengambil file.");
    let { file, extension } = fileData;
    let tempDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
        let { file: thumb } = await Func.getFile(cover)
        
        let outputFile = path.join(tempDir, filename);
        try {
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i "${file}" -i "${thumb}" -map 0:a -map 1 -c copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" -metadata artist="${artist}" -metadata title="${filename.replace('.mp3', '')}" "${outputFile}"`, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            file = outputFile;
        } catch (err) {
            console.error("Error saat menambahkan metadata:", err);
        }
    }
    let sendFunction;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        sendFunction = conn.sendPhoto(chatId, file, { caption, parse_mode, ...replyOptions, ...replyMarkup });
    } else if (["mp4", "mov", "avi", "mkv"].includes(extension)) {
        sendFunction = conn.sendVideo(chatId, file, { caption, parse_mode, ...replyOptions, ...replyMarkup });
    } else if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
        sendFunction = conn.sendAudio(chatId, file, { caption, parse_mode, ...replyOptions, ...replyMarkup });
    } else {
        sendFunction = conn.sendDocument(chatId, file, { caption, parse_mode, filename, ...replyOptions, ...replyMarkup });
    }
    sendFunction.finally(() => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
    
    return sendFunction;
  } catch (e) {
    throw e
  }
  };

  conn.editMsg = async (chatId, msgId, msg, buttons, parse_mode) => {
    const MAX_LENGTH = 4096;
    msg = msg.length > MAX_LENGTH ? msg.slice(0, MAX_LENGTH - 10) + '...' : msg;

    try {
      let options = {
        chat_id: chatId,
        message_id: msgId
      }
      
      if (parse_mode) {
        options.parse_mode = parse_mode
      }
      
      if (!buttons) {
        const data = await conn.editMessageText(msg, options);
        return data
      } else {
        const data = await conn.editMessageText(msg, {
          ...options,
          reply_markup: {
            inline_keyboard: buttons.map(btn => [
              Object.fromEntries(
                Object.entries(btn).map(([key, value]) => {
                  if (key === "name") return ["text", value]
                  if (key === "command") return ["callback_data", value]
                  return [key, value]
                })
              )
            ])
          }
        });
        return data
      }
    } catch (e) {
      let options = {
        chat_id: chatId,
        message_id: msgId
      }
      const data = await conn.editMessageText(msg, options);
      return data
    }
  }

  conn.sendFile = async (chatId, source, filename = "", caption = "", msg, artist = "Unknown Artist", parse_mode = "Markdown") => {
    const MAX_LENGTH = 1024;
    caption = caption.length > MAX_LENGTH ? caption.slice(0, MAX_LENGTH - 10) + '...' : caption;
    
    let replyOptions = {};
    if (msg?.message_id) {
        replyOptions.reply_to_message_id = msg.message_id;
    }

    let fileData = await Func.getFile(source, filename);
    if (!fileData.status) throw new Error("Gagal mengambil file.");
    let { file, extension } = fileData;
    let tempDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
        let outputFile = path.join(tempDir, filename);
        try {
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i "${file}" -metadata artist="${artist}" -metadata title="${filename.replace('.mp3', '')}" -codec copy "${outputFile}"`, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            file = outputFile;
        } catch (err) {
            console.error("Error saat menambahkan metadata:", err);
        }
    }

    let sendFunction;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        sendFunction = conn.sendPhoto(chatId, file, { caption, parse_mode, ...replyOptions });
    } else if (["mp4", "mov", "avi", "mkv"].includes(extension)) {
        sendFunction = conn.sendVideo(chatId, file, { caption, parse_mode, ...replyOptions });
    } else if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
        sendFunction = conn.sendAudio(chatId, file, { caption, parse_mode, ...replyOptions });
    } else {
        sendFunction = conn.sendDocument(chatId, file, { caption, parse_mode, filename, ...replyOptions });
    }

    sendFunction.finally(() => {
    const filePath = process.cwd() + "/media/cover.jpg";
    if (file !== filePath && fs.existsSync(file)) {
        fs.unlinkSync(file);
     }
    });
    
    return sendFunction;
  };
  return conn;
};

export const smsg = (conn, msg) => {
  if (!msg) return msg;

  let m = {
    msg: msg,
    id: msg.message_id,
    chat: msg.chat.id,
    isGroup: msg.chat.type === "group" || msg.chat.type === "supergroup",
    sender: msg.from.id,
    name: msg.from.first_name || "",
    username: msg.from.username || "Anonymous" || null,
    text: msg.text || msg.caption || "", 
    mentionedJid: msg.entities ? msg.entities.filter(entity => entity.type === "mention").map(entity => msg.text.substring(entity.offset, entity.offset + entity.length)) : [],
    quoted: msg.reply_to_message ? smsg(conn, msg.reply_to_message) : null,
    groupName: msg.chat.title || null,
    type: "text"
  };

  if (msg.photo) m.type = "photo";
  else if (msg.video) m.type = "video";
  else if (msg.audio) m.type = "audio";
  else if (msg.voice) m.type = "voice";
  else if (msg.document) m.type = "document";
  else if (msg.sticker) m.type = "sticker";
  else if (msg.animation) m.type = "animation";

  m.reply = (text) => conn.reply(m.chat, text, m.msg);

  m.download = async () => {
    try {
      let fileId =
        msg.photo?.[msg.photo.length - 1]?.file_id ||
        msg.video?.file_id ||
        msg.document?.file_id ||
        msg.audio?.file_id ||
        msg.sticker?.file_id

      if (!fileId) {
        return null;
      }

      let fileInfo = await conn.getFile(fileId);
      let fileUrl = `https://api.telegram.org/file/bot${conn.token}/${fileInfo.file_path}`;

      let response = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "arraybuffer",
      });

      return response.data;
    } catch (err) {
      console.error("Gagal mengunduh file:", err);
      return null;
    }
  };

  return m || msg;
};

export const Scandir = async (dir) => {
  let subdirs = await readdir(dir)
  let files = await Promise.all(subdirs.map(async (subdir) => {
    let res = resolve(dir, subdir)
    return (await stat(res)).isDirectory() ? Scandir(res) : res
  }))
  return files.reduce((a, f) => a.concat(f), [])
}