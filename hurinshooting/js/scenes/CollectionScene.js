'use strict'

import SceneBase from "./SceneBase.js";
import {FileData, CharacterData, DressupData} from "../Database.js";
import {TextButton} from "../ui/Button.js";


export default class CollectionScene extends SceneBase {
	constructor() {
		super({ key: 'Collection', active: false });
	}

	preload() {
		this.loadBackWhite();
		this.loadButtonFrame();

		if (window.gachaMode === "accessories") {
			this.accKeys = Object.keys(window.playerData.accessories);
			this.accKeys.forEach(key => {
				this.load.image(DressupData[key].key, FileData.images[DressupData[key].key]);
			});
		} else {
			this.figureKeys = Object.keys(window.playerData.figures);
			this.figureKeys.forEach(key => {
				this.load.image(CharacterData[key].key, FileData.images[CharacterData[key].key]);
			});
			this.load.image('figure_stand', FileData.images.figure_stand);
		}
	}

	create() {
		this.backImage = this.add.image(0, 0, 'backWhite').setOrigin(0, 0).setInteractive();
		this.itemImages = [];
		this.itemPage = 0;
		this.row = 5;
		this.col = 4;
		this.pageItems = this.row * this.col;

		if (window.gachaMode === "accessories") {
			this.createItemList(DressupData, window.playerData.accessories, false);
		} else {
			this.createItemList(CharacterData, window.playerData.figures, true);
		}
		const btnX = 96, btnY = 64;
		const buttonFrameKey = 'buttonFrame';
		const optF = {}, optA = {};
		if (window.gachaMode === "accessories") optA.normalColor = 0xffcccc;
		else optF.normalColor = 0xffcccc;
		this.buttons = {
			return : new TextButton(this, btnX, btnY + 56 * 0, "もどる", buttonFrameKey, this.returnScene.bind(this, false)),
			figures    : new TextButton(this, btnX, btnY + 56 * 1, "フィギュア", buttonFrameKey, this.changeMode.bind(this, "figures"), optF),
			accessories: new TextButton(this, btnX, btnY + 56 * 2, "おしゃれ", buttonFrameKey, this.changeMode.bind(this, "accessories"), optA),
			prev:  new TextButton(this, btnX, btnY + 56 * 5, "まえへ", buttonFrameKey, this.prevPage.bind(this)),
			next:  new TextButton(this, btnX, btnY + 56 * 6, "つぎへ", buttonFrameKey, this.nextPage.bind(this)),
		};
		if (window.debugMode) {
			this.buttons.test = new TextButton(this, btnX, btnY + 56 * 3, "表示テスト", buttonFrameKey, this.gotoScene.bind(this, "Test_FigureGet", false));
		}
	}

	createItemList(database, playerItems, useStand) {
		const list = Object.keys(database).filter(key => !database[key].removeGacha);
		list.forEach((key, i) => {
			const x = 256 + (i % this.row) * 116;
			const y = 96 + Math.floor((i % this.pageItems) / this.row) * 116;
			if (playerItems[key]) {
				const data = database[key];
				this.itemImages[i] = this.add.container(x, y).add(this.createFrame(0, 0, key, true));
				if (useStand) {
					this.itemImages[i].add(this.createImage(0, 0, "figure_stand", 0.5, 0.5, 0.5));
					this.itemImages[i].add(this.createImage(0, 0 + (data.figureY || 0), data.key, 0.5, 0.9, 1.5 * (data.buttonScale || 1), data.tint)).setScale(0.6);
				} else {
					this.itemImages[i].add(this.createImage(0, -48 + (data.figureY || 0), data.key, 0.5, 0.5, 1.5 * (data.buttonScale || 1), data.tint)).setScale(0.6);
				}
						
			} else {
				this.itemImages[i] = this.add.container(x, y)
					.add(this.createFrame(0, 0, key, false))
					.add(this.createHatena(0, 0))
					.setScale(0.6);
			}
			this.setFiguresVisible();
		});
	}

	createImage(x, y, key, originX, originY, scale, tint) {
		const img = this.add.image(x, y, key).setOrigin(originX, originY).setScale(scale);
		if (tint) img.setTint(tint);
		return img;
	}

	createFrame(x, y, key, isGot) {
		const rec = this.add.rectangle(x, y-48, 192, 192).setOrigin(0.5, 0.5).setFillStyle(0xffccff).setAlpha(0.1);
		this.deb ||= 0;
		rec.deb = this.deb++;
		rec.on("pointerover", pointer => { rec.setAlpha(1);   })
			.on("pointerout", pointer => { rec.setAlpha(0.1); })
			.setInteractive();
		if (isGot) {
			rec.on("pointerup" , pointer => {
				window.flags.isFigureGetMode = false;
				window.getItemKey = key;
				this.gotoScene("FigureGet",false);
			});
		}
		return rec;
	}

	createHatena(x, y) {
		const txt = this.add.text(x, y-96, "？", {fontFamily:"メイリオ", fontSize:96, color:"0xa85"}).setOrigin(0.5, 0);
		return txt;
	}

	setFiguresVisible() {
		const start = this.itemPage * this.pageItems;
		this.itemImages.forEach((img, i) => {
			if (i < start || i >=  start + this.pageItems) {
				this.itemImages[i].setVisible(false);
			} else {
				this.itemImages[i].setVisible(true);
			}
		});
	}

	changeMode(type) {
		window.gachaMode = type;
		this.gotoScene("Collection", false);
	}

	calcMaxPage() {
		return Math.floor(this.itemImages.length / this.pageItems);
	}

	prevPage() {
		this.itemPage--;
		if (this.itemPage < 0) {
			this.itemPage = this.calcMaxPage();
		}
		this.setFiguresVisible();
	}

	nextPage() {
		this.itemPage++;
		if (this.itemPage > this.calcMaxPage()) {
			this.itemPage = 0;
		}
		this.setFiguresVisible();
	}
}

