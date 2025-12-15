import axios from 'axios'

export const run = {
  usage: ['deepenglish'],
  hidden: ['deepeng', 'degl'],
  use: 'text',
  category: 'ai',
  async: async (m, {
    conn,
    text
  }) => {
    if (!text) return m.reply('Masukkan pertanyaan')

    conn.sendChatAction(m.chat, "typing")
    
    const { data } = await axios.get(`${apiUrl}/deepenglish?text=${text}`)
    if (!data.reply) return conn.reply(m.chat, 'Maaf, terjadi kesalahan saat memproses permintaan Anda.', m.msg);
    m.reply(data.reply)
  },
  error: false,
  limit: true,
  restrict: true,
  cache: true,
  location: __filename
}