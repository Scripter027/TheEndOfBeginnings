window.runSystemLoader = function(onComplete) {
    let loader = document.getElementById('global-system-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-system-loader';
        loader.className = 'global-loader-overlay';
        loader.innerHTML = `
            <div class="loader-canvas-node">
                <div class="loader-line-draw l-top"></div>
                <div class="loader-line-draw l-right"></div>
                <div class="loader-line-draw l-bottom"></div>
                <div class="loader-line-draw l-left"></div>
            </div>
            <div class="loader-text" id="loader-text-node">ЗАГРУЗКА</div>
        `;
        document.body.appendChild(loader);
    }

    const txtNode = loader.querySelector('#loader-text-node');
    if (txtNode) {
        txtNode.innerText = (typeof currentLang !== 'undefined' && currentLang === 'en') ? "LOADING" : "ЗАГРУЗКА";
    }

    loader.style.display = 'flex';
    void loader.offsetWidth;
    loader.style.opacity = '1';

    setTimeout(() => {
        let opacity = 1;
        const fadeInterval = setInterval(() => {
            opacity -= 0.1;
            loader.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(fadeInterval);
                loader.style.display = 'none';
                if (onComplete) onComplete();
            }
        }, 30);
    }, 3000);
};
