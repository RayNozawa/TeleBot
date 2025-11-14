export const run = {
  async: async (m, { conn, Api, body, Func, users, env, isROwner }) => {
    if (!db.game || !db.game.triviamaker || !(m.sender in db.game.triviamaker) || !m.text) return;
    const session = db.game.triviamaker[m.sender];
    if (!session) return;

    const jawaban = m.text.trim().toUpperCase();

    if (jawaban === "MENYERAH") {
        await m.reply(`⚠️ Kamu menyerah!\nKoin yang didapat: ${session.coinsEarned.toLocaleString()} Ribu`)
        delete db.game.triviamaker[m.sender];
        if (session.timeout) clearTimeout(session.timeout);
        return true;
    }

    const currentQuestion = session.questions[session.currentQuestion];
    const options = Object.keys(currentQuestion)
        .filter((k) => k.startsWith("option"))
        .map((k) => {
            let opt = currentQuestion[k];
            if (!opt) return "";
            if (typeof opt === "object") return opt.text || opt.value || JSON.stringify(opt);
            return String(opt);
        })
        .filter((opt) => opt);

    const answerIndex = jawaban.charCodeAt(0) - 65;
    const chosenAnswer = options[answerIndex];
    const correctAnswer = currentQuestion.correctAnswer;
    
    if (answerIndex === -1 || !chosenAnswer) return;

    const reward = 10000 + session.currentQuestion * 5000;

    if (!users.money) users.money = 0;

    let response;
    if (chosenAnswer === correctAnswer) {
        users.money += reward;
        session.coinsEarned += reward;
        session.currentQuestion++;
        response = `✅ Jawaban benar!\nJawaban: *${correctAnswer}*\nKoin yang didapat: *${reward.toLocaleString()} Ribu*\nSaldo: ${users.money.toLocaleString()} Ribu`;
    } else {
        response = `❌ Jawaban salah!\nJawaban benar: *${correctAnswer}*\nPermainan berakhir!\nTotal koin yang didapat: ${session.coinsEarned.toLocaleString()} Ribu\nSaldo akhir: ${users.money.toLocaleString()} Ribu`;
        delete db.game.triviamaker[m.sender];
        if (session.timeout) clearTimeout(session.timeout);
        await m.reply(response);
        return true;
    }

    await m.reply(response);

    if (session.currentQuestion >= session.questions.length) {
        await m.reply(`🎉 Selamat! Kamu telah menyelesaikan semua soal.\nTotal koin yang didapat: ${session.coinsEarned.toLocaleString()} Ribu\nSaldo akhir: ${users.money.toLocaleString()} Ribu`);
        delete db.game.triviamaker[m.sender];
        if (session.timeout) clearTimeout(session.timeout);
    } else {
        sendQuestion(conn, m, session);
    }

    if (session.timeout) clearTimeout(session.timeout);
    return true;
  },
  error: false,
  cache: true,
  location: __filename
}

async function sendQuestion(conn, m, session) {
    const currentQuestion = session.questions[session.currentQuestion];
    const options = Object.keys(currentQuestion)
        .filter((k) => k.startsWith("option"))
        .map((k) => {
            let opt = currentQuestion[k];
            if (!opt) return "";
            if (typeof opt === "object") return opt.text || opt.value || JSON.stringify(opt);
            return String(opt);
        })
        .filter((opt) => opt);

    const soal = `🧠 *Soal ke-${session.currentQuestion + 1}/${session.questions.length}*\n*${currentQuestion.question}*\n\n${options.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join("\n")}\n\n💡 Balas dengan huruf untuk menjawab atau ketik *MENYERAH* untuk berhenti. Kamu memiliki waktu 1 menit!`;
    
    const button = ["A", "B", "C", "D"].map(t => ({ text: t, callback_data: t }));
    await conn.reply(m.chat, soal, m.msg, "Markdown", [button])

    if (session.timeout) clearTimeout(session.timeout);
    session.timeout = setTimeout(async () => {
        await m.reply(`⏰ Waktu habis! Permainan dihentikan.\nKoin yang didapat: ${session.coinsEarned.toLocaleString()} Ribu`);
        delete db.game.triviamaker[m.sender];
    }, 60000);
}