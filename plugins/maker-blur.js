import jimp from 'jimp'

export const run = {
  usage: ["blur"],
  use: "image",
  category: "maker",
  async: async (m, {
    conn,
    text
  }) => {
    conn.sendChatAction(m.chat, "upload_photo")

    let image = /photo/.test(m.type) ? await m.download() : /photo/.test(m.quoted?.type) ? await m.quoted.download() : null
    if (!image) return m.reply(`Kirim atau reply gambarnya`)
    
    const level = parseInt(text) || 5
    const img = await jimp.read(image)
    img.blur(level)

    const buffer = await img.getBufferAsync(jimp.MIME_JPEG)
    await conn.sendPhoto(m.chat, buffer, { caption: "Sukses" })
  },
  error: false,
  cache: true,
  limit: true,
  location: __filename
}