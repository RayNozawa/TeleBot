import axios from "axios"
import formData from "form-data"
import * as cheerio from "cheerio"

export const run = {
   usage: ['emailcek'],
   use: 'email',
   hidden: ['gmailcek','emailcheck','mailcek','mailcheck','gmailcheck'],
   category: 'tools',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
  const email = text

  if (!email || !email.includes('@')) return m.reply(`❌ Format salah! Contoh penggunaan:\n\n*${isPrefix+command}* email@domain.com`);

  const result = await checkDataBreach(email);
  console.log(result)

  if (result.length === 0) {
    return m.reply('✅ Tidak ditemukan dalam kebocoran data.');
  } else {
    let respon = `⚠️ Ditemukan dalam ${result.length} kebocoran data:\n\n`;
    result.forEach((item, index) => {
      respon += `🔴 Kebocoran #${index + 1}\n`;
      respon += `• Sumber     : ${item.title}\n`;
      respon += `• Tanggal    : ${item.date}\n`;
      respon += `• Data Bocor : ${item.breached_data}\n`;
      respon += `• Total Data : ${item.total_breach}\n\n`;
    });
    return m.reply(respon)
  }
  },
  error: false,
  restrict: true,
  limit: true,
  location: __filename
}

async function checkDataBreach(email) {
  try {
    const url = 'https://periksadata.com/';
    const formData = new URLSearchParams();
    formData.append('email', email);

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const info = $('.text-center.col-md-6.col-lg-5 > div > h2').text();

    if (info === 'WAH SELAMAT!') {
      return [];
    }

    const breaches = [];
    $('div.col-md-6').each((i, element) => {
      try {
        const img = $(element).find('div > div > img').attr('src');
        const title = $(element).find('div.feature__body > h5').text().trim();
        const boldElements = $(element).find('div.feature__body > p > b');

        if (boldElements.length >= 3) {
          const date = $(boldElements[0]).text().trim();
          const breachedData = $(boldElements[1]).text().trim();
          const totalBreach = $(boldElements[2]).text().trim();

          breaches.push({
            img,
            title,
            date,
            breached_data: breachedData,
            total_breach: totalBreach
          });
        }
      } catch (error) {
        console.error('Error parsing breach data:', error);
      }
    });

    return breaches;
  } catch (error) {
    console.error('Error checking data breach:', error.message);
    return error.message;
  }
}