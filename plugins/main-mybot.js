export const run = {
   usage: ['mybot'],
   hidden: ['mybots'],
   category: 'main',
   async: async (m, {
      conn,
      text,
      Func,
      isPrefix,
      command
   }) => {
     const keys = Object.keys(db.bot).filter(key => 
       db.bot[key].owner_id === m.sender ||
       db.bot[key].owner === m.username
     );
     
     let list = `Total: ${keys.length}\n\n`
     for (const key of keys) {
       list += `- @${key}\n`
     }
     conn.sendMessage(m.chat, list, { reply_to_message_id: m.id })
   },
   error: false,
   limit: true,
}