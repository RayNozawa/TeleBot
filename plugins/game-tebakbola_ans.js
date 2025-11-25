import similarity from 'similarity'
const threshold = 0.72
export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    conn.tebakbola = conn.tebakbola ? conn.tebakbola : {}
    
    let id = m.chat
    let json = JSON.parse(JSON.stringify(conn.tebakbola[id]?.[1] || {}))
    
    if (!json.jawaban) return
    
    if (m.text == (isPrefix + "hbola")) return conn.reply(m.chat, `<pre><code class="language-Clue">${json.jawaban.replace(/[AIUEOaiueo]/ig, '_')}</code></pre>`, m.msg, "HTML")

    if (!m.quoted || !m.text || !/Ketik.*(hbola|hint)/i.test(m.quoted.text) || /.*(hbola|hint)/i.test(m.text)) {
      if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Reply pertanyaannya untuk menjawab!*`)
      return !0
    }

    if (!(id in conn.tebakbola)) return conn.reply(m.chat, '❗Soal itu telah berakhir', m.msg)
    
    if (m.quoted.id == conn.tebakbola[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.tebakbola[id][2])
            delete conn.tebakbola[id]
            return conn.reply(m.chat, '*Menyerah!*\ntebakbola Dihapus🗑️', m.msg)
        }

        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            users.exp += env.expgame
            let caption = `🎉 *Kamu Benar!*\n+${env.expgame} Exp`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text:"Mainkan Lagi🎮", callback_data: ".tebakbola"}]])
            clearTimeout(conn.tebakbola[id][2])
            delete conn.tebakbola[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply('*Dikit lagi!*')
        else return m.reply('Salah ❌')
    }
    return !0
  },
  error: false,
  cache: true,
  location: __filename
}