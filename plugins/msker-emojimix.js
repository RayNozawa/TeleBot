import fetch from 'node-fetch'
import sticker from '../lib/sticker.js';
import axios from "axios"

export const run = {
   usage: ['emojimix'],
   category: 'maker',
   use: 'emoji',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
    if (!text || !text.includes('+')) return m.reply(`Penggunaan: ${isPrefix + command} emoji1+emoji2\n\nContoh: *${isPrefix + command} 😅+🤔*`)
    let [l, r] = text.split`+`
    
    conn.sendChatAction(m.chat, "choose_sticker")
    
    if (!l || !r) return m.reply('emoji1 dan emoji2 tidak boleh kosong')
    const res = await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(l)}_${encodeURIComponent(r)}`)

    let json = await res.json()
    if (!json.results) throw new Error('Error!')
    
    try {
        const { data } = await axios.get(json.results[0].url, { responseType: "arraybuffer" })
        const stik = await sticker(data)
        await conn.sendSticker(m.chat, stik)
    } catch (e) {
        console.log(e)
        m.reply('Emoji tidak bisa digunakan')
    }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}