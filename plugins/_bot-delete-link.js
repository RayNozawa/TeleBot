const isLinkOnly = /https?:\/\/[^\s]+/i;

export const run = {
   async: async (m, { conn, Api, body, Func, users, env, isROwner, groupSet, isAdmin }) => {   
     if ((await isAdmin(m.sender))) return
     if (!groupSet?.antilink) return
     
     const isAntiLink = isLinkOnly.exec(m.text)

     if (isAntiLink) {
       try {
         await conn.deleteMessage(m.chat, m.id)
       } catch (e) {
         m.reply(`Link terdeteksi, tetapi gagal menghapus: ${e.message}`)
       }
     }
   },
   error: false,
   cache: true,
   location: __filename
};