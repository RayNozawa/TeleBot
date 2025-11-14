import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

export const run = {
  usage: ['amv'],
  category: 'internet',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
    const media = [];

    conn.sendChatAction(m.chat, "upload_video")
    try {
      let resl = await animeVideo()
      media.push({
        type: 'video',
        media: resl.source,
        caption: 'Amv 1 🎥'
      })
    } catch (e) {
      console.log(e.message)
    }
    try {
      let resl = await animeVideo()
      media.push({
        type: 'video',
        media: resl.source,
        caption: 'Video kedua 🎬'
      })
    } catch (e) {
      console.log(e.message)
    }
    if (media.length > 1) {
      await conn.sendMediaGroup(m.chat, media)
    } else {
      console.log(media)
      await conn.sendButton(m.chat, donateBtn, media[0].media, 'amv.mp4', "AMV", m.msg, env.wm);
    }
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}

async function animeVideo() {
    const url = 'https://shortstatusvideos.com/anime-video-status-download/'; // Ganti dengan URL yang sesuai
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const videos = [];

    $('a.mks_button.mks_button_small.squared').each((index, element) => {
        const href = $(element).attr('href');
        const title = $(element).closest('p').prevAll('p').find('strong').text();
        videos.push({
            title,
            source: href
        });
    });

    const randomIndex = Math.floor(Math.random() * videos.length);
    const randomVideo = videos[randomIndex];

    return randomVideo;
}