window.currentExplorerTab = 'apps';
window.switchExplorerTab = function(tabId) {
    window.currentExplorerTab = tabId;
    window.renderExplorerList();
};

window.renderExplorerList = function() {
    const container = document.getElementById('explorerListContainer');
    if (!container) return;
    container.innerHTML = '';
    const icons = document.querySelectorAll('.icon');
    const isRu = (currentLang === 'ru');
    const appTypes = {
        apps: ['icon-win-msg', 'icon-win-search', 'icon-win-bsod'],
        games: ['icon-win-dino', 'icon-win-blocks', 'icon-win-tetris', 'icon-win-sudoku'],
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
};
