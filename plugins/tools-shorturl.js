import axios from "axios"

export const run = {
  usage: ['shorturl'],
  use: 'url',
  category: 'tools',
  async: async (m, { conn, text, command }) => {
    if (!text || !text.includes("http")) return m.reply("Masukkan url!")
    
    const data = await shorten(text);
    m.reply(data.shorturl)
  },
  error: false,
  restrict: true,
  location: __filename
}

async function shorten(url) {
  try {
    const res = await axios.get("https://is.gd/create.php", {
      params: {
        format: "json",
        url
      }
    });
    return res.data
  } catch (e) {
    return e.message
  }
}