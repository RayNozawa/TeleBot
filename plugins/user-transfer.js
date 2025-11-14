export const run = {
   usage: ['transfer'],
   hidden: ['tf'],
   use: 'type, jumlah, id',
   category: 'user',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      args
   }) => {
    if (args.length < 2) {
        return conn.reply(m.chat, `Reply pesan target atau masukkan id!\nFormat: *type jumlah id*\n\nContoh: *${isPrefix + command} limit 10 777000*\n\nKamu bisa mentransfer limit dan exp`.trim(), m.msg)
    } else try {
        let type = (args[0] || '').toLowerCase()
        let count = args[1] && args[1].length > 0 ? Math.min(99999999999999, Math.max(parseInt(args[1]), 1)) : Math.min(1)
        let who = m.quoted ? m.quoted.sender : args[2]
        if(!who) return m.reply('❗Reply pesan orangnya, atau masukkan pakai id')
        
        let target = global.db.users.find(v => v.jid == who);
        if (!target) return m.reply(`Target tidak ditemukan di database, periksa kembali id nya!`)
        
        switch (type) {
            case 'limit':
                if (users.limit >= count * 1) {
                    try {
                        users.limit -= count * 1
                        target.limit += count * 1
                        conn.reply(m.chat, `✅Berhasil Mentransfer Limit Sebesar ${count}`.trim(), m.msg)
                    } catch (e) {
                        m.reply('❌Gagal Menstransfer\nKemungkinan pengguna tidak ada di database')
                        console.log(e)
                    }
                } else conn.reply(m.chat, `❗Limit Kamu Tidak Mencukupi Untuk Mentransfer Sebesar ${count} Limit`.trim(), m.msg)
                break
                case 'exp':
                if (users.exp >= count * 1) {
                    try {
                        users.exp -= count * 1
                        target.exp += count * 1
                        conn.reply(m.chat, `✅Berhasil Mentransfer Exp Sebesar ${count}`.trim(), m.msg)
                    } catch (e) {
                        users.exp += count * 1
                        m.reply('❌Gagal Menstransfer\nKemungkinan pengguna tidak ada di database')
                        console.log(e)
                    }
                } else conn.reply(m.chat, `❗Exp Kamu Tidak Mencukupi Untuk Mentransfer Sebesar ${count} Exp`.trim(), m.msg)
                break
            default:
                return conn.reply(m.chat, `Contoh: *${isPrefix + command} limit 10 id*\nKamu bisa mentransfer limit dan exp`.trim(), m.msg)
        }
    } catch (e) {
        conn.reply(m.chat, `Contoh: *${isPrefix + command} limit 100 id*\nKamu bisa mentransfer limit dan exp`.trim(), m.msg)
        console.log(e)
    }
   },
   error: false,
   cache: true,
   location: __filename
};