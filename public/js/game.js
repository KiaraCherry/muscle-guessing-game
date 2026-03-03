/**
 * js/game.js — class Game
 * ─────────────────────────────────────────────────────────────────────
 * Mode selection, region filter (practice), difficulty modal, grid,
 * tile animations, keyboard, clue reveal, body diagram, timer,
 * result overlay.
 */

class Game {

    constructor() {
        this._G = {};        // current round state
        this._timerInterval = null;
        this._pendingMode = null;
        this._chosenDiff = 'easy';
        this._chosenRegion = 'all';     // 'all' or a region string

        // Physical keyboard listener
        document.addEventListener('keydown', e => this._onKeyDown(e));
    }

    /** Material Icon Helper */
    _icon(name, extraClass = '') {
        return `<span class="material-symbols-rounded${extraClass ? ' ' + extraClass : ''}">${name}</span>`;
    }

    /** Mode Selection */
    startMode(mode) {
        this._pendingMode = mode;

        if (mode === 'practice') {
            // Practice: show region filter first, then difficulty
            this._openRegionModal();
        } else {
            // Daily / timed: go straight to difficulty
            this._openDiffModal();
        }
    }

    /** Region Filter Modal (Practice Only) */
    _openRegionModal() {
        const modal = document.getElementById('regionModal');

        // Build region options from the muscle database
        const regions = ['all', ...new Set(MUSCLES.map(m => m.region))].sort((a, b) =>
            a === 'all' ? -1 : a.localeCompare(b)
        );

        document.getElementById('regionModalTitle').textContent = LANG.region.title;
        document.getElementById('regionModalSub').textContent = LANG.region.sub;
        document.getElementById('regionNextBtn').textContent = LANG.region.btnStart;

        const grid = document.getElementById('regionGrid');
        grid.innerHTML = regions.map(r => {
            const isAll = r === 'all';
            const count = isAll ? MUSCLES.length : MUSCLES.filter(m => m.region === r).length;
            const label = isAll ? LANG.region.allRegions : r;
            const sub = isAll ? LANG.region.allSub : `${count} muscle${count !== 1 ? 's' : ''}`;
            const sel = r === this._chosenRegion ? ' sel' : '';
            return `<div class="region-opt${sel}" data-region="${r}" onclick="window.app.game._pickRegion('${r}')">
        <div class="region-opt-name">${label}</div>
        <div class="region-opt-sub">${sub}</div>
      </div>`;
        }).join('');

        modal.classList.add('open');
    }

    _pickRegion(r) {
        this._chosenRegion = r;
        document.querySelectorAll('.region-opt').forEach(el => {
            el.classList.toggle('sel', el.dataset.region === r);
        });
    }

    _confirmRegion() {
        document.getElementById('regionModal').classList.remove('open');
        this._openDiffModal();
    }

    /** Difficulty Modal */
    _openDiffModal() {
        document.getElementById('diffModalSub').textContent =
            this._pendingMode === 'daily' ? LANG.difficulty.subDaily : LANG.difficulty.subDefault;
        document.getElementById('diffModal').classList.add('open');
        this.pickDiff(this._chosenDiff);
    }

    pickDiff(d) {
        this._chosenDiff = d;
        const classMap = { easy: 'd-easy', medium: 'd-med', hard: 'd-hard' };
        document.querySelectorAll('.diff-opt').forEach(el => el.classList.remove('sel'));
        document.querySelector('.' + classMap[d])?.classList.add('sel');
    }

    confirmStart() {
        document.getElementById('diffModal').classList.remove('open');
        this.launchGame(this._pendingMode, this._chosenDiff);
    }

    /** Launch Game */
    async launchGame(mode, diff) {
        clearInterval(this._timerInterval);
        await window.app.router.loadPage('game');

        const cfg = DIFF_CONFIG[diff];
        const muscle = mode === 'daily'
            ? this._getDailyMuscle()
            : this._pickRandomMuscle(this._chosenRegion);

        this._G = {
            mode,
            diff,
            muscle,
            target: muscle.name.replace(/[\s-]/g, ''),
            guesses: [],
            current: [],
            gameOver: false,
            won: false,
            keyStates: {},
            maxGuesses: cfg.guesses,
            maxClues: cfg.maxClues,
            cluesShown: 0,
            timerSecs: TIMER_SECONDS,
            date: getTodayStr(),
        };

        this._applyModeTags(mode, diff);
        this._initTimer(mode);
        this._renderClues();
        this._renderDiagram();
        this._renderInfoRow();
        this._buildGrid();
        this._buildKeyboard();
        this._updateGuessesLeft(cfg.guesses);
        document.getElementById('msgBar').classList.remove('show');

        const hint = document.getElementById('hintNote');
        hint.textContent = (muscle.name.includes(' ') || muscle.name.includes('-'))
            ? LANG.game.hintNote(muscle.name)
            : '';

        window.app.router.showPage('game');
    }

    /** Clue Rendering */
    _renderClues() {
        const G = this._G;
        const list = document.getElementById('clueList');
        const empty = document.getElementById('clueEmpty');
        const shown = Math.min(G.cluesShown, G.maxClues, G.muscle.clues.length);
        const total = Math.min(G.maxClues, G.muscle.clues.length);

        if (empty) empty.style.display = shown === 0 ? 'flex' : 'none';
        list.querySelectorAll('.clue-item').forEach(el => el.remove());

        for (let i = 0; i < shown; i++) {
            const c = G.muscle.clues[i];
            const div = document.createElement('div');
            div.className = 'clue-item';
            div.innerHTML = `<span class="clue-lbl">${c.lbl}</span><span class="clue-txt">${c.txt}</span>`;
            list.appendChild(div);
            setTimeout(() => div.classList.add('show'), 40 * i);
        }

        document.getElementById('clueCountBadge').textContent = `${shown} / ${total}`;

        const remaining = total - shown;
        const lockedEl = document.getElementById('clueLocked');
        if (remaining > 0 && !G.gameOver) {
            lockedEl.style.display = 'flex';
            document.getElementById('clueLockedTxt').textContent = LANG.game.cluesLocked(remaining);
        } else {
            lockedEl.style.display = 'none';
        }
    }

    /** Body Diagram */
    _renderDiagram() {
        const dot = this._G.muscle.dot;
        const group = document.getElementById('muscleDot');
        if (!dot || !group) return;

        group.setAttribute('transform', `translate(${dot.x}, ${dot.y})`);
        const label = document.getElementById('dotLabel');
        if (label) label.textContent = dot.label;

        // Restart CSS animation by replacing the node
        const fresh = group.cloneNode(true);
        group.parentNode.replaceChild(fresh, group);
    }

    /** Info Chips */
    _renderInfoRow() {
        const G = this._G;
        document.getElementById('infoRow').innerHTML = `
      <div class="info-chip">
        <div class="info-chip-lbl">${LANG.game.infoRegion}</div>
        <div class="info-chip-val">${G.muscle.region}</div>
      </div>
      <div class="info-chip">
        <div class="info-chip-lbl">${LANG.game.infoGroup}</div>
        <div class="info-chip-val">${G.muscle.group}</div>
      </div>
      <div class="info-chip">
        <div class="info-chip-lbl">${LANG.game.infoType}</div>
        <div class="info-chip-val">${G.muscle.type}</div>
      </div>
      <div class="info-chip">
        <div class="info-chip-lbl">${LANG.game.infoLetters}</div>
        <div class="info-chip-val">${G.target.length}</div>
      </div>
    `;
    }

    /** Grid */
    _buildGrid() {
        const G = this._G;
        const grid = document.getElementById('guessGrid');
        grid.innerHTML = '';

        for (let r = 0; r < G.maxGuesses; r++) {
            const row = document.createElement('div');
            row.className = 'guess-row';
            row.id = 'row' + r;

            for (let c = 0; c < G.target.length; c++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.id = `t${r}_${c}`;
                row.appendChild(tile);
            }
            grid.appendChild(row);
        }
        this._refreshGrid();
    }

    _refreshGrid() {
        const G = this._G;
        const len = G.target.length;

        for (let r = 0; r < G.guesses.length; r++) {
            const firstTile = document.getElementById(`t${r}_0`);
            if (firstTile && /correct|present|absent/.test(firstTile.className)) continue;

            const guess = G.guesses[r];
            const result = this._scoreGuess(guess, G.target);
            for (let c = 0; c < len; c++) {
                const tile = document.getElementById(`t${r}_${c}`);
                tile.textContent = guess[c] || '';
                tile.className = `tile ${result[c]}`;
                tile.style.animationDelay = `${c * 85}ms`;
            }
        }

        if (!G.gameOver) {
            const r = G.guesses.length;
            for (let c = 0; c < len; c++) {
                const tile = document.getElementById(`t${r}_${c}`);
                if (!tile) continue;
                tile.textContent = G.current[c] || '';
                tile.className =
                    'tile' +
                    (G.current[c] ? ' fill' : '') +
                    (c === G.current.length ? ' cur' : '');
            }
        }
    }

    /** Scoring */
    _scoreGuess(guess, target) {
        const result = Array(target.length).fill('absent');
        const targetArr = target.split('');
        const guessArr = guess.split('');

        for (let i = 0; i < target.length; i++) {
            if (guessArr[i] === targetArr[i]) {
                result[i] = 'correct';
                targetArr[i] = null;
                guessArr[i] = null;
            }
        }
        for (let i = 0; i < target.length; i++) {
            if (!guessArr[i]) continue;
            const idx = targetArr.indexOf(guessArr[i]);
            if (idx !== -1) {
                result[i] = 'present';
                targetArr[idx] = null;
            }
        }
        return result;
    }

    /** Keyboard */
    _buildKeyboard() {
        const G = this._G;
        const kb = document.getElementById('keyboard');
        kb.innerHTML = '';

        const rows = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
        ];

        rows.forEach(row => {
            const div = document.createElement('div');
            div.className = 'kb-row';
            row.forEach(k => {
                const btn = document.createElement('div');
                btn.className = `key${k.length > 1 ? ' wide' : ''} ${G.keyStates[k] || ''}`;
                btn.textContent = k;
                btn.dataset.key = k;
                btn.addEventListener('click', () => this.handleKey(k));
                div.appendChild(btn);
            });
            kb.appendChild(div);
        });
    }

    handleKey(k) {
        const G = this._G;
        if (G.gameOver) return;

        if (k === '⌫' || k === 'Backspace') {
            G.current.pop();
            this._refreshGrid();

        } else if (k === 'ENTER' || k === 'Enter') {
            this._submitGuess();

        } else if (/^[a-zA-Z]$/.test(k)) {
            const upper = k.toUpperCase();
            if (G.current.length < G.target.length) {
                G.current.push(upper);
                const tile = document.getElementById(`t${G.guesses.length}_${G.current.length - 1}`);
                if (tile) {
                    tile.textContent = upper;
                    tile.className = 'tile fill pop';
                    setTimeout(() => { tile.className = 'tile fill'; }, 130);
                }
                this._refreshGrid();
            }
        }
    }

    _onKeyDown(e) {
        if (!document.getElementById('gamePage')?.classList.contains('active')) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.key === 'Backspace') this.handleKey('Backspace');
        else if (e.key === 'Enter') this.handleKey('Enter');
        else if (/^[a-zA-Z]$/.test(e.key)) this.handleKey(e.key.toUpperCase());
    }

    /** Submit Guess */
    async _submitGuess() {
        const G = this._G;
        if (G.current.length < G.target.length) {
            this._shakeRow(G.guesses.length);
            this._showMsg(LANG.game.msgNeedMore(G.target.length));
            return;
        }

        const guess = G.current.join('');
        const rowIdx = G.guesses.length;
        G.guesses.push(guess);
        G.current = [];

        const result = this._scoreGuess(guess, G.target);
        const len = G.target.length;
        for (let c = 0; c < len; c++) {
            const tile = document.getElementById(`t${rowIdx}_${c}`);
            if (!tile) continue;
            tile.textContent = guess[c] || '';
            tile.className = `tile ${result[c]}`;
            tile.style.animationDelay = `${c * 85}ms`;
        }

        for (let i = 0; i < len; i++) {
            const letter = guess[i];
            const prev = G.keyStates[letter];
            if (result[i] === 'correct') G.keyStates[letter] = 'correct';
            else if (result[i] === 'present' && prev !== 'correct') G.keyStates[letter] = 'present';
            else if (!prev) G.keyStates[letter] = 'absent';
        }

        const flipDuration = len * 85 + 500;
        setTimeout(() => {
            this._buildKeyboard();

            const won = guess === G.target;
            const lost = !won && G.guesses.length >= G.maxGuesses;

            if (!won && !lost) {
                if (G.cluesShown < Math.min(G.maxClues, G.muscle.clues.length)) {
                    G.cluesShown++;
                    this._renderClues();
                }
            }

            this._updateGuessesLeft(G.maxGuesses - G.guesses.length);

            if (won) {
                document.getElementById('row' + rowIdx)
                    ?.querySelectorAll('.tile')
                    .forEach((t, i) => setTimeout(() => t.classList.add('win-bounce'), i * 80));
                this._endGame(true);
            } else if (lost) {
                G.cluesShown = G.muscle.clues.length;
                this._renderClues();
                this._endGame(false);
            }
        }, flipDuration);
    }

    /** End Game */
    async _endGame(won) {
        const G = this._G;
        clearInterval(this._timerInterval);
        G.gameOver = true;
        G.won = won;
        G.cluesShown = G.muscle.clues.length;
        this._renderClues();

        const auth = window.app.auth;
        if (!auth.isGuest && auth.currentUser) {
            try {
                const data = await auth.post('/api/result', {
                    mode: G.mode,
                    difficulty: G.diff,
                    won,
                    guessCount: G.guesses.length,
                    muscleGroup: G.muscle.group,
                    date: G.date,
                }, true);

                if (data.user) {
                    auth.currentUser = data.user;
                    const el = document.getElementById('heroStreak');
                    if (el) el.textContent = data.user.stats?.daily?.currentStreak || 0;
                }
            } catch (e) {
                console.warn('Could not save result:', e);
            }
        }

        setTimeout(() => this._showResult(won), won ? 700 : 500);
    }

    /** Result Overlay */
    _showResult(won) {
        const G = this._G;
        const m = G.muscle;
        const phrases = LANG.result.wonPhrases;
        const auth = window.app.auth;

        document.getElementById('rEmoji').innerHTML =
            this._icon(won ? LANG.result.emojiWon : LANG.result.emojiLost, 'result-icon');
        document.getElementById('rHeading').textContent = won
            ? phrases[Math.floor(Math.random() * phrases.length)]
            : LANG.result.lost;
        document.getElementById('rMuscle').textContent = m.name;
        document.getElementById('rFullname').textContent = m.displayName;
        document.getElementById('rFact').innerHTML = m.fact;

        const streak = auth.currentUser?.stats?.daily?.currentStreak || 0;
        document.getElementById('rStats').innerHTML = `
      <div class="r-stat">
        <div class="rs-val">${G.guesses.length}</div>
        <div class="rs-lbl">${LANG.result.statGuesses}</div>
      </div>
      <div class="r-stat">
        <div class="rs-val">${streak}</div>
        <div class="rs-lbl">${LANG.result.statStreak}</div>
      </div>
    `;

        const btns = document.getElementById('rBtns');
        if (G.mode === 'daily') {
            btns.innerHTML = `
        <button class="r-btn"         onclick="window.app.router.showPage('home'); window.app.game.closeResult();">${LANG.result.btnHome}</button>
        <button class="r-btn primary" onclick="window.app.router.showPage('stats'); window.app.game.closeResult();">${LANG.result.btnStats}</button>
      `;
        } else {
            btns.innerHTML = `
        <button class="r-btn"         onclick="window.app.router.showPage('home'); window.app.game.closeResult();">${LANG.result.btnHome}</button>
        <button class="r-btn primary" onclick="window.app.game.closeResult(); window.app.game.launchGame('${G.mode}','${G.diff}');">${LANG.result.btnNext}</button>
      `;
        }

        document.getElementById('resultOverlay').classList.add('open');
    }

    closeResult() {
        document.getElementById('resultOverlay').classList.remove('open');
    }

    /** Timer */
    _initTimer(mode) {
        const section = document.getElementById('timerSection');
        const bar = document.getElementById('timerBar');
        const num = document.getElementById('timerNum');
        clearInterval(this._timerInterval);

        if (mode !== 'timed') {
            section?.classList.remove('active');
            return;
        }

        section.classList.add('active');
        bar.style.width = '100%';
        bar.classList.remove('urgent');
        num.classList.remove('urgent');
        num.textContent = this._G.timerSecs;

        this._timerInterval = setInterval(() => {
            this._G.timerSecs--;
            num.textContent = this._G.timerSecs;
            bar.style.width = (this._G.timerSecs / TIMER_SECONDS * 100) + '%';
            if (this._G.timerSecs <= 15) {
                bar.classList.add('urgent');
                num.classList.add('urgent');
            }
            if (this._G.timerSecs <= 0) {
                clearInterval(this._timerInterval);
                this._endGame(false);
            }
        }, 1000);
    }

    /** Misc */
    exitGame() {
        clearInterval(this._timerInterval);
        this._G.gameOver = true;
        window.app.router.showPage('home');
    }

    _applyModeTags(mode, diff) {
        const modeTag = document.getElementById('gTagMode');
        const [modeIcon, modeLabel] = LANG.game.modeLabels[mode].split('||');
        modeTag.innerHTML = this._icon(modeIcon) + ' ' + modeLabel;
        modeTag.className = `g-tag gt-${mode}`;

        const diffTag = document.getElementById('gTagDiff');
        diffTag.textContent = LANG.game.diffLabels[diff];
        diffTag.className = `g-tag gt-${diff}`;
    }

    _updateGuessesLeft(n) {
        const span = document.getElementById('guessesLeftNum');
        if (!span) return;
        span.textContent = n;
        span.className = n <= 1 ? 'low' : '';
    }

    _shakeRow(rowIndex) {
        document.getElementById('row' + rowIndex)
            ?.querySelectorAll('.tile')
            .forEach(t => {
                t.classList.add('shake');
                setTimeout(() => t.classList.remove('shake'), 400);
            });
    }

    _showMsg(msg, duration = 1800) {
        const bar = document.getElementById('msgBar');
        if (!bar) return;
        bar.textContent = msg;
        bar.classList.add('show');
        setTimeout(() => bar.classList.remove('show'), duration);
    }

    /** Muscle Selection */
    _getDailyMuscle() {
        const start = new Date(DAILY_SEED_DATE);
        const today = new Date();
        const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        return MUSCLES[diff % MUSCLES.length];
    }

    _pickRandomMuscle(region = 'all') {
        const pool = region === 'all'
            ? MUSCLES
            : MUSCLES.filter(m => m.region === region);

        const source = pool.length > 0 ? pool : MUSCLES;
        const last = this._G?.muscle;
        let pick;
        do {
            pick = source[Math.floor(Math.random() * source.length)];
        } while (source.length > 1 && last && pick.name === last.name);
        return pick;
    }
}