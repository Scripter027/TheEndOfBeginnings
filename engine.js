(function startSystemInit() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const pwaOverlay = document.getElementById('pwa-install-overlay');
    
    if (isMobile && !isStandalone && pwaOverlay) {
        pwaOverlay.style.display = 'flex';
        return;
    }

    const bootScr = document.getElementById('boot-screen');
    const mainCont = document.getElementById('main-container');
    if (bootScr) bootScr.style.display = 'none';
    if (mainCont) mainCont.style.display = 'none';

    if (window.activateDesktopMode) {
        window.activateDesktopMode();
    }
})();

function updateTimer() {
    if (typeof targetDate === 'undefined') return;
    const distance = targetDate - new Date().getTime(); 
    const label = document.getElementById('countdown'); 
    if (!label) return;
    if (distance < 0) { 
        label.innerHTML = "00:00:00:00"; 
        return; 
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    label.innerHTML = `${days < 10 ? '0' + days : days}:${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}
setInterval(updateTimer, 1000); 
updateTimer();
