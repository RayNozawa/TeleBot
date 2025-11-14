import Func from './functions.js';
import Scraper from './scraper.js';
import axios from 'axios';
import fs from "fs"
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

(async () => {
  let { hfmain, hfname, domain } = (await axios.get('https://raw.githubusercontent.com/RayNozawa/json/refs/heads/main/pastebin/domain.txt')).data
  global.apiUrl = hfmain
  global.apiName = hfname
  global.apiDomain = domain
})()

global.delay = ms => new Promise(resolve => setTimeout(resolve, ms))
  
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);

global.donateBtn = [{name: "Donate🍩", command: ".donate"}]
global.wm = `Developed by - @${env.owner}`
global.Func = Func
global.Scraper = Scraper
global.status = Object.freeze({
   wait: Func.Styles('Please Wait'),
   invalid: Func.Styles('Invalid url'),
   wrong: Func.Styles('Wrong format.'),
   fail: Func.Styles('Can\'t get metadata'),
   error: Func.Styles('Error occurred'),
   errorF: Func.Styles('Sorry this feature is in error.'),
   premium: `⭐ Perintah ini hanya untuk pengguna premium!\n\nKamu bisa mendapatkan akses premium secara gratis dengan memasukkan bot ini ke dalam group🌟\n\nBeli /premium 5k perbulan hubungi owner @${env.owner}`,
   auth: Func.Styles('You do not have permission to use this feature, ask the owner first.'),
   owner: Func.Styles('This command only for owner.'),
   group: Func.Styles('This command will only work in groups.'),
   botAdmin: Func.Styles('This command will work when I become an admin.'),
   admin: Func.Styles('This command only for group admin.'),
   private: Func.Styles('Use this command in private chat.'),
   gameSystem: Func.Styles('Game features have been disabled.'),
   gameInGroup: Func.Styles('Game features have not been activated for this group.'),
   gameLevel: Func.Styles('You cannot play the game because your level has reached the maximum limit.')
})