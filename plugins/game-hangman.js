import fetch from "node-fetch";

async function tebakkata() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data.");
  }
}

class HangmanGame {
  constructor(id) {
    this.sessionId = id;
    this.guesses = [];
    this.correctGuesses = [];
    this.maxAttempts = 0;
    this.currentStage = 0;
    this.quest = {};
    this.lastMessageKey = null;
  }

  getRandomQuest = async () => {
    const data = await tebakkata();
    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedQuest = data[randomIndex];
    if (!selectedQuest || !selectedQuest.jawaban || !selectedQuest.soal) {
      throw new Error("Data tidak lengkap");
    }
    return { clue: selectedQuest.soal, quest: selectedQuest.jawaban.toLowerCase() };
  };

  initializeGame = async () => {
    this.quest = await this.getRandomQuest();
    this.maxAttempts = this.quest.quest.length + 2;
  };

  displayBoard = () => {
    const stages = [
      "```\n==========\n|    |\n|      \n|      \n|      \n|      \n|      \n==========",
      "```\n==========\n|    |\n|   💀\n|      \n|      \n|      \n|      \n==========",
      "```\n==========\n|    |\n|   💀\n|   |\n|      \n|      \n|      \n==========",
      "```\n==========\n|    |\n|   💀\n|  /|\n|      \n|      \n|      \n==========",
      "```\n==========\n|    |\n|   💀\n|  /|\\ \n|      \n|      \n|      \n==========",
      "```\n==========\n|    |\n|   💀\n|  /|\\ \n|  /   \n|      \n|      \n==========",
      "```\n==========\n|    |\n|   💀\n|  /|\\ \n|  / \\ \n|      \n|      \n=========="
    ];
    return `${stages[this.currentStage]}\n\`\`\`\n*Clue:* ${this.quest.clue}`.trimStart();
  };

  displayWord = () =>
    this.quest.quest
      .split("")
      .map(char => (this.guesses.includes(char) ? `${char}` : "__"))
      .join(" ");

  makeGuess = letter => {
    if (!this.isAlphabet(letter)) return "invalid";
    letter = letter.toLowerCase();
    if (this.guesses.includes(letter)) return "repeat";

    this.guesses.push(letter);

    if (this.quest.quest.includes(letter)) {
      this.correctGuesses.push(letter);
    } else {
      this.currentStage = Math.min(this.maxAttempts, this.currentStage + 1);
    }

    return this.checkGameOver() ? "over" : this.checkGameWin() ? "win" : "continue";
  };

  isAlphabet = letter => /^[a-zA-Z]$/.test(letter);

  checkGameOver = () => this.currentStage >= this.maxAttempts;

  checkGameWin = () => [...new Set(this.quest.quest)].every(char => this.guesses.includes(char));

  getHint = () => `*Hint:* ${this.quest.quest}`;
}

export const run = {
    usage: ['hangman'],
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
      if (!conn.hangman) conn.hangman = {};
      
      if (conn.hangman[m.sender]) {
        await m.reply(`Sesi Hangman sudah berlangsung. Ketik *end* untuk mengakhiri sesi.`);
      } else {
        conn.hangman[m.sender] = new HangmanGame(m.sender);
        var gameSession = conn.hangman[m.sender];
        await gameSession.initializeGame();

        let msg = `🎉 *Hangman Dimulai* 🎉\n\n*Session ID:* ${gameSession.sessionId}\n${gameSession.displayBoard()}\n\n*Tebakan Kata:*\n${gameSession.displayWord()}\n\nKetik huruf untuk menjawab, contoh: *a*\n*help* untuk bantuan`;

        let sent = await conn.reply(m.chat, msg, m.msg, "Markdown")
        //gameSession.lastMessageKey = sent.key; // simpan pesan
      }
    },
    error: false,
    restrict: true,
    cache: true,
    location: __filename
}