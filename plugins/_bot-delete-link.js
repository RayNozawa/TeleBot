const isLinkOnly = /https?:\/\/[^\s]+/i;

export const run = {
   async: async (m, { conn, Api, body, Func, users, env, isROwner, groupSet, isAdmin }) => {   
     if (!m.isGroup || isAdmin(m.sender)) return false;

     const isAntiLink = isLinkOnly.exec(m.text)

     if (groupSet?.antilink && isAntiLink) {
       return conn.deleteMessage(m.chat, m.id)
     }
   },
   error: false,
   cache: true,
   location: __filename
};