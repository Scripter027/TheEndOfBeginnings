window.activeStoreTab = 'apps';

window.initKeeperStore = function() {
    renderStoreLayout();
    updateStoreTexts();
};

function renderStoreLayout() {
    const win = document.getElementById('win-store');
    if (!win) return;
    let body = win.querySelector('.window-body');
    if (!body || body.querySelector('.store-tab-container')) return;
    body.style.padding = '0';
    body.innerHTML = `
        <div id="storeListContainer" style="height: calc(100% - 40px); overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 6px;"></div>
        <div class="store-tab-container" style="height: 40px; border-top: 2px solid #55ff55; display: flex; background: rgba(0,0,0,0.85);">
            <button id="store-tab-apps" onclick="switchStoreTab('apps')" style="flex:1; background:transparent; border:none; color:#55ff55; font-weight:bold; font-size:11px; cursor:pointer;">APPS</button>
            <button id="store-tab-games" onclick="switchStoreTab('games')" style="flex:1; background:transparent; border-left: 2px solid #55ff55; border-top:none; border-right:none; border-bottom:none; color:#55ff55; font-weight:bold; font-size:11px; cursor:pointer;">GAMES</button>
        </div>
    `;
}

window.switchStoreTab = function(tabId) {
    window.activeStoreTab = tabId;
    const btnApps = document.getElementById('store-tab-apps');
    const btnGames = document.getElementById('store-tab-games');
    if (btnApps && btnGames) {
        btnApps.style.background = tabId === 'apps' ? '#55ff55' : 'transparent';
        btnApps.style.color = tabId === 'apps' ? '#000000' : '#55ff55';
        btnGames.style.background = tabId === 'games' ? '#55ff55' : 'transparent';
        btnGames.style.color = tabId === 'games' ? '#000000' : '#55ff55';
    }
    renderStoreList();
};

function updateStoreTexts() {
    const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
    const head = document.getElementById('head-store');
    if (head) head.innerText = isRu ? "KEEPER STORE" : "KEEPER STORE";
    const btnApps = document.getElementById('store-tab-apps');
    const btnGames = document.getElementById('store-tab-games');
    if (btnApps) btnApps.innerText = isRu ? "ПРИЛОЖЕНИЯ" : "APPS";
    if (btnGames) btnGames.innerText = isRu ? "ИГРЫ" : "GAMES";
    window.switchStoreTab(window.activeStoreTab);
}

function renderStoreList() {
    const container = document.getElementById('storeListContainer');
    if (!container) return;
    container.innerHTML = '';
    const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
    const localTrash = typeof trashedApps !== 'undefined' ? trashedApps : {};
    const installedApps = JSON.parse(localStorage.getItem('kpr_installed_apps')) || {};
    const storeApps = [
        { id: 'icon-win-msg', ru: 'KPR-Связь', en: 'KPR-Chat', icon: '📟', type: 'apps', defaultInstalled: true },
        { id: 'icon-win-search', ru: 'Поисковик', en: 'Search', icon: '🌐', type: 'apps', defaultInstalled: true },
        { id: 'icon-win-bsod', ru: 'Экран Смерти', en: 'BSOD Screen', icon: '💀', type: 'apps', defaultInstalled: true },
        { id: 'icon-win-dino', ru: 'Динозавр', en: 'Dino', icon: '🦖', type: 'games', defaultInstalled: true },
        { id: 'icon-win-blocks', ru: 'Блок Бласт', en: 'Block Blast', icon: '🧱', type: 'games', defaultInstalled: true },
        { id: 'icon-win-tetris', ru: 'Тетрис', en: 'Tetris', icon: '🕹️', type: 'games', defaultInstalled: false }
    ];
    storeApps.forEach(app => {
        if (app.type !== window.activeStoreTab) return;
        const item = document.createElement('div');
        item.className = 'store-item';
        const displayTitle = isRu ? app.ru : app.en;
        const iconEl = document.getElementById(app.id);
        
        let isInstalled = app.defaultInstalled;
        if (app.id === 'icon-win-tetris') {
            isInstalled = !!installedApps[app.id];
        } else if (iconEl && (iconEl.style.display === 'none' || localTrash[app.id])) {
            isInstalled = false;
        }

        let btnText = isInstalled ? (isRu ? 'Удалить' : 'Uninstall') : (isRu ? 'Скачать' : 'Install');
        item.innerHTML = `
            <div class="store-item-left" style="display:flex; align-items:center; gap:8px;">
                <span>${app.icon}</span>
                <span>${displayTitle}</span>
            </div>
            <button class="explorer-btn" onclick="toggleAppInstallation('${app.id}', ${isInstalled})">${btnText}</button>
        `;
        container.appendChild(item);
    });
}

window.toggleAppInstallation = function(id, isInstalled) {
    const icon = document.getElementById(id);
    if (!icon) return;
    if (typeof trashedApps === 'undefined') window.trashedApps = {};
    const installedApps = JSON.parse(localStorage.getItem('kpr_installed_apps')) || {};

    if (isInstalled) {
        icon.style.display = 'none';
        if (icon.dataset && icon.dataset.id) {
            window.closeOSWindow(icon.dataset.id);
        }
        trashedApps[id] = { ru: icon.dataset.titleRu || '', en: icon.dataset.titleEn || '' };
        localStorage.setItem('kpr_trashed_apps', JSON.stringify(trashedApps));
        if (id === 'icon-win-tetris') {
            delete installedApps[id];
            localStorage.setItem('kpr_installed_apps', JSON.stringify(installedApps));
        }
    } else {
        const slot = window.getFirstAvailableSlot ? window.getFirstAvailableSlot() : { left: '20px', top: '20px' };
        icon.style.left = slot.left; 
        icon.style.top = slot.top; 
        icon.style.display = 'flex';
        let positions = JSON.parse(localStorage.getItem('kpr_icon_positions')) || {};
        positions[id] = { left: slot.left, top: slot.top };
        localStorage.setItem('kpr_icon_positions', JSON.stringify(positions));
        if (id === 'icon-win-tetris') {
            installedApps[id] = true;
            localStorage.setItem('kpr_installed_apps', JSON.stringify(installedApps));
        }
        if (trashedApps[id]) { 
            delete trashedApps[id]; 
            localStorage.setItem('kpr_trashed_apps', JSON.stringify(trashedApps)); 
        }
    }
    if (window.updateDesktopTexts) window.updateDesktopTexts();
    renderStoreList();
};
