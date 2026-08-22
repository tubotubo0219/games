// =============================================================
// 神経衰弱 ゲームロジックファイル (memory.js - サイズ追加版)
// =============================================================

const emojiPoolString = "🍎,🍎,🍌,🍌,🍇,🍇,🍉,🍉,🍓,🍓,🍒,🍒,🍍,🍍,🍊,🍊,🥝,🥝,🍋,🍋,🍈,🍈,🍅,🍅,🍆,🍆,🥕,🥕,🌽,🌽,🌶,🌶,🍄,🍄,🌰,🌰";
const allEmojiPool = emojiPoolString.split(",");

let memoryTotalCards = 16;  
let memoryPlayMode = "normal"; 

let memoryState = new Array();
let flippedCards = new Array();

// 計測用タイマーの変数
let memoryMissCount = 0;
let memoryTimeElapsed = 0;
let memoryTimerInterval = null; 
let memoryPeekInterval = null;  
let isMemoryGameActive = false;
let isPeekingNow = false;       
let isWaitingForFlipBack = false; 

function changeMemoryConfig() {
    memoryTotalCards = parseInt(document.getElementById('memory-size-select').value);
    memoryPlayMode = document.getElementById('memory-mode-select').value;
    initMemory();
}

function displayMemoryBestScore() {
    const scoreKey = "memory_best_" + memoryTotalCards + "_" + memoryPlayMode;
    const bestRaw = localStorage.getItem(scoreKey);
    const bestDiv = document.getElementById('memory-best-score');
    
    if (bestRaw) {
        const best = JSON.parse(bestRaw);
        bestDiv.innerText = "🏆 自己ベスト: ミス " + best.miss + "回 / タイム " + best.time + "秒";
    } else {
        bestDiv.innerText = "自己ベスト: まだ記録がありません";
    }
}

function initMemory() {
    clearInterval(memoryTimerInterval);
    clearInterval(memoryPeekInterval);
    
    memoryMissCount = 0;
    memoryTimeElapsed = 0;
    isMemoryGameActive = false;
    isPeekingNow = false;
    isWaitingForFlipBack = false; 
    flippedCards = new Array();
    
    const startBtn = document.getElementById('memory-start-btn');
    if (memoryPlayMode === "look") {
        startBtn.style.display = "inline-block";
        document.getElementById('memory-status').innerText = "「暗記スタート」を押すと開始します";
    } else {
        startBtn.style.display = "none";
        document.getElementById('memory-status').innerText = "ミス: 0回 / タイム: 0秒";
    }
    
    displayMemoryBestScore();

    let activeEmojis = allEmojiPool.slice(0, memoryTotalCards);
    memoryState = activeEmojis.sort(function() { return Math.random() - 0.5; });
    
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';

    // ★各サイズに完璧にフィットするよう列数(columns)とカードサイズ(cardSize)を細かく指定
    let columns = 4;
    let cardSize = 65;

    if (memoryTotalCards === 36) { 
        columns = 6; 
        cardSize = 50; 
    } else if (memoryTotalCards === 30) { 
        columns = 6; 
        cardSize = 50; 
    } else if (memoryTotalCards === 24) { 
        columns = 6; 
        cardSize = 50; 
    } else if (memoryTotalCards === 20) { 
        columns = 5; 
        cardSize = 55; 
    }

    grid.style.gridTemplateColumns = "repeat(" + columns + ", " + cardSize + "px)";
    grid.style.gridGap = "8px";

    memoryState.forEach(function(emoji, index) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.innerText = emoji;
        
        card.style.width = cardSize + "px";
        card.style.height = cardSize + "px";
        card.style.fontSize = (cardSize * 0.4) + "px";
        
        card.addEventListener('click', function() { flipCard(card); });
        grid.appendChild(card);
    });
}

function pressStartMemory() {
    if (isPeekingNow || isMemoryGameActive) return;
    
    document.getElementById('memory-start-btn').style.display = "none";
    
    isPeekingNow = true;
    const cards = document.querySelectorAll('.memory-card');
    
    cards.forEach(function(card) { card.classList.add('flipped', 'peek-mode'); });
    
    let countdown = 4;
    const statusDiv = document.getElementById('memory-status');
    statusDiv.innerText = "暗記時間！ あと " + countdown + " 秒...";

    clearInterval(memoryPeekInterval);
    memoryPeekInterval = setInterval(function() {
        countdown--;
        if (countdown > 0) {
            statusDiv.innerText = "暗記時間！ あと " + countdown + " 秒...";
        } else {
            clearInterval(memoryPeekInterval);
            
            cards.forEach(function(card) { card.classList.remove('flipped', 'peek-mode'); });
            isPeekingNow = false;
            
            startMemoryTimer(); 
        }
    }, 1000);
}

function startMemoryTimer() {
    isMemoryGameActive = true;
    updateMemoryUI();
    memoryTimerInterval = setInterval(function() {
        memoryTimeElapsed++;
        updateMemoryUI();
    }, 1000);
}

function updateMemoryUI() {
    const statusDiv = document.getElementById('memory-status');
    if (!isPeekingNow) {
        statusDiv.innerText = "ミス: " + memoryMissCount + "回 / タイム: " + memoryTimeElapsed + "秒";
    }
}

function flipCard(card) {
    if (isPeekingNow || isWaitingForFlipBack || (memoryPlayMode === "look" && !isMemoryGameActive) || card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
        return;
    }
    
    if (!isMemoryGameActive && memoryPlayMode === "normal") {
        startMemoryTimer();
    }

    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        const card1 = flippedCards.shift(); 
        const card2 = flippedCards.pop();   
        
        flippedCards = new Array();
        
        if (card1.dataset.emoji === card2.dataset.emoji) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            checkMemoryWin();
        } else {
            memoryMissCount++;
            updateMemoryUI();
            
            isWaitingForFlipBack = true;
            
            setTimeout(function() {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                isWaitingForFlipBack = false;
            }, 1000);
        }
    }
}

function checkMemoryWin() {
    const matchedCount = document.querySelectorAll('.memory-card.matched').length;
    if (matchedCount === memoryState.length) {
        clearInterval(memoryTimerInterval); 
        isMemoryGameActive = false;

        const scoreKey = "memory_best_" + memoryTotalCards + "_" + memoryPlayMode;
        const currentBestRaw = localStorage.getItem(scoreKey);
        let isNewRecord = false;

        const myScore = { miss: memoryMissCount, time: memoryTimeElapsed };

        if (!currentBestRaw) {
            isNewRecord = true; 
        } else {
            const currentBest = JSON.parse(currentBestRaw);
            if (myScore.miss < currentBest.miss) {
                isNewRecord = true;
            } else if (myScore.miss === currentBest.miss && myScore.time < currentBest.time) {
                isNewRecord = true;
            }
        }

        if (isNewRecord) {
            localStorage.setItem(scoreKey, JSON.stringify(myScore));
            setTimeout(function() {
                alert("🎉 🎉 新記録クリア！ 🎉 🎉\nミス: " + memoryMissCount + "回 / タイム: " + memoryTimeElapsed + "秒\nベストスコアを更新しました！");
                initMemory();
            }, 150);
        } else {
            setTimeout(function() {
                alert("クリア！ おめでとうございます！\n今回のスコア ➔ ミス: " + memoryMissCount + "回 / タイム: " + memoryTimeElapsed + "秒");
                initMemory();
            }, 150);
        }
    }
}
