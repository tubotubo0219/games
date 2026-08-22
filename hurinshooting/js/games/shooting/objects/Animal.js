import ObjectBase from './ObjectBase.js';
import {AnimalData} from '../../../Database.js';

/**
 * 仲間動物クラス
 */
export default class Animal extends ObjectBase {
    constructor(scene, animalId, x, y, player, speed = null) {
        const chdata = AnimalData[animalId].pet;
        if (speed === null) speed = chdata.speed;
        super(scene, x, y, chdata.w, chdata.h, speed, chdata.key, "Player");
        this.player = player;
        this.checkDistance = 12;
        this.scene.add.existing(this);
        this.setCollision(24);
        this.chdata = chdata;
    }

    updateMove() {
        if (this.isSkillUsing) return;
        const disx = this.player.x - this.x;
        const disy = this.player.y - this.y;
        const dis = disx * disx + disy * disy;
        if (dis >= this.checkDistance * this.checkDistance) {
            this.chasePlayer(disx, disy, dis);
        } else {
            this.setVelocity(0);
        }
        /*
        this.x = this.player.x;
        this.y = this.player.y;
        */
    }

    useSkill() {
        if (this.chdata.bullets) {
            const bullet = this.chdata.bullets[0];
            this[bullet]();
        }
    }

    chasePlayer(disx, disy) {
        const radian = Math.atan2(disy, disx);
        const degree = radian * (180 / Math.PI);
        this.body.velocity = this.scene.physics.velocityFromAngle(degree, this.speed);
    }

    // うさぎの技 にんじんドリルアタック
    ninjinDrill() {
        this.isSkillUsing = true;
        this.setVelocity(0);

        this.scene.tweens.add({
            targets: this,
            x: 1000,
            duration: (1000 - this.x) * 2,
            onComplete: () => {
                this.isSkillUsing = false;
                this.x = -100;
            },
        });
        const bullet = this.scene.createPlayerBullet("ninjinDrill", this);
        this.scene.tweens.add({
            targets: bullet,
            x: 1000 + bullet.x - this.x,
            duration: (1000 - this.x) * 2,
            onComplete: () => {
                bullet.onDestroy();
            },
        });
        this.parentContainer.add(bullet);
    }

    // おにはむの技 おむすびころりん
    omusubiKororin() {
        this.isSkillUsing = true;
        this.body.setAngularVelocity(600);
        this.scene.animalTween.pause();
        this.body.setGravityY(600);
        this.body.setVelocity(200, -400);
        this.setScale(2);
        const bullet = this.scene.createPlayerBullet("omusubiKororin", this);
        this.scene.time.addEvent({
            delay: 1400,
            callback: () => this.body.setVelocity(300, -300),
        });
        this.scene.time.addEvent({
            delay: 2400,
            callback: () => this.body.setVelocity(400, -200),
        });
        this.scene.time.addEvent({
            delay: 3200,
            callback: () => {
                if (this.isSkillUsing) {
                    this.x = -100;
                    this.y = this.player.y;
                }
                this.isSkillUsing = false;
                this.setGravityY(0);
                this.setVelocity(0);
                this.setScale(1);
                this.setAngularVelocity(0);
                this.angle = 0;
                this.scene.animalTween.resume();
                bullet.onDestroy();
            }
        });
    }

    // ねずみの技 ねずみフィーバー
    nezumiFever() {
        const opt = {position: [this.x + this.parentContainer.x, this.y + this.parentContainer.y]};
        const blt = this.scene.createPlayerBullet("nezumiFever", this, opt);
        blt.body.velocity.x = blt.speed;
    }

    // りすの技 どんぐりメテオ
    donguriMeteor() {
        for (let i=0; i<12; i++) {
            const x = Phaser.Math.Between(-200, 300);
            const time = Phaser.Math.Between(400, 3200);
            const opt = {position: [x, -64]};
            this.scene.time.addEvent({
                delay: time,
                callback: () => {
                    const blt = this.scene.createPlayerBullet("donguriMeteor", this, opt);
                    blt.setVelocity(400, 240);
                }
            });
        }
        this.scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 400,
        });
    }

    // ぷよりすの技 ろうそくファイヤー
    rousokuFire() {
        for (let i=0; i<3; i++) {
            const degree = -20 + i * 20;
            const opt = {position: [this.x + this.parentContainer.x, this.y + this.parentContainer.y - 32]};
            const blt = this.scene.createPlayerBullet("rousokuFire", this, opt);
            blt.setOrigin(0.2, 0.5);
            blt.body.setAngularVelocity(1200);
            blt.body.velocity = this.scene.physics.velocityFromAngle(degree, blt.speed);
        }
    }

    // パンダの技　ささのはカッター
    sasaCutter() {
        for (let i=0; i<20; i++) {
            const degree = Phaser.Math.Between(-15, 15);
            const time = i * 20;
            const opt = {position: [this.x + this.parentContainer.x + 24, this.y + this.parentContainer.y]};
            this.scene.time.addEvent({
                delay: time,
                callback: () => {
                    const blt = this.scene.createPlayerBullet("sasaCutter", this, opt);
                    blt.body.velocity = this.scene.physics.velocityFromAngle(degree, blt.speed);
                    blt.angle = degree;
                }
            });
        }
    }
}

export class CareAnimal {
    createTalk() {
        const params = window.playerData.animals[window.talkAnimal];
        if (params.foods <= 30) {
            // 空腹時
        } else if (params.bath <= 30) {
            // 汚れた時
        } else if (params.goods <= 30) {
            // 遊びたい時
        } else {
            // 正常時
        }
    }
}

export class AnimalParams {
    constructor(animalId) {
        this.id = animalId;
        this.level = 1;
        this.growth = 1;
        this.foods = 20;   // 満腹度
        this.bath  = 20;   // 清潔度
        this.goods = 20;   // 満足度
        this.exp = 0;
        this.dressup = [];
    }
}

export var AnimalParamUtil = {
    checkValues(paramsHash) {
        Object.values(paramsHash).forEach(params => {
            params.growth ||= 1;
            params.dressup ||= [];
        });
    },

    gainParam(params, id, value) {
        const diff = 100 - params[id];
        if (diff < value) value = diff;
        params[id] += value;
        this.gainExp(params, value);
        return value;
    },

    loseParams(params, value) {
        params.foods -= value * 2;
        params.bath -= value;
        params.goods -= value;
        if (params.foods < 0) params.foods = 0;
        if (params.bath < 0) params.bath = 0;
        if (params.goods < 0) params.goods = 0;
    },

    gainExp(params, value) {
        params.exp += value;
        if (params.exp >= this.nextExp(params)) {
            params.level += 1;
            params.exp -= this.nextExp(params);
            if (params.level >= 5) {
                params.growth = 2;
                return true;
            }
        }
        return false;
    },

    nextExp(params) {
        return 200 + (params.level - 1) * 100;
    },

	foodsGaugeRatio() {
		const dat = window.playerData.animals[window.talkAnimal];
		return (dat.foods+20) / 120;
	},

	bathGaugeRatio() {
		const dat = window.playerData.animals[window.talkAnimal];
		return (dat.bath+20) / 120;
	},

	goodsGaugeRatio() {
		const dat = window.playerData.animals[window.talkAnimal];
		return (dat.goods+20) / 120;
	},

	expGaugeRatio() {
		const dat = window.playerData.animals[window.talkAnimal];
		const ratio = dat.exp / this.nextExp(dat);
		return ratio * 0.8 + 0.2;
	},
}