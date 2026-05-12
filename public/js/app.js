// ==============================
// APP VERSION
// ==============================
const APP_VERSION = "v6.0.0";

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
        window.__features?.schonzeit?.renderListe?.();
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
            window.__features?.wetter?.renderDetailGrid?.();
        }
    } else if (view === 'dokumente') {
        if (dokumenteFeed) {
            dokumenteFeed.classList.remove("hidden");
            window.__features?.dokumente?.initSafe?.();
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

// Bridge fuer v6-Module (z.B. streckenliste): Katalog + Icon-Helfer
window.jagdzeitenBayern = jagdzeitenBayern;

// Toasts / Confirm: src/scripts/core/ui/index.js (window.showToast / window.showConfirm via main.js initBridge)

// ==============================
// PAGE NAVIGATION
// ==============================
// v6 Refactor: navigateToPage, navigateToDashboard, closeMapPanels, setActiveTab,
// initNavigation -> src/scripts/features/navigation/ (Bridge: window.__features.navigation,
// window.navigateToPage / window.navigateToDashboard via initBridge in main.js)

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

window.compressImage = compressImage;

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

// ==============================
// FIREBASE AUTHENTICATION
// ==============================
// v6 Refactor: Login, onAuthStateChanged, logout -> src/scripts/features/auth/
// (Bridge: window.__features.auth, window.logout in initUI)

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
window.getWildartIconHTML = getWildartIconHTML;

// ==============================
// INITIALIZE APP
// ==============================
async function initializeApp() {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Streckenliste / Schwarzes Brett: src/scripts/features (Bridge: window.__features.*)
    function renderDetailStats() {
        try {
            window.__features?.streckenliste?.renderStatsDetail();
            window.__features?.bulletin?.renderStatsDetail();
        } catch (err) {
            console.error("renderDetailStats error:", err);
        }
    }
    window.renderDetailStats = renderDetailStats;

    // v6 Refactor: Karte, Panels, Hochsitze, GPS extrahiert nach
    // src/scripts/features/map/ (Bridge: window.__features.map)
    window.__features?.map?.init(db);

    // Wetter beim App-Start laden
    window.__features?.wetter?.refresh?.();
}

// v6 Refactor: Karte + GPS + Hochsitze + Eigengrundstücke extrahiert nach
// src/scripts/features/map/ (Bridge: window.__features.map)
// Die Panels, Leaflet-Controls und Firestore-Marker-Listener sind
// vollstaendig im Modul; `window.mapInstance` wird dort gesetzt.



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
    window.showToast(`Reviersystem ${APP_VERSION} bereit`, "success");

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

                            window.showToast("Bild wird hochgeladen...", "info");

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
                            window.showToast("Foto-Upload fehlgeschlagen: " + uploadError.message, "error");
                        }
                    }

                    await user.updateProfile({ 
                        displayName: newName,
                        photoURL: photoURL
                    });

                    window.showToast("Profil aktualisiert!", "success");
                    updateUserInfo(user, newName, photoURL);
                    user.reload().catch(() => {});

                } catch (error) {
                    console.error("Fehler beim Profil-Update:", error);
                    window.showToast("Es gab ein Problem beim Speichern: " + error.message, "error");
                } finally {
                    const profileModal = document.getElementById("profile-modal");
                    if (profileModal) profileModal.classList.add("hidden");
                }
            } else {
                console.error("No user logged in during profile update");
                window.showToast("Nicht angemeldet.", "error");
            }
        });
    }

    try { window.__features?.auth?.initLogin(); } catch (e) {
        console.error("Login init error:", e);
        window.showToast("Login Init Fehler", "error");
    }

    try { window.__features?.navigation?.initNavigation(); } catch (e) {
        console.error("Navigation init error:", e);
    }

    try { initClock(); } catch (e) {
        console.error("Clock init error:", e);
    }

    try { window.__features?.schonzeit?.initUI(); } catch (e) {
        console.error("Schonzeit Widget init error:", e);
    }

    try { window.__features?.wetter?.initUI(); } catch (e) {
        console.error("Wetter Widget init error:", e);
    }

    try {
        window.__features?.auth?.initAuthListener?.({
            firebaseConfig,
            appVersion: APP_VERSION,
            initializeApp,
            updateUserInfo,
            showInstallBannerAfterLogin,
            setActiveTab: (...args) => window.__features?.navigation?.setActiveTab?.(...args),
        });
    } catch (e) {
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

    try { window.__features?.streckenliste?.initUI(); } catch (e) {
        console.error("Streckenliste init error:", e);
    }

    try { window.__features?.dokumente?.initUI(); } catch (e) {
        console.error("Dokumente init error:", e);
    }

    try { window.__features?.navigation?.initUI(); } catch (e) {
        console.error("Navigation initUI error:", e);
    }

    try { window.__features?.auth?.initUI(); } catch (e) {
        console.error("Auth initUI error:", e);
    }

    try { window.__features?.map?.initUI(); } catch (e) {
        console.error("Map init error:", e);
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
