window.initDinoGame = function() {
    const canvas = document.getElementById('dinoCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let isPlaying = false;
    let score = 0;
    let highscore = localStorage.getItem('kpr_dino_highscore') || 0;
    let gameSpeed = 4;
    let speedIncrement = 0.002;
    
    let dino = { x: 30, y: 120, w: 20, h: 30, vy: 0, gravity: 0.6, jumpForce: -10, isGrounded: true };
    let obstacles = [];
    let nextObstacleTimer = 0;

    function spawnObstacle() {
        let minGap = 150 + (gameSpeed * 15);
        let maxGap = 300 + (gameSpeed * 25);
        let randomGap = Math.random() * (maxGap - minGap) + minGap;
        
        let lastObstacle = obstacles[obstacles.length - 1];
        let startX = lastObstacle ? lastObstacle.x + randomGap : canvas.width + 50;

        obstacles.push({
            x: startX,
            y: 125,
            w: 15,
            h: 25
        });
    }

    function resetGame() {
        score = 0;
        gameSpeed = 4;
        obstacles = [];
        dino.y = 120;
        dino.vy = 0;
        dino.isGrounded = true;
        isPlaying = true;
        spawnObstacle();
    }
    window.resetDinoGame = resetGame;

    function jump() {
        if (dino.isGrounded && isPlaying) {
            dino.vy = dino.jumpForce;
            dino.isGrounded = false;
        }
    }

    window.addEventListener('keydown', (e) => { if (e.code === 'Space') { jump(); e.preventDefault(); } });
    canvas.addEventListener('pointerdown', () => { jump(); });

    function update() {
        if (!isPlaying) return;

        gameSpeed += speedIncrement;
        score += 0.1;

        dino.vy += dino.gravity;
        dino.y += dino.vy;

        if (dino.y >= 120) {
            dino.y = 120;
            dino.vy = 0;
            dino.isGrounded = true;
        }

        if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width) {
            spawnObstacle();
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            let o = obstacles[i];
            o.x -= gameSpeed;

            if (o.x + o.w < 0) {
                obstacles.splice(i, 1);
                continue;
            }

            if (dino.x < o.x + o.w && dino.x + dino.w > o.x && dino.x < o.x + o.w && dino.y < o.y + o.h && dino.y + dino.h > o.y) {
                isPlaying = false;
                if (score > highscore) {
                    highscore = Math.floor(score);
                    localStorage.setItem('kpr_dino_highscore', highscore);
                }
            }
        }
    }

    function render() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#55ff55';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 145);
        ctx.lineTo(canvas.width, 145);
        ctx.stroke();

        ctx.fillStyle = '#55ff55';
        ctx.fillRect(dino.x, dino.y, dino.w, dino.h);

        ctx.fillStyle = '#55ff55';
        obstacles.forEach(o => {
            ctx.fillRect(o.x, o.y, o.w, o.h);
        });

        ctx.font = '10px Courier New';
        ctx.fillText(`HI: ${Math.floor(highscore)}  SCORE: ${Math.floor(score)}`, 10, 20);

        if (!isPlaying) {
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#55ff55';
            ctx.font = '14px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(currentLang === 'ru' ? 'ИГРА ОКОНЧЕНА' : 'GAME OVER', canvas.width / 2, 70);
            ctx.font = '10px Courier New';
            ctx.fillText(currentLang === 'ru' ? 'Кликни для перезапуска' : 'Click to restart', canvas.width / 2, 95);
            ctx.textAlign = 'left';
        }
    }

    function loop() {
        update();
        render();
        requestAnimationFrame(loop);
    }

    canvas.addEventListener('click', () => { if (!isPlaying) resetGame(); });
    resetGame();
    loop();
};
