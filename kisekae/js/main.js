import { assets, updateCoinDisplay, playerData } from './data.js';
import { renderClosetGrid, updateAvatarCanvas, switchClosetTab, changeItem } from './closet.js';
import { playGacha, startTapper, tapTapper, startNumberGame, buildGamePortalUI } from './activities.js';
import { startCatcher, moveAvatar, startRunnerGame, triggerJump } from './minigames.js';
import { renderRoomFurnitureGrid, switchRoomTab, handleRoomPointerDown, handleRoomPointerMove, handleRoomPointerUp } from './room.js';
import { renderMenuTabGrid } from './quests.js';
import { setupCameraZoomEvents, updateCameraMode, resetRoomZoom } from './camera.js';


window.onload = function() {
    updateCoinDisplay();
    
    // プレイヤーデータの初期背景色の設定と起動時お絵描き
    import('./data.js').then(m => {
        if (!m.playerData.equippedBg) m.playerData.equippedBg = 'pink';
        renderClosetGrid('hair');
        renderClosetGrid('clothes');
        renderRoomFurnitureGrid();
        updateAvatarCanvas();
    });

    // おでかけ画面のハブマップボタン一式を自動生成
    buildGamePortalUI(switchSubView);

    // 下部・グローバルナビゲーションの紐付け
    document.getElementById('global-home-btn').addEventListener('click', () => switchMainView('home'));
    document.getElementById('main-menu-home').addEventListener('click', (e) => switchMainView('home', e.currentTarget));
    document.getElementById('main-menu-closet').addEventListener('click', (e) => switchMainView('closet', e.currentTarget));
    document.getElementById('main-menu-room').addEventListener('click', (e) => switchMainView('room', e.currentTarget));
    document.getElementById('main-menu-menu').addEventListener('click', (e) => switchMainView('menu', e.currentTarget));
    document.getElementById('main-menu-outing').addEventListener('click', (e) => switchMainView('outing', e.currentTarget));

    document.getElementById('home-to-closet-btn').addEventListener('click', () => switchMainView('closet', document.getElementById('main-menu-closet')));
    document.getElementById('home-to-room-btn').addEventListener('click', () => switchMainView('room', document.getElementById('main-menu-room')));
    document.getElementById('home-to-outing-btn').addEventListener('click', () => switchMainView('outing', document.getElementById('main-menu-outing')));

    // 各タブ切り替え
    document.getElementById('tab-btn-hair').addEventListener('click', (e) => switchClosetTab('hair', e.target));
    document.getElementById('tab-btn-clothes').addEventListener('click', (e) => switchClosetTab('clothes', e.target));
    document.getElementById('tab-room-bg').addEventListener('click', (e) => switchRoomTab('bg', e.target));
    document.getElementById('tab-room-furn').addEventListener('click', (e) => {
        switchRoomTab('furn', e.target);
        renderRoomFurnitureGrid();
    });

    // 💡 【大掃除】エラーの原因になっていた、すでに存在しない古い go-shop ボタンのイベント記述を綺麗に削除しました！

    // 各ゲーム画面の「戻る」ボタンの挙動設定（おでかけマップへ戻る）
    document.getElementById('back-shop-btn').addEventListener('click', () => switchSubView('outing'));
    document.getElementById('back-gacha-btn').addEventListener('click', () => switchSubView('outing'));
    
    const syncTotalEarned = () => {
        const scoreCatcher = parseInt(document.getElementById('catcher-score')?.innerText.replace(/[^0-9]/g, "")) || 0;
        const scoreRunner = parseInt(document.getElementById('runner-score')?.innerText.replace(/[^0-9]/g, "")) || 0;
        if(scoreCatcher > 0 && !document.getElementById('catcher-start-btn').disabled) { playerData.stats.totalEarned += scoreCatcher; }
        if(scoreRunner > 0 && !document.getElementById('runner-start-btn').disabled) { playerData.stats.totalEarned += scoreRunner; }
        switchSubView('outing');
    };
    document.getElementById('back-tapper-btn').addEventListener('click', () => switchSubView('outing'));
    document.getElementById('back-catcher-btn').addEventListener('click', () => { syncTotalEarned(); });
    document.getElementById('back-number-btn').addEventListener('click', () => switchSubView('outing'));
    document.getElementById('back-runner-btn').addEventListener('click', () => { syncTotalEarned(); });

    // 模様替え配置変更
    document.getElementById('btn-bg-pink').addEventListener('click', (e) => changeItem('bg', 'pink', e.target));
    document.getElementById('btn-bg-yellow').addEventListener('click', (e) => changeItem('bg', 'yellow', e.target));
    document.getElementById('btn-bg-blue').addEventListener('click', (e) => changeItem('bg', 'blue', e.target));

    // ガチャ・ミニゲーム実行
    document.getElementById('gacha-start-btn').addEventListener('click', () => playGacha());
    document.getElementById('tapper-start-btn').addEventListener('click', () => startTapper());
    document.getElementById('tapper-tap-btn').addEventListener('click', () => tapTapper());
    document.getElementById('catcher-start-btn').addEventListener('click', () => startCatcher());
    document.getElementById('move-left-btn').addEventListener('click', () => moveAvatar('left'));
    document.getElementById('move-right-btn').addEventListener('click', () => moveAvatar('right'));
    document.getElementById('num-start-btn').addEventListener('click', () => startNumberGame());
    document.getElementById('runner-start-btn').addEventListener('click', () => startRunnerGame());
    document.getElementById('runner-jump-btn').addEventListener('click', () => triggerJump());
    
    // 🔒 上書きに絶対に負けない安全な「ポップアップ消去イベント」
    const globalPopupOverlay = document.getElementById('info-popup');
    if (globalPopupOverlay) {
        globalPopupOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'popup-close-btn' || e.target === globalPopupOverlay) {
                e.preventDefault();
                e.stopPropagation();
                globalPopupOverlay.classList.remove('active');
            }
        });
    }

    // カメラ関係
    const viewArea = document.getElementById('main-camera-view');
    const canvas = document.getElementById('avatar-canvas');
    setupCameraZoomEvents(viewArea, canvas, handleRoomPointerDown, handleRoomPointerMove, handleRoomPointerUp);

    switchMainView('home');
};

// 画面切り替えロジック
function switchMainView(viewName, menuElement) {
    document.querySelectorAll('.sub-view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.add('active');

    if (menuElement) {
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        menuElement.classList.add('active');
    } else {
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        const activeMenu = document.getElementById(`main-menu-${viewName}`);
        if (activeMenu) activeMenu.classList.add('active');
    }
    
    window.currentGameCameraMode = viewName;
    const canvas = document.getElementById('avatar-canvas');
    resetRoomZoom(canvas);
    
    if (viewName === 'room') { renderRoomFurnitureGrid(); }
    if (viewName === 'menu') { renderMenuTabGrid(); }
    if (viewName === 'outing') { buildGamePortalUI(switchSubView); }
    
    updateCameraMode(viewName);
    updateAvatarCanvas();
}

function switchSubView(subViewId) {
    document.querySelectorAll('.sub-view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${subViewId}`).classList.add('active');
}

