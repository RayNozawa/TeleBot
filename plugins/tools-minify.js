import axios from "axios"
import fs from "fs"
const _fs = fs.promises

export const run = {
  usage: ['minify'],
  use: 'js-file',
  category: 'tools',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
    let q = m.quoted ? m.quoted : m;
    if (!q.msg.document || !q.msg.document?.file_name.endsWith(".js")) return m.reply("Kirim/Reply File Berisi Kode JavaScript!")

    try {
      const code = (await m.quoted.download()).toString("utf-8");
      let fileName = process.cwd() + `/tmp/${Date.now()}.txt`

      let mini = await minify(code)

      await _fs.writeFile(fileName, mini, 'utf8');
      let docs = await fs.readFileSync(fileName)

      await conn.sendDocument(m.chat, docs, { reply_to_message_id: m.id }, {
        filename: "Minified.js",
        contentType: "text/plain"
      })
    } catch (e) {
      m.reply(e.message)
    }
  },
  error: false,
  limit: true,
  cache: true,
  location: __filename
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