import Jimp from 'jimp';
import axios from 'axios';

class GameSession {
	constructor(id, sMsg) {
		this.id = id;
		this.players = [];
		this.game = new SnakeAndLadderGame(sMsg);
	}
}

class SnakeAndLadderGame {
	constructor(sMsg) {
		this.sendMsg = sMsg;
		this.players = [];
		this.boardSize = 100;
		this.snakesAndLadders = [{
			start: 29,
			end: 7
		}, {
			start: 24,
			end: 12
		}, {
			start: 15,
			end: 37
		}, {
			start: 23,
			end: 41
		}, {
			start: 72,
			end: 36
		}, {
			start: 49,
			end: 86
		}, {
			start: 90,
			end: 56
		}, {
			start: 75,
			end: 64
		}, {
			start: 74,
			end: 95
		}, {
			start: 91,
			end: 72
		}, {
			start: 97,
			end: 78
		}];
		this.currentPositions = {};
		this.currentPlayerIndex = 0;
		this.bgImageUrl = 'https://i.pinimg.com/originals/2f/68/a7/2f68a7e1eee18556b055418f7305b3c0.jpg';
		this.player1ImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAUwDDrqblPfIFUSVVh6p0pu-bQktbJmguyyIF2yI95mIcyhbPL0C3xRCg&s=10';
		this.player2ImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJueMRyZ9PQSW1kg94pzozul1vNl0QFBS_qkrzxvK-2TPRXg-4WywPpIA&s=10';
		this.bgImage = null;
		this.player1Image = null;
		this.player2Image = null;
		this.cellWidth = 40;
		this.cellHeight = 40;
		this.keyId = null;
		this.started = false;
	}

	initializeGame() {
		for (const player of this.players) {
			this.currentPositions[player] = 1;
		}
		this.currentPlayerIndex = 0;
		this.started = true;
	}

	rollDice() {
		return Math.floor(Math.random() * 6) + 1;
	}

	async movePlayer(player, steps) {
		if (this.players.length === 0) return;
		const currentPosition = this.currentPositions[player];
		let newPosition = currentPosition + steps;
		for (const otherPlayer of this.players) {
			if (otherPlayer !== player && this.currentPositions[otherPlayer] === newPosition) {
				const message = `😱 *Oh tidak!* ${player} *diinjak oleh* ${otherPlayer}.* Kembali ke awal cell.*`;
				await m.reply(message)
				newPosition = 1;
			}
		}
		const snakeOrLadder = this.snakesAndLadders.find(s => s.start === newPosition);
		if (snakeOrLadder) newPosition = snakeOrLadder.end;
		newPosition = Math.min(newPosition, this.boardSize);
		this.currentPositions[player] = newPosition;
	}

	async fetchImage(url) {
		try {
			const response = await axios.get(url, {
				responseType: 'arraybuffer'
			});
			return await Jimp.read(Buffer.from(response.data, 'binary'));
		} catch (error) {
			console.error(`Error fetching image from ${url}:`, error);
			throw error;
		}
	}

	async getBoardBuffer() {
		const board = new Jimp(420, 420);
		this.bgImage.resize(420, 420);
		board.composite(this.bgImage, 0, 0);
		for (const player of this.players) {
			const playerPosition = this.currentPositions[player];
			const playerImage = player === this.players[0] ? this.player1Image : this.player2Image;
			const playerX = ((playerPosition - 1) % 10) * this.cellWidth + 10;
			const playerY = (9 - Math.floor((playerPosition - 1) / 10)) * this.cellHeight + 10;
			board.composite(playerImage.clone().resize(this.cellWidth, this.cellHeight), playerX, playerY);
		}
		return board.getBufferAsync(Jimp.MIME_PNG);
	}

	async startGame(m, player1Name, player2Name) {
		await m.reply(`🐍🎲 *Selamat datang di Permainan Ular Tangga!* 🎲🐍 \n\n${player1Name} vs ${player2Name}\n\n*.ular roll* untuk melempar dadu`)
		this.players = [player1Name, player2Name];
		this.initializeGame();
		if (!this.bgImage) this.bgImage = await this.fetchImage(this.bgImageUrl);
		if (!this.player1Image) this.player1Image = await this.fetchImage(this.player1ImageUrl);
		if (!this.player2Image) this.player2Image = await this.fetchImage(this.player2ImageUrl);
		const boardBuffer = await this.getBoardBuffer();
		const {
			message_id
		} = await this.sendMsg.sendPhoto(m.chat, boardBuffer, { reply_to_message_id: m.msg.message_id });
		this.keyId = message_id;
	}

	async playTurn(m, player) {
		if (!this.players.length) {
			await m.reply(`🛑 *Tidak ada permainan aktif.* Gunakan *.ular start* untuk memulai permainan baru.`);
			return;
		}
		if (player !== this.players[this.currentPlayerIndex]) {
			await m.reply(`🕒 *Bukan giliranmu.* \n\nSekarang giliran ${this.players[this.currentPlayerIndex]}`)
			return;
		}
		const diceRoll = this.rollDice();
		await m.reply(`🎲 ${player} *melempar dadu.*\n\n  - Angka Dadu: *${diceRoll}*\n  - Dari: *${this.currentPositions[player]}*- Ke *${this.currentPositions[player] + diceRoll}*`)
		if (diceRoll !== 6) {
			this.movePlayer(player, diceRoll);
			const snakeOrLadder = this.snakesAndLadders.find(s => s.start === this.currentPositions[player]);

			if (snakeOrLadder) {
				const action = snakeOrLadder.end < snakeOrLadder.start ? 'Mundur' : 'Maju';
				await m.reply(`🐍 ${player} menemukan ${action === 'Mundur' ? 'ular' : 'tangga'}! ${action} *ke kotak ${snakeOrLadder.end}.*`)
				this.currentPositions[player] = snakeOrLadder.end;
			}

		}

		if (diceRoll !== 6) {
			this.switchPlayer();
		} else {
			await m.reply('🎲 Anda mendapat 6, jadi giliran Anda masih berlanjut.');
			this.movePlayer(player, diceRoll);
		}
		if (this.currentPositions[player] === this.boardSize) {
			await m.reply(`🎉 The Winner, Selamat!\n\n${player} Pemenangnya!\n\n+10.000 Exp`)
			global.db.data.users[player].exp += 10000
			this.resetSession();
		}
		const boardBuffer = await this.getBoardBuffer();
		const sendMsg = this.sendMsg;
		await this.sendMsg.deleteMessage(m.chat, this.keyId)
		const {
			message_id
		} = await this.sendMsg.sendPhoto(m.chat, boardBuffer, { reply_to_message_id: m.msg.message_id });
		this.keyId = message_id;
		return;
	}

	addPlayer(player) {
		if (this.players.length < 2 && !this.players.includes(player) && player !== '') {
			this.players.push(player);

			return true;
		} else {
			return false;
		}
	}

	switchPlayer() {
		this.currentPlayerIndex = 1 - this.currentPlayerIndex;
	}

	resetSession() {
		this.players = [];
		this.currentPositions = {};
		this.currentPlayerIndex = 0;
		this.started = false;
	}

	isGameStarted() {
		return this.started;
	}
}

export const run = {
   usage: ['ulartangga'],
   hidden: ['ut','ular','ladders','snake'],
   category: 'game',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      bot,
      isOwnerBot,
      Scraper
   }) => {
	conn.ulartangga = conn.ulartangga || {};
	const sessions = conn.ulartangga_ = conn.ulartangga_ || {};
	const sessionId = m.chat;
	const session = sessions[sessionId] || (sessions[sessionId] = new GameSession(sessionId, conn));
	const game = session.game;
	const {
		state
	} = conn.ulartangga[m.chat] || {
		state: false
	};

	const playerName = '@' + m.username || m.msg.from.first_name;
	switch (text) {
		case 'join':
			if (state) return m.reply('🛑 *Permainan sudah dimulai.* Tidak dapat bergabung.');
			const joinSuccess = game.addPlayer(playerName);
			joinSuccess ? m.reply(`👋 ${playerName} *bergabung ke dalam permainan.*\n\nKetik .ular join untuk bergabung`) : m.reply('*Anda sudah bergabung atau permainan sudah penuh.* Tidak dapat bergabung.');
			break;

		case 'start':
			if (state) return m.reply('🛑 *Permainan sudah dimulai.* Tidak dapat memulai ulang.');
			conn.ulartangga[m.chat] = {
				...conn.ulartangga[m.chat],
				state: true
			};
			if (game.players.length === 2) {
				await game.startGame(m, game.players[0], game.players[1]);
			} else {
				await m.reply('👥 *Tidak cukup pemain untuk memulai permainan.* Diperlukan minimal 2 pemain, ajak temanmu untuk join lalu start.');
			}
			break;

		case 'roll':
			if (!state) return m.reply('🛑 *Permainan belum dimulai.* Ketik "!snake start" untuk memulai.');
			if (game.isGameStarted()) {
				const currentPlayer = game.players[game.currentPlayerIndex];
				if (playerName !== currentPlayer) {
					await m.reply(`🕒 *Bukan giliranmu.* \n\nSekarang giliran ${currentPlayer}`)
				} else {
					await game.playTurn(m, currentPlayer);
				}
			} else {
				await m.reply('🛑 *Permainan belum dimulai.* Ketik "!snake start" untuk memulai.');
			}
			break;

		case 'reset':
			conn.ulartangga[m.chat] = {
				...conn.ulartangga[m.chat],
				state: false
			};
			session.game.resetSession();
			delete sessions[sessionId];
			await m.reply('🔄 *Sesi permainan direset.*');
			break;

		case 'help':
			await m.reply(`🎲🐍 *Permainan Ular Tangga* 🐍🎲\n\n*Commands:*\n- .ular join : Bergabung ke dalam permainan.\n- .ular start : Memulai permainan.\n- .ular roll : Melempar dadu untuk bergerak.\n- .ular reset : Mereset sesi permainan.\n\nPemanang mendapat +10.000 exp`);
			break;

		default:
			m.reply(`🎲🐍 *Permainan Ular Tangga* 🐍🎲\n\n*Commands:*\n- .ular join : Bergabung ke dalam permainan.\n- .ular start : Memulai permainan.\n- .ular roll : Melempar dadu untuk bergerak.\n- .ular reset : Mereset sesi permainan.\n\nPemanang mendapat +10.000 exp`);
	}
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}