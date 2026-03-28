/**
 * js/auth.js class Auth
 * ─────────────────────────────────────────────────────────────────────
 * Login, registration, guest mode, auto-login, sign-out, shell population.
 */

class Auth {

    constructor() {
        this.token = localStorage.getItem('musclele_token') || null;
        this.currentUser = null;
        this.isGuest = false;
    }

    /** API Helpers */
    async post(path, body, requiresAuth = false) {
        const headers = { 'Content-Type': 'application/json' };
        if (requiresAuth && this.token) headers['Authorization'] = 'Bearer ' + this.token;
        const res = await fetch(API + path, {
            method: 'POST', headers, body: JSON.stringify(body),
        });
        return res.json();
    }

    async get(path) {
        const res = await fetch(API + path, {
            headers: { 'Authorization': 'Bearer ' + this.token },
        });
        return res.json();
    }

    /** Auth Tab Switcher */
    switchTab(tab) {
        document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
        document.getElementById('tabReg').classList.toggle('active', tab === 'register');
        document.getElementById('fLogin').classList.toggle('hidden', tab !== 'login');
        document.getElementById('fReg').classList.toggle('hidden', tab !== 'register');
        document.getElementById('authErr').textContent = '';
    }

    /** Register */
    async register() {
        const displayName = document.getElementById('rName').value.trim();
        const email = document.getElementById('rEmail').value.trim();
        const password = document.getElementById('rPass').value;

        if (!displayName || !email || !password) return this._setErr(LANG.auth.errFillAll);

        try {
            const data = await this.post('/api/register', { displayName, email, password });
            if (data.error) return this._setErr(data.error);
            this._storeSession(data.token, data.user);
            this.enterApp();
        } catch {
            this._setErr(LANG.auth.errNoServer);
        }
    }

    /** Login */
    async login() {
        const email = document.getElementById('liEmail').value.trim();
        const password = document.getElementById('liPass').value;

        if (!email || !password) return this._setErr(LANG.auth.errFillAll);

        try {
            const data = await this.post('/api/login', { email, password });
            if (data.error) return this._setErr(data.error);
            this._storeSession(data.token, data.user);
            this.enterApp();
        } catch {
            this._setErr(LANG.auth.errNoServer);
        }
    }

    /** Guest Mode */
    continueAsGuest() {
        this.isGuest = true;
        this.token = null;
        this.currentUser = null;
        this.enterApp();
    }

    /** Sign Out */
    signOut() {
        this.token = null;
        this.currentUser = null;
        this.isGuest = false;
        localStorage.removeItem('musclele_token');
        window.app.router.showAuth();
    }

    /** Auto-Login */
    async tryAutoLogin() {
        if (!this.token) return window.app.router.showAuth();

        try {
            const data = await this.get('/api/me');
            if (data.error) {
                this.token = null;
                localStorage.removeItem('musclele_token');
                return window.app.router.showAuth();
            }
            this.currentUser = data.user;
            this.isGuest = false;
            this.enterApp();
        } catch {
            window.app.router.showAuth();
        }
    }

    /** Enter App */
    enterApp() {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        this.isGuest ? this._populateGuestShell() : this._populateUserShell();
        window.app.router.showPage('home');
    }

    /** Shell: Logged-in User */
    _populateUserShell() {
        const u = this.currentUser;
        const initials = u.displayName
            .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

        document.getElementById('uAvatar').textContent = initials;
        document.getElementById('uName').textContent = u.displayName;
        document.getElementById('btnSignOut').textContent = LANG.nav.signOut;
        document.getElementById('btnSignOut').onclick = () => this.signOut();

        this._whenLoaded('home', () => {
            document.getElementById('heroGreeting').textContent = LANG.home.greeting;
            document.getElementById('heroName').textContent = u.displayName.split(' ')[0];
            document.getElementById('heroDate').textContent = this._formatDate();
            document.getElementById('heroStreak').textContent = u.stats?.daily?.currentStreak || 0;
            document.getElementById('guestBanner').classList.add('hidden');
            document.getElementById('heroStreakBlock').classList.remove('hidden');

            const today = getTodayStr();
            const done = (u.dailyCompleted || []).includes(today);
            const cardEl = document.getElementById('dailyCard');
            let badge = cardEl.querySelector('.daily-done-badge');
            if (done) {
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'daily-done-badge';
                    const [icon, label] = LANG.home.daily.done.split('||');
                    badge.innerHTML = `<span class="material-symbols-rounded">${icon}</span> ${label}`;
                    cardEl.appendChild(badge);
                }
            } else {
                badge?.remove();
            }
        });
    }

    /** Shell: Guest */
    _populateGuestShell() {
        document.getElementById('uAvatar').textContent = '?';
        document.getElementById('uName').textContent = 'Guest';
        document.getElementById('btnSignOut').textContent = LANG.nav.signIn;
        document.getElementById('btnSignOut').onclick = () => this.signOut();

        this._whenLoaded('home', () => {
            document.getElementById('heroGreeting').textContent = LANG.home.greetingGuest;
            document.getElementById('heroName').textContent = '';
            document.getElementById('heroDate').textContent = this._formatDate();
            document.getElementById('heroStreakBlock').classList.add('hidden');

            const banner = document.getElementById('guestBanner');
            banner.classList.remove('hidden');
            document.getElementById('guestBannerText').textContent = LANG.home.guestBanner;
            document.getElementById('guestBannerBtn').textContent = LANG.home.guestBannerBtn;
            document.getElementById('guestBannerBtn').onclick = () => this.signOut();

            document.getElementById('dailyCard').querySelector('.daily-done-badge')?.remove();
        });
    }

    /** Helpers */
    _setErr(msg) {
        document.getElementById('authErr').textContent = msg;
    }

    _storeSession(tok, user) {
        this.token = tok;
        this.currentUser = user;
        this.isGuest = false;
        localStorage.setItem('musclele_token', tok);
    }

    _formatDate() {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
        });
    }

    _whenLoaded(pageKey, callback) {
        const check = () => {
            if (window.app.router.isLoaded(pageKey)) callback();
            else setTimeout(check, 50);
        };
        check();
    }
}

/** Shared Date Helper (used by Game) */
function getTodayStr() {
    return new Date().toISOString().slice(0, 10);
}