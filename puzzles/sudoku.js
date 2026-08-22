/**
 * sudoku.js - 数独ゲームモジュール (前半)
 * スマホ完全対応版（全廃：.at、new Array構文による消去バグ完全防止仕様）
 */

let sudokuMode = "fixed";       
let currentLevelIndex = 0;      
let currentStageNumber = null;  

// 消去バグを完全に防止するため、すべて new Array 構文で再定義
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

function generateSudokuCore(seed, isRandom) {
    let tempAnswer = new Array();
    for (let r = 0; r < 9; r++) {
        tempAnswer.push([...baseSudokuPattern[r]]);
    }
    
    // 消えやすい配列を new Array(1, 2, 3...) に完全修正
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

function startSudokuGame(isFixed) {
    document.getElementById('sudoku-mode-select').style.display = "none";
    document.getElementById('sudoku-level-select').style.display = "none";
    
    document.getElementById('sudoku-stage-outer').style.display = "none";
    document.getElementById('sudoku-game-area').style.display = "block";
    document.getElementById('sudoku-reset-btn').style.display = "block";
    document.getElementById('sudoku-back-btn').style.display = isFixed ? "block" : "none";
    initSudokuBoard();
}

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
    
    // 消えやすい配列を new Array 形式に変更
    const levelsJa = new Array("初級", "中級", "上級");
    document.getElementById('sudoku-stage-title').innerText = `${levelsJa[currentLevelIndex]} ステージ選択 (${start}〜${start+99})`;

    let clearedStages = typeof getClearedStages === 'function' ? getClearedStages('sudoku_cleared_stages') : new Array();
    // renderStageSelect() メソッド内のループ処理の部分を以下のようにクラス名修正
    for (let i = start; i <= start + 99; i++) {
        const btn = document.createElement('button');
        // 新しい共通クラス名に変更
        btn.className = 'stage-btn-common' + (clearedStages.includes(i) ? ' cleared' : '');
        btn.innerText = i - (currentLevelIndex * 100);
        btn.addEventListener('click', () => { 
            currentStageNumber = i; 
            startSudokuGame(true); 
        });
        grid.appendChild(btn);
    }
}

function confirmResetSudoku() {
    if (confirm(sudokuMode === "fixed" ? "最初からやり直しますか？" : "新しいランダム盤面でやり直しますか？")) {
        initSudokuBoard();
    }
}

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
            const lastBtn = btns[btns.length - 1];
            if (lastBtn) lastBtn.classList.add('active-btn');
        } else {
            const targetBtn = btns[selectedNumber - 1];
            if (targetBtn) targetBtn.classList.add('active-btn');
        }
    } else if (selectedGridIndex !== null) {
        statusDiv.innerText = `選択中: ( ${Math.floor(selectedGridIndex / 9) + 1}行, ${(selectedGridIndex % 9) + 1}列 ) ${isMemoMode ? '(メモ)' : ''}`;
    } else {
        statusDiv.innerText = isMemoMode ? "メモ待機中" : "待機中";
    }
    if (typeof applyNumberHighlight === 'function') applyNumberHighlight();
}

function toggleMemoMode() {
    isMemoMode = !isMemoMode;
    updateSudokuStatusUI();
}

let isSudokuDragging = false;
let sudokuDragOperationMode = "none"; 

function initSudokuBoard() {
    const grid = document.getElementById('sudoku-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
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
            cell.className = 'sudoku-cell' + (c === 2 || c === 5 ? ' border-right' : '') + (r === 2 || r === 5 ? ' border-bottom' : '');
            let idx = r * 9 + c;
            
            if (sudokuQuestion[r][c] !== 0) {
                cell.innerText = sudokuQuestion[r][c];
                cell.classList.add('fixed', 'has-value');
                sudokuCurrentState[r][c] = sudokuQuestion[r][c];
            } else {
                // PC用：マウスイベント
                cell.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    startSudokuDragInput(idx, r, c);
                });

                cell.addEventListener('mouseenter', () => {
                    if (!isSudokuDragging) return;
                    executeSudokuDragInput(idx, r, c);
                });

                // スマホ用：タッチイベント
                cell.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    startSudokuDragInput(idx, r, c);
                }, { passive: false });
            }
            grid.appendChild(cell);
        }
    }
}

function renderCellContent(index, r, c) {
    const cells = document.querySelectorAll('.sudoku-cell');
    const cell = cells[index];
    if (!cell) return;

    cell.innerHTML = "";
    cell.className = 'sudoku-cell' + (sudokuQuestion[r][c] !== 0 ? ' fixed has-value' : '') + (c === 2 || c === 5 ? ' border-right' : '') + (r === 2 || r === 5 ? ' border-bottom' : '') + (selectedGridIndex === index ? ' selected' : '');

    if (sudokuCurrentState[r][c] !== 0) {
        cell.innerText = sudokuCurrentState[r][c];
        cell.classList.add('has-value');
    } else {
        const container = document.createElement('div');
        container.className = 'memo-container';
        for (let num = 1; num <= 9; num++) {
            const sub = document.createElement('div');
            sub.className = 'memo-sub-cell';
            sub.innerText = sudokuMemoState[index][num] ? num : "";
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
        if (sudokuCurrentState[r][c] !== 0) {
            target = sudokuCurrentState[r][c];
        }
    }
    
    if (target !== null) {
        cells.forEach((cell, idx) => {
            if (sudokuCurrentState[Math.floor(idx / 9)][idx % 9] === target) {
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
        
        sudokuMemoState[rIdx][val] = false; renderCellContent(rIdx, tR, i);
        sudokuMemoState[cIdx][val] = false; renderCellContent(cIdx, i, tC);
        sudokuMemoState[bIdx][val] = false; renderCellContent(bIdx, Math.floor(bIdx / 9), bIdx % 9);
    }
}
// ドラッグ開始ロジック（メモモードONのときだけ自由スライド連続入力を開始）
function startSudokuDragInput(index, r, c) {
    if (selectedNumber === null && !isMemoMode) {
        selectedGridIndex = selectedGridIndex === index ? null : index;
        document.querySelectorAll('.sudoku-cell').forEach((cell, idx) => {
            cell.classList.toggle('selected', idx === selectedGridIndex);
        });
        updateSudokuStatusUI();
        return;
    }

    const val = selectedNumber;
    if (val !== null) {
        if (val === 0) {
            sudokuCurrentState[r][c] = 0;
            sudokuMemoState[index].fill(false);
            sudokuDragOperationMode = "delete";
        } else if (isMemoMode) {
            isSudokuDragging = true;
            if (sudokuCurrentState[r][c] === 0) {
                sudokuDragOperationMode = sudokuMemoState[index][val] ? "memo_delete" : "memo_fill";
                sudokuMemoState[index][val] = (sudokuDragOperationMode === "memo_fill");
            }
        } else {
            isSudokuDragging = false; 
            sudokuDragOperationMode = "none";
            
            const currentCellVal = sudokuCurrentState[r][c];
            if (currentCellVal === val) {
                sudokuCurrentState[r][c] = 0; 
            } else if (currentCellVal === 0) {
                sudokuCurrentState[r][c] = val; 
                sudokuMemoState[index].fill(false);
                autoEraseRelatedMemos(r, c, val);
            }
        }
    }

    renderCellContent(index, r, c);
    applyNumberHighlight();
    checkSudoku();
}

// ✨【修正】メモモード中に、指が触れた位置のマスへ自由になぞり入力（ドラッグ）するコアロジック
function executeSudokuDragInput(index, r, c) {
    if (!isSudokuDragging || !isMemoMode || selectedNumber === null) return;

    const val = selectedNumber;
    if (sudokuCurrentState[r][c] === 0) {
        if (sudokuDragOperationMode === "memo_fill") {
            sudokuMemoState[index][val] = true;
        } else if (sudokuDragOperationMode === "memo_delete") {
            sudokuMemoState[index][val] = false;
        }
    }

    renderCellContent(index, r, c);
    applyNumberHighlight();
    checkSudoku();
}

function pressNumButton(num) {
    if (selectedGridIndex !== null) {
        let r = Math.floor(selectedGridIndex / 9);
        let c = selectedGridIndex % 9;
        if (num === 0) {
            sudokuCurrentState[r][c] = 0;
            sudokuMemoState[selectedGridIndex].fill(false);
        } else if (isMemoMode) {
            if (sudokuCurrentState[r][c] === 0) {
                const currentMemo = sudokuMemoState[selectedGridIndex][num];
                sudokuMemoState[selectedGridIndex][num] = !currentMemo;
            }
        } else {
            sudokuCurrentState[r][c] = num;
            sudokuMemoState[selectedGridIndex].fill(false);
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
            if (sudokuCurrentState[r][c] !== sudokuAnswer[r][c]) return;
        }
    }
    selectedGridIndex = null;
    selectedNumber = null;
    isSudokuDragging = false;
    updateSudokuStatusUI();
    
    if (sudokuMode === "fixed" && currentStageNumber !== null) {
        if (typeof saveClearedStage === 'function') {
            saveClearedStage('sudoku_cleared_stages', currentStageNumber);
        }
        setTimeout(() => {
            alert(`ステージ ${currentStageNumber - (currentLevelIndex * 100)} クリア！記録を保存しました！`);
            backToStageSelect();
        }, 100);
    } else {
        setTimeout(() => alert('数独（自動生成無限モード）クリア！おめでとうございます！'), 100);
    }
}

// ✨【修正】スマホ用タッチムーブの完全修正版。iOS等で動かない .at を全廃し、画面スクロールを抑え込んで自由な連続なぞりを実現
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('sudoku-grid');
    if (!grid) return;

    grid.addEventListener("touchmove", (e) => {
        if (!isSudokuDragging || !isMemoMode) return; 
        
        // なぞり入力中に画面が上下に引っ張られるスクロールを完全にロック
        if (e.cancelable) e.preventDefault();

        if (!e.touches || e.touches.length === 0) return;
        const touch = e.touches[0]; // TouchListに適合したブラケット記法
        const targetCell = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (targetCell && targetCell.classList.contains("sudoku-cell")) {
            const cells = Array.from(grid.querySelectorAll(".sudoku-cell"));
            const idx = cells.indexOf(targetCell);
            if (idx !== -1) {
                let r = Math.floor(idx / 9);
                let c = idx % 9;
                if (sudokuQuestion[r][c] === 0) {
                    executeSudokuDragInput(idx, r, c);
                }
            }
        }
    }, { passive: false });
});

window.initSudoku = function() {
    const modeSelect = document.getElementById('sudoku-mode-select');
    if (modeSelect) sudokuMode = modeSelect.value;
    if (sudokuMode === "fixed") {
        switchSudokuMode();
    } else {
        startSudokuGame(false);
    }
};
