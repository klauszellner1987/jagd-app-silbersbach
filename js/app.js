let map;
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
// TAB SWITCHING
// ==============================
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");

        // 🔧 Leaflet Fix bei Rückkehr zur Map
        if (btn.dataset.tab === "revier" && map) {
            setTimeout(() => {
                map.invalidateSize();
            }, 200);
        }
    });
});

// ==============================
// LOCKSCREEN / LOGIN
// ==============================
const pinInput = document.getElementById("pin-input");
const pinDisplay = document.getElementById("pin-display");
const pinButtons = document.querySelectorAll(".pin-btn");
const overlay = document.getElementById("login-overlay");
const pinError = document.getElementById("pin-error");
const correctPinHash = CryptoJS.SHA256("1939").toString();

// ------------------------------
// PIN DISPLAY UPDATE
// ------------------------------
function updatePinDisplay() {
    const dots = document.querySelectorAll("#pin-display span");
    const val = pinInput.value;

    dots.forEach((dot, idx) => {
        if (idx < val.length) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

// ------------------------------
// PIN CHECK
// ------------------------------
function checkPin() {
    const enteredHash = CryptoJS.SHA256(pinInput.value).toString();

    if (enteredHash === correctPinHash) {
        overlay.style.display = "none";
        initializeApp(); // Firebase, Map und Firestore starten
    } else {
        pinError.classList.remove("hidden");
        pinInput.value = "";
        updatePinDisplay();
        setTimeout(() => pinError.classList.add("hidden"), 1500);
    }
}

// ------------------------------
// PIN BUTTONS
// ------------------------------
pinButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("delete")) {
            pinInput.value = pinInput.value.slice(0, -1);
        } else if (btn.classList.contains("ok")) {
            checkPin();
        } else if (pinInput.value.length < 4) {
            pinInput.value += btn.textContent.trim();
        }
        updatePinDisplay();
    });
});

// ------------------------------
// KEYBOARD SUPPORT
// ------------------------------
document.addEventListener("keydown", e => {
    if (!overlay || overlay.style.display === "none") return;
    if (e.key >= "0" && e.key <= "9" && pinInput.value.length < 4) {
        pinInput.value += e.key;
    } else if (e.key === "Backspace") {
        pinInput.value = pinInput.value.slice(0, -1);
    } else if (e.key === "Enter") {
        checkPin();
    }
    updatePinDisplay();
});

// Initial PIN-Dots
updatePinDisplay();

// ==============================
// LOCKSCREEN CLOCK
// ==============================
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    document.getElementById('time').textContent = `${hours}:${minutes}`;
    document.getElementById('date').textContent = `${day}.${month}.${year}`;
}
setInterval(updateClock, 1000);
updateClock();


// ==============================
// INITIALIZE APP (NACH LOGIN)
// ==============================
async function initializeApp() {
    // -------- Firebase Initialisierung --------
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const entriesCollection = db.collection("entries");

    // -------- STRECKENLISTE & MODAL --------
    const entryList = document.getElementById("entry-list");
    const addBtn = document.getElementById("add-entry-btn");
    const modal = document.getElementById("entry-modal");
    const form = document.getElementById("entry-form");
    const cancelBtn = document.getElementById("cancel-entry");
    const wildSelect = document.getElementById("wildart");
    const subcategoryContainer = document.getElementById("subcategory-container");

    let entries = [];

    // Firestore Realtime Listener
    entriesCollection.orderBy("datum", "desc")
        .onSnapshot(snapshot => {
            entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderEntries();
        });

    // Render Entries
    function renderEntries() {
        entryList.innerHTML = "";
        entries.forEach((entry, idx) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${entry.erleger} - ${entry.wildart} ${entry.unterart || ""} (${entry.datum || ""}) - ${entry.bemerkung || ""} 
                <button class="entry-delete-btn" data-idx="${idx}">Löschen</button>
            `;
            entryList.appendChild(li);
        });
        attachDeleteEvents();
    }

    function attachDeleteEvents() {
        document.querySelectorAll(".entry-delete-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const index = btn.dataset.idx;
                const entry = entries[index];
                if (!entry.id) return;
                try {
                    await entriesCollection.doc(entry.id).delete();
                } catch (err) {
                    console.error("Fehler beim Löschen:", err);
                    alert("Eintrag konnte nicht gelöscht werden.");
                }
            });
        });
    }

    // Modal Open / Close
    addBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        form.reset();
        subcategoryContainer.innerHTML = "";
    });

    // Unterkategorien
    wildSelect.addEventListener("change", () => {
        const value = wildSelect.value;
        let html = "";
        switch (value) {
            case "Rehwild":
                html = `<label>Unterart
                            <select name="unterart">
                                <option>Geiß</option>
                                <option>Bock</option>
                                <option>Kitz</option>
                                <option>Schmal</option>
                            </select>
                        </label>`;
                break;
            case "Rotwild":
            case "Dammwild":
                html = `<label>Unterart
                            <select name="unterart">
                                <option>Hirsch</option>
                                <option>Alttier</option>
                                <option>Schmaltier</option>
                                <option>Spießer</option>
                            </select>
                        </label>`;
                break;
            case "Schwarzwild":
                html = `<label>Unterart
                            <select name="unterart">
                                <option>Keiler</option>
                                <option>Bache</option>
                                <option>Frischling</option>
                                <option>Überläufer</option>
                            </select>
                        </label>`;
                break;
            case "Raubwild":
            case "Federwild":
                html = `<label>Bemerkung/Freitext
                            <input type="text" name="unterart">
                        </label>`;
                break;
            default:
                html = "";
        }
        subcategoryContainer.innerHTML = html;
    });

    // Submit Entry
    form.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(form);
        const entry = {};
        formData.forEach((val, key) => entry[key] = val);
        try {
            await entriesCollection.add(entry);
            form.reset();
            subcategoryContainer.innerHTML = "";
            modal.classList.add("hidden");
        } catch (err) {
            console.error("Fehler beim Speichern:", err);
            alert("Eintrag konnte nicht gespeichert werden.");
        }
    });
let map;
    // -------- INITIALIZE MAP --------
    initializeMap();
}

// ==============================
// MAP FUNCTION
// ==============================
function initializeMap() {
    map = L.map("map", { center: [49.180, 13.065], zoom: 15 });
    const tileLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and others", maxZoom: 20 }
    ).addTo(map);

    // Polygone
    reviere.forEach(r => {
        L.polygon(r.coords, { color: r.color, fillColor: r.fillColor, fillOpacity: 0.3 })
            .addTo(map)
            .bindPopup(r.name);
    });

    // Statusdot
    const mapStatusDot = document.createElement("span");
    mapStatusDot.id = "map-status-dot";
    mapStatusDot.classList.add("offline");
    document.querySelector("#map-container h2").appendChild(mapStatusDot);

    tileLayer.on('tileload', () => { mapStatusDot.classList.replace("offline", "online"); });
    tileLayer.on('tileerror', () => { mapStatusDot.classList.replace("online", "offline"); });

    // GPS Marker
    let gpsMarkerWrapper = L.divIcon({
        className: "gps-marker-wrapper",
        html: `<div class="gps-marker"></div><div class="gps-marker-pulse"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    let gpsMarker = L.marker([49.180, 13.065], { icon: gpsMarkerWrapper }).addTo(map);

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            pos => {
                const { latitude, longitude } = pos.coords;
                gpsMarker.setLatLng([latitude, longitude]);
                gpsMarker.getElement().classList.remove("offline");
            },
            err => { gpsMarker.getElement().classList.add("offline"); },
            { enableHighAccuracy: true }
        );
    } else gpsMarker.getElement().classList.add("offline");
}

// ==============================
// WEATHER
// ==============================
async function fetchLiveWeather() {
    const apiKey = "YLF2SPSJ98MKAFEXGKRQRSFBW";
    const LAT = 49.2;
    const LON = 13.05;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${LAT},${LON}?unitGroup=metric&key=${apiKey}&include=current`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Netzwerkfehler");
        const data = await response.json();

        document.getElementById("widget-weather").innerHTML = `
            <h3>🌡 Wetter</h3>
            <p>Temperatur: ${data.currentConditions.temp.toFixed(1)} °C</p>
            <p>Luftfeuchtigkeit: ${data.currentConditions.humidity} %</p>
        `;
        const windDirDegrees = data.currentConditions.winddir;
        const windDirText = getWindDirection(windDirDegrees);

        document.getElementById("widget-wind").innerHTML = `
            <h3>💨 Wind</h3>
            <p>Richtung: ${windDirText} (${windDirDegrees}°)</p>
            <p>Geschwindigkeit: ${data.currentConditions.windspeed} km/h</p>
        `;

        const phaseNum = data.currentConditions.moonphase;
        let moonPhaseName = "";
        if (phaseNum === 0) moonPhaseName = "Neumond";
        else if (phaseNum > 0 && phaseNum < 0.25) moonPhaseName = "Zunehmender Sichelmond";
        else if (phaseNum === 0.25) moonPhaseName = "Erstes Viertel";
        else if (phaseNum > 0.25 && phaseNum < 0.5) moonPhaseName = "Zunehmender Mond";
        else if (phaseNum === 0.5) moonPhaseName = "Vollmond";
        else if (phaseNum > 0.5 && phaseNum < 0.75) moonPhaseName = "Abnehmender Mond";
        else if (phaseNum === 0.75) moonPhaseName = "Letztes Viertel";
        else moonPhaseName = "Abnehmender Sichelmond";

        document.getElementById("widget-moon").innerHTML = `<h3>🌙 Mondphase</h3><p>Heute: ${moonPhaseName}</p>`;
    } catch (err) {
        console.error("Wetterdaten Fehler:", err);
        document.getElementById("widget-weather").innerHTML = "<p>Fehler beim Laden der Wetterdaten</p>";
        document.getElementById("widget-wind").innerHTML = "<p>Fehler beim Laden der Winddaten</p>";
        document.getElementById("widget-moon").innerHTML = "<p>Fehler bei Mondphase</p>";
    }
}

document.querySelector('[data-tab="wetter-tab"]').addEventListener("click", fetchLiveWeather);

function getWindDirection(degrees) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.floor((degrees / 22.5) + 0.5) % 16;
    return directions[index];
}

// ==============================
// SERVICE WORKER
// ==============================
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(reg => console.log("Service Worker registriert:", reg.scope))
            .catch(err => console.error("Service Worker Fehler:", err));
    });
}
