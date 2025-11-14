export const run = {
  usage: ['taksi'],
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
  if (new Date - users.lastwork < 60000) return m.reply(`️😴 *Kamu cape* harus nunggu *${msToTime(time - new Date())}* biar bisa jadi supir taksi`)

 users.exp += hasil
 users.lastwork = new Date * 1
 let { message_id } = await m.reply('🔍Mencari penumpang.....')
 const name = await getName(m.sender)
  setTimeout(() => {
    conn.editMsg(m.chat, message_id, `🚶⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳  🌳 🏘️       🚕


✔️ Mendapatkan orderan....`, donateBtn)

    setTimeout(() => {
      conn.editMsg(m.chat, message_id, `🚶⬛⬛⬛⬛⬛🚐⬛⬛⬛🚓🚚
🚖⬜⬜⬜⬛⬜⬜⬜🚓⬛🚑
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🚙
🏘️🏘️🏢️🌳  🌳 🏘️  🏘️🏡


🚖 Mengantar Ke tujuan.....`, donateBtn)

      setTimeout(() => {
      conn.editMsg(m.chat, message_id, `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🚓
⬛⬜🚗⬜⬜⬛⬜🚐⬜⬜⬛🚙🚚🚑
⬛⬛⬛⬛🚒⬛⬛⬛⬛⬛⬛🚚
🏘️🏘️🏘️🏘️🌳  🌳 🏘️


🚖 Selesai Mengantar Pelanggan....`, donateBtn)
      setTimeout(() => {
        m.reply(`*${name}* Selesai menjadi supir taksi, kamu mendapat tip dari penumpang *${hasil} Exp*`)
        }, 5000) // https://github.com/SazumiVicky/MakeMeow-Games
      }, 2000)
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
