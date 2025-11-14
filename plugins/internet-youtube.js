import yts from 'yt-search'

export const run = {
   usage: ['ytsearch'],
   hidden: ['yts'],
   use: 'query',
   category: 'internet',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
     if (!text) return m.reply('✳️ Apa yang Anda ingin saya telusuri di YouTube?')
     
     let [query, total] = text.split("|")
     if (total > 10) return m.reply('Maksimal total 10')
     
     conn.sendChatAction(m.chat, 'find_location')
     let results = await yts(query)
     let tes = results.all
     let teks = results.all.slice(0, 10).map(v => {
       switch (v.type) {
         case 'video': return `
- ${v.title}
- <b>URL</b> : ${v.url}
- <b>Durasi</b> : ${v.timestamp}
- <b>Upload</b> : ${v.ago}
- <b>Views</b> : ${v.views.toLocaleString("id-ID")}
- <b>Channel</b> : ${v.author.name}`.trim()
         case 'channel': return `
- <b>Channel</b> : ${v.name}
- <b>URL</b> : ${v.url}
- <b>Subscriber</b> : ${v.subCountLabel} (${v.subCount.toLocaleString("id-ID")})
- <b>Video</b> : ${v.videoCount}`.trim()
       }
     }).filter(v => v).join('\n\n________________________\n\n')
     
     try {
       await conn.sendButton(m.chat, donateBtn, tes[0].thumbnail, 'ytsearch.jpg', teks, m.msg, env.wm, "HTML");
     } catch {
       await conn.reply(m.chat, teks, m.msg, "HTML")
     }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}