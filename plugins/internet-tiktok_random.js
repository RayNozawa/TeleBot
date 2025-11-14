import axios from 'axios'

const query = ['story%20wa','story%20sad','video%20fun','story%20wa%20galau','story%20wa%20sindiran','story%20wa%20bahagia','story%20wa%20lirik%20lagu%20overlay','story%20wa%20lirik%20lagu','video%20viral']

export const run = {
  usage: ['tiktokrandom'],
  hidden: ['ttrandom', 'randomtt'],
  category: 'internet',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
    conn.sendChatAction(m.chat, "upload_video")
    tiktoks(`${getRandom(query)}`).then(a => {
      let cap = a.title
      conn.sendButton(m.chat, donateBtn, a.no_watermark, 'tiktok.mp4', cap, m.msg, env.wm);
    }).catch(err => {
      m.reply(eror)
    })
  },
  error: false,
  restrict: true,
  cache: true,
  limit: true,
  location: __filename
}

function getRandom(media) {
  const randomIndex = Math.floor(Math.random() * media.length);
  return {
    source: media[randomIndex],
    index: randomIndex
  };
}

async function tiktoks(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: {
          keywords: query,
          count: 10,
          cursor: 0,
          HD: 1
        }
      });
      const videos = response.data.data.videos;
      if (videos.length === 0) {
        reject("Tidak ada video ditemukan.");
      } else {
        const gywee = Math.floor(Math.random() * videos.length);
        const videorndm = videos[gywee]; 

        const result = {
          title: videorndm.title,
          cover: videorndm.cover,
          origin_cover: videorndm.origin_cover,
          no_watermark: videorndm.play,
          watermark: videorndm.wmplay,
          music: videorndm.music
        };
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
}