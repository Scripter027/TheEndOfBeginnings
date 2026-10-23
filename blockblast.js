window.initBlockBlast = function() {
    const boardEl = document.getElementById('bbBoard');
    const dockEl = document.getElementById('bbDock');
    const scoreEl = document.getElementById('bb-score');
    if (!boardEl || !dockEl) return;

    let board = Array(8).fill(null).map(() => Array(8).fill(0));
    let score = 0;
    let currentPieces = [];
    let activeDrag = null;

    const allPieces = [
        [[1]],
        [[1, 1]],
        [[1], [1]],
        [[1, 1, 1]],
        [[1], [1], [1]],
        [[1, 1], [1, 1]],
        [[1, 1, 1], [0, 1, 0]],
        [[1, 0], [1, 1], [0, 1]],
        [[1, 1, 1, 1]],
        [[1], [1], [1], [1]]
    ];

    function initGame() {
        board = Array(8).fill(null).map(() => Array(8).fill(0));
        score = 0;
        if (scoreEl) scoreEl.innerText = (currentLang === 'ru' ? 'СЧЕТ: ' : 'SCORE: ') + score;
        drawBoard();
        generatePieces();
    }
    window.resetBlockBlastGame = initGame;

    function drawBoard() {
        boardEl.innerHTML = '';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const cell = document.createElement('div');
                cell.className = 'bb-cell' + (board[r][c] ? ' filled' : '');
                boardEl.appendChild(cell);
            }
        }
    }

    function canPlace(matrix, row, col) {
        if (row < 0 || row + matrix.length > 8 || col < 0 || col + matrix[0].length > 8) return false;
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] && board[row + r][col + c]) return false;
            }
        }
        return true;
    }

    function countEmptyCells() {
        return board.flat().filter(cell => cell === 0).length;
    }

    function generatePieces() {
        dockEl.innerHTML = '';
        currentPieces = [];
        let emptyCount = countEmptyCells();
        let attempts = 0;
        
        while (currentPieces.length < 3 && attempts < 200) {
            let p;
            if (emptyCount < 25 && Math.random() > 0.3) {
                p = allPieces[Math.floor(Math.random() * 4) + 6];
            } else {
                p = allPieces[Math.floor(Math.random() * allPieces.length)];
            }

            if (currentPieces.length === 0) {
                let checkPassed = false;
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        if (canPlace(p, r, c)) { checkPassed = true; break; }
                    }
                    if (checkPassed) break;
                }
                if (checkPassed) currentPieces.push(p);
            } else {
                currentPieces.push(p);
            }
            attempts++;
        }

        while(currentPieces.length < 3) {
            currentPieces.push(allPieces[0]);
        }

        currentPieces.forEach((matrix, index) => {
            const wrap = document.createElement('div');
            wrap.className = 'bb-piece';
            wrap.style.gridTemplateRows = `repeat(${matrix.length}, 1fr)`;
            wrap.style.gridTemplateColumns = `repeat(${matrix[0].length}, 1fr)`;
            wrap.style.position = 'relative';

            matrix.forEach(row => {
                row.forEach(val => {
                    const cell = document.createElement('div');
                    cell.className = 'bb-cell' + (val ? ' filled' : '');
                    wrap.appendChild(cell);
                });
            });

            function handleStart(clientX, clientY) {
                activeDrag = { matrix, index, element: wrap, startX: wrap.offsetLeft, startY: wrap.offsetTop };
                wrap.style.zIndex = '9999';
            }

            function handleMove(clientX, clientY) {
                if (!activeDrag || activeDrag.index !== index) return;
                const rect = dockEl.getBoundingClientRect();
                wrap.style.position = 'fixed';
                wrap.style.left = (clientX - 30) + 'px';
                wrap.style.top = (clientY - 30) + 'px';
            }

            function handleEnd(clientX, clientY) {
                if (!activeDrag || activeDrag.index !== index) return;
                
                const bRect = boardEl.getBoundingClientRect();
                if (clientX >= bRect.left && clientX <= bRect.right && clientY >= bRect.top && clientY <= bRect.bottom) {
                    const cellW = bRect.width / 8;
                    const cellH = bRect.height / 8;
                    const col = Math.floor((clientX - bRect.left) / cellW);
                    const row = Math.floor((clientY - bRect.top) / cellH);

                    if (canPlace(matrix, row, col)) {
                        for (let r = 0; r < matrix.length; r++) {
                            for (let c = 0; c < matrix[r].length; c++) {
                                if (matrix[r][c]) board[row + r][col + c] = 1;
                            }
                        }
                        score += 10;
                        checkLines();
                        drawBoard();
                        wrap.style.visibility = 'hidden';
                        currentPieces[index] = null;
                        if (currentPieces.every(p => p === null)) generatePieces();
                    } else {
                        resetPiecePosition();
                    }
                } else {
                    resetPiecePosition();
                }
                activeDrag = null;
            }

            function resetPiecePosition() {
                wrap.style.position = 'relative';
                wrap.style.left = '0px';
                wrap.style.top = '0px';
                wrap.style.zIndex = 'auto';
            }

            wrap.addEventListener('touchstart', (e) => {
                const t = e.targetTouches[0];
                handleStart(t.clientX, t.clientY);
            });
            wrap.addEventListener('touchmove', (e) => {
                const t = e.targetTouches[0];
                handleMove(t.clientX, t.clientY);
            });
            wrap.addEventListener('touchend', (e) => {
                const t = e.changedTouches[0];
                handleEnd(t.clientX, t.clientY);
            });

            wrap.addEventListener('mousedown', (e) => {
                handleStart(e.clientX, e.clientY);
                const mouseMove = (me) => handleMove(me.clientX, me.clientY);
                const mouseUp = (me) => {
                    handleEnd(me.clientX, me.clientY);
                    document.removeEventListener('mousemove', mouseMove);
                    document.removeEventListener('mouseup', mouseUp);
                };
                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('mouseup', mouseUp);
            });

            dockEl.appendChild(wrap);
        });
    }

    function checkLines() {
        let rowsToRemove = [];
        let colsToRemove = [];
        for (let r = 0; r < 8; r++) {
            if (board[r].every(cell => cell === 1)) rowsToRemove.push(r);
        }
        for (let c = 0; c < 8; c++) {
            let colFilled = true;
            for (let r = 0; r < 8; r++) {
                if (board[r][c] === 0) colFilled = false;
            }
            if (colFilled) colsToRemove.push(c);
        }
        rowsToRemove.forEach(r => { board[r] = Array(8).fill(0); score += 20; });
        colsToRemove.forEach(c => {
            for (let r = 0; r < 8; r++) board[r][c] = 0;
            score += 20;
        });
        if (scoreEl) scoreEl.innerText = (currentLang === 'ru' ? 'СЧЕТ: ' : 'SCORE: ') + score;
    }

    initGame();
};
