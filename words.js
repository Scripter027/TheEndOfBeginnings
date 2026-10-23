window.initWordsGame = function() {
    const boardEl = document.getElementById('wordsBoard');
    const dockEl = document.getElementById('wordsDock');
    const overBox = document.getElementById('words-over-box');
    if (!boardEl || !dockEl) return;

    let secretWord = '';
    let wordLength = 5;
    let maxAttempts = 6;
    let currentAttempt = 0;
    let currentGuess = '';
    let gameActive = false;
    let gameLang = 'ru';
    let isGameOver = false;

    let wordsScore = 0;
    let wordsHighScore = localStorage.getItem('kpr_words_highscore') || 0;

    const dictionary = {
        ru: {
            5: ["КНИГА", "РУЧКА", "ЭКРАН", "ПЛЕЕР", "КЛЮЧИ", "ЗАМОК", "ПИТОН", "ЗЕМЛЯ", "МЫШКА", "ФАКЕЛ"],
            7: ["НОУТБУК", "МОНИТОР", "КОМНАТА", "КЛАВИША", "СИСТЕМА", "ПЛАНЕТА", "УРОВЕНЬ", "ПРОГРАМ", "ТЕЛЕФОН", "МАГАЗИН"],
            10: ["КЛАВИАТУРА", "ПРОГРАММИСТ", "ТЕЛЕВИЗОР", "КОМПЬЮТЕР", "НАКОПИТЕЛЬ", "РАЗРАБОТКА", "МЕССЕНДЖЕР", "ПРОВОДНИК", "КОНФИГУРАЦ", "ИНТЕРФЕЙС"]
        },
        en: {
            5: ["BOOKS", "MOUSE", "PHONE", "LOGIC", "START", "PLUTO", "EARTH", "LATCH", "RESET", "PLANT"],
            7: ["MONITOR", "DISPLAY", "KEYPADS", "ROUTING", "GATEWAY", "BATTERY", "SESSION", "STORAGE", "NETWORK", "STATION"],
            10: ["CONTROLLER", "PROGRAMMER", "RECONNECTS", "METADATAID", "CONNECTION", "DISCONNECT", "TERMINALOS", "JAVASCRIPT", "SUBMITWAYS", "BACKGROUND"]
        }
    };

    function getLang() {
        return typeof currentLang !== 'undefined' ? currentLang : 'ru';
    }

    function updateScorePanel() {
        const panel = document.getElementById('words-score-panel');
        if (!panel) return;
        const isRu = (getLang() === 'ru');
        panel.innerHTML = `<span>${isRu ? 'СЧЕТ: ' : 'SCORE: '}${wordsScore}</span><span>${isRu ? 'РЕКОРД: ' : 'BEST: '}${wordsHighScore}</span>`;
    }

    window.selectWordsDifficulty = function(len, lang) {
        wordLength = len;
        gameLang = lang;
        gameActive = true;
        isGameOver = false;
        currentAttempt = 0;
        currentGuess = '';
        
        const list = dictionary[gameLang][wordLength];
        secretWord = list[Math.floor(Math.random() * list.length)];
        
        if (overBox) overBox.innerHTML = '';
        buildBoard();
        buildKeyboard();
        updateScorePanel();
    };

    window.showWordsMenu = function() {
        gameActive = false;
        isGameOver = false;
        dockEl.innerHTML = '';
        if (overBox) overBox.innerHTML = '';
        const isRu = (getLang() === 'ru');
        
        boardEl.style.display = 'flex';
        boardEl.style.flexDirection = 'column';
        boardEl.style.gap = '8px';
        boardEl.style.width = '100%';
        boardEl.style.height = 'auto';
        
        boardEl.innerHTML = `
            <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; gap:8px; width:100%; padding:10px; background:#000;">
                <div style="font-size:13px; font-weight:bold; color:#55ff55; margin-bottom:4px;">${isRu ? 'ВЫБЕРИТЕ РЕЖИМ (РУС)' : 'SELECT MODE (RUS)'}</div>
                <button class="trash-btn" style="width:90%; padding:6px; font-size:11px;" onclick="selectWordsDifficulty(5, 'ru')">5 БУКВ (+100)</button>
                <button class="trash-btn" style="width:90%; padding:6px; font-size:11px;" onclick="selectWordsDifficulty(7, 'ru')">7 БУКВ (+1000)</button>
                <button class="trash-btn" style="width:90%; padding:6px; font-size:11px;" onclick="selectWordsDifficulty(10, 'ru')">10 БУКВ (+10000)</button>
                <div style="font-size:13px; font-weight:bold; color:#55ff55; margin-top:8px; margin-bottom:4px;">${isRu ? 'ВЫБЕРИТЕ РЕЖИМ (ENG)' : 'SELECT MODE (ENG)'}</div>
                <button class="trash-btn" style="width:90%; padding:6px; font-size:11px;" onclick="selectWordsDifficulty(5, 'en')">5 LETTERS (+100)</button>
                <button class="trash-btn" style="width:90%; padding:6px; font-size:11px;" onclick="selectWordsDifficulty(7, 'en')">7 LETTERS (+1000)</button>
                <button class="trash-btn" style="width:90%; padding:6px; font-size:11px;" onclick="selectWordsDifficulty(10, 'en')">10 LETTERS (+10000)</button>
            </div>
        `;
        updateScorePanel();
    };
    function buildBoard() {
        boardEl.innerHTML = '';
        boardEl.style.display = 'grid';
        boardEl.style.gridTemplateRows = `repeat(${maxAttempts}, 1fr)`;
        boardEl.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;
        boardEl.style.gap = '3px';
        
        const parentWidth = boardEl.parentElement.clientWidth - 16;
        const cellSize = Math.floor(parentWidth / wordLength);
        boardEl.style.width = (cellSize * wordLength) + 'px';
        boardEl.style.height = (cellSize * maxAttempts) + 'px';

        for (let r = 0; r < maxAttempts; r++) {
            for (let c = 0; c < wordLength; c++) {
                const cell = document.createElement('div');
                cell.className = 'bb-cell';
                cell.id = `w-cell-${r}-${c}`;
                cell.style.width = cellSize + 'px';
                cell.style.height = cellSize + 'px';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontSize = Math.floor(cellSize * 0.5) + 'px';
                cell.style.fontWeight = 'bold';
                boardEl.appendChild(cell);
            }
        }
    }

    function buildKeyboard() {
        dockEl.innerHTML = '';
        dockEl.style.display = 'flex';
        dockEl.style.flexDirection = 'column';
        dockEl.style.gap = '4px';
        dockEl.style.alignItems = 'center';

        const rowsRu = ["ЙЦУКЕНГШЩЗХЪ", "ФЫВАПРОЛДЖЭ", "ЯЧСМИТЬБЮ"];
        const rowsEn = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
        const targetLayout = gameLang === 'ru' ? rowsRu : rowsEn;

        targetLayout.forEach(rowStr => {
            const rowContainer = document.createElement('div');
            rowContainer.style.display = 'flex';
            rowContainer.style.gap = '3px';
            rowContainer.style.justifyContent = 'center';
            rowContainer.style.width = '100%';

            rowStr.split('').forEach(char => {
                const btn = document.createElement('button');
                btn.className = 'trash-btn';
                btn.style.padding = '5px 4px';
                btn.style.fontSize = '10px';
                btn.style.minWidth = '20px';
                btn.innerText = char;
                btn.onclick = () => handleInput(char);
                rowContainer.appendChild(btn);
            });
            dockEl.appendChild(rowContainer);
        });

        const controlsContainer = document.createElement('div');
        controlsContainer.style.display = 'flex';
        controlsContainer.style.gap = '6px';
        controlsContainer.style.width = '100%';
        controlsContainer.style.justifyContent = 'center';
        controlsContainer.style.marginTop = '2px';

        const delBtn = document.createElement('button');
        delBtn.className = 'trash-btn';
        delBtn.style.padding = '5px 10px';
        delBtn.style.fontSize = '10px';
        delBtn.innerText = 'DEL';
        delBtn.onclick = () => handleInput('DEL');

        const enterBtn = document.createElement('button');
        enterBtn.className = 'trash-btn';
        enterBtn.style.padding = '5px 10px';
        enterBtn.style.fontSize = '10px';
        enterBtn.innerText = 'ENTER';
        enterBtn.onclick = () => handleInput('ENTER');

        controlsContainer.appendChild(delBtn);
        controlsContainer.appendChild(enterBtn);
        dockEl.appendChild(controlsContainer);
    }

    function handleInput(char) {
        if (!gameActive || isGameOver) return;
        if (char === 'DEL') {
            if (currentGuess.length > 0) {
                currentGuess = currentGuess.slice(0, -1);
                updateRow();
            }
        } else if (char === 'ENTER') {
            if (currentGuess.length === wordLength) {
                submitGuess();
            }
        } else {
            if (currentGuess.length < wordLength) {
                currentGuess += char;
                updateRow();
            }
        }
    }

    function updateRow() {
        for (let c = 0; c < wordLength; c++) {
            const cell = document.getElementById(`w-cell-${currentAttempt}-${c}`);
            if (cell) cell.innerText = currentGuess[c] || '';
        }
    }

    function submitGuess() {
        let correctCount = 0;
        let earnedLetterPoints = 0;

        for (let c = 0; c < wordLength; c++) {
            const cell = document.getElementById(`w-cell-${currentAttempt}-${c}`);
            if (!cell) continue;
            let char = currentGuess[c];
            
            if (secretWord[c] === char) {
                cell.style.background = '#55ff55';
                cell.style.color = '#000000';
                correctCount++;
                earnedLetterPoints += 10;
            } else if (secretWord.includes(char)) {
                cell.style.background = 'rgba(85,255,85,0.3)';
                cell.style.border = '2px dashed #55ff55';
            } else {
                cell.style.background = '#220000';
                cell.style.color = '#ff3333';
                cell.style.border = '1px solid #ff3333';
            }
        }

        wordsScore += earnedLetterPoints;
        if (wordsScore > wordsHighScore) {
            wordsHighScore = wordsScore;
            localStorage.setItem('kpr_words_highscore', wordsHighScore);
        }
        updateScorePanel();

        if (correctCount === wordLength) {
            gameActive = false;
            let bonus = 100;
            if (wordLength === 7) bonus = 1000;
            if (wordLength === 10) bonus = 10000;

            wordsScore += bonus;
            if (wordsScore > wordsHighScore) {
                wordsHighScore = wordsScore;
                localStorage.setItem('kpr_words_highscore', wordsHighScore);
            }
            updateScorePanel();

            const isRu = (getLang() === 'ru');
            if (overBox) overBox.innerHTML = `<span style="color:#55ff55; font-size:11px;">${isRu ? `ПОБЕДА (+${bonus})! ЗАГРУЗКА...` : `WIN (+${bonus})! LOADING...`}</span>`;
            
            setTimeout(() => {
                window.selectWordsDifficulty(wordLength, gameLang);
            }, 3000);
            return;
        }

        currentAttempt++;
        currentGuess = '';

        if (currentAttempt >= maxAttempts) {
            gameActive = false;
            isGameOver = true;
            dockEl.innerHTML = '';
            const isRu = (getLang() === 'ru');
            if (overBox) {
                overBox.innerHTML = `<span style="color:var(--neon-red); font-size:10px; cursor:pointer;">${isRu ? 'ОШИБКА! [SHIFT] - МЕНЮ | [ПРОБЕЛ] - ЗАНОВО' : 'ERROR! [SHIFT] - MENU | [SPACE] - RESTART'}</span>`;
            }
        }
    }

    window.addEventListener('keydown', (e) => {
        const win = document.getElementById('win-words');
        if (!win || win.style.display !== 'block') return;
        
        if (!gameActive || isGameOver) {
            if (e.key === 'Shift') {
                e.preventDefault();
                window.showWordsMenu();
            } else if (e.code === 'Space') {
                e.preventDefault();
                window.selectWordsDifficulty(wordLength, gameLang);
            }
            return;
        }

        if (e.key === 'Backspace') {
            handleInput('DEL');
            e.preventDefault();
        } else if (e.key === 'Enter') {
            handleInput('ENTER');
            e.preventDefault();
        } else {
            let key = e.key.toUpperCase();
            if (key.length === 1) {
                const ruRange = /[А-ЯЁ]/;
                const enRange = /[A-Z]/;
                if ((gameLang === 'ru' && ruRange.test(key)) || (gameLang === 'en' && enRange.test(key))) {
                    handleInput(key);
                    e.preventDefault();
                }
            }
        }
    });

    window.showWordsMenu();
};
