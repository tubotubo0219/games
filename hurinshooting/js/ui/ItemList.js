/**
 * オブジェクト基本クラス
 */
export default class ItemList extends Phaser.GameObjects.Container {
    constructor(scene, x, y, w, h, callback) {
        super(scene, x, y);
        this.onDownCallback = callback;
        this.playerId = playerId;
        this.scene = scene;
        this.scene.add.existing(this);
        this.setSize(w, h);

        this.container = scene.add.rectangle(0, 0, w, h);
        this.container.setStrokeStyle(1, 0xffffff).setOrigin(0.5, 0.5);

        this.image = this.scene.add.image(x, y, key);
        this.add(this.container, this.image);
    }

    addItem() {
        
    }
}

class UiItem extends Phaser.GameObjects.Container {

}