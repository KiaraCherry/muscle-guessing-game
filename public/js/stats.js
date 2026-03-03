/**
 * js/stats.js class Stats
 * ─────────────────────────────────────────────────────────────────────
 * Renders the Stats page. Shows a sign-up prompt for guests.
 */

class Stats {
    async load() {
        const auth = window.app.auth;
        // Guest: show a prompt instead of stats
        if (auth.isGuest || !auth.currentUser) {
            document.getElementById('statsInner').classList.add('hidden');
            document.getElementById('guestStatsMsg').classList.remove('hidden');
            document.getElementById('guestStatsMsgHead').textContent = LANG.stats.guestHeading;
            document.getElementById('guestStatsMsgSub').textContent = LANG.stats.guestSubtext;
            document.getElementById('guestStatsMsgBtn').textContent = LANG.stats.guestBtn;
            document.getElementById('guestStatsMsgBtn').onclick = () => auth.signOut(); // back to auth
            return;
        }

        document.getElementById('guestStatsMsg').classList.add('hidden');
        document.getElementById('statsInner').classList.remove('hidden');

        // Refresh user data
        try {
            const data = await auth.get('/api/me');
            if (data.user) currentUser = data.user;
        } catch { /* use cached */ }

        this._renderHeadlineStats();
        this._renderGuessDist();
        this._renderMuscleGroupAccuracy();
        await this._renderLeaderboard();
    }

    /** Headline Numbers */
    _renderHeadlineStats() {
        const u = window.app.auth.currentUser;
        const daily = u.stats?.daily || {};
        const practice = u.stats?.practice || {};
        const timed = u.stats?.timed || {};

        const totalPlayed = (daily.played || 0) + (practice.played || 0) + (timed.played || 0);
        const totalWins = (daily.wins || 0) + (practice.wins || 0) + (timed.wins || 0);
        const winPct = totalPlayed > 0 ? Math.round((totalWins / totalPlayed) * 100) : 0;

        document.getElementById('sPlayed').textContent = totalPlayed;
        document.getElementById('sWin').textContent = winPct + '%';
        document.getElementById('sStreak').textContent = daily.currentStreak || 0;
        document.getElementById('sMax').textContent = daily.maxStreak || 0;
    }

    /** Guess Distribution */
    _renderGuessDist() {
        const u = window.app.auth.currentUser;
        const daily = u.stats?.daily || {};
        const practice = u.stats?.practice || {};
        const timed = u.stats?.timed || {};

        const combined = Array.from({ length: 6 }, (_, i) =>
            (daily.guessDist?.[i] || 0) +
            (practice.guessDist?.[i] || 0) +
            (timed.guessDist?.[i] || 0)
        );
        const maxVal = Math.max(...combined, 1);

        document.getElementById('distTable').innerHTML = combined
            .map((count, i) => {
                const w = count > 0 ? Math.max((count / maxVal) * 100, 4) : 0;
                return `<div class="dist-row">
          <div class="dist-num">${i + 1}</div>
          <div class="dist-track">
            <div class="dist-fill" style="width:${w}%">${count || ''}</div>
          </div>
        </div>`;
            }).join('');
    }

    /** Muscle Group Accuracy */
    _renderMuscleGroupAccuracy() {
        const u = window.app.auth.currentUser;
        const groupStats = u.groupStats || [];
        const groups = [...new Set(MUSCLES.map(m => m.group))];

        document.getElementById('mgGrid').innerHTML = groups.map(group => {
            const stat = groupStats.find(s => s.group === group) || { played: 0, wins: 0 };
            const pct = stat.played > 0 ? Math.round((stat.wins / stat.played) * 100) : 0;
            return `<div class="mg-card">
        <div class="mg-name">${group}</div>
        <div class="mg-track"><div class="mg-fill" style="width:${pct}%"></div></div>
        <div class="mg-pct">${LANG.stats.mgAccuracy(pct, stat.played)}</div>
      </div>`;
        }).join('');
    }

    /** Leaderboard */
    async _renderLeaderboard() {
        const auth = window.app.auth;
        const lbBody = document.getElementById('lbBody');
        const medalColors = ['#C9A84C', '#A8A8A8', '#B87333'];

        try {
            const data = await auth.get('/api/leaderboard?limit=10');
            const rows = data.leaderboard || [];
            const myId = auth.currentUser._id;

            lbBody.innerHTML = rows.length === 0
                ? `<div style="padding:16px 20px;font-size:13px;color:var(--muted);">${LANG.stats.lbEmpty}</div>`
                : rows.map((p, i) => {
                    const rankCell = i < 3
                        ? `<span class="material-symbols-rounded lb-medal" style="color:${medalColors[i]}">${i + 1}</span>`
                        : (i + 1);
                    const youMarker = p.id === myId
                        ? ` <span class="material-symbols-rounded lb-you-icon">person</span>`
                        : '';
                    return `
            <div class="lb-row${p.id === myId ? ' me' : ''}">
              <div class="lb-cell lb-rank">${rankCell}</div>
              <div class="lb-cell">${p.name}${youMarker}</div>
              <div class="lb-cell">${p.winPct}%</div>
              <div class="lb-cell">${p.streak}</div>
              <div class="lb-cell">${p.played}</div>
            </div>`;
                }).join('');
        } catch {
            lbBody.innerHTML =
                `<div style="padding:16px 20px;font-size:13px;color:var(--muted);">${LANG.stats.lbUnavailable}</div>`;
        }
    }
}