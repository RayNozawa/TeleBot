import similarity from 'similarity'
const threshold = 0.72

export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    let id = m.chat

    if (m.text == (isPrefix + "tkl")) {
      let json = JSON.parse(JSON.stringify(conn.tebakkalimat[id][1]))
      return conn.reply(m.chat, `<pre><code class="language-Clue">${json.jawaban.replace(/[AIUEOaiueo]/ig, '_')}</code></pre>`, m.msg, "HTML")
    }
    
    if (!m.quoted || !m.text || !/Ketik.*tkl/i.test(m.quoted.text) || /.*(tkl|bantuan)/i.test(m.text))
    return !0    

    conn.tebakkalimat = conn.tebakkalimat ? conn.tebakkalimat : {}
    if (!(id in conn.tebakkalimat)) return m.reply('Soal itu telah berakhir')

    if (m.quoted.id == conn.tebakkalimat[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.tebakkabupaten[id][2])
            delete conn.tebakkabupaten[id]
            return conn.reply(m.chat, '*Yah Menyerah :( !*', m)
        }
        
        let json = JSON.parse(JSON.stringify(conn.tebakkalimat[id][1]))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            users.exp += env.expgame
            let caption = `🎉 *Kamu Benar!*\n_+${env.expgame} Exp_`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text:"Mainkan Lagi🎮", callback_data: ".tebakkalimat"}]])
            clearTimeout(conn.tebakkalimat[id][2])
            delete conn.tebakkalimat[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
        else m.reply('Salah ❌')
    }
    return !0
  },
  error: false,
  cache: true,
  location: __filename
}