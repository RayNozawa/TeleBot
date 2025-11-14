import axios from 'axios'
import * as cheerio from 'cheerio'

export const run = {
  usage: ['bingsearch'],
  hidden: ['bings'],
  use: 'query',
  category: 'ai',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    Func,
    env
  }) => {
    if (!text) return m.reply(`Masukkan pencarian!\n\nContoh: ${isPrefix + command} Openai`)

    conn.sendChatAction(m.chat, "typing")
    axios.get('https://www.bing.com/search?q=' + text)
      .then(response => {
        const $ = cheerio.load(response.data);
        const searchResults = [];

        $('.b_algo').each((index, element) => {
          const title = $(element).find('h2').text();
          const url = $(element).find('a').attr('href');
          const description = $(element).find('.b_caption p').text();

          searchResults.push({
            title,
            url,
            description
          });
        });
        let bing = `*Bing Search From:* ${text}\n\n`;
        for (let g of searchResults) {
          bing += ` *Title* : ${g.title}\n`;
          bing += ` *Description* : ${g.description}\n`;
          bing += ` *Link* : ${g.url}\n\n`;
        }
        m.reply(bing)
      }).catch(err => {
        m.reply(eror)
      })
  },
  error: false,
  restrict: true,
  cache: true,
  limit: true,
  location: __filename
}