/**
 * js/router.js class Router
 * ─────────────────────────────────────────────────────────────────────
 * Loads page HTML fragments from /pages/ into their shell containers,
 * populates LANG strings, and handles navigation state.
 * ─────────────────────────────────────────────────────────────────────
 */

class Router {
    constructor() {
        this._pages = {
            auth: { containerId: 'authScreen', file: 'pages/auth.html', loaded: false, onLoad: _initAuthStrings },
            home: { containerId: 'homePage', file: 'pages/home.html', loaded: false, onLoad: _initHomeStrings },
            game: { containerId: 'gamePage', file: 'pages/game.html', loaded: false, onLoad: _initGameStrings },
            stats: { containerId: 'statsPage', file: 'pages/stats.html', loaded: false, onLoad: _initStatsStrings },
        };
    }

    // PUBLIC API

    /** Load a page fragment by key (cached after first load) */
    async loadPage(key) {
        const page = this._pages[key];
        if (!page) return console.error(`[router] Unknown page: "${key}"`);
        if (page.loaded) return;

        try {
            const res = await fetch(page.file);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const html = await res.text();
            document.getElementById(page.containerId).innerHTML = html;
            page.onLoad();
            page.loaded = true;
        } catch (err) {
            console.error(`[router] Failed to load ${page.file}:`, err);
        }
    }

    /** Navigate to a page, loading its fragments if required */
    async showPage(key) {
        // Ensure the fragment is loaded first
        await this.loadPage(key);

        // Hide all app pages, deactivate nav buttons
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(key + 'Page').classList.add('active');

        if (key === 'home') document.getElementById('nbHome').classList.add('active');
        if (key === 'stats') {
            document.getElementById('nbStats').classList.add('active');
            window.app.stats.load()  // defined in stats.js
        }
    }

    /** Show the auth screen, hide the app. */
    async showAuth() {
        await this.loadPage('auth');
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
    }

    /** Returns true once a page fragment has been injected into the DOM. */
    isPageLoaded(key) {
        return this._pages[key]?.loaded ?? false;
    }

    /** Boot: init static strings, load auth (blocking), prefetch home. */
    async bootRouter() {
        this._initTopbarStrings();
        this._initModalStrings();

        await this.loadPage('auth');          // blocking — needed before tryAutoLogin
        this.loadPage('home');                // non-blocking background prefetch
    }

    // STRING POPULATION CALLBACKS
    // Each runs once, immediately after its fragment's HTML is injected.

    _initAuthStrings() {
        const $ = id => document.getElementById(id);
        $('authTagline').textContent = LANG.auth.appTagline;
        $('tabLogin').textContent = LANG.auth.tabSignIn;
        $('tabReg').textContent = LANG.auth.tabRegister;
        $('lblLoginEmail').textContent = LANG.auth.labelEmail;
        $('lblLoginPass').textContent = LANG.auth.labelPassword;
        $('liEmail').placeholder = LANG.auth.placeholderEmail;
        $('liPass').placeholder = LANG.auth.placeholderPassLogin;
        $('btnSignIn').textContent = LANG.auth.btnSignIn;
        $('lblRegName').textContent = LANG.auth.labelName;
        $('lblRegEmail').textContent = LANG.auth.labelEmail;
        $('lblRegPass').textContent = LANG.auth.labelPassword;
        $('rName').placeholder = LANG.auth.placeholderName;
        $('rEmail').placeholder = LANG.auth.placeholderEmail;
        $('rPass').placeholder = LANG.auth.placeholderPassReg;
        $('btnRegister').textContent = LANG.auth.btnRegister;
        $('btnGuest').textContent = LANG.auth.btnGuest;
        $('guestNote').textContent = LANG.auth.guestNote;
        $('guestDividerText').textContent = 'or';
    }

    _initHomeStrings() {
        const $ = id => document.getElementById(id);
        $('heroStreakLbl').textContent = LANG.home.streakLabel;
        $('chooseModeTitle').textContent = LANG.home.chooseModeTitle;
        $('dailyTitle').textContent = LANG.home.daily.title;
        $('dailyDesc').textContent = LANG.home.daily.desc;
        $('dailyPill').textContent = LANG.home.daily.pill;
        $('practiceTitle').textContent = LANG.home.practice.title;
        $('practiceDesc').textContent = LANG.home.practice.desc;
        $('practicePill').textContent = LANG.home.practice.pill;
        $('timedTitle').textContent = LANG.home.timed.title;
        $('timedDesc').textContent = LANG.home.timed.desc;
        $('timedPill').textContent = LANG.home.timed.pill;
    }

    _initGameStrings() {
        const $ = id => document.getElementById(id);
        $('btnBack').textContent = LANG.game.btnBack;
        $('cluesPanelTitle').textContent = LANG.game.cluesPanelTitle;
        $('guessesLeftLabel').textContent = LANG.game.guessesLeft;
    }

    _initStatsStrings() {
        const $ = id => document.getElementById(id);
        $('statsSectionTitle').textContent = LANG.stats.title;
        $('sPlayedLbl').textContent = LANG.stats.played;
        $('sWinLbl').textContent = LANG.stats.winRate;
        $('sStreakLbl').textContent = LANG.stats.currentStreak;
        $('sMaxLbl').textContent = LANG.stats.bestStreak;
        $('distSectionTitle').textContent = LANG.stats.distTitle;
        $('groupSectionTitle').textContent = LANG.stats.groupTitle;
        $('lbSectionTitle').textContent = LANG.stats.lbTitle;
        $('lbHeader').innerHTML =
            LANG.stats.lbHeaders.map(h => `<div class="lb-cell">${h}</div>`).join('');
    }

    _initTopbarStrings() {
        document.getElementById('nbHome').textContent = LANG.nav.play;
        document.getElementById('nbStats').textContent = LANG.nav.stats;
        document.getElementById('btnSignOut').textContent = LANG.nav.signOut;
    }

    _initModalStrings() {
        const $ = id => document.getElementById(id);
        $('diffTitle').textContent = LANG.difficulty.title;
        $('diffEasyName').textContent = LANG.difficulty.easy.name;
        $('diffEasySub').textContent = LANG.difficulty.easy.sub;
        $('diffMedName').textContent = LANG.difficulty.medium.name;
        $('diffMedSub').textContent = LANG.difficulty.medium.sub;
        $('diffHardName').textContent = LANG.difficulty.hard.name;
        $('diffHardSub').textContent = LANG.difficulty.hard.sub;
        $('diffStartBtn').textContent = LANG.difficulty.btnStart;
    }
}