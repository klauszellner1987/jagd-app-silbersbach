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

        if (btn.dataset.tab === "revier" && window.mapInstance) {
            setTimeout(() => window.mapInstance.invalidateSize(), 200);
        }

        if (btn.dataset.tab === "wetter-tab") fetchLiveWeather();
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

function updatePinDisplay() {
    const dots = document.querySelectorAll("#pin-display span");
    const val = pinInput.value;
    dots.forEach((dot, idx) => dot.classList.toggle("active", idx < val.length));
}

function checkPin() {
    const enteredHash = CryptoJS.SHA256(pinInput.value).toString();
    if (enteredHash === correctPinHash) {
        overlay.style.display = "none";
        initializeApp();
    } else {
        pinError.classList.remove("hidden");
        pinInput.value = "";
        updatePinDisplay();
        setTimeout(() => pinError.classList.add("hidden"), 1500);
    }
}

pinButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("delete")) pinInput.value = pinInput.value.slice(0, -1);
        else if (btn.classList.contains("ok")) checkPin();
        else if (pinInput.value.length < 4) pinInput.value += btn.textContent.trim();
        updatePinDisplay();
    });
});

document.addEventListener("keydown", e => {
    if (!overlay || overlay.style.display === "none") return;
    if (e.key >= "0" && e.key <= "9" && pinInput.value.length < 4) pinInput.value += e.key;
    else if (e.key === "Backspace") pinInput.value = pinInput.value.slice(0, -1);
    else if (e.key === "Enter") checkPin();
    updatePinDisplay();
});
updatePinDisplay();

// ==============================
// CLOCK
// ==============================
function updateClock() {
    const now = new Date();
    document.getElementById('time').textContent = now.getHours().toString().padStart(2,'0') + ":" + now.getMinutes().toString().padStart(2,'0');
    document.getElementById('date').textContent = now.getDate().toString().padStart(2,'0') + "." + (now.getMonth()+1).toString().padStart(2,'0') + "." + now.getFullYear();
}
setInterval(updateClock, 1000);
updateClock();

// ==============================
// INITIALIZE APP
// ==============================
async function initializeApp() {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const entriesCollection = db.collection("entries");

    const entryList = document.getElementById("entry-list");
    const addBtn = document.getElementById("add-entry-btn");
    const modal = document.getElementById("entry-modal");
    const form = document.getElementById("entry-form");
    const cancelBtn = document.getElementById("cancel-entry");
    const wildSelect = document.getElementById("wildart");
    const subcategoryContainer = document.getElementById("subcategory-container");

    let entries = [];
    const fabBtn = document.getElementById("fab-add-btn");

    if(fabBtn){
       fabBtn.addEventListener("click", () => {
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

    initializeMap(db);
}

// ==============================
// MAP
// ==============================
function initializeMap(db) {
    const map = L.map("map", { center: [49.180, 13.065], zoom: 15 });
    window.mapInstance = map;

    const tileLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and others", maxZoom: 20 }
    ).addTo(map);

    const mapStatusDot = document.createElement("span");
    mapStatusDot.id = "map-status-dot";
    mapStatusDot.classList.add("offline");
    document.querySelector("#map-container h2").appendChild(mapStatusDot);
    tileLayer.on('tileload', () => mapStatusDot.classList.replace("offline","online"));
    tileLayer.on('tileerror', () => mapStatusDot.classList.replace("online","offline"));

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
    }

    tabButtons.forEach(btn => {
        if (btn.dataset.tab === "map-container") {
            btn.addEventListener("click", () => setTimeout(() => map.invalidateSize(), 200));
        }
    });

// ==========================
// HOCHSITZ BUTTON + MARKER HANDLER
// ==========================
let settingHochsitz = false;
const hochsitzeMarkers = {}; // Marker-Objekte zwischenspeichern

// Hochsitz-Button (oben rechts)
const markerButton = L.control({ position: 'topright' });
markerButton.onAdd = function () {
    const container = L.DomUtil.create('div', 'hoch-sitz-container');
    container.style.textAlign = "center";

    // Button selbst
    const btn = L.DomUtil.create('button', 'hoch-sitz-btn', container);
    btn.innerHTML = '+';
    btn.title = 'Hochsitz markieren';
    btn.style.cssText = `
        background: linear-gradient(135deg, #7CFF9B, #3DBE6A);
        border: none;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
        0 10px 25px rgba(0,0,0,0.35),
        0 0 18px rgba(124,255,155,0.8);
        padding: 0;
    `;

    // Label unter Button
    const label = L.DomUtil.create('div', '', container);
    label.textContent = "Hochsitz +";
    label.style.fontSize = "0.75rem";
    label.style.marginTop = "4px";
    label.style.color = "#ffffff";
    label.style.fontWeight = "bold";

    L.DomEvent.on(btn, 'click', () => {
        settingHochsitz = true;
        showToast("Klicke auf die Karte, um eine Hochsitz hinzuzufügen");
    });

    return container;
};
markerButton.addTo(map);

// ==========================
// Firebase Marker laden und verwalten
// ==========================
const hochsitzeCollection = db.collection("hochsitze");

hochsitzeCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const data = change.doc.data();
        const id = change.doc.id;

        // vorhandenen Marker löschen
        if (hochsitzeMarkers[id]) {
            map.removeLayer(hochsitzeMarkers[id]);
            delete hochsitzeMarkers[id];
        }

        if (change.type === "added" || change.type === "modified") {
            const marker = L.marker([data.lat, data.lng], {
                icon: L.icon({
                    iconUrl: 'assets/icons/hoch_sitz.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32]
                })
            }).addTo(map);

            let popupContent = `<div style="text-align:center;">
                <strong>${data.name || ''}</strong><br>
                ${data.imageUrl ? `<img src="${data.imageUrl}" style="width:120px;border-radius:8px;margin-bottom:5px;">` : ''}
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
// Polygon Klick → Marker setzen mit Prompt
// ==========================
reviere.forEach(r => {
    const polygon = L.polygon(r.coords, { color: r.color, fillColor: r.fillColor, fillOpacity: 0.3 })
        .addTo(map)
        .bindPopup(r.name);

polygon.on('click', async e => {
    if (!settingHochsitz) return;

    const modal = document.getElementById('hochsitz-modal');
    const input = document.getElementById('hochsitz-name-input');
    const saveBtn = document.getElementById('hochsitz-save-btn');
    const cancelBtn = document.getElementById('hochsitz-cancel-btn');

    modal.classList.remove('hidden');
    input.value = '';
    input.focus();

    const cleanup = () => {
        modal.classList.add('hidden');
        saveBtn.onclick = null;
        cancelBtn.onclick = null;
    };

    saveBtn.onclick = async () => {
        const name = input.value.trim();
        if (!name) return alert("Bitte einen Namen eingeben!");
        try {
            await hochsitzeCollection.add({
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                name: name,
                imageUrl: null
            });
            showToast(`Hochsitz "${name}" gesetzt ✅`);
            cleanup();
            settingHochsitz = false;
        } catch(err) {
            console.error(err);
            showToast("Fehler beim Setzen des Hochsitzes ⚠️", "error");
        }
    };

    cancelBtn.onclick = () => {
        cleanup();
        settingHochsitz = false;
    };
});
});

// ==========================
// Bild hochladen / Marker löschen
// ==========================
document.addEventListener('click', async (evt) => {
    const target = evt.target;
    const id = target.dataset.id;
    if (!id) return;
    const docRef = hochsitzeCollection.doc(id);

    if (target.classList.contains('add-photo-btn')) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.click();
        fileInput.onchange = async () => {
            const file = fileInput.files[0];
            if (!file) return;
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(`hochsitze/${id}_${file.name}`);
            await fileRef.put(file);
            const url = await fileRef.getDownloadURL();
            await docRef.update({ imageUrl: url });
            showToast("Bild hochgeladen ✅");
        };
    }

    if (target.classList.contains('delete-marker-btn')) {
        if (confirm("Hochsitz wirklich löschen?")) {
            await docRef.delete();
            showToast("Hochsitz gelöscht 🗑️");
        }
    }
});


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

        document.getElementById("widget-weather").innerHTML = `
            <h3>🌡 Wetter</h3>
            <p>Temperatur: ${data.currentConditions.temp.toFixed(1)} °C</p>
            <p>Luftfeuchtigkeit: ${data.currentConditions.humidity} %</p>
        `;
        const windDirText = getWindDirection(data.currentConditions.winddir);
        document.getElementById("widget-wind").innerHTML = `
            <h3>💨 Wind</h3>
            <p>Richtung: ${windDirText} (${data.currentConditions.winddir}°)</p>
            <p>Geschwindigkeit: ${data.currentConditions.windspeed} km/h</p>
        `;
        const phaseNum = data.currentConditions.moonphase;
        let moonPhaseName = "";
        if (phaseNum === 0) moonPhaseName = "Neumond";
        else if (phaseNum <0.25) moonPhaseName = "Zunehmender Sichelmond";
        else if (phaseNum ===0.25) moonPhaseName = "Erstes Viertel";
        else if (phaseNum <0.5) moonPhaseName = "Zunehmender Mond";
        else if (phaseNum ===0.5) moonPhaseName = "Vollmond";
        else if (phaseNum <0.75) moonPhaseName = "Abnehmender Mond";
        else if (phaseNum ===0.75) moonPhaseName = "Letztes Viertel";
        else moonPhaseName = "Abnehmender Sichelmond";
        document.getElementById("widget-moon").innerHTML = `<h3>🌙 Mondphase</h3><p>Heute: ${moonPhaseName}</p>`;
    } catch(err) {
        console.error("Wetter Fehler:", err);
        document.getElementById("widget-weather").innerHTML = "<p>Fehler beim Laden</p>";
        document.getElementById("widget-wind").innerHTML = "<p>Fehler beim Laden</p>";
        document.getElementById("widget-moon").innerHTML = "<p>Fehler beim Laden</p>";
    }
}

function getWindDirection(deg) {
    const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirs[Math.floor((deg/22.5)+0.5)%16];
}

// ==============================
// SERVICE WORKER
// ==============================
if("serviceWorker" in navigator){
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}
}