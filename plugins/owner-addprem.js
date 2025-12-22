export const run = {
   usage: ['addprem'],
   use: 'hari, id',
   category: 'owner',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      args
   }) => {
    if (args.length < 1) {
        return conn.reply(m.chat, `Reply pesan target atau masukkan id!\nFormat: *hari id*\n\nContoh: *${isPrefix + command} 30 777000*\n\nJika dalam grup kamu bisa reply pesan target tanpa memasukkan id`.trim(), m.msg)
    } else try {
        let count = args[0] && args[0].length > 0 ? Math.min(99999999999999, Math.max(parseInt(args[0]), 1)) : Math.min(1)
        let who = m.quoted ? m.quoted.sender : args[1]
        if(!who) return m.reply('❗Reply pesan orangnya, atau masukkan pakai id')
        
        let target = global.db.users.find(v => v.jid == who);
        if (!target) return m.reply(`Target tidak ditemukan di database, periksa kembali id nya!`)
        
        if (!target.premiumTime) target.premiumTime = 0
        let jumlahHari = 86400000 * count
        let now = new Date() * 1
        if (now < target.premiumTime) target.premiumTime += jumlahHari
        else target.premiumTime = now + jumlahHari
        target.premium = true
        
        conn.reply(m.chat, `✅Berhasil Menambah Premium Selama ${count} Hari`.trim(), m.msg)
    } catch (e) {
        conn.reply(m.chat, `Contoh: *${isPrefix + command} 30 777000*\nJika dalam grup kamu bisa reply pesan target tanpa memasukkan id`.trim(), m.msg)
        console.log(e)
    }
   },
   error: false,
   cache: true,
   owner: true,
   location: __filename
};