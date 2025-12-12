console.clear()
import { spawn  } from 'child_process'
import path from 'path'
import CFonts from 'cfonts'
import chalk from 'chalk'
import fetch from 'node-fetch'
import axios from 'axios'
import fs from 'fs'

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unhandledRejections = new Map()
process.on('uncaughtException', (err) => {
   if (err.code === 'ENOMEM') {
      console.error('Out of memory error detected. Cleaning up resources...')
   } else {
      console.error('Uncaught Exception:', err)
   }
})

process.on('unhandledRejection', (reason, promise) => {
   unhandledRejections.set(promise, reason)
   if (reason.code === 'ENOMEM') {
      console.error('Out of memory error detected. Attempting recovery...')
      Object.keys(require.cache).forEach((key) => {
         delete require.cache[key]
      })
   } else {
      console.log('Unhandled Rejection at:', promise, 'reason:', reason)
   }
})

process.on('rejectionHandled', (promise) => {
   unhandledRejections.delete(promise)
})

process.on('Something went wrong', function (err) {
   console.log('Caught exception: ', err)
})

process.on('warning', (warning) => {
   if (warning.name === 'MaxListenersExceededWarning') {
      console.warn('Potential memory leak detected:', warning.message)
   }
})

function start() {
   let args = [path.join(__dirname, 'main.js'), ...process.argv.slice(2)]
   let p = spawn(process.argv[0], args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
      .on('message', data => {
         if (data == 'reset') {
            console.log('Restarting...')
            p.kill()
         }
      })
      .on('exit', code => {
         console.error('Exited with code:', code)
         start()
      })
}

const major = parseInt(process.versions.node.split('.')[0], 10)
if (major < 20) {
   console.error(
      `\n❌ This script requires Node.js 20+ to run reliably.\n` +
      `   You are using Node.js ${process.versions.node}.\n` +
      `   Please upgrade to Node.js 20+ to proceed.\n`
   )
   process.exit(1)
}

CFonts.say('Keys', {
   colors: ["cyan", "blue"],
   font: "block",
   align: "center",
   gradient: ["cyan", "blue"],
   transitionGradient: true,
})

axios({
  url: 'https://raw.githubusercontent.com/RayNozawa/TeleBot/refs/heads/main/main.js',
  method: 'GET',
  responseType: 'stream'
})
.then((response) => {
  const writer = fs.createWriteStream('main.js');

  response.data.pipe(writer);

  writer.on('finish', () => {
    start()
  })
  writer.on('error', (err) => {
    console.error(err);
  })
});