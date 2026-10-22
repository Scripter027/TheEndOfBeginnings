window.osZIndex = 3000;
window.openWindowsTrack = {};
let desktopLangClicks = 0;
let trashedApps = {};

window.openOSWindow = function(id, title, iconStr) {
    if (id === 'win-bsod') { document.getElementById('bsodScreen').style.display = 'block'; return; }
    const win = document.getElementById(id);
    if (!win) return;
    win.style.display = 'block'; win.style.zIndex = ++window.osZIndex;
    if (window.innerWidth < 600) { win.style.left = '4vw'; win.style.top = '10vh'; }
    if (!window.openWindowsTrack[id]) {
        window.openWindowsTrack[id] = iconStr || '📦';
        renderTaskbarApps();
    }
    if (id === 'win-dino' && window.resetDinoGame) window.resetDinoGame();
    if (id === 'win-blocks' && window.resetBlockBlastGame) window.resetBlockBlastGame();
    if (id === 'win-store' && window.initKeeperStore) window.initKeeperStore();
};

window.closeOSWindow = function(id) {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
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
    if (win.style.display === 'block') { win.style.display = 'none'; }
    else { win.style.display = 'block'; win.style.zIndex = ++window.osZIndex; }
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
    document.getElementById('desktop-env').style.display = 'none';
    document.getElementById('main-container').style.display = 'flex';
    document.getElementById('response-text').innerText = langData[currentLang].defaultPrompt;
    document.getElementById('user-input').focus();
};

window.toggleDesktopLanguage = function() {
    desktopLangClicks++;
    if (desktopLangClicks >= 10) {
        const env = document.getElementById('desktop-env');
        const banner = document.getElementById('rageBanner');
        env.classList.add('rage-active'); banner.style.display = 'block';
        setTimeout(() => { env.classList.remove('rage-active'); banner.style.display = 'none'; desktopLangClicks = 0; }, 10000);
    }
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    const langBtn = document.getElementById('taskbar-lang-btn');
    if (langBtn) langBtn.innerText = currentLang.toUpperCase();
    updateDesktopTexts();
};

function updateDesktopTexts() {
    const isRu = (currentLang === 'ru');
    document.getElementById('tb-exit-btn').innerText = isRu ? "ВЫХОД" : "EXIT";
    document.getElementById('btn-trash-clear').innerText = isRu ? "Очистить" : "Clear";
    document.getElementById('label-win-trash').innerText = isRu ? "Корзина" : "Trash";
    document.getElementById('label-win-explorer').innerText = isRu ? "Проводник" : "Explorer";
    document.getElementById('label-win-store').innerText = isRu ? "Магазин" : "Store";
    document.getElementById('label-win-msg').innerText = isRu ? "KPR-Связь" : "KPR-Chat";
    document.getElementById('label-win-search').innerText = isRu ? "Поисковик" : "Search";
    document.getElementById('label-win-dino').innerText = isRu ? "Динозавр" : "Dino";
    document.getElementById('label-win-blocks').innerText = isRu ? "Блок Бласт" : "Block Blast";
    document.getElementById('label-win-dontopen').innerText = isRu ? "НЕ ОТКРЫВАТЬ" : "DO NOT OPEN";
    document.getElementById('label-win-bsod').innerText = isRu ? "Экран Смерти" : "BSOD Screen";
    document.getElementById('head-trash').innerText = isRu ? "КОРЗИНА" : "TRASH";
    document.getElementById('head-explorer').innerText = isRu ? "ПРОВОДНИК" : "EXPLORER";
    document.getElementById('head-store').innerText = isRu ? "KEEPER STORE" : "KEEPER STORE";
    document.getElementById('head-zip').innerText = isRu ? "АРХИВАТОР - SECRET.ZIP" : "ARCHIVER - SECRET.ZIP";
    document.getElementById('head-zip2').innerText = isRu ? "АРХИВАТОР - SECRET1.ZIP" : "ARCHIVER - SECRET1.ZIP";
    document.getElementById('head-zip3').innerText = isRu ? "АРХИВАТОР - SECRET2.ZIP" : "ARCHIVER - SECRET2.ZIP";
    document.getElementById('head-dontopen').innerText = isRu ? "НЕ ОТКРЫВАТЬ" : "DO NOT OPEN";
    document.getElementById('head-msg').innerText = isRu ? "МЕССЕНДЖЕР v1.02" : "MESSENGER v1.02";
    document.getElementById('head-search').innerText = isRu ? "БРАУЗЕР 'ПРИЗРАК'" : "BROWSER 'GHOST'";
    document.getElementById('head-dino').innerText = isRu ? "DINO_RUN.EXE" : "DINO_RUN.EXE";
    document.getElementById('head-blocks').innerText = isRu ? "BLOCK_BLAST.EXE" : "BLOCK_BLAST.EXE";
    document.querySelectorAll('.txt-zip-locked').forEach(el => {
        el.innerText = isRu ? "Файл зашифрован ключом AES-256." : "The file is encrypted with an AES-256 key.";
    });
    renderTrashList();
    renderExplorerList();
    if(window.renderStoreList) window.renderStoreList();
    if(window.renderMessengerUsers) window.renderMessengerUsers();
}

window.advanceNestedFolder = function(step) {
    const body = document.getElementById('nestedFolderBody');
    const isRu = (currentLang === 'ru');
    if (step === 1) body.innerHTML = '<span class="nested-folder-link" onclick="advanceNestedFolder(2)">📁 ' + (isRu ? 'ТЫ ИЗДЕВАЕШЬСЯ' : 'ARE YOU KIDDING ME') + '</span>';
    else if (step === 2) body.innerHTML = '<span class="nested-folder-link" onclick="advanceNestedFolder(3)">📁 ' + (isRu ? 'НЕ ОТКРЫВАЙ СКАЗАЛ' : 'I SAID DO NOT OPEN') + '</span>';
    else if (step === 3) body.innerHTML = '<span class="nested-folder-link" onclick="advanceNestedFolder(4)">📁 ' + (isRu ? 'ЛАДНО' : 'FINE') + '</span>';
    else if (step === 4) body.innerHTML = '<span class="nested-folder-link" onclick="advanceNestedFolder(5)">📁 ' + (isRu ? 'СМОТРИ РАЗ ХОЧЕШЬ' : 'LOOK IF YOU WANT') + '</span>';
    else if (step === 5) body.innerHTML = '<p style="color:var(--bright-green)">' + (isRu ? '[Здесь абсолютно пусто...]' : '[It is absolutely empty here...]') + '</p>';
};

window.emptyTrash = function() {
    trashedApps = {};
    localStorage.removeItem('kpr_trashed_apps');
    renderTrashList();
    if(window.renderStoreList) window.renderStoreList();
};

window.restoreApp = function(id) {
    const icon = document.getElementById(id);
    if (icon) {
        const slot = window.getFirstAvailableSlot();
        icon.style.left = slot.left;
        icon.style.top = slot.top;
        icon.style.display = 'flex';
        let positions = JSON.parse(localStorage.getItem('kpr_icon_positions')) || {};
        positions[id] = { left: slot.left, top: slot.top };
        localStorage.setItem('kpr_icon_positions', JSON.stringify(positions));
        delete trashedApps[id];
        localStorage.setItem('kpr_trashed_apps', JSON.stringify(trashedApps));
        renderTrashList();
        renderExplorerList();
        if(window.renderStoreList) window.renderStoreList();
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

function renderExplorerList() {
    const container = document.getElementById('explorerListContainer');
    if (!container) return;
    container.innerHTML = '';
    const icons = document.querySelectorAll('.icon');
    let hasItems = false;
    icons.forEach(icon => {
        if (icon.id === 'icon-win-explorer' || icon.id === 'icon-win-trash' || icon.id === 'icon-win-store') return;
        if (trashedApps[icon.id]) return;
        hasItems = true;
        const item = document.createElement('div');
        item.className = 'explorer-item';
        const titleRu = icon.dataset.titleRu || icon.querySelector('.icon-name').innerText;
        const titleEn = icon.dataset.titleEn || icon.querySelector('.icon-name').innerText;
        const displayTitle = currentLang === 'ru' ? titleRu : titleEn;
        const pic = icon.querySelector('.icon-pic').innerText;
        item.innerHTML = `<div class="explorer-item-left"><span>${pic}</span><span>${displayTitle}</span></div><button class="explorer-btn" onclick="window.openOSWindow('${icon.dataset.id}', '${displayTitle}', '${pic}')">${currentLang==='ru'?'Открыть':'Open'}</button>`;
        container.appendChild(item);
    });
    if (!hasItems) container.innerHTML = currentLang === 'ru' ? 'Проводник пуст' : 'Explorer is empty';
}

window.checkZipPassword = function(winId) {
    const win = document.getElementById(winId);
    const input = win.querySelector('.zip-input-field');
    const body = win.querySelector('.window-body');
    const isRu = (currentLang === 'ru');
    if (input.value === '246' || input.value === '!!!!!') {
        if (winId === 'win-zip') body.innerHTML = isRu ? "<p>Доступ открыт. Ключевой лог: [STAGE-1-COMPLETE]</p>" : "<p>Access granted. Key log: [STAGE-1-COMPLETE]</p>";
        else if (winId === 'win-zip2') body.innerHTML = isRu ? "<p>Локальные метаданные KPR-OS.</p><p style='color:var(--bright-green);margin-top:10px;'>Статус: Архив поврежден временным сдвигом.</p>" : "<p>Local KPR-OS metadata.</p><p style='color:var(--bright-green);margin-top:10px;'>Status: Archive damaged by time shift.</p>";
        else if (winId === 'win-zip3') body.innerHTML = isRu ? "<p>Манифест: 'Новая Эра близко. Подготовьте терминальные ключи шлюза.'</p>" : "<p>Manifest: 'A New Era is close. Prepare terminal gateway keys.'</p>";
    } else {
        alert(isRu ? 'НЕВЕРНЫЙ ПАРОЛЬ' : 'INVALID PASSWORD');
    }
};

window.activateDesktopMode = function() {
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('boot-screen').style.display = 'none';
    document.getElementById('desktop-env').style.display = 'block';
    
    const initialPositions = {
        'icon-win-trash': { left: '20px', top: '20px' },
        'icon-win-explorer': { left: '20px', top: '110px' },
        'icon-win-store': { left: '20px', top: '200px' },
        'icon-win-msg': { left: '20px', top: '290px' },
        'icon-win-search': { left: '120px', top: '20px' },
        'icon-win-dino': { left: '120px', top: '110px' },
        'icon-win-blocks': { left: '120px', top: '200px' },
        'icon-win-zip': { left: '120px', top: '290px' },
        'icon-win-zip2': { left: '220px', top: '20px' },
        'icon-win-zip3': { left: '220px', top: '110px' },
        'icon-win-dontopen': { left: '220px', top: '200px' },
        'icon-win-bsod': { left: '220px', top: '290px' }
    };

    try {
        const savedPositions = JSON.parse(localStorage.getItem('kpr_icon_positions')) || {};
        const savedTrash = JSON.parse(localStorage.getItem('kpr_trashed_apps')) || {};
        trashedApps = savedTrash;
        document.querySelectorAll('.icon').forEach(icon => {
            const pos = savedPositions[icon.id] || initialPositions[icon.id] || { left: '20px', top: '20px' };
            icon.style.left = pos.left;
            icon.style.top = pos.top;
            if (trashedApps[icon.id]) icon.style.display = 'none';
            else icon.style.display = 'flex';
        });
    } catch(e) {}
    if (window.initDinoGame) window.initDinoGame();
    if (window.initBlockBlast) window.initBlockBlast();
    if (window.initMessenger) window.initMessenger();
    if (window.initKeeperStore) window.initKeeperStore();
    updateDesktopTexts();
};

document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('dblclick', () => { if(icon.style.display !== 'none') window.openOSWindow(icon.dataset.id, currentLang==='ru'?icon.dataset.titleRu:icon.dataset.titleEn, icon.dataset.icon); });
    let lastTap = 0;
    icon.addEventListener('touchend', (e) => {
        let currentTime = new Date().getTime(); let tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0 && icon.style.display !== 'none') { e.preventDefault(); window.openOSWindow(icon.dataset.id, currentLang==='ru'?icon.dataset.titleRu:icon.dataset.titleEn, icon.dataset.icon); }
        lastTap = currentTime;
    });
    icon.addEventListener('pointerdown', function(e) {
        if (icon.style.display === 'none') return;
        if (icon.id === 'icon-win-trash' || icon.id === 'icon-win-explorer' || icon.id === 'icon-win-store') {
            let initialTop = icon.offsetTop, initialLeft = icon.offsetLeft;
            setTimeout(() => { if(icon.offsetTop === initialTop && icon.offsetLeft === initialLeft && icon.style.display !== 'none') window.openOSWindow(icon.dataset.id, currentLang==='ru'?icon.dataset.titleRu:icon.dataset.titleEn, icon.dataset.icon); }, 200);
        }
        icon.style.zIndex = "5000";
        let shiftX = e.clientX - icon.getBoundingClientRect().left;
        let shiftY = e.clientY - icon.getBoundingClientRect().top;
        let oldTop = icon.style.top, oldLeft = icon.style.left;
        function moveAt(pageX, pageY) {
            let container = document.getElementById('desktopIconsContainer').getBoundingClientRect();
            let x = pageX - container.left - shiftX; let y = pageY - container.top - shiftY;
            icon.style.left = x + 'px'; icon.style.top = y + 'px';
        }
        function onPointerMove(ev) { moveAt(ev.clientX, ev.clientY); }
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', function onUp(ev) {
            icon.style.zIndex = "auto";
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onUp);
            let curX = icon.offsetLeft, curY = icon.offsetTop;
            let snap = window.snapToGrid(curX, curY);
            const trashIcon = document.getElementById('icon-win-trash');
            if (icon.id !== 'icon-win-trash' && icon.id !== 'icon-win-explorer' && icon.id !== 'icon-win-store' && trashIcon && snap.x === trashIcon.offsetLeft && snap.y === trashIcon.offsetTop) {
                icon.style.display = 'none';
                window.closeOSWindow(icon.dataset.id);
                trashedApps[icon.id] = { ru: icon.dataset.titleRu, en: icon.dataset.titleEn };
                localStorage.setItem('kpr_trashed_apps', JSON.stringify(trashedApps));
                renderTrashList();
                renderExplorerList();
                if(window.renderStoreList) window.renderStoreList();
                icon.style.left = oldLeft; icon.style.top = oldTop;
                return;
            }
            let overlap = false;
            document.querySelectorAll('.icon').forEach(other => {
                if (other !== icon && other.style.display !== 'none' && other.offsetLeft === snap.x && other.offsetTop === snap.y) overlap = true;
            });
            if (overlap) { icon.style.left = oldLeft; icon.style.top = oldTop; return; }
            icon.style.left = snap.x + 'px'; icon.style.top = snap.y + 'px';
            try {
                let positions = JSON.parse(localStorage.getItem('kpr_icon_positions')) || {};
                positions[icon.id] = { left: icon.style.left, top: icon.style.top };
                localStorage.setItem('kpr_icon_positions', JSON.stringify(positions));
            } catch(err) {}
        });
    });
});

document.querySelectorAll('.os-window').forEach(win => {
    win.querySelector('.window-header').addEventListener('pointerdown', function(e) {
        if (e.target.classList.contains('window-btn')) return;
        win.style.zIndex = ++window.osZIndex;
        let shiftX = e.clientX - win.getBoundingClientRect().left;
        let shiftY = e.clientY - win.getBoundingClientRect().top;
        function moveAt(pageX, pageY) {
            let top = pageY - shiftY; if (top < 0) top = 0;
            win.style.left = (pageX - shiftX) + 'px'; win.style.top = top + 'px';
        }
        function onPointerMove(e) { moveAt(e.clientX, e.clientY); }
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', function onUp() { document.removeEventListener('pointermove', onPointerMove); document.removeEventListener('pointerup', onUp); });
    });
});
