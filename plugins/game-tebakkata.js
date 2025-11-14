import axios from "axios"

let timeout = 60000

export const run = {
   usage: ['tebakkata'],
   hidden: ['tkata'],
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
    conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
    let id = m.chat
    if (id in conn.tebakkata) return conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.tebakkata[id][0])

    const src = (await axios.get("https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json")).data
    const json = src[Math.floor(Math.random() * src.length)]
        
    let caption = `
📄${json.soal}
🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} Exp
Ketik *${isPrefix}teka* untuk bantuan
`.trim()
    conn.tebakkata[id] = [
        await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text: "Bantuan💢", callback_data: `${isPrefix}teka`}]]),
        json,
        setTimeout(() => {
            if (conn.tebakkata[id]) conn.reply(m.chat, `❗Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakkata[id][0])
            delete conn.tebakkata[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}