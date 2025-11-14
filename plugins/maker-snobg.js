import axios from 'axios'
import sticker from '../lib/sticker.js';
import * as fs from "fs";

export const run = {
   usage: ['snobg'],
   hidden: ['s.nobg'],
   use: "image",
   category: 'maker',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
  let q = m.quoted ? m.quoted : m
  let mime = q.type
  if (!/photo/.test(mime)) return m.reply(`Kirim/reply gambar Dengan caption: ${isPrefix + command}`)
        
  conn.sendChatAction(m.chat, "choose_sticker")

  let media = await q.download()
  let { url } = await uploadHF(media)
  
  try {
    const { data } = await axios.get(`${apiUrl}/removebg?imgUrl=${url}`, { responseType: "arraybuffer" })
    
    const stik = await sticker(data)
    return conn.sendSticker(m.chat, stik)
  } catch (err) {
    try {
      const payload = {
        "image_file_b64": "",
        "image_url": `${url}`,
        "size": "preview",
        "type": "auto",
        "type_level": "1",
        "format": "jpg",
        "roi": "0% 0% 100% 100%",
        "crop": false,
        "crop_margin": "0",
        "scale": "original",
        "position": "original",
        "channels": "rgba",
        "add_shadow": false,
        "semitransparency": true,
        "bg_color": `${text}`,
        "bg_image_url": ""
      }
      
      const res = await axios({
        method: "POST", 
        url: "https://api.remove.bg/v1.0/removebg",
        data: payload,
        headers: {
          "accept": "application/json",
          "X-API-Key": "UgjxxGCBGrEy98UwMwziHLp2",
          "Content-Type": "application/json"
        }
      })
      
      const buffer = Buffer.from(res.data.data.result_b64, "base64")
      const stik = await sticker(buffer)
      return conn.sendSticker(m.chat, stik)
    } catch (err) {
      m.reply(err.message);
    };
  }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}