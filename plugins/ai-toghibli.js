import axios from 'axios';
import { randomUUID, randomBytes  } from 'crypto';
import FormData from 'form-data';
  
export const run = {
   usage: ['toghibli'],
   use: 'image',
   category: 'ai',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = q.type;
  if (!/photo/g.test(mime)) return m.reply(`Reply Gambar Dengan Perintah\n\n${isPrefix + command}`)

  conn.sendChatAction(m.chat, 'upload_photo')
  try {
    const url = await conn.getFileLink(q.msg.photo[q.msg.photo.length - 1].file_id);
    await conn.sendButton(m.chat, donateBtn, `${apiUrl}/toghibli?prompt=Ghibli%20Studio%20style,%20charming%20hand-drawn%20anime-style%20illustration&imgUrl=${url}`, 'pinterest.jpg', "`Successfully generated image!`\n\n*Prompt:* " + prompt, m.msg, env.wm);
  } catch (err) {
    const detail = err.response?.data || err.message;
    m.reply('❌ Error: ' + JSON.stringify(detail, null, 2));
  }
},
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}