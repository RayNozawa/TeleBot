import axios from "axios";

export const run = {
  usage: ['gimage'],
  hidden: ['googleimage'],
  use: 'query',
  category: 'internet',
  async: async (m, { conn, text, isPrefix, command, env }) => {
    if (!text) return conn.reply(m.chat, Func.example(isPrefix, command, env.botname), m.msg)

    conn.sendChatAction(m.chat, "upload_photo");

    try {
      const { data } = await axios.get(`${apiUrl}/gimage?query=${text}`);

      const caption = `Result from ${text}`;
      
      const media = [];
      for (let i = 0; i < data.length; i++) {
        media.push({
          type: 'photo',
          media: data[i],
          caption: i === 0 ? caption : undefined
        });
      }
        
      if (media.length > 1) {
        await conn.sendMediaGroup(m.chat, media);
      } else {
        await conn.sendPhoto(m.chat, media[0].media, { caption });
      }
    } catch (e) {
      m.reply(e.message);
    }
  }
};