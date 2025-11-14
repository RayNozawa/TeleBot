import similarity from 'similarity'
const threshold = 0.72
export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    let id = 'tebaklagu-' + m.chat
    
    if (m.text == (isPrefix + "hlagu")) {
      let json = JSON.parse(JSON.stringify(conn.game[id][1]))
      return conn.reply(m.chat, `<pre><code class="language-Clue">${json.judul.replace(/[AIUEOaiueo]/ig, '_')}</code></pre>`, m.msg, "HTML")
    }
    
    if (!m.quoted || !m.text || !/Ketik.*hlagu/i.test(m.quoted.text) || /.*hlagu/i.test(m.text))
        return !0
    conn.game = conn.game ? conn.game : {}
    if (!(id in conn.game))
        return m.reply('Soal itu telah berakhir')
    if (m.quoted.id == conn.game[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.game[id][3])
            delete conn.game[id]
            return m.reply('*Yah Menyerah :( !*')
        }
        let json = JSON.parse(JSON.stringify(conn.game[id][1]))
        if (m.text.toLowerCase() == json.judul.toLowerCase().trim()) {
            users.exp += conn.game[id][2]
            await conn.reply(m.chat, 'Kamu Benar ✅', m.msg, "Markdown", [[{ text: 'Mainkan Lagi🎮', callback_data: '.tlagujkt' }]])
            clearTimeout(conn.game[id][3])
            delete conn.game[id]
        } else if (similarity(m.text.toLowerCase(), json.judul.toLowerCase().trim()) >= threshold)
            await m.reply(`*💢Dikit Lagi!*`)
        else
            await m.reply("Salah ❌")
    }
    return !0
  },
  error: false,
  cache: true,
  location: __filename
}