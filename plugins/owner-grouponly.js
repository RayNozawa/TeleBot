export const run = {
   usage: ['grouponly'],
   use: 'on/off',
   category: 'owner',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      bot,
      isOwnerBot
   }) => {
       if (!isOwnerBot) return m.reply("Kamu bukan owner bot ini!")
       if (!text || !text.match(/(on|off)/gi)) return conn.reply(m.chat, `- On untuk mengaktifkan khusus group\n- Off untuk mematikan khusus group\n\nContoh: *${isPrefix+command} on*`, m.msg, "Markdown", [[{ text:"On🟢", callback_data: `${isPrefix+command} on`}, { text: "Off🔴", callback_data: `${isPrefix+command} off`}]])

       if (text == "on") {
         bot.grouponly = true
         m.reply(`Berhasil mengaktifkan khusus group!`)
       } else {
         delete bot.grouponly
         m.reply(`Berhasil mematikan khusus group!`)
       }
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}