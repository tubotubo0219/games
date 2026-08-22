// =============================================================
// 数独 ゲームロジックファイル (sudoku.js - 前半)
// =============================================================

let sudokuMode = "fixed";       // "fixed": 固定ステージ, "auto": 無限自動生成
let currentLevelIndex = 0;      // 0:初級, 1:中級, 2:上級
let currentStageNumber = null;  // 現在プレイ中のステージ番号(1〜300)

const baseSudokuPattern = new Array(
    new Array(5, 3, 4, 6, 7, 8, 9, 1, 2),
    new Array(6, 7, 2, 1, 9, 5, 3, 4, 8),
    new Array(1, 9, 8, 3, 4, 2, 5, 6, 7),
    new Array(8, 5, 9, 7, 6, 1, 4, 2, 3),
    new Array(4, 2, 6, 8, 5, 3, 7, 9, 1),
    new Array(7, 1, 3, 9, 2, 4, 8, 5, 6),
    new Array(9, 6, 1, 5, 3, 7, 2, 8, 4),
    new Array(2, 8, 7, 4, 1, 9, 6, 3, 5),
    new Array(3, 4, 5, 2, 8, 6, 1, 7, 9)
);

let sudokuAnswer = new Array();
let sudokuQuestion = new Array();
let sudokuCurrentState = new Array(); 
let sudokuMemoState = new Array();    

let selectedGridIndex = null;   
let selectedNumber = null;      
let isMemoMode = false;              

function seededRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// 盤面生成のコア処理
function generateSudokuCore(seed, isRandom) {
    let tempAnswer = new Array();
    for (let r = 0; r < 9; r++) {
        tempAnswer.push([...baseSudokuPattern[r]]);
    }
    
    let numMap = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
    for (let i = 8; i > 0; i--) {
        let j = isRandom ? Math.floor(Math.random() * (i + 1)) : Math.floor(seededRandom(seed++) * (i + 1));
        let t = numMap[i]; numMap[i] = numMap[j]; numMap[j] = t;
    }
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            tempAnswer[r][c] = numMap[tempAnswer[r][c] - 1];
        }
    }
    sudokuAnswer = tempAnswer;

    let hCount = currentLevelIndex === 0 ? 35 : (currentLevelIndex === 1 ? 45 : 55);
    let tempQuestion = sudokuAnswer.map(r => [...r]);
    let cellIndices = Array.from(new Array(81).keys());
    
    if (isRandom) {
        cellIndices.sort(() => Math.random() - 0.5);
    } else {
        cellIndices.sort(() => seededRandom(seed++) - 0.5);
    }
    
    for (let i = 0; i < hCount; i++) {
        let idx = cellIndices[i];
        tempQuestion[Math.floor(idx / 9)][idx % 9] = 0;
    }
    sudokuQuestion = tempQuestion;
}

// モード切り替え制御
function switchSudokuMode() {
    sudokuMode = document.getElementById('sudoku-mode-select').value;
    if (sudokuMode === "fixed") {
        document.getElementById('sudoku-stage-outer').style.display = "block";
        document.getElementById('sudoku-game-area').style.display = "none";
        document.getElementById('sudoku-reset-btn').style.display = "none";
        document.getElementById('sudoku-back-btn').style.display = "none";
        renderStageSelect();
    } else {
        startSudokuGame(false);
    }
}

function changeSudokuLevel() {
    currentLevelIndex = parseInt(document.getElementById('sudoku-level-select').value);
    if (sudokuMode === "fixed") {
        renderStageSelect();
    } else {
        startSudokuGame(false);
    }
}

// ★修正：ゲーム開始時にプルダウンメニュー二つを完全に非表示にします
function startSudokuGame(isFixed) {
    document.getElementById('sudoku-mode-select').style.display = "none";
    document.getElementById('sudoku-level-select').style.display = "none";
    
    document.getElementById('sudoku-stage-outer').style.display = "none";
    document.getElementById('sudoku-game-area').style.display = "block";
    document.getElementById('sudoku-reset-btn').style.display = "block";
    document.getElementById('sudoku-back-btn').style.display = isFixed ? "block" : "none";
    initSudokuBoard();
}

// ★修正：ステージ選択一覧に戻ったときにプルダウンメニューを再表示します
function backToStageSelect() {
    document.getElementById('sudoku-mode-select').style.display = "block";
    document.getElementById('sudoku-level-select').style.display = "block";

    document.getElementById('sudoku-stage-outer').style.display = "block";
    document.getElementById('sudoku-game-area').style.display = "none";
    document.getElementById('sudoku-reset-btn').style.display = "none";
    document.getElementById('sudoku-back-btn').style.display = "none";
    renderStageSelect();
}

function renderStageSelect() {
    const grid = document.getElementById('sudoku-stage-select');
    grid.innerHTML = '';
    let start = currentLevelIndex * 100 + 1;
    const levelsJa = new Array("初級", "中級", "上級");
    document.getElementById('stage-title').innerText = `${levelsJa[currentLevelIndex]} ステージ選択 (${start}〜${start+99})`;

    let clearedStages = getClearedStages('sudoku_cleared_stages');
    for (let i = start; i <= start + 99; i++) {
        const btn = document.createElement('button');
        btn.className = 'stage-btn' + (clearedStages.includes(i) ? ' cleared' : '');
        btn.innerText = i - (currentLevelIndex * 100);
        btn.addEventListener('click', () => { 
            currentStageNumber = i; 
            startSudokuGame(true); 
        });
        grid.appendChild(btn);
    }
}
// =============================================================
// sudoku.js - 後半第1弾 (UI更新、メモトグル、およびドラッグ状態変数)
// =============================================================

function confirmResetSudoku() {
    if (confirm(sudokuMode === "fixed" ? "最初からやり直しますか？" : "新しいランダム盤面でやり直しますか？")) {
        initSudokuBoard();
    }
}

// 描画・UI更新・ハイライト
function updateSudokuStatusUI() {
    const statusDiv = document.getElementById('sudoku-status');
    if (!statusDiv) return;

    document.querySelectorAll('.num-btn').forEach(btn => btn.classList.remove('active-btn'));
    
    const memoBtn = document.getElementById('memo-btn');
    if (memoBtn) {
        memoBtn.className = 'num-btn toggle-btn' + (isMemoMode ? ' memo-active-btn' : '');
        memoBtn.innerText = isMemoMode ? "メモ: オン" : "メモ: オフ";
    }
    
    if (selectedNumber !== null) {
        statusDiv.innerText = `連続入力: [ ${selectedNumber === 0 ? "消去" : selectedNumber} ] ${isMemoMode ? '(メモ)' : ''}`;
        const btns = document.querySelectorAll('.num-btn');
        if (selectedNumber === 0) {
            const lastBtn = btns.item(btns.length - 1);
            if (lastBtn) lastBtn.classList.add('active-btn');
        } else {
            const targetBtn = btns.item(selectedNumber - 1);
            if (targetBtn) targetBtn.classList.add('active-btn');
        }
    } else if (selectedGridIndex !== null) {
        statusDiv.innerText = `選択中: ( ${Math.floor(selectedGridIndex / 9) + 1}行, ${(selectedGridIndex % 9) + 1}列 ) ${isMemoMode ? '(メモ)' : ''}`;
    } else {
        statusDiv.innerText = isMemoMode ? "メモ待機中" : "待機中";
    }
    applyNumberHighlight();
}

function toggleMemoMode() {
    isMemoMode = !isMemoMode;
    updateSudokuStatusUI();
}

// ★【新設】数独のメモスライド（ドラッグ）連続入力用の状態管理変数
let isSudokuDragging = false;
let sudokuDragOperationMode = "none"; // "memo_fill" (メモ書き込み) | "memo_delete" (メモ消去) | "none"

function initSudokuBoard() {
    const grid = document.getElementById('sudoku-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    // モードに応じて正確に配列データを生成
    if (sudokuMode === "fixed" && currentStageNumber !== null) {
        generateSudokuCore(currentStageNumber * 100, false);
    } else {
        generateSudokuCore(0, true);
    }

    selectedGridIndex = null;
    selectedNumber = null;
    isMemoMode = false;
    isSudokuDragging = false;
    sudokuDragOperationMode = "none";
    updateSudokuStatusUI();
    
    sudokuCurrentState = Array.from(new Array(9), () => new Array(9).fill(0));
    sudokuMemoState = Array.from(new Array(81), () => new Array(10).fill(false));

    // ★PCマウスの画面外での離しをキャッチする安全用のグローバルガードをここに配備
    window.addEventListener("mouseup", () => {
        isSudokuDragging = false;
        sudokuDragOperationMode = "none";
    });
    window.addEventListener("touchend", () => {
        isSudokuDragging = false;
        sudokuDragOperationMode = "none";
    });

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell' + (c===2||c===5 ? ' border-right' : '') + (r===2||r===5 ? ' border-bottom' : '');
            let idx = r * 9 + c;
            
            if (sudokuQuestion.at(r).at(c) !== 0) {
                cell.innerText = sudokuQuestion.at(r).at(c);
                cell.classList.add('fixed', 'has-value');
                sudokuCurrentState.at(r).fill(sudokuQuestion.at(r).at(c), c, c + 1);
            } else {
                // ★【修正】ドラッグ入力開始のイベントを配置（後半の2回目でロジックをドッキング）
                cell.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    startSudokuDragInput(idx, r, c);
                });

                cell.addEventListener('mouseenter', () => {
                    if (!isSudokuDragging) return;
                    executeSudokuDragInput(idx, r, c);
                });

                cell.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    startSudokuDragInput(idx, r, c);
                }, { passive: false });
            }
            grid.appendChild(cell);
        }
    }
}

// =============================================================
// sudoku.js - 後半第2弾 (セル描画、メモ特化型ドラッグロジック、クリア判定)
// =============================================================

function renderCellContent(index, r, c) {
    const cells = document.querySelectorAll('.sudoku-cell');
    const cell = cells.item(index);
    if (!cell) return;

    cell.innerHTML = "";
    cell.className = 'sudoku-cell' + (sudokuQuestion.at(r).at(c) !== 0 ? ' fixed has-value' : '') + (c === 2 || c === 5 ? ' border-right' : '') + (r === 2 || r === 5 ? ' border-bottom' : '') + (selectedGridIndex === index ? ' selected' : '');

    if (sudokuCurrentState.at(r).at(c) !== 0) {
        cell.innerText = sudokuCurrentState.at(r).at(c);
        cell.classList.add('has-value');
    } else {
        const container = document.createElement('div');
        container.className = 'memo-container';
        for (let num = 1; num <= 9; num++) {
            const sub = document.createElement('div');
            sub.className = 'memo-sub-cell';
            sub.innerText = sudokuMemoState.at(index).at(num) ? num : "";
            container.appendChild(sub);
        }
        cell.appendChild(container);
    }
}

function applyNumberHighlight() {
    const cells = document.querySelectorAll('.sudoku-cell');
    cells.forEach(c => c.classList.remove('same-number-highlight'));
    
    let target = null;
    if (selectedNumber !== null && selectedNumber !== 0) {
        target = selectedNumber;
    } else if (selectedGridIndex !== null) {
        let r = Math.floor(selectedGridIndex / 9);
        let c = selectedGridIndex % 9;
        if (sudokuCurrentState.at(r).at(c) !== 0) {
            target = sudokuCurrentState.at(r).at(c);
        }
    }
    
    if (target !== null) {
        cells.forEach((cell, idx) => {
            if (sudokuCurrentState.at(Math.floor(idx / 9)).at(idx % 9) === target) {
                cell.classList.add('same-number-highlight');
            }
        });
    }
}

function autoEraseRelatedMemos(tR, tC, val) {
    let sR = Math.floor(tR / 3) * 3;
    let sC = Math.floor(tC / 3) * 3;
    for (let i = 0; i < 9; i++) {
        let rIdx = tR * 9 + i;
        let cIdx = i * 9 + tC;
        let bIdx = (sR + Math.floor(i / 3)) * 9 + (sC + (i % 3));
        
        sudokuMemoState.at(rIdx).fill(false, val, val + 1); renderCellContent(rIdx, tR, i);
        sudokuMemoState.at(cIdx).fill(false, val, val + 1); renderCellContent(cIdx, i, tC);
        sudokuMemoState.at(bIdx).fill(false, val, val + 1); renderCellContent(bIdx, Math.floor(bIdx / 9), bIdx % 9);
    }
}

// ★【修正】通常モードでのスライド誤入力を物理的に100%防ぐドラッグ開始ロジック
function startSudokuDragInput(index, r, c) {
    // 連続入力の数字も選ばれておらず、メモモードもOFFのときは通常のセル選択（単発）
    if (selectedNumber === null && !isMemoMode) {
        selectedGridIndex = selectedGridIndex === index ? null : index;
        document.querySelectorAll('.sudoku-cell').forEach((cell, idx) => {
            cell.classList.toggle('selected', idx === selectedGridIndex);
        });
        updateSudokuStatusUI();
        return;
    }

    // 1マス目の単発入力をその場で安全に実行
    const val = selectedNumber;
    if (val !== null) {
        if (val === 0) {
            sudokuCurrentState.at(r).fill(0, c, c + 1);
            sudokuMemoState.at(index).fill(false);
            sudokuDragOperationMode = "delete";
        } else if (isMemoMode) {
            // ★メモモードONのときだけ、スライド連続入力のフラグを立てて許可する！
            isSudokuDragging = true;
            if (sudokuCurrentState.at(r).at(c) === 0) {
                sudokuDragOperationMode = sudokuMemoState.at(index).at(val) ? "memo_delete" : "memo_fill";
                sudokuMemoState.at(index).fill(sudokuDragOperationMode === "memo_fill", val, val + 1);
            }
        } else {
            // ★通常の数字入力モード（メモ:オフ）のときは、1マスだけ入力してドラッグは「禁止（false）」にする！
            isSudokuDragging = false; 
            sudokuDragOperationMode = "none";
            
            const currentCellVal = sudokuCurrentState.at(r).at(c);
            if (currentCellVal === val) {
                sudokuCurrentState.at(r).fill(0, c, c + 1); // 同じ数字なら消去（トグル）
            } else if (currentCellVal === 0) {
                sudokuCurrentState.at(r).fill(val, c, c + 1); // 空白なら数字を書き込む
                sudokuMemoState.at(index).fill(false);
                autoEraseRelatedMemos(r, c, val);
            }
        }
    }

    renderCellContent(index, r, c);
    applyNumberHighlight();
    checkSudoku();
}

// ★【修正】メモモード以外での通過（スライド）は完全に無視するガードロジック
function executeSudokuDragInput(index, r, c) {
    // ドラッグフラグが立っていない、またはメモモードがオフのときは絶対に連続入力を遮断する
    if (!isSudokuDragging || !isMemoMode || selectedNumber === null) return;

    const val = selectedNumber;
    // 確定数字がすでに入っているマスはメモ書き換えの対象外（安全ガード）
    if (sudokuCurrentState.at(r).at(c) === 0) {
        if (sudokuDragOperationMode === "memo_fill") {
            sudokuMemoState.at(index).fill(true, val, val + 1);
        } else if (sudokuDragOperationMode === "memo_delete") {
            sudokuMemoState.at(index).fill(false, val, val + 1);
        }
    }

    renderCellContent(index, r, c);
    applyNumberHighlight();
    checkSudoku();
}

// 操作入力ボタン
function pressNumButton(num) {
    if (selectedGridIndex !== null) {
        let r = Math.floor(selectedGridIndex / 9);
        let c = selectedGridIndex % 9;
        if (num === 0) {
            sudokuCurrentState.at(r).fill(0, c, c + 1);
            sudokuMemoState.at(selectedGridIndex).fill(false);
        } else if (isMemoMode) {
            if (sudokuCurrentState.at(r).at(c) === 0) {
                const currentMemo = sudokuMemoState.at(selectedGridIndex).at(num);
                sudokuMemoState.at(selectedGridIndex).fill(!currentMemo, num, num + 1);
            }
        } else {
            sudokuCurrentState.at(r).fill(num, c, c + 1);
            sudokuMemoState.at(selectedGridIndex).fill(false);
            renderCellContent(selectedGridIndex, r, c);
            autoEraseRelatedMemos(r, c, num);
        }
        renderCellContent(selectedGridIndex, r, c);
        applyNumberHighlight();
        checkSudoku();
    } else {
        selectedNumber = selectedNumber === num ? null : num;
        updateSudokuStatusUI();
    }
}

function checkSudoku() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (sudokuCurrentState.at(r).at(c) !== sudokuAnswer.at(r).at(c)) return;
        }
    }
    selectedGridIndex = null;
    selectedNumber = null;
    isSudokuDragging = false;
    updateSudokuStatusUI();
    
    if (sudokuMode === "fixed" && currentStageNumber !== null) {
        saveClearedStage('sudoku_cleared_stages', currentStageNumber);
        setTimeout(() => {
            alert(`ステージ ${currentStageNumber - (currentLevelIndex * 100)} クリア！記録を保存しました！`);
            backToStageSelect();
        }, 100);
    } else {
        setTimeout(() => alert('数独（自動生成無限モード）クリア！おめでとうございます！'), 100);
    }
}

// スマホ用タッチムーブ判定（こちらもメモモードONのときだけ追従する安全仕様）
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('sudoku-grid');
    if (!grid) return;

    grid.addEventListener("touchmove", (e) => {
        if (!isSudokuDragging || !isMemoMode) return; // メモオフなら即座に処理拒否
        const touch = e.touches.at(0);
        const targetCell = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (targetCell && targetCell.classList.contains("sudoku-cell")) {
            const cells = Array.from(grid.querySelectorAll(".sudoku-cell"));
            const idx = cells.indexOf(targetCell);
            if (idx !== -1) {
                let r = Math.floor(idx / 9);
                let c = idx % 9;
                if (sudokuQuestion.at(r).at(c) === 0) {
                    executeSudokuDragInput(idx, r, c);
                }
            }
        }
    }, { passive: false });
});

// 起動時の初期呼び出し
window.initSudoku = function() {
    const modeSelect = document.getElementById('sudoku-mode-select');
    if (modeSelect) sudokuMode = modeSelect.value;
    if (sudokuMode === "fixed") {
        switchSudokuMode();
    } else {
        startSudokuGame(false);
    }
};
