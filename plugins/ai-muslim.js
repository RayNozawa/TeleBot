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
        const result = await muslimai(text);
        m.reply(result.answer)
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

async function muslimai(query) {
    const searchUrl = 'https://www.muslimai.io/api/search';

    const searchData = {
        query: query
    };

    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        const searchResponse = await axios.post(searchUrl, searchData, { headers: headers });

        const passages = searchResponse.data.map(item => item.content).join('\n\n');

        const answerUrl = 'https://www.muslimai.io/api/answer';

        const answerData = {
            prompt: `Use the following passages to answer the query to the best of your ability as a world-class expert in the Quran. Do not mention that you were provided any passages in your answer: ${query}\n\n${passages}`
        };

        const answerResponse = await axios.post(answerUrl, answerData, { headers: headers });

        const result = {
            answer: answerResponse.data,
            source: searchResponse.data
        };

        return result;
    } catch (error) {
        console.error('Error occurred:', error.response ? error.response.data : error.message);
        return { answer: 'Maaf, saya tidak dapat menjawab pertanyaan Anda saat ini.' };
    }
}