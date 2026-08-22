import { playerData, itemDetails } from './data.js';
import { updateAvatarCanvas } from './closet.js';

// 現在選択されている家具のID
export let selectedFurnitureId = null;
// 現在ドラッグ（掴んでいる）中の家具のID
let draggingFurnitureId = null;

// 初期家具の座標と当たり判定用のサイズ
if (!playerData.furniturePos) {
    playerData.furniturePos = {
        plush: { x: 45, y: 260, width: 30, height: 35 },   
        plant: { x: 310, y: 260, width: 35, height: 50 },
        guitar: { x: 350, y: 265, width: 20, height: 75 }
    };
}

// 🛋️ 【修正】着替え（クローゼット）と全く同じピグパ風の「タブ＋アイコン選択形式」に復元
export function renderRoomFurnitureGrid() {
    const pane = document.getElementById('room-pane-furn');
    if (!pane) return;

    // 1. 最初の一回だけ、枠組み（アイコン用のグリッド箱と、下部のアクションメニュー）を作る
    if (!document.getElementById('room-furn-icon-grid')) {
        pane.innerHTML = `
            <div class="item-grid" id="room-furn-icon-grid"></div>
            <div class="furn-action-panel" id="furn-action-menu" style="display:none;">
                <p class="menu-notice-text">💡 アイテムをどうする？</p>
                <div class="action-btn-group">
                    <button class="action-menu-btn install" id="btn-furn-action-place">🏠 配置する</button>
                    <button class="action-menu-btn remove" id="btn-furn-action-remove">📦 しまう</button>
                </div>
                <p class="drag-guide-text">👆 上の画面の家具を直接ドラッグして動かせるよ！</p>
            </div>
        `;
    }

    const grid = document.getElementById('room-furn-icon-grid');
    if (!grid) return;
    grid.innerHTML = ''; // アイコン一覧を一度綺麗にリセット

    // 2. 所持している家具アイテムを「4列の丸角アイコン（グリッド）」として生成
    playerData.inventory.furniture.forEach(furnId => {
        const detail = itemDetails.furniture[furnId];
        if (!detail) return;

        const isInstalled = playerData.activeFurniture.includes(furnId);
        const isSelected = selectedFurnitureId === furnId;

        const box = document.createElement('div');
        // 着せ替えと同じ「item-icon-box」クラスを使用し、配置中は青枠（active）、選択中はオレンジ枠（selected-focus）になります
        box.className = `item-icon-box ${isInstalled ? 'active' : ''} ${isSelected ? 'selected-focus' : ''}`;
        box.innerHTML = `${detail.icon}<div class="item-icon-name">${detail.name}</div>`;

        // アイコンをクリックしたときの動作
        box.addEventListener('click', () => {
            selectedFurnitureId = furnId;
            renderRoomFurnitureGrid();    // アイコンの選択枠（オレンジ）を更新
            showFurnitureActionMenu(furnId); // 下部の配置・しまうメニューを開く
            updateAvatarCanvas();         // 上の画面に点線枠（□）を出す
        });

        grid.appendChild(box);
    });

    // 💡 既に何か選択されている場合は、下部メニューの状態を最新に更新する
    if (selectedFurnitureId) {
        showFurnitureActionMenu(selectedFurnitureId);
    } else {
        const menu = document.getElementById('furn-action-menu');
        if (menu) menu.style.display = 'none'; // 何も選んでなければ下部パネルは隠す
    }
}

// 下部に出現する配置・しまうメニューボタンの制御
function showFurnitureActionMenu(furnId) {
    const menu = document.getElementById('furn-action-menu');
    if (!menu) return;
    menu.style.display = 'block'; 

    const isInstalled = playerData.activeFurniture.includes(furnId);

    const placeBtn = document.getElementById('btn-furn-action-place');
    const removeBtn = document.getElementById('btn-furn-action-remove');

    // 配置状況に合わせてボタンの有効・無効をピグパ風に切り替え
    if (isInstalled) {
        placeBtn.disabled = true;  // 配置済みなら「配置」はグレーアウト
        removeBtn.disabled = false; // 配置済みなら「しまう」が押せる
    } else {
        placeBtn.disabled = false; // しまってあるなら「配置」ができる
        removeBtn.disabled = true;  // しまってあるなら「しまう」はグレーアウト
    }

    // 配置ボタンを押した時の処理
    placeBtn.onclick = () => {
        if (!playerData.activeFurniture.includes(furnId)) {
            playerData.activeFurniture.push(furnId);
            updateAvatarCanvas();
            renderRoomFurnitureGrid();
        }
    };

    // しまうボタンを押した時の処理
    removeBtn.onclick = () => {
        const idx = playerData.activeFurniture.indexOf(furnId);
        if (idx > -1) {
            playerData.activeFurniture.splice(idx, 1);
            if (selectedFurnitureId === furnId) selectedFurnitureId = null; // 選択解除
            updateAvatarCanvas();
            renderRoomFurnitureGrid();
        }
    };
}

export function switchRoomTab(tabName, buttonElement) {
    document.querySelectorAll('#view-room .closet-pane').forEach(p => p.classList.remove('active'));
    document.getElementById(`room-pane-${tabName}`).classList.add('active');
    document.querySelectorAll('#view-room .tab-btn').forEach(t => t.classList.remove('active'));
    buttonElement.classList.add('active');
    
    if (tabName !== 'furn') {
        selectedFurnitureId = null;
        updateAvatarCanvas();
    }
}

// ==========================================
// 👆 Canvas上での直感的なドラッグ＆ドロップ処理
// ==========================================
export function handleRoomPointerDown(canvasX, canvasY) {
    if (window.currentGameCameraMode !== 'room') return; 

    draggingFurnitureId = null;

    for (let i = playerData.activeFurniture.length - 1; i >= 0; i--) {
        const furnId = playerData.activeFurniture[i];
        const pos = playerData.furniturePos[furnId];
        if (!pos) continue;

        const left = pos.x - (pos.width / 2);
        const right = pos.x + (pos.width / 2);
        const top = pos.y - pos.height;
        const bottom = pos.y;

        if (canvasX >= left && canvasX <= right && canvasY >= top && canvasY <= bottom) {
            draggingFurnitureId = furnId;
            selectedFurnitureId = furnId; // 💡 画面上の家具を掴むと、下のアイコングリッドも自動連動
            renderRoomFurnitureGrid();
            break;
        }
    }
}

export function handleRoomPointerMove(canvasX, canvasY, canvasWidth, canvasHeight) {
    if (!draggingFurnitureId) return;

    const pos = playerData.furniturePos[draggingFurnitureId];
    if (!pos) return;

    pos.x = Math.min(Math.max(15, canvasX), canvasWidth - 15);
    pos.y = Math.min(Math.max(30, canvasY), canvasHeight - 5);

    updateAvatarCanvas(); 
}

export function handleRoomPointerUp() {
    draggingFurnitureId = null;
}
