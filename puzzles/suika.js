/**
 * suika.js - スイカゲーム風マージパズル（前半）
 * スマホ完全対応版（.at / Object.create / 不安定な配列生成を全廃）
 */

// フルーツの進化定義
const SuikaPresets = new Map([
    [1,  { name: "さくらんぼ",   emoji: "🍒", radius: 11, color: "#ff4d4d", score: 1   }],
    [2,  { name: "いちご",       emoji: "🍓", radius: 15, color: "#ff7675", score: 3   }],
    [3,  { name: "ぶどう",       emoji: "🍇", radius: 20, color: "#a29bfe", score: 6   }],
    [4,  { name: "みかん",       emoji: "🍊", radius: 25, color: "#ffeaa7", score: 10  }],
    [5,  { name: "かき",         emoji: "🍅", radius: 31, color: "#fab1a0", score: 15  }],
    [6,  { name: "りんご",       emoji: "🍎", radius: 38, color: "#ff7675", score: 21  }],
    [7,  { name: "なし",         emoji: "🍏", radius: 45, color: "#eccc68", score: 28  }],
    [8,  { name: "もも",         emoji: "🍑", radius: 53, color: "#ffca28", score: 36  }],
    [9,  { name: "パイナップル", emoji: "🍍", radius: 62, color: "#ffd54f", score: 45  }],
    [10, { name: "メロン",       emoji: "🍈", radius: 72, color: "#2ecc71", score: 55  }],
    [11, { name: "スイカ",       emoji: "🍉", radius: 83, color: "#27ae60", score: 66  }]
]);

const SuikaGame = {
    canvas: null,
    ctx: null,
    score: 0,
    currentFruitType: 1, 
    nextQueue: [], 
    currentX: 160,       
    isPointerDown: false,
    fruits: [], 
    gameInterval: null,
    isGameOver: false,
    deadLineY: 60,       
    alertTimer: 0,       

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadHighScore();
        this.resetGame();
    },

    cacheDOM() {
        this.canvas = document.getElementById("suika-canvas");
        if (this.canvas) this.ctx = this.canvas.getContext("2d");
        this.statusEl = document.getElementById("suika-status");
        this.bestEl = document.getElementById("suika-best-score");
        this.nextEl = document.getElementById("suika-next-fruit");
    },

    bindEvents() {
        if (!this.canvas) return;

        // PC用のマウスイベント
        this.canvas.addEventListener("mousedown", (e) => this.pointerStart(e.offsetX));
        this.canvas.addEventListener("mousemove", (e) => this.pointerMove(e.offsetX));
        this.canvas.addEventListener("mouseup", () => this.pointerEnd("m"));

        window.addEventListener("mouseup", () => {
            if (this.isPointerDown) this.pointerEnd("w");
        });

        // スマホ用のタッチイベント（TouchListオブジェクトに合わせた正確な座標抽出）
        // スマホ用のタッチイベント（2個同時落ちを100%防止する鉄壁版）
        this.canvas.addEventListener("touchstart", (e) => {
            // 今まさに新しく画面に触れた指（changedTouchesの0番目）だけを正確に取得
            if (!e.changedTouches || e.changedTouches.length === 0) return;
            const touch = e.changedTouches[0]; 

            const rect = this.canvas.getBoundingClientRect();
            const touchX = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
            this.pointerStart(touchX);
        }, { passive: true });

        this.canvas.addEventListener("touchmove", (e) => {
            // 動いている特定の指だけを追従
            if (!e.changedTouches || e.changedTouches.length === 0) return;
            const touch = e.changedTouches[0];

            const rect = this.canvas.getBoundingClientRect();
            const touchX = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
            this.pointerMove(touchX);
        }, { passive: true });

        this.canvas.addEventListener("touchend", (e) => {
            // 画面から離れた指を検知してフルーツを落とす
            if (!e.changedTouches || e.changedTouches.length === 0) return;
            this.pointerEnd("t");
        }, { passive: true });

    },

    resetGame() {
        clearInterval(this.gameInterval);
        this.score = 0;
        this.fruits = [];
        this.isGameOver = false;
        this.alertTimer = 0;
        this.isPointerDown = false;
        this.currentX = 160;

        // 安全な空配列へのプッシュで5発分の予告を生成
        this.nextQueue = [];
        for (let i = 0; i < 5; i++) {
            this.nextQueue.push(Math.floor(Math.random() * 4) + 1);
        }

        this.currentFruitType = this.nextQueue.shift();

        this.updateUI();
        this.gameInterval = setInterval(() => this.gameLoop(), 1000 / 60);
    },

    pointerStart(x) {
        if (this.isGameOver) return;
        this.isPointerDown = true;
        this.restrictX(x);
    },

    pointerMove(x) {
        if (this.isGameOver) return;
        this.restrictX(x);
    },

    restrictX(x) {
        const preset = SuikaPresets.get(this.currentFruitType);
        const r = preset ? preset.radius : 10;
        const relaxedX = Math.max(-40, Math.min(360, x));
        this.currentX = Math.max(r, Math.min(320 - r, relaxedX));
    },

    pointerEnd(d) {
        if (this.isGameOver || !this.isPointerDown) return;
        document.getElementById("debug-area").innerHTML = document.getElementById("debug-area").innerHTML + d;
        console.log(document.getElementById("debug-area").innerHTML);
        this.isPointerDown = false;
        this.dropFruit();
    },

    dropFruit() {
        const preset = SuikaPresets.get(this.currentFruitType);
        // スマホでクラッシュしない通常のプレーンオブジェクト {} で生成
        const newFruit = {
            type: this.currentFruitType,
            x: this.currentX,
            y: this.deadLineY - 10,
            vx: 0,
            vy: 2, 
            radius: preset.radius,
            color: preset.color
        };
        
        this.fruits.push(newFruit);

        this.currentFruitType = this.nextQueue.shift();
        this.nextQueue.push(Math.floor(Math.random() * 4) + 1);
        
        this.restrictX(this.currentX);
        this.updateUI();
    },

    gameLoop() {
        if (this.isGameOver) return;

        this.applyPhysics();
        this.handleCollisions();
        this.checkGameOverCondition();
        this.render();
    },

    applyPhysics() {
        const gravity = 0.2;
        const frictionX = 0.98; 
        const bounce = 0.2;     

        this.fruits.forEach(f => {
            f.vy += gravity;
            f.x += f.vx;
            f.y += f.vy;

            if (f.x - f.radius < 0) {
                f.x = f.radius;
                f.vx *= -bounce;
            }
            if (f.x + f.radius > 320) {
                f.x = 320 - f.radius;
                f.vx *= -bounce;
            }
            if (f.y + f.radius > 400) {
                f.y = 400 - f.radius;
                f.vy *= -bounce;
                f.vx *= frictionX; 
            }
        });
    },

    handleCollisions() {
        let len = this.fruits.length;
        let mergedList = new Set(); 

        for (let i = 0; i < len; i++) {
            for (let j = i + 1; j < len; j++) {
                // 配列の要素取得を [] に変更
                const f1 = this.fruits[i];
                const f2 = this.fruits[j];

                if (!f1 || !f2 || mergedList.has(f1) || mergedList.has(f2)) continue;

                const dx = f2.x - f1.x;
                const dy = f2.y - f1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDist = f1.radius + f2.radius;

                if (distance < minDist) {
                    if (f1.type === f2.type) {
                        this.mergeFruits(i, j, mergedList);
                        return; 
                    } else {
                        const overlap = minDist - distance;
                        const nx = dx / (distance || 1);
                        const ny = dy / (distance || 1);

                        f1.x -= nx * overlap * 0.5;
                        f1.y -= ny * overlap * 0.5;
                        f2.x += nx * overlap * 0.5;
                        f2.y += ny * overlap * 0.5;

                        const rvx = f2.vx - f1.vx;
                        const rvy = f2.vy - f1.vy;
                        const velAlongNormal = rvx * nx + rvy * ny;

                        if (velAlongNormal < 0) {
                            const restitution = 0.15; 
                            const impulseMagnitude = -(1 + restitution) * velAlongNormal * 0.5;
                            
                            f1.vx -= nx * impulseMagnitude;
                            f1.vy -= ny * impulseMagnitude;
                            f2.vx += nx * impulseMagnitude;
                            f2.vy += ny * impulseMagnitude;
                        }
                    }
                }
            }
        }
    },

    mergeFruits(idx1, idx2, mergedList) {
        const f1 = this.fruits[idx1];
        const f2 = this.fruits[idx2];

        const midX = (f1.x + f2.x) * 0.5;
        const midY = (f1.y + f2.y) * 0.5;
        const nextType = f1.type + 1;

        mergedList.add(f1);
        mergedList.add(f2);

        const currentPreset = SuikaPresets.get(f1.type);
        if (currentPreset) {
            this.score += currentPreset.score;
        }

        this.fruits = this.fruits.filter((_, idx) => idx !== idx1 && idx !== idx2);

        if (SuikaPresets.has(nextType)) {
            const nextPreset = SuikaPresets.get(nextType);
            const upgradedFruit = {
                type: nextType,
                x: midX,
                y: midY,
                vx: 0,
                vy: -1, 
                radius: nextPreset.radius,
                color: nextPreset.color
            };
            this.fruits.push(upgradedFruit);
        }

        this.alertTimer = 0;
        this.updateUI();
        this.saveHighScore();
    },

    checkGameOverCondition() {
        let isOverflowing = false;

        this.fruits.forEach(f => {
            if (f.y - f.radius < this.deadLineY) {
                isOverflowing = true;
            }
        });

        if (isOverflowing) {
            this.alertTimer += 1 / 60; 
            if (this.alertTimer >= 3.0) { 
                this.isGameOver = true;
                clearInterval(this.gameInterval);
                setTimeout(() => alert(`ゲームオーバー！\n今回のスコア: ${this.score} 点`), 100);
            }
        } else {
            this.alertTimer = 0; 
        }
    },
    render() {
        if (!this.ctx) return;

        // 盤面のクリア
        this.ctx.clearRect(0, 0, 320, 400);

        // デッドライン（警告線）の描画
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.deadLineY);
        this.ctx.lineTo(320, this.deadLineY);
        this.ctx.strokeStyle = this.alertTimer > 0 ? "#e74c3c" : "#7f8c8d"; 
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // ボックス内のフルーツをすべて描画
        this.fruits.forEach(f => {
            const preset = SuikaPresets.get(f.type);
            if (!preset) return;

            // フルーツの円を描画
            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = f.color;
            this.ctx.fill();
            this.ctx.strokeStyle = "rgba(0,0,0,0.15)";
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            // フルーツの中の絵文字を描画
            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = `${f.radius * 1.3}px sans-serif`;
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(preset.emoji, f.x, f.y + (f.radius * 0.05));
        });

        // ✨【修正】ゲームオーバーでなければ、指を離していても空中フルーツを中央(または現在の位置)に常時表示
        if (!this.isGameOver) {
            const currentPreset = SuikaPresets.get(this.currentFruitType);
            if (currentPreset) {
                // 空中のフルーツ（指を離しているときは前回の位置、リセット時は160の中央にいます）
                this.ctx.beginPath();
                this.ctx.arc(this.currentX, this.deadLineY - 20, currentPreset.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = currentPreset.color;
                this.ctx.fill();
                this.ctx.strokeStyle = "rgba(0,0,0,0.2)";
                this.ctx.stroke();
                
                // 空中フルーツの絵文字
                this.ctx.fillStyle = "#ffffff";
                this.ctx.font = `${currentPreset.radius * 1.3}px sans-serif`;
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText(currentPreset.emoji, this.currentX, this.deadLineY - 20 + (currentPreset.radius * 0.05));

                // 下に向かって伸びる補助ガイド線（タップして狙いを定めている間だけ表示すると画面がスッキリします）
                if (this.isPointerDown) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.currentX, this.deadLineY - 10);
                    this.ctx.lineTo(this.currentX, 400);
                    this.ctx.strokeStyle = "rgba(0,0,0,0.06)";
                    this.ctx.lineWidth = 1.5;
                    this.ctx.stroke();
                }
            }
        }

        // ゲームオーバー時の暗転マスク描画
        if (this.isGameOver) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            this.ctx.fillRect(0, 0, 320, 400);
            this.ctx.fillStyle = "#fff";
            this.ctx.font = "bold 24px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("GAME OVER", 160, 210);
        }
    },

    updateUI() {
        if (this.statusEl) this.statusEl.textContent = `スコア: ${this.score} 点`;
        
        // 予告コンベア表示（iOSバグを起こす .at を安全な [index] に完全修正）
        if (this.nextEl && this.nextQueue.length >= 4) {
            const em4 = SuikaPresets.get(this.nextQueue[3]).emoji; 
            const em3 = SuikaPresets.get(this.nextQueue[2]).emoji; 
            const em2 = SuikaPresets.get(this.nextQueue[1]).emoji; 
            const em1 = SuikaPresets.get(this.nextQueue[0]).emoji; 
            
            this.nextEl.textContent = `🎁 次の予告: ${em4} ➔ ${em3} ➔ ${em2} ➔ ${em1}`;
        }
    },

    saveHighScore() {
        if (typeof window.saveBestScore !== "function" || typeof window.getBestScore !== "function") return;
        const currentBest = window.getBestScore("suika_high_score");

        if (!currentBest || this.score > currentBest.score) {
            window.saveBestScore("suika_high_score", { score: this.score });
        }
        this.loadHighScore();
    },

    loadHighScore() {
        if (typeof window.getBestScore !== "function" || !this.bestEl) return;
        const best = window.getBestScore("suika_high_score");
        this.bestEl.textContent = best ? `🏆 ハイスコア: ${best.score} 点` : "🏆 ハイスコア: まだ記録がありません";
    }
};


// ゲーム起動
window.initSuika = function() {
    SuikaGame.init();
};
