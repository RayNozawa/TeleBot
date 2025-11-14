import axios from 'axios';
import FormData from 'form-data';

export const run = {
   usage: ['removebg'],
   hidden: ['rembg'],
   use: 'image',
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
  
  let buffer = await q.download?.();
  if (!buffer) return m.reply('Kirim/reply gambar yang mau diubah!');
  
  conn.sendChatAction(m.chat, 'upload_photo')
  
  const mimetype = 'image/jpeg';
  const ext = '.' + mimetype.split('/')[1];
  const filename = Date.now()+ext

  try {
    const { url } = await uploadHF(buffer)
    const { data } = await axios.get(`${apiUrl}/removebg?imgUrl=${url}`, { responseType: "arraybuffer" })
    await conn.sendButton(m.chat, donateBtn, data, 'pinterest.jpg', '`Successfully Removing Background!`', m.msg, env.wm);
  } catch (e) {
    m.reply("Terjadi Kesalahan: " + e.message)
  }
  },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}