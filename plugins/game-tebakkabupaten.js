import axios from "axios"

let timeout = 120000

export const run = {
   usage: ['tebakkabupaten'],
   hidden: ['tkabupaten'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    conn.tebakkabupaten = conn.tebakkabupaten ? conn.tebakkabupaten : {}
    let id = m.chat
    if (id in conn.tebakkabupaten) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkabupaten[id][0])

    let { data: json } = await axios.get(`${apiUrl}/tebakkabupaten`)

  let caption = `*${command.toUpperCase()}*
Kabupaten apakah ini?
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${isPrefix}hkab untuk bantuan
Bonus: ${env.expgame} XP
    `.trim()
    conn.tebakkabupaten[id] = [
        await conn.sendButton(m.chat, [{name: "Bantuan💢", command: ".hkab"}], json.url, 'tebakkabupaten.jpg', caption, m.msg, env.wm),
        json,
        setTimeout(() => {
            if (conn.tebakkabupaten[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.title}*`, conn.tebakkabupaten[id][0])
            delete conn.tebakkabupaten[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}