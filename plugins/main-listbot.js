import TelegramBot from 'node-telegram-bot-api';

export const run = {
   usage: ['listbot'],
   category: 'main',
   async: async (m, {
      conn,
      text,
      Func,
      isPrefix,
      command
   }) => {
     try {
       let botlist = 'Total Bot: ' + Array.from(activeTokens).length + '\n\n'
       let aktif = Array.from(activeTokens)
       let page = 10
       
       for (const token of aktif.slice(text || 0, (parseInt(text) || 0) + (page || aktif.length))) {
         try {
           const bot = new TelegramBot(token, { polling: false });
           let isbot = await bot.getMe();
           botlist += `@${isbot.username}\n`
           if (db.bot?.[isbot.username]?.owner) {
             botlist += `- Owner: @${db.bot?.[isbot.username]?.owner}\n\n`
           } else if (db.bot?.[isbot.username]?.owner_id) {
             botlist += `- Owner: ${await getName(db.bot?.[isbot.username]?.owner_id)}\n\n`
           } else {
             botlist += '- Owner: Not Set\n\n'
           }
         } catch (e) {
           console.error(e)
         }
       }
       if (!text) {
         conn.reply(m.chat, botlist, m.msg, "HTML", [[{ text: 'Next➡️', callback_data: `${isPrefix+command} ${page}`}]])
       } else {
         let buttons = [[{ text: '⬅️Prev', callback_data: `${isPrefix+command} ${(parseInt(text) - page) ?? page}` }, { text: 'Next➡️', callback_data: `${isPrefix+command} ${parseInt(text) + page || page}` }]]
         if (parseInt(text) + page > aktif.length) buttons = [[{ text: '⬅️Prev', callback_data: `${isPrefix+command} ${(parseInt(text) - page) ?? page}` }]]
         if (parseInt(text) < page) buttons = [[{ text: 'Next➡️', callback_data: `${isPrefix+command} ${parseInt(text) + page || page}` }]]

         const options = {
           parse_mode: 'HTML',
           reply_markup: { inline_keyboard: buttons },
           reply_to_message_id: m.msg.message_id
         };
         try {
           await conn.editMessageText(botlist, { chat_id: m.chat, message_id: m.id, ...options });
         } catch {
           await conn.reply(m.chat, botlist, m.msg, "HTML", buttons)
         }
       }
     } catch {
       m.reply("Gagal mengambil daftar list bot")
     }
   },
   error: false,
}