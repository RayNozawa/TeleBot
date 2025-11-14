import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
    const result = await felo.ask(q);
    if (!result) return conn.reply(m.chat, 'Maaf, terjadi kesalahan saat memproses permintaan Anda.', m.msg);

    const { answer, source } = result;
    if (!answer) await conn.reply(m.chat, 'Maaf, tidak ditemukan jawaban untuk pertanyaan Anda.', m.msg);

    m.reply(answer)
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}

const felo = {
  ask: async function (query) {
    const headers = {
      "Accept": "*/*",
      "User-Agent": "Postify/1.0.0",
      "Content-Encoding": "gzip, deflate, br, zstd",
      "Content-Type": "application/json",
    };

    const payload = {
      query,
      search_uuid: uuidv4().replace(/-/g, ''),
      search_options: { langcode: "id-MM" },
      search_video: true,
    };

    const request = (badi) => {
      const result = { answer: '', source: [] };
      badi.split('\n').forEach(line => {
        if (line.startsWith('data:')) {
          try {
            const data = JSON.parse(line.slice(5).trim());
            if (data.data) {
              if (data.data.text) {
                result.answer = data.data.text.replace(/\[\d+\]/g, '');
              }
              if (data.data.sources) {
                result.source = data.data.sources.map(src => ({
                  url: src.url || '',
                  title: src.title || ''
                }));
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
      });
      return result;
    };

    try {
      const response = await axios.post("https://api.felo.ai/search/threads", payload, {
        headers,
        timeout: 30000,
        responseType: 'text',
      });

      return request(response.data);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
