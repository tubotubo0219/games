'use strict'

import SceneBase from "./SceneBase.js";
import {FileData, CharacterData, DressupData} from "../Database.js";
import {TextButton} from "../ui/Button.js";


export default class GachaScene extends SceneBase {
	constructor() {
		super({ key: 'Gacha', active: false });
	}

	preload() {
		const keys = {};
		if (window.gachaMode === "accessories") {
			keys.gachaBodyT = "gacha_body_acc_t";
			keys.gachaBodyB = "gacha_body_acc_b";
			keys.capsuleS = "capsule_acc_s";
			keys.capsuleB = "capsule_acc_b";
			this.costCoin = 200;
		} else {
			keys.gachaBodyT = "gacha_body_t";
			keys.gachaBodyB = "gacha_body_b";
			keys.capsuleS = "capsule_s";
			keys.capsuleB = "capsule_b";
			this.costCoin = 100;
		}
		this.imageKeys = keys;
		this.load.image(keys.gachaBodyT, FileData.images[keys.gachaBodyT]);
		this.load.image(keys.gachaBodyB, FileData.images[keys.gachaBodyB]);
		this.load.image("gacha_handle", FileData.images.gacha_handle);
		this.load.image("gacha_container", FileData.images.gacha_container);
		this.load.image(keys.capsuleS, FileData.images[keys.capsuleS]);
		this.load.image("capsule_t", FileData.images.capsule_t);
		this.load.image(keys.capsuleB, FileData.images[keys.capsuleB]);

		this.loadBackWhite();
		this.loadButtonFrame();
		this.load.image("coin", FileData.images.coin);

	}

	create() {
		this.backImage = this.add.image(0, 0, 'backWhite').setOrigin(0, 0).setInteractive();
		this.overrideBack = this.add.image(0, 0, 'backWhite').setOrigin(0, 0).setInteractive().setDepth(3).setVisible(false);

		const centerX = this.game.config.width/2;
		const centerY = this.game.config.height/2;
		this.gachaBody = this.add.image(centerX, centerY, this.imageKeys.gachaBodyT).setOrigin(0.5, 0.5);
		this.gachaBody.depth = 2;
		this.gachaBody_b = this.add.image(centerX, centerY, this.imageKeys.gachaBodyB).setOrigin(0.5, 0.5);
		this.gachaContainer = this.add.image(centerX, centerY - 44, "gacha_container").setOrigin(0.5, 0.5).setAlpha(0.5);
		this.gachaContainer.depth = 1;
		this.gachaHandle = this.add.image(centerX, centerY + 71, "gacha_handle").setOrigin(0.5, 0.5);
		this.gachaHandle.depth = 2;

		const bw=116, bh=136;
		var customBounds = new Phaser.Geom.Rectangle(centerX - bw/2, centerY - 46 - bh/2, bw, bh);
	
		this.getBounds = new  Phaser.Geom.Rectangle(0, 0, 860, 384);

		this.capsules = this.physics.add.group({
			key: this.imageKeys.capsuleS,
			frameQuantity: 12,
			bounceX: 0.8,
			bounceY: 0.8,
			collideWorldBounds: true,
			velocityX: 180,
			velocityY: 120,
			gravityY : 400,
			frictionY: 1,
		});
		this.capsule_t = this.add.image(centerX - 128, centerY, "capsule_t").setOrigin(0, 0.9).setDepth(3).setVisible(false);
		this.capsule_b = this.add.image(centerX - 128, centerY, this.imageKeys.capsuleB).setOrigin(0, 0).setDepth(3).setVisible(false);

		Phaser.Actions.RandomRectangle(this.capsules.getChildren(), customBounds);
		this.capsules.children.iterate(cap => {
			cap.setCircle(20);
			cap.setOffset(2, 2);
			cap.setScale(0.6);
			cap.setFrictionY(500);
			cap.setAngle(Phaser.Math.Between(0, 360));
			//cap.body.setGravityY(400);
			cap.body.setBoundsRectangle(customBounds);
		});
		this.physics.add.collider(this.capsules, this.capsules);
		this.buyButton = new TextButton(this, 700, 400, "かう", "buttonFrame", this.payCost.bind(this));

		const btnX = 96, btnY = 64;
		const buttonFrameKey = 'buttonFrame';
		this.cateButtons = {};
		const optF = {}, optA = {};
		if (window.gachaMode === "accessories") optA.normalColor = 0xffcccc;
		else optF.normalColor = 0xffcccc;
		this.buttons = {
			figures    : new TextButton(this, btnX, btnY + 56 * 1, "フィギュア", buttonFrameKey, this.setGachaMode.bind(this, "figures"), optF),
			accessories: new TextButton(this, btnX, btnY + 56 * 2, "おしゃれ", buttonFrameKey, this.setGachaMode.bind(this, "accessories"), optA),
			collect    : new TextButton(this, btnX, btnY + 56 * 3, "コレクション", buttonFrameKey, this.gotoScene.bind(this, "Collection", false)),
			return     : new TextButton(this, btnX, btnY + 56 * 0, "もどる", buttonFrameKey, this.returnScene.bind(this, false)),
		};

		this.cateButtons.figures = this.buttons.figures;
		this.cateButtons.accessories = this.buttons.accessories;

		const coinX = 600, coinY = 32;
		this.coinImage = this.add.image(coinX, coinY, "coin").setOrigin(0, 0);
		this.coinText = this.add.text(coinX + 48, coinY + 10, window.playerData.coin, {fontFamily: "メイリオ", fontSize:24, color: "#aa0066"}).setOrigin(0, 0);

		const costX = 620, costY = 320;
		this.costImage = this.add.image(costX, costY, "coin").setOrigin(0, 0);
		this.costText = this.add.text(costX + 48, costY + 10, "-" + this.costCoin, {fontFamily: "メイリオ", fontSize:24, color: "#aa0066"}).setOrigin(0, 0);
		this.centerX = centerX;
		this.centerY = centerY;
		if (window.playerData.coin < this.costCoin) {
			this.buyButton.setValid(false);
		}
	}

	setGachaMode(type) {
		window.gachaMode = type;
		this.gotoScene("Gacha", false);
	}

	update() {

	}

	payCost() {
		window.playerData.coin -= this.costCoin;
		if (window.gachaMode === "accessories") {
			const list = Object.keys(DressupData).filter(key => !DressupData[key].removeGacha);
			window.getItemKey = list[Phaser.Math.Between(0, list.length-1)];
			window.playerData.accessories[window.getItemKey] ||= 0;
			window.playerData.accessories[window.getItemKey] += 1;
		} else {
			// フィギュアを決める
			const list = Object.keys(CharacterData).filter(key => !CharacterData[key].removeGacha);
			window.getItemKey = list[Phaser.Math.Between(0, list.length-1)];
			window.playerData.figures[window.getItemKey] ||= 0;
			window.playerData.figures[window.getItemKey] += 1;
		}
		this.save();
		this.coinText.setText(window.playerData.coin);
		this.gachaHandle.setInteractive(new Phaser.Geom.Circle(0, 0, 80), Phaser.Geom.Circle.Contains)
        	.on("pointermove", (pointer) => this.rotateGachaHandle(pointer));
		this.handleCount = null;
		this.popCount = 0;
		this.lastTime = null;
		this.buyButton.setValid(false);
		this.buttons.figures.setValid(false);
		this.buttons.accessories.setValid(false);
		this.buttons.return.setValid(false);
		this.buttons.collect.setValid(false);
	}

	rotateGachaHandle(pointer) {
		const now = Date.now();
		this.lastTime ||= now;
		this.handleCount += (now - this.lastTime) / 4;
		this.lastTime = now;
		if (this.handleCount >= 360) {
			this.gachaHandle.angle = 360;
			this.handleCount = 0;
			this.gachaHandle.removeInteractive().off("pointermove");
			this.getCapsule();
		} else {
			this.gachaHandle.angle = this.handleCount;
		}
		if (this.handleCount >= 120 * this.popCount) {
			this.popCount += 1;
			this.popCapsules();
		}
	}

	popCapsules() {
		this.capsules.children.iterate(cap => {
			const disx = this.centerX - cap.x;
			const disy = this.centerY - cap.y;
			const dis = disx * disx + disy * disy;
			cap.setVelocityX(Phaser.Math.Between(-200, 200));
			cap.setVelocityY(Phaser.Math.Between(-200, 200));
			this.tweens.add({
				targets: cap,
				angle: cap.angle + Phaser.Math.Between(-80, 80),
				ease: 'Power2',
				duration: 1000,
				completeDelay: 1000
			})
		});
	}

	getCapsule() {
		let min = 1000000;
		let get = null;
		this.capsules.children.iterate(cap => {
			const disx = this.centerX - cap.x;
			const disy = this.centerY - cap.y;
			const dis = disx * disx + disy * disy;
			if (min > dis) {
				get = cap;
				min = dis;
			}
		});

		this.tweens.add({
			targets: get,
			x: this.centerX,
			duration: 1000,
			ease: 'Power2',
			completeDelay: 1000
		});
		this.capsules.remove(get);
		get.body.setVelocity(0);
		get.body.setBoundsRectangle(this.getBounds);
		get.setBounceY(0.5);


		this.getEvent = this.time.addEvent({
			delay: 4000,
			callback: () => {
				this.tweens.add({targets:get, alpha:0, duration:1200, completeDelay:1200});
				window.flags.isFigureGetMode = true;
				this.gotoScene("FigureGet", false);
			}
		});

	}

	openCapsule() {
		this.overrideBack.setVisible(true);
		this.capsule_t.setVisible(true);
		this.capsule_b.setVisible(true);

		this.tweens.add({
			targets: this.capsule_t,
			delay:500,
			duration:120,
			completeDelay:120,
			y: this.capsule_t.y - 100,
		});
		this.tweens.add({
			targets: this.capsule_b,
			delay:500,
			duration:120,
			completeDelay:120,
			y: this.capsule_t.y + 100,
		});
	}
}

