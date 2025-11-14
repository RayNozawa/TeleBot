import fs from 'fs'
import axios from 'axios'

let timeout = 120000

export const run = {
   usage: ['tebakgambar'],
   hidden: ['tgamb'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      Scraper
   }) => {
    conn.game = conn.game ? conn.game: {}
    let id = 'tebakgambar-' + m.chat
    if (id in conn.game) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.game[id][0])
    let src = (await axios.get("https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json")).data
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} XP
Ketik ${isPrefix}hgamb untuk bantuan
`.trim()
    conn.game[id] = [
        await conn.sendButton(m.chat, [{name: "Bantuan💢", command: ".hgamb"}], json.img, 'tebakgambar.jpg', caption, m.msg, env.wm),
        json,
        setTimeout(() => {
            if (conn.game[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.game[id][0])
            delete conn.game[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}