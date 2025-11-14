import fs from 'fs'
import axios from 'axios'
import * as cheerio from 'cheerio'

export const run = {
   usage: ['jadwaltv'],
   use: "channel",
   category: 'tools',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
   }) => {
	if (!text) return m.reply(`Masukkan nama channel!\n\nContoh: *${isPrefix+command} sctv*`)
	let res = await jadwalTV(text)
	let txt = res.result.map((v) => `[${v.jam.replace('WIB', ' WIB')}] ${v.acara}`).join`\n`
	m.reply(`Jadwal TV ${res.channel}\n\n${txt}`)
   },
   error: false,
   restrict: true,
   limit: true,
   cache: true,
   location: __filename
}

async function jadwalTV(name) {
	let list = await listJadwalTV()
	let data = list.find(v => v.channel.includes(name.toLowerCase()))
	if (!data) throw `Channel "${name}" tidak ditemukan`

	let html = (await axios.get(`https://www.jadwaltv.net/${data.isPay ? 'jadwal-pay-tv/' : ''}${data.value}`)).data
	let $ = cheerio.load(html)
	let result = []
	$('div > table.table').find('tbody > tr').slice(1).each(function () {
		let jam = $(this).find('td').eq(0).text()
		let acara = $(this).find('td').eq(1).text()
		if (!/Jadwal TV/gi.test(acara) && !/Acara/gi.test(acara)) result.push({ jam, acara })
	})
	return { channel: data.channel.toUpperCase(), result }
}

async function listJadwalTV() {
	let html = (await axios.get('https://www.jadwaltv.net/jadwal-pay-tv')).data
	let $ = cheerio.load(html), result = []
	$('#channelPayTVDropdown.dropdown > option').get().map((v) => {
		let name = $(v).text().toLowerCase()
		result.push({ value: $(v).val(), channel: name, isPay: true })
	})
	return [
		{ value: 'channel/antv', channel: 'antv', isPay: false },
		{ value: 'channel/gtv', channel: 'gtv', isPay: false },
		{ value: 'channel/indosiar', channel: 'indosiar', isPay: false },
		{ value: 'channel/inewstv', channel: 'inews tv', isPay: false },
		{ value: 'channel/kompastv', channel: 'kompas tv', isPay: false },
		{ value: 'channel/metrotv', channel: 'metro tv', isPay: false },
		{ value: 'channel/mnctv', channel: 'mnctv', isPay: false },
		{ value: 'channel/nettv', channel: 'net tv', isPay: false },
		{ value: 'channel/ochannel', channel: 'ochannel', isPay: false },
		{ value: 'channel/rcti', channel: 'rcti', isPay: false },
		{ value: 'channel/rtv', channel: 'rtv', isPay: false },
		{ value: 'channel/sctv', channel: 'sctv', isPay: false },
		{ value: 'channel/trans7', channel: 'trans7', isPay: false },
		{ value: 'channel/transtv', channel: 'transtv', isPay: false },
		{ value: 'channel/tvone', channel: 'tvone', isPay: false },
		{ value: 'channel/tvri', channel: 'tvri', isPay: false },
		...result
	]
}