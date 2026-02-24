// ==============================
// FIREBASE CONFIG
// ==============================
const firebaseConfig = {
    apiKey: "AIzaSyDyMDljblBST0UTimxzfDFVR0RHBYJEkpk",
    authDomain: "jagd-app-silbersbach.firebaseapp.com",
    projectId: "jagd-app-silbersbach",
    storageBucket: "jagd-app-silbersbach.firebasestorage.app",
    messagingSenderId: "243860338509",
    appId: "1:243860338509:web:40aa7818742f594bc62904",
    measurementId: "G-ETVC5YJFT9"
};

// ==============================
// UTILS & PLATFORM CHECK
// ==============================
function isNativeApp() {
    return window.Capacitor && window.Capacitor.getPlatform() !== 'web';
}

// ==============================
// JAGDZEITEN BAYERN - Daten
// ==============================
const jagdzeitenBayern = [
    // ===== SCHALENWILD =====
    { id: "rotwild-hirsche", name: "Rotwild (Hirsche)", jagdzeitStart: "01.08", jagdzeitEnde: "31.01", iconClass: "deer" },
    { id: "rotwild-alttiere", name: "Rotwild (Alttiere)", jagdzeitStart: "01.08", jagdzeitEnde: "31.01", iconClass: "deer" },
    { id: "rotwild-kaelber", name: "Rotwild (Kälber)", jagdzeitStart: "01.08", jagdzeitEnde: "31.01", iconClass: "deer" },
    { id: "rotwild-schmalspiess", name: "Rotwild (Schmalspießer)", jagdzeitStart: "01.06", jagdzeitEnde: "31.01", iconClass: "deer" },
    { id: "rotwild-schmaltiere", name: "Rotwild (Schmaltiere)", jagdzeitStart: "01.06", jagdzeitEnde: "31.01", iconClass: "deer" },
    { id: "rehwild-boecke", name: "Rehwild (Böcke)", jagdzeitStart: "01.05", jagdzeitEnde: "15.10", iconClass: "deer" },
    { id: "rehwild-geissen", name: "Rehwild (Geißen)", jagdzeitStart: "01.09", jagdzeitEnde: "15.01", iconClass: "deer" },
    { id: "rehwild-kitze", name: "Rehwild (Kitze)", jagdzeitStart: "01.09", jagdzeitEnde: "15.01", iconClass: "deer" },
    { id: "rehwild-schmalrehe", name: "Rehwild (Schmalrehe)", jagdzeitStart: "01.05", jagdzeitEnde: "15.01", iconClass: "deer" },
    { id: "schwarzwild-keiler", name: "Schwarzwild (Keiler)", ganzjaehrig: true, iconClass: "boar" },
    { id: "schwarzwild-bachen", name: "Schwarzwild (Bachen)", ganzjaehrig: true, iconClass: "boar" },
    { id: "schwarzwild-frischlinge", name: "Schwarzwild (Frischlinge)", ganzjaehrig: true, iconClass: "boar" },
    { id: "schwarzwild-ueberlaeufer", name: "Schwarzwild (Überläufer)", ganzjaehrig: true, iconClass: "boar" },
    { id: "gamswild", name: "Gamswild", jagdzeitStart: "01.08", jagdzeitEnde: "15.12", iconClass: "deer" },
    { id: "muffelwild", name: "Muffelwild", jagdzeitStart: "01.08", jagdzeitEnde: "31.01", iconClass: "deer" },

    // ===== RAUBWILD =====
    { id: "fuchs", name: "Fuchs", ganzjaehrig: true, iconClass: "fox" },
    { id: "dachs", name: "Dachs", jagdzeitStart: "01.08", jagdzeitEnde: "31.10", iconClass: "paw" },
    { id: "baummarder", name: "Baummarder", jagdzeitStart: "16.10", jagdzeitEnde: "28.02", iconClass: "paw" },
    { id: "steinmarder", name: "Steinmarder", jagdzeitStart: "16.10", jagdzeitEnde: "28.02", iconClass: "paw" },
    { id: "iltis", name: "Iltis", jagdzeitStart: "01.08", jagdzeitEnde: "28.02", iconClass: "paw" },
    { id: "hermelin", name: "Hermelin", jagdzeitStart: "01.08", jagdzeitEnde: "28.02", iconClass: "paw" },
    { id: "mauswiesel", name: "Mauswiesel", jagdzeitStart: "01.08", jagdzeitEnde: "28.02", iconClass: "paw" },

    // ===== HASEN =====
    { id: "feldhase", name: "Feldhase", jagdzeitStart: "16.10", jagdzeitEnde: "31.12", iconClass: "rabbit" },
    { id: "wildkaninchen", name: "Wildkaninchen", ganzjaehrig: true, iconClass: "rabbit" },

    // ===== FEDERWILD =====
    { id: "stockente", name: "Stockente", jagdzeitStart: "01.09", jagdzeitEnde: "15.01", iconClass: "duck" },
    { id: "fasan", name: "Fasan", jagdzeitStart: "01.10", jagdzeitEnde: "31.12", iconClass: "bird" },
    { id: "rabenkraehe", name: "Rabenkrähe", jagdzeitStart: "16.07", jagdzeitEnde: "14.03", iconClass: "bird" },
    { id: "elster", name: "Elster", jagdzeitStart: "16.07", jagdzeitEnde: "14.03", iconClass: "bird" },
    { id: "eichelhaeler", name: "Eichelhäher", jagdzeitStart: "16.07", jagdzeitEnde: "14.03", iconClass: "bird" }
];

function showToast(message, type = "info", icon = null) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    // Standard-Icons je nach Typ
    const defaultIcons = {
        info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
        success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
        delete: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`
    };

    const iconSvg = icon || defaultIcons[type] || defaultIcons.info;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${iconSvg}</span><span class="toast-message">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Custom Confirm Dialog
function showConfirm(message, title = "Bestätigung", okText = "Löschen") {
    return new Promise((resolve) => {
        const modal = document.getElementById("confirm-modal");
        const titleEl = document.getElementById("confirm-title");
        const messageEl = document.getElementById("confirm-message");
        const okBtn = document.getElementById("confirm-ok-btn");
        const cancelBtn = document.getElementById("confirm-cancel-btn");

        if (!modal) {
            resolve(confirm(message)); // Fallback
            return;
        }

        titleEl.textContent = title;
        messageEl.textContent = message;
        okBtn.textContent = okText;
        modal.classList.remove("hidden");

        const cleanup = () => {
            modal.classList.add("hidden");
            okBtn.onclick = null;
            cancelBtn.onclick = null;
        };

        okBtn.onclick = () => {
            cleanup();
            resolve(true);
        };

        cancelBtn.onclick = () => {
            cleanup();
            resolve(false);
        };
    });
}

// ==============================
// PAGE NAVIGATION (Dashboard -> Pages -> Back)
// ==============================

// Navigate to a page
function navigateToPage(targetId) {
    const allPages = document.querySelectorAll(".page");
    const fabBtn = document.getElementById("fab-add-btn");
    const bottomNav = document.getElementById("bottom-nav");

    allPages.forEach(p => p.classList.remove("active"));
    const targetPage = document.getElementById(targetId);
    if (targetPage) {
        targetPage.classList.add("active");

        // Map resize fix
        if (targetId === "revier" && window.mapInstance) {
            setTimeout(() => window.mapInstance.invalidateSize(), 200);
        }

        // FAB-Button nur in Streckenliste sichtbar
        if (fabBtn) {
            if (targetId === "streckenliste") {
                fabBtn.classList.add("visible");
            } else {
                fabBtn.classList.remove("visible");
            }
        }

        // Bottom Navigation immer anzeigen
        if (bottomNav) {
            bottomNav.classList.remove("hidden");
        }
        // Tab aktiv markieren
        setActiveTab(targetId);

        // Seite initial rendern falls nötig
        if (targetId === 'schonzeit-page') {
            renderSchonzeitListe();
        } else if (targetId === 'wetter-page') {
            // Falls Wetter-Details-Daten geladen sind
            if (typeof renderWetterDetailPage === 'function') {
                renderWetterDetailPage();
            }
        }
    }
}

// Navigate back to dashboard
function navigateToDashboard() {
    const allPages = document.querySelectorAll(".page");
    const fabBtn = document.getElementById("fab-add-btn");
    const bottomNav = document.getElementById("bottom-nav");

    allPages.forEach(p => p.classList.remove("active"));
    const dashboard = document.getElementById("dashboard");
    if (dashboard) dashboard.classList.add("active");

    // Hide FAB
    if (fabBtn) fabBtn.classList.remove("visible");

    // Tab Bar ANZEIGEN (nicht mehr ausblenden)
    if (bottomNav) bottomNav.classList.remove("hidden");

    // Tab aktiv markieren
    setActiveTab("dashboard");

    // Hochsitz-Sidebar schliessen
    const hochsitzPanel = document.getElementById("hochsitz-panel");
    if (hochsitzPanel) {
        hochsitzPanel.classList.remove("open");
        setTimeout(() => hochsitzPanel.classList.add("hidden"), 300);
    }
}

function navigateToTab(pageId) {
    const allPages = document.querySelectorAll(".page");
    const fabBtn = document.getElementById("fab-add-btn");
    const bottomNav = document.getElementById("bottom-nav");

    allPages.forEach(p => p.classList.remove("active"));
    const page = document.getElementById(pageId);
    if (page) page.classList.add("active");

    // Tab Bar anzeigen
    if (bottomNav) bottomNav.classList.remove("hidden");

    // FAB nur für Streckenliste
    if (fabBtn) {
        if (pageId === "streckenliste") {
            fabBtn.classList.add("visible");
        } else {
            fabBtn.classList.remove("visible");
        }
    }

    // Tab aktiv markieren
    setActiveTab(pageId);
}

function setActiveTab(pageId) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === pageId);
    });
}

// Hero-Wetter befüllen (aus fetchLiveWeather aufrufen)
function updateHeroWeather(current, today) {
    const heroTemp = document.getElementById("hero-temp");
    const heroDesc = document.getElementById("hero-desc");
    const heroWindText = document.getElementById("hero-wind-text");
    const heroSunText = document.getElementById("hero-sun-text");

    if (heroTemp && current) {
        heroTemp.textContent = `${current.temp.toFixed(0)}°`;
    }
    if (heroDesc && current) {
        const cond = current.conditions || "";
        // Deutsche Übersetzung der häufigsten Zustände
        const condMap = {
            "Clear": "Klar", "Partially cloudy": "Teils bewölkt",
            "Overcast": "Bedeckt", "Rain": "Regen", "Snow": "Schnee",
            "Fog": "Nebel", "Thunderstorm": "Gewitter", "Drizzle": "Nieselregen",
            "Cloudy": "Bewölkt", "Rain, Overcast": "Regen & Bedeckt",
            "Rain, Partially cloudy": "Leichter Regen", "Snow, Overcast": "Schnee & Bedeckt",
            "Rain, Thunder": "Gewitter", "Freezing Drizzle/Freezing Rain": "Eisregen",
            "Light Rain": "Leichter Regen", "Heavy Rain": "Starkregen"
        };
        // Fallback: erste Bedingung übersetzen
        const firstCond = cond.split(",")[0].trim();
        const condMapSimple = {
            "Clear": "Klar", "Overcast": "Bedeckt", "Rain": "Regen",
            "Snow": "Schnee", "Fog": "Nebel", "Drizzle": "Nieselregen",
            "Cloudy": "Bewölkt", "Thunder": "Gewitter"
        };
        heroDesc.textContent = condMap[cond] || condMapSimple[firstCond] || firstCond;
    }
    if (heroWindText && current) {
        const dir = getWindDirection(current.winddir);
        heroWindText.textContent = `${dir} ${current.windspeed.toFixed(0)} km/h`;
    }
    if (heroSunText && today) {
        const rise = today.sunrise ? today.sunrise.substring(0, 5) : "--:--";
        heroSunText.textContent = `↑ ${rise}`;
    }
}

// Benutzername für Begrüßung & Einstellungen laden
function updateUserInfo(user) {
    const name = user.displayName ? user.displayName.split(" ")[0] : (user.email ? user.email.split("@")[0] : "Jäger");
    const hour = new Date().getHours();
    let greeting = "Guten Morgen";
    if (hour >= 12 && hour < 18) greeting = "Guten Nachmittag";
    else if (hour >= 18) greeting = "Guten Abend";

    const heroGreeting = document.getElementById("hero-greeting");
    if (heroGreeting) heroGreeting.textContent = `${greeting}, ${name}`;

    const settingsUser = document.getElementById("settings-username");
    const settingsEmail = document.getElementById("settings-useremail");
    if (settingsUser) settingsUser.textContent = user.displayName || name;
    if (settingsEmail) settingsEmail.textContent = user.email || "";
}


// iOS Bounce/Overscroll Prevention
function preventIOSBounce() {
    // Nur auf iOS/Touch-Geräten
    if (!('ontouchstart' in window)) return;

    let startY = 0;

    document.addEventListener('touchstart', function (e) {
        startY = e.touches[0].pageY;
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        const scrollableEl = document.scrollingElement || document.documentElement;
        const currentY = e.touches[0].pageY;
        const isAtTop = scrollableEl.scrollTop <= 0;
        const isAtBottom = scrollableEl.scrollTop + scrollableEl.clientHeight >= scrollableEl.scrollHeight;
        const isScrollingDown = currentY > startY;
        const isScrollingUp = currentY < startY;

        // Verhindere Bounce wenn am oberen oder unteren Ende
        if ((isAtTop && isScrollingDown) || (isAtBottom && isScrollingUp)) {
            // Prüfe ob es ein scrollbares Element innerhalb gibt
            let target = e.target;
            while (target && target !== document.body) {
                if (target.scrollHeight > target.clientHeight) {
                    const targetAtTop = target.scrollTop <= 0;
                    const targetAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight;
                    if (!((targetAtTop && isScrollingDown) || (targetAtBottom && isScrollingUp))) {
                        return; // Erlaube Scroll im inneren Element
                    }
                }
                target = target.parentElement;
            }
            e.preventDefault();
        }
    }, { passive: false });
}

// Initialize Navigation when DOM is ready
function initNavigation() {
    const navWidgets = document.querySelectorAll(".nav-widget");
    const backButtons = document.querySelectorAll(".back-to-home");

    // Event Listeners for Navigation Widgets
    navWidgets.forEach(widget => {
        widget.addEventListener("click", () => {
            const target = widget.dataset.target;
            if (target) navigateToPage(target);
        });
    });

    // Event Listeners for Back Buttons
    backButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigateToDashboard();
        });
    });

    // Also use event delegation for dynamically added buttons
    document.addEventListener("click", (e) => {
        if (e.target.closest(".back-to-home")) {
            e.preventDefault();
            e.stopPropagation();
            navigateToDashboard();
        }
    });

    console.log("Navigation initialized:", navWidgets.length, "widgets,", backButtons.length, "back buttons");
}


// ==============================
// FIREBASE AUTHENTICATION
// ==============================
let loginOverlay, loginForm, loginError, loginLoading;
let isAppInitialized = false;

function showLoginError(message) {
    if (loginError) {
        loginError.textContent = message;
        loginError.classList.remove("hidden");
    }
}

function hideLoginError() {
    if (loginError) {
        loginError.classList.add("hidden");
    }
}

function setLoginLoading(isLoading) {
    const submitBtn = loginForm?.querySelector('button[type="submit"]');
    if (loginLoading) {
        loginLoading.classList.toggle("hidden", !isLoading);
    }
    if (submitBtn) {
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? "Wird angemeldet..." : "Einloggen";
    }
}

async function handleLogin(email, password) {
    hideLoginError();
    setLoginLoading(true);

    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        // Auth state listener will handle the rest
    } catch (error) {
        console.error("Login error:", error);
        let errorMessage = "Login fehlgeschlagen. Bitte prüfe deine Zugangsdaten.";

        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = "Kein Benutzer mit dieser E-Mail gefunden.";
                break;
            case 'auth/wrong-password':
                errorMessage = "Falsches Passwort.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Ungültige E-Mail-Adresse.";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Zu viele Versuche. Bitte warte einen Moment.";
                break;
            case 'auth/network-request-failed':
                errorMessage = "Netzwerkfehler. Bitte prüfe deine Verbindung.";
                break;
        }

        showLoginError(errorMessage);
        setLoginLoading(false);
    }
}

function initLogin() {
    loginOverlay = document.getElementById("login-overlay");
    loginForm = document.getElementById("login-form");
    loginError = document.getElementById("login-error");
    loginLoading = document.getElementById("login-loading");

    if (!loginForm) {
        console.error("Login form not found!");
        return;
    }

    // Handle form submission
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email")?.value?.trim();
        const password = document.getElementById("login-password")?.value;

        if (!email || !password) {
            showLoginError("Bitte E-Mail und Passwort eingeben.");
            return;
        }

        handleLogin(email, password);
    });

    // Password visibility toggle
    const passwordToggle = document.getElementById("password-toggle");
    const passwordInput = document.getElementById("login-password");
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener("click", () => {
            const isPassword = passwordInput.type === "password";
            passwordInput.type = isPassword ? "text" : "password";

            // Toggle icon visibility
            const eyeOpen = passwordToggle.querySelector(".eye-open");
            const eyeClosed = passwordToggle.querySelector(".eye-closed");
            if (eyeOpen && eyeClosed) {
                eyeOpen.classList.toggle("hidden");
                eyeClosed.classList.toggle("hidden");
            }
        });
    }

    console.log("Login initialized");
}

function initAuthListener() {
    // Initialize Firebase if not already done
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Listen for auth state changes
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            if (isNativeApp()) {
                document.body.classList.add("native-app");
            }
            document.body.classList.add("authenticated");
            setLoginLoading(false);

            if (loginOverlay) {
                loginOverlay.style.display = "none";
            }

            // Benutzername in Hero und Einstellungen eintragen
            updateUserInfo(user);

            // Tab Bar sofort nach Login anzeigen
            const bottomNav = document.getElementById("bottom-nav");
            if (bottomNav) {
                bottomNav.classList.remove("hidden");
                setActiveTab("dashboard");
            }

            // Initialize app only once
            if (!isAppInitialized) {
                isAppInitialized = true;
                initializeApp().then(async () => {
                    try {
                        if (isNativeApp()) {
                            // Native App Push Initialisierung
                            initPushNotifications(firebase.firestore(), null);
                        } else if ('serviceWorker' in navigator) {
                            // PWA Service Worker Push Initialisierung
                            let reg = window.globalSwReg || await navigator.serviceWorker.getRegistration();

                            if (!reg) {
                                const timeout = new Promise(r => setTimeout(() => r(null), 5000));
                                reg = await Promise.race([navigator.serviceWorker.ready, timeout]);
                            }

                            if (reg) {
                                initPushNotifications(firebase.firestore(), reg);
                            }
                        }
                    } catch (e) {
                        console.error("Push init error:", e);
                    }
                }).catch((error) => {
                    showToast("App Fehler: " + error.message, "error");
                    console.error("App initialization error:", error);
                });

                // Show install banner after login
                showInstallBannerAfterLogin();
            }
        } else {
            // User is signed out
            document.body.classList.remove("authenticated");

            if (loginOverlay) {
                loginOverlay.style.display = "flex";
            }

            setLoginLoading(false);
        }
    });
}

function logout() {
    firebase.auth().signOut().then(() => {
        console.log("User logged out");
        showToast("Erfolgreich abgemeldet");
        isAppInitialized = false;
    }).catch((error) => {
        console.error("Logout error:", error);
        showToast("Fehler beim Abmelden", "error");
    });
}

// ==============================
// CLOCK (nur für Login Screen)
// ==============================
function updateClock() {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    const dateStr = now.getDate().toString().padStart(2, '0') + "." + (now.getMonth() + 1).toString().padStart(2, '0') + "." + now.getFullYear();

    // Login Screen Clock
    const loginTime = document.getElementById('time');
    const loginDate = document.getElementById('date');
    if (loginTime) loginTime.textContent = timeStr;
    if (loginDate) loginDate.textContent = dateStr;
}

function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
    console.log("Clock initialized");
}

// ==============================
// SCHONZEIT WIDGET
// ==============================
let schonzeitIndex = 0;
let schonzeitInterval = null;

function parseJagdzeit(dateStr) {
    // Parst "DD.MM" zu einem Date-Objekt im aktuellen Jahr
    const [day, month] = dateStr.split('.').map(Number);
    const year = new Date().getFullYear();
    return new Date(year, month - 1, day);
}

function istSchonzeit(wildart) {
    // Keine Jagdzeit = ganzjährige Schonzeit
    if (wildart.keineJagdzeit) {
        return true;
    }

    // Ganzjährig bejagbar = nie Schonzeit
    if (wildart.ganzjaehrig) {
        return false;
    }

    const heute = new Date();
    const start = parseJagdzeit(wildart.jagdzeitStart);
    const ende = parseJagdzeit(wildart.jagdzeitEnde);

    // Falls die Jagdzeit über den Jahreswechsel geht (z.B. 01.08 - 31.01)
    if (start > ende) {
        // Jagdzeit: start bis 31.12 ODER 01.01 bis ende
        // Schonzeit: ende+1 bis start-1
        return heute > ende && heute < start;
    } else {
        // Normale Jagdzeit innerhalb eines Jahres
        // Schonzeit: vor start ODER nach ende
        return heute < start || heute > ende;
    }
}

function getSchonzeitDatum(wildart) {
    if (wildart.keineJagdzeit) {
        return "Ganzjährige Schonzeit";
    }

    if (wildart.ganzjaehrig) {
        return "Ganzjährig bejagbar";
    }

    const istAktuelleSchonzeit = istSchonzeit(wildart);

    if (istAktuelleSchonzeit) {
        // Schonzeit - zeige wann Jagdzeit beginnt
        return `Schonzeit bis ${wildart.jagdzeitStart}`;
    } else {
        // Jagdzeit - zeige Jagdzeitraum
        return `Jagdzeit: ${wildart.jagdzeitStart} - ${wildart.jagdzeitEnde}`;
    }
}

function getWildartenMitSchonzeit() {
    // Filtere Wildarten die aktuell Schonzeit haben
    return jagdzeitenBayern.filter(w => istSchonzeit(w));
}

function getWildartenMitJagdzeit() {
    // Filtere Wildarten die aktuell Jagdzeit haben (nicht in Schonzeit)
    return jagdzeitenBayern.filter(w => !istSchonzeit(w) && !w.keineJagdzeit);
}

function getJagdzeitDatum(wildart) {
    if (wildart.keineJagdzeit) {
        return "Keine Jagdzeit";
    }
    return `Jagdzeit: ${wildart.jagdzeitStart} - ${wildart.jagdzeitEnde}`;
}

// Hilfsfunktion für hochwertige Jagd-Silhouetten (Hirsch: Hirschkopf.svg, Rest: SVGs)
function getWildartIconHTML(type, size = 30) {
    if (type === 'deer') {
        // Hirschkopf.svg - Pfad extrahiert und auf Weiß gesetzt
        return `<svg width="${size}" height="${size}" viewBox="0 0 786 1280" fill="white">
            <g transform="translate(0.12800) scale(0.1,-0.1)">
                <path transform="translate(0, 12800)" d="M7639 12784 c-16 -20 -15 -68 8 -244 25 -192 25 -595 -1 -735 -23 -123 -68 -286 -99 -357 -26 -59 -87 -119 -143 -143 -79 -33 -205 -10 -242 44 -10 14 -33 68 -51 120 -63 183 -140 314 -309 531 -238 302 -505 636 -524 653 -30 26 -55 21 -66 -12 -15 -41 33 -153 134 -316 244 -392 374 -717 459 -1155 46 -233 45 -308 -9 -655 -57 -365 -97 -578 -107 -568 -4 4 -15 49 -24 98 -38 209 -140 453 -275 660 -79 121 -118 162 -144 152 -22 -9 8 -146 89 -417 157 -526 179 -677 135 -933 -20 -121 -45 -197 -84 -254 -44 -65 -386 -450 -474 -534 -48 -46 -140 -121 -205 -166 -135 -95 -128 -99 -98 68 121 656 116 919 -24 1347 -41 128 -50 145 -78 163 -40 24 -39 24 -76 -7 -21 -17 -31 -35 -31 -53 0 -15 20 -117 44 -227 47 -207 66 -343 66 -465 0 -102 -27 -269 -59 -370 -16 -47 -135 -339 -266 -647 -236 -558 -238 -562 -264 -556 -14 4 -46 13 -70 21 -25 7 -75 14 -113 14 -87 0 -151 -28 -237 -104 -35 -31 -88 -69 -119 -84 -50 -24 -69 -27 -147 -27 -110 0 -145 15 -200 85 -80 101 -202 173 -310 184 -98 10 -98 10 -136 77 -41 70 -71 164 -124 378 -113 463 -153 918 -140 1627 7 398 7 401 -14 422 -12 12 -34 21 -51 21 -27 0 -33 -6 -51 -47 -109 -252 -157 -547 -145 -888 10 -300 47 -747 75 -922 4 -29 5 -53 1 -53 -4 0 -45 17 -91 38 -46 22 -147 63 -224 92 -592 224 -1139 510 -1340 701 -90 86 -193 219 -236 304 -28 58 -30 67 -36 240 -11 333 23 620 118 1008 66 269 68 304 24 333 -22 14 -27 14 -54 -2 -51 -30 -144 -252 -190 -454 -35 -156 -81 -494 -81 -605 0 -69 -13 -49 -49 75 -76 263 -82 475 -19 670 31 98 72 172 168 310 48 69 207 296 352 505 146 209 301 432 346 495 89 125 100 158 58 185 -19 13 -28 14 -51 3 -32 -15 -291 -303 -497 -555 -168 -205 -207 -243 -246 -243 -37 0 -49 10 -68 55 -25 60 -25 388 0 551 20 131 17 169 -14 179 -59 19 -89 -31 -125 -211 -32 -164 -48 -280 -80 -579 -31 -298 -32 -299 -63 -359 -30 -56 -89 -104 -177 -145 -93 -44 -120 -48 -140 -17 -52 80 -128 354 -144 526 -7 71 -10 289 -9 565 3 417 2 453 -15 478 -26 40 -61 36 -112 -15 -31 -32 -47 -59 -60 -103 -66 -229 -76 -333 -78 -800 -2 -305 0 -338 20 -440 30 -145 74 -275 165 -481 92 -206 124 -293 182 -497 141 -486 337 -802 699 -1125 368 -327 474 -407 1042 -783 253 -168 505 -341 560 -386 171 -138 425 -417 425 -466 0 -36 -22 -22 -91 59 -91 106 -206 206 -308 268 -42 25 -216 111 -386 190 -171 79 -402 189 -513 245 -112 55 -216 101 -231 101 -28 0 -59 -26 -80 -67 -6 -12 -16 -87 -23 -166 -11 -129 -10 -157 5 -244 45 -253 208 -613 377 -831 148 -193 339 -322 550 -375 71 -18 225 -37 306 -37 l51 0 66 -94 c76 -108 144 -227 184 -323 25 -62 28 -81 31 -220 3 -104 -1 -186 -12 -260 -16 -110 -28 -150 -224 -803 -127 -420 -175 -601 -199 -752 -9 -58 -22 -112 -27 -120 -12 -15 -306 -248 -391 -310 -27 -19 -135 -88 -238 -151 -436 -269 -653 -464 -1097 -987 -458 -540 -776 -916 -814 -963 l-39 -47 12 -123 c52 -516 204 -847 443 -960 388 -185 1738 -391 3513 -536 204 -17 423 -36 487 -42 90 -8 125 -8 154 1 43 14 109 71 130 112 8 15 39 46 70 69 79 58 101 110 110 254 12 204 -24 518 -82 711 -42 138 -42 146 9 280 64 169 119 353 187 625 105 423 115 555 100 1369 -5 311 -12 590 -15 622 l-5 56 38 20 c20 11 64 34 96 51 32 17 71 31 86 31 14 0 48 7 73 16 42 14 59 30 148 142 144 181 139 167 100 309 -18 64 -73 247 -123 407 -104 337 -159 544 -188 705 -25 142 -25 178 -1 266 11 39 22 106 26 150 4 44 14 105 22 137 17 61 15 93 -12 242 -17 96 -17 100 1 113 10 7 25 11 33 8 7 -3 56 -10 108 -15 271 -28 580 75 836 279 135 108 263 263 336 408 33 65 128 352 167 501 39 151 65 363 48 390 -6 9 -21 18 -32 20 -22 3 -262 -81 -527 -185 -365 -144 -635 -299 -892 -514 -45 -38 -85 -69 -90 -69 -7 0 -60 66 -66 82 -3 9 520 483 798 722 254 219 391 355 595 589 171 197 232 280 321 440 183 329 309 689 409 1169 39 189 68 271 200 558 220 482 248 590 237 915 -9 254 -42 447 -112 664 -42 130 -72 165 -106 125z" />
            </g>
        </svg>`;
    }

    const svgs = {
        'boar': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white">
            <path d="M22,12c0-4.4-3.6-8-8-8H8c-4.4,0-8,3.6-8,8s3.6,8,8,8h6C18.4,20,22,16.4,22,12z M6,11c0.5,0,1,0.5,1,1s-0.5,1-1,1s-1-0.5-1-1S5.5,11,6,11z M18,12c0,0.5-0.5,1-1,1s-1-0.5-1-1s0.5-1,1-1S18,11.5,18,12z M4,15c-1,0-2-1-2-2s1-2,2-2"/>
            <path d="M20,10c1,0,2,1,2,2s-1,2-2,2"/>
            <path d="M14,19c-1,0-1.5-1-1.5-2h3C15.5,18,15,19,14,19z"/>
        </svg>`,
        'fox': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white">
            <path d="M12,2L4,6v4c0,5,3.5,9.6,8,11c4.5-1.4,8-6,8-11V6L12,2z M10,14c-0.5,0-1-0.5-1-1s0.5-1,1-1s1,0.5,1,1S10.5,14,10,14z M14,14c-0.5,0-1-0.5-1-1s0.5-1,1-1s1,0.5,1,1S14.5,14,14,14z"/>
            <path d="M6,7l2-3l1,2H6z M18,7l-2-3l-1,2H18z"/>
        </svg>`,
        'rabbit': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white">
            <path d="M12,10c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S15.3,10,12,10z M10,17c-0.5,0-1-0.5-1-1s0.5-1,1-1s1,0.5,1,1S10.5,17,10,17z M14,17c-0.5,0-1-0.5-1-1s0.5-1,1-1s1,0.5,1,1S14.5,17,14,17z"/>
            <path d="M8,10V3l2,2l1-2v7H8z M16,10V3l-2,2l-1-2v7H16z"/>
        </svg>`,
        'duck': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white">
            <path d="M12,12c4.4,0,8-3.6,8-8h-2c0,3.3-2.7,6-6,6s-6-2.7-6-6H4C4,8.4,7.6,12,12,12z M12,14c-3.3,0-6,2.7-6,6h12C18,16.7,15.3,14,12,14z"/>
            <path d="M18,4c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S16.9,4,18,4z"/>
        </svg>`,
        'bird': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white">
            <path d="M12,4L2,14h4v6h12v-6h4L12,4z M10,14c-0.5,0-1-0.5-1-1s0.5-1,1-1s1,0.5,1,1S10.5,14,10,14z M14,14c-0.5,0-1-0.5-1-1s0.5-1,1-1s1,0.5,1,1S14.5,14,14,14z"/>
        </svg>`,
        'paw': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white">
            <path d="M12,14c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S14.2,14,12,14z M8,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S9.1,10,8,10z M12,6c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,6,12,6z M16,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S17.1,10,16,10z"/>
        </svg>`
    };

    return svgs[type] || svgs['paw'];
}

function updateSchonzeitWidget() {
    const iconContainer = document.getElementById('schonzeit-icon');
    const wildartEl = document.getElementById('schonzeit-wildart');
    const datumEl = document.getElementById('schonzeit-datum');
    const indicatorEl = document.getElementById('schonzeit-indicator');
    const statusTextEl = document.getElementById('schonzeit-status-text');

    if (!iconContainer || !wildartEl || !datumEl) return;

    const jagdzeitWildarten = getWildartenMitJagdzeit();

    if (jagdzeitWildarten.length === 0) {
        iconContainer.innerHTML = getWildartIconHTML('deer', 30);
        wildartEl.textContent = "Keine aktiven Jagdzeiten";
        datumEl.textContent = "Alle Wildarten haben aktuell Schonzeit";
        indicatorEl.className = "schonzeit-indicator closed";
        statusTextEl.textContent = "Schonzeit";
        return;
    }

    const wildart = jagdzeitWildarten[schonzeitIndex % jagdzeitWildarten.length];
    iconContainer.innerHTML = getWildartIconHTML(wildart.iconClass, 30);
    wildartEl.textContent = wildart.name;
    datumEl.textContent = getJagdzeitDatum(wildart);
    indicatorEl.className = "schonzeit-indicator open";
    statusTextEl.textContent = "Jagdzeit";

    schonzeitIndex++;
}

function initSchonzeitWidget() {
    // Initial update
    updateSchonzeitWidget();

    // Rotation alle 5 Sekunden
    schonzeitInterval = setInterval(updateSchonzeitWidget, 5000);

    // Details-Button Event Listener (Widget auf Dashboard)
    const detailsBtn = document.getElementById('schonzeit-widget');
    if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
            showSchonzeitDetails();
        });
    }

    console.log("Schonzeit Widget initialized");
}

function showSchonzeitDetails() {
    // Navigiere zur Detail-Seite
    navigateToPage('schonzeit-page');
    // Sicherstellen dass 'Alle' ausgewählt ist
    filterSchonzeitListe('alle');
}

let aktuellerFilter = 'alle';

function filterSchonzeitListe(filter) {
    aktuellerFilter = filter;

    // Update active tab
    document.querySelectorAll('.schonzeit-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`)?.classList.add('active');

    renderSchonzeitListe();
}

function renderSchonzeitListe() {
    const container = document.getElementById('schonzeit-liste');
    if (!container) return;

    let wildarten = [...jagdzeitenBayern];

    // Filter anwenden
    if (aktuellerFilter === 'schonzeit') {
        wildarten = wildarten.filter(w => istSchonzeit(w));
    } else if (aktuellerFilter === 'jagdzeit') {
        wildarten = wildarten.filter(w => !istSchonzeit(w));
    }

    if (wildarten.length === 0) {
        container.innerHTML = `
            <div class="schonzeit-empty">
                <p>Keine Wildarten für diesen Filter gefunden.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = wildarten.map(wildart => {
        const hatSchonzeit = istSchonzeit(wildart);
        const statusClass = hatSchonzeit ? 'closed' : 'open';
        const statusText = hatSchonzeit ? 'Schonzeit' : 'Jagdzeit';

        let zeitInfo;
        if (wildart.keineJagdzeit) {
            zeitInfo = 'Ganzjährige Schonzeit';
        } else if (wildart.ganzjaehrig) {
            zeitInfo = 'Ganzjährig bejagbar';
        } else {
            zeitInfo = `Jagdzeit: ${wildart.jagdzeitStart} - ${wildart.jagdzeitEnde}`;
        }

        return `
            <div class="wildart-card">
                <div class="wildart-icon">
                    ${getWildartIconHTML(wildart.iconClass, 36)}
                </div>
                <div class="wildart-info">
                    <h3 class="wildart-name">${wildart.name}</h3>
                    <p class="wildart-zeit">${zeitInfo}</p>
                </div>
                <div class="wildart-status ${statusClass}">
                    <div class="wildart-indicator"></div>
                    <span>${statusText}</span>
                </div>
            </div>
        `;
    }).join('');
}

function closeSchonzeitPage() {
    // Navigiere zurück zum Dashboard mit dem bestehenden Navigationssystem
    navigateToDashboard();
}

// ==============================
// INITIALIZE APP
// ==============================
async function initializeApp() {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const hochsitzeCollection = db.collection("hochsitze");

    // ============================================
    // SCHWARZES BRETT LOGIK
    // ============================================
    const bulletinCollection = db.collection("bulletinBoard");
    const bulletinList = document.getElementById("bulletin-list");
    const bulletinPreview = document.getElementById("bulletin-preview");
    const bulletinBadge = document.getElementById("bulletin-badge");
    const bulletinSubmitBtn = document.getElementById("bulletin-submit-btn");
    const bulletinInput = document.getElementById("bulletin-input");

    if (bulletinList) {
        bulletinCollection.orderBy("timestamp", "desc").onSnapshot(snapshot => {
            const allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Nur aktive (nicht erledigte) Items anzeigen
            const items = allItems.filter(item => !item.isDone);

            // 1. Liste rendern
            bulletinList.innerHTML = items.length ? "" : '<p class="bulletin-empty">Keine Nachrichten vorhanden.</p>';
            items.forEach(item => {
                const date = item.timestamp ? new Date(item.timestamp).toLocaleString('de-DE', {
                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                }) : 'Unbekannt';

                const el = document.createElement("div");
                el.className = "bulletin-item";
                el.innerHTML = `
                    <div class="bulletin-item-header">
                        <span class="bulletin-item-sender">${item.sender || 'Unbekannt'}</span>
                        <span class="bulletin-item-date">${date}</span>
                    </div>
                    <div class="bulletin-item-content">${item.message}</div>
                    <div style="text-align: right; margin-top: 0.5rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <button class="bulletin-done-btn" data-id="${item.id}" title="Erledigt">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Erledigt
                        </button>
                        <button class="bulletin-delete-btn" data-id="${item.id}" aria-label="Löschen">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                `;
                bulletinList.appendChild(el);
            });

            // Erledigt-Events
            bulletinList.querySelectorAll(".bulletin-done-btn").forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    try {
                        await bulletinCollection.doc(btn.dataset.id).update({ isDone: true });
                        showToast("Aushang als erledigt markiert", "success");
                    } catch (err) {
                        console.error(err);
                        showToast("Fehler beim Aktualisieren", "error");
                    }
                };
            });

            // Lösch-Events für Bulletin Board
            bulletinList.querySelectorAll(".bulletin-delete-btn").forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    const confirmed = await showConfirm(
                        "Möchten Sie diesen Aushang wirklich löschen?",
                        "Aushang löschen",
                        "Löschen"
                    );
                    if (confirmed) {
                        try {
                            await bulletinCollection.doc(btn.dataset.id).delete();
                            showToast("Aushang entfernt", "delete");
                        } catch (err) {
                            console.error(err);
                            showToast("Fehler beim Löschen", "error");
                        }
                    }
                };
            });

            // 2. Badge & Dashboard Preview updaten
            if (bulletinBadge) {
                bulletinBadge.textContent = items.length;
                bulletinBadge.classList.toggle("hidden", items.length === 0);
            }

            if (bulletinPreview) {
                bulletinPreview.innerHTML = items.length ? "" : '<p class="bulletin-empty">Keine neuen Aushänge...</p>';
                // LIMIT: Zeige maximal 10 neueste Einträge in der Vorschau
                items.slice(0, 10).forEach(item => {
                    const el = document.createElement("div");
                    el.className = "bulletin-preview-item";
                    el.textContent = item.message;

                    // Klick auf Eintrag im Widget
                    el.onclick = async (e) => {
                        e.stopPropagation(); // Verhindert das Öffnen der Seite
                        // MODAL: Bestätigung einholen
                        const confirmed = await showConfirm(
                            "Möchten Sie diesen Aushang als erledigt markieren?",
                            "Aushang erledigt",
                            "Erledigen"
                        );

                        if (confirmed) {
                            try {
                                await bulletinCollection.doc(item.id).update({ isDone: true });
                                showToast("Erledigt!", "success");
                            } catch (err) {
                                console.error(err);
                                showToast("Fehler beim Aktualisieren", "error");
                            }
                        }
                    };
                    bulletinPreview.appendChild(el);
                });
            }
        });
    }

    // Nachricht senden
    if (bulletinSubmitBtn && bulletinInput) {
        bulletinSubmitBtn.onclick = async () => {
            const msg = bulletinInput.value.trim();
            if (!msg) return;

            bulletinSubmitBtn.disabled = true;
            const originalContent = bulletinSubmitBtn.innerHTML;
            bulletinSubmitBtn.innerHTML = "Wird gesendet...";

            try {
                const user = firebase.auth().currentUser;
                // Einfacher Name aus E-Mail oder DisplayName
                const sender = user ? (user.displayName || user.email.split('@')[0]) : 'Unbekannt';

                await bulletinCollection.add({
                    message: msg,
                    timestamp: Date.now(),
                    sender: sender
                });

                bulletinInput.value = "";
                showToast("Aushang erfolgreich erstellt", "success");
            } catch (err) {
                console.error("Bulletin Error:", err);
                showToast("Fehler beim Senden", "error");
            } finally {
                bulletinSubmitBtn.disabled = false;
                bulletinSubmitBtn.innerHTML = originalContent;
            }
        };
    }

    const hochsitzPanel = document.getElementById("hochsitz-panel");
    const panelContent = hochsitzPanel?.querySelector(".panel-content");
    const grundPanel = document.getElementById("eigengrundstuecke-panel");

    const closeHochsitzPanel = () => {
        if (!hochsitzPanel) return;
        hochsitzPanel.classList.remove("open");
        setTimeout(() => hochsitzPanel.classList.add("hidden"), 300);
    };

    const closePanelBtn = document.getElementById("close-hochsitz-panel");
    if (closePanelBtn) closePanelBtn.addEventListener("click", closeHochsitzPanel);

    const closeEigengrundstueckePanel = () => {
        if (!grundPanel) return;
        grundPanel.classList.remove("open");
        setTimeout(() => grundPanel.classList.add("hidden"), 300);
    };

    const openHochsitzPanel = () => {
        if (!hochsitzPanel) return;
        closeEigengrundstueckePanel(); // Das Eigengrundstücke-Panel schließen, falls offen
        hochsitzPanel.classList.remove("hidden");
        setTimeout(() => hochsitzPanel.classList.add("open"), 10);
    };

    const openEigengrundstueckePanel = () => {
        if (!grundPanel) return;
        closeHochsitzPanel(); // Das Hochsitz-Panel schließen, falls offen
        grundPanel.classList.remove("hidden");
        setTimeout(() => grundPanel.classList.add("open"), 10);
    };
    const closeGrundPanelBtn = document.getElementById("close-eigengrundstuecke-panel");
    if (closeGrundPanelBtn) closeGrundPanelBtn.addEventListener("click", closeEigengrundstueckePanel);

    if (panelContent) {
        hochsitzeCollection.onSnapshot(snapshot => {
            panelContent.innerHTML = "";
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const entry = document.createElement("div");
                entry.className = "panel-entry panel-entry-clickable";
                entry.dataset.lat = data.lat;
                entry.dataset.lng = data.lng;
                entry.dataset.id = doc.id;
                entry.innerHTML = `
                    <strong>${data.name || "Ohne Namen"}</strong>
                    ${data.datum ? `<small>Datum: ${new Date(data.datum).toLocaleDateString()}</small>` : ""}
                    ${data.bemerkung ? `<small>${data.bemerkung}</small>` : ""}
                    ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.name}">` : ""}
                `;

                // Klick-Handler: Zur Position auf der Karte springen
                entry.addEventListener("click", () => {
                    if (window.mapInstance && data.lat && data.lng) {
                        window.mapInstance.flyTo([data.lat, data.lng], 18, { duration: 0.5 });
                    }
                });

                panelContent.appendChild(entry);
            });
        });
    }
    const entriesCollection = db.collection("entries");

    const entryList = document.getElementById("entry-list");
    const addBtn = document.getElementById("add-entry-btn");
    const modal = document.getElementById("entry-modal");
    const form = document.getElementById("entry-form");
    const cancelBtn = document.getElementById("cancel-entry");
    const wildSelect = document.getElementById("wildart");
    const subcategoryContainer = document.getElementById("subcategory-container");
    const fabAddBtn = document.getElementById("fab-add-btn");

    let entries = [];

    if (fabAddBtn) {
        fabAddBtn.addEventListener("click", () => {
            modal.classList.remove("hidden");
        });
    }


    entriesCollection.orderBy("datum", "desc")
        .onSnapshot(snapshot => {
            entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderEntries();
        });

    function renderEntries() {
        entryList.innerHTML = "";
        entries.forEach((entry, idx) => {
            const li = document.createElement("li");
            li.className = "entry-item";

            // Header: Name + Date + Delete Button
            const header = document.createElement("div");
            header.className = "entry-header";
            header.innerHTML = `
                <div class="entry-header-left">
                    <span class="entry-name">${entry.erleger}</span>
                </div>
                <span class="entry-date">${entry.datum || ""}</span>
            `;

            const btn = document.createElement("button");
            btn.className = "entry-delete-btn";
            btn.dataset.idx = idx;
            btn.textContent = "Löschen";
            header.appendChild(btn);

            // Wildart Row
            const wildart = document.createElement("div");
            wildart.className = "entry-wildart";
            wildart.innerHTML = `
                <span class="entry-wildart-icon">🦌</span>
                <span>${entry.wildart} ${entry.unterart || ""}</span>
            `;

            li.appendChild(header);
            li.appendChild(wildart);

            // Notes (optional)
            if (entry.bemerkung) {
                const notes = document.createElement("div");
                notes.className = "entry-notes";
                notes.textContent = entry.bemerkung;
                li.appendChild(notes);
            }

            // Foto-Bereich (nur wenn Bild vorhanden oder Button gewünscht)
            const fotoSection = document.createElement("div");
            fotoSection.className = "entry-foto-section";

            // Bild aus Base64 oder URL anzeigen (Thumbnail mit Lösch-Button)
            const imageSrc = entry.imageBase64 || entry.imageUrl;
            if (imageSrc) {
                fotoSection.innerHTML = `
                    <div class="entry-foto-thumbnail">
                        <img src="${imageSrc}" alt="Streckenfoto" class="entry-foto-img" data-id="${entry.id}">
                        <button class="entry-foto-delete-btn" data-id="${entry.id}" aria-label="Foto löschen">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="2.5">
                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/>
                            </svg>
                        </button>
                    </div>
                `;
            }

            // Foto-Button (hinzufügen oder ändern)
            const fotoBtn = document.createElement("button");
            fotoBtn.className = "entry-foto-btn";
            fotoBtn.dataset.id = entry.id;
            fotoBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                </svg>
                ${imageSrc ? "Ändern" : "Foto hinzufügen"}
            `;
            fotoSection.appendChild(fotoBtn);

            li.appendChild(fotoSection);

            entryList.appendChild(li);
        });
        attachDeleteEvents();
        attachFotoEvents();
    }

    function attachDeleteEvents() {
        document.querySelectorAll("#entry-list .entry-delete-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const entry = entries[btn.dataset.idx];
                if (!entry.id) return;
                try {
                    await entriesCollection.doc(entry.id).delete();
                    showToast("Eintrag gelöscht", "delete");
                } catch (err) {
                    console.error(err);
                    showToast("Fehler beim Löschen", "error");
                }
            });
        });
    }

    // Bild komprimieren (max 600px Breite, 60% Qualität)
    function compressImage(file, maxWidth = 600, quality = 0.6) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let width = img.width;
                    let height = img.height;

                    // Skalieren wenn zu groß
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    // Als JPEG mit Kompression
                    const base64 = canvas.toDataURL("image/jpeg", quality);
                    console.log("[Foto] Komprimiert:", Math.round(base64.length / 1024), "KB");
                    resolve(base64);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function attachFotoEvents() {
        const buttons = document.querySelectorAll(".entry-foto-btn");
        buttons.forEach(btn => {
            btn.addEventListener("click", async () => {
                const entryId = btn.dataset.id;
                if (!entryId) return;

                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.click();

                fileInput.onchange = async () => {
                    const file = fileInput.files[0];
                    if (!file) return;

                    const originalContent = btn.innerHTML;

                    try {
                        // Loading-State anzeigen
                        btn.disabled = true;
                        btn.innerHTML = `
                            <svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" stroke-dasharray="30" stroke-dashoffset="10"/>
                            </svg>
                            Lädt...
                        `;

                        // Bild komprimieren
                        const base64 = await compressImage(file);

                        // Prüfen ob unter 750KB (Firestore-Limit)
                        if (base64.length > 750000) {
                            throw new Error("Bild zu groß, bitte kleineres Bild wählen");
                        }

                        // In Firestore speichern
                        await entriesCollection.doc(entryId).update({ imageBase64: base64 });

                        showToast("Foto gespeichert", "success");
                        // renderEntries() wird automatisch durch onSnapshot aufgerufen
                    } catch (err) {
                        console.error("Foto-Fehler:", err);
                        showToast(err.message || "Fehler beim Speichern", "error");
                        btn.disabled = false;
                        btn.innerHTML = originalContent;
                    }
                };
            });
        });

        // Klick auf Bild öffnet Vollansicht
        document.querySelectorAll(".entry-foto-img").forEach(img => {
            img.addEventListener("click", () => {
                openImageModal(img.src);
            });
        });

        // Foto löschen Handler
        document.querySelectorAll(".entry-foto-delete-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const entryId = btn.dataset.id;
                if (!entryId) return;

                const confirmed = await showConfirm(
                    "Möchten Sie das Foto wirklich löschen?",
                    "Foto löschen",
                    "Löschen"
                );

                if (confirmed) {
                    try {
                        await entriesCollection.doc(entryId).update({
                            imageBase64: firebase.firestore.FieldValue.delete(),
                            imageUrl: firebase.firestore.FieldValue.delete()
                        });
                        showToast("Foto gelöscht", "delete");
                    } catch (err) {
                        console.error("Foto löschen Fehler:", err);
                        showToast("Fehler beim Löschen", "error");
                    }
                }
            });
        });
    }

    // Bild-Vollansicht Modal
    function openImageModal(src) {
        const overlay = document.createElement("div");
        overlay.className = "image-modal-overlay";
        overlay.innerHTML = `
            <div class="image-modal-content">
                <img src="${src}" alt="Streckenfoto">
                <button class="image-modal-close" aria-label="Schließen">
                    ✕
                </button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay || e.target.closest(".image-modal-close")) {
                overlay.remove();
            }
        });
    }

    addBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        form.reset();
        subcategoryContainer.innerHTML = "";
    });

    wildSelect.addEventListener("change", () => {
        const value = wildSelect.value;
        let html = "";
        if (value === "Rehwild") html = `<label>Unterart<select name="unterart"><option>Geiß</option><option>Bock</option><option>Kitz</option><option>Schmal</option></select></label>`;
        if (value === "Rotwild" || value === "Dammwild") html = `<label>Unterart<select name="unterart"><option>Hirsch</option><option>Alttier</option><option>Schmaltier</option><option>Spießer</option></select></label>`;
        if (value === "Schwarzwild") html = `<label>Unterart<select name="unterart"><option>Keiler</option><option>Bache</option><option>Frischling</option><option>Überläufer</option></select></label>`;
        if (value === "Raubwild" || value === "Federwild") html = `<label>Bemerkung<input type="text" name="unterart"></label>`;
        subcategoryContainer.innerHTML = html;
    });

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(form);
        const entry = {};
        formData.forEach((v, k) => entry[k] = v);
        try {
            await entriesCollection.add(entry);
            showToast("Eintrag gespeichert", "success");
            form.reset();
            subcategoryContainer.innerHTML = "";
            modal.classList.add("hidden");
        } catch (err) {
            console.error(err);
            showToast("Fehler beim Speichern", "error");
        }
    });

    // Pass the function down to initializeMap
    initializeMap(db, hochsitzeCollection, openHochsitzPanel, openEigengrundstueckePanel);

    // Wetter beim App-Start laden
    fetchLiveWeather();
}

// ==============================
// MAP
// ==============================
function initializeMap(db, hochsitzeCollection, openHochsitzPanel, openEigengrundstueckePanel) {
    // Pruefen ob Map-Element existiert
    const mapElement = document.getElementById("map");
    if (!mapElement) {
        console.warn("Map element not found, skipping map initialization");
        return;
    }

    try {
        const map = L.map("map", {
            center: [49.180, 13.065],
            zoom: 15,
            zoomAnimation: true,
            zoomAnimationThreshold: 4,
            fadeAnimation: true,
            markerZoomAnimation: true
        });
        window.mapInstance = map;
        window.hochsitzeMarkers = {};
        let settingHochsitz = false;

        // TileLayer mit Performance-Optimierungen
        const tileLayer = L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and others",
                maxZoom: 18, // Reduziert von 20 für bessere Performance
                minZoom: 12,
                updateWhenZooming: false, // Keine Updates während Zoom-Animation
                updateWhenIdle: true, // Nur Updates wenn keine Interaktion
                keepBuffer: 4, // Mehr Tiles im Speicher für schnelleres Panning
                maxNativeZoom: 18,
                tileSize: 256,
                crossOrigin: true
            }
        ).addTo(map);

        // Polygone
        reviere.forEach(r => {
            const polygon = L.polygon(r.coords, { color: r.color, fillColor: r.fillColor, fillOpacity: 0.3 })
                .addTo(map)
                .bindPopup(r.name);

            polygon.on("click", async e => {
                if (!settingHochsitz) return;
                const modal = document.getElementById("hochsitz-modal");
                const input = document.getElementById("hochsitz-name-input");
                const saveBtn = document.getElementById("hochsitz-save-btn");
                const cancelBtn = document.getElementById("hochsitz-cancel-btn");

                if (!modal || !input || !saveBtn || !cancelBtn) return;

                modal.style.display = "block";
                input.value = "";
                // Nur auf Desktop automatisch fokussieren (verhindert Tastatur-Problem auf Mobile)
                if (window.innerWidth > 768) {
                    input.focus();
                }

                const closeModal = () => { modal.style.display = "none"; };

                saveBtn.onclick = async () => {
                    const name = input.value.trim();
                    if (!name) return alert("Bitte einen Namen eingeben");
                    try {
                        await hochsitzeCollection.add({
                            lat: e.latlng.lat,
                            lng: e.latlng.lng,
                            name,
                            imageUrl: null
                        });
                        showToast("Hochsitz gesetzt", "success");
                    } catch (err) {
                        console.error(err);
                        showToast("Fehler beim Setzen des Hochsitzes", "error");
                    }
                    closeModal();
                    settingHochsitz = false;
                    const btn = document.querySelector(".hoch-sitz-btn");
                    if (btn) {
                        btn.style.background = "#2f2f2f";
                        btn.style.border = "1px solid rgba(255,255,255,0.25)";
                        btn.style.color = "white";
                        btn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.6)";
                    }
                };

                cancelBtn.onclick = () => {
                    closeModal();
                    settingHochsitz = false;
                    const btn = document.querySelector(".hoch-sitz-btn");
                    if (btn) {
                        btn.style.background = "#2f2f2f";
                        btn.style.border = "1px solid rgba(255,255,255,0.25)";
                        btn.style.color = "white";
                        btn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.6)";
                    }
                };
            });
        });

        // ==========================
        // Eigengrundstücke zeichnen und im Panel listen
        // ==========================
        window.eigengrundstueckePolygons = {};
        const grundPanelContent = document.getElementById("eigengrundstuecke-content");
        if (grundPanelContent) grundPanelContent.innerHTML = "";

        if (typeof eigengrundstuecke !== "undefined") {
            eigengrundstuecke.forEach((g, index) => {
                const poly = L.polygon(g.coords, { color: g.color, fillColor: g.fillColor, fillOpacity: 0.3 });
                poly.bindPopup(g.name);
                const polyId = g.id || `grund-${index}`;
                window.eigengrundstueckePolygons[polyId] = poly;
                if (g.isVisible) {
                    poly.addTo(map);
                }

                // Panel-Eintrag anklickbar machen
                if (grundPanelContent) {
                    const entry = document.createElement("div");
                    entry.className = "panel-entry panel-entry-clickable";
                    entry.style.display = "flex";
                    entry.style.justifyContent = "space-between";
                    entry.style.alignItems = "center";

                    // Setze aktiven Status für CSS Basis
                    if (g.isVisible) {
                        entry.classList.add("active-plot");
                        entry.style.borderColor = g.color;
                        entry.style.background = "rgba(255,255,255,0.25)";
                    }

                    const nameSpan = document.createElement("span");
                    nameSpan.innerHTML = `<strong>${g.name}</strong>`;
                    nameSpan.style.color = g.color;

                    const statusIcon = document.createElement("span");
                    statusIcon.innerHTML = g.isVisible ? "✓" : "";
                    statusIcon.style.fontWeight = "bold";
                    statusIcon.style.color = g.color;

                    entry.addEventListener("click", () => {
                        g.isVisible = !g.isVisible;
                        if (g.isVisible) {
                            poly.addTo(map);

                            // Fokus/Zoom auf das Polygon setzen
                            map.fitBounds(poly.getBounds(), {
                                padding: [50, 50],
                                maxZoom: 17,
                                animate: true,
                                duration: 0.8
                            });

                            entry.classList.add("active-plot");
                            entry.style.borderColor = g.color;
                            entry.style.background = "rgba(255,255,255,0.25)";
                            statusIcon.innerHTML = "✓";
                        } else {
                            map.removeLayer(poly);
                            entry.classList.remove("active-plot");
                            entry.style.borderColor = "";
                            entry.style.background = "";
                            statusIcon.innerHTML = "";
                        }
                    });

                    entry.appendChild(nameSpan);
                    entry.appendChild(statusIcon);
                    grundPanelContent.appendChild(entry);
                }
            });
        }

        // Statusdot (optional - nur wenn Container existiert)
        const mapContainer = document.getElementById("map-container");
        if (mapContainer) {
            const mapStatusDot = document.createElement("span");
            mapStatusDot.id = "map-status-dot";
            mapStatusDot.classList.add("offline");
            mapContainer.appendChild(mapStatusDot);
            tileLayer.on('tileload', () => mapStatusDot.classList.replace("offline", "online"));
            tileLayer.on('tileerror', () => mapStatusDot.classList.replace("online", "offline"));
        }

        // GPS Marker - wird erst bei Nutzerinteraktion (Button-Klick) gestartet
        let gpsMarker = null;
        let gpsWatchId = null;
        let gpsSearching = false;

        const gpsIcon = L.divIcon({
            className: "gps-marker-wrapper",
            html: `<div class="gps-marker"></div><div class="gps-marker-pulse"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        function updateGpsMarker(lat, lng) {
            if (!gpsMarker) {
                gpsMarker = L.marker([lat, lng], { icon: gpsIcon }).addTo(map);
            } else {
                gpsMarker.setLatLng([lat, lng]);
            }
            const el = gpsMarker.getElement();
            if (el) el.classList.remove("offline");
        }

        let gpsHighAccuracyFailed = false;

        function stopGpsSearching() {
            gpsSearching = false;
            const gpsBtn = document.querySelector(".gps-center-btn");
            if (gpsBtn) gpsBtn.classList.remove("gps-searching");
        }

        function handleGpsError(err) {
            if (gpsMarker) {
                const el = gpsMarker.getElement();
                if (el) el.classList.add("offline");
            }
            console.warn("GPS Fehler (code " + err.code + "):", err.message);

            // Bei POSITION_UNAVAILABLE: Fallback ohne enableHighAccuracy versuchen
            if (err.code === 2 && !gpsHighAccuracyFailed) {
                gpsHighAccuracyFailed = true;
                console.log("GPS: Fallback ohne enableHighAccuracy...");
                showToast("GPS-Signal schwach, versuche alternative Ortung...", "info");

                // Alten Watch stoppen falls aktiv
                if (gpsWatchId !== null) {
                    navigator.geolocation.clearWatch(gpsWatchId);
                    gpsWatchId = null;
                }

                // Nochmal versuchen ohne High Accuracy (nutzt WiFi/Mobilfunk)
                navigator.geolocation.getCurrentPosition(
                    pos => {
                        const { latitude, longitude } = pos.coords;
                        updateGpsMarker(latitude, longitude);
                        map.flyTo([latitude, longitude], 17, { duration: 0.5 });
                        showToast("Position gefunden (via Netzwerk)");
                        stopGpsSearching();
                        startGpsTracking();
                    },
                    err2 => {
                        console.warn("GPS Fallback auch fehlgeschlagen:", err2);
                        showGpsFinalError(err2);
                        stopGpsSearching();
                    },
                    { enableHighAccuracy: false, maximumAge: 30000, timeout: 15000 }
                );
                return;
            }

            showGpsFinalError(err);
            stopGpsSearching();
        }

        function showGpsFinalError(err) {
            switch (err.code) {
                case 1: // PERMISSION_DENIED
                    const permMsg = isNativeApp()
                        ? "GPS-Berechtigung verweigert. Bitte in den App-Einstellungen erlauben."
                        : "GPS-Berechtigung blockiert. Bitte in Browser-Einstellungen erlauben.";
                    showToast(permMsg, "error");
                    break;
                case 2: // POSITION_UNAVAILABLE
                    showToast("Standort nicht verfügbar. Bitte GPS/Standort in den Handy-Einstellungen prüfen.", "error");
                    break;
                case 3: // TIMEOUT
                    showToast("GPS-Zeitüberschreitung. Bitte erneut versuchen.", "error");
                    break;
                default:
                    showToast("GPS-Fehler aufgetreten", "error");
            }
        }

        function startGpsTracking() {
            if (gpsWatchId !== null) return; // Tracking laeuft bereits
            if (!navigator.geolocation) {
                showToast("GPS wird von diesem Gerät nicht unterstützt", "error");
                return;
            }
            const useHighAccuracy = !gpsHighAccuracyFailed;
            gpsWatchId = navigator.geolocation.watchPosition(
                pos => {
                    const { latitude, longitude } = pos.coords;
                    updateGpsMarker(latitude, longitude);
                    stopGpsSearching();
                },
                err => handleGpsError(err),
                { enableHighAccuracy: useHighAccuracy, maximumAge: 10000, timeout: 15000 }
            );
        }

        // ==========================
        // ==========================
        // Hochsitz + Button
        // ==========================
        const markerButton = L.control({ position: "topright" });
        markerButton.onAdd = function () {
            const btn = L.DomUtil.create("button", "hoch-sitz-btn");
            btn.innerHTML = "+";
            btn.title = "Hochsitz hinzufügen";

            const normalStyle = `
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255,255,255,0.25);
            color: white;
            font-size: 1.7rem;
            font-weight: bold;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

            const activeStyle = `
            background: linear-gradient(135deg, rgba(95, 161, 117, 0.4), rgba(61, 190, 106, 0.4));
            border: 1px solid rgba(124, 255, 155, 0.5);
            color: white;
            box-shadow:
                0 0 0 3px rgba(124,255,155,0.3),
                0 8px 24px rgba(0,0,0,0.4),
                0 0 20px rgba(124,255,155,0.4);
        `;

            btn.style.cssText = normalStyle;

            btn.onmouseenter = () => {
                if (!settingHochsitz) {
                    btn.style.background = "rgba(255, 255, 255, 0.18)";
                    btn.style.transform = "scale(1.08)";
                }
            };
            btn.onmouseleave = () => {
                if (!settingHochsitz) {
                    btn.style.background = "rgba(255, 255, 255, 0.12)";
                    btn.style.transform = "scale(1)";
                }
            };

            // Prevent click propagation to map
            L.DomEvent.disableClickPropagation(btn);
            L.DomEvent.disableScrollPropagation(btn);

            L.DomEvent.on(btn, "click", (e) => {
                L.DomEvent.stopPropagation(e);
                settingHochsitz = !settingHochsitz;
                if (settingHochsitz) {
                    btn.style.cssText = normalStyle + activeStyle;
                    showToast("Klicke auf die Karte um eine Jagdeinrichtung zu setzen");
                } else {
                    btn.style.cssText = normalStyle;
                    showToast("Markieren abgebrochen");
                }
            });

            return btn;
        };
        markerButton.addTo(map);

        // ==========================
        // Hochsitz LISTEN Button
        // ==========================
        const listButton = L.control({ position: "topright" });
        listButton.onAdd = function () {
            const btn = L.DomUtil.create("button", "hochsitz-list-btn");
            btn.innerHTML = "☰";
            btn.title = "Hochsitze anzeigen";
            btn.style.cssText = `
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255,255,255,0.25);
            color: white;
            font-size: 1.5rem;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
            btn.onmouseenter = () => {
                btn.style.background = "rgba(255, 255, 255, 0.18)";
                btn.style.transform = "scale(1.08)";
            };
            btn.onmouseleave = () => {
                btn.style.background = "rgba(255, 255, 255, 0.12)";
                btn.style.transform = "scale(1)";
            };

            // Prevent click propagation to map
            L.DomEvent.disableClickPropagation(btn);
            L.DomEvent.disableScrollPropagation(btn);

            L.DomEvent.on(btn, "click", (e) => {
                L.DomEvent.stopPropagation(e);
                if (typeof openHochsitzPanel === "function") openHochsitzPanel();
            });
            return btn;
        };
        listButton.addTo(map);

        // ==========================
        // Eigengrundstücke Button (Chainsaw)
        // ==========================
        const chainsawButton = L.control({ position: "topright" });
        chainsawButton.onAdd = function () {
            const btn = L.DomUtil.create("button", "chainsaw-list-btn");
            // Motorsägen SVG Logo (Tabler Icon ti-cut oder ähnlich, hier abstrakt oder ein Sägeblatt als SVG)
            btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 18l1.4 -6h11.2l-2.4 8h-8.8a2 2 0 0 1 -2 -2z" />
            <path d="M12.4 6a2 2 0 0 1 -2 -2h-1c-1.3 0 -2.5 1 -3.2 2" />
            <path d="M14.6 12a1 1 0 0 0 -1 1v4" />
            <path d="M22 17l-1 -1" />
            <path d="M22 15l-1 -1" />
            <path d="M22 13l-1 -1" />
            <path d="M21 11l-1 -1" />
            <path d="M20 9l-1 -1" />
            <path d="M17 12l2 -2l-1.5 -1.5l-2 2" />
        </svg>`;
            btn.title = "Eigengrundstücke anzeigen";
            btn.style.cssText = `
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255,255,255,0.25);
            color: white;
            font-size: 1.5rem;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
            btn.onmouseenter = () => {
                btn.style.background = "rgba(255, 255, 255, 0.18)";
                btn.style.transform = "scale(1.08)";
            };
            btn.onmouseleave = () => {
                btn.style.background = "rgba(255, 255, 255, 0.12)";
                btn.style.transform = "scale(1)";
            };

            L.DomEvent.disableClickPropagation(btn);
            L.DomEvent.disableScrollPropagation(btn);

            L.DomEvent.on(btn, "click", (e) => {
                L.DomEvent.stopPropagation(e);
                if (typeof openEigengrundstueckePanel === "function") openEigengrundstueckePanel();
            });
            return btn;
        };
        chainsawButton.addTo(map);

        // ==========================
        // GPS-Fokus Button
        // ==========================
        const gpsButton = L.control({ position: "topright" });
        gpsButton.onAdd = function () {
            const btn = L.DomUtil.create("button", "gps-center-btn");
            btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <circle cx="12" cy="12" r="8" opacity="0.3"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg>`;
            btn.title = "Zur aktuellen Position";
            btn.style.cssText = `
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255,255,255,0.25);
            border-radius: 12px;
            width: 44px;
            height: 44px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

            btn.onmouseenter = () => {
                btn.style.background = "rgba(255, 255, 255, 0.18)";
                btn.style.transform = "scale(1.08)";
            };
            btn.onmouseleave = () => {
                btn.style.background = "rgba(255, 255, 255, 0.12)";
                btn.style.transform = "scale(1)";
            };

            L.DomEvent.disableClickPropagation(btn);
            L.DomEvent.on(btn, "click", (e) => {
                L.DomEvent.stopPropagation(e);

                // Position bereits vorhanden -> direkt hinfliegen
                if (gpsMarker) {
                    const pos = gpsMarker.getLatLng();
                    map.flyTo([pos.lat, pos.lng], 17, { duration: 0.5 });
                    showToast("Zur aktuellen Position");
                    return;
                }

                // Kein GPS verfuegbar auf dem Geraet
                if (!navigator.geolocation) {
                    showToast("GPS wird von diesem Gerät nicht unterstützt", "error");
                    return;
                }

                // Bereits am Suchen -> nicht doppelt starten
                if (gpsSearching) {
                    showToast("GPS-Signal wird gesucht...", "info");
                    return;
                }

                // Erstmaliger Klick: Berechtigung pruefen, dann Position holen
                gpsSearching = true;
                gpsHighAccuracyFailed = false;
                btn.classList.add("gps-searching");

                // Permissions API nutzen um Status zu pruefen (falls verfuegbar)
                const checkAndStart = () => {
                    showToast("GPS-Position wird gesucht...", "info");
                    navigator.geolocation.getCurrentPosition(
                        pos => {
                            const { latitude, longitude } = pos.coords;
                            updateGpsMarker(latitude, longitude);
                            map.flyTo([latitude, longitude], 17, { duration: 0.5 });
                            showToast("GPS-Position gefunden");
                            stopGpsSearching();
                            startGpsTracking();
                        },
                        err => handleGpsError(err),
                        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
                    );
                    startGpsTracking();
                };

                if (navigator.permissions) {
                    navigator.permissions.query({ name: "geolocation" }).then(result => {
                        console.log("GPS Berechtigung Status:", result.state);
                        if (result.state === "denied") {
                            showToast("GPS ist blockiert. Bitte in den Browser-Einstellungen unter 'Website-Berechtigungen' den Standort erlauben.", "error");
                            stopGpsSearching();
                        } else {
                            checkAndStart();
                        }
                    }).catch(() => checkAndStart());
                } else {
                    checkAndStart();
                }
            });
            return btn;
        };
        gpsButton.addTo(map);

        // ==========================
        // Firebase Marker laden und verwalten
        // ==========================
        hochsitzeCollection.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const data = change.doc.data();
                const id = change.doc.id;

                if (window.hochsitzeMarkers[id]) {
                    map.removeLayer(window.hochsitzeMarkers[id]);
                    delete window.hochsitzeMarkers[id];
                }

                if (change.type === "added" || change.type === "modified") {
                    const marker = L.marker([data.lat, data.lng], {
                        icon: L.divIcon({
                            className: "hochsitz-marker",
                            html: `<svg viewBox="0 0 32 32" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <!-- Hintergrund-Kreis -->
                            <circle cx="16" cy="16" r="15" fill="white" stroke="#2f6f4e" stroke-width="2"/>
                            <!-- Dach -->
                            <path d="M8 12 L16 6 L24 12" stroke="#2f6f4e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <!-- Kabine -->
                            <rect x="9" y="12" width="14" height="8" rx="1" fill="#2f6f4e"/>
                            <!-- Fenster -->
                            <rect x="11" y="14" width="4" height="3" rx="0.5" fill="white" opacity="0.8"/>
                            <rect x="17" y="14" width="4" height="3" rx="0.5" fill="white" opacity="0.8"/>
                            <!-- Stelzen -->
                            <line x1="11" y1="20" x2="9" y2="26" stroke="#2f6f4e" stroke-width="2" stroke-linecap="round"/>
                            <line x1="21" y1="20" x2="23" y2="26" stroke="#2f6f4e" stroke-width="2" stroke-linecap="round"/>
                            <!-- Leiter -->
                            <line x1="16" y1="20" x2="16" y2="26" stroke="#2f6f4e" stroke-width="1.5" stroke-linecap="round"/>
                            <line x1="14.5" y1="22" x2="17.5" y2="22" stroke="#2f6f4e" stroke-width="1" stroke-linecap="round"/>
                            <line x1="14.5" y1="24" x2="17.5" y2="24" stroke="#2f6f4e" stroke-width="1" stroke-linecap="round"/>
                        </svg>`,
                            iconSize: [40, 40],
                            iconAnchor: [20, 40],
                            popupAnchor: [0, -42]
                        })
                    }).addTo(map);

                    const popupContent = `<div class="hochsitz-popup">
                    <div class="hochsitz-popup-title">${data.name || "Hochsitz"}</div>
                    ${data.imageUrl ? `<img src="${data.imageUrl}" class="hochsitz-popup-img">` : ""}
                    <div class="hochsitz-popup-buttons">
                        <button class="hochsitz-popup-btn add-photo-btn" data-id="${id}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                            Bild
                        </button>
                        <button class="hochsitz-popup-btn delete-btn delete-marker-btn" data-id="${id}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/>
                            </svg>
                            Löschen
                        </button>
                    </div>
                </div>`;
                    marker.bindPopup(popupContent);
                    window.hochsitzeMarkers[id] = marker;
                }

                if (change.type === "removed" && window.hochsitzeMarkers[id]) {
                    map.removeLayer(window.hochsitzeMarkers[id]);
                    delete window.hochsitzeMarkers[id];
                }
            });
        });

        // ==========================
        // Bild hochladen / Marker löschen
        // ==========================
        document.addEventListener("click", async (evt) => {
            const target = evt.target;
            const id = target.dataset?.id;
            if (!id) return;
            const docRef = hochsitzeCollection.doc(id);

            if (target.classList.contains("add-photo-btn")) {
                try {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";
                    fileInput.click();
                    fileInput.onchange = async () => {
                        const file = fileInput.files[0];
                        if (!file || !firebase.storage) return;
                        const storageRef = firebase.storage().ref();
                        const fileRef = storageRef.child(`hochsitze/${id}_${file.name}`);
                        await fileRef.put(file);
                        const url = await fileRef.getDownloadURL();
                        await docRef.update({ imageUrl: url });
                        showToast("Bild hochgeladen", "success");
                    };
                } catch (err) {
                    console.error(err);
                    showToast("Fehler beim Upload", "error");
                }
            }

            if (target.classList.contains("delete-marker-btn")) {
                const confirmed = await showConfirm(
                    "Möchten Sie diesen Hochsitz wirklich löschen?",
                    "Hochsitz löschen",
                    "Löschen"
                );
                if (confirmed) {
                    await docRef.delete();
                    showToast("Hochsitz gelöscht", "success");
                }
            }
        });

    } catch (err) {
        console.error("Map initialization error:", err);
        showToast("Fehler beim Laden der Karte", "error");
    }
}

// ==============================
// WEATHER
// ==============================
let cachedWeatherData = null;

async function fetchLiveWeather() {
    console.log("[Wetter] Starte Wetter-Abruf...");
    const apiKey = "YLF2SPSJ98MKAFEXGKRQRSFBW";
    const LAT = 49.2, LON = 13.05;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${LAT},${LON}?unitGroup=metric&key=${apiKey}&include=current,days`;

    try {
        const response = await fetch(url);
        console.log("[Wetter] Response Status:", response.status);
        if (!response.ok) throw new Error("Netzwerkfehler");
        const data = await response.json();
        console.log("[Wetter] Daten erhalten:", data);

        // Cache weather data for detail page
        cachedWeatherData = data;

        const current = data.currentConditions;
        const today = data.days && data.days[0];
        const tomorrow = data.days && data.days[1];
        console.log("[Wetter] Current:", current, "Today:", today);

        // Temperatur Karte
        const tempCard = document.getElementById("wetter-temp");
        if (tempCard) {
            const conditionsText = current.conditions || "";
            tempCard.querySelector(".wetter-card-value").textContent = `${current.temp.toFixed(0)}°C`;
            tempCard.querySelector(".wetter-card-label").textContent = conditionsText.length > 12
                ? conditionsText.substring(0, 12) + "..."
                : conditionsText;
        }

        // Wind Karte
        const windCard = document.getElementById("wetter-wind");
        if (windCard) {
            const windDirText = getWindDirection(current.winddir);
            windCard.querySelector(".wetter-card-value").textContent = windDirText;
            windCard.querySelector(".wetter-card-label").textContent = `${current.windspeed.toFixed(0)} km/h`;
        }

        // Mond Karte
        const moonCard = document.getElementById("wetter-moon");
        if (moonCard) {
            const phaseNum = current.moonphase;
            let moonPhaseName = "";
            if (phaseNum === 0) { moonPhaseName = "Neumond"; }
            else if (phaseNum < 0.25) { moonPhaseName = "Zunehmend"; }
            else if (phaseNum === 0.25) { moonPhaseName = "1. Viertel"; }
            else if (phaseNum < 0.5) { moonPhaseName = "Zunehmend"; }
            else if (phaseNum === 0.5) { moonPhaseName = "Vollmond"; }
            else if (phaseNum < 0.75) { moonPhaseName = "Abnehmend"; }
            else if (phaseNum === 0.75) { moonPhaseName = "3. Viertel"; }
            else { moonPhaseName = "Abnehmend"; }

            moonCard.querySelector(".wetter-card-value").textContent = moonPhaseName;
            moonCard.querySelector(".wetter-card-label").textContent = "Mondphase";
        }

        // Sonnen-Leiste (Sunrise/Sunset)
        updateSunBar(today, tomorrow);

        // NEU: Hero-Wetter auf dem Dashboard befüllen
        updateHeroWeather(current, today);

    } catch (err) {
        console.error("Wetter Fehler:", err);
        const sunText = document.getElementById("sun-text");
        if (sunText) sunText.textContent = "Wetter nicht verfügbar";
    }
}

// Sonnen-Leiste aktualisieren
function updateSunBar(today, tomorrow) {
    const sunText = document.getElementById("sun-text");
    const sunIcon = document.querySelector(".wetter-sun-icon");
    if (!sunText || !today) return;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Sunrise und Sunset parsen (Format: "06:48:00")
    const sunriseToday = today.sunrise ? parseTimeToMinutes(today.sunrise) : null;
    const sunsetToday = today.sunset ? parseTimeToMinutes(today.sunset) : null;
    const sunriseTomorrow = tomorrow && tomorrow.sunrise ? parseTimeToMinutes(tomorrow.sunrise) : null;

    // Sunrise Icon - Sonne geht auf (Pfeil nach oben)
    const sunriseIconSvg = `<svg class="wetter-sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="9" x2="12" y2="3"/>
        <polyline points="9 6 12 3 15 6"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
        <line x1="23" y1="22" x2="1" y2="22"/>
    </svg>`;

    // Sunset Icon - Sonne geht unter (Pfeil nach unten)
    const sunsetIconSvg = `<svg class="wetter-sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="3" x2="12" y2="9"/>
        <polyline points="9 6 12 9 15 6"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
        <line x1="23" y1="22" x2="1" y2="22"/>
    </svg>`;

    let text = "";
    let icon = sunriseIconSvg;

    if (sunriseToday !== null && currentMinutes < sunriseToday) {
        // Vor Sonnenaufgang heute
        const diff = sunriseToday - currentMinutes;
        text = `Sonnenaufgang in ${formatMinutes(diff)} (${formatTime(today.sunrise)})`;
        icon = sunriseIconSvg;
    } else if (sunsetToday !== null && currentMinutes < sunsetToday) {
        // Nach Sonnenaufgang, vor Sonnenuntergang
        const diff = sunsetToday - currentMinutes;
        text = `Sonnenuntergang in ${formatMinutes(diff)} (${formatTime(today.sunset)})`;
        icon = sunsetIconSvg;
    } else if (sunriseTomorrow !== null) {
        // Nach Sonnenuntergang - zeige morgen
        text = `Sonnenaufgang morgen (${formatTime(tomorrow.sunrise)})`;
        icon = sunriseIconSvg;
    } else {
        text = `Sonnenuntergang ${formatTime(today.sunset)}`;
        icon = sunsetIconSvg;
    }

    sunText.textContent = text;
    if (sunIcon && sunIcon.parentNode) {
        sunIcon.outerHTML = icon;
    }
}

// Zeit-String "06:48:00" zu Minuten seit Mitternacht
function parseTimeToMinutes(timeStr) {
    if (!timeStr) return null;
    const parts = timeStr.split(":");
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

// Minuten zu lesbarem Format
function formatMinutes(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) {
        return `${h}h ${m}min`;
    }
    return `${m} min`;
}

// Zeit-String formatieren "06:48:00" -> "06:48"
function formatTime(timeStr) {
    if (!timeStr) return "--:--";
    return timeStr.substring(0, 5);
}

function getWindDirection(deg) {
    const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return dirs[Math.floor((deg / 22.5) + 0.5) % 16];
}

// Wetter-Widget Click Handler initialisieren
function initWetterWidgetClick() {
    const wetterWidget = document.getElementById('wetter-widget');
    if (wetterWidget) {
        wetterWidget.style.cursor = 'pointer';
        wetterWidget.addEventListener('click', showWetterDetails);
    }
}

// Wetter Detail-Seite anzeigen
function showWetterDetails() {
    navigateToPage('wetter-page');
    renderWetterDetailPage();
}

// Wetter Detail-Seite rendern
function renderWetterDetailPage() {
    const container = document.getElementById('wetter-detail-grid');
    if (!container) return;

    if (!cachedWeatherData) {
        container.innerHTML = '<div class="wetter-detail-widget"><p>Wetterdaten werden geladen...</p></div>';
        return;
    }

    const current = cachedWeatherData.currentConditions;
    const today = cachedWeatherData.days && cachedWeatherData.days[0];

    // Mondphase berechnen
    const moonPhase = current.moonphase;
    let moonPhaseName = "";
    if (moonPhase === 0) {
        moonPhaseName = "Neumond";
    } else if (moonPhase < 0.25) {
        moonPhaseName = "Zunehmende Sichel";
    } else if (moonPhase === 0.25) {
        moonPhaseName = "Erstes Viertel";
    } else if (moonPhase < 0.5) {
        moonPhaseName = "Zunehmender Mond";
    } else if (moonPhase === 0.5) {
        moonPhaseName = "Vollmond";
    } else if (moonPhase < 0.75) {
        moonPhaseName = "Abnehmender Mond";
    } else if (moonPhase === 0.75) {
        moonPhaseName = "Letztes Viertel";
    } else {
        moonPhaseName = "Abnehmende Sichel";
    }

    // UV-Index Bewertung
    const uvIndex = current.uvindex || 0;
    let uvBewertung = "";
    if (uvIndex <= 2) uvBewertung = "Niedrig";
    else if (uvIndex <= 5) uvBewertung = "Moderat";
    else if (uvIndex <= 7) uvBewertung = "Hoch";
    else if (uvIndex <= 10) uvBewertung = "Sehr hoch";
    else uvBewertung = "Extrem";

    // Niederschlagstyp formatieren
    const precipType = current.preciptype ? current.preciptype.join(", ") : "Kein Niederschlag";

    // Windrichtung
    const windDir = getWindDirection(current.winddir || 0);

    container.innerHTML = `
        <!-- Temperatur Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                </svg>
                <span>Temperatur</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${current.temp?.toFixed(1) || "--"}°C</div>
                <div class="wetter-detail-row">
                    <span>Gefühlt</span>
                    <span>${current.feelslike?.toFixed(1) || "--"}°C</span>
                </div>
                <div class="wetter-detail-row">
                    <span>Min / Max</span>
                    <span>${today?.tempmin?.toFixed(0) || "--"}° / ${today?.tempmax?.toFixed(0) || "--"}°</span>
                </div>
            </div>
        </div>
        
        <!-- Wind Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                </svg>
                <span>Wind</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${current.windspeed?.toFixed(0) || "--"} km/h</div>
                <div class="wetter-detail-row">
                    <span>Richtung</span>
                    <span>${windDir} (${current.winddir?.toFixed(0) || "--"}°)</span>
                </div>
                <div class="wetter-detail-row">
                    <span>Böen</span>
                    <span>${current.windgust?.toFixed(0) || "--"} km/h</span>
                </div>
            </div>
        </div>
        
        <!-- Niederschlag Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
                <span>Niederschlag</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${current.precip?.toFixed(1) || "0"} mm</div>
                <div class="wetter-detail-row">
                    <span>Wahrscheinlichkeit</span>
                    <span>${today?.precipprob?.toFixed(0) || "0"}%</span>
                </div>
                <div class="wetter-detail-row">
                    <span>Typ</span>
                    <span>${precipType}</span>
                </div>
            </div>
        </div>
        
        <!-- Luftfeuchtigkeit Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
                <span>Luftfeuchtigkeit</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${current.humidity?.toFixed(0) || "--"}%</div>
                <div class="wetter-detail-row">
                    <span>Taupunkt</span>
                    <span>${current.dew?.toFixed(1) || "--"}°C</span>
                </div>
                <div class="wetter-detail-row">
                    <span>Luftdruck</span>
                    <span>${current.pressure?.toFixed(0) || "--"} hPa</span>
                </div>
            </div>
        </div>
        
        <!-- Sonne Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
                <span>Sonne</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-row highlight">
                    <span>Sonnenaufgang</span>
                    <span>${formatTime(today?.sunrise)}</span>
                </div>
                <div class="wetter-detail-row highlight">
                    <span>Sonnenuntergang</span>
                    <span>${formatTime(today?.sunset)}</span>
                </div>
                <div class="wetter-detail-row">
                    <span>UV-Index</span>
                    <span>${uvIndex} (${uvBewertung})</span>
                </div>
            </div>
        </div>
        
        <!-- Mond Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <span>Mond</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${moonPhaseName}</div>
                <div class="wetter-detail-row">
                    <span>Beleuchtung</span>
                    <span>${(moonPhase * 100).toFixed(0)}%</span>
                </div>
            </div>
        </div>
        
        <!-- Sichtweite Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Sichtweite</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${current.visibility?.toFixed(0) || "--"} km</div>
                <div class="wetter-detail-row">
                    <span>Bewölkung</span>
                    <span>${current.cloudcover?.toFixed(0) || "--"}%</span>
                </div>
            </div>
        </div>
        
        <!-- Bedingungen Widget -->
        <div class="wetter-detail-widget full-width">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                </svg>
                <span>Aktuelle Bedingungen</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-conditions">${current.conditions || "Keine Daten"}</div>
            </div>
        </div>
    `;
}

// ==============================
// PWA INSTALL PROMPT
// ==============================
let deferredPrompt = null;

function initInstallPrompt() {
    const banner = document.getElementById('install-banner');
    const acceptBtn = document.getElementById('install-accept');
    const dismissBtn = document.getElementById('install-dismiss');

    if (!banner || !acceptBtn || !dismissBtn) return;

    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
        console.log('App already installed');
        return;
    }

    // Check if user dismissed recently (24h cooldown)
    const dismissed = localStorage.getItem('installDismissed');
    if (dismissed) {
        const dismissedTime = parseInt(dismissed, 10);
        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours
        if (now - dismissedTime < cooldown) {
            console.log('Install prompt in cooldown');
            return;
        }
    }

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // Show banner after short delay (after login)
        setTimeout(() => {
            if (deferredPrompt && !document.getElementById('login-overlay').classList.contains('hidden') === false) {
                banner.classList.remove('hidden');
            }
        }, 2000);
    });

    // Accept button
    acceptBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;

        banner.classList.add('hidden');
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install prompt outcome:', outcome);

        deferredPrompt = null;
    });

    // Dismiss button
    dismissBtn.addEventListener('click', () => {
        banner.classList.add('hidden');
        localStorage.setItem('installDismissed', Date.now().toString());
        deferredPrompt = null;
    });

    // Hide banner if app gets installed
    window.addEventListener('appinstalled', () => {
        banner.classList.add('hidden');
        deferredPrompt = null;
        console.log('App was installed');
    });
}

// Show install banner after successful login
function showInstallBannerAfterLogin() {
    if (isNativeApp()) return; // In der App brauchen wir keinen PWA Banner

    const banner = document.getElementById('install-banner');
    if (deferredPrompt && banner) {
        setTimeout(() => {
            banner.classList.remove('hidden');
        }, 1500);
    }
}

// ==============================
// SERVICE WORKER & AUTO-UPDATE
// ==============================
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        // Nutze den Standardnamen für FCM Kompatibilität (v2.9.0)
        navigator.serviceWorker.register("./firebase-messaging-sw.js").then(reg => {
            console.log("[SW] Firebase Service Worker registriert");
            window.globalSwReg = reg;

            // SOFORT nach Updates prüfen beim Laden
            reg.update().catch(err => console.log("[SW] Update-Check Fehler:", err));

            // Prüfe alle 30 Sekunden auf Updates (aggressiver für Mobile)
            setInterval(() => {
                reg.update();
                console.log("[SW] Periodischer Update-Check...");
            }, 30000);

            // Wenn neuer SW gefunden wird
            reg.addEventListener("updatefound", () => {
                const newWorker = reg.installing;
                console.log("[SW] Neuer Service Worker gefunden, Status:", newWorker.state);

                newWorker.addEventListener("statechange", () => {
                    console.log("[SW] Service Worker Status geändert:", newWorker.state);
                    if (newWorker.state === "installed") {
                        if (navigator.serviceWorker.controller) {
                            // Neue Version verfügbar - User benachrichtigen
                            console.log("[SW] Neue App-Version verfügbar!");
                            showUpdateToast();
                        } else {
                            // Erster Install - keine Benachrichtigung nötig
                            console.log("[SW] Erster Install - App bereit");
                        }
                    }
                });
            });

            // Prüfe ob bereits ein wartender SW existiert
            if (reg.waiting) {
                console.log("[SW] Wartender Service Worker gefunden");
                showUpdateToast();
            }

            // Prüfe auch ob ein installierender SW existiert
            if (reg.installing) {
                console.log("[SW] Installierender Service Worker gefunden");
            }

            // Reload wenn neuer SW die Kontrolle übernimmt
            let refreshing = false;
            navigator.serviceWorker.addEventListener("controllerchange", () => {
                if (refreshing) return;
                refreshing = true;
                console.log("[SW] Controller gewechselt - Seite wird neu geladen");
                window.location.reload();
            });
        }).catch(err => {
            console.error("[SW] Registrierung fehlgeschlagen:", err);
        });
    });
}

async function initPushNotifications(db, swReg) {
    if (isNativeApp()) {
        await initNativePush(db);
        return;
    }

    if (!firebase.messaging) return;

    try {
        const isSupported = await firebase.messaging.isSupported();
        if (!isSupported) return;
    } catch (e) {
        return;
    }

    const currentPerm = Notification.permission;

    if (currentPerm === 'granted') {
        await fetchAndSaveToken(db, swReg);
        return;
    }

    if (currentPerm === 'default') {
        const requestPushAccess = async () => {
            window.removeEventListener('click', requestPushAccess);
            window.removeEventListener('touchstart', requestPushAccess);

            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    await fetchAndSaveToken(db, swReg);
                }
            } catch (err) {
                console.error("Fehler bei Push-Berechtigung:", err);
            }
        };

        // Auf Klick und Touch am window reagieren (sicherer als document)
        window.addEventListener('click', requestPushAccess);
        window.addEventListener('touchstart', requestPushAccess, { passive: true });
    } else if (currentPerm === 'denied') {
        showToast("BLOCKIERT! Bitte in den Handy-Einstellungen (App Info) erlauben.", "error");
    }
}

async function initNativePush(db) {
    if (!window.Capacitor || !window.Capacitor.Plugins.PushNotifications) {
        console.warn("Capacitor Push Plugin nicht gefunden.");
        return;
    }

    const { PushNotifications } = window.Capacitor.Plugins;

    // Berechtigung prüfen & anfordern
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
        showToast("Push-Berechtigung verweigert.", "error");
        return;
    }

    // Listener für erfolgreiche Token-Registrierung
    PushNotifications.addListener('registration', async (token) => {
        const fcmToken = token.value;
        console.log('Native Push Token:', fcmToken);

        let user = firebase.auth().currentUser;
        const tokenData = {
            token: fcmToken,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            userId: user ? user.uid : 'anon',
            userName: user ? (user.displayName || user.email || 'Nutzer') : 'Unbekannt',
            device: 'Android Native App',
            version: '4.0.0'
        };

        await db.collection('fcmTokens').doc(fcmToken).set(tokenData, { merge: true });
        showToast("Native Push aktiv! 🔔", "success");
    });

    PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
    });

    // Optionale Listener für eintreffende Nachrichten
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push empfangen:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push-Aktion ausgeführt:', notification);
        // Hier könnte man zur Seite navigieren:
        // if (notification.notification.data.target) navigateToPage(...)
    });

    // Registrierung starten
    await PushNotifications.register();
}



async function fetchAndSaveToken(db, swReg) {
    if (!swReg) {
        showToast("Fehler: System-Modul fehlt", "error");
        return;
    }

    // Sicherstellen, dass der Worker aktiv ist (v2.9.0)
    let worker = swReg.active;
    if (!worker || worker.state !== 'activated') {
        showToast("Warte auf Aktivierung...", "info");
        await new Promise(r => setTimeout(r, 1500));
        worker = swReg.active;
    }

    if (Notification.permission !== 'granted') {
        showToast("Berechtigung fehlt: " + Notification.permission, "error");
        return;
    }

    const messaging = firebase.messaging();
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        attempts++;
        try {
            const currentToken = await messaging.getToken({
                vapidKey: 'BDy4YWtERHAaFyUQHr7URTCHbsFC_AwMImJJ5U_AlFrdF_uhsHtEMZMybDXdZWUkapxR9X5JzoKJFAHXvYSIEQg',
                serviceWorkerRegistration: swReg
            });

            if (currentToken) {
                let user = firebase.auth().currentUser;
                if (!user) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    user = firebase.auth().currentUser;
                }

                const tokenData = {
                    token: currentToken,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    userId: user ? user.uid : 'anon',
                    userName: user ? (user.displayName || user.email || 'Nutzer') : 'Unbekannt',
                    device: navigator.userAgent.substring(0, 100),
                    version: '3.3.0'
                };

                await db.collection('fcmTokens').doc(currentToken).set(tokenData, { merge: true });
                showToast("Push-Benachrichtigungen aktiv! 🔔", "success");
                return;
            } else {
                showToast("System gibt keinen Schlüssel frei.", "error");
                return;
            }
        } catch (err) {
            console.warn(`FCM Versuch ${attempts} fehlgeschlagen:`, err);

            // Wenn Code 20 (Abort), versuchen wir es nochmal
            if ((err.code === 20 || err.name === 'AbortError') && attempts < maxAttempts) {
                showToast("System hakt (20), ich probiere es nochmal...", "info");
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }

            let msg = err.message || err.code || "Fehler";
            if (msg.includes("subscribe")) msg = "System blockiert Push";
            showToast("FCM: " + msg.substring(0, 50), "error");
            break;
        }
    }
}


// ==============================
// VERSION CHECK (Fallback für Mobile)
// ==============================
const LOCAL_VERSION_KEY = "app_version";

async function checkForUpdates() {
    try {
        // Cache-Busting: Timestamp anhängen
        const response = await fetch(`./version.json?t=${Date.now()}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
        });

        if (!response.ok) {
            console.log("[Version] version.json nicht gefunden");
            return;
        }

        const data = await response.json();
        const localVersion = localStorage.getItem(LOCAL_VERSION_KEY);

        // Update version display in login footer
        const versionElement = document.getElementById("app-version");
        if (versionElement) {
            versionElement.textContent = `v${data.version}`;
        }

        console.log("[Version] Server:", data.version, "| Lokal:", localVersion);

        if (!localVersion) {
            // Erste Installation - Version speichern
            localStorage.setItem(LOCAL_VERSION_KEY, data.version);
            console.log("[Version] Erste Installation, Version gespeichert:", data.version);
            return;
        }

        if (data.version !== localVersion) {
            console.log("[Version] Update verfügbar!");
            showUpdateToast(true, data.version);
        }
    } catch (err) {
        console.log("[Version] Check fehlgeschlagen:", err);
    }
}

// Version-Check beim Laden und alle 30 Sekunden
window.addEventListener("load", () => {
    // Kurz warten damit die App geladen ist
    setTimeout(checkForUpdates, 3000);

    // Alle 30 Sekunden prüfen
    setInterval(checkForUpdates, 30000);
});

// Update-Toast für neue App-Version
function showUpdateToast(forceReload = false, newVersion = null) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    // Verhindere doppelte Update-Toasts
    if (document.querySelector(".toast.update")) return;

    const updateIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>`;

    const toast = document.createElement("div");
    toast.className = "toast update";
    toast.innerHTML = `
        <span class="toast-icon">${updateIcon}</span>
        <span class="toast-message">Neue Version verfügbar</span>
        <button class="update-btn">Aktualisieren</button>
    `;

    toast.querySelector(".update-btn").addEventListener("click", async () => {
        toast.querySelector(".update-btn").textContent = "Lade...";
        toast.querySelector(".update-btn").disabled = true;

        try {
            // 1. Neue Version in localStorage speichern BEVOR wir neu laden
            if (newVersion) {
                localStorage.setItem(LOCAL_VERSION_KEY, newVersion);
                console.log("[Update] Neue Version gespeichert:", newVersion);
            }

            // 2. Alle Caches löschen
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
                console.log("[Update] Caches gelöscht");
            }

            // 3. Service Worker deregistrieren
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map(reg => reg.unregister()));
                console.log("[Update] Service Worker deregistriert");
            }

            // 4. Kurz warten dann hard reload
            setTimeout(() => {
                window.location.href = window.location.href.split('?')[0] + '?update=' + Date.now();
            }, 500);

        } catch (err) {
            console.error("[Update] Fehler:", err);
            window.location.reload(true);
        }
    });

    container.appendChild(toast);
}

// ==============================
// MAIN INITIALIZATION
// ==============================
function initAll() {
    // Globaler Error-Handler für Toasts (Debug v2.2.7)
    window.onerror = function (msg, url, line) {
        showToast("Fehler: " + msg + " (L" + line + ")", "error");
        return false;
    };

    showToast("Reviersystem v3.3.0 bereit", "success");

    // iOS Bounce/Overscroll Fix
    try {
        preventIOSBounce();
    } catch (e) {
        console.error("iOS Bounce Fix error:", e);
    }

    try {
        initLogin();
        console.log("Login OK");
    } catch (e) {
        console.error("Login init error:", e);
        showToast("Login Init Fehler", "error");
    }

    try {
        initNavigation();
        console.log("Navigation OK");
    } catch (e) {
        console.error("Navigation init error:", e);
    }

    try {
        initClock();
        console.log("Clock OK");
    } catch (e) {
        console.error("Clock init error:", e);
    }

    try {
        initSchonzeitWidget();
        console.log("Schonzeit Widget OK");
    } catch (e) {
        console.error("Schonzeit Widget init error:", e);
    }

    try {
        initWetterWidgetClick();
        console.log("Wetter Widget Click OK");
    } catch (e) {
        console.error("Wetter Widget Click init error:", e);
    }

    try {
        initAuthListener();
        console.log("Auth Listener OK");
    } catch (e) {
        console.error("Auth Listener init error:", e);
    }

    try {
        initInstallPrompt();
        console.log("Install Prompt OK");
    } catch (e) {
        console.error("Install Prompt init error:", e);
    }

    console.log("All initializations complete");
}

// Wait for DOM and external scripts to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    // DOM already ready, but CryptoJS might not be loaded yet
    // Small delay to ensure all scripts are loaded
    setTimeout(initAll, 100);
}
