import axios from "axios";

export const run = {
  usage: ['flux'],
  use: 'prompt',
  category: 'ai',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    env
  }) => {
  if (!text) return m.reply(`Masukkan prompt!\n\nContoh: ${isPrefix+command} pemandangan indah`)

  try {
    conn.sendChatAction(m.chat, "upload_photo")
    const result = await fluximg.create(text);
    if (result && result.imageLink) {
      await conn.sendButton(m.chat, donateBtn, result.imageLink, 'hasil.jpg', `Hasil Flux:\n\nPrompt: ${text}`, m.msg, env.wm);
    } else {
      throw new Error("Gagal membuat gambar. Coba lagi.");
    }
  } catch (error) {
    return m.reply("Terjadi kesalahan saat membuat gambar: " + error.message)
  }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}

const fluximg = {
  defaultRatio: "2:3",

  create: async (query) => {
    const config = {
      headers: {
        accept: "*/*",
        authority: "1yjs1yldj7.execute-api.us-east-1.amazonaws.com",
        "user-agent": "Postify/1.0.0",
      },
    };

    try {
      const response = await axios.get(`https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image?prompt=${encodeURIComponent(query)}&aspect_ratio=${fluximg.defaultRatio}`,
        config
      );
      return {
        imageLink: response.data.image_link,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
