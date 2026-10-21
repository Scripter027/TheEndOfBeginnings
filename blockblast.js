window.initBlockBlast = function() {
    const boardEl = document.getElementById('bbBoard'), dockEl = document.getElementById('bbDock');
    if (!boardEl || !dockEl) return;
    
    let board = Array(8).fill(0).map(() => Array(8).fill(0));
    let currentScore = 0, selectedPiece = null, availablePieces = [];
    
    const SHAPES = [
        [[1,1],[1,1]],
        [[1],[1],[1]],
        [[1,1,1]],
        [[1,0],[1,1]],
        [[1]]
    ];

    window.resetBlockBlastGame = function() {
        board = Array(8).fill(0).map(() => Array(8).fill(0));
        currentScore = 0;
        document.getElementById('bb-score').innerText = "СЧЕТ: 0";
        document.getElementById('bb-msg').innerText = "Зажми мышь на фигуре и тащи её на доску";
        selectedPiece = null;
        drawBoard();
        generateDock();
    };

    function drawBoard() {
        boardEl.innerHTML = '';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const cell = document.createElement('div');
                cell.className = 'bb-cell';
                if (board[r][c] === 1) cell.classList.add('filled');
                cell.dataset.r = r; cell.dataset.c = c;
                cell.ondragover = (e) => e.preventDefault();
                cell.ondrop = () => handleDrop(r, c);
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
            pieceWrap.className = 'bb-piece'; pieceWrap.draggable = true;
            pieceWrap.style.gridTemplateRows = `repeat(${shape.length}, 26px)`;
            pieceWrap.style.gridTemplateColumns = `repeat(${shape[0].length}, 26px)`;
            
            shape.forEach((row) => {
                row.forEach((val) => {
                    const block = document.createElement('div');
                    block.className = 'bb-cell';
                    if (val === 1) block.classList.add('filled');
                    pieceWrap.appendChild(block);
                });
            });
            pieceWrap.ondragstart = () => { selectedPiece = { shape, index: i }; };
            dockEl.appendChild(pieceWrap);
        }
        checkGameOver();
    }

    function handleDrop(startR, startC) {
        if (!selectedPiece) return;
        const { shape, index } = selectedPiece;
        if (canPlace(shape, startR, startC)) {
            placePiece(shape, startR, startC);
            availablePieces[index] = null;
            document.querySelectorAll('.bb-piece')[index].style.visibility = 'hidden';
            selectedPiece = null;
            checkLineClears(); drawBoard();
            if (availablePieces.every(p => p === null)) generateDock();
            else checkGameOver();
        }
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
            let col = [];
            for (let r = 0; r < 8; r++) col.push(board[r][c]);
            if (col.every(v => v === 1)) { for (let r = 0; r < 8; r++) board[r][c] = 0; cleared++; }
        }
        if (cleared > 0) { currentScore += cleared * 10; document.getElementById('bb-score').innerText = `СЧЕТ: ${currentScore}`; }
    }

    function checkGameOver() {
        let hasMove = false;
        availablePieces.forEach(shape => {
            if (!shape) return;
            for (let r = 0; r < 8; r++) { for (let c = 0; c < 8; c++) { if (canPlace(shape, r, c)) hasMove = true; } }
        });
        if (!hasMove && availablePieces.some(p => p !== null)) {
            document.getElementById('bb-msg').innerHTML = "<span style='color:var(--neon-red);font-weight:bold;'>НЕТ МЕСТА!</span><br><button onclick='window.resetBlockBlastGame()' style='background:var(--neon-green);color:#000;border:none;padding:5px 15px;cursor:pointer;margin-top:5px;font-weight:bold;font-family:inherit;'>СНАЧАЛА</button>";
        }
    }
    window.resetBlockBlastGame();
};
