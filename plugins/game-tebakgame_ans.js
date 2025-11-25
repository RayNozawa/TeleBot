import similarity from 'similarity'
const threshold = 0.72
export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    conn.tebakgame = conn.tebakgame ? conn.tebakgame : {}
    
    let id = 'tebakgame-' + m.chat
    let json = JSON.parse(JSON.stringify(conn.tebakgame[id]?.[1] || {}))
    
    if (!json.jawaban) return
    
    if (m.text == (isPrefix + "hgame")) return conn.reply(m.chat, `<pre><code class="language-Clue">${json.jawaban.replace(/[AIUEOaiueo]/ig, '_')}</code></pre>`, m.msg, "HTML")

    if (!m.quoted || !m.text || !/Ketik.*hgame/i.test(m.quoted.text) || /.*hgamb/i.test(m.text)) {
        if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Reply pertanyaannya untuk menjawab!*`)
        return !0
    }
    
    if (!(id in conn.tebakgame))
        return m.reply('Soal itu telah berakhir')
    
    if (m.quoted.id == conn.tebakgame[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.tebakgame[id][2])
            delete conn.tebakgame[id]
            return m.reply('*Yah Menyerah :( !*')
        }

        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            users.exp += env.expgame
            let caption = `🎉 *Kamu Benar!*\n+${env.expgame} Exp`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{ text: 'Mainkan Lagi🎮', callback_data: '.tebakgame' }]])
            clearTimeout(conn.tebakgame[id][2])
            delete conn.tebakgame[id]
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