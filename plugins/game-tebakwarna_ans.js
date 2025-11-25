import similarity from 'similarity'
const threshold = 0.72
export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    conn.tebakwarna = conn.tebakwarna ? conn.tebakwarna : {}
    
    let id = 'tebakwarna-' + m.chat
    let json = JSON.parse(JSON.stringify(conn.tebakwarna[id]?.[1] || {}))
    
    if (!json.correct) return

    if (!m.quoted || !m.text || !/TEBAK ANGKA/i.test(m.quoted.text)) {
        if (similarity(m.text.toLowerCase(), json.correct.toLowerCase().trim()) >= threshold) m.reply(`*Reply pertanyaannya untuk menjawab!*`)
        return !0
    }
    
    if (!(id in conn.tebakwarna))
        return m.reply('Soal itu telah berakhir')
    
    if (m.quoted.id == conn.tebakwarna[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.tebakwarna[id][2])
            delete conn.tebakwarna[id]
            return m.reply('*Yah Menyerah :( !*')
        }

        if (m.text.toLowerCase() == json.correct.toLowerCase().trim()) {
            users.exp += env.expgame
            let caption = `🎉 *Kamu Benar!*\n+${env.expgame} Exp`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{ text: 'Mainkan Lagi🎮', callback_data: '.tebakwarna' }]])
            clearTimeout(conn.tebakwarna[id][2])
            delete conn.tebakwarna[id]
        } else if (similarity(m.text.toLowerCase(), json.correct.toLowerCase().trim()) >= threshold)
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