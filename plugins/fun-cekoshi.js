import axios from 'axios'
import pinterest from "../lib/pinterest.js"

export const run = {
  usage: ['cekoshi'],
  hidden: ['oshi', 'oshinya', 'oshicek'],
  category: 'fun',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
    conn.sendChatAction(m.chat, "typing")

    let { data: src } = await axios.get(`${apiUrl}/tebakmemberjkt48`)

    const nama = `*${text ? text : await getName(m.sender)}*`
    const capt = `Oshi ${nama} Adalah *${src.nama} - ${src.gen}*`
    const query = `${src.nama} JKT48`

    let image = await pinterest(query);
    image = image[~~(Math.random() * (image.length))].image

    if (!image) return m.reply(capt)

    await conn.sendButton(m.chat, donateBtn, image, 'oshi.jpg', capt, m.msg, env.wm)
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}