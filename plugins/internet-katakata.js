import axios from 'axios'
import * as cheerio from 'cheerio'

export const run = {
   usage: ['quotes'],
   hidden: ['katakata','quote','kata-kata'],
   use: 'query',
   category: 'internet',
   async: async (m, {
      conn,
      text,
      Func,
      env,
      isPrefix,
      command
   }) => {
  if (!text) return m.reply(`Masukkan judul nya\ncontoh: ${isPrefix + command} bucin`)
  try {
    const kata = await katakata(text);
    let result = `✨ *Kata-Kata*\n\> ${getRandom(kata).quotes}\n  [ *${getRandom(kata).author}* ]`
    await m.reply(result)
  } catch (e) {
    m.reply(e.message)
  }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}

async function katakata(nama) {
    let zaenishi = await axios.get(`https://www.goodreads.com/quotes/search?q=${nama}`);
    let $ = cheerio.load(zaenishi.data);
    let hasil = [];

    $('.quoteText').each((index, element) => {
      let selectedQuote = $(element).clone()
        .children()
        .remove()
        .end()
        .text()
        .replace(/\s+/g, ' ')
        .replace(/―/g, '')
        .trim();

      let selectedAuthor = $(element).find('.authorOrTitle').text().trim();
      let formattedAuthor = selectedAuthor.replace(/\s+/g, ' ').trim();

      hasil.push({
        quotes: selectedQuote,
        author: formattedAuthor
      });
    });

    return hasil;
  }