(function initThemeAdjustmentsModule() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    function applyDynamicLayouts() {
        const desktop = document.getElementById('desktop-env');
        if (!desktop) return;

        if (isMobile) {
            desktop.style.padding = '5px';
        } else {
            desktop.style.padding = '15px';
        }

        const windows = document.querySelectorAll('.os-window');
        windows.forEach(win => {
            if (win.style.display === 'block') {
                const body = win.querySelector('.window-body');
                if (body) {
                    body.style.display = 'block';
                }
            }
        });

        const activeWindow = document.querySelector('.os-window[style*="display: block"]');
        if (activeWindow && window.osZIndex) {
            activeWindow.style.zIndex = ++window.osZIndex;
        }
    }

    function setupThemeObservers() {
        const container = document.getElementById('desktop-windows-container');
        if (!container) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    applyDynamicLayouts();
                }
            });
        });

        observer.observe(container, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['style', 'class']
        });
    }

    window.addEventListener('resize', applyDynamicLayouts);

    document.addEventListener('DOMContentLoaded', () => {
        applyDynamicLayouts();
        setupThemeObservers();
    });

    window.applySystemThemeAdjustments = applyDynamicLayouts;
})();
