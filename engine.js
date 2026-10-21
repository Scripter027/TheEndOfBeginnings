const bootScreen = document.getElementById('boot-screen'), mainContainer = document.getElementById('main-container');
let bootLine = 0;
function printBootLines() {
    if (bootLine < bootLogs.length) { bootScreen.innerHTML += bootLogs[bootLine] + '<br>'; bootScreen.scrollTop = bootScreen.scrollHeight; bootLine++; setTimeout(printBootLines, 260); }
    else { setTimeout(() => { bootScreen.style.display = 'none'; mainContainer.style.display = 'flex'; document.getElementById('user-input').focus(); }, 300); }
}
printBootLines();
function updateTimer() {
    const distance = targetDate - new Date().getTime(); const label = document.getElementById('countdown'); if (!label) return;
    if (distance < 0) { label.innerHTML = "00:00:00:00"; return; }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24)), hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), seconds = Math.floor((distance % (1000 * 60)) / 1000);
    label.innerHTML = `${days < 10 ? '0' + days : days}:${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}
setInterval(updateTimer, 1000); updateTimer();

const modalOverlay = document.getElementById('modal-overlay'), modalContent = document.getElementById('modal-text-content');
document.getElementById('open-modal-btn').addEventListener('click', () => { modalContent.innerText = langData[currentLang].hackerManifest; modalOverlay.style.display = 'flex'; });
modalOverlay.addEventListener('click', () => { modalOverlay.style.display = 'none'; });

document.getElementById('timer-toggle').addEventListener('click', () => { isSecretMode = !isSecretMode; mainContainer.classList.toggle('secret-active', isSecretMode); document.getElementById('timer-label').innerText = langData[currentLang].labelSecret; });
document.getElementById('lang-btn').addEventListener('click', () => {
    if (isLock) return; langClickCount++; const langBtn = document.getElementById('lang-btn');
    if (langClickCount > 5) {
        isLock = true; const oldText = document.getElementById('response-text').innerHTML; document.getElementById('response-text').innerText = langData[currentLang].rageReply; document.body.classList.add('wrong-flash');
        setTimeout(() => { document.body.classList.remove('wrong-flash'); document.getElementById('response-text').innerHTML = oldText; langClickCount = 0; langBtn.classList.remove('rage-mode'); langBtn.innerText = currentLang === 'ru' ? 'EN' : 'RU'; isLock = false; }, 2500); return;
    }
    const oldLang = currentLang; currentLang = currentLang === 'ru' ? 'en' : 'ru'; langBtn.innerText = langClickCount >= 4 ? langData[currentLang].rageSwitch : (currentLang === 'ru' ? 'EN' : 'RU'); if (langClickCount >= 4) langBtn.classList.add('rage-mode');
    document.getElementById('timer-label').innerText = langData[currentLang].labelSecret; document.getElementById('submit-btn').innerText = langData[currentLang].btnText;
    const outputField = document.getElementById('response-text'), currentText = outputField.innerHTML;
    if (currentText === langData[oldLang].defaultPrompt) { outputField.innerText = langData[currentLang].defaultPrompt; }
    else if (currentStep > 0 && currentStep <= 7 && currentText === langData[oldLang].steps[currentStep - 1].reply) { outputField.innerText = langData[currentLang].steps[currentStep - 1].reply; }
    else if (currentText.includes(tgConfig.link)) { outputField.innerHTML = (currentLang === 'ru' ? tgConfig.textRu : tgConfig.textEn) + `<a href="${tgConfig.link}" target="_blank">${tgConfig.link}</a>`; }
    else { for (const key in langData[oldLang].freeAnswers) { if (currentText === langData[oldLang].freeAnswers[key]) { outputField.innerHTML = langData[currentLang].freeAnswers[key]; break; } } }
});
function triggerInputFlash() { document.getElementById('terminal-input-zone').classList.add('input-flash-active'); setTimeout(() => { document.getElementById('terminal-input-zone').classList.remove('input-flash-active'); }, 450); }
function cleanInputString(str) { let res = str.trim(); if (res === "!!!!!") return res; if (QUEST_CONFIG.shortcuts.instantWin.includes(res)) return res; res = res.toUpperCase(); while (res.length > 0 && ['.', '!', '?', ','].includes(res[res.length - 1])) { res = res.slice(0, -1).trim(); } return res; }

function checkCode() {
    if (isLock) return; const inputField = document.getElementById('user-input'), outputField = document.getElementById('response-text'), rawValue = inputField.value, trimmedValue = rawValue.trim();
    if (trimmedValue.toUpperCase() === 'PLAYMODE') {
        inputField.value = ""; triggerInputFlash(); document.body.classList.add('wrong-flash');
        setTimeout(() => { document.body.classList.remove('wrong-flash'); if(window.activateDesktopMode) window.activateDesktopMode(); }, 1200); return;
    }
    if (trimmedValue === "") { isLock = true; outputField.innerText = langData[currentLang].emptyWrong; document.body.classList.add('wrong-flash'); setTimeout(() => { document.body.classList.remove('wrong-flash'); outputField.innerText = langData[currentLang].defaultPrompt; isLock = false; inputField.focus(); }, 3000); inputField.value = ""; return; }
    if (currentStep === 5 && trimmedValue === "!!!!!") { triggerInputFlash(); outputField.innerText = langData[currentLang].steps[currentStep].reply; currentStep++; inputField.value = ""; langClickCount = 0; return; }
    let cleanCode = cleanInputString(rawValue);
    if (QUEST_CONFIG.shortcuts.instantWin.includes(cleanCode)) { triggerInputFlash(); currentStep = 6; outputField.innerText = langData[currentLang].steps[currentStep].reply; inputField.value = ""; langClickCount = 0; return; }
    if (QUEST_CONFIG.shortcuts.tgLink.includes(cleanCode)) { triggerInputFlash(); outputField.innerHTML = (currentLang === 'ru' ? tgConfig.textRu : tgConfig.textEn) + `<a href="${tgConfig.link}" target="_blank">${tgConfig.link}</a>`; inputField.value = ""; langClickCount = 0; return; }
    if (langData[currentLang].freeAnswers[cleanCode] !== undefined) { triggerInputFlash(); outputField.innerHTML = langData[currentLang].freeAnswers[cleanCode]; inputField.value = ""; langClickCount = 0; return; }
    if (currentStep <= 6) {
        const targetTrigger = QUEST_CONFIG.codes[currentStep][currentLang].toUpperCase();
        if (cleanCode === targetTrigger || cleanCode.includes(targetTrigger)) { triggerInputFlash(); outputField.innerText = langData[currentLang].steps[currentStep].reply; if (currentStep < 6) currentStep++; inputField.value = ""; langClickCount = 0; return; }
    }
    isLock = true; const contemptList = langData[currentLang].contempt, randomContempt = contemptList[Math.floor(Math.random() * contemptList.length)];
    outputField.innerText = `${langData[currentLang].wrong}\n${randomContempt}`; document.body.classList.add('wrong-flash'); inputField.value = "";
    setTimeout(() => { document.body.classList.remove('wrong-flash'); outputField.innerText = langData[currentLang].defaultPrompt; isLock = false; inputField.focus(); }, 3000);
}
document.getElementById('submit-btn').addEventListener('click', checkCode);
document.getElementById('user-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') checkCode(); });
document.getElementById('submit-btn').innerText = langData[currentLang].btnText;
