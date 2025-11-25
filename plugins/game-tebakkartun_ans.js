import similarity from 'similarity'
const threshold = 0.72
export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    conn.tebakkartun = conn.tebakkartun ? conn.tebakkartun : {}
    
    let id = 'tebakkartun-' + m.chat
    let json = JSON.parse(JSON.stringify(conn.tebakkartun[id]?.[1] || {}))
    
    if (!json.name) return
    
    if (m.text == (isPrefix + "hkar")) return conn.reply(m.chat, `<pre><code class="language-Clue">${json.name.replace(/[AIUEOaiueo]/ig, '_')}</code></pre>`, m.msg, "HTML")

    if (!m.quoted || !m.text || !/Ketik.*hkar/i.test(m.quoted.text) || /.*hgamb/i.test(m.text)) {
        if (similarity(m.text.toLowerCase(), json.name.toLowerCase().trim()) >= threshold) m.reply(`*Reply pertanyaannya untuk menjawab!*`)
        return !0
    }
    
    if (!(id in conn.tebakkartun))
        return m.reply('Soal itu telah berakhir')
    
    if (m.quoted.id == conn.tebakkartun[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.tebakkartun[id][2])
            delete conn.tebakkartun[id]
            return m.reply('*Yah Menyerah :( !*')
        }

        if (m.text.toLowerCase() == json.name.toLowerCase().trim()) {
            users.exp += env.expgame
            let caption = `🎉 *Kamu Benar!*\n+${env.expgame} Exp`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{ text: 'Mainkan Lagi🎮', callback_data: '.tebakkartun' }]])
            clearTimeout(conn.tebakkartun[id][2])
            delete conn.tebakkartun[id]
        } else if (similarity(m.text.toLowerCase(), json.name.toLowerCase().trim()) >= threshold)
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