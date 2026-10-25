(function generateDesktopWindowsPartOne() {
    const container = document.getElementById(
        'desktop-windows-container'
    );
    if (!container) return;
    const templatesOne = [
        { id: 'win-trash', style: 'width: 340px; height: 240px; top: 15%; left: 10px;', headId: 'head-trash', title: 'КОРЗИНА', body: '<div class="trash-controls"><button class="trash-btn" id="btn-trash-clear" onclick="emptyTrash()">Очистить</button></div><div class="trash-list" id="trashListContainer"></div>' },
        { id: 'win-explorer', style: 'width: 360px; height: 300px; top: 10%; left: 40px;', headId: 'head-explorer', title: 'ПРОВОДНИК', body: '<div id="explorerListContainer" style="height:100%; width:100%;"></div>' },
        { id: 'win-store', style: 'width: 360px; height: 320px; top: 15%; left: 60px;', headId: 'head-store', title: 'KEEPER STORE', body: '<div id="storeListContainer" style="height: calc(100% - 40px); overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 6px;"></div><div class="store-tab-container" style="height: 40px; border-top: 2px solid #55ff55; display: flex; background: rgba(0,0,0,0.85);"><button id="store-tab-apps" onclick="switchStoreTab(\'apps\')" style="flex:1; background:transparent; border:none; color:#55ff55; font-weight:bold; font-size:11px; cursor:pointer;">APPS</button><button id="store-tab-games" onclick="switchStoreTab(\'games\')" style="flex:1; background:transparent; border-left: 2px solid #55ff55; border-top:none; border-right:none; border-bottom:none; color:#55ff55; font-weight:bold; font-size:11px; cursor:pointer;">GAMES</button></div>' },
        { id: 'win-settings', style: 'width: 340px; height: 220px; top: 20%; left: 80px;', headId: 'head-settings', title: 'НАСТРОЙКИ', body: '<div style="display:flex; flex-direction:column; justify-content:center; align-items:center; gap:10px; height:100%;"><p id="txt-settings-info" style="font-size:12px; text-align:center; line-height:1.4;"></p><button class="trash-btn" id="btn-reset-all" onclick="window.clearAllOSData()" style="border-color:var(--neon-red); color:var(--neon-red); box-shadow: 0 0 10px rgba(255, 51, 51, 0.4); width:100%; padding:12px; font-weight:bold; margin-top:5px;">СТЕРЕТЬ ДАННЫЕ</button></div>' },
        { id: 'win-tetris', style: 'width: 300px; height: 420px; top: 8%; left: 15px;', headId: 'head-tetris', title: 'TETRIS.EXE', body: '<div style="display:flex; flex-direction:column; align-items:center; justify-content:space-between; overflow:hidden; height:100%; padding:8px;"><div id="tetris-score" style="font-size:14px; font-weight:bold; color:#55ff55; margin-bottom:4px;">СЧЕТ: 0</div><canvas id="tetrisCanvas" style="background:#000; border:2px solid #55ff55; display:block; max-height:200px; aspect-ratio:10/20;"></canvas><div id="tetris-over-box" style="width:100%; min-height:30px; text-align:center; font-weight:bold; margin:4px 0;"></div><div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:4px; width:100%;"><button class="trash-btn" style="padding:6px; font-size:11px;" onclick="controlTetris(\'left\')">◀</button><button class="trash-btn" style="padding:6px; font-size:11px;" onclick="controlTetris(\'rotate\')">🔄</button><button class="trash-btn" style="padding:6px; font-size:11px;" onclick="controlTetris(\'right\')">▶</button><button class="trash-btn" style="padding:6px; font-size:11px; grid-column:span 3;" onclick="controlTetris(\'down\')">▼ СКОРОСТЬ</button></div></div>' },
        { id: 'win-sudoku', style: 'width: 320px; height: 490px; top: 15%; left: 15px;', headId: 'head-sudoku', title: 'SUDOKU.EXE', body: '<div style="display:flex; flex-direction:column; justify-content:space-between; height:100%; padding:8px; overflow:hidden;"><div id="sudoku-score-panel" style="font-size:11px; font-weight:bold; color:#55ff55; display:flex; justify-content:space-between; width:100%; margin-bottom:4px;"><span id="sudoku-current-score">SCORE: 0</span><span id="sudoku-high-score">BEST: 0</span></div><div id="sudokuBoard" style="display:grid; grid-template-columns:repeat(9, 1fr); gap:1px; background:#000000; border:2px solid #55ff55; width:100%; aspect-ratio:1/1; margin-bottom:6px;"></div><div id="sudoku-over-box" style="width:100%; min-height:35px; text-align:center; font-weight:bold; line-height:1.3;"></div><div id="sudokuDock" class="bb-dock" style="min-height:45px; padding:4px;"></div></div>' },
        { id: 'win-memory', style: 'width: 300px; height: 400px; top: 10%; left: 20px;', headId: 'head-memory', title: 'MEMORY.EXE', body: '<div style="display:flex; flex-direction:column; justify-content:space-between; height:100%; padding:8px; overflow:hidden;"><div id="memory-score" style="font-size:13px; font-weight:bold; color:#55ff55; text-align:center;">СЧЕТ: 0</div><div id="memoryBoard" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; width:100%; aspect-ratio:1/1; margin:10px 0;"></div><div id="memory-over-box" style="width:100%; min-height:30px; text-align:center; font-weight:bold;"></div></div>' },
        { id: 'win-tower', style: 'width: 320px; height: 410px; top: 12%; left: 40px;', headId: 'head-tower', title: 'TOWER.EXE', body: '<div style="display:flex; flex-direction:column; justify-content:space-between; height:100%; padding:8px; overflow:hidden;"><div id="tower-score" style="font-size:13px; font-weight:bold; color:#55ff55; text-align:center;">ЭТАЖИ: 0</div><canvas id="towerCanvas" style="background:#000; border:2px solid #55ff55; display:block; width:100%; height:240px;"></canvas><div id="tower-over-box" style="width:100%; min-height:30px; text-align:center; font-weight:bold;"></div></div>' }
    ];
    templatesOne.forEach(t => {
        const winDiv = document.createElement('div');
        winDiv.className = 'os-window';
        winDiv.id = t.id;
        winDiv.style.cssText = t.style;
        winDiv.innerHTML = `
            <div class="window-header">
                <span id="${t.headId}">${t.title}</span>
                <div class="window-controls">
                    <span class="window-btn" 
                    onclick="toggleMaximize('${t.id}')">[ ]</span>
                    <span class="window-btn" 
                    onclick="minimizeOSWindow('${t.id}')">_</span>
                    <span class="window-btn window-close" 
                    onclick="closeOSWindow('${t.id}')">X</span>
                </div>
            </div>
            <div class="window-body" 
            style="height:calc(100% - 38px); overflow-y:auto;">
                ${t.body}
            </div>
        `;
        container.appendChild(winDiv);
    });
})();
(function generateDesktopWindowsPartTwo() {
    const container = document.getElementById(
        'desktop-windows-container'
    );
    if (!container) return;
    const templatesTwo = [
        { id: 'win-zip', style: 'width: 330px; height: 200px; top: 20%; left: 15px;', headId: 'head-zip', title: 'SECRET.ZIP', body: '<p class="txt-zip-locked" style="margin-bottom:10px;">Файл зашифрован ключом AES-256.</p><input type="password" class="zip-input-field" placeholder="..."><button class="trash-btn" onclick="checkZipPassword(\'win-zip\')" style="background:#55ff55; color:#000000; font-weight:bold; width:100%; margin-top:10px; text-shadow:none;">ОК</button>' },
        { id: 'win-zip2', style: 'width: 330px; height: 200px; top: 25%; left: 20px;', headId: 'head-zip2', title: 'SECRET1.ZIP', body: '<p class="txt-zip-locked" style="margin-bottom:10px;">Файл зашифрован ключом AES-256.</p><input type="password" class="zip-input-field" placeholder="..."><button class="trash-btn" onclick="checkZipPassword(\'win-zip2\')" style="background:#55ff55; color:#000000; font-weight:bold; width:100%; margin-top:10px; text-shadow:none;">ОК</button>' },
        { id: 'win-zip3', style: 'width: 330px; height: 200px; top: 30%; left: 25px;', headId: 'head-zip3', title: 'SECRET2.ZIP', body: '<p class="txt-zip-locked" style="margin-bottom:10px;">Файл зашифрован ключом AES-256.</p><input type="password" class="zip-input-field" placeholder="..."><button class="trash-btn" onclick="checkZipPassword(\'win-zip3\')" style="background:#55ff55; color:#000000; font-weight:bold; width:100%; margin-top:10px; text-shadow:none;">ОК</button>' },
        { id: 'win-dontopen', style: 'width: 320px; height: 200px; top: 20%; left: 30px;', headId: 'head-dontopen', title: 'НЕ ОТКРЫВАТЬ', body: '<div id="nestedFolderBody"><span class="nested-folder-link" id="nested-link-0" onclick="advanceNestedFolder(1)">📁 Я СЕРЬЕЗНО</span></div>' },
        { id: 'win-msg', style: 'width: 380px; height: 260px; top: 12%; left: 12px;', headId: 'head-msg', title: 'МЕССЕНДЖЕР v1.02', body: '<div class="msg-container" style="height:100%; width:100%;"><div class="msg-left" id="msg-user-list"></div><div class="msg-right" id="msg-chat-zone"></div></div>' },
        { id: 'win-search', style: 'width: 330px; height: 180px; top: 40%; left: 8px;', headId: 'head-search', title: 'БРАУЗЕР \'ПРИЗРАК\'', body: '<div id="search-browser-body" style="height:100%; width:100%;"></div>' },
        { id: 'win-dino', style: 'width: 360px; height: 280px; top: 5%; left: 5px;', headId: 'head-dino', title: 'DINO_RUN.EXE', body: '<div style="text-align:center; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; height:100%; padding:8px;"><canvas id="dinoCanvas" class="dino-canvas" width="580" height="150" style="max-height:140px;"></canvas><div id="dino-over-box" style="width:100%; min-height:30px; text-align:center; font-weight:bold; margin:4px 0;"></div><div id="dino-hint" style="font-size:11px; padding:6px; background:rgba(85,255,85,0.1); cursor:pointer; border:1px solid #55ff55;" onclick="window.triggerDinoJump()">НАЖМИ ДЛЯ ПРЫЖКА / СТАРТА</div></div>' },
        { id: 'win-blocks', style: 'width: 320px; height: 500px; top: 2px; left: 2px;', headId: 'head-blocks', title: 'BLOCK_BLAST.EXE', body: '<div style="overflow-y:auto; display:flex; flex-direction:column; justify-content:space-between; height:100%; padding:8px;"><div class="bb-container"><div style="font-size:14px; font-weight:bold; margin-bottom:4px;" id="bb-score">СЧЕТ: 0</div><div id="bbBoard" class="bb-board"></div><div id="bb-over-box" style="width:100%; min-height:30px; text-align:center; font-weight:bold; margin:6px 0;"></div><div id="bbDock" class="bb-dock"></div></div></div>' },
        { id: 'win-words', style: 'width: 320px; height: 480px; top: 10%; left: 15px;', headId: 'head-words', title: 'СЛОВА.EXE', body: '<div style="display:flex; flex-direction:column; justify-content:space-between; height:100%; padding:8px; overflow-y:auto;"><div id="words-score-panel" style="font-size:11px; font-weight:bold; color:#55ff55; display:flex; justify-content:space-between; width:100%; margin-bottom:4px;"><span>SCORE: 0</span><span>BEST: 0</span></div><div style="display:flex; justify-content:center; align-items:center; width:100%; flex:1;"><div id="wordsBoard"></div></div><div id="words-over-box" style="width:100%; min-height:35px; text-align:center; font-weight:bold; margin-top:4px; line-height:1.3;"></div><div id="wordsDock" style="width:100%; min-height:65px; margin-top:4px;"></div></div>' },
        { id: 'win-hangman', style: 'width: 330px; height: 430px; top: 15%; left: 30px;', headId: 'head-hangman', title: 'ВИСЕЛИЦА.EXE', body: '<div style="display:flex; flex-direction:column; justify-content:space-between; height:100%; padding:6px; overflow:hidden;"><div id="hangman-score-panel" style="font-size:11px; font-weight:bold; color:#55ff55; display:flex; justify-content:space-between; width:100%; margin-bottom:4px;"><span id="hangman-current-score">SCORE: 0</span><span id="hangman-high-score">BEST: 0</span></div><canvas id="hangmanCanvas" style="background:#000; border:2px solid #55ff55; display:block; width:100%; height:150px;"></canvas><div id="hangman-over-box" style="width:100%; min-height:35px; text-align:center; font-weight:bold; margin-top:2px; line-height:1.3;"></div><div id="hangmanDock" style="width:100%; min-height:65px;"></div></div>' }
    ];
    templatesTwo.forEach(t => {
        const winDiv = document.createElement('div');
        winDiv.className = 'os-window';
        winDiv.id = t.id;
        winDiv.style.cssText = t.style;
        winDiv.innerHTML = `
            <div class="window-header">
                <span id="${t.headId}">${t.title}</span>
                <div class="window-controls">
                    <span class="window-btn" 
                    onclick="toggleMaximize('${t.id}')">[ ]</span>
                    <span class="window-btn" 
                    onclick="minimizeOSWindow('${t.id}')">_</span>
                    <span class="window-btn window-close" 
                    onclick="closeOSWindow('${t.id}')">X</span>
                </div>
            </div>
            <div class="window-body" 
            style="height:calc(100% - 38px); overflow-y:auto;">
                ${t.body}
            </div>
        `;
        container.appendChild(winDiv);
    });
})();
