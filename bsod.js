window.triggerBSOD = function() {
    const bsod = document.getElementById('bsodScreen');
    if (bsod) {
        bsod.style.display = 'block';
        bsod.style.zIndex = '99999';
    }
};

window.closeBSOD = function() {
    const bsod = document.getElementById('bsodScreen');
    if (bsod) {
        bsod.style.display = 'none';
    }
};
