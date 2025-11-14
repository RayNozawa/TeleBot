import fetch from 'node-fetch'

export const run = {
   usage: ['kisahnabi'],
   use: 'query',
   category: 'tools',
   async: async (m, {
      conn,
      text,
      Func,
      env,
      isPrefix,
      command
   }) => {
     if (!text) return m.reply(`Masukan nama nabi\nExample: ${isPrefix + command} adam`)
     let url = await fetch(`https://raw.githubusercontent.com/ZeroChanBot/Api-Freee/a9da6483809a1fbf164cdf1dfbfc6a17f2814577/data/kisahNabi/${text.toLowerCase()}.json`)
     let kisah = await url.json().catch(_ => "Error")
     if (kisah == "Error") return m.reply("*Tidak Ditemukan!*")
     
     let hasil = `_*👳 Nabi :*_ ${kisah.name}
_*📅 Tanggal Lahir :*_ ${kisah.thn_kelahiran}
_*📍 Tempat Lahir :*_ ${kisah.tmp}
_*📊 Usia :*_ ${kisah.usia}

*— — — — — — — — [ K I S A H ] — — — — — — — —*

${kisah.description}`

     conn.reply(m.chat, hasil, m.msg)

        },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}