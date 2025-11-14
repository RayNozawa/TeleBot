import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export const run = {
   usage: ['styletext'],
   hidden: ['style'],
   use: 'text',
   category: 'tools',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
    try {
        const messageText = text ? text : (m.quoted && m.quoted.text ? m.quoted.text : m.text);
        
        if (!messageText) return m.reply('Harap sertakan teks untuk diubah!')

        const styledText = await stylizeText(messageText);

        const replyContent = Object.entries(styledText)
            .map(([name, value]) => `*${name}*\n\`${value}\``)
            .join('\n\n');

        await conn.reply(m.chat, replyContent, m.msg);
    } catch (error) {
        console.error('Error in handler:', error);
        await conn.reply(m.chat, 'Terjadi kesalahan saat memproses permintaan.', m.msg);
    }
   },
   error: false,
   cache: true,
   limit: true,
   location: __filename
}

async function stylizeText(text) {
    try {
        const res = await fetch('http://qaz.wtf/u/convert.cgi?text=' + encodeURIComponent(text));
        const html = await res.text();
        const dom = new JSDOM(html);
        const table = dom.window.document.querySelector('table');

        if (!table) {
            throw new Error('Gagal menemukan tabel dalam respons.');
        }

        const rows = table.children[0].children;
        const obj = {};

        for (let tr of rows) {
            const name = tr.querySelector('.aname')?.innerHTML || 'Unknown Style';
            const content = tr.children[1]?.textContent.trim() || '';
            obj[name + (obj[name] ? ' Reversed' : '')] = content;
        }

        return obj;
    } catch (error) {
        console.error('Error in stylizeText:', error);
        return { Error: 'Tidak dapat memproses teks. Periksa koneksi Anda atau format teks input.' };
    }
}
