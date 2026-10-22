document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('dblclick', () => { 
        if(icon.style.display !== 'none') {
            window.openOSWindow(icon.dataset.id, currentLang === 'ru' ? icon.dataset.titleRu : icon.dataset.titleEn, icon.dataset.icon); 
        }
    });
    
    let lastTap = 0;
    icon.addEventListener('touchend', (e) => {
        let currentTime = new Date().getTime(); 
        let tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0 && icon.style.display !== 'none') { 
            e.preventDefault(); 
            window.openOSWindow(icon.dataset.id, currentLang === 'ru' ? icon.dataset.titleRu : icon.dataset.titleEn, icon.dataset.icon); 
        }
        lastTap = currentTime;
    });

    icon.addEventListener('pointerdown', function(e) {
        if (icon.style.display === 'none') return;
        
        if (icon.id === 'icon-win-trash' || icon.id === 'icon-win-explorer' || icon.id === 'icon-win-store') {
            let initialTop = icon.offsetTop;
            let initialLeft = icon.offsetLeft;
            setTimeout(() => { 
                if(icon.offsetTop === initialTop && icon.offsetLeft === initialLeft && icon.style.display !== 'none') {
                    window.openOSWindow(icon.dataset.id, currentLang === 'ru' ? icon.dataset.titleRu : icon.dataset.titleEn, icon.dataset.icon); 
                }
            }, 200);
        }
        
        icon.style.zIndex = "5000"; 
        let shiftX = e.clientX - icon.getBoundingClientRect().left; 
        let shiftY = e.clientY - icon.getBoundingClientRect().top;
        let oldTop = icon.style.top;
        let oldLeft = icon.style.left;
        
        function moveAt(pageX, pageY) {
            let containerEl = document.getElementById('desktopIconsContainer');
            if (!containerEl) return;
            let container = containerEl.getBoundingClientRect();
            let x = pageX - container.left - shiftX; 
            let y = pageY - container.top - shiftY;
            icon.style.left = x + 'px'; 
            icon.style.top = y + 'px';
        }
        
        function onPointerMove(ev) { moveAt(ev.clientX, ev.clientY); }
        document.addEventListener('pointermove', onPointerMove);
        
        document.addEventListener('pointerup', function onUp(ev) {
            icon.style.zIndex = "auto"; 
            document.removeEventListener('pointermove', onPointerMove); 
            document.removeEventListener('pointerup', onUp);
            
            let snap = (window.snapToGrid && typeof window.snapToGrid === 'function') ? window.snapToGrid(ev.clientX - shiftX, ev.clientY - shiftY) : { x: ev.clientX - shiftX, y: ev.clientY - shiftY }; 
            const trashIcon = document.getElementById('icon-win-trash');
            
            if (icon.id !== 'icon-win-trash' && icon.id !== 'icon-win-explorer' && icon.id !== 'icon-win-store' && trashIcon && snap.x === trashIcon.offsetLeft && snap.y === trashIcon.offsetTop) {
                icon.style.display = 'none'; 
                window.closeOSWindow(icon.dataset.id);
                if (typeof trashedApps !== 'undefined') {
                    trashedApps[icon.id] = { ru: icon.dataset.titleRu, en: icon.dataset.titleEn }; 
                    localStorage.setItem('kpr_trashed_apps', JSON.stringify(trashedApps));
                }
                if (typeof renderTrashList === 'function') renderTrashList(); 
                if (typeof renderExplorerList === 'function') renderExplorerList(); 
                if (window.renderStoreList) window.renderStoreList();
                icon.style.left = oldLeft; 
                icon.style.top = oldTop; 
                return;
            }
            
            let overlap = false;
            document.querySelectorAll('.icon').forEach(other => { 
                if (other !== icon && other.style.display !== 'none' && other.offsetLeft === snap.x && other.offsetTop === snap.y) overlap = true; 
            });
            
            if (overlap) { 
                icon.style.left = oldLeft; 
                icon.style.top = oldTop; 
                return; 
            }
            
            icon.style.left = snap.x + 'px'; 
            icon.style.top = snap.y + 'px';
            
            try {
                let positions = JSON.parse(localStorage.getItem('kpr_icon_positions')) || {};
                positions[icon.id] = { left: icon.style.left, top: icon.style.top }; 
                localStorage.setItem('kpr_icon_positions', JSON.stringify(positions));
            } catch(err) {}
        });
    });
});

document.querySelectorAll('.os-window').forEach(win => {
    let header = win.querySelector('.window-header');
    if (!header) return;
    header.addEventListener('pointerdown', function(e) {
        if (e.target.classList.contains('window-btn') || win.classList.contains('maximized')) return;
        win.style.zIndex = ++window.osZIndex; 
        let shiftX = e.clientX - win.getBoundingClientRect().left; 
        let shiftY = e.clientY - win.getBoundingClientRect().top;
        
        function moveAt(pageX, pageY) { 
            let top = pageY - shiftY; 
            if (top < 0) top = 0; 
            win.style.left = (pageX - shiftX) + 'px'; 
            win.style.top = top + 'px'; 
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
    if (typeof targetDate === 'undefined') return;
    const distance = targetDate - new Date().getTime(); 
    const tbLabel = document.getElementById('taskbar-timer'); 
    if (!tbLabel) return;
    if (distance < 0) { 
        tbLabel.innerHTML = "00:00:00:00"; 
        return; 
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const dStr = days < 10 ? '0' + days : days;
    const hStr = hours < 10 ? '0' + hours : hours;
    const mStr = minutes < 10 ? '0' + minutes : minutes;
    const sStr = seconds < 10 ? '0' + seconds : seconds;
    
    window.requestAnimationFrame(() => {
        if (tbLabel) tbLabel.innerHTML = dStr + ':' + hStr + ':' + mStr + ':' + sStr;
    });
}
setInterval(updateTaskbarTimer, 1000);
updateTaskbarTimer();
