import chalk from 'chalk';
import moment from 'moment-timezone';
import path from 'path';
import axios from 'axios';
import fs from "fs"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFD700', '#00FFFF'];
const randomColor = () => chalk.hex(colors[Math.floor(Math.random() * colors.length)]);

export default async function (command, m, conn) {
    if (!command) return;

    const senderName = m.username || m.name || "Anonymous";
    const senderNumber = m.sender || "Unknown";
    const botUser = (await conn.getMe()).username
    const chatType = m.isGroup ? "Group" : "Private";
    const chatName = m.isGroup ? m.groupName : m.username;

    const time = moment().tz("Asia/Makassar").format('HH:mm');
    
    console.log(randomColor()("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(randomColor()(`🤖 Bot UN  : @${botUser}`));
    console.log(randomColor()(`⏰ Pukul   : ${time}`));
    console.log(randomColor()("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(randomColor()(`👤 USR NM  : ${senderName}`));
    console.log(randomColor()(`📞 USR ID  : ${senderNumber}`));
    console.log(randomColor()("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    if (m.chat !== senderNumber) {
      console.log(randomColor()(`🗨️ Chat NM : ${chatType} (${chatName})`));
      console.log(randomColor()(`#️⃣ Chat ID : ${m.chat}`));
      console.log(randomColor()("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    }
    console.log(randomColor()(`⚡ Command : ${command}`));
    console.log(randomColor()("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
};