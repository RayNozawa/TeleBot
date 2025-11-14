export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner }) => {
   let id = m.chat
   let reward = 7000
   let type = typeof m.text == 'string' ? m.text : false
   
   const user = m.msg.from.username ? '@' +m.msg.from.username : m.msg.from.first_name
   conn.tebakbom = conn.tebakbom ? conn.tebakbom : {}
   if (!(id in conn.tebakbom) && m.quoted && /❏  *B O M B*/i.test(m.quoted.text)) return conn.reply(m.chat, `Sesi telah berakhir, silahkan kirim .tebakbom untuk membuat sesi baru.`, m.msg)
   if ((id in conn.tebakbom) && !isNaN(type)) {
      let timeout = 180000
      let json = conn.tebakbom[id][1].find(v => v.position == body)
      if (!json) return conn.reply(m.chat, `Untuk membuka kotak kirim angka 1 - 9`, m.msg)
      let teks = `❏  *B O M B*\n\n`
      if (json.emot == '💥') {
         json.state = true
         let bomb = conn.tebakbom[id][1]
         teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
         teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
         teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
         teks += `Timeout : *${((timeout / 1000) / 60)} menit*\n`
         teks += `*Permainan selesai!*\n*${user}* membuka bom💣.`
         const options = {
           parse_mode: 'Markdown',
           reply_markup: { inline_keyboard: [[{ text: "Mainkan Lagi🎮", callback_data: ".tebakbom" }]] },
           reply_to_message_id: m.msg.message_id
         };
         conn.editMessageText(teks, { chat_id: m.chat, message_id: m.id, ...options });
            clearTimeout(conn.tebakbom[id][3])
            delete conn.tebakbom[id]
         
      } else if (json.state) {
         let bomb = conn.tebakbom[id][1]
         teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
         teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
         teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
         teks += `Timeout : *${((timeout / 1000) / 60)} menit*\n`
         const options = {
           parse_mode: 'Markdown',
           reply_markup: { inline_keyboard: conn.tebakbom[id][2] },
           reply_to_message_id: m.msg.message_id
         };
         return conn.editMessageText(`${teks}\nKotak ${json.number} sudah di buka silahkan pilih kotak yang lain.\n${user}`, { chat_id: m.chat, message_id: m.id, ...options });
      } else {
         json.state = true
         let changes = conn.tebakbom[id][1]
         let open = changes.filter(v => v.state && v.emot != '💥').length
         if (open >= 8) {
            let teks = `❏  *B O M B*\n\n`
            teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
            teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
            teks += `Timeout : *${((timeout / 1000) / 60)} menit*\n`
            teks += `*Permainan selesai!* kotak berisi bom tidak terbuka, *${user}* mendapatkan *+${reward} Exp* )`
            const options = {
              parse_mode: 'Markdown',
              reply_markup: { inline_keyboard: [[{ text: "Mainkan Lagi🎮", callback_data: ".tebakbom" }]] },
              reply_to_message_id: m.msg.message_id
            };
            conn.editMessageText(teks, { chat_id: m.chat, message_id: m.id, ...options });
            users.exp += reward
               clearTimeout(conn.tebakbom[id][3])
               delete conn.tebakbom[id]
         } else {
            let teks = `❏  *B O M B*\n\n`
            teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
            teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
            teks += `Timeout : *${((timeout / 1000) / 60)} menit*\n`
            teks += `Kotak berisi bom tidak terbuka.\n- + 350 Exp\n${user}`
            const options = {
              parse_mode: 'Markdown',
              reply_markup: { inline_keyboard: conn.tebakbom[id][2] },
              reply_to_message_id: m.msg.message_id
            };
            conn.editMessageText(teks, { chat_id: m.chat, message_id: m.id, ...options }).then(() => {
               users.exp += 350
            })
         }
      }
   }
  },
  error: false,
  cache: true,
  location: __filename
}

async function randomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
} 