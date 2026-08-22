'use strict'

import SceneBase from "../../../scenes/SceneBase.js";
import {TextButton} from "../../../ui/Button.js";

export default class Act2dTitleScene extends SceneBase {
	constructor() {
		super({ key: 'Act2dTitle', active: false });
	}

	preload() {
		this.preloadAudio("shop");
		this.loadBackWhite();
		this.loadButtonFrame();
	}

	create() {
		if (!window.playerData) {
			this.loadData("test");
		}

		this.createBackImage("backWhite");
		const {width, height} = this.game.config;
		const btnX = width / 2;
		const btnY = 360;
		const buttonFrameKey = 'buttonFrame';
		this.createText(width / 2, 160, "アクション（仮）", 64).setOrigin(0.5, 0);
		this.buttons = {
			retry: new TextButton(this, btnX - 128, btnY   , "はじめる", buttonFrameKey, this.gotoScene.bind(this,"Act2dGame")),
			home : new TextButton(this, btnX + 128, btnY   , "やめる", buttonFrameKey, this.gotoScene.bind(this,"Home")),
		};
		this.load.audio("myhome", "audio/bgm/myhome.mp3");
		this.feedOutDisplay();
	}

}

