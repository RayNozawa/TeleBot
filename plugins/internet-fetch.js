import fetch from 'node-fetch'
import { format } from 'util'

global.APIKeys = {
    "https://api.xyroinee.xyz": "ClaraKeyOfficial",
}
global.APIs = {
    xyro: "https://api.xyroinee.xyz",
    popcat : 'https://api.popcat.xyz'
}
global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')

export const run = {
   usage: ['get'],
   hidden: ['fetch'],
   use: 'url',
   category: 'tools',
   async: async (m, {
      conn,
      text,
      Func,
      env
   }) => {
    const urg = text ? text : m.quoted?.text ? m.quoted.text : text
    if (!urg) return m.reply("Masukkan url!")
    const urlRegex = /(https?:\/\/[^\s`]+)/g;
    const match = urg.match(urlRegex);
    text = match[0];
    if (!/^https?:\/\//.test(text)) return m.reply('Awali *URL* dengan http:// atau https://')
    conn.sendChatAction(m.chat, 'find_location')
    let _url = new URL(text)
    let url = global.API(_url.origin, _url.pathname, Object.fromEntries(_url.searchParams.entries()), 'APIKEY')
    let res = await fetch(url)
    if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
        return conn.reply(m.chat, `Content-Length: ${res.headers.get('content-length')}`, m.msg, "HTML")
    }
    if (!/text|json/.test(res.headers.get('content-type'))) return conn.sendButton(m.chat, donateBtn, url, '', text, m.msg)
    let txt = await res.buffer()
    try {
        txt = format(JSON.parse(txt + ''))
    } catch (e) {
        txt = txt + ''
    } finally {
        conn.reply(m.chat, txt.slice(0, 65536) + '', m.msg, "HTML")
    }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}