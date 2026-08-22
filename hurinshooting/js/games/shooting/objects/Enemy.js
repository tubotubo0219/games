import ObjectBase from './ObjectBase.js';
import {CharacterData, BulletData} from '../../../Database.js';
import { Test_FigureGetScene } from '../../../scenes/FigureGetScene.js';

/**
 * 敵クラス
 */
export default class Enemy extends ObjectBase {
	constructor(scene, popData, parent = null) {
        const chdata = CharacterData[popData[0]];
        const x = scene.game.config.width + 100;
        const y = popData[1];
		super(scene, x, y, chdata.w, chdata.h, chdata.speed, chdata.key, "Enemy");
        this.ox = this.oy = 0;
        if (chdata.offset) {
            this.ox = chdata.offset[0];
            this.oy = chdata.offset[1];
            this.x += chdata.offset[0];
            this.y += chdata.offset[1];
        }
        this.radius = chdata.radius;
        if (chdata.scale) {
            this.setScale(chdata.scale);
        } else {
            this.scaleX = chdata.scaleX || 1;
            this.scaleY = chdata.scaleY || 1;
        }
        if (chdata.origin) {
            this.setOrigin(chdata.origin[0], chdata.origin[1]);
        }
        if (chdata.collideType) {
            if (chdata.collideType == "rect") {
                this.setRectCollision(0, 0, chdata.collideSize[0], chdata.collideSize[1]);
                if (chdata.collideOffset) {
                    this.setRectOffset(chdata.collideOffset[0], chdata.collideOffset[1]);
                }
            }
        } else {
            this.setCollision(this.radius, chdata.collideOffset);
        }
        this.isUpdate = (chdata.update == null) ? true : chdata.update;
        this.scene.add.existing(this);
        this.setData(chdata);
        this.moveFunc = chdata.moveType ? this[chdata.moveType] : this.defaultMove;
        this.moveParams = chdata.moveParams;
        this.moveSignY = 1;
        this.setActive(false);
        this.setVisible(false);


        this.actionPhase = 0;
        this.actionCount = 0;
        this.actionValue = 0;
        this.baseY = this.y;

        this.enemyId = popData[5];
        this.popTime = popData[2];
        this.hasCoin = chdata.hasCoin || 1;
        this.hasItem = chdata.item;
        if (popData[3]) {
            this.options = popData[3];
        } else {
            this.options = {};
        }
        this.parent = parent;
        if (parent) {
            parent.addChild(this);
        }
        this.chdata = chdata;
        this.children = [];
        this.tweens = [];
        this.events = [];
	}

    addChild(child) {
        this.children.push(child);
    }

    removeChild(child) {
        this.children = this.children.filter(ch => {
            if (ch !== child) {
                return true;
            } else {
                ch.parent = null;
                return false;
            }
        });
    }

    removeChildren() {
        this.children.forEach(ch => ch.parent = null);
        this.children = [];
    }

    activatePop() {
        this.popEvent = this.scene.time.addEvent({
            delay: this.popTime * 1000,
            callback: this.appear.bind(this)
        });
    }

    onHit(target) {
        if (!this.hitInvincible) {
            super.onHit(target);
            if (target.type === "Player") {
                this.hitInvincible = true;
                this.hitInvincibleTimeEvent = this.scene.time.addEvent({
                    delay: 600,
                    callback: () => { this.hitInvincible = false; },
                });
            }
        }
    }

    executeDamage(target, rate = 1) {
        if (this.chdata.petSkillRate && target.isPetSkill) {
            super.executeDamage(target, rate * this.chdata.petSkillRate);
        } else {
            super.executeDamage(target, rate);
        }
    }

    killChildren(isPlayDeadAction = false, isGainReward = false) {
        this.children.forEach(child => {
            if (!child.isDead) child.startDeadAction(isPlayDeadAction, isGainReward);
        });
    }

    startDeadAction(isPlayDeadAction = true, isGainReward = true) {
        if (isPlayDeadAction && this.options.deadActions) {
            this.options.deadActions.forEach(action => this[action]());
        }

        if (this.parent) {
            this.parent.removeChild(this);
        }
        if (this.chdata.isDeadRemoveChild) {
            this.removeChildren();
        } else {
            this.children.forEach(child => {
                child.events.push(this.scene.time.addEvent({
                    delay: 1600,
                    callback: child.disappear.bind(child),
                }));
            });
        }
        this.stopAllEvents();
        this.parent = null;
        this.scene.playSE("hit02");
        this.body.setAngularVelocity(600);
        this.body.setVelocity(600, -600);
        this.body.setCollideWorldBounds(false);
        if (isGainReward) {
            this.scene.gainRewards(this);
        }
        if (this.hasItem) {
            this.scene.createItem(this.hasItem, this);
        }
        this.deadEvent = this.scene.time.addEvent({
            delay: 1200,
            callback: this.disappear.bind(this)
        });
        this.stopShootLoop();
    }

    stopAllEvents() {
        this.tweens.forEach(tween => tween.stop());
        this.events.forEach(event => this.scene.time.removeEvent(event));
        if (this.timeline) {
            this.timeline.stop();
            this.timeline.destroy();
        }
        if (this.timeline2) {
            this.timeline2.stop();
            this.timeline2.destroy();
        }
    }

    stopTimer() {
        this.scene.stopTimer(this);
    }

    restartTimer() {
        this.scene.restartTimer();
    }

    nextWave() {
        this.scene.activateNextEnemies();
    }

    appear() {
        super.appear();
        if (this.options.popActions) {
            this.options.popActions.forEach(action => this[action]());
        }
        if (this.chdata.timeline) {
            this[this.chdata.timeline]();
        }
    }

    disappear() {
        this.scene.onDisappearEnemy(this);
        this.disableBody(true, true);
    }

    stopShootLoop() {
        if (this.shootLoopEvent) {
            this.scene.time.removeEvent(this.shootLoopEvent);
            this.shootLoopEvent = null;
        }
    }

    update(time, delta) {
        if (!this.isUpdate) return;
        super.update(time, delta);
    }

    updateMove(time, delta) {
        this.moveFunc(time, delta);
        if (this.x <= -128) {
            this.disappear();
            this.stopAllEvents();
            this.stopShootLoop();
        }
    }

    //#region ザコ移動
    defaultMove(time, delta) {
        this.body.velocity.x = -this.speed;
    }

    smoothLoopY(time, delta) {
        this.body.velocity.x = -this.speed;
        let vy = this.moveParams.accel;
        if (this.y < -this.moveParams.top + this.baseY) {
            this.moveSignY = 1;
        } else if (this.y > this.moveParams.bottom + this.baseY) {
            this.moveSignY = -1;
        }
        this.body.velocity.y += vy * this.moveSignY * 16.66 / delta;
        this.body.velocity.y = Math.min(Math.max(-this.moveParams.maxSpeed, this.body.velocity.y),this.moveParams.maxSpeed);
    }

    chaseParent() {
        this.x = this.parent.x + this.ox;
        this.y = this.parent.y + this.oy;
    }

    ikaMove(time, delta) {
        this.body.velocity.x = -this.speed;
        if (this.isMove || this.isWait) return;
        switch (this.actionPhase) {
            case 0:
                this.body.velocity.y = this.speed / 4;
                this.setActionPhase(this.actionPhase + 1);
                this.waitCount(3000 * Phaser.Math.FloatBetween(0.8, 1.2));
                break;
            case 1:
                this.body.velocity.y = -this.speed * 3;
                this.setActionPhase(0);
                this.waitCount(500 * Phaser.Math.FloatBetween(0.8, 1.2));
                break;
        }
    }

    waniMove(time, delta) {
        switch (this.actionPhase) {
            case 1:
                this.actionValue += this.moveParams.add;
                if (this.actionValue >= this.moveParams.max) this.setActionPhase(2);
                break;
            case 2:
                this.actionValue -= this.moveParams.add;
                if (this.actionValue <= this.moveParams.min) this.setActionPhase(1);
                break;
            case 0: this.actionValue = 180; this.setActionPhase(1); break;
        }
        this.body.velocity = this.scene.physics.velocityFromAngle(this.actionValue, this.speed);
        this.angle = this.actionValue - 180;

    }

    obakeMove(time, delta) {
        switch (this.actionPhase) {
            case 1:
                this.actionValue += this.moveParams.add;
                if (this.actionValue >= this.moveParams.max) this.setActionPhase(2);
                break;
            case 2:
                this.actionValue -= this.moveParams.add;
                if (this.actionValue <= this.moveParams.min) this.setActionPhase(1);
                break;
            case 0:
                this.actionValue = 180; this.setActionPhase(1);
                this.tweens.push(this.scene.tweens.add({
                    targets: this,
                    scale: 1.5,
                    duration: 1000,
                    yoyo: true,
                    delay: 800,
                    loop: -1,
                }));
                break;
        }
        this.body.velocity = this.scene.physics.velocityFromAngle(this.actionValue, this.speed);
        this.angle = this.actionValue - 180;

    }

    obakeMove_UTurn(time, delta) {
        if (!this.uturn && this.x <= 128) {
            this.uturn = 1;
            this.setActionPhase(3);
        } else if (this.uturn === 1 && this.x >= 860 - 128) {
            this.uturn = 2;
            this.setActionPhase(6);
        }
        switch (this.actionPhase) {
            case 1:
                this.actionValue += this.moveParams.add;
                if (this.actionValue >= this.moveParams.max) this.setActionPhase(2);
                break;
            case 2:
                this.actionValue -= this.moveParams.add;
                if (this.actionValue <= this.moveParams.min) this.setActionPhase(1);
                break;
            case 4:
                this.actionValue += this.moveParams.add;
                if (this.actionValue >= this.moveParams.max + 180) this.setActionPhase(5);
                break;
            case 5:
                this.actionValue -= this.moveParams.add;
                if (this.actionValue <= this.moveParams.min + 180) this.setActionPhase(4);
                break;
            case 0:
                this.actionValue = 180; this.setActionPhase(1);
                this.tweens.push(this.scene.tweens.add({
                    targets: this,
                    scale: 1.5,
                    duration: 1000,
                    yoyo: true,
                    delay: 800,
                    loop: -1,
                }));
                break;
            case 3:
                this.actionValue += this.moveParams.add * 2;
                if (this.actionValue >= 360) this.setActionPhase(4);
                break;
            case 6:
                this.actionValue += this.moveParams.add * 2;
                if (this.actionValue >= 540) {
                    this.setActionPhase(1);
                    this.actionValue = 180;
                }
                break;
        }
        this.body.velocity = this.scene.physics.velocityFromAngle(this.actionValue, this.speed);
        this.angle = this.actionValue - 180;

    }

    ufoMove(time, delta) {
        switch (this.actionPhase) {
            case 1:
                this.actionValue += this.moveParams.add;
                if (this.actionValue >= this.moveParams.max) this.setActionPhase(2);
                break;
            case 2:
                this.actionValue -= this.moveParams.add;
                if (this.actionValue <= this.moveParams.min) this.setActionPhase(1);
                break;
            case 0:
                this.actionValue = 180;
                let blt = this.scene.createEnemyBullet("ufo_light", this);
                blt.x = this.x;
                blt.y = this.y + 24;
                blt.scaleY = 0.01;
                blt.setOrigin(0.5, 0);
                this.shootLoop(2000, () => {
                    if (!this.isDead) {
                        blt = this.scene.createEnemyBullet("ufo_light", this, {
                            position:[this.x, this.y + 24], scaleY: 0.01
                        });
                        blt.setOrigin(0.5, 0);
                    }
                });
                this.setActionPhase(1);
                break;
        }
        this.body.velocity = this.scene.physics.velocityFromAngle(this.actionValue, this.speed);
    }

    kumoMove(time, delta) {
        if (this.children.length === 0) {
            this.body.setGravityY(600);
            this.stopAllEvents();
            if (this.y >= 600) {
                this.disappear();
            }
        }
        if (this.actionPhase === 0) {
            this.body.velocity.x = -this.speed * 4;
            if (this.x <= this.options.params[0]) {
                const duration = this.options.params[1] * 3;
                this.tweens.push(this.scene.tweens.add({targets: this, y: this.options.params[1], duration: duration, completeDelay: duration}));
                this.actionPhase = 1;
            }
        } else {
            this.body.velocity.x = -this.speed;
        }
    }

    kumokumoMove(time, delta) {
        if (this.children.length === 0) {
            this.body.setGravityY(600);
            this.stopAllEvents();
            if (this.y >= 600) {
                this.disappear();
            }
        }
        if (this.actionPhase === 0) {
            this.body.velocity.x = -this.speed * 4;
            if (this.x <= this.options.params[0]) {
                const duration = this.options.params[1] * 4;
                this.tweens.push(this.scene.tweens.add({targets: this, y: this.options.params[1], duration: duration, completeDelay: duration}));
                this.actionPhase = 1;
            }
        } else if (this.actionPhase === 1) {
            this.body.velocity.x = -this.speed;
            if (this.x <= this.options.params[2]) {
                const duration = Math.abs(this.options.params[1] - this.options.params[3]) * 4;
                this.tweens.push(this.scene.tweens.add({targets: this, y: this.options.params[3], duration: duration, completeDelay: duration}));
                this.actionPhase = 2;
            }
        } else if (this.actionPhase === 2) {
            this.body.velocity.x = -this.speed;
            if (this.x <= this.options.params[4]) {
                const duration = Math.abs(this.options.params[1] - this.options.params[5]) * 4;
                this.tweens.push(this.scene.tweens.add({targets: this, y: this.options.params[5], duration: duration, completeDelay: duration}));
                this.actionPhase = 3;
            }
        }
    }

    dossunMove(time, delta) {
        this.body.velocity.x = -this.speed / 2; 
        if (this.isMove || this.isWait) return;
        switch (this.actionPhase) {
            case 0: this.moveY(48, this.setActionPhase.bind(this, 1)); break;
            case 1: this.moveY(480 - 48, this.setActionPhase.bind(this, 2), this.speed * 4); break;
            case 2: this.waitCount(1000, this.setActionPhase.bind(this, 0)); break;
        }
    }

    moon1Timeline() {
        this.events.push(this.scene.time.addEvent({
            delay: 5,
            callback: () => {
                if (this.children[0]) this.children[0].body.velocity.x = this.body.velocity.x + this.children[0].moveParams[0];
                if (this.children[1]) this.children[1].body.velocity.x = this.body.velocity.x + this.children[1].moveParams[0];
            },
        }));
        this.events.push(this.scene.time.addEvent({
            delay: 2200,
            callback: () => {
                this.shoot("moon_wind1", null, {position:[this.x-24, this.y], scaleX: 0.01});
                this.shoot("moon_wind2", null, {position:[this.x+24, this.y], scaleX: 0.01});
                if (this.children[0]) this.children[0].body.velocity.x = this.body.velocity.x + this.children[0].moveParams[1];
                if (this.children[1]) this.children[1].body.velocity.x = this.body.velocity.x + this.children[1].moveParams[1];
            },
            loop: -1,
        }));
    }

    moonTimeline() {
    }

    moon2Move() {
        this.body.velocity.x += 2.5;
    }

    moon3Move() {
        this.body.velocity.x -= 2.5;
    }

    mkinokoHairTimeline() {
        this.tweens.push(this.scene.tweens.add({
            targets: this,
            delay: this.options.attackDelay,
            duration: 1400,
            scale: 2,
            onComplete: () => {
                this.shoot("explosion", null, {position:[this.x, this.y]});
                this.shoot("explosion", null, {position:[this.x + 9, this.y + 40]});
                this.shoot("explosion", null, {position:[this.x + 18, this.y + 80]});
                this.shoot("explosion", null, {position:[this.x + 27, this.y + 120]});
                this.scene.playSE("explosion01");
                this.disappear();
            },
        }));
    }

    mkumaTimeline() {
        this.setVelocity(0);
        const timeline = {
            targets: this,
            tweens: [
                this.tw_moveX(760, 0, this.speed * 0.5),
                this.tw_moveX(-200, 0, this.speed * 3),
            ],
        };
        this.tw_appearBoss(timeline);
        this.events.push(this.scene.time.addEvent({
            delay: 3600,
            callback: () => {
                this.timeline2 = this.scene.tweens.timeline({
                    targets: this,
                    tweens: [
                        { angle: 5, duration: 100, delay: 50, },
                        { angle: -5, duration: 100, },
                    ],
                    loop: -1,
                });
            }
        }));
    }

    //#endregion

    //#region ボス移動

    zombieHeadMove(time, delta) {
        if (this.parent) {
            this.chaseParent();
        } else if (this.actionPhase === 0) {
            this.flipX = true;
            this.angle -= 45;
            this.tweens.push(this.scene.tweens.add({
                targets: this,
                scale: 2,
                duration: 1000,
            }));
            this.setActionPhase(1);
        } else {
            this.chasePlayerFunc();
        }
    }

    changeZombieBodyTimeline() {
        if (this.parent) {
            this.parent.stopAllEvents();
            this.parent.zombieBodyTimeline();
        }
    }

    chasePlayerFunc() {
        this.chaseTargetFunc(this.scene.player);
    }

    chaseTargetFunc(target) {
        const px = target.x;
        const py = target.y;

        const disX = px - this.x;
        const disY = py - this.y;
        const radian = Math.atan2(disY, disX);

        const rot = Phaser.Math.Angle.RotateTo(this.rotation, radian, 0.018);
        this.body.velocity = this.scene.physics.velocityFromRotation(rot, this.speed);
        this.rotation = rot;
    }


    musibaikin2Move(time, delta) {
        if (this.isMove || this.isWait) return;
        switch (this.actionPhase) {
            case 2: this.waitCount(1000, this.moveY.bind(this, 160, this.setActionPhase.bind(this, this.actionPhase + 1))); break;
            case 4:
            case 8: this.waitCount(1000, this.moveY.bind(this, this.scene.game.config.height / 2, this.setActionPhase.bind(this, this.actionPhase + 1))); break;
            case 6: this.waitCount(1000, this.moveY.bind(this, this.scene.game.config.height - 160, this.setActionPhase.bind(this, this.actionPhase + 1))); break;
            // 攻撃
            case 1:
            case 5: this.waitCount(1000, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 180, 12, this.actionPhase + 1)); break;
            case 3: this.waitCount(1000, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 168, 12, this.actionPhase + 1)); break;
            case 7: this.waitCount(1000, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 192, 12, this.actionPhase + 1)); break;
            // ループ
            case 9: this.setActionPhase(1); break;
            // 出現
            case 0: this.appearBoss(-1); break;
            // 出現時アクション
            case -1:
                this.shootLoop(1200, this.randomShoot.bind(this, "baikin_hole", 1, [64,860-64], [64,480-64]));
                this.setActionPhase(1);
                break;
        }
    }

    hakaseTimeline() {
        this.setVelocity(0);
        const timeline = {
            targets: this,
            tweens: [
                this.tw_moveY(240, 1000, this.speed, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 180, 12)),
                this.tw_moveY(160, 1000, this.speed, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 168, 12), 1000),
                this.tw_moveY(240, 1000, this.speed, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 180, 12), 1000),
                this.tw_moveY(320, 1000, this.speed, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 192, 12), 1000),
                this.tw_moveY(240, 1000),
            ],
            loop: -1,
        };
        this.tw_appearBoss(timeline);
    }

    pikakumaTimeline() {
        this.setVelocity(0);
        const timeline = {
            targets: this,
            tweens: [
                this.tw_moveY(240, 1000, this.speed, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 180, 12)),
                this.tw_moveY(160, 1000, this.speed, this.shoot.bind(this, this.chdata.bullets[1]), 250),
                this.tw_moveY(240, 1000, this.speed, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 180, 12), 1000),
                this.tw_moveY(320, 1000, this.speed, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 192, 12), 1000),
                this.tw_moveY(240, 1000),
            ],
            loop: -1,
        };
        this.tw_appearBoss(timeline);
    }

    musibaikinTimeline() {
        this.setVelocity(0);
        const timeline = {
            targets: this,
            tweens: [
                this.tw_moveY(240, 1000, this.speed, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 180, 12)),
                this.tw_moveY(160, 1000, this.speed, this.shoot.bind(this, this.chdata.bullets[1]), 250),
                this.tw_moveY(240, 1000, this.speed, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 180, 12), 1000),
                this.tw_moveY(320, 1000, this.speed, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 192, 12), 1000),
                this.tw_moveY(240, 1000),
            ],
            loop: -1,
            
        };
        this.tw_appearBoss(timeline, () => {
            this.shoot("baikin_hole2", 2, {position:[700, 96]});
            this.shoot("baikin_hole2", 2, {position:[700, 480 - 96]});
        });
    }

    miminzukuTimeline() {
        this.setVelocity(0);
        const timeline = {
            targets: this,
            tweens: [
                this.tw_moveY(240, 1000, this.speed, () => {
                    this.shootDeg = 260;
                    this.shootLoop(100, () => { this.wideShoot(this.chdata.bullets[1], 0, this.shootDeg -= 20, 0); }, 7);
                }),
                this.tw_moveY(160, 1000, this.speed, this.wideShoot.bind(this, this.chdata.bullets[0], 1, 168, 12), 1000),
                // ブラックホール
                this.tw_wait2(2000, this.shoot.bind(this, this.chdata.bullets[2])),
                // 消えた後、移動先にブラックホール
                this.tw_wait2(250, () => {
                    this.hide();
                    this.x = 96;
                    this.y = Phaser.Math.Between(96, 480-96);
                    this.shoot(this.chdata.bullets[2]);
                }), 
                this.tw_wait2(1000, () => { this.show(); this.flipX = true; }),
                this.tw_wait2(1000, () => {
                    this.shootDeg = 280;
                    this.shootLoop(100, () => { this.wideShoot(this.chdata.bullets[1], 0, this.shootDeg += 20, 0); }, 7);
                }),
                this.tw_wait2(2000, this.wideShoot.bind(this, this.chdata.bullets[0], 3, 17, 16)),
                // ブラックホール
                this.tw_wait2(1000, this.shoot.bind(this, this.chdata.bullets[2])),
                // 消えた後、移動先にブラックホール
                this.tw_wait2(250, () => {
                    this.hide();
                    this.x = this.scene.game.config.width * 0.75;
                    this.y = this.scene.game.config.height - 160;
                    this.shoot(this.chdata.bullets[2]);
                }),
                this.tw_wait2(1000, () => { this.show(); this.flipX = false; }),
                this.tw_moveY(240, 1000),
            ],
            loop: -1,
        };
        this.tw_appearBoss(timeline);
    }

    gororiTimeline() {
        this.setVelocity(0);
        const timeline = {
            targets: this,
            tweens: [
                this.tw_wait(10, () => { this.body.setAngularVelocity(-360); }),
                this.tw_wait(1500, () => {
                    this.body.setCollideWorldBounds(true);
                    this.body.setBounce(1.05);
                    this.body.setVelocity(-180, 180);
                }),
            ]
        };
        this.tw_appearBoss(timeline);

        // 定期的にこうもり生産
        this.events.push(this.scene.time.addEvent({
            delay: 1200,
            callback: () => {
                this.scene.addEnemy("bat", [60, 420], true);
            },
            loop: -1,
        }));
    }

    zombieBodyTimeline() {
        this.setVelocity(0);
        this.timeline = this.scene.tweens.timeline({
            targets: this,
            tweens: [
                this.tw_wait2(1000, this.tm_chasePlayer.bind(this)),
                this.tw_wait2(2000, () => {this.setVelocity(0)}),
            ],
            loop: -1,
        });
        this.timeline2 = this.scene.tweens.timeline({
            targets: this,
            tweens: [
                this.tw_wait2(80, () => {this.angle = -5}),
                this.tw_wait2(80, () => {this.angle = 0}),
                this.tw_wait2(80, () => {this.angle = 5}),
                this.tw_wait2(80, () => {this.angle = 0}),
            ],
            loop: -1,
        });
    }

    majo1Timeline() {
        this.setVelocity(0);
        const timeline = {
            targets: this,
            tweens: [
                this.tw_moveY(240, 1000, this.speed, this.shoot.bind(this, this.getBullet(1))),
                this.tw_moveY(160, 1000, this.speed, this.shoot.bind(this, this.getBullet(2)), 1000),
                this.tw_moveY(240, 1000, this.speed, this.wideShoot.bind(this, this.getBullet(0), 1, 180, 12), 1000),
                this.tw_moveY(320, 1000, this.speed, this.wideShoot.bind(this, this.getBullet(0), 1, 192, 12), 1000),
                this.tw_moveY(240, 1000),
            ],
            loop: -1,
        };
        this.tw_appearBoss(timeline);
    }

    majo2Timeline() {
        this.setVelocity(0);
        const timeline = {
            targets: this,
            tweens: [
                this.tw_moveY(240, 1000, this.speed, () => {
                    this.shoot(this.getBullet(1));
                    this.shoot(this.getBullet(2));
                }),
                this.tw_moveY(160, 1000, this.speed, this.shoot.bind(this, this.getBullet(3)), 1000),
                this.tw_moveY(240, 1000, this.speed, this.wideShoot.bind(this, this.getBullet(0), 1, 180, 12), 1000),
                this.tw_moveY(320, 1000, this.speed, this.wideShoot.bind(this, this.getBullet(0), 1, 192, 12), 1000),
                this.tw_moveY(240, 1000),
            ],
            loop: -1,
        };
        this.tw_appearBoss(timeline);
    }

    majo2Timeline_Angry() {
        this.setVelocity(0);
        const timeline = {
            targets: this,
            tweens: [
                this.tw_moveY(240, 250, this.speed, () => {
                    this.shoot(this.getBullet(1));
                    this.shoot(this.getBullet(2));
                    this.wideShoot(this.getBullet(0), 1, 180, 12);
                }),
                this.tw_moveY(160, 500, this.speed, () => {
                    this.shootLoop(700, () => { this.shoot(this.chdata.bullets[3]); }, 3)
                }, 1000),
                this.tw_moveY(240, 500, this.speed, this.wideShoot.bind(this, this.getBullet(0), 2, 180, 12), 1000),
                this.tw_moveY(320, 500, this.speed, this.wideShoot.bind(this, this.getBullet(0), 2, 192, 12), 1000),
                this.tw_moveY(240, 500),
            ],
            loop: -1,
        };
        this.tw_appearBoss(timeline);
    }

    majo2HatDead() {
        for (let i=1; i<18; i++) {
            this.scene.createEnemyBullet("majo2_a01", this, {degree: i * 20, speed:300});
        }
    }

    majo2PetDead() {
        this.scene.createEnemyBullet("angry", this.parent);
        this.parent.stopAllEvents();
        this.parent.lastTwY = this.parent.x;
        this.parent.majo2Timeline_Angry();
        this.parent.killChildren(true);
    }


    //#endregion

    getBullet(index) {
        if (!this.chdata.bullets) return null;
        return this.chdata.bullets[index];
    }


    //#region 移動処理
    tw_appearBoss(timeline, callback = null) {
        this.lastTwX = this.x;
        const config = this.tw_moveX(this.scene.game.config.width * 0.75, 0, this.speed, () => {
            this.timeline = this.scene.tweens.timeline(timeline);
            if (callback) callback();
        });
        this.tweens.push(this.scene.tweens.add(config));
    }

    tw_wait(delay, callback) {
        const config = {delay: delay};
        if (callback) {
            config.callback = callback;
        }
        return config;
    }

    tw_wait2(delay, callback) {
        return {
            delay: delay,
            angle: 0,
            onComplete: callback,
        }
    }

    tw_moveX(x, delay = 0, speed = this.speed, callback = null, compDelay = 0) {
        x += this.ox;
        const dur =  1000 * Math.abs(x - (this.lastTwX || this.x)) / speed;
        //const dur =  speed / 50 * (Math.abs(x - (this.lastTwX || this.x)));
        this.lastTwX = x;
        return this.tw_move(x, null, dur, delay, callback, compDelay);
    }

    tw_moveY(y, delay = 0, speed = this.speed, callback = null, compDelay = 0) {
        y += this.oy;
        //const dur =  speed / 50 * (Math.abs(y - (this.lastTwY || this.y)));
        const dur =  1000 * Math.abs(y - (this.lastTwY || this.y)) / speed;
        this.lastTwY = y;
        return this.tw_move(null, y, dur, delay, callback, compDelay);
    }

    tw_moveXY(x, y, delay = 0, speed = this.speed, callback = null, compDelay = 0) {
        x += this.ox;
        y += this.oy;
        const dx = (this.lastTwX || this.x) - x;
        const dy = (this.lastTwY || this.y) - y;
        const dis = Math.sqrt(dx * dx + dy * dy);
        return this.tw_move(x, y, 1000 * dis / speed, delay, callback, compDelay);
    }

    tw_move(x, y, duration, delay, callback, compDelay) {
        const config = {
            targets: this,
            delay: delay,
            duration: duration,
            completeDelay: compDelay,
            onComplete: callback,
        };
        if (x) config.x = x;
        if (y) config.y = y;
        return config;
    }

    tm_chasePlayer() {
        this.tm_chaseTarget(this.scene.player);
    }

    tm_chaseTarget(target) {
        const disX = target.x - this.x;
        const disY = target.y - this.y;
        const radian = Math.atan2(disY, disX);
        this.body.velocity = this.scene.physics.velocityFromRotation(radian, this.speed);
        this.flipX = this.body.velocity.x > 0;
    }

    appearBoss(nextPhase = 1) {
        this.moveX(this.scene.game.config.width * 0.75, this.setActionPhase.bind(this, nextPhase));
    }

    moveX(x, action, speed = this.speed) {
        const dur =  1000 * Math.abs(x - this.x) / speed;
        this.tweenMove(x, null, dur, action);
    }

    moveY(y, action, speed = this.speed) {
        const dur =  1000 * Math.abs(y - this.y) / speed;
        this.tweenMove(null, y, dur, action);
    }

    move(x, y, action, speed = this.speed) {
        const dx = this.x - x;
        const dy = this.y - y;
        const dis = Math.sqrt(dx * dx + dy * dy);
        this.tweenMove(x, y, 1000 * dis / speed, action);
    }
    tweenMove(x, y, duration, action) {
        const config = {
            targets: this,
            duration: duration,
            onComplete: () => {
                if (action) action();
                this.isMove = false;
            }
        };
        if (x !== null) config.x = x;
        if (y !== null) config.y = y;
        this.tweens.push(this.scene.tweens.add(config));
        this.isMove = true;
    }

    //#endregion

    //#region ショット
    shoot(key, nextPhase = null, options = null) {
        if (!key) return;
        const blt = this.scene.createEnemyBullet(key, this, options);
        if (nextPhase) this.setActionPhase(nextPhase);
        return blt;
    }

    shootLoop(delay, callback, repeat = null) {
        const opt = {
            delay: delay,
            callback: callback,
        };
        if (repeat) opt.repeat = repeat - 1;
        else        opt.loop = true;
        this.shootLoopEvent = this.scene.time.addEvent(opt);
    }

    randomShoot(key, num, rx, ry, nextPhase = null) {
        if (!key) return;
        for (let i=0; i<num; i++) {
            const ax = Phaser.Math.Between(rx[0], rx[1]);
            const ay = Phaser.Math.Between(ry[0], ry[1]);
            this.scene.createEnemyBullet(key, this, {position: [ax, ay]});
        }
        if (nextPhase) this.setActionPhase(nextPhase);
    }

    wideShoot(key, num, baseDeg, marginDeg, nextPhase = null) {
        if (!key) return;
        this.scene.createEnemyBullet(key, this, {degree:baseDeg});
        for (let i=0; i<num; i++) {
            this.scene.createEnemyBullet(key, this, {degree:baseDeg + (i+1) * marginDeg});
            this.scene.createEnemyBullet(key, this, {degree:baseDeg + (i+1) * -marginDeg});
        }
        if (nextPhase) this.setActionPhase(nextPhase);
    }

    waitCount(delay, action) {
        this.events.push(this.scene.time.addEvent({
            delay: delay,
            callback: () => {
                if (action) action();
                this.isWait = false;
            }
        }));
        this.isWait = true;
    }

    setActionPhase(value) {
        this.actionPhase = value;
        this.actionCount = 0;
    }

    accelX(time, delta) {
        this.body.velocity.x -= this.speed * 16.66 / delta;
    }

    //#endregion
}