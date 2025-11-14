export const run = {
   usage: ['share','broadcast'],
   hidden: ['jashare','sharemsg'],
   use: 'message',
   category: 'main',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env,
      users,
      bot
   }) => {
     let group, typechat
       
     let sukses = 0, gagal = 0;
       
     const reply = m.msg.reply_to_message;
       
     if (!reply) return m.reply("Reply text atau media yang mau di share!")
       
     if (command == "broadcast") {
       group = global.db.users.map(v => v.jid)
       
       if (!group) return m.reply("Bot tidak memiliki pengguna!")
       
       let time = users.lastbroadcast + 600000
       if (new Date - users.lastbroadcast < 600000) return m.reply(`️😴 Kamu harus menunggu *${msToTime(time - new Date())}* agar bisa melakukan share lagi!`)
       
       users.lastbroadcast = new Date * 1
       
       typechat = "Pengguna"
     } else {
       group = bot.listgroup
       
       if (!group) return m.reply("Bot belum bergabung ke group manapun!")
       
       let time = users.lastshare + 600000
       if (new Date - users.lastshare < 600000) return m.reply(`️😴 Kamu harus menunggu *${msToTime(time - new Date())}* agar bisa melakukan share lagi!`)
       
       users.lastshare = new Date * 1
       typechat = "Grup"
     }
     
     group = [...new Set(group)];
     
     const { message_id } = await m.reply(`Sedang Mengirim Pesan Ke ${group.length} ${typechat}`)
     
     for (const groupId of group) {
       if (groupId == "-1002293286774") continue
       const msg = '[Pesan Broadcast]\n\n'
       try {
         if (reply.text) {
           await conn.sendMessage(groupId, msg+reply.text, { parse_mode: "HTML" }).catch(() =>
             conn.sendMessage(groupId, msg+reply.text).catch(() => {})
           );
         } else if (reply.photo) {
           const fileId = reply.photo[reply.photo.length - 1].file_id;
           await conn.sendPhoto(groupId, fileId, { caption: msg+(reply.caption || "") }).catch(() => {});
         } else if (reply.video) {
           await conn.sendVideo(groupId, reply.video.file_id, { caption: msg+(reply.caption || "") }).catch(() => {});
         } else if (reply.audio) {
           await conn.sendAudio(groupId, reply.audio.file_id, { caption: msg+(reply.caption || "") }).catch(() => {});
         } else if (reply.document) {
           await conn.sendDocument(groupId, reply.document.file_id, { caption: (msg+reply.caption || "") }).catch(() => {});
         } else if (reply.sticker) {
           await conn.sendSticker(groupId, reply.sticker.file_id).catch(() => {});
         } else {
           await conn.sendMessage(groupId, "⚠️ Jenis pesan ini belum didukung untuk share otomatis.").catch(() => {});
         }
         //await conn.forwardMessage(groupId, m.chat, m.quoted.id)
         sukses++;
         await new Promise(r => setTimeout(r, 300));
       } catch (err) {
         gagal++;
         console.error(`❌ Gagal kirim ke ${groupId}: ${err.description || err.message}`);
       }
       if ((sukses + gagal) % 10 === 0) {
         try {
           await conn.editMsg(m.chat, message_id, `✅ Sedang menjalankan share!

📊 Hasil:
• 🌍 Total ${typechat} : ${group.length}
• ✅ Berhasil    : ${sukses}
• ❌ Gagal       : ${gagal}
    `, donateBtn)
         } catch (e) {
           console.log(e.message)
         }
       } else if ((sukses + gagal) == group.length) {
         try {
           await conn.editMsg(m.chat, message_id, `✅ Share selesai!

📊 Hasil:
• 🌍 Total ${typechat} : ${group.length}
• ✅ Berhasil    : ${sukses}
• ❌ Gagal       : ${gagal}
    `, donateBtn)
         } catch (e) {
           console.log(e.message)
         }
       }
     }
   },
   error: false,
   cache: true,
   premium: true,
   location: __filename
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
  seconds = Math.floor((duration / 1000) % 60),
  minutes = Math.floor((duration / (1000 * 60)) % 60),
  
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds
  
  return minutes + " Menit " + seconds + " detik"
}