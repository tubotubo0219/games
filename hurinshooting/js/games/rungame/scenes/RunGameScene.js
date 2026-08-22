'use strict'

import SceneBase from "../../../scenes/SceneBase.js";
import {CharacterData, FileData} from '../../../Database.js';
import {TextButton} from "../../../ui/Button.js";

export default class RunGameScene extends SceneBase {
	constructor() {
		super({ key: 'RunGame', active: false });
	}

	preload() {
		this.loadBackWhite();
		this.loadButtonFrame();
		this.loadDatabaseImage("coin");
		this.loadDatabaseImage("kuma");
		this.loadDatabaseImage("back01");
		this.preloadAudio("hit02");
		this.load.image("dummy", "img/system/dummy.png");
		this.load.image("road", "img/backs/road.png");
		Object.keys(GameData.objects).forEach(key => this.preloadObjectImage(key, GameData.objects[key]));
	}

	preloadObjectImage(key, data) {
		console.log(data);
		if (data.imgType === "sprite") {
			this.load.spritesheet(data.key, data.dir, data.options);
		} else {
			this.load.image(data.key, data.dir);
		}
		if (data.sub) {
			Object.keys(data.sub).forEach(subkey => {
				this.preloadObjectImage(subkey, data.sub[subkey]);
			});
		}
	}

	create() {
		this.buttonPressed = false;
		this.isStarted = false;

		this.phase = 1;

		this.createBackImages();
		this.createButtons();
		this.createInput();

		this.createObjects();
	}

	update(time, delta) {
		this.scrollBackImage(time, delta);
	}

	createBackImages() {
		this.backImage1 = this.add.image(0, 0, "back01").setOrigin(0, 0).setDepth(-4);
		this.backImage2 = this.add.image(this.game.config.width, 0, "back01").setOrigin(0, 0).setDepth(-4);
		this.roadImage1 = this.add.image(0, 0, "road").setOrigin(0, 0).setDepth(-4);
		this.roadImage2 = this.add.image(this.game.config.width, 0, "road").setOrigin(0, 0).setDepth(-4);
	}

	createButtons() {
		this.menuButtons = {
			return: new TextButton(this, 96, 60, "やめる", "buttonFrame", this.returnScene.bind(this)),
			retry: new TextButton(this, 96, 120, "やりなおし", "buttonFrame", this.gotoScene.bind(this, "RunGame", false)),
		};
	}

	createInput() {
		this.input.on('pointerdown', function(pointer){
			this.onPointerDown(pointer);
		}, this);
	}

	createObjects() {
		this.player = new Player(this);
		this.blocks = this.physics.add.group();
		this.items = this.physics.add.group();

		this.bottom = this.physics.add.staticImage(300, 9 * 48, "dummy").setSize(48, 48);

		this.physics.add.collider(this.player, this.blocks, this.onBlockHit);
		this.physics.add.overlap(this.player, this.items, this.onItemHit);
		this.physics.add.collider(this.player, this.bottom, this.onBottomHit);

		this.createNextPhaseObjects();
	}

	createNextPhaseObjects() {
		this.phase++;
		console.log(this.phase);
		GameData.stages.objects[this.phase].forEach(create => {
			const funcName = GameData.objects[create[0]].create;
			this[funcName](create);
		});
	}

	createBlock(create) {
		this.blocks.add(new Block(this, create));
	}

	createCoin(create) {
		this.items.add(new Coin(this, create));
	}

	createFlag(create) {
		this.items.add(new Flag(this, create));
	}

	createFlower(create) {
		this.items.add(new Flower(this, create));
	}

	onPointerDown(pointer) {
		this.player.jump();
	}

	gameStart() {
		this.buttonPressed = true;
		this.player.start();
	}

	scrollBackImage(time, delta) {
		this.backImage1.x -= delta / 16.6 * 2;
		this.backImage2.x -= delta / 16.6 * 2;
		if (this.backImage1.x <= -this.game.config.width) this.backImage1.x = this.backImage2.x + this.backImage2.width;
		if (this.backImage2.x <= -this.game.config.width) this.backImage2.x = this.backImage1.x + this.backImage1.width;

		this.roadImage1.x -= delta / 16.6 * 4;
		this.roadImage2.x -= delta / 16.6 * 4;
		if (this.roadImage1.x <= -this.game.config.width) this.roadImage1.x = this.roadImage2.x + this.roadImage2.width;
		if (this.roadImage2.x <= -this.game.config.width) this.roadImage2.x = this.roadImage1.x + this.roadImage1.width;
	}

	onBottomHit(player, bottom) {
		player.onBottomHit();
	}

	onBlockHit(player, block) {
		player.onBlockHit(block);
		block.onHit(player);
	}

	onItemHit(player, coin) {
		player.onItemHit(coin);
		coin.onHit(player);
	}

	gainCoin(value) {
		window.playerData.coin += value;
	}

}

class Player extends Phaser.Physics.Arcade.Sprite{
	constructor(scene) {
		super(scene, 300, 200, "kuma");
        this.scene.add.existing(this);
		this.setOrigin(0.5, 0.5);
		this.setDepth(2);
		this.flipX = true;
		this.start();
	}

	start() {
		this.scene.physics.world.enableBody(this, 0);
        this.body.setSize(32, 32);
		this.body.setGravityY(600);
		this.setBounce(0);
	}

	jump() {
		if (this.body.touching.down) {
			this.body.velocity.y = -300;
		}
	}

	onBottomHit() {
	}

	onBlockHit(block) {
		if (this.body.touching.right) {
			this.scene.time.addEvent({
				delay: 1,
				callback: () => {
					this.body.setAngularVelocity(300);
					this.body.setVelocity(-1000, -1000);
					this.scene.playSE("hit02");
				}
			});
		}
	}

	onItemHit(item) {
	}
}

class ObjectBase extends Phaser.Physics.Arcade.Sprite{
	constructor(scene, createData) {
		const id = createData[0];
		const data = GameData.objects[id];
		const key = data.key;
		const x = 900;
		const y = (createData[2] || 8) * 48 + (data.ady || 0);
		const delay = createData[1];
		super(scene, x, y, key);

        this.scene.add.existing(this);
		this.setDepth(data.depth || -1);
		this.setScale(data.scale || 1);
		this.scene.physics.world.enableBody(this, 0);
		this.setVisible(false).setActive(false);
		this.scene.time.addEvent({
			delay: delay * 200,
			callback: this.pop.bind(this),
		});
		this.destroyEvent = this.scene.time.addEvent({
			delay: delay * 1000 + 10000,
			callback: this.destroy.bind(this),
		});

	}

	pop() {
		this.setVisible(true).setActive(true);
		this.body.setVelocityX(-240);
	}

	destroy() {
		if (this.body) {
			this.enableBody(true, true);
		}
		super.destroy();
	}

	onHit(player) {

	}
}

class Block extends ObjectBase{
	constructor(scene, createData) {
		super(scene, createData);
		this.setPushable(false);
	}
}

class Coin extends ObjectBase{
	constructor(scene, createData) {
		super(scene, createData);
		this.gain = createData[3];
	}

	onHit(player) {
		this.scene.gainCoin(this.gain);
		this.setVisible(false);
		this.enableBody(true, true);
		this.scene.time.removeEvent(this.destroyEvent);
		this.destroy();
	}
}

class Flag extends ObjectBase{
	constructor(scene, createData) {
		super(scene, createData);
	}

	onHit(player) {
		this.scene.createNextPhaseObjects();
		this.scene.items.remove(this);
		this.setFrame(1);
	}
}

class Flower extends ObjectBase {
	constructor(scene, createData) {
		super(scene, createData);
		this.spring = this.createSpring();
		this.spring.setVisible(false);
	}

	appear(x, y) {
		super.appear(x, y);
		this.appearObject(x, y, this.spring);
		this.spring.scaleY = 0.01;
	}

	disappear() {
		super.disappear();
		this.spring.setVisible(false);
	}

	createSpring() {
		const img = this.scene.add.image(0, 0, "guide_spring")
		img.scaleY = 0.01;
		img.setDepth(0.5);
		img.setOrigin(0.5, 1);
		return img;
	}

	onHit(target) {
		target.flowerJump();
		this.disableBody(true, false);
		this.isLock = true;
		this.scene.tweens.timeline({
			targets: this,
			tweens: [
				{ y: this.y - 48, duration: 400, ease: 'Bounce.easeOut' },
				{ alpha: 0.01, duration: 600, onComplete: this.disappear.bind(this) },
			],
		})
		this.scene.tweens.timeline({
			targets: this.spring,
			tweens: [
				{ scaleY: 1, duration: 400, ease: 'Bounce.easeOut' },
				{ alpha: 0.01, duration: 600, onComplete: this.disappear.bind(this) },
			],
		});
	}
}


const GameData = {
	stages: {
		objects: {
			1: [
				["block01", 10],
				["coin01", 10, 7, 10],
				["block01", 20],
				["block01", 30],
				["coin01", 30, 7, 10],
				["block01", 40],
				["block01", 50],
				["coin01", 50, 7, 10],
				["block01", 60],
				["coin01", 60, 7, 10],
				["flag", 70]
			],

			2: [
				["block01", 10],
				["coin01", 10, 7, 10],
				["block01", 15, 7],
				["block01", 20, 6],
				["coin02", 25, 5, 30],
				["block01", 30],
				["block01", 40],
				["block01", 50],
				["block01", 60],
			],
		},

	},

	objects: {
		"block01" : {
			key: "block01", dir: "img/guide/block01.png", create: "createBlock",
		},

		"coin01" : {
			key: "coin", dir: "img/system/coin.png", create: "createCoin",
		},

		"coin02" : {
			key: "coin", dir: "img/system/coin.png", create: "createCoin", scale: 2,
		},

		"flag" : {
			key: "flags",
			dir: "img/system/flags.png", create: "createFlag", imgType: "sprite", options: {frameWidth: 96, frameHeight: 96, endFrame: 2},
			ady: -24,
		},

		"flower" : {
			key: "guide_flower", dir: "img/guide/flower.png", create: "createFlower",
			sub: {guide_spring: {key: "guide_spring", dir: "img/guide/spring.png"}}
		},

	},
};
