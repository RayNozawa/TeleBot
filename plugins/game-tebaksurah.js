import fetch from 'node-fetch'

let timeout = 120000
let poin = 4999

export const run = {
   usage: ['tebaksurah'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    conn.tebaksurah = conn.tebaksurah ? conn.tebaksurah : {}
    let id = m.chat
    if (id in conn.tebaksurah) return conn.reply(m.chat, 'Masih Ada Soal Yang Belum Terjawabi', conn.tebaksurah[id][0])

    let ran = 6236
    let res = await fetch('https://api.alquran.cloud/v1/ayah/' + (Math.floor(Math.random() * 6236) + 1) + '/ar.alafasy')
    if (res.status !== 200) throw await res.text()

    let result = await res.json()
    let json = result.data
    if (result.code == '200') {
    let caption = `*${command.toUpperCase()}*
Number In Surah: ${json.numberInSurah}
By: ${json.edition.name} ${json.edition.englishName}

Waktu *${(timeout / 1000).toFixed(2)} Detik*
Ketik *${isPrefix}hsur* Untuk Bantuan
Bonus: ${poin} XP
*Balas Pesan Ini Untuk Menjawab!*`.trim()

let captu = `
*${json.surah.englishName}*

*INFORMATION*
Surah Number: ${json.surah.number}
Surah Name: ${json.surah.name} ${json.surah.englishName}
Eng Name: ${json.surah.englishNameTranslation}
Number Of Ayahs: ${json.surah.numberOfAyahs}
Type: ${json.surah.revelationType}
`
    conn.tebaksurah[id] = [
        await conn.sendButton(m.chat, [{name: "Bantuan💢", command: ".hsur"}], json.audio, 'Tebak Surah.mp3', caption, m.msg, env.wm),
        json, poin,
        setTimeout(() => {
            if (conn.tebaksurah[id]) conn.reply(m.chat, `Waktu Habis!\nJawabannya Adalah ${captu}`, conn.tebaksurah[id][0])
            delete conn.tebaksurah[id]
        }, timeout)
    ]
    } else if (result.code == '404') {
    m.reply(`*Ulangi! Command ${isPrefix + command} Karena ${json.data}*`)
    }
  },
  error: false,
  cache: true,
  location: __filename
}
