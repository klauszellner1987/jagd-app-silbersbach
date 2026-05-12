// ============================================================================
// features/auth/index.js — Login-Overlay, E-Mail/Passwort, onAuthStateChanged
// Brücken: window.firebase (compat), window.showToast, window.__features.*,
//   Monolith liefert firebaseConfig + Callbacks (initializeApp, updateUserInfo, …).
// Astro-onclick: window.logout (wird in initUI gesetzt).
// ============================================================================

const state = {
    loginOverlay: null,
    loginForm: null,
    loginError: null,
    loginLoading: null,
    isAppInitialized: false,
    deps: null,
};

function isNativeApp() {
    return window.Capacitor && window.Capacitor.getPlatform() !== 'web';
}

function showLoginError(message) {
    if (state.loginError) {
        state.loginError.textContent = message;
        state.loginError.classList.remove('hidden');
    }
}

function hideLoginError() {
    if (state.loginError) {
        state.loginError.classList.add('hidden');
    }
}

function setLoginLoading(isLoading) {
    const submitBtn = state.loginForm?.querySelector('button[type="submit"]');
    if (state.loginLoading) {
        state.loginLoading.classList.toggle('hidden', !isLoading);
    }
    if (submitBtn) {
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? 'Wird angemeldet...' : 'Einloggen';
    }
}

async function handleLogin(email, password) {
    hideLoginError();
    setLoginLoading(true);

    try {
        await window.firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login fehlgeschlagen. Bitte prüfe deine Zugangsdaten.';

        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'Kein Benutzer mit dieser E-Mail gefunden.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Falsches Passwort.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Ungültige E-Mail-Adresse.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Zu viele Versuche. Bitte warte einen Moment.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Netzwerkfehler. Bitte prüfe deine Verbindung.';
                break;
            default:
                break;
        }

        showLoginError(errorMessage);
        setLoginLoading(false);
    }
}

function initLogin() {
    state.loginOverlay = document.getElementById('login-overlay');
    state.loginForm = document.getElementById('login-form');
    state.loginError = document.getElementById('login-error');
    state.loginLoading = document.getElementById('login-loading');

    if (!state.loginForm) {
        console.error('Login form not found!');
        return;
    }

    state.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value?.trim();
        const password = document.getElementById('login-password')?.value;

        if (!email || !password) {
            showLoginError('Bitte E-Mail und Passwort eingeben.');
            return;
        }

        handleLogin(email, password);
    });

    const passwordToggle = document.getElementById('password-toggle');
    const passwordInput = document.getElementById('login-password');
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';

            const eyeOpen = passwordToggle.querySelector('.eye-open');
            const eyeClosed = passwordToggle.querySelector('.eye-closed');
            if (eyeOpen && eyeClosed) {
                eyeOpen.classList.toggle('hidden');
                eyeClosed.classList.toggle('hidden');
            }
        });
    }
}

/**
 * @param {{
 *   firebaseConfig: Record<string, string>,
 *   appVersion: string,
 *   initializeApp: () => Promise<void>,
 *   updateUserInfo: (user: *, nameOverride?: string|null, photoOverride?: string|null) => void,
 *   showInstallBannerAfterLogin: () => void,
 *   setActiveTab: (pageId: string) => void,
 * }} deps
 */
function initAuthListener(deps) {
    state.deps = deps;
    if (!window.firebase?.apps?.length) {
        window.firebase.initializeApp(deps.firebaseConfig);
    }

    window.firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            if (isNativeApp()) {
                document.body.classList.add('native-app');
            }
            document.body.classList.add('authenticated');
            setLoginLoading(false);

            if (state.loginOverlay) {
                state.loginOverlay.style.display = 'none';
            }

            deps.updateUserInfo(user);
            window.__features?.presence?.onLogin(user);
            window.__features?.bulletin?.onLogin(user);
            window.__features?.streckenliste?.onLogin(user);

            const bottomNav = document.getElementById('bottom-nav');
            if (bottomNav) {
                bottomNav.classList.remove('hidden');
                deps.setActiveTab('dashboard');
            }

            if (!state.isAppInitialized) {
                state.isAppInitialized = true;
                deps.initializeApp().then(async () => {
                    try {
                        if (isNativeApp()) {
                            await window.__features?.notifications?.init({
                                swReg: null,
                                appVersion: deps.appVersion,
                            });
                        } else if ('serviceWorker' in navigator) {
                            let reg = window.globalSwReg || await navigator.serviceWorker.getRegistration();

                            if (!reg) {
                                const timeout = new Promise((r) => setTimeout(() => r(null), 5000));
                                reg = await Promise.race([navigator.serviceWorker.ready, timeout]);
                            }

                            if (reg) {
                                await window.__features?.notifications?.init({
                                    swReg: reg,
                                    appVersion: deps.appVersion,
                                });
                            }
                        }
                    } catch (e) {
                        console.error('Push init error:', e);
                    }
                }).catch((error) => {
                    window.showToast?.('App Fehler: ' + error.message, 'error');
                    console.error('App initialization error:', error);
                });

                deps.showInstallBannerAfterLogin();
            }
        } else {
            document.body.classList.remove('authenticated');
            window.__features?.presence?.onLogout(); // Sofortige Bereinigung
            window.__features?.bulletin?.onLogout();
            window.__features?.streckenliste?.onLogout();
            window.__features?.dokumente?.onLogout();
            window.__features?.map?.onLogout();

            if (state.loginOverlay) {
                state.loginOverlay.style.setProperty('display', 'flex', 'important');
            }

            setLoginLoading(false);
        }
    });
}

function logout() {
    const user = window.firebase.auth().currentUser;
    const performSignOut = () => {
        window.firebase.auth().signOut().then(() => {
            window.showToast?.('Erfolgreich abgemeldet');
            state.isAppInitialized = false;
        }).catch((error) => {
            console.error('Logout error:', error);
            window.showToast?.('Fehler beim Abmelden', 'error');
        });
    };

    if (user) {
        const presenceP = window.__features?.presence?.markOffline?.();
        if (presenceP && typeof presenceP.finally === 'function') {
            presenceP.finally(performSignOut);
        } else {
            performSignOut();
        }
    } else {
        performSignOut();
    }
}

export const authFeature = {
    initLogin,
    initAuthListener,
    logout,

    initUI() {
        window.logout = logout;
    },
};
