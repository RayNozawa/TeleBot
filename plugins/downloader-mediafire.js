import axios from "axios"

export const run = {
   usage: ['mediafire'],
   hidden: ['mf'],
   use: 'url',
   category: 'downloader',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
  const urg = text ? text : m.quoted?.text ? m.quoted.text : text
  
  if (!urg) return m.reply(`✳️ Contoh :\n${isPrefix + command} https://www.mediafire.com/file/nj2tcbjfdmproj9/GRINGO%20V102%20VIP.7z/file`)
  if (!urg.match(/https/gi)) return m.reply(`⚠️ Masukkan url mediafire!`)
  
  const urlRegex = /(https?:\/\/[^\s`]+)/g;
  const match = urg.match(urlRegex);
  const url = match[0];
  
  if (!url.match(/https/gi)) return m.reply(`⚠️ Masukkan url mediafire!`)
  if (!url.match(/mediaf/gi)) return m.reply(`❎ Url yang anda masukkan bukan berasal dari mediafire`)

  try {
    let { data } = await axios.get(`https://api.nekolabs.web.id/downloader/mediafire?url=${url}`)
    await conn.sendButton(m.chat, donateBtn, data.result.download_url, data.result.filename, '`MediaFire DL | NekoLabs`\n\n' + `${data.result.filename}\n${data.result.filesize}\n\n${env.wm}`, m.msg, env.wm);
    } catch (e) {
      return m.reply('Terjadi kesalahan, periksa kembali url kamu\n\n' + e.message)
    }
   },
   error: false,
   cache: true,
   limit: true,
   location: __filename
}