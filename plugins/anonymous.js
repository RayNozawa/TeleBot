import TelegramBot from 'node-telegram-bot-api';

export const run = {
   usage: ['anonymous'],
   hidden: ['anonstart', 'anonymous', 'anonleave', 'anonnext'],
   category: 'user',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      bot,
      isOwnerBot,
      Scraper
   }) => {
    db.anonymous = db.anonymous ? db.anonymous : {}
    switch (command) {
        case 'anonymous': {
            await conn.sendMessage(m.chat, `_${isPrefix}anonstart_ untuk memulai\n_${isPrefix}anonnext_ untuk ganti partner\n_${isPrefix}anonleave_ untuk keluar`, {
              parse_mode: "Markdown",
              reply_to_message_id: m.id,
              reply_markup: {
                keyboard: [
                  [{ text: "/anonstart" }, { text: "/anonnext"}, { text: "/anonleave"}],
                ],
                one_time_keyboard: true,
                resize_keyboard: true
              }
            });
            break
        }
        case 'anonnext':
        case 'anonleave': {
            let room = Object.values(db.anonymous).find(room => room.check(m.sender))
            if (!room) return conn.sendMessage(m.chat, `_Kamu tidak sedang berada di anonymous chat_\n\nKetik ${isPrefix}anonstart ( untuk mencari partner )`, {
              parse_mode: "Markdown",
              reply_to_message_id: m.id,
              reply_markup: {
                keyboard: [
                  [{ text: "/anonstart" }],
                ],
                one_time_keyboard: true,
                resize_keyboard: true
              }
            });
            await conn.sendMessage(m.chat, `_Berhasil meninggalkan chat anonymous_\n\nKetik ${isPrefix}anonstart ( untuk mencari partner )`, {
              parse_mode: "Markdown",
              reply_to_message_id: m.id,
              reply_markup: {
                keyboard: [
                  [{ text: "/anonstart" }],
                ],
                one_time_keyboard: true,
                resize_keyboard: true
              }
            });
            
            let other = room.other(m.sender)
            
            const bot = new TelegramBot(other == room.a ? room.aToken : room.bToken, { polling: false });

            if (other) await bot.sendMessage(other, `_Partner meninggalkan chat_\n\nKetik ${isPrefix}anonstart ( untuk mencari partner )`, {
              parse_mode: "Markdown",
              reply_markup: {
                keyboard: [
                  [{ text: "/anonstart" }],
                ],
                one_time_keyboard: true,
                resize_keyboard: true
              }
            });
            
            delete db.anonymous[room.id]
            if (command === 'anonleave') break
        }
        case 'anonstart': {
            if (Object.values(db.anonymous).find(room => room.check(m.sender))) return conn.reply(m.chat, `_Kamu masih berada di dalam anonymous chat, menunggu partner_\n\nKetik ${isPrefix}anonleave ( untuk keluar )`, m)
            let room = Object.values(db.anonymous).find(room => room.state === 'WAITING' && !room.check(m.sender))
            if (room) {
                const bot = new TelegramBot(room.aToken, { polling: false });
                await bot.sendMessage(room.a, `_Partner ditemukan!_\n\nKetik ${isPrefix}anonnext ( untuk meng-skip partner )`, {
              parse_mode: "Markdown",
              reply_markup: {
                keyboard: [
                  [{ text: "/anonnext" }, { text: "/anonleave" }],
                ],
                one_time_keyboard: true,
                resize_keyboard: true
              }
            });
            
                room.b = m.sender
                room.bToken = conn.token
                room.state = 'CHATTING'
                await conn.sendMessage(room.b, `_Partner ditemukan!_\n\nKetik ${isPrefix}anonnext ( untuk meng-skip partner )`, {
              parse_mode: "Markdown",
              reply_markup: {
                keyboard: [
                  [{ text: "/anonnext" }, { text: "/anonleave" }],
                ],
                one_time_keyboard: true,
                resize_keyboard: true
              }
            });
            } else {
                let id = + new Date
                db.anonymous[id] = {
                    id,
                    a: m.sender,
                    aToken: conn.token,
                    b: '',
                    state: 'WAITING',
                    check: function (who = '') {
                        return [this.a, this.b].includes(who)
                    },
                    other: function (who = '') {
                        return who === this.a ? this.b : who === this.b ? this.a : ''
                    },
                }
                await conn.sendMessage(m.chat, `_Menunggu partner..._\n\nKetik ${isPrefix}anonleave ( jika kamu ingin keluar )`, {
              parse_mode: "Markdown",
              reply_markup: {
                keyboard: [
                  [{ text: "/anonleave" }],
                ],
                one_time_keyboard: true,
                resize_keyboard: true
              }
            });
            }
            break
        }
    }
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}