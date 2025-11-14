export const run = {
   usage: ['tebakbom'],
   hidden: ['tbom','bomb'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
      conn.tebakbom = conn.tebakbom ? conn.tebakbom : {}
      let id = m.chat,
         timeout = 180000
      if (id in conn.tebakbom) return conn.reply(m.chat, '*^ sesi ini belum selesai!*', conn.tebakbom[id][0])
      
      let button = Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => {
          const num = row * 3 + col + 1;
          return { text: `${num}️⃣`, callback_data: `${num}` };
        })
      );
      button = JSON.parse(JSON.stringify(button));

      const bom = ['💥', '🍓', '🍑', '🍊', '🥭', '🍌', '🍏', '🥑', '🍉'].sort(() => Math.random() - 0.5);
      const number = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
      const array = []
      bom.map((v, i) => array.push({
         emot: v,
         number: number[i],
         position: i + 1,
         state: false
      }))
      let teks = `❏  *B O M B*\n\n`
      teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
      teks += array.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
      teks += array.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
      teks += array.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
      teks += `Timeout : *${((timeout / 1000) / 60)} menit*\nHadiah : 7000 Exp\n`
      teks += ` `
      conn.tebakbom[id] = [
         await conn.reply(m.chat, teks, m.msg, "Markdown", button),
         array, button,
         setTimeout(() => {
            let v = array.find(v => v.emot == '💥')
            if (conn.tebakbom[id]) conn.reply(m.chat, `*Waktu habis!*, Bom berada di kotak nomor ${v.number}.`, conn.tebakbom[id][0])
            delete conn.tebakbom[id]
         }, timeout)
      ]
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}