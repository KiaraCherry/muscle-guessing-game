/**
 * js/game.js
 * ─────────────────────────────────────────────────────────────────────
 * Core game logic: mode selection, difficulty modal, grid rendering,
 * tile animations, keyboard input, clue reveal, timer, and result overlay.
 *
 * Depends on: config.js, lang/en/en.js, auth.js
 * ─────────────────────────────────────────────────────────────────────
 */

// GAME STATE
// G holds all mutable state for the current round.
let G = {};
let timerInterval = null;
let pendingMode = null;
let chosenDiff = 'easy';


// MATERIAL ICON HELPER
function _icon(name, extraClass = '') {
    return `<span class="material-symbols-rounded${extraClass ? ' ' + extraClass : ''}">${name}</span>`;
}

// PAGE NAVIGATION

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(page + 'Page').classList.add('active');

    if (page === 'home') document.getElementById('nbHome').classList.add('active');
    if (page === 'stats') {
        document.getElementById('nbStats').classList.add('active');
        loadStats();          // defined in stats.js
    }
}

// MODE & DIFFICULTY SELECTION 

function startMode(mode) {
    pendingMode = mode;
    const modal = document.getElementById('diffModal');
    document.getElementById('diffModalSub').textContent =
        mode === 'daily' ? LANG.difficulty.subDaily : LANG.difficulty.subDefault;
    modal.classList.add('open');
    pickDiff(chosenDiff);
}

function pickDiff(d) {
    chosenDiff = d;
    // Map difficulty key to CSS class suffix
    const classMap = { easy: 'd-easy', medium: 'd-med', hard: 'd-hard' };
    document.querySelectorAll('.diff-opt').forEach(el => el.classList.remove('sel'));
    document.querySelector('.' + classMap[d]).classList.add('sel');
}

function confirmStart() {
    document.getElementById('diffModal').classList.remove('open');
    launchGame(pendingMode, chosenDiff);
}

// LAUNCH GAME

async function launchGame(mode, diff) {
    clearInterval(timerInterval);
    // Ensure the game page fragment is loaded before touching its DOM
    await loadPage('game');

    const cfg = DIFF_CONFIG[diff];
    const muscle = mode === 'daily' ? _getDailyMuscle() : _pickRandomMuscle();

    G = {
        mode,
        diff,
        muscle,
        target: muscle.name.replace(/[\s-]/g, ''),  // strip spaces/hyphens for comparison
        guesses: [],
        current: [],
        gameOver: false,
        won: false,
        keyStates: {},
        maxGuesses: cfg.guesses,
        maxClues: cfg.maxClues,
        cluesShown: 0,  // starts at 0 — diagram first, clues unlock on wrong guesses
        timerSecs: TIMER_SECONDS,
        date: getTodayStr(),
    };

    _applyModeTags(mode, diff);
    _initTimer(mode);
    _renderClues();
    _renderDiagram();
    _renderInfoRow();
    _buildGrid();
    _buildKeyboard();

    // Guesses-left counter
    _updateGuessesLeft(cfg.guesses);
    document.getElementById('msgBar').classList.remove('show');

    // Hint note for compound names
    const hint = document.getElementById('hintNote');
    hint.textContent = (muscle.name.includes(' ') || muscle.name.includes('-'))
        ? LANG.game.hintNote(muscle.name)
        : '';

    showPage('game');
}

// CLUE RENDERING
// cluesShown starts at 0 — diagram is shown first, clues unlock on wrong guesses.

function _renderClues() {
    const list = document.getElementById('clueList');
    const empty = document.getElementById('clueEmpty');
    const shown = Math.min(G.cluesShown, G.maxClues, G.muscle.clues.length);
    const total = Math.min(G.maxClues, G.muscle.clues.length);

    // Show empty state if no clues revealed yet
    if (empty) empty.style.display = shown === 0 ? 'flex' : 'none';

    // Remove old clue items (keep the empty placeholder)
    list.querySelectorAll('.clue-item').forEach(el => el.remove());

    for (let i = 0; i < shown; i++) {
        const c = G.muscle.clues[i];
        const div = document.createElement('div');
        div.className = 'clue-item';
        div.innerHTML =
            `<span class="clue-lbl">${c.lbl}</span>` +
            `<span class="clue-txt">${c.txt}</span>`;
        list.appendChild(div);
        setTimeout(() => div.classList.add('show'), 40 * i);
    }

    document.getElementById('clueCountBadge').textContent = `${shown} / ${total}`;

    const remaining = total - shown;
    const lockedEl = document.getElementById('clueLocked');
    if (remaining > 0 && !G.gameOver) {
        lockedEl.style.display = 'flex';
        document.getElementById('clueLockedTxt').textContent =
            LANG.game.cluesLocked(remaining);
    } else {
        lockedEl.style.display = 'none';
    }
}

// BODY DIAGRAM

function _renderDiagram() {
    const dot = G.muscle.dot;
    if (!dot) return;

    const pulse = document.getElementById('dotPulse');
    const core = document.getElementById('dotCore');
    const label = document.getElementById('dotLabel');
    const group = document.getElementById('muscleDot');

    if (!group) return;

    group.setAttribute('transform', `translate(${dot.x}, ${dot.y})`);
    if (label) label.textContent = dot.label;

    // Restart pulse animation by cloning the node
    const fresh = group.cloneNode(true);
    group.parentNode.replaceChild(fresh, group);
}

// INFO CHIPS

function _renderInfoRow() {
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

// GRID

function _buildGrid() {
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
    _refreshGrid();
}

function _refreshGrid() {
    const len = G.target.length;

    // Only re-render rows that haven't been scored yet (avoids interrupting flip animation)
    for (let r = 0; r < G.guesses.length; r++) {
        const firstTile = document.getElementById(`t${r}_0`);
        // Skip rows already coloured (they have correct/present/absent class)
        if (firstTile && /correct|present|absent/.test(firstTile.className)) continue;

        const guess = G.guesses[r];
        const result = _scoreGuess(guess, G.target);
        for (let c = 0; c < len; c++) {
            const tile = document.getElementById(`t${r}_${c}`);
            tile.textContent = guess[c] || '';
            tile.className = `tile ${result[c]}`;
            tile.style.animationDelay = `${c * 85}ms`;
        }
    }

    // Render active (current input) row
    if (!G.gameOver) {
        const r = G.guesses.length;
        for (let c = 0; c < len; c++) {
            const tile = document.getElementById(`t${r}_${c}`);
            tile.textContent = G.current[c] || '';
            tile.className =
                'tile' +
                (G.current[c] ? ' fill' : '') +
                (c === G.current.length ? ' cur' : '');
        }
    }
}

// SCORING

function _scoreGuess(guess, target) {
    const result = Array(target.length).fill('absent');
    const targetArr = target.split('');
    const guessArr = guess.split('');

    // Pass 1 — exact matches (correct)
    for (let i = 0; i < target.length; i++) {
        if (guessArr[i] === targetArr[i]) {
            result[i] = 'correct';
            targetArr[i] = null;
            guessArr[i] = null;
        }
    }

    // Pass 2 — present (right letter, wrong position)
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

// KEYBOARD

function _buildKeyboard() {
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
            btn.addEventListener('click', () => handleKey(k));
            div.appendChild(btn);
        });

        kb.appendChild(div);
    });
}

// KEY HANDLER

function handleKey(k) {
    if (G.gameOver) return;

    if (k === '⌫' || k === 'Backspace') {
        G.current.pop();
        _refreshGrid();

    } else if (k === 'ENTER' || k === 'Enter') {
        _submitGuess();

    } else if (/^[a-zA-Z]$/.test(k)) {
        const upper = k.toUpperCase();
        if (G.current.length < G.target.length) {
            G.current.push(upper);

            // Pop animation on the tile
            const tile = document.getElementById(`t${G.guesses.length}_${G.current.length - 1}`);
            tile.textContent = upper;
            tile.className = 'tile fill pop';
            setTimeout(() => { tile.className = 'tile fill'; }, 130);

            _refreshGrid();
        }
    }
}

// Physical keyboard
document.addEventListener('keydown', e => {
    if (!document.getElementById('gamePage').classList.contains('active')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Backspace') handleKey('Backspace');
    else if (e.key === 'Enter') handleKey('Enter');
    else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
});

// SUBMIT GUESS

async function _submitGuess() {
    if (G.current.length < G.target.length) {
        _shakeRow(G.guesses.length);
        _showMsg(LANG.game.msgNeedMore(G.target.length));
        return;
    }

    const guess = G.current.join('');
    const rowIdx = G.guesses.length;
    G.guesses.push(guess);
    G.current = [];

    // Score the row and apply flip animation immediately
    const result = _scoreGuess(guess, G.target);
    const len = G.target.length;
    for (let c = 0; c < len; c++) {
        const tile = document.getElementById(`t${rowIdx}_${c}`);
        tile.textContent = guess[c] || '';
        tile.className = `tile ${result[c]}`;
        tile.style.animationDelay = `${c * 85}ms`;
    }

    // Propagate letter states to keyboard
    for (let i = 0; i < len; i++) {
        const letter = guess[i];
        const prev = G.keyStates[letter];
        if (result[i] === 'correct') G.keyStates[letter] = 'correct';
        else if (result[i] === 'present' && prev !== 'correct') G.keyStates[letter] = 'present';
        else if (!prev) G.keyStates[letter] = 'absent';
    }

    // Wait for the flip animation to finish before updating UI (44ms × tiles + buffer)
    const flipDuration = len * 85 + 500;
    setTimeout(() => {
        _buildKeyboard();

        const won = guess === G.target;
        const lost = !won && G.guesses.length >= G.maxGuesses;

        // Reveal next clue on a wrong guess (starts from 0 so first wrong guess = first clue)
        if (!won && !lost) {
            if (G.cluesShown < Math.min(G.maxClues, G.muscle.clues.length)) {
                G.cluesShown++;
                _renderClues();
            }
        }

        _updateGuessesLeft(G.maxGuesses - G.guesses.length);

        if (won) {
            document.getElementById('row' + rowIdx)
                ?.querySelectorAll('.tile')
                .forEach((t, i) => setTimeout(() => t.classList.add('win-bounce'), i * 80));
            _endGame(true);
        } else if (lost) {
            G.cluesShown = G.muscle.clues.length;
            _renderClues();
            _endGame(false);
        }
    }, flipDuration);
}

// END GAME

async function _endGame(won) {
    clearInterval(timerInterval);
    G.gameOver = true;
    G.won = won;

    // Show all clues
    G.cluesShown = G.muscle.clues.length;
    _renderClues();

    // Persist result to database (skipped for guests)
    if (!isGuest && currentUser) {
        try {
            const data = await apiPost('/api/result', {
                mode: G.mode,
                difficulty: G.diff,
                won,
                guessCount: G.guesses.length,
                muscleGroup: G.muscle.group,
                date: G.date,
            }, true);

            if (data.user) {
                currentUser = data.user;
                document.getElementById('heroStreak').textContent =
                    data.user.stats?.daily?.currentStreak || 0;
            }
        } catch (e) {
            console.warn('Could not save result:', e);
        }
    }

    setTimeout(() => _showResult(won), won ? 700 : 500);
}

// RESULT OVERLAY

function _showResult(won) {
    const m = G.muscle;
    const phrases = LANG.result.wonPhrases;

    document.getElementById('rEmoji').innerHTML = _icon(won ? LANG.result.emojiWon : LANG.result.emojiLost, 'result-icon');
    document.getElementById('rHeading').textContent = won
        ? phrases[Math.floor(Math.random() * phrases.length)]
        : LANG.result.lost;
    document.getElementById('rMuscle').textContent = m.name;
    document.getElementById('rFullname').textContent = m.displayName;
    document.getElementById('rFact').innerHTML = m.fact;

    const streak = currentUser?.stats?.daily?.currentStreak || 0;
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

    // Buttons differ by mode
    const btns = document.getElementById('rBtns');
    if (G.mode === 'daily') {
        btns.innerHTML = `
      <button class="r-btn"         onclick="closeResult(); showPage('home')">${LANG.result.btnHome}</button>
      <button class="r-btn primary" onclick="closeResult(); showPage('stats')">${LANG.result.btnStats}</button>
    `;
    } else {
        btns.innerHTML = `
      <button class="r-btn"         onclick="closeResult(); showPage('home')">${LANG.result.btnHome}</button>
      <button class="r-btn primary" onclick="closeResult(); launchGame('${G.mode}','${G.diff}')">${LANG.result.btnNext}</button>
    `;
    }

    document.getElementById('resultOverlay').classList.add('open');
}

function closeResult() {
    document.getElementById('resultOverlay').classList.remove('open');
}

// ── TIMER (timed mode) ────────────────────────────────────────────────

function _initTimer(mode) {
    const section = document.getElementById('timerSection');
    const bar = document.getElementById('timerBar');
    const num = document.getElementById('timerNum');

    if (mode !== 'timed') {
        section.classList.remove('active');
        clearInterval(timerInterval);
        return;
    }

    section.classList.add('active');
    bar.style.width = '100%';
    bar.classList.remove('urgent');
    num.classList.remove('urgent');
    num.textContent = G.timerSecs;

    timerInterval = setInterval(() => {
        G.timerSecs--;
        num.textContent = G.timerSecs;
        bar.style.width = (G.timerSecs / TIMER_SECONDS * 100) + '%';

        if (G.timerSecs <= 15) {
            bar.classList.add('urgent');
            num.classList.add('urgent');
        }
        if (G.timerSecs <= 0) {
            clearInterval(timerInterval);
            _endGame(false);
        }
    }, 1000);
}

// ── MISC HELPERS ──────────────────────────────────────────────────────

function exitGame() {
    clearInterval(timerInterval);
    G.gameOver = true;
    showPage('home');
}

function _applyModeTags(mode, diff) {
    const modeTag = document.getElementById('gTagMode');
    const [modeIcon, modeLabel] = LANG.game.modeLabels[mode].split('||');
    modeTag.innerHTML = _icon(modeIcon) + ' ' + modeLabel;
    modeTag.className = `g-tag gt-${mode}`;

    const diffTag = document.getElementById('gTagDiff');
    diffTag.textContent = LANG.game.diffLabels[diff];
    diffTag.className = `g-tag gt-${diff}`;
}

function _updateGuessesLeft(n) {
    const span = document.getElementById('guessesLeftNum');
    span.textContent = n;
    span.className = n <= 1 ? 'low' : '';
}

function _shakeRow(rowIndex) {
    document.getElementById('row' + rowIndex)
        ?.querySelectorAll('.tile')
        .forEach(t => {
            t.classList.add('shake');
            setTimeout(() => t.classList.remove('shake'), 400);
        });
}

function _showMsg(msg, duration = 1800) {
    const bar = document.getElementById('msgBar');
    bar.textContent = msg;
    bar.classList.add('show');
    setTimeout(() => bar.classList.remove('show'), duration);
}

// MUSCLE HELPERS

function _getDailyMuscle() {
    const start = new Date(DAILY_SEED_DATE);
    const today = new Date();
    const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    return MUSCLES[diff % MUSCLES.length];
}

function _pickRandomMuscle() {
    // Avoid repeating the immediately previous muscle
    const last = G?.muscle;
    let pick;
    do {
        pick = MUSCLES[Math.floor(Math.random() * MUSCLES.length)];
    } while (MUSCLES.length > 1 && last && pick.name === last.name);
    return pick;
}