export const run = {
   async: async (m, { conn, Api, body, Func, users, env, isROwner, groupSet, isAdmin }) => {   
     if ((await isAdmin(m.sender))) return
     if (!groupSet?.antiforward) return
     if (m.msg.forward_origin) return conn.deleteMessage(m.chat, m.id)
   },
   error: false,
   cache: true,
   location: __filename
};