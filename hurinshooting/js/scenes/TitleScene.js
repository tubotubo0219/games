'use strict'

import SceneBase from "./SceneBase.js";
import {TextButton, SelectButton} from "../ui/Button.js";


export default class TitleScene extends SceneBase {
	constructor() {
		super({ key: 'Title', active: false });
	}

	preload() {
		this.load.image('shootingTitle', 'img/backs/title.png');
		this.loadButtonFrame();
	}

	create() {
		this.createBackImage('shootingTitle');
		const btnX = this.game.config.width / 2;
		const btnY = 360;
		const buttonFrameKey = 'buttonFrame';
		const split = this.game.config.width / 5;
		this.buttons = {
			pld1: new TextButton(this, split * 1, btnY   , "データ１", buttonFrameKey, this.loadGame.bind(this, "pld1")),
			pld2: new TextButton(this, split * 2, btnY   , "データ２", buttonFrameKey, this.loadGame.bind(this, "pld2")),
			pld3: new TextButton(this, split * 3, btnY   , "データ３", buttonFrameKey, this.loadGame.bind(this, "pld3")),
			pld4: new TextButton(this, split * 4, btnY   , "データ４", buttonFrameKey, this.loadGame.bind(this, "pld4")),
			test: new TextButton(this, split * 1, btnY + 64   , "テストデータ", buttonFrameKey, this.loadGame.bind(this, "test")),
		};
		this.feedOutDisplay();
		this.convertOldData();

	}

	convertOldData() {
		const str = localStorage.getItem("pld");
		if (str) {
			localStorage.setItem("pld1", str);
			localStorage.removeItem("pld");
		}
	}

	loadGame(dataName) {
		this.loadData(dataName);
		window.debugMode = dataName === "test";
		this.gotoScene("Home");
	}
}

