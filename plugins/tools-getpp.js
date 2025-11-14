export const run = {
   usage: ['getpp'],
   category: 'tools',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
     try {
       conn.sendChatAction(m.chat, 'find_location')
       const pp = await getPpUser(conn, m.quoted?.msg?.from?.id || m.sender)
       await conn.sendButton(m.chat, donateBtn, pp, 'pp.jpg', `@${m.username}`, m.msg, env.wm);
     } catch (e) {
       return m.reply("Tidak dapat mengambil atau menemukan profile!")
     }
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}