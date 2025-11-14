export const run = {
  usage: ['iqtest'],
  category: 'fun',
  async: async (m, {
    conn,
    text,
    command,
    isPrefix,
    env
  }) => {
  let iqValues = ['10%', '20%', '40%', '60%', '80%', '100%', `${pickRandom(global.iq)}%`];
  let { message_id } = await m.reply(`*${await getName(m.sender)}*, IQ Anda Sebesar : 10%`)

  for (let iq of iqValues) {
    await conn.editMsg(m.chat, message_id, `*${await getName(m.sender)}*, IQ Anda Sebesar : ${iq}`, donateBtn, "Markdown")
  }
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

global.iq = [
  '1', '14', '23', '35', '41', '50', '67', '72', '86', '99', '150', '340', '423', '500',
  '676', '780', '812', '945', '1000', 'Tidak Terbatas!', 'Unlimited', 'Tak Terhingga',
  '0', '777', '0,0001', '0,1', '999', '0,100', '0,999', '5000', '7500', '10000',
];
