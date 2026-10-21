const osStyles = document.createElement('style');
osStyles.innerHTML = `
    .desktop-env { display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 2000; font-family: 'Courier New', monospace; color: var(--neon-green); padding: 20px; box-sizing: border-box; user-select: none; }
    .desktop-icons { display: grid; grid-template-columns: repeat(auto-fill, 90px); grid-gap: 20px; align-content: flex-start; height: calc(100% - 50px); }
    .icon { display: flex; flex-direction: column; align-items: center; text-align: center; cursor: pointer; padding: 10px; border: 1px solid transparent; transition: all 0.1s; }
    .icon:hover { background: rgba(51, 255, 51, 0.15); border-color: var(--neon-green); box-shadow: var(--glow-green); }
    .icon-pic { font-size: 32px; margin-bottom: 8px; }
    .icon-name { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .os-window { display: none; position: absolute; border: 2px solid var(--neon-green); background: #000; box-shadow: 0 0 20px rgba(51, 255, 51, 0.3); min-width: 300px; z-index: 3000; resize: both; overflow: hidden; }
    .window-header { background: var(--neon-green); color: #000; padding: 6px 10px; font-weight: bold; font-size: 13px; display: flex; justify-content: space-between; align-items: center; cursor: move; }
    .window-controls { display: flex; gap: 5px; }
    .window-btn { cursor: pointer; font-weight: bold; background: #000; color: var(--neon-green); border: 1px solid var(--neon-green); padding: 0 6px; font-size: 11px; }
    .window-btn:hover { background: var(--bright-green); color: #000; }
    .window-close:hover { background: var(--neon-red) !important; color: #000 !important; border-color: var(--neon-red) !important; }
    .window-body { padding: 15px; font-size: 14px; height: calc(100% - 30px); overflow-y: auto; box-sizing: border-box; }
    .taskbar { position: absolute; bottom: 0; left: 0; width: 100%; height: 40px; background: rgba(0, 34, 0, 0.8); border-top: 2px solid var(--neon-green); display: flex; justify-content: space-between; align-items: center; padding: 0 15px; box-sizing: border-box; z-index: 4000; }
    .taskbar-left { display: flex; align-items: center; gap: 15px; }
    .taskbar-start { font-weight: bold; border: 1px solid var(--neon-green); padding: 4px 10px; font-size: 12px; }
    .taskbar-apps { display: flex; gap: 5px; }
    .taskbar-app-btn { background: transparent; border: 1px solid var(--neon-green); color: var(--neon-green); padding: 2px 8px; font-size: 11px; cursor: pointer; font-family: inherit; }
    .taskbar-app-btn.active { background: var(--neon-green); color: #000; }
    .taskbar-timer { font-weight: bold; font-size: 14px; letter-spacing: 1px; text-shadow: var(--glow-green); }
    .msg-container { display: flex; height: 200px; border: 1px dashed var(--neon-green); }
    .msg-left { width: 35%; border-right: 1px dashed var(--neon-green); padding: 10px; font-size: 12px; color: rgba(51, 255, 51, 0.5); }
    .msg-right { width: 65%; padding: 10px; display: flex; align-items: center; justify-content: center; text-align: center; }
    .dino-canvas { background: #050505; border: 1px solid var(--neon-green); display: block; margin: 0 auto; max-width: 100%; }
    .bb-container { display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%; }
    .bb-board { display: grid; grid-template-columns: repeat(8, 24px); grid-gap: 2px; background: #050505; border: 2px solid var(--neon-green); padding: 4px; }
    .bb-cell { width: 24px; height: 24px; border: 1px solid #113311; box-sizing: border-box; }
    .bb-cell.filled { background: var(--neon-green); box-shadow: var(--glow-green); }
    .bb-cell.preview { background: rgba(51, 255, 51, 0.3); border-color: var(--neon-green); }
    .bb-dock { display: flex; gap: 15px; justify-content: center; min-height: 80px; width: 100%; border: 1px dashed #113311; padding: 10px; }
    .bb-piece { display: grid; grid-gap: 2px; padding: 5px; border: 1px solid transparent; cursor: grab; background: rgba(0,0,0,0.5); width: fit-content; height: fit-content; }
    .bb-piece:hover { border-color: var(--neon-green); }
    .bb-piece.dragging { opacity: 0.3; cursor: grabbing; }
`;
document.head.appendChild(osStyles);
const desktopHTML = `
    <div id="desktop-env" class="desktop-env">
        <div class="desktop-icons">
            <div class="icon" onclick="openOSWindow('win-trash', 'Корзина')"><div class="icon-pic">🗑️</div><div class="icon-name">Корзина</div></div>
            <div class="icon" onclick="openOSWindow('win-zip', 'Секрет.zip')"><div class="icon-pic">📦</div><div class="icon-name">Секрет.zip</div></div>
            <div class="icon" onclick="openOSWindow('win-msg', 'KPR-Связь')"><div class="icon-pic">📟</div><div class="icon-name">KPR-Связь</div></div>
            <div class="icon" onclick="openOSWindow('win-search', 'Поисковик')"><div class="icon-pic">🌐</div><div class="icon-name">Поисковик</div></div>
            <div class="icon" onclick="openOSWindow('win-dino', 'Динозавр')"><div class="icon-pic">🦖</div><div class="icon-name">Динозавр</div></div>
            <div class="icon" onclick="openOSWindow('win-blocks', 'Блок Бласт')"><div class="icon-pic">🧱</div><div class="icon-name">Блок Бласт</div></div>
        </div>
        
        <div id="win-trash" class="os-window" style="width: 320px; height: 160px; top: 100px; left: 150px;">
            <div class="window-header"><span>КОРЗИНА</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-trash')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-trash')">X</span></div></div>
            <div class="window-body">Здесь абсолютно пусто. Файлы стёрты из реальности.</div>
        </div>
        
        <div id="win-zip" class="os-window" style="width: 340px; height: 180px; top: 130px; left: 200px;">
            <div class="window-header"><span>АРХИВАТОР</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-zip')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-zip')">X</span></div></div>
            <div class="window-body">
                <p style="margin-bottom:10px;">Файл зашифрован ключом AES-256.</p>
                <input type="password" id="zip-input" placeholder="Введите пароль..." style="background:#000; border:1px solid var(--neon-green); color:var(--neon-green); padding:5px; width:100%; outline:none;">
                <button id="zip-btn" style="background:var(--neon-green); color:#000; border:none; padding:5px 10px; margin-top:10px; font-weight:bold; cursor:pointer;">ОК</button>
            </div>
        </div>
        
        <div id="win-msg" class="os-window" style="width: 440px; height: 260px; top: 80px; left: 250px;">
            <div class="window-header"><span>МЕССЕНДЖЕР v1.02</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-msg')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-msg')">X</span></div></div>
            <div class="window-body" style="padding:0;">
                <div class="msg-container">
                    <div class="msg-left" id="msg-user-list">[Списков нет]</div>
                    <div class="msg-right" id="msg-chat-zone">ВЫБЕРИТЕ ПОЛЬЗОВАТЕЛЯ ДЛЯ НАЧАЛА СЕССИИ</div>
                </div>
            </div>
        </div>
        
        <div id="win-search" class="os-window" style="width: 380px; height: 160px; top: 200px; left: 120px;">
            <div class="window-header"><span>БРАУЗЕР 'ПРИЗРАК'</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-search')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-search')">X</span></div></div>
            <div class="window-body" id="search-browser-body"><strong>Ошибка 404:</strong> Нет связи с внешним шлюзом. Локальный прокси-сервер KPR-GATEWAY не отвечает.</div>
        </div>
        
        <div id="win-dino" class="os-window" style="width: 620px; height: 250px; top: 50px; left: 100px;">
            <div class="window-header"><span>DINO_RUN.EXE</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-dino')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-dino')">X</span></div></div>
            <div class="window-body" style="text-align:center; overflow:hidden;">
                <canvas id="dinoCanvas" class="dino-canvas" width="580" height="150"></canvas>
                <div id="dino-hint" style="font-size:11px; margin-top:5px;">Нажми ПРОБЕЛ / Кликни для прыжка и старта</div>
            </div>
        </div>
        
        <div id="win-blocks" class="os-window" style="width: 360px; height: 500px; top: 20px; left: 300px;">
            <div class="window-header"><span>BLOCK_BLAST.EXE</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-blocks')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-blocks')">X</span></div></div>
            <div class="window-body" style="overflow:hidden;">
                <div class="bb-container">
                    <div style="font-size:14px; font-weight:bold;" id="bb-score">СЧЕТ: 0</div>
                    <div id="bbBoard" class="bb-board"></div>
                    <div id="bbDock" class="bb-dock"></div>
                    <div id="bb-msg" style="font-size:11px; text-align:center;">Зажми мышь на фигуре и тащи её на доску</div>
                </div>
            </div>
        </div>

        <div class="taskbar">
            <div class="taskbar-left">
                <div class="taskbar-start">KPR-OS v1.0</div>
                <div id="taskbar-apps" class="taskbar-apps"></div>
            </div>
            <div id="taskbar-timer" class="taskbar-timer">00:00:00:00</div>
        </div>
    </div>
`;

const divMock = document.createElement('div');
divMock.innerHTML = desktopHTML;
document.body.appendChild(divMock.firstElementChild);
