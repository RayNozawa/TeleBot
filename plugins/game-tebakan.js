import axios from "axios"

let timeout = 120000

export const run = {
  usage: ['tebaktebakan'],
  hidden: ['ttebakan'],
  category: 'game',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
    conn.tebaktebakan = conn.tebaktebakan ? conn.tebaktebakan : {}
    let id = m.chat
    if (id in conn.tebaktebakan) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaktebakan[id][0])

    const { data: json } = await axios.get(`${apiUrl}/tebaktebakan`)
    
  let caption = `
📄${json.soal}
🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} XP
Ketik ${isPrefix}hteb untuk bantuan
`.trim()
    conn.tebaktebakan[id] = [
        await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text: "Bantuan💢", callback_data: `${isPrefix}hteb`}]]),
        json,
        setTimeout(() => {
            if (conn.tebaktebakan[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebaktebakan[id][0])
            delete conn.tebaktebakan[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}