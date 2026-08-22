import ObjectBase from './ObjectBase.js';
import {AnimalData} from '../../../Database.js';

/**
 * 仲間動物クラス
 */
export default class CaughtAnimal extends ObjectBase {
    constructor(scene, animalId, x, y) {
        const objdata = AnimalData[animalId].caught;
        super(scene, x, y, objdata.w, objdata.h, 100, objdata.key, "CaughtAnimal");
        this.scene.add.existing(this);
        this.setScale(objdata.scale);
        this.radius = objdata.radius;
        this.setCollision(this.radius);
        this.scene.add.existing(this);
        this.body.velocity.x = -100;
    }

    update(time, delta) {
        if (this.x <= this.scene.game.config.width / 2) {
            this.body.velocity.x = 0;
        }
    }

    onHit(target) {
        this.scene.helpedAnimal();
    }

}
