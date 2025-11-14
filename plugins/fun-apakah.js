import sticker from '../lib/sticker.js';
import axios from "axios"

export const run = {
  usage: ['apakah'],
  use: "ask",
  category: 'fun',
  async: async (m, {
    conn,
    text,
    command,
    isPrefix,
    env
  }) => {
   if (!text) return m.reply(`Use example ${isPrefix+command} aku gila?`)

   let img = ['https://telegra.ph/file/a18aa2e3c29d44512c201.png', 'https://telegra.ph/file/3121067bf70eea7220da7.png', 'https://telegra.ph/file/8b8a2e062282edea6a4f2.png', 'https://telegra.ph/file/5a198475117269617c0ad.png', 'https://telegra.ph/file/c44ae0ca8146fa1cc68f7.png', 'https://telegra.ph/file/49e757569ac2ae93ba4a8.png']
   
   const { data } = await axios.get(getRandom(img), { responseType: "arraybuffer" })
   const stik = await sticker(data)
   conn.sendSticker(m.chat, stik).catch(() => {});
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}

function getRandom(media) {
  const randomIndex = Math.floor(Math.random() * media.length);
  return media[randomIndex]
}