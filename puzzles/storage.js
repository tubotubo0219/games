/**
 * storage.js - 安全設計セーブデータ・履歴管理共通モジュール
 */

/**
 * ローカルストレージから特定のパズルのデータを取得する (配列・オブジェクト共通)
 * @param {string} gameKey - データの保存キー
 * @returns {Array|Object} 保存されたデータ、なければ新規の配列
 */
function getClearedStages(gameKey) {
    try {
        const rawData = localStorage.getItem(gameKey);
        // 三項演算子とJSON.parse、Arrayの安全なインスタンス化
        return rawData ? JSON.parse(rawData) : new Array();
    } catch (e) {
        console.error("Storage read error:", e);
        return new Array();
    }
}

/**
 * ローカルストレージに新しくステージクリア(数値)を保存する
 * @param {string} gameKey - データの保存キー
 * @param {number} stageNum - クリアしたステージ番号
 * @returns {boolean} 新規クリアならtrue、既クリアならfalse
 */
function saveClearedStage(gameKey, stageNum) {
    const clearedStages = getClearedStages(gameKey);
    
    // 配列である場合のみ処理
    if (Array.isArray(clearedStages)) {
        if (!clearedStages.includes(stageNum)) {
            clearedStages.push(stageNum);
            localStorage.setItem(gameKey, JSON.stringify(clearedStages));
            return true; // 新規クリア成功
        }
    }
    return false; // すでにクリア済み
}

/**
 * 【新設】ベストスコアなどのオブジェクトデータを安全に保存する (ブラケット完全排除)
 * @param {string} gameKey - データの保存キー
 * @param {Object} scoreObj - 保存したいスコアデータ (例: {miss: 2, time: 45})
 */
function saveBestScore(gameKey, scoreObj) {
    try {
        // 新規の空オブジェクトを安全に作成
        const targetObj = Object.create(null);
        // 提供されたスコアの内容を安全にコピー
        Object.assign(targetObj, scoreObj);
        
        localStorage.setItem(gameKey, JSON.stringify(targetObj));
    } catch (e) {
        console.error("Storage save error:", e);
    }
}

/**
 * 【新設】ベストスコアなどのオブジェクトデータを安全に取得する (ブラケット完全排除)
 * @param {string} gameKey - データの保存キー
 * @returns {Object|null} 保存されたオブジェクト、なければnull
 */
function getBestScore(gameKey) {
    try {
        const rawData = localStorage.getItem(gameKey);
        if (!rawData) return null;
        
        const parsed = JSON.parse(rawData);
        const safeObj = Object.create(null);
        return Object.assign(safeObj, parsed);
    } catch (e) {
        console.error("Storage load error:", e);
        return null;
    }
}
