// ==============================
// APP VERSION
// ==============================
const APP_VERSION = "v5.0.0";

/**
 * Toggles between dashboard feed views (standard vs strecke)
 * Globally available for onclick handlers
 */
window.toggleDashboardFeed = function(view) {
    const standardFeed = document.getElementById("dashboard-standard-feed");
    const streckeFeed = document.getElementById("dashboard-strecke-feed");
    const schonzeitFeed = document.getElementById("dashboard-schonzeit-feed");
    const bulletinFeed = document.getElementById("dashboard-bulletin-feed");
    const statistikFeed = document.getElementById("dashboard-statistik-feed");
    const wetterFeed = document.getElementById("dashboard-wetter-feed");
    const dokumenteFeed = document.getElementById("dashboard-dokumente-feed");
    const fabBtn = document.getElementById("fab-add-btn");
    const fabExportBtn = document.getElementById("fab-export-btn");
 
    if (!standardFeed || !streckeFeed || !schonzeitFeed || !bulletinFeed) {
        console.warn("Standard Feed elements not found!");
        return;
    }
 
    // Hide all first
    standardFeed.classList.add("hidden");
    streckeFeed.classList.add("hidden");
    schonzeitFeed.classList.add("hidden");
    bulletinFeed.classList.add("hidden");
    if (statistikFeed) statistikFeed.classList.add("hidden");
    if (wetterFeed) wetterFeed.classList.add("hidden");
    if (dokumenteFeed) dokumenteFeed.classList.add("hidden");
 
    if (view === 'strecke') {
        streckeFeed.classList.remove("hidden");
        if (fabBtn) fabBtn.classList.add("visible");
        if (fabExportBtn) fabExportBtn.classList.add("visible");
    } else if (view === 'schonzeit') {
        schonzeitFeed.classList.remove("hidden");
        renderSchonzeitListe();
    } else if (view === 'bulletin') {
        bulletinFeed.classList.remove("hidden");
    } else if (view === 'statistik') {
        if (statistikFeed) {
            statistikFeed.classList.remove("hidden");
            if (typeof renderDetailStats === 'function') renderDetailStats();
        }
    } else if (view === 'wetter') {
        if (wetterFeed) {
            wetterFeed.classList.remove("hidden");
            renderWetterDetailPage();
        }
    } else if (view === 'dokumente') {
        if (dokumenteFeed) {
            dokumenteFeed.classList.remove("hidden");
            initDokumenteSafe();
        }
    } else {
        standardFeed.classList.remove("hidden");
        if (fabBtn) fabBtn.classList.remove("visible");
        if (fabExportBtn) fabExportBtn.classList.remove("visible");
    }
};

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
    { id: "rehwild-boecke", name: "Rehwild (Böcke)", jagdzeitStart: "01.05", jagdzeitEnde: "15.10", iconClass: "rehbock" },
    { id: "rehwild-geissen", name: "Rehwild (Geißen)", jagdzeitStart: "01.09", jagdzeitEnde: "15.01", iconClass: "reh" },
    { id: "rehwild-kitze", name: "Rehwild (Kitze)", jagdzeitStart: "01.09", jagdzeitEnde: "15.01", iconClass: "reh" },
    { id: "rehwild-schmalrehe", name: "Rehwild (Schmalrehe)", jagdzeitStart: "01.05", jagdzeitEnde: "15.01", iconClass: "reh" },
    { id: "schwarzwild-keiler", name: "Schwarzwild (Keiler)", ganzjaehrig: true, iconClass: "wildschwein" },
    { id: "schwarzwild-bachen", name: "Schwarzwild (Bachen)", ganzjaehrig: true, iconClass: "wildschwein" },
    { id: "schwarzwild-frischlinge", name: "Schwarzwild (Frischlinge)", ganzjaehrig: true, iconClass: "wildschwein" },
    { id: "schwarzwild-ueberlaeufer", name: "Schwarzwild (Überläufer)", ganzjaehrig: true, iconClass: "wildschwein" },
    { id: "gamswild", name: "Gamswild", jagdzeitStart: "01.08", jagdzeitEnde: "15.12", iconClass: "gams" },
    { id: "muffelwild", name: "Muffelwild", jagdzeitStart: "01.08", jagdzeitEnde: "31.01", iconClass: "muffelwild" },

    // ===== RAUBWILD =====
    { id: "fuchs", name: "Fuchs", ganzjaehrig: true, iconClass: "fox" },
    { id: "dachs", name: "Dachs", jagdzeitStart: "01.08", jagdzeitEnde: "31.10", iconClass: "dachs" },
    { id: "baummarder", name: "Baummarder", jagdzeitStart: "16.10", jagdzeitEnde: "28.02", iconClass: "marder" },
    { id: "steinmarder", name: "Steinmarder", jagdzeitStart: "16.10", jagdzeitEnde: "28.02", iconClass: "marder" },
    { id: "iltis", name: "Iltis", jagdzeitStart: "01.08", jagdzeitEnde: "28.02", iconClass: "iltis" },
    { id: "hermelin", name: "Hermelin", jagdzeitStart: "01.08", jagdzeitEnde: "28.02", iconClass: "hermelin" },
    { id: "mauswiesel", name: "Mauswiesel", jagdzeitStart: "01.08", jagdzeitEnde: "28.02", iconClass: "mauswiesel" },

    // ===== HASEN =====
    { id: "feldhase", name: "Feldhase", jagdzeitStart: "16.10", jagdzeitEnde: "31.12", iconClass: "rabbit" },
    { id: "wildkaninchen", name: "Wildkaninchen", ganzjaehrig: true, iconClass: "rabbit" },

    // ===== FEDERWILD =====
    { id: "stockente", name: "Stockente", jagdzeitStart: "01.09", jagdzeitEnde: "15.01", iconClass: "ente" },
    { id: "fasan", name: "Fasan", jagdzeitStart: "01.10", jagdzeitEnde: "31.12", iconClass: "fasan" },
    { id: "rabenkraehe", name: "Rabenkrähe", jagdzeitStart: "16.07", jagdzeitEnde: "14.03", iconClass: "crow" },
    { id: "elster", name: "Elster", jagdzeitStart: "16.07", jagdzeitEnde: "14.03", iconClass: "crow" },
    { id: "eichelhaeler", name: "Eichelhäher", jagdzeitStart: "16.07", jagdzeitEnde: "14.03", iconClass: "eichelhaeher" }
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
    const fabExportBtn = document.getElementById("fab-export-btn");
    const bottomNav = document.getElementById("bottom-nav");

    allPages.forEach(p => p.classList.remove("active"));
    const targetPage = document.getElementById(targetId);
    if (targetPage) {
        targetPage.classList.add("active");

        // Map resize fix
        if (targetId === "revier" && window.mapInstance) {
            setTimeout(() => window.mapInstance.invalidateSize(), 200);
        }

        // FAB-Buttons nur in Streckenliste sichtbar
        if (targetId === "streckenliste") {
            navigateToDashboard('strecke');
            return;
        } else if (targetId === "schonzeit-page") {
            navigateToDashboard('schonzeit');
            return;
        } else if (targetId === "bulletin-board") {
            navigateToDashboard('bulletin');
            return;
        } else if (targetId === "wetter-page") {
            navigateToDashboard('wetter');
            return;
        } else {
            if (fabBtn) fabBtn.classList.remove("visible");
            if (fabExportBtn) fabExportBtn.classList.remove("visible");
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
function navigateToDashboard(view = 'standard') {
    const allPages = document.querySelectorAll(".page");
    const fabBtn = document.getElementById("fab-add-btn");
    const fabExportBtn = document.getElementById("fab-export-btn");
    const bottomNav = document.getElementById("bottom-nav");

    allPages.forEach(p => p.classList.remove("active"));
    const dashboard=document.getElementById("dashboard");
    if (dashboard) dashboard.classList.add("active");

    // Hide FABs
    if (fabBtn) fabBtn.classList.remove("visible");
    if (fabExportBtn) fabExportBtn.classList.remove("visible");

    // Tab Bar ANZEIGEN (nicht mehr ausblenden)
    if (bottomNav) bottomNav.classList.remove("hidden");

    // Reset Dashboard Feed to desired view
    toggleDashboardFeed(view);

    // Tab aktiv markieren
    setActiveTab("dashboard");

    // Alle Karten-Panels (Hochsitze/Flurstücke) schließen
    closeMapPanels();
}

function navigateToTab(pageId) {
    const allPages = document.querySelectorAll(".page");
    const fabBtn = document.getElementById("fab-add-btn");
    const fabExportBtn = document.getElementById("fab-export-btn");
    const bottomNav = document.getElementById("bottom-nav");

    allPages.forEach(p => p.classList.remove("active"));
    const page = document.getElementById(pageId);
    if (page) page.classList.add("active");

    // Tab Bar anzeigen
    if (bottomNav) bottomNav.classList.remove("hidden");

    // FABs nur für Streckenliste
    if (pageId === "streckenliste") {
        if (fabBtn) fabBtn.classList.add("visible");
        if (fabExportBtn) {
            fabExportBtn.classList.add("visible");
        }
    } else {
        if (fabBtn) fabBtn.classList.remove("visible");
        if (fabExportBtn) fabExportBtn.classList.remove("visible");
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

async function compressImage(file, maxWidth = 400, maxHeight = 400) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("Compression failed"));
                }, 'image/jpeg', 0.8);
            };
            img.onerror = () => reject(new Error("Image load error"));
        };
        reader.onerror = () => reject(new Error("File read error"));
    });
}

// Benutzername für Begrüßung & Einstellungen laden
function updateUserInfo(user, nameOverride = null, photoOverride = null) {
    if (!user) return;
    
    // Fallback falls kein Name existiert
    const fullDisplayName = nameOverride || user.displayName || "Waidmann";
    const name = fullDisplayName.split(" ")[0];
    const photoURL = photoOverride || user.photoURL;

    const hour = new Date().getHours();
    let greeting = "Guten Morgen";
    if (hour >= 12 && hour < 18) greeting = "Guten Nachmittag";
    else if (hour >= 18) greeting = "Guten Abend";

    const heroGreeting = document.getElementById("hero-greeting");
    if (heroGreeting) heroGreeting.textContent = `${greeting}, ${name}`;

    const settingsUser = document.getElementById("settings-username");
    if (settingsUser) {
        settingsUser.textContent = nameOverride || user.displayName || "Name eintragen";
    }

    // Profilbild in Header und Einstellungen aktualisieren
    const headerImg = document.getElementById("header-profile-img");
    const headerIcon = document.getElementById("header-profile-icon");
    const settingsImg = document.getElementById("settings-profile-img");
    const settingsIcon = document.getElementById("settings-profile-icon");

    if (photoURL) {
        if (headerImg) {
            headerImg.src = photoURL;
            headerImg.style.display = "block";
        }
        if (headerIcon) headerIcon.style.display = "none";

        if (settingsImg) {
            settingsImg.src = photoURL;
            settingsImg.style.display = "block";
        }
        if (settingsIcon) settingsIcon.style.display = "none";
    } else {
        if (headerImg) headerImg.style.display = "none";
        if (headerIcon) headerIcon.style.display = "block";
        if (settingsImg) settingsImg.style.display = "none";
        if (settingsIcon) settingsIcon.style.display = "block";
    }
}

// Profile Modal öffnen
function openProfileModal() {
    const modal = document.getElementById("profile-modal");
    const nameInput = document.getElementById("profile-name-input");
    const imgPreview = document.getElementById("profile-image-preview");
    const imgPlaceholder = document.getElementById("profile-image-placeholder");

    if (modal && nameInput) {
        const user = firebase.auth().currentUser;
        if (user) {
            nameInput.value = user.displayName || "";
            if (user.photoURL) {
                if (imgPreview) {
                    imgPreview.src = user.photoURL;
                    imgPreview.classList.remove("hidden");
                }
                if (imgPlaceholder) imgPlaceholder.classList.add("hidden");
            } else {
                if (imgPreview) imgPreview.classList.add("hidden");
                if (imgPlaceholder) imgPlaceholder.classList.remove("hidden");
            }
        }
        modal.classList.remove("hidden");
    }
}

// ==============================
// PRESENCE SYSTEM & DROPDOWN
// ==============================
// v6 Refactor: extrahiert nach src/scripts/features/presence/.
// Aufrufer (initPresence, teardownPresence, writeUserPresence,
// initOnlineUsersDropdown) gehen jetzt durch die Bridge:
//   window.__features.presence.{onLogin, onLogout, initUI, markOffline}
// Die Bridge wird von src/scripts/main.js registriert (im Layout
// vor diesem Monolith via <script type="module"> geladen).


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
            window.__features?.presence?.onLogin(user);
            window.__features?.bulletin?.onLogin(user);

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
                            await window.__features?.notifications?.init({ swReg: null, appVersion: APP_VERSION });
                        } else if ('serviceWorker' in navigator) {
                            // PWA Service Worker Push Initialisierung
                            let reg = window.globalSwReg || await navigator.serviceWorker.getRegistration();

                            if (!reg) {
                                const timeout = new Promise(r => setTimeout(() => r(null), 5000));
                                reg = await Promise.race([navigator.serviceWorker.ready, timeout]);
                            }

                            if (reg) {
                                await window.__features?.notifications?.init({ swReg: reg, appVersion: APP_VERSION });
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
            window.__features?.bulletin?.onLogout();

            if (loginOverlay) {
                loginOverlay.style.display = "flex";
            }

            setLoginLoading(false);
        }
    });
}

function logout() {
    const user = firebase.auth().currentUser;
    const performSignOut = () => {
        firebase.auth().signOut().then(() => {
            showToast("Erfolgreich abgemeldet");
            isAppInitialized=false;
        }).catch((error) => {
            console.error("Logout error:", error);
            showToast("Fehler beim Abmelden", "error");
        });
    };

    if (user) {
        const presenceP = window.__features?.presence?.markOffline?.();
        if (presenceP && typeof presenceP.finally === 'function') {
            presenceP.finally(performSignOut);
        } else {
            performSignOut();
        }
    } else {
        performSignOut();
    }
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
    const pngIcons = {
        'rehbock': 'rebock.png',
        'reh': 'rehwild.png',
        'wildschwein': 'wildschwein1.png',
        'gams': 'gamswild.png',
        'muffelwild': 'muffelwild.png',
        'dachs': 'dachs.png',
        'marder': 'marder.png',
        'iltis': 'iltis.png',
        'hermelin': 'hermelin.png',
        'mauswiesel': 'mauswiesel.png',
        'ente': 'Ente.png',
        'fasan': 'Fasan.png',
        'deer': 'rotwild_weiblich.png',
        'crow': 'kraehe.png',
        'eichelhaeher': 'eichelhaeher.png',
        'fox': 'fuchs.png',
        'rabbit': 'hase.png'
    };

    const iconScales = {
        'reh': 1.1,
        'rehbock': 1.15,
        'wildschwein': 1.2,
        'gams': 1.0,
        'muffelwild': 1.1,
        'dachs': 1.1,
        'ente': 1.05,
        'fasan': 1.05,
        'deer': 1.15,
        'crow': 1.2,
        'eichelhaeher': 1.2,
        'fox': 1.25,
        'rabbit': 1.3
    };

    const scale = iconScales[type] || 1.0;

    if (pngIcons[type]) {
        const isDeer = type === 'deer';
        // Für Rotwild (Schwarz-Weiß Bild mit Rahmen):
        // Wir invertieren (Weiß -> Schwarz, Schwarz -> Weiß) und nutzen lighten, 
        // um den schwarzen Hintergrund auf der dunklen Karte verschwinden zu lassen.
        if (isDeer) {
            // Der ultimative Fix für Rotwild: 
            // 1. Wir erzwingen, dass alles Weiße transparent wird (durch screen blending)
            // 2. Wir erzwingen, dass die Silhouette weiß wird (durch invert/brightness)
            // 3. Wir nutzen ein Container-Div, um Clipping zu vermeiden
            return `<div class="silhouette-icon-container" style="width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <img src="icons/${pngIcons[type]}" 
                             width="${size}" height="${size}" 
                             style="width: 100%; height: 100%; object-fit: contain; transform: scale(${scale}); 
                                    filter: invert(1) contrast(5) brightness(1.2) !important; 
                                    mix-blend-mode: screen !important;">
                    </div>`;
        }
        
        return `<img src="icons/${pngIcons[type]}" 
                     width="${size}" height="${size}" 
                     class="silhouette-icon"
                     style="width: ${size}px; height: ${size}px; transform: scale(${scale});">`;
    }

    return "";
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
        iconContainer.style.display = 'none';
        wildartEl.textContent = "Keine aktiven Jagdzeiten";
        datumEl.textContent = "Alle Wildarten haben aktuell Schonzeit";
        indicatorEl.className = "schonzeit-indicator closed";
        statusTextEl.textContent = "Schonzeit";
        return;
    }

    const wildart = jagdzeitWildarten[schonzeitIndex % jagdzeitWildarten.length];
    iconContainer.style.display = 'none';
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
    const dashboardContainer = document.getElementById('schonzeit-liste-dashboard');
    if (!container && !dashboardContainer) return;

    let wildarten = jagdzeitenBayern.filter(w => 
        ['rehbock', 'reh', 'wildschwein', 'gams', 'muffelwild', 'dachs', 'marder', 'iltis', 'hermelin', 'mauswiesel', 'ente', 'fasan', 'deer', 'crow', 'eichelhaeher', 'fox', 'rabbit'].includes(w.iconClass)
    );

    // Filter anwenden
    if (aktuellerFilter === 'schonzeit') {
        wildarten = wildarten.filter(w => istSchonzeit(w));
    } else if (aktuellerFilter === 'jagdzeit') {
        wildarten = wildarten.filter(w => !istSchonzeit(w));
    }

    const html = wildarten.length === 0 
        ? `<div class="schonzeit-empty"><p>Keine Wildarten gefunden.</p></div>`
        : wildarten.map(wildart => {
            const hatSchonzeit = istSchonzeit(wildart);
            const statusClass = hatSchonzeit ? 'closed' : 'open';
            const statusText = hatSchonzeit ? 'Schonzeit' : 'Jagdzeit';
            let zeitInfo = wildart.keineJagdzeit ? 'Ganzjährige Schonzeit' : (wildart.ganzjaehrig ? 'Ganzjährig bejagbar' : `Jagdzeit: ${wildart.jagdzeitStart || '-'} - ${wildart.jagdzeitEnde || '-'}`);

            return `
                <div class="wildart-card">
                    <div class="wildart-icon">
                        ${getWildartIconHTML(wildart.iconClass, 44)}
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

    if (container) container.innerHTML = html;
    if (dashboardContainer) dashboardContainer.innerHTML = html;
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

    // SCHWARZES BRETT siehe src/scripts/features/bulletin/index.js (Bridge: window.__features.bulletin)
    let entries = [];

    // Die Funktion definieren wir GANZ HIER OBEN im Scope von initializeApp
    function renderDetailStats() {
        try {
            const streckeContainer = document.getElementById("stats-detail-strecke");
            const rehwildContainer = document.getElementById("stats-detail-rehwild");

            if (!streckeContainer || !rehwildContainer) return;

            // 1. Abschuss nach Wildarten
            const statsMap = {};
            entries.forEach(e => {
                if (e.wildart) {
                    statsMap[e.wildart] = (statsMap[e.wildart] || 0) + 1;
                }
            });

            let streckeHTML = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
            const sortedStats = Object.entries(statsMap).sort((a,b) => b[1] - a[1]);
            if (sortedStats.length === 0) {
                streckeHTML += "<p style='opacity:0.5'>Keine Daten vorhanden.</p>";
            } else {
                sortedStats.forEach(([art, count]) => {
                    streckeHTML += `
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;">
                            <span>${art}</span>
                            <span style="font-weight: bold; color: var(--primary-light);">${count}</span>
                        </div>
                    `;
                });
            }
            streckeHTML += '</div>';
            streckeContainer.innerHTML = streckeHTML;

            // 2. Rehwild Details
            const rehEntries = entries.filter(e => e.wildart === "Rehwild");
            const rehMap = {};
            rehEntries.forEach(e => {
                const kat = e.unterart || "Unbekannt";
                rehMap[kat] = (rehMap[kat] || 0) + 1;
            });

            let rehHTML = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
            const sortedReh = Object.entries(rehMap).sort((a,b) => b[1] - a[1]);
            if (sortedReh.length === 0) {
                rehHTML += "<p style='opacity:0.5'>Keine Daten vorhanden.</p>";
            } else {
                sortedReh.forEach(([kat, count]) => {
                    rehHTML += `
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;">
                            <span>${kat}</span>
                            <span style="font-weight: bold; color: var(--primary-light);">${count}</span>
                        </div>
                    `;
                });
            }
            rehHTML += '</div>';
            rehwildContainer.innerHTML = rehHTML;

            // 3. Schwarzes Brett (Offene Beiträge) - rendert das bulletin-Modul
            window.__features?.bulletin?.renderStatsDetail();
        } catch (err) {
            console.error("renderDetailStats error:", err);
        }
    }
    // Global für onclick Handler verfügbar machen
    window.renderDetailStats = renderDetailStats;

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
            // Live-Statistik im Dashboard aktualisieren
            const hochsitzStats = document.getElementById("hochsitz-count");
            if (hochsitzStats) {
                hochsitzStats.textContent = snapshot.size;
            }

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

    if (fabAddBtn) {
        fabAddBtn.addEventListener("click", () => {
            modal.classList.remove("hidden");
        });
    }

    const fabExportBtn = document.getElementById("fab-export-btn");
    if (fabExportBtn) {
        fabExportBtn.addEventListener("click", () => {
            if (entries.length === 0) {
                showToast("Keine Einträge zum Exportieren vorhanden", "info");
                return;
            }

            try {
                // Daten für Excel vorbereiten
                const exportData = entries.map(e => ({
                    'Datum': e.datum || '',
                    'Wildart': e.wildart || '',
                    'Unterart': e.unterart || '',
                    'Erleger': e.erleger || '',
                    'Bemerkung': e.bemerkung || '',
                    'Foto': (e.imageBase64 || e.imageUrl) ? 'Ja' : 'Nein'
                }));

                // Neues Workbook erstellen
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.json_to_sheet(exportData);

                // Spaltenbreiten optimieren
                const wscols = [
                    {wch: 12}, // Datum
                    {wch: 20}, // Wildart
                    {wch: 20}, // Unterart
                    {wch: 20}, // Erleger
                    {wch: 40}, // Bemerkung
                    {wch: 10}  // Foto
                ];
                ws['!cols'] = wscols;

                XLSX.utils.book_append_sheet(wb, ws, "Streckenliste");

                // Download auslösen
                const filename = `Streckenliste_Silbersbach_${new Date().toISOString().split('T')[0]}.xlsx`;
                XLSX.writeFile(wb, filename);

                showToast("Excel-Export erfolgreich", "success");
            } catch (err) {
                console.error("Export Fehler:", err);
                showToast("Fehler beim Exportieren", "error");
            }
        });
    }


    entriesCollection.orderBy("datum", "desc")
        .onSnapshot(snapshot => {
            entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Counter im Dashboard-Widget aktualisieren
            const streckeCountEl = document.getElementById("strecke-count");
            if (streckeCountEl) streckeCountEl.textContent = entries.length;

            const rehwildCountEl = document.getElementById("rehwild-count");
            if (rehwildCountEl) {
                const rehCount = entries.filter(e => e.wildart === "Rehwild").length;
                rehwildCountEl.textContent = rehCount;
            }

            renderEntries();
            renderDetailStats();
        });


    function renderEntries() {
        const dashboardList = document.getElementById("entry-list-dashboard");
        if (entryList) entryList.innerHTML = "";
        if (dashboardList) dashboardList.innerHTML = "";

        entries.forEach((entry, idx) => {
            const li = document.createElement("li");
            li.className = "entry-item";

            // Das richtige Icon suchen
            const wildartData = jagdzeitenBayern.find(w => w.name === entry.wildart || w.id === entry.wildart);
            const iconHTML = wildartData ? getWildartIconHTML(wildartData.iconClass, 28) : '<span style="font-size: 20px;">🦌</span>';

            // Header im Feed-Card Style
            const header = document.createElement("div");
            header.className = "feed-card-header";
            header.style.marginBottom = "0.2rem"; // Etwas kompakter
            header.innerHTML = `
                <div class="feed-card-icon-container">
                    ${iconHTML}
                </div>
                <div class="feed-card-header-text">
                    <span class="feed-card-title">${entry.wildart} ${entry.unterart || ""}</span>
                    <span class="feed-card-time">${entry.datum || ""} • ${entry.erleger}</span>
                </div>
            `;

            const btn = document.createElement("button");
            btn.className = "entry-delete-btn";
            btn.dataset.idx = idx;
            btn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>`;
            btn.style.background = "rgba(255,255,255,0.1)";
            btn.style.border = "none";
            btn.style.color = "var(--primary-light)";
            btn.style.padding = "0.5rem";
            btn.style.borderRadius = "8px";
            btn.style.cursor = "pointer";
            btn.style.marginLeft = "auto";
            
            header.appendChild(btn);
            li.appendChild(header);

            // Notes (optional)
            if (entry.bemerkung) {
                const notes = document.createElement("div");
                notes.className = "entry-notes";
                notes.textContent = entry.bemerkung;
                li.appendChild(notes);
            }

            // Foto-Bereich
            const fotoSection = document.createElement("div");
            fotoSection.className = "entry-foto-section";

            const imageSrc = entry.imageBase64 || entry.imageUrl;
            if (imageSrc) {
                fotoSection.innerHTML = `
                    <div class="entry-foto-thumbnail">
                        <img src="${imageSrc}" alt="Streckenfoto" class="entry-foto-img" data-id="${entry.id}">
                        <button class="entry-foto-delete-btn" data-id="${entry.id}" aria-label="Foto löschen">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="2.5">
                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
                            </svg>
                        </button>
                    </div>
                `;
            }

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

            // In beide Listen einfügen
            if (entryList) entryList.appendChild(li.cloneNode(true));
            if (dashboardList) dashboardList.appendChild(li.cloneNode(true));
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

    // Bild-Vollansicht Modal (global verfuegbar)
    window.openImageModal = function(src) {
        const overlay = document.createElement("div");
        overlay.className = "image-modal-overlay";
        overlay.innerHTML = `
        <div class="image-modal-content" >
            <img src="${src}" alt="Foto">
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
    };

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
                    if (!name) {
                        showToast("Bitte einen Namen eingeben", "error");
                        return;
                    }
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
    const apiKey = "YLF2SPSJ98MKAFEXGKRQRSFBW";
    const LAT = 49.2, LON = 13.05;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${LAT},${LON}?unitGroup=metric&key=${apiKey}&include=current,days`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Netzwerkfehler");
        const data = await response.json();

        // Cache weather data for detail page
        cachedWeatherData = data;

        const current = data.currentConditions;
        const today = data.days && data.days[0];
        const tomorrow = data.days && data.days[1];

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
        wetterWidget.addEventListener('click', () => toggleDashboardFeed('wetter'));
    }
}

// Wetter Detail-Seite anzeigen (Feed-basiert)
function showWetterDetails() {
    toggleDashboardFeed('wetter');
}

// Wetter Detail-Seite rendern
function renderWetterDetailPage() {
    const container = document.getElementById('wetter-detail-grid-dashboard') || document.getElementById('wetter-detail-grid');
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
        return;
    }

    // Check if user dismissed recently (24h cooldown)
    const dismissed=localStorage.getItem('installDismissed');
    if (dismissed) {
        const dismissedTime = parseInt(dismissed, 10);
        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours
        if (now - dismissedTime < cooldown) {
            return;
        }
    }

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // Show banner after short delay (after login)
        setTimeout(() => {
            const overlay = document.getElementById('login-overlay');
            const isLoggedIn = overlay && overlay.style.display === 'none';
            if (deferredPrompt && isLoggedIn) {
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

            setInterval(() => {
                reg.update();
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

// FCM PUSH siehe src/scripts/core/notifications/index.js (Bridge: window.__features.notifications)


// ==============================
// VERSION CHECK (Fallback für Mobile)
// ==============================
const LOCAL_VERSION_KEY = "app_version";

async function checkForUpdates() {
    try {
        const response = await fetch(`./version.json?t=${Date.now()}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
        });

        if (!response.ok) return;

        const data = await response.json();
        const serverVersion = data.version;
        const localVersion = localStorage.getItem(LOCAL_VERSION_KEY);

        if (!localVersion) {
            localStorage.setItem(LOCAL_VERSION_KEY, serverVersion);
            return;
        }

        if (serverVersion !== APP_VERSION.replace('v', '') || serverVersion !== localVersion) {
            showUpdateToast(true, serverVersion);
        }
    } catch (err) {
        // Version check silently fails - no user impact
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
// DOKUMENTENSAFE
// ==============================
const DOKUMENT_KATEGORIEN = [
    { id: 'jagderlaubnisschein', name: 'Jagderlaubnisschein', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
    { id: 'jagdschein', name: 'Jagdschein', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>' },
    { id: 'waffenbesitzkarte', name: 'Waffenbesitzkarte', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>' },
    { id: 'begehungsschein', name: 'Begehungsschein', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="15" r="2"/></svg>' }
];

let dokumenteCache = {};

function initDokumenteSafe() {
    const wizardDone = localStorage.getItem('dokumente_wizard_done');
    const wizard = document.getElementById('dokumente-wizard');
    const grid = document.getElementById('dokumente-grid');
    if (!wizard || !grid) return;

    if (!wizardDone) {
        wizard.classList.remove('hidden');
        grid.classList.add('hidden');
        initDokumenteWizard();
    } else {
        wizard.classList.add('hidden');
        grid.classList.remove('hidden');
        renderDokumenteSafe();
    }
}

function initDokumenteWizard() {
    const steps = document.querySelectorAll('.dok-wizard-step');
    const dots = document.querySelectorAll('.dok-wizard-dot');
    const prevBtn = document.getElementById('dok-wizard-prev');
    const nextBtn = document.getElementById('dok-wizard-next');
    if (!steps.length || !prevBtn || !nextBtn) return;

    let currentStep = 0;
    const totalSteps = steps.length;

    function showStep(idx) {
        steps.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        steps[idx].classList.add('active');
        dots[idx].classList.add('active');

        prevBtn.classList.toggle('hidden', idx === 0);

        if (idx === totalSteps - 1) {
            nextBtn.textContent = 'Fertig';
        } else {
            nextBtn.textContent = 'Weiter';
        }
    }

    prevBtn.onclick = () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    };

    nextBtn.onclick = () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            showStep(currentStep);
        } else {
            localStorage.setItem('dokumente_wizard_done', 'true');
            const wizard = document.getElementById('dokumente-wizard');
            const grid = document.getElementById('dokumente-grid');
            if (wizard) wizard.classList.add('hidden');
            if (grid) grid.classList.remove('hidden');
            renderDokumenteSafe();
        }
    };

    showStep(0);
}

async function renderDokumenteSafe() {
    const grid = document.getElementById('dokumente-grid');
    if (!grid) return;

    const user = firebase.auth().currentUser;
    if (!user) {
        grid.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 2rem;">Bitte zuerst anmelden.</p>';
        return;
    }

    grid.innerHTML = DOKUMENT_KATEGORIEN.map(kat => `
        <div class="wetter-detail-widget dok-widget" data-kategorie="${kat.id}">
            <div class="wetter-detail-header">
                ${kat.icon}
                <span>${kat.name}</span>
            </div>
            <div class="wetter-detail-content">
                <div class="dok-thumbnails" id="dok-thumbs-${kat.id}">
                    <div class="dok-loading">Lade...</div>
                </div>
                <button class="dok-upload-btn" onclick="uploadDokument('${kat.id}')">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                    Foto hinzufügen
                </button>
            </div>
        </div>
    `).join('');

    await loadDokumente(user.uid);
}

async function loadDokumente(uid) {
    const db = firebase.firestore();
    try {
        const snapshot = await db.collection('users').doc(uid).collection('documents').get();
        dokumenteCache = {};
        snapshot.forEach(doc => {
            dokumenteCache[doc.id] = doc.data();
        });
        DOKUMENT_KATEGORIEN.forEach(kat => renderDokumentThumbnails(kat.id));
    } catch (err) {
        console.error("Dokumente laden Fehler:", err);
        showToast("Fehler beim Laden der Dokumente", "error");
    }
}

function renderDokumentThumbnails(kategorie) {
    const container = document.getElementById(`dok-thumbs-${kategorie}`);
    const wizardContainer = document.getElementById(`wizard-thumbs-${kategorie}`);
    const data = dokumenteCache[kategorie];
    const images = (data && data.images) || [];

    const html = images.length === 0
        ? '<span class="dok-empty">Keine Dokumente</span>'
        : images.map((img, idx) => `
            <div class="dok-thumb-wrap">
                <img src="${img.url}" alt="${kategorie}" class="dok-thumb-img" onclick="openImageModal('${img.url}')">
                <button class="dok-thumb-delete" onclick="deleteDokument('${kategorie}', ${idx})" aria-label="Löschen">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        `).join('');

    if (container) container.innerHTML = html;
    if (wizardContainer) wizardContainer.innerHTML = html;
}

async function uploadDokument(kategorie) {
    const user = firebase.auth().currentUser;
    if (!user) {
        showToast("Bitte zuerst anmelden", "error");
        return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.onchange = async () => {
        const file = fileInput.files[0];
        if (!file) return;

        try {
            showToast("Dokument wird hochgeladen...", "info");

            const blob = await compressImage(file, 1200, 1200);

            const storageRef = firebase.storage().ref();
            const filename = `${Date.now()}.jpg`;
            const fileRef = storageRef.child(`documents/${user.uid}/${kategorie}/${filename}`);

            await fileRef.put(blob, { contentType: 'image/jpeg' });
            const url = await fileRef.getDownloadURL();

            const db = firebase.firestore();
            const docRef = db.collection('users').doc(user.uid).collection('documents').doc(kategorie);
            const docSnap = await docRef.get();
            const existing = docSnap.exists ? (docSnap.data().images || []) : [];

            existing.push({
                url: url,
                name: filename,
                uploadedAt: Date.now()
            });

            await docRef.set({
                images: existing,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            if (!dokumenteCache[kategorie]) dokumenteCache[kategorie] = { images: [] };
            dokumenteCache[kategorie].images = existing;
            renderDokumentThumbnails(kategorie);

            showToast("Dokument gespeichert", "success");
        } catch (err) {
            console.error("Dokument Upload Fehler:", err);
            showToast("Fehler beim Hochladen: " + err.message, "error");
        }
    };
}

async function deleteDokument(kategorie, imageIndex) {
    const confirmed = await showConfirm(
        "Möchtest du dieses Dokument wirklich löschen?",
        "Dokument löschen",
        "Löschen"
    );
    if (!confirmed) return;

    const user = firebase.auth().currentUser;
    if (!user) return;

    try {
        const data = dokumenteCache[kategorie];
        if (!data || !data.images || !data.images[imageIndex]) return;

        const image = data.images[imageIndex];

        // Storage-Datei loeschen
        try {
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(`documents/${user.uid}/${kategorie}/${image.name}`);
            await fileRef.delete();
        } catch (storageErr) {
            console.warn("Storage Datei konnte nicht gelöscht werden:", storageErr);
        }

        // Firestore aktualisieren
        data.images.splice(imageIndex, 1);
        const db = firebase.firestore();
        await db.collection('users').doc(user.uid).collection('documents').doc(kategorie).set({
            images: data.images,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        renderDokumentThumbnails(kategorie);
        showToast("Dokument gelöscht", "delete");
    } catch (err) {
        console.error("Dokument löschen Fehler:", err);
        showToast("Fehler beim Löschen", "error");
    }
}

// ==============================
// MAIN INITIALIZATION
// ==============================
function initAll() {
    // Globaler Error-Handler: nur kritische Fehler als Toast,
    // Rest still in der Console (verhindert Toast-Spam bei Bilder/CDN-Issues).
    window.onerror = function (msg, url, line, col, error) {
        const message = String(msg || '');
        const ignorePatterns = [
            'ResizeObserver',
            'Script error',
            'Non-Error promise rejection',
            'Loading chunk',
            'NotAllowedError',
        ];
        if (ignorePatterns.some(p => message.includes(p))) {
            console.warn('[onerror gefiltert]', message);
            return false;
        }
        console.error('[onerror]', message, 'at', url, 'L' + line, error);
        return false;
    };

    window.addEventListener('unhandledrejection', (event) => {
        console.warn('[unhandledrejection]', event.reason);
    });

    updateVersionDisplays();
    showToast(`Reviersystem ${APP_VERSION} bereit`, "success");

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
    const profileImgInput = document.getElementById("profile-image-input");
    const profileImgPreviewWrapper = document.getElementById("profile-image-preview-wrapper");
    const profileImgPreview = document.getElementById("profile-image-preview");
    const profileImgPlaceholder = document.getElementById("profile-image-placeholder");

    if (profileImgPreviewWrapper && profileImgInput) {
        profileImgPreviewWrapper.addEventListener("click", () => {
            profileImgInput.click();
        });

        profileImgInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (profileImgPreview) {
                        profileImgPreview.src = event.target.result;
                        profileImgPreview.classList.remove("hidden");
                    }
                    if (profileImgPlaceholder) {
                        profileImgPlaceholder.classList.add("hidden");
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (cancelProfileBtn && profileModal) {
        cancelProfileBtn.addEventListener("click", () => {
            profileModal.classList.add("hidden");
        });
    }

    if (profileForm && profileModal) {
        profileForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById("profile-name-input");
            const newName = nameInput ? nameInput.value.trim() : "";
            const user = firebase.auth().currentUser;
            const file = profileImgInput ? profileImgInput.files[0] : null;

            if (user) {
                try {
                    let photoURL = user.photoURL;

                    if (file) {
                        try {
                            const uploadItem = await compressImage(file);
                            
                            const dataUrl = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = (e) => resolve(e.target.result);
                                reader.onerror = (e) => reject(new Error("FileReader error"));
                                reader.readAsDataURL(uploadItem);
                            });

                            showToast("Bild wird hochgeladen...", "info");

                            if (typeof firebase.storage !== "function") {
                                throw new Error("Firebase Storage ist nicht geladen.");
                            }

                            const storageRef = firebase.storage().ref();
                            const fileRef = storageRef.child(`profile_pictures/${user.uid}.jpg`);
                            
                            const timeout = new Promise((_, reject) => 
                                setTimeout(() => reject(new Error("Timeout (30s) - Verbindung zum Speicher fehlgeschlagen.")), 30000)
                            );

                            const upload = (async () => {
                                await fileRef.putString(dataUrl, 'data_url', { contentType: 'image/jpeg' });
                                return await fileRef.getDownloadURL();
                            })();

                            photoURL = await Promise.race([upload, timeout]);
                        } catch (uploadError) {
                            console.error("Upload fehlgeschlagen:", uploadError);
                            showToast("Foto-Upload fehlgeschlagen: " + uploadError.message, "error");
                        }
                    }

                    await user.updateProfile({ 
                        displayName: newName,
                        photoURL: photoURL
                    });

                    showToast("Profil aktualisiert!", "success");
                    updateUserInfo(user, newName, photoURL);
                    user.reload().catch(() => {});

                } catch (error) {
                    console.error("Fehler beim Profil-Update:", error);
                    showToast("Es gab ein Problem beim Speichern: " + error.message, "error");
                } finally {
                    const profileModal = document.getElementById("profile-modal");
                    if (profileModal) profileModal.classList.add("hidden");
                }
            } else {
                console.error("No user logged in during profile update");
                showToast("Nicht angemeldet.", "error");
            }
        });
    }

    try { initLogin(); } catch (e) {
        console.error("Login init error:", e);
        showToast("Login Init Fehler", "error");
    }

    try { initNavigation(); } catch (e) {
        console.error("Navigation init error:", e);
    }

    try { initClock(); } catch (e) {
        console.error("Clock init error:", e);
    }

    try { initSchonzeitWidget(); } catch (e) {
        console.error("Schonzeit Widget init error:", e);
    }

    try { initWetterWidgetClick(); } catch (e) {
        console.error("Wetter Widget Click init error:", e);
    }

    try { initAuthListener(); } catch (e) {
        console.error("Auth Listener init error:", e);
    }

    try { initInstallPrompt(); } catch (e) {
        console.error("Install Prompt init error:", e);
    }

    try { window.__features?.presence?.initUI(); } catch (e) {
        console.error("Online Users Dropdown init error:", e);
    }

    try { window.__features?.bulletin?.initUI(); } catch (e) {
        console.error("Bulletin init error:", e);
    }
}

/**
 * Updates all version strings in the UI automatically
 */
function updateVersionDisplays() {
    // 1. Element mit ID 'app-version' (z.B. im Login)
    const appVersionEl = document.getElementById("app-version");
    if (appVersionEl) {
        appVersionEl.textContent = APP_VERSION;
    }

    // 2. Elemente mit Klasse 'app-version-text' (z.B. in Einstellungen)
    const versionTexts = document.querySelectorAll(".app-version-text");
    versionTexts.forEach(el => {
        el.textContent = APP_VERSION.replace('v', ''); // Nur die Nummer falls gewünscht
    });
}

// Wait for DOM and external scripts to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    // DOM already ready, but CryptoJS might not be loaded yet
    // Small delay to ensure all scripts are loaded
    setTimeout(initAll, 100);
}
