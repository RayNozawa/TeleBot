export const run = {
  usage: ['leaderboard'],
  hidden: ['lb', 'top', 'peringkat'],
  category: 'user',
  async: async (m, { conn, isPrefix, command, env, Func, Scraper }) => {
    let users = global.db?.users || []

    let seen = new Set()
    users = users.filter(u => {
      if (!u.jid || seen.has(u.jid)) return false
      seen.add(u.jid)
      return true
    })

    let validLimit = users.filter(u => typeof u.limit === 'number' && !isNaN(u.limit))
    let validExp   = users.filter(u => typeof u.exp === 'number' && !isNaN(u.exp))

    let userPremium = users.filter(u => u.premiumTime && u.premiumTime >= 1)

    let sortedLim = [...validLimit].sort((a, b) => b.limit - a.limit)
    let sortedExp = [...validExp].sort((a, b) => b.exp - a.exp)
    let sortedP   = [...userPremium].sort((a, b) => b.premiumTime - a.premiumTime)

    let lenLimit = Math.min(20, sortedLim.length)
    let lenExp   = Math.min(20, sortedExp.length)
    let lenPrem  = Math.min(20, sortedP.length)

    let rankLimit = sortedLim.findIndex(u => u.jid === m.sender) + 1
    let rankExp   = sortedExp.findIndex(u => u.jid === m.sender) + 1

    const limitNames = await Promise.all(sortedLim.slice(0, lenLimit).map(u => getName(u.jid)))
    const expNames   = await Promise.all(sortedExp.slice(0, lenExp).map(u => getName(u.jid)))
    const premiumNames = await Promise.all(sortedP.slice(0, lenPrem).map(u => getName(u.jid)))

    let text = `
• <b>Limit Leaderboard Top ${lenLimit}</b> •
Kamu: <b>${rankLimit || '-'}</b> dari <b>${sortedLim.length}</b>

${sortedLim.slice(0, lenLimit).map((u, i) => 
  `${i + 1}. ${limitNames[i]} <b>${u.limit} Limit</b>`
).join('\n')}

• <b>Exp Leaderboard Top ${lenExp}</b> •
Kamu: <b>${rankExp || '-'}</b> dari <b>${sortedExp.length}</b>

${sortedExp.slice(0, lenExp).map((u, i) => 
  `${i + 1}. ${expNames[i]} <b>Exp ${u.exp}</b>`
).join('\n')}
`.trim()

    await conn.reply(m.chat, text, m.msg, "HTML")

    await conn.reply(
      m.chat,
      `『 *PREMIUM* 』
${sortedP.slice(0, lenPrem).map(({ jid, premiumTime }, i) => 
`\n\n┌✦ ${premiumNames[i]}
┊☎️Nomor: ${jid}
${premiumTime > Date.now() ? clockString(premiumTime - Date.now()) : '┊ *Expired 🚫*'}`
).join('\n╚┈┈┈┈┈┈┈┈┈✧')}`.trim(),
      m.msg
    )
  },
  error: false,
  cache: true,
  location: __filename
}

function clockString(ms) {
  let ye = isNaN(ms) ? '--' : Math.floor(ms / 31104000000) % 10
  let mo = isNaN(ms) ? '--' : Math.floor(ms / 2592000000) % 12
  let d  = isNaN(ms) ? '--' : Math.floor(ms / 86400000) % 30
  let h  = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m  = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s  = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return ['┊ ', ye, ' *Tahun*\n', '┊ ', mo, ' *Bulan*\n', '┊ ', d, ' *Hari*\n', '┊ ', h, ' *Jam* ', m, ' *Menit* ', s, ' *Detik*'].join('')
}
