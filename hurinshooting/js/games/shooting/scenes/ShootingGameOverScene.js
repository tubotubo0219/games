'use strict'

import SceneBase from "../../../scenes/SceneBase.js";
import {TextButton} from "../../../ui/Button.js";

export default class ShootingGameOverScene extends SceneBase {
	constructor() {
		super({ key: 'ShootingGameOver', active: false });
	}

	preload() {
		this.load.image('gameoverBack', 'img/backs/gameover.png');
		this.load.image('buttonFrame', 'img/system/button_f.png');
	}

	create() {
		this.save();
		this.backImage = this.add.image(0, 0, 'gameoverBack').setOrigin(0, 0);
		const btnX = this.game.config.width / 2;
		const btnY = 360;
		const buttonFrameKey = 'buttonFrame';
		this.buttons = {
			retry: new TextButton(this, btnX - 128, btnY   , "もういちど", buttonFrameKey, this.gotoScene.bind(this, "ShootingGame", true)),
			home : new TextButton(this, btnX + 128, btnY   , "やめる", buttonFrameKey, this.gotoScene.bind(this, "Home", true)),
		};
		this.feedOutDisplay();
	}

}

