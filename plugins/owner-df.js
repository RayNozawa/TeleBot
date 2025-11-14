import { tmpdir  } from 'os'
import path from 'path'
const { join } = path
import { readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  readFileSync,
  watch
 } from 'fs'

export const run = {
   usage: ['df'],
   use: 'filename',
   category: 'owner',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      Scraper,
      isROwner
   }) => {
     if (!isROwner) return
     
     if (!text) return m.reply(`uhm.. where the text?\n\nexample:\n${isPrefix + command} info.js`)
     const file = join(text)
     unlinkSync(file)
     conn.reply(m.chat, `Succes deleted "${text}"`, m.msg)
    
},
   error: false,
   cache: true,
   location: __filename
};