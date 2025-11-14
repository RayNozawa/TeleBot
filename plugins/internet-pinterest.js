import axios from 'axios'
import pinterest from "../lib/pinterest.js"

export const run = {
   usage: ['pinterest'],
   hidden: ['pin'],
   use: 'query',
   category: 'internet',
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
      try {
         if (!text) return conn.reply(m.chat, Func.example(isPrefix, command, env.botname), m.msg)
         conn.sendChatAction(m.chat, 'upload_photo')
         
         let image = await pinterest(text);
         image = image[~~(Math.random() * (image.length))].image
         
         await conn.sendButton(m.chat, donateBtn, image, 'pinterest.jpg', `*Result For:* \`${text}\``, m.msg, env.wm);
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m.msg)
      }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}