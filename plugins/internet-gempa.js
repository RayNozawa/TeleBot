import fetch from 'node-fetch'

const link = 'https://data.bmkg.go.id/DataMKG/TEWS/'

export const run = {
   usage: ['gempa'],
   category: 'internet',
   async: async (m, {
      conn,
      text,
      Func,
      env,
      isPrefix,
      command
   }) => {
	conn.sendChatAction(m.chat, "find_location")
	try {
		let res = await fetch(link+'autogempa.json')
		let anu = await res.json()
		anu = anu.Infogempa.gempa
		let txt = `*${anu.Wilayah}*\n\n`
		txt += `Tanggal : ${anu.Tanggal}\n`
		txt += `Waktu : ${anu.Jam}\n`
		txt += `Potensi : *${anu.Potensi}*\n\n`
		txt += `Magnitude : ${anu.Magnitude}\n`
		txt += `Kedalaman : ${anu.Kedalaman}\n`
		txt += `Koordinat : ${anu.Coordinates}${anu.Dirasakan.length > 3 ? `\nDirasakan : ${anu.Dirasakan}` : ''}`
		await conn.sendButton(m.chat, donateBtn, link+anu.Shakemap, 'gempa.jpg', txt, m.msg, env.wm);
	} catch (e) {
			console.log(e)
			m.reply(`[!] Fitur Error.`)
		}
	   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}