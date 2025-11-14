import axios from "axios"
import * as cheerio from "cheerio"

export const run = {
   usage: ['sinonim'],
   hidden: ['persamaankata'],
   use: 'query',
   category: 'internet',
   async: async (m, {
      conn,
      isPrefix,
      text,
      command,
      users,
      env
   }) => {
    let query = `Masukkan Kata\nContoh: ${isPrefix + command} ikan`
    let qry
    const args = text.split(" ")
    if (!text || !args) return m.reply(query)
    if (args.length >= 1) {
        qry = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        qry = m.quoted.text
    } else return m.reply(query)

    try {
        conn.sendChatAction(m.chat, "find_location")
        let res = await Persamaan_Kata(text)
        await conn.sendButton(m.chat, donateBtn, res.image, 'sinonim.jpg', `*[ ${command.toUpperCase()} ${text.toUpperCase()} ]*\n\n` + ArrClean(res.result), m.msg, env.wm);
    } catch (e) {
        m.reply(e.message)
    }
   },
   error: false,
   location: __filename
};

function ArrClean(str) {
    return str.map((v, index) => ++index + ". " + v).join('\r\n')
}

async function Persamaan_Kata(kata) {
    const html = await axios.get("https://m.persamaankata.com/search.php?q=" + kata)
    const $ = cheerio.load(html.data)
    const h = []
    $("div.word_thesaurus > a").each(function(e, a) {
        h.push($(a).text());
    })
    const image = $("img#visual_synonym_img").attr("src")
    return {
        image: image,
        result: h
    }
}