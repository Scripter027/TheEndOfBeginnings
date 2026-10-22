const osStyles = document.createElement('style');
osStyles.innerHTML = `
    * { font-family: 'Courier New', Courier, monospace !important; box-sizing: border-box; margin: 0; padding: 0; }
    .desktop-env { display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000000; z-index: 2000; color: #55ff55; padding: 10px; user-select: none; text-shadow: 0 0 10px rgba(85, 255, 85, 0.5); overflow: hidden; }
    .desktop-env::before { content: " "; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(0, 0, 0, 0.4) 100%); z-index: 9999; background-size: 100% 4px, 100% 100%; pointer-events: none; }
    .desktop-env.rage-active { --neon-green: #ff3333 !important; --bright-green: #ff8888 !important; --dark-green: #220000 !important; text-shadow: 0 0 12px rgba(255, 51, 51, 0.7) !important; color: var(--neon-green) !important; }
    .desktop-env.rage-active .window-header { background: var(--neon-green) !important; color: #000000 !important; }
    .desktop-env.rage-active .window-btn, .desktop-env.rage-active .os-window, .desktop-env.rage-active .icon { border-color: var(--neon-green) !important; box-shadow: 0 0 12px rgba(255, 51, 51, 0.5) !important; }
    .desktop-env.rage-active .taskbar { border-top-color: var(--neon-green) !important; box-shadow: 0 0 12px rgba(255, 51, 51, 0.5) !important; background: rgba(34, 0, 0, 0.8) !important; }
    .desktop-icons-container { position: relative; width: 100%; height: calc(100% - 50px); }
    .icon { position: absolute; display: flex; flex-direction: column; align-items: center; text-align: center; cursor: move; padding: 10px; border: 2px solid #55ff55; width: 80px; height: 75px; box-shadow: 0 0 12px rgba(85, 255, 85, 0.5); background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(2px); border-radius: 0; touch-action: none; z-index: 2100; transition: background 0.15s ease, box-shadow 0.15s ease; }
    .icon:hover, .icon:active { background: rgba(85, 255, 85, 0.3); border-color: #88ff88; box-shadow: 0 0 25px rgba(85, 255, 85, 0.9); color: #88ff88; }
    .icon-pic { font-size: 24px; margin-bottom: 2px; pointer-events: none; }
    .icon-name { font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; word-break: break-word; line-height: 1.1; pointer-events: none; }
    .os-window { display: none; position: absolute; border: 2px solid #55ff55; background: rgba(0, 0, 0, 0.95); box-shadow: 0 0 20px rgba(85, 255, 85, 0.5); min-width: 280px; max-width: 95vw; max-height: 80vh; z-index: 3000; overflow: hidden; box-sizing: border-box; }
    .os-window.maximized { top: 0 !important; left: 0 !important; width: 100vw !important; height: calc(100vh - 44px) !important; max-width: 100vw !important; max-height: calc(100vh - 44px) !important; }
    .window-header { background: #55ff55; color: #000000; padding: 10px; font-weight: bold; font-size: 13px; display: flex; justify-content: space-between; align-items: center; cursor: move; text-shadow: none; touch-action: none; }
    .window-controls { display: flex; gap: 6px; }
    .window-btn { cursor: pointer; font-weight: bold; background: #000000; color: #55ff55; border: 2px solid #55ff55; padding: 4px 8px; font-size: 11px; border-radius: 0; min-width: 26px; text-align: center; box-shadow: 0 0 10px rgba(85, 255, 85, 0.4); transition: all 0.15s ease; }
    .window-btn:hover, .window-btn:active { background: #55ff55; color: #000000; text-shadow: none; }
    .window-close:hover, .window-close:active { background: var(--neon-red) !important; color: #000000 !important; border-color: var(--neon-red) !important; text-shadow: none; box-shadow: 0 0 15px rgba(255, 51, 51, 0.8) !important; }
    .window-body { padding: 12px; font-size: 13px; height: calc(100% - 38px); overflow-y: auto; -webkit-overflow-scrolling: touch; line-height: 1.5; text-transform: uppercase; }
    .taskbar { position: absolute; bottom: 0; left: 0; width: 100%; height: 44px; background: rgba(0, 0, 0, 0.95); border-top: 2px solid #55ff55; display: flex; justify-content: space-between; align-items: center; padding: 0 10px; z-index: 4000; box-shadow: 0 0 20px rgba(85, 255, 85, 0.5); }
    .taskbar-left { display: flex; align-items: center; gap: 8px; max-width: 70%; }
    .taskbar-start { font-weight: bold; border: 2px solid #55ff55; padding: 5px 8px; font-size: 11px; white-space: nowrap; box-shadow: 0 0 10px rgba(85, 255, 85, 0.4); }
    .taskbar-lang, .taskbar-exit { font-weight: bold; border: 2px solid #55ff55; padding: 5px 8px; font-size: 11px; cursor: pointer; background: transparent; color: #55ff55; box-shadow: 0 0 10px rgba(85, 255, 85, 0.4); border-radius: 0; transition: all 0.15s ease; }
    .taskbar-lang:hover, .taskbar-exit:hover { background: #55ff55; color: #000000; text-shadow: none; }
    .taskbar-exit { border-color: var(--neon-red); color: var(--neon-red); box-shadow: 0 0 10px rgba(255, 51, 51, 0.4); }
    .taskbar-exit:hover { background: var(--neon-red); color: #000000; text-shadow: none; box-shadow: 0 0 20px rgba(255, 51, 51, 0.8); }
    .taskbar-apps { display: flex; gap: 4px; overflow-x: auto; }
    .taskbar-app-btn { background: transparent; border: 2px solid #55ff55; padding: 3px 8px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(85, 255, 85, 0.4); border-radius: 0; }
    .taskbar-app-btn.active { background: #55ff55; color: #000000; text-shadow: none; }
    .taskbar-timer { font-weight: bold; font-size: 12px; letter-spacing: 0.5px; white-space: nowrap; }
    .msg-container { display: flex; height: 100%; width: 100%; border: 2px solid #55ff55; background: #000000; min-height: 180px; }
    .msg-left { width: 35%; border-right: 2px solid #55ff55; padding: 4px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; height: 100%; }
    .msg-user-item { padding: 6px; border: 2px solid transparent; cursor: pointer; font-size: 12px; font-weight: bold; }
    .msg-user-item:hover { border-color: #55ff55; background: rgba(85, 255, 85, 0.15); }
    .msg-right { width: 65%; display: flex; flex-direction: column; height: 100%; background: rgba(0,0,0,0.2); }
    .dino-canvas { background: #000000; border: 2px solid #55ff55; display: block; margin: 0 auto; width: 100%; max-width: 100%; height: auto; touch-action: none; box-shadow: 0 0 15px rgba(85, 255, 85, 0.4); }
    .bb-container { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; position: relative; }
    .bb-board { display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; background: #000000; border: 2px solid #55ff55; padding: 4px; width: 100%; max-width: 260px; aspect-ratio: 1/1; box-shadow: 0 0 15px rgba(85, 255, 85, 0.4); }
    .bb-cell { width: 100%; height: 100%; border: 1px solid #003300; box-sizing: border-box; }
    .bb-cell.filled { background: #55ff55 !important; box-shadow: 0 0 10px rgba(85, 255, 85, 0.8) !important; }
    .bb-dock { display: flex; gap: 15px; justify-content: center; min-height: 85px; width: 100%; border: 2px solid #55ff55; background: rgba(0,0,0,0.4); padding: 6px; box-sizing: border-box; }
    .bb-piece { display: grid; gap: 1px; padding: 4px; background: rgba(0,0,0,0.6); width: fit-content; height: fit-content; touch-action: none; user-select: none; border: 2px dashed #55ff55; }
    .bb-piece .bb-cell { width: 14px; height: 14px; }
    .rage-banner { display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 32px; font-weight: bold; border: 4px solid #ff3333; background: #000000; color: #ff3333; padding: 20px 4px; text-align: center; z-index: 9999; box-shadow: 0 0 30px #ff3333; width: 90%; max-width: 450px; }
    .bsod-screen { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0000aa; color: #ffffff; z-index: 99999; padding: 40px 20px; box-sizing: border-box; text-shadow: none; font-size: 14px; line-height: 1.6; }
    .nested-folder-link { cursor: pointer; color: #55ff55; text-decoration: underline; display: block; margin: 10px 0; font-weight: bold; }
    .trash-controls, .explorer-controls { display: flex; gap: 10px; margin-bottom: 12px; }
    .trash-btn, .explorer-btn { background: transparent; border: 2px solid #55ff55; color: #55ff55; padding: 6px 14px; cursor: pointer; font-size: 14px; box-shadow: 0 0 10px rgba(85, 255, 85, 0.4); border-radius: 0; transition: all 0.15s ease; }
    .trash-btn:hover, .explorer-btn:hover { background: #55ff55; color: #000000; text-shadow: none; box-shadow: 0 0 15px rgba(85, 255, 85, 0.8); }
    .trash-list, .explorer-list, .store-list { border-top: 2px solid #55ff55; padding-top: 10px; display: flex; flex-direction: column; gap: 6px; }
    .trash-item, .explorer-item, .store-item { display: flex; justify-content: space-between; align-items: center; font-size: 12px; padding: 6px; border: 2px solid transparent; background: rgba(0,0,0,0.5); }
    .explorer-item:hover, .store-item:hover { border-color: #55ff55; background: rgba(85, 255, 85, 0.15); box-shadow: 0 0 10px rgba(85, 255, 85, 0.3); }
    .explorer-item-left, .store-item-left { display: flex; align-items: center; gap: 8px; }
    .zip-input-field { background: rgba(0, 0, 0, 0.6); border: 2px solid #55ff55; color: #55ff55; padding: 14px; font-size: 16px; outline: none; box-shadow: 0 0 10px rgba(85, 255, 85, 0.4); border-radius: 0; transition: all 0.15s ease; -webkit-appearance: none; width: 100%; }
    .zip-input-field:focus { border-color: #88ff88; box-shadow: 0 0 25px rgba(85, 255, 85, 0.8); color: #88ff88; }
    .store-tabs-container { display: flex; gap: 4px; width: 100%; border-top: 2px solid #55ff55; padding-top: 6px; }
    .store-tab-btn { flex: 1; background: transparent; border: 2px solid #55ff55; color: #55ff55; padding: 6px; cursor: pointer; font-size: 11px; font-weight: bold; text-transform: uppercase; transition: all 0.15s ease; }
    .store-tab-btn:hover, .store-tab-btn.active { background: #55ff55; color: #000000; }
    @media (max-width: 600px) { .os-window { width: 92vw !important; height: auto !important; left: 4vw !important; } .window-header { padding: 8px; } .window-btn { padding: 6px 12px; font-size: 14px; } .taskbar-start { display: none; } }
`;
document.head.appendChild(osStyles);
const desktopHTML = `
    <div id="desktop-env" class="desktop-env">
        <div id="rageBanner" class="rage-banner">ХВАТИТ / ENOUGH!!!!</div>
        <div id="bsodScreen" class="bsod-screen">
            <p style="background:#fff; color:#00a; padding: 2px 10px; width: fit-content; font-weight: bold; margin-bottom: 20px;">KPR-OS SYSTEM ERROR</p>
            <p>A fatal exception 0x00F482A1 has occurred at KPR-GATEWAY interface bus. The current session was terminated to safeguard data logs.</p><br>
            <p>* Check to make sure any new terminal configs are properly deployed.</p>
            <p>* If this is the first time you've seen this Stop error screen, restart your computer system.</p><br>
            <p>STOP: 0x000000D1 (0x0000000C, 0x00000002, 0x00000000, 0xF73120A1)</p><br>
            <p>Система полностью заблокирована. Требуется физическая перезагрузка страницы (F5).</p>
        </div>

        <div class="desktop-icons-container" id="desktopIconsContainer">
            <div class="icon" id="icon-win-trash" data-id="win-trash" data-title-ru="Корзина" data-title-en="Trash" data-icon="🗑️"><div class="icon-pic">🗑️</div><div class="icon-name" id="label-win-trash">Корзина</div></div>
            <div class="icon" id="icon-win-explorer" data-id="win-explorer" data-title-ru="Проводник" data-title-en="Explorer" data-icon="🗁"><div class="icon-pic">🗁</div><div class="icon-name" id="label-win-explorer">Проводник</div></div>
            <div class="icon" id="icon-win-store" data-id="win-store" data-title-ru="Магазин" data-title-en="Store" data-icon="🏪"><div class="icon-pic">🏪</div><div class="icon-name" id="label-win-store">Магазин</div></div>
            <div class="icon" id="icon-win-msg" data-id="win-msg" data-title-ru="KPR-Связь" data-title-en="KPR-Chat" data-icon="📟"><div class="icon-pic">📟</div><div class="icon-name" id="label-win-msg">KPR-Связь</div></div>
            <div class="icon" id="icon-win-search" data-id="win-search" data-title-ru="Поисковик" data-title-en="Search" data-icon="🌐"><div class="icon-pic">🌐</div><div class="icon-name" id="label-win-search">Поисковик</div></div>
            <div class="icon" id="icon-win-dino" data-id="win-dino" data-title-ru="Динозавр" data-title-en="Dino" data-icon="🦖"><div class="icon-pic">🦖</div><div class="icon-name" id="label-win-dino">Динозавр</div></div>
            <div class="icon" id="icon-win-blocks" data-id="win-blocks" data-title-ru="Блок Бласт" data-title-en="Block Blast" data-icon="🧱"><div class="icon-pic">🧱</div><div class="icon-name" id="label-win-blocks">Блок Бласт</div></div>
            <div class="icon" id="icon-win-tetris" data-id="win-tetris" data-title-ru="Тетрис" data-title-en="Tetris" data-icon="🕹️" style="display: none;"><div class="icon-pic">🕹️</div><div class="icon-name" id="label-win-tetris">Тетрис</div></div>
            <div class="icon" id="icon-win-zip" data-id="win-zip" data-title-ru="secret.zip" data-title-en="secret.zip" data-icon="📦"><div class="icon-pic">📦</div><div class="icon-name">secret.zip</div></div>
            <div class="icon" id="icon-win-zip2" data-id="win-zip2" data-title-ru="secret1.zip" data-title-en="secret1.zip" data-icon="📦"><div class="icon-pic">📦</div><div class="icon-name">secret1.zip</div></div>
            <div class="icon" id="icon-win-zip3" data-id="win-zip3" data-title-ru="secret2.zip" data-title-en="secret2.zip" data-icon="📦"><div class="icon-pic">📦</div><div class="icon-name">secret2.zip</div></div>
            <div class="icon" id="icon-win-dontopen" data-id="win-dontopen" data-title-ru="НЕ ОТКРЫВАТЬ" data-title-en="DO NOT OPEN" data-icon="📁"><div class="icon-pic">📁</div><div class="icon-name" id="label-win-dontopen">НЕ ОТКРЫВАТЬ</div></div>
            <div class="icon" id="icon-win-bsod" data-id="win-bsod" data-title-ru="Экран Смерти" data-title-en="BSOD Screen" data-icon="💀"><div class="icon-pic">💀</div><div class="icon-name" id="label-win-bsod">Экран Смерти</div></div>
        </div>
        
        <div id="win-trash" class="os-window" style="width: 340px; height: 240px; top: 15%; left: 10px;">
            <div class="window-header"><span id="head-trash">КОРЗИНА</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-trash')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-trash')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-trash')">X</span></div></div>
            <div class="window-body">
                <div class="trash-controls">
                    <button class="trash-btn" id="btn-trash-clear" onclick="emptyTrash()">Очистить</button>
                </div>
                <div class="trash-list" id="trashListContainer"></div>
            </div>
        </div>

        <div id="win-explorer" class="os-window" style="width: 360px; height: 300px; top: 10%; left: 40px;">
            <div class="window-header"><span id="head-explorer">ПРОВОДНИК</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-explorer')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-explorer')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-explorer')">X</span></div></div>
            <div class="window-body" id="explorerListContainer"></div>
        </div>
`;
const desktopHTMLContent3 = `
        <div id="win-store" class="os-window" style="width: 360px; height: 320px; top: 15%; left: 60px;">
            <div class="window-header"><span id="head-store">KEEPER STORE</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-store')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-store')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-store')">X</span></div></div>
            <div class="window-body">
                <div class="store-list" id="storeListContainer"></div>
            </div>
        </div>

        <div id="win-settings" class="os-window" style="width: 340px; height: 220px; top: 20%; left: 80px;">
            <div class="window-header"><span id="head-settings">НАСТРОЙКИ</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-settings')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-settings')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-settings')">X</span></div></div>
            <div class="window-body" style="display:flex; flex-direction:column; justify-content:center; align-items:center; gap:10px;">
                <p id="txt-settings-info" style="font-size:12px; text-align:center; line-height:1.4;"></p>
                <button class="trash-btn" id="btn-reset-all" onclick="window.clearAllOSData()" style="border-color:var(--neon-red); color:var(--neon-red); box-shadow: 0 0 10px rgba(255, 51, 51, 0.4); width:100%; padding:12px; font-weight:bold; margin-top:5px;">СТЕРЕТЬ ДАННЫЕ</button>
            </div>
        </div>

        <div id="win-tetris" class="os-window" style="width: 300px; height: 360px; top: 8%; left: 15px;">
            <div class="window-header"><span id="head-tetris">TETRIS.EXE</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-tetris')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-tetris')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-tetris')">X</span></div></div>
            <div class="window-body" style="display:flex; flex-direction:column; align-items:center; justify-content:space-between; overflow:hidden; height:calc(100% - 38px); padding:8px;">
                <div id="tetris-score" style="font-size:14px; font-weight:bold; color:#55ff55; margin-bottom:4px;">СЧЕТ: 0</div>
                <canvas id="tetrisCanvas" style="background:#000; border:2px solid #55ff55; display:block; max-height:220px; aspect-ratio:10/20;"></canvas>
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:4px; width:100%; margin-top:6px;">
                    <button class="trash-btn" style="padding:6px; font-size:11px;" onclick="controlTetris('left')">◀</button>
                    <button class="trash-btn" style="padding:6px; font-size:11px;" onclick="controlTetris('rotate')">🔄</button>
                    <button class="trash-btn" style="padding:6px; font-size:11px;" onclick="controlTetris('right')">▶</button>
                    <button class="trash-btn" style="padding:6px; font-size:11px; grid-column:span 3;" onclick="controlTetris('down')">▼ СКОРОСТЬ</button>
                </div>
            </div>
        </div>

        <div id="win-zip" class="os-window" style="width: 330px; height: 200px; top: 20%; left: 15px;">
            <div class="window-header"><span id="head-zip">АРХИВАТОР - SECRET.ZIP</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-zip')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-zip')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-zip')">X</span></div></div>
            <div class="window-body" id="win-zip-body">
                <p class="txt-zip-locked" style="margin-bottom:10px;">Файл зашифрован ключом AES-256.</p>
                <input type="password" class="zip-input-field" placeholder="...">
                <button class="trash-btn" onclick="checkZipPassword('win-zip')" style="background:#55ff55; color:#000000; font-weight:bold; width:100%; margin-top:10px; text-shadow:none;">ОК</button>
            </div>
        </div>

        <div id="win-zip2" class="os-window" style="width: 330px; height: 200px; top: 25%; left: 20px;">
            <div class="window-header"><span id="head-zip2">АРХИВАТОР - SECRET1.ZIP</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-zip2')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-zip2')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-zip2')">X</span></div></div>
            <div class="window-body" id="win-zip2-body">
                <p class="txt-zip-locked" style="margin-bottom:10px;">Файл зашифрован ключом AES-256.</p>
                <input type="password" class="zip-input-field" placeholder="...">
                <button class="trash-btn" onclick="checkZipPassword('win-zip2')" style="background:#55ff55; color:#000000; font-weight:bold; width:100%; margin-top:10px; text-shadow:none;">ОК</button>
            </div>
        </div>
`;
const desktopHTMLContent3_Part2 = `
        <div id="win-zip3" class="os-window" style="width: 330px; height: 200px; top: 30%; left: 25px;">
            <div class="window-header"><span id="head-zip3">АРХИВАТОР - SECRET2.ZIP</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-zip3')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-zip3')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-zip3')">X</span></div></div>
            <div class="window-body" id="win-zip3-body">
                <p class="txt-zip-locked" style="margin-bottom:10px;">Файл зашифрован ключом AES-256.</p>
                <input type="password" class="zip-input-field" placeholder="...">
                <button class="trash-btn" onclick="checkZipPassword('win-zip3')" style="background:#55ff55; color:#000000; font-weight:bold; width:100%; margin-top:10px; text-shadow:none;">ОК</button>
            </div>
        </div>

        <div id="win-dontopen" class="os-window" style="width: 320px; height: 200px; top: 20%; left: 30px;">
            <div class="window-header"><span id="head-dontopen">НЕ ОТКРЫВАТЬ</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-dontopen')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-dontopen')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-dontopen')">X</span></div></div>
            <div class="window-body" id="nestedFolderBody">
                <span class="nested-folder-link" id="nested-link-0" onclick="advanceNestedFolder(1)">📁 Я СЕРЬЕЗНО</span>
            </div>
        </div>
        
        <div id="win-msg" class="os-window" style="width: 380px; height: 260px; top: 12%; left: 12px;">
            <div class="window-header"><span id="head-msg">МЕССЕНДЖЕР v1.02</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-msg')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-msg')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-msg')">X</span></div></div>
            <div class="window-body" style="padding:0; height:calc(100% - 38px);">
                <div class="msg-container">
                    <div class="msg-left" id="msg-user-list"></div>
                    <div class="msg-right" id="msg-chat-zone"></div>
                </div>
            </div>
        </div>
        
        <div id="win-search" class="os-window" style="width: 330px; height: 180px; top: 40%; left: 8px;">
            <div class="window-header"><span id="head-search">БРАУЗЕР 'ПРИЗРАК'</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-search')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-search')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-search')">X</span></div></div>
            <div class="window-body" id="search-browser-body"></div>
        </div>
        
        <div id="win-dino" class="os-window" style="width: 360px; height: 240px; top: 5%; left: 5px;">
            <div class="window-header"><span id="head-dino">DINO_RUN.EXE</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-dino')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-dino')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-dino')">X</span></div></div>
            <div class="window-body" style="text-align:center; overflow:hidden;">
                <canvas id="dinoCanvas" class="dino-canvas" width="580" height="150"></canvas>
                <div id="dino-hint" style="font-size:11px; margin-top:5px; padding:6px; background:rgba(85,255,85,0.1);">Нажми ПРОБЕЛ / Кликни мышь для прыжка и старта</div>
            </div>
        </div>
        
        <div id="win-blocks" class="os-window" style="width: 320px; height: 460px; top: 2px; left: 2px;">
            <div class="window-header"><span id="head-blocks">BLOCK_BLAST.EXE</span><div class="window-controls"><span class="window-btn" onclick="toggleMaximize('win-blocks')">[ ]</span><span class="window-btn" onclick="minimizeOSWindow('win-blocks')">_</span><span class="window-btn window-close" onclick="closeOSWindow('win-blocks')">X</span></div></div>
            <div class="window-body" style="overflow-y:auto;">
                <div class="bb-container">
                    <div style="font-size:14px; font-weight:bold;" id="bb-score">СЧЕТ: 0</div>
                    <div id="bbBoard" class="bb-board"></div>
                    <div id="bbDock" class="bb-dock"></div>
                    <div id="bb-msg" style="font-size:11px; text-align:center; color:rgba(85,255,85,0.7);">Зажми фигуру и тащи её на доску</div>
                </div>
            </div>
        </div>

        <div class="taskbar">
            <div class="taskbar-left">
                <div class="taskbar-start" id="tb-os-label">KPR-OS v1.0</div>
                <button class="taskbar-lang" id="taskbar-lang-btn" onclick="toggleDesktopLanguage()">RU</button>
                <button class="taskbar-lang" id="taskbar-settings-btn" onclick="window.openOSWindow('win-settings', '⚙', '⚙')" style="border-style:dashed;">⚙</button>
                <button class="taskbar-exit" id="tb-exit-btn" onclick="exitToTerminal()">ВЫХОД</button>
                <div id="taskbar-apps" class="taskbar-apps"></div>
            </div>
            <div id="taskbar-timer" class="taskbar-timer">00:00:00:00</div>
        </div>
    </div>
`;

const divMock = document.createElement('div');
divMock.innerHTML = desktopHTML + desktopHTMLContent3 + desktopHTMLContent3_Part2;
document.body.appendChild(divMock.firstElementChild);
