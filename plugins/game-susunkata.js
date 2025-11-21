import axios from "axios"

let timeout = 180000

export const run = {
  usage: ['susunkata'],
  hidden: ['sskata'],
  category: 'game',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
    conn.susunkata = conn.susunkata ? conn.susunkata : {}
    let id = m.chat
    if (id in conn.susunkata) return conn.reply(m.chat, ' *❗Masih Ada Soal Yang Belum Terjawab* ', conn.susunkata[id][0])

    const { data: json } = await axios.get(`${apiUrl}/susunkata`)
    
    const shuffleString = str => [...str].sort(() => Math.random() - 0.5).join('');
    let kataAcak = shuffleString(json.jawaban)
    const addDashes = str => str.split('').join('-');
    
    let caption = `
📄${addDashes(kataAcak)}

Tipe : ${json.tipe}

🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Hadiah Exp: ${env.expgame}
Ketik ${isPrefix}suska untuk bantuan
`.trim()
    conn.susunkata[id] = [
        await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text: "Bantuan💢", callback_data: `${isPrefix}suska`}]]),
        json,
        setTimeout(() => {
            if (conn.susunkata[id]) conn.reply(m.chat, `❗Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.susunkata[id][0])
            delete conn.susunkata[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}