/**
 * オブジェクト基本クラス
 */

 class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, w, h, onClickCallback, options) {
        super(scene, x, y);
        this.onClickCallback = onClickCallback;
        this.selected = false;
        this.isValid = true;
        this.setSize(w, h);
        this.setInteractive();
        if (options) {
            if (options.scale) this.setScale(options.scale);
            this.radioGroup = options.radioGroup;
            if (options.frame) {
                this.frame = scene.add.image(0, 0, options.frame.key).setOrigin(0.5, 0.5);
                this.add(this.frame);
            }
        }
        scene.add.existing(this);
        this.on("pointerup", this.select.bind(this));
        this.on("pointerover", this.onPointerOver.bind(this));
        this.on("pointerout", this.onPointerOut.bind(this));
    }

    select(pointer, isCallback = true) {
        if (this.isValid) {
            this.selected = true;
            if (this.onClickCallback && isCallback) this.onClickCallback(pointer);
        }
        if (this.radioGroup) {
            Object.keys(this.radioGroup).forEach(key => {
                if (this.radioGroup[key] !== this)
                    this.radioGroup[key].unselect();
            });
        }
    }

    unselect() {
        this.selected = false;
    }

    setCallback(type, action) {
        const funcname = "on"+type;
        this[funcname] = action;
        this.on(type, () => { if(this.isValid) this[funcname](); });
    }

    onPointerOver() {
    }

    onPointerOut() {
    }

    onPointerUp() {

    }

    setValid(bool) {
        this.isValid = bool;
    }
}

export class SelectButton extends Button {
    constructor(scene, key, id, x, y, w, h, onClickCallback, radioGroup, options = null) {
        super(scene, x, y, w, h, onClickCallback, options);
        this.radioGroup = radioGroup;
        this.id = id;
        this.pointColor = 0xffccff;
        this.selectColor = 0xffcccc;
        this.unselectColor = 0xffffff;
        this.invalidColor = 0x555555;

        this.frame = scene.add.rectangle(0, 0, w, h);
        this.add(this.frame);

        if (key) {
            this.image = this.scene.add.image(0, 0, key).setOrigin(0.5, 0.5);
            this.add(this.image);
        }

        if (options) {
            if (options.pointColor) this.pointColor = options.pointColor;
            if (options.selectColor) this.selectColor = options.selectColor;
            if (options.unselectColor) this.unselectColor = options.unselectColor;
            if (options.invalidColor) this.invalidColor = options.invalidColor;
            if (options.text) {
                this.text = scene.add.text(x, y, options.text, {fontFamily:"メイリオ", fontSize: h-4, color: options.textColor}).setOrigin(0.5,0.5);
                this.add(this.text);
            }
            if (options.imageScale) this.image.setScale(options.imageScale);
        }

        this.frame.setStrokeStyle(1, 0xff00ff).setOrigin(0.5, 0.5);

        this.unselect();
    }

    select(pointer, isCallback = true) {
        if (this.isValid) {
            super.select(pointer, isCallback);
            this.frame.setFillStyle(this.selectColor);
        }
    }

    unselect() {
        super.unselect();
        if (this.isValid) {
            this.frame.setFillStyle(this.unselectColor);
        }
    }

    onPointerOver() {
        if (this.isValid) {
            this.frame.setFillStyle(this.pointColor);
        }
    }

    onPointerOut() {
        if (this.isValid) {
            if (this.selected)
                this.frame.setFillStyle(this.selectColor); 
            else
                this.frame.setFillStyle(this.unselectColor);
        }
    }

    setValid(bool) {
        super.setValid(bool);
        if (!bool) {
            this.frame.setFillStyle(this.invalidColor);
        } else {
            this.frame.setFillStyle(this.unselectColor);
        }
    }
}


export class ImageButton extends Button {
    constructor(scene, x, y, w, h, imageKey, onClickCallback, options) {
        const image = scene.add.image(0, 0, imageKey).setOrigin(0.5, 0.5);
        if (options && options.imageScale) image.setScale(options.imageScale);
        super(scene, x, y, w, h, onClickCallback, options);
        this.image = image;
        this.add(this.image);
        if (this.frame) {
            this.pointColor = 0xffccff;
            this.selectColor = 0xffffff;
            this.unselectColor = 0xffffff;
            this.invalidColor = 0x555555;
            if (options) {
                if (options.pointColor) this.pointColor = options.pointColor;
                if (options.selectColor) this.selectColor = options.selectColor;
                if (options.unselectColor) this.unselectColor = options.unselectColor;
                if (options.invalidColor) this.invalidColor = options.invalidColor;
            }
        }
    }

    select(pointer, isCallback = true) {
        if (this.isValid) {
            if (this.frame) {
                this.frame.setTint(this.selectColor);
            }
            super.select(pointer, isCallback);
        }
    }

    unselect() {
        super.unselect();
        if (this.isValid && this.frame) {
            this.frame.setTint(this.unselectColor);
        }
    }

    onPointerOver() {
        if (this.isValid && this.frame) {
            this.frame.setTint(this.pointColor);
        }
    }

    onPointerOut() {
        if (this.isValid && this.frame) {
            if (this.selected)
                this.frame.setTint(this.selectColor); 
            else
                this.frame.setTint(this.unselectColor);
        }
    }

    setValid(bool) {
        super.setValid(bool);
        if (this.frame) {
            if (!bool) {
                this.frame.setTint(this.invalidColor);
            } else {
                this.frame.setTint(this.unselectColor);
            }
        }
    }
}

export class TextButton extends Button {
    constructor(scene, x, y, text, frameKey, onClickCallback, options) {
        const frame = scene.add.image(0, 0, frameKey).setOrigin(0.5, 0.5);
        super(scene, x, y, frame.width, frame.height, onClickCallback, options);
        this.frame = frame;
        const color = options ? options.textColor || "#ff6644" : "#ff6644";
        this.text = scene.add.text(0, 0, text, {fontFamily:"Arial", fontSize:24, color:color}).setOrigin(0.5, 0.5);
        this.add(this.frame);
        this.add(this.text);
        if (this.text.width > this.frame.width - 8) {
            this.text.scaleX = (this.frame.width - 8) / this.text.width;
        }
        this.pointColor = 0xffccff;
        this.selectColor = 0xffcccc;
        this.unselectColor = 0xffffff;
        this.invalidColor = 0xbbbbbb;
        if (options) {
            if (options.normalColor) {
                this.normalColor = options.normalColor;
                this.frame.setTint(this.normalColor);
            }
            if (options.pointColor) this.pointColor = options.pointColor;
            if (options.selectColor) this.selectColor = options.selectColor;
            if (options.unselectColor) this.unselectColor = options.unselectColor;
            if (options.invalidColor) this.invalidColor = options.invalidColor;
        }
    }

    setValid(bool) {
        super.setValid(bool);
        if (!bool) {
            this.frame.setTint(this.invalidColor);
        } else {
            this.frame.clearTint();
        }
    }

    onPointerOver() {
        if (this.isValid) {
            this.frame.setTint(this.pointColor);
        }
    }

    onPointerOut() {
        if (this.isValid) {
            if (this.selected && this.radioGroup) {
                this.frame.setTint(this.selectColor);
            } else {
                if (this.normalColor) {
                    this.frame.setTint(this.normalColor);
                } else {
                    this.frame.clearTint();
                }
            }
        }
    }

    setText(text) {
        this.text.setText(text);
    }

    select(pointer, isCallback = true) {
        super.select(pointer, isCallback);
        if (this.radioGroup) {
            this.frame.setTint(this.selectColor);
        }
    }

    unselect() {
        super.unselect();
        if (this.radioGroup) {
            this.frame.clearTint();
        }
    }
} 

export class CheckBox extends Button {
    constructor(scene, x, y, onClickCallback, options) {
        super(scene, x, y, 32, 32, onClickCallback, options);
        this.box = this.scene.add.image(0, 0, "checkBox");
        this.mark = this.scene.add.image(0, 0, "checkMark");
        this.mark.setVisible(false);
        this.add(this.box).add(this.mark);
        if (options && options.check) {
            this.select();
        }
    }

    select() {
        super.select();
        this.mark.setVisible(!this.mark.visible);
    }

    setValue(bool) {
        this.mark.setVisible(bool);
    }
}


