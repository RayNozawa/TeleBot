import axios from 'axios';

export const run = {
  usage: ['gita'],
  use: 'text',
  category: 'ai',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    args,
    isAdmin
  }) => {
     const chat = global.db.chats.find(v => v.jid == m.chat)

     if (!text) return m.reply(`Masukkan pertanyaan atau kirim foto dengan pertanyaan`);

     if (args[0] == "auto") {
       if (m.isGroup && !(await isAdmin(m.sender))) return m.reply("Kamu bukan admin grup ini, hanya bisa di aktifkan oleh admin grup atau aktifkan di obrolan pribadi!")
       if (args[1] == "on") {
         chat.autogita = true
         return conn.reply(m.chat, "Berhasil Mengaktifkan Auto Gita", m.msg, "Markdown", createButton())
       } else if (args[1] == "off") {
         delete chat.autogita
         return conn.reply(m.chat, "Berhasil Mematikan Auto Gita", m.msg, "Markdown", createButton())
       } else {
         return conn.reply(m.chat, "Input tidak valid, hanya *on* dan *off*", m.msg, "Markdown", createButton())
       }
     }
     
     conn.sendChatAction(m.chat, "typing")
     
     let { data } = await axios.get(`https://smail.my.id/gita?text=${text}`)
     conn.reply(m.chat, data.response, m.msg, "Markdown", createButton())
     
     function createButton() {
       return [[{ text: chat.autogita ? "Matikan Auto Gita🔴" : "Aktifkan Auto Gita🟢", callback_data: `${isPrefix+command} auto ${chat.autogita ? 'off' : 'on'}` }]]
     }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}