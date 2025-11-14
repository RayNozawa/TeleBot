import fetch from 'node-fetch';
import axios from "axios";

export const run = {
  usage: ['randomquotes'],
  hidden: ['randomquote', 'quoterandom', 'quotesrandom'],
  category: 'internet',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    Func,
    env
  }) => {
    conn.sendChatAction(m.chat, 'typing')
    try {
      var json = await (await fetch(`https://favqs.com/api/qotd`)).json()
      let { text: result } = (await axios.get(`${apiUrl}/translate?text=${json.quote.body}`)).data
            
      m.reply(`Penulis: *${json.quote.author}*\n\n*${json.quote.body}*\n\n*${result}*`)
    } catch (err) {
      m.reply('Gagal mendapatkan data: ' + err.message)
    }
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}