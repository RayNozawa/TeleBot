import axios from 'axios';

export const run = {
  usage: ['feloai'],
  hidden: ['felo'],
  use: 'text',
  category: 'ai',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command
  }) => {
    let q = m.quoted && m.quoted.text ? m.quoted.text : text;
    if (!q) return conn.reply(m.chat, `Gunakan format:\n*${isPrefix + command} <query>*\n\nContoh: *${isPrefix + command} cara membuat kue*\n\nAtau reply pertanyaan!`, m.msg);

    conn.sendChatAction(m.chat, "typing")
    const { data } = await axios.get(`${apiUrl}/felo?text=${text}`)
    if (!data.reply) return conn.reply(m.chat, 'Maaf, terjadi kesalahan saat memproses permintaan Anda.', m.msg);

    m.reply(data.reply)
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}