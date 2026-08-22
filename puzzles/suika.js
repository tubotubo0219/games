/**
 * suika.js - スイカゲーム風マージパズル (前半)
 * 予告ズレ完全修正・箱外タッチ操作拡張・ブラケット完全排除版
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
    currentFruitType: 1, // 現在落とすフルーツ
    nextQueue: new Array(), // 5個分確保（先頭の1個が実物、残り4個が上部予告用）
    currentX: 160,       
    isPointerDown: false,
    fruits: new Array(), 
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

        // ★[操作拡張] 箱の外側（マージン部分）のタッチも拾えるようイベントの座標計算を調整
        this.canvas.addEventListener("mousedown", (e) => this.pointerStart(e.offsetX));
        this.canvas.addEventListener("mousemove", (e) => this.pointerMove(e.offsetX));
        this.canvas.addEventListener("mouseup", () => this.pointerEnd());

        // キャンバスの外でマウスを離してしまった場合の保険
        window.addEventListener("mouseup", () => {
            if (this.isPointerDown) this.pointerEnd();
        });

        this.canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const rect = e.target.getBoundingClientRect();
            const touchX = (e.touches.at(0).clientX - rect.left) * (this.canvas.width / rect.width);
            this.pointerStart(touchX);
        }, { passive: false });

        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const rect = e.target.getBoundingClientRect();
            const touchX = (e.touches.at(0).clientX - rect.left) * (this.canvas.width / rect.width);
            this.pointerMove(touchX);
        }, { passive: false });

        this.canvas.addEventListener("touchend", (e) => {
            e.preventDefault();
            this.pointerEnd();
        }, { passive: false });
    },

    resetGame() {
        clearInterval(this.gameInterval);
        this.score = 0;
        this.fruits = new Array();
        this.isGameOver = false;
        this.alertTimer = 0;
        this.isPointerDown = false;
        this.currentX = 160;

        // ★[ズレ修正] 1つの共通の予告配列に、あらかじめ5発分のフルーツをまとめて装填
        this.nextQueue = new Array();
        new Array(5).fill(0).forEach(() => {
            this.nextQueue.push(Math.floor(Math.random() * 4) + 1);
        });

        // 配列の先頭（0番目）を今回の実物にし、配列内から取り去る
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

    // ★[操作拡張] 箱の外（左右に最大40px分）まではみ出したタップ座標も、自動で端っこ（0〜320）に安全に丸める処理
    restrictX(x) {
        const preset = SuikaPresets.get(this.currentFruitType);
        const r = preset ? preset.radius : 10;
        
        // 元々は 0〜320 の中だけしかタップを認めなかった処理を、-40 〜 360 まで許容するように拡張
        const relaxedX = Math.max(-40, Math.min(360, x));
        
        // はみ出た分は自動的に壁のフチ（r 〜 320-r）にピタッと張り付く
        this.currentX = Math.max(r, Math.min(320 - r, relaxedX));
    },

    pointerEnd() {
        if (this.isGameOver || !this.isPointerDown) return;
        this.isPointerDown = false;
        this.dropFruit();
    },

    dropFruit() {
        const preset = SuikaPresets.get(this.currentFruitType);
        const newFruit = Object.create(null);
        Object.assign(newFruit, {
            type: this.currentFruitType,
            x: this.currentX,
            y: this.deadLineY - 10,
            vx: 0,
            vy: 2, 
            radius: preset.radius,
            color: preset.color
        });
        
        this.fruits.push(newFruit);

        // ★[ズレ修正] 共通配列の先頭から「次の実物」を抜き出し、末尾に新しい1発を補充して常に5発を維持
        this.currentFruitType = this.nextQueue.shift();
        this.nextQueue.push(Math.floor(Math.random() * 4) + 1);
        
        this.restrictX(this.currentX);
        this.updateUI();
    }
};

// =============================================================
// suika.js - 後半 (物理演算ループ、衝突・合体判定、絵文字描画、セーブ)
// =============================================================

Object.assign(SuikaGame, {
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
                const f1 = this.fruits.at(i);
                const f2 = this.fruits.at(j);

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
        const f1 = this.fruits.at(idx1);
        const f2 = this.fruits.at(idx2);

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
            const upgradedFruit = Object.create(null);
            Object.assign(upgradedFruit, {
                type: nextType,
                x: midX,
                y: midY,
                vx: 0,
                vy: -1, 
                radius: nextPreset.radius,
                color: nextPreset.color
            });
            this.fruits.push(upgradedFruit);
        }

        // 連打連鎖時は警告タイマーをリセット
        this.alertTimer = 0;

        this.updateUI();
        this.saveHighScore();
    },

    // ★【修正】速度チェックを完全撤廃し、物理的な位置だけで確実に3秒を測るガードロジック
    checkGameOverCondition() {
        let isOverflowing = false;

        this.fruits.forEach(f => {
            // フルーツの上端がデッドライン(60)を少しでも超えていれば、動いているかに関わらず即座に検知
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

        this.ctx.clearRect(0, 0, 320, 400);

        this.ctx.beginPath();
        this.ctx.setLineDash(new Array(6, 4));
        this.ctx.moveTo(0, this.deadLineY);
        this.ctx.lineTo(320, this.deadLineY);
        this.ctx.strokeStyle = this.alertTimer > 0 ? "#e74c3c" : "#7f8c8d"; 
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.setLineDash(new Array()); 

        this.fruits.forEach(f => {
            const preset = SuikaPresets.get(f.type);
            if (!preset) return;

            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = f.color;
            this.ctx.fill();
            this.ctx.strokeStyle = "rgba(0,0,0,0.15)";
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = `${f.radius * 1.3}px sans-serif`;
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(preset.emoji, f.x, f.y + (f.radius * 0.05));
        });

        if (!this.isGameOver && !this.isPointerDown) {
            const currentPreset = SuikaPresets.get(this.currentFruitType);
            if (currentPreset) {
                this.ctx.beginPath();
                this.ctx.arc(this.currentX, this.deadLineY - 20, currentPreset.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = currentPreset.color;
                this.ctx.fill();
                this.ctx.strokeStyle = "rgba(0,0,0,0.2)";
                this.ctx.stroke();
                
                this.ctx.fillStyle = "#ffffff";
                this.ctx.font = `${currentPreset.radius * 1.3}px sans-serif`;
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText(currentPreset.emoji, this.currentX, this.deadLineY - 20 + (currentPreset.radius * 0.05));

                this.ctx.beginPath();
                this.ctx.moveTo(this.currentX, this.deadLineY - 10);
                this.ctx.lineTo(this.currentX, 400);
                this.ctx.strokeStyle = "rgba(0,0,0,0.04)";
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        }

        if (this.isGameOver) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            this.ctx.fillRect(0, 0, 320, 400);
            this.ctx.fillStyle = "#fff";
            this.ctx.font = "bold 24px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("GAME OVER", 160, 210);
        }
    },

    updateUI() {
        if (this.statusEl) this.statusEl.textContent = `スコア: ${this.score} 点`;
        
        // ★【修正】配列の並び（左から取り出す）と、右方向の矢印の見た目の矛盾を完全に解決
        // 一番右にあるフルーツが「次に空中に出てくる実物」に直感的に一致するコンベア表示へ
        if (this.nextEl && this.nextQueue.length >= 4) {
            const em4 = SuikaPresets.get(this.nextQueue.at(3)).emoji; // 4手先
            const em3 = SuikaPresets.get(this.nextQueue.at(2)).emoji; // 3手先
            const em2 = SuikaPresets.get(this.nextQueue.at(1)).emoji; // 2手先
            const em1 = SuikaPresets.get(this.nextQueue.at(0)).emoji; // 👈 これが「次（1手先）」に落ちる実物
            
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
});

// =============================================================
// グローバル窓口定義 (HTML連動用)
// =============================================================
window.initSuika = function() {
    SuikaGame.init();
};
