'use strict'

import {FileData} from "../Database.js";
import {AnimalParamUtil} from '../games/shooting/objects/Animal.js';
import {DataUtil} from '../DataUtil.js';
import {PlayerData} from "../Database.js";

export default class SceneBase extends Phaser.Scene {

    preloadAudio(key) {
        this.load.audio(FileData.audios[key].key, FileData.audios[key].dir);
    }

    loadBackWhite() {
		this.load.image('backWhite', FileData.images.backWhite);
    }

    loadButtonFrame() {
		this.load.image('buttonFrame', FileData.images.buttonFrame);
    }

    loadDatabaseImage(key) {
        this.load.image(key, FileData.images[key]);
    }

    playBGM(key, forcePlayTimeZero = false) {
        const data = FileData.audios[key];
        let audio = window.audio[data.key];
		if (!audio) {
            audio = this.sound.add(data.key, { volume: data.volume, loop: true });
			window.audio[data.key] = audio;
		}
		if (forcePlayTimeZero || audio.playTime === 0) audio.play();
    }

    playSE(key) {
        const data = FileData.audios[key];
        let audio = window.audio[data.key];
		if (!audio) {
            audio = this.sound.add(data.key, { volume: data.volume, loop: false });
			window.audio[data.key] = audio;
		}
        audio.play();
    }

    createBackImage(imageKey = "backWhite") {
		this.backImage = this.add.image(0, 0, imageKey).setOrigin(0, 0).setDepth(-5);
    }

    createText(x, y, text, size, options) {
        if (!options) options = {};
        options.fontFamily ||= "メイリオ";
        options.color ||= "#c76";
        options.fontSize = options.fontSize || size || 24;
        return this.add.text(x, y, text, options);
    }

    feedOutDisplay() {
        if (!window.isThroughFeed) {
            const {width, height} = this.game.config;
            this.feedGraph = this.add.rectangle(0, 0, width, height).setFillStyle(this.game.config.backgroundColor.color).setOrigin(0, 0);
            this.tweens.add({
                targets: this.feedGraph,
                duration: 100,
                alpha: 0,
            });
        }
        window.isThroughFeed = false;
    }

    gotoScene(name, isStopBgm = true, isFeed = true) {
        if (this.feedGraph && isFeed) {
            this.tweens.add({
                targets: this.feedGraph,
                duration: 100,
                alpha: 1,
                onComplete: this.gotoSceneProc.bind(this, name, isStopBgm)
            })
        } else {
            window.isThroughFeed = true;
            this.gotoSceneProc(name, isStopBgm);
        }
    }

    gotoSceneProc(name, isStopBgm) {
        if (this.scene.key !== name) {
            window.sceneHistory.push(this.scene.key);
        }
		if (isStopBgm) this.game.sound.stopAll();
		this.scene.start(name);
    }

    returnScene(isStopBgm  = true) {
        const name = window.sceneHistory.pop();
        if (this.feedGraph) {
            this.tweens.add({
                targets: this.feedGraph,
                duration: 200,
                alpha: 1,
                onComplete: () => {
                    if (isStopBgm) this.game.sound.stopAll();
                    this.scene.start(name);
                }
            })
        } else {
            if (isStopBgm) this.game.sound.stopAll();
            this.scene.start(name);
        }
    }

    save() {
		const str = JSON.stringify(window.playerData);
		localStorage.setItem(window.saveDataName, str);
	}

	loadData(dataName) {
		window.saveDataName = dataName;
		const str = localStorage.getItem(dataName);
		if (str) {
			window.playerData = DataUtil.AssignData(new PlayerData(), JSON.parse(str));
			AnimalParamUtil.checkValues(window.playerData.animals);
		} else {
			window.playerData = new PlayerData();
		}
	}
}
