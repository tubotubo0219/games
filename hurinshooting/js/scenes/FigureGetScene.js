'use strict'

import SceneBase from "./SceneBase.js";
import {FileData, CharacterData, DressupData} from "../Database.js";
import {TextButton} from "../ui/Button.js";


export default class FigureGetScene extends SceneBase {
	constructor() {
		super({ key: 'FigureGet', active: false });
	}

	preload() {
		const keys = {};
		if (window.gachaMode === "accessories") {
			keys.capsuleB = "capsule_acc_b";
			this.playerItems = window.playerData.accessories;
		} else {
			keys.capsuleB = "capsule_b";
			this.playerItems = window.playerData.figures;
		}
		this.imageKeys = keys;
		if (window.flags.isFigureGetMode) {
			this.load.image("capsule_t", FileData.images.capsule_t);
			this.load.image(keys.capsuleB, FileData.images.capsule_b);
		}

		this.loadBackWhite();
		this.loadButtonFrame();

		if (window.gachaMode === "accessories") {
			this.accData = DressupData[window.getItemKey];
			this.accKey = this.accData.key;
			this.load.image(this.accKey, FileData.images[this.accKey]);
		} else {
			this.charaData = CharacterData[window.getItemKey];
			this.figureKey = this.charaData.key;
			this.load.image(this.figureKey, FileData.images[this.figureKey]);
			this.load.image('figure_stand', FileData.images.figure_stand);
		}
	}

	create() {
		this.backImage = this.add.image(0, 0, 'backWhite').setOrigin(0, 0).setInteractive();

		const centerX = this.game.config.width/2;
		const centerY = this.game.config.height/2;

		if (window.flags.isFigureGetMode) {
			const capX = centerX - 167;
			this.capsule_t = this.add.image(capX, centerY, "capsule_t").setOrigin(0, 0.9).setDepth(1);
			this.capsule_b = this.add.image(capX, centerY, this.imageKeys.capsuleB).setOrigin(0, 0).setDepth(1);
			this.newText = this.add.text(320, 32, "ＮＥＷ", {fontFamily:"メイリオ", fontSize:32, color:"#dd4", fontStyle:"bold"}).setVisible(false);
		}
		if (window.gachaMode === "accessories") {
			const scale = this.accData.gachaScale || 0.6;
			this.figureImage = this.add.image(centerX, centerY + 48 + (this.accData.gachaY || 0), this.accKey).setOrigin(0.5, 0.9).setScale(scale);
			this.nameText = this.add.text(320, 72, this.accData.name, {fontFamily:"メイリオ", fontSize:32, color:"#963", fontStyle:"bold"}).setVisible(false);
			this.infoText = this.add.text(320, 128, this.accData.info || "", {fontFamily:"メイリオ", fontSize:28, color:"#421"}).setVisible(false);
		} else {
			this.figureStand = this.add.image(centerX, centerY + 48, "figure_stand").setOrigin(0.5, 0.5).setScale(0.5);
			const scale = 1.5 * (this.charaData.figureScale || 1);
			this.figureImage = this.add.image(centerX, centerY + 48 + (this.charaData.figureY || 0), this.figureKey).setOrigin(0.5, 0.9).setScale(scale);
			if (this.charaData.tint) this.figureImage.setTint(this.charaData.tint);
			this.nameText = this.add.text(320, 72, this.charaData.name, {fontFamily:"メイリオ", fontSize:32, color:"#963", fontStyle:"bold"}).setVisible(false);
			this.infoText = this.add.text(320, 128, this.charaData.info || "", {fontFamily:"メイリオ", fontSize:28, color:"#421"}).setVisible(false);
		}


		const btnX = 96, btnY = 64;
		const buttonFrameKey = 'buttonFrame';
		this.buttons = {
			return : new TextButton(this, btnX, btnY + 56 * 0, "もどる", buttonFrameKey, this.returnScene.bind(this, false)),
		};

		this.centerX = centerX;
		this.centerY = centerY;

		this.openCapsule();
	}

	update() {

	}

	openCapsule() {
		let delay = 500;
		if (window.flags.isFigureGetMode) {
			this.tweens.add({
				targets: this.capsule_t,
				delay:delay,
				duration:120,
				completeDelay:120,
				y: this.capsule_t.y - 160,
			});
			this.tweens.add({
				targets: this.capsule_b,
				delay:delay,
				duration:120,
				completeDelay:120,
				y: this.capsule_t.y + 160,
			});
			delay = 700;
			this.tweens.add({
				targets: this.capsule_t,
				delay:delay,
				duration:600,
				completeDelay:600,
				alpha: 0,
			});
			this.tweens.add({
				targets: this.capsule_b,
				delay:delay,
				duration:600,
				completeDelay:600,
				alpha: 0,
			});
			delay = 1000;
		}
		if (this.figureStand) {
			this.tweens.add({
				targets: this.figureStand,
				delay:delay,
				duration:600,
				completeDelay:600,
				x: this.figureStand.x - 240,
			});
		}
		this.tweens.add({
			targets: this.figureImage,
			delay:delay,
			duration:600,
			completeDelay:600,
			x: this.figureImage.x - 240,
		});
		
		delay += 600;
		this.time.addEvent({
			delay:delay,
			callback: () => {
				this.nameText.setVisible(true);
				this.infoText.setVisible(true);
				if (window.flags.isFigureGetMode && this.playerItems[window.getItemKey] === 1)
					this.newText.setVisible(true);  
			}
		});

	}

}

export class Test_FigureGetScene extends SceneBase {
	constructor() {
		super({ key: 'Test_FigureGet', active: false });
	}

	preload ()
	{
		this.load.html('inputform', './forms/inputText.html');
		this.load.image('pic', './img/backs/white.png');
	}
	
	create ()
	{
		this.add.image(0, 0, 'pic').setOrigin(0,0);
		var element = this.add.dom(0, 0).createFromCache('inputform');
		element.setPerspective(800);
		element.x = 300;
		element.y = 300;
	
		element.addListener('click');
	
		element.on('click', function (event) {
	
			if (event.target.name === 'sendText')
			{
				var inputText = this.getChildByName('inputText');
	
				if (inputText.value !== '')
				{
					//  Turn off the click events
					this.removeListener('click');
					window.isFigureGetMode = false;
					window.getItemKey = inputText.value;
					this.scene.gotoScene("FigureGet", false);
				}
				else
				{
				}
			}
	
		});

	}
}