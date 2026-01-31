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
// WEATHER
// ==============================
async function fetchLiveWeather() {
    const apiKey = "YLF2SPSJ98MKAFEXGKRQRSFBW";
    const LAT = 49.2, LON = 13.05;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${LAT},${LON}?unitGroup=metric&key=${apiKey}&include=current`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Netzwerkfehler: ${response.status}`);

        const data = await response.json();
        console.log("Wetter-Daten:", data); // zum Debuggen

        // Sicherheitshalber prüfen, ob currentConditions existiert
        const current = data.currentConditions;
        if (!current) throw new Error("Keine aktuellen Wetterdaten gefunden");

        // Temperatur & Luftfeuchtigkeit
        document.getElementById("widget-weather").innerHTML = `
            <h3>🌡 Wetter</h3>
            <p>Temperatur: ${current.temp?.toFixed(1) ?? "-"} °C</p>
            <p>Luftfeuchtigkeit: ${current.humidity ?? "-"} %</p>
        `;

        // Wind
        const windDirText = getWindDirection(current.winddir ?? 0);
        document.getElementById("widget-wind").innerHTML = `
            <h3>💨 Wind</h3>
            <p>Richtung: ${windDirText} (${current.winddir ?? "-"}°)</p>
            <p>Geschwindigkeit: ${current.windspeed ?? "-"} km/h</p>
        `;

        // Mondphase
        const phaseNum = current.moonphase ?? 0;
        let moonPhaseName = "";
        if (phaseNum === 0) moonPhaseName = "Neumond";
        else if (phaseNum < 0.25) moonPhaseName = "Zunehmender Sichelmond";
        else if (phaseNum === 0.25) moonPhaseName = "Erstes Viertel";
        else if (phaseNum < 0.5) moonPhaseName = "Zunehmender Mond";
        else if (phaseNum === 0.5) moonPhaseName = "Vollmond";
        else if (phaseNum < 0.75) moonPhaseName = "Abnehmender Mond";
        else if (phaseNum === 0.75) moonPhaseName = "Letztes Viertel";
        else moonPhaseName = "Abnehmender Sichelmond";

        document.getElementById("widget-moon").innerHTML = `
            <h3>🌙 Mondphase</h3>
            <p>Heute: ${moonPhaseName}</p>
        `;
    } catch (err) {
        console.error("Wetter Fehler:", err);

        // Fehlermeldung in die Widgets schreiben
        document.getElementById("widget-weather").innerHTML = "<p>Fehler beim Laden</p>";
        document.getElementById("widget-wind").innerHTML = "<p>Fehler beim Laden</p>";
        document.getElementById("widget-moon").innerHTML = "<p>Fehler beim Laden</p>";
    }
}

// Hilfsfunktion für Windrichtung
function getWindDirection(deg) {
    const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return dirs[Math.floor((deg / 22.5) + 0.5) % 16];
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
    document.getElementById('time').textContent = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    document.getElementById('date').textContent = now.getDate().toString().padStart(2, '0') + "." + (now.getMonth() + 1).toString().padStart(2, '0') + "." + now.getFullYear();
}
setInterval(updateClock, 1000);
updateClock();

// ==============================
// INITIALIZE APP
// ==============================
async function initializeApp() {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // --- Hochsitz-Panel Referenzen ---
    const hochsitzPanel = document.getElementById("hochsitz-panel");
    const panelContent = hochsitzPanel.querySelector(".panel-content");
    const fabListBtn = document.getElementById("fab-list-btn");

    // Klick auf Listen-Button → Panel auf/zu
    fabListBtn.addEventListener("click", () => {
        hochsitzPanel.classList.toggle("hidden");
    });

    // Firebase Collection für Hochsitze
    const hochsitzeCollection = db.collection("hochsitze");

    // Live laden
    hochsitzeCollection.onSnapshot(snapshot => {
    panelContent.innerHTML = ""; // erst leeren

    snapshot.docs.forEach(doc => {
        const data = doc.data();

        const li = document.createElement("div");
        li.className = "panel-entry";

        // HTML-Inhalt
        li.innerHTML = `
            <strong>${data.name || "Ohne Namen"}</strong>
            ${data.datum ? `<small>Datum: ${new Date(data.datum).toLocaleDateString()}</small>` : ""}
            ${data.bemerkung ? `<small>${data.bemerkung}</small>` : ""}
            ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.name}">` : ""}
        `;

        panelContent.appendChild(li);
    });
});



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

    if (fabBtn) {
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
                } catch (err) {
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
        formData.forEach((v, k) => entry[k] = v);
        try {
            await entriesCollection.add(entry);
            showToast("Eintrag gespeichert ✅");
            form.reset();
            subcategoryContainer.innerHTML = "";
            modal.classList.add("hidden");
        } catch (err) {
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
    tileLayer.on('tileload', () => mapStatusDot.classList.replace("offline", "online"));
    tileLayer.on('tileerror', () => mapStatusDot.classList.replace("online", "offline"));

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
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
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
                if (gpsMarker) { const el = gpsMarker.getElement(); if (el) el.classList.add("offline"); }
                console.warn("GPS konnte nicht geladen werden:", err);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
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

        const btn = L.DomUtil.create('button', 'hoch-sitz-btn');

        btn.innerHTML = '+';
        btn.title = 'Hochsitz hinzufügen';

        const normalStyle = `
        background: #2f2f2f;
        border: 1px solid rgba(255,255,255,0.25);
        color: white;
        font-size: 1.6rem;
        font-weight: bold;

        width: 40px;
        height: 40px;

        border-radius: 8px;
        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: center;

        box-shadow: 0 4px 12px rgba(0,0,0,0.6);
        transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;
    `;

        const activeStyle = `
        background: #3fa96b;
        border: 1px solid #3fa96b;
        color: white;

        box-shadow:
            0 0 0 2px rgba(63,169,107,0.4),
            0 6px 16px rgba(0,0,0,0.6);
    `;

        btn.style.cssText = normalStyle;

        // Hover nur wenn nicht aktiv
        btn.onmouseenter = () => {
            if (!settingHochsitz)
                btn.style.background = "#3f3f3f";
        };

        btn.onmouseleave = () => {
            if (!settingHochsitz)
                btn.style.background = "#2f2f2f";
        };

        // Klick → aktivieren
        L.DomEvent.on(btn, 'click', () => {

            settingHochsitz = !settingHochsitz;

            if (settingHochsitz) {
                btn.style.cssText = normalStyle + activeStyle;
                showToast("Klicke auf die Karte um eine Jagdeinrichtung zu setzen");
            } else {
                btn.style.cssText = normalStyle;
                showToast("Markieren abgebrochen");
            }
        });

        // Wenn Marker gesetzt wurde → wieder deaktivieren
        const originalSet = settingHochsitz;

        return btn;
    };

    markerButton.addTo(map);

    // ==========================
    // Hochsitz LISTEN Button (unter dem + Button)
    // ==========================

    const listButton = L.control({ position: 'topright' });

    listButton.onAdd = function () {

        const btn = L.DomUtil.create('button', 'hochsitz-list-btn');

        btn.innerHTML = '☰';
        btn.title = 'Hochsitze anzeigen';

        // GLEICHER STYLE wie Plus Button
        btn.style.cssText = `
        background: #2f2f2f;
        border: 1px solid rgba(255,255,255,0.25);
        color: white;
        font-size: 1.4rem;

        width: 40px;
        height: 40px;

        border-radius: 8px;
        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: center;

        margin-top: 6px; /* Abstand unter dem + Button */

        box-shadow: 0 4px 12px rgba(0,0,0,0.6);
        transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;
    `;

        // Hover Effekt
        btn.onmouseenter = () => btn.style.background = "#3f3f3f";
        btn.onmouseleave = () => btn.style.background = "#2f2f2f";

        //Der Klick für das öffnen des SidePannels
        L.DomEvent.on(btn, 'click', () => {
            const panel = document.getElementById("hochsitz-panel");

            panel.classList.remove("hidden");

            // kleiner Timeout damit Animation sauber läuft
            setTimeout(() => {
                panel.classList.add("open");
            }, 10);
        });


        return btn;
    };

    listButton.addTo(map);




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
                    icon: L.divIcon({
                        className: "hochsitz-emoji-marker",
                        html: "🪜",
                        iconSize: [30, 30],
                        iconAnchor: [15, 30]
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
            .addTo(map);

        // Marker setzen
        polygon.on('click', async e => {
            if (!settingHochsitz) return;

            const modal = document.getElementById("hochsitz-modal");
            const input = document.getElementById("hochsitz-name-input");
            modal.style.display = "block";
            input.value = "";
            input.focus();

            const saveBtn = document.getElementById("hochsitz-save-btn");
            const cancelBtn = document.getElementById("hochsitz-cancel-btn");

            const closeModal = () => {
                modal.style.display = "none";
            };

            saveBtn.onclick = async () => {
                const name = input.value.trim();
                if (!name) return alert("Bitte einen Namen eingeben");
                try {
                    await hochsitzeCollection.add({
                        lat: e.latlng.lat,
                        lng: e.latlng.lng,
                        name: name,
                        imageUrl: null
                    });
                    showToast("Hochsitz gesetzt ✅");
                } catch (err) {
                    console.error(err);
                    showToast("Fehler beim Setzen des Hochsitzes ⚠️", "error");
                }
                closeModal();
                settingHochsitz = false;

                // -------------------------------
                // Mini-Anpassung: Button zurücksetzen
                // -------------------------------
                const btn = document.querySelector('.hoch-sitz-btn');
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

                // -------------------------------
                // Mini-Anpassung: Button zurücksetzen
                // -------------------------------
                const btn = document.querySelector('.hoch-sitz-btn');
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
    //Schliesen des SidePannels
    const closePanelBtn = document.getElementById("close-hochsitz-panel");

    closePanelBtn.addEventListener("click", () => {
        const panel = document.getElementById("hochsitz-panel");

        panel.classList.remove("open");

        setTimeout(() => {
            panel.classList.add("hidden");
        }, 300);
    });


    // ==============================
    // SERVICE WORKER
    // ==============================
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
    }
}