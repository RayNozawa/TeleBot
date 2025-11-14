import axios from 'axios';
import sticker from '../lib/sticker.js';

export const run = {
  usage: ['sticker'],
  hidden: ['s'],
  use: 'image',
  category: 'tools',
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

    conn.sendChatAction(m.chat, 'choose_sticker')
    if (mime == "photo") {
      try {
        const stik = await sticker(await q.download())
        conn.sendSticker(m.chat, stik, { reply_to_message_id: m.id })
      } catch (e) {
        m.reply('❌ Gagal generate sticker: ' + e.message);
      }
    } else if (mime == "video") {
      try {
        const stik = await sticker(await q.download(), { animated: true })
        await sendAnimatedSticker(conn, m.chat, stik)
      } catch (e) {
        m.reply('❌ Gagal generate sticker: ' + e.message);
      }
    } else {
      return m.reply(`Kirim/reply gambar/video Dengan caption: ${isPrefix + command}`)
    }
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}