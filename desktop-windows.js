window.osZIndex = 3000;
window.openWindowsTrack = {};
window.desktopLangClicks = 0;

document.querySelectorAll('.icon').forEach(icon => {
    let isDragging = false;
    let startX = 0, startY = 0;
    let oldTop = icon.style.top;
    let oldLeft = icon.style.left;

    function executeOpen() {
        if (icon.style.display === 'none') return;
        window.openOSWindow(icon.dataset.id, currentLang === 'ru' ? icon.dataset.titleRu : icon.dataset.titleEn, icon.dataset.icon);
    }

    icon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) {
            executeOpen();
        }
    });

    let lastTap = 0;
    icon.addEventListener('touchend', (e) => {
        if (isDragging || icon.style.display === 'none') return;
        let currentTime = new Date().getTime();
        let tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            e.preventDefault();
            e.stopPropagation();
            executeOpen();
        }
        lastTap = currentTime;
    });

    icon.addEventListener('pointerdown', function(e) {
        if (icon.style.display === 'none') return;
        
        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;
        
        icon.style.zIndex = "5000";
        oldTop = icon.style.top;
        oldLeft = icon.style.left;

        function onPointerMove(ev) {
            if (!isDragging && (Math.abs(ev.clientX - startX) > 8 || Math.abs(ev.clientY - startY) > 8)) {
                isDragging = true;
            }
            
            if (isDragging) {
                let containerEl = document.getElementById('desktopIconsContainer');
                if (!containerEl) return;
                let container = containerEl.getBoundingClientRect();
                
                let x = ev.clientX - container.left - (icon.offsetWidth / 2);
                let y = ev.clientY - container.top - (icon.offsetHeight / 2);
                
                icon.style.left = x + 'px';
                icon.style.top = y + 'px';
            }
        }

        document.addEventListener('pointermove', onPointerMove);

        document.addEventListener('pointerup', function onUp(ev) {
            icon.style.zIndex = "auto";
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onUp);

            setTimeout(() => { isDragging = false; }, 50);

            if (Math.abs(ev.clientX - startX) <= 8 && Math.abs(ev.clientY - startY) <= 8) {
                return;
            }

            let snap = (window.snapToGrid && typeof window.snapToGrid === 'function') ? 
                window.snapToGrid(ev.clientX - (icon.offsetWidth / 2), ev.clientY - (icon.offsetHeight / 2)) : 
                { x: ev.clientX - (icon.offsetWidth / 2), y: ev.clientY - (icon.offsetHeight / 2) };
                
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
        
        function onPointerMove(ev) { moveAt(ev.clientX, ev.clientY); }
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
    if (id === 'win-sudoku' && window.showSudokuMenu) window.showSudokuMenu();
    if (id === 'win-memory' && window.resetMemoryGame) window.resetMemoryGame();
    if (id === 'win-tower' && window.resetTowerGame) window.resetTowerGame();
    if (id === 'win-words' && window.showWordsMenu) window.showWordsMenu();
    if (id === 'win-hangman' && window.showHangmanMenu) window.showHangmanMenu();
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
