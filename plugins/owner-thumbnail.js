import axios from 'axios'

export const run = {
   usage: ['thumbnailbot'],
   use: 'query',
   category: 'owner',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      bot,
      isOwnerBot,
      Scraper
   }) => {
       if (!isOwnerBot) return m.reply("Kamu bukan owner bot ini!")
       
       if (!text) return conn.reply(m.chat, `Masukkan pencarian pinterest yang akan digunakan untuk thumbnail bot!\n\nContoh: *${isPrefix+command} ${env.botname}*\nAtau: *${isPrefix+command} https://files.catbox.moe/svjxoy.jpg*\n\nThumbnail saat ini: *${bot.thumbnail || env.botname}*`, m.msg)
       bot.thumbnail = text
       m.reply(`Berhasil mengganti thumbnail bot menjadi ${text}`)
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}