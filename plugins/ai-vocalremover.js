import axios from "axios"

export const run = {
   usage: ['vocalremover'],
   hidden: ['instrumental','pisahinstrumen','pisahinstrumental','vocal','pisahvocal','instrumenremover','instrumentalremover','instrumenrem','instrumentalrem','vocalrem','vocalremover','instrumenremove','instrumentalremove','vocalremove'],
   use: 'audio',
   category: 'ai',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
  let q = m.quoted ? m.quoted : m
  if (!q.type.includes("audio")) return m.reply(`Balas audio/musik yang mau dipisah vocal dan instrumentalnya!`)
 
  try {
    conn.sendChatAction(m.chat, 'record_audio')
    
    const url = await conn.getFileLink(q.msg.audio.file_id);
    const { vocal_path, instrumental_path } = (await axios.get(`${apiUrl}/vocalremover?url=${encodeURIComponent(url)}`)).data;

    await conn.sendButton(m.chat, donateBtn, vocal_path, 'Vocal.mp3', 'Vocal Audio', m.msg, env.wm);
    await conn.sendButton(m.chat, donateBtn, instrumental_path, 'Instrumental.mp3', 'Instrumental Audio', m.msg, env.wm);

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Terjadi kesalahan saat memisahkan vokal dan instrumental: ' + e.message);
  }
   },
  error: false,
  restrict: true,
  cache: true,
  limit: true,
  location: __filename
}