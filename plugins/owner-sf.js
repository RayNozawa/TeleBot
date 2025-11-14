import fs from 'fs'
import syntaxError from 'syntax-error'
import path from 'path'
import util from 'util'

const _fs = fs.promises

export const run = {
   usage: ['sf'],
   hidden: ['sfp'],
   use: 'text/file',
   hidden: ['saveplugin'],
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
    
    if (!m.quoted || !text) return m.reply(`
Penggunaan: ${isPrefix+command} <name file>
Contoh: ${isPrefix}savefile main.js
        ${isPrefix}saveplugin owner
`.trim())
    if (!m.quoted) return m.reply(`Reply Kodenya`)
    if (/p(lugin)?/i.test(command)) {
        let filename = text.replace(/plugin(s)\//i, '') + (/\.js$/i.test(text) ? '' : '.js')
        const error = syntaxError(m.quoted.text, filename, {
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true
        })
        if (error) return m.reply(error)
        const pathFile = path.join(__dirname, filename)
        await _fs.writeFile(pathFile, m.quoted.text)
        m.reply(`
Sukses Menyimpan Di *${filename}*

\`\`\`
${util.format(m.quoted.text)}
\`\`\`
`.trim())
    } else {
        const isJavascript = m.quoted.text && !m.quoted.download && /\.js/.test(text)
        if (isJavascript) {
            const error = syntaxError(m.quoted.text, text, {
                sourceType: 'module',
                allowReturnOutsideFunction: true,
                allowAwaitOutsideFunction: true
            })
            if (error) return m.reply(error)
            await _fs.writeFile(text, m.quoted.text)
            m.reply(`
Sukses Menyimpan Di *${text}*

\`\`\`
${util.format(m.quoted.text)}
\`\`\`
`.trim())
        } else if (m.quoted && typeof m.quoted.download === 'function') {
            const media = await m.quoted.download()
            let pathSave = text
            if (command == "sfp") pathSave = `plugins/${text}`
            await _fs.writeFile(pathSave, media)
            m.reply(`
Sukses Menyimpan Di *${text}*
`.trim())
        } else {
            m.reply('Tidak Support!!')
        }
    }
},
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}