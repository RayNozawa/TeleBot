import axios from "axios";

const button = [{name: "Matikan Auto Ai🔴", command: "/autoai off"}]
export const run = {
   async: async (m, { conn, users, groupSet, isPrem }) => {   
     const chat = global.db.chats.find(v => v.jid == m.chat)
     
     if (!chat.autoai) return
     
     if (!isPrem) {
       if (users.limit >= 1) {
         users.limit -= 1
       } else {
         const neededExp = 1 * 1000
         if (users.exp >= neededExp) {
           users.exp -= neededExp
         } else {
           return m.reply(`⚠️ Limit kamu sudah habis!\n\nKembali esok untuk mendapatkan limit gratis\n\nMainkan game pada *menu game* untuk mendapatkan limit\n\n/claim untuk mendapat limit instan\n\nUpgrade /premium 5k perbulan ke owner @${env.owner} untuk menggunakan fitur tanpa batasan`)
         }
       }
     }
        
     const { message_id } = await m.reply("🤔");
     
     try {
      let lmn = await luminai(m.text, m.sender.toString(), prompt)
      const { data } = await axios.get(`${apiUrl}/shani?text=${text}`)
      await conn.editMsg(m.chat, data.reply, lmn, button, "Markdown")
     } catch (e) {
       m.reply(e.message);
     }
   },
   error: false,
   cache: true,
   location: __filename
};