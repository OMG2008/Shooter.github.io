// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    color: 'blue',
    health: 100,
    score: 0
};

// Bullet properties
const bullets = [];
const bulletSpeed = 7;

// Enemy properties
const enemies = [];
const enemySpeed = 2;
let enemySpawnRate = 1000; // Spawn enemies every second

// Key states
const keys = {
    left: false,
    right: false,
    space: false
};

// Event listeners for player controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
    if (e.key === ' ' || e.key === 'Enter') keys.space = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
    if (e.key === ' ' || e.key === 'Enter') keys.space = false;
});

// Move player
function movePlayer() {
    if (keys.left && player.x > 0) player.x -= player.speed;
    if (keys.right && player.x + player.width < canvas.width) player.x += player.speed;
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw bullets
function drawBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, 5, 10);

        // Remove bullets that go off screen
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

// Shoot bullets
function shootBullet() {
    if (keys.space) {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y
        });
        keys.space = false; // Prevent shooting continuously
    }
}

// Create and move enemies
function createEnemies() {
    if (Math.random() < 0.02) {
        const enemy = {
            x: Math.random() * (canvas.width - 50),
            y: -50,
            width: 50,
            height: 50,
            speed: enemySpeed,
            color: 'red'
        };
        enemies.push(enemy);
    }
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;

        // Remove enemies that go off screen
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }

        // Check for collision with player
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            player.health -= 10;
            enemies.splice(index, 1); // Remove enemy after collision
            if (player.health <= 0) gameOver();
        }

        // Check if bullets hit enemies
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + 5 > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + 10 > enemy.y
            ) {
                player.score += 10;
                enemies.splice(index, 1);
                bullets.splice(bulletIndex, 1); // Remove bullet after hitting
            }
        });
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach((enemy) => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Update score and health display
function updateUI() {
    document.getElementById('score').innerText = player.score;
    document.getElementById('health').innerText = player.health;
}

// Game over
function gameOver() {
    clearInterval(enemyInterval);
    alert("Game Over! Final Score: " + player.score);
    resetGame();
}

// Reset game state
function resetGame() {
    player.health = 100;
    player.score = 0;
    enemies.length = 0;
    bullets.length = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;
    startStory();
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    shootBullet();
    createEnemies();
    moveEnemies();
    drawPlayer();
    drawBullets();
    drawEnemies();
    updateUI();

    requestAnimationFrame(gameLoop);
}

// Start the game after story intro
function startStory() {
    document.getElementById('story').style.display = 'none';
    canvas.style.display = 'block';
    gameLoop();
}

document.getElementById('startButton').addEventListener('click', startStory);

// Start the enemy spawn interval
let enemyInterval = setInterval(createEnemies, enemySpawnRate);
