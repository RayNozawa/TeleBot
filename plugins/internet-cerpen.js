import axios from 'axios'
import * as cheerio from 'cheerio'

export const run = {
  usage: ['cerpen'],
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
    if (!text) return m.reply(`Masukkan kategori!\n\nContoh: ${isPrefix+command} motivasi`)
    conn.sendChatAction(m.chat, "typing")
    try {
      const cp = await Cerpen(text)
      m.reply(`Judul: ${cp.title ? cp.title : 'null'}\nAuthor: ${cp.author ? cp.author : 'null'}\n\n${cp.cerita ? cp.cerita : 'null'}`)
    } catch (e) {
      return m.reply('Terjadi kesalahan, atau kategori yang kamu masukkan tidak ditemukan, silahkan coba lagi')
    }
  },
  error: false,
  restrict: true,
  cache: true,
  limit: true,
  location: __filename
}

async function Cerpen(category) {
    try {
        let title = category.toLowerCase().replace(/[()*]/g, "");
        let judul = title.replace(/\s/g, "-");
        let page = Math.floor(Math.random() * 5) + 1;
        let get = await axios.get('http://cerpenmu.com/category/cerpen-' + judul + '/page/' + page);
        let $ = cheerio.load(get.data);
        let link = [];
        $('article.post').each(function (a, b) {
            link.push($(b).find('a').attr('href'));
        });
        let random = link[Math.floor(Math.random() * link.length)];
        let res = await axios.get(random);
        let $$ = cheerio.load(res.data);
        let hasil = {
            title: $$('#content > article > h1').text(),
            author: $$('#content > article').text().split('Cerpen Karangan: ')[1]?.split('Kategori: ')[0]?.trim(),
            kategori: $$('#content > article').text().split('Kategori: ')[1]?.split('\n')[0]?.trim(),
            lolos: $$('#content > article').text().split('Lolos: ')[1]?.split('\n')[0]?.trim(),
            cerita: $$('#content > article > p').text()
        }
        return hasil
    } catch (e) {
        throw e
    }
}
