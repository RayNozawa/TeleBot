import axios from 'axios';
import * as cheerio from 'cheerio';

const dongeng = {
  list: async () => {
    let nextPageUrl = 'https://www.1000dongeng.com/';
    const posts = [];

    try {
      while (nextPageUrl) {
        const {
          data
        } = await axios.get(nextPageUrl);
        const $ = cheerio.load(data);

        $('.date-outer .date-posts .post-outer').each((index, element) => {
          const title = $(element).find('.post-title a').text();
          const link = $(element).find('.post-title a').attr('href');
          const author = $(element).find('.post-author .fn').text().trim();
          const date = $(element).find('.post-timestamp .published').text();
          const image = $(element).find('.post-thumbnail amp-img').attr('src') || 'Image not available';

          posts.push({
            title,
            link,
            author,
            date,
            image
          });
        });

        const nextLink = $('.blog-pager-older-link').attr('href');
        nextPageUrl = nextLink ? nextLink : null;
      }

      return {
        total: posts.length,
        posts
      };
    } catch (error) {
      throw new Error('Error fetching the website: ' + error.message);
    }
  },

  getDongeng: async (url) => {
    try {
      const {
        data
      } = await axios.get(url);
      const $ = cheerio.load(data);

      const title = $('h1.post-title.entry-title').text().trim();
      const author = $('.post-author .fn').text().trim();
      const storyContent = $('.superarticle').find('div').map((i, el) => {
        return $(el).text().trim();
      }).get().join('\n');

      return {
        title,
        author,
        storyContent
      };
    } catch (error) {
      throw new Error('Error fetching the dongeng: ' + error.message);
    }
  }
};

export const run = {
  usage: ['dongeng'],
  hidden: ['dongenglist'],
  use: 'url',
  category: 'fun',
  async: async (m, {
    conn,
    text,
    command,
    isPrefix,
    env
  }) => {
    const args = text.split(" ")
    if (command === 'dongenglist') {
      try {
        if (!text) m.reply(`${isPrefix}dongenglist *10*\nuntuk filter hasil menjadi 10\n\n${isPrefix}dongeng *url*\nuntuk melihat cerita`)
        const {
          total,
          posts
        } = await dongeng.list();

        const sliceCount = args[0] ? parseInt(args[0]) : posts.length; // Menggunakan text sebagai jumlah jika ada, jika tidak ambil semua posts

        const message = `✅ *Daftar Dongeng* (${sliceCount ? sliceCount : total} total)\n\n` +
          posts.slice(0, sliceCount).map((post, i) => `${i + 1}. ${post.title}\nLink: ${post.link}\n`).join('\n') +
          `\nKetik *.dongeng link* untuk membaca dongeng.`;

        m.reply(message);
      } catch (error) {
        m.reply(`gagal: ${error.message}`);
      }
    }

    if (command === 'dongeng') {
      if (!text) return m.reply(`masukkan link dari dongenglist\nKetik: *${isPrefix}dongenglist* untuk mancari url`);

      const url = args[0];
      try {
        const {
          title,
          author,
          storyContent
        } = await dongeng.getDongeng(url);
        const message = `📖 *${title}*\n✍️ *Penulis*: ${author}\n\n${storyContent.slice(0, 2000)}...\n\n` +
          'Cerita terlalu panjang? Buka di link berikut:\n' + url;

        m.reply(message);
      } catch (error) {
        m.reply(`${error.message}`);
      }
    }
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}