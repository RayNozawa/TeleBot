export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    if (!/^-?[0-9]+(\.[0-9]+)?$/.test(m.text)) return !0
    let id = m.chat
    if (!m.quoted || !m.text || !/^Berapa hasil dari/i.test(m.quoted.text)) return !0
    conn.math = conn.math ? conn.math : {}
    if (!(id in conn.math)) return conn.reply(m.chat, 'Soal itu telah berakhir', m.msg)
    if (m.quoted.id == conn.math[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.math[id][3])
            delete conn.math[id]
            return conn.reply(m.chat, '*Yah Menyerah :( !*', m.msg)
        }
        let math = JSON.parse(JSON.stringify(conn.math[id][1]))
        if (m.text == math.result) {
            users.exp += 1000
            let caption = `🎉 *Kamu Benar!*\n+1000 Exp`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text:"Mainkan Lagi🎮", callback_data: ".math " + conn.math[id][4]}]])
            clearTimeout(conn.math[id][3])
            delete conn.math[id]
        } else {
            if (--conn.math[id][2] == 0) {
                clearTimeout(conn.math[id][3])
                delete conn.math[id]
                conn.reply(m.chat, `*Kesempatan habis!*\nJawaban: *${math.result}*`, m.msg)
            } else m.reply(`*Jawaban Salah!*\nMasih ada ${conn.math[id][2]} kesempatan`)
        }
    }
    return !0
  },
  error: false,
  cache: true,
  location: __filename
}