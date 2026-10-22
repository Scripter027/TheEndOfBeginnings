window.initKeeperStore = function() {
    const listEl = document.getElementById('storeListContainer');
    if (listEl) listEl.innerHTML = '';
    updateStoreTexts();
};

function updateStoreTexts() {
    const isRu = (currentLang === 'ru');
    const head = document.getElementById('head-store');
    if (head) head.innerText = isRu ? "KEEPER STORE" : "KEEPER STORE";
    renderStoreList();
}

function renderStoreList() {
    const container = document.getElementById('storeListContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const isRu = (currentLang === 'ru');
    const storeApps = [
        { id: 'icon-win-msg', ru: 'KPR-Связь', en: 'KPR-Chat', icon: '📟', winId: 'win-msg' },
        { id: 'icon-win-search', ru: 'Поисковик', en: 'Search', icon: '🌐', winId: 'win-search' },
        { id: 'icon-win-dino', ru: 'Динозавр', en: 'Dino', icon: '🦖', winId: 'win-dino' },
        { id: 'icon-win-blocks', ru: 'Блок Бласт', en: 'Block Blast', icon: '🧱', winId: 'win-blocks' }
    ];

    storeApps.forEach(app => {
        const item = document.createElement('div');
        item.className = 'explorer-item';
        
        const displayTitle = isRu ? app.ru : app.en;
        const iconEl = document.getElementById(app.id);
        const isInstalled = iconEl && iconEl.style.display !== 'none' && !trashedApps[app.id];
        
        let btnText = '';
        if (isInstalled) {
            btnText = isRu ? 'Удалить' : 'Uninstall';
        } else {
            btnText = isRu ? 'Скачать' : 'Install';
        }

        item.innerHTML = `
            <div class="explorer-item-left">
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

    if (isInstalled) {
        icon.style.display = 'none';
        window.closeOSWindow(icon.dataset.id);
        trashedApps[id] = { ru: icon.dataset.titleRu, en: icon.dataset.titleEn };
        localStorage.setItem('kpr_trashed_apps', JSON.stringify(trashedApps));
    } else {
        const slot = window.getFirstAvailableSlot ? window.getFirstAvailableSlot() : { left: '20px', top: '20px' };
        icon.style.left = slot.left;
        icon.style.top = slot.top;
        icon.style.display = 'flex';
        
        let positions = JSON.parse(localStorage.getItem('kpr_icon_positions')) || {};
        positions[id] = { left: slot.left, top: slot.top };
        localStorage.setItem('kpr_icon_positions', JSON.stringify(positions));
        
        if (trashedApps[id]) {
            delete trashedApps[id];
            localStorage.setItem('kpr_trashed_apps', JSON.stringify(trashedApps));
        }
    }

    if (window.updateDesktopTexts) window.updateDesktopTexts();
    renderStoreList();
};
