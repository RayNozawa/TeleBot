import axios from "axios";
import * as cheerio from "cheerio";

export const run = {
   usage: ['beritabola'],
   category: 'internet',
   async: async (m, {
      conn,
      text,
      Func,
      env,
      isPrefix,
      command
   }) => {
	conn.sendChatAction(m.chat, "find_location")
	try {
		const articles = await scrapeDetik();
		let caption = ""
		articles.forEach((item, index) => {
		caption += `
#${index + 1} *${item.title}*
🕓 \`${item.time || "-"}\`
🔗 ${item.link}
    `.trim() + "\n\n"
  });
  conn.reply(m.chat, caption, m.msg)
	} catch (e) {
			console.log(e)
			m.reply(`[!] Fitur Error.`)
		}
	   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}

async function scrapeDetik() {
  try {
    const { data } = await axios.get("https://sport.detik.com/sepakbola/");
    const $ = cheerio.load(data);

    const articles = [];

    $(".media__text").each((i, el) => {
      if (articles.length >= 10) return false; // stop after reaching limit
      
      const title = $(el).find("h3 a").text().trim();
      const link = $(el).find("h3 a").attr("href");
      const time = $(el).find(".media__date").text().trim();     // ganti sesuai class waktu

      if (title && link) {
        articles.push({ title, link, time });
      }
    });

    console.log("Berita ditemukan:", articles.length);
    return articles
  } catch (error) {
    console.error("Terjadi kesalahan:", error.message);
    return []
  }
}