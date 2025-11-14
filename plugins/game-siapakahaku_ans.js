import similarity from 'similarity'
const threshold = 0.72

export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner, isPrefix }) => {
    let id = m.chat
    
    if (m.text == (isPrefix + "who")) {
      let json = JSON.parse(JSON.stringify(conn.siapakahaku[id][1]))
      return conn.reply(m.chat, `<pre><code class="language-Clue">${json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_')}</code></pre>`, m.msg, "HTML")
    }

    if (!m.quoted || !m.text || !/Ketik.*(who|hint)/i.test(m.quoted.text) || /.*(who|hint)/i.test(m.text)) return !0
    conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {}

    if (!(id in conn.siapakahaku)) return conn.reply(m.chat, '❗Soal itu telah berakhir', m.msg)
    if (m.quoted.id == conn.siapakahaku[id][0].message_id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let time = users.lastcommand + 120000
            if (new Date - users.lastcommand < 120000) return global.cd('2 menit')
            users.lastcommand = new Date * 1
            clearTimeout(conn.tebakemoji[id][2])
            delete conn.tebakemoji[id]
            return conn.reply(m.chat, '*Yah Menyerah :( !*', m.msg)
        }
        
        let json = JSON.parse(JSON.stringify(conn.siapakahaku[id][1]))

        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            users.exp += env.expgame
            let caption = `🎉 *Kamu Benar!*\n_+${env.expgame} Exp_`
            await conn.reply(m.chat, caption, m.msg, "Markdown", [[{text:"Mainkan Lagi🎮", callback_data: ".siapakahaku"}]])
            clearTimeout(conn.siapakahaku[id][2])
            delete conn.siapakahaku[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*💢Dikit Lagi!*`)
        else m.reply("Salah ❌")
    }
    return !0
  },
  error: false,
  cache: true,
  location: __filename
}