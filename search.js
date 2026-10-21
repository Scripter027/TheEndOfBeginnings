window.initSearchBrowser = function() {
    const bodyEl = document.getElementById('search-browser-body');
    if (bodyEl) bodyEl.innerHTML = '<strong>Ошибка 404:</strong> Нет связи с внешним шлюзом. Локальный прокси-сервер KPR-GATEWAY не отвечает.';
};
