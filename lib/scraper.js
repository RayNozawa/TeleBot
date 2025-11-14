import axios from 'axios';
import * as cheerio from 'cheerio';
import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';

const Scraper = {}

Scraper.catBox = async (buffer) => {
    try {
        const tempFolder = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder, { recursive: true });

        const filename = Math.random().toString(36).substring(2, 12) + ".jpg";
        const filePath = path.join(tempFolder, filename);
        await fs.promises.writeFile(filePath, buffer);

        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('userhash', '');
        form.append('fileToUpload', fs.createReadStream(filePath));

        const response = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders(),
        });

        const result = response.data.startsWith('https://') 
            ? { status: true, creator: "Zhenn Sweet", data: { url: response.data } }
            : { status: false, creator: "Zhenn Sweet", data: { message: response.data } };

        // Hapus file setelah diunggah
        await fs.promises.unlink(filePath);

        return result;
    } catch (error) {
        console.error('Error:', error.message);
        return { status: false, creator: "Zhenn Sweet", data: { message: error.message } };
    }
};

Scraper.Chatgpt = async(prompt) => {
    const options = {
        method: 'POST',
        url: 'https://chatgpt-42.p.rapidapi.com/gpt4',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
            'x-rapidapi-key': '9a505f9b9bmshbe90091aa54ced2p1d933fjsne1ddcc61fbe1'
        },
        data: {
            messages: [{ role: 'user', content: prompt }],
            web_access: true
        }
    };

    try {
        const response = await axios.request(options);
        return {
            status: true,
            creator: "ZhennSweet",
            data: response.data.result
        };
    } catch (error) {
        console.error("Error fetching GPT response:", error);
        return {
            status: false,
            creator: "ZhennSweet",
            data: "false"
        };
    }
}

Scraper.cosplays = async (query) => {
  try {
    const searchUrl = `https://cosplaytele.com/?s=${encodeURIComponent(query)}`;
    const { data: searchData } = await axios.get(searchUrl);
    const $ = cheerio.load(searchData);
    const articleUrls = [];

    $('.post-title a').each((_, el) => {
      const url = $(el).attr('href');
      if (url && url.toLowerCase().includes(query.toLowerCase())) {
        articleUrls.push(url);
      }
    });

    if (articleUrls.length === 0) {
      return {
        creator: "Zhenn Sweet",
        status: false,
        data: {
          message: "No relevant articles found."
        }
      };
    }

    const randomArticleUrl = articleUrls[Math.floor(Math.random() * articleUrls.length)];
    const { data: articleData } = await axios.get(randomArticleUrl);
    const $$ = cheerio.load(articleData);
    const photosText = $$('p:contains("Photos:")').text();
    const maxPhotos = parseInt(photosText.match(/Photos:\s*(\d+)/)?.[1] || '0', 10);
    const imageUrls = [];
    $$('figure img, .entry-content img').each((_, el) => {
      const imgUrl = $$(el).attr('src');
      if (imgUrl && !imageUrls.includes(imgUrl)) {
        imageUrls.push(imgUrl);
      }
    });

    if (imageUrls.length === 0) {
      return {
        creator: "Zhenn Sweet",
        status: false,
        data: {
          message: "No images found in the article."
        }
      };
    }

    return {
      creator: "Zhenn Sweet",
      status: true,
      data: {
        maxPhotos,
        url: imageUrls.slice(0, maxPhotos)
      }
    };

  } catch (error) {
    return {
      creator: "Zhenn Sweet",
      status: false,
      data: {
        message: error.message
      }
    };
  }
};

Scraper.videy = async (pageUrl) => {
   try {
    const videoId = new URL(pageUrl).searchParams.get('id');
    if (!videoId) {
        console.error('Video ID not found');
        return;
    }
    let fileType = '.mp4';
    if (videoId.length === 9 && videoId[8] === '2') {
        fileType = '.mov';
    }
    const videoLink = `https://cdn.videy.co/${videoId}${fileType}`;
        return {
         creator: "ZhennSweet",
         status: true,
         data: videoLink
      }
    } catch (error) {
        console.error(error);
        return {
        creator: "ZhennSweet",
        status: false,
        message: error
      };
   }
}

Scraper.stalkml = async (userId, zoneId) => {
    try {
      const getToken = async (url) => {
        try {
          const response = await axios.get(url);
          const cookies = response.headers["set-cookie"];
          const joinedCookies = cookies ? cookies.join("; ") : null;

          const csrfTokenMatch = response.data.match(/<meta name="csrf-token" content="(.*?)">/);
          const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : null;

          if (!csrfToken || !joinedCookies) {
            throw new Error("Gagal mendapatkan CSRF token atau cookie.");
          }

          return { csrfToken, joinedCookies };
        } catch (error) {
          console.error("❌ Error fetching cookies or CSRF token:", error.message);
          throw error;
        }
      };

      const { csrfToken, joinedCookies } = await getToken("https://www.gempaytopup.com");

      const payload = { uid: userId, zone: zoneId };
      const { data } = await axios.post("https://www.gempaytopup.com/stalk-ml", payload, {
          headers: {
            "X-CSRF-Token": csrfToken,
            "Content-Type": "application/json",
            Cookie: joinedCookies,
          },
        }
      );

      return data;
    } catch (error) {
    console.log(error)
  }
}
export default Scraper;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

fs.watchFile(__filename, () => {
  fs.unwatchFile(__filename);
  console.log(chalk.redBright("Update 'scraper.js'"));
  import(__filename);
});