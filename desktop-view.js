const osStyles = document.createElement('style');
osStyles.innerHTML = `
    .desktop-env { display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 2000; font-family: 'Courier New', monospace; color: var(--neon-green); padding: 10px; box-sizing: border-box; user-select: none; text-shadow: var(--glow-green); overflow: hidden; }
    .desktop-icons-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(75px, 1fr)); grid-auto-rows: max-content; gap: 12px; height: calc(100% - 50px); width: 100%; overflow-y: auto; padding-bottom: 10px; }
    .icon { position: relative !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; transform: none !important; display: flex; flex-direction: column; align-items: center; text-align: center; cursor: pointer; padding: 6px; border: 1px solid transparent; transition: all 0.1s; width: 100%; box-sizing: border-box; }
    .icon:hover, .icon:active { background: rgba(51, 255, 51, 0.15); border-color: var(--neon-green); box-shadow: var(--glow-green); }
    .icon-pic { font-size: 28px; margin-bottom: 4px; }
    .icon-name { font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; word-break: break-word; line-height: 1.2; }
    .os-window { display: none; position: absolute; border: 2px solid var(--neon-green); background: #000; box-shadow: 0 0 20px rgba(51, 255, 51, 0.3); min-width: 280px; max-width: 95vw; max-height: 80vh; z-index: 3000; overflow: hidden; text-shadow: var(--glow-green); box-sizing: border-box; }
    .window-header { background: var(--neon-green); color: #000; padding: 10px; font-weight: bold; font-size: 13px; display: flex; justify-content: space-between; align-items: center; cursor: move; text-shadow: none; touch-action: none; }
    .window-controls { display: flex; gap: 8px; }
    .window-btn { cursor: pointer; font-weight: bold; background: #000; color: var(--neon-green); border: 1px solid var(--neon-green); padding: 4px 10px; font-size: 12px; border-radius: 0; min-width: 28px; text-align: center; }
    .window-btn:hover, .window-btn:active { background: var(--bright-green); color: #000; }
    .window-close:hover, .window-close:active { background: var(--neon-red) !important; color: #000 !important; border-color: var(--neon-red) !important; }
    .window-body { padding: 12px; font-size: 13px; height: calc(100% - 38px); overflow-y: auto; box-sizing: border-box; -webkit-overflow-scrolling: touch; }
    .taskbar { position: absolute; bottom: 0; left: 0; width: 100%; height: 44px; background: rgba(0, 34, 0, 0.9); border-top: 2px solid var(--neon-green); display: flex; justify-content: space-between; align-items: center; padding: 0 10px; box-sizing: border-box; z-index: 4000; box-shadow: var(--glow-green); }
    .taskbar-left { display: flex; align-items: center; gap: 10px; max-width: 70%; }
    .taskbar-start { font-weight: bold; border: 1px solid var(--neon-green); padding: 5px 8px; font-size: 11px; white-space: nowrap; }
    .taskbar-lang { font-weight: bold; border: 1px dashed var(--neon-green); padding: 5px 8px; font-size: 11px; cursor: pointer; background: transparent; color: var(--neon-green); font-family: inherit; }
    .taskbar-apps { display: flex; gap: 6px; overflow-x: auto; }
    .taskbar-app-btn { background: transparent; border: 1px solid var(--neon-green); padding: 3px 8px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .taskbar-app-btn.active { background: var(--neon-green); box-shadow: var(--glow-green); }
    .taskbar-timer { font-weight: bold; font-size: 12px; letter-spacing: 0.5px; text-shadow: var(--glow-green); white-space: nowrap; }
    .msg-container { display: flex; height: 180px; border: 1px dashed var(--neon-green); }
    .msg-left { width: 35%; border-right: 1px dashed var(--neon-green); padding: 6px; font-size: 11px; color: rgba(51, 255, 51, 0.5); overflow-y: auto; }
    .msg-right { width: 65%; padding: 6px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 11px; }
    .dino-canvas { background: #050505; border: 1px solid var(--neon-green); display: block; margin: 0 auto; width: 100%; max-width: 100%; height: auto; touch-action: none; }
    .bb-container { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; position: relative; }
    .bb-board { display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; background: #050505; border: 2px solid var(--neon-green); padding: 4px; width: 100%; max-width: 260px; aspect-ratio: 1/1; }
    .bb-cell { width: 100%; height: 100%; border: 1px solid #113311; box-sizing: border-box; }
    .bb-cell.filled { background: var(--neon-green); box-shadow: var(--glow-green); }
    .bb-dock { display: flex; gap: 15px; justify-content: center; min-height: 85px; width: 100%; border: 1px dashed #113311; padding: 6px; box-sizing: border-box; }
    .bb-piece { display: grid; gap: 1px; padding: 4px; background: rgba(0,0,0,0.5); width: fit-content; height: fit-content; touch-action: none; user-select: none; }
    .bb-piece .bb-cell { width: 14px; height: 14px; }
    @media (max-width: 600px) {
        .os-window { width: 92vw !important; height: auto !important; left: 4vw !important; }
        .window-header { padding: 8px; }
        .window-btn { padding: 6px 12px; font-size: 14px; }
        .taskbar-start { display: none; }
    }
`;
document.head.appendChild(osStyles);
const desktopHTML = `
    <div id="desktop-env" class="desktop-env">
        <div class="desktop-icons-container">
            <div class="icon" onclick="openOSWindow('win-trash', 'Корзина', '🗑️')"><div class="icon-pic">🗑️</div><div class="icon-name">Корзина</div></div>
            <div class="icon" onclick="openOSWindow('win-zip', 'secret.zip', '📦')"><div class="icon-pic">📦</div><div class="icon-name">secret.zip</div></div>
            <div class="icon" onclick="openOSWindow('win-msg', 'KPR-Связь', '📟')"><div class="icon-pic">📟</div><div class="icon-name">KPR-Связь</div></div>
            <div class="icon" onclick="openOSWindow('win-zip2', 'secret1.zip', '📦')"><div class="icon-pic">📦</div><div class="icon-name">secret1.zip</div></div>
            <div class="icon" onclick="openOSWindow('win-search', 'Поисковик', '🌐')"><div class="icon-pic">🌐</div><div class="icon-name">Поисковик</div></div>
            <div class="icon" onclick="openOSWindow('win-zip3', 'secret2.zip', '📦')"><div class="icon-pic">📦</div><div class="icon-name">secret2.zip</div></div>
            <div class="icon" onclick="openOSWindow('win-dino', 'Динозавр', '🦖')"><div class="icon-pic">🦖</div><div class="icon-name">Динозавр</div></div>
            <div class="icon" onclick="openOSWindow('win-blocks', 'Блок Бласт', '🧱')"><div class="icon-pic">🧱</div><div class="icon-name">Блок Бласт</div></div>
        </div>
        
        <div id="win-trash" class="os-window" style="width: 320px; height: 180px; top: 15%; left: 10px;">
            <div class="window-header"><span>КОРЗИНА</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-trash')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-trash')">X</span></div></div>
            <div class="window-body" id="win-trash-body">Здесь абсолютно пусто. Файлы стёрты из реальности.</div>
        </div>
        
        <div id="win-zip" class="os-window" style="width: 330px; height: 200px; top: 20%; left: 15px;">
            <div class="window-header"><span>АРХИВАТОР - SECRET.ZIP</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-zip')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-zip')">X</span></div></div>
            <div class="window-body" id="win-zip-body">
                <p style="margin-bottom:10px;">Файл зашифрован ключом AES-256.</p>
                <input type="password" id="zip-input" placeholder="Введите пароль..." style="background:#000; border:1px solid var(--neon-green); color:var(--neon-green); padding:8px; width:100%; outline:none; font-family:inherit; font-size:14px; border-radius:0;">
                <button id="zip-btn" style="background:var(--neon-green); color:#000; border:none; padding:8px 16px; margin-top:10px; font-weight:bold; cursor:pointer; font-family:inherit; width:100%;">ОК</button>
            </div>
        </div>

        <div id="win-zip2" class="os-window" style="width: 320px; height: 180px; top: 25%; left: 20px;">
            <div class="window-header"><span>АРХИВАТОР - SECRET1.ZIP</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-zip2')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-zip2')">X</span></div></div>
            <div class="window-body" id="win-zip2-body">
                <p>Локальные метаданные KPR-OS.</p>
                <p style="color:var(--bright-green);margin-top:10px;">Статус: Архив поврежден временным сдвигом.</p>
            </div>
        </div>

        <div id="win-zip3" class="os-window" style="width: 320px; height: 180px; top: 30%; left: 25px;">
            <div class="window-header"><span>АРХИВАТОР - SECRET2.ZIP</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-zip3')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-zip3')">X</span></div></div>
            <div class="window-body" id="win-zip3-body">
                <p>Манифест: "Новая Эра близко. Подготовьте терминальные ключи шлюза."</p>
            </div>
        </div>
        
        <div id="win-msg" class="os-window" style="width: 360px; height: 260px; top: 12%; left: 12px;">
            <div class="window-header"><span>МЕССЕНДЖЕР v1.02</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-msg')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-msg')">X</span></div></div>
            <div class="window-body" style="padding:0;">
                <div class="msg-container">
                    <div class="msg-left" id="msg-user-list">[Списков нет]</div>
                    <div class="msg-right" id="msg-chat-zone">ВЫБЕРИТЕ ПОЛЬЗОВАТЕЛЯ ДЛЯ НАЧАЛА СЕССИИ</div>
                </div>
            </div>
        </div>
        
        <div id="win-search" class="os-window" style="width: 330px; height: 180px; top: 40%; left: 8px;">
            <div class="window-header"><span>БРАУЗЕР 'ПРИЗРАК'</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-search')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-search')">X</span></div></div>
            <div class="window-body" id="search-browser-body"><strong>Ошибка 404:</strong> Нет связи с внешним шлюзом. Локальный прокси-сервер KPR-GATEWAY не отвечает.</div>
        </div>
        
        <div id="win-dino" class="os-window" style="width: 360px; height: 240px; top: 5%; left: 5px;">
            <div class="window-header"><span>DINO_RUN.EXE</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-dino')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-dino')">X</span></div></div>
            <div class="window-body" style="text-align:center; overflow:hidden;">
                <canvas id="dinoCanvas" class="dino-canvas" width="580" height="150"></canvas>
                <div id="dino-hint" style="font-size:11px; margin-top:5px; padding:6px; background:rgba(51,255,51,0.1);">Нажми ПРОБЕЛ / Кликни мышь для прыжка и старта</div>
            </div>
        </div>
        
        <div id="win-blocks" class="os-window" style="width: 320px; height: 460px; top: 2px; left: 2px;">
            <div class="window-header"><span>BLOCK_BLAST.EXE</span><div class="window-controls"><span class="window-btn" onclick="minimizeOSWindow('win-blocks')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-blocks')">X</span></div></div>
            <div class="window-body" style="overflow-y:auto;">
                <div class="bb-container">
                    <div style="font-size:14px; font-weight:bold;" id="bb-score">СЧЕТ: 0</div>
                    <div id="bbBoard" class="bb-board"></div>
                    <div id="bbDock" class="bb-dock"></div>
                    <div id="bb-msg" style="font-size:11px; text-align:center; color:rgba(51,255,51,0.7);">Зажми фигуру и тащи её на доску</div>
                </div>
            </div>
        </div>

        <div class="taskbar">
            <div class="taskbar-left">
                <div class="taskbar-start">KPR-OS v1.0</div>
                <button class="taskbar-lang" id="taskbar-lang-btn" onclick="toggleDesktopLanguage()">RU</button>
                <div id="taskbar-apps" class="taskbar-apps"></div>
            </div>
            <div id="taskbar-timer" class="taskbar-timer">00:00:00:00</div>
        </div>
    </div>
`;

const divMock = document.createElement('div');
divMock.innerHTML = desktopHTML;
document.body.appendChild(divMock.firstElementChild);
