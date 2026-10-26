window.generateDesktopIcons = function() {
    const container = document.getElementById('desktopIconsContainer');
    if (!container) return;
    container.innerHTML = '';

    const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
    const installedApps = JSON.parse(localStorage.getItem('kpr_installed_apps')) || {};
    const savedPositions = JSON.parse(localStorage.getItem('kpr_icon_positions')) || {};
    const localTrash = typeof trashedApps !== 'undefined' ? trashedApps : {};

    const allIcons = [
        { id: 'icon-win-explorer', target: 'win-explorer', ru: 'Проводник', en: 'Explorer', pic: '📁', core: true },
        { id: 'icon-win-store', target: 'win-store', ru: 'Магазин', en: 'Store', pic: '🛒', core: true },
        { id: 'icon-win-trash', target: 'win-trash', ru: 'Корзина', en: 'Trash', pic: '🗑️', core: true },
        { id: 'icon-win-msg', target: 'win-msg', ru: 'KPR-Связь', en: 'KPR-Chat', pic: '📟' },
        { id: 'icon-win-search', target: 'win-search', ru: 'Поисковик', en: 'Search', pic: '🌐' },
        { id: 'icon-win-bsod', target: 'win-bsod', ru: 'Экран Смерти', en: 'BSOD Screen', pic: '💀' },
        { id: 'icon-win-dino', target: 'win-dino', ru: 'Динозавр', en: 'Dino', pic: '🦖' },
        { id: 'icon-win-blocks', target: 'win-blocks', ru: 'Блок Бласт', en: 'Block Blast', pic: '🧱' },
        { id: 'icon-win-tetris', target: 'win-tetris', ru: 'Тетрис', en: 'Tetris', pic: '🕹️' },
        { id: 'icon-win-sudoku', target: 'win-sudoku', ru: 'Судоку', en: 'Sudoku', pic: '🔢' },
        { id: 'icon-win-memory', target: 'win-memory', ru: 'Память', en: 'Memory', pic: '🧠' },
        { id: 'icon-win-tower', target: 'win-tower', ru: 'Башня', en: 'Tower', pic: '🏢' },
        { id: 'icon-win-words', target: 'win-words', ru: 'Угадай слово', en: 'Guess Word', pic: '🔤' },
        { id: 'icon-win-hangman', target: 'win-hangman', ru: 'Виселица', en: 'Hangman', pic: '🪵' }
    ];

    allIcons.forEach(iconData => {
        if (localTrash[iconData.id]) return;
        if (!iconData.core && !installedApps[iconData.id]) return;

        const iconEl = document.createElement('div');
        iconEl.id = iconData.id;
        iconEl.className = 'icon';
        iconEl.setAttribute('data-id', iconData.target);
        iconEl.setAttribute('data-title-ru', iconData.ru);
        iconEl.setAttribute('data-title-en', iconData.en);
        iconEl.setAttribute('data-icon', iconData.pic);

        iconEl.innerHTML = `
            <div class="icon-pic">${iconData.pic}</div>
            <div class="icon-name">${isRu ? iconData.ru : iconData.en}</div>
        `;

        if (savedPositions[iconData.id]) {
            iconEl.style.left = savedPositions[iconData.id].left;
            iconEl.style.top = savedPositions[iconData.id].top;
        } else if (window.getFirstAvailableSlot) {
            const slot = window.getFirstAvailableSlot();
            iconEl.style.left = slot.left;
            iconEl.style.top = slot.top;
            savedPositions[iconData.id] = { left: slot.left, top: slot.top };
        }

        container.appendChild(iconEl);
    });

    localStorage.setItem('kpr_icon_positions', JSON.stringify(savedPositions));
};

window.updateDesktopIconsLanguage = function() {
    const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
    document.querySelectorAll('.icon').forEach(icon => {
        const nameNode = icon.querySelector('.icon-name');
        if (nameNode) {
            const ruText = icon.getAttribute('data-title-ru');
            const enText = icon.getAttribute('data-title-en');
            nameNode.innerText = isRu ? ruText : enText;
        }
    });
};
