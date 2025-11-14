export const run = {
   usage: ['tebakangka'],
   hidden: ['togel'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env,
      users
   }) => {
  let bonusExp = 10000
  let args = text.split(" ")
  if (!args[0]) return conn.reply(m.chat, `Masukkan angka tebakanmu 1 hingga 5\n*Contoh:* ${isPrefix + command} 3`, m.msg)
  if (args[0] < 1 || args[0] > 5) return conn.reply(m.chat, `Harap masukkan angka antara 1 sampai 5`, m.msg)
  let number = Math.floor(Math.random() * 5) + 1
  let userGuess = parseInt(args[0])
  let result = (userGuess === number) ? `*Selamat Tebakanmu Benar!!*\n+${bonusExp} XP` : `Kamu kalah\nAngka yang keluar ${number}\n\n-2 Limit`
  if (userGuess === number) {
    users.exp += bonusExp
  }
  conn.reply(m.chat, result, m.msg)
   },
   error: false,
   cache: true,
   location: __filename
}
