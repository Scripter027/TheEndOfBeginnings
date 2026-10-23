window.initTetrisGame = function() {
    const canvas = document.getElementById('tetrisCanvas');
    const overBox = document.getElementById('tetris-over-box');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COLS = 10, ROWS = 20;
    let size = 20;

    let score = 0, gameOver = false, timer = 0, board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
    const colors = [null, '#55ff55', '#55ff55', '#55ff55', '#55ff55', '#55ff55', '#55ff55', '#55ff55'];
    const shapes = [
        [],
        [[1,1,1,1]],
        [[1,1,1],[0,1,0]],
        [[1,1,1],[1,0,0]],
        [[1,1,1],[0,0,1]],
        [[1,1],[1,1]],
        [[1,1,0],[0,1,1]],
        [[0,1,1],[1,1,0]]
    ];

    let piece = getRandomPiece();

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const availableHeight = rect.height - 120;
        const sizeByHeight = Math.floor(availableHeight / ROWS);
        const sizeByWidth = Math.floor((rect.width - 32) / COLS);
        size = Math.max(16, Math.min(sizeByHeight, sizeByWidth));
        canvas.width = COLS * size; 
        canvas.height = ROWS * size;
        draw();
    }

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
    });
    resizeObserver.observe(canvas.parentElement);

    function getLang() {
        return typeof currentLang !== 'undefined' ? currentLang : 'ru';
    }

    function getRandomPiece() {
        const id = Math.floor(Math.random() * 7) + 1;
        return { matrix: shapes[id], x: Math.floor(COLS/2) - 1, y: 0, color: id };
    }

    function draw() {
        ctx.fillStyle = '#000000'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        board.forEach((row, r) => row.forEach((val, c) => {
            if (val) { 
                ctx.fillStyle = colors[val]; 
                ctx.fillRect(c*size, r*size, size-1, size-1); 
            }
        }));
        if (piece && piece.matrix && !gameOver) {
            piece.matrix.forEach((row, r) => row.forEach((val, c) => {
                if (val) { 
                    ctx.fillStyle = colors[piece.color]; 
                    ctx.fillRect((piece.x+c)*size, (piece.y+r)*size, size-1, size-1); 
                }
            }));
        }
        const scoreLabel = document.getElementById('tetris-score');
        if (scoreLabel) {
            scoreLabel.innerText = (getLang() === 'ru' ? 'СЧЕТ: ' : 'SCORE: ') + score;
        }
    }
    function collide(p, ox=0, oy=0) {
        return p.matrix.some((row, r) => row.some((val, c) => {
            if (!val) return false;
            let nx = p.x + c + ox, ny = p.y + r + oy;
            return nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && board[ny][nx]);
        }));
    }

    function merge() {
        piece.matrix.forEach((row, r) => row.forEach((val, c) => {
            if (val && piece.y+r >= 0) board[piece.y+r][piece.x+c] = piece.color;
        }));
    }

    function rotate() {
        const m = piece.matrix;
        const n = m[0].map((_, i) => m.map(row => row[i]).reverse());
        const oldMatrix = piece.matrix; 
        piece.matrix = n;
        if (collide(piece)) piece.matrix = oldMatrix;
    }

    function drop() {
        if (collide(piece, 0, 1)) {
            merge(); 
            clearLines(); 
            piece = getRandomPiece();
            if (collide(piece)) { 
                gameOver = true; 
                if (overBox) {
                    overBox.innerHTML = `<span style="color:var(--neon-red); font-size:12px; cursor:pointer;" onclick="window.resetTetrisGame()">${getLang() === 'ru' ? 'ИГРА ОКОНЧЕНА! НАЖМИ [ПРОБЕЛ]' : 'GAME OVER! PRESS [SPACE]'}</span>`;
                }
            }
        } else { 
            piece.y++; 
        }
    }

    function clearLines() {
        let count = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r].every(val => val > 0)) { 
                board.splice(r, 1); 
                board.unshift(Array(COLS).fill(0)); 
                count++; 
                r++; 
            }
        }
        if (count > 0) score += count * 10;
    }

    window.tetrisMoveLeft = function() { if (!gameOver && !collide(piece, -1, 0)) piece.x--; draw(); };
    window.tetrisMoveRight = function() { if (!gameOver && !collide(piece, 1, 0)) piece.x++; draw(); };
    window.tetrisRotate = function() { if (!gameOver) { rotate(); draw(); } };
    window.tetrisDrop = function() { if (!gameOver) { drop(); draw(); } };

    window.controlTetris = function(action) {
        if (action === 'left') window.tetrisMoveLeft();
        if (action === 'right') window.tetrisMoveRight();
        if (action === 'rotate') window.tetrisRotate();
        if (action === 'down') window.tetrisDrop();
    };

    function update(time=0) {
        const win = document.getElementById('win-tetris');
        if (gameOver || !win || win.style.display !== 'block') return;
        if (time - timer > 500) { 
            drop(); 
            draw(); 
            timer = time; 
        }
        requestAnimationFrame(update);
    }

    window.resetTetrisGame = function() {
        board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
        score = 0; 
        gameOver = false; 
        piece = getRandomPiece(); 
        if (overBox) overBox.innerHTML = '';
        draw();
        requestAnimationFrame(update);
    };

    window.addEventListener('keydown', e => {
        const win = document.getElementById('win-tetris');
        if (!win || win.style.display !== 'block') return;
        if (gameOver && e.code === 'Space') {
            window.resetTetrisGame();
            e.preventDefault();
            return;
        }
        if (!gameOver) {
            if (e.key === 'ArrowLeft') window.tetrisMoveLeft();
            if (e.key === 'ArrowRight') window.tetrisMoveRight();
            if (e.key === 'ArrowUp') window.tetrisRotate();
            if (e.key === 'ArrowDown') window.tetrisDrop();
        }
    });

    window.resetTetrisGame();
};
