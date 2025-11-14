import axios from "axios"
import * as cheerio from "cheerio"

export const run = {
   usage: ['mediafiresearch'],
   hidden: ["mfsearch","mfsrc"],
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
       if (!text) return m.reply(`Masukkan pencarian untuk pinterest\n\nContoh: *${isPrefix+command} cheat*`)
       
       conn.sendChatAction(m.chat, "typing")
       const search = toString(await mfsearch(text))
       m.reply(search)
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}

function toString(object, indent = 0) {
  if (typeof object === 'string') {
    return `"${object}"`;
  }
  const pad = '  '.repeat(indent);
  return Object.entries(object).map(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      return `${pad}*${key}*:\n${toString(value, indent + 1)}`;
    } else {
      return `${pad}*${key}*: ${value}`;
    }
  }).join('\n');
}
  
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function mfsearch(query) {
    try {
        if (!query) throw new Error('Query is required.');
        
        const { data: html } = await axios.get(`https://api.nekolabs.web.id/px?url=${encodeURIComponent(`https://mediafiretrend.com/?q=${encodeURIComponent(query)}&search=Search`)}`);
        const $ = cheerio.load(html.result.content);
        
        const links = shuffle(
            $('tbody tr a[href*="/f/"]').map((_, el) => $(el).attr('href')).get()
        ).slice(0, 5);
        
        const result = await Promise.all(links.map(async link => {
            const { data } = await axios.get(`https://api.nekolabs.web.id/px?url=${encodeURIComponent(`https://mediafiretrend.com${link}`)}`);
            const $ = cheerio.load(data.result.content);
            
            const raw = $('div.info tbody tr:nth-child(4) td:nth-child(2) script').text();
            const match = raw.match(/unescape\(['"`]([^'"`]+)['"`]\)/);
            const decoded = cheerio.load(decodeURIComponent(match[1]));
            
            return {
                filename: $('tr:nth-child(2) td:nth-child(2) b').text().trim(),
                filesize: $('tr:nth-child(3) td:nth-child(2)').text().trim(),
                url: decoded('a').attr('href'),
                source_url: $('tr:nth-child(5) td:nth-child(2)').text().trim(),
                source_title: $('tr:nth-child(6) td:nth-child(2)').text().trim()
            };
        }));
        
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};