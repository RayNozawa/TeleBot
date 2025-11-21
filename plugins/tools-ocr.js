import {
    webp2png
} from '../lib/webp2mp4.js'
import fetch from 'node-fetch'

export const run = {
  usage: ['ocr'],
  use: 'image',
  category: 'tools',
  async: async (m, { conn, text, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = q.type;
    if (!/photo/g.test(mime)) return m.reply(`Reply Gambar Dengan Perintah\n\n${isPrefix + command}`)

    conn.sendChatAction(m.chat, 'find_location')
    
    const url = await conn.getFileLink(q.msg.photo[q.msg.photo.length - 1].file_id);

    try {
        let res
        if (text) {
            res = await (await fetch("https://api.ocr.space/parse/imageurl?apikey=helloworld&url=" + url + "&language=" + text)).json()
        } else {
            res = await (await fetch("https://api.ocr.space/parse/imageurl?apikey=helloworld&url=" + url)).json()
        }
        await m.reply(res.ParsedResults[0].ParsedText)
    } catch (e) {
        return m.reply(e.message)
    }
  },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}