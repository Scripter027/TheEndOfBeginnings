(function checkDeviceAccess() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const pwaOverlay = document.getElementById('pwa-install-overlay');
    const bootScr = document.getElementById('boot-screen');
    if (isMobile && !isStandalone && pwaOverlay) {
        pwaOverlay.style.display = 'flex';
        return;
    }
    if (bootScr) {
        bootScr.style.display = 'block';
    }
    setTimeout(printBootLines, 500);
})();

const bootScreen = document.getElementById('boot-screen');
const mainContainer = document.getElementById('main-container');
let bootLine = 0;

function printBootLines() {
    if (!bootScreen) {
        if (mainContainer) mainContainer.style.display = 'flex';
        return;
    }
    if (typeof bootLogs !== 'undefined' && bootLine < bootLogs.length) { 
        bootScreen.innerHTML += bootLogs[bootLine] + '<br>'; 
        bootScreen.scrollTop = bootScreen.scrollHeight; 
        bootLine++; 
        setTimeout(printBootLines, 260); 
    } else { 
        setTimeout(() => { 
            bootScreen.style.display = 'none'; 
            if (mainContainer) mainContainer.style.display = 'flex'; 
            const inputField = document.getElementById('user-input');
            if (inputField) inputField.focus();
            const outputField = document.getElementById('response-text');
            if (outputField && typeof langData !== 'undefined' && langData[currentLang]) {
                outputField.innerText = langData[currentLang].defaultPrompt;
            }
        }, 300); 
    }
}

function updateTimer() {
    if (typeof targetDate === 'undefined') return;
    const distance = targetDate - new Date().getTime(); 
    const label = document.getElementById('countdown'); 
    if (!label) return;
    if (distance < 0) { 
        label.innerHTML = "00:00:00:00"; 
        return; 
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    label.innerHTML = `${days < 10 ? '0' + days : days}:${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}
setInterval(updateTimer, 1000); 
updateTimer();

const openModalBtn = document.getElementById('open-modal-btn');
if (openModalBtn) {
    openModalBtn.addEventListener('click', () => { 
        const modalOverlay = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-text-content');
        if (modalContent && typeof langData !== 'undefined' && langData[currentLang]) {
            modalContent.innerText = langData[currentLang].hackerManifest; 
        }
        if (modalOverlay) modalOverlay.style.display = 'flex'; 
    });
}

const modalOverlayEl = document.getElementById('modal-overlay');
if (modalOverlayEl) {
    modalOverlayEl.addEventListener('click', () => { 
        modalOverlayEl.style.display = 'none'; 
    });
}
const timerToggle = document.getElementById('timer-toggle');
if (timerToggle) {
    timerToggle.addEventListener('click', () => { 
        isSecretMode = !isSecretMode; 
        if (mainContainer) mainContainer.classList.toggle('secret-active', isSecretMode); 
        const timerLabel = document.getElementById('timer-label');
        if (timerLabel && typeof langData !== 'undefined' && langData[currentLang]) {
            timerLabel.innerText = langData[currentLang].labelSecret; 
        }
    });
}

const langBtnEl = document.getElementById('lang-btn');
if (langBtnEl) {
    langBtnEl.addEventListener('click', () => {
        if (isLock) return; 
        langClickCount++; 
        const outputField = document.getElementById('response-text');
        const submitBtn = document.getElementById('submit-btn');
        const timerLabel = document.getElementById('timer-label');
        if (langClickCount > 5) {
            isLock = true; 
            const oldText = outputField ? outputField.innerHTML : ''; 
            if (outputField && typeof langData !== 'undefined' && langData[currentLang]) {
                outputField.innerText = langData[currentLang].rageReply; 
            }
            document.body.classList.add('wrong-flash');
            setTimeout(() => { 
                document.body.classList.remove('wrong-flash'); 
                if (outputField) outputField.innerHTML = oldText; 
                langClickCount = 0; 
                langBtnEl.classList.remove('rage-mode'); 
                langBtnEl.innerText = currentLang === 'ru' ? 'EN' : 'RU'; 
                isLock = false; 
            }, 2500); 
            return;
        }
        const oldLang = currentLang; 
        currentLang = currentLang === 'ru' ? 'en' : 'ru'; 
        langBtnEl.innerText = langClickCount >= 4 ? langData[currentLang].rageSwitch : (currentLang === 'ru' ? 'EN' : 'RU'); 
        if (langClickCount >= 4) langBtnEl.classList.add('rage-mode');
        if (timerLabel && typeof langData !== 'undefined' && langData[currentLang]) timerLabel.innerText = langData[currentLang].labelSecret; 
        if (submitBtn && typeof langData !== 'undefined' && langData[currentLang]) submitBtn.innerText = langData[currentLang].btnText;
        if (!outputField || typeof langData === 'undefined') return;
        const currentText = outputField.innerHTML;
        if (currentText === langData[oldLang].defaultPrompt) { 
            outputField.innerText = langData[currentLang].defaultPrompt; 
        } else if (currentStep > 0 && currentStep <= 7 && langData[oldLang].steps[currentStep - 1] && currentText === langData[oldLang].steps[currentStep - 1].reply) { 
            outputField.innerText = langData[currentLang].steps[currentStep - 1].reply; 
        } else if (currentText.includes(tgConfig.link)) { 
            outputField.innerHTML = (currentLang === 'ru' ? tgConfig.textRu : tgConfig.textEn) + `<a href="${tgConfig.link}" target="_blank">${tgConfig.link}</a>`; 
        } else { 
            for (const key in langData[oldLang].freeAnswers) { 
                if (currentText === langData[oldLang].freeAnswers[key]) { 
                    outputField.innerHTML = langData[currentLang].freeAnswers[key]; 
                    break; 
                } 
            } 
        }
    });
}

function triggerInputFlash() { 
    const flashZone = document.getElementById('terminal-input-zone');
    if (flashZone) {
        flashZone.classList.add('input-flash-active'); 
        setTimeout(() => { flashZone.classList.remove('input-flash-active'); }, 450); 
    }
}

function cleanInputString(str) { 
    let res = str.trim(); 
    if (res === "!!!!!") return res; 
    res = res.toUpperCase(); 
    while (res.length > 0 && ['.', '!', '?', ','].includes(res[res.length - 1])) { 
        res = res.slice(0, -1).trim(); 
    } 
    return res; 
}

function checkCode() {
    if (isLock) return; 
    const inputField = document.getElementById('user-input');
    const outputField = document.getElementById('response-text');
    if (!inputField || !outputField) return;
    const rawValue = inputField.value;
    const trimmedValue = rawValue.trim();
    if (trimmedValue.toUpperCase() === 'PLAYMODE') {
        inputField.value = ""; 
        triggerInputFlash(); 
        isLock = true;
        outputField.innerText = "INITIALIZING DEPLOYMODE...";
        setTimeout(() => {
            outputField.innerHTML = 'LOADING KPR-OS OS...<br><div style="width:100%; border:2px solid var(--neon-green); height:20px; position:relative; margin-top:10px;"><div id="pm-progress" style="width:0%; background:var(--neon-green); height:100%; transition:width 0.1s linear;"></div></div>';
            const prog = document.getElementById('pm-progress');
            let w = 0;
            const iv = setInterval(() => {
                w += 5; 
                if(prog) prog.style.width = w + '%';
                if(w >= 100) {
                    clearInterval(iv);
                    setTimeout(() => {
                        if (mainContainer) mainContainer.style.display = 'none';
                        if (bootScreen) bootScreen.style.display = 'none';
                        isLock = false;
                        if(window.activateDesktopMode) window.activateDesktopMode();
                    }, 400);
                }
            }, 100);
        }, 1000);
        return;
    }
    if (trimmedValue === "") { 
        isLock = true; 
        outputField.innerText = langData[currentLang].emptyWrong; 
        document.body.classList.add('wrong-flash'); 
        setTimeout(() => { 
            document.body.classList.remove('wrong-flash'); 
            outputField.innerText = langData[currentLang].defaultPrompt; 
            isLock = false; 
            inputField.focus(); 
        }, 3000); 
        inputField.value = ""; 
        return; 
    }
    if (currentStep === 5 && trimmedValue === "!!!!!") { 
        triggerInputFlash(); 
        outputField.innerText = langData[currentLang].steps[currentStep].reply; 
        currentStep++; 
        inputField.value = ""; 
        langClickCount = 0; 
        return; 
    }
    let cleanCode = cleanInputString(rawValue);
    if (cleanCode === "НОВАЯ ЭРА" || cleanCode === "NEW ERA") { 
        triggerInputFlash(); 
        outputField.innerHTML = (currentLang === 'ru' ? tgConfig.textRu : tgConfig.textEn) + `<a href="${tgConfig.link}" target="_blank">${tgConfig.link}</a>`; 
        inputField.value = ""; 
        langClickCount = 0; 
        return; 
    }
    if (typeof langData !== 'undefined' && langData[currentLang].freeAnswers[cleanCode] !== undefined) { 
        triggerInputFlash(); 
        outputField.innerHTML = langData[currentLang].freeAnswers[cleanCode]; 
        inputField.value = ""; 
        langClickCount = 0; 
        return; 
    }
    if (typeof QUEST_CONFIG !== 'undefined' && currentStep <= 6) {
        const targetTrigger = langData[currentLang].steps[currentStep].trigger.toUpperCase();
        if (cleanCode === targetTrigger || cleanCode.includes(targetTrigger)) { 
            triggerInputFlash(); 
            outputField.innerText = langData[currentLang].steps[currentStep].reply; 
            if (currentStep < 6) currentStep++; 
            inputField.value = ""; 
            langClickCount = 0; 
            return; 
        }
    }
    isLock = true; 
    const contemptList = langData[currentLang].contempt;
    const randomContempt = contemptList[Math.floor(Math.random() * contemptList.length)];
    outputField.innerText = `${langData[currentLang].wrong}\n${randomContempt}`; 
    document.body.classList.add('wrong-flash'); 
    inputField.value = "";
    setTimeout(() => { 
        document.body.classList.remove('wrong-flash'); 
        outputField.innerText = langData[currentLang].defaultPrompt; 
        isLock = false; 
        inputField.focus(); 
    }, 3000); 
}

const submitBtnEl = document.getElementById('submit-btn');
if (submitBtnEl) {
    submitBtnEl.addEventListener('click', checkCode);
}

const userInputEl = document.getElementById('user-input');
if (userInputEl) {
    userInputEl.addEventListener('keydown', (e) => { 
        if (e.key === 'Enter') checkCode(); 
    });
}
