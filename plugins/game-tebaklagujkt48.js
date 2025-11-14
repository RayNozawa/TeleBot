import axios from "axios"

let timeout = 100000
let poin = 5250

export const run = {
   usage: ['tebaklagujkt48'],
   hidden: ['tlagujkt','tebaklagujkt48'],
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
    conn.game = conn.game ? conn.game : {}
    let id = 'tebaklagu-' + m.chat
    if (id in conn.game) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.game[id][0])
    let json = (await axios.get(`${apiUrl}/tebaklagujkt48`)).data

    let caption = `
🕑Waktu Habis *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${poin} Exp
Ketik ${isPrefix}hlagu untuk bantuan
`.trim()
            conn.game[id] = [
                await conn.sendButton(m.chat, [{name: "Bantuan💢", command: ".hlagu"}], json.link, 'Tebak Lagu JKT48.mp3', caption, m.msg, env.wm),
                json, poin,
                setTimeout(() => {
                    if (conn.game[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.judul}*`, conn.game[id][0])
                    delete conn.game[id]
                }, timeout)
            ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}