import similarity from 'similarity'
const threshold = 0.72

export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    let id = m.chat

    if (m.text == (isPrefix + "hsur")) {
      let json = JSON.parse(JSON.stringify(conn.tebaksurah[id][1]))
      return conn.reply(m.chat, `<pre><code class="language-Clue">${json.surah.englishName.replace(/[AIUEOaiueo]/ig, '_')}</code></pre>`, m.msg, "HTML")
    }
 
    if (!m.quoted || !m.text || !/Ketik.*hsur/i.test(m.quoted.text) || /.*hsur/i.test(m.text))
        return !0

    conn.tebaksurah = conn.tebaksurah ? conn.tebaksurah : {}
    if (!(id in conn.tebaksurah))
        return conn.reply(m.chat, 'Soal Itu Telah Berakhir', m)

    if (m.quoted.id == conn.tebaksurah[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.tebaksurah[id][3])
            delete conn.tebaksurah[id]
            return conn.reply(m.chat, '*Yah Menyerah :( !*', m)
        }

        let json = JSON.parse(JSON.stringify(conn.tebaksurah[id][1]))
        if (m.text.toLowerCase() == json.surah.englishName.toLowerCase().trim()) {
            users.exp += conn.tebaksurah[id][2]
            let caption = `🎉 *Kamu Benar!*\n+${conn.tebaksurah[id][2]} XP`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{ text: 'Mainkan Lagi🎮', callback_data: '.tebaksurah' }]])
            clearTimeout(conn.tebaksurah[id][3])
            delete conn.tebaksurah[id]
        } else if (similarity(m.text.toLowerCase(), json.surah.englishName.toLowerCase().trim()) >= threshold)
            m.reply(`*Dikit Lagi!*`)
        else
            conn.reply(m.chat, `*Salah!*`, m)
    }
    return !0
  },
  error: false,
  cache: true,
  location: __filename
}