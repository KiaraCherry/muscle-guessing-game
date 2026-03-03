/**
 * js/auth.js
 * ─────────────────────────────────────────────────────────────────────
 * Authentication: login, register, guest mode, auto-login, sign-out.
 *
 * Navigation is delegated to router.js:
 *   showAuth()    — shows the auth screen
 *   showPage(key) — navigates to a page fragment
 *
 * Depends on: config.js, lang/en/en.js, router.js
 * ─────────────────────────────────────────────────────────────────────
 */

// STATE
let token = localStorage.getItem('musclele_token') || null;
let currentUser = null;
let isGuest = false;

// API HELPERS

async function apiPost(path, body, requiresAuth = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (requiresAuth && token) headers['Authorization'] = 'Bearer ' + token;
    const res = await fetch(API + path, {
        method: 'POST', headers, body: JSON.stringify(body),
    });
    return res.json();
}

async function apiGet(path) {
    const res = await fetch(API + path, {
        headers: { 'Authorization': 'Bearer ' + token },
    });
    return res.json();
}

// AUTH TAB SWITCHER

function authTab(tab) {
    document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
    document.getElementById('tabReg').classList.toggle('active', tab === 'register');
    document.getElementById('fLogin').classList.toggle('hidden', tab !== 'login');
    document.getElementById('fReg').classList.toggle('hidden', tab !== 'register');
    document.getElementById('authErr').textContent = '';
}

// REGISTER

async function doRegister() {
    const displayName = document.getElementById('rName').value.trim();
    const email = document.getElementById('rEmail').value.trim();
    const password = document.getElementById('rPass').value;

    if (!displayName || !email || !password) return setAuthErr(LANG.auth.errFillAll);

    try {
        const data = await apiPost('/api/register', { displayName, email, password });
        if (data.error) return setAuthErr(data.error);
        _storeSession(data.token, data.user);
        enterApp();
    } catch {
        setAuthErr(LANG.auth.errNoServer);
    }
}

// LOGIN

async function doLogin() {
    const email = document.getElementById('liEmail').value.trim();
    const password = document.getElementById('liPass').value;

    if (!email || !password) return setAuthErr(LANG.auth.errFillAll);

    try {
        const data = await apiPost('/api/login', { email, password });
        if (data.error) return setAuthErr(data.error);
        _storeSession(data.token, data.user);
        enterApp();
    } catch {
        setAuthErr(LANG.auth.errNoServer);
    }
}

// GUEST MODE

function continueAsGuest() {
    isGuest = true;
    token = null;
    currentUser = null;
    enterApp();
}

// SIGN OUT

function doSignOut() {
    token = null;
    currentUser = null;
    isGuest = false;
    localStorage.removeItem('musclele_token');
    showAuth();   // router.js
}

// AUTO-LOGIN

async function tryAutoLogin() {
    if (!token) return showAuth();

    try {
        const data = await apiGet('/api/me');
        if (data.error) {
            token = null;
            localStorage.removeItem('musclele_token');
            return showAuth();
        }
        currentUser = data.user;
        isGuest = false;
        enterApp();
    } catch {
        showAuth();
    }
}

// ENTER APP

function enterApp() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    isGuest ? _populateGuestShell() : _populateUserShell();
    showPage('home');   // router.js — loads pages/home.html if not yet loaded
}

// SHELL: LOGGED-IN USER

function _populateUserShell() {
    const u = currentUser;
    const initials = u.displayName
        .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    document.getElementById('uAvatar').textContent = initials;
    document.getElementById('uName').textContent = u.displayName;
    document.getElementById('btnSignOut').textContent = LANG.nav.signOut;
    document.getElementById('btnSignOut').onclick = doSignOut;

    // Home hero — set after home fragment is loaded
    _whenLoaded('home', () => {
        document.getElementById('heroGreeting').textContent = LANG.home.greeting;
        document.getElementById('heroName').textContent = u.displayName.split(' ')[0];
        document.getElementById('heroDate').textContent = _formatDate();
        document.getElementById('heroStreak').textContent = u.stats?.daily?.currentStreak || 0;
        document.getElementById('guestBanner').classList.add('hidden');
        document.getElementById('heroStreakBlock').classList.remove('hidden');

        // Daily done badge
        const today = getTodayStr();
        const done = (u.dailyCompleted || []).includes(today);
        const cardEl = document.getElementById('dailyCard');
        let badge = cardEl.querySelector('.daily-done-badge');
        if (done) {
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'daily-done-badge';
                badge.textContent = LANG.home.daily.done;
                cardEl.appendChild(badge);
            }
        } else {
            badge?.remove();
        }
    });
}

// SHELL: GUEST

function _populateGuestShell() {
    document.getElementById('uAvatar').textContent = '?';
    document.getElementById('uName').textContent = 'Guest';
    document.getElementById('btnSignOut').textContent = LANG.nav.signIn;
    document.getElementById('btnSignOut').onclick = doSignOut;

    _whenLoaded('home', () => {
        document.getElementById('heroGreeting').textContent = LANG.home.greetingGuest;
        document.getElementById('heroName').textContent = '';
        document.getElementById('heroDate').textContent = _formatDate();
        document.getElementById('heroStreakBlock').classList.add('hidden');

        const banner = document.getElementById('guestBanner');
        banner.classList.remove('hidden');
        document.getElementById('guestBannerText').textContent = LANG.home.guestBanner;
        document.getElementById('guestBannerBtn').textContent = LANG.home.guestBannerBtn;
        document.getElementById('guestBannerBtn').onclick = doSignOut;

        document.getElementById('dailyCard').querySelector('.daily-done-badge')?.remove();
    });
}

// HELPERS

function setAuthErr(msg) {
    document.getElementById('authErr').textContent = msg;
}

function _storeSession(tok, user) {
    token = tok;
    currentUser = user;
    isGuest = false;
    localStorage.setItem('musclele_token', tok);
}

function _formatDate() {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
    });
}

/**
 * Runs a callback once a page fragment is confirmed loaded.
 * If the page is already loaded, runs synchronously.
 * If not yet loaded, polls every 50ms until it is.
 */
function _whenLoaded(pageKey, callback) {
    const check = () => {
        if (PAGES[pageKey]?.loaded) { callback(); }
        else { setTimeout(check, 50); }
    };
    check();
}

// DATE HELPER (shared with game.js)

function getTodayStr() {
    return new Date().toISOString().slice(0, 10);
}