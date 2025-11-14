import fs, { unlinkSync, readFileSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'

export const run = {
  usage: ['bass', 'blown', 'deep', 'earrape', 'fast', 'fat', 'nightcore', 'reverse', 'robot', 'slow', 'smooth', 'tupai'],
  hidden: ['squirrel', 'spedup', 'speedup', 'chipmunk'],
  use: 'audio',
  category: 'tools',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    Func,
    users,
    env,
  }) => {
    try {
      let q = m.quoted ? m.quoted : m
      let mime = q.type
      let set
      if(/bass/.test(command)) set = '-af equalizer=f=94:width_type=o:width=2:g=30'
      if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log'
      if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3'
      if (/earrape/.test(command)) set = '-af volume=12'
      if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
      if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
      if (/nightcore|spedup|speedup/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
      if (/reverse/.test(command)) set = '-filter_complex "areverse"'
      if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
      if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
      if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
      if (/tupai|squirrel|chipmunk/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
      if (/audio/.test(mime)) {

        conn.sendChatAction(m.chat, 'record_audio')

        let fileawal = join(process.cwd(), '/tmp/' + getRandom('.mp3'))
        let fileakhir = join(process.cwd(), '/tmp/' + getRandom('.mp3'))

        let media = await q.download()
        fs.writeFileSync(fileawal, media)

        exec(`ffmpeg -i ${fileawal} ${set} ${fileakhir}`, async (err, stderr, stdout) => {
          if (err) return m.reply(`_*Error!*_`)
          let buff = await readFileSync(fileakhir)
          await conn.sendButton(m.chat, donateBtn, buff, text+'.mp3', `*Successfully added effect!*`, m.msg, env.wm);
        })
      } else return m.reply(`Reply audionya`)
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

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`
}