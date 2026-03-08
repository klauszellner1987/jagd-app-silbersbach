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
    { id: "gamswild", name: "Gamswild", jagdzeitStart: "01.08", jagdzeitEnde: "15.12", iconClass: "gams" },
    { id: "muffelwild", name: "Muffelwild", jagdzeitStart: "01.08", jagdzeitEnde: "31.01", iconClass: "deer" },

    // ===== RAUBWILD =====
    { id: "fuchs", name: "Fuchs", ganzjaehrig: true, iconClass: "fox" },
    { id: "dachs", name: "Dachs", jagdzeitStart: "01.08", jagdzeitEnde: "31.10", iconClass: "paw" },
    { id: "baummarder", name: "Baummarder", jagdzeitStart: "16.10", jagdzeitEnde: "28.02", iconClass: "marder" },
    { id: "steinmarder", name: "Steinmarder", jagdzeitStart: "16.10", jagdzeitEnde: "28.02", iconClass: "marder" },
    { id: "iltis", name: "Iltis", jagdzeitStart: "01.08", jagdzeitEnde: "28.02", iconClass: "paw" },
    { id: "hermelin", name: "Hermelin", jagdzeitStart: "01.08", jagdzeitEnde: "28.02", iconClass: "paw" },
    { id: "mauswiesel", name: "Mauswiesel", jagdzeitStart: "01.08", jagdzeitEnde: "28.02", iconClass: "paw" },

    // ===== HASEN =====
    { id: "feldhase", name: "Feldhase", jagdzeitStart: "16.10", jagdzeitEnde: "31.12", iconClass: "rabbit" },
    { id: "wildkaninchen", name: "Wildkaninchen", ganzjaehrig: true, iconClass: "rabbit" },

    // ===== FEDERWILD =====
    { id: "stockente", name: "Stockente", jagdzeitStart: "01.09", jagdzeitEnde: "15.01", iconClass: "duck" },
    { id: "fasan", name: "Fasan", jagdzeitStart: "01.10", jagdzeitEnde: "31.12", iconClass: "fasan" },
    { id: "rabenkraehe", name: "Rabenkrähe", jagdzeitStart: "16.07", jagdzeitEnde: "14.03", iconClass: "crow" },
    { id: "elster", name: "Elster", jagdzeitStart: "16.07", jagdzeitEnde: "14.03", iconClass: "crow" },
    { id: "eichelhaeler", name: "Eichelhäher", jagdzeitStart: "16.07", jagdzeitEnde: "14.03", iconClass: "crow" }
];

function showToast(message, type="info", icon = null) {
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
            okBtn.onclick=null;
            cancelBtn.onclick=null;
        };

        okBtn.onclick=() => {
            cleanup();
            resolve(true);
        };

        cancelBtn.onclick=() => {
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
            if (typeof renderWetterDetailPage === 'function') {
                renderWetterDetailPage();
            }
        }
    }

    // Panels schließen, wenn wir nicht auf der Karte sind
    if (targetPage && targetId !== "revier") {
        closeMapPanels();
    }
}

// Side-Panels der Karte (Hochsitze/Flurstücke) schließen
function closeMapPanels() {
    const panels = ["hochsitz-panel", "eigengrundstuecke-panel"];
    panels.forEach(id => {
        const p = document.getElementById(id);
        if (p && !p.classList.contains("hidden")) {
            p.classList.remove("open");
            setTimeout(() => p.classList.add("hidden"), 300);
        }
    });
}

// Navigate back to dashboard
function navigateToDashboard() {
    const allPages = document.querySelectorAll(".page");
    const fabBtn = document.getElementById("fab-add-btn");
    const bottomNav = document.getElementById("bottom-nav");

    allPages.forEach(p => p.classList.remove("active"));
    const dashboard=document.getElementById("dashboard");
    if (dashboard) dashboard.classList.add("active");

    // Hide FAB
    if (fabBtn) fabBtn.classList.remove("visible");

    // Tab Bar ANZEIGEN (nicht mehr ausblenden)
    if (bottomNav) bottomNav.classList.remove("hidden");

    // Tab aktiv markieren
    setActiveTab("dashboard");

    // Alle Karten-Panels (Hochsitze/Flurstücke) schließen
    closeMapPanels();
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

    // Panels schließen, wenn wir nicht auf der Karte sind
    if (pageId !== "revier") {
        closeMapPanels();
    }
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
        const cond=current.conditions || "";
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
        const firstCond=cond.split(",")[0].trim();
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
    if (!user) return;
    
    // Fallback falls kein Name existiert
    const name = user.displayName ? user.displayName.split(" ")[0] : "Waidmann";
    const hour = new Date().getHours();
    let greeting = "Guten Morgen";
    if (hour >= 12 && hour < 18) greeting = "Guten Nachmittag";
    else if (hour >= 18) greeting = "Guten Abend";

    const heroGreeting = document.getElementById("hero-greeting");
    if (heroGreeting) heroGreeting.textContent = `${greeting}, ${name}`;

    const settingsUser = document.getElementById("settings-username");
    if (settingsUser) {
        settingsUser.textContent = user.displayName || "Name eintragen";
    }
}

// Profile Modal öffnen
function openProfileModal() {
    const modal = document.getElementById("profile-modal");
    const nameInput = document.getElementById("profile-name-input");
    if (modal && nameInput) {
        const user = firebase.auth().currentUser;
        if (user && user.displayName) {
            nameInput.value = user.displayName;
        } else {
            nameInput.value = "";
        }
        modal.classList.remove("hidden");
    }
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
let isAppInitialized=false;

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
        submitBtn.disabled=isLoading;
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
        const password=document.getElementById("login-password")?.value;

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
            const isPassword=passwordInput.type === "password";
            passwordInput.type=isPassword ? "text" : "password";

            // Toggle icon visibility
            const eyeOpen = passwordToggle.querySelector(".eye-open");
            const eyeClosed=passwordToggle.querySelector(".eye-closed");
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
                isAppInitialized=true;
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
        isAppInitialized=false;
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
        // Hirschkopf.svg - Korrigierte Koordinaten für korrekte Anzeige
        return `<svg width="${size}" height="${size}" viewBox="0 0 786 1280" fill="white" style="display: block;">
            <g transform="translate(0,1280) scale(0.1,-0.1)">
                <path d="M7639 12784 c-16 -20 -15 -68 8 -244 25 -192 25 -595 -1 -735 -23 -123 -68 -286 -99 -357 -26 -59 -87 -119 -143 -143 -79 -33 -205 -10 -242 44 -10 14 -33 68 -51 120 -63 183 -140 314 -309 531 -238 302 -505 636 -524 653 -30 26 -55 21 -66 -12 -15 -41 33 -153 134 -316 244 -392 374 -717 459 -1155 46 -233 45 -308 -9 -655 -57 -365 -97 -578 -107 -568 -4 4 -15 49 -24 98 -38 209 -140 453 -275 660 -79 121 -118 162 -144 152 -22 -9 8 -146 89 -417 157 -526 179 -677 135 -933 -20 -121 -45 -197 -84 -254 -44 -65 -386 -450 -474 -534 -48 -46 -140 -121 -205 -166 -135 -95 -128 -99 -98 68 121 656 116 919 -24 1347 -41 128 -50 145 -78 163 -40 24 -39 24 -76 -7 -21 -17 -31 -35 -31 -53 0 -15 20 -117 44 -227 47 -207 66 -343 66 -465 0 -102 -27 -269 -59 -370 -16 -47 -135 -339 -266 -647 -236 -558 -238 -562 -264 -556 -14 4 -46 13 -70 21 -25 7 -75 14 -113 14 -87 0 -151 -28 -237 -104 -35 -31 -88 -69 -119 -84 -50 -24 -69 -27 -147 -27 -110 0 -145 15 -200 85 -80 101 -202 173 -310 184 -98 10 -98 10 -136 77 -41 70 -71 164 -124 378 -113 463 -153 918 -140 1627 7 398 7 401 -14 422 -12 12 -34 21 -51 21 -27 0 -33 -6 -51 -47 -109 -252 -157 -547 -145 -888 10 -300 47 -747 75 -922 4 -29 5 -53 1 -53 -4 0 -45 17 -91 38 -46 22 -147 63 -224 92 -592 224 -1139 510 -1340 701 -90 86 -193 219 -236 304 -28 58 -30 67 -36 240 -11 333 23 620 118 1008 66 269 68 304 24 333 -22 14 -27 14 -54 -2 -51 -30 -144 -252 -190 -454 -35 -156 -81 -494 -81 -605 0 -69 -13 -49 -49 75 -76 263 -82 475 -19 670 31 98 72 172 168 310 48 69 207 296 352 505 146 209 301 432 346 495 89 125 100 158 58 185 -19 13 -28 14 -51 3 -32 -15 -291 -303 -497 -555 -168 -205 -207 -243 -246 -243 -37 0 -49 10 -68 55 -25 60 -25 388 0 551 20 131 17 169 -14 179 -59 19 -89 -31 -125 -211 -32 -164 -48 -280 -80 -579 -31 -298 -32 -299 -63 -359 -30 -56 -89 -104 -177 -145 -93 -44 -120 -48 -140 -17 -52 80 -128 354 -144 526 -7 71 -10 289 -9 565 3 417 2 453 -15 478 -26 40 -61 36 -112 -15 -31 -32 -47 -59 -60 -103 -66 -229 -76 -333 -78 -800 -2 -305 0 -338 20 -440 30 -145 74 -275 165 -481 92 -206 124 -293 182 -497 141 -486 337 -802 699 -1125 368 -327 474 -407 1042 -783 253 -168 505 -341 560 -386 171 -138 425 -417 425 -466 0 -36 -22 -22 -91 59 -91 106 -206 206 -308 268 -42 25 -216 111 -386 190 -171 79 -402 189 -513 245 -112 55 -216 101 -231 101 -28 0 -59 -26 -80 -67 -6 -12 -16 -87 -23 -166 -11 -129 -10 -157 5 -244 45 -253 208 -613 377 -831 148 -193 339 -322 550 -375 71 -18 225 -37 306 -37 l51 0 66 -94 c76 -108 144 -227 184 -323 25 -62 28 -81 31 -220 3 -104 -1 -186 -12 -260 -16 -110 -28 -150 -224 -803 -127 -420 -175 -601 -199 -752 -9 -58 -22 -112 -27 -120 -12 -15 -306 -248 -391 -310 -27 -19 -135 -88 -238 -151 -436 -269 -653 -464 -1097 -987 -458 -540 -776 -916 -814 -963 l-39 -47 12 -123 c52 -516 204 -847 443 -960 388 -185 1738 -391 3513 -536 204 -17 423 -36 487 -42 90 -8 125 -8 154 1 43 14 109 71 130 112 8 15 39 46 70 69 79 58 101 110 110 254 12 204 -24 518 -82 711 -42 138 -42 146 9 280 64 169 119 353 187 625 105 423 115 555 100 1369 -5 311 -12 590 -15 622 l-5 56 38 20 c20 11 64 34 96 51 32 17 71 31 86 31 14 0 48 7 73 16 42 14 59 30 148 142 144 181 139 167 100 309 -18 64 -73 247 -123 407 -104 337 -159 544 -188 705 -25 142 -25 178 -1 266 11 39 22 106 26 150 4 44 14 105 22 137 17 61 15 93 -12 242 -17 96 -17 100 1 113 10 7 25 11 33 8 7 -3 56 -10 108 -15 271 -28 580 75 836 279 135 108 263 263 336 408 33 65 128 352 167 501 39 151 65 363 48 390 -6 9 -21 18 -32 20 -22 3 -262 -81 -527 -185 -365 -144 -635 -299 -892 -514 -45 -38 -85 -69 -90 -69 -7 0 -60 66 -66 82 -3 9 520 483 798 722 254 219 391 355 595 589 171 197 232 280 321 440 183 329 309 689 409 1169 39 189 68 271 200 558 220 482 248 590 237 915 -9 254 -42 447 -112 664 -42 130 -72 165 -106 125z" />
            </g>
        </svg>`;
    }

        const svgs = {
        'boar': `<svg width="${size}" height="${size * 0.65078125}" viewBox="0 0 1280.000000 833.000000" fill="white" style="display: block; margin: 0 auto;">
            <g transform="translate(0.000000,833.000000) scale(0.100000,-0.100000)">
                <path d="M10269 8235 l-4 -60 -65 0 c-36 0 -70 -4 -76 -8 -7 -4 -15 0 -18 9
-5 14 -9 14 -23 3 -15 -13 -15 -12 -3 10 l12 24 -33 -24 c-32 -22 -43 -24
-162 -24 -98 0 -126 3 -122 13 3 9 -7 11 -41 8 l-45 -3 22 23 c30 32 15 31
-23 -1 -16 -14 -40 -25 -54 -25 -20 0 -24 5 -25 33 l-1 32 -9 -32 c-9 -31 -13
-33 -52 -33 -37 0 -89 -18 -62 -21 14 -1 -115 -28 -140 -28 -14 -1 -16 2 -7 8
8 5 -11 7 -47 7 -34 -1 -61 0 -61 1 0 2 18 10 40 19 69 28 38 25 -81 -6 -63
-16 -116 -30 -119 -30 -3 0 9 12 25 26 l30 25 -50 -26 c-49 -25 -98 -36 -65
-15 20 13 8 13 -27 -1 -18 -7 -61 -8 -123 -3 -74 6 -88 9 -65 15 20 5 4 7 -44
5 -74 -4 -74 -3 -45 13 20 11 53 16 109 15 47 0 71 2 60 7 -40 15 -172 9 -237
-11 -74 -23 -71 -23 -63 -10 9 14 -8 13 -23 -2 -9 -9 -12 -7 -12 9 0 11 7 26
15 33 8 7 15 18 15 24 0 6 -14 -4 -30 -21 -16 -18 -33 -33 -36 -33 -4 0 -4 21
-1 47 5 44 4 46 -9 23 -7 -14 -13 -37 -14 -52 l0 -28 -32 20 c-18 11 -37 20
-43 20 -5 0 8 -11 30 -23 67 -38 54 -51 -55 -58 -52 -3 -97 -4 -98 -3 -2 1 9
9 25 18 15 8 24 15 18 16 -5 0 -26 -10 -45 -21 l-35 -21 30 33 c36 40 7 21
-54 -35 -42 -39 -47 -35 -12 9 9 12 4 9 -14 -6 -67 -59 -78 -62 -233 -70 -81
-4 -175 -14 -210 -23 -34 -9 -67 -14 -72 -11 -5 3 -20 1 -32 -6 -22 -11 -22
-11 2 16 25 27 24 27 -47 -9 -82 -41 -91 -43 -72 -19 10 13 4 11 -23 -6 -21
-12 -43 -19 -48 -16 -6 4 -21 -1 -32 -12 -14 -12 -19 -13 -13 -3 7 12 5 12
-11 -1 -19 -17 -78 -49 -89 -49 -3 0 -3 4 0 10 3 5 -13 3 -36 -5 -23 -9 -57
-17 -76 -19 -19 -3 -42 -11 -51 -18 -13 -11 -14 -11 -8 0 5 8 29 27 54 43 25
16 40 29 34 29 -17 0 -90 -37 -127 -64 -49 -37 -62 -41 -40 -16 l20 24 -30
-22 c-16 -12 -43 -32 -60 -44 l-30 -22 20 24 c11 14 26 31 34 38 28 23 -5 12
-53 -18 -26 -17 -51 -28 -56 -25 -4 3 -15 -7 -25 -21 -9 -14 -19 -23 -23 -20
-3 4 -16 37 -29 74 -12 37 -20 56 -18 42 16 -73 17 -127 4 -128 -23 -2 -43 -7
-56 -15 -17 -11 -16 3 2 46 24 58 16 67 -10 11 -14 -28 -36 -61 -51 -74 l-25
-25 10 28 c15 40 6 33 -23 -18 -27 -45 -43 -60 -32 -27 4 9 -8 0 -26 -20 -33
-37 -138 -99 -109 -64 13 15 12 16 -13 7 -14 -6 -41 -18 -59 -28 -31 -17 -57
-25 -57 -18 0 2 17 20 38 41 30 29 18 24 -56 -27 -150 -103 -139 -97 -122 -74
12 16 10 16 -11 -2 -25 -23 -45 -31 -35 -15 3 5 -39 -14 -92 -41 -78 -40 -93
-45 -77 -26 l20 23 -25 -15 c-14 -9 -52 -28 -85 -42 -50 -22 -56 -24 -36 -7
35 30 21 25 -89 -30 -106 -53 -115 -57 -104 -38 4 6 -10 -1 -32 -17 l-39 -29
24 27 c31 35 24 34 -36 -3 -53 -33 -223 -90 -188 -63 19 15 19 15 -5 8 -14 -4
-46 -18 -72 -31 -54 -27 -62 -29 -52 -11 4 6 -4 2 -18 -10 -29 -27 -46 -30
-27 -5 8 9 -5 0 -28 -20 -49 -43 -119 -81 -134 -73 -5 4 -18 1 -27 -6 -9 -7
-3 2 13 21 l30 34 -48 -38 c-26 -21 -47 -35 -47 -30 0 4 -5 3 -12 -4 -15 -15
-32 -16 -22 -1 10 16 -29 -6 -46 -25 -13 -16 -35 -23 -26 -8 3 5 1 30 -3 58
-5 27 -9 38 -10 24 -2 -40 -67 -119 -98 -120 -7 0 -24 -12 -39 -27 l-27 -27
-9 24 c-7 19 -11 21 -18 11 -6 -11 -10 -7 -13 15 -4 27 -5 28 -12 7 -4 -13
-11 -21 -15 -18 -5 3 -11 -4 -15 -15 -14 -43 -65 -69 -65 -32 -1 13 -6 10 -25
-13 -19 -23 -25 -26 -25 -12 0 13 -7 10 -30 -15 -24 -27 -32 -30 -39 -19 -7
12 -15 8 -40 -17 -17 -17 -31 -27 -31 -24 0 4 -10 -4 -21 -18 l-21 -25 6 30
c6 28 6 29 -9 10 -33 -45 -37 -48 -46 -33 -7 10 -9 8 -9 -6 0 -19 -1 -19 -13
-2 -11 15 -12 11 -9 -26 l4 -43 -22 20 -23 20 7 -21 c7 -21 6 -21 -40 2 -62
31 -90 31 -39 -1 34 -21 37 -24 17 -25 -13 0 -21 -4 -18 -8 3 -5 -29 -14 -69
-21 -82 -13 -103 -27 -53 -34 18 -2 4 -5 -32 -6 -36 -1 -71 -5 -79 -10 -8 -5
3 -7 31 -4 41 5 97 -11 85 -24 -3 -2 -15 1 -28 7 -19 11 -21 10 -17 -7 5 -19
-15 -47 -26 -36 -3 4 -6 -4 -6 -16 0 -12 -4 -19 -10 -16 -6 3 -7 -1 -4 -10 6
-14 1 -15 -32 -10 -37 6 -38 5 -15 -8 24 -14 24 -14 -15 -22 -21 -4 -33 -10
-26 -12 16 -6 16 -23 -1 -23 -7 0 -30 -14 -51 -32 -36 -29 -66 -44 -66 -32 0
3 7 19 15 37 15 30 15 31 -1 12 -9 -11 -31 -51 -50 -90 -19 -40 -34 -61 -34
-50 -1 13 -10 2 -25 -30 l-24 -50 5 40 c4 30 3 36 -5 25 -6 -8 -11 -25 -11
-37 0 -28 -17 -39 -23 -16 -3 11 -5 6 -7 -12 l-2 -30 -19 40 c-18 36 -20 37
-15 10 l6 -30 -21 35 c-11 19 -18 27 -15 18 20 -68 17 -181 -5 -147 -7 11 -9
10 -9 -6 0 -16 -2 -17 -9 -6 -7 11 -12 3 -22 -27 -7 -23 -19 -48 -28 -55 -12
-10 -14 -9 -7 3 4 8 0 6 -8 -4 -21 -26 -20 -11 4 59 11 32 18 60 16 62 -4 5
-73 -158 -82 -194 -5 -19 -9 -21 -15 -11 -6 9 -9 7 -9 -9 0 -12 -4 -25 -10
-28 -5 -3 -10 1 -10 9 0 33 -29 15 -35 -21 -13 -77 -25 -100 -70 -132 -25 -18
-50 -41 -55 -52 -6 -10 -15 -19 -20 -19 -14 0 -12 31 5 81 13 38 13 41 0 25
-8 -10 -29 -62 -47 -115 -27 -81 -33 -92 -39 -71 -7 24 -7 24 -8 -6 -1 -16
-15 -52 -32 -80 -28 -43 -33 -47 -40 -29 -4 11 -8 43 -9 70 -5 108 -18 110
-19 2 -1 -100 -17 -177 -37 -177 -4 0 -4 28 -2 63 6 60 5 61 -7 27 -16 -41
-19 -20 -5 29 16 58 3 46 -16 -14 -18 -56 -18 -56 -35 -34 -10 13 -20 48 -24
78 -4 30 -11 64 -16 75 -7 16 -8 11 -4 -19 5 -37 3 -34 -29 33 -19 39 -37 72
-41 72 -3 0 4 -18 15 -40 24 -48 25 -57 3 -39 -15 13 -15 12 -4 -10 11 -19 15
-21 23 -10 8 11 9 10 4 -3 -3 -10 3 -33 14 -51 22 -37 23 -71 7 -211 -9 -79
-14 -93 -40 -120 -29 -30 -29 -30 -22 -6 4 14 14 38 22 54 10 19 11 26 3 21
-7 -4 -31 -46 -53 -94 -31 -67 -42 -81 -47 -66 -5 14 -8 9 -14 -24 -8 -55 -36
-121 -43 -102 -3 8 -13 -2 -24 -25 -10 -22 -17 -30 -15 -19 3 11 7 40 10 65 5
37 2 32 -17 -30 -13 -41 -33 -90 -45 -109 l-21 -34 -7 53 -7 53 -24 -83 c-30
-105 -45 -133 -107 -202 -28 -31 -69 -85 -90 -120 -35 -57 -38 -60 -32 -28 4
19 20 58 37 85 l31 50 -41 -39 c-28 -27 -49 -62 -68 -110 -14 -39 -31 -75 -36
-81 -7 -7 -8 -4 -4 8 9 25 -2 21 -14 -5 -7 -18 -8 -12 -4 25 6 65 -1 59 -15
-10 -15 -80 -31 -112 -25 -53 l5 45 -15 -45 c-8 -25 -17 -58 -20 -73 -3 -15
-10 -25 -15 -22 -6 4 -10 -6 -10 -22 -1 -26 -29 -91 -30 -68 0 6 -5 3 -10 -5
-7 -12 -10 -8 -11 15 -1 40 -7 22 -23 -66 l-14 -74 -2 60 c-2 40 -5 50 -8 30
l-5 -30 -8 25 c-5 15 -6 -1 -3 -40 l5 -65 -38 108 c-41 118 -57 130 -24 19 13
-41 21 -95 20 -133 l-1 -64 -13 45 c-7 25 -14 38 -15 30 0 -8 -12 9 -25 38
-13 28 -26 52 -29 52 -3 0 4 -20 15 -45 25 -57 37 -145 19 -145 -9 0 -10 -11
-6 -38 6 -32 5 -34 -6 -17 -7 11 -18 40 -25 65 -13 45 -13 44 -8 -30 3 -43 1
-81 -5 -90 -8 -12 -10 -9 -11 15 -1 29 -1 29 -9 5 l-7 -25 -5 30 c-3 17 -4 8
-2 -20 3 -48 -12 -150 -16 -110 -1 15 -4 11 -11 -11 -9 -32 -30 -45 -94 -59
-16 -3 -61 -21 -100 -40 -230 -110 -306 -149 -316 -162 -7 -8 -31 -24 -53 -35
-23 -11 -61 -34 -86 -51 -112 -77 -258 -146 -315 -148 -30 -2 -29 -2 5 -9 l35
-6 -40 -8 c-22 -4 -62 -15 -88 -24 -37 -13 -44 -18 -30 -23 12 -5 7 -8 -18 -8
-27 -1 -46 -10 -70 -33 -19 -17 -26 -29 -17 -25 10 3 18 3 18 -2 0 -4 -15 -13
-32 -19 -23 -7 -27 -10 -13 -11 13 -1 -1 -11 -35 -28 -30 -14 -58 -30 -61 -35
-3 -4 -25 -14 -50 -22 l-44 -14 45 -2 c38 -2 41 -3 20 -10 -14 -4 -18 -9 -10
-10 8 -1 -3 -7 -25 -14 -37 -12 -38 -13 -16 -20 30 -10 11 -25 -34 -27 -29 -1
-30 -1 -5 -9 24 -8 24 -8 3 -9 -13 -1 -23 -5 -23 -11 0 -5 -11 -12 -25 -16
-14 -3 -23 -10 -20 -14 3 -5 -7 -13 -22 -18 -22 -8 -24 -11 -8 -12 11 0 -8
-13 -43 -27 -35 -14 -61 -27 -59 -29 2 -3 20 3 40 11 48 20 47 11 0 -14 -45
-24 -37 -27 14 -6 54 23 51 11 -6 -24 -66 -40 -65 -49 0 -15 28 14 54 23 57
20 3 -3 1 -6 -4 -6 -5 0 -20 -9 -34 -20 l-25 -19 25 6 c23 6 24 5 10 -12 -13
-17 -10 -16 21 3 46 28 58 28 28 1 l-24 -21 35 19 c45 25 69 19 43 -9 -18 -21
-18 -21 12 -6 17 9 41 19 55 23 l25 7 -25 -28 c-14 -16 -18 -23 -9 -16 9 7 21
12 25 10 5 -1 20 3 34 10 l25 13 -25 -23 c-14 -13 -37 -31 -50 -41 -21 -16
-20 -16 11 1 20 11 49 27 65 37 28 17 29 17 9 -1 -12 -11 -27 -28 -35 -38 -13
-17 -11 -17 29 3 23 12 50 20 58 17 8 -3 24 -1 36 6 57 32 61 15 7 -37 -57
-55 -41 -56 24 -1 55 46 80 60 55 29 -13 -15 -12 -15 8 -5 12 7 25 17 28 22 8
13 55 13 55 1 0 -5 -15 -21 -32 -35 -38 -30 -29 -35 10 -8 15 10 34 23 42 27
13 8 13 7 1 -8 -19 -24 2 -21 24 3 20 22 24 23 44 11 11 -7 8 -20 -18 -65 -38
-65 -36 -73 4 -16 15 22 30 38 33 35 3 -3 15 4 26 14 17 16 28 18 56 12 31 -6
35 -10 33 -37 -3 -27 -1 -26 22 16 15 26 23 34 19 20 -5 -21 -2 -20 22 12 36
46 45 48 33 6 -14 -49 -3 -45 17 7 10 28 20 42 24 34 5 -8 12 -4 20 12 24 45
55 53 46 12 -5 -26 -5 -26 11 5 18 34 43 43 43 15 0 -11 10 -3 26 22 24 39 25
39 20 10 l-6 -30 16 29 17 30 12 -30 12 -29 8 25 c5 14 9 29 10 33 0 5 11 15
25 23 l25 15 -25 -6 -25 -6 25 20 c14 11 22 23 18 27 -4 4 -14 1 -23 -6 -9 -7
-18 -11 -21 -8 -2 3 20 22 50 43 58 39 86 75 43 55 -12 -6 -2 7 23 29 45 41
47 50 7 30 -20 -9 -20 -9 -4 4 9 8 17 19 17 24 0 6 10 18 22 27 13 9 16 14 8
11 -8 -3 -6 1 6 10 11 8 36 29 54 45 28 25 30 30 14 31 -14 0 -15 2 -4 6 8 3
42 19 75 35 33 17 85 38 116 48 61 19 135 66 251 158 40 33 84 64 98 71 21 10
20 8 -5 -11 -16 -12 -52 -43 -80 -68 -123 -113 -203 -170 -237 -170 -14 0
-109 -48 -118 -59 -3 -4 -16 -12 -30 -18 -14 -7 -18 -12 -10 -12 9 -1 -8 -23
-40 -52 -30 -28 -48 -48 -40 -43 8 4 4 -5 -9 -19 -14 -15 -21 -27 -16 -27 5 0
0 -7 -11 -16 -18 -14 -18 -15 4 -4 39 19 35 6 -8 -29 -45 -36 -54 -61 -12 -34
27 17 27 17 12 -2 -8 -11 -26 -29 -40 -40 -13 -11 -36 -31 -50 -44 l-25 -23
27 16 c32 19 49 3 18 -16 -27 -17 -26 -31 3 -18 21 11 21 11 -2 -8 -16 -13
-20 -21 -12 -26 6 -4 16 -4 21 -1 6 3 10 2 10 -4 0 -6 -9 -15 -21 -21 -11 -7
-18 -14 -15 -17 3 -3 24 6 46 21 56 37 50 14 -13 -46 -49 -47 -50 -50 -17 -33
l35 17 -34 -36 c-19 -20 -30 -36 -25 -36 6 0 14 3 18 7 3 4 13 8 22 9 11 2 8
-7 -11 -32 -29 -38 -28 -39 12 -23 25 9 22 4 -22 -40 -49 -51 -52 -68 -5 -31
34 27 48 25 24 -2 -49 -56 -49 -57 -5 -54 35 3 39 1 31 -14 -5 -9 -16 -22 -24
-30 -9 -7 -16 -17 -16 -23 0 -6 11 0 24 12 l23 22 -2 -26 c-4 -27 5 -26 43 8
27 25 26 27 2 -52 -11 -35 -18 -66 -15 -69 3 -3 5 0 5 7 0 7 5 9 12 5 8 -5 9
-2 5 9 -3 9 -2 16 3 14 5 -1 16 7 25 18 15 18 15 17 0 -15 l-16 -35 19 22 20
23 -2 -24 c0 -13 -5 -22 -10 -18 -5 3 -6 0 -2 -7 4 -6 2 -18 -4 -26 -26 -32 6
-13 48 28 39 36 42 38 26 12 l-18 -30 28 25 29 25 -13 -25 -13 -25 22 20 22
19 -6 -29 -6 -30 16 25 15 25 -6 -30 c-4 -25 -2 -23 15 12 22 47 36 59 21 17
-14 -36 -12 -42 5 -19 9 10 26 20 39 21 18 1 22 -4 19 -20 -3 -20 -3 -19 8 2
13 24 39 30 39 10 1 -7 8 1 18 17 l16 30 6 -35 6 -35 7 33 c7 36 27 35 27 -1
1 -21 2 -21 21 6 11 15 29 27 39 27 10 0 22 5 25 10 4 6 10 8 15 5 4 -3 24 2
44 10 47 20 81 20 46 0 -24 -14 -24 -14 15 -9 l40 4 -40 -20 -40 -20 35 7 c19
3 44 7 55 9 11 1 34 5 50 9 l30 7 -30 -21 c-16 -11 -40 -21 -53 -21 -13 0 -36
-7 -52 -15 -17 -9 -30 -12 -30 -8 0 4 -5 2 -12 -5 -7 -7 -20 -12 -30 -12 -10
0 -28 -15 -39 -32 -19 -30 -20 -31 -15 -7 8 38 -22 34 -33 -5 l-9 -31 -1 40
-2 40 -14 -27 c-10 -17 -22 -26 -34 -23 -24 4 -26 -35 -5 -136 13 -70 13 -83
-2 -149 -9 -40 -14 -87 -11 -105 10 -60 -18 -224 -44 -260 -5 -6 -10 -22 -13
-35 -3 -14 -19 -65 -36 -114 -17 -48 -29 -91 -26 -93 3 -3 -3 -22 -13 -42 -21
-43 -53 -147 -79 -256 -21 -86 -37 -134 -59 -177 -8 -15 -13 -33 -12 -40 2 -7
-5 -37 -14 -67 -9 -30 -17 -56 -17 -58 0 -2 10 -3 23 -3 12 0 31 -6 42 -13 11
-7 54 -27 95 -45 66 -27 89 -31 190 -35 63 -2 126 -10 140 -16 24 -11 24 -11
-5 -4 -16 3 -82 7 -145 8 -105 1 -121 4 -185 32 -38 18 -82 35 -98 38 -15 4
-30 11 -33 16 -6 10 -64 12 -88 3 -30 -11 -16 -23 42 -35 69 -15 45 -24 -29
-11 -49 9 -55 8 -86 -17 -69 -55 -25 -146 85 -172 39 -10 60 -25 122 -89 96
-99 104 -103 193 -95 52 5 89 2 133 -9 119 -31 256 -16 335 36 50 34 81 101
74 160 -6 45 -5 48 46 105 29 32 59 62 68 66 9 4 28 25 42 45 49 68 138 162
144 151 4 -5 -9 -30 -29 -54 -20 -24 -36 -48 -36 -54 0 -5 -6 -14 -13 -18 -7
-4 -23 -25 -36 -45 -12 -21 -28 -41 -35 -45 -18 -12 -106 -123 -107 -136 -5
-47 10 -87 32 -87 11 0 28 -4 38 -9 9 -5 23 -6 31 -1 8 5 22 2 37 -7 19 -12
23 -13 23 -2 1 10 5 8 14 -4 10 -12 16 -15 21 -7 5 8 11 8 21 -1 8 -6 14 -8
14 -3 0 5 5 2 10 -6 7 -11 10 -11 10 -2 0 7 5 10 10 7 6 -3 10 1 10 9 0 19 11
20 29 4 11 -11 12 -8 7 12 -7 24 -6 24 9 -2 19 -35 29 -36 21 -4 -3 14 -2 28
4 31 5 3 10 15 10 25 0 13 17 26 53 43 49 24 107 69 107 85 0 18 136 61 195
62 49 1 156 26 164 38 3 5 29 19 56 32 28 12 44 24 36 27 -7 3 28 25 78 49 96
45 119 63 50 39 -49 -18 -62 -19 -54 -5 3 6 -1 13 -11 17 -13 5 -11 8 12 19
l29 13 -27 -5 c-47 -10 -31 2 32 26 57 21 99 51 51 35 -21 -6 88 101 139 138
l25 18 -25 -12 c-36 -16 75 95 126 126 23 14 49 34 59 45 18 20 18 20 -21 5
l-39 -16 25 21 c70 58 95 77 138 103 26 16 39 26 30 23 -30 -9 -20 12 20 40
20 16 42 32 47 37 14 13 -35 -12 -67 -35 -16 -11 -28 -17 -28 -14 0 3 51 43
114 90 94 70 113 89 109 106 -3 11 -1 20 3 20 5 0 25 14 44 31 23 20 27 26 12
19 l-23 -11 17 28 c10 15 34 45 53 67 31 33 33 37 11 26 -15 -7 -5 6 26 36 29
27 61 70 72 95 11 26 25 50 31 53 6 4 20 26 31 50 10 23 26 48 34 55 9 8 13
18 10 23 -3 5 5 21 17 35 13 15 18 23 12 19 -35 -20 0 37 61 103 37 39 39 43
16 37 -24 -7 -25 -7 -5 9 11 9 19 20 18 25 -1 5 23 32 55 61 51 47 53 51 19
31 -42 -24 -40 -18 10 45 22 27 29 43 20 46 -8 3 -1 16 20 38 18 19 32 38 31
43 0 5 34 39 77 75 43 36 90 82 104 101 l25 35 -29 -25 c-32 -28 -27 -18 30
53 42 53 196 183 171 144 -9 -13 -45 -47 -81 -75 -35 -29 -70 -62 -76 -75 -8
-15 2 -9 31 18 48 45 41 29 -27 -65 -34 -48 -39 -58 -18 -40 l28 25 -26 -40
c-15 -22 -61 -71 -102 -109 -42 -37 -74 -71 -71 -73 3 -3 -10 -24 -29 -47
l-34 -42 37 2 c40 3 106 22 82 23 -29 2 12 19 62 26 26 4 48 10 48 15 0 4 54
10 120 14 98 6 131 12 178 33 31 15 59 29 62 33 3 4 47 28 98 54 79 40 92 50
92 71 0 14 -4 25 -8 25 -7 0 -36 108 -37 140 0 9 -11 16 -27 18 -16 2 -28 7
-28 11 0 9 -11 12 -73 15 -45 3 -73 11 -44 14 71 5 117 1 117 -11 0 -5 11 -6
24 -3 20 5 26 1 36 -27 6 -17 18 -47 26 -65 8 -18 14 -39 14 -47 0 -8 5 -15
10 -15 6 0 10 -11 10 -24 0 -14 4 -27 9 -30 5 -3 21 -40 36 -81 16 -42 36 -80
47 -86 10 -5 18 -6 18 -2 0 4 10 -12 22 -37 12 -25 28 -49 35 -53 23 -14 64
-110 70 -164 3 -29 9 -53 14 -53 4 0 4 -13 -2 -28 -7 -19 -6 -38 1 -56 5 -15
10 -50 10 -77 0 -35 4 -51 15 -55 8 -4 15 -12 15 -19 0 -8 8 -21 17 -31 9 -9
18 -28 19 -43 2 -14 7 -47 12 -73 5 -26 8 -60 6 -75 -2 -16 -1 -22 2 -15 8 17
34 -31 34 -62 0 -12 9 -46 21 -76 45 -118 59 -174 51 -205 -5 -16 -7 -86 -6
-155 2 -105 -1 -131 -17 -163 -22 -45 -24 -60 -4 -33 13 18 14 14 11 -41 -2
-34 -7 -66 -10 -72 -4 -6 -8 -37 -10 -69 -1 -31 -10 -72 -20 -90 -9 -18 -14
-37 -11 -42 3 -5 1 -19 -5 -30 -7 -13 -7 -20 -1 -20 6 0 -3 -23 -20 -51 -21
-37 -25 -50 -14 -45 17 6 15 1 -17 -46 -11 -16 -16 -28 -13 -28 4 0 -3 -12
-14 -26 -22 -28 -28 -50 -12 -39 24 14 17 -16 -14 -62 -38 -57 -102 -116 -156
-143 -55 -29 -64 -45 -40 -69 29 -29 130 -30 148 -2 7 10 57 54 113 96 109 84
120 97 120 147 1 18 7 46 13 62 12 26 12 21 9 -45 -2 -41 -9 -80 -15 -87 -5
-7 -47 -38 -91 -69 -112 -78 -136 -101 -136 -135 0 -20 8 -31 29 -43 47 -24
168 -38 276 -32 104 6 162 21 224 60 38 23 76 39 153 63 42 14 49 20 59 55 7
21 16 39 21 39 8 0 5 23 -9 74 -4 13 -1 16 8 11 9 -6 11 -3 6 10 -27 68 -29
107 -13 190 20 99 45 189 52 182 3 -2 -7 -48 -21 -102 -24 -94 -35 -195 -15
-150 8 18 9 17 9 -8 1 -46 29 -86 84 -120 71 -45 102 -57 142 -57 32 0 35 3
35 29 0 16 -19 61 -41 101 -33 57 -42 84 -47 136 -6 74 17 229 29 198 7 -17 8
-16 8 6 1 38 -22 97 -49 125 -20 21 -21 25 -6 19 15 -6 14 -1 -8 32 -28 42
-50 133 -39 161 6 15 4 16 -9 5 -13 -10 -16 -9 -21 9 -3 12 1 35 8 50 8 15 12
36 8 45 -4 12 -3 15 6 10 8 -6 10 -1 6 17 -4 14 -1 35 5 47 9 17 9 21 0 15 -9
-6 -9 -2 -1 14 7 12 9 26 6 31 -3 5 -1 19 6 31 8 15 8 19 0 15 -10 -6 -15 6
-12 27 0 4 -6 7 -16 7 -14 0 -14 2 2 20 17 19 17 20 -1 21 -17 0 -16 2 4 11
26 13 29 28 5 28 -15 0 -16 2 -3 9 8 6 18 7 22 5 8 -5 11 11 10 58 0 19 3 25
14 21 8 -3 14 -1 14 5 0 6 -5 12 -12 14 -20 7 2 28 30 28 27 1 27 1 -7 19 -27
14 -30 19 -17 24 15 6 15 9 2 36 -18 34 -13 41 28 41 24 0 27 3 16 10 -12 8
-9 10 12 10 l28 0 -22 22 c-12 13 -33 31 -47 40 l-26 18 43 0 c24 0 53 5 64
11 19 10 18 12 -19 29 -50 22 -62 39 -25 33 l27 -4 -25 15 c-14 8 -19 15 -12
16 17 0 15 29 -3 36 -28 11 -16 51 33 105 29 33 40 50 27 45 -18 -6 -17 -5 3
17 13 13 22 28 20 33 -1 5 3 19 10 32 7 12 11 26 8 31 -3 5 1 14 9 21 8 7 12
16 9 21 -3 5 2 19 10 31 20 28 20 38 1 38 -12 0 -13 4 -6 19 6 10 7 21 4 25
-3 3 2 15 12 26 10 11 15 20 11 20 -3 0 1 11 10 25 12 18 13 25 4 25 -10 0
-10 3 0 15 7 8 9 15 5 15 -4 0 -2 7 5 15 7 9 10 18 7 22 -4 3 -1 13 6 21 10
13 9 15 -6 9 -10 -4 -16 -3 -12 2 3 5 1 12 -5 16 -6 4 -7 12 -3 18 4 7 8 19 8
27 0 8 7 26 14 39 8 14 9 21 2 17 -14 -9 -14 7 0 21 5 5 12 27 14 47 2 21 11
46 20 56 9 10 14 24 10 29 -3 6 0 11 7 11 10 0 9 3 -2 11 -11 8 -12 12 -2 16
6 2 12 15 12 28 0 13 5 27 10 30 6 3 10 14 10 25 0 10 14 44 30 75 21 39 25
53 13 44 -14 -11 -13 -7 4 23 18 31 19 36 5 31 -11 -4 -6 6 12 25 17 18 26 32
22 32 -4 0 2 13 13 29 23 32 27 46 10 35 -17 -10 21 57 58 103 19 23 48 46 65
52 37 13 49 7 18 -9 -12 -6 -19 -14 -17 -17 3 -3 -8 -23 -24 -46 -29 -40 -37
-71 -21 -81 5 -3 43 17 84 44 42 26 79 46 82 43 2 -3 21 7 41 22 19 15 38 25
42 22 3 -4 14 -2 25 4 11 6 32 12 46 14 15 2 51 9 81 14 68 14 71 13 41 -5
l-25 -15 30 5 c72 12 129 16 110 7 -41 -18 47 -24 106 -7 30 9 102 18 160 21
57 2 127 11 154 20 28 8 65 18 83 20 18 3 60 19 93 36 34 16 58 25 54 19 -4
-6 12 -2 35 10 23 12 44 19 47 16 3 -3 26 6 52 20 39 22 42 23 22 5 -13 -12
-22 -23 -20 -25 7 -7 113 15 141 30 15 8 35 14 45 14 10 0 40 16 67 35 27 19
53 35 58 35 4 0 -12 -26 -36 -57 -41 -54 -97 -99 -108 -88 -3 3 -25 -3 -49
-14 -24 -11 -66 -22 -94 -26 l-50 -6 24 20 c30 27 18 27 -27 -1 -20 -12 -32
-16 -28 -9 5 7 -15 0 -44 -14 -29 -14 -49 -21 -45 -15 4 6 -22 -3 -57 -21 -34
-18 -74 -33 -88 -35 -14 -2 -54 -11 -90 -22 -74 -22 -173 -35 -166 -23 7 11
-78 2 -134 -14 -76 -22 -95 -25 -125 -16 -17 5 -22 10 -13 10 9 1 19 5 22 9 3
5 -18 5 -47 1 -29 -4 -61 -8 -72 -8 -17 -1 -18 1 -5 10 11 8 1 8 -35 3 -27 -4
-62 -8 -76 -9 -14 -2 -36 -8 -49 -15 -18 -10 -21 -9 -15 1 9 14 -5 7 -50 -26
-46 -33 -59 -40 -51 -26 4 6 -28 -11 -71 -39 -82 -53 -104 -61 -82 -32 7 9 -1
4 -19 -12 -30 -28 -44 -55 -21 -41 6 4 0 -12 -12 -36 -17 -34 -18 -41 -5 -30
12 10 10 0 -9 -40 -14 -30 -25 -64 -25 -76 0 -12 -4 -24 -9 -27 -12 -8 -2 -42
16 -58 25 -20 124 -48 173 -48 37 0 51 -6 83 -35 44 -40 87 -117 87 -154 0
-34 17 -51 49 -51 45 0 48 9 48 120 -1 88 2 112 21 150 26 56 89 125 166 184
55 43 60 44 85 32 38 -20 245 -205 251 -224 3 -9 13 -29 24 -45 14 -21 17 -36
11 -65 -4 -20 -8 -50 -9 -66 -1 -27 3 -31 38 -38 30 -6 43 -5 55 6 16 16 44
171 36 197 -3 9 1 22 10 29 8 7 15 21 15 32 0 30 25 69 74 117 45 43 49 45
139 56 84 11 95 10 129 -7 49 -24 63 -51 48 -89 -10 -23 -10 -32 0 -44 32 -38
80 2 120 101 16 38 41 74 74 107 62 59 79 69 109 62 15 -4 35 3 62 21 31 21
43 24 57 15 10 -6 31 -11 48 -11 38 0 70 -31 70 -69 0 -38 19 -91 33 -92 32
-3 55 5 80 29 27 25 28 31 22 80 -4 34 -2 65 5 83 10 23 10 32 0 44 -11 13 -9
19 8 38 11 12 25 41 31 64 20 75 117 181 143 155 29 -29 99 5 78 38 -5 8 -10
21 -10 28 0 18 24 4 135 -76 50 -36 104 -70 120 -78 17 -7 39 -22 50 -34 24
-27 67 -50 93 -50 33 0 55 35 48 75 -3 19 -9 51 -12 71 -7 40 17 115 47 145
16 16 23 17 46 8 58 -23 105 -27 154 -13 27 8 65 14 86 14 21 -1 91 2 156 6
l117 7 -2 73 c-2 51 1 77 11 86 11 11 12 9 6 -10 -3 -12 -3 -48 1 -80 6 -46 9
-52 15 -32 6 22 7 21 8 -11 1 -22 7 -39 15 -42 19 -8 32 -127 19 -184 -11 -47
-8 -57 7 -20 6 15 7 1 5 -45 -2 -39 1 -66 6 -62 12 7 11 -3 -1 -27 -8 -14 -7
-19 1 -19 9 0 9 -3 0 -14 -9 -11 -9 -15 1 -18 10 -4 12 -36 10 -139 -3 -155
-4 -151 2 -249 3 -47 -1 -93 -9 -123 -8 -26 -11 -46 -7 -43 4 2 7 -39 6 -92 0
-53 5 -115 12 -139 14 -45 12 -127 -5 -190 -5 -21 -8 -92 -6 -158 1 -66 -1
-139 -5 -162 -5 -28 -4 -40 3 -36 7 4 8 -17 2 -63 -4 -38 -6 -92 -6 -119 1
-28 -5 -69 -13 -93 -9 -24 -11 -40 -6 -37 12 8 12 -1 0 -45 -5 -20 -12 -60
-14 -90 -7 -80 -13 -117 -26 -141 -8 -15 -9 -19 -1 -15 14 9 14 7 -5 -45 -9
-24 -17 -53 -18 -64 -2 -11 -6 -31 -11 -44 -5 -15 -4 -21 3 -17 20 12 -7 -57
-39 -101 -16 -24 -26 -43 -20 -43 12 0 -11 -70 -39 -118 -24 -41 -25 -49 -3
-31 14 13 14 10 -1 -20 -16 -30 -16 -33 -2 -28 9 4 16 4 16 0 0 -3 -25 -54
-56 -112 -53 -100 -54 -104 -24 -76 l32 30 -16 -33 c-9 -18 -35 -46 -58 -62
-44 -32 -44 -36 -3 -20 25 9 24 7 -17 -51 -63 -90 -159 -174 -247 -216 -116
-54 -136 -80 -83 -106 36 -19 130 -29 152 -17 10 6 21 23 25 39 12 54 68 89
180 110 87 17 109 28 124 61 7 17 19 36 26 43 7 8 20 36 28 63 l15 49 -5 -45
c-15 -134 -36 -158 -170 -200 -104 -32 -141 -58 -162 -112 -25 -67 22 -83 208
-74 242 12 340 35 418 98 21 17 53 37 71 45 32 13 33 16 27 56 -17 109 -17
112 -6 97 9 -12 11 -10 11 13 0 15 4 27 9 27 5 0 11 18 15 40 6 42 76 224 82
217 2 -2 -5 -33 -15 -70 -54 -188 -32 -265 96 -331 61 -31 63 -25 29 101 -21
77 -20 286 1 243 12 -23 12 -22 7 15 -4 31 -3 36 6 25 8 -11 9 15 4 100 -4 82
-3 111 5 100 16 -23 14 26 -3 84 -12 41 -12 45 0 35 20 -17 18 -5 -12 54 -19
36 -22 47 -10 38 26 -22 28 -9 11 63 -18 81 -20 119 -4 96 8 -11 9 -6 5 20
-23 143 -17 222 23 297 25 47 41 93 41 117 0 14 4 26 8 26 9 0 29 69 37 134 5
35 9 45 16 35 7 -11 9 -10 9 5 0 11 4 33 9 50 6 17 17 64 26 105 9 41 23 84
31 95 8 11 14 30 14 41 0 11 9 34 20 50 11 17 20 37 20 46 0 9 7 30 15 45 8
16 15 37 15 47 0 9 5 17 10 17 6 0 10 7 10 15 0 8 5 15 10 15 6 0 10 12 10 28
1 15 7 38 15 52 8 14 15 39 15 55 0 17 9 63 20 104 11 41 20 90 20 108 0 18 9
50 20 70 11 21 20 48 20 60 0 13 5 23 10 23 6 0 10 8 10 18 0 21 24 73 50 112
10 14 21 39 24 57 4 17 14 37 22 44 8 6 19 32 26 56 7 31 13 41 19 31 6 -9 9
-1 10 22 0 19 5 46 9 60 l8 25 1 -27 c2 -42 18 -42 26 -1 3 21 15 54 26 73
l20 35 -6 -35 c-5 -30 -1 -27 24 25 35 73 60 107 61 85 1 -8 10 5 21 29 21 47
37 52 19 7 -5 -15 -6 -25 -1 -22 7 5 39 86 58 146 4 13 5 13 13 0 7 -11 10 -7
10 15 0 17 9 48 19 70 17 36 20 37 21 15 1 -16 8 -2 21 40 12 36 25 70 30 75
7 7 8 3 4 -10 -7 -26 16 22 54 108 17 38 34 66 39 63 13 -8 52 66 78 148 13
39 23 65 24 59 0 -7 4 -13 9 -13 4 0 11 26 14 58 2 31 11 70 18 86 l14 29 5
-24 c5 -18 11 -4 25 56 18 75 19 78 26 45 l6 -35 2 36 c1 36 18 139 28 173 4
15 7 16 14 5 6 -9 9 1 9 31 0 60 19 91 21 35 2 -46 5 -34 14 48 4 31 10 55 15
52 4 -3 14 28 21 67 l14 73 5 -55 5 -55 7 55 c4 30 11 91 15 135 6 67 8 74 14
45 4 -24 7 -7 8 54 1 81 2 88 16 70 14 -18 14 -18 8 3 -3 13 -2 53 3 90 l8 68
7 -45 c5 -27 6 8 5 87 -2 115 -1 130 11 115 13 -15 14 -6 8 68 -3 47 -8 106
-10 132 -1 25 -6 52 -11 60 -5 9 -2 9 11 -2 17 -14 17 -13 10 10 -32 99 -45
182 -25 150 14 -22 12 -7 -5 33 -18 44 -19 50 -3 41 8 -5 9 -2 4 12 -9 24 -46
175 -46 189 0 6 5 3 10 -5 14 -20 3 30 -21 95 -18 50 -18 50 1 25 11 -14 20
-29 20 -34 0 -5 3 -7 6 -3 4 3 -12 38 -35 77 -22 40 -41 76 -41 82 0 6 -10 27
-22 46 -12 20 -16 32 -8 27 13 -8 -35 83 -72 137 -11 16 -17 32 -14 37 6 9
-18 45 -68 100 -25 27 -27 33 -11 27 16 -5 15 -2 -6 17 -25 23 -27 31 -31 133
-4 101 -24 187 -35 156 -3 -7 -14 5 -25 28 -11 22 -34 50 -50 61 l-30 22 13
-21 c20 -33 7 -34 -55 -7 l-57 25 7 38 c4 20 15 61 25 91 23 65 23 65 4 57
-19 -7 -19 -1 1 30 20 30 61 52 117 64 l42 8 -35 1 c-33 2 -34 2 -16 16 27 20
164 20 212 0 19 -8 32 -10 29 -5 -21 34 105 -38 149 -84 l38 -41 -21 42 c-11
23 -21 50 -21 60 0 10 9 0 19 -22 10 -22 31 -51 47 -65 16 -14 24 -18 18 -10
-6 8 -25 42 -43 75 -22 40 -26 52 -12 36 30 -34 26 -16 -9 34 -76 110 -173
167 -300 173 -60 4 -79 7 -65 14 13 5 -2 6 -40 3 -79 -7 -134 -35 -211 -108
-68 -63 -77 -64 -43 -7 l21 35 -36 -35 c-20 -19 -46 -54 -57 -78 -19 -39 -21
-56 -16 -148 l5 -104 -29 20 c-15 12 -41 36 -56 54 -15 18 -42 41 -60 50 -17
9 -35 21 -39 27 -5 8 -1 8 14 0 11 -6 24 -11 29 -11 4 0 -30 23 -77 50 -106
63 -135 90 -67 61 78 -34 68 -24 -28 27 -87 46 -198 122 -191 130 2 2 21 -4
42 -13 76 -33 90 -37 78 -25 -6 6 -46 26 -90 45 -89 39 -86 45 7 15 115 -35
79 -7 -51 40 l-75 28 60 7 c93 10 96 13 15 14 -119 2 -123 21 -5 21 97 0 292
24 304 36 3 4 -7 4 -24 1 -58 -12 -261 -28 -305 -25 l-45 3 53 12 c52 13 149
57 187 87 11 8 -18 -3 -64 -26 -76 -38 -92 -42 -170 -44 -83 -3 -84 -3 -32 7
74 13 76 19 5 20 -42 0 -53 3 -39 9 13 6 -12 9 -75 10 -91 2 -98 15 -10 20 47
2 30 7 -55 15 l-69 7 69 22 c65 21 155 62 155 70 0 2 -33 -9 -74 -25 -73 -28
-259 -59 -273 -46 -11 12 4 19 84 44 l78 23 -58 -6 c-32 -3 -84 -14 -115 -25
-43 -14 -52 -15 -38 -4 33 25 117 52 196 64 125 18 129 20 35 16 -58 -2 -111
-11 -149 -24 -80 -29 -81 -27 -6 18 36 22 74 50 85 62 16 18 11 17 -25 -8 -63
-42 -97 -58 -160 -77 -47 -13 -52 -13 -36 -1 24 18 8 20 -47 4 -52 -14 -58 -5
-13 22 41 24 43 35 2 20 -41 -16 -31 1 24 38 28 19 50 36 50 38 0 5 -84 -40
-165 -88 -30 -18 -37 -19 -26 -6 13 16 12 17 -13 7 -56 -21 -59 -9 -6 21 30
16 62 37 70 46 13 14 11 14 -13 -1 -34 -21 -151 -66 -172 -66 -10 0 -3 11 17
30 18 16 27 30 20 30 -7 0 -10 4 -7 10 3 5 -16 0 -42 -11 -26 -12 -61 -25 -78
-29 -16 -4 -39 -11 -50 -16 -19 -8 -20 -7 -2 19 l17 26 -37 -25 c-20 -13 -43
-22 -51 -19 -7 3 -19 5 -25 5 -7 0 -1 9 13 20 l25 20 -38 -15 c-35 -15 -62
-13 -54 3 2 4 1 30 -3 57 l-7 50 -4 -60z m306 -60 c-16 -13 -34 -24 -40 -24
-5 0 4 11 20 24 17 14 35 25 40 25 6 0 -3 -11 -20 -25z m-3595 -3491 c30 -31
46 -52 34 -46 -18 9 -102 102 -92 102 2 0 28 -25 58 -56z m60 -89 c19 -19 29
-35 24 -35 -6 0 -25 16 -44 35 -19 19 -29 35 -24 35 6 0 25 -16 44 -35z m44
-83 c4 -8 1 -10 -7 -6 -22 13 -47 37 -47 46 0 12 48 -23 54 -40z m21 -52 c45
-47 40 -69 -6 -24 -21 21 -39 42 -39 46 0 16 17 8 45 -22z m3280 -20 c4 -22
10 -42 14 -45 5 -2 14 -25 21 -50 7 -25 16 -45 21 -45 4 0 20 -20 34 -44 14
-24 34 -50 43 -58 16 -12 16 -11 2 6 -8 11 -10 17 -3 13 27 -17 83 -118 92
-168 6 -30 13 -66 17 -81 3 -15 3 -40 -1 -55 -9 -36 -20 -17 -34 60 -10 58
-64 152 -81 142 -4 -3 -23 19 -41 48 -18 28 -38 55 -45 59 -6 4 -17 28 -24 53
-7 25 -16 45 -20 45 -4 0 -10 18 -13 41 -3 22 -8 43 -11 47 -7 7 -108 -40
-184 -85 -99 -60 -131 -37 -45 32 56 45 231 137 245 129 3 -2 9 -22 13 -44z
m-3228 -106 c2 -20 11 -50 19 -66 17 -33 15 -41 -9 -32 -19 7 -29 35 -32 81 0
18 -9 40 -18 51 -22 24 -11 36 16 17 12 -9 22 -28 24 -51z m2909 -90 c-22 -16
-70 -19 -61 -4 7 11 67 29 75 23 3 -3 -4 -11 -14 -19z m-2875 -66 c11 -22 18
-43 15 -46 -3 -3 -6 -1 -6 4 0 6 -7 19 -15 30 -14 18 -14 17 -5 -10 9 -26 9
-27 -5 -16 -10 8 -15 9 -15 2 0 -6 9 -16 20 -22 21 -11 29 -36 8 -25 -7 4 -2
-3 11 -14 13 -12 19 -21 14 -21 -12 0 -15 -50 -4 -64 6 -7 15 -25 21 -41 l11
-29 -22 19 c-22 20 -22 20 -14 0 5 -11 8 -31 7 -45 -3 -69 -2 -135 3 -154 6
-21 6 -21 -11 -1 -16 20 -16 19 -8 -5 4 -14 6 -32 5 -40 -1 -8 -2 -31 -1 -50
0 -26 -3 -31 -10 -20 -7 11 -10 7 -10 -18 0 -49 21 -123 37 -129 20 -8 -4 -33
-32 -33 -37 0 -55 31 -61 106 -4 53 -3 66 6 54 9 -12 11 -9 7 18 -2 17 0 32 4
32 4 0 6 19 4 42 -4 35 -3 39 8 24 10 -13 11 0 9 71 -2 66 0 84 8 73 9 -12 10
-11 6 8 -19 73 -19 69 -2 48 16 -20 16 -20 16 0 0 11 -7 29 -15 41 -16 23 -17
73 -1 73 5 0 2 8 -6 18 -8 9 -14 26 -13 37 0 11 -3 30 -7 43 -5 15 -4 21 2 17
13 -8 13 11 0 36 -12 21 -4 43 11 33 5 -3 19 -23 30 -46z m2924 33 l40 -9 -35
-2 c-66 -5 -67 -5 -125 -30 -16 -7 -14 -9 15 -10 19 -1 44 -6 55 -11 15 -7 11
-8 -17 -5 -41 5 -63 -10 -26 -17 13 -2 -3 -5 -36 -6 -56 -1 -58 0 -52 22 3 12
6 27 6 34 0 7 22 15 53 19 43 6 48 9 27 15 -37 10 43 10 95 0z m-215 -82 c11
-19 24 -139 15 -139 -2 0 -17 28 -34 63 -33 68 -41 105 -16 71 14 -19 14 -18
15 4 0 27 6 28 20 1z m-137 -36 c-3 -21 -10 -40 -15 -41 -5 -2 -27 -39 -48
-83 -22 -43 -43 -79 -46 -79 -3 0 -4 6 -1 13 2 6 8 23 12 37 7 24 7 24 -9 5
l-16 -20 7 20 c3 11 -18 -10 -47 -47 -30 -37 -56 -65 -58 -63 -3 3 1 11 8 20
7 9 11 18 8 20 -5 6 -78 -70 -116 -120 l-23 -30 21 43 c11 23 18 42 15 42 -11
0 59 92 88 116 16 13 33 22 37 19 5 -3 26 15 46 39 39 47 58 51 48 10 -11 -45
6 -24 46 56 22 44 42 80 44 80 3 0 2 -17 -1 -37z m86 -24 c7 -16 10 -33 7 -36
-3 -4 -6 1 -6 11 0 9 -4 15 -9 12 -5 -3 -12 1 -15 10 -17 43 4 46 23 3z m-5
-73 c10 -15 16 -29 13 -32 -3 -3 -13 8 -22 25 -21 42 -29 39 -22 -9 3 -22 4
-40 2 -40 -1 0 -14 17 -28 39 -23 35 -25 43 -15 75 l11 36 21 -34 c12 -19 29
-46 40 -60z m-98 -42 c-4 -14 -9 -24 -12 -21 -3 2 -2 17 2 31 3 15 9 25 11 22
3 -3 2 -17 -1 -32z m-266 -71 c0 -9 -36 -59 -47 -66 -8 -5 -10 -13 -7 -19 4
-7 2 -8 -4 -4 -7 4 -31 -6 -55 -23 -37 -25 -45 -27 -53 -14 -7 12 -21 1 -73
-57 -67 -75 -110 -108 -174 -135 -36 -15 -35 -13 31 52 37 38 84 82 103 98 19
17 54 53 79 81 25 27 42 46 38 40 -12 -16 -9 -28 5 -19 6 4 17 8 24 9 6 1 31
16 55 32 35 25 78 38 78 25z m-348 -166 c-12 -13 -22 -27 -22 -33 0 -5 -13
-18 -29 -29 -34 -22 -34 -32 1 -15 18 9 17 6 -7 -14 -16 -14 -34 -26 -38 -26
-5 0 -42 -16 -83 -34 -41 -19 -72 -30 -68 -24 12 19 -40 -3 -79 -34 l-39 -30
17 32 c9 18 28 44 41 56 13 13 20 24 17 24 -3 0 0 7 7 15 7 9 15 13 18 11 2
-3 14 0 26 6 19 10 20 10 7 -5 -17 -21 174 67 214 99 38 30 44 30 17 1z
m-1832 -232 c0 -7 -61 -37 -66 -32 -3 2 10 12 28 20 37 19 38 19 38 12z m-35
-50 c-38 -16 -137 -28 -111 -13 10 6 42 14 70 18 71 10 75 10 41 -5z m-85 -45
c-20 -13 -57 -13 -44 -1 10 10 46 19 54 14 2 -2 -2 -8 -10 -13z m-1830 -24 c0
-8 -106 -83 -125 -89 -19 -6 -19 -6 -1 6 10 7 41 29 70 49 53 39 56 40 56 34z
m-80 -90 c0 -6 -96 -76 -104 -76 -14 0 6 19 51 49 47 31 53 34 53 27z m-84
-111 c-34 -41 -46 -66 -51 -102 -9 -59 -40 -115 -94 -167 -22 -22 -38 -42 -36
-46 2 -3 -21 -18 -51 -33 -43 -21 -52 -23 -43 -9 6 9 26 28 44 42 18 14 31 27
29 29 -2 2 25 34 60 72 56 59 66 75 76 126 10 49 19 65 57 101 25 23 47 42 50
42 2 0 -17 -25 -41 -55z m-216 -395 c0 -5 -5 -10 -11 -10 -5 0 -7 5 -4 10 3 6
8 10 11 10 2 0 4 -4 4 -10z m-1715 -45 c-9 -20 -18 -35 -21 -33 -2 3 3 22 11
43 9 20 18 35 21 33 2 -3 -3 -22 -11 -43z m39 6 c-22 -21 -27 -21 -18 3 3 9
13 16 22 16 13 0 12 -3 -4 -19z m-94 -8 c-1 -17 -51 -64 -70 -66 -11 -1 -22
-8 -25 -17 -3 -9 -16 -31 -29 -49 -19 -25 -25 -28 -30 -16 -3 9 -2 24 3 33 15
28 59 64 70 58 5 -4 18 7 27 23 10 17 21 28 25 25 4 -2 10 0 14 6 7 12 15 13
15 3z m20 -18 c0 -8 -14 -29 -30 -47 l-31 -33 28 47 c31 52 33 54 33 33z
m-3006 -10 c-10 -8 -23 -14 -29 -14 -5 0 -1 6 9 14 11 8 24 15 30 15 5 0 1 -7
-10 -15z m291 -55 c-3 -5 -11 -10 -16 -10 -6 0 -7 5 -4 10 3 6 11 10 16 10 6
0 7 -4 4 -10z m2514 -66 c-11 -23 -33 -56 -49 -74 -17 -18 -30 -35 -30 -39 0
-4 -21 -24 -46 -45 -38 -32 -44 -35 -34 -15 6 13 -16 -5 -50 -41 -33 -36 -56
-54 -49 -41 13 27 6 25 -51 -19 -50 -38 -65 -46 -55 -30 6 10 4 11 -6 4 -8 -4
-20 -9 -28 -10 -7 -2 -23 -11 -35 -22 -38 -35 -52 -36 -21 -2 l30 33 -32 -21
c-40 -28 -134 -72 -153 -72 -12 0 -12 2 -2 9 8 4 12 11 10 15 -6 12 144 104
165 101 10 -3 38 8 61 24 67 46 70 47 62 25 -8 -20 -5 -18 83 61 32 29 33 29
21 5 -10 -20 -4 -17 29 15 22 21 41 35 41 30 0 -5 18 16 40 45 22 29 40 50 40
44 0 -5 11 7 24 27 14 20 31 36 39 36 12 0 11 -8 -4 -43z m-1589 -117 c0 -2
-10 -12 -22 -23 l-23 -19 19 23 c18 21 26 27 26 19z m917 -160 c-46 -30 -50
-37 -12 -21 66 26 71 27 41 6 -16 -11 -34 -28 -39 -37 -8 -14 -6 -16 14 -10
24 7 24 7 -1 -11 -14 -9 -38 -29 -54 -43 -27 -24 -28 -25 -17 -3 14 27 -3 30
-37 6 -36 -25 -25 -2 15 33 l38 33 -37 -15 c-21 -9 -38 -11 -38 -6 0 11 62 51
105 68 39 15 45 15 22 0z m158 -13 c-30 -25 -117 -74 -132 -74 -10 0 60 48
112 77 52 29 57 28 20 -3z m-295 -49 c0 -8 -73 -36 -78 -30 -3 2 10 11 29 19
36 16 49 19 49 11z m531 -1406 c-6 -24 -9 -28 -10 -12 -1 24 9 56 16 50 2 -3
0 -20 -6 -38z m-1083 -6 c-10 -2 -26 -2 -35 0 -10 3 -2 5 17 5 19 0 27 -2 18
-5z m1038 -38 c-9 -9 -16 -13 -16 -8 0 12 22 34 28 28 2 -2 -3 -11 -12 -20z
m-915 -60 c45 -35 45 -35 104 -24 77 14 128 1 181 -46 l39 -35 -60 36 c-60 36
-60 36 -149 30 l-89 -6 -39 36 c-30 27 -45 34 -62 29 -11 -4 -34 -9 -51 -11
-29 -4 -29 -4 5 10 55 21 73 19 121 -19z m-47 -85 c36 -28 46 -30 122 -30 61
0 104 -7 164 -26 98 -31 102 -42 6 -14 -38 10 -112 22 -166 26 -91 6 -101 9
-140 40 -53 42 -40 45 14 4z m-113 -119 c59 -20 116 -30 189 -35 68 -5 129
-16 173 -31 58 -21 79 -23 151 -18 48 3 90 2 101 -4 13 -8 6 -10 -31 -10 -27
0 -67 -3 -89 -7 -30 -6 -62 -2 -130 18 -59 17 -113 26 -161 26 -71 0 -107 9
-259 64 -97 34 -48 33 56 -3z m316 -136 c30 -21 66 -82 59 -100 -7 -19 -25
-19 -91 0 -47 14 -53 19 -57 46 -9 58 40 88 89 54z m-258 -50 c30 -24 59 -51
63 -60 14 -25 -46 -19 -76 8 -25 22 -62 97 -48 97 4 0 32 -20 61 -45z" /><path d="M10496 4137 c3 -10 9 -15 12 -12 3 3 0 11 -7 18 -10 9 -11 8 -5 -6z" /><path d="M9567 3933 c-4 -3 -7 -11 -7 -17 0 -6 5 -5 12 2 6 6 9 14 7 17 -3 3
-9 2 -12 -2z" /><path d="M3055 2599 c-4 -6 -5 -12 -2 -15 2 -3 7 2 10 11 7 17 1 20 -8 4z" /><path d="M8353 8163 c9 -2 23 -2 30 0 6 3 -1 5 -18 5 -16 0 -22 -2 -12 -5z" /><path d="M9288 8153 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z" /><path d="M11188 8003 c6 -2 18 -2 25 0 6 3 1 5 -13 5 -14 0 -19 -2 -12 -5z" /><path d="M5099 7113 c-13 -16 -12 -17 4 -4 16 13 21 21 13 21 -2 0 -10 -8 -17
-17z" /><path d="M2730 5596 c0 -2 16 -30 35 -62 43 -71 47 -60 5 14 -26 45 -40 62
-40 48z" /><path d="M1831 4294 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z" /><path d="M10490 3669 c-267 -37 -275 -38 -359 -18 -51 12 -55 12 -72 -10 -26
-32 -34 -88 -19 -128 15 -44 6 -94 -25 -127 -33 -36 -72 -34 -125 7 -24 17
-66 45 -94 61 -28 15 -78 48 -111 72 l-59 44 -25 -31 c-23 -29 -27 -31 -75
-25 -36 4 -56 2 -69 -8 -25 -19 -107 -184 -101 -201 3 -7 1 -29 -5 -49 -6 -23
-6 -48 0 -69 15 -53 2 -85 -49 -118 -25 -16 -58 -29 -73 -29 -24 0 -27 -4 -30
-37 -2 -21 -3 -56 -1 -77 3 -30 6 -36 14 -25 7 11 9 9 5 -8 -3 -13 -2 -23 3
-23 4 0 7 -6 7 -12 -1 -7 2 -65 7 -128 7 -83 11 -108 17 -90 6 17 8 6 6 -37
-2 -34 1 -59 5 -57 5 3 2 -10 -6 -30 -9 -23 -11 -36 -4 -36 6 0 8 -9 5 -21 -6
-23 11 -79 29 -94 6 -5 17 -28 24 -50 7 -22 17 -45 22 -52 5 -7 6 -18 2 -25
-5 -7 -9 -94 -10 -193 -2 -182 -6 -236 -19 -267 -4 -10 -8 -48 -9 -85 -1 -38
-5 -77 -10 -87 -7 -15 -6 -17 4 -11 10 6 11 3 6 -16 -19 -61 -26 -97 -26 -131
0 -20 -4 -39 -9 -43 -6 -3 -10 -13 -9 -23 0 -9 -3 -28 -7 -42 -3 -14 -8 -41
-10 -60 -1 -19 -7 -47 -13 -61 -6 -15 -8 -29 -5 -33 3 -3 -4 -29 -15 -58 -11
-29 -30 -85 -41 -123 -12 -41 -37 -95 -61 -128 -47 -67 -49 -75 -15 -53 31 21
31 12 0 -43 -29 -51 -30 -52 -10 -45 30 12 15 -29 -25 -68 -41 -38 -36 -47 15
-28 50 19 24 -22 -42 -65 -61 -39 -76 -59 -50 -68 21 -7 -135 -75 -214 -92
-58 -12 -89 -26 -129 -56 -29 -22 -75 -49 -101 -60 -58 -25 -73 -41 -64 -69
10 -31 62 -53 140 -57 l70 -5 -32 21 c-39 24 -43 56 -13 89 29 31 70 46 180
67 181 34 211 53 294 180 45 68 56 92 36 80 -20 -12 -9 48 22 122 28 70 32 74
40 52 6 -13 7 -53 3 -89 -6 -66 -32 -180 -34 -147 -2 29 -16 19 -30 -20 -19
-50 -93 -127 -149 -153 -25 -12 -94 -34 -154 -50 -122 -31 -158 -50 -158 -84
0 -29 39 -47 153 -70 139 -29 301 -20 512 29 55 12 135 26 177 30 111 10 128
25 128 115 0 65 13 101 23 63 3 -10 2 36 -1 103 -5 119 8 233 30 265 7 10 8 6
4 -16 -3 -16 -8 -79 -12 -140 l-7 -110 25 23 c13 12 30 22 36 22 8 0 12 19 13
53 l1 52 8 -53 c4 -29 16 -64 26 -79 32 -50 108 -124 153 -151 42 -25 44 -25
57 -7 19 26 17 68 -5 156 -25 96 -59 172 -104 232 -25 32 -32 47 -22 47 23 0
18 14 -20 64 -40 52 -41 56 -20 56 13 0 15 13 14 73 -4 112 24 409 46 492 8
33 15 76 15 96 0 21 7 44 15 53 9 9 15 34 15 67 0 49 8 91 32 167 5 19 11 44
13 55 5 37 38 161 45 172 4 6 11 24 14 42 4 17 14 37 22 44 8 6 14 18 14 27 0
29 112 210 119 191 5 -17 49 91 47 116 -1 11 -11 38 -21 59 -12 25 -15 41 -8
43 7 3 8 19 3 46 -4 23 -6 105 -5 182 3 176 3 177 13 172 4 -3 5 18 3 45 -2
28 1 48 6 45 5 -3 10 8 11 25 1 16 11 47 22 68 11 22 20 47 20 56 0 20 37 99
58 125 49 59 158 161 193 179 10 6 18 16 16 22 -1 6 16 20 39 32 37 19 40 23
31 44 -11 24 -33 26 -137 11z" /><path d="M5422 2529 c-51 -27 -85 -49 -75 -49 34 -1 -16 -29 -64 -36 -24 -3
-50 -13 -58 -20 -9 -10 -39 -14 -92 -14 -53 0 -73 -3 -63 -10 10 -6 -14 -10
-75 -12 -75 -3 -86 -5 -66 -14 23 -10 21 -11 -29 -18 -73 -10 -88 -19 -83 -51
3 -14 9 -25 14 -25 5 0 9 -9 9 -20 0 -11 5 -29 10 -40 6 -11 15 -29 20 -40 6
-11 10 -26 10 -33 0 -8 9 -22 20 -32 11 -10 20 -27 20 -37 0 -16 12 -42 69
-146 8 -14 16 -45 19 -69 2 -24 9 -46 13 -49 5 -3 9 -29 9 -59 0 -30 4 -56 9
-59 12 -8 20 -57 27 -155 3 -49 13 -100 25 -129 17 -39 19 -58 14 -112 -4 -36
-9 -99 -11 -140 -9 -156 -16 -218 -27 -237 -3 -5 -8 -31 -11 -59 -7 -71 -14
-95 -29 -113 -8 -9 -24 -36 -36 -61 -39 -82 -63 -125 -77 -141 -22 -24 -35
-77 -21 -82 7 -2 -4 -12 -23 -22 -19 -10 -54 -31 -78 -47 -23 -16 -71 -36
-105 -44 l-62 -14 55 6 c71 7 204 70 249 118 19 20 32 36 28 36 -4 0 2 18 13
40 11 22 23 40 25 40 3 0 -1 -13 -9 -29 -9 -16 -12 -31 -9 -35 4 -3 -3 -17
-15 -29 -12 -13 -20 -26 -17 -29 8 -8 -95 -85 -137 -102 -19 -8 -66 -18 -104
-22 -85 -8 -114 -24 -114 -64 0 -36 24 -53 105 -75 144 -38 358 -36 445 4 27
12 66 21 98 21 37 0 67 8 100 25 26 14 53 25 59 25 8 0 13 12 13 29 0 16 6 42
14 58 8 15 19 54 25 86 6 37 21 74 41 100 16 22 30 53 30 68 0 14 6 32 14 39
13 10 13 7 4 -22 -14 -46 -28 -86 -44 -132 -8 -21 -13 -40 -11 -42 7 -7 115
91 126 113 7 16 7 31 0 49 -5 15 -7 29 -5 32 6 5 15 -16 47 -117 43 -137 94
-179 125 -104 20 47 23 252 4 298 -7 17 -14 71 -15 120 -2 54 -9 105 -19 127
-9 21 -14 38 -11 38 2 0 0 11 -5 25 -7 17 -5 35 7 62 24 58 10 208 -31 338
-18 57 -16 83 6 128 14 26 28 44 33 40 4 -5 5 0 2 10 -5 13 -1 17 15 17 21 0
21 1 3 13 -10 8 -15 19 -11 25 3 6 2 13 -4 17 -17 10 -11 50 15 107 24 51 32
109 19 142 -3 9 -10 13 -15 10 -5 -3 -9 11 -9 31 0 25 -4 34 -12 29 -8 -5 -10
13 -5 72 5 53 4 74 -3 64 -7 -11 -10 -1 -10 35 0 29 -7 60 -16 73 -10 14 -11
22 -4 22 7 0 0 15 -14 33 -14 17 -34 43 -43 56 -10 13 -27 33 -39 45 -28 28
-50 73 -65 129 -6 26 -16 46 -23 46 -6 -1 -53 -23 -104 -50z" /><path d="M4553 320 c-39 -17 -43 -23 -43 -53 0 -58 24 -77 105 -83 l70 -5 -41
18 c-57 25 -74 41 -74 72 0 31 8 44 35 59 34 19 -6 13 -52 -8z" />
            </g>
        </svg>`,
        'fox': `<svg width="${size}" height="${size/2}" viewBox="0 0 1280 640" fill="white" style="display: block;">
            <g transform="translate(0,640) scale(0.1,-0.1)">
                <path d="M910 6093 c-121 -39 -121 -144 -1 -433 l52 -125 -6 -82 c-7 -88 4 -161 37 -250 17 -47 23 -53 56 -59 20 -3 63 -18 95 -32 l57 -25 -50 -17 c-51 -17 -105 -60 -115 -90 -3 -8 -18 -21 -34 -27 -51 -19 -71 -65 -71 -163 -1 -47 -7 -120 -14 -163 -11 -69 -17 -82 -52 -118 -163 -169 -583 -429 -694 -429 -64 0 -143 -39 -159 -79 -17 -39 -8 -89 24 -132 14 -19 34 -54 46 -79 28 -60 47 -80 79 -80 16 0 37 -11 54 -28 24 -26 25 -30 11 -42 -8 -7 -15 -17 -15 -22 0 -15 46 -78 68 -94 20 -14 154 -35 332 -53 126 -12 272 -49 520 -131 321 -106 483 -134 675 -119 50 4 91 6 92 5 1 -1 -27 -35 -62 -76 l-64 -75 97 -22 c53 -13 108 -26 121 -29 14 -3 38 -20 55 -39 28 -30 33 -32 50 -19 41 29 73 11 85 -48 6 -29 11 -33 51 -40 56 -9 82 -37 73 -79 l-6 -30 38 25 c61 42 76 34 77 -40 1 -49 5 -50 63 -29 22 8 46 14 53 15 22 0 62 -48 62 -76 0 -21 3 -25 18 -18 70 31 136 4 134 -55 -1 -27 2 -31 16 -26 32 13 139 18 146 7 4 -6 0 -24 -8 -39 l-14 -28 74 3 c96 5 131 -9 155 -62 10 -23 19 -49 19 -58 0 -25 35 -23 100 8 l55 25 26 -29 27 -30 53 25 c68 33 118 28 165 -18 26 -25 31 -36 24 -50 -17 -31 -11 -106 12 -154 18 -36 30 -48 52 -52 l30 -6 -34 -28 c-32 -27 -33 -29 -17 -47 21 -23 22 -54 1 -93 -19 -38 -12 -59 21 -59 14 0 28 -6 31 -14 8 -20 -12 -53 -36 -61 -27 -8 -25 -23 5 -47 30 -24 31 -42 5 -93 -26 -50 -25 -51 9 -58 37 -8 45 -31 25 -67 -16 -27 -16 -29 11 -64 l28 -37 -20 -42 c-57 -117 -102 -140 -265 -138 l-116 1 -40 -45 c-44 -50 -72 -102 -72 -133 0 -35 42 -71 110 -96 36 -13 101 -42 144 -65 43 -22 91 -41 107 -41 16 0 29 -1 29 -3 0 -2 -32 -36 -72 -75 l-71 -72 -82 0 c-131 0 -190 -28 -242 -118 l-26 -43 33 -34 c40 -41 87 -65 130 -65 28 0 31 -2 24 -22 -12 -37 -6 -70 18 -95 30 -32 118 -56 176 -49 26 3 112 10 192 16 308 21 361 62 544 430 51 102 111 214 134 250 97 150 213 404 242 529 l13 54 19 -26 c20 -28 40 -36 34 -14 -17 52 -16 67 5 77 18 10 25 8 50 -16 l29 -28 0 64 0 64 30 -29 30 -29 0 65 1 64 22 -27 c13 -16 25 -28 28 -28 2 0 3 18 1 39 -5 47 11 79 44 91 21 8 24 16 24 57 l0 48 23 -35 22 -35 3 67 3 67 46 21 46 20 -26 28 c-33 34 -34 42 -5 42 12 0 30 8 41 17 14 13 36 18 78 18 l59 -1 -3 55 -2 55 54 38 c101 71 146 83 316 83 163 -1 180 -4 470 -87 158 -45 266 -67 340 -68 l50 -1 28 -62 c15 -34 35 -71 43 -82 15 -20 15 -20 33 2 l19 22 6 -31 c3 -17 6 -41 6 -53 0 -17 7 -24 29 -28 19 -4 40 -22 65 -56 26 -38 42 -51 60 -51 21 0 28 -8 42 -55 l17 -54 39 21 38 21 64 -61 c35 -34 76 -66 90 -72 16 -6 26 -17 26 -30 0 -11 8 -47 17 -80 l16 -60 29 27 c27 26 28 26 28 5 0 -13 14 -64 31 -115 31 -93 39 -170 24 -234 -9 -39 -28 -46 -250 -97 -312 -71 -405 -127 -592 -354 -46 -56 -88 -102 -94 -102 -17 0 -49 -64 -49 -100 0 -78 70 -147 135 -134 17 3 58 18 92 34 l62 29 -39 -51 c-66 -83 -56 -98 80 -122 152 -26 295 12 493 131 56 34 60 39 117 158 71 147 104 181 299 299 314 192 367 263 365 491 0 94 -4 109 -53 250 -29 83 -55 159 -58 171 -4 18 5 23 84 46 102 30 178 44 284 53 73 7 76 6 92 -18 16 -25 17 -25 74 -12 81 20 89 19 103 -14 6 -16 20 -37 31 -47 18 -16 21 -16 58 0 35 16 41 16 67 3 146 -76 153 -277 19 -493 l-48 -76 -36 8 c-222 46 -341 -21 -341 -192 0 -81 7 -90 56 -69 55 24 126 46 122 37 -23 -43 -39 -87 -36 -100 4 -21 72 -67 119 -81 85 -26 173 -13 310 44 82 35 93 34 85 -11 -4 -20 -4 -49 -1 -66 l7 -30 69 75 c38 42 93 92 122 113 28 21 70 54 92 74 22 20 63 53 92 74 66 47 99 87 114 136 13 42 22 46 63 30 23 -8 26 -7 32 17 12 45 -4 294 -25 399 -20 98 -48 192 -70 232 -6 11 -86 66 -178 122 -93 55 -208 131 -258 168 -89 66 -265 227 -265 243 0 4 16 9 35 11 l35 3 -36 50 c-20 28 -51 80 -69 116 l-34 67 45 7 c25 3 58 4 74 0 25 -6 29 -3 40 29 6 20 8 41 4 47 -5 8 -3 9 6 4 32 -20 110 -231 110 -301 l0 -29 45 47 c50 52 43 58 66 -56 l11 -59 26 33 26 33 30 -94 c35 -107 56 -124 77 -62 11 35 13 36 20 15 5 -13 14 -53 19 -89 6 -37 14 -71 17 -77 4 -5 28 14 54 44 l47 53 22 -61 c13 -34 29 -62 36 -62 7 0 22 12 33 27 12 14 23 24 25 22 2 -2 13 -34 25 -70 12 -36 28 -74 35 -84 12 -17 14 -17 35 4 l22 22 57 -44 c352 -271 806 -447 1352 -524 161 -22 689 -25 850 -4 304 39 589 111 862 218 l117 46 -25 33 c-14 18 -21 34 -17 37 4 3 34 10 66 17 31 7 57 16 57 19 0 4 -15 12 -32 19 l-33 13 30 13 c29 13 73 53 64 59 -2 2 -17 9 -34 16 l-30 13 32 17 c18 9 40 27 49 39 15 22 15 22 -38 22 l-53 1 55 49 c62 55 56 60 -42 34 -33 -8 -62 -13 -64 -11 -2 2 23 35 55 73 33 38 58 71 56 73 -2 2 -16 -6 -32 -16 -52 -36 -61 -36 -72 3 -13 47 -36 63 -92 64 -45 0 -45 0 -41 30 4 29 3 30 -35 30 -22 0 -42 3 -46 6 -3 4 7 25 22 48 16 23 31 51 33 61 4 28 -26 30 -67 6 -39 -23 -42 -21 -19 14 15 22 15 25 0 31 -8 3 -41 -6 -72 -20 -44 -20 -72 -26 -129 -26 -97 0 -112 16 -65 65 24 24 29 35 18 35 -9 0 -18 9 -21 19 -4 18 -16 19 -183 20 -492 3 -984 87 -1327 227 -207 84 -398 199 -567 341 -120 101 -190 175 -419 443 -218 254 -356 393 -481 481 -97 68 -215 134 -293 164 -40 15 -52 26 -69 61 -74 158 -319 300 -648 378 -164 38 -208 47 -371 70 -347 50 -527 60 -1024 60 -449 0 -677 -12 -880 -44 -107 -16 -314 -39 -560 -60 -132 -12 -413 -37 -625 -56 -741 -67 -1104 -80 -1355 -49 -425 52 -678 214 -959 615 -110 157 -270 307 -393 368 l-41 21 -41 -37 c-22 -20 -62 -73 -89 -117 -27 -44 -54 -80 -59 -80 -6 * 0 -29 24 -52 53 -51 65 -154 147 -331 265 -196 131 -274 191 -345 263 -59 60 -78 70 -115 57z m6076 -4214 c25 -17 43 -33 41 -36 -10 -9 -76 26 -87 46 -15 28 -7 26 46 -10z m139 -105 c28 -25 41 -41 30 -35 -28 15 -102 80 -90 80 6 0 33 -20 60 -45z m105 -543 c0 -5 -6 -14 -14 -20 -12 -10 -13 -8 -9 8 5 21 23 30 23 12z" />
            </g>
        </svg>`,
        'rabbit': `<svg width="${size}" height="${size * 1.0110584518167456}" viewBox="0 0 1266.000000 1280.000000" fill="white" style="display: block; margin: 0 auto;">
            <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)">
                <path d="M6922 12788 c-12 -6 -24 -21 -27 -32 -32 -156 -37 -314 -13 -391 24
-73 184 -490 212 -550 13 -27 49 -93 80 -145 77 -130 107 -192 113 -238 5 -35
2 -42 -21 -57 -23 -16 -33 -16 -84 -5 -31 6 -97 20 -147 30 -49 10 -146 32
-215 49 -69 17 -183 38 -254 47 -129 16 -158 23 -271 64 -74 27 -126 23 -182
-14 -47 -32 -88 -101 -97 -168 -8 -55 6 -95 67 -186 35 -54 91 -104 352 -315
171 -138 413 -336 538 -439 381 -316 521 -416 722 -518 138 -70 215 -97 440
-154 233 -60 235 -61 235 -100 -1 -61 -38 -333 -47 -352 -6 -10 -14 -113 -17
-229 -15 -478 -33 -639 -80 -719 -66 -112 -147 -149 -374 -170 -86 -8 -204
-24 -262 -35 -240 -46 -526 -91 -579 -91 -32 0 -143 15 -247 34 -272 49 -369
60 -544 59 -233 0 -405 -29 -935 -152 -461 -108 -517 -122 -695 -181 -348
-115 -483 -183 -1075 -542 -1263 -766 -1581 -979 -1786 -1199 -227 -244 -382
-437 -500 -624 -152 -241 -408 -828 -562 -1285 -95 -283 -104 -356 -113 -940
-9 -532 6 -661 106 -940 22 -63 49 -151 59 -195 10 -44 22 -88 26 -99 7 -17 4
-18 -36 -12 -111 15 -291 18 -351 6 -240 -47 -374 -224 -355 -468 11 -137 61
-277 136 -379 68 -94 269 -205 454 -253 165 -42 253 -86 689 -343 497 -293
553 -319 743 -347 109 -17 189 -20 500 -20 204 0 458 -1 565 -2 107 -1 332 0
500 3 l305 4 600 -69 c625 -71 897 -90 967 -67 120 40 104 117 -66 319 l-87
102 203 0 c112 0 348 -5 524 -11 308 -11 323 -11 360 7 26 13 45 32 58 58 17
34 18 47 9 105 -24 153 -115 321 -218 404 -120 96 -396 213 -607 257 -170 35
-495 63 -899 76 l-206 7 40 36 c22 19 53 59 69 87 43 77 106 136 314 292 67
50 145 117 173 149 70 77 163 218 212 321 38 78 53 131 113 379 60 250 145
333 446 438 172 60 193 71 321 166 102 76 359 211 479 253 l45 15 45 -52 c141
-162 228 -238 382 -330 15 -9 71 -74 125 -144 53 -71 124 -159 156 -198 85
-102 155 -210 167 -258 5 -23 30 -107 55 -187 24 -80 60 -206 80 -280 30 -115
50 -166 139 -345 150 -300 183 -388 306 -805 38 -129 88 -282 111 -340 31 -80
42 -125 47 -190 6 -66 13 -95 34 -131 61 -103 210 -157 521 -189 59 -6 175
-22 259 -36 333 -55 482 -41 572 55 28 29 28 33 24 109 -5 85 -10 97 -103 231
-64 92 -81 108 -160 149 -130 67 -331 296 -419 477 -48 98 -63 146 -96 305
-12 58 -34 152 -50 210 -16 58 -36 143 -44 189 -16 85 -21 202 -9 214 12 13
100 -134 248 -418 38 -71 92 -165 121 -208 30 -43 69 -106 89 -141 19 -34 86
-131 147 -214 62 -83 140 -199 172 -259 113 -205 165 -312 182 -370 21 -75 50
-112 111 -146 91 -49 185 -64 641 -102 215 -18 350 -19 389 -4 76 28 91 84 50
174 -13 28 -36 88 -52 135 -15 47 -36 101 -45 120 -23 46 -95 113 -191 177
-152 103 -507 542 -624 773 -30 60 -75 229 -140 534 -26 121 -64 278 -85 350
-21 72 -59 202 -84 289 -113 388 -126 676 -40 888 46 113 103 212 160 279 77
90 99 124 137 216 19 44 52 107 74 140 63 92 84 140 186 424 121 338 150 425
237 699 234 741 306 1073 330 1526 5 110 15 241 22 290 6 50 12 138 12 197 1
104 2 107 31 138 47 50 138 108 259 165 156 74 243 101 408 125 79 12 176 32
216 46 86 29 225 97 339 166 l83 51 38 -26 38 -25 0 67 -1 66 38 -1 c34 -1 37
1 31 20 -14 41 -10 60 16 66 19 5 31 22 57 86 61 150 78 263 59 379 -8 42 -8
42 78 164 81 115 9 296 -191 486 -52 50 -165 159 -252 243 -86 83 -187 175
-225 202 -99 72 -452 299 -656 422 -185 112 -248 140 -351 158 -35 6 -102 22
-149 36 -138 39 -233 53 -455 64 -115 6 -247 18 -295 26 -47 8 -134 19 -195
23 -121 8 -144 17 -220 81 -28 23 -91 66 -141 95 -105 63 -154 112 -214 216
-142 246 -317 512 -446 679 -115 148 -310 344 -449 451 -432 334 -994 680
-1254 773 -85 31 -176 41 -209 24z" />
            </g>
        </svg>`,
        'crow': `<svg width="${size}" height="${size * 0.89921875}" viewBox="0 0 1280.000000 1151.000000" fill="white" style="display: block; margin: 0 auto;">
            <g transform="translate(0.000000,1151.000000) scale(0.100000,-0.100000)">
                <path d="M2316 11499 c-176 -26 -356 -97 -581 -229 -143 -85 -157 -90 -275
-90 -168 0 -355 -39 -640 -132 -447 -146 -681 -303 -799 -536 -12 -24 -21 -45
-19 -47 12 -11 239 -39 488 -60 574 -48 783 -75 851 -110 66 -35 147 -158 193
-297 56 -165 59 -199 57 -525 -1 -207 1 -303 8 -303 6 0 11 15 11 33 0 17 5
39 10 47 7 11 10 7 10 -17 0 -49 17 -40 29 15 24 112 30 100 30 -58 1 -151
-16 -342 -44 -505 -10 -53 -11 -81 -4 -86 7 -4 2 -56 -16 -153 -30 -172 -43
-312 -28 -303 6 4 13 20 16 37 11 50 24 34 32 -37 4 -38 12 -77 17 -87 10 -19
11 -18 25 5 12 22 13 16 7 -53 -4 -55 -3 -78 5 -78 6 0 11 5 11 11 0 6 7 8 15
5 11 -4 20 3 27 22 11 24 13 17 18 -63 3 -57 11 -99 22 -115 30 -48 63 -209
59 -290 -2 -41 -4 -142 -4 -225 0 -134 3 -160 27 -239 82 -274 223 -476 473
-677 101 -82 131 -112 170 -175 148 -233 243 -369 368 -528 200 -254 256 -335
329 -476 65 -126 328 -710 374 -830 125 -327 250 -842 332 -1370 17 -107 39
-246 50 -309 22 -127 25 -255 7 -288 -44 -78 -510 -531 -599 -581 -61 -35 -84
-59 -121 -123 -15 -26 -33 -49 -42 -53 -35 -13 -191 -26 -347 -28 l-166 -2
-129 64 c-116 59 -134 65 -188 64 -91 0 -167 -51 -206 -139 -29 -63 -22 -71
25 -27 77 71 146 93 224 73 67 -18 70 -39 18 -115 -45 -65 -69 -127 -81 -203
-4 -27 -3 -43 4 -43 5 0 40 38 76 85 37 47 70 85 73 85 4 -1 16 -20 27 -43 18
-37 25 -42 57 -45 20 -2 60 1 88 6 38 7 66 6 103 -4 41 -10 67 -11 121 -3 98
16 149 8 203 -31 l45 -33 106 7 c108 6 120 10 223 69 l46 27 174 -20 c177 -20
312 -24 384 -12 52 10 93 65 102 140 7 65 32 86 103 86 68 0 96 -23 135 -109
19 -41 43 -79 54 -85 20 -10 21 -8 21 27 0 103 -52 205 -126 252 -84 54 -146
50 -334 -18 -151 -56 -250 -76 -295 -61 -64 21 -80 71 -46 146 28 62 183 236
416 469 116 116 229 237 252 270 141 209 168 347 139 724 -9 123 -15 226 -12
228 2 3 23 -21 46 -52 29 -40 45 -53 50 -45 6 9 15 0 29 -29 21 -39 47 -50 34
-13 -5 14 -3 14 17 -3 l23 -20 -7 30 -8 30 22 -28 c26 -32 37 -30 19 5 l-12
23 22 -20 22 -19 -7 29 c-4 17 -20 61 -36 99 -31 77 -33 85 -16 68 19 -19 30
-14 18 7 -19 37 -10 35 31 -4 l42 -40 -7 35 -6 35 26 -29 c19 -21 28 -26 34
-17 5 9 34 -20 90 -88 60 -72 87 -98 96 -91 6 6 18 8 26 5 12 -5 14 0 10 22
-5 26 -4 27 13 13 17 -14 18 -13 12 22 -6 39 0 47 21 26 8 -8 12 -9 12 -1 0 6
-7 19 -16 27 -14 15 -14 16 1 16 21 0 14 24 -35 117 -36 67 -37 71 -18 76 14
4 29 -4 50 -29 40 -46 47 -36 14 22 -30 54 -32 61 -11 44 13 -10 15 -9 15 9 0
22 16 29 22 10 2 -5 11 -7 21 -3 14 5 17 13 11 38 l-6 31 21 -19 c21 -19 21
-19 21 0 0 11 -16 68 -35 127 -19 59 -35 114 -35 122 0 40 106 -3 243 -98 96
-67 114 -119 81 -234 -10 -34 -14 -70 -10 -96 4 -23 7 -53 7 -67 1 -14 5 -28
11 -31 7 -5 5 -23 -6 -55 -18 -54 -21 -84 -6 -84 6 0 10 -36 10 -87 0 -49 11
-155 25 -238 35 -210 40 -296 22 -375 -8 -36 -40 -180 -71 -320 -80 -358 -172
-671 -262 -885 -50 -120 -91 -158 -335 -322 -179 -120 -203 -132 -273 -148
-79 -18 -140 -51 -175 -97 -23 -29 -64 -131 -76 -188 l-7 -35 53 60 c30 33 65
72 79 87 14 15 42 35 62 43 l37 15 37 -40 c61 -66 123 -52 243 55 35 31 65 54
68 51 9 -8 -94 -194 -174 -314 -107 -162 -126 -220 -131 -402 -2 -80 -1 -143
2 -140 3 4 21 66 41 140 33 124 71 208 108 239 9 6 31 4 71 -7 57 -16 59 -16
104 8 40 22 50 34 86 111 32 69 51 94 86 121 45 34 81 81 152 197 l37 61 123
-61 c90 -44 139 -62 181 -66 l57 -6 27 63 27 62 81 -4 c137 -5 189 -51 245
-212 19 -56 53 -106 72 -106 13 0 9 89 -7 158 -40 168 -139 281 -272 312 -20
5 -67 1 -125 -11 -104 -20 -104 -20 -170 45 -70 68 -70 70 -66 345 l4 246 37
108 c20 59 68 180 105 270 38 89 91 226 117 305 35 107 57 156 89 200 128 173
216 329 251 442 9 30 19 61 21 69 4 11 8 11 22 -3 10 -9 22 -16 27 -16 11 0
-1 157 -29 375 -12 99 -21 182 -20 184 2 2 11 -2 20 -10 13 -11 17 -11 25 4 9
16 12 16 35 1 38 -26 40 -9 2 25 l-33 31 28 -6 c31 -7 37 9 10 25 -10 5 -14
13 -10 17 4 4 13 2 19 -4 7 -7 20 -12 30 -12 32 0 8 28 -63 75 -65 43 -89 68
-76 81 3 3 14 1 26 -5 24 -14 39 3 21 24 -10 12 -9 15 4 15 24 0 20 12 -16 44
l-33 29 40 18 c47 22 130 24 207 7 29 -6 154 -63 277 -125 144 -72 236 -113
256 -113 33 0 57 21 111 96 107 150 312 203 613 158 58 -8 219 -44 357 -79
138 -35 302 -74 365 -86 62 -11 212 -50 334 -86 384 -112 541 -126 725 -68 45
15 46 14 211 -43 132 -47 184 -71 259 -120 127 -83 230 -106 230 -52 0 11 3
20 7 20 11 0 265 -137 388 -209 66 -39 128 -71 137 -71 9 0 28 14 41 32 l25
31 43 -27 c24 -14 89 -58 144 -96 113 -79 161 -98 257 -107 60 -5 68 -4 74 13
4 10 13 34 20 52 l14 34 31 -27 c65 -54 194 -105 266 -105 82 0 123 40 123
120 0 22 2 40 4 40 2 0 49 -26 103 -58 l98 -58 45 14 c58 17 114 10 215 -28
44 -17 106 -35 138 -42 69 -15 77 -8 77 64 0 26 4 49 8 52 4 3 42 -4 83 -15
40 -11 86 -17 101 -14 25 6 26 8 16 36 -25 71 -80 107 -495 321 -219 113 -472
248 -563 300 -91 52 -219 122 -285 156 -85 44 -187 112 -350 233 -466 346
-911 667 -1146 826 -54 36 -97 68 -95 70 5 6 323 -51 581 -103 547 -111 1027
-233 1546 -393 311 -96 515 -142 555 -127 8 3 14 19 14 41 0 29 4 35 21 35 12
0 103 -27 201 -61 134 -45 196 -61 241 -62 l62 -2 0 55 c-1 75 -33 135 -120
221 -109 108 -218 184 -370 259 -372 182 -615 263 -1420 474 -974 256 -906
233 -1150 386 -151 96 -230 136 -412 211 -73 30 -133 56 -133 59 0 3 29 13 65
22 36 10 87 27 114 38 l49 22 -60 126 c-33 70 -76 148 -95 175 -28 38 -33 50
-23 62 12 14 -1 37 -138 242 -72 110 -229 231 -432 335 -133 68 -301 137 -605
249 -183 67 -301 119 -500 219 -302 152 -332 161 -594 185 -287 25 -329 45
-511 232 -64 66 -170 160 -240 213 -69 52 -303 236 -520 410 -591 471 -907
716 -1135 877 -124 87 -163 130 -215 232 -22 44 -69 127 -104 184 -35 57 -146
247 -246 423 -327 575 -490 791 -760 1007 -96 77 -364 217 -464 242 -132 33
-327 43 -460 24z" />
            </g>
        </svg>`,
        'duck': `<div style="width: ${size}px; height: ${size * 1.138}px; background-color: white; -webkit-mask: url('icons/Ente.png') no-repeat center; mask: url('icons/Ente.png') no-repeat center; -webkit-mask-size: contain; mask-size: contain; display: block; margin: 0 auto;"></div>`,
        'bird': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white">
            <path d="M12,4L2,14h4v6h12v-6h4L12,4z M10,14c-0.5,0-1-0.5-1-1s0.5-1,1-1s1,0.5,1,1S10.5,14,10,14z M14,14c-0.5,0-1-0.5-1-1s0.5-1,1-1s1,0.5,1,1S14.5,14,14,14z" />
        </svg>`,
        'paw': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white">
            <path d="M12,14c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S14.2,14,12,14z M8,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S9.1,10,8,10z M12,6c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,6,12,6z M16,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S17.1,10,16,10z" />
        </svg>`,
        'marder': `<div style="width: ${size}px; height: ${size * 0.376}px; background-color: white; -webkit-mask: url('icons/marder.png') no-repeat center; mask: url('icons/marder.png') no-repeat center; -webkit-mask-size: contain; mask-size: contain; display: block; margin: 0 auto;"></div>`,
        'fasan': `<div style="width: ${size}px; height: ${size * 0.566}px; background-color: white; -webkit-mask: url('icons/Fasan.png') no-repeat center; mask: url('icons/Fasan.png') no-repeat center; -webkit-mask-size: contain; mask-size: contain; display: block; margin: 0 auto;"></div>`,
        'gams': `<div style="width: ${size}px; height: ${size * 1.154}px; background-color: white; -webkit-mask: url('icons/gams.png') no-repeat center; mask: url('icons/gams.png') no-repeat center; -webkit-mask-size: contain; mask-size: contain; display: block; margin: 0 auto;"></div>`,
        'steinbock': `<div style="width: ${size}px; height: ${size * 0.879}px; background-color: white; -webkit-mask: url('icons/Steinbock.png') no-repeat center; mask: url('icons/Steinbock.png') no-repeat center; -webkit-mask-size: contain; mask-size: contain; display: block; margin: 0 auto;"></div>`
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
        <div class="schonzeit-empty" >
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
            zeitInfo = `Jagdzeit: ${ wildart.jagdzeitStart } - ${ wildart.jagdzeitEnde } `;
        }

        return `
        <div class="wildart-card" >
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
        <div class="bulletin-item-header" >
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
                btn.onclick=async (e) => {
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
                btn.onclick=async (e) => {
                    e.stopPropagation();
                    const confirmed=await showConfirm(
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
                    el.onclick=async (e) => {
                        e.stopPropagation(); // Verhindert das Öffnen der Seite
                        // MODAL: Bestätigung einholen
                        const confirmed=await showConfirm(
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
        bulletinSubmitBtn.onclick=async () => {
            const msg = bulletinInput.value.trim();
            if (!msg) return;

            bulletinSubmitBtn.disabled=true;
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

                bulletinInput.value="";
                showToast("Aushang erfolgreich erstellt", "success");
            } catch (err) {
                console.error("Bulletin Error:", err);
                showToast("Fehler beim Senden", "error");
            } finally {
                bulletinSubmitBtn.disabled=false;
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
                entry.dataset.id=doc.id;
                entry.innerHTML = `
        <strong>${data.name || "Ohne Namen"}</strong>
            ${data.datum ? `<small>Datum: ${new Date(data.datum).toLocaleDateString()}</small>` : ""}
                    ${ data.bemerkung ? `<small>${data.bemerkung}</small>` : "" }
                    ${ data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.name}">` : "" }
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
        <div class="entry-header-left" >
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
        <span class="entry-wildart-icon" >🦌</span>
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
        <div class="entry-foto-thumbnail" >
            <img src="${imageSrc}" alt="Streckenfoto" class="entry-foto-img" data-id="${entry.id}">
                <button class="entry-foto-delete-btn" data-id="${entry.id}" aria-label="Foto löschen">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="2.5">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
                    </svg>
                </button>
            </div>
    `;
            }

            // Foto-Button (hinzufügen oder ändern)
            const fotoBtn = document.createElement("button");
            fotoBtn.className = "entry-foto-btn";
            fotoBtn.dataset.id=entry.id;
            fotoBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" >
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                </svg>
        ${ imageSrc ? "Ändern" : "Foto hinzufügen" }
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
            reader.onload=(e) => {
                const img = new Image();
                img.onload=() => {
                    const canvas = document.createElement("canvas");
                    let width=img.width;
                    let height=img.height;

                    // Skalieren wenn zu groß
                    if (width > maxWidth) {
                        height=(height * maxWidth) / width;
                        width=maxWidth;
                    }

                    canvas.width=width;
                    canvas.height=height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    // Als JPEG mit Kompression
                    const base64 = canvas.toDataURL("image/jpeg", quality);
                    console.log("[Foto] Komprimiert:", Math.round(base64.length / 1024), "KB");
                    resolve(base64);
                };
                img.onerror = reject;
                img.src=e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function attachFotoEvents() {
        const buttons = document.querySelectorAll(".entry-foto-btn");
        buttons.forEach(btn => {
            btn.addEventListener("click", async () => {
                const entryId=btn.dataset.id;
                if (!entryId) return;

                const fileInput = document.createElement("input");
                fileInput.type="file";
                fileInput.accept = "image/*";
                fileInput.click();

                fileInput.onchange=async () => {
                    const file = fileInput.files[0];
                    if (!file) return;

                    const originalContent = btn.innerHTML;

                    try {
                        // Loading-State anzeigen
                        btn.disabled=true;
                        btn.innerHTML = `
        <svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" >
            <circle cx="12" cy="12" r="10" stroke-dasharray="30" stroke-dashoffset="10" />
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
                        btn.disabled=false;
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
                const entryId=btn.dataset.id;
                if (!entryId) return;

                const confirmed=await showConfirm(
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
        <div class="image-modal-content" >
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
        const value=wildSelect.value;
        let html = "";
        if (value === "Rehwild") html = `<label > Unterart <select name="unterart" ><option>Geiß</option><option>Bock</option><option>Kitz</option><option>Schmal</option></select></label> `;
        if (value === "Rotwild" || value === "Dammwild") html = `<label > Unterart <select name="unterart" ><option>Hirsch</option><option>Alttier</option><option>Schmaltier</option><option>Spießer</option></select></label> `;
        if (value === "Schwarzwild") html = `<label > Unterart <select name="unterart" ><option>Keiler</option><option>Bache</option><option>Frischling</option><option>Überläufer</option></select></label> `;
        if (value === "Raubwild" || value === "Federwild") html = `<label > Bemerkung <input type="text" name="unterart" ></label> `;
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
        const tempCard=document.getElementById("wetter-temp");
        if (tempCard) {
            const conditionsText = current.conditions || "";
            tempCard.querySelector(".wetter-card-value").textContent = `${current.temp.toFixed(0)}°C`;
            tempCard.querySelector(".wetter-card-label").textContent = conditionsText.length > 12
                ? conditionsText.substring(0, 12) + "..."
                : conditionsText;
        }

        // Wind Karte
        const windCard=document.getElementById("wetter-wind");
        if (windCard) {
            const windDirText = getWindDirection(current.winddir);
            windCard.querySelector(".wetter-card-value").textContent = windDirText;
            windCard.querySelector(".wetter-card-label").textContent = `${current.windspeed.toFixed(0)} km/h`;
        }

        // Mond Karte
        const moonCard=document.getElementById("wetter-moon");
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
    const dismissed=localStorage.getItem('installDismissed');
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
        const isSupported=await firebase.messaging.isSupported();
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
function showUpdateToast(forceReload=false, newVersion = null) {
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
        toast.querySelector(".update-btn").disabled=true;

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
                window.location.href=window.location.href.split('?')[0] + '?update=' + Date.now();
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

    showToast("Reviersystem v4.0.0 bereit", "success");

    // iOS Bounce/Overscroll Fix
    try {
        preventIOSBounce();
    } catch (e) {
        console.error("iOS Bounce Fix error:", e);
    }

    // Modal Events initialisieren
    const profileModal = document.getElementById("profile-modal");
    const cancelProfileBtn = document.getElementById("cancel-profile-btn");
    const profileForm = document.getElementById("profile-form");

    if (cancelProfileBtn && profileModal) {
        cancelProfileBtn.addEventListener("click", () => {
            profileModal.classList.add("hidden");
        });
    }

    if (profileForm && profileModal) {
        profileForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newName = document.getElementById("profile-name-input").value.trim();
            const user = firebase.auth().currentUser;
            if (user) {
                try {
                    await user.updateProfile({ displayName: newName });
                    showToast("Profil aktualisiert!", "success");
                    updateUserInfo(user);
                    profileModal.classList.add("hidden");
                } catch (error) {
                    console.error("Fehler beim Profil-Update", error);
                    showToast("Es gab ein Problem beim Speichern.", "error");
                }
            }
        });
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
