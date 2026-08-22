'use strict'

import SceneBase from "../../../scenes/SceneBase.js";
import {SelectButton,TextButton} from "../../../ui/Button.js";
import {FileData, StageData} from '../../../Database.js';


export default class ShootingPlayerSelectScene extends SceneBase {
	constructor() {
		super({ key: 'ShootingPlayerSelect', active: false });
	}

	preload() {
		this.loadBackWhite();
		this.loadButtonFrame();

		this.load.image('left_arrow', FileData.images.left_arrow);
		this.load.image('hana', FileData.images['hana']);
		this.load.image('ningyo', FileData.images['ningyo']);
		this.load.image('tensi', FileData.images['tensi']);

		this.preloadStageImages();

	}

	preloadStageImages() {
		Object.values(StageData).forEach(stage => {
			this.load.image(stage.stageImage, FileData.images[stage.stageImage]);
		});
	}

	create() {
		this.createBackImage("backWhite");
		this.createPlayers();
		this.createStages();
		this.createArrowButtons();
		this.createDifficulty();
		this.createButtons();
		this.feedOutDisplay();

	}

	createPlayers() {
		const plx = this.game.config.width / 2, ply = 128;
		this.playerText = this.add.text(64, ply - 108, "プレイヤー", {fontFamily: "Arial", fontSize: 32, color:"pink"});
		this.players = {};
		this.players.hana   = new SelectButton(this, 'hana'  , 'hana'  , plx + -200, ply, 128, 128, this.selectPlayer.bind(this, 'hana'), this.players);
		this.players.ningyo = new SelectButton(this, 'ningyo', 'ningyo', plx       , ply, 128, 128, this.selectPlayer.bind(this, 'ningyo'), this.players);
		this.players.tensi  = new SelectButton(this, 'tensi' , 'tensi' , plx +  200, ply, 128, 128, this.selectPlayer.bind(this, 'tensi'), this.players);
		this.players[window.playerData.lastPlayer].select();
	}

	createStages() {
		const stx = this.game.config.width / 2 - 200, sty = 324;
		this.bossText = this.add.text(64, sty - 108, "ステージ", {fontFamily: "Arial", fontSize: 32, color:"pink"});
		this.stages = {};
		this.stages.hakase     = new SelectButton(this, 'hakase'      , 'hakase'      , 200 * 0, 0, 128, 128, this.selectStage.bind(this, 'hakase'), this.stages);
		this.stages.pikakuma   = new SelectButton(this, 'pikakuma'    , 'pikakuma'    , 200 * 1, 0, 128, 128, this.selectStage.bind(this, 'pikakuma'), this.stages);
		this.stages.musibaikin = new SelectButton(this, 'musibaikin'  , 'musibaikin'  , 200 * 2, 0, 128, 128, this.selectStage.bind(this, 'musibaikin'), this.stages);
		this.stages.miminzuku  = new SelectButton(this, 'miminzuku'   , 'miminzuku'   , 200 * 0, 0, 128, 128, this.selectStage.bind(this, 'miminzuku'), this.stages);
		this.stages.gorori     = new SelectButton(this, 'gorori'      , 'gorori'      , 200 * 1, 0, 128, 128, this.selectStage.bind(this, 'gorori'), this.stages);
		this.stages.zombie     = new SelectButton(this, 'zombie'      , 'zombie'      , 200 * 2, 0, 128, 128, this.selectStage.bind(this, 'zombie'), this.stages);
		this.stages.majo1      = new SelectButton(this, 'majo2_pet'       , 'majo1'       , 200 * 0, 0, 128, 128, this.selectStage.bind(this, 'majo1'), this.stages);
		this.stages.bossTest     = new SelectButton(this, 'zombie'      , 'bossTest'      , 200 * 2, 0, 128, 128, this.selectStage.bind(this, 'bossTest'), this.stages);
		this.stageKeys = Object.keys(this.stages);
		this.stageNum = this.stageKeys.length;

		this.stageContainers = [];
		for (let i=0; i<=this.calcMaxStagePage(); i++) {
			this.stageContainers[i] = this.add.container(stx, sty);
			for (let j=0; j<3; j++) {
				if (this.stageKeys[i*3 + j]) {
					this.stageContainers[i].add(this.stages[this.stageKeys[i*3 + j]]);
				}
			}
		}
		this.stagePage = Math.floor(this.stageKeys.indexOf(window.playerData.lastStage) / 3);
		this.setStagePage();
		this.stages[window.playerData.lastStage].select();

	}

	createArrowButtons() {
		const btx = 100, bty = 324;
		this.prevPageButton = this.add.image(btx, bty, "left_arrow").setInteractive()
			.on("pointerup", this.prevStagePage.bind(this))
			.on("pointerover", () => this.prevPageButton.setTint(0xddaaaa))
			.on("pointerout", () => this.prevPageButton.clearTint());
		this.nextPageButton = this.add.image(this.game.config.width - btx, bty, "left_arrow")
			.setAngle(180).setInteractive()
			.on("pointerup", this.nextStagePage.bind(this))
			.on("pointerover", () => this.nextPageButton.setTint(0xddaaaa))
			.on("pointerout", () => this.nextPageButton.clearTint());
	}

	createDifficulty() {
		const buttonFrameKey = "buttonFrame";
		const sty = 324;
		this.difs = {};
		this.difs.easy = new TextButton(this, this.game.config.width - 360, sty - 96, "かんたん", buttonFrameKey, this.setDifficulty.bind(this, "easy"), {radioGroup:this.difs});
		this.difs.normal = new TextButton(this, this.game.config.width - 230, sty - 96, "ふつう", buttonFrameKey, this.setDifficulty.bind(this, "normal"), {radioGroup:this.difs});
		this.difs.hard = new TextButton(this, this.game.config.width - 100, sty - 96, "むずい", buttonFrameKey, this.setDifficulty.bind(this, "hard"), {radioGroup:this.difs});
		if (this.difs[window.playerData.dif]) {
			this.difs[window.playerData.dif].select();
		} else {
			window.playerData.dif = "normal";
			this.difs[window.playerData.dif].select();
		}
	}

	createButtons() {
		const buttonFrameKey = "buttonFrame";
		const btnX = this.game.config.width / 2, btnY = 432;
		this.buttons = {
			retry: new TextButton(this, btnX - 128, btnY   , "はじめる", buttonFrameKey, this.gotoScene.bind(this,"ShootingGame")),
			title : new TextButton(this, btnX + 128, btnY   , "もどる", buttonFrameKey, this.gotoScene.bind(this, "Home")),
		};
	}

	update() {

	}

	selectPlayer(key) {
		window.selectPlayer = key;
		window.playerData.lastPlayer = key;
		/*
		Object.keys(this.players).forEach(objkey => {
			if (key !== objkey) this.players[objkey].unselect();
		});
		*/
	}

	prevStagePage() {
		this.stagePage--;
		if (this.stagePage < 0) {
			this.stagePage = this.calcMaxStagePage();
		}
		this.setStagePage();
	}

	nextStagePage() {
		this.stagePage++;
		if (this.stagePage > this.calcMaxStagePage()) {
			this.stagePage = 0;
		}
		this.setStagePage();
	}

	setStagePage(page) {
		this.stageContainers.forEach((con, i) => {
			if (i !== this.stagePage) con.setVisible(false);
			else con.setVisible(true);
		});
	}

	calcMaxStagePage() {
		return Math.floor((this.stageNum-1) / 3);
	}


	selectStage(key) {
		window.selectStage = key;
		window.playerData.lastStage = key;
	}

	setDifficulty(dif) {
		window.playerData.dif = dif;
	}


	gotoScene(name) {
		this.save();
		super.gotoScene(name);
	}
}

