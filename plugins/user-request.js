export const run = {
   usage: ['request'],
   hidden: ['req'],
   category: 'user',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
     const bot = await conn.getMe()
     if (bot.id !== env.bot_id) return m.reply(`Request hanya bisa dilakukan pada bot utama @${env.bot_uname}`)
     
     if (!text) return m.reply(`Masukkan text\n\nContoh: ${isPrefix+command} fitur toanime`)
     conn.forwardMessage(env.OWNER_ID, m.chat, m.id)
     m.reply("Request kamu sudah terkirim, tunggu balasan owner!")
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}