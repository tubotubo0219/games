import { updateAvatarCanvas } from './closet.js';

// 🔍 自由ズーム用の現在の倍率管理変数
export let currentRoomZoom = 1.0;
let startTouchDistance = 0;

// 2本の指の間の距離を割り出す数学計算関数
function getTouchDistance(touches) {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// 自由ズームをリセットする関数（画面切り替え時などに使用）
export function resetRoomZoom(canvas) {
    currentRoomZoom = 1.0;
    if (canvas) canvas.style.transform = 'scale(1.0)';
}

// 📹 お部屋エリア全体のズーム・タッチイベントを設定・監視する関数
export function setupCameraZoomEvents(viewArea, canvas, handlePointerDown, handlePointerMove, handlePointerUp) {
    if (!viewArea || !canvas) return;

    // ① PC用：マウスホイールイベントをお部屋全体でキャッチ
    viewArea.addEventListener('wheel', (e) => {
        if (window.currentGameCameraMode === 'room') return; // 模様替え中はズームをロック
        e.preventDefault();
        
        if (e.deltaY < 0) { currentRoomZoom += 0.05; } else { currentRoomZoom -= 0.05; }
        currentRoomZoom = Math.min(Math.max(0.5, currentRoomZoom), 2.5);
        
        canvas.style.transform = `scale(${currentRoomZoom})`;
    }, { passive: false });

    // ② PC用：マウスを押した（家具を掴んだ）瞬間の判定
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;
        handlePointerDown(canvasX, canvasY);
    });

    // ③ PC用：マウスが動いている（家具を引きずっている）時の追跡
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;
        handlePointerMove(canvasX, canvasY, canvas.width, canvas.height);
    });

    // ④ PC用：マウスを離した時のドラッグ終了判定
    window.addEventListener('mouseup', () => {
        handlePointerUp();
    });

    // ⑤ スマホ用：2本指ピンチ ＆ 1本指ドラッグのタッチイベント
    viewArea.addEventListener('touchstart', (e) => {
        if (window.currentGameCameraMode === 'room' && e.touches.length === 1) {
            // 模様替え中かつ1本指なら家具のドラッグ開始判定
            const rect = canvas.getBoundingClientRect();
            const canvasX = e.touches[0].clientX - rect.left;
            const canvasY = e.touches[0].clientY - rect.top;
            handlePointerDown(canvasX, canvasY);
        } else if (window.currentGameCameraMode !== 'room' && e.touches.length === 2) {
            // 通常時かつ2本指ならお部屋全体のピンチズーム開始
            startTouchDistance = getTouchDistance(e.touches);
        }
    });
    
    viewArea.addEventListener('touchmove', (e) => {
        if (window.currentGameCameraMode === 'room' && e.touches.length === 1) {
            // 1本指での家具移動追跡
            const rect = canvas.getBoundingClientRect();
            const canvasX = e.touches[0].clientX - rect.left;
            const canvasY = e.touches[0].clientY - rect.top;
            handlePointerMove(canvasX, canvasY, canvas.width, canvas.height);
        } else if (window.currentGameCameraMode !== 'room' && e.touches.length === 2 && startTouchDistance > 0) {
            e.preventDefault();
            // 2本指でのピンチズーム追跡
            const currentDistance = getTouchDistance(e.touches);
            const scaleFactor = currentDistance / startTouchDistance;
            
            if (scaleFactor > 1) { currentRoomZoom += 0.02; } else { currentRoomZoom -= 0.02; }
            currentRoomZoom = Math.min(Math.max(0.5, currentRoomZoom), 2.5);
            
            canvas.style.transform = `scale(${currentRoomZoom})`;
            startTouchDistance = currentDistance;
        }
    }, { passive: false });
    
    window.addEventListener('touchend', () => {
        handlePointerUp();
        startTouchDistance = 0;
    });
}

// 📹 メニューに応じて大元のカメラ表示枠にズーム用クラスを切り替える関数
export function updateCameraMode(viewName) {
    const cameraArea = document.getElementById('main-camera-view');
    if (!cameraArea) return;

    cameraArea.classList.remove('zoom-home', 'zoom-closet', 'zoom-room');
    if (viewName === 'closet') {
        cameraArea.classList.add('zoom-closet');
    } else if (viewName === 'room') {
        cameraArea.classList.add('zoom-room');
    } else {
        cameraArea.classList.add('zoom-home');
    }
}
