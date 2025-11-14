import axios from 'axios'

export const run = {
   usage: ['ai'],
   hidden: ['shani'],
   use: 'image/text',
   category: 'ai',
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
     if (!text) return m.reply(`Masukkan pertanyaan!`);

     const { message_id } = await m.reply(global.status.wait);
     try {
       const { data } = await axios.get(`${apiUrl}/shani?text=${text}`)
       await conn.editMsg(m.chat, message_id, data.reply, donateBtn, "Markdown")
     } catch (e) {
       m.reply(e.message);
     }
   },
   error: false,
   limit: true,
   restrict: true,
   cache: true,
   location: __filename
}