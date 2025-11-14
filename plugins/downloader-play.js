import axios from 'axios'
import yts from "yt-search"
import { ytmp3 } from "../lib/ytscraper.js"

export const run = {
   usage: ['play'],
   hidden: ['music','musik','lagu','ytplay'],
   use: 'query',
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
      if (!text) return conn.reply(m.chat, Func.example(isPrefix, command, 'Sebagian Besar Kenangan'), m.msg)

      conn.sendChatAction(m.chat, 'record_audio')
      let id = null
      
      let res = await yts(text);
      let vid = res.videos[0];
         
      try {
        let caption = `乂  Y T - P L A Y  乂\n\n`
        caption += vid?.title ? `◦ Title : ${vid.title}\n` : ""
        caption += vid?.author?.name ? `◦ Author : ${vid.author.name}\n` : ""
        caption += vid?.duration?.timestamp ? `◦ Duration : ${vid.duration.timestamp}\n` : ""
        caption += vid?.views ? `◦ Views : ${vid.views.toLocaleString("id-ID")}\n` : ""
        caption += vid?.published ? `◦ Upload : ${vid.ago}\n` : ""
        caption += vid?.description ? `◦ Desc : ${vid.description}\n\n` : ""
          
        let { message_id } = await conn.sendFile(m.chat, vid.thumbnail, "image.jpg", caption, m.msg)
        id = message_id
          
        const { download } = await ytmp3(vid.url)

        await conn.sendButton(m.chat, donateBtn, download.url, vid.title+'.mp3', '', m.msg, env.wm);
      } catch {
        try {
          await conn.sendButton(m.chat, donateBtn, `${apiUrl}/ytmp3?url=${vid.url}`, vid.title+'.mp3', '', m.msg, env.wm);
        } catch (e) {
          console.error(e)
          await conn.deleteMessage(m.chat, id)
          await m.reply("Mencoba Api 2")
          
          try {
            let { data } = await axios.get(`${apiUrl}/ytplayfast?query=${text}&limit=1&jsonType=simple`)
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