import axios from 'axios';
import * as cheerio from 'cheerio';

export const run = {
   usage: ['gsmarena'],
   hidden: ['gsmspek','carihp','spekhp','hpspek'],
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
  if (!text) return m.reply('Mau Cari Hp Ap');
  
  m.reply('Search for HP Specifications...');
  
  const phoneUrl = await searchPhone(text);
  if (!phoneUrl) return m.reply(`HP "${text}" tidak ditemukan!`);

  const result = await scrapeAllSpecs(phoneUrl);
  if (!result) return m.reply(`Gagal mendapatkan data untuk "${text}"`);

  const { phoneName, specs, prices, imageUrl } = result;
  
  let specText = `${phoneName}\n`;
  
  if (prices) {
    specText += `\nHarga :\n`;
    Object.entries(prices).forEach(([currency, price]) => {
      specText += `- ${currency} : ${price}\n`;
    });
  }
  
  Object.entries(specs).forEach(([category, details]) => {
    specText += `\n${category} :\n`;
    Object.entries(details).forEach(([key, value]) => {
      specText += `- ${key} : ${value}\n`;
    });
  });
  
  if (imageUrl && imageUrl !== 'N/A') {
    await conn.sendButton(m.chat, donateBtn, imageUrl, 'gsmarena.jpg', specText, m.msg, env.wm);
  } else {
    m.reply(specText);
  }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}

async function searchPhone(phoneName) {
  try {
    const searchUrl = `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(phoneName)}`;
    const { data } = await axios.get(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    const phoneLink = $('.makers ul li a').first().attr('href');
    return phoneLink ? `https://www.gsmarena.com/${phoneLink}` : null;
  } catch (error) {
    return null;
  }
}

async function getExchangeRates() {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR');
    return response.data.rates;
  } catch (error) {
    return null;
  }
}

async function scrapeAllSpecs(url) {
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    const specs = {};
    
    $('div#specs-list table').each((_, table) => {
      const category = $(table).find('th').text().trim();
      const specDetails = {};
      $(table).find('tr').each((_, row) => {
        const key = $(row).find('td.ttl').text().trim();
        const value = $(row).find('td.nfo').text().trim();
        if (key && value) specDetails[key] = value;
      });
      if (category && Object.keys(specDetails).length) specs[category] = specDetails;
    });

    const phoneName = $('h1').text().trim();
    const priceEur = specs['Misc']?.['Price'] || 'N/A';
    let prices = { EUR: priceEur };
    if (priceEur !== 'N/A' && priceEur.includes('EUR')) {
      const eurValue = parseFloat(priceEur.match(/[\d.]+/)[0]);
      const rates = await getExchangeRates();
      if (rates) {
        prices = {
          EUR: `${eurValue.toFixed(2)} EUR`,
          USD: (eurValue * rates.USD).toFixed(2) + ' USD',
          IDR: (eurValue * rates.IDR).toFixed(0) + ' IDR'
        };
      }
    }

    const imageUrl = $('.specs-photo-main img').attr('src') || 'N/A';

    return { phoneName, specs, prices, imageUrl };
  } catch (error) {
    return null;
  }
}