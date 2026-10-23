window.initHangmanGame = function() {
    const canvas = document.getElementById('hangmanCanvas');
    const dockEl = document.getElementById('hangmanDock');
    const overBox = document.getElementById('hangman-over-box');
    if (!canvas || !dockEl) return;
    const ctx = canvas.getContext('2d');

    let secretWord = '';
    let wordLength = 5;
    let guessedLetters = [];
    let wrongAttempts = 0;
    let maxWrong = 6;
    let gameActive = false;
    let gameLang = 'ru';
    let isGameOver = false;

    let hangmanScore = 0;
    let hangmanHighScore = localStorage.getItem('kpr_hangman_highscore') || 0;

    const dictionary = {
        ru: {
            5: ["МАСКА", "ПОТОК", "ЗАБОР", "СТЕНА", "ЗЕРНО", "ВЕТЕР", "АТЛАС", "СФЕРА", "МЕТРО", "ОБЛАКО"],
            7: ["ПИКСЕЛЬ", "СЕРВЕР", "ДРАЙВЕР", "СКАНИР", "КАНАЛЫ", "ЗАЩИТА", "ПАКЕТЫ", "СЕГМЕНТ", "ФУНКЦИЯ", "ФРАГМЕНТ"],
            10: ["СИНХРОНИЗА", "ДИАГНОСТИК", "АВТОРИЗАЦИ", "БЕЗОПАСНОС", "ПРОТОКОЛЫ", "ВЕРИФИКАЦИ", "ФИЛЬТРАЦИЯ", "КОМПИЛЯТОР", "КОНТРОЛЛЕР", "ПРОЦЕССОРЫ"]
        },
        en: {
            5: ["STACK", "CLOCK", "BLOCK", "INDEX", "IMAGE", "ROBOT", "PROXY", "CYBER", "CODES", "TOKEN"],
            7: ["HACKERS", "COMPILER", "SCANNER", "PROCESS", "RECORDS", "ADDRESS", "STORAGE", "BUFFERS", "DESKTOP", "UTILITY"],
            10: ["ENCRYPTION", "CONNECTION", "DECRYPTION", "DISCONNECT", "METADATAOS", "PROTECTION", "ALGORITHMS", "REPOSITORIES", "MONITORING", "VULNERABILITY"]
        }
    };

    function getLang() {
        return typeof currentLang !== 'undefined' ? currentLang : 'ru';
    }

    function updateScorePanel() {
        const curLabel = document.getElementById('hangman-current-score');
        const highLabel = document.getElementById('hangman-high-score');
        const isRu = (getLang() === 'ru');
        if (curLabel) curLabel.innerText = (isRu ? 'СЧЕТ: ' : 'SCORE: ') + hangmanScore;
        if (highLabel) highLabel.innerText = (isRu ? 'РЕКОРД: ' : 'BEST: ') + hangmanHighScore;
    }

    window.selectHangmanDifficulty = function(len, lang) {
        wordLength = len;
        gameLang = lang;
        gameActive = true;
        isGameOver = false;
        wrongAttempts = 0;
        guessedLetters = [];
        
        const list = dictionary[gameLang][wordLength];
        secretWord = list[Math.floor(Math.random() * list.length)];
        
        if (overBox) overBox.innerHTML = '';
        drawHangman();
        buildKeyboard();
        updateScorePanel();
    };

    window.showHangmanMenu = function() {
        gameActive = false;
        isGameOver = false;
        dockEl.innerHTML = '';
        if (overBox) overBox.innerHTML = '';
        const isRu = (getLang() === 'ru');
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#55ff55';
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(isRu ? 'ВЫБЕРИТЕ РЕЖИМ СЛОЖНОСТИ' : 'SELECT WORD DIFFICULTY', canvas.width / 2, 50);

        dockEl.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:4px; width:100%; align-items:center; background:#000; padding:4px;">
                <div style="display:flex; gap:4px; width:100%;">
                    <button class="trash-btn" style="flex:1; padding:5px; font-size:10px;" onclick="selectHangmanDifficulty(5, 'ru')">RU-5 (+100)</button>
                    <button class="trash-btn" style="flex:1; padding:5px; font-size:10px;" onclick="selectHangmanDifficulty(7, 'ru')">RU-7 (+1000)</button>
                    <button class="trash-btn" style="flex:1; padding:5px; font-size:10px;" onclick="selectHangmanDifficulty(10, 'ru')">RU-10 (+10000)</button>
                </div>
                <div style="display:flex; gap:4px; width:100%;">
                    <button class="trash-btn" style="flex:1; padding:5px; font-size:10px;" onclick="selectHangmanDifficulty(5, 'en')">EN-5 (+100)</button>
                    <button class="trash-btn" style="flex:1; padding:5px; font-size:10px;" onclick="selectHangmanDifficulty(7, 'en')">EN-7 (+1000)</button>
                    <button class="trash-btn" style="flex:1; padding:5px; font-size:10px;" onclick="selectHangmanDifficulty(10, 'en')">EN-10 (+10000)</button>
                </div>
            </div>
        `;
        updateScorePanel();
    };
    function buildKeyboard() {
        dockEl.innerHTML = '';
        dockEl.style.display = 'flex';
        dockEl.style.flexDirection = 'column';
        dockEl.style.gap = '3px';
        dockEl.style.alignItems = 'center';

        const rowsRu = ["ЙЦУКЕНГШЩЗХЪ", "ФЫВАПРОЛДЖЭ", "ЯЧСМИТЬБЮ"];
        const rowsEn = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
        const targetLayout = gameLang === 'ru' ? rowsRu : rowsEn;

        targetLayout.forEach(rowStr => {
            const rowContainer = document.createElement('div');
            rowContainer.style.display = 'flex';
            rowContainer.style.gap = '2px';
            rowContainer.style.justifyContent = 'center';
            rowContainer.style.width = '100%';

            rowStr.split('').forEach(char => {
                const btn = document.createElement('button');
                btn.className = 'trash-btn';
                btn.style.padding = '4px 3px';
                btn.style.fontSize = '9px';
                btn.style.minWidth = '18px';
                btn.innerText = char;
                btn.onclick = () => handleLetterInput(char, btn);
                rowContainer.appendChild(btn);
            });
            dockEl.appendChild(rowContainer);
        });
    }

    function handleLetterInput(char, buttonEl) {
        if (!gameActive || isGameOver || guessedLetters.includes(char)) return;
        guessedLetters.push(char);
        
        if (buttonEl) {
            buttonEl.style.opacity = '0.3';
            buttonEl.disabled = true;
        }

        if (secretWord.includes(char)) {
            hangmanScore += 10;
            if (hangmanScore > hangmanHighScore) {
                hangmanHighScore = hangmanScore;
                localStorage.setItem('kpr_hangman_highscore', hangmanHighScore);
            }
            updateScorePanel();
        } else {
            wrongAttempts++;
        }

        drawHangman();
        checkGameStatus();
    }

    function drawHangman() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#55ff55';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(20, 130); ctx.lineTo(80, 130);
        ctx.moveTo(40, 130); ctx.lineTo(40, 20);
        ctx.lineTo(100, 20); ctx.lineTo(100, 35);
        ctx.stroke();

        if (wrongAttempts >= 1) { ctx.beginPath(); ctx.arc(100, 43, 8, 0, Math.PI * 2); ctx.stroke(); }
        if (wrongAttempts >= 2) { ctx.beginPath(); ctx.moveTo(100, 51); ctx.lineTo(100, 85); ctx.stroke(); }
        if (wrongAttempts >= 3) { ctx.beginPath(); ctx.moveTo(100, 60); ctx.lineTo(85, 72); ctx.stroke(); }
        if (wrongAttempts >= 4) { ctx.beginPath(); ctx.moveTo(100, 60); ctx.lineTo(115, 72); ctx.stroke(); }
        if (wrongAttempts >= 5) { ctx.beginPath(); ctx.moveTo(100, 85); ctx.lineTo(85, 105); ctx.stroke(); }
        if (wrongAttempts >= 6) { ctx.beginPath(); ctx.moveTo(100, 85); ctx.lineTo(115, 105); ctx.stroke(); }

        ctx.fillStyle = '#55ff55';
        ctx.font = 'bold 14px Courier New';
        ctx.textAlign = 'center';
        
        let displayStr = '';
        for (let i = 0; i < secretWord.length; i++) {
            let char = secretWord[i];
            displayStr += guessedLetters.includes(char) ? char + ' ' : '_ ';
        }
        ctx.fillText(displayStr.trim(), canvas.width / 2 + 35, 120);
    }

    function checkGameStatus() {
        let isWin = true;
        for (let i = 0; i < secretWord.length; i++) {
            if (!guessedLetters.includes(secretWord[i])) isWin = false;
        }

        const isRu = (getLang() === 'ru');
        if (isWin) {
            gameActive = false;
            dockEl.innerHTML = '';
            let bonus = 100;
            if (wordLength === 7) bonus = 1000;
            if (wordLength === 10) bonus = 10000;

            hangmanScore += bonus;
            if (hangmanScore > hangmanHighScore) {
                hangmanHighScore = hangmanScore;
                localStorage.setItem('kpr_hangman_highscore', hangmanHighScore);
            }
            updateScorePanel();

            if (overBox) overBox.innerHTML = `<span style="color:#55ff55; font-size:11px;">${isRu ? `ПОБЕДА (+${bonus})! ЗАГРУЗКА...` : `WIN (+${bonus})! LOADING...`}</span>`;
            
            setTimeout(() => {
                selectHangmanDifficulty(wordLength, gameLang);
            }, 3000);
            return;
        }

        if (wrongAttempts >= maxWrong) {
            gameActive = false;
            isGameOver = true;
            dockEl.innerHTML = '';
            if (overBox) {
                overBox.innerHTML = `
                    <div style="color:var(--neon-red); font-size:10px; text-transform:uppercase;">
                        ${isRu ? 'КАЗНЕН! [SHIFT] - МЕНЮ | [ПРОБЕЛ] - ЗАНОВО' : 'EXECUTED! [SHIFT] - MENU | [SPACE] - RESTART'}
                    </div>
                `;
            }
            
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'var(--neon-red)';
            ctx.font = 'bold 11px Courier New';
            ctx.fillText(secretWord, canvas.width / 2 + 35, 75);
        }
    }

    window.addEventListener('keydown', (e) => {
        const win = document.getElementById('win-hangman');
        if (!win || win.style.display !== 'block') return;

        if (!gameActive || isGameOver) {
            if (e.key === 'Shift') {
                e.preventDefault();
                window.showHangmanMenu();
            } else if (e.code === 'Space') {
                e.preventDefault();
                window.selectHangmanDifficulty(wordLength, gameLang);
            }
            return;
        }

        let key = e.key.toUpperCase();
        if (key.length === 1) {
            const ruRange = /[А-ЯЁ]/;
            const enRange = /[A-Z]/;
            if ((gameLang === 'ru' && ruRange.test(key)) || (gameLang === 'en' && enRange.test(key))) {
                e.preventDefault();
                handleLetterInput(key, null);
            }
        }
    });

    window.showHangmanMenu();
};
