import axios from 'axios'

let timeout = 60000

export const run = {
   usage: ['tebakwarna'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    conn.tebakwarna = conn.tebakwarna ? conn.tebakwarna: {}
    let id = 'tebakwarna-' + m.chat
    if (id in conn.tebakwarna) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakwarna[id][0])
    let { data: json } = await axios.get(`${apiUrl}/tebakwarna`)

    let caption = `*[ TEBAK ANGKA WARNA ]*
    
🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} XP
`.trim()
    conn.tebakwarna[id] = [
        await conn.sendButton(m.chat, donateBtn, json.image, 'tebakwarna.jpg', caption, m.msg, env.wm),
        json,
        setTimeout(() => {
            if (conn.tebakwarna[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.correct}*`, conn.tebakwarna[id][0])
            delete conn.tebakwarna[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}