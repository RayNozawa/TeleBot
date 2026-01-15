import axios from 'axios';
import FormData from 'form-data';

export const run = {
   usage: ['tofigure'],
   hidden: ['tofigur'],
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
     let mime = q.type
     if (mime == "text") return m.reply(`❗Kirim/Reply Foto Dengan Perintah *${isPrefix+command}*`);
     if (!/photo/.test(mime)) return m.reply(`❗Mime ${mime} tidak support`);
     
     conn.sendChatAction(m.chat, 'upload_photo')
     try {
       const link = await conn.getFileLink(q.msg.photo[q.msg.photo.length - 1].file_id);
       await conn.sendPhoto(m.chat, `${apiUrl}/tofigure?url=${link}`, { caption: "Successfully!", reply_to_message_id: m.msg.message_id });
     } catch (error) {
       return m.reply(`Terjadi kesalahan: ${error.message}`);
     }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}