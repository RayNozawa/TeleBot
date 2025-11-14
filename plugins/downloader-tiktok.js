import axios from "axios";
import fetch from "node-fetch";
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
	const urg = text ? text : m.quoted?.text ? m.quoted.text : text
	if (!urg) return m.reply(`*❗Masukkan Url, Contoh:*\n\n${isPrefix + command} https://vm.tiktok.com/ZSjFAS5mf/`)
	if (!urg.match(/https/gi)) return m.reply(`⚠️ Masukkan url tiktok`)
	if (!urg.match(/tiktok/gi)) return m.reply(`❎ Link yang anda masukkan bukan berasal dari tiktok`)
      
	const urlRegex = /(https?:\/\/[^\s`]+)/g;
	const match = urg.match(urlRegex);
	const url = match[0];

	conn.sendChatAction(m.chat, "upload_video")
	try {
		let result = await Tiktokdl(url);
		if (result.data?.images) {
			let date = konversiTimestamp(result.data.create_time)
			
			let tx = `[ DOWNLOADER IMAGE TIKTOK ]\n\n` +
			` ᪣ Author Name : ${result.data.author.nickname}\n` +
			` ᪣ Jumlah Foto : ${result.data.images.length}\n` +
			` ᪣ Jumlah Views : ${result.data.play_count}\n` +
			` ᪣ Jumlah Share : ${result.data.share_count}\n` +
			` ᪣ Jumlah Comment : ${result.data.comment_count}\n` +
			` ᪣ Diupload Pada : ${date.split("pukul")[0]}\n` +
			` ᪣ Description : ${result.data.title}\n\n` + env.wm
		
			const media = [];
			media.push({
			    type: 'image',
			    media: urls,
			    caption: tx
			})
			
			if (media.length > 1) {
			    await conn.sendMediaGroup(m.chat, media, { caption: tx.trim(), reply_to_message_id: m.id })
			} else {
			    console.log(media)
			    await conn.sendButton(m.chat, donateBtn, media[0].media, 'tiktok.jpg', tx.trim(), m.msg, env.wm, null);
			}
		} else {
			let date = konversiTimestamp(result.data.create_time) ||
			"Unknown";
			
			let tx = `[ DOWNLOADER VIDEO TIKTOK ]\n\n` +
			` ᪣ Author Name : ${result.data.author.nickname}\n` +
			` ᪣ Durasi Video : ${result.data.duration}\n` +
			` ᪣ Jumlah Views : ${result.data.play_count}\n` +
			` ᪣ Jumlah Share : ${result.data.share_count}\n` +
			` ᪣ Jumlah Comment : ${result.data.comment_count}\n` +
			` ᪣ Diupload Pada : ${date.split("pukul")[0]}\n` +
			` ᪣ Description : ${result.data.title}\n\n` + env.wm
			await conn.sendButton(m.chat, donateBtn, result.buffer, 'tiktok.mp4', tx.trim(), m.msg, env.wm, null);
		}
		await conn.sendButton(m.chat, donateBtn, result.data.music_info.play, 'TikTok Audio.mp3', '', m.msg, result.data.author.nickname);
      } catch (e) {
        m.reply(e.message)
      }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}

async function Tiktokdl(link) {
	try {
		let request = "https://tikwm.com/api/";
		let reqData = {
			url: link
		};
		let reqHeaders = {
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/json, text/javascript",
			"X-Requested-With": "XMLHttpRequest"
		};
		let response = await axios.post(request, reqData, {
			headers: reqHeaders
		});
		let result = await response?.data?.data
		
		let buffer = await (await fetch(result.play)).buffer();

		return {
			status: true,
			data: result,
			buffer: buffer
		};
	} catch (x) {
		return {
			status: false,
			msgError: String(x)
		}
	}
};

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