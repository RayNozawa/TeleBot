import similarity from 'similarity'
const threshold = 0.72
export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    let id = m.chat
    
    if (m.text == (isPrefix + "hoshi")) {
      let oshi = JSON.parse(JSON.stringify(conn.tebakoshi[id][1]))
      return conn.reply(m.chat, `<pre><code class="language-Clue">${oshi.replace(/[AIUEOaiueo]/ig, '_')}</code></pre>`, m.msg, "HTML")
    }
    
    if (!m.quoted || !m.text || !/Ketik.*hoshi/i.test(m.quoted.text) || /.*hoshi/i.test(m.text)) return !0
    conn.tebakoshi = conn.tebakoshi ? conn.tebakoshi : {}
    if (!(id in conn.tebakoshi))
        return conn.reply(m.chat, 'Soal itu telah berakhir', m)
    if (m.quoted.id == conn.tebakoshi[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.tebakoshi[id][2])
            delete conn.tebakoshi[id]
            return conn.reply(m.chat, '*Yah Menyerah :( !*', m)
        }
        let oshi = JSON.parse(JSON.stringify(conn.tebakoshi[id][1]))
        if (m.text.toLowerCase() == oshi.toLowerCase().trim()) {
            users.exp += env.expgame
            let caption = `🎉 *Kamu Benar!*\n+${env.expgame} Exp`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{ text: 'Mainkan Lagi🎮', callback_data: '.tebakgambar' }]])
            clearTimeout(conn.tebakoshi[id][2])
            delete conn.tebakoshi[id]
        } else if (similarity(m.text.toLowerCase(), oshi.toLowerCase().trim()) >= threshold)
            m.reply(`*Dikit Lagi!*`)
        else
            await m.reply('Salah ❌')
    }
    return !0
  },
  error: false,
  cache: true,
  location: __filename
}