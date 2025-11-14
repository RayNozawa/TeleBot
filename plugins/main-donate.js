export const run = {
   usage: ['donate'],
   hidden: ['donasi'],
   category: 'main',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      Scraper
   }) => {
     let caption = 'Haii👋 Terimakasih jika kamu mau berdonasi, untuk donasi scan qris di atas bisa menggunakan semua metode pembayaran yang mendukang qris, 1 perak darimu sangat berharga\n\n' + env.wm
     try {
       await conn.sendFile(m.chat, 'https://files.catbox.moe/znkpet.jpg', 'cover.jpg', caption, m.msg);
     } catch (e) {
       m.reply("Gagal mengambil gambar!")
     }
   }
}