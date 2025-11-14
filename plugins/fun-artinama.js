import axios from 'axios'
import * as cheerio from 'cheerio'

export const run = {
  usage: ['artinama'],
  use: 'nama',
  category: 'fun',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
    if (!text) return m.reply('Namanya siapa?')

    conn.sendChatAction(m.chat, "typing")

    const { data: body } = await axios.get(`http://www.primbon.com/arti_nama.php?nama1=${text}&proses=+Submit%21+`, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })

    let $ = cheerio.load(body);
    var y = $.html().split('arti:')[1];
    var t = y.split('method="get">')[1];
    var f = y.replace(t, " ");
    var x = f.replace(/<br\s*[\/]?>/gi, "\n");
    var h = x.replace(/<[^>]*>?/gm, '');
    console.log("" + h);
    m.reply(`Arti Dari Nama ${text} Adalah\n\n${h}`)
  },
  error: false,
  restrict: true,
  limit: true,
  cache: true,
  location: __filename
}