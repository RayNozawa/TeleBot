export const run = {
   usage: ['antilink'],
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

     let button = [[{ text: groupSet.antilink ? "Matikan🔴" : "Aktifkan🟢", callback_data: `${isPrefix+command} ${groupSet.antilink ? 'off' : 'on'}` }]]
     if (!text || !text.match(/(on|off)/gi)) return conn.reply(m.chat, `- On untuk mengaktifkan anti link\n- Off untuk mematikan anti link\n\nContoh: *${isPrefix+command} on*\n\n- Fitur ini menghapus pesan yang berisi link`, m.msg, "Markdown", button)
       
     if (text == "on") {
       groupSet.antilink = true
       m.reply(`Berhasil mengaktifkan anti link!`)
     } else {
       delete groupSet.link
       m.reply(`Berhasil mematikan anti link!`)
     }
   },
  error: false,
  restrict: true,
  cache: true,
  admin: true,
  group: true,
  location: __filename
}