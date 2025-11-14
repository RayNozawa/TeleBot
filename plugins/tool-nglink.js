import axios from "axios";
import qs from "qs";
import crypto from "crypto";

export const run = {
  usage: ['nglink'],
  hidden: ['ngl','nglspam'],
  category: "tools",
  async: async (m, {
    conn,
    isPrefix,
    command,
    text,
    isROwner
  }) => {
    let [user, msg, jumlah] = text.split('|')
    if (!(user && msg)) return m.reply(`Contoh: ${isPrefix + command} username/ngl_link | message | jumlah`)
    let link = /^(http|https):\/\/ngl.link/gi.test(user) ? user : /ngl.link/gi.test(user) ? `https://${user}` : `https://ngl.link/${user}`
    let data = await cekUser(link)
    if (!data) return m.reply('User not found/Invalid url')
    
    let suc = 0
    if (jumlah > 100) return m.reply("Jumlah tidak boleh lebih dari 100!")
    if (!jumlah) jumlah = 1
    for (let i = 0; i < jumlah; i++) {
      try {
        await sendNgl(link, msg)
        suc++
      } catch(e) {
        console.log(e.message)
      }
    }
    m.reply(`Success send${suc ? " " + suc : ""} ngl to *"${user}"*\nMessage: *"${msg}"*`)
   },
   error: false,
   restrict: true,
   limit: true,
   cache: true,
   location: __filename
}

async function cekUser(url) {
    return await axios(url).catch(_ => null)
}

async function sendNgl(username, text) {
  try {
    const url = "https://ngl.link/api/submit";

    const data = qs.stringify({
      username: username.replace("/cancelled", "").split("/").pop(),
      question: text,
      deviceId: crypto.randomUUID(),
      gameSlug: text.includes("cancelled") ? "cancelled" : "",
      referrer: ""
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Accept": "*/*",
      "X-Requested-With": "XMLHttpRequest"
    };

    const response = await axios.post(url, data, {
      headers
    })
  } catch (e) {
    throw new Error(e.message)
  }
}