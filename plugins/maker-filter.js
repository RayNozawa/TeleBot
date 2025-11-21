const effects = ['jail', 'gay', 'glass', 'wasted' ,'passed', 'comrade', 'triggered']

export const run = {
  usage: ['filter'],
  use: 'image',
  category: 'maker',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    env
  }) => {
    let q = m.quoted ? m.quoted : m
    let mime = q.type
    let effect = text.trim().toLowerCase()
    if (!effects.includes(effect)) return m.reply(`Reply gambar dengan caption *${isPrefix + command} (effect)*

*List Effect:*
${effects.map(effect => `_> ${effect}_`).join('\n')}

Contoh: *${isPrefix + command}* jail
`.trim())
    if (mime == "photo") {
    	try {
			conn.sendChatAction(m.chat, 'upload_photo')
			const out = await conn.getFileLink(q.msg.photo[q.msg.photo.length - 1].file_id);
            await conn.sendButton(m.chat, donateBtn, `https://some-random-api.com/canvas/overlay/${encodeURIComponent(effect)}?avatar=${out}`, 'filter.jpg', "`Successfully generated image!`\n\n*Filter:* " + text, m.msg, env.wm);
    	} catch (e) {
    		return m.reply('Terjadi kesalahan: ' + e.message)
    	}
    } else {
    	m.reply(`Kirim Gambar Dengan Caption *${isPrefix + command}* Atau Tag Gambar Yang Sudah Dikirim`)
    }
   },
   error: false,
   restrict: true,
   limit: true,
   cache: true,
   location: __filename
}