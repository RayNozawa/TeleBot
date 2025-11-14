import axios from "axios"

let timeout = 120000

export const run = {
   usage: ['tebakkimia'],
   hidden: ['tkimia'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    conn.tebakkimia = conn.tebakkimia ? conn.tebakkimia : {}
    let id = m.chat
    if (id in conn.tebakkimia) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkimia[id][0])

    const { data: src } = await axios.get("https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkimia.json")
    const json = src[Math.floor(Math.random() * src.length)]
        
  let caption = `*${command.toUpperCase()}*\nLambang: *${json.unsur}*

Timeout *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${env.expgame} XP
Ketik *${isPrefix}hkim* untuk bantuan
    `.trim()
    conn.tebakkimia[id] = [
        await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text: "Bantuan💢", callback_data: `${isPrefix}hkim`}]]),
        json,
        setTimeout(() => {
            if (conn.tebakkimia[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.lambang}*`, conn.tebakkimia[id][0])
            delete conn.tebakkimia[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}