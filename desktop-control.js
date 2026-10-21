window.osZIndex = 3000;
window.openOSWindow = function(id) {
    const win = document.getElementById(id);
    if(win) { win.style.display = 'block'; win.style.zIndex = ++window.osZIndex; }
};
window.closeOSWindow = function(id) {
    const win = document.getElementById(id);
    if(win) win.style.display = 'none';
};
window.activateDesktopMode = function() {
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('boot-screen').style.display = 'none';
    document.getElementById('desktop-env').style.display = 'block';
    if (window.initDinoGame) window.initDinoGame();
    if (window.initBlockBlast) window.initBlockBlast();
    if (window.initMessenger) window.initMessenger();
    if (window.initSearchBrowser) window.initSearchBrowser();
    initZipLogic();
};
document.querySelectorAll('.os-window').forEach(win => {
    const header = win.querySelector('.window-header');
    header.onmousedown = function(e) {
        win.style.zIndex = ++window.osZIndex;
        let shiftX = e.clientX - win.getBoundingClientRect().left;
        let shiftY = e.clientY - win.getBoundingClientRect().top;
        function moveAt(pageX, pageY) { win.style.left = pageX - shiftX + 'px'; win.style.top = pageY - shiftY + 'px'; }
        function onMouseMove(e) { moveAt(e.pageX, e.pageY); }
        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function() { document.removeEventListener('mousemove', onMouseMove); document.onmouseup = null; };
    };
    header.ontouchstart = function(e) {
        win.style.zIndex = ++window.osZIndex;
        let touch = e.touches;
        let shiftX = touch.clientX - win.getBoundingClientRect().left;
        let shiftY = touch.clientY - win.getBoundingClientRect().top;
        function onTouchMove(e) { let t = e.touches; win.style.left = t.pageX - shiftX + 'px'; win.style.top = t.pageY - shiftY + 'px'; }
        document.addEventListener('touchmove', onTouchMove);
        document.ontouchend = function() { document.removeEventListener('touchmove', onTouchMove); document.ontouchend = null; };
    };
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
