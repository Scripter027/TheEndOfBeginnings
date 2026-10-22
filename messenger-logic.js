window.initMessenger = function() {
    const listEl = document.getElementById('msg-user-list');
    const chatEl = document.getElementById('msg-chat-zone');
    if (listEl) listEl.innerHTML = '';
    if (chatEl) chatEl.innerHTML = currentLang === 'ru' ? 'ВЫБЕРИТЕ ПОЛЬЗОВАТЕЛЯ ДЛЯ НАЧАЛА СЕССИИ' : 'SELECT A USER TO START SESSION';
    if (window.renderMessengerUsers) window.renderMessengerUsers();
};

window.renderMessengerUsers = function() {
    const listEl = document.getElementById('msg-user-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    const users = [
        { id: 'bro', ru: 'Братан', en: 'Brother' },
        { id: 'mom', ru: 'Мама', en: 'Mom' },
        { id: 'dad', ru: 'Папа', en: 'Dad' }
    ];
    users.forEach(u => {
        const item = document.createElement('div');
        item.className = 'msg-user-item';
        item.innerText = currentLang === 'ru' ? u.ru : u.en;
        item.onclick = () => {
            const chatZone = document.getElementById('msg-chat-zone');
            if (chatZone) {
                chatZone.innerHTML = currentLang === 'ru' ? 
                    `<strong>${u.ru}:</strong> Нет соединения. Канал зашифрован.` : 
                    `<strong>${u.en}:</strong> No connection. Channel encrypted.`;
            }
        };
        listEl.appendChild(item);
    });
};
