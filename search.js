window.initSearchBrowser = function() {
    const bodyEl = document.getElementById('search-browser-body');
    if (!bodyEl) return;
    
    bodyEl.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:10px; width:100%; height:100%;">
            <div style="font-size:20px; font-weight:bold; text-align:center; color:#55ff55; letter-spacing:2px; margin-bottom:5px;">GHOST_SEARCH</div>
            <div style="display:flex; gap:6px; width:100%;">
                <input type="text" id="browser-search-input" placeholder="${currentLang==='ru'?'Введите запрос...':'Search the web...'}" style="flex:1; background:rgba(0,0,0,0.6); border:2px solid #55ff55; color:#55ff55; padding:8px; font-size:13px; outline:none;">
                <button class="trash-btn" onclick="executeBrowserSearch()" style="padding:4px 12px;">GO</button>
            </div>
            <div id="browser-results-zone" style="flex:1; border:2px solid #55ff55; background:rgba(0,0,0,0.4); padding:8px; overflow-y:auto; font-size:11px; display:flex; flex-direction:column; gap:10px;">
                <span style="color:rgba(85,255,85,0.5); text-align:center; margin-top:20px;">${currentLang==='ru'?'ОЖИДАНИЕ ЗАПРОСА...':'AWAITING REQUEST...'}</span>
            </div>
        </div>
    `;

    const input = document.getElementById('browser-search-input');
    if (input) {
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') executeBrowserSearch(); });
    }
};

window.executeBrowserSearch = function() {
    const input = document.getElementById('browser-search-input');
    const zone = document.getElementById('browser-results-zone');
    if (!input || !zone) return;

    const query = input.value.trim().toUpperCase();
    zone.innerHTML = '';
    const isRu = (currentLang === 'ru');

    if (query === '') {
        zone.innerHTML = `<span style="color:var(--neon-red);">${isRu?'ПУСТОЙ ЗАПРОС.':'EMPTY QUERY.'}</span>`;
        return;
    }

    if (query.includes('KEEPER') || query.includes('KPR') || query.includes('КИПЕР')) {
        zone.innerHTML = `
            <div>
                <a style="color:#88ff88; font-weight:bold; text-decoration:underline;">Keeper Entertainment Inc.</a>
                <p style="margin-top:2px; color:rgba(85,255,85,0.8);">${isRu?'ОФИЦИАЛЬНЫЙ САЙТ ЗАБЛОКИРОВАН ВАШИМ ПРОВАЙДЕРОМ. КОД ОШИБКИ: GATEWAY_RESTR_09. СВЯЖИТЕСЬ С АДМИНИСТРАТОРОМ СЕТИ.':'OFFICIAL WEBSITE BLOCKED BY YOUR PROVIDER. ERROR CODE: GATEWAY_RESTR_09. CONTACT NETWORK ADMIN.'}</p>
            </div>
        `;
    } else if (query.includes('ПАРОЛЬ') || query.includes('PASSWORD')) {
        zone.innerHTML = `
            <div>
                <a style="color:#88ff88; font-weight:bold; text-decoration:underline;">How to crack KPR Terminal Bus</a>
                <p style="margin-top:2px; color:rgba(85,255,85,0.8);">${isRu?'ФОРУМ ДЕЦЕНТРАЛИЗОВАННОЙ СЕТИ: "СИСТЕМНЫЙ СБРОС ОСУЩЕСТВЛЯЕТСЯ КОМАНДОЙ PLAYMODE ИЗ ГЛАВНОГО ОКОННОГО ТЕРМИНАЛА СОХРАНЕНИЯ."':'DECENTRALIZED FORUM: "SYSTEM RESET IS EXECUTED VIA PLAYMODE COMMAND FROM THE MAIN WINDOW TERMINAL SAVE." neighborhood.'}</p>
            </div>
        `;
    } else {
        zone.innerHTML = `
            <div>
                <div style="font-weight:bold; color:var(--neon-red);">${isRu?'РЕЗУЛЬТАТОВ НЕ НАЙДЕНО':'NO RESULTS FOUND'}</div>
                <p style="margin-top:2px; color:rgba(85,255,85,0.6);">${isRu?'Запрос не совпадает со списками локального прокси KPR-GATEWAY. Внешний интернет отключен.':'Query does not match local KPR-GATEWAY proxy tables. External web access offline.'}</p>
            </div>
            <div>
                <span style="color:rgba(85,255,85,0.5); text-decoration:underline; cursor:pointer;" onclick="document.getElementById('browser-search-input').value='KEEPER'; executeBrowserSearch();">${isRu?'Возможно, вы искали: KEEPER':'Did you mean: KEEPER'}</span>
            </div>
        `;
    }
};
