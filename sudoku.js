window.initSudokuGame = function() {
    const boardEl = document.getElementById('sudokuBoard');
    const dockEl = document.getElementById('sudokuDock');
    const overBox = document.getElementById('sudoku-over-box');
    if (!boardEl || !dockEl) return;

    let initialBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    let currentBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    let solutionBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    let activeDigit = null;
    let currentLevel = 'easy';
    let gameActive = false;
    let isGameOver = false;

    let sudokuScore = 0;
    let sudokuHighScore = localStorage.getItem('kpr_sudoku_highscore') || 0;

    function getLang() {
        return typeof currentLang !== 'undefined' ? currentLang : 'ru';
    }

    function updateScorePanel() {
        const curLabel = document.getElementById('sudoku-current-score');
        const highLabel = document.getElementById('sudoku-high-score');
        const isRu = (getLang() === 'ru');
        if (curLabel) curLabel.innerText = (isRu ? 'СЧЕТ: ' : 'SCORE: ') + sudokuScore;
        if (highLabel) highLabel.innerText = (isRu ? 'РЕКОРД: ' : 'BEST: ') + sudokuHighScore;
    }

    window.selectSudokuDifficulty = function(level) {
        currentLevel = level;
        gameActive = true;
        isGameOver = false;
        generateSudokuSolution();
        initialBoard = Array(9).fill(null).map(() => Array(9).fill(0));
        
        let r, c;
        for(r = 0; r < 9; r++) {
            for(c = 0; c < 9; c++) {
                initialBoard[r][c] = solutionBoard[r][c];
            }
        }

        let removeCount = 30;
        if (level === 'medium') removeCount = 42;
        if (level === 'hard') removeCount = 54;

        let removed = 0;
        while (removed < removeCount) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            if (initialBoard[row][col] !== 0) {
                initialBoard[row][col] = 0;
                removed++;
            }
        }

        currentBoard = Array(9).fill(null).map(() => Array(9).fill(0));
        for(r = 0; r < 9; r++) {
            for(c = 0; c < 9; c++) {
                currentBoard[r][c] = initialBoard[r][c];
            }
        }

        if (overBox) overBox.innerHTML = '';
        drawBoard();
        initDock();
        updateScorePanel();
    };

    window.showSudokuMenu = function() {
        gameActive = false;
        isGameOver = false;
        dockEl.innerHTML = '';
        if (overBox) overBox.innerHTML = '';
        
        const isRu = (getLang() === 'ru');
        boardEl.innerHTML = `
            <div style="grid-column:span 9; display:flex; flex-direction:column; justify-content:center; align-items:center; gap:12px; height:100%; width:100%; padding:20px; background:#000;">
                <div style="font-size:16px; font-weight:bold; color:#55ff55; letter-spacing:1px; margin-bottom:10px;">
                    ${isRu ? 'ВЫБЕРИТЕ УРОВЕНЬ' : 'SELECT DIFFICULTY'}
                </div>
                <button class="trash-btn" style="width:80%; padding:10px; font-weight:bold;" onclick="selectSudokuDifficulty('easy')">EASY (+100)</button>
                <button class="trash-btn" style="width:80%; padding:10px; font-weight:bold;" onclick="selectSudokuDifficulty('medium')">MEDIUM (+1000)</button>
                <button class="trash-btn" style="width:80%; padding:10px; font-weight:bold;" onclick="selectSudokuDifficulty('hard')">HARD (+10000)</button>
            </div>
        `;
        updateScorePanel();
    };

    function generateSudokuSolution() {
        solutionBoard = Array(9).fill(null).map(() => Array(9).fill(0));
        fillSudokuCells(0, 0);
    }

    function isValidSudoku(row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (solutionBoard[row][x] === num) return false;
        }
        for (let x = 0; x < 9; x++) {
            if (solutionBoard[x][col] === num) return false;
        }
        let startRow = row - row % 3;
        let startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (solutionBoard[i + startRow][j + startCol] === num) return false;
            }
        }
        return true;
    }

    function fillSudokuCells(row, col) {
        if (row === 8 && col === 9) return true;
        if (col === 9) { row++; col = 0; }
        if (solutionBoard[row][col] !== 0) return fillSudokuCells(row, col + 1);

        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (let i = 0; i < 9; i++) {
            let num = nums[i];
            if (isValidSudoku(row, col, num)) {
                solutionBoard[row][col] = num;
                if (fillSudokuCells(row, col + 1)) return true;
                solutionBoard[row][col] = 0;
            }
        }
        return false;
    }
    function drawBoard() {
        if (!gameActive) return;
        boardEl.innerHTML = '';
        const bRect = boardEl.getBoundingClientRect();
        const cellSize = Math.floor(bRect.width / 9);

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.className = 'bb-cell';
                cell.style.width = cellSize + 'px';
                cell.style.height = cellSize + 'px';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontSize = '14px';
                cell.style.fontWeight = 'bold';

                if (r % 3 === 0 && r !== 0) cell.style.borderTop = '2px solid #55ff55';
                if (c % 3 === 0 && c !== 0) cell.style.borderLeft = '2px solid #55ff55';

                let val = currentBoard[r][c];
                if (val !== 0) {
                    cell.innerText = val;
                    if (initialBoard[r][c] !== 0) {
                        cell.style.color = '#55ff55';
                    } else {
                        cell.style.color = '#88ff88';
                        cell.style.background = 'rgba(85,255,85,0.1)';
                    }
                }

                cell.addEventListener('dragover', (e) => e.preventDefault());
                cell.addEventListener('drop', (e) => {
                    e.preventDefault();
                    if (!gameActive || isGameOver || initialBoard[r][c] !== 0 || !activeDigit) return;

                    if (activeDigit !== solutionBoard[r][c]) {
                        triggerGameOver();
                        return;
                    }

                    currentBoard[r][c] = activeDigit;
                    drawBoard();
                    checkSudokuStatus();
                });

                boardEl.appendChild(cell);
            }
        }
    }

    function triggerGameOver() {
        gameActive = false;
        isGameOver = true;
        dockEl.innerHTML = '';
        const isRu = (getLang() === 'ru');
        if (overBox) {
            overBox.innerHTML = `
                <div style="color:var(--neon-red); font-size:11px; text-transform:uppercase;">
                    ${isRu ? 'ОШИБКА! [SHIFT] - МЕНЮ | [ПРОБЕЛ] - ЗАНОВО' : 'ERROR! [SHIFT] - MENU | [SPACE] - RESTART'}
                </div>
            `;
        }
    }

    function checkSudokuStatus() {
        let complete = true;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (currentBoard[r][c] === 0) complete = false;
            }
        }

        if (complete) {
            gameActive = false;
            dockEl.innerHTML = '';
            let points = 100;
            if (currentLevel === 'medium') points = 1000;
            if (currentLevel === 'hard') points = 10000;

            sudokuScore += points;
            if (sudokuScore > sudokuHighScore) {
                sudokuHighScore = sudokuScore;
                localStorage.setItem('kpr_sudoku_highscore', sudokuHighScore);
            }
            updateScorePanel();

            const isRu = (getLang() === 'ru');
            if (overBox) {
                overBox.innerHTML = `<span style="color:#55ff55; font-size:11px;">${isRu ? `ПОБЕДА (+${points})! ЗАГРУЗКА...` : `WIN (+${points})! LOADING...`}</span>`;
            }

            setTimeout(() => {
                selectSudokuDifficulty(currentLevel);
            }, 3000);
        }
    }

    function initDock() {
        dockEl.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const digit = document.createElement('div');
            digit.className = 'bb-cell filled';
            digit.style.width = '24px';
            digit.style.height = '24px';
            digit.style.display = 'flex';
            digit.style.alignItems = 'center';
            digit.style.justifyContent = 'center';
            digit.style.cursor = 'grab';
            digit.style.color = '#000000';
            digit.style.fontWeight = 'bold';
            digit.innerText = i;
            digit.draggable = true;

            digit.addEventListener('dragstart', () => { activeDigit = i; });
            digit.addEventListener('touchstart', () => { activeDigit = i; });
            
            dockEl.appendChild(digit);
        }
    }

    window.addEventListener('keydown', (e) => {
        const win = document.getElementById('win-sudoku');
        if (!win || win.style.display !== 'block' || !isGameOver) return;

        if (e.key === 'Shift') {
            e.preventDefault();
            window.showSudokuMenu();
        } else if (e.code === 'Space') {
            e.preventDefault();
            window.selectSudokuDifficulty(currentLevel);
        }
    });

    const resizeObserver = new ResizeObserver(() => {
        if (gameActive) drawBoard();
    });
    resizeObserver.observe(boardEl.parentElement);

    window.showSudokuMenu();
};
