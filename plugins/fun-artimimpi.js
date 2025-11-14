import axios from "axios"
import * as cheerio from 'cheerio'

export const run = {
  usage: ['artimimpi'],
  use: 'query',
  category: 'fun',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
    if (!text) return m.reply(`Mimpinya Apa?\nCukup masukkan 1 kata agat tidak error, Contoh *${isPrefix+command} ular*`)

    conn.sendChatAction(m.chat, "typing")

    const { data: body } = await axios.get(`https://www.primbon.com/tafsir_mimpi.php?mimpi=${text}&submit=+Submit+`, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
    
    let $ = cheerio.load(body);
    var y = $.html().split('kunci:')[1];
    var t = y.split('method="get">')[1];
    var f = y.replace(t, " ");
    var x = f.replace(/<br\s*[\/]?>/gi, "\n");
    var h = x.replace(/<[^>]*>?/gm, '');
    var zet = h.replace("&lt; Kembali", "");
    console.log("" + zet);
    m.reply(`Artimimpi:${zet}`)
  },
  error: false,
  restrict: true,
  limit: true,
  cache: true,
  location: __filename
}