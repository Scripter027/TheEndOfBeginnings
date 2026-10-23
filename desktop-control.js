window.osZIndex = 3000;
window.openWindowsTrack = {};
window.desktopLangClicks = 0;

window.toggleMaximize = function(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.toggle('maximized');
    if (id === 'win-msg' && window.initMessenger) window.initMessenger();
};

window.openOSWindow = function(id, title, iconStr) {
    if (id === 'win-bsod') {
        if (window.triggerBSOD) window.triggerBSOD();
        return;
    }
    const win = document.getElementById(id);
    if (!win) return;
    win.style.display = 'block';
    win.style.zIndex = ++window.osZIndex;
    if (window.innerWidth < 600) {
        win.style.left = '4vw';
        win.style.top = '10vh';
    }
    if (!window.openWindowsTrack[id]) {
        window.openWindowsTrack[id] = iconStr || '📦';
        if (window.renderTaskbarApps) window.renderTaskbarApps();
    }
    if (id === 'win-dino' && window.resetDinoGame) window.resetDinoGame();
    if (id === 'win-blocks' && window.resetBlockBlastGame) window.resetBlockBlastGame();
    if (id === 'win-store' && window.initKeeperStore) window.initKeeperStore();
    if (id === 'win-search' && window.initSearchBrowser) window.initSearchBrowser();
    if (id === 'win-tetris' && window.initTetrisGame) window.initTetrisGame();
};

window.closeOSWindow = function(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'none';
        win.classList.remove('maximized');
    }
    delete window.openWindowsTrack[id];
    if (window.renderTaskbarApps) window.renderTaskbarApps();
};

window.minimizeOSWindow = function(id) {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
    if (window.renderTaskbarApps) window.renderTaskbarApps();
};
window.toggleWindowFromTaskbar = function(id) {
    const win = document.getElementById(id);
    if (!win) return;
    if (win.style.display === 'block') {
        win.style.display = 'none';
    } else {
        win.style.display = 'block';
        win.style.zIndex = ++window.osZIndex;
    }
    if (window.renderTaskbarApps) window.renderTaskbarApps();
};

window.exitToTerminal = function() {
    const desktop = document.getElementById('desktop-env');
    const mainContainer = document.getElementById('main-container');
    const responseText = document.getElementById('response-text');
    const userInput = document.getElementById('user-input');
    
    if (desktop) desktop.style.display = 'none';
    if (mainContainer) mainContainer.style.display = 'flex';
    if (responseText && typeof langData !== 'undefined' && langData[currentLang]) {
        responseText.innerText = langData[currentLang].defaultPrompt;
    }
    if (userInput) userInput.focus();
};

window.toggleDesktopLanguage = function() {
    window.desktopLangClicks++;
    if (window.desktopLangClicks >= 10) {
        const env = document.getElementById('desktop-env');
        const banner = document.getElementById('rageBanner');
        if (env) env.classList.add('rage-active');
        if (banner) banner.style.display = 'block';
        setTimeout(() => {
            if (env) env.classList.remove('rage-active');
            if (banner) banner.style.display = 'none';
            window.desktopLangClicks = 0;
        }, 10000);
    }
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    const langBtn = document.getElementById('taskbar-lang-btn');
    if (langBtn) langBtn.innerText = currentLang.toUpperCase();
    if (window.updateDesktopTexts) window.updateDesktopTexts();
};

function updateTaskbarTimer() {
    if (typeof targetDate === 'undefined') return;
    const distance = targetDate - new Date().getTime(); 
    const tbLabel = document.getElementById('taskbar-timer'); 
    if (!tbLabel) return;
    if (distance < 0) { 
        tbLabel.innerHTML = "00:00:00:00"; 
        return; 
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const dStr = days < 10 ? '0' + days : days;
    const hStr = hours < 10 ? '0' + hours : hours;
    const mStr = minutes < 10 ? '0' + minutes : minutes;
    const sStr = seconds < 10 ? '0' + seconds : seconds;
    
    window.requestAnimationFrame(() => {
        if (tbLabel) tbLabel.innerHTML = dStr + ':' + hStr + ':' + mStr + ':' + sStr;
    });
}
setInterval(updateTaskbarTimer, 1000);
updateTaskbarTimer();
