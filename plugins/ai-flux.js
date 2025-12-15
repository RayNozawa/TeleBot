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
    await conn.sendButton(m.chat, donateBtn, `${apiUrl}/flux?prompt=${text}`, 'hasil.jpg', `Hasil Flux:\n\nPrompt: ${text}`, m.msg, env.wm);
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