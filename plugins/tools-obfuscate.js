import axios from "axios"
import JavaScriptObfuscator from "javascript-obfuscator"
import fs from "fs"
const _fs = fs.promises

export const run = {
  usage: ['obfuscator'],
  hidden: ['obfuscate','obf','enc'],
  use: 'image',
  category: 'tools',
  async: async (m, { conn, isPrefix, text, args, command }) => {
    try {
        const modes = ["low", "high", "minify"]
        if (!text || !m.quoted) return m.reply(`Reply file berisi kode js dan masukkan type encrypt, *low, high* atau *minify*\n\nContoh: *${isPrefix+command} high*`)
        
        const code = (await m.quoted.download()).toString("utf-8");

        const type = args.shift().toLowerCase()
        if (!modes.includes(type)) return m.reply(`Reply File Codenya!\n\nContoh: *\n${isPrefix+command} high*`)
        
        let result, filename
        if (type == "high") {
          result = await Encrypt(code)
          filename = "Encryption High.js"
        } else if (type == "low") {
          result = await Decrypt(code)
          filename = "Encryption Low.js"
        } else if (type == "minify") {
          const enc = await Encrypt(code)
          result = await minify(enc)
          filename = "Encryption Minify.js"
        }

        let fileName = process.cwd() + `/tmp/${Date.now()}.js`
        await _fs.writeFile(fileName, result, 'utf8');
        let docs = await fs.readFileSync(fileName)

        await conn.sendDocument(m.chat, docs, { reply_to_message_id: m.id }, {
          filename,
          contentType: "text/plain"
        })
    } catch (e) {
        await m.reply(e.message)
    }
  },
  error: false,
  limit: true,
  cache: true,
  location: __filename
}

async function Encrypt(query) {
    const obfuscationResult = JavaScriptObfuscator.obfuscate(query, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1,
        sourceMap: false,
        sourceMapMode: "separate",
    })

    return obfuscationResult.getObfuscatedCode()
}

async function Decrypt(encryptedCode) {
    const decryptedCode = JavaScriptObfuscator.obfuscate(encryptedCode, {
        compact: false,
        controlFlowFlattening: true,
    }).getObfuscatedCode()

    return decryptedCode
}

async function minify(code) {
  try {
    let { data } = await axios.post(`${apiUrl}/js-minify`, code, {
      headers: {
        'Content-Type': 'text/javascript'
      }
    })
    return data
  } catch (error) {
    return JSON.stringify(error.response?.data) || error.message;
  }
}