import fetch from "node-fetch"

export const run = {
   usage: ['pexels'],
   use: 'query',
   category: 'internet',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    if (!text) return m.reply(`Masukan Textnya\nContoh: *${isPrefix+command} mountain*`)
    try {
            conn.sendChatAction(m.chat, "upload_image")
            let outs = await searchPexels(text)
            let res = outs.photos
            let v = res[Math.floor(Math.random() * res.length)];
            let teks = `
*ID:* ${v.id || 'Tidak diketahui'}
*Width:* ${v.width || 'Tidak diketahui'} Original
*Height:* ${v.height || 'Tidak diketahui'} Original
*Url:* ${v.url || 'Tidak diketahui'}
*Photographer:* ${v.photographer || 'Tidak diketahui'}
*Photographer Url:* ${v.photographer_url || 'Tidak diketahui'}
*Photographer ID:* ${v.photographer_id || 'Tidak diketahui'}
*Avg Color:* ${v.avg_color || 'Tidak diketahui'}
*Liked:* ${v.liked || 'Tidak diketahui'}
*Alt:* ${v.alt || 'Tidak diketahui'}
*Url:*\n${Object.values(v.src).join('\n\n')}
`
                await conn.sendButton(m.chat, donateBtn, v.src.original || v.src['large2x'] || v.src.large || v.src.medium || v.src.small || v.src.portrait || v.src.landscape || v.src.tiny || v.alt, 'pexels.jpg', teks, m.msg, env.wm);
            
    } catch (e) {
        return m.reply(e.message)
    }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}

const APIKEY = "563492ad6f91700001000001e82bd3aea51a4f18a30b09ce81aacb33";

async function searchPexels(query) {
  const response = await fetch(`https://api.pexels.com/v1/search?query=${query}`, {
    method: "GET",
    headers: {
      Authorization: APIKEY,
      SameSite: "None",
    },
  });
  const data = await response.json();
  return data;
}
