window.initMemoryGame = function() {
    const boardEl = document.getElementById('memoryBoard');
    const overBox = document.getElementById('memory-over-box');
    const scoreEl = document.getElementById('memory-score');
    if (!boardEl || !scoreEl) return;

    let sequence = [];
    let playerSequence = [];
    let score = 0;
    let highscore = localStorage.getItem('kpr_memory_highscore') || 0;
    let isPlayingSequence = false;
    let isGameOver = false;
    let flashTimeouts = {};

    function resizeMemoryBoard() {
        const parent = boardEl.parentElement;
        if (!parent) return;
        let availableHeight = parent.clientHeight - 80;
        let availableWidth = parent.clientWidth - 16;
        let size = Math.max(160, Math.min(availableHeight, availableWidth));
        boardEl.style.width = size + 'px';
        boardEl.style.height = size + 'px';
    }

    const resizeObserver = new ResizeObserver(() => {
        resizeMemoryBoard();
    });
    resizeObserver.observe(boardEl.parentElement);

    function getLang() {
        return typeof currentLang !== 'undefined' ? currentLang : 'ru';
    }

    function updateScorePanel() {
        const isRu = (getLang() === 'ru');
        scoreEl.innerText = (isRu ? 'СЧЕТ: ' : 'SCORE: ') + score + ' | ' + (isRu ? 'РЕКОРД: ' : 'BEST: ') + highscore;
    }

    window.resetMemoryGame = function() {
        for (let key in flashTimeouts) {
            clearTimeout(flashTimeouts[key]);
        }
        flashTimeouts = {};
        
        if (boardEl) {
            Array.from(boardEl.children).forEach(btn => {
                btn.style.background = 'transparent';
                btn.style.boxShadow = 'inset 0 0 10px rgba(0,51,0,0.5)';
            });
        }

        sequence = [];
        playerSequence = [];
        score = 0;
        isGameOver = false;
        if (overBox) overBox.innerHTML = '';
        updateScorePanel();
        resizeMemoryBoard();
        nextRound();
    };

    function nextRound() {
        playerSequence = [];
        sequence.push(Math.floor(Math.random() * 4));
        playSequence();
    }

    function playSequence() {
        isPlayingSequence = true;
        let i = 0;
        const interval = setInterval(() => {
            if (isGameOver) {
                clearInterval(interval);
                return;
            }
            const btnIndex = sequence[i];
            flashButton(btnIndex);
            i++;
            if (i >= sequence.length) {
                clearInterval(interval);
                setTimeout(() => {
                    isPlayingSequence = false;
                }, 400);
            }
        }, 600);
    }

    function flashButton(index) {
        const btn = boardEl.children[index];
        if (!btn) return;

        if (flashTimeouts[index]) {
            clearTimeout(flashTimeouts[index]);
        }

        btn.style.background = '#55ff55';
        btn.style.boxShadow = '0 0 20px #55ff55';

        flashTimeouts[index] = setTimeout(() => {
            btn.style.background = 'transparent';
            btn.style.boxShadow = 'inset 0 0 10px rgba(0,51,0,0.5)';
            delete flashTimeouts[index];
        }, 300);
    }

    window.handleMemoryClick = function(index) {
        if (isPlayingSequence || isGameOver) return;
        flashButton(index);
        playerSequence.push(index);

        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            triggerGameOver();
            return;
        }

        if (playerSequence.length === sequence.length) {
            score++;
            if (score > highscore) {
                highscore = score;
                localStorage.setItem('kpr_memory_highscore', highscore);
            }
            updateScorePanel();
            isPlayingSequence = true;
            setTimeout(nextRound, 800);
        }
    };

    function triggerGameOver() {
        isGameOver = true;
        const isRu = (getLang() === 'ru');
        if (overBox) {
            overBox.innerHTML = `<span style="color:var(--neon-red); font-size:12px; cursor:pointer;" onclick="window.resetMemoryGame()">${isRu ? 'ОШИБКА ПАМЯТИ! НАЖМИ [ПРОБЕЛ]' : 'MEMORY ERROR! PRESS [SPACE]'}</span>`;
        }
    }

    window.addEventListener('keydown', (e) => {
        const win = document.getElementById('win-memory');
        if (!win || win.style.display !== 'block') return;
        if (isGameOver && e.code === 'Space') {
            e.preventDefault();
            window.resetMemoryGame();
        }
    });

    boardEl.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const btn = document.createElement('div');
        btn.className = 'bb-cell';
        btn.style.cursor = 'pointer';
        btn.style.border = '2px solid #003300';
        btn.style.background = 'transparent';
        btn.style.boxShadow = 'inset 0 0 10px rgba(0,51,0,0.5)';
        btn.onclick = () => window.handleMemoryClick(i);
        boardEl.appendChild(btn);
    }

    window.resetMemoryGame();
};
