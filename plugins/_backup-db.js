import fs from 'fs';
import path from 'path';
import archiver from "archiver";

export const run = {
   async: async (m, { conn, Api, body, Func, users, env, isROwner }) => {
    if (!db.backupTime) db.backupTime = 0
    const now = Date.now();
    const THIRTY_MIN = 5 * 60 * 1000;

    if (now - db.backupTime < THIRTY_MIN) return;

  try {
    const backupFile = path.join(__dirname, `../tmp/backup_script.zip`);
    const output = fs.createWriteStream(backupFile);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);

    archive.glob("**/*", {
      cwd: path.join(__dirname, ".."),
      ignore: ["node_modules/**", "package-lock.json", ".npm", ".git/**", "tmp/**"],
    });

    await archive.finalize();

    output.on("close", async () => {
      try {
        await conn.sendDocument(env.OWNER_ID, backupFile);

        console.log(`Backup berhasil dikirim ke owner ${env.owner}`);
        fs.unlinkSync(backupFile);
      } catch (err) {
        console.error("❌ Gagal kirim file backup:", err.message);
      }
    });
  } catch (err) {
    console.error("❌ Gagal buat file backup:", err.message);
  }
   },
   error: false,
   cache: true,
   location: __filename
};