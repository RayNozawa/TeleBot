import axios from 'axios'
import { ytmp3 } from "../lib/ytscraper.js"

export const run = {
   usage: ['ytmp3'],
   hidden: ['ytmusic','ytmusik'],
   use: 'url',
   category: 'downloader',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      Scraper
   }) => {
    const urg = text ? text : m.quoted?.text ? m.quoted.text : text;
    if (!urg) return m.reply(`✳️ Contoh :\n${isPrefix + command} https://youtube.com/watch?v=hIvYeNQYvmk`);
    if (!urg.match(/https/gi)) return m.reply(`⚠️ Masukkan URL YouTube!`);
        
    const urlRegex = /(https?:\/\/[^\s`]+)/g;
    const match = urg.match(urlRegex);
    const url = match[0];
    
      conn.sendChatAction(m.chat, 'record_audio')
      let id = null
      
    let capt, vid
    if (url.includes("https")) {
      try {
      let { result: api } = (await axios.get(`https://ochinpo-helper.hf.space/yt?query=${url}`)).data 
      vid = { title: api.title, desc: api.description, views: api.views, upload: api.uploadDate, channel: api.author.name, timestamp: api.timestamp, thumbnail: api.thumbnail }
      capt = `\n\n*📌Judul* : ${vid.title}\n*👤Channel* : ${vid.channel}\n*🎥Durasi* : ${vid.timestamp}\n*👀Views* : ${vid.views.toLocaleString("id-ID")}\n*📅Upload* : ${vid.upload}\n*✍🏻Deskripsi* : ${vid.desc}\n\n`
    } catch (e) {
      capt = '\n\n'
    }
  }
         
      try {
        let caption = `乂  Y T - P L A Y  乂\n\n`
        caption += vid?.title ? `◦ Title : ${vid.title}\n` : ""
        caption += vid?.channel ? `◦ Author : ${vid.channel}\n` : ""
        caption += vid?.timestamp ? `◦ Duration : ${vid.timestamp}\n` : ""
        caption += vid?.views ? `◦ Views : ${vid.views.toLocaleString("id-ID")}\n` : ""
        caption += vid?.upload ? `◦ Upload : ${vid.upload}\n` : ""
        caption += vid?.desc ? `◦ Desc : ${vid.desc}\n\n` : ""
          
        let { message_id } = await conn.sendFile(m.chat, vid.thumbnail, "image.jpg", caption, m.msg)
        id = message_id
          
        const { download } = await ytmp3(url)

        await conn.sendButton(m.chat, donateBtn, download.url, vid.title+'.mp3', '', m.msg, env.wm);
      } catch {
        try {
          await conn.sendButton(m.chat, donateBtn, `${apiUrl}/ytmp3?url=${url}`, vid.title+'.mp3', '', m.msg, env.wm);
        } catch (e) {
          console.error(e)
          await conn.deleteMessage(m.chat, id)
          await m.reply("Mencoba Api 2")
          
          try {
            let { data } = await axios.get(`${apiUrl}/ytplayfast?query=${url}&limit=1&jsonType=simple`)
            await conn.sendButton(m.chat, donateBtn, data[0].downloadUrl, data[0].title+'.mp3', '', m.msg, env.wm);
          } catch (e) {
            conn.reply(m.chat, Func.jsonFormat(e), m.msg)
          }
        }
      }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}