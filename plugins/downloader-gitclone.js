import fetch from 'node-fetch'
const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i

export const run = {
   usage: ['gitclone'],
   use: 'repository',
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
  if (!urg) return m.reply(`Example user ${isPrefix}${command} RayhanZuck/JKT48`)
  if (!urg.match(/https/gi)) return m.reply(`⚠️ Masukkan url github`)

  const urlRegex = /(https?:\/\/[^\s`]+)/g;
  const match = urg.match(urlRegex);
  const urlz = match[0];

  conn.sendChatAction(m.chat, 'upload_document')
  try {
    let teks = urlz.replace('https://github.com/', '').replace(".git", "")
    let [usr, rep] = teks.split`/`
    let url = `https://api.github.com/repos/${encodeURIComponent(usr)}/${encodeURIComponent(rep)}/zipball`
    let name = `${encodeURIComponent(rep)}.zip`
    m.reply(status.wait)
    await conn.sendButton(m.chat, donateBtn, url, name, '', m.msg, env.wm);
    } catch (e) {
      throw `Terjadi Kesalahan, Tidak Dapat Menemukan Nickname/Repostory Yang Kamu Masukan`
    }
   },
   error: false,
   cache: true,
   limit: true,
   location: __filename
}