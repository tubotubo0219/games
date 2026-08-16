import { playerData, updateCoinDisplay } from './data.js';

// ==========================================
// 🧺 ミニゲーム2：落とし物キャッチ (左右移動)
// ==========================================
let catchTimer = null, catchSpawnInterval = null, catchScore = 0, catchTimeLeft = 0;
let avatarX = 80;

export function startCatcher() {
    catchScore = 0; catchTimeLeft = 15; avatarX = 80;
    document.getElementById('catcher-score').innerText = `獲得: ${catchScore}枚`;
    document.getElementById('catcher-timer').innerText = `残り時間: ${catchTimeLeft}秒`;
    document.getElementById('catcher-start-btn').disabled = true;
    document.getElementById('move-left-btn').disabled = false;
    document.getElementById('move-right-btn').disabled = false;
    toggleCatcherMode(true);
    updateAvatarPosition();

    catchTimer = setInterval(() => {
        catchTimeLeft--;
        document.getElementById('catcher-timer').innerText = `残り時間: ${catchTimeLeft}秒`;
        if (catchTimeLeft <= 0) { endCatcherGame(); }
    }, 1000);

    catchSpawnInterval = setInterval(() => { spawnFallingCoin(); }, 800);
}

function toggleCatcherMode(isActive) {
    const avatarContainer = document.getElementById('game-catcher-avatar');
    const stage = document.getElementById('game-falling-stage');
    const normalAvatarGroup = document.querySelectorAll('.avatar-area .layer, .avatar-area .layer-group');
    if (isActive) {
        normalAvatarGroup.forEach(el => { if(el.id !== 'layer-bg') el.style.opacity = '0'; });
        avatarContainer.className = 'catcher-avatar-visible';
        stage.className = 'falling-stage-visible';
    } else {
        normalAvatarGroup.forEach(el => el.style.opacity = '1');
        avatarContainer.className = 'catcher-avatar-hidden';
        stage.className = 'falling-stage-hidden';
        stage.innerHTML = '';
    }
}

export function moveAvatar(direction) {
    if (direction === 'left' && avatarX > 10) { avatarX -= 35; }
    if (direction === 'right' && avatarX < 150) { avatarX += 35; }
    updateAvatarPosition();
}

function updateAvatarPosition() {
    document.getElementById('game-catcher-avatar').style.left = `${avatarX}px`;
}

function spawnFallingCoin() {
    const stage = document.getElementById('game-falling-stage');
    const coin = document.createElement('div');
    coin.className = 'falling-coin';
    coin.innerText = '💰';
    
    const lanes = Array.of(20, 90, 160);
    const coinX = lanes[Math.floor(Math.random() * lanes.length)];
    coin.style.left = `${coinX}px`;
    stage.appendChild(coin);

    setTimeout(() => {
        if (catchTimeLeft > 0) {
            if (Math.abs((avatarX + 10) - coinX) < 30) {
                catchScore += 5;
                document.getElementById('catcher-score').innerText = `獲得: ${catchScore}枚`;
                coin.innerText = '✨';
            }
        }
        setTimeout(() => coin.remove(), 200);
    }, 1300);
}

function endCatcherGame() {
    clearInterval(catchTimer);
    clearInterval(catchSpawnInterval);
    document.getElementById('catcher-start-btn').disabled = false;
    document.getElementById('move-left-btn').disabled = true;
    document.getElementById('move-right-btn').disabled = true;
    
    playerData.coins += catchScore;
    updateCoinDisplay();
    toggleCatcherMode(false);
    alert(`キャッチゲーム終了！ 💰 ${catchScore} 枚ゲット！`);
}

// ==========================================
// 🏃 ミニゲーム4：ハイパーランナー (ランゲーム)
// ==========================================
let runGameActive = false;
let runScore = 0;
let runSpeed = 1.0;
let runLoopInterval = null;
let obstacleSpawnTimeout = null;
let isJumping = false;
let currentAvatarY = 0; // 【追加】アバターの現在の高さをリアルタイム追跡

export function startRunnerGame() {
    if (runGameActive) return;
    runGameActive = true;
    runScore = 0;
    runSpeed = 1.0;
    isJumping = false;
    currentAvatarY = 0;

    document.getElementById('runner-score').innerText = `獲得: ${runScore}枚`;
    document.getElementById('run-speed-text').innerText = `スピード: ${runSpeed.toFixed(1)}x`;
    document.getElementById('runner-start-btn').disabled = true;
    document.getElementById('runner-jump-btn').disabled = false;

    toggleRunnerMode(true);

    runLoopInterval = setInterval(() => {
        runSpeed += 0.001;
        document.getElementById('run-speed-text').innerText = `スピード: ${runSpeed.toFixed(1)}x`;
        
        // 【追加】アバターのジャンプ中の高さをCSSの見た目からリアルタイムに計算して取得
        const avatarEl = document.getElementById('run-avatar');
        if (avatarEl) {
            const computedStyle = window.getComputedStyle(avatarEl);
            const bottomPx = parseFloat(computedStyle.bottom) || 60;
            currentAvatarY = bottomPx - 60; // 地面(60px)を基準とした高さを算出
        }

        checkRunnerCollisions();
    }, 30);

    spawnRunnerObjects();
}

function toggleRunnerMode(isActive) {
    const runStage = document.getElementById('game-run-stage');
    const normalAvatarGroup = document.querySelectorAll('.avatar-area .layer, .avatar-area .layer-group');
    if (isActive) {
        normalAvatarGroup.forEach(el => { if(el.id !== 'layer-bg') el.style.opacity = '0'; });
        runStage.className = 'run-stage-visible';
    } else {
        normalAvatarGroup.forEach(el => el.style.opacity = '1');
        runStage.className = 'run-stage-hidden';
        document.querySelectorAll('.run-obstacle, .run-item').forEach(el => el.remove());
    }
}

export function triggerJump() {
    if (isJumping || !runGameActive) return;
    isJumping = true;
    const avatar = document.getElementById('run-avatar');
    avatar.classList.add('jumping');

    setTimeout(() => {
        avatar.classList.remove('jumping');
        isJumping = false;
    }, 600);
}

function spawnRunnerObjects() {
    if (!runGameActive) return;
    const stage = document.getElementById('game-run-stage');
    const isObstacle = Math.random() < 0.6; 
    const el = document.createElement('div');
    
    if (isObstacle) {
        el.className = 'run-obstacle';
        // 【修正】文字化け対策として文字ではなくCSSでトゲ（▲）を描画するスタイルを付与
        el.style.width = '0';
        el.style.height = '0';
        el.style.borderLeft = '12px solid transparent';
        el.style.borderRight = '12px solid transparent';
        el.style.borderBottom = '24px solid #f44336'; // 赤色のシャープなトゲ
    } else {
        el.className = 'run-item';
        el.innerText = '💰';
        // コイン袋をジャンプで届く高さ（地上から35px上空）に浮かせる
        el.style.marginBottom = '35px'; 
    }

    el.style.left = '200px';
    stage.appendChild(el);

    let objectX = 200;
    const moveInterval = setInterval(() => {
        if (!runGameActive) {
            clearInterval(moveInterval);
            el.remove();
            return;
        }
        objectX -= 3 * runSpeed;
        el.style.left = `${objectX}px`;

        if (objectX < -30) {
            clearInterval(moveInterval);
            el.remove();
        }
    }, 20);

    const nextSpawnTime = Math.max(800, 2000 - (runSpeed * 300)) + (Math.random() * 500);
    obstacleSpawnTimeout = setTimeout(spawnRunnerObjects, nextSpawnTime);
}

function checkRunnerCollisions() {
    // 1. 障害物（赤トゲ▲）との衝突判定
    document.querySelectorAll('.run-obstacle').forEach(obs => {
        const obsX = parseFloat(obs.style.left);
        // アバターの横幅の範囲（20px〜55px）にトゲが入ったとき
        if (obsX > 15 && obsX < 55) {
            // アバターの高さがトゲの高さ（20px）より低ければ激突
            if (currentAvatarY < 20) {
                endRunnerGame(false);
            }
        }
    });

    // 2. コイン袋（💰）の獲得判定（立体判定に修正）
    document.querySelectorAll('.run-item').forEach(item => {
        const itemX = parseFloat(item.style.left);
        if (itemX > 10 && itemX < 60) {
            // コイン袋は上空35px付近にあるため、ジャンプの高さが20px〜65pxの間ならキャッチ成功！
            if (currentAvatarY > 20 && currentAvatarY < 65) {
                runScore += 10;
                document.getElementById('runner-score').innerText = `獲得: ${runScore}枚`;
                item.remove();
            }
        }
    });
}

function endRunnerGame(isVoluntary) {
    runGameActive = false;
    clearInterval(runLoopInterval);
    clearTimeout(obstacleSpawnTimeout);
    document.getElementById('runner-start-btn').disabled = false;
    document.getElementById('runner-jump-btn').disabled = true;

    playerData.coins += runScore;
    updateCoinDisplay();
    toggleRunnerMode(false);

    if (!isVoluntary) {
        alert(`💥 障害物にぶつかってしまった！\nゲームオーバー！\n💰 コインを ${runScore} 枚獲得しました！`);
    }
}
