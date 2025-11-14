import similarity from 'similarity'

const threshold = 0.72
export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    let id = m.chat
    
    if (m.text == (isPrefix + "calo")) {
      let json = JSON.parse(JSON.stringify(conn.caklontong[id][1]))
      return conn.reply(m.chat, `<pre><code class="language-Clue">${json.jawaban.replace(/[AIUEOaiueo]/ig, '_')}</code></pre>`, m.msg, "HTML")
    }
    
    if (!m.quoted || !m.text || !/Ketik.*calo/i.test(m.quoted.text) || /.*(calo|bantuan)/i.test(m.text))
        return !0
    conn.caklontong = conn.caklontong ? conn.caklontong : {}
    if (!(id in conn.caklontong))
        return m.reply('❗Soal itu telah berakhir')
    if (m.quoted.id == conn.caklontong[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.game[id][2])
            delete conn.game[id]
            return m.reply('*Yah Menyerah :( !*')
        }
        let json = JSON.parse(JSON.stringify(conn.caklontong[id][1]))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            users.exp += env.expgame
            let caption = `🎉 *Kamu Benar!*\n+${env.expgame} Exp`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text:"Mainkan Lagi🎮", callback_data: ".caklontong"}]])
            clearTimeout(conn.caklontong[id][2])
            delete conn.caklontong[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold)
            m.reply(`*💢Dikit Lagi!*`)
        else
            m.reply('Salah ❌')
    }
    return !0
  },
  error: false,
  cache: true,
  location: __filename
}