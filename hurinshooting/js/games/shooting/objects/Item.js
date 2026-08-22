import ObjectBase from './ObjectBase.js';
import {ItemData} from '../../../Database.js';

/**
 * アイテムクラス
 */
const RandItems = ["skill", "rapid", "rapid", "rapid", "pet", "pet"];
export default class Item extends ObjectBase {
	constructor(scene, itemId, dropObj) {
        if (itemId === "rand") {
            itemId = RandItems[Phaser.Math.Between(0, RandItems.length-1)];
        }
        const objdata = ItemData[itemId];
		super(scene, dropObj.x, dropObj.y, 64, 64, 100, objdata.key, "Item");
        this.setCollision(30);
        this.scene.add.existing(this);
        this.count = 0;
        this.itemId = itemId;
	}

    startDeadAction() {
        this.destroy();
    }

    onHit(target) {
        this.destroy();
    }

    update(time, delta) {
        this.body.velocity.x = -this.speed;
        this.count += delta;
        if (this.count > 1000) {
            if (this.scene.game.config.width + 64 < this.x || -64 > this.x ||
                this.scene.game.config.height + 64 < this.y || -64 > this.y) {
                    this.destroy();
            }
            this.count = 0;
        }
    }
}
