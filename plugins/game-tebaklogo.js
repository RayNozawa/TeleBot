import axios from 'axios'

let timeout = 120000

export const run = {
   usage: ['tebaklogo'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    conn.tebaklogo = conn.tebaklogo ? conn.tebaklogo: {}
    let id = 'tebaklogo-' + m.chat
    if (id in conn.tebaklogo) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaklogo[id][0])
    let { data: json } = await axios.get(`${apiUrl}/tebaklogo`)

    let caption = `
🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} XP
Ketik ${isPrefix}hlogo untuk bantuan
`.trim()
    conn.tebaklogo[id] = [
        await conn.sendButton(m.chat, [{name: "Bantuan💢", command: ".hlogo"}], json.image, 'tebaklogo.jpg', caption, m.msg, env.wm),
        json,
        setTimeout(() => {
            if (conn.tebaklogo[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebaklogo[id][0])
            delete conn.tebaklogo[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}