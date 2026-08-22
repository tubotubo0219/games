'use strict'

import SceneBase from "../../../scenes/SceneBase.js";
import {CharacterData, FileData} from '../../../Database.js';
import {TextButton} from "../../../ui/Button.js";

export default class NikakuScene extends SceneBase {
	constructor() {
		super({ key: 'Nikaku', active: false });
	}

	preload() {
		this.preloadAudio("hit01");
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
		this.initMembers();
		this.createItems();

		const btnX = 96, btnY = 64;
		const buttonFrameKey = 'buttonFrame';
		this.buttons = {
			return : new TextButton(this, btnX, btnY + 56 * 0, "もどる", buttonFrameKey, this.returnScene.bind(this, false)),
			reset:  new TextButton(this, btnX, btnY + 56 * 1, "さいしょから", buttonFrameKey, this.resetLevel.bind(this)),
			restart:  new TextButton(this, btnX, btnY + 56 * 6, "やりなおし", buttonFrameKey, this.restart.bind(this)),
		};

		this.coinImage = this.add.image(btnX - 48, btnY + 56 * 3, "coin");
		this.coinText = this.createText(btnX, btnY + 56 * 3, "", 24).setOrigin(0.5, 0.5);
		this.updateCoinText();

		this.diffText = this.createText(btnX, btnY + 56 * 4, "レベル: " + (window.playerData.nikakuLevel + 1), 24).setOrigin(0.5, 0.5);

		this.feedOutDisplay();
		this.keySpace = this.input.keyboard.addKey('SPACE');
		this.createLineGraph();
	}

	update() {
		/* debug */
		if (this.keySpace.isDown) {
			window.playerData.nikakuLevel++;
			this.gotoScene("Nikaku", false);
		}

	}

	pickCardKeys() {
		const keys = Object.keys(CharacterData).filter(key => !CharacterData[key].removeGacha);
		this.cardKeys = [];
		for (let i=0; i < this.params.imageNum; i++) {
			const rand = Phaser.Math.Between(0, keys.length - 1);
			this.cardKeys.push(keys.splice(rand, 1)[0]);
		}
	}

	getLevelParams() {
		switch (window.playerData.nikakuLevel) {
			case 0 : return new NikakuParams( 5,  4,  5,   2);
			case 1 : return new NikakuParams( 6,  5,  6,   5);
			case 2 : return new NikakuParams( 7,  6,  8,   8);
			case 3 : return new NikakuParams( 8,  7, 10,  12);
			case 4 : return new NikakuParams( 9,  8, 12,  25);
			case 5 : return new NikakuParams(10,  9, 15,  50);
			case 6 : return new NikakuParams(11, 10, 18, 100);
			case 7 : return new NikakuParams(12, 10, 22, 200);
			default: return new NikakuParams(13, 10, 26, 400);
		}
	}

	preloadPickImages() {
		this.cardKeys.forEach(key => this.load.image(CharacterData[key].key, FileData.images[CharacterData[key].key]));
	}

	initMembers() {
		this.selectItem = null;
		this.correctCount = 0;
		this.unSelectColor = 0xffccff;
		this.selectColor = 0xccffcc;
		this.strokeColor = 0xff00ff;

		this.startX = 160;
		this.gameWidth = this.game.config.width - this.startX;
		this.gameHeight = this.game.config.height;
		this.itemSize = Math.floor(this.gameWidth / 16);
	}

	createItems() {
		this.items = [];
		for (let i=0; i<this.params.cardNum/2; i++) {
			this.items.push(i % this.params.imageNum);
		}
		this.items = this.arrayShuffle(this.items.concat(this.items));
		const row = this.params.row;
		const col = this.params.col;

		const sx = this.itemSX();
		const sy = this.itemSY();

		this.itemMap = new Array(col);
		for (let i=0; i<col; i++) {
			this.itemMap[i] = new Array(row);
			for (let j=0; j<row; j++) {
				const x = sx + j * this.itemSize;
				const y = sy + i * this.itemSize;
				const id = this.items[i*row + j];
				const chdata = CharacterData[this.cardKeys[id]];
				const container = this.add.container(x, y)
					.add(this.createFrame(0, 0, this.itemSize, i, j))
					.add(this.createImage(0, 0, chdata.key, this.itemSize, chdata.tint))
				container.isOpen = true;
				this.itemMap[i][j] = {id: id, i: i, j: j, container: container, isSelect: false, isErase: false};
			}
		}
	}

	itemSX() {
		return this.gameWidth / 2 - this.itemSize * this.params.row / 2 + this.itemSize / 2 + this.startX;
	}

	itemSY() {
		return this.gameHeight / 2 - this.itemSize * this.params.col / 2 + this.itemSize / 2;
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

	createFrame(x, y, size, i, j) {
		const rec = this.add.rectangle(x, y, size, size).setOrigin(0.5, 0.5)
			.setFillStyle(this.unSelectColor).setStrokeStyle(1, this.strokeColor).setAlpha(0.5);
		rec.on("pointerover", pointer => { rec.setAlpha(1);   })
			.on("pointerout", pointer => { rec.setAlpha(0.5); })
			.on("pointerup" , this.selectCard.bind(this, i, j))
			.setInteractive();
		return rec;
	}

	createLineGraph() {
		this.lines = [];
		this.lines[0] = this.add.rectangle(4,4,4,4).setVisible(false).setFillStyle(0xff3333);
		this.lines[1] = this.add.rectangle(4,4,4,4).setVisible(false).setFillStyle(0x33ff33);
		this.lines[2] = this.add.rectangle(4,4,4,4).setVisible(false).setFillStyle(0x3333ff);
	}

	startGame() {
		this.isStart = true;
		this.cards.forEach(card => this.reverseCard(card));
		this.buttons.start.setValid(false);
	}

	selectCard(i, j) {
		const item = this.itemMap[i][j];
		if (item.isErase) return;
		if (item.isSelect) return;
		if (this.selectItem === null) {
			this.select(item);
		} else {
			if (this.checkErase(this.selectItem, item)) {
				this.erase(this.selectItem, item);
			} else {
				this.deselect(this.selectItem);
				this.select(item);
			}
		}
	}

	checkErase(item1, item2) {
		if (item1.id !== item2.id) return false;
		if (!this.searchRoute(item1, item2)) return false;
		return true;
	}

	searchRoute(item1, item2) {
		const {col, row} = this.params;
		const index = item1.i * row + item1.j;
		this.minRoute = null;
		this.minMove = 100;
		this.goal = item2;
		this.moveRoute(item1.i, item1.j, -1,  0, [item1], 0, 0);
		this.moveRoute(item1.i, item1.j,  1,  0, [item1], 0, 0);
		this.moveRoute(item1.i, item1.j,  0, -1, [item1], 0, 0);
		this.moveRoute(item1.i, item1.j,  0,  1, [item1], 0, 0);
		return !!this.minRoute;
	}

	moveRoute(i, j, vi, vj, route, moveCount, cornerCount, isCorner) {
		if (isCorner) {
			cornerCount++;
			if (cornerCount > 2) return;
			route.push({i: i, j: j});
		}
		i += vi;
		j += vj;
		const index = i * this.params.row + j;
		if (this.goal.i === i && this.goal.j === j) {
			route.push(this.goal);
			this.minRoute = route;
			moveCount++;
			this.minMove = moveCount;
			console.log("Goal: "+moveCount);
			return;
		} else {
			const {col, row} = this.params;
			// 画面外チェック
			if (i === -2 || i === col + 1 || j === -2 || j === row + 1) return;
			// 通行不可チェック
			if (i !== -1 && i !== col && j !== -1 && j !== row && !this.itemMap[i][j].isErase) {
				return;
			}
			moveCount++;
			console.log(this.minMove, moveCount);
			if (moveCount >= this.minMove) return;
			if (vi !==  1) this.moveRoute(i, j, -1,  0, route.concat(), moveCount, cornerCount, vi !== -1);
			if (vi !== -1) this.moveRoute(i, j,  1,  0, route.concat(), moveCount, cornerCount, vi !==  1);
			if (vj !==  1) this.moveRoute(i, j,  0, -1, route.concat(), moveCount, cornerCount, vj !== -1);
			if (vj !== -1) this.moveRoute(i, j,  0,  1, route.concat(), moveCount, cornerCount, vj !==  1);
		}
	}

	select(item) {
		const frame = item.container.getAt(0);
		frame.setFillStyle(this.selectColor);
		item.isSelect = true;
		this.selectItem = item;
	}

	deselect(item) {
		const frame = item.container.getAt(0);
		frame.setFillStyle(this.unSelectColor);
		item.isSelect = false;
		this.selectItem = null;
	}

	erase(item1, item2) {
		const sx = this.itemSX();
		const sy = this.itemSY();
		const graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa00aa } });
		for (let i=0; i<this.minRoute.length-1; i++) {
			const r1 = this.minRoute[i];
			const r2 = this.minRoute[i+1];
			const iw = (r2.j - r1.j);
			const ih = (r2.i - r1.i);
			const gw = iw ? iw * this.itemSize + (iw > 0 ? 4 : 0) : 4;
			const gh = ih ? ih * this.itemSize + (ih > 0 ? 4 : 0) : 4;
			this.lines[i].x = sx + r1.j * this.itemSize;
			this.lines[i].y = sy + r1.i * this.itemSize;
			this.lines[i].width = iw ? 0 : 4;
			this.lines[i].height = ih ? 0 : 4;
			this.lines[i].setVisible(true);
			const config = {
				targets: this.lines[i],
				duration: 40,
				delay: i * 40,
				width: gw,
				height: gh,
			};
			if (i === this.minRoute.length-2) {
				config.completeDelay = 100;
				config.onComplete = () => {
					this.lines.forEach(line => line.setVisible(false));
					this.eraseItem(item1);
					this.eraseItem(item2);
					this.correctCount++;
					this.playSE("hit01");
					this.gainCoin(1);
					this.checkClear();
				};
			}
			this.tweens.add(config);
		}
		
		this.selectItem = null;
	}

	eraseItem(item) {
		item.isErase = true;
		item.container.visible = false;
	}

	updateCoinText() {
		this.coinText.setText(window.playerData.coin);
	}

	resetLevel() {
		window.playerData.nikakuLevel = 0;
		this.gotoScene("Nikaku", false);
	}

	restart() {
		this.gotoScene("Nikaku", false);
	}

	checkClear() {
		if (this.correctCount >= this.params.cardNum / 2) {
			this.gainCoin(this.params.clearCoin);
			this.time.addEvent({
				delay: 1200,
				callback: () => {
					if (window.playerData.nikakuLevel <= 8)
						window.playerData.nikakuLevel++;
					this.gotoScene("Nikaku", false);
				}
			});
		}
	}

	gainCoin(value) {
		window.playerData.coin += value;
		this.updateCoinText();
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

class NikakuParams {
	constructor(row, col, imageNum, clearCoin) {
		this.row = row;
		this.col = col;
		this.cardNum = row * col;
		this.imageNum = imageNum;
		this.clearCoin = clearCoin;
	}
}

