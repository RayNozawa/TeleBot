import similarity from 'similarity'
const threshold = 0.72
export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    let id = m.chat

    if (m.text == (isPrefix + "teka")) {
      let json = JSON.parse(JSON.stringify(conn.tebakkata[id][1]))
      return conn.reply(m.chat, `<pre><code class="language-Clue">${json.jawaban.replace(/[AIUEOaiueo]/ig, '_')}</code></pre>`, m.msg, "HTML")
    }
    
    if (!m.quoted || !m.text || !/Ketik.*(teka|hint)/i.test(m.quoted.text) || /.*(teka|hint)/i.test(m.text)) return !0

    conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}

    if (!(id in conn.tebakkata)) return conn.reply(m.chat, '❗Soal itu telah berakhir', m.msg)
    
    if (m.quoted.id == conn.tebakkata[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.tebakkata[id][2])
            delete conn.tebakkata[id]
            return conn.reply(m.chat, '*Menyerah!*\nTebakkata Dihapus🗑️', m.msg)
        }
        let json = JSON.parse(JSON.stringify(conn.tebakkata[id][1]))

        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            users.exp += env.expgame
            let caption = `🎉 *Kamu Benar!*\n+${env.expgame} Exp`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text:"Mainkan Lagi🎮", callback_data: ".tebakkata"}]])
            clearTimeout(conn.tebakkata[id][2])
            delete conn.tebakkata[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply('*Dikit lagi!*')
        else return m.reply('Salah ❌')
    }
    return !0
  },
  error: false,
  cache: true,
  location: __filename
}