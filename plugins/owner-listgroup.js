export const run = {
  usage: ["listgroup"],
  hidden: ['listgrup'],
  category: "owner",
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    env,
    bot,
    isOwnerBot
  }) => {
    if (!isOwnerBot) return m.reply("Kamu bukan owner bot ini!")
    
    let the = ""
    for (const list of bot.listgroup) {
      try {
        const group = await conn.getChat(list)
        the += group.title ? `\n\nNama: ${group.title}\n` : ""
        the += group.id ? `ID: <code>${group.id}</code>\n` : ""
        the += group.type ? `Type: ${group.type}\n` : ""
        the += group.active_usernames ? `Url: https://t.me/${group.active_usernames}` : ""
      } catch (e) {
        console.log(e.message)
      }
    }
    
    await conn.reply(m.chat, the.trim(), m.msg, "HTML")
  },
  error: false,
  cache: true,
  location: __filename
}