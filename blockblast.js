window.initBlockBlast = function() {
    const boardEl = document.getElementById('bbBoard');
    const dockEl = document.getElementById('bbDock');
    const scoreEl = document.getElementById('bb-score');
    if (!boardEl || !dockEl) return;

    let board = Array(8).fill(null).map(() => Array(8).fill(0));
    let score = 0;
    let currentPieces = [];
    let draggedPiece = null;

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
            wrap.draggable = true;

            matrix.forEach(row => {
                row.forEach(val => {
                    const cell = document.createElement('div');
                    cell.className = 'bb-cell' + (val ? ' filled' : '');
                    wrap.appendChild(cell);
                });
            });

            wrap.addEventListener('dragstart', () => { draggedPiece = { matrix, index }; });
            dockEl.appendChild(wrap);
        });
    }

    boardEl.addEventListener('dragover', (e) => { e.preventDefault(); });
    boardEl.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedPiece) return;

        const rect = boardEl.getBoundingClientRect();
        const cellW = rect.width / 8;
        const cellH = rect.height / 8;
        const targetX = e.clientX - rect.left;
        const targetY = e.clientY - rect.top;

        const col = Math.floor(targetX / cellW);
        const row = Math.floor(targetY / cellH);

        if (canPlace(draggedPiece.matrix, row, col)) {
            for (let r = 0; r < draggedPiece.matrix.length; r++) {
                for (let c = 0; c < draggedPiece.matrix[r].length; c++) {
                    if (draggedPiece.matrix[r][c]) board[row + r][col + c] = 1;
                }
            }
            score += 10;
            checkLines();
            drawBoard();
            
            const pieceEls = dockEl.querySelectorAll('.bb-piece');
            if (pieceEls[draggedPiece.index]) {
                pieceEls[draggedPiece.index].style.visibility = 'hidden';
                pieceEls[draggedPiece.index].draggable = false;
            }
            
            currentPieces[draggedPiece.index] = null;
            if (currentPieces.every(p => p === null)) {
                generatePieces();
            }
        }
        draggedPiece = null;
    });

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
