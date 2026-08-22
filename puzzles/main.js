/**
 * main.js - ポータルサイト共通・タブ切り替え＆初期化制御
 */

// 各ゲームがすでに初期化（起動）されたかを管理するフラグ（ブラケット不使用）
const initializedGames = new Set();

/**
 * タブ切り替え機能
 * @param {string} gameId - 切り替え先のゲームセクションID
 */
function switchGame(gameId) {
    // 1. 全てのゲームセクションを非表示にする
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 2. 選択されたゲームセクションを表示する
    const targetSection = document.getElementById(gameId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // 3. 該当のゲームが「まだ一度も初期化されていない」場合のみ初期化を実行
    // (プレイ中のタブ切り替えによってデータが消失するのを防ぐ安全設計)
    if (!initializedGames.has(gameId)) {
        if (gameId === 'sudoku' && typeof initSudoku === 'function') {
            initSudoku();
            initializedGames.add('sudoku');
        }
        if (gameId === 'sliding' && typeof initSliding === 'function') {
            initSliding();
            initializedGames.add('sliding');
        }
        if (gameId === 'memory' && typeof initMemory === 'function') {
            initMemory();
            initializedGames.add('memory');
        }
        if (gameId === 'nikaku' && typeof initNikaku === 'function') {
            initNikaku();
            initializedGames.add('nikaku');
        }
        if (gameId === 'gradient' && typeof initGradient === 'function') {
            initGradient();
            initializedGames.add('gradient');
        }
        if (gameId === 'suika' && typeof initSuika === 'function') {
            initSuika();
            initializedGames.add('suika');
        }
        if (gameId === 'picross' && typeof initPicross === 'function') {
            initPicross();
            initializedGames.add('picross');
        }
    }
}

// ページ読み込み完了時に自動実行 (window.onloadの競合を防ぐイベントリスナー方式)
document.addEventListener("DOMContentLoaded", () => {
    // 初期表示として数独を起動
    switchGame('sudoku');
});

/**
 * ★【新設】プルダウンメニューが変更されたときに呼び出される関数
 * ブラケット表記を一切使わない安全設計
 */
window.handleGameSelect = function() {
    const selector = document.getElementById('game-selector');
    if (selector) {
        // 選択されたゲームのID（'sudoku' や 'gradient' など）を取得して切り替える
        const targetGameId = selector.value;
        if (typeof switchGame === 'function') {
            switchGame(targetGameId);
        }
    }
};

/**
 * 🌐 全ゲーム共通：ヘルプポップアップ開閉ロジック
 * @param {string} gameId - 開閉したいゲームのID
 */
window.openHelpPortal = function(gameId) {
    const modal = document.getElementById("help-modal-" + gameId);
    if (modal) {
        modal.classList.add("open");
    }
};

window.closeHelpPortal = function(gameId) {
    const modal = document.getElementById("help-modal-" + gameId);
    if (modal) {
        modal.classList.remove("open");
    }
};
