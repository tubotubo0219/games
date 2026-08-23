/**
 * gradient.js - グラデーションパズル(カラーパズル)
 * 数独同一形式・固定ステージ600問(Seed方式)完全対応・エラー完全修正版
 */

let gradientMode = "fixed";       // "fixed": 固定ステージ, "auto": 無限自動生成
let currentGradLevelIndex = 0;    // 0:初級(3x3), 1:中級(4x4), 2:上級(5x5), 3:超級(6x6), 4:地獄(7x7), 5:超地獄(8x8)
let currentGradStageNumber = null;// 現在プレイ中のステージ番号(各難易度100問・計600問)

const GradientGame = {
    size: 3,             // 3x3 ~ 8x8
    tiles: new Array(),  // 盤面状態
    selectedIdx: -1,     // 選択された1枚目のインデックス
    moveCount: 0,
    startTime: 0,
    timerInterval: null,
    elapsedTime: 0,
    isCleared: false,

    // 各難易度ごとのカラープリセット
    colorPresets: new Map([
        [0, { tl: new Array(231, 76, 60),  tr: new Array(241, 196, 15), bl: new Array(52, 152, 219),  br: new Array(46, 204, 113) }],
        [1, { tl: new Array(155, 89, 182), tr: new Array(230, 126, 34), bl: new Array(26, 188, 156),  br: new Array(52, 73, 94) }],
        [2, { tl: new Array(255, 107, 107), tr: new Array(78, 205, 196), bl: new Array(255, 230, 109), br: new Array(69, 92, 123) }],
        [3, { tl: new Array(255, 94, 98),  tr: new Array(45, 52, 71),   bl: new Array(255, 153, 102), br: new Array(112, 111, 211) }],
        [4, { tl: new Array(0, 242, 254),  tr: new Array(79, 172, 254),  bl: new Array(143, 211, 244), br: new Array(186, 14, 212) }],
        [5, { tl: new Array(17, 153, 142), tr: new Array(240, 147, 251), bl: new Array(56, 239, 125),  br: new Array(243, 156, 18) }]
    ]),

    init() {
        this.cacheDOM();
        const modeSelect = document.getElementById('gradient-mode-select');
        if (modeSelect) gradientMode = modeSelect.value;
        if (gradientMode === "fixed") {
            switchGradientMode();
        } else {
            startGradientGame(false);
        }
    },

    cacheDOM() {
        this.gridEl = document.getElementById("gradient-grid");
        this.statusEl = document.getElementById("gradient-status");
        this.bestMovesEl = document.getElementById("gradient-best-moves");
        this.bestTimeEl = document.getElementById("gradient-best-time");
    },

    initGradientBoard() {
        clearInterval(this.timerInterval);
        this.selectedIdx = -1;
        this.moveCount = 0;
        this.elapsedTime = 0;
        this.isCleared = false;
        this.timerInterval = null;

        this.size = currentGradLevelIndex + 3;

        this.generateGradientTiles();
        this.shuffleTilesBySeed();
        this.updateLiveStats(); 
        this.loadBestScores();
        this.render();
    },

    generateGradientTiles() {
        this.tiles = new Array();
        const size = this.size;
        const preset = this.colorPresets.get(currentGradLevelIndex);

        // ★【新設】ステージ番号をシード値にして、ベースカラーを問題ごとに変化させる計算
        let colorSeed = gradientMode === "fixed" ? (currentGradStageNumber * 555) : Date.now();
        const colorRand = () => {
            let x = Math.sin(colorSeed++) * 10000;
            return x - Math.floor(x);
        };

        // 四隅のRGB値を問題ごとに最大±80の範囲でずらして新しい色を創り出す（0〜255の範囲に収めるガード付き）
        const shiftColor = (colorArr) => {
            let r = Math.max(0, Math.min(255, colorArr.at(0) + Math.floor((colorRand() - 0.5) * 160)));
            let g = Math.max(0, Math.min(255, colorArr.at(1) + Math.floor((colorRand() - 0.5) * 160)));
            let b = Math.max(0, Math.min(255, colorArr.at(2) + Math.floor((colorRand() - 0.5) * 160)));
            return new Array(r, g, b);
        };

        // このステージ専用の新しい四隅の色を安全に生成
        const stageTl = shiftColor(preset.tl);
        const stageTr = shiftColor(preset.tr);
        const stageBl = shiftColor(preset.bl);
        const stageBr = shiftColor(preset.br);

        // 生成された新しい四隅の色をベースに、盤面全体のグラデーションを計算
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const ratioX = c / (size - 1);
                const ratioY = r / (size - 1);

                // 新しいステージカラーを適用して補間
                const topR = Math.round(stageTl.at(0) * (1 - ratioX) + stageTr.at(0) * ratioX);
                const topG = Math.round(stageTl.at(1) * (1 - ratioX) + stageTr.at(1) * ratioX);
                const topB = Math.round(stageTl.at(2) * (1 - ratioX) + stageTr.at(2) * ratioX);

                const botR = Math.round(stageBl.at(0) * (1 - ratioX) + stageBr.at(0) * ratioX);
                const botG = Math.round(stageBl.at(1) * (1 - ratioX) + stageBr.at(1) * ratioX);
                const botB = Math.round(stageBl.at(2) * (1 - ratioX) + stageBr.at(2) * ratioX);

                const finalR = Math.round(topR * (1 - ratioY) + botR * ratioY);
                const finalG = Math.round(topG * (1 - ratioY) + botG * ratioY);
                const finalB = Math.round(topB * (1 - ratioY) + botB * ratioY);

                const isFixed = (r === 0 && c === 0) || 
                                (r === 0 && c === size - 1) || 
                                (r === size - 1 && c === 0) || 
                                (r === size - 1 && c === size - 1);

                const tileObj = Object.create(null);
                Object.assign(tileObj, {
                    id: r * size + c,
                    color: `rgb(${finalR}, ${finalG}, ${finalB})`,
                    fixed: isFixed
                });
                this.tiles.push(tileObj);
            }
        }
    },

    shuffleTilesBySeed() {
        const size = this.size;
        const total = size * size;

        let seed = gradientMode === "fixed" ? (currentGradStageNumber * 123) : Date.now();
        const seededRand = () => {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        for (let i = total - 1; i > 0; i--) {
            if (this.tiles.at(i).fixed) continue;
            
            let j = Math.floor(seededRand() * (i + 1));
            while (this.tiles.at(j).fixed) {
                j = Math.floor(seededRand() * (i + 1));
            }

            if (i !== j) {
                const temp = this.tiles.at(i);
                this.tiles.fill(this.tiles.at(j), i, i + 1);
                this.tiles.fill(temp, j, j + 1);
            }
        }
    }
};

// =============================================================
// gradient.js - 後半 (操作ロジック、タイマー、描画、および画面切り替え)
// =============================================================

Object.assign(GradientGame, {
    handleTileClick(index) {
        if (this.isCleared) return;
        if (this.timerInterval === null) this.startTimer();

        const clickedTile = this.tiles.at(index);
        if (clickedTile.fixed) return;

        if (this.selectedIdx === -1) {
            this.selectedIdx = index;
        } else if (this.selectedIdx === index) {
            this.selectedIdx = -1;
        } else {
            const firstIdx = this.selectedIdx;
            this.selectedIdx = -1;

            const temp = this.tiles.at(firstIdx);
            this.tiles.fill(this.tiles.at(index), firstIdx, firstIdx + 1);
            this.tiles.fill(temp, index, index + 1);

            this.moveCount++;
            this.updateLiveStats();
            this.checkWin();
        }
        this.render();
    },

    checkWin() {
        const win = this.tiles.every((tile, i) => tile.id === i);
        if (!win) return;

        this.isCleared = true;
        clearInterval(this.timerInterval);
        
        if (gradientMode === "fixed" && currentGradStageNumber !== null) {
            saveClearedStage('gradient_cleared_stages', currentGradStageNumber);
            setTimeout(() => {
                alert(`ステージ ${currentGradStageNumber - (currentGradLevelIndex * 100)} クリア！記録を保存しました！`);
                executeBackToGradStageSelect();
            }, 100);
        } else {
            setTimeout(() => alert('グラデーションパズル（無限モード）クリア！おめでとうございます！'), 100);
        }
    },

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            this.updateLiveStats();
        }, 1000);
    },

    updateLiveStats() {
        if (!this.statusEl) this.statusEl = document.getElementById("gradient-status");
        if (this.statusEl) {
            this.statusEl.textContent = `手数: ${this.moveCount}回 / タイム: ${this.elapsedTime}秒`;
        }
    },

    loadBestScores() {
        if (typeof window.getBestScore !== "function") return;
        const keyBase = `grad_${gradientMode}_lvl${currentGradLevelIndex}_stg${currentGradStageNumber || 0}`;

        const bestMoves = window.getBestScore(`${keyBase}_moves`);
        const bestTime = window.getBestScore(`${keyBase}_time`);

        if (this.bestMovesEl) {
            this.bestMovesEl.textContent = bestMoves ? `🏆 ベスト手数: ${bestMoves.score}回` : "🏆 ベスト手数: まだ記録がありません";
        }
        if (this.bestTimeEl) {
            this.bestTimeEl.textContent = bestTime ? `⏱️ 最速タイム: ${bestTime.score}秒` : "⏱️ 最速タイム: まだ記録がありません";
        }
    },

    render() {
        if (!this.gridEl) this.gridEl = document.getElementById("gradient-grid");
        if (!this.gridEl) return;

        this.gridEl.innerHTML = "";
        this.gridEl.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;

        this.tiles.forEach((tile, i) => {
            const tileEl = document.createElement("div");
            tileEl.classList.add("gradient-tile");
            tileEl.style.backgroundColor = tile.color;

            if (tile.fixed) {
                tileEl.classList.add("fixed");
                tileEl.textContent = "•";
            } else {
                if (i === this.selectedIdx) {
                    tileEl.classList.add("selected");
                }

                // --- ★【新設】ドラッグ＆ドロップ（スマホ・PC両対応）の安全実装 ---
                // HTML5標準のドラッグ機能を利用可能にする
                tileEl.setAttribute("draggable", "true");

                // ① ドラッグ開始（掴んだとき）
                tileEl.addEventListener("dragstart", (e) => {
                    if (this.isCleared) {
                        e.preventDefault();
                        return;
                    }
                    // 掴んだタイルの位置（インデックス番号）を安全に退避
                    this.selectedIdx = i;
                    tileEl.classList.add("selected");
                    // スマホ等でのドラッグ動作を安定させるためのダミーデータ
                    Reflect.apply(Symbol.prototype.toString, Symbol("drag"), new Array());
                });

                // ② ドラッグ中（他のタイルの上に乗ったとき）
                tileEl.addEventListener("dragover", (e) => {
                    e.preventDefault(); // ドロップを受け入れるために必須の処理
                });

                // ③ ドロップ（離したとき）
                tileEl.addEventListener("drop", (e) => {
                    e.preventDefault();
                    if (this.isCleared) return;

                    const firstIdx = this.selectedIdx;
                    this.selectedIdx = -1;

                    // 1枚目と2枚目が異なり、かつどちらも固定石でない場合のみ入れ替える
                    if (firstIdx !== -1 && firstIdx !== i) {
                        if (this.timerInterval === null) this.startTimer();

                        const temp = this.tiles.at(firstIdx);
                        this.tiles.fill(this.tiles.at(i), firstIdx, firstIdx + 1);
                        this.tiles.fill(temp, i, i + 1);

                        this.moveCount++;
                        this.updateLiveStats();
                        this.checkWin();
                    }
                    this.render();
                });

                // ④ ドラッグが途中でキャンセルされたり終了したとき
                tileEl.addEventListener("dragend", () => {
                    this.selectedIdx = -1;
                    this.render();
                });

                // ⑤ 従来の「2回タップ（クリック）」での入れ替え操作もそのままサポート
                tileEl.addEventListener("click", () => this.handleTileClick(i));
            }
            this.gridEl.appendChild(tileEl);
        });
    }
});

// =============================================================
// 画面表示・切り替え用 内部ロジック関数群（数独オマージュ）
// =============================================================

function executeSwitchGradientMode() {
    const modeSelect = document.getElementById('gradient-mode-select');
    if (!modeSelect) return;
    
    gradientMode = modeSelect.value;
    if (gradientMode === "fixed") {
        document.getElementById('gradient-stage-outer').style.display = "block";
        document.getElementById('gradient-game-area').style.display = "none";
        document.getElementById('gradient-reset-btn').style.display = "none";
        document.getElementById('gradient-back-btn').style.display = "none";
        renderGradStageSelect();
    } else {
        startGradientGame(false);
    }
}

function executeChangeGradientConfig() {
    const sizeSelect = document.getElementById('gradient-size-select');
    if (!sizeSelect) return;

    currentGradLevelIndex = sizeSelect.selectedIndex;
    if (gradientMode === "fixed") {
        renderGradStageSelect();
    } else {
        startGradientGame(false);
    }
}

function startGradientGame(isFixed) {
    GradientGame.cacheDOM();

    // 画面はみ出しを防ぐため、ゲームプレイ中は選択プルダウンのみを非表示にする
    document.getElementById('gradient-mode-select').style.display = "none";
    document.getElementById('gradient-size-select').style.display = "none";
    
    // エリアの切り替え
    document.getElementById('gradient-stage-outer').style.display = "none";
    document.getElementById('gradient-game-area').style.display = "block";
    
    // コントロールボタン群の表示
    const resetBtn = document.getElementById('gradient-reset-btn');
    const backBtn = document.getElementById('gradient-back-btn');
    if (resetBtn) resetBtn.style.display = "block";
    
    // ★[修正] 固定モード・無限モードに関わらず、いつでも一覧へ戻れるように常時表示化
    if (backBtn) backBtn.style.display = "block";

    GradientGame.initGradientBoard();
}

function executeBackToGradStageSelect() {
    document.getElementById('gradient-mode-select').style.display = "block";
    document.getElementById('gradient-size-select').style.display = "block";

    document.getElementById('gradient-stage-outer').style.display = "block";
    document.getElementById('gradient-game-area').style.display = "none";
    document.getElementById('gradient-reset-btn').style.display = "none";
    document.getElementById('gradient-back-btn').style.display = "none";
    renderGradStageSelect();
}

function renderGradStageSelect() {
    const grid = document.getElementById('gradient-stage-select');
    if (!grid) return;
    grid.innerHTML = '';
    
    let start = currentGradLevelIndex * 100 + 1;
    const levelsJa = new Array("初級(3x3)", "中級(4x4)", "上級(5x5)", "超級(6x6)", "地獄(7x7)", "超地獄(8x8)");
    
    const titleEl = document.getElementById('gradient-stage-title');
    if (titleEl) {
        titleEl.innerText = `${levelsJa.at(currentGradLevelIndex)} ステージ選択 (${start}〜${start+99})`;
    }

    let clearedStages = getClearedStages('gradient_cleared_stages');
    for (let i = start; i <= start + 99; i++) {
        const btn = document.createElement('button');
        btn.className = 'stage-btn' + (clearedStages.includes(i) ? ' cleared' : '');
        btn.innerText = i - (currentGradLevelIndex * 100);
        btn.addEventListener('click', () => { 
            currentGradStageNumber = i; 
            startGradientGame(true); 
        });
        grid.appendChild(btn);
    }
}

// =============================================================
// グローバル窓口定義 (HTML側の onclick / onchange から安全に呼び出す)
// =============================================================

window.confirmResetGradient = function() {
    if (confirm(gradientMode === "fixed" ? "最初からやり直しますか？" : "新しいランダム盤面でやり直しますか？")) {
        GradientGame.initGradientBoard();
    }
};

window.initGradient = function() {
    GradientGame.cacheDOM();
    const modeSelect = document.getElementById('gradient-mode-select');
    if (modeSelect) gradientMode = modeSelect.value;
    if (gradientMode === "fixed") {
        executeSwitchGradientMode();
    } else {
        startGradientGame(false);
    }
};

window.changeGradientMode = function() {
    executeSwitchGradientMode();
};

window.changeGradientConfig = function() {
    // 👈 [修正] window側のグローバル関数名と内部関数名の競合を完全に解消
    executeChangeGradientConfig();
};

window.backToGradStageSelect = function() {
    executeBackToGradStageSelect();
};
