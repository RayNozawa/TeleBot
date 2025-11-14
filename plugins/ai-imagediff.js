import axios from "axios"
import * as cheerio from "cheerio"

export const run = {
  usage: ["imagediff"],
  hidden: ["imagedif","imgdiff","imgdif","buatgambar","createimage","createimg"],
  use: "prompt",
  category: "ai",
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    env
  }) => {
    if (!text) return m.reply(`Masukkan prompt!\n\nContoh: *${isPrefix+command} beautiful girl*`)
    
    try {
        conn.sendChatAction(m.chat, "upload_photo")
        const img = await txttoimage(text)
        await conn.sendButton(m.chat, donateBtn, img, 'image.jpg', '`Successfully Generated Image!`', m.msg, env.wm);
    } catch (e) {
        m.reply(e.message)
    }
  },
  error: false,
  cache: true,
  limit: true,
  location: __filename
}

async function txttoimage(prompt) {
  const datapost =
    `prompt=${encodeURIComponent(prompt)}`;
  const h = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://www.texttoimage.org/'
  };
  const res = await axios.post(
    'https://www.texttoimage.org/generate',
    datapost, {
      headers: h
    });
  const result = res.data;
  if (!result.success || !result
    .url) {
    throw new Error(
      'gagal dapat url image'
    );
  }
  const pageurl =
    `https://www.texttoimage.org/${result.url}`;
  const pageres = await axios.get(
    pageurl);
  const $ = cheerio.load(pageres
    .data);
  const imgtag = $(
    'a[data-lightbox="image-set"] img'
  );
  const imgsrc = imgtag.attr(
    'src');
  if (!imgsrc) {
    throw new Error(
      'gagal nemu gambar di halaman hasil'
    );
  }
  const Imgfinal =
    `https://www.texttoimage.org${imgsrc}`;
  return Imgfinal;
}