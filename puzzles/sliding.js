/**
 * sliding.js - スライドパズルゲームモジュール
 * 複数一括スライド維持・スマホ自動縮小・無限ループバグ完全根絶版
 */

let slidingSize = 3;        // 現在のサイズ (3: 3x3, 4: 4x4, 5: 5x5)
let slidingState = new Array();

const SlidingGame = {
    init() {
        const totalCells = slidingSize * slidingSize;
        
        // 1. 正解（ゴール）の状態を new Array を使って安全に作成
        slidingState = new Array();
        for (let i = 1; i < totalCells; i++) {
            slidingState.push(i);
        }
        slidingState.push(""); // 最後のマスを空白にする

        // 2. 正解の状態から隣接ピースを一コマずつスライドさせてシャッフル（絶対に詰まない盤面を作る）
        let emptyIdx = totalCells - 1;
        let shuffleCount = slidingSize * slidingSize * 15; 

        for (let i = 0; i < shuffleCount; i++) {
            let possibleMoves = this.getValidAdjacentMoves(emptyIdx);
            let nextIdx = possibleMoves.at(Math.floor(Math.random() * possibleMoves.length));
            
            // 安全設計：ブラケット添え字を使わず Array.prototype.fill 等で配列の要素を安全に書き換え
            const nextVal = slidingState.at(nextIdx);
            slidingState.fill(nextVal, emptyIdx, emptyIdx + 1);
            slidingState.fill("", nextIdx, nextIdx + 1);
            
            emptyIdx = nextIdx;
        }

        this.render();
    },

    getValidAdjacentMoves(index) {
        let moves = new Array();
        let row = Math.floor(index / slidingSize);
        let col = index % slidingSize;

        if (row > 0) moves.push(index - slidingSize);
        if (row < slidingSize - 1) moves.push(index + slidingSize);
        if (col > 0) moves.push(index - 1);
        if (col < slidingSize - 1) moves.push(index + 1);

        return moves;
    },

    render() {
        const grid = document.getElementById('sliding-grid');
        if (!grid) return;
        grid.innerHTML = '';

        // マス数（3〜5）に応じてスマホ画面内で自動縮小するための最適なフォントサイズ
        let fontSize = "1.5rem";
        if (slidingSize === 4) {
            fontSize = "1.25rem";
        } else if (slidingSize === 5) {
            fontSize = "1.05rem";
        }

        // CSS側のコンテナデザインと完全に同期（ブラケット不使用）
        grid.style.gridTemplateColumns = `repeat(${slidingSize}, 1fr)`;
        grid.style.width = "100%";
        grid.style.maxWidth = "400px";

        slidingState.forEach((val, index) => {
            const tile = document.createElement('div');
            
            tile.className = 'slide-tile' + (val === "" ? " empty" : "");
            tile.innerText = val;
            
            // 完璧な「正方形」に統一するための強制設定
            tile.style.width = "100%";
            tile.style.aspectRatio = "1 / 1";
            tile.style.fontSize = fontSize;
            
            // ★【新設】パネルの継ぎ目をひと目でわかりやすくする「1pxの黒い外枠線」を追加
            // 空白マス以外にのみ黒枠をつけ、ゲームとしてのメリハリを出します
            if (val !== "") {
                tile.style.border = "1px solid #000000";
            }
            
            // スマホ対応：クリック（タップ）イベントを安全に付与
            tile.addEventListener('click', () => this.move(index));
            grid.appendChild(tile);
        });
    },

    // マルチスライドロジックを完全維持したまま、配列のブラケット表記を100%安全に排除
    move(clickIndex) {
        const emptyIndex = slidingState.indexOf("");
        if (emptyIndex === -1) return;
        
        let clickRow = Math.floor(clickIndex / slidingSize);
        let clickCol = clickIndex % slidingSize;
        let emptyRow = Math.floor(emptyIndex / slidingSize);
        let emptyCol = emptyIndex % slidingSize;

        // 1. 同じ「行」にあり、水平方向に直線で続いている場合のマルチスライド
        if (clickRow === emptyRow) {
            let step = clickCol < emptyCol ? 1 : -1;
            
            for (let c = emptyCol; c !== clickCol; c -= step) {
                let curr = emptyRow * slidingSize + c;
                let next = emptyRow * slidingSize + (c - step);
                
                const nextVal = slidingState.at(next);
                slidingState.fill(nextVal, curr, curr + 1);
            }
            slidingState.fill("", clickIndex, clickIndex + 1);
            
            this.render();
            this.checkWin();
        }
        // 2. 同じ「列」にあり、垂直方向に直線で続いている場合のマルチスライド
        else if (clickCol === emptyCol) {
            let step = clickRow < emptyRow ? 1 : -1;
            
            for (let r = emptyRow; r !== clickRow; r -= step) {
                let curr = r * slidingSize + emptyCol;
                let next = (r - step) * slidingSize + emptyCol;
                
                const nextVal = slidingState.at(next);
                slidingState.fill(nextVal, curr, curr + 1);
            }
            slidingState.fill("", clickIndex, clickIndex + 1);
            
            this.render();
            this.checkWin();
        }
    },

    checkWin() {
        const totalCells = slidingSize * slidingSize;
        let isWin = true;

        for (let i = 0; i < totalCells - 1; i++) {
            if (slidingState.at(i) !== i + 1) {
                isWin = false;
                break;
            }
        }
        if (slidingState.at(totalCells - 1) !== "") {
            isWin = false;
        }

        if (isWin) {
            setTimeout(() => {
                alert(`スライドパズル (${slidingSize}x${slidingSize}) クリア！おめでとうございます！`);
                this.init();
            }, 100);
        }
    }
};

// =============================================================
// グローバル窓口定義 (同名衝突による再帰ループを物理的に100%回避する設計)
// =============================================================
window.initSliding = function() {
    SlidingGame.init();
};

window.changeSlidingSize = function() {
    const select = document.getElementById('sliding-size-select');
    if (select) {
        slidingSize = parseInt(select.value, 10);
        SlidingGame.init();
    }
};
