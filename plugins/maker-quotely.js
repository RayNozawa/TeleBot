import sticker from '../lib/sticker.js';
import axios from 'axios'
import { webp2png } from '../lib/webp2mp4.js';

export const run = {
   usage: ['quotely'],
   hidden: ['qc'],
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
  if (!text) return m.reply(`Masukkan Teks\nContoh: ${isPrefix + command} what the hell\n\n*Kamu juga bisa reply teks, stiker dan foto*`);
  conn.sendChatAction(m.chat, 'choose_sticker')
  let pp = await getPpUser(conn, m.sender)
  const { data } = await axios.get(pp, { responseType: "arraybuffer" })
  pp = (await uploadHF(data)).url
  
  let name = `${m.msg.from.first_name} ${m.msg.from.last_name ? m.msg.from.last_name : ''}`

  let q = m.quoted ? m.quoted : m
  let mime = q.type || '';
 
  try {
    let img = await q.download();
    let up;
    if (/sticker/g.test(mime)) {
      up = await webp2png(img);
    } else if (/photo/g.test(mime)) {
      up = (await uploadHF(img)).url
    } else ''

    let obj = {
      "type": "quote",
      "format": "png",
      "backgroundColor": "#ffffff",
      "width": 512,
      "height": 768,
      "scale": 2,
      "messages": [{
        "entities": [],
        "media": { "url": up },
        "avatar": true,
        "from": {
          "id": 1,
          "name": name,
          "photo": { "url": pp }
        },
        "text": text,
        "replyMessage": {}
      }]
    };

   const json = await axios.post(`${apiUrl}/quotely`, obj, {
      headers: {
         'Content-Type': 'application/json'
      }
   })
    const buffer = Buffer.from(json.data.result.image, 'base64')
    console.log(buffer)
    const stik = await sticker(buffer)
    return conn.sendSticker(m.chat, stik).catch(() => {});
    } catch (e) {
    console.log(e.message)
    try {
    let objj = {
      "type": "quote",
      "format": "png",
      "backgroundColor": "#ffffff",
      "width": 512,
      "height": 768,
      "scale": 2,
      "messages": [{
        "entities": [],
        "avatar": true,
        "from": {
          "id": 1,
          "name": name,
          "photo": { "url": pp }
        },
        "text": text,
        "replyMessage": {
          "name": `${m.quoted.msg.from.first_name} ${m.quoted.msg.from?.last_name ? m.quoted.msg.from.last_name : ''}`,
          "text": m.quoted.text || '',
          "chatId": m.chat,
        }
      }]
    };
    
    const json1 = await axios.post(`${apiUrl}/quotely`, objj, {
      headers: {
         'Content-Type': 'application/json'
      }
   })
   
    const bufferr = Buffer.from(json1.data.result.image, 'base64')
    console.log(bufferr)
    const stik = await sticker(bufferr)
    return conn.sendSticker(m.chat, stik).catch(() => {});

    } catch (e) {
    console.log(e.message)
    try {
        let obj2 = {
      "type": "quote",
      "format": "png",
      "backgroundColor": "#000000",
      "width": 512,
      "height": 768,
      "scale": 2,
      "messages": [{
        "entities": [],
        "avatar": true,
        "from": {
          "id": 1,
          "name": name,
          "photo": { "url": pp }
        },
        "text": text,
        "replyMessage": {}
      }]
    };

   const jsonx = await axios.post(`${apiUrl}/quotely`, obj2, {
      headers: {
         'Content-Type': 'application/json'
      }
   })
   const bufferi = Buffer.from(jsonx.data.result.image, 'base64')   
    console.log(bufferi)
    const stik = await sticker(bufferi)
    return conn.sendSticker(m.chat, stik).catch(() => {});
    } catch (e) {
    m.reply('Gagal ❌\n\n' + e.message)
    }}
  }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}