import axios from "axios"

export const run = {
  usage: ['aimuslim'],
  hidden: ['muslimai'],
  use: 'text',
  category: 'ai',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command
  }) => {
    if (!text) return m.reply(`✨ Hallo! Ada yang bisa saya bantu?\n\nContoh: ketik *${isPrefix+command}* diikuti dengan pertanyaan Anda.`);

    try {
        conn.sendChatAction(m.chat, "typing")
        const { data } = await axios.get(`${apiUrl}/muslimai?text=${text}`)
        if (!data.reply) return conn.reply(m.chat, 'Maaf, terjadi kesalahan saat memproses permintaan Anda.', m.msg);
        m.reply(data.reply)
    } catch (e) {
        await m.reply(' Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.');
    }
  },
  error: false,
  restrict: true,
  cache: true,
  limit: true,
  location: __filename
}