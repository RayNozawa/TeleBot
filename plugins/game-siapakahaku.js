import axios from "axios"

let timeout = 60000

export const run = {
  usage: ['siapakahaku'],
  hidden: ['siapa','whome'],
  category: 'game',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
    conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {}
    let id = m.chat
    if (id in conn.siapakahaku) return conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.siapakahaku[id][0])
    let { data: src } = await axios.get("https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json")
    const json = src[Math.floor(Math.random() * src.length)]
        
    let caption = `
❓Siapakah aku? ${json.soal}

🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} Exp
Ketik ${isPrefix}who untuk bantuan
`.trim()
    conn.siapakahaku[id] = [
        await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text: "Bantuan💢", callback_data: `${isPrefix}who`}]]),
        json,
        setTimeout(() => {
            if (conn.siapakahaku[id]) conn.reply(m.chat, `❗Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.siapakahaku[id][0])
            delete conn.siapakahaku[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}