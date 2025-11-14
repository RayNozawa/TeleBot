import axios from 'axios'

export const run = {
   usage: ['lyrics'],
   use: 'query',
   hidden: ['lirik', 'liriklagu'],
   category: 'internet',
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
      try {
         if (!text) return conn.reply(m.chat, Func.example(isPrefix, command, 'Sebagian Besar Kenangan'), m.msg)
         let { message_id } = await m.reply(global.status.wait)

         let data = await lyricsSearch(text)
         if (!data[0].plainLyrics) throw new Error("Lirik tidak ditemukan atau fitur sedang error!")
         await conn.editMsg(m.chat, message_id, data[0].plainLyrics, donateBtn)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m.msg)
      }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}

async function lyricsSearch(title) {
    try {
        if (!title) throw new Error('Title is required');
        
        const { data } = await axios.get(`https://lrclib.net/api/search?q=${encodeURIComponent(title)}`, {
            headers: {
                referer: `https://lrclib.net/search/${encodeURIComponent(title)}`,
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}