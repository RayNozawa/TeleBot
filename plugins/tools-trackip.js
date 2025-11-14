import axios from "axios"

export const run = {
   usage: ['trackip'],
   hidden: ['lacakip'],
   use: 'ip',
   category: 'tools',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
  if (!text) return m.reply(`Masukkan ip!\n\nContoh: *${isPrefix+command}* 140.213.29.7`)
  
  function toString(object, indent = 0) {
    if (typeof object === 'string') {
      return `"${object}"`;
    }
    const pad = '  '.repeat(indent);
    return Object.entries(object).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return `${pad}*${key}*:\n${toString(value, indent + 1)}`;
      } else {
        return `${pad}*${key}*: ${value}`;
      }
    }).join('\n');
  }
  
  try {
    let { data } = await axios.get(`${apiUrl}/trackip?ip=${text}`)
    await conn.reply(m.chat, toString(data), m.msg)
  } catch (e) {
    return m.reply(`Gagal track atau ip yang kamu masukkan tidak valid`)
  }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}