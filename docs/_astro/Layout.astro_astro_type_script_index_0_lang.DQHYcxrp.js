const Ve="silbersbach";function ee(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[userRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("users")}function we(){return window.firebase.firestore.FieldValue}const M={TENANT_ID:Ve,async upsertPresence(e,t){if(!(!e||!e.uid))try{await ee().doc(e.uid).set({uid:e.uid,displayName:e.displayName||"Unbekannter Jäger",photoURL:e.photoURL||"",isOnline:t,lastSeen:we().serverTimestamp()},{merge:!0})}catch(n){console.warn("[userRepo] upsertPresence fehlgeschlagen:",n?.code||n?.message)}},upsertPresenceSync(e){if(e)try{ee().doc(e).set({isOnline:!1,lastSeen:we().serverTimestamp()},{merge:!0})}catch{}},streamAll(e,t){return ee().limit(50).onSnapshot(n=>{const i=n.docs.map(o=>o.data());try{e(i)}catch(o){console.error("[userRepo] streamAll callback error:",o)}},n=>{console.error("[userRepo] Firestore Snapshot Error:",n),typeof t=="function"&&t(n)})}},Ke=3e4,qe=9e4,Je=3e4;function te(e){if(!e||!e.isOnline)return!1;const t=e.lastSeen&&typeof e.lastSeen.toDate=="function"?e.lastSeen.toDate():null;return t?Date.now()-t.getTime()<qe:!1}function Xe(e){const n=Math.floor((new Date-e)/1e3);return n<60?"Gerade eben":n<3600?`Vor ${Math.floor(n/60)} Min.`:n<86400?`Vor ${Math.floor(n/3600)} Std.`:e.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}function be(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const h={user:null,heartbeatTimer:null,visibilityHandler:null,beforeUnloadHandler:null,capacitorAppListener:null,capacitorPauseListener:null,capacitorResumeListener:null,rendererTimer:null,snapshotUnsub:null,lastSnapshotDocs:[],listenersAttached:!1};function J(e){h.heartbeatTimer||(M.upsertPresence(e,!0),h.heartbeatTimer=setInterval(()=>{typeof document<"u"&&document.visibilityState==="visible"&&M.upsertPresence(e,!0)},Ke))}function X(){h.heartbeatTimer&&(clearInterval(h.heartbeatTimer),h.heartbeatTimer=null)}function Ze(){if(!(typeof window<"u"&&window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.App))return;const{App:e}=window.Capacitor.Plugins;e.addListener("appStateChange",({isActive:t})=>{h.user&&(t?J(h.user):(X(),M.upsertPresence(h.user,!1)))}).then(t=>{h.capacitorAppListener=t}).catch(()=>{}),e.addListener("pause",()=>{h.user&&(X(),M.upsertPresence(h.user,!1))}).then(t=>{h.capacitorPauseListener=t}).catch(()=>{}),e.addListener("resume",()=>{h.user&&J(h.user)}).then(t=>{h.capacitorResumeListener=t}).catch(()=>{})}function Ye(){[h.capacitorAppListener,h.capacitorPauseListener,h.capacitorResumeListener].forEach(e=>{if(e&&typeof e.remove=="function")try{e.remove()}catch{}}),h.capacitorAppListener=null,h.capacitorPauseListener=null,h.capacitorResumeListener=null}function ne(e){const t=document.getElementById("online-users-list"),n=document.getElementById("online-count");if(!t||!n)return;let i=0;const r=e.slice().sort((a,l)=>{const c=te(a)?1:0,u=te(l)?1:0;if(c!==u)return u-c;const f=a.lastSeen&&typeof a.lastSeen.toDate=="function"?a.lastSeen.toDate().getTime():0;return(l.lastSeen&&typeof l.lastSeen.toDate=="function"?l.lastSeen.toDate().getTime():0)-f}).map(a=>{const l=te(a);l&&i++;const c=a.lastSeen&&typeof a.lastSeen.toDate=="function"?a.lastSeen.toDate():null,u=c?Xe(c):"Unbekannt",f=l?"online":"offline",E=be(a.displayName||"Unbekannter Jäger");return`
            <div class="user-status-item">
                <div class="user-status-avatar">
                    ${a.photoURL?`<img src="${be(a.photoURL)}" alt="">`:'<div class="user-status-avatar-placeholder"><i class="ti ti-user"></i></div>'}
                    <div class="status-dot ${f}"></div>
                </div>
                <div class="user-status-info">
                    <span class="user-status-name">${E}</span>
                    <span class="user-status-lastseen">${l?"Jetzt aktiv":u}</span>
                </div>
            </div>
        `}).join("");t.innerHTML=r||'<div class="dropdown-loading">Keine Mitglieder gefunden</div>',n.textContent=i}const Qe={onLogin(e){this.onLogout(),h.user=e,J(e),h.visibilityHandler=()=>{h.user&&(document.visibilityState==="visible"?J(h.user):(X(),M.upsertPresence(h.user,!1)))},document.addEventListener("visibilitychange",h.visibilityHandler),h.beforeUnloadHandler=()=>{M.upsertPresenceSync(e.uid)},window.addEventListener("beforeunload",h.beforeUnloadHandler),Ze()},onLogout(){X(),h.visibilityHandler&&(document.removeEventListener("visibilitychange",h.visibilityHandler),h.visibilityHandler=null),h.beforeUnloadHandler&&(window.removeEventListener("beforeunload",h.beforeUnloadHandler),h.beforeUnloadHandler=null),Ye(),h.user=null},initUI(){const e=document.getElementById("profile-trigger"),t=document.getElementById("online-users-dropdown");!e||!t||h.listenersAttached||(h.listenersAttached=!0,e.addEventListener("click",n=>{n.stopPropagation(),t.classList.toggle("hidden")}),document.addEventListener("click",n=>{!t.contains(n.target)&&!e.contains(n.target)&&t.classList.add("hidden")}),h.snapshotUnsub=M.streamAll(n=>{h.lastSnapshotDocs=n,ne(n)},()=>{const n=document.getElementById("online-users-list");n&&(n.innerHTML='<div class="dropdown-loading">Fehler beim Laden</div>')}),h.rendererTimer&&clearInterval(h.rendererTimer),h.rendererTimer=setInterval(()=>{h.lastSnapshotDocs.length>0&&ne(h.lastSnapshotDocs)},Je))},async markOffline(){const e=h.user;this.onLogout(),e&&await M.upsertPresence(e,!1)},__test__:{getState(){return h},renderOnlineUsers:ne}},et="silbersbach";function _(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[bulletinRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("bulletinBoard")}function ye(){return window.firebase.firestore.FieldValue}function tt(e){return e&&(e.displayName||(e.email?String(e.email).split("@")[0]:null))||"Unbekannt"}const G={TENANT_ID:et,async add({message:e,sender:t}){return await _().add({message:e,sender:t||"Unbekannt",timestamp:Date.now(),isDone:!1})},async markDone(e,t){if(!e)return;const n=t||(window.firebase?.auth?.()?.currentUser??null);await _().doc(e).update({isDone:!0,doneAt:ye().serverTimestamp(),doneBy:tt(n)})},async reopen(e){if(!e)return;const t=ye();await _().doc(e).update({isDone:!1,doneAt:t.delete(),doneBy:t.delete()})},async delete(e){e&&await _().doc(e).delete()},streamAll(e,t){return _().orderBy("timestamp","desc").onSnapshot(n=>{const i=n.docs.map(o=>({id:o.id,...o.data()}));try{e(i)}catch(o){console.error("[bulletinRepo] streamAll callback error:",o)}},n=>{console.error("[bulletinRepo] Firestore Snapshot Error:",n),typeof t=="function"&&t(n)})}},ve=3;function Me(e){return e?new Date(e).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"Unbekannt"}function nt(e){const t=ot(e),n=t.filter(o=>!o?.isDone),i=t.filter(o=>!!o?.isDone).sort((o,r)=>{const a=typeof o?.doneAt=="number",l=typeof r?.doneAt=="number";return a&&l?r.doneAt-o.doneAt:a?-1:l?1:0});return{open:n,done:i}}function it(e){if(e==null)return"unbekannt";let t=null;if(typeof e=="number")t=e;else if(typeof e.toMillis=="function")t=e.toMillis();else if(typeof e.toDate=="function"){const n=e.toDate();n instanceof Date&&(t=n.getTime())}return t==null||Number.isNaN(t)?"unbekannt":new Date(t).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}function ot(e){return Array.isArray(e)?[...e].sort((t,n)=>(n?.timestamp||0)-(t?.timestamp||0)):[]}function S(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Ae="bulletin.activeTab",v={user:null,snapshotUnsub:null,listenersAttached:!1,currentOpenItems:[],currentDoneItems:[],activeTab:"open"};function ie(){try{const e=window.localStorage?.getItem(Ae);if(e==="done"||e==="open")return e}catch{}return"open"}function rt(e){try{window.localStorage?.setItem(Ae,e)}catch{}}function A(e,t){if(typeof window.showToast=="function")try{window.showToast(e,t)}catch{}}async function st(e,t,n){if(typeof window.showConfirm=="function")try{return await window.showConfirm(e,t,n)}catch{return!1}return window.confirm?window.confirm(e):!1}function at(){try{const e=window.firebase?.auth?.().currentUser;return e?e.displayName||(e.email?e.email.split("@")[0]:"Unbekannt"):"Unbekannt"}catch{return"Unbekannt"}}function ke(e){const t=Me(e.timestamp),n=S(e.sender||"Unbekannt"),i=S(e.message||""),o=S(e.id);return`
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
    `}function lt(e){const t=Me(e.timestamp),n=S(e.sender||"Unbekannt"),i=S(e.message||""),o=S(e.id),r=e&&Object.prototype.hasOwnProperty.call(e,"doneAt")?e.doneAt:null,a=it(r),l=S(e.doneBy||"unbekannt");return`
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
    `}function ct(e){const t=S(e.id);return`
        <span class="bulletin-preview-text">${S(e.message||"")}</span>
        <div class="bulletin-preview-actions">
            <button class="bulletin-done-btn-sm" data-id="${t}" title="Erledigt">
                <i class="ti ti-check"></i>
            </button>
            <button class="bulletin-delete-btn-sm" data-id="${t}" title="Löschen">
                <i class="ti ti-trash"></i>
            </button>
        </div>
    `}function Ee(e,t){const n=document.getElementById("bulletin-list"),i=document.getElementById("bulletin-list-done"),o=document.getElementById("bulletin-list-dashboard"),r=document.getElementById("bulletin-badge"),a=document.getElementById("bulletin-preview"),l=document.getElementById("bulletin-tab-count-open"),c=document.getElementById("bulletin-tab-count-done");n&&(n.innerHTML="",e.length===0?n.innerHTML='<p class="bulletin-empty">Keine offenen Aufgaben.</p>':e.forEach(u=>{const f=document.createElement("div");f.className="bulletin-item",f.innerHTML=ke(u),n.appendChild(f)})),i&&(i.innerHTML="",t.length===0?i.innerHTML='<p class="bulletin-empty">Noch keine erledigten Aufgaben.</p>':t.forEach(u=>{const f=document.createElement("div");f.className="bulletin-item bulletin-item--done",f.innerHTML=lt(u),i.appendChild(f)})),l&&(l.textContent=String(e.length),l.classList.toggle("hidden",e.length===0)),c&&(c.textContent=String(t.length),c.classList.toggle("hidden",t.length===0)),o&&(o.innerHTML="",e.length===0?o.innerHTML='<p class="bulletin-empty">Keine Nachrichten vorhanden.</p>':e.slice(0,ve).forEach(u=>{const f=document.createElement("div");f.className="bulletin-item",f.innerHTML=ke(u),o.appendChild(f)})),r&&(r.textContent=String(e.length),r.classList.toggle("hidden",e.length===0)),a&&(a.innerHTML="",e.length===0?a.innerHTML='<p class="bulletin-empty">Keine neuen Aushänge...</p>':e.slice(0,ve).forEach(u=>{const f=document.createElement("div");f.className="bulletin-preview-item",f.innerHTML=ct(u),a.appendChild(f)}))}function Z(){const e=document.getElementById("bulletin-tab-open"),t=document.getElementById("bulletin-tab-done"),n=document.getElementById("bulletin-list"),i=document.getElementById("bulletin-list-done"),o=v.activeTab==="done";e&&e.classList.toggle("active",!o),e&&e.setAttribute("aria-selected",o?"false":"true"),t&&t.classList.toggle("active",o),t&&t.setAttribute("aria-selected",o?"true":"false"),n&&n.classList.toggle("hidden",o),i&&i.classList.toggle("hidden",!o)}function de(e){e!=="open"&&e!=="done"||v.activeTab!==e&&(v.activeTab=e,rt(e),Z())}function oe(){const e=document.getElementById("stats-detail-bulletin");if(!e)return;const t=v.currentOpenItems;let n='<div style="display: flex; flex-direction: column; gap: 0.5rem;">';t.length?t.forEach(i=>{const o=S(i.message||""),r=S(i.sender||"Unbekannt");n+=`
                <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 0.9rem;">
                    <div style="font-weight: 500; margin-bottom: 4px;">${o}</div>
                    <div style="font-size: 0.75rem; opacity: 0.5;">Von ${r}</div>
                </div>
            `}):n+="<p style='opacity:0.5'>Keine offenen Aufgaben.</p>",n+="</div>",e.innerHTML=n}async function De(e){if(e)try{await G.markDone(e,v.user||window.firebase?.auth?.()?.currentUser),A("Aushang als erledigt markiert","success")}catch(t){console.error("[bulletin] markDone error:",t),A("Fehler beim Aktualisieren","error")}}async function He(e){if(e)try{await G.reopen(e),A("Aushang wieder geöffnet","success")}catch(t){console.error("[bulletin] reopen error:",t),A("Fehler beim Aktualisieren","error")}}async function $e(e,{confirm:t=!0}={}){if(e&&!(t&&!await st("Aushang unwiderruflich löschen?","Aushang löschen","Löschen")))try{await G.delete(e),A("Aushang gelöscht","delete")}catch(n){console.error("[bulletin] delete error:",n),A("Fehler beim Löschen","error")}}function K(e){!e||e.dataset.bulletinDelegated==="1"||(e.dataset.bulletinDelegated="1",e.addEventListener("click",async t=>{const n=t.target;if(!n||typeof n.closest!="function")return;const i=n.closest(".bulletin-preview-text");if(i&&e.contains(i)){typeof window.toggleDashboardFeed=="function"&&window.toggleDashboardFeed("bulletin");return}const o=n.closest(".bulletin-done-btn")||n.closest(".bulletin-done-btn-sm");if(o&&e.contains(o)){t.stopPropagation(),await De(o.dataset.id);return}const r=n.closest(".bulletin-reopen-btn");if(r&&e.contains(r)){t.stopPropagation(),await He(r.dataset.id);return}const a=n.closest(".bulletin-delete-btn")||n.closest(".bulletin-delete-btn-sm");a&&e.contains(a)&&(t.stopPropagation(),await $e(a.dataset.id))}))}function dt(){const e=document.getElementById("bulletin-tab-open"),t=document.getElementById("bulletin-tab-done");e&&e.dataset.bulletinTabBound!=="1"&&(e.dataset.bulletinTabBound="1",e.addEventListener("click",()=>de("open"))),t&&t.dataset.bulletinTabBound!=="1"&&(t.dataset.bulletinTabBound="1",t.addEventListener("click",()=>de("done"))),Z()}async function re({inputEl:e,buttonEl:t,busyLabel:n="Wird gesendet..."}){if(!e)return;const i=e.value.trim();if(!i)return;const o=t?t.innerHTML:null;t&&(t.disabled=!0,o&&n&&(t.innerHTML=n));try{await G.add({message:i,sender:at()}),e.value="",A("Aushang erfolgreich erstellt","success")}catch(r){console.error("[bulletin] submit error:",r),A("Fehler beim Senden","error")}finally{t&&(t.disabled=!1,o!==null&&(t.innerHTML=o))}}const ut={onLogin(e){this.onLogout(),v.user=e,v.activeTab=ie(),(document.getElementById("bulletin-list")||document.getElementById("bulletin-list-done")||document.getElementById("bulletin-preview")||document.getElementById("bulletin-list-dashboard"))&&(v.snapshotUnsub=G.streamAll(n=>{const{open:i,done:o}=nt(n);v.currentOpenItems=i,v.currentDoneItems=o,Ee(i,o),Z(),oe()},n=>{console.error("[bulletin] snapshot error:",n)}))},onLogout(){if(typeof v.snapshotUnsub=="function")try{v.snapshotUnsub()}catch{}v.snapshotUnsub=null,v.currentOpenItems=[],v.currentDoneItems=[],v.user=null},initUI(){if(v.listenersAttached)return;v.listenersAttached=!0;const e=document.getElementById("bulletin-submit-btn"),t=document.getElementById("bulletin-input");e&&t&&e.addEventListener("click",()=>{re({inputEl:t,buttonEl:e})});const n=document.getElementById("bulletin-submit-dashboard"),i=document.getElementById("bulletin-input-dashboard");n&&i&&n.addEventListener("click",()=>{re({inputEl:i,buttonEl:n,busyLabel:""})}),K(document.getElementById("bulletin-list")),K(document.getElementById("bulletin-list-done")),K(document.getElementById("bulletin-list-dashboard")),K(document.getElementById("bulletin-preview")),v.activeTab=ie(),dt()},renderStatsDetail(){oe()},__test__:{getState(){return v},renderLists:Ee,renderStatsDetailInternal:oe,handleSubmit:re,handleDoneClick:De,handleReopenClick:He,handleDeleteClick:$e,setActiveTab:de,applyActiveTabUi:Z,loadPersistedTab:ie}},ht="silbersbach";function ft(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[fcmTokenRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("fcmTokens")}function gt(){return window.firebase.firestore.FieldValue}const Pe={TENANT_ID:ht,async upsertToken({token:e,userId:t,userName:n,device:i,version:o}){e&&await ft().doc(e).set({token:e,userId:t||"anon",userName:n||"Unbekannt",device:i||"unknown",version:o||"",updatedAt:gt().serverTimestamp()},{merge:!0})}};async function xe({swReg:e,vapidKey:t,appVersion:n,maxAttempts:i=3}){if(!e){console.warn("[FCM] Kein Service Worker vorhanden");return}if(typeof Notification>"u"||Notification.permission!=="granted")return;let o=e.active;if((!o||o.state!=="activated")&&(await new Promise(l=>setTimeout(l,2500)),o=e.active,!o||o.state!=="activated")){console.warn("[FCM] Service Worker nicht aktiviert, ueberspringe");return}let r=window.firebase?.auth?.()?.currentUser;if(!r&&(await new Promise(l=>setTimeout(l,2e3)),r=window.firebase?.auth?.()?.currentUser,!r)){console.warn("[FCM] Kein User nach Warten, ueberspringe");return}const a=window.firebase.messaging();for(let l=1;l<=i;l++)try{const c=await a.getToken({vapidKey:t,serviceWorkerRegistration:e});if(c){if(r=window.firebase?.auth?.()?.currentUser,await Pe.upsertToken({token:c,userId:r?r.uid:"anon",userName:r?r.displayName||r.email||"Nutzer":"Unbekannt",device:typeof navigator<"u"&&navigator.userAgent?navigator.userAgent.substring(0,100):"unknown",version:n}),typeof window.showToast=="function")try{window.showToast("Push-Benachrichtigungen aktiv!","success")}catch{}return}return}catch(c){if(console.warn(`[FCM] Versuch ${l}/${i}:`,c.code||c.name),(c.code===20||c.name==="AbortError")&&l<i){await new Promise(u=>setTimeout(u,3e3*l));continue}l===i&&console.error("[FCM] Token-Registrierung fehlgeschlagen nach",i,"Versuchen");break}}async function pt({appVersion:e}){if(!window.Capacitor||!window.Capacitor.Plugins||!window.Capacitor.Plugins.PushNotifications){console.warn("Capacitor Push Plugin nicht gefunden.");return}const{PushNotifications:t}=window.Capacitor.Plugins;let n=await t.checkPermissions();if(n.receive==="prompt"&&(n=await t.requestPermissions()),n.receive!=="granted"){if(typeof window.showToast=="function")try{window.showToast("Push-Berechtigung verweigert.","error")}catch{}return}t.addListener("registration",async i=>{const o=i.value,r=window.firebase?.auth?.()?.currentUser;try{if(await Pe.upsertToken({token:o,userId:r?r.uid:"anon",userName:r?r.displayName||r.email||"Nutzer":"Unbekannt",device:"Android Native App",version:e}),typeof window.showToast=="function")try{window.showToast("Native Push aktiv!","success")}catch{}}catch(a){console.error("[FCM-Native] upsertToken error:",a)}}),t.addListener("registrationError",i=>{console.error("Push registration error:",i)}),t.addListener("pushNotificationReceived",i=>{console.log("Push empfangen:",i)}),t.addListener("pushNotificationActionPerformed",i=>{console.log("Push-Aktion ausgefuehrt:",i)}),await t.register()}const ue="BDy4YWtERHAaFyUQHr7URTCHbsFC_AwMImJJ5U_AlFrdF_uhsHtEMZMybDXdZWUkapxR9X5JzoKJFAHXvYSIEQg",x={initialized:!1,pendingClickListener:null,pendingTouchListener:null};function mt(){return!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform())}async function wt({swReg:e,appVersion:t}){const n=window.firebase;if(!n||!n.messaging)return;try{if(!await n.messaging.isSupported())return}catch{return}if(typeof Notification>"u")return;const i=Notification.permission;if(i==="granted"){await xe({swReg:e,vapidKey:ue,appVersion:t});return}if(i==="default"){const o=async()=>{window.removeEventListener("click",o),window.removeEventListener("touchstart",o),x.pendingClickListener=null,x.pendingTouchListener=null;try{await Notification.requestPermission()==="granted"&&await xe({swReg:e,vapidKey:ue,appVersion:t})}catch(r){console.error("Fehler bei Push-Berechtigung:",r)}};x.pendingClickListener=o,x.pendingTouchListener=o,window.addEventListener("click",o),window.addEventListener("touchstart",o,{passive:!0});return}if(i==="denied"&&typeof window.showToast=="function")try{window.showToast("BLOCKIERT! Bitte in den Handy-Einstellungen (App Info) erlauben.","error")}catch{}}const bt={async init({swReg:e=null,appVersion:t=""}={}){if(!x.initialized){x.initialized=!0;try{if(mt()){await pt({appVersion:t});return}await wt({swReg:e,appVersion:t})}catch(n){console.error("[notifications] init error:",n)}}},__test__:{getState(){return x},reset(){if(x.pendingClickListener)try{window.removeEventListener("click",x.pendingClickListener)}catch{}if(x.pendingTouchListener)try{window.removeEventListener("touchstart",x.pendingTouchListener)}catch{}x.initialized=!1,x.pendingClickListener=null,x.pendingTouchListener=null},VAPID_KEY:ue}},yt="silbersbach";function W(){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[entriesRepo] window.firebase.firestore() nicht verfuegbar");return window.firebase.firestore().collection("entries")}function vt(){return window.firebase.firestore.FieldValue}const O={TENANT_ID:yt,async add(e){return{id:(await W().add(e)).id}},async delete(e){e&&await W().doc(e).delete()},async updateImageBase64(e,t){e&&await W().doc(e).update({imageBase64:t})},async clearImages(e){if(!e)return;const t=vt();await W().doc(e).update({imageBase64:t.delete(),imageUrl:t.delete()})},streamByDatumDesc(e,t){return W().orderBy("datum","desc").onSnapshot(n=>{const i=n.docs.map(o=>({id:o.id,...o.data()}));e(i)},n=>{console.error("[entriesRepo] Snapshot Error:",n),typeof t=="function"&&t(n)})}};function kt(e){if(!Array.isArray(e))return{};const t={};for(const n of e){const i=n?.wildart;i&&(t[i]=(t[i]||0)+1)}return t}function Et(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(n?.wildart!=="Rehwild")continue;const i=n.unterart||"Unbekannt";t[i]=(t[i]||0)+1}return t}function xt(e){return Array.isArray(e)?e.map(t=>({Datum:t.datum||"",Wildart:t.wildart||"",Unterart:t.unterart||"",Erleger:t.erleger||"",Bemerkung:t.bemerkung||"",Foto:t.imageBase64||t.imageUrl?"Ja":"Nein"})):[]}function H(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Lt=75e4,k={user:null,snapshotUnsub:null,listenersAttached:!1,currentEntries:[]};function L(e,t){if(typeof window.showToast=="function")try{window.showToast(e,t)}catch{}}async function St(e,t,n){if(typeof window.showConfirm=="function")try{return await window.showConfirm(e,t,n)}catch{return!1}return window.confirm?window.confirm(e):!1}function Tt(){return Array.isArray(window.jagdzeitenBayern)?window.jagdzeitenBayern:[]}function Bt(e,t){if(typeof window.getWildartIconHTML=="function"){const n=window.getWildartIconHTML(e,t);if(n)return n}return'<span style="font-size: 20px;">🦌</span>'}function Ct(e,t=600,n=.6){return new Promise((i,o)=>{const r=new FileReader;r.onload=a=>{const l=new Image;l.onload=()=>{const c=document.createElement("canvas");let u=l.width,f=l.height;u>t&&(f=f*t/u,u=t),c.width=u,c.height=f,c.getContext("2d").drawImage(l,0,0,u,f),i(c.toDataURL("image/jpeg",n))},l.onerror=o,l.src=a.target.result},r.onerror=o,r.readAsDataURL(e)})}function zt(e){const t=document.getElementById("strecke-count");t&&(t.textContent=String(e.length));const n=document.getElementById("rehwild-count");n&&(n.textContent=String(e.filter(i=>i.wildart==="Rehwild").length))}function j(){const e=document.getElementById("stats-detail-strecke"),t=document.getElementById("stats-detail-rehwild"),n=k.currentEntries,i=Object.entries(kt(n)).sort((r,a)=>a[1]-r[1]);if(e){let r='<div style="display: flex; flex-direction: column; gap: 0.5rem;">';i.length?i.forEach(([a,l])=>{const c=H(a);r+=`<div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;"><span>${c}</span><span style="font-weight: bold; color: var(--primary-light);">${l}</span></div>`}):r+="<p style='opacity:0.5'>Keine Daten vorhanden.</p>",r+="</div>",e.innerHTML=r}const o=Object.entries(Et(n)).sort((r,a)=>a[1]-r[1]);if(t){let r='<div style="display: flex; flex-direction: column; gap: 0.5rem;">';o.length?o.forEach(([a,l])=>{const c=H(a);r+=`<div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;"><span>${c}</span><span style="font-weight: bold; color: var(--primary-light);">${l}</span></div>`}):r+="<p style='opacity:0.5'>Keine Daten vorhanden.</p>",r+="</div>",t.innerHTML=r}}function It(){const e=document.getElementById("entry-list"),t=document.getElementById("entry-list-dashboard");e&&(e.innerHTML=""),t&&(t.innerHTML="");const n=k.currentEntries,i=Tt();n.forEach((o,r)=>{const a=document.createElement("li");a.className="entry-item";const l=i.find(b=>b.name===o.wildart||b.id===o.wildart),c=l?Bt(l.iconClass,28):'<span style="font-size: 20px;">🦌</span>',u=document.createElement("div");u.className="feed-card-header",u.style.marginBottom="0.2rem";const f=H(o.wildart||""),E=H(o.unterart||""),D=H(o.datum||""),V=H(o.erleger||"");u.innerHTML=`
            <div class="feed-card-icon-container">${c}</div>
            <div class="feed-card-header-text">
                <span class="feed-card-title">${f} ${E}</span>
                <span class="feed-card-time">${D} • ${V}</span>
            </div>`;const s=document.createElement("button");if(s.className="entry-delete-btn",s.dataset.idx=String(r),s.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>',Object.assign(s.style,{background:"rgba(255,255,255,0.1)",border:"none",color:"var(--primary-light)",padding:"0.5rem",borderRadius:"8px",cursor:"pointer",marginLeft:"auto"}),u.appendChild(s),a.appendChild(u),o.bemerkung){const b=document.createElement("div");b.className="entry-notes",b.textContent=o.bemerkung,a.appendChild(b)}const w=document.createElement("div");w.className="entry-foto-section";const m=o.imageBase64||o.imageUrl,p=H(o.id);if(m){w.innerHTML=`
                <div class="entry-foto-thumbnail">
                    <img src="" alt="Streckenfoto" class="entry-foto-img" data-id="${p}">
                    <button type="button" class="entry-foto-delete-btn" data-id="${p}" aria-label="Foto löschen">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="2.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>
                    </button>
                </div>`;const b=w.querySelector(".entry-foto-img");b&&(b.src=m)}const g=document.createElement("button");g.type="button",g.className="entry-foto-btn",g.dataset.id=o.id,g.innerHTML=`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>${m?"Ändern":"Foto hinzufügen"}`,w.appendChild(g),a.appendChild(w),e&&e.appendChild(a.cloneNode(!0)),t&&t.appendChild(a.cloneNode(!0))}),Mt(),At()}async function Mt(){document.querySelectorAll("#entry-list .entry-delete-btn, #entry-list-dashboard .entry-delete-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=Number(e.dataset.idx),n=k.currentEntries[t];if(n?.id)try{await O.delete(n.id),L("Eintrag gelöscht","delete")}catch(i){console.error("[streckenliste] delete",i),L("Fehler beim Löschen","error")}})})}function At(){document.querySelectorAll(".entry-foto-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.id;if(!t)return;const n=document.createElement("input");n.type="file",n.accept="image/*",n.click(),n.onchange=async()=>{const i=n.files[0];if(!i)return;const o=e.innerHTML;try{e.disabled=!0,e.innerHTML='<svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="30" stroke-dashoffset="10"/></svg> Lädt...';const r=await Ct(i);if(r.length>Lt)throw new Error("Bild zu groß, bitte kleineres Bild wählen");await O.updateImageBase64(t,r),L("Foto gespeichert","success")}catch(r){console.error("[streckenliste] foto",r),L(r.message||"Fehler beim Speichern","error"),e.disabled=!1,e.innerHTML=o}}})}),document.querySelectorAll(".entry-foto-img").forEach(e=>{e.addEventListener("click",()=>{typeof window.openImageModal=="function"&&window.openImageModal(e.src)})}),document.querySelectorAll(".entry-foto-delete-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=e.dataset.id;if(t&&await St("Möchten Sie das Foto wirklich löschen?","Foto löschen","Löschen"))try{await O.clearImages(t),L("Foto gelöscht","delete")}catch(n){console.error("[streckenliste] foto-delete",n),L("Fehler beim Löschen","error")}})})}function Dt(){window.openImageModal=function(t){const n=document.createElement("div");n.className="image-modal-overlay",n.innerHTML='<div class="image-modal-content"><img src="" alt="Foto"><button type="button" class="image-modal-close" aria-label="Schließen">✕</button></div>';const i=n.querySelector("img");i&&(i.src=t),document.body.appendChild(n),n.addEventListener("click",o=>{(o.target===n||o.target.closest(".image-modal-close"))&&n.remove()})}}function Ht(e,t){!e||!t||e.addEventListener("change",()=>{const n=e.value;let i="";n==="Rehwild"&&(i='<label > Unterart <select name="unterart" ><option>Geiß</option><option>Bock</option><option>Kitz</option><option>Schmal</option></select></label> '),(n==="Rotwild"||n==="Dammwild")&&(i='<label > Unterart <select name="unterart" ><option>Hirsch</option><option>Alttier</option><option>Schmaltier</option><option>Spießer</option></select></label> '),n==="Schwarzwild"&&(i='<label > Unterart <select name="unterart" ><option>Keiler</option><option>Bache</option><option>Frischling</option><option>Überläufer</option></select></label> '),(n==="Raubwild"||n==="Federwild")&&(i='<label > Bemerkung <input type="text" name="unterart" ></label> '),t.innerHTML=i})}const $t={onLogin(e){this.onLogout(),k.user=e,(document.getElementById("entry-list")||document.getElementById("entry-list-dashboard"))&&(k.snapshotUnsub=O.streamByDatumDesc(n=>{k.currentEntries=n,zt(n),It(),j()}))},onLogout(){if(typeof k.snapshotUnsub=="function")try{k.snapshotUnsub()}catch{}k.snapshotUnsub=null,k.user=null,k.currentEntries=[];const e=document.getElementById("entry-list"),t=document.getElementById("entry-list-dashboard");e&&(e.innerHTML=""),t&&(t.innerHTML="");const n=document.getElementById("strecke-count");n&&(n.textContent="0");const i=document.getElementById("rehwild-count");i&&(i.textContent="0"),j()},initUI(){if(Dt(),k.listenersAttached)return;k.listenersAttached=!0;const e=document.getElementById("entry-modal"),t=document.getElementById("entry-form"),n=document.getElementById("cancel-entry"),i=document.getElementById("wildart"),o=document.getElementById("subcategory-container"),r=document.getElementById("add-entry-btn"),a=document.getElementById("fab-add-btn"),l=document.getElementById("fab-export-btn");Ht(i,o),a&&e&&a.addEventListener("click",()=>{e.classList.remove("hidden")}),r&&e&&r.addEventListener("click",()=>{e.classList.remove("hidden")}),l&&l.addEventListener("click",()=>{if(!k.currentEntries.length){L("Keine Einträge zum Exportieren vorhanden","info");return}try{if(typeof window.XLSX>"u")throw new Error("XLSX");const c=xt(k.currentEntries),u=window.XLSX.utils.book_new(),f=window.XLSX.utils.json_to_sheet(c);f["!cols"]=[{wch:12},{wch:20},{wch:20},{wch:20},{wch:40},{wch:10}],window.XLSX.utils.book_append_sheet(u,f,"Streckenliste"),window.XLSX.writeFile(u,`Streckenliste_Silbersbach_${new Date().toISOString().split("T")[0]}.xlsx`),L("Excel-Export erfolgreich","success")}catch(c){console.error("[streckenliste] export",c),L("Fehler beim Exportieren","error")}}),n&&t&&e&&o&&n.addEventListener("click",()=>{e.classList.add("hidden"),t.reset(),o.innerHTML=""}),t&&e&&o&&t.addEventListener("submit",async c=>{c.preventDefault();const u=new FormData(t),f={};u.forEach((E,D)=>{f[D]=E});try{await O.add(f),L("Eintrag gespeichert","success"),t.reset(),o.innerHTML="",e.classList.add("hidden")}catch(E){console.error("[streckenliste] add",E),L("Fehler beim Speichern","error")}})},renderStatsDetail(){j()},__test__:{getState(){return k},renderStatsDetailInternal:j,setEntriesForTest(e){k.currentEntries=e,j()}}};function Le(e,t=new Date().getFullYear()){const[n,i]=e.split(".").map(Number);return new Date(t,i-1,n)}function Y(e,t=new Date){if(e.keineJagdzeit)return!0;if(e.ganzjaehrig)return!1;const n=t.getFullYear(),i=Le(e.jagdzeitStart,n),o=Le(e.jagdzeitEnde,n);return i>o?t>o&&t<i:t<i||t>o}function Pt(e){return e.keineJagdzeit?"Keine Jagdzeit":`Jagdzeit: ${e.jagdzeitStart} - ${e.jagdzeitEnde}`}const Ft=["rehbock","reh","wildschwein","gams","muffelwild","dachs","marder","iltis","hermelin","mauswiesel","ente","fasan","deer","crow","eichelhaeher","fox","rabbit"],Nt=new Set(Ft);function Ut(e){return Array.isArray(e)?e.filter(t=>Nt.has(t.iconClass)):[]}function Rt(e,t,n=new Date){let i=Ut(t);return e==="schonzeit"?i=i.filter(o=>Y(o,n)):e==="jagdzeit"&&(i=i.filter(o=>!Y(o,n))),i}function _t(e,t=new Date){return Array.isArray(e)?e.filter(n=>!Y(n,t)&&!n.keineJagdzeit):[]}const C={aktuellerFilter:"alle",schonzeitIndex:0,schonzeitInterval:null,listenersAttached:!1};function Fe(){return Array.isArray(window.jagdzeitenBayern)?window.jagdzeitenBayern:[]}function Wt(e,t){if(typeof window.getWildartIconHTML=="function"){const n=window.getWildartIconHTML(e,t);if(n)return n}return""}function Se(){const e=document.getElementById("schonzeit-icon"),t=document.getElementById("schonzeit-wildart"),n=document.getElementById("schonzeit-datum"),i=document.getElementById("schonzeit-indicator"),o=document.getElementById("schonzeit-status-text");if(!e||!t||!n||!i||!o)return;const r=_t(Fe());if(r.length===0){e.style.display="none",t.textContent="Keine aktiven Jagdzeiten",n.textContent="Alle Wildarten haben aktuell Schonzeit",i.className="schonzeit-indicator closed",o.textContent="Schonzeit";return}const a=r[C.schonzeitIndex%r.length];e.style.display="none",t.textContent=a.name,n.textContent=Pt(a),i.className="schonzeit-indicator open",o.textContent="Jagdzeit",C.schonzeitIndex+=1}function Te(e){C.aktuellerFilter=e,document.querySelectorAll(".schonzeit-filter-btn").forEach(t=>{t.classList.remove("active")}),document.querySelector(`[data-filter="${e}"]`)?.classList.add("active"),Ne()}function jt(e=new Date){const t=Rt(C.aktuellerFilter,Fe(),e);return t.length===0?'<div class="schonzeit-empty"><p>Keine Wildarten gefunden.</p></div>':t.map(n=>{const i=Y(n,e),o=i?"closed":"open",r=i?"Schonzeit":"Jagdzeit",a=n.keineJagdzeit?"Ganzjährige Schonzeit":n.ganzjaehrig?"Ganzjährig bejagbar":`Jagdzeit: ${n.jagdzeitStart||"-"} - ${n.jagdzeitEnde||"-"}`;return`
                <div class="wildart-card">
                    <div class="wildart-icon">
                        ${Wt(n.iconClass,44)}
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
            `}).join("")}function Ne(){const e=document.getElementById("schonzeit-liste"),t=document.getElementById("schonzeit-liste-dashboard");if(!e&&!t)return;const n=jt();e&&(e.innerHTML=n),t&&(t.innerHTML=n)}const Ot={initUI(){C.schonzeitInterval!==null&&(clearInterval(C.schonzeitInterval),C.schonzeitInterval=null),C.listenersAttached||(C.listenersAttached=!0,window.filterSchonzeitListe=e=>Te(e)),Se(),C.schonzeitInterval=window.setInterval(Se,5e3)},setFilterAndRender(e){Te(e)},renderListe(){Ne()}};function Gt(e,t,n){return`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${e},${t}?unitGroup=metric&key=${n}&include=current,days`}function fe(e){return["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][Math.floor(e/22.5+.5)%16]}function se(e){if(!e)return null;const t=String(e).split(":");return parseInt(t[0],10)*60+parseInt(t[1],10)}function Be(e){const t=Math.floor(e/60),n=e%60;return t>0?`${t}h ${n}min`:`${n} min`}function F(e){return e?String(e).substring(0,5):"--:--"}function Vt(e){return e===0?"Neumond":e<.25?"Zunehmend":e===.25?"1. Viertel":e<.5?"Zunehmend":e===.5?"Vollmond":e<.75?"Abnehmend":e===.75?"3. Viertel":"Abnehmend"}function Kt(e){return e===0?"Neumond":e<.25?"Zunehmende Sichel":e===.25?"Erstes Viertel":e<.5?"Zunehmender Mond":e===.5?"Vollmond":e<.75?"Abnehmender Mond":e===.75?"Letztes Viertel":"Abnehmende Sichel"}function qt(e){return e<=2?"Niedrig":e<=5?"Moderat":e<=7?"Hoch":e<=10?"Sehr hoch":"Extrem"}function Jt(e){return e&&e.length?e.join(", "):"Kein Niederschlag"}function Xt(e){if(!e)return"";const t={Clear:"Klar","Partially cloudy":"Teils bewölkt",Overcast:"Bedeckt",Rain:"Regen",Snow:"Schnee",Fog:"Nebel",Thunderstorm:"Gewitter",Drizzle:"Nieselregen",Cloudy:"Bewölkt","Rain, Overcast":"Regen & Bedeckt","Rain, Partially cloudy":"Leichter Regen","Snow, Overcast":"Schnee & Bedeckt","Rain, Thunder":"Gewitter","Freezing Drizzle/Freezing Rain":"Eisregen","Light Rain":"Leichter Regen","Heavy Rain":"Starkregen"},n={Clear:"Klar",Overcast:"Bedeckt",Rain:"Regen",Snow:"Schnee",Fog:"Nebel",Drizzle:"Nieselregen",Cloudy:"Bewölkt",Thunder:"Gewitter"},i=String(e).split(",")[0].trim();return t[e]||n[i]||i}function Zt(e){const t=e.currentConditions||{},n=e.days&&e.days[0]?e.days[0]:null,i=Kt(t.moonphase??0),o=t.uvindex||0,r=qt(o),a=Jt(t.preciptype),l=fe(t.winddir||0),c=((t.moonphase??0)*100).toFixed(0);return`
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
                    <span>${F(n?.sunrise)}</span>
                </div>
                <div class="wetter-detail-row highlight">
                    <span>Sonnenuntergang</span>
                    <span>${F(n?.sunset)}</span>
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
    `}const Ce={lat:49.2,lon:13.05},Yt="YLF2SPSJ98MKAFEXGKRQRSFBW",P={cached:null,widgetClickAttached:!1},ae=`<svg class="wetter-sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="9" x2="12" y2="3"/>
        <polyline points="9 6 12 3 15 6"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
        <line x1="23" y1="22" x2="1" y2="22"/>
    </svg>`,ze=`<svg class="wetter-sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="3" x2="12" y2="9"/>
        <polyline points="9 6 12 9 15 6"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
        <line x1="23" y1="22" x2="1" y2="22"/>
    </svg>`;function Qt(e,t){const n=document.getElementById("sun-text"),i=document.querySelector(".wetter-sun-icon");if(!n||!e)return;const o=new Date,r=o.getHours()*60+o.getMinutes(),a=e.sunrise?se(e.sunrise):null,l=e.sunset?se(e.sunset):null,c=t&&t.sunrise?se(t.sunrise):null;let u="",f=ae;if(a!==null&&r<a){const E=a-r;u=`Sonnenaufgang in ${Be(E)} (${F(e.sunrise)})`,f=ae}else if(l!==null&&r<l){const E=l-r;u=`Sonnenuntergang in ${Be(E)} (${F(e.sunset)})`,f=ze}else c!==null?(u=`Sonnenaufgang morgen (${F(t.sunrise)})`,f=ae):(u=`Sonnenuntergang ${F(e.sunset)}`,f=ze);n.textContent=u,i&&i.parentNode&&(i.outerHTML=f)}function en(e,t){const n=document.getElementById("hero-temp"),i=document.getElementById("hero-desc"),o=document.getElementById("hero-wind-text"),r=document.getElementById("hero-sun-text");if(n&&e&&(n.textContent=`${e.temp.toFixed(0)}°`),i&&e){const a=e.conditions||"";i.textContent=Xt(a)}if(o&&e){const a=fe(e.winddir);o.textContent=`${a} ${e.windspeed.toFixed(0)} km/h`}if(r&&t){const a=t.sunrise?String(t.sunrise).substring(0,5):"--:--";r.textContent=`↑ ${a}`}}function tn(e){const t=document.getElementById("wetter-temp");if(t){const o=e.conditions||"";t.querySelector(".wetter-card-value").textContent=`${e.temp.toFixed(0)}°C`,t.querySelector(".wetter-card-label").textContent=o.length>12?`${o.substring(0,12)}...`:o}const n=document.getElementById("wetter-wind");if(n){const o=fe(e.winddir);n.querySelector(".wetter-card-value").textContent=o,n.querySelector(".wetter-card-label").textContent=`${e.windspeed.toFixed(0)} km/h`}const i=document.getElementById("wetter-moon");if(i){const o=Vt(e.moonphase);i.querySelector(".wetter-card-value").textContent=o,i.querySelector(".wetter-card-label").textContent="Mondphase"}}const Ue={getCached(){return P.cached},renderDetailGrid(){const e=document.getElementById("wetter-detail-grid-dashboard")||document.getElementById("wetter-detail-grid");if(e){if(!P.cached){e.innerHTML='<div class="wetter-detail-widget"><p>Wetterdaten werden geladen...</p></div>';return}e.innerHTML=Zt(P.cached)}},async refresh(){const e=Gt(Ce.lat,Ce.lon,Yt);try{const t=await fetch(e);if(!t.ok)throw new Error("Netzwerkfehler");const n=await t.json();P.cached=n;const i=n.currentConditions,o=n.days&&n.days[0],r=n.days&&n.days[1];tn(i),Qt(o,r),en(i,o),Ue.renderDetailGrid()}catch(t){console.error("Wetter Fehler:",t);const n=document.getElementById("sun-text");n&&(n.textContent="Wetter nicht verfügbar")}},initUI(){if(!P.widgetClickAttached){P.widgetClickAttached=!0;const e=document.getElementById("wetter-widget");e&&typeof window.toggleDashboardFeed=="function"&&(e.style.cursor="pointer",e.addEventListener("click",()=>window.toggleDashboardFeed("wetter")))}}};function le(e){if(!window.firebase||typeof window.firebase.firestore!="function")throw new Error("[dokumenteRepo] firebase.firestore nicht verfuegbar");return window.firebase.firestore().collection("users").doc(e).collection("documents")}function nn(){return window.firebase.firestore.FieldValue}const Q={async listAll(e){const t=await le(e).get(),n={};return t.forEach(i=>{n[i.id]=i.data()}),n},async getCategory(e,t){const n=await le(e).doc(t).get();return n.exists?n.data():null},async setCategoryImages(e,t,n){await le(e).doc(t).set({images:n,updatedAt:nn().serverTimestamp()},{merge:!0})}},Re=[{id:"jagderlaubnisschein",name:"Jagderlaubnisschein",icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'},{id:"jagdschein",name:"Jagdschein",icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>'},{id:"waffenbesitzkarte",name:"Waffenbesitzkarte",icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>'},{id:"begehungsschein",name:"Begehungsschein",icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="15" r="2"/></svg>'}],z={dokumenteCache:{},globalsAttached:!1};function ge(){return window.firebase?.auth?.()?.currentUser||null}function $(e,t){window.showToast?.(e,t)}async function on(e){const t=window.compressImage;if(typeof t!="function")throw new Error("compressImage nicht verfügbar");return t(e,1200,1200)}function rn(){const e=document.querySelectorAll(".dok-wizard-step"),t=document.querySelectorAll(".dok-wizard-dot"),n=document.getElementById("dok-wizard-prev"),i=document.getElementById("dok-wizard-next");if(!e.length||!n||!i)return;let o=0;const r=e.length;function a(l){e.forEach(c=>c.classList.remove("active")),t.forEach(c=>c.classList.remove("active")),e[l].classList.add("active"),t[l].classList.add("active"),n.classList.toggle("hidden",l===0),i.textContent=l===r-1?"Fertig":"Weiter"}n.onclick=()=>{o>0&&(o-=1,a(o))},i.onclick=()=>{if(o<r-1)o+=1,a(o);else{localStorage.setItem("dokumente_wizard_done","true");const l=document.getElementById("dokumente-wizard"),c=document.getElementById("dokumente-grid");l&&l.classList.add("hidden"),c&&c.classList.remove("hidden"),_e()}},a(0)}function sn(){const e=localStorage.getItem("dokumente_wizard_done"),t=document.getElementById("dokumente-wizard"),n=document.getElementById("dokumente-grid");!t||!n||(e?(t.classList.add("hidden"),n.classList.remove("hidden"),_e()):(t.classList.remove("hidden"),n.classList.add("hidden"),rn()))}async function _e(){const e=document.getElementById("dokumente-grid");if(!e)return;const t=ge();if(!t){e.innerHTML='<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 2rem;">Bitte zuerst anmelden.</p>';return}e.innerHTML=Re.map(n=>`
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
    `).join(""),await an(t.uid)}async function an(e){try{z.dokumenteCache=await Q.listAll(e),Re.forEach(t=>pe(t.id))}catch(t){console.error("Dokumente laden Fehler:",t),$("Fehler beim Laden der Dokumente","error")}}function pe(e){const t=document.getElementById(`dok-thumbs-${e}`),n=document.getElementById(`wizard-thumbs-${e}`),i=z.dokumenteCache[e],o=i&&i.images||[],r=o.length===0?'<span class="dok-empty">Keine Dokumente</span>':o.map((a,l)=>`
            <div class="dok-thumb-wrap">
                <img src="${a.url}" alt="${e}" class="dok-thumb-img" onclick="openImageModal('${a.url}')">
                <button class="dok-thumb-delete" onclick="deleteDokument('${e}', ${l})" aria-label="Löschen">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        `).join("");t&&(t.innerHTML=r),n&&(n.innerHTML=r)}async function ln(e){const t=ge();if(!t){$("Bitte zuerst anmelden","error");return}const n=document.createElement("input");n.type="file",n.accept="image/*",n.click(),n.onchange=async()=>{const i=n.files[0];if(i)try{$("Dokument wird hochgeladen...","info");const o=await on(i),r=window.firebase.storage().ref(),a=`${Date.now()}.jpg`,l=r.child(`documents/${t.uid}/${e}/${a}`);await l.put(o,{contentType:"image/jpeg"});const c=await l.getDownloadURL(),f=(await Q.getCategory(t.uid,e))?.images||[];f.push({url:c,name:a,uploadedAt:Date.now()}),await Q.setCategoryImages(t.uid,e,f),z.dokumenteCache[e]||(z.dokumenteCache[e]={images:[]}),z.dokumenteCache[e].images=f,pe(e),$("Dokument gespeichert","success")}catch(o){console.error("Dokument Upload Fehler:",o),$(`Fehler beim Hochladen: ${o.message}`,"error")}}}async function cn(e,t){if(!(typeof window.showConfirm=="function"?await window.showConfirm("Möchtest du dieses Dokument wirklich löschen?","Dokument löschen","Löschen"):typeof globalThis.confirm=="function"?globalThis.confirm("Möchtest du dieses Dokument wirklich löschen?"):!1))return;const i=ge();if(i)try{const o=z.dokumenteCache[e];if(!o?.images?.[t])return;const r=o.images[t];try{await window.firebase.storage().ref().child(`documents/${i.uid}/${e}/${r.name}`).delete()}catch(a){console.warn("Storage Datei konnte nicht gelöscht werden:",a)}o.images.splice(t,1),await Q.setCategoryImages(i.uid,e,o.images),pe(e),$("Dokument gelöscht","delete")}catch(o){console.error("Dokument löschen Fehler:",o),$("Fehler beim Löschen","error")}}const dn={initUI(){z.globalsAttached||(z.globalsAttached=!0,window.uploadDokument=ln,window.deleteDokument=cn)},initSafe(){sn()},onLogout(){z.dokumenteCache={}}};function ce(e){return e.collection("hochsitze")}const q={stream(e,t,n){return ce(e).onSnapshot(t,n)},add(e,t){return ce(e).add(t)},doc(e,t){return ce(e).doc(t)}},d={map:null,gpsWatchId:null,gpsMarker:null,gpsSearching:!1,gpsHighAccuracyFailed:!1,settingHochsitz:!1,unsubHochsitze:null,unsubPanelList:null,clickAbort:null};function y(e,t){typeof window.showToast=="function"&&window.showToast(e,t)}function un(){return window.Capacitor&&window.Capacitor.getPlatform()!=="web"}function We(){const e=document.getElementById("hochsitz-panel");e&&(e.classList.remove("open"),setTimeout(()=>e.classList.add("hidden"),300))}function je(){const e=document.getElementById("eigengrundstuecke-panel");e&&(e.classList.remove("open"),setTimeout(()=>e.classList.add("hidden"),300))}function hn(){const e=document.getElementById("hochsitz-panel");e&&(je(),e.classList.remove("hidden"),setTimeout(()=>e.classList.add("open"),10))}function fn(){const e=document.getElementById("eigengrundstuecke-panel");e&&(We(),e.classList.remove("hidden"),setTimeout(()=>e.classList.add("open"),10))}function gn(e){const t=document.getElementById("close-hochsitz-panel");t&&t.addEventListener("click",We);const n=document.getElementById("close-eigengrundstuecke-panel");n&&n.addEventListener("click",je);const o=document.getElementById("hochsitz-panel")?.querySelector(".panel-content");o&&(d.unsubPanelList=q.stream(e,r=>{const a=document.getElementById("hochsitz-count");a&&(a.textContent=r.size),o.innerHTML="",r.docs.forEach(l=>{const c=l.data(),u=document.createElement("div");u.className="panel-entry panel-entry-clickable",u.dataset.lat=c.lat,u.dataset.lng=c.lng,u.dataset.id=l.id,u.innerHTML=`
        <strong>${c.name||"Ohne Namen"}</strong>
            ${c.datum?`<small>Datum: ${new Date(c.datum).toLocaleDateString()}</small>`:""}
                    ${c.bemerkung?`<small>${c.bemerkung}</small>`:""}
                    ${c.imageUrl?`<img src="${c.imageUrl}" alt="${c.name}">`:""}
    `,u.addEventListener("click",()=>{window.mapInstance&&c.lat&&c.lng&&window.mapInstance.flyTo([c.lat,c.lng],18,{duration:.5})}),o.appendChild(u)})}))}function me(e,t){const n=window.L;if(d.gpsMarker)d.gpsMarker.setLatLng([e,t]);else{const o=n.divIcon({className:"gps-marker-wrapper",html:'<div class="gps-marker"></div><div class="gps-marker-pulse"></div>',iconSize:[24,24],iconAnchor:[12,12]});d.gpsMarker=n.marker([e,t],{icon:o}).addTo(d.map)}const i=d.gpsMarker.getElement();i&&i.classList.remove("offline")}function N(){d.gpsSearching=!1;const e=document.querySelector(".gps-center-btn");e&&e.classList.remove("gps-searching")}function Ie(e){switch(e.code){case 1:{const t=un()?"GPS-Berechtigung verweigert. Bitte in den App-Einstellungen erlauben.":"GPS-Berechtigung blockiert. Bitte in Browser-Einstellungen erlauben.";y(t,"error");break}case 2:y("Standort nicht verfügbar. Bitte GPS/Standort in den Handy-Einstellungen prüfen.","error");break;case 3:y("GPS-Zeitüberschreitung. Bitte erneut versuchen.","error");break;default:y("GPS-Fehler aufgetreten","error")}}function he(){if(d.gpsWatchId!==null)return;if(!navigator.geolocation){y("GPS wird von diesem Gerät nicht unterstützt","error");return}const e=!d.gpsHighAccuracyFailed;d.gpsWatchId=navigator.geolocation.watchPosition(t=>{const{latitude:n,longitude:i}=t.coords;me(n,i),N()},t=>Oe(t),{enableHighAccuracy:e,maximumAge:1e4,timeout:15e3})}function Oe(e){if(d.gpsMarker){const t=d.gpsMarker.getElement();t&&t.classList.add("offline")}if(console.warn("GPS Fehler (code "+e.code+"):",e.message),e.code===2&&!d.gpsHighAccuracyFailed){d.gpsHighAccuracyFailed=!0,console.log("GPS: Fallback ohne enableHighAccuracy..."),y("GPS-Signal schwach, versuche alternative Ortung...","info"),d.gpsWatchId!==null&&(navigator.geolocation.clearWatch(d.gpsWatchId),d.gpsWatchId=null),navigator.geolocation.getCurrentPosition(t=>{const{latitude:n,longitude:i}=t.coords;me(n,i),d.map.flyTo([n,i],17,{duration:.5}),y("Position gefunden (via Netzwerk)"),N(),he()},t=>{console.warn("GPS Fallback auch fehlgeschlagen:",t),Ie(t),N()},{enableHighAccuracy:!1,maximumAge:3e4,timeout:15e3});return}Ie(e),N()}function pn(e){const t=window.L;if(!document.getElementById("map")){console.warn("Map element not found, skipping map initialization");return}try{const i=t.map("map",{center:[49.18,13.065],zoom:15,zoomAnimation:!0,zoomAnimationThreshold:4,fadeAnimation:!0,markerZoomAnimation:!0});d.map=i,window.mapInstance=i,window.hochsitzeMarkers={};const o=t.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and others",maxZoom:18,minZoom:12,updateWhenZooming:!1,updateWhenIdle:!0,keepBuffer:4,maxNativeZoom:18,tileSize:256,crossOrigin:!0}).addTo(i),r=window.reviere;Array.isArray(r)&&r.forEach(s=>{t.polygon(s.coords,{color:s.color,fillColor:s.fillColor,fillOpacity:.3}).addTo(i).bindPopup(s.name).on("click",async m=>{if(!d.settingHochsitz)return;const p=document.getElementById("hochsitz-modal"),g=document.getElementById("hochsitz-name-input"),b=document.getElementById("hochsitz-save-btn"),T=document.getElementById("hochsitz-cancel-btn");if(!p||!g||!b||!T)return;p.style.display="block",g.value="",window.innerWidth>768&&g.focus();const U=()=>{p.style.display="none"};b.onclick=async()=>{const B=g.value.trim();if(!B){y("Bitte einen Namen eingeben","error");return}try{await q.add(e,{lat:m.latlng.lat,lng:m.latlng.lng,name:B,imageUrl:null}),y("Hochsitz gesetzt","success")}catch(Ge){console.error(Ge),y("Fehler beim Setzen des Hochsitzes","error")}U(),d.settingHochsitz=!1;const R=document.querySelector(".hoch-sitz-btn");R&&(R.style.background="#2f2f2f",R.style.border="1px solid rgba(255,255,255,0.25)",R.style.color="white",R.style.boxShadow="0 4px 12px rgba(0,0,0,0.6)")},T.onclick=()=>{U(),d.settingHochsitz=!1;const B=document.querySelector(".hoch-sitz-btn");B&&(B.style.background="#2f2f2f",B.style.border="1px solid rgba(255,255,255,0.25)",B.style.color="white",B.style.boxShadow="0 4px 12px rgba(0,0,0,0.6)")}})}),window.eigengrundstueckePolygons={};const a=document.getElementById("eigengrundstuecke-content");a&&(a.innerHTML=""),typeof window.eigengrundstuecke<"u"&&window.eigengrundstuecke.forEach((s,w)=>{const m=t.polygon(s.coords,{color:s.color,fillColor:s.fillColor,fillOpacity:.3});m.bindPopup(s.name);const p=s.id||`grund-${w}`;if(window.eigengrundstueckePolygons[p]=m,s.isVisible&&m.addTo(i),a){const g=document.createElement("div");g.className="panel-entry panel-entry-clickable",g.style.display="flex",g.style.justifyContent="space-between",g.style.alignItems="center",s.isVisible&&(g.classList.add("active-plot"),g.style.borderColor=s.color,g.style.background="rgba(255,255,255,0.25)");const b=document.createElement("span");b.innerHTML=`<strong>${s.name}</strong>`,b.style.color=s.color;const T=document.createElement("span");T.innerHTML=s.isVisible?"✓":"",T.style.fontWeight="bold",T.style.color=s.color,g.addEventListener("click",()=>{s.isVisible=!s.isVisible,s.isVisible?(m.addTo(i),i.fitBounds(m.getBounds(),{padding:[50,50],maxZoom:17,animate:!0,duration:.8}),g.classList.add("active-plot"),g.style.borderColor=s.color,g.style.background="rgba(255,255,255,0.25)",T.innerHTML="✓"):(i.removeLayer(m),g.classList.remove("active-plot"),g.style.borderColor="",g.style.background="",T.innerHTML="")}),g.appendChild(b),g.appendChild(T),a.appendChild(g)}});const l=document.getElementById("map-container");if(l){const s=document.createElement("span");s.id="map-status-dot",s.classList.add("offline"),l.appendChild(s),o.on("tileload",()=>s.classList.replace("offline","online")),o.on("tileerror",()=>s.classList.replace("online","offline"))}const c=`
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
        `,f=t.control({position:"topright"});f.onAdd=function(){const s=t.DomUtil.create("button","hoch-sitz-btn");return s.innerHTML="+",s.title="Hochsitz hinzufügen",s.style.cssText=c,s.onmouseenter=()=>{d.settingHochsitz||(s.style.background="rgba(255, 255, 255, 0.18)",s.style.transform="scale(1.08)")},s.onmouseleave=()=>{d.settingHochsitz||(s.style.background="rgba(255, 255, 255, 0.12)",s.style.transform="scale(1)")},t.DomEvent.disableClickPropagation(s),t.DomEvent.disableScrollPropagation(s),t.DomEvent.on(s,"click",w=>{t.DomEvent.stopPropagation(w),d.settingHochsitz=!d.settingHochsitz,d.settingHochsitz?(s.style.cssText=c+u,y("Klicke auf die Karte um eine Jagdeinrichtung zu setzen")):(s.style.cssText=c,y("Markieren abgebrochen"))}),s},f.addTo(i);const E=t.control({position:"topright"});E.onAdd=function(){const s=t.DomUtil.create("button","hochsitz-list-btn");return s.innerHTML="☰",s.title="Hochsitze anzeigen",s.style.cssText=`
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
        `,s.onmouseenter=()=>{s.style.background="rgba(255, 255, 255, 0.18)",s.style.transform="scale(1.08)"},s.onmouseleave=()=>{s.style.background="rgba(255, 255, 255, 0.12)",s.style.transform="scale(1)"},t.DomEvent.disableClickPropagation(s),t.DomEvent.disableScrollPropagation(s),t.DomEvent.on(s,"click",w=>{t.DomEvent.stopPropagation(w),hn()}),s},E.addTo(i);const D=t.control({position:"topright"});D.onAdd=function(){const s=t.DomUtil.create("button","chainsaw-list-btn");return s.innerHTML=`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
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
        `,s.onmouseenter=()=>{s.style.background="rgba(255, 255, 255, 0.18)",s.style.transform="scale(1.08)"},s.onmouseleave=()=>{s.style.background="rgba(255, 255, 255, 0.12)",s.style.transform="scale(1)"},t.DomEvent.disableClickPropagation(s),t.DomEvent.disableScrollPropagation(s),t.DomEvent.on(s,"click",w=>{t.DomEvent.stopPropagation(w),fn()}),s},D.addTo(i);const V=t.control({position:"topright"});V.onAdd=function(){const s=t.DomUtil.create("button","gps-center-btn");return s.innerHTML=`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        `,s.onmouseenter=()=>{s.style.background="rgba(255, 255, 255, 0.18)",s.style.transform="scale(1.08)"},s.onmouseleave=()=>{s.style.background="rgba(255, 255, 255, 0.12)",s.style.transform="scale(1)"},t.DomEvent.disableClickPropagation(s),t.DomEvent.on(s,"click",w=>{if(t.DomEvent.stopPropagation(w),d.gpsMarker){const p=d.gpsMarker.getLatLng();i.flyTo([p.lat,p.lng],17,{duration:.5}),y("Zur aktuellen Position");return}if(!navigator.geolocation){y("GPS wird von diesem Gerät nicht unterstützt","error");return}if(d.gpsSearching){y("GPS-Signal wird gesucht...","info");return}d.gpsSearching=!0,d.gpsHighAccuracyFailed=!1,s.classList.add("gps-searching");const m=()=>{y("GPS-Position wird gesucht...","info"),navigator.geolocation.getCurrentPosition(p=>{const{latitude:g,longitude:b}=p.coords;me(g,b),i.flyTo([g,b],17,{duration:.5}),y("GPS-Position gefunden"),N(),he()},p=>Oe(p),{enableHighAccuracy:!0,maximumAge:1e4,timeout:1e4}),he()};navigator.permissions?navigator.permissions.query({name:"geolocation"}).then(p=>{p.state==="denied"?(y("GPS ist blockiert. Bitte in den Browser-Einstellungen unter 'Website-Berechtigungen' den Standort erlauben.","error"),N()):m()}).catch(()=>m()):m()}),s},V.addTo(i),d.unsubHochsitze=q.stream(e,s=>{s.docChanges().forEach(w=>{const m=w.doc.data(),p=w.doc.id;if(window.hochsitzeMarkers[p]&&(i.removeLayer(window.hochsitzeMarkers[p]),delete window.hochsitzeMarkers[p]),w.type==="added"||w.type==="modified"){const g=t.marker([m.lat,m.lng],{icon:t.divIcon({className:"hochsitz-marker",html:`<svg viewBox="0 0 32 32" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                </div>`;g.bindPopup(b),window.hochsitzeMarkers[p]=g}w.type==="removed"&&window.hochsitzeMarkers[p]&&(i.removeLayer(window.hochsitzeMarkers[p]),delete window.hochsitzeMarkers[p])})}),d.clickAbort=new AbortController,document.addEventListener("click",async s=>{const w=s.target,m=w.dataset?.id;if(!m)return;const p=q.doc(e,m);if(w.classList.contains("add-photo-btn"))try{const g=document.createElement("input");g.type="file",g.accept="image/*",g.click(),g.onchange=async()=>{const b=g.files[0];if(!b||!window.firebase.storage)return;const U=window.firebase.storage().ref().child(`hochsitze/${m}_${b.name}`);await U.put(b);const B=await U.getDownloadURL();await p.update({imageUrl:B}),y("Bild hochgeladen","success")}}catch(g){console.error(g),y("Fehler beim Upload","error")}w.classList.contains("delete-marker-btn")&&(typeof window.showConfirm=="function"?await window.showConfirm("Möchten Sie diesen Hochsitz wirklich löschen?","Hochsitz löschen","Löschen"):typeof globalThis.confirm=="function"&&globalThis.confirm("Möchten Sie diesen Hochsitz wirklich löschen?"))&&(await p.delete(),y("Hochsitz gelöscht","success"))},{signal:d.clickAbort.signal})}catch(i){console.error("Map initialization error:",i),y("Fehler beim Laden der Karte","error")}}const mn={init(e){gn(e),pn(e)},onLogout(){d.gpsWatchId!==null&&(navigator.geolocation.clearWatch(d.gpsWatchId),d.gpsWatchId=null),d.unsubHochsitze&&(d.unsubHochsitze(),d.unsubHochsitze=null),d.unsubPanelList&&(d.unsubPanelList(),d.unsubPanelList=null),d.clickAbort&&(d.clickAbort.abort(),d.clickAbort=null),d.gpsMarker=null,d.gpsSearching=!1,d.gpsHighAccuracyFailed=!1,d.settingHochsitz=!1,d.map=null,window.mapInstance=null,window.hochsitzeMarkers={}},initUI(){}},I=window.__features=window.__features||{};I.presence=Qe;I.bulletin=ut;I.notifications=bt;I.streckenliste=$t;I.schonzeit=Ot;I.wetter=Ue;I.dokumente=dn;I.map=mn;window.__featuresReady=!0;window.dispatchEvent(new CustomEvent("features:ready",{detail:{features:Object.keys(I)}}));
