export const run = {
  usage: ['berburu'],
  category: 'fun',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
  let time = users.lastwork + 60000;
  if (new Date() - users.lastwork < 60000) return m.reply(`😴 *Kamu cape* harus nunggu *${msToTime(time - new Date())}* biar bisa berburu🏹`);

  let hewan = {
    '🐂 Banteng': 0, '🐅 Harimau': 0, '🐘 Gajah': 0, '🐐 Kambing': 0, '🐼 Panda': 0,
    '🐃 Kerbau': 0, '🐮 Sapi': 0, '🐒 Monyet': 0, '🐗 Babi Hutan': 0, '🐖 Babi': 0, '🐓 Ayam': 0
  };

  // Menentukan jumlah acak untuk setiap hewan
  for (let h in hewan) hewan[h] = pickRandom([1, 2, 3, 4, 5]);

  let totalHewan = Object.values(hewan).reduce((a, b) => a + b, 0);
  let exp = totalHewan * 100;
  users.exp += exp;

  const name = await getName(m.sender)
  let { message_id } = await m.reply('Mempersiapkan Peralatan🏹')
 
  setTimeout(() => {
    conn.editMsg(m.chat, message_id, `Mencari buruan🔎`, donateBtn, "Markdown")
    
    setTimeout(() => {
      conn.editMsg(m.chat, message_id, `Sedang memanah buruan🏹`, donateBtn, "Markdown")
    
      setTimeout(() => {
        m.reply(`Hasil Buruan *${name}*\n\n` +
                      Object.entries(hewan).map(([nama, jumlah]) => `${nama}: ${jumlah}`).join('\n') +
                      `\n\nTotal hewan: *${totalHewan}*\nHewan telah dijual, dan mendapatkan *${exp}* exp`)
      }, 5000);
    }, 2000);
  }, 2000);

  users.lastwork = new Date() * 1;
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}

function msToTime(duration) {
  return `${Math.floor((duration / 1000) % 60)} detik`;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
