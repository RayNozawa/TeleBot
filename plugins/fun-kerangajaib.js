import sticker from '../lib/sticker.js';
import axios from "axios"

export const run = {
  usage: ['kerangajaib'],
  hidden: ['kerang','bolehkah'],
  use: "ask",
  category: 'fun',
  async: async (m, {
    conn,
    text,
    command,
    isPrefix,
    env
  }) => {
  if (!text) return m.reply(`Masukkan pertanyaan!\n\nContoh: *${isPrefix}${command} boleh aku mencintainya?*`)

   let img = ['https://telegra.ph/file/ef5f7d74dc2f8ee33db92.png', 'https://telegra.ph/file/1836a88c1a002e5f007c4.png', 'https://telegra.ph/file/109f5634b954263bb13a7.png', 'https://telegra.ph/file/a8ad92a9aff7ba05041cc.png', 'https://telegra.ph/file/b241d7e2eeb4e07bccd67.png', 'https://telegra.ph/file/99db651043c6a06e4a0b7.png', 'https://telegra.ph/file/92fc0be43b6ed52bfd7e4.png']
   const { data } = await axios.get(getRandom(img), { responseType: "arraybuffer" })
   const stik = await sticker(data)
   conn.sendSticker(m.chat, stik).catch(() => {});
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}