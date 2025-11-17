import sticker from '../lib/sticker.js';
import axios from "axios"

export const run = {
   usage: ['smeme','smemebawah'],
   category: 'sticker',
   use: 'text',
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
    if (!/photo/.test(mime) || !text) return m.reply(`Kirim/reply gambar dan masukkan text, contoh: \n\n*${isPrefix + command} Siapa sangka*\n*${isPrefix+command} Aduhh|Keluar dikit jir*`)

    conn.sendChatAction(m.chat, "choose_sticker")
    
    let img = await q.download()
    let { url: link } = await uploadHF(img)
    let type = (command).toLowerCase()
    
    switch (type) {
        case 'smeme':
        try {
            let [atas, bawah] = text.split`|`
            if (!atas) atas = '   '
            
            let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas ? atas : '')}/${encodeURIComponent(bawah ? bawah : '')}.png?background=${link}`
            const { data } = await axios.get(meme, { responseType: "arraybuffer" })
            const stik = await sticker(data)
            await conn.sendSticker(m.chat, stik)
        } catch (e) {
            m.reply('Tidak bisa membuat dari sticker, gif, atau video')
        }
        break
        
        case 'smemebawah':
        try {
            let memes = `https://api.memegen.link/images/custom/　/${encodeURIComponent(text)}.png?background=${link}`
            const { data } = await axios.get(memes, { responseType: "arraybuffer" })
            const stik = await sticker(data)
            await conn.sendSticker(m.chat, stik)
        } catch (e) {
            m.reply('Tidak bisa membuat dari sticker atau video')
        }
        break
    }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}
