window.osZIndex = 3000;
window.openWindowsTrack = {};
window.desktopLangClicks = 0;

if (!localStorage.getItem('kpr_installed_apps')) {
    const defaultApps = {
        'icon-win-msg': true,
        'icon-win-search': true,
        'icon-win-bsod': true,
        'icon-win-dino': true,
        'icon-win-blocks': true
    };
    localStorage.setItem('kpr_installed_apps', JSON.stringify(defaultApps));
}

document.querySelectorAll('.icon').forEach(icon => {
    let isDragging = false;
    let startX = 0, startY = 0;
    let oldTop = icon.style.top;
    let oldLeft = icon.style.left;

    function executeOpen() {
        const targetId = icon.getAttribute('data-id') || icon.dataset.id;
        if (!targetId) return;
        
        const displayTitle = currentLang === 'ru' ? 
            (icon.getAttribute('data-title-ru') || icon.dataset.titleRu) : 
            (icon.getAttribute('data-title-en') || icon.dataset.titleEn);
            
        const iconPic = icon.getAttribute('data-icon') || icon.dataset.icon || '📦';
        
        window.openOSWindow(targetId, displayTitle, iconPic);
    }

    icon.addEventListener('click', function(e) {
        if (isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        executeOpen();
    });

    let lastTap = 0;
    icon.addEventListener('touchend', function(e) {
        if (isDragging) return;
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
        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;
        
        icon.style.zIndex = "5000";
        oldTop = icon.style.top;
        oldLeft = icon.style.left;

        let rect = icon.getBoundingClientRect();
        let shiftX = e.clientX - rect.left;
        let shiftY = e.clientY - rect.top;

        function onPointerMove(ev) {
            if (Math.abs(ev.clientX - startX) > 4 || Math.abs(ev.clientY - startY) > 4) {
                isDragging = true;
            }
            
            if (isDragging) {
                let containerEl = document.getElementById('desktopIconsContainer');
                if (!containerEl) return;
                let container = containerEl.getBoundingClientRect();
                
                let x = ev.clientX - container.left - shiftX;
                let y = ev.clientY - container.top - shiftY;
                
                icon.style.left = x + 'px';
                icon.style.top = y + 'px';
            }
        }

        document.addEventListener('pointermove', onPointerMove);

        document.addEventListener('pointerup', function onUp(ev) {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onUp);
            
            icon.style.zIndex = "auto";

            if (!isDragging) return;

            let snap = (window.snapToGrid && typeof window.snapToGrid === 'function') ? 
                window.snapToGrid(ev.clientX - shiftX, ev.clientY - shiftY) : 
                { x: ev.clientX - shiftX, y: ev.clientY - shiftY };
                
            const trashIcon = document.getElementById('icon-win-trash');

            if (icon.id !== 'icon-win-trash' && icon.id !== 'icon-win-explorer' && icon.id !== 'icon-win-store' && trashIcon && snap.x === trashIcon.offsetLeft && snap.y === trashIcon.offsetTop) {
                icon.style.display = 'none';
                window.closeOSWindow(icon.getAttribute('data-id') || icon.dataset.id);
                if (typeof trashedApps !== 'undefined') {
                    trashedApps[icon.id] = { ru: icon.getAttribute('data-title-ru') || '', en: icon.getAttribute('data-title-en') || '' };
                    localStorage.setItem('kpr_trashed_apps', JSON.stringify(trashedApps));
                }
                if (window.renderTrashList) window.renderTrashList();
                if (window.renderExplorerList) window.renderExplorerList();
                if (window.renderStoreList) window.renderStoreList();
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
