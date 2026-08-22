/**
 * picross.js - ピクロス (イラストロジック) モジュール (前半)
 * 消去ボタン完全撤廃・2大ツール最適化・直線ドラッグ固定・ブラケット完全排除版
 */

let picrossMode = "fixed";       
let currentPicrossLevelIndex = 0;
let currentPicrossStageNumber = null; 

// AIデザインの可愛いイラスト問題集データ (ブラケット完全排除)
const PicrossStages = new Map([
    // === 初級 (5x5マス ＝ 25文字) ===
    [1, { name: "ハート", size: 5, data: "0101011111111110111000100" }],
    [2, { name: "お星さま", size: 5, data: "0010001110111110101010001" }],
    [3, { name: "バツ印", size: 5, data: "1000101010001000101010001" }],
    [4, { name: "お家", size: 5, data: "0010001110111111000111111" }],
    [5, { name: "あひる", size: 5, data: "0110001111111100111001100" }],
    [6, { name: "音符", size: 5, data: "0011000101001011110011100" }],
    [7, { name: "ドクロ", size: 5, data: "0111010101111110101001010" }],
    [8, { name: "リンゴ", size: 5, data: "0010001110111111111101010" }],

    // === 中級 (10x10マス ＝ 100文字) ===
    [101, { name: "スマイル面", size: 10, data: "0011111100010000001010100010101000000001100000000110100001010011111000001000010000111111000000111100" }],
    [102, { name: "インベーダー", size: 10, data: "0010000100000100100000111111000110111011111111111111111111110101101000001100000010000100000100001000" }],
    [103, { name: "さかな", size: 10, data: "000000010000000110100000111101000111111100111111111111111111000111111100000111101000000110100000000100" }],
    [104, { name: "剣 (ソード)", size: 10, data: "0000000001000000001100000001100000001100000001100000011100000111000000001100000000011000000000010000" }],
    [105, { name: "キノコ", size: 10, data: "0001111000001111110001110011100110111101111111111111111111110001111000000111100000011110000001111000" }],
    [106, { name: "クリーパー", size: 10, data: "1111111111111111111110011110011001111001111100111111110110111111001111111100111111111111111111111111" }],
    [107, { name: "王冠 (クラウン)", size: 10, data: "0000000000010010010001101101100111111110011111111001111111100111111110011111111011111111111111111111" }],
    [108, { name: "カップケーキ", size: 10, data: "0000010000000011100000011111000011111110011111111011111111111111111111011111111001111111100011111100" }]
]);

const PicrossGame = {
    size: 5,
    stageData: null,
    answerGrid: new Array(), 
    playerGrid: new Array(), 
    rowHints: new Array(),   
    colHints: new Array(),   
    currentTool: "fill",     // "fill"(塗り) または "batsu"(バツ) の2択に絞る
    isAnimatingClear: false, 

    // ヒント数字の灰色消しチェック状態マップ
    hintCheckedMap: new Map(),

    // 直線ドラッグ連続入力用の状態管理
    isDragging: false,
    dragStartRow: -1,
    dragStartCol: -1,
    dragDirection: "none", 
    dragOperationMode: "none", // "fill_black" | "fill_batsu" | "delete"

    init() {
        this.cacheDOM();
        
        window.addEventListener("mouseup", () => {
            this.isDragging = false;
            this.dragOperationMode = "none";
        });
        window.addEventListener("touchend", () => {
            this.isDragging = false;
            this.dragOperationMode = "none";
        });
        
        const modeSelect = document.getElementById('picross-mode-select');
        if (modeSelect) picrossMode = modeSelect.value;
        switchPicrossMode();
    },

    cacheDOM() {
        this.containerEl = document.getElementById("picross-board-container");
        this.statusEl = document.getElementById("picross-status");
        this.penBtn = document.getElementById("picross-pen-btn");
        this.xBtn = document.getElementById("picross-x-btn");
        // 消去ボタンのDOMキャッシュは撤廃
    },

    setupStageData() {
        this.size = currentPicrossLevelIndex === 0 ? 5 : 10;
        const stage = PicrossStages.get(currentPicrossStageNumber);
        
        if (!stage) {
            this.size = currentPicrossLevelIndex === 0 ? 5 : 10;
            const dummyData = this.size === 5 ? "0101011111111110111000100" : "0011111100010000001010100010101000000001100000000110100001010011111000001000010000111111000000111100";
            this.stageData = { name: `カスタムアート`, size: this.size, data: dummyData };
        } else {
            this.stageData = stage;
        }

        const size = this.size;
        const rawStr = this.stageData.data;

        this.answerGrid = new Array();
        this.playerGrid = new Array(size * size).fill(0);
        this.rowHints = new Array();
        this.colHints = new Array();
        this.hintCheckedMap.clear(); 
        this.isAnimatingClear = false; 
        this.isDragging = false;
        this.dragOperationMode = "none";

        for (let i = 0; i < size * size; i++) {
            this.answerGrid.push(parseInt(rawStr.at(i), 10));
        }

        for (let r = 0; r < size; r++) {
            let hints = new Array();
            let count = 0;
            for (let c = 0; c < size; c++) {
                if (this.answerGrid.at(r * size + c) === 1) {
                    count++;
                } else {
                    if (count > 0) { hints.push(count); count = 0; }
                }
            }
            if (count > 0) hints.push(count);
            if (hints.length === 0) hints.push(0); 
            this.rowHints.push(hints);
        }

        for (let c = 0; c < size; c++) {
            let hints = new Array();
            let count = 0;
            for (let r = 0; r < size; r++) {
                if (this.answerGrid.at(r * size + c) === 1) {
                    count++;
                } else {
                    if (count > 0) { hints.push(count); count = 0; }
                }
            }
            if (count > 0) hints.push(count);
            if (hints.length === 0) hints.push(0); 
            this.colHints.push(hints);
        }
    },

    toggleHintCheck(keyKey) {
        if (this.isAnimatingClear) return;
        const currentChecked = this.hintCheckedMap.get(keyKey) || false;
        this.hintCheckedMap.set(keyKey, !currentChecked);
        this.render();
    }
};

// =============================================================
// picross.js - 後半第1弾 (レスポンシブ描画、ご指定の3モード安全分岐条件)
// =============================================================

Object.assign(PicrossGame, {
    render() {
        if (!this.containerEl) this.containerEl = document.getElementById("picross-board-container");
        if (!this.containerEl) return;

        this.containerEl.innerHTML = "";
        
        const size = this.size;
        const totalCols = size + 1;
        this.containerEl.style.gridTemplateColumns = `repeat(${totalCols}, 1fr)`;

        // 1. 左上の空白角マスを描画
        const cornerCell = document.createElement("div");
        cornerCell.className = "picross-hint-cell corner";
        cornerCell.style.aspectRatio = "auto";
        cornerCell.style.height = "auto"; 
        cornerCell.style.minHeight = "55px"; 
        this.containerEl.appendChild(cornerCell);

        // 2. 上部（列）のヒント数字マスを描画
        for (let c = 0; c < size; c++) {
            const colHintCell = document.createElement("div");
            colHintCell.className = "picross-hint-cell col-hint";
            colHintCell.style.aspectRatio = "auto";
            colHintCell.style.height = "auto"; 
            
            colHintCell.style.display = "flex";
            colHintCell.style.flexDirection = "column";
            colHintCell.style.justifyContent = "flex-end"; 
            colHintCell.style.alignItems = "center";
            colHintCell.style.gap = "2px";                 
            colHintCell.style.minHeight = "55px";           
            colHintCell.style.padding = "6px 0";           

            if (!this.isAnimatingClear) {
                const hints = this.colHints.at(c);
                hints.forEach((num, nIdx) => {
                    const span = document.createElement("span");
                    span.textContent = num;
                    span.style.cursor = "pointer";
                    
                    span.style.lineHeight = "1";
                    span.style.fontSize = "11px"; 

                    const hintKey = `col_${c}_${nIdx}`;
                    if (this.hintCheckedMap.get(hintKey)) {
                        span.style.opacity = "0.3";
                        span.style.color = "#7f8c8d";
                        span.style.textDecoration = "line-through";
                    }

                    span.addEventListener("click", (e) => {
                        e.stopPropagation();
                        this.toggleHintCheck(hintKey);
                    });
                    colHintCell.appendChild(span);
                });
            }
            this.containerEl.appendChild(colHintCell);
        }

        // 3. 各行の「左側ヒント」と「パズル本体マス」を描画
        for (let r = 0; r < size; r++) {
            const rowHintCell = document.createElement("div");
            rowHintCell.className = "picross-hint-cell row-hint";
            rowHintCell.style.paddingRight = "4px"; 
            
            if (!this.isAnimatingClear) {
                const hints = this.rowHints.at(r);
                hints.forEach((num, nIdx) => {
                    const span = document.createElement("span");
                    span.textContent = num;
                    span.style.cursor = "pointer";
                    span.style.fontSize = "11px";

                    const hintKey = `row_${r}_${nIdx}`;
                    if (this.hintCheckedMap.get(hintKey)) {
                        span.style.opacity = "0.3";
                        span.style.color = "#7f8c8d";
                        span.style.textDecoration = "line-through";
                    }

                    span.addEventListener("click", (e) => {
                        e.stopPropagation();
                        this.toggleHintCheck(hintKey);
                    });
                    rowHintCell.appendChild(span);
                });
            }
            this.containerEl.appendChild(rowHintCell);

            for (let c = 0; c < size; c++) {
                const idx = r * size + c;
                const cellState = this.playerGrid.at(idx);

                const cell = document.createElement("div");
                cell.className = "picross-cell";
                
                if (c === 4 && size > 5) cell.classList.add("thick-right");
                if (r === 4 && size > 5) cell.classList.add("thick-bottom");

                if (cellState === 1) {
                    cell.classList.add("filled");
                } else if (cellState === 2 && !this.isAnimatingClear) {
                    cell.textContent = "×"; 
                }

                if (!this.isAnimatingClear) {
                    // ① 押した瞬間にドラッグ処理をキック
                    cell.addEventListener("mousedown", (e) => {
                        e.preventDefault();
                        this.startDragInput(idx, r, c);
                    });

                    // ② 直線スライド中の連続判定
                    cell.addEventListener("mouseenter", () => {
                        if (!this.isDragging || this.dragOperationMode === "none") return;

                        if (this.dragDirection === "none") {
                            if (r === this.dragStartRow && c !== this.dragStartCol) {
                                this.dragDirection = "row";
                            } else if (c === this.dragStartCol && r !== this.dragStartRow) {
                                this.dragDirection = "col";
                            }
                        }

                        if (this.dragDirection === "row" && r === this.dragStartRow) {
                            this.executeDragInput(idx);
                        } else if (this.dragDirection === "col" && c === this.dragStartCol) {
                            this.executeDragInput(idx);
                        }
                    });

                    // スマホ対応
                    cell.addEventListener("touchstart", (e) => {
                        e.preventDefault();
                        this.startDragInput(idx, r, c);
                    }, { passive: false });
                }
                this.containerEl.appendChild(cell);
            }
        }

        // スマホ用タッチムーブ監視
        if (!this.isAnimatingClear) {
            this.containerEl.addEventListener("touchmove", (e) => {
                if (!this.isDragging || this.dragOperationMode === "none") return;
                const touch = e.touches.at(0);
                const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
                if (targetEl && targetEl.classList.contains("picross-cell")) {
                    const cellsArr = Array.from(this.containerEl.querySelectorAll(".picross-cell"));
                    const targetIdx = cellsArr.indexOf(targetEl);
                    if (targetIdx !== -1) {
                        const targetR = Math.floor(targetIdx / size);
                        const targetC = targetIdx % size;

                        if (this.dragDirection === "none") {
                            if (targetR === this.dragStartRow && targetC !== this.dragStartCol) this.dragDirection = "row";
                            else if (targetC === this.dragStartCol && targetR !== this.dragStartRow) this.dragDirection = "col";
                        }

                        if (this.dragDirection === "row" && targetR === this.dragStartRow) {
                            this.executeDragInput(targetIdx);
                        } else if (this.dragDirection === "col" && targetC === this.dragStartCol) {
                            this.executeDragInput(targetIdx);
                        }
                    }
                }
            }, { passive: false });
        }

        this.updateToolUI();
    },

        switchTool(tool) {
        if (this.isAnimatingClear) return;
        this.currentTool = tool;
        this.updateToolUI();
    },

    updateToolUI() {
        if (!this.penBtn || !this.xBtn) return;
        
        this.penBtn.classList.remove("memo-active-btn");
        this.xBtn.classList.remove("memo-active-btn");

        if (this.currentTool === "fill") this.penBtn.classList.add("memo-active-btn");
        if (this.currentTool === "batsu") this.xBtn.classList.add("memo-active-btn");

        if (this.statusEl) {
            if (this.isAnimatingClear) {
                this.statusEl.textContent = `✨🎉 イラスト「${this.stageData.name}」完成！ 🎉✨`;
            } else {
                const toolJa = this.currentTool === "fill" ? "塗りつぶし (■)" : "バツマーク (×)";
                this.statusEl.textContent = `選択中のツール: [ ${toolJa} ]`;
            }
        }
    },

    handleCellClick(index) {
        if (this.isAnimatingClear) return;
        this.handleCellInput(index, Math.floor(index / this.size), index % this.size);
    },

    // ★【修正】ご指定いただいた3モード条件分岐判定のコアアルゴリズム
    startDragInput(index, r, c) {
        const currentState = this.playerGrid.at(index);
        
        this.isDragging = true;
        this.dragStartRow = r;
        this.dragStartCol = c;
        this.dragDirection = "none";

        // 1. 塗り（■）を選択している時
        if (this.currentTool === "fill") {
            if (currentState === 0) {
                this.dragOperationMode = "fill_black"; // 白なら塗り開始
            } else if (currentState === 1) {
                this.dragOperationMode = "delete_black"; // 黒なら黒のみを消し開始
            } else {
                this.dragOperationMode = "none"; // ×なら操作なし
            }
        } 
        // 2. バツ（×）を選択している時
        else if (this.currentTool === "batsu") {
            if (currentState === 0) {
                this.dragOperationMode = "fill_batsu"; // 白なら×開始
            } else if (currentState === 2) {
                this.dragOperationMode = "delete_batsu"; // ×なら×のみを消し開始
            } else {
                this.dragOperationMode = "none"; // 黒なら操作なし
            }
        } else {
            this.dragOperationMode = "none";
        }

        // 1マス目の入力反映
        this.executeDragInput(index);
    },

    // 決定された動作モードに基づいて、指定条件に合うマスだけを連続処理する
    executeDragInput(index) {
        if (!this.isDragging || this.isAnimatingClear || this.dragOperationMode === "none") return;
        
        const currentState = this.playerGrid.at(index);
        let nextState = currentState;

        // A. 塗りモード：白マスだけを黒（1）にする
        if (this.dragOperationMode === "fill_black" && currentState === 0) {
            nextState = 1;
        } 
        // B. バツモード：白マスだけをバツ（2）にする
        else if (this.dragOperationMode === "fill_batsu" && currentState === 0) {
            nextState = 2;
        } 
        // C. 黒消しモード：黒マス（1）だけを白（0）に戻す（バツは壊さない）
        else if (this.dragOperationMode === "delete_black" && currentState === 1) {
            nextState = 0;
        }
        // D. バツ消しモード：バツマス（2）だけを白（0）に戻す（黒は壊さない）
        else if (this.dragOperationMode === "delete_batsu" && currentState === 2) {
            nextState = 0;
        }

        if (nextState !== currentState) {
            this.playerGrid.fill(nextState, index, index + 1);
            this.render();
            this.checkWinCondition();
        }
    },

    checkWinCondition() {
        const isWin = this.playerGrid.every((state, idx) => {
            const answer = this.answerGrid.at(idx);
            return answer === 1 ? state === 1 : state !== 1;
        });

        if (!isWin) return;

        this.isDragging = false;
        this.isAnimatingClear = true;
        this.render();

        saveClearedStage('picross_cleared_stages', currentPicrossStageNumber);
        
        setTimeout(() => {
            alert(`おめでとうございます！\nイラスト「${this.stageData.name}」が完成しました！`);
            executeBackToPicrossStageSelect();
        }, 2500); 
    }
});

// =============================================================
// 画面表示・難易度切り替え用 内部ロジック関数群 (数独共通設計)
// =============================================================

function executeSwitchPicrossMode() {
    const modeSelect = document.getElementById('picross-mode-select');
    if (!modeSelect) return;
    
    picrossMode = modeSelect.value;
    if (picrossMode === "fixed") {
        document.getElementById('picross-stage-outer').style.display = "block";
        document.getElementById('picross-game-area').style.display = "none";
        document.getElementById('picross-reset-btn').style.display = "none";
        document.getElementById('picross-back-btn').style.display = "none";
        renderPicrossStageSelect();
    }
}

function executeChangePicrossConfig() {
    const sizeSelect = document.getElementById('picross-size-select');
    if (!sizeSelect) return;

    currentPicrossLevelIndex = sizeSelect.selectedIndex;
    if (picrossMode === "fixed") {
        renderPicrossStageSelect();
    }
}

function startPicrossGame(isFixed) {
    PicrossGame.cacheDOM();

    document.getElementById('picross-mode-select').style.display = "none";
    document.getElementById('picross-size-select').style.display = "none";
    
    document.getElementById('picross-stage-outer').style.display = "none";
    document.getElementById('picross-game-area').style.display = "block";
    
    const resetBtn = document.getElementById('picross-reset-btn');
    const backBtn = document.getElementById('picross-back-btn');
    if (resetBtn) resetBtn.style.display = "block";
    if (backBtn) backBtn.style.display = isFixed ? "block" : "none";

    PicrossGame.setupStageData();
    PicrossGame.render();
}

function executeBackToPicrossStageSelect() {
    document.getElementById('picross-mode-select').style.display = "block";
    document.getElementById('picross-size-select').style.display = "block";

    document.getElementById('picross-stage-outer').style.display = "block";
    document.getElementById('picross-game-area').style.display = "none";
    document.getElementById('picross-reset-btn').style.display = "none";
    document.getElementById('picross-back-btn').style.display = "none";
    renderPicrossStageSelect();
}

function renderPicrossStageSelect() {
    const grid = document.getElementById('picross-stage-select');
    if (!grid) return;
    grid.innerHTML = '';
    
    let start = currentPicrossLevelIndex * 100 + 1;
    const levelsJa = new Array("初級(5x5)", "中級(10x10)");
    
    const titleEl = document.getElementById('picross-stage-title');
    if (titleEl) {
        titleEl.innerText = `${levelsJa.at(currentPicrossLevelIndex)} ステージ選択 (${start}〜${start+99})`;
    }

    let clearedStages = getClearedStages('picross_cleared_stages');
    for (let i = start; i <= start + 99; i++) {
        const btn = document.createElement('button');
        
        const hasProblem = PicrossStages.has(i);
        if (hasProblem) {
            btn.className = 'stage-btn' + (clearedStages.includes(i) ? ' cleared' : '');
            btn.innerText = i - (currentPicrossLevelIndex * 100);
            btn.addEventListener('click', () => { 
                currentPicrossStageNumber = i; 
                startPicrossGame(true); 
            });
        } else {
            btn.className = 'stage-btn';
            btn.style.backgroundColor = "#e2e8f0";
            btn.style.color = "#94a3b8";
            btn.style.borderColor = "#cbd5e1";
            btn.style.cursor = "not-allowed";
            btn.innerText = "-"; 
            btn.disabled = true;
        }
        grid.appendChild(btn);
    }
}

// =============================================================
// 共通グローバル窓口定義 (HTML要素側インターフェース)
// =============================================================

window.confirmResetPicross = function() {
    if (PicrossGame.isAnimatingClear) return;
    if (confirm("現在の盤面をクリアして最初から解き直しますか？")) {
        PicrossGame.playerGrid.fill(0);
        PicrossGame.render();
    }
};

window.initPicross = function() {
    PicrossGame.cacheDOM();
    executeSwitchPicrossMode();
};

window.changePicrossMode = function() {
    executeSwitchPicrossMode();
};

window.changePicrossConfig = function() {
    executeChangePicrossConfig();
};

window.backToPicrossStageSelect = function() {
    executeBackToPicrossStageSelect();
};

window.switchPicrossTool = function(tool) {
    PicrossGame.switchTool(tool);
};

// ★【修正】画面のどこで離されても、ドラッグ状態と動作モードを100%確実にリセット終了させる
window.addEventListener("mouseup", () => {
    PicrossGame.isDragging = false;
    PicrossGame.dragOperationMode = "none";
});
window.addEventListener("touchend", () => {
    PicrossGame.isDragging = false;
    PicrossGame.dragOperationMode = "none";
});
