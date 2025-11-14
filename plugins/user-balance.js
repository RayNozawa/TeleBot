import axios from 'axios'

export const run = {
   usage: ['balance'],
   hidden: ['limit','bal','xp','exp'],
   category: 'user',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      isROwner,
      env
   }) => {
     try {
       let capt = `- Nama: *${m.msg.from.first_name} ${m.msg.from.last_name ? m.msg.from.last_name : ''}*`
       capt += m.msg.from.username ? `\n- Username: @${m.msg.from.username}` : ''
       capt += `\n- Status: *${isROwner ? "Developer👑" : users.premiumTime > 0 ? "Premium User🌟" : "Free User"}*`;
       capt += users.limit ? `\n\n- Limit: *${users.limit}*` : ''
       capt += users.exp ? `\n- EXP: *${users.exp}*` : ''
       capt += `\n\nUpgrade premium / buy limit hub: @${env.owner}`
       m.reply(capt)
     } catch (e) {
       m.reply('Terjadi kesalahan: ' + e.message);
     }
   },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}