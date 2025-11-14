import { promises } from 'fs'
import { join } from 'path'
import { spawn } from 'child_process'

export const run = {
  usage: ['tomp3','tovn','toptt'],
  hidden: ['toaudio'],
  use: 'video',
  category: 'tools',
  async: async (m, { conn, text, isPrefix, command, env }) => {
   let q = m.quoted ? m.quoted : m
   let mime = q.type
   
   if (/audio/g.test(mime)) {
     return conn.forwardMessage(m.chat, m.chat, q.id)
   } else if (!/video/g.test(mime)) {
     return m.reply(`✳️ Balas memo video atau suara yang ingin Anda konversi ke mp3 dengan perintah :\n\n*${isPrefix + command}*`)
   }
    
    conn.sendChatAction(m.chat, "upload_audio")
    try {
    let media = await q.download?.()
    if (!media) throw '❎ Kesalahan mengunduh media'
    let audio = await toAudio(media, 'mp4')
    if (!audio.data) throw '❎ Konversi kesalahan'
    await conn.sendButton(m.chat, donateBtn, audio.data, 'Audio.mp3', '`Successfully Convert!`', m.msg, env.wm);
    } catch (e) {
        m.reply(e.message)
   }
  },
  error: false,
  restrict: true,
  location: __filename
}

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      let tmp = join(process.cwd(), '/tmp', + new Date + '.' + ext)
      let out = tmp + '.' + ext2
      await promises.writeFile(tmp, buffer)
      spawn('ffmpeg', [
        '-y',
        '-i', tmp,
        ...args,
        out
      ])
        .on('error', reject)
        .on('close', async (code) => {
          try {
            await promises.unlink(tmp)
            if (code !== 0) return reject(code)
            resolve({
              data: await promises.readFile(out),
              filename: out,
              delete() {
                return promises.unlink(out)
              }
            })
          } catch (e) {
            reject(e)
          }
        })
    } catch (e) {
      reject(e)
    }
  })
}

function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    '-q:a', '2'
  ], ext, 'mp3')
}