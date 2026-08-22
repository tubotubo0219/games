'use strict'

import SceneBase from "./SceneBase.js";
import {TextButton, SelectButton} from "../ui/Button.js";
import Gauge from "../ui/Gauge.js";
import {AnimalParamUtil} from '../games/shooting/objects/Animal.js';
import {CareAnimal, CareAnimalWithLayers} from "../objects/CareAnimal.js";
import {AnimalData, FileData, CareItemData, DressupData} from "../Database.js";

export default class PetCareScene extends SceneBase {
	constructor() {
		super({ key: 'PetCare', active: false });
	}

	preload() {
		this.loadBackWhite();
		this.loadButtonFrame();
		this.load.image('talkWindow', 'img/system/window_talk.png');

		this.load.image('gauge_frame', FileData.images.gauge_frame);
		this.load.image('gauge_fill', FileData.images.gauge_fill);
		this.load.image('board', FileData.images.board);
		this.load.image('hand', FileData.images.icon_hand);

		this.animalParams = window.playerData.animals[window.talkAnimal];
		this.animalData = AnimalData[this.animalParams.id];
		this.animalName = this.animalData.name;
		this.lvAnimalData = this.animalData.talk[this.animalParams.growth];
		const kdir = this.lvAnimalData.keyDir;
		const ftype = this.lvAnimalData.fileType;
		if (this.lvAnimalData.layers) {
			const layerKeys = Object.keys(this.lvAnimalData.layers);
			this.aniKeys = {};
			layerKeys.forEach(key => {
				const layers = this.lvAnimalData.layers[key];
				layers.forEach(lkey => {
					this.aniKeys[lkey] = this.lvAnimalData.keyHeader + lkey;
					this.load.image(this.aniKeys[lkey], kdir + lkey + ftype);
				});
			});
		} else {
			this.aniKeys = {
				hangly: this.lvAnimalData.keyHeader + "hangly",
				dislike: this.lvAnimalData.keyHeader + "dislike",
				normal: this.lvAnimalData.keyHeader + "normal",
				food01: this.lvAnimalData.keyHeader + "food01",
				food02: this.lvAnimalData.keyHeader + "food02",
				happy: this.lvAnimalData.keyHeader + "happy",
				yogore: this.lvAnimalData.keyHeader + "yogore",
				kirei: this.lvAnimalData.keyHeader + "kirei",
				samisi: this.lvAnimalData.keyHeader + "samisi",
				nade: this.lvAnimalData.keyHeader + "nade",
				manzoku: this.lvAnimalData.keyHeader + "manzoku",
			};
			Object.keys(this.aniKeys).forEach(key => this.load.image(this.aniKeys[key], kdir + key + ftype));
		}
		Object.keys(CareItemData.foods).forEach(key => this.load.image(key, FileData.images[key]));

		this.animalParams.dressup.forEach(data => {
			this.load.image(DressupData[data[0]].key, FileData.images[DressupData[data[0]].key]);
		});

		this.load.image("awa", FileData.images.awa);
		this.load.image("awamoko", FileData.images.awamoko);
		this.load.image("bath", FileData.images.bath);
	}

	create() {
		this.backImage = this.add.image(0, 0, 'backWhite').setOrigin(0, 0).setInteractive();
		this.load.audio("myhome", "audio/bgm/myhome.mp3");
	
		this.requestGrowthScene = false;
		this.clickEvent = null;
		this.waitClick = false;

		const centerY = this.game.config.height / 2;
		this.createAnimalImages();

		this.messageWindow = this.add.image(33, 353, 'talkWindow').setOrigin(0, 0);
		this.talkText = this.add.text(56, 372, "", { fontFamily:"Arial", fontSize: '32px', color: '#ff6644' }).setOrigin(0, 0);
		this.createMenuButtons();
		this.createFoodButtons();
		this.createBathObjects();
		this.createParamBoard();

		this.handImage = this.add.image(0, 0, "hand").setOrigin(0.5, 0.5).setVisible(false);
		this.handImage.depth = 2;
		this.awaCountText = this.add.text(800, 46, "", { fontFamily:"Arial", fontSize: '30px', fill: '#000' }).setOrigin(0, 0);

		this.backImage.setInteractive();
		this.backImage.on("pointerdown", this.onPointerDown.bind(this));

		this.showAnimalImage = null;
		this.nextAnimalImage = null;
		this.mode = "";
		this.setTalkMode();

		this.feedOutDisplay();
	}

	createAnimalImages() {
		if (this.lvAnimalData.layers) {
			this.animalImage = new CareAnimalWithLayers(this, window.talkAnimal, this.aniKeys);
		} else {
			this.animalImage = new CareAnimal(this, window.talkAnimal, this.aniKeys);
		}
		this.animalImage.setDressup(this.animalParams.dressup);
	}

	createMenuButtons() {
		const btnX = 96, btnY = 80 - 48;
		const buttonFrameKey = 'buttonFrame';
		this.buttons = {
			foods  : new TextButton(this, btnX, btnY + 56 * 0, "ごはん", buttonFrameKey, this.setFoodsMode.bind(this)),
			bath   : new TextButton(this, btnX, btnY + 56 * 1, "おふろ", buttonFrameKey, this.setBathMode.bind(this)),
			nade   : new TextButton(this, btnX, btnY + 56 * 2, "なでなで", buttonFrameKey, this.setNadeMode.bind(this)),
			talk   : new TextButton(this, btnX, btnY + 56 * 3, "おはなし", buttonFrameKey, this.setTalkMode.bind(this)),
			dressup: new TextButton(this, btnX, btnY + 56 * 4, "おしゃれ", buttonFrameKey, this.gotoScene.bind(this, "Dressup", false)),
			return : new TextButton(this, btnX, btnY + 56 * 5, "もどる", buttonFrameKey, this.gotoScene.bind(this, "Home", false)),
		};
	}

	createFoodButtons() {
		// foods
		this.foods = {};
		this.foodNumText = {};
		const itemX = 128, itemY = 408;
		this.foodDoneButton = new TextButton(this, 760, itemY - 90, "あげる", 'buttonFrame', this.doneFood.bind(this)).setVisible(false);
		this.foodNeedNumText = this.createText(660, itemY - 108, "", 28).setVisible(false).setOrigin(1, 0);
		Object.keys(CareItemData.foods).forEach((key, i) => {
			this.foods[key] = new SelectButton(
				this, key, key, itemX + i * 96, itemY, 128, 128, this.selectFood.bind(this, key), this.foods, {scale: 0.5, selectColor: 0xffaacc}).setVisible(false);
			this.foodNumText[key] = this.add.text(itemX + i * 96 + 32, itemY - 32, window.playerData.items[key] || 0,
				{fontFamily: "メイリオ", fontSize:20, color: "#cc6600"}).setOrigin(1, 0).setVisible(false);
		});
	}

	createBathObjects() {
		const center = this.game.config.width / 2;
		this.awamoko = this.add.image(center, 0, "awamoko").setOrigin(0.5, 0).setVisible(false);
		this.bathImage = this.add.image(center, 0, "bath").setOrigin(0.5, 0).setVisible(false);
		this.bathImage.depth = 1;
		this.awas = this.physics.add.group();
	}
	
	createParamBoard() {
		const gaugeX = 732, gaugeY = 128;
		this.board = this.add.image(gaugeX, gaugeY + 12, "board");
		this.board.setScale(0.7);
		this.nameText = this.add.text(gaugeX - 72, gaugeY - 48, this.animalName, {fontFamily:"メイリオ", fontSize:22, color:"#c63", fontStyle:"bold"});
		this.levelText = this.add.text(gaugeX + 16, gaugeY - 40, "レベル  " + this.animalParams.level, {fontFamily:"メイリオ", fontSize:16, color:"#c63"});
		this.lastAnimalLevel = this.animalParams.level;
		this.gaugeTexts = {
			foods: this.add.text(gaugeX - 72, gaugeY + 26 * 0, "まんぷく", {fontFamily:"メイリオ", fontSize:16, color:"#c76"}),
			bath:  this.add.text(gaugeX - 72, gaugeY + 26 * 1, "せいけつ", {fontFamily:"メイリオ", fontSize:16, color:"#c76"}),
			goods: this.add.text(gaugeX - 72, gaugeY + 26 * 2, "なかよし", {fontFamily:"メイリオ", fontSize:16, color:"#c76"}),
			exp:   this.add.text(gaugeX - 72, gaugeY + 26 * 3, "がんばり", {fontFamily:"メイリオ", fontSize:16, color:"#c76"}),
		};
		this.gauges = {
			foods: new Gauge(this, gaugeX, gaugeY - 4 + 26 * 0, "gauge_frame", "gauge_fill", AnimalParamUtil.foodsGaugeRatio.bind(AnimalParamUtil)).setScale(0.7),
			bath:  new Gauge(this, gaugeX, gaugeY - 4 + 26 * 1, "gauge_frame", "gauge_fill", AnimalParamUtil.bathGaugeRatio.bind(AnimalParamUtil)).setScale(0.7),
			goods: new Gauge(this, gaugeX, gaugeY - 4 + 26 * 2, "gauge_frame", "gauge_fill", AnimalParamUtil.goodsGaugeRatio.bind(AnimalParamUtil)).setScale(0.7),
			exp:   new Gauge(this, gaugeX, gaugeY - 4 + 26 * 3, "gauge_frame", "gauge_fill", AnimalParamUtil.expGaugeRatio.bind(AnimalParamUtil)).setScale(0.7),
		};
		Object.keys(this.gauges).forEach(key => this.refreshGauge(key));
	}

	createTalk() {
		const talkData = this.lvAnimalData.talks;
		if (this.animalParams.foods <= 40) {
			// 空腹時
			this.setTalkText(talkData.foods);
			this.animalImage.changeImage("hangly");
		} else if (this.animalParams.bath <= 40) {
			// 汚れた時
			this.setTalkText(talkData.bath);
			this.animalImage.changeImage("yogore");
		} else if (this.animalParams.goods <= 40) {
			// 遊びたい時
			this.setTalkText(talkData.goods);
			this.animalImage.changeImage("samisi");
		} else {
			// 正常時
			this.setRandomTalk(talkData.normal);
			this.animalImage.changeImage("normal");
		}
	}

	setRandomTalk(textList) {
		const index = Phaser.Math.Between(0, textList.length-1);
		this.setTalkText(textList[index]);
	}

	setTalkText(texts) {
		this.talkTexts = texts;
		this.talkIndex = 0;
		this.talkText.setText(this.animalName + texts[0]);
	}

	onPointerDown() {
		if (this.mode === "talk") {
			this.talkIndex++;
			if (this.talkIndex < this.talkTexts.length) {
				this.talkText.setText(this.animalName + this.talkTexts[this.talkIndex]);
			}
		} else if (this.waitClick) {
			this.setTalkMode();
		}
	}

	clearTalkText() {
		this.talkText.setText("");
	}

	foodsRatio() {
		return (this.animalParams.foods + 20) / 120;
	}

	bathRatio() {
		return (this.animalParams.bath + 20) / 120;
	}

	goodsRatio() {
		return (this.animalParams.goods + 20) / 120;
	}


	refreshGauge(key) {
		this.gauges[key].refresh();
	}

	refreshLevel() {
		if (this.animalParams.level !== this.lastAnimalLevel) {
			this.levelText.setText("レベル  " + this.animalParams.level);
			this.lastAnimalLevel = this.animalParams.level;
		}
	}

	selectFood(key) {
		this.selectFoodKey = key;
		const itemnum = window.playerData.items[key] || 0;
		const isValid = itemnum >= this.needFoodNumber();
		this.foodDoneButton.setValid(isValid);
	}

	needFoodNumber() {
		return Math.floor(this.animalParams.level / 5) + 1;
	}

	// Set Mode
	setFoodsMode() {
		if (this.mode === "food") return;
		this.endPrevMode();
		this.mode = "food";
		this.waitClick = false;
		this.animalImage.setFood();
		this.setFoodButtonsVisible(true);
		this.talkText.setVisible(false);
		this.foodNeedNumText.setVisible(true);
		this.refreshFoodNeedNumText();
		this.messageWindow.setVisible(true);
	}

	refreshFoodNeedNumText() {
		this.foodNeedNumText.setText("x " + this.needFoodNumber() + "こ");
	}

	setBathMode() {
		if (this.mode === "bath") return;
		this.endPrevMode();
		this.mode = "bath";
		this.waitClick = false;
		this.animalImage.hideDressup();
		this.messageWindow.setVisible(false);
		this.talkText.setText("");
		this.animalImage.setBath();
		this.time.addEvent({
			delay:10,
			callback: () => {
				this.animalImage.setPointerMove((pointer) => this.gosigosi(pointer));
			}
		});

		this.onHandMode();
		this.lastTime = Date.now();
		this.touchCount = 0;

		this.bathImage.setVisible(true);
		this.awamoko.setCrop(0,0,this.awamoko.width, 0.1);
		this.awamoko.setVisible(true);
	}

	setNadeMode() {
		if (this.mode === "nade") return;
		this.endPrevMode();
		this.createTalk();
		this.mode = "nade";
		this.waitClick = false;

		this.messageWindow.setVisible(false);
		this.talkText.setText("");

		this.animalImage.setNade();
		this.time.addEvent({
			delay:10,
			callback: () => {
				this.animalImage.setPointerMove((pointer) => this.nadenade(pointer));
			}
		});

		this.onHandMode();
		this.lastTime = Date.now();
		this.touchCount = 0;
	}

	setTalkMode() {
		if (this.mode !== "talk") this.endPrevMode();
		if (this.requestGrowthScene) {
			window.talkType = "growth";
			this.gotoScene("Talk", false);		
		} else {
			this.createTalk();
			this.mode = "talk";
			this.setFoodButtonsVisible(false);
			this.talkText.setVisible(true);
			this.messageWindow.setVisible(true);
		}
	}

	endPrevMode() {
		switch(this.mode) {
			case "food" : this.endFoodMode(); break;
			case "bath" : this.endBathMode(); break;
			case "nade" : this.endNadeMode(); break;
		}
	}

	endFoodMode() {
		this.setFoodButtonsVisible(false);
		this.foodNeedNumText.setVisible(false);
	}

	endBathMode() {
		this.bathImage.setVisible(false);
		this.animalImage.hideImage();
		this.awas.clear(true, true);
		this.awamoko.setVisible(false);
		this.offHandMode();
		this.handImage.setVisible(false);
		this.animalImage.showDressup();
		if (this.clickEvent) {
			this.clickEvent.destroy();
		}
		if (this.bathTimerEvent) {
			this.bathTimerEvent.destroy();
		}
	}

	endNadeMode() {
		this.animalImage.hideImage();
		this.offHandMode();
		this.handImage.setVisible(false);
		if (this.clickEvent) {
			this.clickEvent.destroy();
		}
	}

	//#region food
	doneFood() {
		if (this.lvAnimalData.likeFood === this.selectFoodKey) {
			if (this.animalParams.foods >= 95) {
				this.setInvalidFoodTalk("suffed");
			} else {
				window.playerData.items[this.selectFoodKey] -= this.needFoodNumber();
				this.foodNumText[this.selectFoodKey].setText(window.playerData.items[this.selectFoodKey]);
				this.animalImage.setEatEvent(this.eatEvent.bind(this));
				this.setFoodButtonsVisible(false);
				this.talkText.setVisible(true);
				this.eatCount = -1;
				this.clearTalkText("");
				this.setClickTimer();
			}
		} else {
			this.setInvalidFoodTalk("dislike");
		}
	}

	setInvalidFoodTalk(type) {
		this.setFoodButtonsVisible(false);
		this.talkText.setVisible(true);
		this.setTalkText(this.lvAnimalData.talks[type]);
		this.animalImage.changeImage(type);
		this.setClickTimer();
}

	eatEvent() {
		this.eatCount++;
		this.animalImage.changeImage(this.lvAnimalData.eatFrames[this.eatCount]);
		if (this.eatCount === this.lvAnimalData.eatFrames.length - 1) {
			this.setTalkText(this.lvAnimalData.talks.eatend);
			this.save();
		} else {
			this.setTalkText(this.lvAnimalData.talks.eat);
		}
		this.gainParam("foods", this.lvAnimalData.eatRec);
	}

	setFoodButtonsVisible(bool) {
		Object.keys(this.foods).forEach((key, i) => {
			this.foods[key].setVisible(bool);
			this.foodNumText[key].setVisible(bool);
			if (i == 0) this.foods[key].select();
		});
		this.foodDoneButton.setVisible(bool);
	}
	//#endregion

	gosigosi(pointer) {
		const now = Date.now();
		if (now - this.lastTime > 30) {
			this.lastTime = now;
			this.touchCount++;
			const rand = Phaser.Math.Between(0, 360);
			const img = this.add.image(pointer.x, pointer.y, "awa").setAlpha(0.6);
			img.angle = rand;
			this.awas.add(img);
			this.gainParam("bath", 0.5);
			if (this.touchCount <= 200) {
				const ratio = this.touchCount / 200;
				this.awamoko.setCrop(0, 0, this.awamoko.width, this.awamoko.height * ratio);
				this.awamoko.y = this.awamoko.height - this.awamoko.height * ratio;
				this.awamoko.scaleX = ratio * 0.5 + 0.5;
			} else {
				if (this.touchCount >= 220) {
					this.touchCount = 200;
					this.offHandMode();
					this.animalImage.changeImage("kirei").setScale(0.8);
					this.bathTimerEvent = this.time.addEvent({
						delay: 30,
						repeat: 40,
						callback: () => {
							this.touchCount -= 5;
							const ratio = this.touchCount / 200;
							this.awamoko.setCrop(0, 0, this.awamoko.width, this.awamoko.height * ratio);
							this.awamoko.y = this.awamoko.height - this.awamoko.height * ratio;
							this.bathImage.setAlpha(this.touchCount / 200);
							if (this.touchCount <= 0) {
								this.awas.clear(true, true);
								this.bathImage.setVisible(false);
								this.bathImage.setAlpha(1);
							}
						}
					});
					this.setClickTimer();
					this.awas.children.iterate(child => {
						child.depth = 2;
						child.body.setGravity(Phaser.Math.Between(-300,300), 400);
					});
					this.save();
				}
			}
		}
	}

	nadenade(pointer) {
		const now = Date.now();
		if (now - this.lastTime > 30) {
			this.lastTime = now;
			this.touchCount++;
			this.gainParam("goods", 0.5);

			if (this.touchCount == 60) {
				this.animalImage.changeImage("nade", false);
				this.animalImage.setPointerMove((pointer) => this.nadenade(pointer));
			} else if (this.touchCount == 160) {
				this.offHandMode();
				this.animalImage.changeImage("manzoku");
				this.setClickTimer();
				this.save();
			}
		}
	}

	setClickTimer() {
		this.clickEvent = this.time.addEvent({
			delay: 2000,
			callback: () => {
				this.waitClick = true;
			},
		});
	}

	//#region Hand

	onHandMode() {
		this.input.on("pointerdown", (pointer) => this.appearHand(pointer));
		this.input.on("pointerup", (pointer) => this.disappearHand());
		this.input.on("pointermove", (pointer) => this.moveHand(pointer));
	}

	offHandMode() {
		this.input.off("pointerdown");
		this.input.off("pointermove");
		this.input.off("pointerup");
		this.handImage.setVisible(false);
	}

	appearHand(pointer) {
		this.handImage.setVisible(true);
		this.moveHand(pointer);
	}

	disappearHand() {
		this.handImage.setVisible(false);
	}

	moveHand(pointer) {
		this.handImage.x = pointer.x;
		this.handImage.y = pointer.y;
	}

	//#endregion

	gainParam(paramName, value) {
		const lastGrowth = this.animalParams.growth;
		const res = AnimalParamUtil.gainParam(this.animalParams, paramName, value);
		if (res) {
			this.refreshGauge(paramName);
			this.refreshGauge("exp");
			this.refreshLevel();
			if (lastGrowth < this.animalParams.growth)
				this.requestGrowthScene = true;
		}
	}

	changeAnimalImage(image) {
		if (this.showAnimalImage) {
			this.showAnimalImage.setVisible(false);
		}
		this.showAnimalImage = image.setVisible(true);
	}

}

