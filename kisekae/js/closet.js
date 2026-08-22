import { playerData, itemDetails, assets } from './data.js';
import { selectedFurnitureId } from './room.js';

let bodyImageCache = null;

// --- 🎨 Canvas再描画メインコア ---
export function updateAvatarCanvas() {
    const canvas = document.getElementById('avatar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentMode = window.currentGameCameraMode || 'home';

    // 1. 背景の描画
    if (currentMode === 'closet') {
        ctx.fillStyle = '#ffffff'; 
    } else {
        const bgFillColors = { pink: '#ffebee', yellow: '#fffde7', blue: '#e0f7fa' };
        ctx.fillStyle = bgFillColors[playerData.equippedBg] || '#ffebee';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. 家具の描画
    if (currentMode !== 'closet') {
        // 🧸 ぬいぐるみ
        if (playerData.activeFurniture.includes('plush')) {
            const pos = playerData.furniturePos.plush;
            const fx = pos.x; const fy = pos.y;
            ctx.fillStyle = '#ba68c8';
            ctx.beginPath(); ctx.arc(fx, fy - 15, 15, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(fx - 7, fy - 30, 6, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(fx + 7, fy - 30, 6, 0, Math.PI * 2); ctx.fill();
            
            if (currentMode === 'room' && selectedFurnitureId === 'plush') {
                drawSelectionBox(ctx, fx, fy, pos.width, pos.height);
            }
        }
        // 🌱 観葉植物
        if (playerData.activeFurniture.includes('plant')) {
            const pos = playerData.furniturePos.plant;
            const fx = pos.x; const fy = pos.y;
            ctx.fillStyle = '#8d6e63'; ctx.fillRect(fx - 7, fy - 30, 15, 30);
            ctx.fillStyle = '#4caf50'; ctx.beginPath(); ctx.moveTo(fx - 17, fy - 30); ctx.quadraticCurveTo(fx, fy - 60, fx + 17, fy - 30); ctx.closePath(); ctx.fill();
            
            if (currentMode === 'room' && selectedFurnitureId === 'plant') {
                drawSelectionBox(ctx, fx, fy, pos.width, pos.height);
            }
        }
        // 🎸 ギター
        if (playerData.activeFurniture.includes('guitar')) {
            const pos = playerData.furniturePos.guitar;
            const fx = pos.x; const fy = pos.y;
            ctx.fillStyle = '#ff5722'; ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(fx, fy - 75); ctx.lineTo(fx, fy - 15); ctx.stroke();
            ctx.beginPath(); ctx.arc(fx, fy - 10, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            
            if (currentMode === 'room' && selectedFurnitureId === 'guitar') {
                drawSelectionBox(ctx, fx, fy, pos.width, pos.height);
            }
        }
    }

    if (currentMode === 'room') { return; }

    // キャラクターの配置計算
    let charScale = 1.2;
    const charWidth = 200 * charScale;
    const charHeight = 220 * charScale;
    let offsetX = (canvas.width - charWidth) / 2;
    let offsetY = canvas.height - charHeight - 20;

    if (currentMode === 'home') {
        const homeScale = 0.6; charScale = charScale * homeScale;
        const homeWidth = 200 * charScale; const homeHeight = 220 * charScale;
        offsetX = (canvas.width - homeWidth) / 2; offsetY = canvas.height - homeHeight - 30;
    }

    // 3. 体のPNGスタンプ
    if (bodyImageCache) {
        drawSmoothImage(ctx, bodyImageCache, offsetX, offsetY, 200 * charScale, 220 * charScale);
        drawCharacterLayers(ctx, charScale, offsetX, offsetY);
    } else {
        const img = new Image(); img.src = 'images/body.png';
        img.onload = function() {
            bodyImageCache = img;
            drawSmoothImage(ctx, img, offsetX, offsetY, 200 * charScale, 220 * charScale);
            drawCharacterLayers(ctx, charScale, offsetX, offsetY);
        };
        img.onerror = function() {
            ctx.fillStyle = '#fce4ec'; ctx.fillRect(50 * charScale + offsetX, 100 * charScale + offsetY, 100 * charScale, 110 * charScale);
            drawCharacterLayers(ctx, charScale, offsetX, offsetY);
        };
    }
}

function drawSelectionBox(ctx, cx, cy, width, height) {
    ctx.save(); ctx.strokeStyle = '#03a9f4'; ctx.lineWidth = 1.5; ctx.setLineDash(Array.of(4, 3));
    const left = cx - (width / 2) - 4; const top = cy - height - 4;
    ctx.strokeRect(left, top, width + 8, height + 8); ctx.restore();
}

function drawSmoothImage(ctx, img, dx, dy, dWidth, dHeight) {
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    let srcWidth = img.naturalWidth || img.width; let srcHeight = img.naturalHeight || img.height;
    let tempCanvas = document.createElement('canvas'); let tempCtx = tempCanvas.getContext('2d');
    let curWidth = srcWidth; let curHeight = srcHeight;
    while (curWidth * 0.5 > dWidth) {
        tempCanvas.width = curWidth * 0.5; tempCanvas.height = curHeight * 0.5;
        tempCtx.imageSmoothingEnabled = true; tempCtx.imageSmoothingQuality = 'high';
        tempCtx.drawImage(img, 0, 0, curWidth, curHeight, 0, 0, tempCanvas.width, tempCanvas.height);
        curWidth = tempCanvas.width; curHeight = tempCanvas.height;
        img = tempCanvas; tempCanvas = document.createElement('canvas'); tempCtx = tempCanvas.getContext('2d');
    }
    ctx.drawImage(img, 0, 0, curWidth, curHeight, dx, dy, dWidth, dHeight);
}

function drawCharacterLayers(ctx, scale, dx, dy) {
    ctx.save(); ctx.translate(dx, dy); ctx.scale(scale, scale);
    const clothesColors = { tshirt: '#ff1744', onepiece: '#aa00ff', suit: '#37474f', tuxedo: '#111', maid: '#333' };
    ctx.fillStyle = clothesColors[playerData.equipped.clothes] || '#ff1744';
    ctx.beginPath(); ctx.moveTo(73, 120); ctx.lineTo(127, 120); ctx.lineTo(120, 175); ctx.lineTo(80, 175); ctx.closePath(); ctx.fill();
    if (playerData.equipped.clothes === 'tuxedo') { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(93, 120); ctx.lineTo(100, 135); ctx.lineTo(107, 120); ctx.closePath(); ctx.fill(); }
    if (playerData.equipped.clothes === 'maid') { ctx.fillStyle = '#fff'; ctx.fillRect(85, 120, 30, 35); }
    const hairColors = { short: '#4e342e', long: '#263238', twintail: '#ffb300', cyber: '#00ffff' };
    ctx.fillStyle = hairColors[playerData.equipped.hair] || '#4e342e';
    ctx.beginPath(); ctx.arc(100, 65, 35, Math.PI, 0); ctx.fill();
    if (playerData.equipped.hair === 'long') { ctx.fillRect(60, 65, 15, 70); ctx.fillRect(125, 65, 15, 70); }
    if (playerData.equipped.hair === 'twintail') { ctx.beginPath(); ctx.arc(55, 65, 12, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(145, 65, 12, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
}

// 👗 【完全復元】シングルクォーテーションをバッククォートに修正しました！
export function renderClosetGrid(category) {
    const container = document.getElementById(`closet-${category}-group`);
    if (!container) return;
    container.innerHTML = ''; 

    playerData.inventory[category].forEach(itemId => {
        const detail = itemDetails[category][itemId];
        if (!detail) return;

        const isEquipped = playerData.equipped[category] === itemId;
        const box = document.createElement('div');
        
        // 💡 記号を ``（バッククォート）に修正し、スタイルが当たるように直しました
        box.className = `item-icon-box ${isEquipped ? 'active' : ''}`;
        box.innerHTML = `${detail.icon}<div class="item-icon-name">${detail.name}</div>`;

        let pressTimer = null;
        let isLongPress = false;

        const startPress = () => {
            isLongPress = false;
            pressTimer = setTimeout(() => {
                isLongPress = true;
                showPopup(detail.name, detail.desc); 
            }, 600);
        };

        const endPress = () => {
            clearTimeout(pressTimer);
            if (!isLongPress) {
                playerData.equipped[category] = itemId;
                renderClosetGrid(category); 
                updateAvatarCanvas();       
            }
        };

        box.addEventListener('mousedown', startPress);
        box.addEventListener('mouseup', endPress);
        box.addEventListener('touchstart', startPress);
        box.addEventListener('touchend', (e) => { e.preventDefault(); endPress(); });

        container.appendChild(box);
    });
}

export function changeItem(category, itemId, element) {
    if (category === 'bg') { playerData.equippedBg = itemId; }
    element.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    element.classList.add('active');
    updateAvatarCanvas();
}

export function switchClosetTab(tabName, buttonElement) {
    document.querySelectorAll('.closet-pane').forEach(p => p.classList.remove('active'));
    document.getElementById(`closet-pane-${tabName}`).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    buttonElement.classList.add('active');
}

function showPopup(title, desc) {
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-desc').innerText = desc;
    document.getElementById('info-popup').classList.add('active');
}
