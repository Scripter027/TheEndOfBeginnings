window.osZIndex = 3000;
window.openWindowsTrack = {};
window.desktopLangClicks = 0;

if (typeof currentLang === 'undefined') {
    window.currentLang = 'ru';
}

(function automaticSystemWipe() {
    if (!localStorage.getItem('kpr_os_v1_repair_flush')) {
        localStorage.removeItem('kpr_icon_positions');
        localStorage.removeItem('kpr_trashed_apps');
        localStorage.removeItem('kpr_installed_apps');
        localStorage.setItem('kpr_os_v1_repair_flush', 'true');
    }
})();

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

window.generateDesktopIcons = function() {
    const container = document.getElementById('desktopIconsContainer');
    if (!container) return;
    container.innerHTML = '';

    const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
    const installedApps = JSON.parse(localStorage.getItem('kpr_installed_apps')) || {};
    const savedPositions = JSON.parse(localStorage.getItem('kpr_icon_positions')) || {};
    const localTrash = typeof trashedApps !== 'undefined' ? trashedApps : {};

    const allIcons = [
        { id: 'icon-win-explorer', target: 'win-explorer', ru: 'Проводник', en: 'Explorer', pic: '📁', core: true },
        { id: 'icon-win-store', target: 'win-store', ru: 'Магазин', en: 'Store', pic: '🛒', core: true },
        { id: 'icon-win-trash', target: 'win-trash', ru: 'Корзина', en: 'Trash', pic: '🗑️', core: true },
        { id: 'icon-win-msg', target: 'win-msg', ru: 'KPR-Связь', en: 'KPR-Chat', pic: '📟' },
        { id: 'icon-win-search', target: 'win-search', ru: 'Поисковик', en: 'Search', pic: '🌐' },
        { id: 'icon-win-bsod', target: 'win-bsod', ru: 'Экран Смерти', en: 'BSOD Screen', pic: '💀' },
        { id: 'icon-win-dino', target: 'win-dino', ru: 'Динозавр', en: 'Dino', pic: '🦖' },
        { id: 'icon-win-blocks', target: 'win-blocks', ru: 'Блок Бласт', en: 'Block Blast', pic: '🧱' },
        { id: 'icon-win-tetris', target: 'win-tetris', ru: 'Тетрис', en: 'Tetris', pic: '🕹️' },
        { id: 'icon-win-sudoku', target: 'win-sudoku', ru: 'Судоку', en: 'Sudoku', pic: '🔢' },
        { id: 'icon-win-memory', target: 'win-memory', ru: 'Память', en: 'Memory', pic: '🧠' },
        { id: 'icon-win-tower', target: 'win-tower', ru: 'Башня', en: 'Tower', pic: '🏢' },
        { id: 'icon-win-words', target: 'win-words', ru: 'Угадай слово', en: 'Guess Word', pic: '🔤' },
        { id: 'icon-win-hangman', target: 'win-hangman', ru: 'Виселица', en: 'Hangman', pic: '🪵' }
    ];

    allIcons.forEach(iconData => {
        if (localTrash[iconData.id]) return;
        if (!iconData.core && !installedApps[iconData.id]) return;

        const iconEl = document.createElement('div');
        iconEl.id = iconData.id;
        iconEl.className = 'icon';
        iconEl.setAttribute('data-id', iconData.target);
        iconEl.setAttribute('data-title-ru', iconData.ru);
        iconEl.setAttribute('data-title-en', iconData.en);
        iconEl.setAttribute('data-icon', iconData.pic);

        iconEl.innerHTML = `
            <div class="icon-pic">${iconData.pic}</div>
            <div class="icon-name">${isRu ? iconData.ru : iconData.en}</div>
        `;

        if (savedPositions[iconData.id]) {
            iconEl.style.left = savedPositions[iconData.id].left;
            iconEl.style.top = savedPositions[iconData.id].top;
        } else if (window.getFirstAvailableSlot) {
            const slot = window.getFirstAvailableSlot();
            iconEl.style.left = slot.left;
            iconEl.style.top = slot.top;
            savedPositions[iconData.id] = { left: slot.left, top: slot.top };
        }

        container.appendChild(iconEl);
        bindDragLogic(iconEl);
    });

    localStorage.setItem('kpr_icon_positions', JSON.stringify(savedPositions));
};

function bindDragLogic(icon) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let oldTop = icon.style.top;
    let oldLeft = icon.style.left;

    function executeOpen() {
        const targetId = icon.getAttribute('data-id') || icon.dataset.id;
        if (!targetId) return;
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
        const displayTitle = lang === 'ru' ? icon.getAttribute('data-title-ru') : icon.getAttribute('data-title-en');
        const iconPic = icon.getAttribute('data-icon') || '📦';
        window.openOSWindow(targetId, displayTitle, iconPic);
    }

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
            if (Math.abs(ev.clientX - startX) > 8 || Math.abs(ev.clientY - startY) > 8) {
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

            if (!isDragging) {
                executeOpen();
                return;
            }

            let snap = (window.snapToGrid && typeof window.snapToGrid === 'function') ? window.snapToGrid(ev.clientX - shiftX, ev.clientY - shiftY) : { x: ev.clientX - shiftX, y: ev.clientY - shiftY };
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
}

window.updateDesktopIconsLanguage = function() {
    const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
    document.querySelectorAll('.icon').forEach(icon => {
        const nameNode = icon.querySelector('.icon-name');
        if (nameNode) {
            const ruText = icon.getAttribute('data-title-ru');
            const enText = icon.getAttribute('data-title-en');
            nameNode.innerText = isRu ? ruText : enText;
        }
    });
};
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
        if (window.triggerBSOD) {
            window.triggerBSOD();
        } else {
            const bsodFallback = document.getElementById('win-bsod');
            if (bsodFallback) bsodFallback.style.display = 'block';
        }
        return;
    }
    const win = document.getElementById(id);
    if (!win) return;
    
    win.style.position = 'absolute';
    win.style.display = 'block';
    win.style.zIndex = ++window.osZIndex;
    
    const winRect = win.getBoundingClientRect();
    const winWidth = winRect.width || 320;
    const winHeight = winRect.height || 420;
    
    const leftPos = (window.innerWidth - winWidth) / 2;
    const topPos = (window.innerHeight - 44 - winHeight) / 2;
    
    win.style.left = Math.max(10, leftPos) + 'px';
    win.style.top = Math.max(10, topPos) + 'px';
    
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

window.exitToTerminal = function() {
    const deskEnv = document.getElementById('desktop-env');
    const menuEl = document.getElementById('game-main-menu');
    if (window.runSystemLoader) {
        if (deskEnv) deskEnv.style.display = 'none';
        window.runSystemLoader(() => {
            if (menuEl) {
                menuEl.style.display = 'flex';
                menuEl.classList.remove('fade-in-element');
                void menuEl.offsetWidth;
                menuEl.classList.add('fade-in-element');
            }
        });
    } else {
        if (deskEnv) deskEnv.style.display = 'none';
        if (menuEl) menuEl.style.display = 'flex';
    }
    return false;
};

window.toggleDesktopLanguage = function() {
    window.desktopLangClicks++;
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    
    const taskbarLangBtn = document.getElementById('taskbar-lang-btn');
    if (taskbarLangBtn) taskbarLangBtn.innerText = currentLang.toUpperCase();
    
    const containerLangBtn = document.getElementById('lang-btn');
    if (containerLangBtn) containerLangBtn.innerText = currentLang.toUpperCase();
    
    if (window.updateDesktopTexts) {
        try { window.updateDesktopTexts(); } catch(e) { console.log(e); }
    }
};

window.updateDesktopTexts = function() {
    const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
    const osLabel = document.getElementById('tb-os-label');
    if (osLabel) osLabel.innerText = isRu ? "KPR-OS v1.0" : "KPR-OS v1.0";
    const exitBtn = document.getElementById('tb-exit-btn');
    if (exitBtn) exitBtn.innerText = isRu ? "ВЫХОД" : "EXIT";
    const headSettings = document.getElementById('head-settings');
    if (headSettings) headSettings.innerText = isRu ? "НАСТРОЙКИ" : "SETTINGS";
    const txtSettingsInfo = document.getElementById('txt-settings-info');
    if (txtSettingsInfo) txtSettingsInfo.innerText = isRu ? "Сброс сотрет рекорды и вернет иконки по умолчанию." : "Reset will wipe highscores and restore default icons.";
    const btnResetAll = document.getElementById('btn-reset-all');
    if (btnResetAll) btnResetAll.innerText = isRu ? "СТЕРЕТЬ ДАННЫЕ" : "WIPE DATA";
    const txtPwaHead = document.getElementById('txt-pwa-head');
    if (txtPwaHead) txtPwaHead.innerText = isRu ? "ДОБАВИТЬ НА ЭКРАН ДОМОЙ:" : "ADD TO HOME SCREEN:";
    const txtPwaBody = document.getElementById('txt-pwa-body');
    if (txtPwaBody) txtPwaBody.innerText = isRu ? "Нажмите на три точки в углу браузера (или кнопку 'Поделиться') и выберите 'Добавить на рабочий стол', чтобы играть во весь экран!" : "Click on the three dots in your browser corner (or 'Share' button) and select 'Add to Home Screen' to play in full screen!";
    if (window.updateDesktopIconsLanguage) {
        window.updateDesktopIconsLanguage();
    }
};

window.clearAllOSData = function() {
    localStorage.clear();
    location.reload();
};

document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.getElementById('taskbar-lang-btn');
    if (langBtn) langBtn.addEventListener('click', window.toggleDesktopLanguage);
    const containerLangBtn = document.getElementById('lang-btn');
    if (containerLangBtn) containerLangBtn.addEventListener('click', window.toggleDesktopLanguage);
    const settingsBtn = document.getElementById('taskbar-settings-btn');
    if (settingsBtn) settingsBtn.addEventListener('click', () => { window.openOSWindow('win-settings', '⚙', '⚙'); });
    const exitBtn = document.getElementById('tb-exit-btn');
    if (exitBtn) exitBtn.addEventListener('click', window.exitToTerminal);
    if (window.generateDesktopIcons) {
        window.generateDesktopIcons();
    }
});
