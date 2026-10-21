window.osZIndex = 3000;
window.openWindowsTrack = {};
let desktopLangClicks = 0;
let trashedApps = {};
const GRID_X = 100;
const GRID_Y = 90;

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
    document.getElementById('label-win-msg').innerText = isRu ? "KPR-Связь" : "KPR-Chat";
    document.getElementById('label-win-search').innerText = isRu ? "Поисковик" : "Search";
    document.getElementById('label-win-dino').innerText = isRu ? "Динозавр" : "Dino";
    document.getElementById('label-win-blocks').innerText = isRu ? "Блок Бласт" : "Block Blast";
    document.getElementById('label-win-dontopen').innerText = isRu ? "НЕ ОТКРЫВАТЬ" : "DO NOT OPEN";
    document.getElementById('label-win-bsod').innerText = isRu ? "Экран Смерти" : "BSOD Screen";
    
    document.getElementById('head-trash').innerText = isRu ? "КОРЗИНА" : "TRASH";
    document.getElementById('head-zip').innerText = isRu ? "АРХИВАТОР - SECRET.ZIP" : "ARCHIVER - SECRET.ZIP";
    document.getElementById('head-zip2').innerText = isRu ? "АРХИВАТОР - SECRET1.ZIP" : "ARCHIVER - SECRET1.ZIP";
    document.getElementById('head-zip3').innerText = isRu ? "АРХИВАТОР - SECRET2.ZIP" : "ARCHIVER - SECRET2.ZIP";
    document.getElementById('head-dontopen').innerText = isRu ? "НЕ ОТКРЫВАТЬ" : "DO NOT OPEN";
    document.getElementById('head-msg').innerText = isRu ? "МЕССЕНДЖЕР v1.02" : "MESSENGER v1.02";
    document.getElementById('head-search').innerText = isRu ? "БРАУЗЕР 'ПРИЗРАК'" : "BROWSER 'GHOST'";
    document.getElementById('head-dino').innerText = isRu ? "DINO_RUN.EXE" : "DINO_RUN.EXE";
    document.getElementById('head-blocks').innerText = isRu ? "BLOCK_BLAST.EXE" : "BLOCK_BLAST.EXE";

    const trashBody = document.getElementById('win-trash-body');
    const searchBody = document.getElementById('search-browser-body');
    const zip1Body = document.getElementById('win-zip2-body');
    const zip2Body = document.getElementById('win-zip3-body');
    const txtZipLocked = document.getElementById('txt-zip-locked');
    const dinoHint = document.getElementById('dino-hint');
    const bbMsg = document.getElementById('bb-msg');
    
    if (isRu) {
        if(searchBody) searchBody.innerHTML = "<strong>Ошибка 404:</strong> Нет связи с внешним шлюзом. Локальный прокси-сервер KPR-GATEWAY не отвечает.";
        if(zip1Body) zip1Body.innerHTML = "<p>Локальные метаданные KPR-OS.</p><p style='color:var(--bright-green);margin-top:10px;'>Статус: Архив поврежден временным сдвигом.</p>";
        if(zip2Body) zip2Body.innerHTML = "<p>Манифест: 'Новая Эра близко. Подготовьте терминальные ключи шлюза.'</p>";
        if(txtZipLocked) txtZipLocked.innerText = "Файл зашифрован ключом AES-256.";
        if(dinoHint && dinoHint.innerText.indexOf('ПЕРЕЗАПУСК') === -1) dinoHint.innerText = "Нажми ПРОБЕЛ / Кликни мышь для прыжка и старта";
        if(bbMsg && bbMsg.innerText.indexOf('СНАЧАЛА') === -1) bbMsg.innerText = "Зажми фигуру и тащи её на доску";
    } else {
        if(searchBody) searchBody.innerHTML = "<strong>Error 404:</strong> No connection to the external gateway. Local proxy server KPR-GATEWAY is not responding.";
        if(zip1Body) zip1Body.innerHTML = "<p>Local KPR-OS metadata.</p><p style='color:var(--bright-green);margin-top:10px;'>Status: Archive damaged by time shift.</p>";
        if(zip2Body) zip2Body.innerHTML = "<p>Manifest: 'A New Era is close. Prepare terminal gateway keys.'</p>";
        if(txtZipLocked) txtZipLocked.innerText = "The file is encrypted with an AES-256 key.";
        if(dinoHint && dinoHint.innerText.indexOf('RESTART') === -1) dinoHint.innerText = "Press SPACE / Click mouse to jump and start";
        if(bbMsg && bbMsg.innerText.indexOf('RESTART') === -1) bbMsg.innerText = "Hold piece and drag it onto the board";
    }
    renderTrashList();
}
window.advanceNestedFolder = function(step) {
    const body = document.getElementById('nestedFolderBody');
    const isRu = (currentLang === 'ru');
    if (step === 1) body.innerHTML = `<span class="nested-folder-link" onclick="advanceNestedFolder(2)">📁 \${isRu?'ТЫ ИЗДЕВАЕШЬСЯ':'ARE YOU KIDDING ME'}</span>`;
    else if (step === 2) body.innerHTML = `<span class="nested-folder-link" onclick="advanceNestedFolder(3)">📁 \${isRu?'НЕ ОТКРЫВАЙ СКАЗАЛ':'I SAID DO NOT OPEN'}</span>`;
    else if (step === 3) body.innerHTML = `<span class="nested-folder-link" onclick="advanceNestedFolder(4)">📁 \${isRu?'ЛАДНО':'FINE'}</span>`;
    else if (step === 4) body.innerHTML = `<span class="nested-folder-link" onclick="advanceNestedFolder(5)">📁 \${isRu?'СМОТРИ РАЗ ХОЧЕШЬ':'LOOK IF YOU WANT'}</span>`;
    else if (step === 5) body.innerHTML = `<p style="color:var(--bright-green)">\${isRu?'[Здесь абсолютно пусто...]':'[It is absolutely empty here...]'}</p>';
};

window.emptyTrash = function() {
    trashedApps = {};
    renderTrashList();
};

window.restoreApp = function(id) {
    const icon = document.getElementById(id);
    if (icon) {
        icon.style.display = 'flex';
        delete trashedApps[id];
        renderTrashList();
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

window.activateDesktopMode = function() {
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('boot-screen').style.display = 'none';
    document.getElementById('desktop-env').style.display = 'block';
    if (window.initDinoGame) window.initDinoGame();
    if (window.initBlockBlast) window.initBlockBlast();
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
        if (icon.id === 'icon-win-trash') {
            let initialTop = icon.offsetTop, initialLeft = icon.offsetLeft;
            setTimeout(() => { if(icon.offsetTop === initialTop && icon.offsetLeft === initialLeft && icon.style.display !== 'none') window.openOSWindow('win-trash', currentLang==='ru'?'Корзина':'Trash', '🗑️'); }, 200);
        }
        icon.style.zIndex = "5000";
        icon.style.borderStyle = "solid";
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
            icon.style.borderStyle = "dashed";
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onUp);
            
            let curX = icon.offsetLeft, curY = icon.offsetTop;
            let snapX = Math.round(curX / GRID_X) * GRID_X;
            let snapY = Math.round(curY / GRID_Y) * GRID_Y;
            
            const trashIcon = document.getElementById('icon-win-trash');
            if (icon.id !== 'icon-win-trash' && trashIcon && snapX === trashIcon.offsetLeft && snapY === trashIcon.offsetTop) {
                icon.style.display = 'none';
                trashedApps[icon.id] = { ru: icon.dataset.titleRu, en: icon.dataset.titleEn };
                renderTrashList();
                icon.style.left = oldLeft; icon.style.top = oldTop;
                return;
            }
            
            let overlap = false;
            document.querySelectorAll('.icon').forEach(other => {
                if (other !== icon && other.style.display !== 'none' && other.offsetLeft === snapX && other.offsetTop === snapY) overlap = true;
            });
            
            if (overlap) {
                icon.style.left = oldLeft; icon.style.top = oldTop;
                return;
            }
            
            icon.style.left = snapX + 'px'; icon.style.top = snapY + 'px';
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

function updateTaskbarTimer() {
    const distance = targetDate - new Date().getTime();
    const tbLabel = document.getElementById('taskbar-timer');
    if (!tbLabel) return;
    if (distance < 0) { tbLabel.innerHTML = "00:00:00:00"; return; }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24)), hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), seconds = Math.floor((distance % (1000 * 60)) / 1000);
    tbLabel.innerHTML = `${days < 10 ? '0' + days : days}:${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}
setInterval(updateTaskbarTimer, 1000);
