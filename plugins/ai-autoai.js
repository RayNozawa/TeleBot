export const run = {
   usage: ['autoai'],
   use: 'on/off',
   category: 'ai',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      env,
      isAdmin
   }) => {
     if (m.isGroup && !(await isAdmin(m.sender))) return m.reply("Kamu bukan admin grup ini, hanya bisa di aktifkan oleh admin grup atau aktifkan di obrolan pribadi!")
     
     const chat = global.db.chats.find(v => v.jid == m.chat)

     let button = [[{ text: chat.autoai ? "Matikan🔴" : "Aktifkan🟢", callback_data: `${isPrefix+command} ${chat.autoai ? 'off' : 'on'}` }]]

     if (!text || !text.match(/(on|off)/gi)) return conn.reply(m.chat, `- On untuk mengaktifkan auto ai\n- Off untuk mematikan auto ai\n\nContoh: *${isPrefix+command} on*\n\n- Bot akan membalas semua pesan yang dikirim\n- Setiap pesan yang kamu kirim ke auto ai akan menggunakan 1 limit`, m.msg, "Markdown", button)
       
     if (text == "on") {
       chat.autoai = true
       m.reply(`Berhasil mengaktifkan auto ai!`)
     } else {
       delete chat.autoai
       m.reply(`Berhasil mematikan auto ai!`)
     }
   },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}