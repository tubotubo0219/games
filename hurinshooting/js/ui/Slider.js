/**
 * オブジェクト基本クラス
 */
export default class Slider extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, value, onChangeCallback = null) {
        super(scene, x, y);
        this.scene.add.existing(this);
        this.width = width;
        this.value = value;
        this.createBar();
        this.createControl();
        this.add(this.bar);
        this.add(this.control);
        this.setSize(width, 24);
        this.onChangeCallback = onChangeCallback;
    }

    createBar() {
        this.bar = this.scene.add.rectangle(0, 0, this.width, 4).setFillStyle(0x666666);
    }

    createControl() {
        this.control = this.scene.add.rectangle(this.width * (this.value-0.5), 0, 8, 24).setFillStyle(0xcc9966).setOrigin(0.5, 0.5)
        .setInteractive(new Phaser.Geom.Circle(4, 12, 16), Phaser.Geom.Circle.Contains)
        .on("pointermove", (pointer) => {
            if (pointer.isDown) {
                this.controlMove(pointer.x);
            }
        })
        .on("pointerdown", (pointer) => this.controlMove(pointer.x));
    }

    controlMove(x) {
        if (this.scene.input.pointer1.isDown && this.scene.input.pointer2.isDown) return;
        this.control.x = x - this.control.parentContainer.x;
        this.control.x = Math.min(this.width/2, Math.max(this.control.x, -this.width/2));
        this.setValueCallback(this.control.x / this.width + 0.5);
    }

    Clamp(value) {
        if (value < 0) return value = 0;
        if (value > 1) return value = 1;
        return value;
    }

    setClampValueCallback(value) {
        this.setValueCallback(this.Clamp(value));
    }

    setValueCallback(value) {
        this.setValue(value);
        if (this.onChangeCallback) this.onChangeCallback();
    }

    setValue(value) {
        this.control.x = this.width * (value - 0.5);
        this.value = value;
    }
}

