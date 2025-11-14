import sticker from '../lib/sticker.js';
import axios from "axios"

export const run = {
   usage: ['wasted','comrade','gay','passed'],
   category: 'maker',
   use: 'image',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = q.type
        if (!/photo/.test(mime)) return m.reply(`Kirim/reply gambar Dengan caption: ${isPrefix + command}`)
        
        conn.sendChatAction(m.chat, 'choose_sticker')
        
        let img = await q.download?.()
        let { url } = await uploadHF(img)

        let wasted = `https://some-random-api.com/canvas/overlay/${command}?avatar=${url}`
        
        const { data } = await axios.get(wasted, { responseType: "arraybuffer" })

        const stik = await sticker(data)
        await conn.sendSticker(m.chat, stik)
        await conn.sendButton(m.chat, donateBtn, wasted, 'wasted.jpg', "`Successfully generated image!`", m.msg, env.wm);
    } catch (e) {
        m.reply('Conversion Failed')
    }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}