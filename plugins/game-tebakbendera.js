import axios from 'axios'

let timeout = 120000

export const run = {
  usage: ['tebakbendera'],
  hidden: ['tebaknegara','tnegara','tbendera','tben','tneg'],
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
    conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
    let id = m.chat
    if (id in conn.tebakbendera) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakbendera[id][0])

    let { data: src } = await axios.get('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakbendera2.json')
    let json = src[Math.floor(Math.random() * src.length)]

    let caption = `*${command.toUpperCase()}*
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${isPrefix}hben untuk bantuan
Bonus: ${env.expgame} Exp
    `.trim()
    conn.tebakbendera[id] = [
        await conn.sendButton(m.chat, [{name: "Bantuan💢", command: ".hben"}], json.img, 'tebakbendera.jpg', caption, m.msg, env.wm),
        json,
        setTimeout(() => {
            if (conn.tebakbendera[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.name}*`, conn.tebakbendera[id][0])
            delete conn.tebakbendera[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}