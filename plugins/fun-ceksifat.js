import fetch from 'node-fetch';

export const run = {
  usage: ['ceksifat', 'masadepannya'],
  hidden: ['masadepan', 'sifat'],
  category: 'fun',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    users,
    env
  }) => {
    let nm = 100;
    let a = Math.floor(Math.random() * nm)
    let b = Math.floor(Math.random() * nm)
    let e = Math.floor(Math.random() * nm)
    let f = Math.floor(Math.random() * nm)
    let g = Math.floor(Math.random() * nm)
    let h = Math.floor(Math.random() * nm)
    let c = getRandom(['Baik Hati', 'Sombong', 'Pelit', 'Dermawan', 'Rendah Hati', 'Rendah Diri', 'Pemalu', 'Penakut', 'Pengusil', 'Cengeng'])
    let d = getRandom(['Rajin', 'Malas', 'Membantu', 'Ngegosip', 'Jail', 'Gak jelas', 'Shoping', 'Chattan sama Doi', 'Chattan di WA karna Jomblo', 'Sedih', 'Kesepian', 'Bahagia'])
    const nama = `${text ? text : await getName(m.quoted ? m.quoted.sender : m.sender)}`

    let msdpn = getRandom([
      `Anda akan menjadi orang yang kaya, keluarga yang harmonis, memiliki ${b} anak, memiliki ${d}, memiliki kendaraan, memiliki rumah`,
      `Anda akan menjadi orang yang sederhana, keluarga yang harmonis, memiliki ${c}, memiliki ${a} anak, memiliki kendaraan, memiliki rumah`,
      `Anda akan menjadi orang yang miskin, keluarga yang sederhana, memiliki ${a} anak, tidak memiliki kendaraan, rumah ngontrak`,
      `Anda akan menjadi orang yang sederhana, keluarga yang dicerai, memiliki ${e} anak, memiliki ${b} kendaraan, memiliki ${b} rumah`,
      `Anda akan menjadi orang yang sederhana, keluarga yang sederhana, memiliki ${b} anak, memiliki ${b} kendaraan, memiliki ${a} rumah`,
      `Anda akan menjadi orang yang miskin, keluarga yang dicerai memiliki ${b} anak, memiliki ${a} kendaraan, memiliki ${a} rumah`,
      `Anda akan menjadi orang yang kaya, keluarga yang sederhana, memiliki ${a} anak, memiliki ${a} kendaraan, memiliki ${b} rumah`,
      `Anda akan menjadi orang yang sederhana, keluarga yang harmonis, memiliki ${a} anak, memiliki ${c} kendaraan, memiliki ${a} rumah`,
      `Anda akan menjadi orang yang miskin, tidak memiliki keluarga (jomblo), tidak memiliki anak, tidak memiliki kendaraan, tidak memiliki rumah`,
      `Anda akan menjadi orang yang sederhana, keluarga yang sederhana, memiliki ${d} anak, memiliki ${a} kendaraan, memiliki ${b} rumah`,
      `Anda akan menjadi orang yang sederhana, keluarga yang kacau, tidak memiliki anak (Gugur), memiliki ${b} kendaraan, memiliki ${a} rumah`,
      `Anda akan menjadi orang yang sangat kaya, keluarga yang sangat harmonis, memiliki ${e} anak, memiliki ${f} kendaraan, memiliki ${g} rumah`,
      `Anda akan menjadi orang yang sangat miskin, keluarga yang sederhana, memiliki ${g} anak, tidak memiliki kendaraan, rumah ngontrak`,
      `Anda akan menjadi orang yang kaya, keluarga yang pelit, memiliki ${b} anak, memiliki ${b} kendaraan, memiliki ${b} rumah`,
      `Anda akan menjadi orang yang sederhana, keluarga yang pelit, memiliki ${a} anak, memiliki ${a} kendaraan, memiliki ${a} rumah`,
      `Anda akan menjadi orang yang sederhana, keluarga yang dicerai, memiliki ${b} anak, memiliki ${a} kendaraan, rumah ngontrak`,
      `Anda akan menjadi orang yang sangat sederhana, keluarga yang sakinah, memiliki ${a} anak, memiliki ${a} kendaraan, memiliki ${a} rumah`,
      `Anda akan menjadi orang yang sederhana, keluarga yang sangat sederhana, memiliki ${a}${a} anak, memiliki ${a} kendaraan, memiliki ${a} rumah`,
      `Anda akan menjadi orang yang sederhana, keluarga yang sangat sederhana, memiliki ${b} anak kembar, memiliki ${c} kendaraan, memiliki ${b} rumah`,
      `Anda akan menjadi orang yang sederhana, keluarga yang sederhana, memiliki ${b} anak kembar dan ${a} anak lagi, memiliki ${a} kendaraan, memiliki ${a} rumah`,
    ])

    if (command.match(/((cek)?sifat)/gi)) {
      let loadd = [
        `*‣ SIFAT ${nama}*🔖 
├─❏ Ahlak Baik : *${a}%*`,
        `*‣ SIFAT ${nama}*🔖 
├─❏ Ahlak Baik : *${a}%*
├─❏ Ahlak Buruk : *${b}%*`,
        `*‣ SIFAT ${nama}*🔖 
├─❏ Ahlak Baik : *${a}%*
├─❏ Ahlak Buruk : *${b}%*
├─❏ Orang yang : *${c}*`,
        `*‣ SIFAT ${nama}*🔖 
├─❏ Ahlak Baik : *${a}%*
├─❏ Ahlak Buruk : *${b}%*
├─❏ Orang yang : *${c}*
├─❏ Selalu : *${d}*`,
        `*‣ SIFAT ${nama}*🔖 
├─❏ Ahlak Baik : *${a}%*
├─❏ Ahlak Buruk : *${b}%*
├─❏ Orang yang : *${c}*
├─❏ Selalu : *${d}*
├─❏ Kecerdasan : *${e}%*`,
        `*‣ SIFAT ${nama}*🔖 
├─❏ Ahlak Baik : *${a}%*
├─❏ Ahlak Buruk : *${b}%*
├─❏ Orang yang : *${c}*
├─❏ Selalu : *${d}*
├─❏ Kecerdasan : *${e}%*
├─❏ Kenakalan : *${f}%*`,
        `*‣ SIFAT ${nama}*🔖 
├─❏ Ahlak Baik : *${a}%*
├─❏ Ahlak Buruk : *${b}%*
├─❏ Orang yang : *${c}*
├─❏ Selalu : *${d}*
├─❏ Kecerdasan : *${e}%*
├─❏ Kenakalan : *${f}%*
├─❏ Keberanian : *${g}%*`,
        `*‣ SIFAT ${nama}*🔖
├─❏ Ahlak Baik : *${a}%*
├─❏ Ahlak Buruk : *${b}%*
├─❏ Orang yang : *${c}*
├─❏ Selalu : *${d}*
├─❏ Kecerdasan : *${e}%*
├─❏ Kenakalan : *${f}%*
├─❏ Keberanian : *${g}%*
└─❏ Ketakutan : *${h}%*`
      ]

      let { message_id } = await conn.reply(m.chat, `*SIFAT ${nama}*🔖`, m.msg)

      for (let i = 0; i < loadd.length; i++) {
        await conn.editMsg(m.chat, message_id, loadd[i], donateBtn, "Markdown")
      }
      
    } else if (command.match(/(masadepan(n)?(ya)?)/gi)) {
      let loadd = [
        `*${nama}*, Anda akan`,
        `*${nama}*, Anda akan menjadi`,
        `*${nama}*, Anda akan menjadi orang`,
        `*${nama}*, Anda akan menjadi orang yang`,
        `*${nama}*, ${msdpn}`
      ]

      let { message_id } = await conn.reply(m.chat, `*${nama}*, Anda️`, m.msg)

      for (let i = 0; i < loadd.length; i++) {
        await conn.editMsg(m.chat, message_id, loadd[i], donateBtn, "Markdown")
      }
    }
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}

function getRandom(media) {
  const randomIndex = Math.floor(Math.random() * media.length);
  return media[randomIndex]
}