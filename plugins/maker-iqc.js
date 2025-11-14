import axios from 'axios';

export const run = {
   usage: ['iqc'],
   use: 'text',
   category: 'maker',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {

  if (!text) return m.reply('Masukkan text!');
  
  try {
    conn.sendChatAction(m.chat, 'upload_photo')
    await conn.sendButton(m.chat, donateBtn, `${apiUrl}/iqc?text=${text}`, 'iqc.jpg', "`Successfully generated image!`\n\n*Text:* " + text, m.msg, env.wm);
  } catch (e) {
    m.reply('❌ Gagal generate gambar: ' + e.message);
  }
},
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}