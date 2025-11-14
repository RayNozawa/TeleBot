export const run = {
  async: async (m, { conn, Api, body, Func, users, env }) => {
    conn.hangman = conn.hangman || {};

    if (!conn.hangman[m.sender]) return
    try {
      if (m.text == "end") {
        if (conn.hangman[m.sender]) {
          delete conn.hangman[m.sender];
          await m.reply("Berhasil keluar dari sesi Hangman. 👋");
        } else {
          await m.reply("Tidak ada sesi Hangman yang sedang berlangsung.");
        }
      } else if (m.text == "hint") {
        if (conn.hangman[m.sender]) {
          var gameSession = conn.hangman[m.sender];
          await conn.reply(m.chat, `<pre><code class="language-Clue">${gameSession.getHint().split(" ")[1].replace(/[AIUEOaiueo]/ig, '_')}</code></pre>`, m.msg, "HTML")
        } else {
          await m.reply("Tidak ada sesi Hangman. Gunakan *start* untuk memulai.");
        }
      } else if (m.text == "help") {
        await m.reply(
          `🎮 *Hangman Game* 🎮\n\n*Commands:*\n- *start* untuk memulai\n- *end* mengakhiri\n- *hint* untuk bantuan\n- ketik huruf untuk menjawab`
        );
      } else {
        if (conn.hangman[m.sender]) {
          if (m.text.length > 1) return m.reply('Masukkan huruf yang valid.')
          var gameSession = conn.hangman[m.sender];
          var result = gameSession.makeGuess(m.text.toLowerCase());

          let msg =
            result === "invalid" ?
            "Masukkan huruf yang valid." :
            result === "repeat" ?
            "Huruf ini sudah ditebak. Coba huruf lain." :
            result === "continue" ?
            `*Huruf yang Sudah Ditebak:*\n${gameSession.guesses.join(", ")}\n${gameSession.displayBoard()}\n\n*Tebakan Kata:*\n${gameSession.displayWord()}\n\n*Sisa Percobaan:* ${gameSession.maxAttempts - gameSession.currentStage}` :
            result === "over" ?
            `💀 Game Over! Kata: *${gameSession.quest.quest}*` :
            "🎉 Selamat! Kamu menang!";

          if (gameSession.lastMessageKey) {
            /*await conn.sendMessage(
              m.chat,
              { text: msg, edit: gameSession.lastMessageKey },
              {}
            );*/
            m.reply(msg)
          } else {
            let sent = await m.reply(msg)
            gameSession.lastMessageKey = sent.key;
          }

          if (result === "over" || result === "win") {
            delete conn.hangman[m.sender];
          }
        } else {
          await m.reply("Tidak ada sesi Hangman. Gunakan *start* untuk memulai.");
        }
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  },
  error: false,
  cache: true,
  location: __filename
}