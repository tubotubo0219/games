'use strict'

import {AnimalData, DressupData} from '../Database.js';

/**
 * お世話動物クラス
 */
export class CareAnimal extends Phaser.GameObjects.Container {
    constructor(scene, animalId, keys) {
        const params = window.playerData.animals[window.talkAnimal];
        const talkData = AnimalData[params.id].talk[params.growth];
        const offset = talkData.offset;
        const centerX = scene.game.config.width / 2;
        const centerY = scene.game.config.height / 2;
        super(scene, centerX + offset[0], centerY - 32 + offset[1]);
        this.growth = params.growth;
        this.scene.add.existing(this);
        this.animalId = animalId;
        this.keys = keys;
        this.images = {};
        this.params = params;
        this.talkData = talkData;
        Object.keys(this.keys).forEach(key => {
			this.images[key] = scene.add.image(
                0, 0, this.keys[key]
            ).setOrigin(0.5, 0.5).setVisible(false);
            this.add(this.images[key]);
        });
        this.showImage = "";
    }

    changeImage(key) {
        if (this.showImage) {
			this.hideImage();
        }
        if (this.talkData.keyReplace[key]) {
            key = this.talkData.keyReplace[key];
        }
        this.showImage = this.images[key];
        this.showImage.setVisible(true);
        return this;
    }

    hideImage() {
        if (this.showImage) {
            this.setScale(1);
            this.showImage.off("pointermove");
            this.showImage.removeInteractive();
            this.showImage.setVisible(false);
        }
    }

    setDressup(dressupDataArray) {
        //this.dressupImages = this.scene.add.container(0, 0);
        //this.add(this.dressupImages);
        this.dressupImages = [];
        dressupDataArray.forEach(data => {
            const img = this.scene.add.image(data[1], data[2], DressupData[data[0]].key)
                .setScale(data[3]).setAngle(data[4]).setDepth(data[5]).setFlipX(data[6]);
            this.add(img);
            this.dressupImages.push(img);
        });
        this.list.sort((a,b) => a.depth - b.depth);
    }

    hideDressup() {
        //this.dressupImages.setVisible(false);
        this.dressupImages.forEach(img => img.setVisible(false));
    }

    showDressup() {
        //this.dressupImages.setVisible(true);
        this.dressupImages.forEach(img => img.setVisible(true));
    }

    removeDressup() {
        //this.dressupImages.destroy();
        this.dressupImages.forEach(img => img.destroy());
    }

    setPointerMove(callback) {
        const img = this.showImage;
        img.setInteractive(new Phaser.Geom.Circle(img.width/2, img.height/2, this.talkData.touchRadius), Phaser.Geom.Circle.Contains);
        img.on("pointermove", callback);
    }

    setFood() {
        if (this.params.foods <= 40) {
            this.changeImage("hangly");
        } else {
            this.changeImage("normal");
        }
    }

    setBath() {
		if (this.params.bath <= 40) {
            this.changeImage("yogore");
		} else {
            this.changeImage("normal");
		}
		this.setScale(0.8);
    }

    setNade() {
		if (this.params.goods <= 40) {
            this.changeImage("samisi");
		} else {
            this.changeImage("normal");
		}
    }

    setEatEvent(callback) {
        this.eatTimerEvent = this.scene.time.addEvent({
            delay: this.talkData.eatSpeed,
            repeat: this.talkData.eatFrames.length - 1,
            callback: callback
        });
    }
}

export class CareAnimalWithLayers extends CareAnimal {
    constructor(scene, animalId, keys) {
        super(scene, animalId, keys);
        this.showImage = this.images.base.setVisible(true);
        this.layerImages = [];
    }

    changeImage(key, isHide = true) {
        this.layerImages.forEach(img => {
            img.setVisible(false);
        });
        if (this.talkData.keyReplace[key]) {
            key = this.talkData.keyReplace[key];
        }
        if (isHide) this.hideImage();
        this.layerImages = this.talkData.layers[key].map(lkey => this.images[lkey].setVisible(true));
        return this;
    }

    hideImage() {
        this.setScale(1);
        this.showImage.off("pointermove");
        this.showImage.removeInteractive();
    }
}