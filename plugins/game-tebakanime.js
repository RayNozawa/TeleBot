import axios from 'axios'

let timeout = 120000

export const run = {
   usage: ['tebakanime'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    conn.tebakanime = conn.tebakanime ? conn.tebakanime: {}
    let id = 'tebakanime-' + m.chat
    if (id in conn.tebakanime) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakanime[id][0])
    let { data: json } = await axios.get(`${apiUrl}/tebakanime`)

    let caption = `
🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} XP
Ketik ${isPrefix}hnim untuk bantuan
`.trim()
    conn.tebakanime[id] = [
        await conn.sendButton(m.chat, [{name: "Bantuan💢", command: ".hnim"}], json.img, 'tebakanime.jpg', caption, m.msg, env.wm),
        json,
        setTimeout(() => {
            if (conn.tebakanime[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakanime[id][0])
            delete conn.tebakanime[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}