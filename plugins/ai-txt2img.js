export const run = {
  usage: ["txt2img"],
  use: "prompt",
  category: "ai",
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    env
  }) => {
    if (!text) return m.reply(`Masukkan prompt!\n\nContoh: *${isPrefix+command} beautiful girl*`)
    
    try {
        conn.sendChatAction(m.chat, "upload_photo")
        await conn.sendButton(m.chat, donateBtn, `${apiUrl}/txt2img?prompt=${text}`, 'image.jpg', '`Successfully Generated Image!`', m.msg, env.wm);
    } catch (e) {
        m.reply(e.message)
    }
  },
  error: false,
  cache: true,
  limit: true,
  location: __filename
}