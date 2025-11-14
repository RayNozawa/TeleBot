import axios from "axios"

export const run = {
   usage: ['transcript'],
   hidden: ['yttranscript'],
   use: 'yt-url',
   category: 'tools',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
  const urg = text ? text : m.quoted?.text ? m.quoted.text : text
  
  if (!urg) return m.reply(`❎ Masukkan Link!\n\nContoh ${isPrefix+command} https://youtube.com/watch?v=2rGeXz9IVfA`)
  if (!urg.match(/https/gi)) return m.reply(`⚠️ Masukkan url youtube`)

  const urlRegex = /(https?:\/\/[^\s`]+)/g;
  const match = urg.match(urlRegex);
  const url = match[0];
  
  conn.sendChatAction(m.chat, "typing")
  try {
    const transcript = await getTranscriptAndCombine(url)
    await conn.reply(m.chat, transcript, m.msg)
  } catch (e) {
    throw "Terjadi kesalahan: " + e.message
  }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}

async function getTranscriptAndCombine(ytUrl) {
  const url = `https://api.supadata.ai/v1/transcript?url=${encodeURIComponent(ytUrl)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-api-key": "sd_f157dd66fb75b1d97401637babb4503c",
        "User-Agent": "RiiCODE-Premium/1.0",
      },
    });

    const content = response.data.content;

    const combinedText = content
      .sort((a, b) => a.offset - b.offset)
      .map((item) => item.text)
      .join("\n");

    return combinedText
  } catch (error) {
    return "Terjadi kesalahan:" + error.message;
  }
}