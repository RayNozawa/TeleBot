import TelegramBot from 'node-telegram-bot-api';

export const run = {
  usage: ['clearuser'],
  category: 'owner',
  async: async (m, { isPrefix, command, env, isROwner }) => {
    const failedUsers = new Set();
    const users = global.db.chats;
    const activeTokensArray = Array.from(activeTokens);

    for (let i = 0; i < users.length; i++) {
      const id = users[i].jid;
      let allFailed = true;

      for (const token of activeTokensArray) {
        try {
          const bot = new TelegramBot(token, { polling: false });
          await bot.getChat(id);
          console.log(`✅ ${id} aktif di ${token.slice(0, 10)}...`);
          allFailed = false;
          break;
        } catch (err) {
          if (String(err).includes('chat not found') || String(err).includes('blocked') || String(err).includes("kicked")) {
            console.log(`🚫 ${id} tidak ditemukan di ${token.slice(0, 10)}...`);
          } else {
            console.warn(`⚠️ Gagal cek ${id} di token ${token.slice(0, 10)}: ${err.message}`);
          }
        }
      }

      if (allFailed) {
        failedUsers.add(id);
      }
    }

    if (failedUsers.size > 0) {
      global.db.chats = users.filter(u => !failedUsers.has(u.jid));
      console.log(`🗑️ ${failedUsers.size} user dihapus (tidak ditemukan di semua bot).`);
    } else {
      console.log('✅ Tidak ada user yang perlu dihapus.');
    }

    m.reply(`✅ Pembersihan selesai.\nTotal user dihapus: ${failedUsers.size}`);
  },
  error: false,
  restrict: true,
  cache: true,
  owner: true,
  location: __filename
};