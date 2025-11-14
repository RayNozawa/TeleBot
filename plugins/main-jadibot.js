import fs from 'fs';
import path from 'path';
import TelegramBot from 'node-telegram-bot-api';
       
export const run = {
   usage: ['jadibot'],
   use: 'token',
   category: 'main',
   async: async (m, {
      conn,
      text,
      Func,
      isPrefix,
      command
   }) => {
     if (!global.db.bot) global.db.bot = {}
  
     if (!text) return m.reply(Func.example(isPrefix, command, `*BOT_TOKEN*\n${isPrefix+command} *818372:AAH-BaKzpiPqe*\n\nMasukkan token bot kamu, cek di @BotFather`))
     let botname
     try {
       const bot = new TelegramBot(text, { polling: false });
       botname = (await bot.getMe()).username
       bot._request('setMyDescription', {
         form: {
           description: "🌥️ Bot multifungsi yang dapat anda gunakan dengan mudah!\n\nBot ini dibuat dengan @NozawaBOT 🚀"
         }
       });
     } catch (e) {
       return m.reply('Token bot yang kamu masukkan tidak valid!');
     }
     
     let filepath = path.join(__dirname, "../bot_token.json");
     
     const raw = fs.readFileSync(filepath, "utf8");
     const tokens = JSON.parse(raw);
     
     tokens.push(text);
     
     fs.writeFileSync(filepath, JSON.stringify(tokens, null, 2));

     if (!global.db.bot[botname]) {
       global.db.bot[botname] = {}
     }
     
     global.db.bot[botname].owner = m.msg.from.username
     global.db.bot[botname].owner_id = m.msg.from.id
     
     conn.reply(m.chat, `@${botname} berhasil terhubung!`, m.msg, null)
   },
   error: false,
   limit: true,
}