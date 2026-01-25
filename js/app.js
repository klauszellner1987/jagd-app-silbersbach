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
        if(idx < val.length){
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
        if (typeof initializeMap === "function") initializeMap();
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
        if(btn.classList.contains("delete")){
            pinInput.value = pinInput.value.slice(0,-1);
        } else if(btn.classList.contains("ok")){
            checkPin();
        } else if(pinInput.value.length < 4){
            pinInput.value += btn.textContent.trim();
        }
        updatePinDisplay();
    });
});

// ------------------------------
// KEYBOARD SUPPORT
// ------------------------------
document.addEventListener("keydown", e => {
    if(!overlay || overlay.style.display === "none") return;
    if(e.key >= "0" && e.key <= "9" && pinInput.value.length < 4){
        pinInput.value += e.key;
    } else if(e.key === "Backspace"){
        pinInput.value = pinInput.value.slice(0,-1);
    } else if(e.key === "Enter"){
        checkPin();
    }
    updatePinDisplay();
});

// Initial PIN-Dots
updatePinDisplay();

// ==============================
// LOCKSCREEN CLOCK
// ==============================
function updateClock(){
    const now = new Date();
    const hours = now.getHours().toString().padStart(2,'0');
    const minutes = now.getMinutes().toString().padStart(2,'0');
    const day = now.getDate().toString().padStart(2,'0');
    const month = (now.getMonth()+1).toString().padStart(2,'0');
    const year = now.getFullYear();

    document.getElementById('time').textContent = `${hours}:${minutes}`;
    document.getElementById('date').textContent = `${day}.${month}.${year}`;
}
setInterval(updateClock, 1000);
updateClock();

// ==============================
// STRECKENLISTE & MODAL
// ==============================
const entryList = document.getElementById("entry-list");
const addBtn = document.getElementById("add-entry-btn");
const modal = document.getElementById("entry-modal");
const form = document.getElementById("entry-form");
const cancelBtn = document.getElementById("cancel-entry");
const wildSelect = document.getElementById("wildart");
const subcategoryContainer = document.getElementById("subcategory-container");

let entries = JSON.parse(localStorage.getItem("entries")) || [];
renderEntries();

// Open / Close Modal
addBtn.addEventListener("click", () => modal.classList.remove("hidden"));
cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    form.reset();
    subcategoryContainer.innerHTML = "";
});

// Wildart Unterkategorien
wildSelect.addEventListener("change", () => {
    const value = wildSelect.value;
    let html = "";
    switch(value){
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
form.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(form);
    const entry = {};
    formData.forEach((val,key) => entry[key]=val);
    entries.push(entry);
    localStorage.setItem("entries", JSON.stringify(entries));
    renderEntries();
    modal.classList.add("hidden");
    form.reset();
    subcategoryContainer.innerHTML = "";
});

// Render Entries
function renderEntries(){
    entryList.innerHTML="";
    entries.forEach((entry, idx)=>{
        const li = document.createElement("li");
        li.innerHTML = `${entry.erleger} - ${entry.wildart} ${entry.unterart || ""} (${entry.datum || ""}) - ${entry.bemerkung || ""} 
                        <button class="entry-delete-btn" data-idx="${idx}">Löschen</button>`;
        entryList.appendChild(li);
    });

    document.querySelectorAll(".entry-delete-btn").forEach(btn=>{
        btn.addEventListener("click", ()=>{
            const index = btn.dataset.idx;
            entries.splice(index,1);
            localStorage.setItem("entries", JSON.stringify(entries));
            renderEntries();
        });
    });
}

// ==============================
// INITIALIZE MAP (NACH LOGIN)
// ==============================
function initializeMap(){
    let map = L.map("map",{center:[49.180,13.065],zoom:15});
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{
        attribution:"Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and others",
        maxZoom:20
    }).addTo(map);

    reviere.forEach(r=>{
        L.polygon(r.coords,{color:r.color,fillColor:r.fillColor,fillOpacity:0.3}).addTo(map).bindPopup(r.name);
    });

    const mapStatusDot = document.createElement("span");
    mapStatusDot.classList.add("gps-dot");
    mapStatusDot.textContent = "Live Revier Map online";
    document.getElementById("map-container").insertBefore(mapStatusDot, document.getElementById("map"));

    map.on('tileerror', () => { mapStatusDot.style.background = 'red'; mapStatusDot.textContent = "Live Revier Map offline"; });
    map.on('tileload', () => { mapStatusDot.style.background = 'green'; mapStatusDot.textContent = "Live Revier Map online"; });

    let gpsMarkerWrapper = L.divIcon({
        className:"gps-marker-wrapper",
        html:`<div class="gps-marker"></div><div class="gps-marker-pulse"></div>`,
        iconSize:[24,24],
        iconAnchor:[12,12]
    });

    let gpsMarker = L.marker([49.180,13.065],{icon:gpsMarkerWrapper}).addTo(map);

    if(navigator.geolocation){
        navigator.geolocation.watchPosition(pos=>{
            const {latitude, longitude} = pos.coords;
            gpsMarker.setLatLng([latitude, longitude]);
            gpsMarker.getElement().classList.remove("offline");
        }, err => {
            gpsMarker.getElement().classList.add("offline");
        }, {enableHighAccuracy:true});
    } else gpsMarker.getElement().classList.add("offline");
}
