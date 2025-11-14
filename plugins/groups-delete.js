export const run = {
   usage: ['delete'],
   hidden: ['del'],
   use: 'reply chat',
   category: 'groups',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      isAdmin
   }) => {
     const bot = await conn.getMe()
     if (!(await isAdmin(bot.id))) return m.reply("Bot bukan admin!")

     if (!m.quoted) return m.reply("Reply pesan member yang mau di hapus!")
     
     try {
       await conn.deleteMessage(m.chat, m.quoted.id)
       m.reply("Berhasil hapus pesan!")
     } catch (e) {
       m.reply(`Gagal hapus pesan: ${e.message}`)
     }
   },
  error: false,
  restrict: true,
  cache: true,
  admin: true,
  group: true,
  location: __filename
}