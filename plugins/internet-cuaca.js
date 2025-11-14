import fetch from 'node-fetch'

export const run = {
  usage: ['cuaca'],
  hidden: ['weather'],
  use: 'lokasi',
  category: 'internet',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
    if (!text) return m.reply(`Pengunaan:\n${isPrefix + command} lokasi\n\nContoh:\n${isPrefix + command} Jakarta`)
    conn.sendChatAction(m.chat, "find_location")
    try {
      let res = await fetch(API('https://api.openweathermap.org', '/data/2.5/weather', {
        q: text,
        units: 'metric',
        appid: '060a6bcfa19809c2cd4d97a212b19273'
      }))
      if (!res.ok) return m.reply('lokasi tidak ditemukan')
      let json = await res.json()
      if (json.cod != 200) return m.reply(json)
      m.reply(`
Lokasi: ${json.name}
Negara: ${json.sys.country}
Cuaca: ${json.weather[0].description}
Suhu saat ini: ${json.main.temp} °C
Suhu tertinggi: ${json.main.temp_max} °C
Suhu terendah: ${json.main.temp_min} °C
Kelembapan: ${json.main.humidity} %
Angin: ${json.wind.speed} km/jam
    `.trim())
    } catch (e) {
      m.reply(`Tidak Dapat Menemukan Apa Yang Kamu Cari`)
    }
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}