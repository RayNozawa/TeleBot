import crypto from 'crypto';

export const run = {
   usage: ['a2f'],
   hidden: ['2fa'],
   use: 'code',
   category: 'tools',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      users,
      env,
      isROwner
   }) => {
     if (!text) {
       users.a2f = true
       return conn.sendMessage(m.chat, 'A2F otomatis telah dinyalakan!\n\nUntuk seterusnya, kamu hanya perlu mengirimkan kode', {
         parse_mode: "Markdown",
         reply_markup: {
           inline_keyboard: [[{ text: "Matikan", callback_data: "/a2f delete" }]]
         }
       });
     } else if (text == "delete") {
       delete users.a2f
       return conn.sendMessage(m.chat, 'Auto A2F Telah Dimatikan!', {
         parse_mode: "Markdown",
         reply_markup: {
           inline_keyboard: [[{ text: "Nyalakan", callback_data: "/a2f" }]]
         }
       });
     }
     try {
       let kode = generateKode(text)
       return m.reply(`\`${kode}\``)
     } catch (e) {
       return m.reply('❌ Gagal generate kode: ' + e.message);
     }
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}

function base32toHex(base32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let hex = "";

  base32 = base32.replace(/\s+/g, "").toUpperCase();
  for (let c of base32) {
    const val = chars.indexOf(c);
    if (val < 0) throw new Error("Invalid base32 character");
    bits += val.toString(2).padStart(5, "0");
  }

  for (let i = 0; i + 4 <= bits.length; i += 4) {
    hex += parseInt(bits.substr(i, 4), 2).toString(16);
  }

  return hex;
}

function generateKode(secret) {
  try {
    const epoch = Math.floor(Date.now() / 1000);
    const time = Math.floor(epoch / 30).toString(16).padStart(16, "0");

    const key = Buffer.from(base32toHex(secret), "hex");
    const msg = Buffer.from(time, "hex");

    const hmac = crypto.createHmac("sha1", key).update(msg).digest("hex");

    const offset = parseInt(hmac.slice(-1), 16);
    const part = hmac.substr(offset * 2, 8);
    const code = (parseInt(part, 16) & 0x7fffffff).toString().slice(-6);

    return code.padStart(6, "0");
  } catch (e) {
    return null;
  }
}