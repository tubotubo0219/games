'use strict'

import SceneBase from "./SceneBase.js";
import { SelectButton, TextButton } from "../ui/Button.js";
import { SelectGameData } from "../Database.js";

export default class GameSelectScene extends SceneBase {
	constructor() {
		super({ key: 'GameSelect', active: false });
	}

	preload() {
		this.loadBackWhite();
		this.loadButtonFrame();
		Object.values(SelectGameData).forEach(data => {
			this.load.image(data.imageKey, data.imageDir);
		});
	}

	create() {
		this.createBackImage();
		const buttonFrameKey = 'buttonFrame';
		this.buttons = {};
		const w = 860, h = 480;
		const ox = w / 3, oy = h / 3;
		const sx = 320, sy = 128;
		Object.keys(SelectGameData).forEach((key, i) => {
			const data = SelectGameData[key];
			this.buttons[key] = new SelectButton(this, data.imageKey, key, sx + (i%2) * ox, sy + Math.floor(i/2) * oy, w+32, h+32,
				this.selectGame.bind(this, key), this.buttons).setScale(0.3);
			if (data.text) {
				this.buttons[key].add(this.createText(0, 0, data.text, 160).setOrigin(0.5, 0.5));
			}
		});
		this.startButton = new TextButton(this, 96, h - 128, "はじめる", buttonFrameKey, () => { this.gotoScene(this.selectGameScene) });
		this.returnButton = new TextButton(this, 96, 64, "もどる", buttonFrameKey, this.returnScene.bind(this, false));
		this.buttons.shooting.select();
		this.feedOutDisplay();
	}

	selectGame(key) {
		this.selectGameScene = SelectGameData[key].scene;
	}

}

