'use strict'

import SceneBase from "./SceneBase.js";
import {TextButton, ImageButton, CheckBox} from "../ui/Button.js";
import Gauge from "../ui/Gauge.js";
import Slider from "../ui/Slider.js";
import {AnimalParamUtil} from '../games/shooting/objects/Animal.js';
import {CareAnimal, CareAnimalWithLayers} from "../objects/CareAnimal.js";
import {AnimalData, FileData, DressupData, CareItemData} from "../Database.js";

export default class DressupScene extends SceneBase {
	constructor() {
		super({ key: 'Dressup', active: false });
	}

	preload() {
		// 所持アイテムを取得
		this.hasAccs = Object.assign({}, window.playerData.accessories);
		this.useAccs = {};
		Object.values(window.playerData.animals).forEach(params => {
			if (params.id !== window.talkAnimal) {
				params.dressup.forEach(data => {
					this.useAccs[data[0]] ||= 0;
					this.useAccs[data[0]]++;
				});
			}
		});
		this.itemLen = Object.keys(this.hasAccs).length;
		// 所持していないアイテムをクリア
		let isDelete = false;
		window.playerData.animals[window.talkAnimal].dressup = 
			window.playerData.animals[window.talkAnimal].dressup.filter(data => {
				return !!this.hasAccs[data[0]];
			});
		this.loadBackWhite();
		this.loadButtonFrame();
		this.load.image('window', 'img/system/window_talk.png');

		this.load.image('gauge_frame', FileData.images.gauge_frame);
		this.load.image('gauge_fill', FileData.images.gauge_fill);
		this.load.image('board', FileData.images.board);
		this.load.image('hand', FileData.images.icon_hand);

		this.load.image('left_arrow', FileData.images.left_arrow);
		this.load.image('item_frame', FileData.images.item_frame);

		this.animalParams = window.playerData.animals[window.talkAnimal];
		this.animalData = AnimalData[this.animalParams.id];
		this.animalName = this.animalData.name;
		this.talkData = this.animalData.talk[this.animalParams.growth];
		const kdir = this.talkData.keyDir;
		const ftype = this.talkData.fileType;
		if (this.talkData.layers) {
			const layerKeys = Object.keys(this.talkData.layers);
			this.aniKeys = {};
			this.talkData.layers.base.forEach(lkey => {
				this.aniKeys[lkey] = this.talkData.keyHeader + lkey;
				this.load.image(this.aniKeys[lkey], kdir + lkey + ftype);
			});
			this.talkData.layers.normal.forEach(lkey => {
				this.aniKeys[lkey] = this.talkData.keyHeader + lkey;
				this.load.image(this.aniKeys[lkey], kdir + lkey + ftype);
			});
		} else {
			const key = "normal";
			this.aniKeys = {
				normal: this.talkData.keyHeader + key,
			};
			Object.keys(this.aniKeys).forEach(key => this.load.image(this.aniKeys[key], kdir + key + ftype));
		}
		this.preloadDressupImages();
	}

	preloadDressupImages() {
		Object.keys(this.hasAccs).forEach(id => this.load.image(DressupData[id].key, FileData.images[DressupData[id].key]));
	}


	create() {
		const center = this.game.config.width / 2;
		const centerY = this.game.config.height / 2;
		this.createBackImage("backWhite");
		if (this.talkData.layers) {
			this.animalImage = new CareAnimalWithLayers(this, window.talkAnimal, this.aniKeys);
		} else {
			this.animalImage = new CareAnimal(this, window.talkAnimal, this.aniKeys);
		}
		this.animalImage.changeImage("normal");
		this.createSliders();
		this.createMenuButtons();
		this.createItems();
		this.setDragActions();
		this.input.on("pointerdown", this.pointerDown.bind(this));
		this.input.on("pointermove", this.pointerMove.bind(this));

		this.debugText = this.createText(400, 60, "");
		this.debugText2 = this.createText(100, 440, "");
	}

	createMenuButtons() {
		const btnX = 96, btnY = 80;
		const buttonFrameKey = 'buttonFrame';
		this.buttons = {
			return : new TextButton(this, btnX + 0, btnY + 56 * 0, "もどる", buttonFrameKey, this.returnScene.bind(this, false)),
			save : new TextButton(this, btnX + 0, btnY + 56 * 1, "ほぞん", buttonFrameKey, this.saveDressup.bind(this)),
		};
	}

	createItems() {
		this.itemButtons = {};
		this.itemNumTexts = {};
		
		window.dressupItemPage ||= 0;
		Object.keys(this.hasAccs).forEach((id, i) => {
			const x = 128 + 64 * (i%10);
			const y = 436;
			this.itemButtons[id] = new ImageButton(this, x, y, 64, 64, DressupData[id].key,
				null, {imageScale: DressupData[id].buttonScale, frame:{key:"item_frame"}});
			this.itemButtons[id].setCallback("pointerdown", this.popItem.bind(this, x, y, id));
			this.itemNumTexts[id] = this.createText(x+28, y-28, (this.useAccs[id]||0) + "/" + this.hasAccs[id], 16).setOrigin(1,0);
		});
		this.setItemPage();
		const btx = 56, bty = 432;
		this.prevPageButton = this.add.image(btx, bty, "left_arrow").setInteractive()
			.on("pointerup", this.prevItemPage.bind(this))
			.on("pointerover", () => this.prevPageButton.setTint(0xddaaaa))
			.on("pointerout", () => this.prevPageButton.clearTint());
		this.nextPageButton = this.add.image(this.game.config.width - btx, bty, "left_arrow")
			.setAngle(180).setInteractive()
			.on("pointerup", this.nextItemPage.bind(this))
			.on("pointerover", () => this.nextPageButton.setTint(0xddaaaa))
			.on("pointerout", () => this.nextPageButton.clearTint());

		this.items = [];
		window.playerData.animals[window.talkAnimal].dressup.forEach(data => {
			this.popItem(
				data[1] + this.animalImage.x,
				data[2] + this.animalImage.y,
				data[0],
			).setScale(data[3]).setAngle(data[4]).setDepth(data[5]).setFlipX(data[6]);
		});
		if (this.items[0]) {
			this.setLastItem(this.items[0]);
		} else {
			this.lastItem = null;
		}
	}

	createSliders() {
		this.createText(50, 180, "サイズ", 24);
		this.scaleSlider = new Slider(this, 100, 220, 100, 0.5, this.onScaleSliderChange.bind(this));
		this.createText(50, 240, "かいてん", 24);
		this.angleSlider = new Slider(this, 100, 280, 100, 0, this.onAngleSliderChange.bind(this));
		this.createText(50, 300, "ぜんご", 24);
		this.depthSlider = new Slider(this, 100, 340, 100, 0, this.onDepthSliderChange.bind(this));
		this.createText(50, 360, "はんてん", 24);
		this.flipXCheckBox = new CheckBox(this, 180, 376, this.changeFlipX.bind(this));
	}

	prevItemPage() {
		window.dressupItemPage--;
		if (window.dressupItemPage < 0) {
			window.dressupItemPage = this.calcMaxItemPage();
		}
		this.setItemPage();
	}

	nextItemPage() {
		window.dressupItemPage++;
		if (window.dressupItemPage > this.calcMaxItemPage()) {
			window.dressupItemPage = 0;
		}
		this.setItemPage();
	}

	setItemPage() {
		const page = window.dressupItemPage;
		const min = 10 * page;
		const over = min + 10;
		Object.keys(this.itemButtons).forEach((id, i) => {
			if (min <= i && i < over) {
				this.itemButtons[id].setVisible(true);
				this.itemNumTexts[id].setVisible(true);
			} else {
				this.itemButtons[id].setVisible(false);
				this.itemNumTexts[id].setVisible(false);
			}
		});
	}

	calcMaxItemPage() {
		return Math.floor((this.itemLen-1) / 10);
	}

	popItem(x, y, id) {
		if (this.useAccs[id] >= this.hasAccs[id]) return;
		const item = new DressupItem(this, x, y, id, DressupData[id].key);
		this.items.push(item);
		this.input.setDraggable(item);
		this.useAccs[id] ||= 0;
		this.useAccs[id]++;
		this.refreshItemNumText(id);
		return item;
	}

	putItem(gameObject) {
		gameObject.destroy();
		this.useAccs[gameObject.id]--;
		this.items.splice(this.items.indexOf(gameObject), 1);
		this.lastItem = null;
		this.refreshItemNumText(gameObject.id);
	}

	setDragActions() {
		this.input.on('dragstart', (pointer, gameObject) => {
			if (this.input.pointer1.isDown && this.input.pointer2.isDown) return;
			this.setLastItem(gameObject);
		});
	
		this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
			if (this.input.pointer1.isDown && this.input.pointer2.isDown) return;
			gameObject.x = dragX;
			gameObject.y = dragY;
		});
	
		this.input.on('dragend', (pointer, gameObject) => {
			if (this.input.pointer1.isDown && this.input.pointer2.isDown) return;
			if (pointer.y >= 400 || pointer.x <= 80 || pointer.x >= 780) {
				this.putItem(gameObject);
			}
		});
	}
	

	setLastItem(item) {
		if (item) {
			this.lastItem = item;
			this.setSlidersValue(item);
		}
	}

	refreshItemNumText(id) {
		this.itemNumTexts[id].setText((this.useAccs[id]||0) + "/" + this.hasAccs[id]);
	}

	setSlidersValue(item) {
		this.scaleSlider.setValue((item.scaleX + 0.5) - 1);
		const angle = (item.angle >= 0 ? 0 : 360) + item.angle;
		this.angleSlider.setValue(angle / 360);
		this.depthSlider.setValue(item.depth + 0.5);
		this.flipXCheckBox.setValue(item.flipX);
}

	onScaleSliderChange() {
		if (this.lastItem) {
			this.lastItem.setScale(1 + (this.scaleSlider.value - 0.5));
		}
	}

	onAngleSliderChange() {
		if (this.lastItem) {
			this.lastItem.setAngle((this.angleSlider.value * 360));
		}
	}

	onDepthSliderChange() {
		if (this.lastItem) {
			this.lastItem.setDepth((this.depthSlider.value - 0.5));
		}
	}

	changeFlipX() {
		if (this.lastItem) {
			this.lastItem.flipX = !this.lastItem.flipX;
		}
	}


	saveDressup() {
		const params = window.playerData.animals[window.talkAnimal];
		params.dressup = this.items.map(item => {
			const data = [
				item.id,
				item.x - this.animalImage.x,
				item.y - this.animalImage.y,
				item.scaleX,
				item.angle,
				item.depth,
				item.flipX,
			];
			return data;
		});
		this.save();
	}

	pointerDown() {
		this.pbase = null;
	}

	pointerMove() {
		//this.debugText.setText(this.input.pointer1.isDown + "  " + this.input.pointer2.isDown);
		if (!!this.lastItem && this.input.pointer1.isDown && this.input.pointer2.isDown) {
			const p1 = this.input.pointer1, p2 = this.input.pointer2;
			if (!this.pbase) {
				this.pbase = {dis: Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))};
				const radian = Math.atan2(p1.y - p2.y, p1.x - p2.x);
				this.pbase.deg = radian * (180 / Math.PI);
				if (this.pbase.deg < 0) this.pbase.deg += 360;
			} else {
				const newDis = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
				const scale = (newDis - this.pbase.dis) * 0.005;
				const newScale = Math.min(Math.max(this.lastItem.scale + scale, 0.5), 1.5);
				this.lastItem.setScale(newScale);

				let newDeg = Math.atan2(p1.y - p2.y, p1.x - p2.x) * (180 / Math.PI);
				if (newDeg < 0) newDeg += 360;
				const angle = (newDeg - this.pbase.deg) * 3;
				this.lastItem.setAngle(this.lastItem.angle + angle);

				this.debugText2.setText("angle: "+angle + " " + newDeg + " " + this.pbase.deg);

				this.pbase.dis = newDis;
				this.pbase.deg = newDeg;
				this.setSlidersValue(this.lastItem);
				
			}


		} else {
			this.pbase = null;
		}
	}
}

class DressupItem extends Phaser.GameObjects.Image {
	constructor(scene, x, y, id, imageKey) {
		super(scene, x, y, imageKey);
		this.id = id;
		const pt = DressupData[id].dragPoint;
		if (pt) {
			this.setInteractive(new Phaser.Geom.Rectangle(pt[0], pt[1], pt[2], pt[3]), Phaser.Geom.Rectangle.Contains);
		} else {
			this.setInteractive();
		}
		this.scene.add.existing(this);
	}
}

