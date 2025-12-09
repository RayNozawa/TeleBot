import axios from "axios";
import { format } from "util";

export const run = {
   usage: ['tiktok'],
   hidden: ['tiktokdl','tt','tiktokhd'],
   use: 'url',
   category: 'downloader',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {	
	const input = text ? text : m.quoted?.text ? m.quoted.text : text
	if (!input) return m.reply(`*❗Masukkan Url, Contoh:*\n\n${isPrefix + command} https://vm.tiktok.com/ZSjFAS5mf/`)
	if (!input.match(/https/gi)) return m.reply(`⚠️ Masukkan url tiktok`)
	if (!input.match(/tiktok/gi)) return m.reply(`❎ Link yang anda masukkan bukan berasal dari tiktok`)
      
	const urlRegex = /(https?:\/\/[^\s`]+)/g;
	const match = input.match(urlRegex);
	const url = match[0];

	conn.sendChatAction(m.chat, "upload_video")
	try {
		let { data: result } = await axios.get(`${apiUrl}/tiktok?url=${url}`);
		if (result?.images) {
			let date = konversiTimestamp(result.create_time)
			
			let tx = `[ DOWNLOADER IMAGE TIKTOK ]\n\n` +
			` ᪣ Author Name : ${result.author.nickname}\n` +
			` ᪣ Jumlah Foto : ${result.images.length}\n` +
			` ᪣ Jumlah Views : ${result.play_count}\n` +
			` ᪣ Jumlah Share : ${result.share_count}\n` +
			` ᪣ Jumlah Comment : ${result.comment_count}\n` +
			` ᪣ Diupload Pada : ${date.split("pukul")[0]}\n` +
			` ᪣ Description : ${result.title}\n\n` + env.wm
		
			const media = [];
			result.images.splice(0, 10).map((urls) => {
			  media.push({
			    type: 'photo',
			    media: urls,
			    caption: tx
			  })
			})
			
			if (media.length > 1) {
			    await conn.sendMediaGroup(m.chat, media, { caption: tx.trim(), reply_to_message_id: m.id })
			} else {
			    console.log(media)
			    await conn.sendButton(m.chat, donateBtn, media[0].media, 'tiktok.jpg', tx.trim(), m.msg, env.wm, null);
			}
		} else {
			let date = konversiTimestamp(result.create_time) ||
			"Unknown";
			
			let tx = `[ DOWNLOADER VIDEO TIKTOK ]\n\n` +
			` ᪣ Author Name : ${result.author.nickname}\n` +
			` ᪣ Durasi Video : ${result.duration}\n` +
			` ᪣ Jumlah Views : ${result.play_count}\n` +
			` ᪣ Jumlah Share : ${result.share_count}\n` +
			` ᪣ Jumlah Comment : ${result.comment_count}\n` +
			` ᪣ Diupload Pada : ${date.split("pukul")[0]}\n` +
			` ᪣ Description : ${result.title}\n\n` + env.wm
			await conn.sendButton(m.chat, donateBtn, result.play, 'tiktok.mp4', tx.trim(), m.msg, env.wm, null);
		}
		await conn.sendButton(m.chat, donateBtn, result.music_info.play, 'TikTok Audio.mp3', '', m.msg, result.author.nickname);
      } catch (e) {
        m.reply(e.message)
      }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}

function konversiTimestamp(timestamp) {
    var tanggalWaktu = new Date(timestamp * 1000);

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    var formatTanggalWaktu = tanggalWaktu.toLocaleDateString('id-ID', options);

    var hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    var hariID = hari[tanggalWaktu.getDay()];
    var bulanID = bulan[tanggalWaktu.getMonth()];

    return formatTanggalWaktu || "Unknown"
}