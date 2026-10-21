window.initDinoGame = function() {
    const canvas = document.getElementById('dinoCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let gameSpeed = 5;
    let score = 0;
    let isGameOver = false;
    let isStarted = false;
    
    let dino = { x: 50, y: 110, w: 20, h: 24, velocity: 0, gravity: 0.6, jumpPower: -10, isJumping: false };
    let obstacles = [];
    
    window.resetDinoGame = function() {
        gameSpeed = 5;
        score = 0;
        isGameOver = false;
        isStarted = false;
        dino.y = 110;
        dino.velocity = 0;
        dino.isJumping = false;
        obstacles = [];
        document.getElementById('dino-hint').innerText = "Нажми ПРОБЕЛ / Кликни для прыжка и старта";
    };

    function spawnObstacle() {
        let type = Math.random() > 0.5 ? 1 : 2; 
        obstacles.push({
            x: canvas.width + 50,
            y: type === 1 ? 114 : 104,
            w: type === 1 ? 12 : 18,
            h: type === 1 ? 20 : 30
        });
    }

    function drawDinoSprite(x, y, w, h) {
        ctx.fillStyle = '#33ff33';
        ctx.fillRect(x + 4, y, w - 4, 6);
        ctx.fillRect(x, y + 6, w, 6);
        ctx.fillRect(x, y + 12, w - 6, 6);
        ctx.fillRect(x + 2, y + 18, 6, 6);
        ctx.fillRect(x + 10, y + 18, 6, 6);
    }

    function drawCactusSprite(x, y, w, h) {
        ctx.fillStyle = '#33ff33';
        ctx.fillRect(x + Math.floor(w/3), y, Math.floor(w/3), h);
        ctx.fillRect(x, y + Math.floor(h/4), w, Math.floor(h/5));
    }

    function loop() {
        if (document.getElementById('win-dino').style.display !== 'block') return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#33ff33';
        ctx.lineWidth = 2;
        
        ctx.beginPath(); ctx.moveTo(0, 134); ctx.lineTo(canvas.width, 134); ctx.stroke();
        
        if (isStarted && !isGameOver) {
            score++;
            if (score % 200 === 0) gameSpeed += 0.5;
            
            dino.velocity += dino.gravity;
            dino.y += dino.velocity;
            if (dino.y >= 110) { dino.y = 110; dino.isJumping = false; dino.velocity = 0; }
            
            if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - (Math.random() * 200 + 150)) {
                spawnObstacle();
            }
        }
        
        drawDinoSprite(dino.x, dino.y, dino.w, dino.h);
        
        for (let i = obstacles.length - 1; i >= 0; i--) {
            let o = obstacles[i];
            if (!isGameOver && isStarted) o.x -= gameSpeed;
            
            drawCactusSprite(o.x, o.y, o.w, o.h);
            
            if (dino.x < o.x + o.w && dino.x + dino.w > o.x && dino.x < o.x + o.w && dino.y + dino.h > o.y) {
                isGameOver = true;
                document.getElementById('dino-hint').innerHTML = "<span style='color:var(--neon-red);font-weight:bold;'>ИГРА ОКОНЧЕНА!</span> Кликни сюда для перезапуска.";
            }
            if (o.x < -40) obstacles.splice(i, 1);
        }
        
        ctx.fillStyle = '#33ff33';
        ctx.font = '14px Courier New';
        ctx.fillText(`HI-SCORE: ${score}`, canvas.width - 140, 20);
    }
    
    setInterval(loop, 20);
    
    const action = () => {
        if (isGameOver) { window.resetDinoGame(); return; }
        if (!isStarted) { isStarted = true; document.getElementById('dino-hint').innerText = "Прыжок: ПРОБЕЛ"; }
        if (!dino.isJumping) { dino.velocity = dino.jumpPower; dino.isJumping = true; }
    };
    
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && document.getElementById('win-dino').style.display === 'block') {
            e.preventDefault(); action();
        }
    });
    canvas.addEventListener('click', action);
    document.getElementById('dino-hint').addEventListener('click', action);
};
