export const run = {
   usage: ['bonanza'],
   hidden: ['scatter'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env,
      users
   }) => {
    const user = m.msg.from.username ? '@' +m.msg.from.username : m.msg.from.first_name

    let time = users.bonanza + 120000
    if (new Date - users.bonanza < 120000) return m.reply(`⏱️Hei! tunggu *${msToTime(time - new Date())}* untuk bermain lagi`)
    
    const [bet, spin] = text.split(" ")
    if (!bet || !spin) return m.reply(`*Contoh:*\n*${isPrefix+command}* 500 15\n500 Bet, 15 Spin\n\nMaksimal Bet 500, Maksimal Spin 15`)

    let betAmount = parseInt(bet);
    let spinCount = parseInt(spin);

    if (isNaN(betAmount) || betAmount <= 0) return m.reply('Jumlah taruhan tidak valid.')

    if (isNaN(spinCount) || spinCount <= 0 || spinCount > 15) return m.reply('Jumlah spin harus antara 1 hingga 15.')

    if (betAmount > 501) return m.reply('✳️ Maksimal Taruhan 500 Exp')
    
    if (users.exp < betAmount) return conn.reply(m.chat, 'Exp kamu tidak cukup untuk taruhan ini.', m);

    users.exp -= betAmount;
    let singleBet = betAmount;
    let fruits = ['🍌', '🍎', '🍇', '🍊', '🥭'];
    let fruitValues = {
        '🍌': 10,
        '🍎': 5,
        '🍇': 9,
        '🍊': 7,
        '🥭': 4
    };

    let winPatterns = [
        ['🍎', '🍎', '🍎', '🍎'],
        ['🍌', '🍌', '🍌', '🍌'],
        ['🍇', '🍇', '🍇', '🍇'],
        ['🍊', '🍊', '🍊', '🍊'],
        ['🥭', '🥭', '🥭', '🥭'],
        ['🍎', '🍎', '🍎'],
        ['🍌', '🍌', '🍌'],
        ['🍇', '🍇', '🍇'],
        ['🍊', '🍊', '🍊'],
        ['🥭', '🥭', '🥭']
    ];

    let wins = 0;
    let losses = 0;
    let totalWinAmount = 0;
    let totalLossAmount = 0;
    let bigWins = 0;
    let superWins = 0;
    let winFruits = { '🍌': 0, '🍎': 0, '🍇': 0, '🍊': 0, '🥭': 0 };
    let scatterWins = 0;

    const generateSpinResult = () => {
        let result = [];
        for (let i = 0; i < 4; i++) {
            let row = [];
            for (let j = 0; j < 5; j++) {
                row.push(fruits[Math.floor(Math.random() * fruits.length)]);
            }
            result.push(row);
        }
        return result;
    };

    const checkWin = (result) => {
        for (let pattern of winPatterns) {
            for (let row of result) {
                let joinedRow = row.join('');
                if (joinedRow.includes(pattern.join(''))) {
                    let fruit = pattern[0];
                    if (pattern.length === 4) {
                        scatterWins++;
                        totalWinAmount += singleBet
                        winFruits[fruit]++;
                        return 'Scatter Win';
                    } else {
                        wins++;
                        totalWinAmount += singleBet
                        winFruits[fruit]++;
                        return 'Win';
                    }
                }
            }
        }
        return 'Lose';
    };

    let { message_id } = await m.reply(`╭──────────────────\n│ 👤${user}\n│ *🎰Spin*: ${spinCount}\n│ *🪙Bet*: ${betAmount}\n╰──────────────────\n           ❃𝗙𝗥𝗨𝗜𝗧 𝗦𝗣𝗜𝗡❃`)
    users.bonanza = new Date * 1
        
    for (let i = 0; i < spinCount; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        let spinResult = generateSpinResult();
        let spinText = spinResult.map(row => `┃ ${row.join(' │ ')} ┃`).join('\n');
        let spinStatus = checkWin(spinResult);

        if (spinStatus === 'Lose') {
            losses++;
            totalLossAmount += singleBet;
        }

        let updateMessage = `╭──────────────────\n│ 👤${user}\n│ *🎰Spin*: ${spinCount}\n│ *🪙Bet*: ${betAmount}\n╰──────────────────\n           ❃𝗙𝗥𝗨𝗜𝗧 𝗦𝗣𝗜𝗡❃\n${spinText}`;

        if (i === spinCount - 1) {
            updateMessage += `\n╭──────────────────\n│ *🏆win*: ${totalWinAmount}\n│➞ 🍎 Apel: ${winFruits['🍎']}\n│➞ 🍌 Pisang: ${winFruits['🍌']}\n│➞ 🍇 Anggur: ${winFruits['🍇']}\n│➞ 🍊 Jeruk: ${winFruits['🍊']}\n│➞ 🥭 Mangga: ${winFruits['🥭']}\n│ *Lose*: ${totalLossAmount}\n│ *Scater*: ${scatterWins}\n╰──────────────────`;
        }

        await conn.editMsg(m.chat, message_id, updateMessage, donateBtn, "Markdown")
    }
    users.exp -= totalLossAmount;
    users.exp += totalWinAmount;
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100);
  var seconds = Math.floor((duration / 1000) % 60);
  var minutes = Math.floor((duration / (1000 * 60)) % 60);

  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return minutes + " Menit " + seconds + " Detik";
}