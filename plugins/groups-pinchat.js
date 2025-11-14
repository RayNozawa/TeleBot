export const run = {
  usage: ['pinchat','unpin'],
  hidden: ['unpinchat'],
  use: 'reply msg',
  category: 'groups',
  async: async (m, { conn, text, command, isAdmin }) => {
     const bot = await conn.getMe()
     if (!(await isAdmin(bot.id))) return m.reply("Bot bukan admin!")

     if (!m.quoted) return m.reply('Reply pesan yang mau di pin!')
    
    if (command == "pinchat") {
      conn.pinChatMessage(m.chat, m.quoted.id)
    } else {
      conn.unpinChatMessage(m.chat, { message_id: m.quoted.id })
    }
  },
  error: false,
  restrict: true,
  admin: true,
  group: true,
  location: __filename
}