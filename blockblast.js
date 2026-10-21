window.initBlockBlast = function() {
    const boardEl = document.getElementById('bbBoard'), dockEl = document.getElementById('bbDock');
    if (!boardEl || !dockEl) return;
    
    let board = Array(8).fill(0).map(() => Array(8).fill(0));
    let currentScore = 0;
    let highScore = parseInt(localStorage.getItem('kpr_bb_highscore')) || 0;
    let availablePieces = [];
    
    const SHAPES = [[,], [], [,,], [,], []];

    window.resetBlockBlastGame = function() {
        board = Array(8).fill(0).map(() => Array(8).fill(0));
        currentScore = 0;
        highScore = parseInt(localStorage.getItem('kpr_bb_highscore')) || 0;
        updateScoreLabel();
        document.getElementById('bb-msg').innerText = currentLang === 'ru' ? "Зажми фигуру и тащи её на доску" : "Hold piece and drag it onto the board";
        drawBoard(); generateDock();
    };

    function updateScoreLabel() {
        const scoreLabel = document.getElementById('bb-score');
        if (!scoreLabel) return;
        if (currentLang === 'ru') {
            scoreLabel.innerText = "СЧЕТ: " + currentScore + " | РЕКОРД: " + highScore;
        } else {
            scoreLabel.innerText = "SCORE: " + currentScore + " | HIGH: " + highScore;
        }
    }

    function drawBoard() {
        boardEl.innerHTML = '';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const cell = document.createElement('div'); cell.className = 'bb-cell';
                if (board[r][c] === 1) cell.classList.add('filled');
                cell.dataset.r = r; cell.dataset.c = c;
                boardEl.appendChild(cell);
            }
        }
    }

    function generateDock() {
        dockEl.innerHTML = ''; availablePieces = [];
        for (let i = 0; i < 3; i++) {
            let shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            availablePieces.push(shape);
            const pieceWrap = document.createElement('div');
            pieceWrap.className = 'bb-piece'; pieceWrap.dataset.index = i;
            pieceWrap.style.gridTemplateRows = "repeat(" + shape.length + ", 14px)";
            pieceWrap.style.gridTemplateColumns = "repeat(" + shape.length + ", 14px)";
            
            shape.forEach(row => {
                row.forEach(val => {
                    const block = document.createElement('div'); block.className = 'bb-cell';
                    if (val === 1) block.classList.add('filled');
                    pieceWrap.appendChild(block);
                });
            });
            bindPointerEvents(pieceWrap, shape, i);
            dockEl.appendChild(pieceWrap);
        }
        checkGameOver();
    }

    function bindPointerEvents(el, shape, index) {
        el.addEventListener('pointerdown', function(e) {
            e.preventDefault(); el.setPointerCapture(e.pointerId);
            let startX = e.clientX, startY = e.clientY;
            
            function onMove(ev) {
                let dx = ev.clientX - startX, dy = ev.clientY - startY;
                el.style.transform = "translate(" + dx + "px, " + dy + "px) scale(1.1)";
                el.style.zIndex = "10000";
            }
            
            function onUp(ev) {
                document.removeEventListener('pointermove', onMove);
                el.style.transform = 'none'; el.style.zIndex = "auto";
                
                const cells = document.querySelectorAll('.bb-board .bb-cell');
                let targetCell = null;
                
                cells.forEach(c => {
                    const r = c.getBoundingClientRect();
                    if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) {
                        targetCell = c;
                    }
                });
                
                if (targetCell) {
                    let startR = parseInt(targetCell.dataset.r), startC = parseInt(targetCell.dataset.c);
                    if (canPlace(shape, startR, startC)) {
                        placePiece(shape, startR, startC);
                        availablePieces[index] = null; el.style.visibility = 'hidden';
                        checkLineClears(); drawBoard();
                        if (availablePieces.every(p => p === null)) generateDock();
                        else checkGameOver();
                        return;
                    }
                }
            }
            document.addEventListener('pointermove', onMove);
            el.addEventListener('pointerup', onUp, {once: true});
        });
    }

    function canPlace(shape, startR, startC) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] === 1) {
                    let tR = startR + r, tC = startC + c;
                    if (tR >= 8 || tC >= 8 || board[tR][tC] === 1) return false;
                }
            }
        }
        return true;
    }

    function placePiece(shape, startR, startC) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] === 1) board[startR + r][startC + c] = 1;
            }
        }
    }

    function checkLineClears() {
        let cleared = 0;
        for (let r = 0; r < 8; r++) { if (board[r].every(v => v === 1)) { board[r] = Array(8).fill(0); cleared++; } }
        for (let c = 0; c < 8; c++) {
            let col = []; for (let r = 0; r < 8; r++) col.push(board[r][c]);
            if (col.every(v => v === 1)) { for (let r = 0; r < 8; r++) board[r][c] = 0; cleared++; }
        }
        if (cleared > 0) { 
            currentScore += cleared * 10; 
            if (currentScore > highScore) {
                highScore = currentScore;
                localStorage.setItem('kpr_bb_highscore', highScore);
            }
            updateScoreLabel(); 
        }
    }

    function checkGameOver() {
        let hasMove = false;
        availablePieces.forEach(shape => {
            if (!shape) return;
            for (let r = 0; r < 8; r++) { for (let c = 0; c < 8; c++) { if (canPlace(shape, r, c)) hasMove = true; } }
        });
        if (!hasMove && availablePieces.some(p => p !== null)) {
            if (currentScore > highScore) {
                highScore = currentScore;
                localStorage.setItem('kpr_bb_highscore', highScore);
                updateScoreLabel();
            }
            const isRu = (currentLang === 'ru');
            let mainMsg = isRu ? 'ИГРА ОКОНЧЕНА.' : 'GAME OVER.';
            let rstText = isRu ? 'СНАЧАЛА' : 'RESTART';
            document.getElementById('bb-msg').innerHTML = "<span style='color:var(--neon-red);font-weight:bold;'>" + mainMsg + "</span><br><button id='bb-rst-btn' style='background:var(--neon-green);color:#000000;border:none;padding:5px 15px;cursor:pointer;margin-top:5px;font-weight:bold;font-family:inherit;'>" + rstText + "</button>";
            document.getElementById('bb-rst-btn').addEventListener('pointerdown', () => window.resetBlockBlastGame());
        }
    }
    window.resetBlockBlastGame();
};
