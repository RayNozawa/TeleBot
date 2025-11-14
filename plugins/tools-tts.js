import gTTS from 'node-gtts'
import fs from "fs"

const defaultLang = 'id'
export const run = {
   usage: ['tts'],
   hidden: ['say'],
   use: 'text',
   category: 'tools',
   async: async (m, {
      conn,
      isPrefix,
      command,
      users,
      args,
      env
   }) => {
  let lang = args[0]
  let text = args.slice(1).join(' ')
  if ((args[0] || '').length !== 2) {
    lang = defaultLang
    text = args.join(' ')
  }
  if (!text && m.quoted?.text) text = m.quoted.text
  try {
    text = args.join(' ')
    if (!text) return m.reply(`Use example ${isPrefix}${command} en hello world`)
    
    conn.sendChatAction(m.chat, "record_voice")
    const gtts = gTTS(lang);
    const filename = `tmp/${Date.now}.mp3`
    gtts.save(filename, text, () => {
      console.log("sukses tts!")
      conn.sendButton(m.chat, donateBtn, fs.readFileSync(filename), 'Text To Speech.mp3', '', m.msg);
    });
  } catch (e) {
    m.reply(e.message)
  }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}