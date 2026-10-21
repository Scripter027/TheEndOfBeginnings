const targetDate = new Date('2027-02-22T00:00:00').getTime();
let currentLang = 'ru', isSecretMode = false, isLock = false, currentStep = 0, langClickCount = 0;
const tgConfig = { link: "https://t.me", textRu: "Линк: ", textEn: "Link: " };

const bootLogs = [
    "ROM BIOS v4.01-KEEPER ENTERTAINMENT STAGE 1", "COPYRIGHT (C) 2026-2027 KEEPER ENT. ALL RIGHTS RESERVED.",
    "---------------------------------------------------------", "CPU: KPR-QUANTUM PRO AT 8.44 GHz",
    "TESTING RAM: 65536 KB ... OK", "DETECTING HARD DISK DRIVES ... PRIMARY MASTER: KPR-MASSIVE-SSD 2.04TB",
    "LOAD SECTORS: 0x00FF32 -> 0x77FFA1 ... OK", "INITIALIZING MOUSE AND KEYBOARD BUSSES ... OK",
    "GRAPHICS CARD: EMULATOR CRT-TUBE-NEON 512MB ... MATCHED", "LOADING KERNEL INTERFACE ... SUCCESS",
    "CONNECTING SECURE UPLINK CHANNELS...", "ESTABLISHING ROUTING THROUGH KPR-GATEWAY...",
    "ENCRYPTING SESSION ID ... AES-X-256 ACTIVE", "STATUS: ACCESS GRANTED TO KEEPER MAIN TERMINAL.", "RUNNING SYSTEM..."
];

const QUEST_CONFIG = {
    codes: {
        0: { ru: "ПАРОЛЬ", en: "PASSWORD" },
        1: { ru: "16", en: "16" },
        2: { ru: "ПБГ", en: "YOURSELF" },
        3: { ru: "САМ", en: "YOURSELF" },
        4: { ru: "246", en: "246" },
        5: { ru: "!!!!!", en: "!!!!!" },
        6: { ru: "VA*ФWN%ЧИ+ADЬS>РФ$ЛНХЯ'XW1%ЙКL_5ЧIGPТЫОИ]?ЕJE#", en: "VA*ФWN%ЧИ+ADЬS>РФ$ЛНХЯ'XW1%ЙКL_5ЧIGPТЫОИ]?ЕJE#" }
    },
    shortcuts: {
        tgLink: ["НОВАЯ ЭРА", "NEW ERA"],
        instantWin: ["VA*ФWN%ЧИ+ADЬS>РФ$ЛНХЯ'XW1%ЙКL_5ЧIGPТЫОИ]?ЕJE#"]
    }
};

const langData = {
    ru: {
        defaultPrompt: "ВВЕДИТЕ ПАРОЛЬ", labelSecret: "До момента x осталось:", wrong: "НЕПРАВИЛЬНО.", emptyWrong: "НЕПРАВИЛЬНО. СЕРЬЕЗНО? ПУСТАЯ СТРОКА?", btnText: "ВВОД", rageSwitch: "СИСТЕМА УДАЛЕНИЯ", rageReply: "ХВАТИТ ИГРАТЬСЯ! ЭТО НЕ ИГРУШКИ!",
        hackerManifest: "Тем, кто любит смотреть в код! \n\nМы прекрасно понимаем, что вы хотите увидеть все пароли. И знаем, что это можно сделать, подсмотрев в код. Но этот сайт был создан для того, чтобы вы сами опробовали свои силы и подумали, какой может быть пароль. Подсмотрев в код, вы вероятно облегчите задачу, но явно не честно. Мы настоятельно просим вас этого не делать!",
        steps: {
            0: { trigger: "ПАРОЛЬ", reply: "Серьезо? Ты жалок. Ладно дам подсказку - 12 + 4." },
            1: { trigger: "16", reply: "Молодец! Кстати столько лет подряд ИИ подбирал бы пароль. Скажи слово побег но без о и е" },
            2: { trigger: "ПБГ", reply: "ладно на самом деле у меня нет пароля. Прости, но разбирайся *сам*" },
            3: { trigger: "САМ", reply: "я же сказал у ме123+123ня ничего нет! Я чист!" },
            4: { trigger: "246", reply: "ДОВОЛЬНО! У МЕНЯ НЕТ ПАРОЛЯ! *!!!!!*" },
            5: { trigger: "!!!!!", reply: "Вот пароль! Подавись им и прочь отсюда: va*фwn%чи+adьs>рф$лнхя'xw1%йкl_5чigpтыои]?еje# !" },
            6: { trigger: "VA*ФWN%ЧИ+ADЬS>РФ$ЛНХЯ'XW1%ЙКL_5ЧIGPТЫОИ]?ЕJE#", reply: "Новая Эра Keeper Ent. вот вот начнется." }
        },
        contempt: ["Хватит тратить мое время.", "Ты бесполезен.", "Доступ запрещен.", "Этот ответ не имеет значения.", "Разговор окончен."],
        freeAnswers: { "67": "Перестань деградировать и займись делом!", "БУРМАЛДА": "не ну ты молодец конечно что за молодежные мемчики шаришь, но это не пароль!", "ПРИВЕТ": "Пока до тех пор пока не найдешь пароль!" }
    },
    en: {
        defaultPrompt: "ENTER PASSWORD", labelSecret: "Until moment x left:", wrong: "WRONG.", emptyWrong: "WRONG. SERIOUSLY? EMPTY LINE?", btnText: "SUBMIT", rageSwitch: "UNFRIEND SYSTEM", rageReply: "STOP PLAYING AROUND! THIS IS NOT A TOY!",
        hackerManifest: "To those who love looking at the code!",
        steps: {
            0: { trigger: "PASSWORD", reply: "Seriously? You are pathetic. Fine, I'll give you a hint - 12 + 4." },
            1: { trigger: "16", reply: "Well done!" },
            2: { trigger: "YOURSELF", reply: "deal with it yourself" },
            3: { trigger: "YOURSELF", reply: "I have nothing!" },
            4: { trigger: "246", reply: "ENOUGH!" },
            5: { trigger: "!!!!!", reply: "Choke on it!" },
            6: { trigger: "VA*ФWN%ЧИ+ADЬS>РФ$ЛНХЯ'XW1%ЙКL_5ЧIGPТЫОИ]?ЕJE#", reply: "A New Era is about to begin." }
        },
        contempt: ["Stop wasting my time.", "Access denied."],
        freeAnswers: { "HELLO": "Bye!" }
    }
};
