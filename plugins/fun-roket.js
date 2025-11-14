export const run = {
  usage: ['roket'],
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
  if (new Date - users.lastwork < 60000) return m.reply(`️😴 *Kamu cape* harus nunggu *${msToTime(time - new Date())}* biar bisa nerbangkan roket🚀`)

 users.exp += hasil
 users.lastwork = new Date * 1
 const name = await getName(m.sender)
 let { message_id } = await m.reply('🌕\n\n\n▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒\n▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒\n▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒\n░█▀█▀█░█▀██░█▀█░█▄█▄█░\n░█▀█▀█░█▀████▀█░█▄█▄█░\n████████▀█████████████\n🚀\n\n👨‍🚀 Memulai penerbangan....')

  setTimeout(() => {
    conn.editMsg(m.chat, message_id, '🌕\n\n\n🚀\n▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒\n▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒\n░█▀█▀█░█▀██░█▀█░█▄█▄█░\n░█▀█▀█░█▀████▀█░█▄█▄█░\n████████▀█████████████\n➕ Dalam penerbangan....', donateBtn)
    
    setTimeout(() => {
      conn.editMsg(m.chat, message_id, '🌕🚀\n\n\n▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒\n▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒\n▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒\n░█▀█▀█░█▀██░█▀█░█▄█▄█░\n░█▀█▀█░█▀████▀█░█▄█▄█░\n████████▀█████████████\n\n➕ Sampai di tujuan....', donateBtn)
    
      setTimeout(() => {
      m.reply(`🌕🚀

➕ *${name}*, Sukses Mendaratkan roket, Mendapatkan *${hasil} Exp* dari Nasa👨‍🚀`)
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
