import axios from 'axios'
import FormData from 'form-data';
import fs from 'fs'
import { fileTypeFromBuffer } from 'file-type';

export const run = {
   usage: ['tourl'],
   hidden: ['upload'],
   use: 'file',
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
     let q = m.quoted ? m.quoted : m
     let buffer = await q.download?.();
     
     let { data: list } = await axios.get(`${apiUrl}/uploader/list`)
     
     let capt = 'Kirim/reply media\n\nPilihan uploader:\n'
     capt += list.map((item, index) => `${index + 1}. ${item}`).join('\n')
     capt += `\n\nContoh: *${isPrefix+command} 1*`
     
     if (!text || !buffer) {
       upload(buffer, `${apiName}/cloud`).then(result => { m.reply(Object.entries(result).map(([key, val]) => `*${key}*: ${val}`).join('\n')) }).catch(e => { console.log(e.message) });
       return m.reply(capt);
     }
     
     conn.sendChatAction(m.chat, 'upload_document')
     if (text >= 1 && text <= list.length) {
       let type = list[text - 1];
       try {
         let result = await upload(buffer, type)
         result = Object.entries(result).map(([key, val]) => `*${key}*: ${val}`).join('\n');
         m.reply(result)
       } catch (e) {
         m.reply("Terjadi kesalahan: " + e.message)
       }
     } else {
       return m.reply("Pilihan tidak valid");
     }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}

async function upload(buffer, type) {
  try {
    
    let mime, ext
    try {
      ({ mime, ext } = await fileTypeFromBuffer(buffer))
    } catch (e) {
      mime = "text/html", ext = ".html"
    }
    
    const form = new FormData();
    form.append('file', buffer, { filename: `${Date.now()}.${ext}`, contentType: mime });
    form.append('uploader', type);

    const response = await axios.post(`${apiUrl}/uploader`, form, {
      headers: form.getHeaders()
    });

    return response.data
  } catch (err) {
    return err.response?.data || err.message
  }
}