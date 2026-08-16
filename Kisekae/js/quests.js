import { playerData, questList, itemDetails, updateCoinDisplay } from './data.js';

export function renderMenuTabGrid() {
    const targetBox = document.getElementById('view-menu');
    if (!targetBox) return;

    const compData = calculateCollectionPercentage();

    targetBox.innerHTML = `
        <h2>🏆 クエスト ＆ コレクション図鑑</h2>
        
        <!-- 【進捗インジケーター】 -->
        <div class="furn-action-panel" id="encyclopedia-shortcut-trigger" style="margin-bottom: 20px; cursor: pointer;">
            <p class="menu-notice-text" style="text-align:left; color:#9c27b0; margin-bottom: 2px;">📊 アイテム図鑑コンプリート率 (クリックで図鑑へ)</p>
            <div style="font-size:20px; font-weight:bold; margin-bottom:5px; color:#333;">
                ${compData.percent}% <span style="font-size:12px; color:#666;">(${compData.owned} / ${compData.total} アイテム)</span>
            </div>
            <div style="width:100%; height:12px; background:#e0e0e0; border-radius:6px; overflow:hidden;">
                <div style="width:${compData.percent}%; height:100%; background: linear-gradient(to right, #9c27b0, #e91e63); transition: width 0.3s;"></div>
            </div>
        </div>

        <!-- 【A：クエストセクション】 -->
        <h3 style="font-size:14px; color:#333; margin: 15px 0 8px 0;">✨ チャレンジクエスト</h3>
        <div class="shop-grid" id="menu-quest-item-list" style="margin-bottom: 25px;"></div>

        <!-- 【B：アイテム図鑑セクション】 -->
        <h3 id="encyclopedia-top-anchor" style="font-size:14px; color:#333; margin: 25px 0 5px 0; padding-top: 10px; border-top: 1px dashed #ccc;">📖 コレクション図鑑</h3>
        <p class="portal-desc" style="margin-bottom:10px;">街で手に入れたお宝一覧。未獲得はグレー表示されます。</p>
        
        <div class="category">
            <h4 style="font-size:12px; color:#666; margin: 5px 0;">💇 髪型コレクション</h4>
            <div class="item-grid" id="encyclopedia-hair-grid"></div>
        </div>
        <div class="category" style="margin-top: 15px;">
            <h4 style="font-size:12px; color:#666; margin: 5px 0;">👕 お洋服コレクション</h4>
            <div class="item-grid" id="encyclopedia-clothes-grid"></div>
        </div>
        <div class="category" style="margin-top: 15px;">
            <h4 style="font-size:12px; color:#666; margin: 5px 0;">🪑 家具コレクション</h4>
            <div class="item-grid" id="encyclopedia-furniture-grid"></div>
        </div>
    `;

    const triggerPanel = document.getElementById('encyclopedia-shortcut-trigger');
    if (triggerPanel) {
        triggerPanel.addEventListener('click', () => {
            const anchor = document.getElementById('encyclopedia-top-anchor');
            if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // 1. クエスト一覧の生成
    const questListContainer = document.getElementById('menu-quest-item-list');
    questList.forEach(quest => {
        const itemBox = document.createElement('div');
        itemBox.className = 'shop-item';
        itemBox.style.flexDirection = 'column';
        itemBox.style.alignItems = 'flex-start';
        itemBox.style.gap = '5px';

        itemBox.innerHTML = `
            <div style="font-weight:bold; font-size:13px; color:#333;">✨ ${quest.title} <span style="color:#ff9800; font-size:11px;">(報酬: 💰${quest.reward})</span></div>
            <div style="font-size:11px; color:#666; line-height:1.3;">${quest.desc}</div>
        `;

        const actionBtn = document.createElement('button');
        actionBtn.className = 'action-menu-btn install';
        actionBtn.style.width = '100%';
        actionBtn.style.marginTop = '5px';

        if (playerData.stats.claimedQuests.includes(quest.id)) {
            actionBtn.innerText = '受け取り済み';
            actionBtn.disabled = true;
            actionBtn.style.background = '#ccc';
        } else if (quest.check(playerData)) {
            actionBtn.innerText = '🎁 報酬を受け取る！';
            actionBtn.style.background = '#ff9800';
            actionBtn.onclick = (e) => {
                e.stopPropagation();
                playerData.coins += quest.reward;
                playerData.stats.claimedQuests.push(quest.id);
                updateCoinDisplay();
                renderMenuTabGrid();
                alert(`クエストクリア報酬！ 💰 コインを ${quest.reward} 枚獲得しました！`);
            };
        } else {
            actionBtn.innerText = '挑戦中...';
            actionBtn.disabled = true;
            actionBtn.style.background = '#e0e0e0';
            actionBtn.style.color = '#888';
        }

        itemBox.appendChild(actionBtn);
        questListContainer.appendChild(itemBox);
    });

    // 大元の外枠にある一番安全なポップアップを直接動かす内部関数
    const triggerGlobalPopup = (title, desc) => {
        document.getElementById('popup-title').innerText = title;
        document.getElementById('popup-desc').innerText = desc;
        document.getElementById('info-popup').classList.add('active');
    };

    // 2. アイコン形式アイテム図鑑の生成
    Array.of('hair', 'clothes', 'furniture').forEach(category => {
        const grid = document.getElementById(`encyclopedia-${category}-grid`);
        if (!grid) return;

        Object.keys(itemDetails[category]).forEach(itemId => {
            const detail = itemDetails[category][itemId];
            const hasItem = playerData.inventory[category].includes(itemId);

            const iconBox = document.createElement('div');
            iconBox.className = `item-icon-box ${hasItem ? '' : 'not-owned-gray'}`;
            iconBox.innerHTML = `
                ${detail.icon}
                <div class="item-icon-name" style="font-size:8px;">${hasItem ? detail.name : '？？？'}</div>
            `;

            iconBox.addEventListener('click', (e) => {
                e.stopPropagation();
                if (hasItem) {
                    triggerGlobalPopup(`📖 【図鑑】${detail.name}`, `${detail.desc}\n\n✨ 獲得済みアイテムです！`);
                } else {
                    triggerGlobalPopup(`🔒 【未解放】？？？`, `まだ持っていないアイテムです。\nおでかけマップからショップ街やラッキーガチャを探してみよう！`);
                }
            });

            grid.appendChild(iconBox);
        });
    });
}

function calculateCollectionPercentage() {
    let totalItemsCount = 0;
    let ownedItemsCount = 0;
    Array.of('hair', 'clothes', 'furniture').forEach(category => {
        const keys = Object.keys(itemDetails[category]);
        totalItemsCount += keys.length;
        keys.forEach(id => { if (playerData.inventory[category].includes(id)) ownedItemsCount++; });
    });
    const percent = totalItemsCount > 0 ? Math.floor((ownedItemsCount / totalItemsCount) * 100) : 0;
    return { percent, owned: ownedItemsCount, total: totalItemsCount };
}
