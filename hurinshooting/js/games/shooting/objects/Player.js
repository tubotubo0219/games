import ObjectBase from './ObjectBase.js';
import {CharacterData, BulletData} from '../../../Database.js';

/**
 * プレイヤークラス
 */
export default class Player extends ObjectBase {
    constructor(scene, charaId, x, y, speed = null) {
        const chdata = CharacterData[charaId];
        if (speed === null) speed = chdata.speed;
        super(scene, x, y, chdata.w, chdata.h, speed, chdata.key, "Player");
        this.setScale(chdata.scale);
        this.radius = chdata.radius;
        this.setCollision(this.radius);
        this.scene.add.existing(this);
        this.blSlot = chdata.bullets;
        this.blCount = [0, 0, 0, 0];
        this.setData(chdata);
        this.levels = {skill:0, rapid:0, pet:0};
        if (window.playerData.dif === "easy") {
            this.hp += 60;
            this.powerRate = 1.2;
            this.bhpRate = 1.2;
            this.levels.skill += 1;
        }
        this.pointerCount = 0;
    }



    updateMove(time, delta) {
        if (window.playerData.config.control == "tap") {
            this.updateMoveByPointerChase();
        }
        //this.updateMoveByPointerMove();
        //this.checkPointerStop();
        this.checkMapEnd();
    }

    checkPointerStop() {
        const pointer = this.scene.game.input.activePointer;
        if (pointer.isDown && this.lastPoint) {
            if (this.lastPoint[0] == pointer.x && this.lastPoint[1] == pointer.y) {
                this.onPointerStop(pointer);
            }
        }
    }

    onPointerDown(pointer) {
        if (this.isDead) return;
        this.body.setVelocity(0);
        this.lastPoint = [pointer.x, pointer.y];
    }

    onPointerStop(pointer) {
        this.lastPoint = [pointer.x, pointer.y];
    }

    onPointerMove(pointer) {
        if (!this.lastPoint) return;
        if (this.isDead) return;
        const disX = pointer.x - this.lastPoint[0];
        const disY = pointer.y - this.lastPoint[1];
        const sqrDis = disX * disX + disY * disY;
        if (sqrDis > 32) {
            const radian = Math.atan2(pointer.y - this.lastPoint[1], pointer.x - this.lastPoint[0]);
            const degree = radian * (180 / Math.PI);
            this.body.velocity = this.scene.physics.velocityFromAngle(degree, this.speed);
            this.lastPoint = [pointer.x, pointer.y];
            this.pointerCount = 0;
        } else {
            this.pointerCount++;
        }
    }

    onPointerUp() {
        if (this.isDead) return;
        this.body.setVelocity(0);
        this.lastPoint = null;
    }

    updateMoveByPointerChase() {
        this.body.setVelocity(0);
        const pointer = this.scene.game.input.activePointer;
        if (pointer.isDown) {
            const disX = pointer.x - this.x;
            const disY = pointer.y - this.y;
            if (Math.abs(disX) > 6 || Math.abs(disY) > 6) {
                const radian = Math.atan2(disY, disX);
                const degree = radian * (180 / Math.PI);
                this.body.velocity = this.scene.physics.velocityFromAngle(degree, this.speed);
            }
        }
    }

    updateMoveByPointerMove() {
        this.body.setVelocity(0);
        const pointer = this.scene.game.input.activePointer;
        if (pointer.isDown) {
            if (this.lastPoint) {
                const disX = pointer.x - this.lastPoint[0];
                const disY = pointer.y - this.lastPoint[1];
                if (Math.abs(disX) > 0 || Math.abs(disY) > 0) {
                    const radian = Math.atan2(pointer.y - this.lastPoint[1], pointer.x - this.lastPoint[0]);
                    const degree = radian * (180 / Math.PI);
                    this.body.velocity = this.scene.physics.velocityFromAngle(degree, this.speed);
                } else {
                    this.lastPoint = [pointer.x, pointer.y];
                }
            } else {
                this.lastPoint = [pointer.x, pointer.y];
            }
        } else{
            this.lastPoint = null;
        }
    }

    updateShoot(time, delta) {
        this.blSlot.forEach((bid, i) => this.updateShootCount(bid, i, delta));
    }

    updateShootCount(bulletId, index, delta) {
        if (this.blSlot[index] !== 0) {
            this.blCount[index]+= delta / 1000;
            if (this.blCount[index] >= BulletData[bulletId].delay * RapidRateData[this.levels.rapid]) {
                this.shoot(bulletId);
                this.blCount[index] = 0;
            }
        }
    }

    shoot(bulletId) {
        if (this.levels.skill > 0) {
            this[BulletData[bulletId].skill](bulletId);
        } else {
            this.scene.createPlayerBullet(bulletId, this);
        }
    }

    multiShoot(bulletId) {
        for (let i=this.levels.skill; i>0; i--) {
            this.scene.createPlayerBullet(bulletId, this,
                {scale: 1 - 0.15 * i, powerRate: 1 - 0.2 * i, delay:60 * i});
        }
        this.scene.createPlayerBullet(bulletId, this);
    }

    wideShoot(bulletId) {
        this.scene.createPlayerBullet(bulletId, this);
        for (let i=1; i<this.levels.skill+1; i++) {
            this.scene.createPlayerBullet(bulletId, this,
                {degree: WideShootData.deg[i], scale: WideShootData.scale[i], powerRate: WideShootData.damage[i]});
        }
    }

    bigShoot(bulletId) {
        const lv = this.levels.skill;
        this.scene.createPlayerBullet(bulletId, this, {scale: 1 + lv * 0.5, powerRate: BigShootData.power[lv], hpRate: BigShootData.hp[lv]});

    }


    onHit(target) {
        if (target.type !== "CaughtAnimal" && !this.hitInvincible) {
            super.onHit(target);
            this.hitInvincible = true;
            this.hitInvincibleTimeEvent = this.scene.time.addEvent({
                delay: 600,
                callback: () => { this.hitInvincible = false; },
            });
        }
    }

    getItem(item) {
        if (this.levels[item.itemId] <= 3) {
            this.levels[item.itemId]++;
        } else {
            window.playerData.coin += 10;
        }
    }

    checkMapEnd() {
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x > this.scene.game.config.width) this.x = this.scene.game.config.width;
        if (this.y > this.scene.game.config.height) this.y = this.scene.game.config.height;
    }

    startDeadAction() {
        this.scene.playSE("hit02");
        this.body.setAngularVelocity(600);
        this.body.setVelocity(-600, -600);
        this.clearEvent = this.scene.time.addEvent({
            delay: 1200,
            callback: this.gotoGameOver.bind(this)
        });
    }

    gotoTitle() {
        this.scene.gotoScene("ShootingPlayerSelect");
    }

    gotoGameOver() {
        this.scene.gotoScene("ShootingGameOver");
    }
}
const WideShootData = {
    deg   : [0, -10, 10, -20, 20],
    scale : [1, 0.8, 0.8, 0.6, 0.6],
    damage: [1, 0.7, 0.7, 0.5, 0.5],
};
const BigShootData = {
    power : [1, 1.8, 2.2, 2.5, 2.8],
    hp    : [1, 1.8, 2.2, 2.5, 2.8],
}

const RapidRateData = [1, 0.9, 0.82, 0.76, 0.7];


