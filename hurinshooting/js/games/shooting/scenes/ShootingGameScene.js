'use strict'

import SceneBase from "../../../scenes/SceneBase.js";
import Gauge from "../../../ui/Gauge.js";
import {ImageButton} from "../../../ui/Button.js";
import Bullet from '../objects/Bullet.js';
import Enemy from '../objects/Enemy.js';
import Player from '../objects/Player.js';
import Item from '../objects/Item.js';
import CaughtAnimal from '../objects/CaughtAnimal.js';
import Animal, {AnimalParams} from '../objects/Animal.js';
import {CharacterData, BulletData, StageData, FileData, AnimalData} from '../../../Database.js';

export default class ShootingGameScene extends SceneBase {
	constructor() {
		super({ key: 'ShootingGame', active: false });
		this.timer = 0;
	}

	preload() {
		this.animations = [];
		this.stageData = StageData[window.selectStage];
		this.load.image(this.stageData.backImage, FileData.images[this.stageData.backImage]);
		this.load.image("coin", FileData.images.coin);

		this.preloadCharacter(window.selectPlayer);
		this.preloadEnemies();
		this.preloadAnimal();
		this.preloadItems();

		this.preloadAudio(this.stageData.bgm);
		this.preloadAudio("hit01");
		this.preloadAudio("hit02");
		this.preloadAudio("explosion01");
	}

	preloadCharacter(charaId) {
		const ch = CharacterData[charaId];
		this.load.image(ch.key, FileData.images[ch.key]);
		if (ch.bullets) {
			this.preloadBullets(ch.bullets);
		}
		if (ch.servants) {
			ch.servants.forEach(ch => this.load.image(CharacterData[ch].key, FileData.images[CharacterData[ch].key]));
		}
		if (ch.children) {
			ch.children.forEach(child => this.preloadCharacter(child));
		}
	}

	preloadEnemies() {
		Object.keys(this.stageData.enemies).forEach(key => this.stageData.enemies[key].forEach(pop => this.preloadCharacter(pop[0])));
	}

	preloadAnimal() {
		if (this.stageData.animal && !window.playerData.animals[this.stageData.animal]) {
			const animalData = AnimalData[this.stageData.animal].caught;
			this.load.image(animalData.key, FileData.images[animalData.key]);
		}
		const pet = window.playerData.takePet;
		if (pet) {
			this.load.image(AnimalData[pet].pet.key, FileData.images[AnimalData[pet].pet.key]);
			this.load.image('gauge_frame', FileData.images.gauge_frame);
			this.load.image('gauge_fill', FileData.images.gauge_fill);
			this.load.image("icon_frame", FileData.images.icon_frame);
			this.load.image("icon_osewa", FileData.images.icon_osewa);
			if (AnimalData[pet].pet.bullets) {
				this.preloadBullets(AnimalData[pet].pet.bullets);
			}
	
		}
	}

	preloadBullets(array) {
		array.forEach(bullet => this.preloadBullet(bullet));
}

	preloadBullet(id) {
		const bldata = BulletData[id];
		if (bldata.type === "sprite") {
			this.load.spritesheet(bldata.key, FileData.images[bldata.key], bldata.options);
			this.animations.push(bldata);
		} else {
			this.load.image(bldata.key, FileData.images[bldata.key]);
		}
		if (bldata.deadCreate) {
			this.preloadBullet(bldata.deadCreate);
		}
	}

	preloadItems() {
		this.load.image("item_p", FileData.images.item_p);
		this.load.image("item_b", FileData.images.item_b);
		this.load.image("item_g", FileData.images.item_g);
	}

	create() {
		this.playBGM(this.stageData.bgm);

		this.timer = 0;
		this.isTimerStop = false;
		this.animal = null;
	
		this.backImage1 = this.add.image(0, 0, this.stageData.backImage).setOrigin(0, 0);
		this.backImage2 = this.add.image(this.game.config.width, 0, this.stageData.backImage).setOrigin(0, 0);

		this.createInfoUI();
		this.createGameObjects();
		this.createAnimations();

		if (window.playerData.config.control === "swipe") {
			this.createSwipeEvents();
		}

		this.keySpace = this.input.keyboard.addKey('SPACE');

		this.feedOutDisplay();
	}

	createInfoUI() {
		this.coinText = this.add.text(160, 16, window.playerData.coin, { fontFamily:"Arial", fontSize: '30px', fill: '#000' }).setOrigin(0, 0);
		this.coinImage = this.add.image(108, 4, "coin").setOrigin(0, 0);
	}

	createGameObjects() {
		this.player = new Player(this, window.selectPlayer, 160, 240);
		this.enemies = {};
		this.addEnemies = this.physics.add.group({runChildUpdate: true});
		if (window.playerData.takePet) {
			this.animal = new Animal(this, window.playerData.takePet, 32, 280, this.player);
			this.animalContainer = this.add.container(-80, 0).add(this.animal);
			this.animalTween = this.tweens.add({
				targets: this.animalContainer,
				duration: 1600,
				ease: "Quad.easeInOut",
				yoyo: true,
				y: 48,
				repeat: -1,
			});
			this.petSkillGauge = new Gauge(this, 600, 420, "gauge_frame", "gauge_fill", this.petSkillGaugeRatio.bind(this)).setDepth(10);
			this.petSkillButton = new ImageButton(this, 760, 420, 64, 64, "icon_osewa", this.usePetSkill.bind(this), {frame:{key:"icon_frame"}}).setDepth(10);
			this.refreshPetSkill();
		}
		this.playerBullets = this.physics.add.group({runChildUpdate: true});
		this.enemyBullets = this.physics.add.group({runChildUpdate: true});
		this.hitressBullets = this.physics.add.group({runChildUpdate: true});
		this.items = this.physics.add.group({runChildUpdate: true});
		this.createStageEnemies();

		this.physics.add.overlap(this.player, this.enemyBullets, this.collideObjects, null, this);
		this.physics.add.overlap(this.playerBullets, this.enemyBullets, this.collideObjects, null, this);
		this.physics.add.overlap(this.player, this.items, this.collideItem, null, this);
	
		this.physics.add.overlap(this.player, this.addEnemies, this.collideObjects, null, this);
		this.physics.add.overlap(this.playerBullets, this.addEnemies, this.collideObjects, null, this);
	}

	createStageEnemies() {
		const enekeys = Object.keys(this.stageData.enemies);
		enekeys.forEach(key => this.createKeyEnemies(key));
		this.activateEnemiesPop(0);
		this.nextEnemies = 1;
		//this.stageData.enemies.initialze.forEach(data => this.createEnemy(data));
	}
	
	createKeyEnemies(key) {
		this.enemies[key] = this.physics.add.group({runChildUpdate: true});
		let enemy = null;
		this.stageData.enemies[key].forEach(data => this.createEnemy(data, key, enemy));
	}

	createEnemy(popData, key) {
		const enemy = new Enemy(this, popData);
		this.enemies[key].add(enemy);
		if (popData[3]) {
			if (popData[3].children) {
				popData[3].children.forEach(child => {
					const pop = [child[0], popData[1], popData[2], child[1]];
					this.enemies[key].add(new Enemy(this, pop, enemy));
				});
			}
			if (popData[3].loop) {
				const loop = popData[3].loop;
				for (let i=1; i<loop[0]; i++) {
					const ene = new Enemy(this, popData);
					ene.popTime = popData[2] + i * loop[1];
					if (loop[2]) {
						if (loop[2][0] == "rand") {
							ene.y = Phaser.Math.Between(loop[2][1], loop[2][2]);
						} else {
							ene.y = loop[2][i];
						}
					}
					this.enemies[key].add(ene);
				}
			}
		}
	}

	addEnemy(key, y, isRandomY) {
		if (isRandomY) y = Phaser.Math.Between(y[0], y[1]);
		const popData = [key, y, 0];
		const enemy = new Enemy(this, popData);
		this.addEnemies.add(enemy);
		enemy.activatePop();
	}

	createSwipeEvents() {
		this.input.on('pointerdown', function(pointer){
			this.player.onPointerDown(pointer);
		}, this);
		this.input.on('pointerdownoutside', function(pointer){
			this.player.onPointerDown(pointer);
		}, this);
		this.input.on('pointermove', function(pointer){
			this.player.onPointerMove(pointer);
		}, this);
		this.input.on('pointerup', function(pointer){
			this.player.onPointerUp();
		}, this);
		this.input.on('pointerupoutside', function(pointer){
			this.player.onPointerUp();
		}, this);
	}

	activateEnemiesPop(key) {
		this.enemies[key].children.iterate(enemy => enemy.activatePop());
		this.physics.add.overlap(this.player, this.enemies[key], this.collideObjects, null, this);
		this.physics.add.overlap(this.playerBullets, this.enemies[key], this.collideObjects, null, this);
	}

	activateNextEnemies() {
		this.activateEnemiesPop(this.nextEnemies);
		this.nextEnemies++;
	}

	createAnimations() {
		while(this.animations.length > 0) {
			const data = this.animations.shift();
			this.anims.create(data.config);
		}
	}

	createPlayerBullet(bulletId, user, options) {
		const blt = new Bullet(this, bulletId, user, "player", options);
		this.playerBullets.add(blt);
		return blt;
	}

	createEnemyBullet(bulletId, user, options) {
		const blt = new Bullet(this, bulletId, user, "enemy", options);
		if (BulletData[bulletId].hitress) {
			this.hitressBullets.add(blt);
			return blt;
		} else {
			this.enemyBullets.add(blt);
			return blt;
		}
	}

	createItem(itemId, dropObj) {
		this.items.add(new Item(this, itemId, dropObj));
	}

	update(time, delta) {
		this.updateObjects(time, delta);
		this.updateTimer(time, delta);
		this.scrollBackImage(time, delta);
		/* debug */
		if (this.keySpace.isDown) {
			//this.timer = this.stageData.clearTime;
			this.player.levels.pet = 10;
			this.refreshPetSkill();
		}

	}

	updateObjects(time, delta) {
		this.player.update(time, delta);
		if (this.animal) {
			this.animal.update(time, delta);
		}
		if (this.caughtAnimal) {
			this.caughtAnimal.update(time, delta);
		}
	}
	
	scrollBackImage(time, delta) {
		this.backImage1.x -= delta / 16.6;
		this.backImage2.x -= delta / 16.6;
		if (this.backImage1.x <= -this.game.config.width) this.backImage1.x = this.backImage2.x + this.backImage2.width;
		if (this.backImage2.x <= -this.game.config.width) this.backImage2.x = this.backImage1.x + this.backImage1.width;
	}

	updateTimer(time, delta) {
		if (!this.isTimerStop) {
			this.timer += delta / 1000;
			if (this.timer > this.stageData.clearTime) {
				const animal = this.stageData.animal;
				if (animal && !window.playerData.animals[animal]) {
					this.caughtAnimal = new CaughtAnimal(this, animal, this.game.config.width + 32, this.game.config.height/2);
					this.physics.add.overlap(this.player, this.caughtAnimal, this.collideObjects, null, this);
					this.isTimerStop = true;
				} else {
					this.gotoScene("ShootingPlayerSelect");
				}
			}
		}
	}

	stopTimer(target) {
		this.isTimerStop = true;
		this.timerStopTargets = [];
		target.children.forEach(child => this.timerStopTargets.push(child));
		this.timerStopTargets.push(target);
	}

	onDisappearEnemy(target) {
		if (this.isTimerStop) {
			this.timerStopTargets = this.timerStopTargets.filter(tr => tr !== target);
			if (this.timerStopTargets.length <= 0) {
				this.restartTimer();
			}
		}
	}

	restartTimer() {
		this.isTimerStop = false;
	}

	helpedAnimal() {
		window.playerData.animals[this.stageData.animal] = new AnimalParams(this.stageData.animal);
		window.talkAnimal = this.stageData.animal;
		window.talkType = "caught";
		this.save();
		this.gotoScene("Talk");
	}

	petSkillGaugeRatio() {
		return this.player.levels.pet / 3;
	}

	usePetSkill() {
		this.player.levels.pet -= 1;
		this.refreshPetSkill();
		this.animal.useSkill();
	}

	collideObjects(objA, objB) {
		if (objA.isHitValid(objB) && objB.isHitValid(objA)) {
			objA.onHit(objB);
			objB.onHit(objA);
		}
	}

	collideItem(player, item) {
		player.getItem(item);
		item.onHit(player);
		if (item.itemId === "pet") {
			this.refreshPetSkill();
		}
	}

	refreshPetSkill() {
		if (this.petSkillButton) {
			this.petSkillButton.setValid(this.player.levels.pet >= 1);
			this.petSkillGauge.refresh();
		}
	}

	gainRewards(target) {
		if (target.hasCoin > 0) {
			window.playerData.coin += target.hasCoin;
			this.coinText.setText(window.playerData.coin);
		}
	}

}

