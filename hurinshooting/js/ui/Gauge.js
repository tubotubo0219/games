/**
 * オブジェクト基本クラス
 */
export default class Gauge extends Phaser.GameObjects.Container {
    constructor(scene, x, y, frameKey, fillKey, ratioFunc, options) {
        super(scene, x, y);

        this.ratioFunc = ratioFunc;
        this.frame = this.scene.add.image(0, 0, frameKey).setOrigin(0, 0);
        this.fill = this.scene.add.image(0, 0, fillKey).setOrigin(0, 0);
        this.add(this.frame);
        this.add(this.fill);
    
        if (options) {
            if (options.fillColor) this.fill.setTint(options.fillColor);
            if (options.fillAlpha) this.fill.setAlpha(options.fillAlpha);
        }

        scene.add.existing(this);
    }

    refresh() {
        const ratio = this.ratioFunc();
        this.fill.setCrop(0, 0, this.fill.width * ratio, this.fill.height);
    }

}

