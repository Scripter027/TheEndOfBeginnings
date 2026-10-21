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
    if (!window.openWindowsTrack[id]) { window.openWindowsTrack[id] = iconStr || '📦'; renderTaskbarApps(); }
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
    const trashBody = document.getElementById('win-trash-body');
    const searchBody = document.getElementById('search-browser-body');
    if (currentLang === 'ru') {
        if(trashBody) trashBody.innerText = "Здесь абсолютно пусто. Файлы стёрты из реальности.";
        if(searchBody) searchBody.innerHTML = "<strong>Ошибка 404:</strong> Нет связи с внешним шлюзом.";
    } else {
        if(trashBody) trashBody.innerText = "It is absolutely empty here. Files are erased from reality.";
        if(searchBody) searchBody.innerHTML = "<strong>Error 404:</strong> No connection to the external gateway.";
    }
}
window.advanceNestedFolder = function(step) {
    const body = document.getElementById('nestedFolderBody');
    if (step === 1) body.innerHTML = '<span class="nested-folder-link" onclick="advanceNestedFolder(2)">📁 ТЫ ИЗДЕВАЕШЬСЯ</span>';
    else if (step === 2) body.innerHTML = '<span class="nested-folder-link" onclick="advanceNestedFolder(3)">📁 НЕ ОТКРЫВАЙ СКАЗАЛ</span>';
    else if (step === 3) body.innerHTML = '<span class="nested-folder-link" onclick="advanceNestedFolder(4)">📁 ЛАДНО</span>';
    else if (step === 4) body.innerHTML = '<span class="nested-folder-link" onclick="advanceNestedFolder(5)">📁 СМОТРИ РАЗ ХОЧЕШЬ</span>';
    else if (step === 5) body.innerHTML = '<p style="color:var(--bright-green)">[Здесь абсолютно пусто...]</p>';
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
        item.innerHTML = `<span>${trashedApps[id]}</span><button class="trash-btn" onclick="restoreApp('${id}')">Вернуть</button>`;
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
    renderTrashList();
};
document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('dblclick', () => { if(icon.style.display !== 'none') window.openOSWindow(icon.dataset.id, icon.dataset.title, icon.dataset.icon); });
    let lastTap = 0;
    icon.addEventListener('touchend', (e) => {
        let currentTime = new Date().getTime(); let tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0 && icon.style.display !== 'none') { e.preventDefault(); window.openOSWindow(icon.dataset.id, icon.dataset.title, icon.dataset.icon); }
        lastTap = currentTime;
    });
    icon.addEventListener('pointerdown', function(e) {
        if (icon.id === 'icon-win-trash') {
            let initialTop = icon.offsetTop, initialLeft = icon.offsetLeft;
            setTimeout(() => { if(icon.offsetTop === initialTop && icon.offsetLeft === initialLeft) window.openOSWindow('win-trash', 'Корзина', '🗑️'); }, 200);
        }
        icon.style.zIndex = "5000";
        let shiftX = e.clientX - icon.getBoundingClientRect().left;
        let shiftY = e.clientY - icon.getBoundingClientRect().top;
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
            let curX = icon.offsetLeft; let curY = icon.offsetTop;
            let snapX = Math.round(curX / GRID_X) * GRID_X;
            let snapY = Math.round(curY / GRID_Y) * GRID_Y;
            icon.style.left = snapX + 'px'; icon.style.top = snapY + 'px';
            const trashIcon = document.getElementById('icon-win-trash');
            if (icon.id !== 'icon-win-trash' && trashIcon) {
                let tRect = trashIcon.getBoundingClientRect();
                if (ev.clientX >= tRect.left && ev.clientX <= tRect.right && ev.clientY >= tRect.top && ev.clientY <= tRect.bottom) {
                    icon.style.display = 'none';
                    trashedApps[icon.id] = icon.dataset.title;
                    renderTrashList();
                }
            }
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
