function renderStoreList() {
    const container = document.getElementById('storeListContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
    const localTrash = typeof trashedApps !== 'undefined' ? trashedApps : {};
    
    const storeApps = [
        { id: 'icon-win-msg', ru: 'KPR-Связь', en: 'KPR-Chat', icon: '📟', type: 'apps' },
        { id: 'icon-win-search', ru: 'Поисковик', en: 'Search', icon: '🌐', type: 'apps' },
        { id: 'icon-win-bsod', ru: 'Экран Смерти', en: 'BSOD Screen', icon: '💀', type: 'apps' },
        { id: 'icon-win-dino', ru: 'Динозавр', en: 'Dino', icon: '🦖', type: 'games' },
        { id: 'icon-win-blocks', ru: 'Блок Бласт', en: 'Block Blast', icon: '🧱', type: 'games' },
        { id: 'icon-win-tetris', ru: 'Тетрис', en: 'Tetris', icon: '🕹️', type: 'games' }
    ];

    storeApps.forEach(app => {
        if (app.type !== window.activeStoreTab) return;

        const item = document.createElement('div');
        item.className = 'store-item';
        
        const displayTitle = isRu ? app.ru : app.en;
        const iconEl = document.getElementById(app.id);
        const isInstalled = iconEl && iconEl.style.display !== 'none' && !localTrash[app.id];
        
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
