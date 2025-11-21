import axios from "axios"

let timeout = 120000

export const run = {
   usage: ['tekateki'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {}
    let id = m.chat
    if (id in conn.tekateki) return conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.tekateki[id][0])

    let { data: json } = await axios.get(`${apiUrl}/tekateki`)

    let caption = `
📄${json.soal}

🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} Exp
Ketik ${isPrefix}htek untuk bantuan
`.trim()
    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text: "Bantuan💢", callback_data: `${isPrefix}htek`}]]),
        json,
        setTimeout(() => {
            if (conn.tekateki[id]) conn.reply(m.chat, `❗Waktu Habis!\nJawabannya Adalah *${json.jawaban}*`, conn.tekateki[id][0])
            delete conn.tekateki[id]
        }, timeout)
    ]
  },
  error: false,
  cache: true,
  location: __filename
}