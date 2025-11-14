export const run = {
   usage: ['owner'],
   hidden: ['creator'],
   category: 'main',
   async: async (m, {
      conn,
      text,
      Func,
      env,
      bot
   }) => {
      try {
         const owner = bot.owner || env.owner
         
         let capt = `<a href="https://t.me/${owner}">@${owner}</a> adalah ownerku!\n\n<blockquote>${env.wm}</blockquote>`

         return conn.reply(m.chat, capt, m.msg, "HTML")
      } catch (e) {
         m.reply(e.message)
      }
   },
   error: false,
}

