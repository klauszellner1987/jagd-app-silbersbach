const De="silbersbach";function O(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[userRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("users")}function oe(){return window.firebase.firestore.FieldValue}const k={TENANT_ID:De,async upsertPresence(e,t){if(!(!e||!e.uid))try{await O().doc(e.uid).set({uid:e.uid,displayName:e.displayName||"Unbekannter Jäger",photoURL:e.photoURL||"",isOnline:t,lastSeen:oe().serverTimestamp()},{merge:!0})}catch(n){console.warn("[userRepo] upsertPresence fehlgeschlagen:",n?.code||n?.message)}},upsertPresenceSync(e){if(e)try{O().doc(e).set({isOnline:!1,lastSeen:oe().serverTimestamp()},{merge:!0})}catch{}},streamAll(e,t){return O().limit(50).onSnapshot(n=>{const r=n.docs.map(i=>i.data());try{e(r)}catch(i){console.error("[userRepo] streamAll callback error:",i)}},n=>{console.error("[userRepo] Firestore Snapshot Error:",n),typeof t=="function"&&t(n)})}},Ae=3e4,$e=9e4,Me=3e4;function V(e){if(!e||!e.isOnline)return!1;const t=e.lastSeen&&typeof e.lastSeen.toDate=="function"?e.lastSeen.toDate():null;return t?Date.now()-t.getTime()<$e:!1}function ze(e){const n=Math.floor((new Date-e)/1e3);return n<60?"Gerade eben":n<3600?`Vor ${Math.floor(n/60)} Min.`:n<86400?`Vor ${Math.floor(n/3600)} Std.`:e.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}function se(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const c={user:null,heartbeatTimer:null,visibilityHandler:null,beforeUnloadHandler:null,capacitorAppListener:null,capacitorPauseListener:null,capacitorResumeListener:null,rendererTimer:null,snapshotUnsub:null,lastSnapshotDocs:[],listenersAttached:!1};function _(e){c.heartbeatTimer||(k.upsertPresence(e,!0),c.heartbeatTimer=setInterval(()=>{typeof document<"u"&&document.visibilityState==="visible"&&k.upsertPresence(e,!0)},Ae))}function R(){c.heartbeatTimer&&(clearInterval(c.heartbeatTimer),c.heartbeatTimer=null)}function He(){if(!(typeof window<"u"&&window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.App))return;const{App:e}=window.Capacitor.Plugins;e.addListener("appStateChange",({isActive:t})=>{c.user&&(t?_(c.user):(R(),k.upsertPresence(c.user,!1)))}).then(t=>{c.capacitorAppListener=t}).catch(()=>{}),e.addListener("pause",()=>{c.user&&(R(),k.upsertPresence(c.user,!1))}).then(t=>{c.capacitorPauseListener=t}).catch(()=>{}),e.addListener("resume",()=>{c.user&&_(c.user)}).then(t=>{c.capacitorResumeListener=t}).catch(()=>{})}function Fe(){[c.capacitorAppListener,c.capacitorPauseListener,c.capacitorResumeListener].forEach(e=>{if(e&&typeof e.remove=="function")try{e.remove()}catch{}}),c.capacitorAppListener=null,c.capacitorPauseListener=null,c.capacitorResumeListener=null}function K(e){const t=document.getElementById("online-users-list"),n=document.getElementById("online-count");if(!t||!n)return;let r=0;const o=e.slice().sort((s,a)=>{const l=V(s)?1:0,u=V(a)?1:0;if(l!==u)return u-l;const d=s.lastSeen&&typeof s.lastSeen.toDate=="function"?s.lastSeen.toDate().getTime():0;return(a.lastSeen&&typeof a.lastSeen.toDate=="function"?a.lastSeen.toDate().getTime():0)-d}).map(s=>{const a=V(s);a&&r++;const l=s.lastSeen&&typeof s.lastSeen.toDate=="function"?s.lastSeen.toDate():null,u=l?ze(l):"Unbekannt",d=a?"online":"offline",g=se(s.displayName||"Unbekannter Jäger");return`
            <div class="user-status-item">
                <div class="user-status-avatar">
                    ${s.photoURL?`<img src="${se(s.photoURL)}" alt="">`:'<div class="user-status-avatar-placeholder"><i class="ti ti-user"></i></div>'}
                    <div class="status-dot ${d}"></div>
                </div>
                <div class="user-status-info">
                    <span class="user-status-name">${g}</span>
                    <span class="user-status-lastseen">${a?"Jetzt aktiv":u}</span>
                </div>
            </div>
        `}).join("");t.innerHTML=o||'<div class="dropdown-loading">Keine Mitglieder gefunden</div>',n.textContent=r}const Ne={onLogin(e){this.onLogout(),c.user=e,_(e),c.visibilityHandler=()=>{c.user&&(document.visibilityState==="visible"?_(c.user):(R(),k.upsertPresence(c.user,!1)))},document.addEventListener("visibilitychange",c.visibilityHandler),c.beforeUnloadHandler=()=>{k.upsertPresenceSync(e.uid)},window.addEventListener("beforeunload",c.beforeUnloadHandler),He()},onLogout(){R(),c.visibilityHandler&&(document.removeEventListener("visibilitychange",c.visibilityHandler),c.visibilityHandler=null),c.beforeUnloadHandler&&(window.removeEventListener("beforeunload",c.beforeUnloadHandler),c.beforeUnloadHandler=null),Fe(),c.user=null},initUI(){const e=document.getElementById("profile-trigger"),t=document.getElementById("online-users-dropdown");!e||!t||c.listenersAttached||(c.listenersAttached=!0,e.addEventListener("click",n=>{n.stopPropagation(),t.classList.toggle("hidden")}),document.addEventListener("click",n=>{!t.contains(n.target)&&!e.contains(n.target)&&t.classList.add("hidden")}),c.snapshotUnsub=k.streamAll(n=>{c.lastSnapshotDocs=n,K(n)},()=>{const n=document.getElementById("online-users-list");n&&(n.innerHTML='<div class="dropdown-loading">Fehler beim Laden</div>')}),c.rendererTimer&&clearInterval(c.rendererTimer),c.rendererTimer=setInterval(()=>{c.lastSnapshotDocs.length>0&&K(c.lastSnapshotDocs)},Me))},async markOffline(){const e=c.user;this.onLogout(),e&&await k.upsertPresence(e,!1)},__test__:{getState(){return c},renderOnlineUsers:K}},_e="silbersbach";function A(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[bulletinRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("bulletinBoard")}function ae(){return window.firebase.firestore.FieldValue}function Re(e){return e&&(e.displayName||(e.email?String(e.email).split("@")[0]:null))||"Unbekannt"}const H={TENANT_ID:_e,async add({message:e,sender:t}){return await A().add({message:e,sender:t||"Unbekannt",timestamp:Date.now(),isDone:!1})},async markDone(e,t){if(!e)return;const n=t||(window.firebase?.auth?.()?.currentUser??null);await A().doc(e).update({isDone:!0,doneAt:ae().serverTimestamp(),doneBy:Re(n)})},async reopen(e){if(!e)return;const t=ae();await A().doc(e).update({isDone:!1,doneAt:t.delete(),doneBy:t.delete()})},async delete(e){e&&await A().doc(e).delete()},streamAll(e,t){return A().orderBy("timestamp","desc").onSnapshot(n=>{const r=n.docs.map(i=>({id:i.id,...i.data()}));try{e(r)}catch(i){console.error("[bulletinRepo] streamAll callback error:",i)}},n=>{console.error("[bulletinRepo] Firestore Snapshot Error:",n),typeof t=="function"&&t(n)})}},le=3;function ye(e){return e?new Date(e).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"Unbekannt"}function Ue(e){const t=We(e),n=t.filter(i=>!i?.isDone),r=t.filter(i=>!!i?.isDone).sort((i,o)=>{const s=typeof i?.doneAt=="number",a=typeof o?.doneAt=="number";return s&&a?o.doneAt-i.doneAt:s?-1:a?1:0});return{open:n,done:r}}function Pe(e){if(e==null)return"unbekannt";let t=null;if(typeof e=="number")t=e;else if(typeof e.toMillis=="function")t=e.toMillis();else if(typeof e.toDate=="function"){const n=e.toDate();n instanceof Date&&(t=n.getTime())}return t==null||Number.isNaN(t)?"unbekannt":new Date(t).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}function We(e){return Array.isArray(e)?[...e].sort((t,n)=>(n?.timestamp||0)-(t?.timestamp||0)):[]}function w(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const be="bulletin.activeTab",f={user:null,snapshotUnsub:null,listenersAttached:!1,currentOpenItems:[],currentDoneItems:[],activeTab:"open"};function J(){try{const e=window.localStorage?.getItem(be);if(e==="done"||e==="open")return e}catch{}return"open"}function je(e){try{window.localStorage?.setItem(be,e)}catch{}}function E(e,t){if(typeof window.showToast=="function")try{window.showToast(e,t)}catch{}}async function Oe(e,t,n){if(typeof window.showConfirm=="function")try{return await window.showConfirm(e,t,n)}catch{return!1}return window.confirm?window.confirm(e):!1}function Ve(){try{const e=window.firebase?.auth?.().currentUser;return e?e.displayName||(e.email?e.email.split("@")[0]:"Unbekannt"):"Unbekannt"}catch{return"Unbekannt"}}function ce(e){const t=ye(e.timestamp),n=w(e.sender||"Unbekannt"),r=w(e.message||""),i=w(e.id);return`
        <div class="bulletin-item-header">
            <span class="bulletin-item-sender">${n}</span>
            <span class="bulletin-item-date">${t}</span>
        </div>
        <div class="bulletin-item-content">${r}</div>
        <div style="text-align: right; margin-top: 0.5rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="bulletin-done-btn" data-id="${i}" title="Erledigt">
                <i class="ti ti-check"></i> Erledigt
            </button>
            <button class="bulletin-delete-btn" data-id="${i}" aria-label="Löschen">
                <i class="ti ti-trash"></i>
            </button>
        </div>
    `}function Ke(e){const t=ye(e.timestamp),n=w(e.sender||"Unbekannt"),r=w(e.message||""),i=w(e.id),o=e&&Object.prototype.hasOwnProperty.call(e,"doneAt")?e.doneAt:null,s=Pe(o),a=w(e.doneBy||"unbekannt");return`
        <div class="bulletin-item-header">
            <span class="bulletin-item-sender">${n}</span>
            <span class="bulletin-item-date">${t}</span>
        </div>
        <div class="bulletin-item-content bulletin-item-content--done">${r}</div>
        <div class="bulletin-done-meta">
            <i class="ti ti-check"></i>
            <span>Erledigt am <strong>${s}</strong> von <strong>${a}</strong></span>
        </div>
        <div style="text-align: right; margin-top: 0.5rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="bulletin-reopen-btn" data-id="${i}" title="Wieder oeffnen">
                <i class="ti ti-arrow-back-up"></i> Wieder öffnen
            </button>
            <button class="bulletin-delete-btn" data-id="${i}" aria-label="Löschen">
                <i class="ti ti-trash"></i>
            </button>
        </div>
    `}function Je(e){const t=w(e.id);return`
        <span class="bulletin-preview-text">${w(e.message||"")}</span>
        <div class="bulletin-preview-actions">
            <button class="bulletin-done-btn-sm" data-id="${t}" title="Erledigt">
                <i class="ti ti-check"></i>
            </button>
            <button class="bulletin-delete-btn-sm" data-id="${t}" title="Löschen">
                <i class="ti ti-trash"></i>
            </button>
        </div>
    `}function de(e,t){const n=document.getElementById("bulletin-list"),r=document.getElementById("bulletin-list-done"),i=document.getElementById("bulletin-list-dashboard"),o=document.getElementById("bulletin-badge"),s=document.getElementById("bulletin-preview"),a=document.getElementById("bulletin-tab-count-open"),l=document.getElementById("bulletin-tab-count-done");n&&(n.innerHTML="",e.length===0?n.innerHTML='<p class="bulletin-empty">Keine offenen Aufgaben.</p>':e.forEach(u=>{const d=document.createElement("div");d.className="bulletin-item",d.innerHTML=ce(u),n.appendChild(d)})),r&&(r.innerHTML="",t.length===0?r.innerHTML='<p class="bulletin-empty">Noch keine erledigten Aufgaben.</p>':t.forEach(u=>{const d=document.createElement("div");d.className="bulletin-item bulletin-item--done",d.innerHTML=Ke(u),r.appendChild(d)})),a&&(a.textContent=String(e.length),a.classList.toggle("hidden",e.length===0)),l&&(l.textContent=String(t.length),l.classList.toggle("hidden",t.length===0)),i&&(i.innerHTML="",e.length===0?i.innerHTML='<p class="bulletin-empty">Keine Nachrichten vorhanden.</p>':e.slice(0,le).forEach(u=>{const d=document.createElement("div");d.className="bulletin-item",d.innerHTML=ce(u),i.appendChild(d)})),o&&(o.textContent=String(e.length),o.classList.toggle("hidden",e.length===0)),s&&(s.innerHTML="",e.length===0?s.innerHTML='<p class="bulletin-empty">Keine neuen Aushänge...</p>':e.slice(0,le).forEach(u=>{const d=document.createElement("div");d.className="bulletin-preview-item",d.innerHTML=Je(u),s.appendChild(d)}))}function U(){const e=document.getElementById("bulletin-tab-open"),t=document.getElementById("bulletin-tab-done"),n=document.getElementById("bulletin-list"),r=document.getElementById("bulletin-list-done"),i=f.activeTab==="done";e&&e.classList.toggle("active",!i),e&&e.setAttribute("aria-selected",i?"false":"true"),t&&t.classList.toggle("active",i),t&&t.setAttribute("aria-selected",i?"true":"false"),n&&n.classList.toggle("hidden",i),r&&r.classList.toggle("hidden",!i)}function Q(e){e!=="open"&&e!=="done"||f.activeTab!==e&&(f.activeTab=e,je(e),U())}function q(){const e=document.getElementById("stats-detail-bulletin");if(!e)return;const t=f.currentOpenItems;let n='<div style="display: flex; flex-direction: column; gap: 0.5rem;">';t.length?t.forEach(r=>{const i=w(r.message||""),o=w(r.sender||"Unbekannt");n+=`
                <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 0.9rem;">
                    <div style="font-weight: 500; margin-bottom: 4px;">${i}</div>
                    <div style="font-size: 0.75rem; opacity: 0.5;">Von ${o}</div>
                </div>
            `}):n+="<p style='opacity:0.5'>Keine offenen Aufgaben.</p>",n+="</div>",e.innerHTML=n}async function ve(e){if(e)try{await H.markDone(e,f.user||window.firebase?.auth?.()?.currentUser),E("Aushang als erledigt markiert","success")}catch(t){console.error("[bulletin] markDone error:",t),E("Fehler beim Aktualisieren","error")}}async function ke(e){if(e)try{await H.reopen(e),E("Aushang wieder geöffnet","success")}catch(t){console.error("[bulletin] reopen error:",t),E("Fehler beim Aktualisieren","error")}}async function Ee(e,{confirm:t=!0}={}){if(e&&!(t&&!await Oe("Aushang unwiderruflich löschen?","Aushang löschen","Löschen")))try{await H.delete(e),E("Aushang gelöscht","delete")}catch(n){console.error("[bulletin] delete error:",n),E("Fehler beim Löschen","error")}}function N(e){!e||e.dataset.bulletinDelegated==="1"||(e.dataset.bulletinDelegated="1",e.addEventListener("click",async t=>{const n=t.target;if(!n||typeof n.closest!="function")return;const r=n.closest(".bulletin-preview-text");if(r&&e.contains(r)){typeof window.toggleDashboardFeed=="function"&&window.toggleDashboardFeed("bulletin");return}const i=n.closest(".bulletin-done-btn")||n.closest(".bulletin-done-btn-sm");if(i&&e.contains(i)){t.stopPropagation(),await ve(i.dataset.id);return}const o=n.closest(".bulletin-reopen-btn");if(o&&e.contains(o)){t.stopPropagation(),await ke(o.dataset.id);return}const s=n.closest(".bulletin-delete-btn")||n.closest(".bulletin-delete-btn-sm");s&&e.contains(s)&&(t.stopPropagation(),await Ee(s.dataset.id))}))}function qe(){const e=document.getElementById("bulletin-tab-open"),t=document.getElementById("bulletin-tab-done");e&&e.dataset.bulletinTabBound!=="1"&&(e.dataset.bulletinTabBound="1",e.addEventListener("click",()=>Q("open"))),t&&t.dataset.bulletinTabBound!=="1"&&(t.dataset.bulletinTabBound="1",t.addEventListener("click",()=>Q("done"))),U()}async function G({inputEl:e,buttonEl:t,busyLabel:n="Wird gesendet..."}){if(!e)return;const r=e.value.trim();if(!r)return;const i=t?t.innerHTML:null;t&&(t.disabled=!0,i&&n&&(t.innerHTML=n));try{await H.add({message:r,sender:Ve()}),e.value="",E("Aushang erfolgreich erstellt","success")}catch(o){console.error("[bulletin] submit error:",o),E("Fehler beim Senden","error")}finally{t&&(t.disabled=!1,i!==null&&(t.innerHTML=i))}}const Ge={onLogin(e){this.onLogout(),f.user=e,f.activeTab=J(),(document.getElementById("bulletin-list")||document.getElementById("bulletin-list-done")||document.getElementById("bulletin-preview")||document.getElementById("bulletin-list-dashboard"))&&(f.snapshotUnsub=H.streamAll(n=>{const{open:r,done:i}=Ue(n);f.currentOpenItems=r,f.currentDoneItems=i,de(r,i),U(),q()},n=>{console.error("[bulletin] snapshot error:",n)}))},onLogout(){if(typeof f.snapshotUnsub=="function")try{f.snapshotUnsub()}catch{}f.snapshotUnsub=null,f.currentOpenItems=[],f.currentDoneItems=[],f.user=null},initUI(){if(f.listenersAttached)return;f.listenersAttached=!0;const e=document.getElementById("bulletin-submit-btn"),t=document.getElementById("bulletin-input");e&&t&&e.addEventListener("click",()=>{G({inputEl:t,buttonEl:e})});const n=document.getElementById("bulletin-submit-dashboard"),r=document.getElementById("bulletin-input-dashboard");n&&r&&n.addEventListener("click",()=>{G({inputEl:r,buttonEl:n,busyLabel:""})}),N(document.getElementById("bulletin-list")),N(document.getElementById("bulletin-list-done")),N(document.getElementById("bulletin-list-dashboard")),N(document.getElementById("bulletin-preview")),f.activeTab=J(),qe()},renderStatsDetail(){q()},__test__:{getState(){return f},renderLists:de,renderStatsDetailInternal:q,handleSubmit:G,handleDoneClick:ve,handleReopenClick:ke,handleDeleteClick:Ee,setActiveTab:Q,applyActiveTabUi:U,loadPersistedTab:J}},Xe="silbersbach";function Ye(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[fcmTokenRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("fcmTokens")}function Ze(){return window.firebase.firestore.FieldValue}const Le={TENANT_ID:Xe,async upsertToken({token:e,userId:t,userName:n,device:r,version:i}){e&&await Ye().doc(e).set({token:e,userId:t||"anon",userName:n||"Unbekannt",device:r||"unknown",version:i||"",updatedAt:Ze().serverTimestamp()},{merge:!0})}};async function ue({swReg:e,vapidKey:t,appVersion:n,maxAttempts:r=3}){if(!e){console.warn("[FCM] Kein Service Worker vorhanden");return}if(typeof Notification>"u"||Notification.permission!=="granted")return;let i=e.active;if((!i||i.state!=="activated")&&(await new Promise(a=>setTimeout(a,2500)),i=e.active,!i||i.state!=="activated")){console.warn("[FCM] Service Worker nicht aktiviert, ueberspringe");return}let o=window.firebase?.auth?.()?.currentUser;if(!o&&(await new Promise(a=>setTimeout(a,2e3)),o=window.firebase?.auth?.()?.currentUser,!o)){console.warn("[FCM] Kein User nach Warten, ueberspringe");return}const s=window.firebase.messaging();for(let a=1;a<=r;a++)try{const l=await s.getToken({vapidKey:t,serviceWorkerRegistration:e});if(l){if(o=window.firebase?.auth?.()?.currentUser,await Le.upsertToken({token:l,userId:o?o.uid:"anon",userName:o?o.displayName||o.email||"Nutzer":"Unbekannt",device:typeof navigator<"u"&&navigator.userAgent?navigator.userAgent.substring(0,100):"unknown",version:n}),typeof window.showToast=="function")try{window.showToast("Push-Benachrichtigungen aktiv!","success")}catch{}return}return}catch(l){if(console.warn(`[FCM] Versuch ${a}/${r}:`,l.code||l.name),(l.code===20||l.name==="AbortError")&&a<r){await new Promise(u=>setTimeout(u,3e3*a));continue}a===r&&console.error("[FCM] Token-Registrierung fehlgeschlagen nach",r,"Versuchen");break}}async function Qe({appVersion:e}){if(!window.Capacitor||!window.Capacitor.Plugins||!window.Capacitor.Plugins.PushNotifications){console.warn("Capacitor Push Plugin nicht gefunden.");return}const{PushNotifications:t}=window.Capacitor.Plugins;let n=await t.checkPermissions();if(n.receive==="prompt"&&(n=await t.requestPermissions()),n.receive!=="granted"){if(typeof window.showToast=="function")try{window.showToast("Push-Berechtigung verweigert.","error")}catch{}return}t.addListener("registration",async r=>{const i=r.value,o=window.firebase?.auth?.()?.currentUser;try{if(await Le.upsertToken({token:i,userId:o?o.uid:"anon",userName:o?o.displayName||o.email||"Nutzer":"Unbekannt",device:"Android Native App",version:e}),typeof window.showToast=="function")try{window.showToast("Native Push aktiv!","success")}catch{}}catch(s){console.error("[FCM-Native] upsertToken error:",s)}}),t.addListener("registrationError",r=>{console.error("Push registration error:",r)}),t.addListener("pushNotificationReceived",r=>{console.log("Push empfangen:",r)}),t.addListener("pushNotificationActionPerformed",r=>{console.log("Push-Aktion ausgefuehrt:",r)}),await t.register()}const ee="BDy4YWtERHAaFyUQHr7URTCHbsFC_AwMImJJ5U_AlFrdF_uhsHtEMZMybDXdZWUkapxR9X5JzoKJFAHXvYSIEQg",m={initialized:!1,pendingClickListener:null,pendingTouchListener:null};function et(){return!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform())}async function tt({swReg:e,appVersion:t}){const n=window.firebase;if(!n||!n.messaging)return;try{if(!await n.messaging.isSupported())return}catch{return}if(typeof Notification>"u")return;const r=Notification.permission;if(r==="granted"){await ue({swReg:e,vapidKey:ee,appVersion:t});return}if(r==="default"){const i=async()=>{window.removeEventListener("click",i),window.removeEventListener("touchstart",i),m.pendingClickListener=null,m.pendingTouchListener=null;try{await Notification.requestPermission()==="granted"&&await ue({swReg:e,vapidKey:ee,appVersion:t})}catch(o){console.error("Fehler bei Push-Berechtigung:",o)}};m.pendingClickListener=i,m.pendingTouchListener=i,window.addEventListener("click",i),window.addEventListener("touchstart",i,{passive:!0});return}if(r==="denied"&&typeof window.showToast=="function")try{window.showToast("BLOCKIERT! Bitte in den Handy-Einstellungen (App Info) erlauben.","error")}catch{}}const nt={async init({swReg:e=null,appVersion:t=""}={}){if(!m.initialized){m.initialized=!0;try{if(et()){await Qe({appVersion:t});return}await tt({swReg:e,appVersion:t})}catch(n){console.error("[notifications] init error:",n)}}},__test__:{getState(){return m},reset(){if(m.pendingClickListener)try{window.removeEventListener("click",m.pendingClickListener)}catch{}if(m.pendingTouchListener)try{window.removeEventListener("touchstart",m.pendingTouchListener)}catch{}m.initialized=!1,m.pendingClickListener=null,m.pendingTouchListener=null},VAPID_KEY:ee}},it="silbersbach";function $(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[entriesRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("entries")}function rt(){return window.firebase.firestore.FieldValue}const z={TENANT_ID:it,async add(e){return{id:(await $().add(e)).id}},async delete(e){e&&await $().doc(e).delete()},async updateImageBase64(e,t){e&&await $().doc(e).update({imageBase64:t})},async clearImages(e){if(!e)return;const t=rt();await $().doc(e).update({imageBase64:t.delete(),imageUrl:t.delete()})},streamByDatumDesc(e,t){return $().orderBy("datum","desc").onSnapshot(n=>{const r=n.docs.map(i=>({id:i.id,...i.data()}));e(r)},n=>{console.error("[entriesRepo] Snapshot Error:",n),typeof t=="function"&&t(n)})}};function ot(e){if(!Array.isArray(e))return{};const t={};for(const n of e){const r=n?.wildart;r&&(t[r]=(t[r]||0)+1)}return t}function st(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(n?.wildart!=="Rehwild")continue;const r=n.unterart||"Unbekannt";t[r]=(t[r]||0)+1}return t}function at(e){return Array.isArray(e)?e.map(t=>({Datum:t.datum||"",Wildart:t.wildart||"",Unterart:t.unterart||"",Erleger:t.erleger||"",Bemerkung:t.bemerkung||"",Foto:t.imageBase64||t.imageUrl?"Ja":"Nein"})):[]}function T(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const lt=75e4,h={user:null,snapshotUnsub:null,listenersAttached:!1,currentEntries:[]};function p(e,t){if(typeof window.showToast=="function")try{window.showToast(e,t)}catch{}}async function ct(e,t,n){if(typeof window.showConfirm=="function")try{return await window.showConfirm(e,t,n)}catch{return!1}return window.confirm?window.confirm(e):!1}function dt(){return Array.isArray(window.jagdzeitenBayern)?window.jagdzeitenBayern:[]}function ut(e,t){if(typeof window.getWildartIconHTML=="function"){const n=window.getWildartIconHTML(e,t);if(n)return n}return'<span style="font-size: 20px;">🦌</span>'}function ft(e,t=600,n=.6){return new Promise((r,i)=>{const o=new FileReader;o.onload=s=>{const a=new Image;a.onload=()=>{const l=document.createElement("canvas");let u=a.width,d=a.height;u>t&&(d=d*t/u,u=t),l.width=u,l.height=d,l.getContext("2d").drawImage(a,0,0,u,d),r(l.toDataURL("image/jpeg",n))},a.onerror=i,a.src=s.target.result},o.onerror=i,o.readAsDataURL(e)})}function ht(e){const t=document.getElementById("strecke-count");t&&(t.textContent=String(e.length));const n=document.getElementById("rehwild-count");n&&(n.textContent=String(e.filter(r=>r.wildart==="Rehwild").length))}function M(){const e=document.getElementById("stats-detail-strecke"),t=document.getElementById("stats-detail-rehwild"),n=h.currentEntries,r=Object.entries(ot(n)).sort((o,s)=>s[1]-o[1]);if(e){let o='<div style="display: flex; flex-direction: column; gap: 0.5rem;">';r.length?r.forEach(([s,a])=>{const l=T(s);o+=`<div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;"><span>${l}</span><span style="font-weight: bold; color: var(--primary-light);">${a}</span></div>`}):o+="<p style='opacity:0.5'>Keine Daten vorhanden.</p>",o+="</div>",e.innerHTML=o}const i=Object.entries(st(n)).sort((o,s)=>s[1]-o[1]);if(t){let o='<div style="display: flex; flex-direction: column; gap: 0.5rem;">';i.length?i.forEach(([s,a])=>{const l=T(s);o+=`<div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;"><span>${l}</span><span style="font-weight: bold; color: var(--primary-light);">${a}</span></div>`}):o+="<p style='opacity:0.5'>Keine Daten vorhanden.</p>",o+="</div>",t.innerHTML=o}}function mt(){const e=document.getElementById("entry-list"),t=document.getElementById("entry-list-dashboard");e&&(e.innerHTML=""),t&&(t.innerHTML="");const n=h.currentEntries,r=dt();n.forEach((i,o)=>{const s=document.createElement("li");s.className="entry-item";const a=r.find(b=>b.name===i.wildart||b.id===i.wildart),l=a?ut(a.iconClass,28):'<span style="font-size: 20px;">🦌</span>',u=document.createElement("div");u.className="feed-card-header",u.style.marginBottom="0.2rem";const d=T(i.wildart||""),g=T(i.unterart||""),F=T(i.datum||""),Ie=T(i.erleger||"");u.innerHTML=`
            <div class="feed-card-icon-container">${l}</div>
            <div class="feed-card-header-text">
                <span class="feed-card-title">${d} ${g}</span>
                <span class="feed-card-time">${F} • ${Ie}</span>
            </div>`;const B=document.createElement("button");if(B.className="entry-delete-btn",B.dataset.idx=String(o),B.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>',Object.assign(B.style,{background:"rgba(255,255,255,0.1)",border:"none",color:"var(--primary-light)",padding:"0.5rem",borderRadius:"8px",cursor:"pointer",marginLeft:"auto"}),u.appendChild(B),s.appendChild(u),i.bemerkung){const b=document.createElement("div");b.className="entry-notes",b.textContent=i.bemerkung,s.appendChild(b)}const I=document.createElement("div");I.className="entry-foto-section";const j=i.imageBase64||i.imageUrl,re=T(i.id);if(j){I.innerHTML=`
                <div class="entry-foto-thumbnail">
                    <img src="" alt="Streckenfoto" class="entry-foto-img" data-id="${re}">
                    <button type="button" class="entry-foto-delete-btn" data-id="${re}" aria-label="Foto löschen">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="2.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>
                    </button>
                </div>`;const b=I.querySelector(".entry-foto-img");b&&(b.src=j)}const D=document.createElement("button");D.type="button",D.className="entry-foto-btn",D.dataset.id=i.id,D.innerHTML=`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>${j?"Ändern":"Foto hinzufügen"}`,I.appendChild(D),s.appendChild(I),e&&e.appendChild(s.cloneNode(!0)),t&&t.appendChild(s.cloneNode(!0))}),gt(),pt()}async function gt(){document.querySelectorAll("#entry-list .entry-delete-btn, #entry-list-dashboard .entry-delete-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=Number(e.dataset.idx),n=h.currentEntries[t];if(n?.id)try{await z.delete(n.id),p("Eintrag gelöscht","delete")}catch(r){console.error("[streckenliste] delete",r),p("Fehler beim Löschen","error")}})})}function pt(){document.querySelectorAll(".entry-foto-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.id;if(!t)return;const n=document.createElement("input");n.type="file",n.accept="image/*",n.click(),n.onchange=async()=>{const r=n.files[0];if(!r)return;const i=e.innerHTML;try{e.disabled=!0,e.innerHTML='<svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="30" stroke-dashoffset="10"/></svg> Lädt...';const o=await ft(r);if(o.length>lt)throw new Error("Bild zu groß, bitte kleineres Bild wählen");await z.updateImageBase64(t,o),p("Foto gespeichert","success")}catch(o){console.error("[streckenliste] foto",o),p(o.message||"Fehler beim Speichern","error"),e.disabled=!1,e.innerHTML=i}}})}),document.querySelectorAll(".entry-foto-img").forEach(e=>{e.addEventListener("click",()=>{typeof window.openImageModal=="function"&&window.openImageModal(e.src)})}),document.querySelectorAll(".entry-foto-delete-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=e.dataset.id;if(t&&await ct("Möchten Sie das Foto wirklich löschen?","Foto löschen","Löschen"))try{await z.clearImages(t),p("Foto gelöscht","delete")}catch(n){console.error("[streckenliste] foto-delete",n),p("Fehler beim Löschen","error")}})})}function wt(){window.openImageModal=function(t){const n=document.createElement("div");n.className="image-modal-overlay",n.innerHTML='<div class="image-modal-content"><img src="" alt="Foto"><button type="button" class="image-modal-close" aria-label="Schließen">✕</button></div>';const r=n.querySelector("img");r&&(r.src=t),document.body.appendChild(n),n.addEventListener("click",i=>{(i.target===n||i.target.closest(".image-modal-close"))&&n.remove()})}}function yt(e,t){!e||!t||e.addEventListener("change",()=>{const n=e.value;let r="";n==="Rehwild"&&(r='<label > Unterart <select name="unterart" ><option>Geiß</option><option>Bock</option><option>Kitz</option><option>Schmal</option></select></label> '),(n==="Rotwild"||n==="Dammwild")&&(r='<label > Unterart <select name="unterart" ><option>Hirsch</option><option>Alttier</option><option>Schmaltier</option><option>Spießer</option></select></label> '),n==="Schwarzwild"&&(r='<label > Unterart <select name="unterart" ><option>Keiler</option><option>Bache</option><option>Frischling</option><option>Überläufer</option></select></label> '),(n==="Raubwild"||n==="Federwild")&&(r='<label > Bemerkung <input type="text" name="unterart" ></label> '),t.innerHTML=r})}const bt={onLogin(e){this.onLogout(),h.user=e,(document.getElementById("entry-list")||document.getElementById("entry-list-dashboard"))&&(h.snapshotUnsub=z.streamByDatumDesc(n=>{h.currentEntries=n,ht(n),mt(),M()}))},onLogout(){if(typeof h.snapshotUnsub=="function")try{h.snapshotUnsub()}catch{}h.snapshotUnsub=null,h.user=null,h.currentEntries=[];const e=document.getElementById("entry-list"),t=document.getElementById("entry-list-dashboard");e&&(e.innerHTML=""),t&&(t.innerHTML="");const n=document.getElementById("strecke-count");n&&(n.textContent="0");const r=document.getElementById("rehwild-count");r&&(r.textContent="0"),M()},initUI(){if(wt(),h.listenersAttached)return;h.listenersAttached=!0;const e=document.getElementById("entry-modal"),t=document.getElementById("entry-form"),n=document.getElementById("cancel-entry"),r=document.getElementById("wildart"),i=document.getElementById("subcategory-container"),o=document.getElementById("add-entry-btn"),s=document.getElementById("fab-add-btn"),a=document.getElementById("fab-export-btn");yt(r,i),s&&e&&s.addEventListener("click",()=>{e.classList.remove("hidden")}),o&&e&&o.addEventListener("click",()=>{e.classList.remove("hidden")}),a&&a.addEventListener("click",()=>{if(!h.currentEntries.length){p("Keine Einträge zum Exportieren vorhanden","info");return}try{if(typeof window.XLSX>"u")throw new Error("XLSX");const l=at(h.currentEntries),u=window.XLSX.utils.book_new(),d=window.XLSX.utils.json_to_sheet(l);d["!cols"]=[{wch:12},{wch:20},{wch:20},{wch:20},{wch:40},{wch:10}],window.XLSX.utils.book_append_sheet(u,d,"Streckenliste"),window.XLSX.writeFile(u,`Streckenliste_Silbersbach_${new Date().toISOString().split("T")[0]}.xlsx`),p("Excel-Export erfolgreich","success")}catch(l){console.error("[streckenliste] export",l),p("Fehler beim Exportieren","error")}}),n&&t&&e&&i&&n.addEventListener("click",()=>{e.classList.add("hidden"),t.reset(),i.innerHTML=""}),t&&e&&i&&t.addEventListener("submit",async l=>{l.preventDefault();const u=new FormData(t),d={};u.forEach((g,F)=>{d[F]=g});try{await z.add(d),p("Eintrag gespeichert","success"),t.reset(),i.innerHTML="",e.classList.add("hidden")}catch(g){console.error("[streckenliste] add",g),p("Fehler beim Speichern","error")}})},renderStatsDetail(){M()},__test__:{getState(){return h},renderStatsDetailInternal:M,setEntriesForTest(e){h.currentEntries=e,M()}}};function fe(e,t=new Date().getFullYear()){const[n,r]=e.split(".").map(Number);return new Date(t,r-1,n)}function P(e,t=new Date){if(e.keineJagdzeit)return!0;if(e.ganzjaehrig)return!1;const n=t.getFullYear(),r=fe(e.jagdzeitStart,n),i=fe(e.jagdzeitEnde,n);return r>i?t>i&&t<r:t<r||t>i}function vt(e){return e.keineJagdzeit?"Keine Jagdzeit":`Jagdzeit: ${e.jagdzeitStart} - ${e.jagdzeitEnde}`}const kt=["rehbock","reh","wildschwein","gams","muffelwild","dachs","marder","iltis","hermelin","mauswiesel","ente","fasan","deer","crow","eichelhaeher","fox","rabbit"],Et=new Set(kt);function Lt(e){return Array.isArray(e)?e.filter(t=>Et.has(t.iconClass)):[]}function Tt(e,t,n=new Date){let r=Lt(t);return e==="schonzeit"?r=r.filter(i=>P(i,n)):e==="jagdzeit"&&(r=r.filter(i=>!P(i,n))),r}function xt(e,t=new Date){return Array.isArray(e)?e.filter(n=>!P(n,t)&&!n.keineJagdzeit):[]}const y={aktuellerFilter:"alle",schonzeitIndex:0,schonzeitInterval:null,listenersAttached:!1};function Te(){return Array.isArray(window.jagdzeitenBayern)?window.jagdzeitenBayern:[]}function St(e,t){if(typeof window.getWildartIconHTML=="function"){const n=window.getWildartIconHTML(e,t);if(n)return n}return""}function he(){const e=document.getElementById("schonzeit-icon"),t=document.getElementById("schonzeit-wildart"),n=document.getElementById("schonzeit-datum"),r=document.getElementById("schonzeit-indicator"),i=document.getElementById("schonzeit-status-text");if(!e||!t||!n||!r||!i)return;const o=xt(Te());if(o.length===0){e.style.display="none",t.textContent="Keine aktiven Jagdzeiten",n.textContent="Alle Wildarten haben aktuell Schonzeit",r.className="schonzeit-indicator closed",i.textContent="Schonzeit";return}const s=o[y.schonzeitIndex%o.length];e.style.display="none",t.textContent=s.name,n.textContent=vt(s),r.className="schonzeit-indicator open",i.textContent="Jagdzeit",y.schonzeitIndex+=1}function me(e){y.aktuellerFilter=e,document.querySelectorAll(".schonzeit-filter-btn").forEach(t=>{t.classList.remove("active")}),document.querySelector(`[data-filter="${e}"]`)?.classList.add("active"),xe()}function Ct(e=new Date){const t=Tt(y.aktuellerFilter,Te(),e);return t.length===0?'<div class="schonzeit-empty"><p>Keine Wildarten gefunden.</p></div>':t.map(n=>{const r=P(n,e),i=r?"closed":"open",o=r?"Schonzeit":"Jagdzeit",s=n.keineJagdzeit?"Ganzjährige Schonzeit":n.ganzjaehrig?"Ganzjährig bejagbar":`Jagdzeit: ${n.jagdzeitStart||"-"} - ${n.jagdzeitEnde||"-"}`;return`
                <div class="wildart-card">
                    <div class="wildart-icon">
                        ${St(n.iconClass,44)}
                    </div>
                    <div class="wildart-info">
                        <h3 class="wildart-name">${n.name}</h3>
                        <p class="wildart-zeit">${s}</p>
                    </div>
                    <div class="wildart-status ${i}">
                        <div class="wildart-indicator"></div>
                        <span>${o}</span>
                    </div>
                </div>
            `}).join("")}function xe(){const e=document.getElementById("schonzeit-liste"),t=document.getElementById("schonzeit-liste-dashboard");if(!e&&!t)return;const n=Ct();e&&(e.innerHTML=n),t&&(t.innerHTML=n)}const Bt={initUI(){y.schonzeitInterval!==null&&(clearInterval(y.schonzeitInterval),y.schonzeitInterval=null),y.listenersAttached||(y.listenersAttached=!0,window.filterSchonzeitListe=e=>me(e)),he(),y.schonzeitInterval=window.setInterval(he,5e3)},setFilterAndRender(e){me(e)},renderListe(){xe()}};function It(e,t,n){return`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${e},${t}?unitGroup=metric&key=${n}&include=current,days`}function te(e){return["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][Math.floor(e/22.5+.5)%16]}function X(e){if(!e)return null;const t=String(e).split(":");return parseInt(t[0],10)*60+parseInt(t[1],10)}function ge(e){const t=Math.floor(e/60),n=e%60;return t>0?`${t}h ${n}min`:`${n} min`}function C(e){return e?String(e).substring(0,5):"--:--"}function Dt(e){return e===0?"Neumond":e<.25?"Zunehmend":e===.25?"1. Viertel":e<.5?"Zunehmend":e===.5?"Vollmond":e<.75?"Abnehmend":e===.75?"3. Viertel":"Abnehmend"}function At(e){return e===0?"Neumond":e<.25?"Zunehmende Sichel":e===.25?"Erstes Viertel":e<.5?"Zunehmender Mond":e===.5?"Vollmond":e<.75?"Abnehmender Mond":e===.75?"Letztes Viertel":"Abnehmende Sichel"}function $t(e){return e<=2?"Niedrig":e<=5?"Moderat":e<=7?"Hoch":e<=10?"Sehr hoch":"Extrem"}function Mt(e){return e&&e.length?e.join(", "):"Kein Niederschlag"}function zt(e){if(!e)return"";const t={Clear:"Klar","Partially cloudy":"Teils bewölkt",Overcast:"Bedeckt",Rain:"Regen",Snow:"Schnee",Fog:"Nebel",Thunderstorm:"Gewitter",Drizzle:"Nieselregen",Cloudy:"Bewölkt","Rain, Overcast":"Regen & Bedeckt","Rain, Partially cloudy":"Leichter Regen","Snow, Overcast":"Schnee & Bedeckt","Rain, Thunder":"Gewitter","Freezing Drizzle/Freezing Rain":"Eisregen","Light Rain":"Leichter Regen","Heavy Rain":"Starkregen"},n={Clear:"Klar",Overcast:"Bedeckt",Rain:"Regen",Snow:"Schnee",Fog:"Nebel",Drizzle:"Nieselregen",Cloudy:"Bewölkt",Thunder:"Gewitter"},r=String(e).split(",")[0].trim();return t[e]||n[r]||r}function Ht(e){const t=e.currentConditions||{},n=e.days&&e.days[0]?e.days[0]:null,r=At(t.moonphase??0),i=t.uvindex||0,o=$t(i),s=Mt(t.preciptype),a=te(t.winddir||0),l=((t.moonphase??0)*100).toFixed(0);return`
        <!-- Temperatur Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                </svg>
                <span>Temperatur</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${t.temp?.toFixed(1)??"--"}°C</div>
                <div class="wetter-detail-row">
                    <span>Gefühlt</span>
                    <span>${t.feelslike?.toFixed(1)??"--"}°C</span>
                </div>
                <div class="wetter-detail-row">
                    <span>Min / Max</span>
                    <span>${n?.tempmin?.toFixed(0)??"--"}° / ${n?.tempmax?.toFixed(0)??"--"}°</span>
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
                <div class="wetter-detail-main">${t.windspeed?.toFixed(0)??"--"} km/h</div>
                <div class="wetter-detail-row">
                    <span>Richtung</span>
                    <span>${a} (${t.winddir?.toFixed(0)??"--"}°)</span>
                </div>
                <div class="wetter-detail-row">
                    <span>Böen</span>
                    <span>${t.windgust?.toFixed(0)??"--"} km/h</span>
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
                <div class="wetter-detail-main">${t.precip?.toFixed(1)??"0"} mm</div>
                <div class="wetter-detail-row">
                    <span>Wahrscheinlichkeit</span>
                    <span>${n?.precipprob?.toFixed(0)??"0"}%</span>
                </div>
                <div class="wetter-detail-row">
                    <span>Typ</span>
                    <span>${s}</span>
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
                <div class="wetter-detail-main">${t.humidity?.toFixed(0)??"--"}%</div>
                <div class="wetter-detail-row">
                    <span>Taupunkt</span>
                    <span>${t.dew?.toFixed(1)??"--"}°C</span>
                </div>
                <div class="wetter-detail-row">
                    <span>Luftdruck</span>
                    <span>${t.pressure?.toFixed(0)??"--"} hPa</span>
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
                    <span>${C(n?.sunrise)}</span>
                </div>
                <div class="wetter-detail-row highlight">
                    <span>Sonnenuntergang</span>
                    <span>${C(n?.sunset)}</span>
                </div>
                <div class="wetter-detail-row">
                    <span>UV-Index</span>
                    <span>${i} (${o})</span>
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
                <div class="wetter-detail-main">${r}</div>
                <div class="wetter-detail-row">
                    <span>Beleuchtung</span>
                    <span>${l}%</span>
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
                <div class="wetter-detail-main">${t.visibility?.toFixed(0)??"--"} km</div>
                <div class="wetter-detail-row">
                    <span>Bewölkung</span>
                    <span>${t.cloudcover?.toFixed(0)??"--"}%</span>
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
                <div class="wetter-detail-conditions">${t.conditions??"Keine Daten"}</div>
            </div>
        </div>
    `}const pe={lat:49.2,lon:13.05},Ft="YLF2SPSJ98MKAFEXGKRQRSFBW",S={cached:null,widgetClickAttached:!1},Y=`<svg class="wetter-sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="9" x2="12" y2="3"/>
        <polyline points="9 6 12 3 15 6"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
        <line x1="23" y1="22" x2="1" y2="22"/>
    </svg>`,we=`<svg class="wetter-sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="3" x2="12" y2="9"/>
        <polyline points="9 6 12 9 15 6"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
        <line x1="23" y1="22" x2="1" y2="22"/>
    </svg>`;function Nt(e,t){const n=document.getElementById("sun-text"),r=document.querySelector(".wetter-sun-icon");if(!n||!e)return;const i=new Date,o=i.getHours()*60+i.getMinutes(),s=e.sunrise?X(e.sunrise):null,a=e.sunset?X(e.sunset):null,l=t&&t.sunrise?X(t.sunrise):null;let u="",d=Y;if(s!==null&&o<s){const g=s-o;u=`Sonnenaufgang in ${ge(g)} (${C(e.sunrise)})`,d=Y}else if(a!==null&&o<a){const g=a-o;u=`Sonnenuntergang in ${ge(g)} (${C(e.sunset)})`,d=we}else l!==null?(u=`Sonnenaufgang morgen (${C(t.sunrise)})`,d=Y):(u=`Sonnenuntergang ${C(e.sunset)}`,d=we);n.textContent=u,r&&r.parentNode&&(r.outerHTML=d)}function _t(e,t){const n=document.getElementById("hero-temp"),r=document.getElementById("hero-desc"),i=document.getElementById("hero-wind-text"),o=document.getElementById("hero-sun-text");if(n&&e&&(n.textContent=`${e.temp.toFixed(0)}°`),r&&e){const s=e.conditions||"";r.textContent=zt(s)}if(i&&e){const s=te(e.winddir);i.textContent=`${s} ${e.windspeed.toFixed(0)} km/h`}if(o&&t){const s=t.sunrise?String(t.sunrise).substring(0,5):"--:--";o.textContent=`↑ ${s}`}}function Rt(e){const t=document.getElementById("wetter-temp");if(t){const i=e.conditions||"";t.querySelector(".wetter-card-value").textContent=`${e.temp.toFixed(0)}°C`,t.querySelector(".wetter-card-label").textContent=i.length>12?`${i.substring(0,12)}...`:i}const n=document.getElementById("wetter-wind");if(n){const i=te(e.winddir);n.querySelector(".wetter-card-value").textContent=i,n.querySelector(".wetter-card-label").textContent=`${e.windspeed.toFixed(0)} km/h`}const r=document.getElementById("wetter-moon");if(r){const i=Dt(e.moonphase);r.querySelector(".wetter-card-value").textContent=i,r.querySelector(".wetter-card-label").textContent="Mondphase"}}const Se={getCached(){return S.cached},renderDetailGrid(){const e=document.getElementById("wetter-detail-grid-dashboard")||document.getElementById("wetter-detail-grid");if(e){if(!S.cached){e.innerHTML='<div class="wetter-detail-widget"><p>Wetterdaten werden geladen...</p></div>';return}e.innerHTML=Ht(S.cached)}},async refresh(){const e=It(pe.lat,pe.lon,Ft);try{const t=await fetch(e);if(!t.ok)throw new Error("Netzwerkfehler");const n=await t.json();S.cached=n;const r=n.currentConditions,i=n.days&&n.days[0],o=n.days&&n.days[1];Rt(r),Nt(i,o),_t(r,i),Se.renderDetailGrid()}catch(t){console.error("Wetter Fehler:",t);const n=document.getElementById("sun-text");n&&(n.textContent="Wetter nicht verfügbar")}},initUI(){if(!S.widgetClickAttached){S.widgetClickAttached=!0;const e=document.getElementById("wetter-widget");e&&typeof window.toggleDashboardFeed=="function"&&(e.style.cursor="pointer",e.addEventListener("click",()=>window.toggleDashboardFeed("wetter")))}}};function Z(e){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[dokumenteRepo] firebase.firestore nicht verfuegbar");return window.firebase.firestore().collection("users").doc(e).collection("documents")}function Ut(){return window.firebase.firestore.FieldValue}const W={async listAll(e){const t=await Z(e).get(),n={};return t.forEach(r=>{n[r.id]=r.data()}),n},async getCategory(e,t){const n=await Z(e).doc(t).get();return n.exists?n.data():null},async setCategoryImages(e,t,n){await Z(e).doc(t).set({images:n,updatedAt:Ut().serverTimestamp()},{merge:!0})}},Ce=[{id:"jagderlaubnisschein",name:"Jagderlaubnisschein",icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'},{id:"jagdschein",name:"Jagdschein",icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>'},{id:"waffenbesitzkarte",name:"Waffenbesitzkarte",icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>'},{id:"begehungsschein",name:"Begehungsschein",icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="15" r="2"/></svg>'}],v={dokumenteCache:{},globalsAttached:!1};function ne(){return window.firebase?.auth?.()?.currentUser||null}function x(e,t){window.showToast?.(e,t)}async function Pt(e){const t=window.compressImage;if(typeof t!="function")throw new Error("compressImage nicht verfügbar");return t(e,1200,1200)}function Wt(){const e=document.querySelectorAll(".dok-wizard-step"),t=document.querySelectorAll(".dok-wizard-dot"),n=document.getElementById("dok-wizard-prev"),r=document.getElementById("dok-wizard-next");if(!e.length||!n||!r)return;let i=0;const o=e.length;function s(a){e.forEach(l=>l.classList.remove("active")),t.forEach(l=>l.classList.remove("active")),e[a].classList.add("active"),t[a].classList.add("active"),n.classList.toggle("hidden",a===0),r.textContent=a===o-1?"Fertig":"Weiter"}n.onclick=()=>{i>0&&(i-=1,s(i))},r.onclick=()=>{if(i<o-1)i+=1,s(i);else{localStorage.setItem("dokumente_wizard_done","true");const a=document.getElementById("dokumente-wizard"),l=document.getElementById("dokumente-grid");a&&a.classList.add("hidden"),l&&l.classList.remove("hidden"),Be()}},s(0)}function jt(){const e=localStorage.getItem("dokumente_wizard_done"),t=document.getElementById("dokumente-wizard"),n=document.getElementById("dokumente-grid");!t||!n||(e?(t.classList.add("hidden"),n.classList.remove("hidden"),Be()):(t.classList.remove("hidden"),n.classList.add("hidden"),Wt()))}async function Be(){const e=document.getElementById("dokumente-grid");if(!e)return;const t=ne();if(!t){e.innerHTML='<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 2rem;">Bitte zuerst anmelden.</p>';return}e.innerHTML=Ce.map(n=>`
        <div class="wetter-detail-widget dok-widget" data-kategorie="${n.id}">
            <div class="wetter-detail-header">
                ${n.icon}
                <span>${n.name}</span>
            </div>
            <div class="wetter-detail-content">
                <div class="dok-thumbnails" id="dok-thumbs-${n.id}">
                    <div class="dok-loading">Lade...</div>
                </div>
                <button class="dok-upload-btn" onclick="uploadDokument('${n.id}')">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                    Foto hinzufügen
                </button>
            </div>
        </div>
    `).join(""),await Ot(t.uid)}async function Ot(e){try{v.dokumenteCache=await W.listAll(e),Ce.forEach(t=>ie(t.id))}catch(t){console.error("Dokumente laden Fehler:",t),x("Fehler beim Laden der Dokumente","error")}}function ie(e){const t=document.getElementById(`dok-thumbs-${e}`),n=document.getElementById(`wizard-thumbs-${e}`),r=v.dokumenteCache[e],i=r&&r.images||[],o=i.length===0?'<span class="dok-empty">Keine Dokumente</span>':i.map((s,a)=>`
            <div class="dok-thumb-wrap">
                <img src="${s.url}" alt="${e}" class="dok-thumb-img" onclick="openImageModal('${s.url}')">
                <button class="dok-thumb-delete" onclick="deleteDokument('${e}', ${a})" aria-label="Löschen">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        `).join("");t&&(t.innerHTML=o),n&&(n.innerHTML=o)}async function Vt(e){const t=ne();if(!t){x("Bitte zuerst anmelden","error");return}const n=document.createElement("input");n.type="file",n.accept="image/*",n.click(),n.onchange=async()=>{const r=n.files[0];if(r)try{x("Dokument wird hochgeladen...","info");const i=await Pt(r),o=window.firebase.storage().ref(),s=`${Date.now()}.jpg`,a=o.child(`documents/${t.uid}/${e}/${s}`);await a.put(i,{contentType:"image/jpeg"});const l=await a.getDownloadURL(),d=(await W.getCategory(t.uid,e))?.images||[];d.push({url:l,name:s,uploadedAt:Date.now()}),await W.setCategoryImages(t.uid,e,d),v.dokumenteCache[e]||(v.dokumenteCache[e]={images:[]}),v.dokumenteCache[e].images=d,ie(e),x("Dokument gespeichert","success")}catch(i){console.error("Dokument Upload Fehler:",i),x(`Fehler beim Hochladen: ${i.message}`,"error")}}}async function Kt(e,t){if(!(typeof window.showConfirm=="function"?await window.showConfirm("Möchtest du dieses Dokument wirklich löschen?","Dokument löschen","Löschen"):typeof globalThis.confirm=="function"?globalThis.confirm("Möchtest du dieses Dokument wirklich löschen?"):!1))return;const r=ne();if(r)try{const i=v.dokumenteCache[e];if(!i?.images?.[t])return;const o=i.images[t];try{await window.firebase.storage().ref().child(`documents/${r.uid}/${e}/${o.name}`).delete()}catch(s){console.warn("Storage Datei konnte nicht gelöscht werden:",s)}i.images.splice(t,1),await W.setCategoryImages(r.uid,e,i.images),ie(e),x("Dokument gelöscht","delete")}catch(i){console.error("Dokument löschen Fehler:",i),x("Fehler beim Löschen","error")}}const Jt={initUI(){v.globalsAttached||(v.globalsAttached=!0,window.uploadDokument=Vt,window.deleteDokument=Kt)},initSafe(){jt()},onLogout(){v.dokumenteCache={}}},L=window.__features=window.__features||{};L.presence=Ne;L.bulletin=Ge;L.notifications=nt;L.streckenliste=bt;L.schonzeit=Bt;L.wetter=Se;L.dokumente=Jt;window.__featuresReady=!0;window.dispatchEvent(new CustomEvent("features:ready",{detail:{features:Object.keys(L)}}));
