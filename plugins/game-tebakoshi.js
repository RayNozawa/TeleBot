import axios from "axios"

let timeout = 60000

export const run = {
   usage: ['tebakjkt48'],
   hidden: ['tebakoshi','tebakjkt'],
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
    conn.tebakoshi = conn.tebakoshi ? conn.tebakoshi : {}
    let id = m.chat
    if (id in conn.tebakoshi) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakoshi[id][0])

    const { data: json } = await axios.get(`${apiUrl}/tebakmemberjkt48`)

  let caption = `*${command.toUpperCase()}*
  
Hint: ${json.gen}
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${isPrefix}hoshi untuk bantuan
Bonus: ${env.expgame} XP
    `.trim()
    conn.tebakoshi[id] = [
        await conn.sendButton(m.chat, [{name: "Bantuan💢", command: ".hoshi"}], json.gambar, 'tebakoshi.jpg', caption, m.msg, env.wm),
        json.nama,
        setTimeout(() => {
            if (conn.tebakoshi[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.nama}*`, conn.tebakoshi[id][0])
            delete conn.tebakoshi[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  location: __filename
}