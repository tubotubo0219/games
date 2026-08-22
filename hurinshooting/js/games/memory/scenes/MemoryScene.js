'use strict'

import SceneBase from "../../../scenes/SceneBase.js";
import {CharacterData, FileData} from '../../../Database.js';
import {TextButton} from "../../../ui/Button.js";

export default class MemoryScene extends SceneBase {
	constructor() {
		super({ key: 'Memory', active: false });
	}

	preload() {
		this.params = this.getLevelParams();
		this.pickCardKeys();
		this.preloadPickImages();

		this.loadBackWhite();
		this.loadButtonFrame();
		this.load.image("coin", FileData.images.coin);
	}

	create() {
		const {width, height} = this.game.config;
		this.backImage = this.add.image(0, 0, 'backWhite').setOrigin(0, 0);
		this.isFirstSelect = true;
		this.isTweening = false;
		this.openedCard = null;
		this.correctCount = 0;
		this.mistakeCount = 0;
		this.isStart = false;
		this.createCards();

		const btnX = 96, btnY = 64;
		const buttonFrameKey = 'buttonFrame';
		this.buttons = {
			return : new TextButton(this, btnX, btnY + 56 * 0, "もどる", buttonFrameKey, this.returnScene.bind(this, false)),
			start:  new TextButton(this, btnX, btnY + 56 * 6, "はじめる", buttonFrameKey, this.startGame.bind(this)),
			reset:  new TextButton(this, btnX, btnY + 56 * 1, "さいしょから", buttonFrameKey, this.resetLevel.bind(this)),
		};
		this.chanceText = this.createText(btnX, btnY + 56 * 5, "", 24).setOrigin(0.5, 0.5);
		this.updateChanceText();

		this.coinImage = this.add.image(btnX - 48, btnY + 56 * 3, "coin");
		this.coinText = this.createText(btnX, btnY + 56 * 3, "", 24).setOrigin(0.5, 0.5);
		this.updateCoinText();

		this.diffText = this.createText(btnX, btnY + 56 * 4, "レベル: " + (window.memoryLevel + 1), 24).setOrigin(0.5, 0.5);

		this.feedOutDisplay();
		this.keySpace = this.input.keyboard.addKey('SPACE');
	}

	update() {
		/* debug */
		if (this.keySpace.isDown) {
			window.memoryLevel++;
			this.gotoScene("Memory", false);
		}

	}

	pickCardKeys() {
		const keys = Object.keys(CharacterData).filter(key => !CharacterData[key].removeGacha);
		this.cardKeys = [];
		for (let i=0; i < this.params.cardNum / 2; i++) {
			const rand = Phaser.Math.Between(0, keys.length - 1);
			this.cardKeys.push(keys.splice(rand, 1)[0]);
		}
	}

	getLevelParams() {
		switch (window.memoryLevel) {
			case 0 : return new MemoryParams(2, 2, 2, 0, 2);
			case 1 : return new MemoryParams(3, 2, 2, 0, 5);
			case 2 : return new MemoryParams(4, 2, 2, 0, 10);
			case 3 : return new MemoryParams(4, 3, 2, 0, 16);
			case 4 : return new MemoryParams(4, 4, 3, 0, 30);
			case 5 : return new MemoryParams(5, 4, 3, 0, 50);
			case 6 : return new MemoryParams(6, 4, 3, 0, 100);
			case 7 : return new MemoryParams(6, 5, 4, 0, 200);
			case 8 : return new MemoryParams(6, 6, 4, 0, 300);
			default: return new MemoryParams(7, 6, 4, 0, 400);
		}
	}

	preloadPickImages() {
		this.cardKeys.forEach(key => this.load.image(CharacterData[key].key, FileData.images[CharacterData[key].key]));
	}

	createCards() {
		this.cardKeys = this.arrayShuffle(this.cardKeys.concat(this.cardKeys));
		let size = 96;
		const row = this.params.row;
		const col = this.params.col;
		const gameWidth = this.game.config.width - 160;
		const gameHeight = this.game.config.height;
		if (row * size + 4 > gameWidth) size = Math.floor(gameWidth / row) - 4;
		if (col * size + 4 > gameHeight) size = Math.floor(gameHeight / col) - 4;
		const csize = size + 4;
		const sx = gameWidth / 2 - csize * row / 2 + csize / 2 + 160;
		const sy = gameHeight / 2 - csize * col / 2 + csize / 2;
		this.cards = this.cardKeys.map((key, i) => {
			const x = sx + (i % row) * csize;
			const y = sy + Math.floor((i % this.params.cardNum) / row) * csize;
			const chdata = CharacterData[key];
			const container = this.add.container(x, y)
				.add(this.createFrame(0, 0, size, i))
				.add(this.createImage(0, 0, chdata.key, size, chdata.tint))
				.add(this.createHatena(0, 0, size));
			container.isOpen = true;
			container.key = key;
			return container;
		});
	}

	arrayShuffle(array) {
		for(var i = (array.length - 1); 0 < i; i--){
			var r = Math.floor(Math.random() * (i + 1));
			var tmp = array[i];
			array[i] = array[r];
			array[r] = tmp;
		}
		return array;
	}

	createImage(x, y, key, size, tint) {
		const img = this.add.image(x, y, key).setOrigin(0.5, 0.5);
		img.setScale(size / Math.max(img.width, img.height));
		if (tint) img.setTint(tint);
		return img;
	}

	createFrame(x, y, size, index) {
		const rec = this.add.rectangle(x, y, size, size).setOrigin(0.5, 0.5).setFillStyle(0xffccff).setAlpha(0.5);
		rec.on("pointerover", pointer => { rec.setAlpha(1);   })
			.on("pointerout", pointer => { rec.setAlpha(0.5); })
			.on("pointerup" , this.selectCard.bind(this, index))
			.setInteractive();
		return rec;
	}

	createHatena(x, y, size) {
		const txt = this.add.text(x, y, "？", {fontFamily:"メイリオ", fontSize:size, color:"0xa85"})
			.setOrigin(0.5, 0.5).setVisible(false);
		return txt;
	}

	startGame() {
		this.isStart = true;
		this.cards.forEach(card => this.reverseCard(card));
		this.buttons.start.setValid(false);
	}

	selectCard(index) {
		const card = this.cards[index];
		if (card.isOpen) return;
		if (this.isFirstSelect) {
			this.openedCard = index;
			this.isFirstSelect = false;
			this.reverseCard(card);
		} else {
			if (card.key === this.cards[this.openedCard].key) {
				// 正解
				this.reverseCard(card);
				if (this.params.correctCoin) {
					window.playerData.coin += this.params.correctCoin;
					this.updateCoinText();
				}
				this.correctCount++;
				this.checkClear();
			} else {
				// 間違い
				const oCard = this.cards[this.openedCard];
				this.reverseCard(card, () => { this.reverseCard(card, null, 200), this.reverseCard(oCard, null, 200); } );
				this.mistakeCount++;
				this.updateChanceText();
				this.checkGameover();
			}
			this.openedCard = null;
			this.isFirstSelect = true;
		}
	}

	reverseCard(card, compCallback = null, delay = 0) {
		card.isOpen = !card.isOpen;
		this.isTweening = true;
		this.tweens.add({
			targets: card,
			delay: delay,
			duration: 200, 
			scaleX: 0,
			onComplete: () => {
				card.getAt(2).setVisible(!card.isOpen);
				card.getAt(1).setVisible(card.isOpen);
				this.tweens.add({
					targets: card,
					duration: 200, 
					scaleX: 1,
					onComplete: () => {
						this.isTweening = false;
						if (compCallback) compCallback();
					}
				});
			}
		});
	}

	updateChanceText() {
		this.chanceText.setText("ミス: " + this.mistakeCount + " / " + this.params.chance);
	}
	updateCoinText() {
		this.coinText.setText(window.playerData.coin);
	}

	resetLevel() {
		window.memoryLevel = 0;
		this.gotoScene("Memory", false);
	}

	checkClear() {
		if (this.correctCount >= this.params.cardNum / 2) {
			window.playerData.coin += this.params.clearCoin;
			this.updateCoinText();
			this.time.addEvent({
				delay: 1200,
				callback: () => {
					window.memoryLevel++;
					this.gotoScene("Memory", false);
				}
			});
		}
	}

	checkGameover() {
		if (this.mistakeCount >= this.params.chance) {
			this.time.addEvent({
				delay: 1200,
				callback: () => {
					this.gotoScene("Memory", false);
				}
			});
		}
	}

	gotoScene(name, isStopBgm) {
		this.save();
		super.gotoScene(name, isStopBgm);
	}

	returnScene(isStopBgm) {
		this.save();
		super.returnScene(isStopBgm);
	}
}

class MemoryParams {
	constructor(row, col, chance, correctCoin, clearCoin) {
		this.row = row;
		this.col = col;
		this.cardNum = row * col;
		this.chance = chance;
		this.correctCoin = correctCoin;
		this.clearCoin = clearCoin;
	}
}

