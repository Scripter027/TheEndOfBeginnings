(function generateDesktopIcons() {
    const container = document.getElementById('desktopIconsContainer');
    if (!container) return;

    const iconsData = [
        { id: 'icon-win-trash', dataId: 'win-trash', ru: 'Корзина', en: 'Trash', icon: '🗑️' },
        { id: 'icon-win-explorer', dataId: 'win-explorer', ru: 'Проводник', en: 'Explorer', icon: '🗁' },
        { id: 'icon-win-store', dataId: 'win-store', ru: 'Магазин', en: 'Store', icon: '🏪' },
        { id: 'icon-win-msg', dataId: 'win-msg', ru: 'KPR-Связь', en: 'KPR-Chat', icon: '📟' },
        { id: 'icon-win-search', dataId: 'win-search', ru: 'Поисковик', en: 'Search', icon: '🌐' },
        { id: 'icon-win-dino', dataId: 'win-dino', ru: 'Динозавр', en: 'Dino', icon: '🦖' },
        { id: 'icon-win-blocks', dataId: 'win-blocks', ru: 'Блок Бласт', en: 'Block Blast', icon: '🧱' },
        { id: 'icon-win-tetris', dataId: 'win-tetris', ru: 'Тетрис', en: 'Tetris', icon: '🕹️' },
        { id: 'icon-win-sudoku', dataId: 'win-sudoku', ru: 'Судоку', en: 'Sudoku', icon: '🔢' },
        { id: 'icon-win-memory', dataId: 'win-memory', ru: 'Память', en: 'Memory', icon: '🧠' },
        { id: 'icon-win-tower', dataId: 'win-tower', ru: 'Башня', en: 'Tower', icon: '🏢' },
        { id: 'icon-win-zip', dataId: 'win-zip', ru: 'secret.zip', en: 'secret.zip', icon: '📦' },
        { id: 'icon-win-zip2', dataId: 'win-zip2', ru: 'secret1.zip', en: 'secret1.zip', icon: '📦' },
        { id: 'icon-win-zip3', dataId: 'win-zip3', ru: 'secret2.zip', en: 'secret2.zip', icon: '📦' },
        { id: 'icon-win-dontopen', dataId: 'win-dontopen', ru: 'НЕ ОТКРЫВАТЬ', en: 'DO NOT OPEN', icon: '📁' },
        { id: 'icon-win-bsod', dataId: 'win-bsod', ru: 'Экран Смерти', en: 'BSOD Screen', icon: '💀' },
        { id: 'icon-win-words', dataId: 'win-words', ru: 'Слова', en: 'Words', icon: '🔤' },
        { id: 'icon-win-hangman', dataId: 'win-hangman', ru: 'Виселица', en: 'Hangman', icon: '🪵' }
    ];

    container.innerHTML = '';
    iconsData.forEach(data => {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        iconDiv.id = data.id;
        iconDiv.setAttribute('data-id', data.dataId);
        iconDiv.setAttribute('data-title-ru', data.ru);
        iconDiv.setAttribute('data-title-en', data.en);
        iconDiv.setAttribute('data-icon', data.icon);

        iconDiv.innerHTML = `
            <div class="icon-pic">${data.icon}</div>
            <div class="icon-name" id="label-${data.dataId}">${data.ru}</div>
        `;
        container.appendChild(iconDiv);
    });
})();
