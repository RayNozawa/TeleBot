export const run = {
  usage: ['cek'],
  hidden: ['rate','chek','check'],
  use: 'ask',
  category: 'fun',
  async: async (m, {
  	conn,
  	text,
  	isPrefix,
  	command,
  	Func,
  	env
  }) => {
  	if (!text) return m.reply(`Masukkan pertanyaan, contoh:\n*${isPrefix+command} kegantengan gw*`)

  	let p = '`'
  	const cek2 = Math.floor(Math.random() * 100)
  	m.reply(`${p}Pertanyaan:${p} *${command} ${text}*\n${p}Jawaban:${p} *${cek2}%*`)
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}