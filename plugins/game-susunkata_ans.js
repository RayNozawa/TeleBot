import similarity from 'similarity'
const threshold = 0.72
export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    let id = m.chat
    
    if (m.text == (isPrefix + "suska")) {
      let json = JSON.parse(JSON.stringify(conn.susunkata[id][1]))
      return conn.reply(m.chat, `<pre><code class="language-Clue">${json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_')}</code></pre>`, m.msg, "HTML")
    }

    if (!m.quoted || !/Ketik.*suska/i.test(m.quoted.text)) return !0
    conn.susunkata = conn.susunkata ? conn.susunkata : {}

    if (!(id in conn.susunkata)) return m.reply('❗Soal itu telah berakhir')
    if (m.quoted.id == conn.susunkata[id][0].message_id) {
        let isSurrender = /^((me)?(.)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.susunkata[id][2])
            delete conn.susunkata[id]
            return conn.reply(m.chat, '*Menyerah!*\nSusunkata dihapus🗑️', m.msg)
        }
        let json = JSON.parse(JSON.stringify(conn.susunkata[id][1]))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            users.exp += env.expgame
            let caption = `🎉 *Kamu Benar!*\n+${env.expgame} Exp`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{ text: 'Mainkan Lagi🎮', callback_data: '.susunkata' }]])
            clearTimeout(conn.susunkata[id][2])
            delete conn.susunkata[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*❗Dikit Lagi!*`)
        else m.reply('Salah ❌')
    }
    return !0
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}