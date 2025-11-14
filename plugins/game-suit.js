export const run = {
  usage: ['suit'],
  category: 'game',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
let time = users.lastcommand + 10000
if (new Date - users.lastcommand < 10000) return global.cd('10 detik')

    let salah = `📍Pilihan yang tersedia:\n\ngunting, kertas, batu\n\n*Contoh:* ${isPrefix + command} gunting`
    if (!text) return m.reply(salah)
    var astro = Math.random()

    if (astro < 0.34) {
        astro = 'batu'
    } else if (astro > 0.34 && astro < 0.67) {
        astro = 'gunting'
    } else {
        astro = 'kertas'
    }

    //menentukan rules
    if (text == astro) {
        users.limit += 3
        m.reply(`🔻Seri!\nkamu: ${text}\nBot: ${astro}\n\n+3 Limit`)
    } else if (text == 'batu') {
        if (astro == 'gunting') {
            
            users.limit += 5
            m.reply(`🎉Kamu menang!\nKamu: ${text}\nBot: ${astro}\n\n+5 Limit`)
        } else {
            users.limit -= 4
            m.reply(`🚫Kamu kalah!\nKamu: ${text}\nBot: ${astro}\n\n-4 Limit`)
        }
    } else if (text == 'gunting') {
        if (astro == 'kertas') {
            
            users.limit += 5
            m.reply(`🎉Kamu menang!\nKamu: ${text}\nBot: ${astro}\n\n+5 Limit`)
        } else {
            users.limit -= 4
            m.reply(`🚫Kamu kalah!\nKamu: ${text}\nBot: ${astro}\n\n-4 Limit`)
        }
    } else if (text == 'kertas') {
        if (astro == 'batu') {

            users.limit += 5
            m.reply(`🎉Kamu menang!\nKamu: ${text}\nBot: ${astro}\n\n+5 Limit`)
        } else {
            users.limit -= 4
            m.reply(`🚫Kamu kalah!\nKamu: ${text}\nBot: ${astro}\n\n-4 Limit`)
        }
    } else {
        return m.reply(salah)
    }
    users.lastcommand = new Date * 1
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}