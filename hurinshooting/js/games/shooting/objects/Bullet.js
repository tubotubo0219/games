import ObjectBase from './ObjectBase.js';
import {BulletData} from '../../../Database.js';

/**
 * 弾クラス
 */

var uniqueBulletId = 0;
export default class Bullet extends ObjectBase {
	constructor(scene, bulletId, user, region, options) {
        const bldata = BulletData[bulletId];
        let x = bldata.x || user.x;
        let y = bldata.y || user.y;
        if (user.shootPosition && !bldata.invalidShootPosition) {
            x += user.shootPosition[0] * (user.flipX ? -1 : 1);
            y += user.shootPosition[1];
        }
        if (bldata.offset) {
            x += bldata.offset[0];
            y += bldata.offset[1];
        }
        /*
        if (user.parentContainer) {
            x += user.parentContainer.x;
            y += user.parentContainer.y;
        }
        */
        const frame = bldata.type === "sprite" ? bldata.frame : null;
		super(scene, x, y, bldata.w, bldata.h, bldata.speed, bldata.key, "Bullet", frame);

        this.region = region;
        this.bulletId = uniqueBulletId++;
        this.radius = bldata.radius;
        if (bldata.collideType) {
            if (bldata.collideType == "rect") {
                this.setRectCollision(0, 0, bldata.collideSize[0], bldata.collideSize[1]);
            }
        } else {
            this.setCollision(this.radius);
        }
        this.scene.add.existing(this);
        this.user = user;
        this.setData(bldata);
        this.huttobi = bldata.huttobi;
        this.moveFunc = bldata.moveType ? this[bldata.moveType] : this.defaultMove;
        this.count = 0;
        if (options) {
            this.speed = options.speed || this.speed;
            this.degree = options.degree;
            if (options.position) {
                this.x = options.position[0];
                this.y = options.position[1];
            }
            if (options.delay) {
                this.disappear();
                this.enableEvent = this.scene.time.addEvent({
                    delay: options.delay,
                    callback: this.appear.bind(this)
                });
            }
            this.setScale(bldata.scale * (options.scale || 1));
            if (options.scaleY) this.scaleY = options.scaleY;
            this.power *= options.powerRate || 1;
            this.hp *= options.hpRate || 1;
        } else {
            this.setScale(bldata.scale);
        }
        this.power *= user.powerRate || 1;
        this.hp *= user.bhpRate || 1;
        this.hasCoin = bldata.hasCoin || 0;
        if (bldata.type === "sprite") {
            this.play(bldata.play);
            this.scene.time.addEvent({
                delay: bldata.disappear,
                callback: this.disappear.bind(this),
            });
        }
        this.isUpdate = (bldata.update == null) ? true : bldata.update;
        this.tweens = [];
        this.events = [];
        if (bldata.timeline) {
            this[bldata.timeline]();
        }
        if (bldata.useSe) {
            this.scene.playSE(bldata.useSe);
        }
        if (bldata.isPetSkill) {
            this.isPetSkill = true;
        }
        this.bldata = bldata;
        this.objectHits = {};
	}

    setup() {
        this.x = user.x;
        this.y = user.y;

    }

    startDeadAction() {
        this.isDead = true;
        if (this.bldata.deadCreate) {
            if (this.region === "player") {
                this.scene.createPlayerBullet(this.bldata.deadCreate, this, "player");
            } else {
                this.scene.createEnemyBullet(this.bldata.deadCreate, this, "enemy");
            }
        }
        if (this.huttobi) {
            this.body.setAngularVelocity(600);
            this.body.setVelocity(600, -600);
            this.scene.gainRewards(this);
            this.scene.playSE("hit02");
            this.deadEvent = this.scene.time.addEvent({
                delay: 1200,
                callback: this.onDestroy.bind(this)
            });
        } else {
            this.onDestroy();
        }
    }

    isHitValid(target) {
        if (!super.isHitValid(target)) return false;
        if (this.bldata.hitNum) {
            this.objectHits[target.uniqueId] ||= 0;
            if (this.objectHits[target.uniqueId] >= this.bldata.hitNum) return false;
            this.objectHits[target.uniqueId]++;
        }
        return true;
    }

    onHit(target) {
        this.scene.playSE("hit01");
        super.onHit(target);
        if (this.bldata.hitAction) {
            this[this.bldata.hitAction]();
        }
    }

    onDestroy() {
        this.stopAllEvents();
        this.destroy();
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

    update(time, delta) {
        if (!this.isUpdate) return;
        if (!this.isDead) {
            this.moveFunc(time, delta);
        }
    }

    defaultMove(time, delta) {
        //this.body.setVelocity(0);
        if (!this.isMoveInit) {
            if (this.vrot) {
                this.body.setAngularVelocity(this.vrot);
            }
            if (this.degree) {
                this.body.velocity = this.scene.physics.velocityFromAngle(this.degree, this.speed);
                if (this.syncAngleWithVelocity) {
                    this.angle = this.degree + this.baseAngle;
                }
            } else {
                this.body.velocity.x = this.speed;
            }
            this.isMoveInit = true;
        }
        this.checkDestroy();
    }

    chaseUser() {
        this.x = this.user.x;
        this.y = this.user.y;
        if (this.user.parentContainer) {
            this.x += this.user.parentContainer.x;
            this.y += this.user.parentContainer.y;
        }
    }

    ufoLightMove(time, delta) {
        this.x = this.user.x;
        this.y = this.user.y + 24;
        this.scaleY += 0.02;
        this.alpha -= 0.01;
        this.body.velocity.x = this.user.body.velocity.x;
        this.body.velocity.y = this.user.body.velocity.y;
        this.deadEvent = this.scene.time.addEvent({
            delay: 2000,
            callback: this.onDestroy.bind(this)
        });
    }

    moon_wind1Move(time, delta) {
        this.scaleX += 0.01;
        this.alpha -= 0.03;
        this.x = this.user.x - this.scaleX * 48;
        this.y = this.user.y;
        this.body.velocity.x = this.user.body.velocity.x;
        this.body.velocity.y = this.user.body.velocity.y;
        this.deadEvent = this.scene.time.addEvent({
            delay: 800,
            callback: this.onDestroy.bind(this)
        });
    }

    moon_wind2Move(time, delta) {
        this.scaleX += 0.01;
        this.alpha -= 0.03;
        this.x = this.user.x + this.scaleX * 48;
        this.y = this.user.y;
        this.body.velocity.x = this.user.body.velocity.x;
        this.body.velocity.y = this.user.body.velocity.y;
        this.deadEvent = this.scene.time.addEvent({
            delay: 800,
            callback: this.onDestroy.bind(this)
        });
    }

    
    pikakumoMove(time, delta) {
        this.body.velocity.x = -this.speed;
        this.count += delta;
        if (this.count > 1000) {
            this.count = 0;
            this.scene.createEnemyBullet("pikakumo_atk", this, {degree: 90});
        }
    }

    pikakumo2Move(time, delta) {
        this.body.velocity.x = -this.speed;
        this.count += delta;
        if (this.count > 1000) {
            this.count = 0;
            this.scene.createEnemyBullet("pikakumo_atk", this, {degree: 270});
        }
    }

    baikinHoleMove(time, delta) {
        if (!this.isMoveInit) {
            this.body.setAngularVelocity(this.vrot);
            this.events.push(this.scene.time.addEvent({
                delay: 1200,
                callback: () => { this.scene.createEnemyBullet("baikin_s", this); },
            }));
            this.deadEvent = this.scene.time.addEvent({
                delay: 2000,
                callback: this.onDestroy.bind(this)
            });
    
            this.isMoveInit = true;
        }
    }

    baikinHole2Move(time, delta) {
        if (!this.isMoveInit) {
            this.body.setAngularVelocity(this.vrot);
            this.events.push(this.scene.time.addEvent({
                delay: 2000,
                loop: true,
                callback: () => { if (!this.isDead) this.scene.createEnemyBullet("baikin_s", this); },
            })); 
            this.isMoveInit = true;
        }
    }

    miminzukuWarp(time, delta) {
        if (!this.isMoveInit) {
            this.body.setAngularVelocity(this.vrot);
            this.deadEvent = this.scene.time.addEvent({
                delay: 2000,
                callback: this.onDestroy.bind(this)
            });
    
            this.isMoveInit = true;
        }
    }

    majo1HoleTimeline() {
        this.tweens.push( this.scene.tweens.add({
            targets: this,
            alpha: 1,
            angle: 3600,
            duration: 30000, 
            onComplete: () => {
                this.onDestroy();
            }
        }));
        this.events.push( this.scene.time.addEvent({
            delay: 300,
            callback: () => {
                this.scene.createEnemyBullet("majo1_a01", this, {degree: this.angle});
            },
            loop: -1,
        }));
    }

    majo2A01Timeline() {
        this.tweens.push( this.scene.tweens.add({
            targets: this,
            scale: 2.2,
            duration: 4000,
        }));
    }

    magicExplosionTimeline() {
        this.alpha = 0.2;
        this.x = this.scene.player.x;
        this.y = this.scene.player.y;
        this.tweens.push( this.scene.tweens.add({
            targets: this,
            alpha: 1,
            angle: 360,
            duration: 3000, 
            onComplete: () => {
                this.scene.createEnemyBullet("explosion", this);
                this.onDestroy();
            },
        }));
    }

    draw_2000ms() {
        this.events.push(this.scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.onDestroy();
            }
        }));
    }

    initChasePlayer(time, delta) {
        if (!this.isMoveInit) {
            const px = this.scene.player.x;
            const py = this.scene.player.y;

            const disX = px - this.x;
            const disY = py - this.y;
            const radian = Math.atan2(disY, disX);
            const degree = radian * (180 / Math.PI);
            this.body.velocity = this.scene.physics.velocityFromAngle(degree, this.speed);
            this.angle = degree - 180;
           
            this.isMoveInit = true;
        }
    }

    checkDestroy() {
        if (!this.isDead) {
            if (this.scene.game.config.width + 64 < this.x || -64 > this.x ||
                this.scene.game.config.height + 64 < this.y || -64 > this.y) {
                    this.onDestroy();
            }
        }
    }

    // hit actions
    hit_NezumiFever() {
        this.setVelocity(0);
        this.disableBody(true, false);
        for (let i=0; i<20; i++) {
            this.scene.time.addEvent({
                delay: i * 20,
                callback: () => {
                    const y = Phaser.Math.Between(0, 480);
                    const pos = [-64, y];
                    const rad = Math.atan2(this.y - y, this.x - pos[0]);
                    const blt = this.scene.createPlayerBullet("nezumiFever_nezu", this, {position:pos})
                    blt.body.velocity = this.scene.physics.velocityFromRotation(rad, blt.speed);
                }
            });
        }
        this.scene.time.addEvent({
            delay: 2000,
            callback: this.onDestroy.bind(this),
        });
    }
}
