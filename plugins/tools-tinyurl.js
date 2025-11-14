import axios from "axios"

export const run = {
  usage: ['tinyurl'],
  use: 'url',
  category: 'tools',
  async: async (m, { conn, text, command }) => {
    if (!text || !text.includes("http")) return m.reply("Masukkan url!")
    
    const { data } = await axios.get("https://tinyurl.com/api-create.php?url="+text)
    m.reply(data)
  },
  error: false,
  restrict: true,
  location: __filename
}