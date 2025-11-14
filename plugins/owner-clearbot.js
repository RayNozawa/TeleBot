import TelegramBot from 'node-telegram-bot-api';

export const run = {
  usage: ["clearbot"],
  category: "owner",
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    env
  }) => {
    let aktifUsernames = [];

    for (const token of Array.from(activeTokens)) {
      try {
        const bot = new TelegramBot(token, { polling: false });
        const info = await bot.getMe();
        aktifUsernames.push(info.username);
      } catch (err) {
        console.log(`Token error: ${err.message}`);
      }
    }

    let length = 0
    for (const username in db.bot) {
      if (!aktifUsernames.includes(username)) {
        delete db.bot[username];
        console.log(`Deleted inactive bot: ${username}`);
        length += 1
      }
    }

    m.reply(`Berhasil menghapus ${length} bot`)

  },
  error: false,
  cache: true,
  owner: true,
  location: __filename
}