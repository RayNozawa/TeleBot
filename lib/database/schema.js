import models from './models.js';
import Init from './init.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../../config.json');
const env = JSON.parse(fs.readFileSync(envPath, 'utf8'));

const init = new Init();

export default (m) => {
   let user = global.db.users.find(v => v.jid === m.sender);
   if (user) {
      init.execute(user, models.users, { limit: env.limit });
   } else {
      global.db.users.push({
         jid: m.sender,
         ...(models?.users || {})
      });
   }

   if (m.isGroup) {
      let group = global.db.groups.find(v => v.jid === m.chat);
      if (group) {
         init.execute(group, models.groups);
      } else {
         global.db.groups.push({
            jid: m.chat,
            ...(models?.groups || {})
         });
      }
   }

   let chat = global.db.chats.find(v => v.jid === m.chat);
   if (chat) {
      init.execute(chat, models.chats);
   } else {
      global.db.chats.push({
         jid: m.chat,
         ...(models?.chats || {})
      });
   }

   let setting = global.db.setting;
   if (setting && Object.keys(setting).length < 1) {
      init.execute(setting, models.setting);
   } else {
      setting = {
         ...(models?.setting || {})
      };
   }
};
