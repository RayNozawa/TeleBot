export const run = {
  usage: ['kapankah'],
  hidden: ['kapan'],
  use: "ask",
  category: 'fun',
  async: async (m, {
    conn,
    text,
    command,
    isPrefix,
    env
  }) => {
    if (!text) return m.reply("Masukkan pertanyaan!")
    conn.reply(m.chat, `*Pertanyaan:* ${command} ${text}\n*Jawaban:* ${getRandom(10)} ${getRandom(['detik', 'menit', 'jam', 'hari', 'minggu', 'bulan', 'tahun', 'dekade', 'abad'])} lagi ...`)
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}