import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

let timeout = 120000

export const run = {
   usage: ['tebakkabupaten'],
   hidden: ['tkabupaten'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    conn.tebakkabupaten = conn.tebakkabupaten ? conn.tebakkabupaten : {}
    let id = m.chat
    if (id in conn.tebakkabupaten) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkabupaten[id][0])

  let json = await getRandomKabupaten()
  let caption = `*${command.toUpperCase()}*
Kabupaten apakah ini?
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${isPrefix}hkab untuk bantuan
Bonus: ${env.expgame} XP
    `.trim()
    conn.tebakkabupaten[id] = [
        await conn.sendButton(m.chat, [{name: "Bantuan💢", command: ".hkab"}], json.url, 'tebakkabupaten.jpg', caption, m.msg, env.wm),
        json,
        setTimeout(() => {
            if (conn.tebakkabupaten[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.title}*`, conn.tebakkabupaten[id][0])
            delete conn.tebakkabupaten[id]
        }, timeout)
    ]
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}

const baseUrl = 'https://id.m.wikipedia.org';
async function getRandomKabupaten() {
  try {
    const response = await fetch(baseUrl + '/wiki/Daftar_kabupaten_di_Indonesia');
    const html = await response.text();
    const $ = cheerio.load(html);

    const kabupatenList = $('td a[href^="/wiki/Kabupaten"]').map((index, element) => ({
      link: baseUrl + $(element).attr('href'),
      name: $(element).attr('title')
    })).get().filter(item => item.link && item.name);

    if (kabupatenList.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * kabupatenList.length);
    const randomKabupaten = kabupatenList[randomIndex];

    const imageUrl = await fetchImageUrl(randomKabupaten.link);
    const judul = randomKabupaten.name;
    const judulBaru = judul.replace('Kabupaten ', '');
    const linkGambar = imageUrl;
    const ukuranBaru = linkGambar.replace(/\/\d+px-/, '/1080px-');

    return {
      link: randomKabupaten.link,
      title: judulBaru,
      url: ukuranBaru
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function fetchImageUrl(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    return 'https:' + $('tr.mergedtoprow td.infobox-full-data.maptable div.ib-settlement-cols-row div.ib-settlement-cols-cell a.mw-file-description img.mw-file-element').attr('src') || null;
  } catch (error) {
    return null;
  }
}