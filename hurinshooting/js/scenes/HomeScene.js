'use strict'

import SceneBase from "./SceneBase.js";
import {TextButton,SelectButton,ImageButton} from "../ui/Button.js";
import Gauge from "../ui/Gauge.js";
import {AnimalParams, AnimalParamUtil} from '../games/shooting/objects/Animal.js';
import {AnimalData,FileData, PlayerData} from '../Database.js';


export default class HomeScene extends SceneBase {
	constructor() {
		super({ key: 'Home', active: false });
	}

	preload() {
		this.loadBackWhite();
		this.loadButtonFrame();
		this.load.image('config', FileData.images.config);

		this.load.image('gauge_frame', FileData.images.gauge_frame);
		this.load.image('gauge_fill', FileData.images.gauge_fill);
		this.load.image('board', FileData.images.board);

		this.load.image("checkBox", FileData.images.checkBox);
		this.load.image("checkMark", FileData.images.checkMark);

		this.load.image("icon_frame", FileData.images.icon_frame);
		this.load.image("icon_goout", FileData.images.icon_goout);
		this.load.image("icon_shop", FileData.images.icon_shop);
		this.load.image("icon_osewa", FileData.images.icon_osewa);

		const animalKeys = Object.keys(window.playerData.animals);
		this.animalImageKeys = {};
		animalKeys.forEach(ani => {
			const animalParams = window.playerData.animals[ani];
			const talkData = AnimalData[ani].talk[animalParams.growth];
			const keyDir = talkData.keyDir;
			const fileType = talkData.fileType;
			const imgKey = talkData.keyHeader + "icon";
			this.animalImageKeys[ani] = imgKey;
			this.load.image(imgKey, keyDir + "icon" + fileType);
			if (animalParams.growth >= 2) {
				this.load.image(AnimalData[ani].pet.key, FileData.images[AnimalData[ani].pet.key]);
			}
		});
		//this.load.image("usagi02_normal", "./img/animals/usagi02/normal.png");

		this.preloadAudio("afternoon");

	}

	create() {
		this.playBGM("afternoon");

		this.backImage = this.add.image(0, 0, 'backWhite').setOrigin(0, 0);
		this.elapseTime();
		this.createMenuButtons();
		this.createParametersBoard();
		this.createAnimalButtons();
		this.createTakePetButtons();
		this.feedOutDisplay();

		// テスト用表示
		//this.add.image(160,100,"usagi02_normal").setScale(96/400, 96/400);
	}

	createMenuButtons() {
		const btnX = 80, btnY = 64;
		const buttonFrameKey = "buttonFrame";
		this.buttons = {
			osewa  : new ImageButton(this, btnX, btnY + 64 * 0, 64, 64, "icon_osewa", this.gotoScene.bind(this, "PetCare", false), {frame:{key:"icon_frame"}}),
			shop   : new ImageButton(this, btnX, btnY + 64 * 1, 64, 64, "icon_shop", this.gotoScene.bind(this, "Shop"), {frame:{key:"icon_frame"}}),
			odekake: new ImageButton(this, btnX, btnY + 64 * 2, 64, 64, "icon_goout", this.gotoScene.bind(this, "GameSelect", false), {frame:{key:"icon_frame"}}),
		};
		const configButton = new ImageButton(this, btnX, btnY + 64 * 3, 48, 48, "config", this.gotoScene.bind(this, "Config", false));

		if (window.debugMode) {
			this.buttons.grtest = new TextButton(this, btnX, btnY + 64 * 4, "選択動物を成長", buttonFrameKey, this.debugGrowth.bind(this));
			this.buttons.test   = new TextButton(this, btnX, btnY + 64 * 5, "色々入手", buttonFrameKey, this.debugGain.bind(this));
			this.buttons.reset  = new TextButton(this, btnX, btnY + 64 * 6, "リセット", buttonFrameKey, this.helpedReset.bind(this));
		}
	
	}

	createParametersBoard() {
		const gaugeX = 680, gaugeY = 96;
		this.board = this.add.image(gaugeX, gaugeY + 32, "board");
		this.board.scaleY = 0.75;
		this.nameText = this.add.text(gaugeX - 96, gaugeY - 42, "", {fontFamily:"メイリオ", fontSize:24, color:"#c63", fontStyle:"bold"});
		this.levelText = this.add.text(gaugeX, gaugeY - 42, "", {fontFamily:"メイリオ", fontSize:24, color:"#c63"});
		this.gaugeTexts = {
			foods: this.add.text(gaugeX - 96, gaugeY + 32 * 0, "まんぷく", {fontFamily:"メイリオ", fontSize:22, color:"#c76"}),
			bath: this.add.text(gaugeX - 96, gaugeY + 32 * 1, "せいけつ", {fontFamily:"メイリオ", fontSize:22, color:"#c76"}),
			goods: this.add.text(gaugeX - 96, gaugeY + 32 * 2, "なかよし", {fontFamily:"メイリオ", fontSize:22, color:"#c76"}),
			exp: this.add.text(gaugeX - 96, gaugeY + 32 * 3, "がんばり", {fontFamily:"メイリオ", fontSize:22, color:"#c76"}),
		};
		this.gauges = {
			foods: new Gauge(this, gaugeX, gaugeY - 4 + 32 * 0, "gauge_frame", "gauge_fill", AnimalParamUtil.foodsGaugeRatio.bind(AnimalParamUtil)),
			bath:  new Gauge(this, gaugeX, gaugeY - 4  + 32 * 1, "gauge_frame", "gauge_fill", AnimalParamUtil.bathGaugeRatio.bind(AnimalParamUtil)),
			goods: new Gauge(this, gaugeX, gaugeY - 4  + 32 * 2, "gauge_frame", "gauge_fill", AnimalParamUtil.goodsGaugeRatio.bind(AnimalParamUtil)),
			exp: new Gauge(this, gaugeX, gaugeY - 4  + 32 * 3, "gauge_frame", "gauge_fill", AnimalParamUtil.expGaugeRatio.bind(AnimalParamUtil)),
		};
	}

	createAnimalButtons() {
		this.animals = {};
		const animalKeys = Object.keys(window.playerData.animals);
		if (animalKeys.length == 0) {
			this.buttons.osewa.setValid(false);
		} else {
			const aniX = 260, aniY = 96;
			const row = 3;
			animalKeys.forEach((ani, i) => {
				this.animals[ani] = new SelectButton(this, this.animalImageKeys[ani], ani,
					aniX + 96 * (i%row), aniY + 96 * Math.floor(i/row), 96, 96, this.selectAnimal.bind(this, ani), this.animals);

			});
			if (window.talkAnimal && this.animals[window.talkAnimal]) {
				this.animals[window.talkAnimal].select();
			} else {
				this.animals[animalKeys[0]].select();
			}
		}
	}

	createTakePetButtons() {
		const enablePets = Object.values(window.playerData.animals).filter(ani => ani.growth >= 2);

		if (enablePets.length > 0) {
			this.petListContainer = this.add.container(600, 312);
			this.petList = {};
			enablePets.forEach((pet, i) => {
				this.petList[pet.id] = new SelectButton(this, AnimalData[pet.id].pet.key, pet.id,
					64 * (i%4), 64 * Math.floor(i/4), 64, 64, this.selectTakePet.bind(this, pet.id), this.petList);
				this.petListContainer.add(this.petList[pet.id]);
			});
			const len = enablePets.length;
			this.petList["none"] = new SelectButton(this, null, "none",
				64 * (len%4), 64 * Math.floor(len/4), 64, 64, this.selectTakePet.bind(this, "none"), this.petList);
			if (window.playerData.takePet && window.playerData.animals[window.playerData.takePet] &&
				window.playerData.animals[window.playerData.takePet].growth >= 2) {
				this.petList[window.playerData.takePet].select(null, false);
			} else {
				this.petList["none"].select(null, false);
				window.playerData.takePet = null;
			}
			this.petListContainer.add(this.petList["none"]);
			this.createText(560, 252, "おとも", 24);
		}
	}

	elapseTime() {
		const nowTime = Date.now();
		const elapse = nowTime - window.playerData.lastTime;
		const lose = elapse / 1000 / 60 / 12;
		window.playerData.lastTime = nowTime;
		Object.values(window.playerData.animals).forEach(params => AnimalParamUtil.loseParams(params, lose));
		this.save();
	}

	selectAnimal(animalId) {
		window.talkAnimal = animalId;
		this.nameText.setText(AnimalData[animalId].name);
		this.levelText.setText("  レベル " + window.playerData.animals[animalId].level)
		Object.keys(this.gauges).forEach(key => this.gauges[key].refresh());
	}

	selectTakePet(animalId) {
		if (animalId !== "none") {
			window.playerData.takePet = animalId;
		} else {
			window.playerData.takePet = null;
		}
		this.save();
	}

	debugGain() {
		Object.keys(AnimalData).forEach(id => {
			window.playerData.animals[id] ||= new AnimalParams(id);
			const food = AnimalData[id].talk[1].likeFood;
			window.playerData.items[food] ||= 0;
			window.playerData.items[food] += 10;
		});
		window.playerData.coin += 5000;
		this.save();
		this.gotoScene("Home", false, false);
	}

	debugGrowth() {
		this.debugGrowthProc(window.talkAnimal);
		this.save();
		window.talkType = "growth";
		this.gotoScene("Talk", false);
	}

	debugGrowthProc(animal) {
		window.playerData.animals[animal] ||= new AnimalParams(animal);
		window.playerData.animals[animal].level = 5;
		window.playerData.animals[animal].growth = 2;
	}

	helpedReset() {
		window.playerData = new PlayerData();
		this.save();
		this.gotoScene("Home", false, false);
	}

	foodsGaugeRatio() {
		const dat = window.playerData.animals[window.talkAnimal];
		return (dat.foods+20) / 120;
	}

	bathGaugeRatio() {
		const dat = window.playerData.animals[window.talkAnimal];
		return (dat.bath+20) / 120;
	}

	goodsGaugeRatio() {
		const dat = window.playerData.animals[window.talkAnimal];
		return (dat.goods+20) / 120;
	}

	expGaugeRatio() {
		const dat = window.playerData.animals[window.talkAnimal];
		const ratio = dat.exp / AnimalParamUtil.nextExp(dat);
		return ratio * 0.8 + 0.2;
	}

}

