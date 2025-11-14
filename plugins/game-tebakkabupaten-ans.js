import similarity from 'similarity'

const threshold = 0.72
export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    let id = m.chat
    
    if (m.text == (isPrefix + "hkab")) {
      let json = JSON.parse(JSON.stringify(conn.tebakkabupaten[id][1]))
      return conn.reply(m.chat, `<pre><code class="language-Clue">${json.title.replace(/[AIUEOaiueo]/ig, '_')}</code></pre>`, m.msg, "HTML")
    }

    if (!m.quoted || !m.text || !/Ketik.*hkab/i.test(m.quoted.text) || /.*hkab/i.test(m.text))
        return !0
    conn.tebakkabupaten = conn.tebakkabupaten ? conn.tebakkabupaten : {}

    if (!(id in conn.tebakkabupaten))
        return conn.reply(m.chat, 'Soal itu telah berakhir', m.msg)

    if (m.quoted.id == conn.tebakkabupaten[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.tebakkabupaten[id][2])
            delete conn.tebakkabupaten[id]
            return conn.reply(m.chat, '*Yah Menyerah :( !*', m.msg)
        }

        let json = JSON.parse(JSON.stringify(conn.tebakkabupaten[id][1]))
        if (m.text.toLowerCase() == json.title.toLowerCase().trim()) {
            users.exp += env.expgame
            let caption = `🎉 *Kamu Benar!*\n_+${env.expgame} Exp_`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{ text: 'Mainkan Lagi🎮', callback_data: '.tebakkabupaten' }]])
            clearTimeout(conn.tebakkabupaten[id][2])
            delete conn.tebakkabupaten[id]
        } else if (similarity(m.text.toLowerCase(), json.title.toLowerCase().trim()) >= threshold)
            m.reply(`❗ *Dikit Lagi!*`)
        else
            await m.reply('Salah ❌')
    }
    return !0
  },
  error: false,
  cache: true,
  location: __filename
}