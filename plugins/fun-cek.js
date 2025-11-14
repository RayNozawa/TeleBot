export const run = {
  usage: ['cekbodoh', 'cekgay', 'ceklesbi', 'cekjelek', 'cekganteng',
  'cekcantik',
  'cekbego',
  'cekpedo',
  'ceksuhu',
  'cekpintar',
  'cekjago',
  'ceknolep',
  'cekbeban',
  'cekbaik',
  'cekjahat',
  'cekpakboy',
  'cekpakgirl',
  'cekbaper',
  'cekalim',
  'ceksuhu',
  'cekkeren',
  'cekpasarkas',
  'ceksigma',
  'ceksuki',
  'ceknegro',
  'cekkul',
  'cantikcek',
  'cekkhodam'
],
  category: 'fun',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env,
    args
  }) => {
  let who = m.quoted ? m.quoted.sender : m.sender
  let time = users.lastcommand + 10000
  if (new Date - users.lastcommand < 10000) return global.cd("1 menit")

  const cek2 = Math.floor(Math.random() * 100)

  let tag = await getName(who)
  const nama = `${text ? text : tag}`
  let cap = `*Pertanyaan:* ${command}\n*Nama:* ${nama}\n*Jawaban:* ${cek2}%`

  switch (command) {
    case 'cekkhodam':
    case 'cekkodam':
    case 'khodam':
    case 'kodam':
      const khodam = pickRandom([
        "Kaleng Cat Avian",
        "Pipa Rucika",
        "Botol Tupperware",
        "Badut Mixue",
        "Sabun GIV",
        "Sandal Swallow",
        "Jarjit",
        "Ijat",
        "Fizi",
        "Mail",
        "Ehsan",
        "Upin",
        "Ipin",
        "Sungut lele",
        "Tok Dalang",
        "Opah",
        "Opet",
        "Lord Alul",
        "Pak Vinsen",
        "Maman Resing",
        "Pak RT",
        "Admin ETI",
        "Bung Towel",
        "Lumpia Basah",
        "Martabak Manis",
        "Baso Tahu",
        "Tahu Gejrot",
        "Dimsum",
        "Seblak Ceker",
        "Telor Gulung",
        "Tahu Aci",
        "Tempe Mendoan",
        "Nasi Kucing",
        "Kue Cubit",
        "Tahu Sumedang",
        "Nasi Uduk",
        "Wedang Ronde",
        "Kerupuk Udang",
        "Cilok",
        "Cilung",
        "Kue Sus",
        "Jasuke",
        "Seblak Makaroni",
        "Sate Padang",
        "Sayur Asem",
        "Kromboloni",
        "Marmut Pink",
        "Belalang Mullet",
        "Kucing Oren",
        "Lintah Terbang",
        "Singa Paddle Pop",
        "Macan Cisewu",
        "Vario Mber",
        "Beat Mber",
        "Supra Geter",
        "Oli Samping",
        "Knalpot Racing",
        "Harimau Janda",
        "Kadal Beranak",
        "Musang Jawa",
        "Sapi Mojokerto",
        "Badak Timor Leste",
        "Belalang Khas Jayapura",
        "Kutu Meksiko",
        "Kuntilanak Jingga",
        "Anggrek Mekar Bondowoso",
        "Jus Stroberi",
        "Jus Alpukat",
        "Alpukat Kocok",
        "Es Kopyor",
        "Es Jeruk",
        "Cappucino Cincau",
        "Jasjus Melon",
        "Teajus Apel",
        "Pop ice Mangga",
        "Teajus Gulabatu",
        "Air Selokan",
        "Air Kobokan",
        "TV Tabung",
        "Keran Air",
        "Tutup Panci",
        "Kotak Amal",
        "Tutup Termos",
        "Tutup Botol",
        "Kresek Item",
        "Kepala Casan",
        "Ban Serep",
        "Kursi Lipat",
        "Kursi Goyang",
        "Kulit Pisang",
        "Warung Madura",
        "Gorong-gorong",
      ])
      await m.reply(`Khodam *${nama}* Adalah *${khodam}*`)
      break

    case 'ceksigma':
      users.lastcommand = new Date * 1
      await conn.sendPhoto(m.chat, "https://telegra.ph/file/bc2e5b43ffc052f5a80b3.png", { caption: cap, reply_to_message_id: m.id, parse_mode: "Markdown" })
      break

    case 'ceknegro':
      users.lastcommand = new Date * 1
      await conn.sendPhoto(m.chat, "https://telegra.ph/file/5430d33116d325ddc0395.png", { caption: cap, reply_to_message_id: m.id, parse_mode: "Markdown" })
      break

    case 'ceksuki':
      users.lastcommand = new Date * 1
      await conn.sendVideo(m.chat, "https://telegra.ph/file/0ea7b4df36e78147643ec.mp4", { caption: cap, reply_to_message_id: m.id, parse_mode: "Markdown" })
      break

    case 'cantikcek':
      users.lastcommand = new Date * 1
      let levelcantik = `${pickRandom(cantikk)}`
      let cantikedit = [
        `*${nama}*\n\nCantik Level : 20%`,
        `*${nama}*\n\nCantik Level : 40%`,
        `*${nama}*\n\nCantik Level : 60%`,
        `*${nama}*\n\nCantik Level : 80%`,
        `*${nama}*\n\nCantik Level : 100%`,
        `*${nama}*\n\nCantik Level : ${levelcantik}`,
      ]
      
      let { message_id } = m.reply(`*${nama}*\n\nCantik Level : 10%`)
      
      for (let i = 0; i < cantikedit.length; i++) {
        conn.editMsg(m.chat, message_id, cantikedit[i], donateBtn, "Markdown")
      }
      break

    case 'cekgay':
    case 'ceklesbi':
    case 'ceklesby':
    case 'cekjelek':
    case 'cekganteng':
    case 'cekcantik':
    case 'cekbego':
    case 'cekpedo':
    case 'ceksuhu':
    case 'cekpintar':
    case 'cekjago':
    case 'ceknolep':
    case 'cekbeban':
    case 'cekbaik':
    case 'cekjahat':
    case 'cekpakboy':
    case 'cekpakgirl':
    case 'cekbaper':
    case 'cekalim':
    case 'ceksuhu':
    case 'cekkeren':
    case 'cekpasarkas':
    case 'cekbodoh':
    case 'cekpinter':
    case 'cekkul': {
      m.reply(cap)
      users.lastcommand = new Date * 1
      break;
    }
  }
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

let cantikk = [
  '4%\n\nINI MUKA ATAU SAMPAH?!',
  '7%\n\nSerius ya,, Lu ampir mirip kayak Monyet!',
  '12%\n\nMakin lama liat muka lo gw bisa muntah!',
  '22%\n\nMungkin karna lo sering berbuat maksiat😂',
  '27%\n\nKeknya bakal susah dapet jodoh lu,, berdoa aja',
  '35%\n\nYang sabar ya ayang',
  '41%\n\nSemoga diberkati mendapat jodoh',
  '48%\n\nDijamin cowok susah deketin lo',
  '56%\n\nLu Setengah Cantik :v',
  '64%\n\nCukuplah',
  '71%\n\nLumayan cantik juga lu ya',
  '2%\n\nAWOAKAK BURIQQQ!!!',
  '4%\n\nAWOAKAK BURIQQQ!!!',
  '1%\n\nAWOAKAK BURIQQQ SEKALI!!!',
  '6%\n\nAWOAKAK BURIQQQ!!!',
  '77%\n\nGak akan Salah Lagi dah neng',
  '83%\n\nDijamin cowok gak akan kecewa neng',
  '89%\n\ncowok2 pasti auto salfok klo ngeliat lo!',
  '94%\n\nAARRGGHHH!!!',
  '100%\n\nKamu Cantik!, Jadi Pacar Gw Aja',
]