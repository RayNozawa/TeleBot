import axios from "axios"

let timeout = 60000

export const run = {
   usage: ['tebakbola'],
   hidden: ['tbola'],
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
    conn.tebakbola = conn.tebakbola ? conn.tebakbola : {}
    let id = m.chat
    if (id in conn.tebakbola) return conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.tebakbola[id][0])

    const { data: json } = await axios.get(`${apiUrl}/tebakbola`)

    let caption = `
✏️${json.soal}

📄${json.deskripsi}

🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} Exp
Ketik *${isPrefix}hbola* untuk bantuan
`.trim()
    conn.tebakbola[id] = [
        await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text: "Bantuan💢", callback_data: `${isPrefix}hbola`}]]),
        json,
        setTimeout(() => {
            if (conn.tebakbola[id]) conn.reply(m.chat, `❗Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakbola[id][0])
            delete conn.tebakbola[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}