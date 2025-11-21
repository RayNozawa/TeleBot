import axios from "axios"

let timeout = 60000

export const run = {
  usage: ['caklontong'],
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
    conn.caklontong = conn.caklontong ? conn.caklontong : {}
    let id = m.chat
    if (id in conn.caklontong) return conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.caklontong[id][0])
    
    const { data: json } = await axios.get(`${apiUrl}/caklontong`)

    let caption = `
📄${json.soal}
🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} Exp
Ketik ${isPrefix}calo untuk bantuan
`.trim()
    conn.caklontong[id] = [
        await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text: "Bantuan💢", callback_data: `${isPrefix}calo`}]]),
        json,
        setTimeout(async () => {
            if (conn.caklontong[id]) await conn.reply(m.chat, `❗Waktu habis!\nJawabannya adalah *${json.jawaban}*\n${json.deskripsi}`, conn.caklontong[id][0])
            delete conn.caklontong[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}