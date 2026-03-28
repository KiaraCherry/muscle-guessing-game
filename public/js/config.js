/**
 * js/config.js
 * ─────────────────────────────────────────────────────────────────────
 * Global configuration: API endpoint and difficulty settings.
 */

// API URL
// Local development:  'http://localhost:3000'
// Production:         'https://your-app.onrender.com'
const API = 'https://muscle-guessing-game.onrender.com';

// DIFFICULTY CONFIG
// guesses  — max number of guesses the player gets
// maxClues — max number of clues that will be revealed during the round
const DIFF_CONFIG = {
    easy: { guesses: 5, maxClues: 4 },
    medium: { guesses: 4, maxClues: 3 },
    hard: { guesses: 3, maxClues: 2 },
};

// TIMED MODE CONFIG
const TIMER_SECONDS = 60;

// DAILY CHALLENGE SEED DATE
// All users on the same date get the same muscle.
// Change this date if you want to reset the daily cycle.
const DAILY_SEED_DATE = '2024-01-01';