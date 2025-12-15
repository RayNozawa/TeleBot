import axios from "axios"

export const run = {
   usage: ['soundcloud'],
   hidden: ['scldl','scl','soundclouddl'],
   use: 'query/url',
   category: 'downloader',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      Scraper
   }) => {
  const urg = text ? text : m.quoted?.text ? m.quoted.text : text
  
  if (!urg) return m.reply(`Masukkan judul atau url, contoh:\n\n${isPrefix + command} duvet\n${isPrefix+command} https://m.soundcloud.com/akanekougami/duvet-boa`)
  
  const urlRegex = /(https?:\/\/[^\s`]+)/g;
  const match = urg.match(urlRegex);
  let url = match ? match[0] : null;

  conn.sendChatAction(m.chat, 'record_audio')
  
  if (!url || url.indexOf("https") === -1) {
    const { data } = await axios.get(`${apiUrl}/search/soundcloud?query=${text}`)
    url = data[0].permalink_url
  }

  try {
    const { data } = await axios.get(`${apiUrl}/download/soundcloud?url=${url}`)
    await conn.sendButton(m.chat, donateBtn, data.url, data.data.title+'.mp3', '', m.msg, env.wm);
  } catch (e) {
    return m.reply('Terjadi kesalahan: ' + e.message)
  }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}