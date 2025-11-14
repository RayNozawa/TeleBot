export const run = {
   usage: ['kalkulator'],
   hidden: ['calc'],
   use: 'angka',
   category: 'tools',
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
     if (!text) return conn.reply(m.chat, Func.example(isPrefix, command, '1+1'), m.msg)
     
     let val = text
       .replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '')
       .replace(/×/g, '*')
       .replace(/÷/g, '/')
       .replace(/π|pi/gi, 'Math.PI')
       .replace(/e/gi, 'Math.E')
       .replace(/\/+/g, '/')
       .replace(/\++/g, '+')
       .replace(/-+/g, '-')
       
     let format = val
       .replace(/Math\.PI/g, 'π')
       .replace(/Math\.E/g, 'e')
       .replace(/\//g, '÷')
       .replace(/\*×/g, '×')
     
     try {
       let result = (new Function('return ' + val))()
       if (!result) throw new Error('error')
       m.reply(result)
     } catch (e) {
       return m.reply('Format salah, hanya 0-9 dan Simbol -, +, *, /, ×, ÷, π, e, (, ) yang disupport')
     }
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}