import TicTacToe from '../lib/tictactoe.js'

export const run = {
   usage: ['tictactoe'],
   hidden: ['ttt'],
   category: 'game',
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
    conn.game = conn.game ? conn.game : {}
    if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) return m.reply('Kamu masih didalam game\nKetik *nyerah* untuk mengakhiri')
    let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
    if (room) {
        m.reply('Partner ditemukan!')
        room.o = m.chat
        room.game.playerO = m.sender
        room.state = 'PLAYING'
        let arr = room.game.render().map(v => {
            return {
                X: '❌',
                O: '⭕',
                1: '1️⃣',
                2: '2️⃣',
                3: '3️⃣',
                4: '4️⃣',
                5: '5️⃣',
                6: '6️⃣',
                7: '7️⃣',
                8: '8️⃣',
                9: '9️⃣',
            }[v]
        })
        let str = `
Room ID: ${room.id}
${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}
Menunggu ${await getName(room.game.currentTurn)}
Ketik *nyerah* untuk nyerah
`.trim()
        if (room.x !== room.o) await conn.reply(room.x, str)
        await conn.reply(room.o, str, m.msg)
    } else {
        room = {
            id: 'tictactoe-' + (+new Date),
            x: m.chat,
            o: '',
            game: new TicTacToe(m.sender, 'o'),
            state: 'WAITING'
        }
        if (text) room.name = text
        m.reply(`Menunggu partner\nKetik *${isPrefix+command}* untuk join` + (text ? ` mengetik command dibawah ini
${iPrefix}${command} ${text}` : ''))
        conn.game[room.id] = room
    }
  },
  error: false,
  restrict: true,
  location: __filename
}