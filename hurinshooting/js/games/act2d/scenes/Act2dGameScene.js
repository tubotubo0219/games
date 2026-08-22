'use strict'

import SceneBase from "../../../scenes/SceneBase.js";
import TitleScene from "../../../scenes/TitleScene.js";
import {SelectButton, TextButton} from "../../../ui/Button.js";

//import VirtualJoystick from '../../../plugins/node_modules/phaser3-rex-plugins/plugins/virtualjoystick.js';

export default class Act2dGameScene extends SceneBase {
	constructor() {
		super({ key: 'Act2dGame', active: false });
	}

	preload() {
		this.loadBackWhite();
		this.loadButtonFrame();
		Object.values(GuideData.blocks).forEach(data => this.load.image(data.key, data.dir));
		this.loadDatabaseImage("kuma");
		this.loadDatabaseImage("board");
		this.load.image("guide_flower", "img/guide/flower.png");
		this.load.image("guide_spring", "img/guide/spring.png");
		this.load.image("guide_star", "img/guide/star.png");
		this.load.image("guide_goal", "img/guide/goal01.png");
	}

	create() {
		this.createBackImage("backWhite");
		this.playBGM("shop");
		this.initMembers();

		this.createStage();
		this.createInput();
		this.createUI();

		this.cameras.main.startFollow(this.player, true).setFollowOffset(0, 90);
		this.feedOutDisplay();


	}

	initMembers() {
		this.isStarted = false;
	}

	createStage() {
		const stageId = window.playerData.guideStage;
		this.stageData = GuideData.stages[stageId];
		const {width, height} = this.game.config;
		
		this.flowers = this.physics.add.group().add(new Flower(this)).add(new Flower(this));
		this.flowerIndex = 0;
		this.star = new Star(this);
		
		this.blocks = this.physics.add.staticGroup();
		this.stageData.map.forEach((ary, j) => {
			ary.forEach((id, i) => {
				if (id !== 0) this.createMapObject(i, j, id);
			});
		});
		this.deadY = this.stageData.map.length * 48 + 48 * 4;

		this.physics.add.collider(this.player, this.blocks, this.onBlockHit);
		this.physics.add.collider(this.flowers, this.blocks);
		this.physics.add.overlap(this.player, this.goal, this.onHit);

		this.physics.add.overlap(this.player, this.flowers, this.onHit);
		this.physics.add.collider(this.player, this.star, this.onHit);
	}

	createInput() {
		this.input.on("pointerup", (pointer) => this.createActionObject(pointer));
	}

	createUI() {
		const {width, height} = this.game.config;
		// buttons
		this.buttons = {};
		this.buttons.flower = new SelectButton(this, "guide_flower", "flower", 600 + 64 * 0, 420, 64, 64, this.selectAction.bind(this, "createFlower"), this.buttons);
		this.buttons.star   = new SelectButton(this, "guide_star",   "star",   600 + 64 * 1, 420, 64, 64, this.selectAction.bind(this, "createStar"),   this.buttons);
		this.menuButtons = {
			return: new TextButton(this, 96, 120, "やめる", "buttonFrame", this.returnScene.bind(this)),
			start: new TextButton(this, 96, 340, "はじめる", "buttonFrame", this.gameStart.bind(this)),
			retry: new TextButton(this, 96, 400, "やりなおし", "buttonFrame", this.gotoScene.bind(this, "GuideGame", false)),
		};
		this.stageName = this.createText(24, 48, "ステージ : " + window.playerData.guideStage);
		this.buttons.flower.select();
		this.buttonPressed = false;

		// board
		this.board = this.add.image(0, 0, "board").setOrigin(0.5, 0.5);
		this.boardText = this.createText(0, 0, "", 32).setOrigin(0.5, 0);
		this.boardContainer = this.add.container(width / 2, height / 2)
			.add(this.board)
			.add(this.boardText)
			.setVisible(false);
		
		// cameras
		this.uiCamera = this.cameras.add(0, 0, width, height);
		this.uiCamera.ignore([this.backImage, this.player, this.blocks, this.goal, this.star]);
		this.flowers.children.iterate(flower => this.uiCamera.ignore([flower, flower.spring]));
		this.cameras.main.ignore(Object.values(this.buttons));
		this.cameras.main.ignore(Object.values(this.menuButtons));
		this.cameras.main.ignore([this.boardContainer, this.stageName]);

		/*
		this.joyStick = new VirtualJoystick(this.scene, {
			x: 100, y: 100,
			radius: 100,
			base: this.add.circle(200, 200, 80, 0x000000).setAlpha(0.2),
			thumb: this.add.circle(200, 200, 30, 0x777777).setAlpha(0.6),
		});
		*/
		this.input.on('pointerdown', function(pointer){
			this.onPointerDown(pointer);
		}, this);

	}

	createMapObject(i, j, id) {
		const data = GuideData.blocks[id];
		this[data.create](i, j, id);
	}

	createBlock(i, j, id) {
		const data = GuideData.blocks[id];
		this.blocks.add(new Block(this, i * 48, j * 48, data.key, id));
	}

	createPlayer(i, j) {
		this.player = new Player(this, i * 48, j * 48, "kuma");
	}

	createGoal(i, j) {
		this.goal = new Goal(this, i * 48, j * 48);
	}

	onPointerDown(pointer) {
		/*
		this.joyStick.x = pointer.x;
		this.joyStick.y = pointer.y;
		*/
	}

	gameStart() {
		this.buttonPressed = true;
		this.player.start();
		this.isStarted = true;
	}

	selectAction(type) {
		this.buttonPressed = true;
		this.action = this[type];
	}

	createActionObject(pointer) {
		if (!this.buttonPressed) {
			this.action(pointer);
		} else {
			this.buttonPressed = false;
		}
	}

	createFlower(pointer) {
		const x = pointer.x + this.cameras.main.scrollX;
		const y = pointer.y + this.cameras.main.scrollY;
		const bx = Math.round(x / 48);
		const by = Math.ceil(y / 48);
		const pos = this.searchUnderBlock(bx, by, 1);
		if (pos) {
			const flower = this.flowers.getChildren()[this.flowerIndex];
			if (!flower.isLock) {
				flower.appear(pos.x * 48, pos.y * 48 - 48);
			} else {
				this.flowerIndex = 1 - this.flowerIndex;
				if (!flower.isLock) {
					flower.appear(pos.x * 48, pos.y * 48 - 48);
				}
			}
			this.flowerIndex = 1 - this.flowerIndex;
		}
	}

	createStar(pointer) {
		const x = pointer.x + this.cameras.main.scrollX;
		const y = pointer.y + this.cameras.main.scrollY;
		const bx = Math.round(x / 48);
		const by = Math.ceil(y / 48);
		this.star.appear(bx * 48, by * 48 - 48 + 8);
	}

	searchUnderBlock(bx, by, id) {
		for (let i=by; i<this.stageData.map.length; i++) {
			if (this.stageData.map[i][bx] === id) return {x:bx, y:i};
		}
		return null;
	}

	onHit(a, b) {
		a.onHit(b);
		b.onHit(a);
	}

	onBlockHit(a, b) {
		a.onBlockHit(b);
	}

	update(time, delta) {
	}

	stageClear() {
		this.boardContainer.setVisible(true);
		this.boardText.setText("Stage Clear!");
		this.input.on("pointerup", this.nextStage.bind(this));
	}

	gameover() {
		this.boardContainer.setVisible(true);
		this.boardText.setText("Game Over!");
		this.input.on("pointerup", this.gotoScene.bind(this, "GuideGame", false));
	}

	nextStage() {
		window.playerData.guideStage += 1;
		if (!GuideData.stages[window.playerData.guideStage]) {
			window.playerData.guideStage = 1;
		}
		this.gotoScene("GuideGame", false);
	}
}

const GuideData = {
	stages: {
		1: {
			map: [
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,99, 0, 1, ],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, ],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, ],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, ],
				[1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, ],
				[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
				[1,98, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
			],
		},

		2: {
			map: [
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
				[1,98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
				[1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,99, 1, ],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, ],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, ],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, ],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, ],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
			],
		},
	},

	blocks: {
		1: { key: "block01", dir: "img/guide/block01.png", create: "createBlock"},
		98: { key: "block01", dir: "img/guide/block01.png", create: "createPlayer"},
		99: { key: "goal01", dir: "img/guide/goal01.png", create: "createGoal"},
	},
};

class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);
        this.scene.add.existing(this);
		this.setOrigin(0.5, 1);
		this.setDepth(2);

		this.flipX = true;
		this.isPlayer = true;
	}

	start() {
		this.scene.physics.world.enableBody(this, 0);
        this.body.setSize(32, 32);
		this.body.setGravityY(300);
		this.body.velocity.x = 100;
		this.body.setBounceX(1);
	}

	onHit(target) {

	}

	onBlockHit(block) {
		if (this.body.touching.down) {
			if (this.body.touching.left || this.body.touching.right) {
				this.flipX = !this.flipX;
			}
		} else {
			if (this.body.touching.left || this.body.touching.right) {
				this.body.velocity.x = -this.body.velocity.x;
			}
		}
	}

	flowerJump() {
		this.body.velocity.y = -300;
	}

	stageClear() {
		this.scene.tweens.add({
			targets: this,
			duration: 500,
			alpha: 0.01,
			onComplete: () => {
				this.scene.stageClear();
				this.body.setVelocity(0);
			},
		});
	}

	gameover() {
		this.isDead = true;
		this.scene.tweens.add({
			targets: this,
			duration: 500,
			alpha: 0.01,
			onComplete: () => {
				this.scene.gameover();
				this.body.setVelocity(0);
			},
		});
	}
}

class GuideObject extends Phaser.Physics.Arcade.Image {
	constructor(scene, key) {
		super(scene, 0, 0, key);
		this.scene.add.existing(this);
		this.setDepth(1);
		this.setVisible(false);
	}

	appear(x, y) {
		this.appearObject(x, y, this);
		this.scene.physics.world.enableBody(this, 0);
        this.body.setSize(48, 12 / this.scaleY);
		this.body.setVelocity(0);
	}

	appearObject(x, y, obj) {
		obj.x = x;
		obj.y = y;
		obj.setAlpha(1);
		obj.setVisible(true);
	}

	disappear() {
		this.setVisible(false);
		this.isLock = false;
	}

	onHit(target) {

	}
}

class Flower extends GuideObject {
	constructor(scene) {
		super(scene, "guide_flower");
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

class Star extends GuideObject {
	constructor(scene) {
		super(scene, "guide_star");
		this.scaleY = 0.4;
		this.scaleX = 1.2;
	}

	appear(x, y) {
		super.appear(x, y);
		this.isStart = false;
	}

	onHit(target) {
		if (!this.isStart) {
			this.body.velocity.x = 100 * (target.body.velocity.x > 0 ? 1 : -1);
			this.body.maxVelocity.y = 60;
			this.isStart = true;
		} else {
			target.body.velocity.y = 55.1;
		}
	}
}

class Block extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y, key, id) {
		super(scene, x, y, key);
        this.scene.add.existing(this);
		this.setDepth(-1);
		this.id = id;
		this.setOrigin(0.5, 1);
	}
}

class Goal extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y) {
		super(scene, x, y, "guide_goal");
        this.scene.add.existing(this);
		this.setDepth(-1);
		this.setOrigin(0.5, 1);
		this.scene.physics.world.enableBody(this, 0);
	}

	onHit(target) {
		target.stageClear();
		this.disableBody(true, false);
	}
}