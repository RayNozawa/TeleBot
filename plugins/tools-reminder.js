import gtts from 'node-gtts'
import { readFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import moment from 'moment';
import axios from 'axios';

export const run = {
  usage: ['reminder'],
  hidden: ['pengingat','stopwatch'],
  use: 'time',
  category: 'tools',
  async: async (m, { conn, isPrefix, text, command, args }) => {
  if (!text) return m.reply(`Contoh penggunaan:\n${isPrefix+command} 10m makan\nGunakan format seperti 1d, 1m, 1j`);

  const timeRegex = /(\d+)(m|j|d|h)/;
  const match = text.match(timeRegex);

  if (!match) {
    return m.reply(`Format waktu tidak valid. Gunakan format seperti 1d, 1m, 1j, dan 1h\n\nContoh: ${usedPrefix+command} 1m tidur`);
  }

  const timeValue = parseInt(match[1]);
  const timeUnit = match[2];
  let reminderText = text.replace(timeRegex, '').trim();

  if (!reminderText) {
    return m.reply("Tolong masukkan pesan pengingat setelah waktu.");
  }

let ms = 0;
if (timeUnit === 'd') ms = timeValue * 1000;  // Menambahkan detik
if (timeUnit === 'm') ms = timeValue * 60 * 1000;
if (timeUnit === 'j') ms = timeValue * 60 * 60 * 1000;
if (timeUnit === 'h') ms = timeValue * 24 * 60 * 60 * 1000;

const reminderTime = moment().add(ms, 'ms').toDate();
await m.reply(`Pengingat untuk "${reminderText}" telah diatur dan akan dikirimkan setelah ${args[0]}`);

  setTimeout(async () => {
    await conn.reply(m.chat, `⏰ Pengingat: ${reminderText}`, m.msg)
    const { data } = await axios.post("https://tiktok-tts.weilnet.workers.dev/api/generation", {
    "text": `pengingat aktif untuk ${reminderText},               `.repeat(2),
    "voice": 'id_001'
})

const { data: ppBuffer } = await axios.get(await getPpUser(conn, m.sender), { responseType: "arrayBuffer" })
await conn.sendAudio(m.chat, Buffer.from(data.data, "base64"), {
  filename: "lagu_baru.mp3",
  contentType: "audio/mpeg",
  caption: "Ini audio terbaru",
  thumb: ppBuffer
});

  }, ms);
},
   error: false,
   limit: true,
   cache: true,
   location: __filename
}

function tts(text, lang = 'id') {
  console.log(lang, text)
  return new Promise((resolve, reject) => {
    try {
      let tts = gtts(lang)
      let filePath = join(global.__dirname(import.meta.url), '../tmp', (1 * new Date) + '.wav')
      tts.save(filePath, text, () => {
        resolve(readFileSync(filePath))
        unlinkSync(filePath)
      })
    } catch (e) { reject(e) }
  })
}