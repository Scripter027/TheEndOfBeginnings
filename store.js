window.initKeeperStore = function() {
    window.renderStoreList();
};

window.renderStoreList = function() {
    const win = document.getElementById('win-store');
    if (!win) return;
    const body = win.querySelector('.window-body');
    if (!body) return;

    body.innerHTML = '';
    const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
    const installedApps = JSON.parse(localStorage.getItem('kpr_installed_apps')) || {};
    const localTrash = typeof trashedApps !== 'undefined' ? trashedApps : {};

    const storeItems = [
        { id: 'icon-win-tetris', target: 'win-tetris', ru: 'ТЕТРИС', en: 'TETRIS', pic: '🕹️' },
        { id: 'icon-win-sudoku', target: 'win-sudoku', ru: 'СУДОКУ', en: 'SUDOKU', pic: '🔢' },
        { id: 'icon-win-memory', target: 'win-memory', ru: 'ПАМЯТЬ', en: 'MEMORY', pic: '🧠' },
        { id: 'icon-win-tower', target: 'win-tower', ru: 'БАШНЯ', en: 'TOWER', pic: '🏢' },
        { id: 'icon-win-words', target: 'win-words', ru: 'СЛОВА', en: 'WORDS', pic: '🔤' },
        { id: 'icon-win-hangman', target: 'win-hangman', ru: 'ВИСЕЛИЦА', en: 'HANGMAN', pic: '🪵' }
    ];

    let hasAvailable = false;
    storeItems.forEach(item => {
        if (installedApps[item.id] || localTrash[item.id]) return;
        hasAvailable = true;

        const row = document.createElement('div');
        row.className = 'store-item';
        
        const title = isRu ? item.ru : item.en;
        row.innerHTML = `
            <span>${item.pic} ${title}</span>
            <button class="explorer-btn" data-app-id="${item.id}">${isRu ? 'СКАЧАТЬ' : 'DOWNLOAD'}</button>
        `;

        row.querySelector('.explorer-btn').addEventListener('click', function() {
            window.installApp(this.getAttribute('data-app-id'));
        });

        body.appendChild(row);
    });

    if (!hasAvailable) {
        body.innerHTML = `<div style="text-align:center; padding-top:20px; opacity:0.6;">${isRu ? 'ВСЕ ПРИЛОЖЕНИЯ УСТАНОВЛЕНЫ' : 'ALL APPS INSTALLED'}</div>`;
    }
};

window.installApp = function(id) {
    let installedApps = JSON.parse(localStorage.getItem('kpr_installed_apps')) || {};
    installedApps[id] = true;
    localStorage.setItem('kpr_installed_apps', JSON.stringify(installedApps));
    
    if (window.generateDesktopIcons) window.generateDesktopIcons();
    if (window.renderStoreList) window.renderStoreList();
    if (window.renderExplorerList) window.renderExplorerList();
};

window.advanceNestedFolder = function(step) {
    const body = document.getElementById('nestedFolderBody');
    if (!body) return;
    const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
    
    if (step === 0) {
        body.innerHTML = `<div style="padding-left: 8px; border-left: 2px dashed #55ff55; margin-top: 6px;"><span class="nested-folder-link" onclick="window.advanceNestedFolder(1)">📁 АРХИВ_СТАРЫЙ</span></div>`;
    } else if (step === 1) {
        body.innerHTML = `<div style="padding-left: 8px; border-left: 2px dashed #55ff55; margin-top: 6px;"><span class="nested-folder-link" onclick="window.openOSWindow('win-zip', 'SECRET.ZIP', '📦')">📄 SECRET.ZIP</span></div>`;
    }
};

window.checkZipPassword = function(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    const input = win.querySelector('.zip-input-field');
    if (!input) return;
    
    const pass = input.value.trim();
    const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
    
    if (windowId === 'win-zip' && pass === '246') {
        input.outerHTML = `<div style="color:#55ff55; margin-top:10px;">${isRu ? 'ДОСТУП РАЗРЕШЕН: СЕКРЕТНЫЙ ТЕКСТ 1' : 'ACCESS GRANTED: SECRET TEXT 1'}</div>`;
    } else {
        input.value = '';
        input.placeholder = isRu ? 'НЕВЕРНЫЙ ПАРОЛЬ!' : 'WRONG PASSWORD!';
    }
};
