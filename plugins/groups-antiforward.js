export const run = {
   usage: ['antiforward'],
   hidden: ['noforward'],
   use: 'on/off',
   category: 'groups',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env,
      isAdmin,
      groupSet
   }) => {
     const bot = await conn.getMe()
     if (!(await isAdmin(bot.id))) return m.reply("Bot bukan admin!")

     let button = [[{ text: groupSet.antiforward ? "Matikan🔴" : "Aktifkan🟢", callback_data: `${isPrefix+command} ${groupSet.antiforward ? 'off' : 'on'}` }]]
     if (!text || !text.match(/(on|off)/gi)) return conn.reply(m.chat, `- On untuk mengaktifkan anti forward\n- Off untuk mematikan anti forward\n\nContoh: *${isPrefix+command} on*\n\n- Fitur ini menghapus pesan yang diteruskan`, m.msg, "Markdown", button)
       
     if (text == "on") {
       groupSet.antiforward = true
       m.reply(`Berhasil mengaktifkan anti forward!`)
     } else {
       delete groupSet.antiforward
       m.reply(`Berhasil mematikan anti forward!`)
     }
   },
  error: false,
  restrict: true,
  cache: true,
  admin: true,
  group: true,
  location: __filename
}