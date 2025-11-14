import fetch from 'node-fetch';
import axios from 'axios';
import { ytmp4 } from "../lib/ytscraper.js"

export const run = {
   usage: ['ytmp4'],
   hidden: ['yt','ytdl','ytvideo'],
   use: 'link',
   category: 'downloader',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
    const urg = text ? text : m.quoted?.text ? m.quoted.text : text;
    if (!urg) return m.reply(`✳️ Contoh :\n${isPrefix + command} https://youtube.com/watch?v=hIvYeNQYvmk`);
    if (!urg.match(/https/gi)) return m.reply(`⚠️ Masukkan URL YouTube!`);
        
    const urlRegex = /(https?:\/\/[^\s`]+)/g;
    const match = urg.match(urlRegex);
    const url = match[0];
    
    conn.sendChatAction(m.chat, 'record_video')
    
    let capt
    if (url.includes("https")) {
      try {
      let { result: api } = (await axios.get(`https://ochinpo-helper.hf.space/yt?query=${url}`)).data 
      let vid = { title: api.title, desc: api.description, views: api.views, upload: api.uploadDate, channel: api.author.name, timestamp: api.timestamp }
      capt = `\n\n*📌Judul* : ${vid.title}\n*👤Channel* : ${vid.channel}\n*🎥Durasi* : ${vid.timestamp}\n*👀Views* : ${vid.views.toLocaleString("id-ID")}\n*📅Upload* : ${vid.upload}\n*✍🏻Deskripsi* : ${vid.desc}\n\n`
    } catch (e) {
      capt = '\n\n'
    }
  }

  if (!url.match(/youtu/gi)) return m.reply(`❎ Link yang Anda masukkan bukan berasal dari YouTube`);

    try {
      let { download } = await ytmp4(url)

      await conn.sendFile(m.chat, download.url, "yt.mp4", '*YouTube DL | SaveTube*'+capt+wm, m.msg)
    } catch (e) {
      console.log(e.message)
      try {
        const { data } = await axios.get(`${apiUrl}/oceansaver?url=${url}&type=360`)
        if (!data.download_url) throw new Error("Gagal mendownload!")
        
        await conn.sendFile(m.chat, data.download_url, "yt.mp4", '*YouTube DL | OceanSaver*'+capt+wm, m.msg)
      } catch (e) {
        return m.reply('Terjadi kesalahan saat mendownload atau API tidak merespons dengan JSON valid: ' + e.message);
      }
    }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}