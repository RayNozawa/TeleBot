import axios from 'axios'

export const run = {
   usage: ['aio','instagram'],
   use: 'url',
   hidden: ['dl','download','ig'],
   category: 'downloader',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      Scraper
   }) => {
     const url = text ? text : m.quoted?.text ? m.quoted.text : m.quoted?.caption ? m.quoted.caption : m.quoted?.description ? m.quoted.description : text;
     
     if (!url || !url.match(/https/gi)) return m.reply(Func.example(isPrefix, command, 'https://vm.tiktok.com/ZSjFAS5mf/'))
     
     const urlRegex = /(https?:\/\/[^\s`]+)/g;
     const match = url.match(urlRegex);
     const cleanUrl = match[0];

     conn.sendChatAction(m.chat, 'upload_document')
     try {
       const res = await fetch(`${apiUrl}/aio?url=${encodeURIComponent(cleanUrl)}`);
       const json = await res.json();
       
       if (json.error) return m.reply(`Gagal mengambil media: ${json.message || 'URL tidak valid atau tidak didukung.'}`);
       if (!json.medias || json.medias.length === 0) return m.reply('Tidak ada media yang ditemukan.');
       
       const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
       
       for (let i = 0; i < json.medias.length; i++) {
         let media = json.medias[i];
         let resultUrl = media.url;
         if (!resultUrl) continue;
         
         let caption = `[ AIO Downloader ]\n\nAuthor: ${json.author || '-'}\nTitle: ${json.title || '-'}\nSource: ${json.source || '-'}\n`;
         caption += `Media: ${i + 1}\n`;
         
         for (let key in media) {
           if (key !== 'url' && typeof media[key] === 'string') {
             caption += `${capitalize(key)}: ${media[key]}\n`;
           }
         }
         
         try {
           if (media.type === 'image') {
             await conn.sendButton(m.chat, donateBtn, resultUrl, 'image.jpg', caption, m.msg, env.wm, null);
           } else if (media.type === 'video') {
             await conn.sendButton(m.chat, donateBtn, resultUrl, 'video.mp4', caption, m.msg, env.wm, null);
           } else if (media.type === 'audio') {
             await conn.sendButton(m.chat, donateBtn, resultUrl, 'tiktok.mp3', caption, m.msg, env.wm, null);
           } else {
             await conn.sendButton(m.chat, donateBtn, resultUrl, 'file', caption, m.msg, env.wm, null);
           }
           await delay(3000)
         } catch (err) {
           console.error(`Gagal mengirim media ke-${i + 1}:`, err.message);
         }
       }
     } catch (e) {
       m.reply('Terjadi kesalahan: ' + e.message);
     }
   },
  error: false,
  restrict: true,
  cache: true,
  limit: true,
  location: __filename
}