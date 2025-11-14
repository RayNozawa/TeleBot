import axios from "axios"

let nyerahBTN = [[{ text: "Menyerah", callback_data: "nyerah" }]]

const winScore = 2750
export const run = {
  usage: ['family100'],
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
    conn.game = conn.game ? conn.game : {}
    let id = 'family100_' + m.chat
    if (id in conn.game) return conn.reply(m.chat, '❗Masih ada kuis yang belum terjawab, ketik *nyerah* jika tidak bisa menjawab', conn.game[id].msg, "Markdown", nyerahBTN)

    let json = (await axios.get("https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json")).data
    json = json[~~(Math.random() * (json.length))]

    const hiddenAnswers = json.jawaban.map(jwb =>
      jwb.replace(/[A-Za-zÀ-ÿ]/g, '-')
    )

    let caption = `
*📄 Soal:* ${json.soal}
📍 Terdapat *${json.jawaban.length}* jawaban${json.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)
` : ''}

🕹 Jawaban:
${hiddenAnswers.map((v, i) => `(${i + 1}) ${v} (${v.length})`).join('\n')}

💥 +750 XP tiap jawaban benar
    `.trim()

    conn.game[id] = {
      id,
      msg: await conn.reply(m.chat, caption, m.msg, "Markdown", nyerahBTN),
      ...json,
      terjawab: Array.from(json.jawaban, () => false),
      winScore,
    }
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}
