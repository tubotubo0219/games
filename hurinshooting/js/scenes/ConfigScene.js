'use strict'

import SceneBase from "./SceneBase.js";
import {TextButton} from "../ui/Button.js";
import {FileData} from "../Database.js";

export default class ConfigScene extends SceneBase {
	constructor() {
		super({ key: 'Config', active: false });
	}

	preload() {
		this.loadBackWhite();
		this.loadButtonFrame();
	}

	create() {
		this.configBack = this.add.image(0, 0, 'backWhite').setOrigin(0, 0).setInteractive();

		const btnX = 96, btnY = 64;
		const buttonFrameKey = 'buttonFrame';
		this.buttons = {
			return : new TextButton(this, btnX, btnY + 56 * 0, "もどる", buttonFrameKey, this.gotoScene.bind(this, "Home", false)),
		};

		const recX = 240, recY = 96;
		this.rects = {
			control: this.add.rectangle(recX, recY + 64 * 0, 440, 60).setFillStyle(0xffeedd).setOrigin(0, 0.5),
		};

		const txtX = recX+40, txtY = 96;
		this.configTexts = {
			control: this.add.text(txtX, txtY + 64 * 0, "そうさ", {fontFamily:"メイリオ", fontSize:28, color:"#666"}).setOrigin(0,0.5),
		};
		const cbX = txtX + 280, rcbX = 720, cbY = 96;
		this.configButtons = {
			control  : new TextButton(this, cbX, cbY + 64 * 0, "", "buttonFrame", this.switchControl.bind(this)),
			gotoTitle: new TextButton(this, cbX, cbY + 64 * 5, "タイトルへ", "buttonFrame", this.gotoScene.bind(this, "Title")),
		};
		this.configButtons.control.setText(window.playerData.config.control === "swipe" ? "スワイプ" : "タップ");
	}

	switchControl() {
		window.playerData.config.control = window.playerData.config.control === "swipe" ? "tap" : "swipe";
		this.configButtons.control.setText(window.playerData.config.control === "swipe" ? "スワイプ" : "タップ");
	}
}

