(function initGameMenuModule() {
    const menuEl = document.getElementById('game-main-menu');
    const titleEl = document.getElementById('menu-title-node');
    const btnStory = document.getElementById('menu-btn-story');
    const btnFree = document.getElementById('menu-btn-free');

    if (!menuEl || !titleEl || !btnFree || !btnStory) return;

    menuEl.classList.add('fade-in-element');
    titleEl.style.fontSize = '84px';
    titleEl.style.fontFamily = 'inherit';

    btnStory.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    btnFree.addEventListener('click', () => {
        if (window.runSystemLoader) {
            window.runSystemLoader(() => {
                menuEl.style.display = 'none';
                document.body.classList.remove('wrong-flash');
                const deskEnv = document.getElementById('desktop-env');
                if (deskEnv) {
                    deskEnv.style.display = 'block';
                    deskEnv.classList.add('desktop-fade-in');
                }
                if (window.activateDesktopMode) {
                    window.activateDesktopMode();
                }
            });
        } else {
            menuEl.style.display = 'none';
            if (window.activateDesktopMode) window.activateDesktopMode();
        }
    });

    function updateMenuLang() {
        const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
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
        document.body.classList.add('wrong-flash');

        setTimeout(() => {
            titleEl.classList.remove('menu-glitch-red');
            titleEl.classList.add('menu-glitch-green');
            document.body.classList.remove('wrong-flash');
        }, 10000);
    }

    setInterval(runGlitchCycle, 30000);
})();
