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
   
  let q = m.quoted ? m.quoted : m

  const buffer = await q.download?.();

  if (!buffer) return m.reply('Kirim/reply gambar yang mau diubah!');
  
  conn.sendChatAction(m.chat, 'upload_photo')
  try {
    const { url } = await uploadHF(buffer)
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