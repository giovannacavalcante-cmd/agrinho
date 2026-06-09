const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const gameContainer = document.getElementById('game-container');

// Configurações do Jogo
let score = 0;
let gameActive = false;
let player = { x: 0, y: 0, width: 70, height: 70, speed: 10 };
let positiveItems = [];
let negativeItems = [];
let animationId;

// Assets (Emojis temáticos do Agro Sustentável)
const playerEmoji = '🚜'; // Trator (Produção)
const techEmoji = '🛰️';   // Tecnologia/Drone
const treeEmoji = '🌳';   // Preservação
const waterEmoji = '💧';  // Uso consciente de água
const wasteEmoji = '⚠️';  // Desperdício/Risco

function initGame() {
    canvas.width = gameContainer.offsetWidth - 40;
    canvas.height = 400;
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 10;
    score = 0;
    positiveItems = [];
    negativeItems = [];
    scoreElement.innerText = score;
}

function drawPlayer() {
    ctx.font = '60px serif';
    ctx.fillText(playerEmoji, player.x, player.y + 60);
}

function createItem() {
    // Itens Positivos (Sustentabilidade)
    if (Math.random() < 0.04) {
        const types = [techEmoji, treeEmoji, waterEmoji];
        positiveItems.push({
            x: Math.random() * (canvas.width - 40),
            y: -40,
            emoji: types[Math.floor(Math.random() * types.length)],
            speed: 3 + Math.random() * 3
        });
    }

    // Itens Negativos (Desafios)
    if (Math.random() < 0.015) {
        negativeItems.push({
            x: Math.random() * (canvas.width - 40),
            y: -40,
            emoji: wasteEmoji,
            speed: 4 + Math.random() * 2
        });
    }
}

function updateObjects() {
    // Update Positive Items
    for (let i = positiveItems.length - 1; i >= 0; i--) {
        positiveItems[i].y += positiveItems[i].speed;
        
        if (positiveItems[i].y + 40 > player.y && 
            positiveItems[i].x < player.x + player.width && 
            positiveItems[i].x + 40 > player.x) {
            positiveItems.splice(i, 1);
            score += 15;
            scoreElement.innerText = score;
            continue;
        }

        if (positiveItems[i].y > canvas.height) positiveItems.splice(i, 1);
    }

    // Update Negative Items
    for (let i = negativeItems.length - 1; i >= 0; i--) {
        negativeItems[i].y += negativeItems[i].speed;
        
        if (negativeItems[i].y + 40 > player.y && 
            negativeItems[i].x < player.x + player.width && 
            negativeItems[i].x + 40 > player.x) {
            gameOver();
        }

        if (negativeItems[i].y > canvas.height) negativeItems.splice(i, 1);
    }
}

function drawObjects() {
    ctx.font = '40px serif';
    positiveItems.forEach(item => ctx.fillText(item.emoji, item.x, item.y));
    negativeItems.forEach(item => ctx.fillText(item.emoji, item.x, item.y));
}

function gameLoop() {
    if (!gameActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawPlayer();
    createItem();
    updateObjects();
    drawObjects();
    
    animationId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameActive = false;
    cancelAnimationFrame(animationId);
    alert(`Fim de Jornada! Sua pontuação de Sustentabilidade foi: ${score}. Lembre-se: Agro Forte é Agro Sustentável!`);
    document.getElementById('start-btn').style.display = 'block';
}

// Controls
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed * 2;
    if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed * 2;
});

document.getElementById('start-btn').addEventListener('click', () => {
    initGame();
    gameActive = true;
    document.getElementById('start-btn').style.display = 'none';
    gameLoop();
});

window.addEventListener('resize', initGame);
initGame();
