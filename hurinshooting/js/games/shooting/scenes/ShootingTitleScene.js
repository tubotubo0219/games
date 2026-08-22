'use strict'

import SceneBase from "../../../scenes/SceneBase.js";
import {TextButton} from "../../../ui/Button.js";
import {FileData} from "../../../Database.js";

export default class ShootingTitleScene extends SceneBase {
	constructor() {
		super({ key: 'ShootingTitle', active: false });
	}

	preload() {
		this.load.image('shootingTitle', 'img/backs/title.png');
		this.loadButtonFrame();
	}

	create() {
		this.title = this.add.image(0, 0, 'shootingTitle').setOrigin(0, 0).setInteractive();
		/*
		this.title.on('pointerdown', () => {
            this.game.sound.stopAll();
            this.scene.start('PlayerSelect');
        });
		*/
		const btnX = this.game.config.width / 2;
		const btnY = 360;
		const buttonFrameKey = 'buttonFrame';
		this.buttons = {
			retry: new TextButton(this, btnX - 128, btnY   , "はじめる", buttonFrameKey, this.gotoScene.bind(this,"ShootingPlayerSelect")),
			home : new TextButton(this, btnX + 128, btnY   , "やめる", buttonFrameKey, this.gotoScene.bind(this,"Home")),
		};
		this.load.audio("myhome", "audio/bgm/myhome.mp3");
		this.feedOutDisplay();
	}

}

