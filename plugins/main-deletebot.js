import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_TOKEN_FILE = path.join(__dirname, '../', 'bot_token.json');
  
export const run = {
  usage: ['deletebot'],
  hidden: ['delbot'],
  category: 'main',
  async: async (m, {
    conn,
    text,
    Func
  }) => {
    if (!text) return m.reply("Masukkan token yang mau dihapus!")

    if (!activeTokens.has(text)) {
      return m.reply("Token yang kamu masukkan tidak ditemukan pada list")
    } else {
      removeInvalidToken(text)
      m.reply(`⛔ Bot dimatikan. Token: ${text.slice(0, 10)}...`);
    }
  },
  error: false,
}

function stopBot(token) {
  if (!activeTokens.has(token)) return;
  try {
    const conn = connections.get(token);
    if (conn && conn.close) {
      conn.close();
      conn.stopPolling();
    }
    activeTokens.delete(token);
    connections.delete(token);
    console.log(chalk.yellow(`⛔ Bot dimatikan. Token: ${token.slice(0, 10)}...`));
  } catch (err) {
    console.error(`Gagal mematikan bot ${token.slice(0, 10)}...:`, err.message);
  }
}
  
function removeInvalidToken(token) {
  try {
    stopBot(token);
    let tokens = JSON.parse(fs.readFileSync(BOT_TOKEN_FILE, 'utf-8'));
    tokens = tokens.filter(t => t !== token);
    fs.writeFileSync(BOT_TOKEN_FILE, JSON.stringify(tokens, null, 2));
    console.log(chalk.red(`❌ Token invalid dihapus: ${token.slice(0, 10)}...`));
  } catch (err) {
    console.error('Gagal menghapus token invalid:', err.message);
  }
}