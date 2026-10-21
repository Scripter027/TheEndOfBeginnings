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
    .window-close { cursor: pointer; font-weight: bold; background: #000; color: var(--neon-green); border: 1px solid var(--neon-green); padding: 0 5px; }
    .window-close:hover { background: var(--neon-red); color: #000; border-color: var(--neon-red); }
    .window-body { padding: 15px; font-size: 14px; height: calc(100% - 30px); overflow-y: auto; box-sizing: border-box; }
    .taskbar { position: absolute; bottom: 0; left: 0; width: 100%; height: 40px; background: rgba(0, 34, 0, 0.8); border-top: 2px solid var(--neon-green); display: flex; justify-content: space-between; align-items: center; padding: 0 15px; box-sizing: border-box; z-index: 4000; }
    .taskbar-start { font-weight: bold; border: 1px solid var(--neon-green); padding: 4px 10px; font-size: 12px; }
    .taskbar-timer { font-weight: bold; font-size: 14px; letter-spacing: 1px; text-shadow: var(--glow-green); }
    .msg-container { display: flex; height: 200px; border: 1px dashed var(--neon-green); }
    .msg-left { width: 35%; border-right: 1px dashed var(--neon-green); padding: 10px; font-size: 12px; color: rgba(51, 255, 51, 0.5); }
    .msg-right { width: 65%; padding: 10px; display: flex; align-items: center; justify-content: center; text-align: center; }
    .dino-canvas { background: #050505; border: 1px solid var(--neon-green); display: block; margin: 0 auto; }
    .block-grid { display: grid; grid-template-columns: repeat(8, 22px); grid-gap: 2px; background: #050505; border: 1px solid var(--neon-green); padding: 5px; margin: 0 auto; width: fit-content; }
    .block-cell { width: 22px; height: 22px; border: 1px solid #113311; }
    .block-cell.filled { background: var(--neon-green); box-shadow: var(--glow-green); }
`;
document.head.appendChild(osStyles);

const desktopHTML = `
    <div id="desktop-env" class="desktop-env">
        <div class="desktop-icons">
            <div class="icon" onclick="openOSWindow('win-trash')"><div class="icon-pic">🗑️</div><div class="icon-name">Корзина</div></div>
            <div class="icon" onclick="openOSWindow('win-zip')"><div class="icon-pic">📦</div><div class="icon-name">Секрет.zip</div></div>
            <div class="icon" onclick="openOSWindow('win-msg')"><div class="icon-pic">📟</div><div class="icon-name">KPR-Связь</div></div>
            <div class="icon" onclick="openOSWindow('win-search')"><div class="icon-pic">🌐</div><div class="icon-name">Поисковик</div></div>
            <div class="icon" onclick="openOSWindow('win-dino')"><div class="icon-pic">🦖</div><div class="icon-name">Динозавр</div></div>
            <div class="icon" onclick="openOSWindow('win-blocks')"><div class="icon-pic">🧱</div><div class="icon-name">Блок Бласт</div></div>
        </div>
        <div id="win-trash" class="os-window" style="width: 320px; height: 160px; top: 100px; left: 150px;">
            <div class="window-header"><span>КОРЗИНА</span><span class="window-close" onclick="closeOSWindow('win-trash')">X</span></div>
            <div class="window-body">Здесь абсолютно пусто. Файлы стёрты из реальности.</div>
        </div>
        <div id="win-zip" class="os-window" style="width: 340px; height: 180px; top: 130px; left: 200px;">
            <div class="window-header"><span>АРХИВАТОР</span><span class="window-close" onclick="closeOSWindow('win-zip')">X</span></div>
            <div class="window-body">
                <p style="margin-bottom:10px;">Файл зашифрован ключом AES-256.</p>
                <input type="password" id="zip-input" placeholder="Введите пароль..." style="background:#000; border:1px solid var(--neon-green); color:var(--neon-green); padding:5px; width:100%; outline:none;">
                <button id="zip-btn" style="background:var(--neon-green); color:#000; border:none; padding:5px 10px; margin-top:10px; font-weight:bold; cursor:pointer;">ОК</button>
            </div>
        </div>
        <div id="win-msg" class="os-window" style="width: 440px; height: 260px; top: 80px; left: 250px;">
            <div class="window-header"><span>МЕССЕНДЖЕР v1.02</span><span class="window-close" onclick="closeOSWindow('win-msg')">X</span></div>
            <div class="window-body" style="padding:0;">
                <div class="msg-container">
                    <div class="msg-left" id="msg-user-list">[Списков нет]</div>
                    <div class="msg-right" id="msg-chat-zone">ВЫБЕРИТЕ ПОЛЬЗОВАТЕЛЯ ДЛЯ НАЧАЛА СЕССИИ</div>
                </div>
            </div>
        </div>
        <div id="win-search" class="os-window" style="width: 380px; height: 160px; top: 200px; left: 120px;">
            <div class="window-header"><span>БРАУЗЕР 'ПРИЗРАК'</span><span class="window-close" onclick="closeOSWindow('win-search')">X</span></div>
            <div class="window-body" id="search-browser-body"><strong>Ошибка 404:</strong> Нет связи с внешним шлюзом. Локальный прокси-сервер KPR-GATEWAY не отвечает.</div>
        </div>
        <div id="win-dino" class="os-window" style="width: 420px; height: 240px; top: 50px; left: 300px;">
            <div class="window-header"><span>DINO_RUN.EXE</span><span class="window-close" onclick="closeOSWindow('win-dino')">X</span></div>
            <div class="window-body" style="text-align:center;">
                <canvas id="dinoCanvas" class="dino-canvas" width="380" height="130"></canvas>
                <div style="font-size:11px; margin-top:5px;">Кликни по окну и жми ПРОБЕЛ / TAP для прыжка</div>
            </div>
        </div>
        <div id="win-blocks" class="os-window" style="width: 300px; height: 350px; top: 40px; left: 400px;">
            <div class="window-header"><span>BLOCK_BLAST_MINI.EXE</span><span class="window-close" onclick="closeOSWindow('win-blocks')">X</span></div>
            <div class="window-body" style="text-align:center;">
                <div id="blockGrid" class="block-grid"></div>
                <button id="blockBtn" style="background:transparent; border:1px solid var(--neon-green); color:var(--neon-green); padding:5px 15px; margin-top:10px; cursor:pointer;">СБРОСИТЬ ФИГУРУ</button>
                <div style="font-size:11px; margin-top:5px;">Кликай по ячейкам, чтобы заполнять ряды!</div>
            </div>
        </div>
        <div class="taskbar">
            <div class="taskbar-start">KPR-OS v1.0</div>
            <div id="taskbar-timer" class="taskbar-timer">00:00:00:00</div>
        </div>
    </div>
`;

const divMock = document.createElement('div');
divMock.innerHTML = desktopHTML;
document.body.appendChild(divMock.firstElementChild);
