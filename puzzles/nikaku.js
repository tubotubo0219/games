// =============================================================
// 2角パズル ゲームロジックファイル (nikaku.js - 前半)
// =============================================================

let nikakuRows = 6, nikakuCols = 4;
let gridRows = 8, gridCols = 6; 
let nikakuGrid = new Array();
let selectedNikakuCard = null;

// タイマーとシャッフル制限の設定
let nikakuShuffleLeft = 1;      // 最大1回に制限
let nikakuTimeElapsed = 0;
let nikakuTimerInterval = null;
let isNikakuGameActive = false;
let hasUsedShuffle = false;     // シャッフルを使ったかどうかのフラグ

const nikakuEmojiPool = "🍎,🍌,🍇,🍉,🍓,🍒,🍍,🍊,🥝,🍋,🍈,🍅,🍆,🥕,🌽,🌶,🍄,🌰,🧁,🍩,🍭,🍕,🍔,🍟".split(",");

function changeNikakuSize() {
    const sizeVal = document.getElementById('nikaku-size-select').value;
    if (sizeVal === "easy") { nikakuRows = 6; nikakuCols = 4; }
    else if (sizeVal === "normal") { nikakuRows = 8; nikakuCols = 6; }
    else { nikakuRows = 10; nikakuCols = 8; } // 上級のサイズ
    initNikaku();
}

// 自己ベストスコアの読み込みと表示
function displayNikakuBestScores() {
    const keyBase = "nikaku_best_" + nikakuRows + "_" + nikakuCols;
    const bestNoShuffle = localStorage.getItem(keyBase + "_noshuffle");
    const bestShuffle = localStorage.getItem(keyBase + "_shuffle");

    const noShuffleDiv = document.getElementById('nikaku-best-noshuffle');
    const shuffleDiv = document.getElementById('nikaku-best-shuffle');

    noShuffleDiv.innerText = bestNoShuffle ? "🏆 記録(シャッフルなし): " + bestNoShuffle + "秒" : "🏆 記録(シャッフルなし): まだありません";
    shuffleDiv.innerText = bestShuffle ? "🏅 記録(シャッフルあり): " + bestShuffle + "秒" : "🏅 記録(シャッフルあり): まだありません";
}

function initNikaku() {
    clearInterval(nikakuTimerInterval);
    gridRows = nikakuRows + 2;
    gridCols = nikakuCols + 2;
    selectedNikakuCard = null;
    
    // 変数の初期化
    nikakuShuffleLeft = 1; 
    nikakuTimeElapsed = 0;
    isNikakuGameActive = false;
    hasUsedShuffle = false; 
    
    document.getElementById('nikaku-status').innerText = "タイム: 0秒";
    updateShuffleBtnUI();
    displayNikakuBestScores();

    let isSolvable = false;
    let safetyCounter = 0;

    while (!isSolvable && safetyCounter < 200) {
        if (safetyCounter === 0) {
            nikakuGrid = Array.from(new Array(gridRows), () => new Array(gridCols).fill(0));
            let pairCount = (nikakuRows * nikakuCols) / 2;
            let pool = new Array();
            for (let i = 0; i < pairCount; i++) {
                let id = (i % nikakuEmojiPool.length) + 1;
                pool.push(id, id);
            }
            pool.sort(function() { return Math.random() - 0.5; });
            let idx = 0;
            for (let r = 1; r <= nikakuRows; r++) {
                for (let c = 1; c <= nikakuCols; c++) nikakuGrid[r][c] = pool[idx++];
            }
        } else {
            resolveDeadlockPartially();
        }
        isSolvable = simulateSolveGame();
        safetyCounter++;
    }

    renderNikakuBoard();
}

function resolveDeadlockPartially() {
    let cards = new Array();
    for (let r = 1; r <= nikakuRows; r++) {
        for (let c = 1; c <= nikakuCols; c++) {
            if (nikakuGrid[r][c] !== 0) cards.push({ r: r, c: c, val: nikakuGrid[r][c] });
        }
    }
    if (cards.length < 4) return;
    let idx1 = Math.floor(Math.random() * cards.length);
    let idx2 = Math.floor(Math.random() * cards.length);
    while (cards[idx1].val === cards[idx2].val) { idx2 = Math.floor(Math.random() * cards.length); }
    let p1 = cards[idx1]; let p2 = cards[idx2];
    let temp = nikakuGrid[p1.r][p1.c];
    nikakuGrid[p1.r][p1.c] = nikakuGrid[p2.r][p2.c];
    nikakuGrid[p2.r][p2.c] = temp;
}

function simulateSolveGame() {
    let simGrid = nikakuGrid.map(row => [...row]);
    let canMove = true;
    while (canMove) {
        canMove = false;
        let cards = new Array();
        for (let r = 1; r <= nikakuRows; r++) {
            for (let c = 1; c <= nikakuCols; c++) { if (simGrid[r][c] !== 0) cards.push({ r: r, c: c, val: simGrid[r][c] }); }
        }
        if (cards.length === 0) return true; 
        for (let i = 0; i < cards.length; i++) {
            for (let j = i + 1; j < cards.length; j++) {
                let p1 = cards[i]; let p2 = cards[j];
                if (p1.val === p2.val && checkLinkCustom(p1.r, p1.c, p2.r, p2.c, simGrid)) {
                    simGrid[p1.r][p1.c] = 0; simGrid[p2.r][p2.c] = 0;
                    canMove = true; break;
                }
            }
            if (canMove) break;
        }
    }
    return false;
}
// =============================================================
// 2角パズル ゲームロジックファイル (nikaku.js - 後半)
// =============================================================

function renderNikakuBoard() {
    const gridDiv = document.getElementById('nikaku-grid');
    gridDiv.innerHTML = '';
    
    // 上級(10列)でもはみ出さないようにカード幅を38pxに自動縮小
    let cardSize = 56;
    if (nikakuCols === 6) { cardSize = 42; }
    else if (nikakuCols === 8) { cardSize = 32; }

    gridDiv.style.gridTemplateColumns = "repeat(" + gridCols + ", " + cardSize + "px)";
    gridDiv.style.gridGap = "4px";

    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            const card = document.createElement('div');
            let val = nikakuGrid[r][c];
            if (val === 0) {
                card.className = 'nikaku-card empty';
            } else {
                card.className = 'nikaku-card';
                card.innerText = nikakuEmojiPool[val - 1];
                if (selectedNikakuCard && selectedNikakuCard.r === r && selectedNikakuCard.c === c) card.classList.add('selected');
                (function(row, col, el) {
                    card.addEventListener('click', function() { tapNikakuCard(el, row, col); });
                })(r, c, card);
            }
            card.style.width = cardSize + "px"; card.style.height = cardSize + "px";
            card.style.fontSize = (cardSize * 0.5) + "px";
            gridDiv.appendChild(card);
        }
    }
}

function startNikakuTimer() {
    isNikakuGameActive = true;
    nikakuTimerInterval = setInterval(function() {
        nikakuTimeElapsed++;
        document.getElementById('nikaku-status').innerText = "タイム: " + nikakuTimeElapsed + "秒";
    }, 1000);
}

function pressNikakuShuffle() {
    if (nikakuShuffleLeft <= 0) return;
    
    let remainingIcons = new Array();
    for (let r = 1; r <= nikakuRows; r++) {
        for (let c = 1; c <= nikakuCols; c++) { if (nikakuGrid[r][c] !== 0) remainingIcons.push(nikakuGrid[r][c]); }
    }
    if (remainingIcons.length === 0) return;

    remainingIcons.sort(function() { return Math.random() - 0.5; });
    let idx = 0;
    for (let r = 1; r <= nikakuRows; r++) {
        for (let c = 1; c <= nikakuCols; c++) { if (nikakuGrid[r][c] !== 0) nikakuGrid[r][c] = remainingIcons[idx++]; }
    }

    nikakuShuffleLeft--;
    hasUsedShuffle = true; // シャッフル使用フラグをオン
    if (selectedNikakuCard) selectedNikakuCard = null; 
    
    updateShuffleBtnUI();
    renderNikakuBoard();
}

function updateShuffleBtnUI() {
    const btn = document.getElementById('nikaku-shuffle-btn');
    if (!btn) return;
    btn.innerText = "シャッフル (残り" + nikakuShuffleLeft + "回)";
    if (nikakuShuffleLeft <= 0) {
        btn.style.backgroundColor = "#7f8c8d"; btn.style.cursor = "not-allowed";
    } else {
        btn.style.backgroundColor = "#2ecc71"; btn.style.cursor = "pointer";
    }
}

function tapNikakuCard(element, r, c) {
    if (isNikakuGameActive === false) {
        startNikakuTimer(); // 最初の1枚目を触った瞬間にタイマースタート
    }

    if (selectedNikakuCard === null) {
        selectedNikakuCard = { r: r, c: c, el: element };
        element.classList.add('selected');
        return;
    }
    if (selectedNikakuCard.r === r && selectedNikakuCard.c === c) {
        selectedNikakuCard.el.classList.remove('selected');
        selectedNikakuCard = null;
        return;
    }

    let fR = selectedNikakuCard.r, fC = selectedNikakuCard.c, fEl = selectedNikakuCard.el;

    if (nikakuGrid[fR][fC] === nikakuGrid[r][c] && checkLinkCustom(fR, fC, r, c, nikakuGrid)) {
        nikakuGrid[fR][fC] = 0; nikakuGrid[r][c] = 0;
        selectedNikakuCard = null;
        renderNikakuBoard();
        checkNikakuWin();
    } else {
        fEl.classList.remove('selected');
        selectedNikakuCard = { r: r, c: c, el: element };
        element.classList.add('selected');
    }
}

function checkLinkCustom(r1, c1, r2, c2, targetGrid) {
    if (checkLineCustom(r1, c1, r2, c2, targetGrid)) return true;
    if (targetGrid[r1][c2] === 0 && checkLineCustom(r1, c1, r1, c2, targetGrid) && checkLineCustom(r1, c2, r2, c2, targetGrid)) return true;
    if (targetGrid[r2][c1] === 0 && checkLineCustom(r1, c1, r2, c1, targetGrid) && checkLineCustom(r2, c1, r2, c2, targetGrid)) return true;
    for (let r = r1 - 1; r >= 0; r--) {
        if (targetGrid[r][c1] !== 0) break;
        if (checkTurn1Custom(r, c1, r2, c2, targetGrid)) return true;
    }
    for (let r = r1 + 1; r < gridRows; r++) {
        if (targetGrid[r][c1] !== 0) break;
        if (checkTurn1Custom(r, c1, r2, c2, targetGrid)) return true;
    }
    for (let c = c1 - 1; c >= 0; c--) {
        if (targetGrid[r1][c] !== 0) break;
        if (checkTurn1Custom(r1, c, r2, c2, targetGrid)) return true;
    }
    for (let c = c1 + 1; c < gridCols; c++) {
        if (targetGrid[r1][c] !== 0) break;
        if (checkTurn1Custom(r1, c, r2, c2, targetGrid)) return true;
    }
    return false;
}

function checkTurn1Custom(r1, c1, r2, c2, targetGrid) {
    if (targetGrid[r1][c2] === 0 && checkLineCustom(r1, c1, r1, c2, targetGrid) && checkLineCustom(r1, c2, r2, c2, targetGrid)) return true;
    if (targetGrid[r2][c1] === 0 && checkLineCustom(r1, c1, r2, c1, targetGrid) && checkLineCustom(r2, c1, r2, c2, targetGrid)) return true;
    return false;
}

function checkLineCustom(r1, c1, r2, c2, targetGrid) {
    if (r1 === r2) {
        let minC = Math.min(c1, c2), maxC = Math.max(c1, c2);
        for (let c = minC + 1; c < maxC; c++) { if (targetGrid[r1][c] !== 0) return false; }
        return true;
    }
    if (c1 === c2) {
        let minR = Math.min(r1, r2), maxR = Math.max(r1, r2);
        for (let r = minR + 1; r < maxR; r++) { if (targetGrid[r][c1] !== 0) return false; }
        return true;
    }
    return false;
}

function checkNikakuWin() {
    let hasCard = false;
    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) { if (nikakuGrid[r][c] !== 0) { hasCard = true; break; } }
        if (hasCard) break;
    }
    if (!hasCard) {
        clearInterval(nikakuTimerInterval);
        isNikakuGameActive = false;

        // シャッフル使用状況に応じて別々にローカルストレージへセーブ
        const keyBase = "nikaku_best_" + nikakuRows + "_" + nikakuCols;
        const scoreTypeKey = hasUsedShuffle ? "_shuffle" : "_noshuffle";
        const storageKey = keyBase + scoreTypeKey;

        const currentBest = localStorage.getItem(storageKey);
        let isNewRecord = false;

        if (!currentBest || nikakuTimeElapsed < parseInt(currentBest)) {
            localStorage.setItem(storageKey, nikakuTimeElapsed);
            isNewRecord = true;
        }

        setTimeout(function() {
            let label = hasUsedShuffle ? "（シャッフルあり）" : "（シャッフルなし）";
            let select = document.getElementById('nikaku-size-select');
            let sizeName = select.options[select.selectedIndex].text.split(" ")[0];
            
            if (isNewRecord) {
                alert("🎉 🎉 新記録クリア！ 🎉 🎉\n難易度: " + sizeName + "\nタイム: " + nikakuTimeElapsed + "秒 " + label + "\n自己ベストを更新しました！");
            } else {
                alert("クリア！ おめでとうございます！\n難易度: " + sizeName + "\n今回のタイム: " + nikakuTimeElapsed + "秒 " + label);
            }
            initNikaku();
        }, 150);
    }
}
