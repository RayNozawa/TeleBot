import axios from "axios";

export const run = {
   usage: ['hd'],
   use: 'image',
   hidden: ['remini','enhance'],
   category: 'tools',
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
      let q = m.quoted ? m.quoted : m;
      let mime = q.type
      if (mime == "text") return m.reply(`❗Kirim/Reply Foto Dengan Perintah *${isPrefix+command}*`);
      if (!/photo/.test(mime)) return m.reply(`❗Mime ${mime} tidak support`);

      conn.sendChatAction(m.chat, 'upload_photo')
      let img = await q.download();
      const imghf = (await uploadHF(img)).url

      try {
        await conn.sendButton(m.chat, donateBtn, `${apiUrl}/enhance?url=${imghf}`, 'enhance.jpg', `*Successfully enhance image!*`, m.msg, env.wm);
      } catch (e) {
        m.reply("*Result :* Failed❗\n\n" + e.message);
      }
      
    },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}