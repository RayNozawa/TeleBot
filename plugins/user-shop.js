const xpperlimit = 1000
export const run = {
   usage: ['buylimit'],
   hidden: ['buylimitall'],
   use: 'jumlah',
   category: 'user',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      Scraper
   }) => {
  const args = text.split(" ")
  let count = command.replace(/^buylimit/i, '')
  count = count ? /all/i.test(count) ? Math.floor(users.exp / xpperlimit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)
  if (users.exp >= xpperlimit * count) {
    users.exp -= xpperlimit * count
    users.limit += count
    let nota = `┌─「 <b>NOTA PEMBAYARAN</b> 」
‣ <b>Nominal pembelian</b> : + ${count}💎 
‣ <b>Menggunakan</b> : -${xpperlimit * count} XP
└──────────────`
await conn.reply(m.chat, nota, m.msg, "HTML", [[{ text: 'Tukar Semua EXP', callback_data: isPrefix+'buylimitall' }]])
  } else conn.reply(m.chat, `❎ Maaf, kamu tidak memiliki cukup *XP* untuk membeli *${count}* Limit\n\nKamu bisa mendapatkan *XP* dengan bermain game, atau menambahkan bot ini ke grup untuk mendapat premium, atau beli limit ke owner ketik *.owner*`, m.msg)
   },
   error: false,
   cache: true,
   location: __filename
};