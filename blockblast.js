window.initBlockBlast = function() {
    const boardEl = document.getElementById('bbBoard');
    const dockEl = document.getElementById('bbDock');
    const scoreEl = document.getElementById('bb-score');
    const overBox = document.getElementById('bb-over-box');
    if (!boardEl || !dockEl) return;

    let board = Array(8).fill(null).map(() => Array(8).fill(0));
    let score = 0;
    let currentPieces = [];
    let activeDrag = null;

    const allPieces = [
        [],
        [],
        [,],
        [],
        [,,],
        [,],
        [,],
        [,,],
        [],
        [,,,]
    ];

    function initGame() {
        board = Array(8).fill(null).map(() => Array(8).fill(0));
        score = 0;
        if (scoreEl) scoreEl.innerText = (currentLang === 'ru' ? 'СЧЕТ: ' : 'SCORE: ') + score;
        if (overBox) overBox.innerHTML = '';
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
                cell.dataset.r = r;
                cell.dataset.c = c;
                boardEl.appendChild(cell);
            }
        }
    }

    function canPlace(matrix, row, col) {
        if (row < 0 || row + matrix.length > 8 || col < 0 || col + matrix.length > 8) return false;
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

    function clearHighlights() {
        const cells = boardEl.querySelectorAll('.bb-cell');
        cells.forEach(cell => {
            cell.style.background = '';
            cell.style.boxShadow = '';
        });
    }

    function highlightPlacement(matrix, startRow, startCol) {
        clearHighlights();
        const valid = canPlace(matrix, startRow, startCol);
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    let targetRow = startRow + r;
                    let targetCol = startCol + c;
                    if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
                        const cell = boardEl.children[targetRow * 8 + targetCol];
                        if (cell) {
                            if (valid) {
                                cell.style.background = 'rgba(85, 255, 85, 0.4)';
                                cell.style.boxShadow = 'inset 0 0 8px #55ff55';
                            } else {
                                cell.style.background = 'rgba(255, 51, 51, 0.3)';
                                cell.style.boxShadow = 'inset 0 0 8px #ff3333';
                            }
                        }
                    }
                }
            }
        }
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
            currentPieces.push(allPieces);
        }

        currentPieces.forEach((matrix, index) => {
            const wrap = document.createElement('div');
            wrap.className = 'bb-piece';
            wrap.style.gridTemplateRows = `repeat(${matrix.length}, 1fr)`;
            wrap.style.gridTemplateColumns = `repeat(${matrix.length}, 1fr)`;
            wrap.style.position = 'relative';

            matrix.forEach(row => {
                row.forEach(val => {
                    const cell = document.createElement('div');
                    cell.className = 'bb-cell' + (val ? ' filled' : '');
                    wrap.appendChild(cell);
                });
            });

            function handleStart() {
                activeDrag = { matrix, index, element: wrap };
                wrap.style.zIndex = '9999';
                if (overBox) overBox.innerHTML = '';
            }

            function handleMove(clientX, clientY) {
                if (!activeDrag || activeDrag.index !== index) return;
                wrap.style.position = 'fixed';
                wrap.style.left = (clientX - (wrap.offsetWidth / 2)) + 'px';
                wrap.style.top = (clientY - (wrap.offsetHeight / 2)) + 'px';

                const bRect = boardEl.getBoundingClientRect();
                if (clientX >= bRect.left && clientX <= bRect.right && clientY >= bRect.top && clientY <= bRect.bottom) {
                    const cellW = bRect.width / 8;
                    const cellH = bRect.height / 8;
                    const col = Math.floor((clientX - bRect.left) / cellW);
                    const row = Math.floor((clientY - bRect.top) / cellH);
                    highlightPlacement(matrix, row, col);
                } else {
                    clearHighlights();
                }
            }

            function handleEnd(clientX, clientY) {
                if (!activeDrag || activeDrag.index !== index) return;
                clearHighlights();
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
                        
                        if (currentPieces.every(p => p === null)) {
                            generatePieces();
                        } else {
                            checkGameOver();
                        }
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
                if(t) {
                    handleStart();
                    handleMove(t.clientX, t.clientY);
                }
            });
            wrap.addEventListener('touchmove', (e) => {
                const t = e.targetTouches[0];
                if(t) {
                    handleMove(t.clientX, t.clientY);
                    e.preventDefault();
                }
            }, { passive: false });
            wrap.addEventListener('touchend', (e) => {
                const t = e.changedTouches[0];
                if(t) handleEnd(t.clientX, t.clientY);
            });

            wrap.addEventListener('mousedown', (e) => {
                handleStart();
                handleMove(e.clientX, e.clientY);
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
        checkGameOver();
    }

    function checkGameOver() {
        let hasMoves = false;
        currentPieces.forEach(p => {
            if (!p) return;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (canPlace(p, r, c)) hasMoves = true;
                }
            }
        });
        if (!hasMoves && currentPieces.some(p => p !== null)) {
            if (overBox) {
                overBox.innerHTML = `<span style="color:var(--neon-red); font-size:12px; cursor:pointer;" onclick="window.resetBlockBlastGame()">${currentLang === 'ru' ? 'НЕТ ХОДОВ! НАЖМИ ДЛЯ СБРОСА' : 'NO MOVES! CLICK TO RESET'}</span>`;
            }
        }
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
