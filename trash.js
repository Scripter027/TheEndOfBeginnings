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

window.renderTrashList = function() {
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
};
