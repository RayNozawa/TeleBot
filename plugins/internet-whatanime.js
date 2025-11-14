import fetch from "node-fetch";
import * as fs from "fs";

export const run = {
   usage: ['whatanime'],
   use: 'image',
   category: 'internet',
   async: async (m, {
      conn,
      text,
      Func,
      env
   }) => {
	let q = m.quoted ? m.quoted : m;
	let mime = q.type
	if (!mime.includes("photo")) return m.reply(`Reply fotonya!`);
	let img = await q.download();
	conn.sendChatAction(m.chat, 'upload_photo')
	let { url: upld } = await uploadHF(img)
	let res = await fetch(
		`https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(upld)}`
	);
	let json = await res.json();
	let { id, idMal, title, synonyms, isAdult } = json.result[0].anilist;
	let { filename, episode, similarity, video, image } = json.result[0];
	let _result = `*Title :* ${title.romaji} (${title.native})\n*Synonyms :* ${synonyms}\n*Adult :* ${isAdult}\n*Similiarity :* ${(similarity * 100).toFixed(1)}\n*Episode :* ${episode}`;
	await conn.sendButton(m.chat, donateBtn, image, 'whatanime.jpg', _result, m.msg, env.wm)
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}