window.initTowerGame = function() {
    const canvas = document.getElementById('towerCanvas');
    const overBox = document.getElementById('tower-over-box');
    const scoreEl = document.getElementById('tower-score');
    if (!canvas || !scoreEl) return;
    const ctx = canvas.getContext('2d');

    let baseWidth = 140;
    let stack = [];
    let currentPiece = {};
    let score = 0;
    let highscore = localStorage.getItem('kpr_tower_highscore') || 0;
    let isGameOver = false;
    let direction = 1;
    let speed = 120;
    let lastTime = 0;

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width - 16;
        canvas.height = rect.height - 80;
        if (stack.length > 0) {
            draw();
        }
    }
    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
    });
    resizeObserver.observe(canvas.parentElement);

    function getLang() {
        return typeof currentLang !== 'undefined' ? currentLang : 'ru';
    }

    function updateScorePanel() {
        const isRu = (getLang() === 'ru');
        scoreEl.innerText = (isRu ? 'ЭТАЖИ: ' : 'ROWS: ') + score + ' | ' + (isRu ? 'РЕКОРД: ' : 'BEST: ') + highscore;
    }

    window.resetTowerGame = function() {
        baseWidth = 140;
        score = 0;
        isGameOver = false;
        direction = 1;
        speed = 120;
        if (overBox) overBox.innerHTML = '';
        
        stack = [
            { x: (canvas.width - baseWidth) / 2, w: baseWidth, y: canvas.height - 20 }
        ];

        spawnPiece();
        updateScorePanel();
        lastTime = performance.now();
    };

    function spawnPiece() {
        const lastPiece = stack[stack.length - 1];
        currentPiece = {
            x: direction === 1 ? -baseWidth : canvas.width,
            w: baseWidth,
            y: lastPiece.y - 20
        };
    }

    window.dropTowerPiece = function() {
        if (isGameOver) {
            window.resetTowerGame();
            return;
        }

        const lastPiece = stack[stack.length - 1];
        let leftEdge = Math.max(currentPiece.x, lastPiece.x);
        let rightEdge = Math.min(currentPiece.x + currentPiece.w, lastPiece.x + lastPiece.w);

        if (leftEdge >= rightEdge) {
            triggerGameOver();
            return;
        }

        baseWidth = rightEdge - leftEdge;
        currentPiece.x = leftEdge;
        currentPiece.w = baseWidth;

        stack.push(currentPiece);
        score++;

        if (score > highscore) {
            highscore = score;
            localStorage.setItem('kpr_tower_highscore', highscore);
        }
        updateScorePanel();

        if (currentPiece.y < 80) {
            stack.forEach(p => p.y += 20);
        }

        speed += 10;
        direction = Math.random() > 0.5 ? 1 : -1;
        spawnPiece();
    };

    function triggerGameOver() {
        isGameOver = true;
        const isRu = (getLang() === 'ru');
        if (overBox) {
            overBox.innerHTML = `<span style="color:var(--neon-red); font-size:12px; cursor:pointer;" onclick="window.resetTowerGame()">${isRu ? 'БАШНЯ РУХНУЛА! НАЖМИ [ПРОБЕЛ]' : 'TOWER CRASHED! PRESS [SPACE]'}</span>`;
        }
    }

    window.addEventListener('keydown', (e) => {
        const win = document.getElementById('win-tower');
        if (!win || win.style.display !== 'block') return;
        if (e.code === 'Space') {
            e.preventDefault();
            window.dropTowerPiece();
        }
    });

    canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        window.dropTowerPiece();
    });

    function update(dt) {
        if (isGameOver) return;
        currentPiece.x += direction * speed * dt;

        if (direction === 1 && currentPiece.x + currentPiece.w > canvas.width + 40) {
            direction = -1;
        } else if (direction === -1 && currentPiece.x < -40) {
            direction = 1;
        }
    }

    function draw() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stack.forEach(p => {
            ctx.fillStyle = '#003300';
            ctx.fillRect(p.x, p.y, p.w, 18);
            ctx.strokeStyle = '#55ff55';
            ctx.lineWidth = 1;
            ctx.strokeRect(p.x, p.y, p.w, 18);
        });

        if (!isGameOver && currentPiece.w) {
            ctx.fillStyle = '#55ff55';
            ctx.fillRect(currentPiece.x, currentPiece.y, currentPiece.w, 18);
        }
    }

    function loop(timestamp) {
        const win = document.getElementById('win-tower');
        if (win && win.style.display === 'block') {
            if (!lastTime) lastTime = timestamp;
            let dt = (timestamp - lastTime) / 1000;
            if (dt > 0.1) dt = 0.1;
            lastTime = timestamp;

            update(dt);
            draw();
        }
        requestAnimationFrame(loop);
    }

    window.resetTowerGame();
    requestAnimationFrame(loop);
};
