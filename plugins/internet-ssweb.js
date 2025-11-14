import axios from "axios"

export const run = {
   usage: ['ssweb'],
   hidden: ['sshp','sstablet','sspc'],
   use: 'url',
   category: 'internet',
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
     if (!text) return m.reply(`Gunakan format ${isPrefix + command} <url>\n\n*Contoh :* ${isPrefix + command} https://github.com/RayhanZuck\n\nCommand lainnya: .sshp, .sstablet, sspc`)

     conn.sendChatAction(m.chat, 'find_location')
     if (command === 'sshp') {
       const ss = await ssweb(text, "mobile")
       await conn.sendButton(m.chat, donateBtn, ss, 'ssweb.jpg', 'ScreenShot Web Mode Handphone', m.msg, env.wm);
     } else if (command === 'ssweb' || command === 'sspc') {
       const ss = await ssweb(text, "desktop")
       await conn.sendButton(m.chat, donateBtn, ss, 'ssweb.jpg', 'ScreenShot Web Mode Desktop', m.msg, env.wm);
     } else if (command === 'sstablet') {
       const ss = await ssweb(text, "tablet")
       await conn.sendButton(m.chat, donateBtn, ss, 'ssweb.jpg', 'ScreenShot Web Mode Tablet', m.msg, env.wm);
     }
  },
  error: false,
  cache: true,
  limit: true,
  location: __filename
};

async function ssweb(url, mode) {
  try {
    const { data } = await axios.get(`https://api.nekolabs.my.id/tools/ssweb?url=${encodeURIComponent(url)}&device=${mode}`)
    return data.result
  } catch (e) {
    throw e.message
  }
}