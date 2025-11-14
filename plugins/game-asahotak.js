import axios from "axios"

let timeout = 120000

export const run = {
   usage: ['asahotak'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
    conn.game = conn.game ? conn.game : {}
    let id = 'asahotak-' + m.chat
    if (id in conn.game) return conn.reply(m.chat, 'Masih ada pertanyaan belum terjawab di chat ini', conn.game[id][0])
    const { data: src } = await axios.get("https://raw.githubusercontent.com/BochilTeam/database/master/games/asahotak.json")
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
📄${json.soal}

🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${env.expgame} Exp
Ketik ${isPrefix}hotak untuk bantuan
`.trim()
    conn.game[id] = [
        await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text: "Bantuan💢", callback_data: `${isPrefix}hotak`}]]),
        json,
        setTimeout(() => {
            if (conn.game[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.game[id][0])
            delete conn.game[id]
        }, timeout)
    ]
   },
   error: false,
   cache: true,
   location: __filename
}