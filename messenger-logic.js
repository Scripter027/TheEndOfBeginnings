window.renderMessengerUsers = function() {
    const listEl = document.getElementById('msg-user-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    const isRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
    const users = [
        { id: 'bro', ru: 'Братан', en: 'Brother' },
        { id: 'mom', ru: 'Мама', en: 'Mom' },
        { id: 'dad', ru: 'Папа', en: 'Dad' }
    ];
    users.forEach(u => {
        const item = document.createElement('div');
        item.className = 'msg-user-item';
        item.innerText = isRu ? u.ru : u.en;
        item.onclick = () => {
            const chatZone = document.getElementById('msg-chat-zone');
            if (chatZone) {
                const currentIsRu = (typeof currentLang !== 'undefined' ? currentLang === 'ru' : true);
                const titleText = currentIsRu ? u.ru : u.en;
                const statusText = currentIsRu ? 'Нет соединения. Канал зашифрован.' : 'No connection. Channel encrypted.';
                chatZone.innerHTML = `
                    <div style="width:100%; height:100%; display:flex; flex-direction:column;">
                        <div style="padding:8px; border-bottom:2px solid #55ff55; font-weight:bold; color:#88ff88; text-align:left; letter-spacing:1px; background:rgba(0,0,0,0.3);">
                            ${titleText.toUpperCase()}
                        </div>
                        <div style="flex:1; display:flex; align-items:center; justify-content:center; padding:15px; color:#55ff55;">
                            ${statusText}
                        </div>
                    </div>
                `;
            }
        };
        listEl.appendChild(item);
    });
};
