import fetch from 'node-fetch'
export const run = {
   usage: ['animeinfo'],
   use: 'query',
   category: 'internet',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
  if (!text) return m.reply(`Masukkan query!`)
  try {
  let res = await fetch(`https://api.jikan.moe/v4/anime?q=${text}`)
  if (!res.ok) throw new Error(await res.text())
  let json = await res.json()
  let { title, members, synopsis, episodes, url, rated, score, image_url, type, start_date, end_date } = json.data[0]
let animeingfo = `✨️ *Title:* ${title}
🎆️ *Episodes:* ${episodes}
➡️ *Start date:* ${start_date}
🔚 *End date:* ${end_date}
💬 *Show Type:* ${type}
💌️ *Rating:* ${rated}
❤️ *Score:* ${score}
👥 *Members:* ${members}
💚️ *Synopsis:* ${synopsis}
🌐️ *URL*: ${url}`
  m.reply(animeingfo)
  } catch (e) {
  m.reply('Tidak dapat menemukan judul anime tersebut')
  }
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}