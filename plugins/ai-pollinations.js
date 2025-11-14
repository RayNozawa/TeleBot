import axios from "axios"

export const run = {
   usage: ['pollinations'],
   use: 'prompt',
   category: 'ai',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
  let [api, ...rest] = text.split(",").map(v => v.trim());
  let prompt = rest.join(", ");
  
  if (api == "image") {
    try {
      conn.sendChatAction(m.chat, 'upload_photo')
      await conn.sendButton(m.chat, donateBtn, `https://image.pollinations.ai/prompt/${prompt}`, 'pollinations.jpg', '`Image Successfully Created`\n\n'+`Prompt: *${prompt}*\n\n${wm}`, m.msg, env.wm);
    } catch (e) {
      m.reply("❌ Gagal membuat gambar!")
    }
  } else if (api == "ai") {
    try {
      conn.sendChatAction(m.chat, 'typing')
      let { data } = await axios.get(`https://text.pollinations.ai/${prompt}`)
      m.reply(data)
    } catch (e) {
      m.reply("❌ Gagal menghubungi ai!")
    }
  } else {
    m.reply(`Masukkan command dan prompt!\n\nContoh:\n*${isPrefix+command} image, Kelinci Di Gunung*\n*${isPrefix+command} ai, siapa itu elon musk?*`)
  }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}