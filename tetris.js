window.initTetrisGame = function() {
    const canvas = document.getElementById('tetrisCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COLS = 10, ROWS = 20, SIZE = 12;
    canvas.width = COLS * SIZE; 
    canvas.height = ROWS * SIZE;

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
                ctx.fillRect(c*SIZE, r*SIZE, SIZE-1, SIZE-1); 
            }
        }));
        if (piece && piece.matrix && !gameOver) {
            piece.matrix.forEach((row, r) => row.forEach((val, c) => {
                if (val) { 
                    ctx.fillStyle = colors[piece.color]; 
                    ctx.fillRect((piece.x+c)*SIZE, (piece.y+r)*SIZE, SIZE-1, SIZE-1); 
                }
            }));
        }
        const scoreLabel = document.getElementById('tetris-score');
        if (scoreLabel) {
            scoreLabel.innerText = (getLang() === 'ru' ? 'СЧЕТ: ' : 'SCORE: ') + score;
        }

        if (gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#55ff55';
            ctx.font = '10px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(getLang() === 'ru' ? 'ИГРА ОКОНЧЕНА' : 'GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
            ctx.font = '7px Courier New';
            ctx.fillText(getLang() === 'ru' ? '[ПРОБЕЛ] РЕСТАРТ' : '[SPACE] RESTART', canvas.width / 2, canvas.height / 2 + 10);
            ctx.textAlign = 'left';
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
        if (action === 'right') window.window.tetrisMoveRight();
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
