import sticker from '../lib/sticker.js';
import axios from "axios"

export const run = {
   usage: ['smeme','smemebawah'],
   category: 'maker',
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
    
    const link = await conn.getFileLink(q.msg.photo[q.msg.photo.length - 1].file_id);
 
       let type = (command).toLowerCase()
    
    switch (type) {
        case 'smeme':
        try {
            let [atas, bawah] = text.split`|`
            if (!atas) atas = '   '
            
            let meme = `${apiUrl}/smeme?url=${link}&atas=${atas ? atas : ""}&bawah=${bawah ? bawah : ""}`
            const { data } = await axios.get(meme, { responseType: "arraybuffer" })
            const stik = await sticker(data)
            await conn.sendSticker(m.chat, stik)
        } catch (e) {
            m.reply('Tidak bisa membuat dari sticker, gif, atau video')
        }
        break
        
        case 'smemebawah':
        try {
            let memes = `${apiUrl}/smeme?url=${link}&atas=　&bawah=${bawah ? bawah : ""}`
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