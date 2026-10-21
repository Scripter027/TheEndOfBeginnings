window.osZIndex = 3000;
window.openWindowsTrack = {};
let desktopLangClicks = 0;

window.openOSWindow = function(id, title, iconStr) {
    if (id === 'win-bsod') {
        document.getElementById('bsodScreen').style.display = 'block';
        return;
    }
    const win = document.getElementById(id);
    if (!win) return;
    win.style.display = 'block';
    win.style.zIndex = ++window.osZIndex;
    if (window.innerWidth < 600) { win.style.left = '4vw'; win.style.top = '10vh'; }
    if (!window.openWindowsTrack[id]) {
        window.openWindowsTrack[id] = iconStr || '📦';
        renderTaskbarApps();
    }
    if (id === 'win-dino' && window.resetDinoGame) window.resetDinoGame();
    if (id === 'win-blocks' && window.resetBlockBlastGame) window.resetBlockBlastGame();
};

window.closeOSWindow = function(id) {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
    delete window.openWindowsTrack[id];
    renderTaskbarApps();
};

window.minimizeOSWindow = function(id) {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
    renderTaskbarApps();
};

window.toggleWindowFromTaskbar = function(id) {
    const win = document.getElementById(id);
    if (!win) return;
    if (win.style.display === 'block') { win.style.display = 'none'; }
    else { win.style.display = 'block'; win.style.zIndex = ++window.osZIndex; }
    renderTaskbarApps();
};

function renderTaskbarApps() {
    const container = document.getElementById('taskbar-apps');
    if (!container) return;
    container.innerHTML = '';
    for (const id in window.openWindowsTrack) {
        const btn = document.createElement('button');
        btn.className = 'taskbar-app-btn';
        const win = document.getElementById(id);
        if (win && win.style.display === 'block') btn.classList.add('active');
        btn.innerText = window.openWindowsTrack[id];
        btn.onclick = () => window.toggleWindowFromTaskbar(id);
        container.appendChild(btn);
    }
}

window.toggleDesktopLanguage = function() {
    desktopLangClicks++;
    if (desktopLangClicks >= 10) {
        const env = document.getElementById('desktop-env');
        const banner = document.getElementById('rageBanner');
        env.classList.add('rage-active');
        banner.style.display = 'block';
        setTimeout(() => {
            env.classList.remove('rage-active');
            banner.style.display = 'none';
            desktopLangClicks = 0;
        }, 10000);
    }

    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    const langBtn = document.getElementById('taskbar-lang-btn');
    if (langBtn) langBtn.innerText = currentLang.toUpperCase();
    const trashBody = document.getElementById('win-trash-body');
    const searchBody = document.getElementById('search-browser-body');
    const zip1Body = document.getElementById('win-zip2-body');
    const zip2Body = document.getElementById('win-zip3-body');
    if (currentLang === 'ru') {
        if(trashBody) trashBody.innerText = "Здесь абсолютно пусто. Файлы стёрты из реальности.";
        if(searchBody) searchBody.innerHTML = "<strong>Ошибка 404:</strong> Нет связи с внешним шлюзом. Локальный прокси-сервер KPR-GATEWAY не отвечает.";
        if(zip1Body) zip1Body.innerHTML = "<p>Локальные метаданные KPR-OS.</p><p style='color:var(--bright-green);margin-top:10px;'>Статус: Архив поврежден временным сдвигом.</p>";
        if(zip2Body) zip2Body.innerHTML = "<p>Манифест: 'Новая Эра близко. Подготовьте терминальные ключи шлюза.'</p>";
    } else {
        if(trashBody) trashBody.innerText = "It is absolutely empty here. Files are erased from reality.";
        if(searchBody) searchBody.innerHTML = "<strong>Error 404:</strong> No connection to the external gateway. Local proxy server KPR-GATEWAY is not responding.";
        if(zip1Body) zip1Body.innerHTML = "<p>Local KPR-OS metadata.</p><p style='color:var(--bright-green);margin-top:10px;'>Status: Archive damaged by time shift.</p>";
        if(zip2Body) zip2Body.innerHTML = "<p>Manifest: 'A New Era is close. Prepare terminal gateway keys.'</p>";
    }
};

window.advanceNestedFolder = function(step) {
    const body = document.getElementById('nestedFolderBody');
    if (step === 1) body.innerHTML = '<span class="nested-folder-link" onclick="advanceNestedFolder(2)">📁 ТЫ ИЗДЕВАЕШЬСЯ</span>';
    else if (step === 2) body.innerHTML = '<span class="nested-folder-link" onclick="advanceNestedFolder(3)">📁 НЕ ОТКРЫВАЙ СКАЗАЛ</span>';
    else if (step === 3) body.innerHTML = '<span class="nested-folder-link" onclick="advanceNestedFolder(4)">📁 ЛАДНО</span>';
    else if (step === 4) body.innerHTML = '<span class="nested-folder-link" onclick="advanceNestedFolder(5)">📁 СМОТРИ РАЗ ХОЧЕШЬ</span>';
    else if (step === 5) body.innerHTML = '<p style="color:var(--bright-green)">[Здесь абсолютно пусто...]</p>';
};

window.activateDesktopMode = function() {
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('boot-screen').style.display = 'none';
    document.getElementById('desktop-env').style.display = 'block';
    const langBtn = document.getElementById('taskbar-lang-btn');
    if (langBtn) langBtn.innerText = currentLang.toUpperCase();
    if (window.initDinoGame) window.initDinoGame();
    if (window.initBlockBlast) window.initBlockBlast();
    if (window.initMessenger) window.initMessenger();
    if (window.initSearchBrowser) window.initSearchBrowser();
    initZipLogic();
};

document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('dblclick', () => {
        window.openOSWindow(icon.dataset.id, icon.dataset.title, icon.dataset.icon);
    });
    
    let lastTap = 0;
    icon.addEventListener('touchend', (e) => {
        let currentTime = new Date().getTime();
        let tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            e.preventDefault();
            window.openOSWindow(icon.dataset.id, icon.dataset.title, icon.dataset.icon);
        }
        lastTap = currentTime;
    });

    icon.addEventListener('pointerdown', function(e) {
        icon.style.zIndex = "5000";
        let shiftX = e.clientX - icon.getBoundingClientRect().left;
        let shiftY = e.clientY - icon.getBoundingClientRect().top;
        
        function moveAt(pageX, pageY) {
            let container = document.getElementById('desktopIconsContainer').getBoundingClientRect();
            let x = pageX - container.left - shiftX;
            let y = pageY - container.top - shiftY;
            icon.style.left = x + 'px'; icon.style.top = y + 'px';
        }
        function onPointerMove(ev) { moveAt(ev.clientX, ev.clientY); }
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', function onUp() {
            icon.style.zIndex = "auto";
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onUp);
        });
    });
});

document.querySelectorAll('.os-window').forEach(win => {
    const header = win.querySelector('.window-header');
    header.addEventListener('pointerdown', function(e) {
        if (e.target.classList.contains('window-btn')) return;
        win.style.zIndex = ++window.osZIndex;
        let shiftX = e.clientX - win.getBoundingClientRect().left;
        let shiftY = e.clientY - win.getBoundingClientRect().top;
        function moveAt(pageX, pageY) {
            let top = pageY - shiftY; if (top < 0) top = 0;
            win.style.left = (pageX - shiftX) + 'px'; win.style.top = top + 'px';
        }
        function onPointerMove(e) { moveAt(e.clientX, e.clientY); }
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', function onUp() {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onUp);
        });
    });
});

function updateTaskbarTimer() {
    const distance = targetDate - new Date().getTime();
    const tbLabel = document.getElementById('taskbar-timer');
    if (!tbLabel) return;
    if (distance < 0) { tbLabel.innerHTML = "00:00:00:00"; return; }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24)), hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), seconds = Math.floor((distance % (1000 * 60)) / 1000);
    tbLabel.innerHTML = `${days < 10 ? '0' + days : days}:${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}
setInterval(updateTaskbarTimer, 1000);

function initZipLogic() {
    const zipBtn = document.getElementById('zip-btn'), zipInput = document.getElementById('zip-input');
    if (!zipBtn) return;
    zipBtn.onclick = function() {
        const val = zipInput.value.trim();
        if (val === "246") { document.getElementById('win-zip').querySelector('.window-body').innerHTML = '<p style="color:var(--bright-green)">АРХИВ ДЕКОДИРОВАН!<br><br>Данные шага 5: Секретная директива Keeper Ent. активна. Используйте триггер логов в главном терминале.</p>'; }
        else { alert('НЕВЕРНЫЙ КЛЮЧ ШИФРОВАНИЯ'); }
    };
}
