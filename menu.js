(function initGameMenuModule() {
    const menuEl = document.getElementById('game-main-menu');
    const titleEl = document.getElementById('menu-title-node');
    const btnStory = document.getElementById('menu-btn-story');
    const btnFree = document.getElementById('menu-btn-free');

    if (!menuEl || !titleEl || !btnFree || !btnStory) return;

    menuEl.classList.add('fade-in-element');

    btnStory.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    btnFree.addEventListener('click', () => {
        if (window.runSystemLoader) {
            menuEl.style.display = 'none';
            window.runSystemLoader(() => {
                document.body.classList.remove('wrong-flash');
                const deskEnv = document.getElementById('desktop-env');
                if (deskEnv) {
                    deskEnv.style.display = 'block';
                    deskEnv.classList.remove('desktop-fade-in');
                    void deskEnv.offsetWidth;
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
        let isRu = true;
        if (typeof currentLang !== 'undefined') {
            isRu = (currentLang === 'ru');
        } else if (typeof window.currentLang !== 'undefined') {
            isRu = (window.currentLang === 'ru');
        }
        btnStory.innerText = isRu ? "НАЧАТЬ ИГРУ" : "START GAME";
        btnFree.innerText = isRu ? "СВОБОДНАЯ ИГРА" : "FREE PLAY";
    }

    if (window.updateDesktopTexts) {
        updateMenuLang();
    } else {
        setTimeout(updateMenuLang, 100);
    }

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
