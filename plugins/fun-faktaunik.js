import fetch from 'node-fetch';
import axios from "axios";

export const run = {
  usage: ['faktaunik'],
  category: 'fun',
  async: async (m, {
    conn,
    text,
    command,
    isPrefix,
    env
  }) => {
    conn.sendChatAction(m.chat, "typing")
    try {
      var json = await (await fetch(`https://nekos.life/api/v2/fact`)).json()
      let { text: result } = (await axios.get(`https://smail.my.id/translate?text=${json.fact}`)).data
      m.reply(result)
    } catch (err) {
      m.reply('Gagal mendapatkan data')
    }
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}