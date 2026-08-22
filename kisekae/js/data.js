export let playerData = {
    coins: 100,
    inventory: {
        hair: ['short', 'long', 'twintail'],
        clothes: ['tshirt', 'onepiece', 'suit'],
        furniture: ['plush', 'plant']
    },
    activeFurniture: [],
    equipped: { hair: 'short', clothes: 'tshirt' },
    equippedBg: 'pink',
    furniturePos: {
        plush: { x: 45, y: 260, width: 30, height: 35 },   
        plant: { x: 310, y: 260, width: 35, height: 50 },
        guitar: { x: 340, y: 265, width: 20, height: 75 }
    },
    stats: {
        gachaCount: 0,      
        totalEarned: 0,     
        claimedQuests: Array.of() 
    }
};

export const itemDetails = {
    hair: {
        short: { icon: '💇', name: 'ショートヘア', desc: '初期装備のシンプルな髪型です。さっぱりしていて動きやすい！' },
        long: { icon: '👩', name: 'ロングヘア', desc: '黒髪のサラサラなストレートロングヘア。大人っぽい雰囲気になれます。' },
        twintail: { icon: '👧', name: 'ツインテール', desc: '明るい金髪の元気いっぱいなツインテール。ポップな服にピッタリ！' },
        cyber: { icon: '⚡', name: 'サイバーヘアー', desc: '【ガチャ限定】ネオンブルーに光る未来感のあるヘアスタイル。' }
    },
    clothes: {
        tshirt: { icon: '👕', name: '赤の星柄Tシャツ', desc: '真ん中に大きな星マークがついた、元気な定番カジュアルTシャツ。' },
        onepiece: { icon: '👗', name: '紫のワンピース', desc: '上品なパープルカラーのドレッシーなワンピースドレスです。' },
        suit: { icon: '💼', name: 'ビジネススーツ', desc: 'カチッとしたシックなダークグレーのスーツ。お仕事モードに。' },
        tuxedo: { icon: '👔', name: '高級タキシード', desc: '【ショップ限定】パーティーで主役になれる純黒のフォーマルタキシード。' },
        maid: { icon: '🎀', name: 'クラシックメイド服', desc: '【ガチャ限定】フリルとリボンがたっぷりあしらわれた可愛いメイドドレス。' }
    },
    furniture: {
        plush: { icon: '🧸', name: 'ぬいぐるみ', desc: 'ちょこんとお部屋に佇むクマのぬいぐるみ。癒やし効果バツグン。' },
        plant: { icon: '🌱', name: '観葉植物', desc: 'お部屋の空気をきれいにしてくれる緑豊かなインテリア植物。' },
        guitar: { icon: '🎸', name: 'ギタースタンド', desc: '【ショップ限定】ロックスターに憧れる人のための本格アコースティックギター。' }
    }
};

export const questList = Array.of(
    { id: 'q1', title: '初めの一歩', desc: 'お買い物やミニゲームで遊んで、累計50コイン稼ごう！', reward: 30, check: (data) => data.stats.totalEarned >= 50 },
    { id: 'q2', title: 'ガチャツアラー', desc: 'ラッキーガチャを2回以上回そう！', reward: 40, check: (data) => data.stats.gachaCount >= 2 },
    { id: 'q3', title: 'インテリアマイスター', desc: 'お部屋に家具を2個以上同時に配置しよう！', reward: 50, check: (data) => data.activeFurniture.length >= 2 }
);

export const shopNormalItems = Array.of(
    { category: 'clothes', id: 'tuxedo', price: 50, label: '👔 高級タキシード' },
    { category: 'furniture', id: 'guitar', price: 60, label: '🎸 ギタースタンド' }
);

// 💡 【修正】おでかけ各スポットの「タイトル(label)」と「紹介詳細文(desc)」を豪華にデータ化
export const miniGamePortalList = Array.of(
    { targetView: 'shop-normal', label: '🛍️ お洋服・家具屋さん', desc: '新しいオシャレな服や、部屋に飾る素敵なインテリア家具をコインで直接購入できます。' },
    { targetView: 'shop-gacha', label: '🎰 ラッキーガチャショップ', desc: '1回30枚のコインで回せる運試し！ここでしか手に入らない「激レアサイバー髪」や「メイド服」を狙おう！' },
    { targetView: 'game-tapper', label: '🕹️ 連打！コインタッパー', desc: '制限時間10秒間、ひたすら目の前の巨大スイッチを連打してコインをザクザク稼ぐ爽快ゲーム！' },
    { targetView: 'game-catcher', label: '🧺 左右移動！落とし物キャッチ', desc: '上空からバラバラと落ちてくるコインをアバターを左右に動かしてキャッチする位置取りゲーム。' },
    { targetView: 'game-number', label: '🔢 スピード勝負！ナンバータップ', desc: 'パズルエリアにランダムに現れる1〜5の数値を順番に素早く見つけて消していく脳トレスピードゲーム。' },
    { targetView: 'game-runner', label: '🏃 激突注意！ハイパーランナー', desc: '迫りくる赤いトゲトゲをJUMPで避けて、空中にある10枚ボナのコイン袋を狙う本格エンドレスラン。' }
);

export const assets = {
    bg: {
        pink: '<rect width="100%" height="100%" fill="#ffebee"/>',
        yellow: '<rect width="100%" height="100%" fill="#fffde7"/>',
        blue: '<rect width="100%" height="100%" fill="#e0f7fa"/>'
    }
};

export function updateCoinDisplay() {
    document.getElementById('coin-display').innerText = `💰 コイン: ${playerData.coins}`;
}

// ==========================================
// LocalStorage セーブ＆ロード機能
// ==========================================

const SAVE_KEY = "kisekae_game_player_data";

/**
 * 現在のプレイヤーデータをLocalStorageにセーブします。
 */
function saveGameData() {
    try {
        // playerData（現在の衣装、家具配置、コイン、実績など）を文字列化して保存
        const dataString = JSON.stringify(playerData);
        localStorage.setItem(SAVE_KEY, dataString);
        console.log("ゲームデータがセーブされました。");
    } catch (error) {
        console.error("セーブ中にエラーが発生しました:", error);
    }
}

/**
 * LocalStorageからデータをロードし、現在のplayerDataに上書きします。
 */
function loadGameData() {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (!savedData) {
            console.log("セーブデータが見つかりません。初期データで開始します。");
            return false;
        }

        const parsedData = JSON.parse(savedData);

        // [安全対策] アップデートで新しいデータ項目が増えた場合も壊れないよう、マージ処理を行う
        playerData = Object.assign({}, playerData, parsedData);
        
        console.log("ゲームデータが正常にロードされました。", playerData);
        return true;
    } catch (error) {
        console.error("ロード中にエラーが発生しました。初期データを使用します:", error);
        return false;
    }
}

/**
 * 必要に応じてセーブデータを完全に削除する（デバッグ・リセット用）
 */
function resetGameData() {
    if (confirm("すべてのセーブデータを削除して最初からやり直しますか？")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload(); // ページをリロードして初期化
    }
}
