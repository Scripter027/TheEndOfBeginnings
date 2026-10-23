window.osZIndex = 3000;
window.openWindowsTrack = {};
window.desktopLangClicks = 0;

document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('dblclick', () => { 
        if(icon.style.display !== 'none') {
            window.openOSWindow(icon.dataset.id, currentLang === 'ru' ? icon.dataset.titleRu : icon.dataset.titleEn, icon.dataset.icon); 
        }
    });
    
    let lastTap = 0;
    icon.addEventListener('touchend', (e) => {
        let currentTime = new Date().getTime(); 
        let tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0 && icon.style.display !== 'none') { 
            e.preventDefault(); 
            window.openOSWindow(icon.dataset.id, currentLang === 'ru' ? icon.dataset.titleRu : icon.dataset.titleEn, icon.dataset.icon); 
        }
        lastTap = currentTime;
    });

    icon.addEventListener('pointerdown', function(e) {
        if (icon.style.display === 'none') return;
        
        if (icon.id === 'icon-win-trash' || icon.id === 'icon-win-explorer' || icon.id === 'icon-win-store') {
            let initialTop = icon.offsetTop;
            let initialLeft = icon.offsetLeft;
            setTimeout(() => { 
                if(icon.offsetTop === initialTop && icon.offsetLeft === initialLeft && icon.style.display !== 'none') {
                    window.openOSWindow(icon.dataset.id, currentLang === 'ru' ? icon.dataset.titleRu : icon.dataset.titleEn, icon.dataset.icon); 
                }
            }, 200);
        }
        
        icon.style.zIndex = "5000"; 
        let shiftX = e.clientX - icon.getBoundingClientRect().left; 
        let shiftY = e.clientY - icon.getBoundingClientRect().top;
        let oldTop = icon.style.top;
        let oldLeft = icon.style.left;
        
        function moveAt(pageX, pageY) {
            let containerEl = document.getElementById('desktopIconsContainer');
            if (!containerEl) return;
            let container = containerEl.getBoundingClientRect();
            let x = pageX - container.left - shiftX; 
            let y = pageY - container.top - shiftY;
            icon.style.left = x + 'px'; 
            icon.style.top = y + 'px';
        }
        
        function onPointerMove(ev) { moveAt(ev.clientX, ev.clientY); }
        document.addEventListener('pointermove', onPointerMove);
        
        document.addEventListener('pointerup', function onUp(ev) {
            icon.style.zIndex = "auto"; 
            document.removeEventListener('pointermove', onPointerMove); 
            document.removeEventListener('pointerup', onUp);
            
            let snap = (window.snapToGrid && typeof window.snapToGrid === 'function') ? window.snapToGrid(ev.clientX - shiftX, ev.clientY - shiftY) : { x: ev.clientX - shiftX, y: ev.clientY - shiftY }; 
            const trashIcon = document.getElementById('icon-win-trash');
            
            if (icon.id !== 'icon-win-trash' && icon.id !== 'icon-win-explorer' && icon.id !== 'icon-win-store' && trashIcon && snap.x === trashIcon.offsetLeft && snap.y === trashIcon.offsetTop) {
                icon.style.display = 'none'; 
                window.closeOSWindow(icon.dataset.id);
                if (typeof trashedApps !== 'undefined') {
                    trashedApps[icon.id] = { ru: icon.dataset.titleRu || '', en: icon.dataset.titleEn || '' }; 
                    localStorage.setItem('kpr_trashed_apps', JSON.stringify(trashedApps));
                }
                if (window.renderTrashList) window.renderTrashList(); 
                if (window.renderExplorerList) window.renderExplorerList(); 
                if (window.renderStoreList) window.renderStoreList();
                icon.style.left = oldLeft; 
                icon.style.top = oldTop; 
                return;
            }
            
            let overlap = false;
            document.querySelectorAll('.icon').forEach(other => { 
                if (other !== icon && other.style.display !== 'none' && other.offsetLeft === snap.x && other.offsetTop === snap.y) overlap = true; 
            });
            
            if (overlap) { 
                icon.style.left = oldLeft; 
                icon.style.top = oldTop; 
                return; 
            }
            
            icon.style.left = snap.x + 'px'; 
            icon.style.top = snap.y + 'px';
            
            try {
                let positions = JSON.parse(localStorage.getItem('kpr_icon_positions')) || {};
                positions[icon.id] = { left: icon.style.left, top: icon.style.top }; 
                localStorage.setItem('kpr_icon_positions', JSON.stringify(positions));
            } catch(err) {}
            if (window.renderExplorerList) window.renderExplorerList();
            if (window.renderStoreList) window.renderStoreList();
        });
    });
});
document.querySelectorAll('.os-window').forEach(win => {
    let header = win.querySelector('.window-header');
    if (!header) return;
    header.addEventListener('pointerdown', function(e) {
        if (e.target.classList.contains('window-btn') || win.classList.contains('maximized')) return;
        win.style.zIndex = ++window.osZIndex; 
        let shiftX = e.clientX - win.getBoundingClientRect().left; 
        let shiftY = e.clientY - win.getBoundingClientRect().top;
        
        function moveAt(pageX, pageY) { 
            let top = pageY - shiftY; 
            if (top < 0) top = 0; 
            win.style.left = (pageX - shiftX) + 'px'; 
            win.style.top = top + 'px'; 
        }
        
        function onPointerMove(e) { moveAt(e.clientX, e.clientY); }
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', function onUp() { 
            document.removeEventListener('pointermove', onPointerMove); 
            document.removeEventListener('pointerup', onUp); 
        });
    });
});

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
