export const run = {
   async: async (m, {
      conn,
      isAdmin,
      groupSet
   }) => {
     const bot = await conn.getMe()
     if (!m.isGroup || (await isAdmin(m.sender)) || !(await isAdmin(bot.id))) return
     
     if (groupSet.lastMsg == m.text) conn.deleteMessage(m.chat, m.id)
     groupSet.lastMsg = m.text
   },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}