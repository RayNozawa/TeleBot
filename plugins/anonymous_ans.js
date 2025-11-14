import TelegramBot from 'node-telegram-bot-api';
import fs from "fs";
import path from "path";

export const run = {
  async: async (m, {
    conn,
    Api,
    body,
    Func,
    users,
    env,
    isROwner
  }) => {
    if (m.isGroup) return !0

    db.anonymous = db.anonymous ? db.anonymous : {}

    let room = Object.values(db.anonymous).find(room => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING')
    if (room) {
      if (/^.*(next|leave|start)/.test(m.text))
        return
      let other = [room.a, room.b].find(user => user !== m.sender)

      const reply = m.msg;
      try {
        if (room.aToken == room.bToken) {
          if (reply.text) {
            await conn.sendMessage(other, reply.text, { parse_mode: "HTML" }).catch(() =>
              conn.sendMessage(other, reply.text).catch(() => {})
            );
          } else if (reply.photo) {
            const fileId = reply.photo[reply.photo.length - 1].file_id;
            await conn.sendPhoto(other, fileId, { caption: reply.caption || "" })
          } else if (reply.video) {
            await conn.sendVideo(other, reply.video.file_id, { caption: reply.caption || "" })
          } else if (reply.audio) {
            await conn.sendAudio(other, reply.audio.file_id, { caption: reply.caption || ""})
          } else if (reply.document) {
            await conn.sendDocument(other, reply.document.file_id, { caption: reply.caption || "" })
          } else if (reply.sticker) {
            await conn.sendSticker(other, reply.sticker.file_id)
          } else {
            await conn.sendMessage(other, "⚠️ Jenis pesan ini belum didukung untuk share otomatis.").catch(() => {});
          }

        } else {

          let token
          if (other == room.a) token = room.aToken
          else token = room.bToken

          const bot = new TelegramBot(token, { polling: false });
          const file = await m.download().catch(e => { m.reply(e.message) })

          if (reply.text) {
            await bot.sendMessage(other, reply.text, { parse_mode: "HTML" }).catch(() =>
              bot.sendMessage(other, reply.text)
            );
          } else if (reply.photo) {
            await bot.sendPhoto(other, file, { caption: reply.caption || "" })
          } else if (reply.video) {
            await bot.sendVideo(other, file, { caption: reply.caption || "" })
          } else if (reply.audio) {
            await bot.sendAudio(other, file, { caption: reply.caption || "" })
          } else if (reply.document) {
            await bot.sendDocument(other, file, { caption: reply.caption || "" })
          } else if (reply.sticker) {
            await sendStickerWithExt(bot, other, file, reply.sticker.is_animated); // true kalau .tgs
          } else {
            await bot.sendMessage(other, "⚠️ Jenis pesan ini belum didukung untuk share otomatis.")
          }
        }
      } catch (e) {
        m.reply(e.message)
      }
    }
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}

async function sendStickerWithExt(bot, chatId, buffer, isAnimated = false) {
  const fileName = path.join(process.cwd()+"/tmp", isAnimated ? "sticker.tgs" : "sticker.webp");
  fs.writeFileSync(fileName, buffer);
  await bot.sendSticker(chatId, fs.createReadStream(fileName));
  fs.unlinkSync(fileName);
}