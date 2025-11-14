import fetch from 'node-fetch';

export const run = {
  usage: ['meme'],
  hidden: ['memerandom', 'randommeme'],
  category: 'fun',
  async: async (m, {
    conn,
    text,
    Func,
    env
  }) => {
    conn.sendChatAction(m.chat, "upload_document")
    try {
      let kiu = ['meme', 'random', 'absurd']
      kiu = kiu[~~(Math.random() * (kiu.length))]

      let query = text ? text : kiu
      const response = await (await fetch(`https://lahelu.com/api/post/get-search?query=${query}`)).json()
      let json = response.postInfos[Math.floor(Math.random() * response.postInfos.length)]
      if (json.media) await conn.sendButton(m.chat, donateBtn, json.media, '', `*Meme ${query} with Lahelu*`, m.msg, env.wm);
      else throw new Error('Maaf, API tidak memberikan media.');
    } catch (err) {
      console.error(err);
      await m.reply(`Terjadi kesalahan: ${err.message}`);
    }
  },
  error: false,
  restrict: true,
  cache: true,
  limit: true,
  location: __filename
}