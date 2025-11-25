import axios from 'axios'

let timeout = 120000

export const run = {
   usage: ['tebakkartun'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    conn.tebakkartun = conn.tebakkartun ? conn.tebakkartun: {}
    let id = 'tebakkartun-' + m.chat
    if (id in conn.tebakkartun) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkartun[id][0])
    let { data: json } = await axios.get(`${apiUrl}/tebakkartun`)

    let caption = `
🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} XP
Ketik ${isPrefix}hkar untuk bantuan
`.trim()
    conn.tebakkartun[id] = [
        await conn.sendButton(m.chat, [{name: "Bantuan💢", command: ".hkar"}], json.img, 'tebakkartun.jpg', caption, m.msg, env.wm),
        json,
        setTimeout(() => {
            if (conn.tebakkartun[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.name}*`, conn.tebakkartun[id][0])
            delete conn.tebakkartun[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}