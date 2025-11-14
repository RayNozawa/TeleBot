export const run = {
  usage: ['tambang'],
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
  if (new Date - users.lastwork < 60000) return m.reply(`⏳ _Tunggu_ *${msToTime(time - new Date())}* _untuk kembali ke tambang_`)
  users.exp += hasil
  users.lastwork = new Date * 1
  
  let { message_id } = await m.reply('Mempersiapkan Peralatan⛏️')
  const name = await getName(m.sender)
  
  setTimeout(() => {
    conn.editMsg(m.chat, message_id, 'Menuju Penambangan👷', donateBtn)

    setTimeout(() => {
      conn.editMsg(m.chat, message_id, 'Sedang Menambang👷⛏️', donateBtn)
      
      setTimeout(() => {
        m.reply(`🎉 *${name}*, Kamu berhasil menambang *${hasil} XP*`)
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
