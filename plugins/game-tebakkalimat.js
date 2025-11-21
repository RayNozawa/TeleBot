import axios from "axios"

let timeout = 120000

export const run = {
   usage: ['tebakkalimat'],
   hidden: ['tkalimat'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    conn.tebakkalimat = conn.tebakkalimat ? conn.tebakkalimat : {}
    let id = m.chat
    if (id in conn.tebakkalimat) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkalimat[id][0])

    let { data: json } = await axios.get(`${apiUrl}/tebakkalimat`)

    let caption = `
📄${json.soal}

🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} Exp
Ketik ${isPrefix}tkl untuk bantuan
`.trim()
    conn.tebakkalimat[id] = [
        await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text: "Bantuan💢", callback_data: `${isPrefix}tkl`}]]),
        json,
        setTimeout(() => {
           if (conn.tebakkalimat[id]) conn.reply(m.chat, `Waktu Habis!\nJawabannya Adalah: *${json.jawaban}*`, conn.tebakkalimat[id][0])
            delete conn.tebakkalimat[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}