import { playerData, updateCoinDisplay, shopNormalItems, miniGamePortalList, itemDetails } from './data.js';
import { renderClosetGrid } from './closet.js';

// --- 🛍️ ショップ画面のアイコングリッド生成 ---
export function buildNormalShopUI(switchSubViewFunction) {
    const listContainer = document.getElementById('shop-normal-item-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    listContainer.className = 'shop-item-grid-box';

    shopNormalItems.forEach(item => {
        let detail = null;
        if (item.category === 'clothes') detail = itemDetails.clothes[item.id];
        if (item.category === 'furniture') detail = itemDetails.furniture[item.id];
        if (!detail) return;

        const isOwned = playerData.inventory[item.category].includes(item.id);

        const box = document.createElement('div');
        box.className = `item-icon-box ${isOwned ? 'active' : ''}`;
        box.innerHTML = `${detail.icon}<div class="item-icon-name">${detail.name}</div>`;

        const priceBtn = document.createElement('button');
        if (isOwned) {
            priceBtn.innerText = "売切"; priceBtn.className = "shop-price-tag sold-out"; priceBtn.disabled = true;
        } else {
            priceBtn.innerText = `💰${item.price}`; priceBtn.className = "shop-price-tag";
            priceBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                buyItem(item.category, item.id, item.price, e.target);
            });
        }
        box.appendChild(priceBtn);

        let pressTimer = null;
        let isLongPress = false;

        // 大元の外枠にある一番安全なポップアップ起動命令を呼び出す
        const triggerGlobalPopup = () => {
            document.getElementById('popup-title').innerText = detail.name;
            document.getElementById('popup-desc').innerText = detail.desc;
            document.getElementById('info-popup').classList.add('active');
        };

        box.addEventListener('mousedown', (e) => {
            e.stopPropagation(); isLongPress = false;
            pressTimer = setTimeout(() => { isLongPress = true; triggerGlobalPopup(); }, 600);
        });
        box.addEventListener('mouseup', (e) => { e.stopPropagation(); clearTimeout(pressTimer); });
        box.addEventListener('touchstart', (e) => {
            e.stopPropagation(); isLongPress = false;
            pressTimer = setTimeout(() => { isLongPress = true; triggerGlobalPopup(); }, 600);
        });
        box.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); clearTimeout(pressTimer); });

        listContainer.appendChild(box);
    });
}

export function buyItem(category, itemId, price, element) {
    if (playerData.inventory[category].includes(itemId)) { alert("既に所有しています！"); return; }
    if (playerData.coins >= price) {
        playerData.coins -= price; playerData.inventory[category].push(itemId); updateCoinDisplay();
        buildNormalShopUI(); renderClosetGrid(category); alert("購入しました！クローゼットを確認してね。");
    } else { alert("コインが足りません！"); }
}

// ガチャの実行
export function playGacha() {
    if (playerData.coins < 30) { alert("コインが足りません！"); return; }
    const triggerBtn = document.getElementById('gacha-start-btn');
    const machine = document.getElementById('gacha-machine-egg');
    const capsule = document.getElementById('gacha-capsule-ball');
    const resultText = document.getElementById('gacha-result');

    triggerBtn.disabled = true; resultText.classList.remove('show'); capsule.classList.remove('animate'); capsule.style.display = 'block';
    playerData.coins -= 30; updateCoinDisplay();
    playerData.stats.gachaCount++;

    machine.classList.add('shaking'); machine.innerText = '🤖';
    setTimeout(() => {
        machine.classList.remove('shaking'); machine.innerText = '🎁';
        capsule.classList.add('animate');
        setTimeout(() => {
            const prizes = Array.of(
                { category: 'hair', id: 'cyber', name: '⚡ サイバーの髪型（激レア）' },
                { category: 'clothes', id: 'maid', name: '🎀 メイド服（レア）' }
            );
            const result = prizes[Math.floor(Math.random() * prizes.length)];
            resultText.innerText = `🎉 カプセルが開いた！\n【結果】：${result.name}`;
            resultText.classList.add('show'); triggerBtn.disabled = false;
            if (!playerData.inventory[result.category].includes(result.id)) {
                playerData.inventory[result.category].push(result.id); renderClosetGrid(result.category);
            }
            setTimeout(() => { if (!triggerBtn.disabled) capsule.style.display = 'none'; }, 2500);
        }, 1200);
    }, 600);
}

// おでかけポータル自動組み立て
export function buildGamePortalUI(switchSubViewFunction) {
    const portalContainer = document.getElementById('outing-game-list');
    if (!portalContainer) return; 
    portalContainer.innerHTML = '';
    miniGamePortalList.forEach(game => {
        const itemBox = document.createElement('div'); itemBox.className = 'shop-item'; itemBox.style.flexDirection = 'column'; itemBox.style.alignItems = 'flex-start'; itemBox.style.gap = '5px';
        itemBox.innerHTML = `<div style="font-weight:bold; font-size:14px; color:#333;">${game.label}</div><div style="font-size:11px; color:#666; line-height:1.3;">${game.desc}</div>`;
        const goBtn = document.createElement('button'); goBtn.className = 'action-menu-btn move'; goBtn.style.width = '100%'; goBtn.style.marginTop = '6px'; goBtn.style.padding = '8px'; goBtn.innerText = '🚗 ここへおでかけする';
        goBtn.addEventListener('click', () => { switchSubViewFunction(game.targetView); if (game.targetView === 'shop-normal') { buildNormalShopUI(); } });
        itemBox.appendChild(goBtn); portalContainer.appendChild(itemBox);
    });
}

// ミニゲーム1：コインタッパー
let tapperTimer = null, tapperScore = 0, tapperTimeLeft = 0;
export function startTapper() {
    tapperScore = 0; tapperTimeLeft = 10;
    document.getElementById('tapper-score').innerText = `獲得: ${tapperScore}枚`; document.getElementById('tapper-timer').innerText = `残り時間: ${tapperTimeLeft}秒`;
    document.getElementById('tapper-start-btn').disabled = true; document.getElementById('tapper-tap-btn').disabled = false;
    tapperTimer = setInterval(() => {
        tapperTimeLeft--; document.getElementById('tapper-timer').innerText = `残り時間: ${tapperTimeLeft}秒`;
        if (tapperTimeLeft <= 0) {
            clearInterval(tapperTimer); document.getElementById('tapper-start-btn').disabled = false; document.getElementById('tapper-tap-btn').disabled = true;
            playerData.coins += tapperScore; playerData.stats.totalEarned += tapperScore; updateCoinDisplay(); alert(`連打終了！ 💰 ${tapperScore} 枚ゲット！`);
        }
    }, 1000);
}
export function tapTapper() { if (tapperTimeLeft > 0) { tapperScore += 2; document.getElementById('tapper-score').innerText = `獲得: ${tapperScore}枚`; } }

// ミニゲーム3：ナンバータップ
let numTimer = null, numTimeLeft = 0, currentTargetNum = 1, numScore = 0;
export function startNumberGame() {
    numScore = 0; numTimeLeft = 15; currentTargetNum = 1;
    document.getElementById('num-score').innerText = `獲得: ${numScore}枚`; document.getElementById('num-timer').innerText = `残り時間: ${numTimeLeft}秒`;
    document.getElementById('num-start-btn').disabled = true; generateNumberGrid();
    numTimer = setInterval(() => {
        numTimeLeft--; document.getElementById('num-timer').innerText = `残り時間: ${numTimeLeft}秒`;
        if (numTimeLeft <= 0) {
            clearInterval(numTimer); document.getElementById('num-start-btn').disabled = false; document.getElementById('number-tap-grid').innerHTML = '';
            playerData.coins += numScore; playerData.stats.totalEarned += numScore; updateCoinDisplay(); alert(`パズル終了！ 💰 ${numScore} 枚ゲット！`);
        }
    }, 1000);
}
function generateNumberGrid() {
    const grid = document.getElementById('number-tap-grid'); grid.innerHTML = '';
    let numbers = Array.of(1, 2, 3, 4, 5); numbers.sort(() => Math.random() - 0.5);
    numbers.forEach(num => {
        const box = document.createElement('div'); box.className = 'num-tap-box'; box.innerText = num;
        box.addEventListener('click', () => {
            if (numTimeLeft > 0 && num === currentTargetNum) {
                box.style.visibility = 'hidden'; currentTargetNum++;
                if (currentTargetNum > 5) { numScore += 15; document.getElementById('num-score').innerText = `獲得: ${numScore}枚`; currentTargetNum = 1; generateNumberGrid(); }
            }
        });
        grid.appendChild(box);
    });
}
