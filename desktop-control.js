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
    document.getElementById('label-win-explorer').innerText = isRu ? "Проводник" : "Explorer";
    document.getElementById('label-win-msg').innerText = isRu ? "KPR-Связь" : "KPR-Chat";
    document.getElementById('label-win-search').innerText = isRu ? "Поисковик" : "Search";
    document.getElementById('label-win-dino').innerText = isRu ? "Динозавр" : "Dino";
    document.getElementById('label-win-blocks').innerText = isRu ? "Блок Бласт" : "Block Blast";
    document.getElementById('label-win-dontopen').innerText = isRu ? "НЕ ОТКРЫВАТЬ" : "DO NOT OPEN";
    document.getElementById('label-win-bsod').innerText = isRu ? "Экран Смерти" : "BSOD Screen";
    document.getElementById('head-trash').innerText = isRu ? "КОРЗИНА" : "TRASH";
    document.getElementById('head-explorer').innerText = isRu ? "ПРОВОДНИК" : "EXPLORER";
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
    if(window.renderMessengerUsers) window.renderMessengerUsers();
}
