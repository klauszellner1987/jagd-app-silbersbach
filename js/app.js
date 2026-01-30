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

        if (btn.dataset.tab === "map-container" && window.mapInstance) {
            setTimeout(() => {
                window.mapInstance.invalidateSize();
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

function updatePinDisplay() {
    const dots = document.querySelectorAll("#pin-display span");
    const val = pinInput.value;

    dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx < val.length);
    });
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

updatePinDisplay();


// ==============================
// CLOCK
// ==============================
function updateClock() {
    const now = new Date();
    document.getElementById('time').textContent =
        now.getHours().toString().padStart(2, '0') + ":" +
        now.getMinutes().toString().padStart(2, '0');

    document.getElementById('date').textContent =
        now.getDate().toString().padStart(2, '0') + "." +
        (now.getMonth() + 1).toString().padStart(2, '0') + "." +
        now.getFullYear();
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

        if (value === "Rehwild") {
            html = `<label>Unterart<select name="unterart">
                <option>Geiß</option><option>Bock</option>
                <option>Kitz</option><option>Schmal</option>
            </select></label>`;
        }

        if (value === "Rotwild" || value === "Dammwild") {
            html = `<label>Unterart<select name="unterart">
                <option>Hirsch</option><option>Alttier</option>
                <option>Schmaltier</option><option>Spießer</option>
            </select></label>`;
        }

        if (value === "Schwarzwild") {
            html = `<label>Unterart<select name="unterart">
                <option>Keiler</option><option>Bache</option>
                <option>Frischling</option><option>Überläufer</option>
            </select></label>`;
        }

        if (value === "Raubwild" || value === "Federwild") {
            html = `<label>Bemerkung<input type="text" name="unterart"></label>`;
        }

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

    initializeMap();
}


// ==============================
// MAP (FIXED)
// ==============================
function initializeMap() {
    // -------- Map erstellen --------
    const map = L.map("map", { 
        center: [49.180, 13.065], 
        zoom: 15 
    });

    window.mapInstance = map; // global für Tab-Wechsel

    // -------- TileLayer hinzufügen --------
    const tileLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
            attribution: "Tiles © Esri",
            maxZoom: 20
        }
    ).addTo(map);

    // -------- Polygone hinzufügen --------
    reviere.forEach(r => {
        L.polygon(r.coords, { color: r.color, fillColor: r.fillColor, fillOpacity: 0.3 })
            .addTo(map)
            .bindPopup(r.name);
    });

    // -------- Status-Dot --------
    const mapStatusDot = document.createElement("span");
    mapStatusDot.id = "map-status-dot";
    mapStatusDot.classList.add("offline"); // Standard = rot
    document.querySelector("#map-container h2").appendChild(mapStatusDot);

    tileLayer.on('tileload', () => { mapStatusDot.classList.replace("offline", "online"); });
    tileLayer.on('tileerror', () => { mapStatusDot.classList.replace("online", "offline"); });

    // -------- GPS Marker (animiert) --------
    const gpsMarkerWrapper = L.divIcon({
        className: "gps-marker-wrapper",
        html: `<div class="gps-marker"></div><div class="gps-marker-pulse"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    const gpsMarker = L.marker([49.180, 13.065], { icon: gpsMarkerWrapper }).addTo(map);

    // -------- GPS Tracking --------
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            pos => {
                const { latitude, longitude } = pos.coords;
                gpsMarker.setLatLng([latitude, longitude]);
                gpsMarker.getElement()?.classList.remove("offline");
            },
            () => { gpsMarker.getElement()?.classList.add("offline"); },
            { enableHighAccuracy: true }
        );
    } else {
        gpsMarker.getElement()?.classList.add("offline");
    }
}



// ==============================
// SERVICE WORKER
// ==============================
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js");
    });
}
