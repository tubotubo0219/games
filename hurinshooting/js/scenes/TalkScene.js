'use strict'

import SceneBase from "./SceneBase.js";
import {AnimalData,FileData} from '../Database.js';
import {CareAnimal, CareAnimalWithLayers} from "../objects/CareAnimal.js";

export default class TalkScene extends SceneBase {
	constructor() {
		super({ key: 'Talk', active: false });
	}

	preload() {
		this.loadBackWhite();
		this.load.image('talkWindow', 'img/system/window_talk.png');
		const growth = window.playerData.animals[window.talkAnimal].growth;
		this.talkData = AnimalData[window.talkAnimal].talk[growth];
		if (this.talkData.voices) {
			this.voiceKey = this.talkData.voices[window.talkType];
			if (this.voiceKey) {
				this.voiceData = FileData.audios[this.voiceKey];
				this.load.audio(this.voiceKey, this.voiceData.dir);
			}
		}
		this.animalName = AnimalData[window.talkAnimal].name;

		this.imageKey = this.talkData.keyReplace[window.talkType] || window.talkType;
		if (this.talkData.layers) {
			const layerKeys = Object.keys(this.talkData.layers);
			this.aniKeys = {};
			this.talkData.layers.base.forEach(lkey => {
				this.aniKeys[lkey] = this.talkData.keyHeader;
				this.load.image(this.aniKeys[lkey], this.talkData.keyDir + lkey + this.talkData.fileType);
			});
			this.talkData.layers[this.imageKey].forEach(lkey => {
				this.aniKeys[lkey] = this.talkData.keyHeader + lkey;
				this.load.image(this.aniKeys[lkey], this.talkData.keyDir + lkey + this.talkData.fileType);
			});
		} else {
			this.aniKeys = {};
			this.aniKeys[this.imageKey] = this.talkData.keyHeader + this.imageKey,
			this.load.image(this.aniKeys[this.imageKey], this.talkData.keyDir + this.imageKey + this.talkData.fileType);
		}
	}

	create() {
		this.talkPage = -1;
		this.backImage = this.add.image(0, 0, 'backWhite').setOrigin(0, 0).setInteractive();
		this.backImage.on('pointerdown', this.nextPage.bind(this));

		if (this.voiceKey) {
			const voice = this.sound.add(this.voiceKey, { volume: this.voiceData.volume, loop: false }).play();
		}

		if (this.talkData.layers) {
			this.animalImage = new CareAnimalWithLayers(this, window.talkAnimal, this.aniKeys);
		} else {
			this.animalImage = new CareAnimal(this, window.talkAnimal, this.aniKeys);
		}
		this.animalImage.changeImage(this.imageKey);

		//this.animal = this.add.image(this.game.config.width / 2, 0, this.animalImageKey).setOrigin(0.5, 0);

		this.talkWindow = this.add.image(33, 353, 'talkWindow').setOrigin(0, 0);
		this.talkText = this.add.text(56, 372, "", { fontFamily:"Arial", fontSize: '32px', color: '#ff6644' }).setOrigin(0, 0);
		this.nextPage();
		this.feedOutDisplay();
	}

	update() {
	}

	nextPage() {
		this.talkPage++;
		const text = this.talkData.talks[window.talkType][this.talkPage];
		if (text) {
			this.talkText.setText(this.animalName + text);
		} else {
			this.gotoHome();
		}
	}

	gotoHome() {
		//this.game.sound.stopAll();
		this.gotoScene('Home', false);
	}
}

