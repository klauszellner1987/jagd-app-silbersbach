const Xe="silbersbach";function ne(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[userRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("users")}function ye(){return window.firebase.firestore.FieldValue}const M={TENANT_ID:Xe,async upsertPresence(e,t){if(!(!e||!e.uid))try{await ne().doc(e.uid).set({uid:e.uid,displayName:e.displayName||"Unbekannter Jäger",photoURL:e.photoURL||"",isOnline:t,lastSeen:ye().serverTimestamp()},{merge:!0})}catch(n){console.warn("[userRepo] upsertPresence fehlgeschlagen:",n?.code||n?.message)}},upsertPresenceSync(e){if(e)try{ne().doc(e).set({isOnline:!1,lastSeen:ye().serverTimestamp()},{merge:!0})}catch{}},streamAll(e,t){return ne().limit(50).onSnapshot(n=>{const i=n.docs.map(o=>o.data());try{e(i)}catch(o){console.error("[userRepo] streamAll callback error:",o)}},n=>{console.error("[userRepo] Firestore Snapshot Error:",n),typeof t=="function"&&t(n)})}},Ye=3e4,Qe=9e4,et=3e4;function ie(e){if(!e||!e.isOnline)return!1;const t=e.lastSeen&&typeof e.lastSeen.toDate=="function"?e.lastSeen.toDate():null;return t?Date.now()-t.getTime()<Qe:!1}function tt(e){const n=Math.floor((new Date-e)/1e3);return n<60?"Gerade eben":n<3600?`Vor ${Math.floor(n/60)} Min.`:n<86400?`Vor ${Math.floor(n/3600)} Std.`:e.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}function ve(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const f={user:null,heartbeatTimer:null,visibilityHandler:null,beforeUnloadHandler:null,capacitorAppListener:null,capacitorPauseListener:null,capacitorResumeListener:null,rendererTimer:null,snapshotUnsub:null,lastSnapshotDocs:[],listenersAttached:!1};function Z(e){f.heartbeatTimer||(M.upsertPresence(e,!0),f.heartbeatTimer=setInterval(()=>{typeof document<"u"&&document.visibilityState==="visible"&&M.upsertPresence(e,!0)},Ye))}function X(){f.heartbeatTimer&&(clearInterval(f.heartbeatTimer),f.heartbeatTimer=null)}function nt(){if(!(typeof window<"u"&&window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.App))return;const{App:e}=window.Capacitor.Plugins;e.addListener("appStateChange",({isActive:t})=>{f.user&&(t?Z(f.user):(X(),M.upsertPresence(f.user,!1)))}).then(t=>{f.capacitorAppListener=t}).catch(()=>{}),e.addListener("pause",()=>{f.user&&(X(),M.upsertPresence(f.user,!1))}).then(t=>{f.capacitorPauseListener=t}).catch(()=>{}),e.addListener("resume",()=>{f.user&&Z(f.user)}).then(t=>{f.capacitorResumeListener=t}).catch(()=>{})}function it(){[f.capacitorAppListener,f.capacitorPauseListener,f.capacitorResumeListener].forEach(e=>{if(e&&typeof e.remove=="function")try{e.remove()}catch{}}),f.capacitorAppListener=null,f.capacitorPauseListener=null,f.capacitorResumeListener=null}function oe(e){const t=document.getElementById("online-users-list"),n=document.getElementById("online-count");if(!t||!n)return;let i=0;const r=e.slice().sort((a,l)=>{const c=ie(a)?1:0,u=ie(l)?1:0;if(c!==u)return u-c;const h=a.lastSeen&&typeof a.lastSeen.toDate=="function"?a.lastSeen.toDate().getTime():0;return(l.lastSeen&&typeof l.lastSeen.toDate=="function"?l.lastSeen.toDate().getTime():0)-h}).map(a=>{const l=ie(a);l&&i++;const c=a.lastSeen&&typeof a.lastSeen.toDate=="function"?a.lastSeen.toDate():null,u=c?tt(c):"Unbekannt",h=l?"online":"offline",L=ve(a.displayName||"Unbekannter Jäger");return`
            <div class="user-status-item">
                <div class="user-status-avatar">
                    ${a.photoURL?`<img src="${ve(a.photoURL)}" alt="">`:'<div class="user-status-avatar-placeholder"><i class="ti ti-user"></i></div>'}
                    <div class="status-dot ${h}"></div>
                </div>
                <div class="user-status-info">
                    <span class="user-status-name">${L}</span>
                    <span class="user-status-lastseen">${l?"Jetzt aktiv":u}</span>
                </div>
            </div>
        `}).join("");t.innerHTML=r||'<div class="dropdown-loading">Keine Mitglieder gefunden</div>',n.textContent=i}const ot={onLogin(e){this.onLogout(),f.user=e,Z(e),f.visibilityHandler=()=>{f.user&&(document.visibilityState==="visible"?Z(f.user):(X(),M.upsertPresence(f.user,!1)))},document.addEventListener("visibilitychange",f.visibilityHandler),f.beforeUnloadHandler=()=>{M.upsertPresenceSync(e.uid)},window.addEventListener("beforeunload",f.beforeUnloadHandler),nt()},onLogout(){X(),f.visibilityHandler&&(document.removeEventListener("visibilitychange",f.visibilityHandler),f.visibilityHandler=null),f.beforeUnloadHandler&&(window.removeEventListener("beforeunload",f.beforeUnloadHandler),f.beforeUnloadHandler=null),it(),f.user=null},initUI(){const e=document.getElementById("profile-trigger"),t=document.getElementById("online-users-dropdown");!e||!t||f.listenersAttached||(f.listenersAttached=!0,e.addEventListener("click",n=>{n.stopPropagation(),t.classList.toggle("hidden")}),document.addEventListener("click",n=>{!t.contains(n.target)&&!e.contains(n.target)&&t.classList.add("hidden")}),f.snapshotUnsub=M.streamAll(n=>{f.lastSnapshotDocs=n,oe(n)},()=>{const n=document.getElementById("online-users-list");n&&(n.innerHTML='<div class="dropdown-loading">Fehler beim Laden</div>')}),f.rendererTimer&&clearInterval(f.rendererTimer),f.rendererTimer=setInterval(()=>{f.lastSnapshotDocs.length>0&&oe(f.lastSnapshotDocs)},et))},async markOffline(){const e=f.user;this.onLogout(),e&&await M.upsertPresence(e,!1)},__test__:{getState(){return f},renderOnlineUsers:oe}},rt="silbersbach";function W(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[bulletinRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("bulletinBoard")}function ke(){return window.firebase.firestore.FieldValue}function st(e){return e&&(e.displayName||(e.email?String(e.email).split("@")[0]:null))||"Unbekannt"}const G={TENANT_ID:rt,async add({message:e,sender:t}){return await W().add({message:e,sender:t||"Unbekannt",timestamp:Date.now(),isDone:!1})},async markDone(e,t){if(!e)return;const n=t||(window.firebase?.auth?.()?.currentUser??null);await W().doc(e).update({isDone:!0,doneAt:ke().serverTimestamp(),doneBy:st(n)})},async reopen(e){if(!e)return;const t=ke();await W().doc(e).update({isDone:!1,doneAt:t.delete(),doneBy:t.delete()})},async delete(e){e&&await W().doc(e).delete()},streamAll(e,t){return W().orderBy("timestamp","desc").onSnapshot(n=>{const i=n.docs.map(o=>({id:o.id,...o.data()}));try{e(i)}catch(o){console.error("[bulletinRepo] streamAll callback error:",o)}},n=>{console.error("[bulletinRepo] Firestore Snapshot Error:",n),typeof t=="function"&&t(n)})}},Ee=3;function $e(e){return e?new Date(e).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"Unbekannt"}function at(e){const t=ct(e),n=t.filter(o=>!o?.isDone),i=t.filter(o=>!!o?.isDone).sort((o,r)=>{const a=typeof o?.doneAt=="number",l=typeof r?.doneAt=="number";return a&&l?r.doneAt-o.doneAt:a?-1:l?1:0});return{open:n,done:i}}function lt(e){if(e==null)return"unbekannt";let t=null;if(typeof e=="number")t=e;else if(typeof e.toMillis=="function")t=e.toMillis();else if(typeof e.toDate=="function"){const n=e.toDate();n instanceof Date&&(t=n.getTime())}return t==null||Number.isNaN(t)?"unbekannt":new Date(t).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}function ct(e){return Array.isArray(e)?[...e].sort((t,n)=>(n?.timestamp||0)-(t?.timestamp||0)):[]}function T(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Pe="bulletin.activeTab",k={user:null,snapshotUnsub:null,listenersAttached:!1,currentOpenItems:[],currentDoneItems:[],activeTab:"open"};function re(){try{const e=window.localStorage?.getItem(Pe);if(e==="done"||e==="open")return e}catch{}return"open"}function dt(e){try{window.localStorage?.setItem(Pe,e)}catch{}}function D(e,t){if(typeof window.showToast=="function")try{window.showToast(e,t)}catch{}}async function ut(e,t,n){if(typeof window.showConfirm=="function")try{return await window.showConfirm(e,t,n)}catch{return!1}return window.confirm?window.confirm(e):!1}function ft(){try{const e=window.firebase?.auth?.().currentUser;return e?e.displayName||(e.email?e.email.split("@")[0]:"Unbekannt"):"Unbekannt"}catch{return"Unbekannt"}}function Le(e){const t=$e(e.timestamp),n=T(e.sender||"Unbekannt"),i=T(e.message||""),o=T(e.id);return`
        <div class="bulletin-item-header">
            <span class="bulletin-item-sender">${n}</span>
            <span class="bulletin-item-date">${t}</span>
        </div>
        <div class="bulletin-item-content">${i}</div>
        <div style="text-align: right; margin-top: 0.5rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="bulletin-done-btn" data-id="${o}" title="Erledigt">
                <i class="ti ti-check"></i> Erledigt
            </button>
            <button class="bulletin-delete-btn" data-id="${o}" aria-label="Löschen">
                <i class="ti ti-trash"></i>
            </button>
        </div>
    `}function ht(e){const t=$e(e.timestamp),n=T(e.sender||"Unbekannt"),i=T(e.message||""),o=T(e.id),r=e&&Object.prototype.hasOwnProperty.call(e,"doneAt")?e.doneAt:null,a=lt(r),l=T(e.doneBy||"unbekannt");return`
        <div class="bulletin-item-header">
            <span class="bulletin-item-sender">${n}</span>
            <span class="bulletin-item-date">${t}</span>
        </div>
        <div class="bulletin-item-content bulletin-item-content--done">${i}</div>
        <div class="bulletin-done-meta">
            <i class="ti ti-check"></i>
            <span>Erledigt am <strong>${a}</strong> von <strong>${l}</strong></span>
        </div>
        <div style="text-align: right; margin-top: 0.5rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="bulletin-reopen-btn" data-id="${o}" title="Wieder oeffnen">
                <i class="ti ti-arrow-back-up"></i> Wieder öffnen
            </button>
            <button class="bulletin-delete-btn" data-id="${o}" aria-label="Löschen">
                <i class="ti ti-trash"></i>
            </button>
        </div>
    `}function gt(e){const t=T(e.id);return`
        <span class="bulletin-preview-text">${T(e.message||"")}</span>
        <div class="bulletin-preview-actions">
            <button class="bulletin-done-btn-sm" data-id="${t}" title="Erledigt">
                <i class="ti ti-check"></i>
            </button>
            <button class="bulletin-delete-btn-sm" data-id="${t}" title="Löschen">
                <i class="ti ti-trash"></i>
            </button>
        </div>
    `}function xe(e,t){const n=document.getElementById("bulletin-list"),i=document.getElementById("bulletin-list-done"),o=document.getElementById("bulletin-list-dashboard"),r=document.getElementById("bulletin-badge"),a=document.getElementById("bulletin-preview"),l=document.getElementById("bulletin-tab-count-open"),c=document.getElementById("bulletin-tab-count-done");n&&(n.innerHTML="",e.length===0?n.innerHTML='<p class="bulletin-empty">Keine offenen Aufgaben.</p>':e.forEach(u=>{const h=document.createElement("div");h.className="bulletin-item",h.innerHTML=Le(u),n.appendChild(h)})),i&&(i.innerHTML="",t.length===0?i.innerHTML='<p class="bulletin-empty">Noch keine erledigten Aufgaben.</p>':t.forEach(u=>{const h=document.createElement("div");h.className="bulletin-item bulletin-item--done",h.innerHTML=ht(u),i.appendChild(h)})),l&&(l.textContent=String(e.length),l.classList.toggle("hidden",e.length===0)),c&&(c.textContent=String(t.length),c.classList.toggle("hidden",t.length===0)),o&&(o.innerHTML="",e.length===0?o.innerHTML='<p class="bulletin-empty">Keine Nachrichten vorhanden.</p>':e.slice(0,Ee).forEach(u=>{const h=document.createElement("div");h.className="bulletin-item",h.innerHTML=Le(u),o.appendChild(h)})),r&&(r.textContent=String(e.length),r.classList.toggle("hidden",e.length===0)),a&&(a.innerHTML="",e.length===0?a.innerHTML='<p class="bulletin-empty">Keine neuen Aushänge...</p>':e.slice(0,Ee).forEach(u=>{const h=document.createElement("div");h.className="bulletin-preview-item",h.innerHTML=gt(u),a.appendChild(h)}))}function Y(){const e=document.getElementById("bulletin-tab-open"),t=document.getElementById("bulletin-tab-done"),n=document.getElementById("bulletin-list"),i=document.getElementById("bulletin-list-done"),o=k.activeTab==="done";e&&e.classList.toggle("active",!o),e&&e.setAttribute("aria-selected",o?"false":"true"),t&&t.classList.toggle("active",o),t&&t.setAttribute("aria-selected",o?"true":"false"),n&&n.classList.toggle("hidden",o),i&&i.classList.toggle("hidden",!o)}function fe(e){e!=="open"&&e!=="done"||k.activeTab!==e&&(k.activeTab=e,dt(e),Y())}function se(){const e=document.getElementById("stats-detail-bulletin");if(!e)return;const t=k.currentOpenItems;let n='<div style="display: flex; flex-direction: column; gap: 0.5rem;">';t.length?t.forEach(i=>{const o=T(i.message||""),r=T(i.sender||"Unbekannt");n+=`
                <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 0.9rem;">
                    <div style="font-weight: 500; margin-bottom: 4px;">${o}</div>
                    <div style="font-size: 0.75rem; opacity: 0.5;">Von ${r}</div>
                </div>
            `}):n+="<p style='opacity:0.5'>Keine offenen Aufgaben.</p>",n+="</div>",e.innerHTML=n}async function Fe(e){if(e)try{await G.markDone(e,k.user||window.firebase?.auth?.()?.currentUser),D("Aushang als erledigt markiert","success")}catch(t){console.error("[bulletin] markDone error:",t),D("Fehler beim Aktualisieren","error")}}async function _e(e){if(e)try{await G.reopen(e),D("Aushang wieder geöffnet","success")}catch(t){console.error("[bulletin] reopen error:",t),D("Fehler beim Aktualisieren","error")}}async function Ne(e,{confirm:t=!0}={}){if(e&&!(t&&!await ut("Aushang unwiderruflich löschen?","Aushang löschen","Löschen")))try{await G.delete(e),D("Aushang gelöscht","delete")}catch(n){console.error("[bulletin] delete error:",n),D("Fehler beim Löschen","error")}}function K(e){!e||e.dataset.bulletinDelegated==="1"||(e.dataset.bulletinDelegated="1",e.addEventListener("click",async t=>{const n=t.target;if(!n||typeof n.closest!="function")return;const i=n.closest(".bulletin-preview-text");if(i&&e.contains(i)){typeof window.toggleDashboardFeed=="function"&&window.toggleDashboardFeed("bulletin");return}const o=n.closest(".bulletin-done-btn")||n.closest(".bulletin-done-btn-sm");if(o&&e.contains(o)){t.stopPropagation(),await Fe(o.dataset.id);return}const r=n.closest(".bulletin-reopen-btn");if(r&&e.contains(r)){t.stopPropagation(),await _e(r.dataset.id);return}const a=n.closest(".bulletin-delete-btn")||n.closest(".bulletin-delete-btn-sm");a&&e.contains(a)&&(t.stopPropagation(),await Ne(a.dataset.id))}))}function pt(){const e=document.getElementById("bulletin-tab-open"),t=document.getElementById("bulletin-tab-done");e&&e.dataset.bulletinTabBound!=="1"&&(e.dataset.bulletinTabBound="1",e.addEventListener("click",()=>fe("open"))),t&&t.dataset.bulletinTabBound!=="1"&&(t.dataset.bulletinTabBound="1",t.addEventListener("click",()=>fe("done"))),Y()}async function ae({inputEl:e,buttonEl:t,busyLabel:n="Wird gesendet..."}){if(!e)return;const i=e.value.trim();if(!i)return;const o=t?t.innerHTML:null;t&&(t.disabled=!0,o&&n&&(t.innerHTML=n));try{await G.add({message:i,sender:ft()}),e.value="",D("Aushang erfolgreich erstellt","success")}catch(r){console.error("[bulletin] submit error:",r),D("Fehler beim Senden","error")}finally{t&&(t.disabled=!1,o!==null&&(t.innerHTML=o))}}const mt={onLogin(e){this.onLogout(),k.user=e,k.activeTab=re(),(document.getElementById("bulletin-list")||document.getElementById("bulletin-list-done")||document.getElementById("bulletin-preview")||document.getElementById("bulletin-list-dashboard"))&&(k.snapshotUnsub=G.streamAll(n=>{const{open:i,done:o}=at(n);k.currentOpenItems=i,k.currentDoneItems=o,xe(i,o),Y(),se()},n=>{console.error("[bulletin] snapshot error:",n)}))},onLogout(){if(typeof k.snapshotUnsub=="function")try{k.snapshotUnsub()}catch{}k.snapshotUnsub=null,k.currentOpenItems=[],k.currentDoneItems=[],k.user=null},initUI(){if(k.listenersAttached)return;k.listenersAttached=!0;const e=document.getElementById("bulletin-submit-btn"),t=document.getElementById("bulletin-input");e&&t&&e.addEventListener("click",()=>{ae({inputEl:t,buttonEl:e})});const n=document.getElementById("bulletin-submit-dashboard"),i=document.getElementById("bulletin-input-dashboard");n&&i&&n.addEventListener("click",()=>{ae({inputEl:i,buttonEl:n,busyLabel:""})}),K(document.getElementById("bulletin-list")),K(document.getElementById("bulletin-list-done")),K(document.getElementById("bulletin-list-dashboard")),K(document.getElementById("bulletin-preview")),k.activeTab=re(),pt()},renderStatsDetail(){se()},__test__:{getState(){return k},renderLists:xe,renderStatsDetailInternal:se,handleSubmit:ae,handleDoneClick:Fe,handleReopenClick:_e,handleDeleteClick:Ne,setActiveTab:fe,applyActiveTabUi:Y,loadPersistedTab:re}},wt="silbersbach";function bt(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[fcmTokenRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("fcmTokens")}function yt(){return window.firebase.firestore.FieldValue}const Ue={TENANT_ID:wt,async upsertToken({token:e,userId:t,userName:n,device:i,version:o}){e&&await bt().doc(e).set({token:e,userId:t||"anon",userName:n||"Unbekannt",device:i||"unknown",version:o||"",updatedAt:yt().serverTimestamp()},{merge:!0})}};async function Se({swReg:e,vapidKey:t,appVersion:n,maxAttempts:i=3}){if(!e){console.warn("[FCM] Kein Service Worker vorhanden");return}if(typeof Notification>"u"||Notification.permission!=="granted")return;let o=e.active;if((!o||o.state!=="activated")&&(await new Promise(l=>setTimeout(l,2500)),o=e.active,!o||o.state!=="activated")){console.warn("[FCM] Service Worker nicht aktiviert, ueberspringe");return}let r=window.firebase?.auth?.()?.currentUser;if(!r&&(await new Promise(l=>setTimeout(l,2e3)),r=window.firebase?.auth?.()?.currentUser,!r)){console.warn("[FCM] Kein User nach Warten, ueberspringe");return}const a=window.firebase.messaging();for(let l=1;l<=i;l++)try{const c=await a.getToken({vapidKey:t,serviceWorkerRegistration:e});if(c){if(r=window.firebase?.auth?.()?.currentUser,await Ue.upsertToken({token:c,userId:r?r.uid:"anon",userName:r?r.displayName||r.email||"Nutzer":"Unbekannt",device:typeof navigator<"u"&&navigator.userAgent?navigator.userAgent.substring(0,100):"unknown",version:n}),typeof window.showToast=="function")try{window.showToast("Push-Benachrichtigungen aktiv!","success")}catch{}return}return}catch(c){if(console.warn(`[FCM] Versuch ${l}/${i}:`,c.code||c.name),(c.code===20||c.name==="AbortError")&&l<i){await new Promise(u=>setTimeout(u,3e3*l));continue}l===i&&console.error("[FCM] Token-Registrierung fehlgeschlagen nach",i,"Versuchen");break}}async function vt({appVersion:e}){if(!window.Capacitor||!window.Capacitor.Plugins||!window.Capacitor.Plugins.PushNotifications){console.warn("Capacitor Push Plugin nicht gefunden.");return}const{PushNotifications:t}=window.Capacitor.Plugins;let n=await t.checkPermissions();if(n.receive==="prompt"&&(n=await t.requestPermissions()),n.receive!=="granted"){if(typeof window.showToast=="function")try{window.showToast("Push-Berechtigung verweigert.","error")}catch{}return}t.addListener("registration",async i=>{const o=i.value,r=window.firebase?.auth?.()?.currentUser;try{if(await Ue.upsertToken({token:o,userId:r?r.uid:"anon",userName:r?r.displayName||r.email||"Nutzer":"Unbekannt",device:"Android Native App",version:e}),typeof window.showToast=="function")try{window.showToast("Native Push aktiv!","success")}catch{}}catch(a){console.error("[FCM-Native] upsertToken error:",a)}}),t.addListener("registrationError",i=>{console.error("Push registration error:",i)}),t.addListener("pushNotificationReceived",i=>{console.log("Push empfangen:",i)}),t.addListener("pushNotificationActionPerformed",i=>{console.log("Push-Aktion ausgefuehrt:",i)}),await t.register()}const he="BDy4YWtERHAaFyUQHr7URTCHbsFC_AwMImJJ5U_AlFrdF_uhsHtEMZMybDXdZWUkapxR9X5JzoKJFAHXvYSIEQg",x={initialized:!1,pendingClickListener:null,pendingTouchListener:null};function kt(){return!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform())}async function Et({swReg:e,appVersion:t}){const n=window.firebase;if(!n||!n.messaging)return;try{if(!await n.messaging.isSupported())return}catch{return}if(typeof Notification>"u")return;const i=Notification.permission;if(i==="granted"){await Se({swReg:e,vapidKey:he,appVersion:t});return}if(i==="default"){const o=async()=>{window.removeEventListener("click",o),window.removeEventListener("touchstart",o),x.pendingClickListener=null,x.pendingTouchListener=null;try{await Notification.requestPermission()==="granted"&&await Se({swReg:e,vapidKey:he,appVersion:t})}catch(r){console.error("Fehler bei Push-Berechtigung:",r)}};x.pendingClickListener=o,x.pendingTouchListener=o,window.addEventListener("click",o),window.addEventListener("touchstart",o,{passive:!0});return}if(i==="denied"&&typeof window.showToast=="function")try{window.showToast("BLOCKIERT! Bitte in den Handy-Einstellungen (App Info) erlauben.","error")}catch{}}const Lt={async init({swReg:e=null,appVersion:t=""}={}){if(!x.initialized){x.initialized=!0;try{if(kt()){await vt({appVersion:t});return}await Et({swReg:e,appVersion:t})}catch(n){console.error("[notifications] init error:",n)}}},__test__:{getState(){return x},reset(){if(x.pendingClickListener)try{window.removeEventListener("click",x.pendingClickListener)}catch{}if(x.pendingTouchListener)try{window.removeEventListener("touchstart",x.pendingTouchListener)}catch{}x.initialized=!1,x.pendingClickListener=null,x.pendingTouchListener=null},VAPID_KEY:he}},xt="silbersbach";function O(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[entriesRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("entries")}function St(){return window.firebase.firestore.FieldValue}const V={TENANT_ID:xt,async add(e){return{id:(await O().add(e)).id}},async delete(e){e&&await O().doc(e).delete()},async updateImageBase64(e,t){e&&await O().doc(e).update({imageBase64:t})},async clearImages(e){if(!e)return;const t=St();await O().doc(e).update({imageBase64:t.delete(),imageUrl:t.delete()})},streamByDatumDesc(e,t){return O().orderBy("datum","desc").onSnapshot(n=>{const i=n.docs.map(o=>({id:o.id,...o.data()}));e(i)},n=>{console.error("[entriesRepo] Snapshot Error:",n),typeof t=="function"&&t(n)})}};function Tt(e){if(!Array.isArray(e))return{};const t={};for(const n of e){const i=n?.wildart;i&&(t[i]=(t[i]||0)+1)}return t}function Bt(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(n?.wildart!=="Rehwild")continue;const i=n.unterart||"Unbekannt";t[i]=(t[i]||0)+1}return t}function It(e){return Array.isArray(e)?e.map(t=>({Datum:t.datum||"",Wildart:t.wildart||"",Unterart:t.unterart||"",Erleger:t.erleger||"",Bemerkung:t.bemerkung||"",Foto:t.imageBase64||t.imageUrl?"Ja":"Nein"})):[]}function $(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Ct=75e4,E={user:null,snapshotUnsub:null,listenersAttached:!1,currentEntries:[]};function S(e,t){if(typeof window.showToast=="function")try{window.showToast(e,t)}catch{}}async function zt(e,t,n){if(typeof window.showConfirm=="function")try{return await window.showConfirm(e,t,n)}catch{return!1}return window.confirm?window.confirm(e):!1}function At(){return Array.isArray(window.jagdzeitenBayern)?window.jagdzeitenBayern:[]}function Mt(e,t){if(typeof window.getWildartIconHTML=="function"){const n=window.getWildartIconHTML(e,t);if(n)return n}return'<span style="font-size: 20px;">🦌</span>'}function Dt(e,t=600,n=.6){return new Promise((i,o)=>{const r=new FileReader;r.onload=a=>{const l=new Image;l.onload=()=>{const c=document.createElement("canvas");let u=l.width,h=l.height;u>t&&(h=h*t/u,u=t),c.width=u,c.height=h,c.getContext("2d").drawImage(l,0,0,u,h),i(c.toDataURL("image/jpeg",n))},l.onerror=o,l.src=a.target.result},r.onerror=o,r.readAsDataURL(e)})}function Ht(e){const t=document.getElementById("strecke-count");t&&(t.textContent=String(e.length));const n=document.getElementById("rehwild-count");n&&(n.textContent=String(e.filter(i=>i.wildart==="Rehwild").length))}function j(){const e=document.getElementById("stats-detail-strecke"),t=document.getElementById("stats-detail-rehwild"),n=E.currentEntries,i=Object.entries(Tt(n)).sort((r,a)=>a[1]-r[1]);if(e){let r='<div style="display: flex; flex-direction: column; gap: 0.5rem;">';i.length?i.forEach(([a,l])=>{const c=$(a);r+=`<div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;"><span>${c}</span><span style="font-weight: bold; color: var(--primary-light);">${l}</span></div>`}):r+="<p style='opacity:0.5'>Keine Daten vorhanden.</p>",r+="</div>",e.innerHTML=r}const o=Object.entries(Bt(n)).sort((r,a)=>a[1]-r[1]);if(t){let r='<div style="display: flex; flex-direction: column; gap: 0.5rem;">';o.length?o.forEach(([a,l])=>{const c=$(a);r+=`<div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;"><span>${c}</span><span style="font-weight: bold; color: var(--primary-light);">${l}</span></div>`}):r+="<p style='opacity:0.5'>Keine Daten vorhanden.</p>",r+="</div>",t.innerHTML=r}}function $t(){const e=document.getElementById("entry-list"),t=document.getElementById("entry-list-dashboard");e&&(e.innerHTML=""),t&&(t.innerHTML="");const n=E.currentEntries,i=At();n.forEach((o,r)=>{const a=document.createElement("li");a.className="entry-item";const l=i.find(b=>b.name===o.wildart||b.id===o.wildart),c=l?Mt(l.iconClass,28):'<span style="font-size: 20px;">🦌</span>',u=document.createElement("div");u.className="feed-card-header",u.style.marginBottom="0.2rem";const h=$(o.wildart||""),L=$(o.unterart||""),H=$(o.datum||""),q=$(o.erleger||"");u.innerHTML=`
            <div class="feed-card-icon-container">${c}</div>
            <div class="feed-card-header-text">
                <span class="feed-card-title">${h} ${L}</span>
                <span class="feed-card-time">${H} • ${q}</span>
            </div>`;const s=document.createElement("button");if(s.className="entry-delete-btn",s.dataset.idx=String(r),s.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>',Object.assign(s.style,{background:"rgba(255,255,255,0.1)",border:"none",color:"var(--primary-light)",padding:"0.5rem",borderRadius:"8px",cursor:"pointer",marginLeft:"auto"}),u.appendChild(s),a.appendChild(u),o.bemerkung){const b=document.createElement("div");b.className="entry-notes",b.textContent=o.bemerkung,a.appendChild(b)}const w=document.createElement("div");w.className="entry-foto-section";const m=o.imageBase64||o.imageUrl,p=$(o.id);if(m){w.innerHTML=`
                <div class="entry-foto-thumbnail">
                    <img src="" alt="Streckenfoto" class="entry-foto-img" data-id="${p}">
                    <button type="button" class="entry-foto-delete-btn" data-id="${p}" aria-label="Foto löschen">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="2.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>
                    </button>
                </div>`;const b=w.querySelector(".entry-foto-img");b&&(b.src=m)}const g=document.createElement("button");g.type="button",g.className="entry-foto-btn",g.dataset.id=o.id,g.innerHTML=`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>${m?"Ändern":"Foto hinzufügen"}`,w.appendChild(g),a.appendChild(w),e&&e.appendChild(a.cloneNode(!0)),t&&t.appendChild(a.cloneNode(!0))}),Pt(),Ft()}async function Pt(){document.querySelectorAll("#entry-list .entry-delete-btn, #entry-list-dashboard .entry-delete-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=Number(e.dataset.idx),n=E.currentEntries[t];if(n?.id)try{await V.delete(n.id),S("Eintrag gelöscht","delete")}catch(i){console.error("[streckenliste] delete",i),S("Fehler beim Löschen","error")}})})}function Ft(){document.querySelectorAll(".entry-foto-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.id;if(!t)return;const n=document.createElement("input");n.type="file",n.accept="image/*",n.click(),n.onchange=async()=>{const i=n.files[0];if(!i)return;const o=e.innerHTML;try{e.disabled=!0,e.innerHTML='<svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="30" stroke-dashoffset="10"/></svg> Lädt...';const r=await Dt(i);if(r.length>Ct)throw new Error("Bild zu groß, bitte kleineres Bild wählen");await V.updateImageBase64(t,r),S("Foto gespeichert","success")}catch(r){console.error("[streckenliste] foto",r),S(r.message||"Fehler beim Speichern","error"),e.disabled=!1,e.innerHTML=o}}})}),document.querySelectorAll(".entry-foto-img").forEach(e=>{e.addEventListener("click",()=>{typeof window.openImageModal=="function"&&window.openImageModal(e.src)})}),document.querySelectorAll(".entry-foto-delete-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=e.dataset.id;if(t&&await zt("Möchten Sie das Foto wirklich löschen?","Foto löschen","Löschen"))try{await V.clearImages(t),S("Foto gelöscht","delete")}catch(n){console.error("[streckenliste] foto-delete",n),S("Fehler beim Löschen","error")}})})}function _t(){window.openImageModal=function(t){const n=document.createElement("div");n.className="image-modal-overlay",n.innerHTML='<div class="image-modal-content"><img src="" alt="Foto"><button type="button" class="image-modal-close" aria-label="Schließen">✕</button></div>';const i=n.querySelector("img");i&&(i.src=t),document.body.appendChild(n),n.addEventListener("click",o=>{(o.target===n||o.target.closest(".image-modal-close"))&&n.remove()})}}function Nt(e,t){!e||!t||e.addEventListener("change",()=>{const n=e.value;let i="";n==="Rehwild"&&(i='<label > Unterart <select name="unterart" ><option>Geiß</option><option>Bock</option><option>Kitz</option><option>Schmal</option></select></label> '),(n==="Rotwild"||n==="Dammwild")&&(i='<label > Unterart <select name="unterart" ><option>Hirsch</option><option>Alttier</option><option>Schmaltier</option><option>Spießer</option></select></label> '),n==="Schwarzwild"&&(i='<label > Unterart <select name="unterart" ><option>Keiler</option><option>Bache</option><option>Frischling</option><option>Überläufer</option></select></label> '),(n==="Raubwild"||n==="Federwild")&&(i='<label > Bemerkung <input type="text" name="unterart" ></label> '),t.innerHTML=i})}const Ut={onLogin(e){this.onLogout(),E.user=e,(document.getElementById("entry-list")||document.getElementById("entry-list-dashboard"))&&(E.snapshotUnsub=V.streamByDatumDesc(n=>{E.currentEntries=n,Ht(n),$t(),j()}))},onLogout(){if(typeof E.snapshotUnsub=="function")try{E.snapshotUnsub()}catch{}E.snapshotUnsub=null,E.user=null,E.currentEntries=[];const e=document.getElementById("entry-list"),t=document.getElementById("entry-list-dashboard");e&&(e.innerHTML=""),t&&(t.innerHTML="");const n=document.getElementById("strecke-count");n&&(n.textContent="0");const i=document.getElementById("rehwild-count");i&&(i.textContent="0"),j()},initUI(){if(_t(),E.listenersAttached)return;E.listenersAttached=!0;const e=document.getElementById("entry-modal"),t=document.getElementById("entry-form"),n=document.getElementById("cancel-entry"),i=document.getElementById("wildart"),o=document.getElementById("subcategory-container"),r=document.getElementById("add-entry-btn"),a=document.getElementById("fab-add-btn"),l=document.getElementById("fab-export-btn");Nt(i,o),a&&e&&a.addEventListener("click",()=>{e.classList.remove("hidden")}),r&&e&&r.addEventListener("click",()=>{e.classList.remove("hidden")}),l&&l.addEventListener("click",()=>{if(!E.currentEntries.length){S("Keine Einträge zum Exportieren vorhanden","info");return}try{if(typeof window.XLSX>"u")throw new Error("XLSX");const c=It(E.currentEntries),u=window.XLSX.utils.book_new(),h=window.XLSX.utils.json_to_sheet(c);h["!cols"]=[{wch:12},{wch:20},{wch:20},{wch:20},{wch:40},{wch:10}],window.XLSX.utils.book_append_sheet(u,h,"Streckenliste"),window.XLSX.writeFile(u,`Streckenliste_Silbersbach_${new Date().toISOString().split("T")[0]}.xlsx`),S("Excel-Export erfolgreich","success")}catch(c){console.error("[streckenliste] export",c),S("Fehler beim Exportieren","error")}}),n&&t&&e&&o&&n.addEventListener("click",()=>{e.classList.add("hidden"),t.reset(),o.innerHTML=""}),t&&e&&o&&t.addEventListener("submit",async c=>{c.preventDefault();const u=new FormData(t),h={};u.forEach((L,H)=>{h[H]=L});try{await V.add(h),S("Eintrag gespeichert","success"),t.reset(),o.innerHTML="",e.classList.add("hidden")}catch(L){console.error("[streckenliste] add",L),S("Fehler beim Speichern","error")}})},renderStatsDetail(){j()},__test__:{getState(){return E},renderStatsDetailInternal:j,setEntriesForTest(e){E.currentEntries=e,j()}}};function Te(e,t=new Date().getFullYear()){const[n,i]=e.split(".").map(Number);return new Date(t,i-1,n)}function Q(e,t=new Date){if(e.keineJagdzeit)return!0;if(e.ganzjaehrig)return!1;const n=t.getFullYear(),i=Te(e.jagdzeitStart,n),o=Te(e.jagdzeitEnde,n);return i>o?t>o&&t<i:t<i||t>o}function Rt(e){return e.keineJagdzeit?"Keine Jagdzeit":`Jagdzeit: ${e.jagdzeitStart} - ${e.jagdzeitEnde}`}const Wt=["rehbock","reh","wildschwein","gams","muffelwild","dachs","marder","iltis","hermelin","mauswiesel","ente","fasan","deer","crow","eichelhaeher","fox","rabbit"],Ot=new Set(Wt);function jt(e){return Array.isArray(e)?e.filter(t=>Ot.has(t.iconClass)):[]}function Vt(e,t,n=new Date){let i=jt(t);return e==="schonzeit"?i=i.filter(o=>Q(o,n)):e==="jagdzeit"&&(i=i.filter(o=>!Q(o,n))),i}function Gt(e,t=new Date){return Array.isArray(e)?e.filter(n=>!Q(n,t)&&!n.keineJagdzeit):[]}const C={aktuellerFilter:"alle",schonzeitIndex:0,schonzeitInterval:null,listenersAttached:!1};function Re(){return Array.isArray(window.jagdzeitenBayern)?window.jagdzeitenBayern:[]}function qt(e,t){if(typeof window.getWildartIconHTML=="function"){const n=window.getWildartIconHTML(e,t);if(n)return n}return""}function Be(){const e=document.getElementById("schonzeit-icon"),t=document.getElementById("schonzeit-wildart"),n=document.getElementById("schonzeit-datum"),i=document.getElementById("schonzeit-indicator"),o=document.getElementById("schonzeit-status-text");if(!e||!t||!n||!i||!o)return;const r=Gt(Re());if(r.length===0){e.style.display="none",t.textContent="Keine aktiven Jagdzeiten",n.textContent="Alle Wildarten haben aktuell Schonzeit",i.className="schonzeit-indicator closed",o.textContent="Schonzeit";return}const a=r[C.schonzeitIndex%r.length];e.style.display="none",t.textContent=a.name,n.textContent=Rt(a),i.className="schonzeit-indicator open",o.textContent="Jagdzeit",C.schonzeitIndex+=1}function Ie(e){C.aktuellerFilter=e,document.querySelectorAll(".schonzeit-filter-btn").forEach(t=>{t.classList.remove("active")}),document.querySelector(`[data-filter="${e}"]`)?.classList.add("active"),We()}function Kt(e=new Date){const t=Vt(C.aktuellerFilter,Re(),e);return t.length===0?'<div class="schonzeit-empty"><p>Keine Wildarten gefunden.</p></div>':t.map(n=>{const i=Q(n,e),o=i?"closed":"open",r=i?"Schonzeit":"Jagdzeit",a=n.keineJagdzeit?"Ganzjährige Schonzeit":n.ganzjaehrig?"Ganzjährig bejagbar":`Jagdzeit: ${n.jagdzeitStart||"-"} - ${n.jagdzeitEnde||"-"}`;return`
                <div class="wildart-card">
                    <div class="wildart-icon">
                        ${qt(n.iconClass,44)}
                    </div>
                    <div class="wildart-info">
                        <h3 class="wildart-name">${n.name}</h3>
                        <p class="wildart-zeit">${a}</p>
                    </div>
                    <div class="wildart-status ${o}">
                        <div class="wildart-indicator"></div>
                        <span>${r}</span>
                    </div>
                </div>
            `}).join("")}function We(){const e=document.getElementById("schonzeit-liste"),t=document.getElementById("schonzeit-liste-dashboard");if(!e&&!t)return;const n=Kt();e&&(e.innerHTML=n),t&&(t.innerHTML=n)}const Jt={initUI(){C.schonzeitInterval!==null&&(clearInterval(C.schonzeitInterval),C.schonzeitInterval=null),C.listenersAttached||(C.listenersAttached=!0,window.filterSchonzeitListe=e=>Ie(e)),Be(),C.schonzeitInterval=window.setInterval(Be,5e3)},setFilterAndRender(e){Ie(e)},renderListe(){We()}};function Zt(e,t,n){return`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${e},${t}?unitGroup=metric&key=${n}&include=current,days`}function pe(e){return["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][Math.floor(e/22.5+.5)%16]}function le(e){if(!e)return null;const t=String(e).split(":");return parseInt(t[0],10)*60+parseInt(t[1],10)}function Ce(e){const t=Math.floor(e/60),n=e%60;return t>0?`${t}h ${n}min`:`${n} min`}function _(e){return e?String(e).substring(0,5):"--:--"}function Xt(e){return e===0?"Neumond":e<.25?"Zunehmend":e===.25?"1. Viertel":e<.5?"Zunehmend":e===.5?"Vollmond":e<.75?"Abnehmend":e===.75?"3. Viertel":"Abnehmend"}function Yt(e){return e===0?"Neumond":e<.25?"Zunehmende Sichel":e===.25?"Erstes Viertel":e<.5?"Zunehmender Mond":e===.5?"Vollmond":e<.75?"Abnehmender Mond":e===.75?"Letztes Viertel":"Abnehmende Sichel"}function Qt(e){return e<=2?"Niedrig":e<=5?"Moderat":e<=7?"Hoch":e<=10?"Sehr hoch":"Extrem"}function en(e){return e&&e.length?e.join(", "):"Kein Niederschlag"}function tn(e){if(!e)return"";const t={Clear:"Klar","Partially cloudy":"Teils bewölkt",Overcast:"Bedeckt",Rain:"Regen",Snow:"Schnee",Fog:"Nebel",Thunderstorm:"Gewitter",Drizzle:"Nieselregen",Cloudy:"Bewölkt","Rain, Overcast":"Regen & Bedeckt","Rain, Partially cloudy":"Leichter Regen","Snow, Overcast":"Schnee & Bedeckt","Rain, Thunder":"Gewitter","Freezing Drizzle/Freezing Rain":"Eisregen","Light Rain":"Leichter Regen","Heavy Rain":"Starkregen"},n={Clear:"Klar",Overcast:"Bedeckt",Rain:"Regen",Snow:"Schnee",Fog:"Nebel",Drizzle:"Nieselregen",Cloudy:"Bewölkt",Thunder:"Gewitter"},i=String(e).split(",")[0].trim();return t[e]||n[i]||i}function nn(e){const t=e.currentConditions||{},n=e.days&&e.days[0]?e.days[0]:null,i=Yt(t.moonphase??0),o=t.uvindex||0,r=Qt(o),a=en(t.preciptype),l=pe(t.winddir||0),c=((t.moonphase??0)*100).toFixed(0);return`
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
                    <span>${l} (${t.winddir?.toFixed(0)??"--"}°)</span>
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
                    <span>${a}</span>
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
                    <span>${_(n?.sunrise)}</span>
                </div>
                <div class="wetter-detail-row highlight">
                    <span>Sonnenuntergang</span>
                    <span>${_(n?.sunset)}</span>
                </div>
                <div class="wetter-detail-row">
                    <span>UV-Index</span>
                    <span>${o} (${r})</span>
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
                <div class="wetter-detail-main">${i}</div>
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
    `}const ze={lat:49.2,lon:13.05},on="YLF2SPSJ98MKAFEXGKRQRSFBW",F={cached:null,widgetClickAttached:!1},ce=`<svg class="wetter-sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="9" x2="12" y2="3"/>
        <polyline points="9 6 12 3 15 6"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
        <line x1="23" y1="22" x2="1" y2="22"/>
    </svg>`,Ae=`<svg class="wetter-sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="3" x2="12" y2="9"/>
        <polyline points="9 6 12 9 15 6"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
        <line x1="23" y1="22" x2="1" y2="22"/>
    </svg>`;function rn(e,t){const n=document.getElementById("sun-text"),i=document.querySelector(".wetter-sun-icon");if(!n||!e)return;const o=new Date,r=o.getHours()*60+o.getMinutes(),a=e.sunrise?le(e.sunrise):null,l=e.sunset?le(e.sunset):null,c=t&&t.sunrise?le(t.sunrise):null;let u="",h=ce;if(a!==null&&r<a){const L=a-r;u=`Sonnenaufgang in ${Ce(L)} (${_(e.sunrise)})`,h=ce}else if(l!==null&&r<l){const L=l-r;u=`Sonnenuntergang in ${Ce(L)} (${_(e.sunset)})`,h=Ae}else c!==null?(u=`Sonnenaufgang morgen (${_(t.sunrise)})`,h=ce):(u=`Sonnenuntergang ${_(e.sunset)}`,h=Ae);n.textContent=u,i&&i.parentNode&&(i.outerHTML=h)}function sn(e,t){const n=document.getElementById("hero-temp"),i=document.getElementById("hero-desc"),o=document.getElementById("hero-wind-text"),r=document.getElementById("hero-sun-text");if(n&&e&&(n.textContent=`${e.temp.toFixed(0)}°`),i&&e){const a=e.conditions||"";i.textContent=tn(a)}if(o&&e){const a=pe(e.winddir);o.textContent=`${a} ${e.windspeed.toFixed(0)} km/h`}if(r&&t){const a=t.sunrise?String(t.sunrise).substring(0,5):"--:--";r.textContent=`↑ ${a}`}}function an(e){const t=document.getElementById("wetter-temp");if(t){const o=e.conditions||"";t.querySelector(".wetter-card-value").textContent=`${e.temp.toFixed(0)}°C`,t.querySelector(".wetter-card-label").textContent=o.length>12?`${o.substring(0,12)}...`:o}const n=document.getElementById("wetter-wind");if(n){const o=pe(e.winddir);n.querySelector(".wetter-card-value").textContent=o,n.querySelector(".wetter-card-label").textContent=`${e.windspeed.toFixed(0)} km/h`}const i=document.getElementById("wetter-moon");if(i){const o=Xt(e.moonphase);i.querySelector(".wetter-card-value").textContent=o,i.querySelector(".wetter-card-label").textContent="Mondphase"}}const Oe={getCached(){return F.cached},renderDetailGrid(){const e=document.getElementById("wetter-detail-grid-dashboard")||document.getElementById("wetter-detail-grid");if(e){if(!F.cached){e.innerHTML='<div class="wetter-detail-widget"><p>Wetterdaten werden geladen...</p></div>';return}e.innerHTML=nn(F.cached)}},async refresh(){const e=Zt(ze.lat,ze.lon,on);try{const t=await fetch(e);if(!t.ok)throw new Error("Netzwerkfehler");const n=await t.json();F.cached=n;const i=n.currentConditions,o=n.days&&n.days[0],r=n.days&&n.days[1];an(i),rn(o,r),sn(i,o),Oe.renderDetailGrid()}catch(t){console.error("Wetter Fehler:",t);const n=document.getElementById("sun-text");n&&(n.textContent="Wetter nicht verfügbar")}},initUI(){if(!F.widgetClickAttached){F.widgetClickAttached=!0;const e=document.getElementById("wetter-widget");e&&typeof window.toggleDashboardFeed=="function"&&(e.style.cursor="pointer",e.addEventListener("click",()=>window.toggleDashboardFeed("wetter")))}}};function de(e){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[dokumenteRepo] firebase.firestore nicht verfuegbar");return window.firebase.firestore().collection("users").doc(e).collection("documents")}function ln(){return window.firebase.firestore.FieldValue}const ee={async listAll(e){const t=await de(e).get(),n={};return t.forEach(i=>{n[i.id]=i.data()}),n},async getCategory(e,t){const n=await de(e).doc(t).get();return n.exists?n.data():null},async setCategoryImages(e,t,n){await de(e).doc(t).set({images:n,updatedAt:ln().serverTimestamp()},{merge:!0})}},je=[{id:"jagderlaubnisschein",name:"Jagderlaubnisschein",icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'},{id:"jagdschein",name:"Jagdschein",icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>'},{id:"waffenbesitzkarte",name:"Waffenbesitzkarte",icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>'},{id:"begehungsschein",name:"Begehungsschein",icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="15" r="2"/></svg>'}],A={dokumenteCache:{},globalsAttached:!1};function me(){return window.firebase?.auth?.()?.currentUser||null}function P(e,t){window.showToast?.(e,t)}async function cn(e){const t=window.compressImage;if(typeof t!="function")throw new Error("compressImage nicht verfügbar");return t(e,1200,1200)}function dn(){const e=document.querySelectorAll(".dok-wizard-step"),t=document.querySelectorAll(".dok-wizard-dot"),n=document.getElementById("dok-wizard-prev"),i=document.getElementById("dok-wizard-next");if(!e.length||!n||!i)return;let o=0;const r=e.length;function a(l){e.forEach(c=>c.classList.remove("active")),t.forEach(c=>c.classList.remove("active")),e[l].classList.add("active"),t[l].classList.add("active"),n.classList.toggle("hidden",l===0),i.textContent=l===r-1?"Fertig":"Weiter"}n.onclick=()=>{o>0&&(o-=1,a(o))},i.onclick=()=>{if(o<r-1)o+=1,a(o);else{localStorage.setItem("dokumente_wizard_done","true");const l=document.getElementById("dokumente-wizard"),c=document.getElementById("dokumente-grid");l&&l.classList.add("hidden"),c&&c.classList.remove("hidden"),Ve()}},a(0)}function un(){const e=localStorage.getItem("dokumente_wizard_done"),t=document.getElementById("dokumente-wizard"),n=document.getElementById("dokumente-grid");!t||!n||(e?(t.classList.add("hidden"),n.classList.remove("hidden"),Ve()):(t.classList.remove("hidden"),n.classList.add("hidden"),dn()))}async function Ve(){const e=document.getElementById("dokumente-grid");if(!e)return;const t=me();if(!t){e.innerHTML='<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 2rem;">Bitte zuerst anmelden.</p>';return}e.innerHTML=je.map(n=>`
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
    `).join(""),await fn(t.uid)}async function fn(e){try{A.dokumenteCache=await ee.listAll(e),je.forEach(t=>we(t.id))}catch(t){console.error("Dokumente laden Fehler:",t),P("Fehler beim Laden der Dokumente","error")}}function we(e){const t=document.getElementById(`dok-thumbs-${e}`),n=document.getElementById(`wizard-thumbs-${e}`),i=A.dokumenteCache[e],o=i&&i.images||[],r=o.length===0?'<span class="dok-empty">Keine Dokumente</span>':o.map((a,l)=>`
            <div class="dok-thumb-wrap">
                <img src="${a.url}" alt="${e}" class="dok-thumb-img" onclick="openImageModal('${a.url}')">
                <button class="dok-thumb-delete" onclick="deleteDokument('${e}', ${l})" aria-label="Löschen">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        `).join("");t&&(t.innerHTML=r),n&&(n.innerHTML=r)}async function hn(e){const t=me();if(!t){P("Bitte zuerst anmelden","error");return}const n=document.createElement("input");n.type="file",n.accept="image/*",n.click(),n.onchange=async()=>{const i=n.files[0];if(i)try{P("Dokument wird hochgeladen...","info");const o=await cn(i),r=window.firebase.storage().ref(),a=`${Date.now()}.jpg`,l=r.child(`documents/${t.uid}/${e}/${a}`);await l.put(o,{contentType:"image/jpeg"});const c=await l.getDownloadURL(),h=(await ee.getCategory(t.uid,e))?.images||[];h.push({url:c,name:a,uploadedAt:Date.now()}),await ee.setCategoryImages(t.uid,e,h),A.dokumenteCache[e]||(A.dokumenteCache[e]={images:[]}),A.dokumenteCache[e].images=h,we(e),P("Dokument gespeichert","success")}catch(o){console.error("Dokument Upload Fehler:",o),P(`Fehler beim Hochladen: ${o.message}`,"error")}}}async function gn(e,t){if(!(typeof window.showConfirm=="function"?await window.showConfirm("Möchtest du dieses Dokument wirklich löschen?","Dokument löschen","Löschen"):typeof globalThis.confirm=="function"?globalThis.confirm("Möchtest du dieses Dokument wirklich löschen?"):!1))return;const i=me();if(i)try{const o=A.dokumenteCache[e];if(!o?.images?.[t])return;const r=o.images[t];try{await window.firebase.storage().ref().child(`documents/${i.uid}/${e}/${r.name}`).delete()}catch(a){console.warn("Storage Datei konnte nicht gelöscht werden:",a)}o.images.splice(t,1),await ee.setCategoryImages(i.uid,e,o.images),we(e),P("Dokument gelöscht","delete")}catch(o){console.error("Dokument löschen Fehler:",o),P("Fehler beim Löschen","error")}}const pn={initUI(){A.globalsAttached||(A.globalsAttached=!0,window.uploadDokument=hn,window.deleteDokument=gn)},initSafe(){un()},onLogout(){A.dokumenteCache={}}};function ue(e){return e.collection("hochsitze")}const J={stream(e,t,n){return ue(e).onSnapshot(t,n)},add(e,t){return ue(e).add(t)},doc(e,t){return ue(e).doc(t)}},d={map:null,gpsWatchId:null,gpsMarker:null,gpsSearching:!1,gpsHighAccuracyFailed:!1,settingHochsitz:!1,unsubHochsitze:null,unsubPanelList:null,clickAbort:null};function y(e,t){typeof window.showToast=="function"&&window.showToast(e,t)}function mn(){return window.Capacitor&&window.Capacitor.getPlatform()!=="web"}function Ge(){const e=document.getElementById("hochsitz-panel");e&&(e.classList.remove("open"),setTimeout(()=>e.classList.add("hidden"),300))}function qe(){const e=document.getElementById("eigengrundstuecke-panel");e&&(e.classList.remove("open"),setTimeout(()=>e.classList.add("hidden"),300))}function wn(){const e=document.getElementById("hochsitz-panel");e&&(qe(),e.classList.remove("hidden"),setTimeout(()=>e.classList.add("open"),10))}function bn(){const e=document.getElementById("eigengrundstuecke-panel");e&&(Ge(),e.classList.remove("hidden"),setTimeout(()=>e.classList.add("open"),10))}function yn(e){const t=document.getElementById("close-hochsitz-panel");t&&t.addEventListener("click",Ge);const n=document.getElementById("close-eigengrundstuecke-panel");n&&n.addEventListener("click",qe);const o=document.getElementById("hochsitz-panel")?.querySelector(".panel-content");o&&(d.unsubPanelList=J.stream(e,r=>{const a=document.getElementById("hochsitz-count");a&&(a.textContent=r.size),o.innerHTML="",r.docs.forEach(l=>{const c=l.data(),u=document.createElement("div");u.className="panel-entry panel-entry-clickable",u.dataset.lat=c.lat,u.dataset.lng=c.lng,u.dataset.id=l.id,u.innerHTML=`
        <strong>${c.name||"Ohne Namen"}</strong>
            ${c.datum?`<small>Datum: ${new Date(c.datum).toLocaleDateString()}</small>`:""}
                    ${c.bemerkung?`<small>${c.bemerkung}</small>`:""}
                    ${c.imageUrl?`<img src="${c.imageUrl}" alt="${c.name}">`:""}
    `,u.addEventListener("click",()=>{window.mapInstance&&c.lat&&c.lng&&window.mapInstance.flyTo([c.lat,c.lng],18,{duration:.5})}),o.appendChild(u)})}))}function be(e,t){const n=window.L;if(d.gpsMarker)d.gpsMarker.setLatLng([e,t]);else{const o=n.divIcon({className:"gps-marker-wrapper",html:'<div class="gps-marker"></div><div class="gps-marker-pulse"></div>',iconSize:[24,24],iconAnchor:[12,12]});d.gpsMarker=n.marker([e,t],{icon:o}).addTo(d.map)}const i=d.gpsMarker.getElement();i&&i.classList.remove("offline")}function N(){d.gpsSearching=!1;const e=document.querySelector(".gps-center-btn");e&&e.classList.remove("gps-searching")}function Me(e){switch(e.code){case 1:{const t=mn()?"GPS-Berechtigung verweigert. Bitte in den App-Einstellungen erlauben.":"GPS-Berechtigung blockiert. Bitte in Browser-Einstellungen erlauben.";y(t,"error");break}case 2:y("Standort nicht verfügbar. Bitte GPS/Standort in den Handy-Einstellungen prüfen.","error");break;case 3:y("GPS-Zeitüberschreitung. Bitte erneut versuchen.","error");break;default:y("GPS-Fehler aufgetreten","error")}}function ge(){if(d.gpsWatchId!==null)return;if(!navigator.geolocation){y("GPS wird von diesem Gerät nicht unterstützt","error");return}const e=!d.gpsHighAccuracyFailed;d.gpsWatchId=navigator.geolocation.watchPosition(t=>{const{latitude:n,longitude:i}=t.coords;be(n,i),N()},t=>Ke(t),{enableHighAccuracy:e,maximumAge:1e4,timeout:15e3})}function Ke(e){if(d.gpsMarker){const t=d.gpsMarker.getElement();t&&t.classList.add("offline")}if(console.warn("GPS Fehler (code "+e.code+"):",e.message),e.code===2&&!d.gpsHighAccuracyFailed){d.gpsHighAccuracyFailed=!0,console.log("GPS: Fallback ohne enableHighAccuracy..."),y("GPS-Signal schwach, versuche alternative Ortung...","info"),d.gpsWatchId!==null&&(navigator.geolocation.clearWatch(d.gpsWatchId),d.gpsWatchId=null),navigator.geolocation.getCurrentPosition(t=>{const{latitude:n,longitude:i}=t.coords;be(n,i),d.map.flyTo([n,i],17,{duration:.5}),y("Position gefunden (via Netzwerk)"),N(),ge()},t=>{console.warn("GPS Fallback auch fehlgeschlagen:",t),Me(t),N()},{enableHighAccuracy:!1,maximumAge:3e4,timeout:15e3});return}Me(e),N()}function vn(e){const t=window.L;if(!document.getElementById("map")){console.warn("Map element not found, skipping map initialization");return}try{const i=t.map("map",{center:[49.18,13.065],zoom:15,zoomAnimation:!0,zoomAnimationThreshold:4,fadeAnimation:!0,markerZoomAnimation:!0});d.map=i,window.mapInstance=i,window.hochsitzeMarkers={};const o=t.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and others",maxZoom:18,minZoom:12,updateWhenZooming:!1,updateWhenIdle:!0,keepBuffer:4,maxNativeZoom:18,tileSize:256,crossOrigin:!0}).addTo(i),r=window.reviere;Array.isArray(r)&&r.forEach(s=>{t.polygon(s.coords,{color:s.color,fillColor:s.fillColor,fillOpacity:.3}).addTo(i).bindPopup(s.name).on("click",async m=>{if(!d.settingHochsitz)return;const p=document.getElementById("hochsitz-modal"),g=document.getElementById("hochsitz-name-input"),b=document.getElementById("hochsitz-save-btn"),B=document.getElementById("hochsitz-cancel-btn");if(!p||!g||!b||!B)return;p.style.display="block",g.value="",window.innerWidth>768&&g.focus();const U=()=>{p.style.display="none"};b.onclick=async()=>{const I=g.value.trim();if(!I){y("Bitte einen Namen eingeben","error");return}try{await J.add(e,{lat:m.latlng.lat,lng:m.latlng.lng,name:I,imageUrl:null}),y("Hochsitz gesetzt","success")}catch(Ze){console.error(Ze),y("Fehler beim Setzen des Hochsitzes","error")}U(),d.settingHochsitz=!1;const R=document.querySelector(".hoch-sitz-btn");R&&(R.style.background="#2f2f2f",R.style.border="1px solid rgba(255,255,255,0.25)",R.style.color="white",R.style.boxShadow="0 4px 12px rgba(0,0,0,0.6)")},B.onclick=()=>{U(),d.settingHochsitz=!1;const I=document.querySelector(".hoch-sitz-btn");I&&(I.style.background="#2f2f2f",I.style.border="1px solid rgba(255,255,255,0.25)",I.style.color="white",I.style.boxShadow="0 4px 12px rgba(0,0,0,0.6)")}})}),window.eigengrundstueckePolygons={};const a=document.getElementById("eigengrundstuecke-content");a&&(a.innerHTML=""),typeof window.eigengrundstuecke<"u"&&window.eigengrundstuecke.forEach((s,w)=>{const m=t.polygon(s.coords,{color:s.color,fillColor:s.fillColor,fillOpacity:.3});m.bindPopup(s.name);const p=s.id||`grund-${w}`;if(window.eigengrundstueckePolygons[p]=m,s.isVisible&&m.addTo(i),a){const g=document.createElement("div");g.className="panel-entry panel-entry-clickable",g.style.display="flex",g.style.justifyContent="space-between",g.style.alignItems="center",s.isVisible&&(g.classList.add("active-plot"),g.style.borderColor=s.color,g.style.background="rgba(255,255,255,0.25)");const b=document.createElement("span");b.innerHTML=`<strong>${s.name}</strong>`,b.style.color=s.color;const B=document.createElement("span");B.innerHTML=s.isVisible?"✓":"",B.style.fontWeight="bold",B.style.color=s.color,g.addEventListener("click",()=>{s.isVisible=!s.isVisible,s.isVisible?(m.addTo(i),i.fitBounds(m.getBounds(),{padding:[50,50],maxZoom:17,animate:!0,duration:.8}),g.classList.add("active-plot"),g.style.borderColor=s.color,g.style.background="rgba(255,255,255,0.25)",B.innerHTML="✓"):(i.removeLayer(m),g.classList.remove("active-plot"),g.style.borderColor="",g.style.background="",B.innerHTML="")}),g.appendChild(b),g.appendChild(B),a.appendChild(g)}});const l=document.getElementById("map-container");if(l){const s=document.createElement("span");s.id="map-status-dot",s.classList.add("offline"),l.appendChild(s),o.on("tileload",()=>s.classList.replace("offline","online")),o.on("tileerror",()=>s.classList.replace("online","offline"))}const c=`
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
        `,u=`
            background: linear-gradient(135deg, rgba(95, 161, 117, 0.4), rgba(61, 190, 106, 0.4));
            border: 1px solid rgba(124, 255, 155, 0.5);
            color: white;
            box-shadow:
                0 0 0 3px rgba(124,255,155,0.3),
                0 8px 24px rgba(0,0,0,0.4),
                0 0 20px rgba(124,255,155,0.4);
        `,h=t.control({position:"topright"});h.onAdd=function(){const s=t.DomUtil.create("button","hoch-sitz-btn");return s.innerHTML="+",s.title="Hochsitz hinzufügen",s.style.cssText=c,s.onmouseenter=()=>{d.settingHochsitz||(s.style.background="rgba(255, 255, 255, 0.18)",s.style.transform="scale(1.08)")},s.onmouseleave=()=>{d.settingHochsitz||(s.style.background="rgba(255, 255, 255, 0.12)",s.style.transform="scale(1)")},t.DomEvent.disableClickPropagation(s),t.DomEvent.disableScrollPropagation(s),t.DomEvent.on(s,"click",w=>{t.DomEvent.stopPropagation(w),d.settingHochsitz=!d.settingHochsitz,d.settingHochsitz?(s.style.cssText=c+u,y("Klicke auf die Karte um eine Jagdeinrichtung zu setzen")):(s.style.cssText=c,y("Markieren abgebrochen"))}),s},h.addTo(i);const L=t.control({position:"topright"});L.onAdd=function(){const s=t.DomUtil.create("button","hochsitz-list-btn");return s.innerHTML="☰",s.title="Hochsitze anzeigen",s.style.cssText=`
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
        `,s.onmouseenter=()=>{s.style.background="rgba(255, 255, 255, 0.18)",s.style.transform="scale(1.08)"},s.onmouseleave=()=>{s.style.background="rgba(255, 255, 255, 0.12)",s.style.transform="scale(1)"},t.DomEvent.disableClickPropagation(s),t.DomEvent.disableScrollPropagation(s),t.DomEvent.on(s,"click",w=>{t.DomEvent.stopPropagation(w),wn()}),s},L.addTo(i);const H=t.control({position:"topright"});H.onAdd=function(){const s=t.DomUtil.create("button","chainsaw-list-btn");return s.innerHTML=`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 18l1.4 -6h11.2l-2.4 8h-8.8a2 2 0 0 1 -2 -2z" />
            <path d="M12.4 6a2 2 0 0 1 -2 -2h-1c-1.3 0 -2.5 1 -3.2 2" />
            <path d="M14.6 12a1 1 0 0 0 -1 1v4" />
            <path d="M22 17l-1 -1" />
            <path d="M22 15l-1 -1" />
            <path d="M22 13l-1 -1" />
            <path d="M21 11l-1 -1" />
            <path d="M20 9l-1 -1" />
            <path d="M17 12l2 -2l-1.5 -1.5l-2 2" />
        </svg>`,s.title="Eigengrundstücke anzeigen",s.style.cssText=`
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
        `,s.onmouseenter=()=>{s.style.background="rgba(255, 255, 255, 0.18)",s.style.transform="scale(1.08)"},s.onmouseleave=()=>{s.style.background="rgba(255, 255, 255, 0.12)",s.style.transform="scale(1)"},t.DomEvent.disableClickPropagation(s),t.DomEvent.disableScrollPropagation(s),t.DomEvent.on(s,"click",w=>{t.DomEvent.stopPropagation(w),bn()}),s},H.addTo(i);const q=t.control({position:"topright"});q.onAdd=function(){const s=t.DomUtil.create("button","gps-center-btn");return s.innerHTML=`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <circle cx="12" cy="12" r="8" opacity="0.3"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg>`,s.title="Zur aktuellen Position",s.style.cssText=`
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
        `,s.onmouseenter=()=>{s.style.background="rgba(255, 255, 255, 0.18)",s.style.transform="scale(1.08)"},s.onmouseleave=()=>{s.style.background="rgba(255, 255, 255, 0.12)",s.style.transform="scale(1)"},t.DomEvent.disableClickPropagation(s),t.DomEvent.on(s,"click",w=>{if(t.DomEvent.stopPropagation(w),d.gpsMarker){const p=d.gpsMarker.getLatLng();i.flyTo([p.lat,p.lng],17,{duration:.5}),y("Zur aktuellen Position");return}if(!navigator.geolocation){y("GPS wird von diesem Gerät nicht unterstützt","error");return}if(d.gpsSearching){y("GPS-Signal wird gesucht...","info");return}d.gpsSearching=!0,d.gpsHighAccuracyFailed=!1,s.classList.add("gps-searching");const m=()=>{y("GPS-Position wird gesucht...","info"),navigator.geolocation.getCurrentPosition(p=>{const{latitude:g,longitude:b}=p.coords;be(g,b),i.flyTo([g,b],17,{duration:.5}),y("GPS-Position gefunden"),N(),ge()},p=>Ke(p),{enableHighAccuracy:!0,maximumAge:1e4,timeout:1e4}),ge()};navigator.permissions?navigator.permissions.query({name:"geolocation"}).then(p=>{p.state==="denied"?(y("GPS ist blockiert. Bitte in den Browser-Einstellungen unter 'Website-Berechtigungen' den Standort erlauben.","error"),N()):m()}).catch(()=>m()):m()}),s},q.addTo(i),d.unsubHochsitze=J.stream(e,s=>{s.docChanges().forEach(w=>{const m=w.doc.data(),p=w.doc.id;if(window.hochsitzeMarkers[p]&&(i.removeLayer(window.hochsitzeMarkers[p]),delete window.hochsitzeMarkers[p]),w.type==="added"||w.type==="modified"){const g=t.marker([m.lat,m.lng],{icon:t.divIcon({className:"hochsitz-marker",html:`<svg viewBox="0 0 32 32" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="15" fill="white" stroke="#2f6f4e" stroke-width="2"/>
                            <path d="M8 12 L16 6 L24 12" stroke="#2f6f4e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <rect x="9" y="12" width="14" height="8" rx="1" fill="#2f6f4e"/>
                            <rect x="11" y="14" width="4" height="3" rx="0.5" fill="white" opacity="0.8"/>
                            <rect x="17" y="14" width="4" height="3" rx="0.5" fill="white" opacity="0.8"/>
                            <line x1="11" y1="20" x2="9" y2="26" stroke="#2f6f4e" stroke-width="2" stroke-linecap="round"/>
                            <line x1="21" y1="20" x2="23" y2="26" stroke="#2f6f4e" stroke-width="2" stroke-linecap="round"/>
                            <line x1="16" y1="20" x2="16" y2="26" stroke="#2f6f4e" stroke-width="1.5" stroke-linecap="round"/>
                            <line x1="14.5" y1="22" x2="17.5" y2="22" stroke="#2f6f4e" stroke-width="1" stroke-linecap="round"/>
                            <line x1="14.5" y1="24" x2="17.5" y2="24" stroke="#2f6f4e" stroke-width="1" stroke-linecap="round"/>
                        </svg>`,iconSize:[40,40],iconAnchor:[20,40],popupAnchor:[0,-42]})}).addTo(i),b=`<div class="hochsitz-popup">
                    <div class="hochsitz-popup-title">${m.name||"Hochsitz"}</div>
                    ${m.imageUrl?`<img src="${m.imageUrl}" class="hochsitz-popup-img">`:""}
                    <div class="hochsitz-popup-buttons">
                        <button class="hochsitz-popup-btn add-photo-btn" data-id="${p}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                            Bild
                        </button>
                        <button class="hochsitz-popup-btn delete-btn delete-marker-btn" data-id="${p}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/>
                            </svg>
                            Löschen
                        </button>
                    </div>
                </div>`;g.bindPopup(b),window.hochsitzeMarkers[p]=g}w.type==="removed"&&window.hochsitzeMarkers[p]&&(i.removeLayer(window.hochsitzeMarkers[p]),delete window.hochsitzeMarkers[p])})}),d.clickAbort=new AbortController,document.addEventListener("click",async s=>{const w=s.target,m=w.dataset?.id;if(!m)return;const p=J.doc(e,m);if(w.classList.contains("add-photo-btn"))try{const g=document.createElement("input");g.type="file",g.accept="image/*",g.click(),g.onchange=async()=>{const b=g.files[0];if(!b||!window.firebase.storage)return;const U=window.firebase.storage().ref().child(`hochsitze/${m}_${b.name}`);await U.put(b);const I=await U.getDownloadURL();await p.update({imageUrl:I}),y("Bild hochgeladen","success")}}catch(g){console.error(g),y("Fehler beim Upload","error")}w.classList.contains("delete-marker-btn")&&(typeof window.showConfirm=="function"?await window.showConfirm("Möchten Sie diesen Hochsitz wirklich löschen?","Hochsitz löschen","Löschen"):typeof globalThis.confirm=="function"&&globalThis.confirm("Möchten Sie diesen Hochsitz wirklich löschen?"))&&(await p.delete(),y("Hochsitz gelöscht","success"))},{signal:d.clickAbort.signal})}catch(i){console.error("Map initialization error:",i),y("Fehler beim Laden der Karte","error")}}const kn={init(e){yn(e),vn(e)},onLogout(){d.gpsWatchId!==null&&(navigator.geolocation.clearWatch(d.gpsWatchId),d.gpsWatchId=null),d.unsubHochsitze&&(d.unsubHochsitze(),d.unsubHochsitze=null),d.unsubPanelList&&(d.unsubPanelList(),d.unsubPanelList=null),d.clickAbort&&(d.clickAbort.abort(),d.clickAbort=null),d.gpsMarker=null,d.gpsSearching=!1,d.gpsHighAccuracyFailed=!1,d.settingHochsitz=!1,d.map=null,window.mapInstance=null,window.hochsitzeMarkers={}},initUI(){}},v={loginOverlay:null,loginForm:null,loginError:null,loginLoading:null,isAppInitialized:!1,deps:null};function De(){return window.Capacitor&&window.Capacitor.getPlatform()!=="web"}function Je(e){v.loginError&&(v.loginError.textContent=e,v.loginError.classList.remove("hidden"))}function En(){v.loginError&&v.loginError.classList.add("hidden")}function te(e){const t=v.loginForm?.querySelector('button[type="submit"]');v.loginLoading&&v.loginLoading.classList.toggle("hidden",!e),t&&(t.disabled=e,t.textContent=e?"Wird angemeldet...":"Einloggen")}async function Ln(e,t){En(),te(!0);try{await window.firebase.auth().signInWithEmailAndPassword(e,t)}catch(n){console.error("Login error:",n);let i="Login fehlgeschlagen. Bitte prüfe deine Zugangsdaten.";switch(n.code){case"auth/user-not-found":i="Kein Benutzer mit dieser E-Mail gefunden.";break;case"auth/wrong-password":i="Falsches Passwort.";break;case"auth/invalid-email":i="Ungültige E-Mail-Adresse.";break;case"auth/too-many-requests":i="Zu viele Versuche. Bitte warte einen Moment.";break;case"auth/network-request-failed":i="Netzwerkfehler. Bitte prüfe deine Verbindung.";break}Je(i),te(!1)}}function xn(){if(v.loginOverlay=document.getElementById("login-overlay"),v.loginForm=document.getElementById("login-form"),v.loginError=document.getElementById("login-error"),v.loginLoading=document.getElementById("login-loading"),!v.loginForm){console.error("Login form not found!");return}v.loginForm.addEventListener("submit",n=>{n.preventDefault();const i=document.getElementById("login-email")?.value?.trim(),o=document.getElementById("login-password")?.value;if(!i||!o){Je("Bitte E-Mail und Passwort eingeben.");return}Ln(i,o)});const e=document.getElementById("password-toggle"),t=document.getElementById("login-password");e&&t&&e.addEventListener("click",()=>{const n=t.type==="password";t.type=n?"text":"password";const i=e.querySelector(".eye-open"),o=e.querySelector(".eye-closed");i&&o&&(i.classList.toggle("hidden"),o.classList.toggle("hidden"))})}function Sn(e){v.deps=e,window.firebase?.apps?.length||window.firebase.initializeApp(e.firebaseConfig),window.firebase.auth().onAuthStateChanged(t=>{if(t){De()&&document.body.classList.add("native-app"),document.body.classList.add("authenticated"),te(!1),v.loginOverlay&&(v.loginOverlay.style.display="none"),e.updateUserInfo(t),window.__features?.presence?.onLogin(t),window.__features?.bulletin?.onLogin(t),window.__features?.streckenliste?.onLogin(t);const n=document.getElementById("bottom-nav");n&&(n.classList.remove("hidden"),e.setActiveTab("dashboard")),v.isAppInitialized||(v.isAppInitialized=!0,e.initializeApp().then(async()=>{try{if(De())await window.__features?.notifications?.init({swReg:null,appVersion:e.appVersion});else if("serviceWorker"in navigator){let i=window.globalSwReg||await navigator.serviceWorker.getRegistration();if(!i){const o=new Promise(r=>setTimeout(()=>r(null),5e3));i=await Promise.race([navigator.serviceWorker.ready,o])}i&&await window.__features?.notifications?.init({swReg:i,appVersion:e.appVersion})}}catch(i){console.error("Push init error:",i)}}).catch(i=>{window.showToast?.("App Fehler: "+i.message,"error"),console.error("App initialization error:",i)}),e.showInstallBannerAfterLogin())}else document.body.classList.remove("authenticated"),window.__features?.bulletin?.onLogout(),window.__features?.streckenliste?.onLogout(),window.__features?.dokumente?.onLogout(),window.__features?.map?.onLogout(),v.loginOverlay&&(v.loginOverlay.style.display="flex"),te(!1)})}function He(){const e=window.firebase.auth().currentUser,t=()=>{window.firebase.auth().signOut().then(()=>{window.showToast?.("Erfolgreich abgemeldet"),v.isAppInitialized=!1}).catch(n=>{console.error("Logout error:",n),window.showToast?.("Fehler beim Abmelden","error")})};if(e){const n=window.__features?.presence?.markOffline?.();n&&typeof n.finally=="function"?n.finally(t):t()}else t()}const Tn={initLogin:xn,initAuthListener:Sn,logout:He,initUI(){window.logout=He}},z=window.__features=window.__features||{};z.presence=ot;z.bulletin=mt;z.notifications=Lt;z.streckenliste=Ut;z.schonzeit=Jt;z.wetter=Oe;z.dokumente=pn;z.map=kn;z.auth=Tn;window.__featuresReady=!0;window.dispatchEvent(new CustomEvent("features:ready",{detail:{features:Object.keys(z)}}));
