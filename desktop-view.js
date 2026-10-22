window.osZIndex = 3000;
window.openWindowsTrack = {};
let desktopLangClicks = 0;
let trashedApps = {};

window.toggleMaximize = function(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.toggle('maximized');
    if (id === 'win-msg' && window.initMessenger) window.initMessenger();
};

window.openOSWindow = function(id, title, iconStr) {
    if (id === 'win-bsod') {
        const bsod = document.getElementById('bsodScreen');
        if (bsod) bsod.style.display = 'block';
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
        renderTaskbarApps();
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
    renderTaskbarApps();
};
window.minimizeOSWindow = function(id) {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
    renderTaskbarApps();
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
    renderTaskbarApps();
};

function renderTaskbarApps() {
    const container = document.getElementById('taskbar-apps');
    if (!container) return;
    container.innerHTML = '';
    for (const id in window.openWindowsTrack) {
        const btn = document.createElement('button');
        btn.className = 'taskbar-app-btn';
        const win = document.getElementById(id);
        if (win && win.style.display === 'block') btn.classList.add('active');
        btn.innerText = window.openWindowsTrack[id];
        btn.onclick = () => window.toggleWindowFromTaskbar(id);
        container.appendChild(btn);
    }
}

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
    desktopLangClicks++;
    if (desktopLangClicks >= 10) {
        const env = document.getElementById('desktop-env');
        const banner = document.getElementById('rageBanner');
        if (env) env.classList.add('rage-active');
        if (banner) banner.style.display = 'block';
        setTimeout(() => {
            if (env) env.classList.remove('rage-active');
            if (banner) banner.style.display = 'none';
            desktopLangClicks = 0;
        }, 10000);
    }
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    const langBtn = document.getElementById('taskbar-lang-btn');
    if (langBtn) langBtn.innerText = currentLang.toUpperCase();
    updateDesktopTexts();
};

function updateDesktopTexts() {
    const isRu = (currentLang === 'ru');
    const exitBtn = document.getElementById('tb-exit-btn');
    if (exitBtn) exitBtn.innerText = isRu ? "ВЫХОД" : "EXIT";
    const trashClear = document.getElementById('btn-trash-clear');
    if (trashClear) trashClear.innerText = isRu ? "Очистить" : "Clear";
    const winTrash = document.getElementById('label-win-trash');
    if (winTrash) winTrash.innerText = isRu ? "Корзина" : "Trash";
    const winExp = document.getElementById('label-win-explorer');
    if (winExp) winExp.innerText = isRu ? "Проводник" : "Explorer";
    const winStore = document.getElementById('label-win-store');
    if (winStore) winStore.innerText = isRu ? "Магазин" : "Store";
    const winMsg = document.getElementById('label-win-msg');
    if (winMsg) winMsg.innerText = isRu ? "KPR-Связь" : "KPR-Chat";
    const winSearch = document.getElementById('label-win-search');
    if (winSearch) winSearch.innerText = isRu ? "Поисковик" : "Search";
    const winDino = document.getElementById('label-win-dino');
    if (winDino) winDino.innerText = isRu ? "Динозавр" : "Dino";
    const winBlocks = document.getElementById('label-win-blocks');
    if (winBlocks) winBlocks.innerText = isRu ? "Блок Бласт" : "Block Blast";
    const winDont = document.getElementById('label-win-dontopen');
    if (winDont) winDont.innerText = isRu ? "НЕ ОТКРЫВАТЬ" : "DO NOT OPEN";
    const winBsod = document.getElementById('label-win-bsod');
    if (winBsod) winBsod.innerText = isRu ? "Экран Смерти" : "BSOD Screen";
    const headTrash = document.getElementById('head-trash');
    if (headTrash) headTrash.innerText = isRu ? "КОРЗИНА" : "TRASH";
    const headExp = document.getElementById('head-explorer');
    if (headExp) headExp.innerText = isRu ? "ПРОВОДНИК" : "EXPLORER";
    const headStore = document.getElementById('head-store');
    if (headStore) headStore.innerText = isRu ? "KEEPER STORE" : "KEEPER STORE";
    const headSettings = document.getElementById('head-settings');
    if (headSettings) headSettings.innerText = isRu ? "НАСТРОЙКИ" : "SETTINGS";
    const headZip = document.getElementById('head-zip');
    if (headZip) headZip.innerText = isRu ? "АРХИВАТОР - SECRET.ZIP" : "ARCHIVER - SECRET.ZIP";
    const headZip2 = document.getElementById('head-zip2');
    if (headZip2) headZip2.innerText = isRu ? "АРХИВАТОР - SECRET1.ZIP" : "ARCHIVER - SECRET1.ZIP";
    const headZip3 = document.getElementById('head-zip3');
    if (headZip3) headZip3.innerText = isRu ? "АРХИВАТОР - SECRET2.ZIP" : "ARCHIVER - SECRET2.ZIP";
    const headDont = document.getElementById('head-dontopen');
    if (headDont) headDont.innerText = isRu ? "НЕ ОТКРЫВАТЬ" : "DO NOT OPEN";
    const headMsg = document.getElementById('head-msg');
    if (headMsg) headMsg.innerText = isRu ? "МЕССЕНДЖЕР v1.02" : "MESSENGER v1.02";
    const headSearch = document.getElementById('head-search');
    if (headSearch) headSearch.innerText = isRu ? "БРАУЗЕР 'ПРИЗРАК'" : "BROWSER 'GHOST'";
    const headDino = document.getElementById('head-dino');
    if (headDino) headDino.innerText = isRu ? "DINO_RUN.EXE" : "DINO_RUN.EXE";
    const headBlocks = document.getElementById('head-blocks');
    if (headBlocks) headBlocks.innerText = isRu ? "BLOCK_BLAST.EXE" : "BLOCK_BLAST.EXE";
    const txtInfo = document.getElementById('txt-settings-info');
    if (txtInfo) txtInfo.innerText = isRu ? "Сброс сотрет рекорды и вернет иконки по умолчанию." : "Reset will clear highscores and restore default icons.";
    const btnReset = document.getElementById('btn-reset-all');
    if (btnReset) btnReset.innerText = isRu ? "СТЕРЕТЬ ДАННЫЕ" : "WIPE ALL DATA";
    document.querySelectorAll('.txt-zip-locked').forEach(el => {
        el.innerText = isRu ? "Файл зашифрован ключом AES-256." : "The file is encrypted with an AES-256 key.";
    });
    if (typeof renderTrashList === 'function') renderTrashList();
    if (typeof renderExplorerList === 'function') renderExplorerList();
    if (window.renderStoreList) window.renderStoreList();
    if (window.renderMessengerUsers) window.renderMessengerUsers();
    const searchWin = document.getElementById('win-search');
    if (window.initSearchBrowser && searchWin && searchWin.style.display === 'block') {
        window.initSearchBrowser();
    }
}
window.advanceNestedFolder = function(step) {
    const body = document.getElementById('nestedFolderBody');
    if (!body) return;
    const isRu = (currentLang === 'ru');
    const nextStep = step + 1;
    const phrasesRu = ["ТЫ ИЗДЕВАЕШЬСЯ", "НЕ ОТКРЫВАТЬ СКАЗАЛ", "ЛАДНО", "СМОТРИ РАЗ ХОЧЕШЬ", "ТАМ ПУСТО", "КОНЧАЙ ЭТО", "ГЛУБЖЕ СИСТЕМЫ", "ОШИБКА ДОСТУПА", "КОД КАТЕГОРИИ 404"];
    const phrasesEn = ["ARE YOU KIDDING ME", "I SAID DO NOT OPEN", "FINE", "LOOK IF YOU WANT", "IT IS EMPTY THERE", "STOP THIS", "DEEPER INTO SYSTEM", "ACCESS ERROR", "CATEGORY CODE 404"];
    let text = isRu ? phrasesRu[step % phrasesRu.length] : phrasesEn[step % phrasesEn.length];
    const randId = Math.floor(Math.random() * 100000);
    body.innerHTML = `<div style="padding-left: 8px; border-left: 2px dashed #55ff55; margin-top: 6px;"><span class="nested-folder-link" id="nested-link-${randId}" onclick="advanceNestedFolder(${nextStep})">📁 ${text}</span></div>`;
};

window.emptyTrash = function() {
    trashedApps = {};
    localStorage.removeItem('kpr_trashed_apps');
    if (typeof renderTrashList === 'function') renderTrashList();
    if (window.renderStoreList) window.renderStoreList();
};

window.restoreApp = function(id) {
    const icon = document.getElementById(id);
    if (icon && typeof window.getFirstAvailableSlot === 'function') {
        const slot = window.getFirstAvailableSlot();
        icon.style.left = slot.left;
        icon.style.top = slot.top;
        icon.style.display = 'flex';
        let positions = JSON.parse(localStorage.getItem('kpr_icon_positions')) || {};
        positions[id] = { left: slot.left, top: slot.top };
        localStorage.setItem('kpr_icon_positions', JSON.stringify(positions));
        delete trashedApps[id];
        localStorage.setItem('kpr_trashed_apps', JSON.stringify(trashedApps));
        if (typeof renderTrashList === 'function') renderTrashList();
        if (typeof renderExplorerList === 'function') renderExplorerList();
        if (window.renderStoreList) window.renderStoreList();
    }
};

function renderTrashList() {
    const container = document.getElementById('trashListContainer');
    if (!container) return;
    container.innerHTML = '';
    let hasItems = false;
    for (const id in trashedApps) {
        hasItems = true;
        const item = document.createElement('div');
        item.className = 'trash-item';
        const displayTitle = currentLang === 'ru' ? trashedApps[id].ru : trashedApps[id].en;
        item.innerHTML = `<span>${displayTitle}</span><button class="trash-btn" onclick="restoreApp('${id}')">${currentLang==='ru'?'Вернуть':'Restore'}</button>`;
        container.appendChild(item);
    }
    if (!hasItems) container.innerHTML = currentLang === 'ru' ? 'Корзина пуста' : 'Trash is empty';
}
window.currentExplorerTab = 'apps';
window.switchExplorerTab = function(tabId) {
    window.currentExplorerTab = tabId;
    renderExplorerList();
};

function renderExplorerList() {
    const container = document.getElementById('explorerListContainer');
    if (!container) return;
    container.innerHTML = '';
    const icons = document.querySelectorAll('.icon');
    const isRu = (currentLang === 'ru');
    const appTypes = {
        apps: ['icon-win-msg', 'icon-win-search', 'icon-win-bsod'],
        games: ['icon-win-dino', 'icon-win-blocks', 'icon-win-tetris'],
        other: ['icon-win-zip', 'icon-win-zip2', 'icon-win-zip3', 'icon-win-dontopen']
    };
    const listHTML = [];
    icons.forEach(icon => {
        if (icon.id === 'icon-win-explorer' || icon.id === 'icon-win-trash' || icon.id === 'icon-win-store' || icon.id === 'icon-win-settings') return;
        if (trashedApps[icon.id]) return;
        if (appTypes[window.currentExplorerTab] && appTypes[window.currentExplorerTab].includes(icon.id)) {
            const titleRu = icon.dataset.titleRu || (icon.querySelector('.icon-name') ? icon.querySelector('.icon-name').innerText : '');
            const titleEn = icon.dataset.titleEn || (icon.querySelector('.icon-name') ? icon.querySelector('.icon-name').innerText : '');
            const displayTitle = isRu ? titleRu : titleEn;
            const pic = icon.querySelector('.icon-pic') ? icon.querySelector('.icon-pic').innerText : '📦';
            const targetId = icon.dataset.id || '';
            listHTML.push(`
                <div class="store-item">
                    <div class="store-item-left" style="display:flex; align-items:center; gap:8px;">
                        <span>${pic}</span>
                        <span>${displayTitle}</span>
                    </div>
                    <button class="explorer-btn" onclick="window.openOSWindow('${targetId}', '${displayTitle}', '${pic}')">${isRu?'Открыть':'Open'}</button>
                </div>
            `);
        }
    });
    
    const contentWrap = document.createElement('div');
    contentWrap.style.cssText = "height:calc(100% - 40px); overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:6px;";
    contentWrap.innerHTML = listHTML.length > 0 ? listHTML.join('') : `<div style="text-align:center; padding-top:20px; color:rgba(85,255,85,0.4);">${isRu?'Пусто':'Empty'}</div>`;
    
    const tabsWrap = document.createElement('div');
    tabsWrap.className = "store-tabs-container";
    tabsWrap.style.cssText = "height:40px; border-top:2px solid #55ff55; display:flex; background:rgba(0,0,0,0.85); width:100%;";
    
    const tabs = [{id:'apps', ru:'APPS', en:'APPS'}, {id:'games', ru:'GAMES', en:'GAMES'}, {id:'other', ru:'OTHER', en:'OTHER'}];
    tabs.forEach((t, index) => {
        const btn = document.createElement('button');
        btn.id = `explorer-tab-${t.id}`;
        btn.style.cssText = "flex:1; background:transparent; border:none; color:#55ff55; font-weight:bold; font-size:11px; cursor:pointer;";
        if (index > 0) btn.style.borderLeft = "2px solid #55ff55";
        btn.innerText = isRu ? t.ru : t.en;
        if (window.currentExplorerTab === t.id) {
            btn.style.background = "#55ff55";
            btn.style.color = "#000000";
        }
        btn.onclick = () => window.switchExplorerTab(t.id);
        tabsWrap.appendChild(btn);
    });
    
    const mainWrap = document.createElement('div');
    mainWrap.style.cssText = "display:flex; flex-direction:column; height:100%; width:100%; justify-content:space-between;";
    mainWrap.appendChild(contentWrap);
    mainWrap.appendChild(tabsWrap);
    
    container.innerHTML = '';
    container.style.padding = '0';
    container.appendChild(mainWrap);
}

window.checkZipPassword = function(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    const input = win.querySelector('.zip-input-field');
    const body = win.querySelector('.window-body');
    if (!input || !body) return;
    const isRu = (currentLang === 'ru');
    if (input.value === '246' || input.value === '!!!!!') {
        if (winId === 'win-zip') body.innerHTML = isRu ? "<p>Доступ открыт. Ключевой лог: [STAGE-1-COMPLETE]</p>" : "<p>Access granted. Key log: [STAGE-1-COMPLETE]</p>";
        else if (winId === 'win-zip2') body.innerHTML = isRu ? "<p>Локальные метаданные KPR-OS.</p><p style='color:var(--bright-green);margin-top:10px;'>Статус: Архив поврежден временным сдвигом.</p>" : "<p>Local KPR-OS metadata.</p><p style='color:var(--bright-green);margin-top:10px;'>Status: Archive damaged by time shift.</p>";
        else if (winId === 'win-zip3') body.innerHTML = isRu ? "<p>Манифест: 'Новая Эра близко. Подготовьте терминальные ключи шлюза.'</p>" : "<p>Manifest: 'A New Era is close. Prepare terminal gateway keys.'</p>";
    } else {
        alert(isRu ? 'НЕВЕРНЫЙ ПАРОЛЬ' : 'INVALID PASSWORD');
    }
};

window.clearAllOSData = function() {
    localStorage.removeItem('kpr_dino_highscore');
    localStorage.removeItem('kpr_bb_highscore');
    localStorage.removeItem('kpr_icon_positions');
    localStorage.removeItem('kpr_trashed_apps');
    trashedApps = {};
    window.closeOSWindow('win-settings');
    const initialPositions = {
        'icon-win-trash': { left: '20px', top: '20px' }, 'icon-win-explorer': { left: '20px', top: '110px' },
        'icon-win-store': { left: '20px', top: '200px' }, 'icon-win-msg': { left: '20px', top: '290px' },
        'icon-win-search': { left: '120px', top: '20px' }, 'icon-win-dino': { left: '120px', top: '110px' },
        'icon-win-blocks': { left: '120px', top: '200px' }, 'icon-win-tetris': { left: '120px', top: '290px' },
        'icon-win-zip': { left: '220px', top: '20px' }, 'icon-win-zip2': { left: '220px', top: '110px' },
        'icon-win-zip3': { left: '220px', top: '200px' }, 'icon-win-dontopen': { left: '220px', top: '290px' },
        'icon-win-bsod': { left: '320px', top: '20px' }
    };
    localStorage.setItem('kpr_icon_positions', JSON.stringify(initialPositions));
    localStorage.setItem('kpr_trashed_apps', JSON.stringify(trashedApps));
    document.querySelectorAll('.icon').forEach(icon => {
        const pos = initialPositions[icon.id];
        if(pos) {
            icon.style.left = pos.left;
            icon.style.top = pos.top;
            icon.style.display = 'flex';
        }
    });
    if (window.resetDinoGame) window.resetDinoGame();
    if (window.resetBlockBlastGame) window.resetBlockBlastGame();
    if (window.resetTetrisGame) window.resetTetrisGame();
    if (typeof updateDesktopTexts === 'function') updateDesktopTexts();
};

window.activateDesktopMode = function() {
    const mainCont = document.getElementById('main-container');
    const bootScr = document.getElementById('boot-screen');
    const deskEnv = document.getElementById('desktop-env');
    if (mainCont) mainCont.style.display = 'none';
    if (bootScr) bootScr.style.display = 'none';
    if (deskEnv) deskEnv.style.display = 'block';
    const initialPositions = {
        'icon-win-trash': { left: '20px', top: '20px' }, 'icon-win-explorer': { left: '20px', top: '110px' },
        'icon-win-store': { left: '20px', top: '200px' }, 'icon-win-msg': { left: '20px', top: '290px' },
        'icon-win-search': { left: '120px', top: '20px' }, 'icon-win-dino': { left: '120px', top: '110px' },
        'icon-win-blocks': { left: '120px', top: '200px' }, 'icon-win-tetris': { left: '120px', top: '290px' },
        'icon-win-zip': { left: '220px', top: '20px' }, 'icon-win-zip2': { left: '220px', top: '110px' },
        'icon-win-zip3': { left: '220px', top: '200px' }, 'icon-win-dontopen': { left: '220px', top: '290px' },
        'icon-win-bsod': { left: '320px', top: '20px' }
    };
    try {
        const savedPositions = JSON.parse(localStorage.getItem('kpr_icon_positions')) || {};
        const savedTrash = JSON.parse(localStorage.getItem('kpr_trashed_apps')) || {};
        trashedApps = savedTrash;
        document.querySelectorAll('.icon').forEach(icon => {
            if (trashedApps[icon.id]) {
                icon.style.display = 'none';
                return;
            }
            const pos = savedPositions[icon.id] || initialPositions[icon.id];
            if (pos) {
                icon.style.left = pos.left;
                icon.style.top = pos.top;
                icon.style.display = 'flex';
            }
        });
    } catch (e) {
        trashedApps = {};
    }
    try { if (window.initDinoGame) window.initDinoGame(); } catch (e) {}
    try { if (window.initBlockBlast) window.initBlockBlast(); } catch (e) {}
    try { if (window.initMessenger) window.initMessenger(); } catch (e) {}
    try { if (window.initKeeperStore) window.initKeeperStore(); } catch (e) {}
    try { if (window.initTetrisGame) window.initTetrisGame(); } catch (e) {}
    if (typeof updateDesktopTexts === 'function') updateDesktopTexts();
};

