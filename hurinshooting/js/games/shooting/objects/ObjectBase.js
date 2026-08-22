/**
 * オブジェクト基本クラス
 */
var objectUniqueId = 0;
export default class ObjectBase extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, w, h, speed, key, type, frame) {
        super(scene, x, y, key, frame);
        this.uniqueId = objectUniqueId++;
        this.w = w;
        this.h = h;
        this.hp = 100;
        this.scene = scene;
        this.speed = speed;
        this.power = 0;
        this.hasCoin = 0;
        this.radius = 18;
        this.type = type;
        this.isDead = false;
    }

    appear() {
        this.setActive(true);
        this.setVisible(true);
    }

    disappear() {
        this.setActive(false);
        this.setVisible(false);
    }

    hide() {
        this.setVisible(false);
    }

    show() {
        this.setVisible(true);
    }

    setData(objdata) {
        this.hp = objdata.hp;
        this.power = objdata.power;
        this.vrot = objdata.rotation || 0;
        this.shootPosition = objdata.shootPosition;
        if (objdata.alpha) this.setAlpha(objdata.alpha);
        this.baseAngle = objdata.baseAngle || 0;
        this.setAngle(this.baseAngle);
        this.syncAngleWithVelocity = objdata.syncAngleWithVelocity;
        if (objdata.tint !== null) {
            this.defaultTint = objdata.tint;
            this.setTint(objdata.tint);
        }
    }

    setCollision(radius, offset) {
        this.scene.physics.world.enableBody(this, 0);
        const offsetX = (this.w - radius * 2) / 2;
        const offsetY = (this.h - radius * 2) / 2;
        if (offset) {
            this.body.setCircle(radius, offsetX + offset[0], offsetY + offset[1]);
        } else {
            this.body.setCircle(radius, offsetX, offsetY);
        }
    }

    setRectCollision(x, y, w, h) {
        this.scene.physics.world.enableBody(this, 0);
        this.body.setSize(w, h, true);
    }

    setRectOffset(x, y) {
        this.body.setOffset(x + this.body.offset.x, y + this.body.offset.y);
    }

    isHitValid(target) {
        if (!this.active) return false;
        if (this.isDead) return false;
        if (!this.visible) return false;
        return true;
    }

    onHit(target) {
        this.executeDamage(target);
        this.performDamage();
        if (this.hp <= 0) {
            this.dead();
        }
    }

    executeDamage(target, rate = 1) {
        this.hp -= target.power * rate;
    }

    performDamage() {
        this.setTint(0xff0000);
        const callback = this.defaultTint ? this.setTint.bind(this, this.defaultTint) : this.clearTint.bind(this); 
        this.damageTintCount = this.scene.time.addEvent({
            delay: 20,
            callback: callback,
        });

    }

    update(time, delta) {
        if (this.active && !this.isDead) {
            this.updateMove(time, delta);
            this.updateShoot(time, delta);
        }
    }

    updateMove(time, delta) {

    }

    updateShoot(time, delta) {

    }

    dead() {
        this.isDead = true;
        this.startDeadAction();
    }

    startDeadAction() {

    }

    log() {
        console.log(this.type, this.hp, this.x, this.y);
    }

}

