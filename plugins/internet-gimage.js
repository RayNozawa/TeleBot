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
      const { data } = await axios.get(`https://restapi-v2.simplebot.my.id/search/gimage?q=${text}`);

      const images = [...new Set(data.result.map(v => v.url))].slice(0, 20);
      const caption = `Result from ${text}`;

      const batches = createBatches(images, 10);

      for (const batch of batches) {
        const media = [];

        for (let i = 0; i < batch.length; i++) {
          try {
            const { buffer, filename } = await getImage(batch[i]);

            media.push({
              type: 'photo',
              media: batch[i],
              caption: i === 0 ? caption : undefined
            });
          } catch {
            // skip image rusak
          }
        }

        if (media.length > 1) {
          await conn.sendMediaGroup(m.chat, media);
        }
      }

    } catch (e) {
      m.reply(e.message);
    }
  }
};

function createBatches(arr, size = 10) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

async function getImage(url) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'image/*'
    }
  });

  const type = res.headers['content-type'];
  if (!type || !type.startsWith('image/')) {
    throw new Error('Not image');
  }

  const ext = type.split('/')[1];
  return {
    buffer: Buffer.from(res.data),
    filename: `image.${ext}`
  };
}
