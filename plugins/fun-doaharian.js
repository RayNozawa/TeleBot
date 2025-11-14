import fetch from "node-fetch"

export const run = {
   usage: ['doaharian'],
   category: 'fun',
   async: async (m, {
      conn,
      text,
      Func,
      env,
      isPrefix,
      command
   }) => {
     let src = await(await fetch('https://raw.githubusercontent.com/veann-xyz/result-daniapi/main/religion/doaharian.json')).json()
     let json = src.result.data[Math.floor(Math.random() * src.result.data.length)]
     m.reply(json.title + '\n\n' + json.arabic + '\n\n' + json.latin + '\n\n' + json.translation)
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}