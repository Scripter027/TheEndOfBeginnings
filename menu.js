(function initGameMenuModule() {
    const menuEl = document.getElementById('game-main-menu');
    const titleEl = document.getElementById('menu-title-node');
    const btnStory = document.getElementById('menu-btn-story');
    const btnFree = document.getElementById('menu-btn-free');

    if (!menuEl || !titleEl || !btnFree || !btnStory) return;

    btnStory.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    btnFree.addEventListener('click', () => {
        menuEl.style.display = 'none';
        if (window.activateDesktopMode) {
            window.activateDesktopMode();
        }
    });

    function updateMenuLang() {
        const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
        titleEl.innerText = isRu ? "The Message" : "The Message";
        btnStory.innerText = isRu ? "НАЧАТЬ ИГРУ" : "START GAME";
        btnFree.innerText = isRu ? "СВОБОДНАЯ ИГРА" : "FREE PLAY";
    }

    setInterval(() => {
        if (window.updateDesktopTexts) {
            updateMenuLang();
        }
    }, 500);

    function runGlitchCycle() {
        titleEl.classList.remove('menu-glitch-green');
        titleEl.classList.add('menu-glitch-red');

        setTimeout(() => {
            titleEl.classList.remove('menu-glitch-red');
            titleEl.classList.add('menu-glitch-green');
        }, 10000);
    }

    setInterval(runGlitchCycle, 60000);
})();
