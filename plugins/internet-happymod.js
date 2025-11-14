import axios from 'axios'
import * as cheerio from 'cheerio'

export const run = {
   usage: ['happymod'],
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
    if (!text) return m.reply(`Masukan Query!\n\nContoh:\n${isPrefix + command} minecraft`)
    let result = await happymod(text)
    let teks = result.map((v, i) => {
        return `
*${i + 1}.* ${v.name}
❃ Link: ${v.link}
`.trim()
    }).filter(v => v).join('\n\n\n')
    await m.reply(teks)
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}

async function happymod(query) {
    try {
        const url = `https://www.happymod.cloud/search.html?q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
            }
        });

        const $ = cheerio.load(data);
        let hasil = [];

        $("li.list-item").each((i, el) => {
            const name = $(el).find(".list-info-title").text().trim();
            const link = $(el).find("a.list-box").attr("href");
            const icon = $(el).find(".list-icon img").attr("data-src"); // pakai data-src

            if (name && link) {
                hasil.push({
                    name,
                    link: `https://www.happymod.cloud${link}`,
                    icon
                });
            }
        });

        return hasil;
    } catch (err) {
        console.error("Error scraping:", err.message);
        return [];
    }
}