import speed from 'performance-now';

let loadd = [
 '《██▒▒▒▒▒▒▒▒▒▒▒》10%',
 '《████▒▒▒▒▒▒▒▒▒》30%',
 '《███████▒▒▒▒▒▒》50%',
 '《██████████▒▒▒》70%',
 '《█████████████》100%',
 '𝙻𝙾𝙰𝙳𝙸𝙽𝙶 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴𝙳...'
 ]
 
export const run = {
   usage: ['ping'],
   hidden: ['speed','runtime'],
   category: 'main',
   async: async (m, {
      conn,
      text,
      Func
   }) => {
      try {
         let { message_id } = await conn.reply(m.chat, '_Loading_', m.msg)
         
         for (let i = 0; i < loadd.length; i++) {
           await conn.editMsg(m.chat, message_id, loadd[i], donateBtn)
         }

         let _uptime = process.uptime() * 1000
         let uptime = clockString(_uptime)
         let timestamp = speed();
         let latensi = speed() - timestamp;
         
         let sepid = `*🚀Kecepatan* : ${latensi.toFixed(4)} _ms_\n*👾Bot aktif selama* :\n${uptime}`
         await conn.editMsg(m.chat, message_id, sepid, donateBtn, "Markdown")
      } catch {
         m.reply("Error")
      }
   },
   error: false,
}

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' Hari ', h, ' Jam ', m, ' Menit ', s, ' Detik '].map(v => v.toString().padStart(2, 0)).join('')
}