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

    window.selectHangmanDifficulty = function(len, lang) {
        wordLength = len;
        gameLang = lang;
        gameActive = true;
        wrongAttempts = 0;
        guessedLetters = [];
        
        const list = dictionary[gameLang][wordLength];
        secretWord = list[Math.floor(Math.random() * list.length)];
        
        if (overBox) overBox.innerHTML = '';
        drawHangman();
        buildKeyboard();
    };

    window.showHangmanMenu = function() {
        gameActive = false;
        dockEl.innerHTML = '';
        if (overBox) overBox.innerHTML = '';
        const isRu = (currentLang === 'ru');
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#55ff55';
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(isRu ? 'ВЫБЕРИТЕ ДЛИНУ СЛОВА' : 'SELECT WORD LENGTH', canvas.width / 2, 40);
        ctx.fillText(isRu ? 'И ЯЗЫК В МЕНЮ НИЖЕ' : 'AND LANGUAGE IN MENU BELOW', canvas.width / 2, 60);

        dockEl.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:4px; width:100%; align-items:center; background:#000; padding:4px;">
                <div style="display:flex; gap:4px; width:100%;">
                    <button class="trash-btn" style="flex:1; padding:5px; font-size:10px;" onclick="selectHangmanDifficulty(5, 'ru')">RU-5</button>
                    <button class="trash-btn" style="flex:1; padding:5px; font-size:10px;" onclick="selectHangmanDifficulty(7, 'ru')">RU-7</button>
                    <button class="trash-btn" style="flex:1; padding:5px; font-size:10px;" onclick="selectHangmanDifficulty(10, 'ru')">RU-10</button>
                </div>
                <div style="display:flex; gap:4px; width:100%;">
                    <button class="trash-btn" style="flex:1; padding:5px; font-size:10px;" onclick="selectHangmanDifficulty(5, 'en')">EN-5</button>
                    <button class="trash-btn" style="flex:1; padding:5px; font-size:10px;" onclick="selectHangmanDifficulty(7, 'en')">EN-7</button>
                    <button class="trash-btn" style="flex:1; padding:5px; font-size:10px;" onclick="selectHangmanDifficulty(10, 'en')">EN-10</button>
                </div>
            </div>
        `;
    };

    function buildKeyboard() {
        dockEl.innerHTML = '';
        dockEl.style.display = 'flex';
        dockEl.style.flexWrap = 'wrap';
        dockEl.style.gap = '3px';
        dockEl.style.justifyContent = 'center';

        const keys = gameLang === 'ru' ? "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
        keys.split('').forEach(char => {
            const btn = document.createElement('button');
            btn.className = 'trash-btn';
            btn.style.padding = '3px 5px';
            btn.style.fontSize = '10px';
            btn.innerText = char;
            btn.onclick = () => handleLetterInput(char, btn);
            dockEl.appendChild(btn);
        });
    }

    function handleLetterInput(char, buttonEl) {
        if (!gameActive || guessedLetters.includes(char)) return;
        guessedLetters.push(char);
        
        if (buttonEl) {
            buttonEl.style.opacity = '0.4';
            buttonEl.disabled = true;
        }

        if (!secretWord.includes(char)) {
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
        ctx.font = 'bold 15px Courier New';
        ctx.textAlign = 'center';
        
        let displayStr = '';
        for (let i = 0; i < secretWord.length; i++) {
            let char = secretWord[i];
            displayStr += guessedLetters.includes(char) ? char + ' ' : '_ ';
        }
        ctx.fillText(displayStr.trim(), canvas.width / 2 + 30, 125);
    }

    function checkGameStatus() {
        let win = true;
        for (let i = 0; i < secretWord.length; i++) {
            if (!guessedLetters.includes(secretWord[i])) win = false;
        }

        const isRu = (gameLang === 'ru');
        if (win) {
            gameActive = false;
            dockEl.innerHTML = '';
            if (overBox) overBox.innerHTML = `<span style="color:#55ff55; font-size:11px;">${isRu ? 'СПАСЕН! ЖМИ ИНТЕР ДЛЯ СЛЕДУЮЩЕГО' : 'SAVED! CLICK ENTER FOR NEXT'}</span>`;
            return;
        }

        if (wrongAttempts >= maxWrong) {
            gameActive = false;
            dockEl.innerHTML = '';
            if (overBox) overBox.innerHTML = `<span style="color:var(--neon-red); font-size:10px;">${isRu ? 'КАЗНЕН! СЛОВО: ' : 'EXECUTED! WORD: '}${secretWord}</span>`;
        }
    }

    window.addEventListener('keydown', (e) => {
        const win = document.getElementById('win-hangman');
        if (!win || win.style.display !== 'block') return;

        if (!gameActive) {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.selectHangmanDifficulty(wordLength, gameLang);
            } else if (e.key === 'Shift') {
                e.preventDefault();
                window.showHangmanMenu();
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
