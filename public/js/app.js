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
// JAGDZEITEN BAYERN - Daten
// ==============================
const jagdzeitenBayern = [
    // ===== SCHALENWILD =====
    // Rotwild
    { id: "rotwild-hirsche", name: "Rotwild (Hirsche)", jagdzeitStart: "01.08", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "rotwild-alttiere", name: "Rotwild (Alttiere)", jagdzeitStart: "01.08", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "rotwild-kaelber", name: "Rotwild (Kälber)", jagdzeitStart: "01.08", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "rotwild-schmalspiess", name: "Rotwild (Schmalspießer)", jagdzeitStart: "01.06", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "rotwild-schmaltiere", name: "Rotwild (Schmaltiere)", jagdzeitStart: "01.06", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    
    // Damwild
    { id: "damwild-hirsche", name: "Damwild (Hirsche)", jagdzeitStart: "01.09", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "damwild-alttiere", name: "Damwild (Alttiere)", jagdzeitStart: "01.09", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "damwild-kaelber", name: "Damwild (Kälber)", jagdzeitStart: "01.09", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "damwild-schmalspiess", name: "Damwild (Schmalspießer)", jagdzeitStart: "01.07", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "damwild-schmaltiere", name: "Damwild (Schmaltiere)", jagdzeitStart: "01.07", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    
    // Sikawild
    { id: "sikawild-hirsche", name: "Sikawild (Hirsche)", jagdzeitStart: "01.09", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "sikawild-alttiere", name: "Sikawild (Alttiere)", jagdzeitStart: "01.09", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "sikawild-kaelber", name: "Sikawild (Kälber)", jagdzeitStart: "01.09", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "sikawild-schmalspiess", name: "Sikawild (Schmalspießer)", jagdzeitStart: "01.07", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "sikawild-schmaltiere", name: "Sikawild (Schmaltiere)", jagdzeitStart: "01.07", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    
    // Rehwild
    { id: "rehwild-boecke", name: "Rehwild (Böcke)", jagdzeitStart: "01.05", jagdzeitEnde: "15.10", iconClass: "ti ti-deer" },
    { id: "rehwild-geissen", name: "Rehwild (Geißen)", jagdzeitStart: "01.09", jagdzeitEnde: "15.01", iconClass: "ti ti-deer" },
    { id: "rehwild-kitze", name: "Rehwild (Kitze)", jagdzeitStart: "01.09", jagdzeitEnde: "15.01", iconClass: "ti ti-deer" },
    { id: "rehwild-schmalrehe", name: "Rehwild (Schmalrehe)", jagdzeitStart: "01.05", jagdzeitEnde: "15.01", iconClass: "ti ti-deer" },
    
    // Schwarzwild
    { id: "schwarzwild-keiler", name: "Schwarzwild (Keiler)", ganzjaehrig: true, iconClass: "ti ti-pig" },
    { id: "schwarzwild-bachen", name: "Schwarzwild (Bachen)", ganzjaehrig: true, iconClass: "ti ti-pig" },
    { id: "schwarzwild-frischlinge", name: "Schwarzwild (Frischlinge)", ganzjaehrig: true, iconClass: "ti ti-pig" },
    { id: "schwarzwild-ueberlaeufer", name: "Schwarzwild (Überläufer)", ganzjaehrig: true, iconClass: "ti ti-pig" },
    
    // Weiteres Schalenwild
    { id: "gamswild", name: "Gamswild", jagdzeitStart: "01.08", jagdzeitEnde: "15.12", iconClass: "ti ti-deer" },
    { id: "muffelwild", name: "Muffelwild", jagdzeitStart: "01.08", jagdzeitEnde: "31.01", iconClass: "ti ti-deer" },
    { id: "elchwild", name: "Elchwild", keineJagdzeit: true, iconClass: "ti ti-deer" },
    { id: "steinwild", name: "Steinwild", keineJagdzeit: true, iconClass: "ti ti-deer" },
    { id: "wisent", name: "Wisent", keineJagdzeit: true, iconClass: "ti ti-deer" },
    
    // ===== RAUBWILD =====
    { id: "fuchs", name: "Fuchs", ganzjaehrig: true, iconClass: "ti ti-paw" },
    { id: "dachs", name: "Dachs", jagdzeitStart: "01.08", jagdzeitEnde: "31.10", iconClass: "ti ti-paw" },
    { id: "baummarder", name: "Baummarder", jagdzeitStart: "16.10", jagdzeitEnde: "28.02", iconClass: "ti ti-paw" },
    { id: "steinmarder", name: "Steinmarder", jagdzeitStart: "16.10", jagdzeitEnde: "28.02", iconClass: "ti ti-paw" },
    { id: "iltis", name: "Iltis", jagdzeitStart: "01.08", jagdzeitEnde: "28.02", iconClass: "ti ti-paw" },
    { id: "hermelin", name: "Hermelin", jagdzeitStart: "01.08", jagdzeitEnde: "28.02", iconClass: "ti ti-paw" },
    { id: "mauswiesel", name: "Mauswiesel", jagdzeitStart: "01.08", jagdzeitEnde: "28.02", iconClass: "ti ti-paw" },
    { id: "luchs", name: "Luchs", keineJagdzeit: true, iconClass: "ti ti-paw" },
    { id: "wildkatze", name: "Wildkatze", keineJagdzeit: true, iconClass: "ti ti-paw" },
    { id: "fischotter", name: "Fischotter", ganzjaehrig: true, iconClass: "ti ti-paw" },
    
    // Neozoen (Raubwild)
    { id: "waschbaer", name: "Waschbär", ganzjaehrig: true, iconClass: "ti ti-paw" },
    { id: "marderhund", name: "Marderhund", ganzjaehrig: true, iconClass: "ti ti-paw" },
    { id: "nutria", name: "Nutria", ganzjaehrig: true, iconClass: "ti ti-paw" },
    
    // ===== HASEN =====
    { id: "feldhase", name: "Feldhase", jagdzeitStart: "16.10", jagdzeitEnde: "31.12", iconClass: "ti ti-paw" },
    { id: "schneehase", name: "Schneehase", keineJagdzeit: true, iconClass: "ti ti-paw" },
    { id: "wildkaninchen", name: "Wildkaninchen", ganzjaehrig: true, iconClass: "ti ti-paw" },
    
    // ===== NAGETIERE =====
    { id: "biber", name: "Biber", jagdzeitStart: "01.09", jagdzeitEnde: "15.03", iconClass: "ti ti-paw" },
    { id: "murmeltier", name: "Murmeltier", keineJagdzeit: true, iconClass: "ti ti-paw" },
    
    // ===== WASSERVÖGEL =====
    // Wildenten
    { id: "stockente", name: "Wildenten (Stockente)", jagdzeitStart: "01.09", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "krickente", name: "Wildenten (Krickente)", jagdzeitStart: "01.10", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "pfeifente", name: "Wildenten (Pfeifente)", jagdzeitStart: "01.10", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "spiesssente", name: "Wildenten (Spießente)", jagdzeitStart: "01.10", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "reiherente", name: "Wildenten (Reiherente)", jagdzeitStart: "01.10", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "tafelente", name: "Wildenten (Tafelente)", jagdzeitStart: "01.10", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "bergente", name: "Wildenten (Bergente)", jagdzeitStart: "01.10", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "samtente", name: "Wildenten (Samtente)", jagdzeitStart: "01.10", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "trauerente", name: "Wildenten (Trauerente)", jagdzeitStart: "01.10", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    
    // Wildgänse
    { id: "graugans", name: "Wildgänse (Graugans)", jagdzeitStart: "01.08", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "blaessgans", name: "Wildgänse (Blässgans)", jagdzeitStart: "01.11", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "saatgans", name: "Wildgänse (Saatgans)", jagdzeitStart: "01.11", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "kanadagans", name: "Wildgänse (Kanadagans)", jagdzeitStart: "01.08", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "nilgans", name: "Wildgänse (Nilgans)", jagdzeitStart: "01.08", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "ringelgans", name: "Wildgänse (Ringelgans)", jagdzeitStart: "01.11", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    
    // Sonstige Wasservögel
    { id: "blaesshuhn", name: "Blässhuhn", jagdzeitStart: "11.09", jagdzeitEnde: "20.02", iconClass: "ti ti-feather" },
    { id: "hoeckerschwan", name: "Höckerschwan", jagdzeitStart: "01.11", jagdzeitEnde: "20.02", iconClass: "ti ti-feather" },
    { id: "haubentaucher", name: "Haubentaucher", keineJagdzeit: true, iconClass: "ti ti-feather" },
    { id: "saeger", name: "Säger", keineJagdzeit: true, iconClass: "ti ti-feather" },
    { id: "kormoran", name: "Kormoran", jagdzeitStart: "16.08", jagdzeitEnde: "14.03", iconClass: "ti ti-feather" },
    { id: "graureiher", name: "Graureiher", jagdzeitStart: "16.09", jagdzeitEnde: "31.10", iconClass: "ti ti-feather" },
    
    // Möwen
    { id: "lachmoewe", name: "Möwen (Lachmöwe)", jagdzeitStart: "01.10", jagdzeitEnde: "10.02", iconClass: "ti ti-feather" },
    { id: "sturmmoewe", name: "Möwen (Sturmmöwe)", jagdzeitStart: "01.10", jagdzeitEnde: "10.02", iconClass: "ti ti-feather" },
    { id: "silbermoewe", name: "Möwen (Silbermöwe)", jagdzeitStart: "01.10", jagdzeitEnde: "10.02", iconClass: "ti ti-feather" },
    { id: "heringsmoewe", name: "Möwen (Heringsmöwe)", jagdzeitStart: "01.10", jagdzeitEnde: "10.02", iconClass: "ti ti-feather" },
    { id: "mantelmoewe", name: "Möwen (Mantelmöwe)", jagdzeitStart: "01.10", jagdzeitEnde: "10.02", iconClass: "ti ti-feather" },
    
    // ===== FEDERWILD (Land) =====
    { id: "fasan", name: "Fasan", jagdzeitStart: "01.10", jagdzeitEnde: "31.12", iconClass: "ti ti-feather" },
    { id: "rebhuhn", name: "Rebhuhn", jagdzeitStart: "01.09", jagdzeitEnde: "31.10", iconClass: "ti ti-feather" },
    { id: "wachtel", name: "Wachtel", keineJagdzeit: true, iconClass: "ti ti-feather" },
    { id: "waldschnepfe", name: "Waldschnepfe", jagdzeitStart: "16.10", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    
    // Wildtauben
    { id: "ringeltaube", name: "Wildtauben (Ringeltaube)", jagdzeitStart: "01.11", jagdzeitEnde: "20.02", iconClass: "ti ti-feather" },
    { id: "tuerkentaube", name: "Wildtauben (Türkentaube)", jagdzeitStart: "01.11", jagdzeitEnde: "20.02", iconClass: "ti ti-feather" },
    
    // Wildtruthühner
    { id: "wildtruthahn", name: "Wildtruthuhn (Hähne)", jagdzeitStart: "01.10", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    { id: "wildtruthenne", name: "Wildtruthuhn (Hennen)", jagdzeitStart: "01.10", jagdzeitEnde: "15.01", iconClass: "ti ti-feather" },
    
    // Raufußhühner (alle geschützt)
    { id: "auerwild", name: "Auerwild", keineJagdzeit: true, iconClass: "ti ti-feather" },
    { id: "birkwild", name: "Birkwild", keineJagdzeit: true, iconClass: "ti ti-feather" },
    { id: "rackelwild", name: "Rackelwild", keineJagdzeit: true, iconClass: "ti ti-feather" },
    { id: "haselwild", name: "Haselwild", keineJagdzeit: true, iconClass: "ti ti-feather" },
    { id: "alpenschneehuhn", name: "Alpenschneehuhn", keineJagdzeit: true, iconClass: "ti ti-feather" },
    
    // ===== RABENVÖGEL =====
    { id: "rabenkraehe", name: "Rabenkrähe", jagdzeitStart: "16.07", jagdzeitEnde: "14.03", iconClass: "ti ti-feather" },
    { id: "elster", name: "Elster", jagdzeitStart: "16.07", jagdzeitEnde: "14.03", iconClass: "ti ti-feather" },
    { id: "eichelhaeler", name: "Eichelhäher", jagdzeitStart: "16.07", jagdzeitEnde: "14.03", iconClass: "ti ti-feather" },
    { id: "kolkrabe", name: "Kolkrabe", keineJagdzeit: true, iconClass: "ti ti-feather" },
    
    // ===== GREIFVÖGEL (alle geschützt) =====
    { id: "greife", name: "Greife", keineJagdzeit: true, iconClass: "ti ti-feather" },
    { id: "falken", name: "Falken", keineJagdzeit: true, iconClass: "ti ti-feather" },
    
    // ===== SONSTIGE =====
    { id: "grosstrappe", name: "Großtrappe", keineJagdzeit: true, iconClass: "ti ti-feather" },
    { id: "seehund", name: "Seehund", keineJagdzeit: true, iconClass: "ti ti-paw" }
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
        
        // Bottom Navigation einblenden (außer auf Dashboard)
        if (bottomNav && targetId !== "dashboard") {
            bottomNav.classList.remove("hidden");
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
    
    // Bottom Navigation ausblenden
    if (bottomNav) bottomNav.classList.add("hidden");
    
    // Hochsitz-Sidebar schliessen
    const hochsitzPanel = document.getElementById("hochsitz-panel");
    if (hochsitzPanel) {
        hochsitzPanel.classList.remove("open");
        setTimeout(() => hochsitzPanel.classList.add("hidden"), 300);
    }
}

// iOS Bounce/Overscroll Prevention
function preventIOSBounce() {
    // Nur auf iOS/Touch-Geräten
    if (!('ontouchstart' in window)) return;
    
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].pageY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
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
            // User is signed in
            document.body.classList.add("authenticated");
            
            if (loginOverlay) {
                loginOverlay.style.display = "none";
            }
            
            // Initialize app only once
            if (!isAppInitialized) {
                isAppInitialized = true;
                initializeApp().catch((error) => {
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
    const timeStr = now.getHours().toString().padStart(2,'0') + ":" + now.getMinutes().toString().padStart(2,'0');
    const dateStr = now.getDate().toString().padStart(2,'0') + "." + (now.getMonth()+1).toString().padStart(2,'0') + "." + now.getFullYear();
    
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

function updateSchonzeitWidget() {
    const iconContainer = document.getElementById('schonzeit-icon');
    const wildartEl = document.getElementById('schonzeit-wildart');
    const datumEl = document.getElementById('schonzeit-datum');
    const indicatorEl = document.getElementById('schonzeit-indicator');
    const statusTextEl = document.getElementById('schonzeit-status-text');
    
    if (!iconContainer || !wildartEl || !datumEl) return;
    
    const jagdzeitWildarten = getWildartenMitJagdzeit();
    
    if (jagdzeitWildarten.length === 0) {
        // Keine Wildart hat aktuell Jagdzeit
        iconContainer.innerHTML = `<i class="ti ti-alert-circle"></i>`;
        wildartEl.textContent = "Keine aktiven Jagdzeiten";
        datumEl.textContent = "Alle Wildarten haben aktuell Schonzeit";
        indicatorEl.className = "schonzeit-indicator closed";
        statusTextEl.textContent = "Schonzeit";
        return;
    }
    
    // Rotiere durch Wildarten mit Jagdzeit
    const wildart = jagdzeitWildarten[schonzeitIndex % jagdzeitWildarten.length];
    
    iconContainer.innerHTML = `<i class="${wildart.iconClass}"></i>`;
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
    
    // Details-Button Event Listener
    const detailsBtn = document.getElementById('schonzeit-details-btn');
    if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
            showSchonzeitDetails();
        });
    }
    
    console.log("Schonzeit Widget initialized");
}

function showSchonzeitDetails() {
    // Navigiere zur Detail-Seite mit dem bestehenden Navigationssystem
    navigateToPage('schonzeit-page');
    renderSchonzeitListe();
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
                    <i class="${wildart.iconClass}"></i>
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

    const hochsitzPanel = document.getElementById("hochsitz-panel");
    const panelContent = hochsitzPanel?.querySelector(".panel-content");

    const openHochsitzPanel = () => {
        if (!hochsitzPanel) return;
        hochsitzPanel.classList.remove("hidden");
        setTimeout(() => hochsitzPanel.classList.add("open"), 10);
    };

    const closeHochsitzPanel = () => {
        if (!hochsitzPanel) return;
        hochsitzPanel.classList.remove("open");
        setTimeout(() => hochsitzPanel.classList.add("hidden"), 300);
    };

    const closePanelBtn = document.getElementById("close-hochsitz-panel");
    if (closePanelBtn) closePanelBtn.addEventListener("click", closeHochsitzPanel);

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

            entryList.appendChild(li);
        });
        attachDeleteEvents();
    }

    function attachDeleteEvents() {
        document.querySelectorAll("#entry-list button").forEach(btn => {
            btn.addEventListener("click", async () => {
                const entry = entries[btn.dataset.idx];
                if (!entry.id) return;
                try {
                    await entriesCollection.doc(entry.id).delete();
                    showToast("Eintrag gelöscht", "delete");
                } catch(err) {
                    console.error(err);
                    showToast("Fehler beim Löschen", "error");
                }
            });
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
        formData.forEach((v,k) => entry[k]=v);
        try {
            await entriesCollection.add(entry);
            showToast("Eintrag gespeichert", "success");
            form.reset();
            subcategoryContainer.innerHTML = "";
            modal.classList.add("hidden");
        } catch(err) {
            console.error(err);
            showToast("Fehler beim Speichern", "error");
        }
    });

    initializeMap(db, hochsitzeCollection, openHochsitzPanel);
    
    // Wetter beim App-Start laden
    fetchLiveWeather();
}

// ==============================
// MAP
// ==============================
function initializeMap(db, hochsitzeCollection, openHochsitzPanel) {
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

    // Statusdot (optional - nur wenn Container existiert)
    const mapContainer = document.getElementById("map-container");
    if (mapContainer) {
        const mapStatusDot = document.createElement("span");
        mapStatusDot.id = "map-status-dot";
        mapStatusDot.classList.add("offline");
        mapContainer.appendChild(mapStatusDot);
        tileLayer.on('tileload', () => mapStatusDot.classList.replace("offline","online"));
        tileLayer.on('tileerror', () => mapStatusDot.classList.replace("online","offline"));
    }

    // GPS Marker
    let gpsMarker = null;
    let firstFix = true;

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            pos => {
                const { latitude, longitude } = pos.coords;
                if (!gpsMarker) {
                    gpsMarker = L.marker([latitude, longitude], {
                        icon: L.divIcon({
                            className: "gps-marker-wrapper",
                            html: `<div class="gps-marker"></div><div class="gps-marker-pulse"></div>`,
                            iconSize: [24,24],
                            iconAnchor: [12,12]
                        })
                    }).addTo(map);
                } else gpsMarker.setLatLng([latitude, longitude]);

                const el = gpsMarker.getElement();
                if (el) el.classList.remove("offline");

                if (firstFix) {
                    map.setView([latitude, longitude], map.getZoom());
                    firstFix = false;
                }
            },
            err => {
                if (gpsMarker) { const el = gpsMarker.getElement(); if(el) el.classList.add("offline"); }
                console.warn("GPS konnte nicht geladen werden:", err);
            },
            { enableHighAccuracy:true, maximumAge:0, timeout:15000 }
        );
    } else console.warn("Geolocation wird von diesem Gerät nicht unterstützt.");

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
            if (gpsMarker) {
                const pos = gpsMarker.getLatLng();
                map.flyTo([pos.lat, pos.lng], 17, { duration: 0.5 });
                showToast("Zur aktuellen Position");
            } else {
                showToast("GPS-Position nicht verfügbar", "error");
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

    } catch(err) {
        console.error("Map initialization error:", err);
        showToast("Fehler beim Laden der Karte", "error");
    }
}

// ==============================
// WEATHER
// ==============================
async function fetchLiveWeather() {
    const apiKey = "YLF2SPSJ98MKAFEXGKRQRSFBW";
    const LAT = 49.2, LON = 13.05;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${LAT},${LON}?unitGroup=metric&key=${apiKey}&include=current`;

    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error("Netzwerkfehler");
        const data = await response.json();

        // SVG Icons
        const thermometerSvg = `<svg class="widget-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>`;
        const windSvg = `<svg class="widget-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>`;
        const moonSvg = `<svg class="widget-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

        // Temperatur Widget
        const tempWidget = document.getElementById("widget-weather");
        if (tempWidget) {
            tempWidget.innerHTML = `
                <div class="widget-icon-container">${thermometerSvg}</div>
                <div class="widget-content">
                    <p class="widget-value">${data.currentConditions.temp.toFixed(0)}°C</p>
                    <p class="widget-label">Temperatur</p>
                </div>
            `;
        }
        
        // Wind Widget
        const windDirText = getWindDirection(data.currentConditions.winddir);
        const windWidget = document.getElementById("widget-wind");
        if (windWidget) {
            windWidget.innerHTML = `
                <div class="widget-icon-container">${windSvg}</div>
                <div class="widget-content">
                    <p class="widget-value">${windDirText}</p>
                    <p class="widget-label">${data.currentConditions.windspeed.toFixed(0)} km/h</p>
                </div>
            `;
        }
        
        // Mond Widget
        const phaseNum = data.currentConditions.moonphase;
        let moonPhaseName = "";
        if (phaseNum === 0) { moonPhaseName = "Neumond"; }
        else if (phaseNum < 0.25) { moonPhaseName = "Zunehmend"; }
        else if (phaseNum === 0.25) { moonPhaseName = "Erstes Viertel"; }
        else if (phaseNum < 0.5) { moonPhaseName = "Zunehmend"; }
        else if (phaseNum === 0.5) { moonPhaseName = "Vollmond"; }
        else if (phaseNum < 0.75) { moonPhaseName = "Abnehmend"; }
        else if (phaseNum === 0.75) { moonPhaseName = "Letztes Viertel"; }
        else { moonPhaseName = "Abnehmend"; }
        
        const moonWidget = document.getElementById("widget-moon");
        if (moonWidget) {
            moonWidget.innerHTML = `
                <div class="widget-icon-container">${moonSvg}</div>
                <div class="widget-content">
                    <p class="widget-value">${moonPhaseName}</p>
                    <p class="widget-label">Mondphase</p>
                </div>
            `;
        }
    } catch(err) {
        console.error("Wetter Fehler:", err);
        const errorSvg = `<svg class="widget-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        const errorHTML = `
            <div class="widget-icon-container">${errorSvg}</div>
            <div class="widget-content">
                <p class="widget-value">--</p>
                <p class="widget-label">Fehler</p>
            </div>
        `;
        const weatherWidget = document.getElementById("widget-weather");
        const windWidget = document.getElementById("widget-wind");
        const moonWidget = document.getElementById("widget-moon");
        if (weatherWidget) weatherWidget.innerHTML = errorHTML;
        if (windWidget) windWidget.innerHTML = errorHTML;
        if (moonWidget) moonWidget.innerHTML = errorHTML;
    }
}

function getWindDirection(deg) {
    const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirs[Math.floor((deg/22.5)+0.5)%16];
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
        navigator.serviceWorker.register("./service-worker.js").then(reg => {
            console.log("[SW] Service Worker registriert");
            
            // SOFORT nach Updates prüfen beim Laden
            reg.update().then(() => {
                console.log("[SW] Initialer Update-Check durchgeführt");
            }).catch(err => {
                console.log("[SW] Update-Check Fehler:", err);
            });
            
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
            
        }).catch(err => {
            console.error("[SW] Registrierung fehlgeschlagen:", err);
        });
        
        // Reload wenn neuer SW die Kontrolle übernimmt
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (refreshing) return;
            refreshing = true;
            console.log("[SW] Controller gewechselt - Seite wird neu geladen");
            window.location.reload();
        });
    });
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
    // iOS Bounce/Overscroll Fix
    try {
        preventIOSBounce();
        console.log("iOS Bounce Fix OK");
    } catch(e) {
        console.error("iOS Bounce Fix error:", e);
    }
    
    try {
        initNavigation();
        console.log("Navigation OK");
    } catch(e) {
        console.error("Navigation init error:", e);
    }
    
    try {
        initLogin();
        console.log("Login OK");
    } catch(e) {
        console.error("Login init error:", e);
    }
    
    try {
        initClock();
        console.log("Clock OK");
    } catch(e) {
        console.error("Clock init error:", e);
    }
    
    try {
        initSchonzeitWidget();
        console.log("Schonzeit Widget OK");
    } catch(e) {
        console.error("Schonzeit Widget init error:", e);
    }
    
    try {
        initAuthListener();
        console.log("Auth Listener OK");
    } catch(e) {
        console.error("Auth Listener init error:", e);
    }
    
    try {
        initInstallPrompt();
        console.log("Install Prompt OK");
    } catch(e) {
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
