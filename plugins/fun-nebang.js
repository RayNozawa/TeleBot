export const run = {
  usage: ['nebang'],
  category: 'fun',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
  let hasil = Math.floor(Math.random() * 3000)
  let time = users.lastwork + 60000
  if (new Date - users.lastwork < 60000) return m.reply(`️😴 *Kamu cape* harus nunggu *${msToTime(time - new Date())}* biar bisa nebang🪓`)

 users.exp += hasil
 users.lastwork = new Date * 1
 const name = await getName(m.sender)
 let { message_id } = await m.reply(`🚶⬛⬛⬛⬛⬛⬛⬛⬛⬛\n⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🌳🏘️🌳🌳  🌳 🏘️ 🌳🌳🌳\n\n*${name}*\nMenuju hutan....`)
 
  setTimeout(() => {
    conn.editMsg(m.chat, message_id, `⬛⬛⬛⬛⬛⬛🚶⬛⬛⬛\n⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🌳🏘️🌳🌳  🌳 🏘️ 🌳🌳🌳\n\n*${name}*\nSampai di hutan....`, donateBtn, "Markdown")
    
    setTimeout(() => {
      conn.editMsg(m.chat, message_id, `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛🚶\n🌳🏘️🌳🌳  🌳 🏘️ 🌳🌳🌳\n\n*${name}* \nMulai Menebang🪓`, donateBtn, "Markdown")
      setTimeout(() => {
        m.reply(`*${name}* berhasil menebang, kayu telah dijual dan menghasilkan *${hasil} Exp*`)
        }, 5000) // https://github.com/SazumiVicky/MakeMeow-Games
      }, 2000)
    }, 2000) 
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),

  seconds = (seconds < 10) ? "0" + seconds : seconds

  return seconds + " detik" 
}
function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
