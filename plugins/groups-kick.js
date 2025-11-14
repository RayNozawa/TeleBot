export const run = {
   usage: ['kick'],
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

     if (!m.quoted) return m.reply("Reply pesan member yang mau di kick!")
     
     try {
       await conn.ban_chat_member(m.chat, m.quoted.sender)
       m.reply("Berhasil kick member!")
     } catch (e) {
       m.reply(`Gagal kick member: ${e.message}`)
     }
   },
  error: false,
  restrict: true,
  cache: true,
  admin: true,
  group: true,
  location: __filename
}