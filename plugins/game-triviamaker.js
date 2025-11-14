import fetch from "node-fetch";

async function AsyncTriviaMaker(topic) {
    const url = `https://play.triviamaker.com/questionGenerator.php?topic=${encodeURIComponent(topic)}`;
    const headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
        Referer: "https://triviamaker.ai/"
    };
    try {
        const response = await fetch(url, { headers });
        const data = await response.json();

        if (data.questions) {
            for (let q of data.questions) {
                q.question = await translateToID(q.question);
                Object.keys(q).forEach((key) => {
                    if (key.startsWith("option")) {
                        let opt = q[key];
                        if (!opt) q[key] = "";
                        else if (typeof opt === "object") q[key] = opt.text || opt.value || JSON.stringify(opt);
                        else q[key] = String(opt);
                    }
                });
            }
        }
        return data;
    } catch (e) {
        throw e;
    }
}

async function translateToID(text) {
    if (!text) return text;
    return text;
}

export const run = {
   usage: ['triviamaker'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      Scraper
   }) => {
    if (!db.game) db.game = {};
    if (!db.users) db.users = {};
    if (!db.game.triviamaker) db.game.triviamaker = {};

    const inputText = text
    if (!inputText) return m.reply(`Masukkan topik untuk trivia.\nContoh:\n*${isPrefix + command} sejarah*`);
    
    m.reply(status.wait)
    try {
        const data = await AsyncTriviaMaker(inputText);
        const questions = data?.questions;
        if (!questions || questions.length === 0) return m.reply(`Tidak dapat menghasilkan soal untuk topik *"${inputText}"*`);

        db.game.triviamaker[m.sender] = {
            questions,
            currentQuestion: 0,
            timeout: null,
            coinsEarned: 0,
            lastMsgId: null
        };

        sendQuestion(conn, m, db.game.triviamaker[m.sender]);
    } catch (e) {
        throw e;
    }
  },
  error: false,
  restrict: true,
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