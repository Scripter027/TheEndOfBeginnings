window.GRID_X = 100;
window.GRID_Y = 90;
window.PADDING_OFFSET = 20;

window.getFirstAvailableSlot = function() {
    const container = document.getElementById('desktopIconsContainer');
    if (!container) return { left: window.PADDING_OFFSET + 'px', top: window.PADDING_OFFSET + 'px' };
    
    const bounds = container.getBoundingClientRect();
    const maxCols = Math.floor((bounds.width - window.PADDING_OFFSET) / window.GRID_X) || 1;
    const maxRows = Math.floor((bounds.height - window.PADDING_OFFSET) / window.GRID_Y) || 1;
    const icons = document.querySelectorAll('.icon');
    
    for (let c = 0; c < maxCols; c++) {
        for (let r = 0; r < maxRows; r++) {
            const testX = c * window.GRID_X + window.PADDING_OFFSET;
            const testY = r * window.GRID_Y + window.PADDING_OFFSET;
            let occupied = false;
            
            icons.forEach(icon => {
                if (icon.style.display !== 'none') {
                    const iconX = parseInt(icon.style.left) || 0;
                    const iconY = parseInt(icon.style.top) || 0;
                    if (Math.abs(iconX - testX) < 10 && Math.abs(iconY - testY) < 10) {
                        occupied = true;
                    }
                }
            });
            
            if (!occupied) {
                return { left: testX + 'px', top: testY + 'px' };
            }
        }
    }
    return { left: window.PADDING_OFFSET + 'px', top: window.PADDING_OFFSET + 'px' };
};

window.snapToGrid = function(x, y) {
    const container = document.getElementById('desktopIconsContainer');
    const bounds = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
    
    let localX = x - bounds.left;
    let localY = y - bounds.top;
    
    let snapX = Math.round((localX - window.PADDING_OFFSET) / window.GRID_X) * window.GRID_X + window.PADDING_OFFSET;
    let snapY = Math.round((localY - window.PADDING_OFFSET) / window.GRID_Y) * window.GRID_Y + window.PADDING_OFFSET;
    
    if (snapX < window.PADDING_OFFSET) snapX = window.PADDING_OFFSET;
    if (snapY < window.PADDING_OFFSET) snapY = window.PADDING_OFFSET;
    
    return { x: snapX, y: snapY };
};
