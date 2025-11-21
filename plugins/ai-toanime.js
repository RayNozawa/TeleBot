import axios from 'axios';

export const run = {
  usage: ['toanime'],
  hidden: ['jadianime'],
  use: 'image',
  category: 'ai',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    env
  }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = q.type

  if (!/photo/.test(mime)) return m.reply('Kirim/reply gambarnya!.')
  
  conn.sendChatAction(m.chat, "upload_photo")
  let media = await q.download();
  
  try {
    const url = await conn.getFileLink(m.quoted.msg.photo[m.quoted.msg.photo.length - 1].file_id);
    await conn.sendButton(m.chat, donateBtn, `${apiUrl}/toanime?url=${url}`, 'toanime.jpg', "`Successfully generated image!`", m.msg, env.wm);
  } catch (e) {
    console.log(e.message)
  }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}