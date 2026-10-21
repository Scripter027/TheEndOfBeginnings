window.initMessenger = function() {
    const listEl = document.getElementById('msg-user-list');
    const chatEl = document.getElementById('msg-chat-zone');
    if (listEl) listEl.innerHTML = '[СПИСОК ПУСТ]';
    if (chatEl) chatEl.innerHTML = 'ВЫБЕРИТЕ ПОЛЬЗОВАТЕЛЯ ДЛЯ НАЧАЛА СЕССИИ';
    if (window.renderMessengerUsers) window.renderMessengerUsers();
};
