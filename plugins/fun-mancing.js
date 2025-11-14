export const run = {
  usage: ['mancing'],
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
  if (new Date() - users.lastwork < 60000) return m.reply(`😴 *Kamu cape* harus nunggu *${msToTime(time - new Date())}* biar bisa mancing🎣`);

  let ikan = {
    '🦀 Kepiting': 0, '🦞 Lobster': 0, '🦐 Udang': 0, '🦑 Cumi': 0, '🐙 Gurita': 0, '🐡 Buntal': 0,
    '🐠 Dory': 0, '🐳 Orca': 0, '🐬 Lumba-lumba': 0, '🐋 Paus': 0, '🦈 Hiu': 0
  };

  for (let i in ikan) ikan[i] = pickRandom([1, 2, 3, 4, 5]);

  let totalIkan = Object.values(ikan).reduce((a, b) => a + b, 0);
  let exp = totalIkan * 100;
  users.exp += exp;
  users.lastwork = new Date() * 1;

  const name = await getName(m.sender)
  let { message_id } = await m.reply('Mempersiapkan Peralatan🎣🪱')
 
  setTimeout(() => {
    conn.editMsg(m.chat, message_id, 'Mulai Memancing🎣', donateBtn, "Markdown")

    setTimeout(() => {
      conn.editMsg(m.chat, message_id, 'Menarik Pancingan🎣', donateBtn, "Markdown")

      setTimeout(() => {
        m.reply(`Hasil Pancingan *${name}* 🎣\n\n` +
                      Object.entries(ikan).map(([nama, jumlah]) => `${nama}: ${jumlah}`).join('\n') +
                      `\n\nTotal tangkapan: *${totalIkan}*\nHasil tangkapan telah dijual, dan mendapatkan *${exp}* exp`)
      }, 5000);
    }, 2000);
  }, 2000);
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
