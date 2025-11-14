import fetch from "node-fetch"
import fs from "fs"

export const run = {
  usage: ['carbonify'],
  hidden: ['carbon'],
  use: 'text',
  category: 'ai',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    env
  }) => {
    const code = m.quoted?.text ? m.quoted?.text : text
    if (!code) return m.reply(`Kirim/reply kode untuk dibuat carbonify\n\nContoh: *${isPrefix+command} console.log("hello world")*`)
    
    conn.sendChatAction(m.chat, "upload_photo")
    CarbonifyV1(code)
  .then((result) => {
    return conn.sendButton(m.chat, donateBtn, result, 'carbonify.jpg', "`Successfully generated image!`", m.msg, env.wm);
  })
  .catch(() => {
    return CarbonifyV2(code)
      .then((result) => {
        return conn.sendButton(m.chat, donateBtn, result, 'carbonify.jpg', "`Successfully generated image!`", m.msg, env.wm);
      })
      .catch((error) => {
        m.reply(error.message);
      });
  });
   },
   error: false,
   cache: true,
   limit: true,
   location: __filename
};

async function CarbonifyV1(input) {
    let Blobs = await fetch("https://carbonara.solopov.dev/api/cook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "code": input
            })
        })
        .then(response => response.blob())
    let arrayBuffer = await Blobs.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    return buffer
}

async function CarbonifyV2(input) {
    let Blobs = await fetch("https://carbon-api.vercel.app/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "code": input
            })
        })
        .then(response => response.blob())
    let arrayBuffer = await Blobs.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    return buffer
}