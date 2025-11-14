export const run = {
   usage: ['cekid'],
   hidden: ['getid'],
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
     const q = m.quoted?.msg || m.msg
     
     let capt = `👤 Nama: ${q.from.first_name} `
     capt += q.from.last_name ? q.from.last_name : ''
     capt += `\n🆔 ID: \`${q.from.id}\``
     capt += q.from.username ? `\n🌐 Username: @${q.from.username}` : ''
     if (m.isGroup) {
       capt += `\n\n🌍Group ID: \`${m.chat}\``
     }
     
     m.reply(capt)
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}