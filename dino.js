window.initDinoGame = function() {
    const canvas = document.getElementById('dinoCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let gameSpeed = 6;
    let score = 0;
    let isGameOver = false;
    let isStarted = false;
    let legToggle = false;
    let tick = 0;
    
    let dino = { x: 50, y: 110, w: 24, h: 26, velocity: 0, gravity: 0.6, jumpPower: -10, isJumping: false };
    let obstacles = [];
    
    if (window.dinoTimerActive) {
        clearInterval(window.dinoTimerActive);
        window.dinoTimerActive = null;
    }
    
    window.resetDinoGame = function() {
        gameSpeed = 6; score = 0; isGameOver = false; isStarted = false;
        dino.y = 110; dino.velocity = 0; dino.isJumping = false;
        obstacles = [];
        document.getElementById('dino-hint').innerHTML = "Нажми ПРОБЕЛ / Кликни мышь для прыжка и старта";
    };

    function spawnObstacle() {
        let size = Math.random() > 0.5 ? 1 : 2;
        obstacles.push({
            x: canvas.width + 40,
            y: size === 1 ? 112 : 102,
            w: size === 1 ? 14 : 22,
            h: size === 1 ? 22 : 32
        });
    }

    function drawDino(x, y, isJumping, legs) {
        ctx.fillStyle = '#33ff33';
        ctx.fillRect(x + 10, y, 14, 4);
        ctx.fillRect(x + 8, y + 4, 16, 4);
        ctx.fillRect(x + 8, y + 8, 8, 4);
        ctx.fillRect(x, y + 10, 18, 6);
        ctx.fillRect(x + 2, y + 16, 12, 6);
        if (isJumping) {
            ctx.fillRect(x + 4, y + 22, 4, 4);
            ctx.fillRect(x + 10, y + 22, 4, 4);
        } else {
            ctx.fillRect(x + (legs ? 4 : 6), y + 22, 4, 4);
            ctx.fillRect(x + (legs ? 10 : 8), y + 22, 4, 4);
        }
    }

    function drawCactus(x, y, w, h) {
        ctx.fillStyle = '#33ff33';
        ctx.fillRect(x + Math.floor(w/2) - 3, y, 6, h);
        ctx.fillRect(x, y + 6, w, 4);
        ctx.fillRect(x, y + 6, 4, 10);
        ctx.fillRect(x + w - 4, y + 8, 4, 10);
    }

    function update() {
        if (document.getElementById('win-dino').style.display !== 'block') return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#33ff33'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 136); ctx.lineTo(canvas.width, 136); ctx.stroke();
        
        if (isStarted && !isGameOver) {
            score++;
            tick++;
            if (tick % 8 === 0) legToggle = !legToggle;
            if (score % 300 === 0) gameSpeed += 0.7;
            
            dino.velocity += dino.gravity;
            dino.y += dino.velocity;
            if (dino.y >= 110) { dino.y = 110; dino.isJumping = false; dino.velocity = 0; }
            
            if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - (Math.random() * 250 + 180)) {
                spawnObstacle();
            }
        }
        
        drawDino(dino.x, dino.y, dino.isJumping, legToggle);
        
        for (let i = obstacles.length - 1; i >= 0; i--) {
            let o = obstacles[i];
            if (!isGameOver && isStarted) o.x -= gameSpeed;
            drawCactus(o.x, o.y, o.w, o.h);
            
            if (dino.x < o.x + o.w && dino.x + dino.w > o.x && dino.y < o.y + o.h && dino.y + dino.h > o.y) {
                isGameOver = true;
                document.getElementById('dino-hint').innerHTML = "<button id='dino-restart-btn' style='background:var(--neon-green);color:#000;border:none;padding:5px 15px;cursor:pointer;font-weight:bold;font-family:inherit;'>ПЕРЕЗАПУСК</button>";
                const rst = document.getElementById('dino-restart-btn');
                if (rst) {
                    rst.addEventListener('pointerdown', (e) => { e.stopPropagation(); window.resetDinoGame(); });
                }
            }
            if (o.x < -30) obstacles.splice(i, 1);
        }
        ctx.fillStyle = '#33ff33'; ctx.font = '14px Courier New';
        ctx.fillText(`SCORE: ${score}`, canvas.width - 120, 20);
    }
    
    window.dinoTimerActive = setInterval(update, 20);
    const trigger = (e) => {
        if (isGameOver) return;
        if (e) e.preventDefault();
        if (!isStarted) { isStarted = true; document.getElementById('dino-hint').innerText = "Прыжок: ПРОБЕЛ / Клик"; }
        if (!dino.isJumping) { dino.velocity = dino.jumpPower; dino.isJumping = true; }
    };
    canvas.addEventListener('pointerdown', (e) => { trigger(e); });
    window.addEventListener('keydown', (e) => { if (e.code === 'Space' && document.getElementById('win-dino').style.display === 'block') trigger(e); });
};
