import fs from 'fs';
import axios from 'axios';
import pinterest from "../lib/pinterest.js"
import speed from 'performance-now';

let totalFitur = 0;
let semuaUsage = [];
    
for (const key in global.plugins) {
  const run = global.plugins[key].run;
  if (run && Array.isArray(run.usage)) {
    totalFitur += run.usage.length;
    semuaUsage.push(...run.usage);
  }
};
export const run = {
  usage: ['menu', 'help', 'start'],
  hidden: ['menutype'],
  async: async (m, { conn, Func, bot, users, isROwner, text, isPrefix, command, plugins, env, isOwnerBot }) => {
    conn.sendChatAction(m.chat, 'typing')
    const user = m.msg.from.username ? '@' +m.msg.from.username : m.msg.from.first_name
    
    const emCat = {
      ai: "🤖",
      downloader: "📥",
      fun: "😁",
      game: "🎮",
      groups: "💬",
      internet: "🌐",
      main: "⚡",
      maker: "🖌️",
      owner: "👑",
      search: "🔍",
      tools: "⚒️",
      user: "👤",
      other: "📂"
    }
    
    async function getImgPin() {
      if (bot?.thumbnail?.startsWith("https://")) return bot?.thumbnail

      let image = await pinterest(bot?.thumbnail || env.botname);
      return image[~~(Math.random() * (image.length))].image
    }

    try {
      let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage);
      let cmd = Object.fromEntries(filter);
      let category = {};

      for (let name in cmd) {
        let obj = cmd[name].run;
        if (!obj || !obj.category) continue;
        if (!category[obj.category]) category[obj.category] = [];
        category[obj.category].push(obj);
      }

      const me = await conn.getMe();
      const keys = Object.keys(category).sort();

      if (text) {
        const cat = text.trim().toLowerCase();
        if (!category[cat]) {
          return conn.reply(m.chat, `Kategori <b>${cat}</b> tidak ditemukan.`, m.msg, "HTML");
        }

        let caption = `<code>乂 ${cat.toUpperCase()} MENU</code>\n\n`;
        let cmdList = category[cat]
          .map(v => {
            let usageList = Array.isArray(v.usage) ? v.usage : [v.usage];
            return usageList.map(cmd => `- ${isPrefix}${cmd} <b>${v.use || ''}</b>`).join('\n');
          })
          .join('\n');

        caption += cmdList + `\n\n<blockquote>${env.wm}</blockquote>`;

        const backButton = [[{ text: "⬅️ Menu List", callback_data: `${isPrefix}menu` }]]
        
        const options = {
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: backButton },
          reply_to_message_id: m.msg.message_id
        };
        
        try {
          await conn.editMessageCaption(caption, { chat_id: m.chat, message_id: m.id, ...options });
          return
        } catch (e) {
          console.error(e.message)
          try {
            await conn.editMessageText(caption, { chat_id: m.chat, message_id: m.id, ...options });
            return
          } catch (e) {
            console.error(e.message)
            try {
              await conn.sendPhoto(m.chat, await getImgPin(), { caption: caption, ...options });
              const json = await jkt48Sound()
              await conn.sendButton(m.chat, donateBtn, json.link, json.judul+'.mp3', '', m.msg, "JKT48").catch(e => { console.log(e.message) })
              return
            } catch (e) {
              console.error(e.message)
              await conn.reply(m.chat, caption, m.msg, "HTML", backButton);
              return
            }
          }
        }
      }

      let print = `<pre><code class="language-${me.first_name}">Hai, ${Func.greeting()}!\n\n`;
      print += `I can help you with various tasks.</code></pre>\n\n`;
      
      let owner
      if (bot?.owner) {
        owner = `@${bot?.owner}`;
      } else if (bot?.owner_id) {
        owner = await getName(bot?.owner_id);
      } else {
        owner = `Not Set`;
      }
      
      print += `<blockquote>乂 <code>Owner:</code> ${owner}</blockquote>\n`
      print += `⚒️ <b>Total Fitur:</b> <code>${totalFitur}</code>\n`
      let timestamp = speed();
      print += `💨 <b>Latensi:</b> <code>${(speed() - timestamp).toFixed(4)} ms</code>\n`
      print += `🏃 <b>Uptime:</b> <code>${clockString(process.uptime() * 1000)}</code>\n\n`
      print += `<blockquote><code>乂 ${"YOUR INFO".toUpperCase()}</code></blockquote>\n`;
      print += `👤 <b>Name:</b> <code>${user}</code>\n`;
      print += `🎗️ <b>Limit:</b> <code>${users.limit}</code>\n`;
      if (users.exp) print += `⛽ <b>EXP:</b> <code>${users.exp.toLocaleString("id-ID")}</code>\n`;
      print += `🌟 <b>Status:</b> <code>${isROwner ? "Developer" : isOwnerBot ? "Bot Owner" : users.premium ? "Premium User" : "Free User"}</code>\n\n<blockquote>${env.wm}</blockquote>`;

      const rowBtn = 2
      const categoryButtons = []
      for (let i = 0; i < keys.length; i += rowBtn) {
        const row = []
        for (let j = i; j < i + rowBtn && j < keys.length; j++) {
          row.push({ text: `${emCat[keys[j].toLowerCase()] || emCat["other"]} ${keys[j].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}`, callback_data: `${isPrefix}menu ${keys[j].toLowerCase()}` })
        }
        categoryButtons.push(row)
      }

      categoryButtons.push([
        { text: "Join Group🌍", url: "https://t.me/bot_nozawa" },
        { text: "Owner💌", url: "https://t.me/RayhanXD" }
      ]);
      categoryButtons.push([{ text: "Donate🍩", callback_data: ".donate" }]);
      
      const options = {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: categoryButtons },
        reply_to_message_id: m.msg.message_id
      };
      
      try {
        await conn.editMessageCaption(print.trim(), { chat_id: m.chat, message_id: m.id, ...options });
      } catch (e) {
        console.error(e.message)
        try {
          await conn.editMessageText(print.trim(), { chat_id: m.chat, message_id: m.id, ...options });
        } catch (e) {
          console.error(e.message)
          try {
            await conn.sendPhoto(m.chat, await getImgPin(), { caption: print.trim(), ...options });
            const json = await jkt48Sound()
            await conn.sendButton(m.chat, donateBtn, json.link, json.judul+'.mp3', '', m.msg, "JKT48").catch(e => { console.log(e.message) })
          } catch (e) {
            console.error(e.message)
            await conn.reply(m.chat, print.trim(), m.msg, "HTML", categoryButtons);
          }
        }
      }
    } catch (e) {
      console.error('[ERROR] Failed to generate menu:', e);
    }
  },
  error: false,
  cache: true,
  location: __filename
};

    
async function jkt48Sound() {
  let { data: json } = await axios.get(`${apiUrl}/tebaklagujkt48`)
  return json
}

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, 'H ', h, 'J ', m, 'M ', s, 'D '].map(v => v.toString().padStart(2, 0)).join('')
}