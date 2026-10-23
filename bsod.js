window.triggerBSOD = function() {
    let bsod = document.getElementById('bsodScreen');
    if (!bsod) {
        bsod = document.createElement('div');
        bsod.id = 'bsodScreen';
        document.body.appendChild(bsod);
    }
    
    bsod.style.cssText = `
        display: block !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: #0000aa !important;
        color: #ffffff !important;
        font-family: 'Courier New', Courier, monospace !important;
        padding: 30px !important;
        box-sizing: border-box !important;
        z-index: 999999 !important;
        user-select: none !important;
        cursor: none !important;
        text-shadow: none !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        text-transform: none !important;
    `;
    
    bsod.innerHTML = `
        <p style="background: #ffffff; color: #0000aa; display: inline-block; padding: 2px 8px; font-weight: bold; margin-bottom: 20px;">A fatal exception has occurred</p>
        <p>A fatal exception 0E has occurred at 0177:BFF9B3D4. The current application will be terminated.</p>
        <p style="margin-top: 15px;">* Press any key to terminate the current application.</p>
        <p>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</p>
        <p style="margin-top: 30px; text-align: center;">Press any key to continue _</p>
    `;

    document.body.style.overflow = 'hidden';
    document.body.style.cursor = 'none';

    const blockEvent = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    window.addEventListener('keydown', blockEvent, true);
    window.addEventListener('keyup', blockEvent, true);
    window.addEventListener('keypress', blockEvent, true);
    window.addEventListener('pointerdown', blockEvent, true);
    window.addEventListener('click', blockEvent, true);
    window.addEventListener('contextmenu', blockEvent, true);
};
