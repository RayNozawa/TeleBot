import axios from 'axios'

let timeout = 120000

export const run = {
   usage: ['tebakgame'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    conn.tebakgame = conn.tebakgame ? conn.tebakgame: {}
    let id = 'tebakgame-' + m.chat
    if (id in conn.tebakgame) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakgame[id][0])
    let { data: json } = await axios.get(`${apiUrl}/tebakgame`)

    let caption = `
🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} XP
Ketik ${isPrefix}hgame untuk bantuan
`.trim()
    conn.tebakgame[id] = [
        await conn.sendButton(m.chat, [{name: "Bantuan💢", command: ".hgame"}], json.img, 'tebakgame.jpg', caption, m.msg, env.wm),
        json,
        setTimeout(() => {
            if (conn.tebakgame[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakgame[id][0])
            delete conn.tebakgame[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}