import axios from 'axios';
import sticker from '../lib/sticker.js';

export const run = {
   usage: ['brat','bratvid'],
   hidden: ['bratgif","bratv2","brat2'],
   use: 'text',
   category: 'maker',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env,
      args
   }) => {
  if (!text) return m.reply('Masukkan text!');
  
  conn.sendChatAction(m.chat, 'choose_sticker')
  if (command !== "brat") {
    try {
      const { data } = await axios.get(`${apiUrl}/bratgif?text=${encodeURIComponent(!text.includes(" ") ? " " + text : text)}`, { responseType: "arraybuffer" })
      const stik = await sticker(data, { animated: true })
      await sendAnimatedSticker(conn, m.chat, stik)
    } catch (e) {
      m.reply(e.message)
    }
  } else {
    try {
      const { data } = await axios.get(`${apiUrl}/brat?text=${text}`, { responseType: "arraybuffer" })
      const stik = await sticker(data)
      conn.sendSticker(m.chat, stik).catch(() => {});
      conn.sendPhoto(m.chat, data, { caption: '`Successfully generated brat!`', parse_mode: "Markdown" }).catch(() => {});
    } catch (e) {
      m.reply('❌ Gagal generate gambar: ' + e.message);
    }
  }
  },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}