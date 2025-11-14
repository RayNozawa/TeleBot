import { exec as _exec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(_exec);

export const run = {
   usage: ['gp'],
   hidden: ['getplugin'],
   use: 'filename',
   category: 'owner',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      Scraper,
      isROwner
   }) => {
     if (!isROwner) return
     let ar = Object.keys(plugins)
     let ar1 = ar.map(v => v.replace('.js', ''))
     if (!text) return m.reply(`Nama Pluginnya??`)
     if (!ar1.includes(text.replace(".js", ""))) return m.reply(`*Tidak Di Temukan*\n\n${ar1.map(v => ' ' + v).join`\n`}`)
     let o
     try {
       o = await exec('cat plugins/' + text.replace(".js", "") + '.js')
     } catch (e) {
       o = e
     } finally {
       let { stdout, stderr } = o
       if (stdout.trim()) m.reply(stdout)
       if (stderr.trim()) m.reply(stderr)
    }
},
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}