import fetch from "node-fetch"

export const run = {
  usage: ['gptvoc'],
  use: 'text',
  category: 'ai',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command
  }) => {
    let q = m.quoted && m.quoted.text ? m.quoted.text : text
    if (!q) return m.reply("Masukkan atau reply pertanyaan")
    conn.sendChatAction(m.chat, "typing")
    try {
      let res = await ChatGpt(q)
      await m.reply(res.content)
    } catch (e) {
      await m.reply(e.message)
    }
  },
  error: false,
  restrict: true,
  cache: true,
  limit: true,
  location: __filename
}

const ChatGpt = async (prompt) => {
    const url = "https://apps.voc.ai/api/v1/plg/prompt_stream";

    try {
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt
            }),
        });

        const inputString = await response.text();
        const dataArray = inputString.split('\n\n');

        const regex = /data: (\{.*?\})/g;
        const jsonMatches = [];
        let match;

        while ((match = regex.exec(dataArray[0])) !== null) {
            jsonMatches.push(match[1]);
        }

        const oregex = /"data": ({.*?})/;
        const endsTrueArray = jsonMatches.slice(-1);
        const output = endsTrueArray[0].match(oregex);

        return output ? JSON.parse(output[1]) : null;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};