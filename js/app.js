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
    {
        id: "rotwild",
        name: "Rotwild",
        jagdzeitStart: "01.08",
        jagdzeitEnde: "31.01",
        iconClass: "ti ti-deer"
    },
    {
        id: "rehbock",
        name: "Rehwild Böcke",
        jagdzeitStart: "01.05",
        jagdzeitEnde: "15.10",
        iconClass: "ti ti-deer"
    },
    {
        id: "rehwild-schmalreh",
        name: "Rehwild Schmalrehe",
        jagdzeitStart: "01.05",
        jagdzeitEnde: "15.01",
        iconClass: "ti ti-deer"
    },
    {
        id: "rehwild-geiss-kitz",
        name: "Rehwild Geißen/Kitze",
        jagdzeitStart: "01.09",
        jagdzeitEnde: "15.01",
        iconClass: "ti ti-deer"
    },
    {
        id: "schwarzwild",
        name: "Schwarzwild",
        jagdzeitStart: "01.01",
        jagdzeitEnde: "31.12",
        ganzjaehrig: true,
        iconClass: "ti ti-pig"
    },
    {
        id: "feldhase",
        name: "Feldhase",
        jagdzeitStart: "01.10",
        jagdzeitEnde: "31.12",
        iconClass: "ti ti-paw"
    },
    {
        id: "rotfuchs",
        name: "Rotfuchs",
        jagdzeitStart: "01.01",
        jagdzeitEnde: "31.12",
        ganzjaehrig: true,
        iconClass: "ti ti-paw"
    },
    {
        id: "dachs",
        name: "Dachs",
        jagdzeitStart: "01.08",
        jagdzeitEnde: "31.10",
        iconClass: "ti ti-paw"
    },
    {
        id: "wildente",
        name: "Wildenten",
        jagdzeitStart: "01.09",
        jagdzeitEnde: "15.01",
        iconClass: "ti ti-feather"
    },
    {
        id: "wildgans",
        name: "Wildgänse",
        jagdzeitStart: "01.08",
        jagdzeitEnde: "15.01",
        iconClass: "ti ti-feather"
    },
    {
        id: "fasan",
        name: "Fasane (Hähne)",
        jagdzeitStart: "01.10",
        jagdzeitEnde: "15.01",
        iconClass: "ti ti-feather"
    }
];

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
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
    // Filtere Wildarten die aktuell Schonzeit haben (nicht ganzjährig bejagbar)
    return jagdzeitenBayern.filter(w => istSchonzeit(w));
}

function updateSchonzeitWidget() {
    const iconContainer = document.getElementById('schonzeit-icon');
    const wildartEl = document.getElementById('schonzeit-wildart');
    const datumEl = document.getElementById('schonzeit-datum');
    const indicatorEl = document.getElementById('schonzeit-indicator');
    const statusTextEl = document.getElementById('schonzeit-status-text');
    
    if (!iconContainer || !wildartEl || !datumEl) return;
    
    const schonzeitWildarten = getWildartenMitSchonzeit();
    
    if (schonzeitWildarten.length === 0) {
        // Keine Wildart hat aktuell Schonzeit
        iconContainer.innerHTML = `<i class="ti ti-circle-check"></i>`;
        wildartEl.textContent = "Keine aktiven Schonzeiten";
        datumEl.textContent = "Alle Wildarten sind aktuell bejagbar";
        indicatorEl.className = "schonzeit-indicator open";
        statusTextEl.textContent = "Jagdzeit";
        return;
    }
    
    // Rotiere durch Wildarten mit Schonzeit
    const wildart = schonzeitWildarten[schonzeitIndex % schonzeitWildarten.length];
    
    iconContainer.innerHTML = `<i class="${wildart.iconClass}"></i>`;
    wildartEl.textContent = wildart.name;
    datumEl.textContent = getSchonzeitDatum(wildart);
    indicatorEl.className = "schonzeit-indicator closed";
    statusTextEl.textContent = "Schonzeit";
    
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
        if (wildart.ganzjaehrig) {
            zeitInfo = 'Ganzjährig bejagbar';
        } else {
            zeitInfo = `${wildart.jagdzeitStart} - ${wildart.jagdzeitEnde}`;
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
                entry.className = "panel-entry";
                entry.innerHTML = `
                    <strong>${data.name || "Ohne Namen"}</strong>
                    ${data.datum ? `<small>Datum: ${new Date(data.datum).toLocaleDateString()}</small>` : ""}
                    ${data.bemerkung ? `<small>${data.bemerkung}</small>` : ""}
                    ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.name}">` : ""}
                `;
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
            li.className = "flex items-center justify-between rounded-xl backdrop-blur-sm bg-white/10 border border-white/10 px-4 py-3 shadow-glass transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:border-white/20 hover:shadow-glass-lg animate-slide-in";
            li.style.animationDelay = `${idx * 0.05}s`;

            const text = document.createElement("span");
            text.className = "flex items-center gap-3 text-[var(--text)] font-medium";
            text.innerHTML = `<span class="text-2xl">🦌</span>
                <span>${entry.erleger} - ${entry.wildart} ${entry.unterart || ""} (${entry.datum || ""}) ${entry.bemerkung ? `- ${entry.bemerkung}` : ""}</span>`;

            const btn = document.createElement("button");
            btn.className = "rounded-lg backdrop-blur-sm bg-red-500/80 border border-red-400/30 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-600 hover:scale-105 hover:shadow-lg active:scale-95";
            btn.dataset.idx = idx;
            btn.textContent = "Löschen";

            li.appendChild(text);
            li.appendChild(btn);
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
                    showToast("Eintrag gelöscht 🗑️");
                } catch(err) {
                    console.error(err);
                    showToast("Fehler beim Löschen ⚠️", "error");
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
            showToast("Eintrag gespeichert ✅");
            form.reset();
            subcategoryContainer.innerHTML = "";
            modal.classList.add("hidden");
        } catch(err) {
            console.error(err);
            showToast("Fehler beim Speichern ⚠️", "error");
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
    const hochsitzeMarkers = {};
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
            input.focus();

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
                    showToast("Hochsitz gesetzt ✅");
                } catch (err) {
                    console.error(err);
                    showToast("Fehler beim Setzen des Hochsitzes ⚠️", "error");
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
    // Firebase Marker laden und verwalten
    // ==========================
    hochsitzeCollection.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const data = change.doc.data();
            const id = change.doc.id;

            if (hochsitzeMarkers[id]) {
                map.removeLayer(hochsitzeMarkers[id]);
                delete hochsitzeMarkers[id];
            }

            if (change.type === "added" || change.type === "modified") {
                const marker = L.marker([data.lat, data.lng], {
                    icon: L.divIcon({
                        className: "hochsitz-emoji-marker",
                        html: "🪜",
                        iconSize: [30, 30],
                        iconAnchor: [15, 30]
                    })
                }).addTo(map);

                const popupContent = `<div style="text-align:center;">
                    <strong>${data.name || ""}</strong><br>
                    ${data.imageUrl ? `<img src="${data.imageUrl}" style="width:120px;border-radius:8px;margin-bottom:5px;">` : ""}
                    <br>
                    <button class="add-photo-btn" data-id="${id}">Bild hinzufügen</button>
                    <button class="delete-marker-btn" data-id="${id}" style="margin-top:5px;background:#e74c3c;color:white;padding:4px 8px;border:none;border-radius:6px;cursor:pointer;">Löschen</button>
                </div>`;
                marker.bindPopup(popupContent);
                hochsitzeMarkers[id] = marker;
            }

            if (change.type === "removed" && hochsitzeMarkers[id]) {
                map.removeLayer(hochsitzeMarkers[id]);
                delete hochsitzeMarkers[id];
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
                    showToast("Bild hochgeladen ✅");
                };
            } catch (err) {
                console.error(err);
                showToast("Fehler beim Upload ⚠️", "error");
            }
        }

        if (target.classList.contains("delete-marker-btn")) {
            if (confirm("Hochsitz wirklich löschen?")) {
                await docRef.delete();
                showToast("Hochsitz gelöscht 🗑️");
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
// SERVICE WORKER
// ==============================
if("serviceWorker" in navigator){
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}

// ==============================
// MAIN INITIALIZATION
// ==============================
function initAll() {
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
