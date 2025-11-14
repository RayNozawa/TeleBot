import similarity from 'similarity'
const threshold = 0.72

export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner }) => {
    conn.game = conn.game ? conn.game : {}
    let id = 'family100_' + m.chat
    if (!(id in conn.game))
      return !0
    let room = conn.game[id]
    let text = m.text.toLowerCase().replace(/[^\w\s\-]+/, '')
    let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)

    if (!isSurrender) {
      if (users.exp < 2000) return m.reply(`✳️ Anda tidak memiliki cukup Exp`)
      let index = room.jawaban.indexOf(text)

      if (index < 0) {
        if (Math.max(...room.jawaban
          .filter((_, index) => !room.terjawab[index])
          .map(jawaban => similarity(jawaban, text))
        ) >= threshold)
          m.reply('💢 Dikit lagi!')
        return !0
      }

      if (room.terjawab[index]) return !0

      room.terjawab[index] = m.username
      users.exp += room.winScore
    }

    let isWin = room.terjawab.length === room.terjawab.filter(v => v).length

    const displayAnswers = room.jawaban.map((jawaban, index) => {
      if (isSurrender || room.terjawab[index]) {
        return `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index] : ''}`.trim()
      } else {
        const hidden = jawaban.replace(/[A-Za-zÀ-ÿ]/g, '-')
        return `(${index + 1}) ${hidden} (${hidden.length})`
      }
    }).join('\n')

    let caption = `
*📄 Soal:* ${room.soal}
📍 Terdapat *${room.jawaban.length}* jawaban${room.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)
` : ''}
${isWin ? `*SEMUA JAWABAN TERJAWAB 🎉*` : isSurrender ? '*MENYERAH! -2000 XP*' : ''}

${displayAnswers}

${isSurrender ? '' : `💥 +750 XP tiap jawaban benar`}
    `.trim()
        
    let nyerahBTN
    if (isWin || isSurrender) {
      nyerahBTN = [[{ text: "Mainkan Lagi🎮", callback_data: "/family100" }]]
      delete conn.game[id]
    } else {
      nyerahBTN = [[{ text: "Menyerah", callback_data: "nyerah" }]]
    }
    
    users.exp -= 2000
    const msg = await conn.reply(m.chat, caption, m.msg, "Markdown", nyerahBTN)
    room.msg = msg

  },
  error: false,
  cache: true,
  location: __filename
}
