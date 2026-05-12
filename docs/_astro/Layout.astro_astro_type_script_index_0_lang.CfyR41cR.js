const ke="silbersbach";function P(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[userRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("users")}function Q(){return window.firebase.firestore.FieldValue}const v={TENANT_ID:ke,async upsertPresence(e,t){if(!(!e||!e.uid))try{await P().doc(e.uid).set({uid:e.uid,displayName:e.displayName||"Unbekannter Jäger",photoURL:e.photoURL||"",isOnline:t,lastSeen:Q().serverTimestamp()},{merge:!0})}catch(n){console.warn("[userRepo] upsertPresence fehlgeschlagen:",n?.code||n?.message)}},upsertPresenceSync(e){if(e)try{P().doc(e).set({isOnline:!1,lastSeen:Q().serverTimestamp()},{merge:!0})}catch{}},streamAll(e,t){return P().limit(50).onSnapshot(n=>{const r=n.docs.map(i=>i.data());try{e(r)}catch(i){console.error("[userRepo] streamAll callback error:",i)}},n=>{console.error("[userRepo] Firestore Snapshot Error:",n),typeof t=="function"&&t(n)})}},Le=3e4,Te=9e4,Se=3e4;function W(e){if(!e||!e.isOnline)return!1;const t=e.lastSeen&&typeof e.lastSeen.toDate=="function"?e.lastSeen.toDate():null;return t?Date.now()-t.getTime()<Te:!1}function xe(e){const n=Math.floor((new Date-e)/1e3);return n<60?"Gerade eben":n<3600?`Vor ${Math.floor(n/60)} Min.`:n<86400?`Vor ${Math.floor(n/3600)} Std.`:e.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}function ee(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const l={user:null,heartbeatTimer:null,visibilityHandler:null,beforeUnloadHandler:null,capacitorAppListener:null,capacitorPauseListener:null,capacitorResumeListener:null,rendererTimer:null,snapshotUnsub:null,lastSnapshotDocs:[],listenersAttached:!1};function F(e){l.heartbeatTimer||(v.upsertPresence(e,!0),l.heartbeatTimer=setInterval(()=>{typeof document<"u"&&document.visibilityState==="visible"&&v.upsertPresence(e,!0)},Le))}function N(){l.heartbeatTimer&&(clearInterval(l.heartbeatTimer),l.heartbeatTimer=null)}function Be(){if(!(typeof window<"u"&&window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.App))return;const{App:e}=window.Capacitor.Plugins;e.addListener("appStateChange",({isActive:t})=>{l.user&&(t?F(l.user):(N(),v.upsertPresence(l.user,!1)))}).then(t=>{l.capacitorAppListener=t}).catch(()=>{}),e.addListener("pause",()=>{l.user&&(N(),v.upsertPresence(l.user,!1))}).then(t=>{l.capacitorPauseListener=t}).catch(()=>{}),e.addListener("resume",()=>{l.user&&F(l.user)}).then(t=>{l.capacitorResumeListener=t}).catch(()=>{})}function Ce(){[l.capacitorAppListener,l.capacitorPauseListener,l.capacitorResumeListener].forEach(e=>{if(e&&typeof e.remove=="function")try{e.remove()}catch{}}),l.capacitorAppListener=null,l.capacitorPauseListener=null,l.capacitorResumeListener=null}function O(e){const t=document.getElementById("online-users-list"),n=document.getElementById("online-count");if(!t||!n)return;let r=0;const s=e.slice().sort((o,a)=>{const c=W(o)?1:0,d=W(a)?1:0;if(c!==d)return d-c;const u=o.lastSeen&&typeof o.lastSeen.toDate=="function"?o.lastSeen.toDate().getTime():0;return(a.lastSeen&&typeof a.lastSeen.toDate=="function"?a.lastSeen.toDate().getTime():0)-u}).map(o=>{const a=W(o);a&&r++;const c=o.lastSeen&&typeof o.lastSeen.toDate=="function"?o.lastSeen.toDate():null,d=c?xe(c):"Unbekannt",u=a?"online":"offline",p=ee(o.displayName||"Unbekannter Jäger");return`
            <div class="user-status-item">
                <div class="user-status-avatar">
                    ${o.photoURL?`<img src="${ee(o.photoURL)}" alt="">`:'<div class="user-status-avatar-placeholder"><i class="ti ti-user"></i></div>'}
                    <div class="status-dot ${u}"></div>
                </div>
                <div class="user-status-info">
                    <span class="user-status-name">${p}</span>
                    <span class="user-status-lastseen">${a?"Jetzt aktiv":d}</span>
                </div>
            </div>
        `}).join("");t.innerHTML=s||'<div class="dropdown-loading">Keine Mitglieder gefunden</div>',n.textContent=r}const Ie={onLogin(e){this.onLogout(),l.user=e,F(e),l.visibilityHandler=()=>{l.user&&(document.visibilityState==="visible"?F(l.user):(N(),v.upsertPresence(l.user,!1)))},document.addEventListener("visibilitychange",l.visibilityHandler),l.beforeUnloadHandler=()=>{v.upsertPresenceSync(e.uid)},window.addEventListener("beforeunload",l.beforeUnloadHandler),Be()},onLogout(){N(),l.visibilityHandler&&(document.removeEventListener("visibilitychange",l.visibilityHandler),l.visibilityHandler=null),l.beforeUnloadHandler&&(window.removeEventListener("beforeunload",l.beforeUnloadHandler),l.beforeUnloadHandler=null),Ce(),l.user=null},initUI(){const e=document.getElementById("profile-trigger"),t=document.getElementById("online-users-dropdown");!e||!t||l.listenersAttached||(l.listenersAttached=!0,e.addEventListener("click",n=>{n.stopPropagation(),t.classList.toggle("hidden")}),document.addEventListener("click",n=>{!t.contains(n.target)&&!e.contains(n.target)&&t.classList.add("hidden")}),l.snapshotUnsub=v.streamAll(n=>{l.lastSnapshotDocs=n,O(n)},()=>{const n=document.getElementById("online-users-list");n&&(n.innerHTML='<div class="dropdown-loading">Fehler beim Laden</div>')}),l.rendererTimer&&clearInterval(l.rendererTimer),l.rendererTimer=setInterval(()=>{l.lastSnapshotDocs.length>0&&O(l.lastSnapshotDocs)},Se))},async markOffline(){const e=l.user;this.onLogout(),e&&await v.upsertPresence(e,!1)},__test__:{getState(){return l},renderOnlineUsers:O}},Ae="silbersbach";function I(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[bulletinRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("bulletinBoard")}function te(){return window.firebase.firestore.FieldValue}function De(e){return e&&(e.displayName||(e.email?String(e.email).split("@")[0]:null))||"Unbekannt"}const $={TENANT_ID:Ae,async add({message:e,sender:t}){return await I().add({message:e,sender:t||"Unbekannt",timestamp:Date.now(),isDone:!1})},async markDone(e,t){if(!e)return;const n=t||(window.firebase?.auth?.()?.currentUser??null);await I().doc(e).update({isDone:!0,doneAt:te().serverTimestamp(),doneBy:De(n)})},async reopen(e){if(!e)return;const t=te();await I().doc(e).update({isDone:!1,doneAt:t.delete(),doneBy:t.delete()})},async delete(e){e&&await I().doc(e).delete()},streamAll(e,t){return I().orderBy("timestamp","desc").onSnapshot(n=>{const r=n.docs.map(i=>({id:i.id,...i.data()}));try{e(r)}catch(i){console.error("[bulletinRepo] streamAll callback error:",i)}},n=>{console.error("[bulletinRepo] Firestore Snapshot Error:",n),typeof t=="function"&&t(n)})}},ne=3;function fe(e){return e?new Date(e).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"Unbekannt"}function Me(e){const t=ze(e),n=t.filter(i=>!i?.isDone),r=t.filter(i=>!!i?.isDone).sort((i,s)=>{const o=typeof i?.doneAt=="number",a=typeof s?.doneAt=="number";return o&&a?s.doneAt-i.doneAt:o?-1:a?1:0});return{open:n,done:r}}function $e(e){if(e==null)return"unbekannt";let t=null;if(typeof e=="number")t=e;else if(typeof e.toMillis=="function")t=e.toMillis();else if(typeof e.toDate=="function"){const n=e.toDate();n instanceof Date&&(t=n.getTime())}return t==null||Number.isNaN(t)?"unbekannt":new Date(t).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}function ze(e){return Array.isArray(e)?[...e].sort((t,n)=>(n?.timestamp||0)-(t?.timestamp||0)):[]}function w(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const he="bulletin.activeTab",f={user:null,snapshotUnsub:null,listenersAttached:!1,currentOpenItems:[],currentDoneItems:[],activeTab:"open"};function j(){try{const e=window.localStorage?.getItem(he);if(e==="done"||e==="open")return e}catch{}return"open"}function He(e){try{window.localStorage?.setItem(he,e)}catch{}}function E(e,t){if(typeof window.showToast=="function")try{window.showToast(e,t)}catch{}}async function Fe(e,t,n){if(typeof window.showConfirm=="function")try{return await window.showConfirm(e,t,n)}catch{return!1}return window.confirm?window.confirm(e):!1}function Ne(){try{const e=window.firebase?.auth?.().currentUser;return e?e.displayName||(e.email?e.email.split("@")[0]:"Unbekannt"):"Unbekannt"}catch{return"Unbekannt"}}function ie(e){const t=fe(e.timestamp),n=w(e.sender||"Unbekannt"),r=w(e.message||""),i=w(e.id);return`
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
    `}function _e(e){const t=fe(e.timestamp),n=w(e.sender||"Unbekannt"),r=w(e.message||""),i=w(e.id),s=e&&Object.prototype.hasOwnProperty.call(e,"doneAt")?e.doneAt:null,o=$e(s),a=w(e.doneBy||"unbekannt");return`
        <div class="bulletin-item-header">
            <span class="bulletin-item-sender">${n}</span>
            <span class="bulletin-item-date">${t}</span>
        </div>
        <div class="bulletin-item-content bulletin-item-content--done">${r}</div>
        <div class="bulletin-done-meta">
            <i class="ti ti-check"></i>
            <span>Erledigt am <strong>${o}</strong> von <strong>${a}</strong></span>
        </div>
        <div style="text-align: right; margin-top: 0.5rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="bulletin-reopen-btn" data-id="${i}" title="Wieder oeffnen">
                <i class="ti ti-arrow-back-up"></i> Wieder öffnen
            </button>
            <button class="bulletin-delete-btn" data-id="${i}" aria-label="Löschen">
                <i class="ti ti-trash"></i>
            </button>
        </div>
    `}function Re(e){const t=w(e.id);return`
        <span class="bulletin-preview-text">${w(e.message||"")}</span>
        <div class="bulletin-preview-actions">
            <button class="bulletin-done-btn-sm" data-id="${t}" title="Erledigt">
                <i class="ti ti-check"></i>
            </button>
            <button class="bulletin-delete-btn-sm" data-id="${t}" title="Löschen">
                <i class="ti ti-trash"></i>
            </button>
        </div>
    `}function re(e,t){const n=document.getElementById("bulletin-list"),r=document.getElementById("bulletin-list-done"),i=document.getElementById("bulletin-list-dashboard"),s=document.getElementById("bulletin-badge"),o=document.getElementById("bulletin-preview"),a=document.getElementById("bulletin-tab-count-open"),c=document.getElementById("bulletin-tab-count-done");n&&(n.innerHTML="",e.length===0?n.innerHTML='<p class="bulletin-empty">Keine offenen Aufgaben.</p>':e.forEach(d=>{const u=document.createElement("div");u.className="bulletin-item",u.innerHTML=ie(d),n.appendChild(u)})),r&&(r.innerHTML="",t.length===0?r.innerHTML='<p class="bulletin-empty">Noch keine erledigten Aufgaben.</p>':t.forEach(d=>{const u=document.createElement("div");u.className="bulletin-item bulletin-item--done",u.innerHTML=_e(d),r.appendChild(u)})),a&&(a.textContent=String(e.length),a.classList.toggle("hidden",e.length===0)),c&&(c.textContent=String(t.length),c.classList.toggle("hidden",t.length===0)),i&&(i.innerHTML="",e.length===0?i.innerHTML='<p class="bulletin-empty">Keine Nachrichten vorhanden.</p>':e.slice(0,ne).forEach(d=>{const u=document.createElement("div");u.className="bulletin-item",u.innerHTML=ie(d),i.appendChild(u)})),s&&(s.textContent=String(e.length),s.classList.toggle("hidden",e.length===0)),o&&(o.innerHTML="",e.length===0?o.innerHTML='<p class="bulletin-empty">Keine neuen Aushänge...</p>':e.slice(0,ne).forEach(d=>{const u=document.createElement("div");u.className="bulletin-preview-item",u.innerHTML=Re(d),o.appendChild(u)}))}function _(){const e=document.getElementById("bulletin-tab-open"),t=document.getElementById("bulletin-tab-done"),n=document.getElementById("bulletin-list"),r=document.getElementById("bulletin-list-done"),i=f.activeTab==="done";e&&e.classList.toggle("active",!i),e&&e.setAttribute("aria-selected",i?"false":"true"),t&&t.classList.toggle("active",i),t&&t.setAttribute("aria-selected",i?"true":"false"),n&&n.classList.toggle("hidden",i),r&&r.classList.toggle("hidden",!i)}function X(e){e!=="open"&&e!=="done"||f.activeTab!==e&&(f.activeTab=e,He(e),_())}function V(){const e=document.getElementById("stats-detail-bulletin");if(!e)return;const t=f.currentOpenItems;let n='<div style="display: flex; flex-direction: column; gap: 0.5rem;">';t.length?t.forEach(r=>{const i=w(r.message||""),s=w(r.sender||"Unbekannt");n+=`
                <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 0.9rem;">
                    <div style="font-weight: 500; margin-bottom: 4px;">${i}</div>
                    <div style="font-size: 0.75rem; opacity: 0.5;">Von ${s}</div>
                </div>
            `}):n+="<p style='opacity:0.5'>Keine offenen Aufgaben.</p>",n+="</div>",e.innerHTML=n}async function ge(e){if(e)try{await $.markDone(e,f.user||window.firebase?.auth?.()?.currentUser),E("Aushang als erledigt markiert","success")}catch(t){console.error("[bulletin] markDone error:",t),E("Fehler beim Aktualisieren","error")}}async function pe(e){if(e)try{await $.reopen(e),E("Aushang wieder geöffnet","success")}catch(t){console.error("[bulletin] reopen error:",t),E("Fehler beim Aktualisieren","error")}}async function me(e,{confirm:t=!0}={}){if(e&&!(t&&!await Fe("Aushang unwiderruflich löschen?","Aushang löschen","Löschen")))try{await $.delete(e),E("Aushang gelöscht","delete")}catch(n){console.error("[bulletin] delete error:",n),E("Fehler beim Löschen","error")}}function H(e){!e||e.dataset.bulletinDelegated==="1"||(e.dataset.bulletinDelegated="1",e.addEventListener("click",async t=>{const n=t.target;if(!n||typeof n.closest!="function")return;const r=n.closest(".bulletin-preview-text");if(r&&e.contains(r)){typeof window.toggleDashboardFeed=="function"&&window.toggleDashboardFeed("bulletin");return}const i=n.closest(".bulletin-done-btn")||n.closest(".bulletin-done-btn-sm");if(i&&e.contains(i)){t.stopPropagation(),await ge(i.dataset.id);return}const s=n.closest(".bulletin-reopen-btn");if(s&&e.contains(s)){t.stopPropagation(),await pe(s.dataset.id);return}const o=n.closest(".bulletin-delete-btn")||n.closest(".bulletin-delete-btn-sm");o&&e.contains(o)&&(t.stopPropagation(),await me(o.dataset.id))}))}function Ue(){const e=document.getElementById("bulletin-tab-open"),t=document.getElementById("bulletin-tab-done");e&&e.dataset.bulletinTabBound!=="1"&&(e.dataset.bulletinTabBound="1",e.addEventListener("click",()=>X("open"))),t&&t.dataset.bulletinTabBound!=="1"&&(t.dataset.bulletinTabBound="1",t.addEventListener("click",()=>X("done"))),_()}async function K({inputEl:e,buttonEl:t,busyLabel:n="Wird gesendet..."}){if(!e)return;const r=e.value.trim();if(!r)return;const i=t?t.innerHTML:null;t&&(t.disabled=!0,i&&n&&(t.innerHTML=n));try{await $.add({message:r,sender:Ne()}),e.value="",E("Aushang erfolgreich erstellt","success")}catch(s){console.error("[bulletin] submit error:",s),E("Fehler beim Senden","error")}finally{t&&(t.disabled=!1,i!==null&&(t.innerHTML=i))}}const Pe={onLogin(e){this.onLogout(),f.user=e,f.activeTab=j(),(document.getElementById("bulletin-list")||document.getElementById("bulletin-list-done")||document.getElementById("bulletin-preview")||document.getElementById("bulletin-list-dashboard"))&&(f.snapshotUnsub=$.streamAll(n=>{const{open:r,done:i}=Me(n);f.currentOpenItems=r,f.currentDoneItems=i,re(r,i),_(),V()},n=>{console.error("[bulletin] snapshot error:",n)}))},onLogout(){if(typeof f.snapshotUnsub=="function")try{f.snapshotUnsub()}catch{}f.snapshotUnsub=null,f.currentOpenItems=[],f.currentDoneItems=[],f.user=null},initUI(){if(f.listenersAttached)return;f.listenersAttached=!0;const e=document.getElementById("bulletin-submit-btn"),t=document.getElementById("bulletin-input");e&&t&&e.addEventListener("click",()=>{K({inputEl:t,buttonEl:e})});const n=document.getElementById("bulletin-submit-dashboard"),r=document.getElementById("bulletin-input-dashboard");n&&r&&n.addEventListener("click",()=>{K({inputEl:r,buttonEl:n,busyLabel:""})}),H(document.getElementById("bulletin-list")),H(document.getElementById("bulletin-list-done")),H(document.getElementById("bulletin-list-dashboard")),H(document.getElementById("bulletin-preview")),f.activeTab=j(),Ue()},renderStatsDetail(){V()},__test__:{getState(){return f},renderLists:re,renderStatsDetailInternal:V,handleSubmit:K,handleDoneClick:ge,handleReopenClick:pe,handleDeleteClick:me,setActiveTab:X,applyActiveTabUi:_,loadPersistedTab:j}},We="silbersbach";function Oe(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[fcmTokenRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("fcmTokens")}function je(){return window.firebase.firestore.FieldValue}const we={TENANT_ID:We,async upsertToken({token:e,userId:t,userName:n,device:r,version:i}){e&&await Oe().doc(e).set({token:e,userId:t||"anon",userName:n||"Unbekannt",device:r||"unknown",version:i||"",updatedAt:je().serverTimestamp()},{merge:!0})}};async function se({swReg:e,vapidKey:t,appVersion:n,maxAttempts:r=3}){if(!e){console.warn("[FCM] Kein Service Worker vorhanden");return}if(typeof Notification>"u"||Notification.permission!=="granted")return;let i=e.active;if((!i||i.state!=="activated")&&(await new Promise(a=>setTimeout(a,2500)),i=e.active,!i||i.state!=="activated")){console.warn("[FCM] Service Worker nicht aktiviert, ueberspringe");return}let s=window.firebase?.auth?.()?.currentUser;if(!s&&(await new Promise(a=>setTimeout(a,2e3)),s=window.firebase?.auth?.()?.currentUser,!s)){console.warn("[FCM] Kein User nach Warten, ueberspringe");return}const o=window.firebase.messaging();for(let a=1;a<=r;a++)try{const c=await o.getToken({vapidKey:t,serviceWorkerRegistration:e});if(c){if(s=window.firebase?.auth?.()?.currentUser,await we.upsertToken({token:c,userId:s?s.uid:"anon",userName:s?s.displayName||s.email||"Nutzer":"Unbekannt",device:typeof navigator<"u"&&navigator.userAgent?navigator.userAgent.substring(0,100):"unknown",version:n}),typeof window.showToast=="function")try{window.showToast("Push-Benachrichtigungen aktiv!","success")}catch{}return}return}catch(c){if(console.warn(`[FCM] Versuch ${a}/${r}:`,c.code||c.name),(c.code===20||c.name==="AbortError")&&a<r){await new Promise(d=>setTimeout(d,3e3*a));continue}a===r&&console.error("[FCM] Token-Registrierung fehlgeschlagen nach",r,"Versuchen");break}}async function Ve({appVersion:e}){if(!window.Capacitor||!window.Capacitor.Plugins||!window.Capacitor.Plugins.PushNotifications){console.warn("Capacitor Push Plugin nicht gefunden.");return}const{PushNotifications:t}=window.Capacitor.Plugins;let n=await t.checkPermissions();if(n.receive==="prompt"&&(n=await t.requestPermissions()),n.receive!=="granted"){if(typeof window.showToast=="function")try{window.showToast("Push-Berechtigung verweigert.","error")}catch{}return}t.addListener("registration",async r=>{const i=r.value,s=window.firebase?.auth?.()?.currentUser;try{if(await we.upsertToken({token:i,userId:s?s.uid:"anon",userName:s?s.displayName||s.email||"Nutzer":"Unbekannt",device:"Android Native App",version:e}),typeof window.showToast=="function")try{window.showToast("Native Push aktiv!","success")}catch{}}catch(o){console.error("[FCM-Native] upsertToken error:",o)}}),t.addListener("registrationError",r=>{console.error("Push registration error:",r)}),t.addListener("pushNotificationReceived",r=>{console.log("Push empfangen:",r)}),t.addListener("pushNotificationActionPerformed",r=>{console.log("Push-Aktion ausgefuehrt:",r)}),await t.register()}const G="BDy4YWtERHAaFyUQHr7URTCHbsFC_AwMImJJ5U_AlFrdF_uhsHtEMZMybDXdZWUkapxR9X5JzoKJFAHXvYSIEQg",g={initialized:!1,pendingClickListener:null,pendingTouchListener:null};function Ke(){return!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform())}async function Je({swReg:e,appVersion:t}){const n=window.firebase;if(!n||!n.messaging)return;try{if(!await n.messaging.isSupported())return}catch{return}if(typeof Notification>"u")return;const r=Notification.permission;if(r==="granted"){await se({swReg:e,vapidKey:G,appVersion:t});return}if(r==="default"){const i=async()=>{window.removeEventListener("click",i),window.removeEventListener("touchstart",i),g.pendingClickListener=null,g.pendingTouchListener=null;try{await Notification.requestPermission()==="granted"&&await se({swReg:e,vapidKey:G,appVersion:t})}catch(s){console.error("Fehler bei Push-Berechtigung:",s)}};g.pendingClickListener=i,g.pendingTouchListener=i,window.addEventListener("click",i),window.addEventListener("touchstart",i,{passive:!0});return}if(r==="denied"&&typeof window.showToast=="function")try{window.showToast("BLOCKIERT! Bitte in den Handy-Einstellungen (App Info) erlauben.","error")}catch{}}const qe={async init({swReg:e=null,appVersion:t=""}={}){if(!g.initialized){g.initialized=!0;try{if(Ke()){await Ve({appVersion:t});return}await Je({swReg:e,appVersion:t})}catch(n){console.error("[notifications] init error:",n)}}},__test__:{getState(){return g},reset(){if(g.pendingClickListener)try{window.removeEventListener("click",g.pendingClickListener)}catch{}if(g.pendingTouchListener)try{window.removeEventListener("touchstart",g.pendingTouchListener)}catch{}g.initialized=!1,g.pendingClickListener=null,g.pendingTouchListener=null},VAPID_KEY:G}},Xe="silbersbach";function A(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[entriesRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("entries")}function Ge(){return window.firebase.firestore.FieldValue}const M={TENANT_ID:Xe,async add(e){return{id:(await A().add(e)).id}},async delete(e){e&&await A().doc(e).delete()},async updateImageBase64(e,t){e&&await A().doc(e).update({imageBase64:t})},async clearImages(e){if(!e)return;const t=Ge();await A().doc(e).update({imageBase64:t.delete(),imageUrl:t.delete()})},streamByDatumDesc(e,t){return A().orderBy("datum","desc").onSnapshot(n=>{const r=n.docs.map(i=>({id:i.id,...i.data()}));e(r)},n=>{console.error("[entriesRepo] Snapshot Error:",n),typeof t=="function"&&t(n)})}};function Ye(e){if(!Array.isArray(e))return{};const t={};for(const n of e){const r=n?.wildart;r&&(t[r]=(t[r]||0)+1)}return t}function Ze(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(n?.wildart!=="Rehwild")continue;const r=n.unterart||"Unbekannt";t[r]=(t[r]||0)+1}return t}function Qe(e){return Array.isArray(e)?e.map(t=>({Datum:t.datum||"",Wildart:t.wildart||"",Unterart:t.unterart||"",Erleger:t.erleger||"",Bemerkung:t.bemerkung||"",Foto:t.imageBase64||t.imageUrl?"Ja":"Nein"})):[]}function k(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const et=75e4,h={user:null,snapshotUnsub:null,listenersAttached:!1,currentEntries:[]};function m(e,t){if(typeof window.showToast=="function")try{window.showToast(e,t)}catch{}}async function tt(e,t,n){if(typeof window.showConfirm=="function")try{return await window.showConfirm(e,t,n)}catch{return!1}return window.confirm?window.confirm(e):!1}function nt(){return Array.isArray(window.jagdzeitenBayern)?window.jagdzeitenBayern:[]}function it(e,t){if(typeof window.getWildartIconHTML=="function"){const n=window.getWildartIconHTML(e,t);if(n)return n}return'<span style="font-size: 20px;">🦌</span>'}function rt(e,t=600,n=.6){return new Promise((r,i)=>{const s=new FileReader;s.onload=o=>{const a=new Image;a.onload=()=>{const c=document.createElement("canvas");let d=a.width,u=a.height;d>t&&(u=u*t/d,d=t),c.width=d,c.height=u,c.getContext("2d").drawImage(a,0,0,d,u),r(c.toDataURL("image/jpeg",n))},a.onerror=i,a.src=o.target.result},s.onerror=i,s.readAsDataURL(e)})}function st(e){const t=document.getElementById("strecke-count");t&&(t.textContent=String(e.length));const n=document.getElementById("rehwild-count");n&&(n.textContent=String(e.filter(r=>r.wildart==="Rehwild").length))}function D(){const e=document.getElementById("stats-detail-strecke"),t=document.getElementById("stats-detail-rehwild"),n=h.currentEntries,r=Object.entries(Ye(n)).sort((s,o)=>o[1]-s[1]);if(e){let s='<div style="display: flex; flex-direction: column; gap: 0.5rem;">';r.length?r.forEach(([o,a])=>{const c=k(o);s+=`<div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;"><span>${c}</span><span style="font-weight: bold; color: var(--primary-light);">${a}</span></div>`}):s+="<p style='opacity:0.5'>Keine Daten vorhanden.</p>",s+="</div>",e.innerHTML=s}const i=Object.entries(Ze(n)).sort((s,o)=>o[1]-s[1]);if(t){let s='<div style="display: flex; flex-direction: column; gap: 0.5rem;">';i.length?i.forEach(([o,a])=>{const c=k(o);s+=`<div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;"><span>${c}</span><span style="font-weight: bold; color: var(--primary-light);">${a}</span></div>`}):s+="<p style='opacity:0.5'>Keine Daten vorhanden.</p>",s+="</div>",t.innerHTML=s}}function ot(){const e=document.getElementById("entry-list"),t=document.getElementById("entry-list-dashboard");e&&(e.innerHTML=""),t&&(t.innerHTML="");const n=h.currentEntries,r=nt();n.forEach((i,s)=>{const o=document.createElement("li");o.className="entry-item";const a=r.find(y=>y.name===i.wildart||y.id===i.wildart),c=a?it(a.iconClass,28):'<span style="font-size: 20px;">🦌</span>',d=document.createElement("div");d.className="feed-card-header",d.style.marginBottom="0.2rem";const u=k(i.wildart||""),p=k(i.unterart||""),z=k(i.datum||""),Ee=k(i.erleger||"");d.innerHTML=`
            <div class="feed-card-icon-container">${c}</div>
            <div class="feed-card-header-text">
                <span class="feed-card-title">${u} ${p}</span>
                <span class="feed-card-time">${z} • ${Ee}</span>
            </div>`;const x=document.createElement("button");if(x.className="entry-delete-btn",x.dataset.idx=String(s),x.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>',Object.assign(x.style,{background:"rgba(255,255,255,0.1)",border:"none",color:"var(--primary-light)",padding:"0.5rem",borderRadius:"8px",cursor:"pointer",marginLeft:"auto"}),d.appendChild(x),o.appendChild(d),i.bemerkung){const y=document.createElement("div");y.className="entry-notes",y.textContent=i.bemerkung,o.appendChild(y)}const B=document.createElement("div");B.className="entry-foto-section";const U=i.imageBase64||i.imageUrl,Z=k(i.id);if(U){B.innerHTML=`
                <div class="entry-foto-thumbnail">
                    <img src="" alt="Streckenfoto" class="entry-foto-img" data-id="${Z}">
                    <button type="button" class="entry-foto-delete-btn" data-id="${Z}" aria-label="Foto löschen">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="2.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>
                    </button>
                </div>`;const y=B.querySelector(".entry-foto-img");y&&(y.src=U)}const C=document.createElement("button");C.type="button",C.className="entry-foto-btn",C.dataset.id=i.id,C.innerHTML=`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>${U?"Ändern":"Foto hinzufügen"}`,B.appendChild(C),o.appendChild(B),e&&e.appendChild(o.cloneNode(!0)),t&&t.appendChild(o.cloneNode(!0))}),at(),lt()}async function at(){document.querySelectorAll("#entry-list .entry-delete-btn, #entry-list-dashboard .entry-delete-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=Number(e.dataset.idx),n=h.currentEntries[t];if(n?.id)try{await M.delete(n.id),m("Eintrag gelöscht","delete")}catch(r){console.error("[streckenliste] delete",r),m("Fehler beim Löschen","error")}})})}function lt(){document.querySelectorAll(".entry-foto-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.id;if(!t)return;const n=document.createElement("input");n.type="file",n.accept="image/*",n.click(),n.onchange=async()=>{const r=n.files[0];if(!r)return;const i=e.innerHTML;try{e.disabled=!0,e.innerHTML='<svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="30" stroke-dashoffset="10"/></svg> Lädt...';const s=await rt(r);if(s.length>et)throw new Error("Bild zu groß, bitte kleineres Bild wählen");await M.updateImageBase64(t,s),m("Foto gespeichert","success")}catch(s){console.error("[streckenliste] foto",s),m(s.message||"Fehler beim Speichern","error"),e.disabled=!1,e.innerHTML=i}}})}),document.querySelectorAll(".entry-foto-img").forEach(e=>{e.addEventListener("click",()=>{typeof window.openImageModal=="function"&&window.openImageModal(e.src)})}),document.querySelectorAll(".entry-foto-delete-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=e.dataset.id;if(t&&await tt("Möchten Sie das Foto wirklich löschen?","Foto löschen","Löschen"))try{await M.clearImages(t),m("Foto gelöscht","delete")}catch(n){console.error("[streckenliste] foto-delete",n),m("Fehler beim Löschen","error")}})})}function ct(){window.openImageModal=function(t){const n=document.createElement("div");n.className="image-modal-overlay",n.innerHTML='<div class="image-modal-content"><img src="" alt="Foto"><button type="button" class="image-modal-close" aria-label="Schließen">✕</button></div>';const r=n.querySelector("img");r&&(r.src=t),document.body.appendChild(n),n.addEventListener("click",i=>{(i.target===n||i.target.closest(".image-modal-close"))&&n.remove()})}}function dt(e,t){!e||!t||e.addEventListener("change",()=>{const n=e.value;let r="";n==="Rehwild"&&(r='<label > Unterart <select name="unterart" ><option>Geiß</option><option>Bock</option><option>Kitz</option><option>Schmal</option></select></label> '),(n==="Rotwild"||n==="Dammwild")&&(r='<label > Unterart <select name="unterart" ><option>Hirsch</option><option>Alttier</option><option>Schmaltier</option><option>Spießer</option></select></label> '),n==="Schwarzwild"&&(r='<label > Unterart <select name="unterart" ><option>Keiler</option><option>Bache</option><option>Frischling</option><option>Überläufer</option></select></label> '),(n==="Raubwild"||n==="Federwild")&&(r='<label > Bemerkung <input type="text" name="unterart" ></label> '),t.innerHTML=r})}const ut={onLogin(e){this.onLogout(),h.user=e,(document.getElementById("entry-list")||document.getElementById("entry-list-dashboard"))&&(h.snapshotUnsub=M.streamByDatumDesc(n=>{h.currentEntries=n,st(n),ot(),D()}))},onLogout(){if(typeof h.snapshotUnsub=="function")try{h.snapshotUnsub()}catch{}h.snapshotUnsub=null,h.user=null,h.currentEntries=[];const e=document.getElementById("entry-list"),t=document.getElementById("entry-list-dashboard");e&&(e.innerHTML=""),t&&(t.innerHTML="");const n=document.getElementById("strecke-count");n&&(n.textContent="0");const r=document.getElementById("rehwild-count");r&&(r.textContent="0"),D()},initUI(){if(ct(),h.listenersAttached)return;h.listenersAttached=!0;const e=document.getElementById("entry-modal"),t=document.getElementById("entry-form"),n=document.getElementById("cancel-entry"),r=document.getElementById("wildart"),i=document.getElementById("subcategory-container"),s=document.getElementById("add-entry-btn"),o=document.getElementById("fab-add-btn"),a=document.getElementById("fab-export-btn");dt(r,i),o&&e&&o.addEventListener("click",()=>{e.classList.remove("hidden")}),s&&e&&s.addEventListener("click",()=>{e.classList.remove("hidden")}),a&&a.addEventListener("click",()=>{if(!h.currentEntries.length){m("Keine Einträge zum Exportieren vorhanden","info");return}try{if(typeof window.XLSX>"u")throw new Error("XLSX");const c=Qe(h.currentEntries),d=window.XLSX.utils.book_new(),u=window.XLSX.utils.json_to_sheet(c);u["!cols"]=[{wch:12},{wch:20},{wch:20},{wch:20},{wch:40},{wch:10}],window.XLSX.utils.book_append_sheet(d,u,"Streckenliste"),window.XLSX.writeFile(d,`Streckenliste_Silbersbach_${new Date().toISOString().split("T")[0]}.xlsx`),m("Excel-Export erfolgreich","success")}catch(c){console.error("[streckenliste] export",c),m("Fehler beim Exportieren","error")}}),n&&t&&e&&i&&n.addEventListener("click",()=>{e.classList.add("hidden"),t.reset(),i.innerHTML=""}),t&&e&&i&&t.addEventListener("submit",async c=>{c.preventDefault();const d=new FormData(t),u={};d.forEach((p,z)=>{u[z]=p});try{await M.add(u),m("Eintrag gespeichert","success"),t.reset(),i.innerHTML="",e.classList.add("hidden")}catch(p){console.error("[streckenliste] add",p),m("Fehler beim Speichern","error")}})},renderStatsDetail(){D()},__test__:{getState(){return h},renderStatsDetailInternal:D,setEntriesForTest(e){h.currentEntries=e,D()}}};function oe(e,t=new Date().getFullYear()){const[n,r]=e.split(".").map(Number);return new Date(t,r-1,n)}function R(e,t=new Date){if(e.keineJagdzeit)return!0;if(e.ganzjaehrig)return!1;const n=t.getFullYear(),r=oe(e.jagdzeitStart,n),i=oe(e.jagdzeitEnde,n);return r>i?t>i&&t<r:t<r||t>i}function ft(e){return e.keineJagdzeit?"Keine Jagdzeit":`Jagdzeit: ${e.jagdzeitStart} - ${e.jagdzeitEnde}`}const ht=["rehbock","reh","wildschwein","gams","muffelwild","dachs","marder","iltis","hermelin","mauswiesel","ente","fasan","deer","crow","eichelhaeher","fox","rabbit"],gt=new Set(ht);function pt(e){return Array.isArray(e)?e.filter(t=>gt.has(t.iconClass)):[]}function mt(e,t,n=new Date){let r=pt(t);return e==="schonzeit"?r=r.filter(i=>R(i,n)):e==="jagdzeit"&&(r=r.filter(i=>!R(i,n))),r}function wt(e,t=new Date){return Array.isArray(e)?e.filter(n=>!R(n,t)&&!n.keineJagdzeit):[]}const b={aktuellerFilter:"alle",schonzeitIndex:0,schonzeitInterval:null,listenersAttached:!1};function be(){return Array.isArray(window.jagdzeitenBayern)?window.jagdzeitenBayern:[]}function bt(e,t){if(typeof window.getWildartIconHTML=="function"){const n=window.getWildartIconHTML(e,t);if(n)return n}return""}function ae(){const e=document.getElementById("schonzeit-icon"),t=document.getElementById("schonzeit-wildart"),n=document.getElementById("schonzeit-datum"),r=document.getElementById("schonzeit-indicator"),i=document.getElementById("schonzeit-status-text");if(!e||!t||!n||!r||!i)return;const s=wt(be());if(s.length===0){e.style.display="none",t.textContent="Keine aktiven Jagdzeiten",n.textContent="Alle Wildarten haben aktuell Schonzeit",r.className="schonzeit-indicator closed",i.textContent="Schonzeit";return}const o=s[b.schonzeitIndex%s.length];e.style.display="none",t.textContent=o.name,n.textContent=ft(o),r.className="schonzeit-indicator open",i.textContent="Jagdzeit",b.schonzeitIndex+=1}function le(e){b.aktuellerFilter=e,document.querySelectorAll(".schonzeit-filter-btn").forEach(t=>{t.classList.remove("active")}),document.querySelector(`[data-filter="${e}"]`)?.classList.add("active"),ye()}function yt(e=new Date){const t=mt(b.aktuellerFilter,be(),e);return t.length===0?'<div class="schonzeit-empty"><p>Keine Wildarten gefunden.</p></div>':t.map(n=>{const r=R(n,e),i=r?"closed":"open",s=r?"Schonzeit":"Jagdzeit",o=n.keineJagdzeit?"Ganzjährige Schonzeit":n.ganzjaehrig?"Ganzjährig bejagbar":`Jagdzeit: ${n.jagdzeitStart||"-"} - ${n.jagdzeitEnde||"-"}`;return`
                <div class="wildart-card">
                    <div class="wildart-icon">
                        ${bt(n.iconClass,44)}
                    </div>
                    <div class="wildart-info">
                        <h3 class="wildart-name">${n.name}</h3>
                        <p class="wildart-zeit">${o}</p>
                    </div>
                    <div class="wildart-status ${i}">
                        <div class="wildart-indicator"></div>
                        <span>${s}</span>
                    </div>
                </div>
            `}).join("")}function ye(){const e=document.getElementById("schonzeit-liste"),t=document.getElementById("schonzeit-liste-dashboard");if(!e&&!t)return;const n=yt();e&&(e.innerHTML=n),t&&(t.innerHTML=n)}const vt={initUI(){b.schonzeitInterval!==null&&(clearInterval(b.schonzeitInterval),b.schonzeitInterval=null),b.listenersAttached||(b.listenersAttached=!0,window.filterSchonzeitListe=e=>le(e)),ae(),b.schonzeitInterval=window.setInterval(ae,5e3)},setFilterAndRender(e){le(e)},renderListe(){ye()}};function Et(e,t,n){return`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${e},${t}?unitGroup=metric&key=${n}&include=current,days`}function Y(e){return["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][Math.floor(e/22.5+.5)%16]}function J(e){if(!e)return null;const t=String(e).split(":");return parseInt(t[0],10)*60+parseInt(t[1],10)}function ce(e){const t=Math.floor(e/60),n=e%60;return t>0?`${t}h ${n}min`:`${n} min`}function S(e){return e?String(e).substring(0,5):"--:--"}function kt(e){return e===0?"Neumond":e<.25?"Zunehmend":e===.25?"1. Viertel":e<.5?"Zunehmend":e===.5?"Vollmond":e<.75?"Abnehmend":e===.75?"3. Viertel":"Abnehmend"}function Lt(e){return e===0?"Neumond":e<.25?"Zunehmende Sichel":e===.25?"Erstes Viertel":e<.5?"Zunehmender Mond":e===.5?"Vollmond":e<.75?"Abnehmender Mond":e===.75?"Letztes Viertel":"Abnehmende Sichel"}function Tt(e){return e<=2?"Niedrig":e<=5?"Moderat":e<=7?"Hoch":e<=10?"Sehr hoch":"Extrem"}function St(e){return e&&e.length?e.join(", "):"Kein Niederschlag"}function xt(e){if(!e)return"";const t={Clear:"Klar","Partially cloudy":"Teils bewölkt",Overcast:"Bedeckt",Rain:"Regen",Snow:"Schnee",Fog:"Nebel",Thunderstorm:"Gewitter",Drizzle:"Nieselregen",Cloudy:"Bewölkt","Rain, Overcast":"Regen & Bedeckt","Rain, Partially cloudy":"Leichter Regen","Snow, Overcast":"Schnee & Bedeckt","Rain, Thunder":"Gewitter","Freezing Drizzle/Freezing Rain":"Eisregen","Light Rain":"Leichter Regen","Heavy Rain":"Starkregen"},n={Clear:"Klar",Overcast:"Bedeckt",Rain:"Regen",Snow:"Schnee",Fog:"Nebel",Drizzle:"Nieselregen",Cloudy:"Bewölkt",Thunder:"Gewitter"},r=String(e).split(",")[0].trim();return t[e]||n[r]||r}function Bt(e){const t=e.currentConditions||{},n=e.days&&e.days[0]?e.days[0]:null,r=Lt(t.moonphase??0),i=t.uvindex||0,s=Tt(i),o=St(t.preciptype),a=Y(t.winddir||0),c=((t.moonphase??0)*100).toFixed(0);return`
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
                    <span>${o}</span>
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
                    <span>${S(n?.sunrise)}</span>
                </div>
                <div class="wetter-detail-row highlight">
                    <span>Sonnenuntergang</span>
                    <span>${S(n?.sunset)}</span>
                </div>
                <div class="wetter-detail-row">
                    <span>UV-Index</span>
                    <span>${i} (${s})</span>
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
                    <span>${c}%</span>
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
    `}const de={lat:49.2,lon:13.05},Ct="YLF2SPSJ98MKAFEXGKRQRSFBW",T={cached:null,widgetClickAttached:!1},q=`<svg class="wetter-sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="9" x2="12" y2="3"/>
        <polyline points="9 6 12 3 15 6"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
        <line x1="23" y1="22" x2="1" y2="22"/>
    </svg>`,ue=`<svg class="wetter-sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="3" x2="12" y2="9"/>
        <polyline points="9 6 12 9 15 6"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
        <line x1="23" y1="22" x2="1" y2="22"/>
    </svg>`;function It(e,t){const n=document.getElementById("sun-text"),r=document.querySelector(".wetter-sun-icon");if(!n||!e)return;const i=new Date,s=i.getHours()*60+i.getMinutes(),o=e.sunrise?J(e.sunrise):null,a=e.sunset?J(e.sunset):null,c=t&&t.sunrise?J(t.sunrise):null;let d="",u=q;if(o!==null&&s<o){const p=o-s;d=`Sonnenaufgang in ${ce(p)} (${S(e.sunrise)})`,u=q}else if(a!==null&&s<a){const p=a-s;d=`Sonnenuntergang in ${ce(p)} (${S(e.sunset)})`,u=ue}else c!==null?(d=`Sonnenaufgang morgen (${S(t.sunrise)})`,u=q):(d=`Sonnenuntergang ${S(e.sunset)}`,u=ue);n.textContent=d,r&&r.parentNode&&(r.outerHTML=u)}function At(e,t){const n=document.getElementById("hero-temp"),r=document.getElementById("hero-desc"),i=document.getElementById("hero-wind-text"),s=document.getElementById("hero-sun-text");if(n&&e&&(n.textContent=`${e.temp.toFixed(0)}°`),r&&e){const o=e.conditions||"";r.textContent=xt(o)}if(i&&e){const o=Y(e.winddir);i.textContent=`${o} ${e.windspeed.toFixed(0)} km/h`}if(s&&t){const o=t.sunrise?String(t.sunrise).substring(0,5):"--:--";s.textContent=`↑ ${o}`}}function Dt(e){const t=document.getElementById("wetter-temp");if(t){const i=e.conditions||"";t.querySelector(".wetter-card-value").textContent=`${e.temp.toFixed(0)}°C`,t.querySelector(".wetter-card-label").textContent=i.length>12?`${i.substring(0,12)}...`:i}const n=document.getElementById("wetter-wind");if(n){const i=Y(e.winddir);n.querySelector(".wetter-card-value").textContent=i,n.querySelector(".wetter-card-label").textContent=`${e.windspeed.toFixed(0)} km/h`}const r=document.getElementById("wetter-moon");if(r){const i=kt(e.moonphase);r.querySelector(".wetter-card-value").textContent=i,r.querySelector(".wetter-card-label").textContent="Mondphase"}}const ve={getCached(){return T.cached},renderDetailGrid(){const e=document.getElementById("wetter-detail-grid-dashboard")||document.getElementById("wetter-detail-grid");if(e){if(!T.cached){e.innerHTML='<div class="wetter-detail-widget"><p>Wetterdaten werden geladen...</p></div>';return}e.innerHTML=Bt(T.cached)}},async refresh(){const e=Et(de.lat,de.lon,Ct);try{const t=await fetch(e);if(!t.ok)throw new Error("Netzwerkfehler");const n=await t.json();T.cached=n;const r=n.currentConditions,i=n.days&&n.days[0],s=n.days&&n.days[1];Dt(r),It(i,s),At(r,i),ve.renderDetailGrid()}catch(t){console.error("Wetter Fehler:",t);const n=document.getElementById("sun-text");n&&(n.textContent="Wetter nicht verfügbar")}},initUI(){if(!T.widgetClickAttached){T.widgetClickAttached=!0;const e=document.getElementById("wetter-widget");e&&typeof window.toggleDashboardFeed=="function"&&(e.style.cursor="pointer",e.addEventListener("click",()=>window.toggleDashboardFeed("wetter")))}}},L=window.__features=window.__features||{};L.presence=Ie;L.bulletin=Pe;L.notifications=qe;L.streckenliste=ut;L.schonzeit=vt;L.wetter=ve;window.__featuresReady=!0;window.dispatchEvent(new CustomEvent("features:ready",{detail:{features:Object.keys(L)}}));
