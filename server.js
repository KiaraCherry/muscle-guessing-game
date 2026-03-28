// ══════════════════════════════════════════════════════════════════════
//  MUSCLELE — Backend Server
//  Stack: Node.js + Express + MongoDB (Mongoose) + JWT Auth
//  Run:   node server.js   (after npm install)
// ══════════════════════════════════════════════════════════════════════

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));  // serves index.html

// ENV VARS & CONFIG
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/musclele';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production';
const PORT = process.env.PORT || 3000;

// DATABASE CONNECTION
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => { console.error('MongoDB error:', err); process.exit(1); });

// SCHEMAS

// Per-game-mode stats object (embedded)
const modeStatsSchema = new mongoose.Schema({
    played: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    lastPlayedDate: { type: String, default: '' },   // 'YYYY-MM-DD'
    guessDist: { type: [Number], default: [0, 0, 0, 0, 0, 0] }, // index = guesses used (0-5)
}, { _id: false });

// Per muscle group accuracy tracker
const groupStatSchema = new mongoose.Schema({
    group: String,
    played: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
}, { _id: false });

// Main user schema
const userSchema = new mongoose.Schema({
    displayName: { type: String, required: true, trim: true, maxlength: 40 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    // Stats broken down by mode
    stats: {
        daily: { type: modeStatsSchema, default: () => ({}) },
        practice: { type: modeStatsSchema, default: () => ({}) },
        timed: { type: modeStatsSchema, default: () => ({}) },
    },

    // Guess distribution per difficulty (for practice / timed)
    diffStats: {
        easy: { played: { type: Number, default: 0 }, wins: { type: Number, default: 0 }, guessDist: { type: [Number], default: [0, 0, 0, 0, 0, 0] } },
        medium: { played: { type: Number, default: 0 }, wins: { type: Number, default: 0 }, guessDist: { type: [Number], default: [0, 0, 0, 0, 0, 0] } },
        hard: { played: { type: Number, default: 0 }, wins: { type: Number, default: 0 }, guessDist: { type: [Number], default: [0, 0, 0, 0, 0] } },
    },

    // Muscle group accuracy
    groupStats: { type: [groupStatSchema], default: [] },

    // Daily challenge — track which dates have been completed
    dailyCompleted: { type: [String], default: [] },  // ['2025-06-01', ...]

    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// AUTH MIDDLEWARE 
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const payload = jwt.verify(header.slice(7), JWT_SECRET);
        req.userId = payload.id;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// Helper to sign a token
function signToken(id) {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
}

// AUTH ROUTES

// POST /api/register
app.post('/api/register', async (req, res) => {
    try {
        const { displayName, email, password } = req.body;
        if (!displayName || !email || !password)
            return res.status(400).json({ error: 'All fields required' });
        if (password.length < 6)
            return res.status(400).json({ error: 'Password must be at least 6 characters' });

        const exists = await User.findOne({ email });
        if (exists) return res.status(409).json({ error: 'Email already registered' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ displayName, email, password: hashed });
        const token = signToken(user._id);
        res.json({ token, user: sanitize(user) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

        const token = signToken(user._id);
        res.json({ token, user: sanitize(user) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/me  — verify token & return fresh user data
app.get('/api/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user: sanitize(user) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GAME RESULT ROUTE 

// POST /api/result  — save game result after each round
// Body: { mode, difficulty, won, guessCount, muscleGroup, date }
app.post('/api/result', authMiddleware, async (req, res) => {
    try {
        const { mode, difficulty, won, guessCount, muscleGroup, date } = req.body;
        // date = 'YYYY-MM-DD' string

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Update mode stats
        const ms = user.stats[mode];
        ms.played += 1;

        if (won) {
            ms.wins += 1;
            // Streak logic
            const yesterday = offsetDate(date, -1);
            if (ms.lastPlayedDate === yesterday || ms.currentStreak === 0) {
                ms.currentStreak += 1;
            } else if (ms.lastPlayedDate === date) {
                // same day, no change to streak
            } else {
                ms.currentStreak = 1; // streak broken
            }
            ms.maxStreak = Math.max(ms.maxStreak, ms.currentStreak);
            // Guess distribution (guessCount is 1-indexed)
            const idx = Math.min(guessCount - 1, ms.guessDist.length - 1);
            ms.guessDist[idx] = (ms.guessDist[idx] || 0) + 1;
        } else {
            ms.currentStreak = 0;
        }
        ms.lastPlayedDate = date;

        // Update difficulty stats
        if (difficulty && user.diffStats[difficulty]) {
            const ds = user.diffStats[difficulty];
            ds.played += 1;
            if (won) {
                ds.wins += 1;
                const idx = Math.min(guessCount - 1, ds.guessDist.length - 1);
                ds.guessDist[idx] = (ds.guessDist[idx] || 0) + 1;
            }
        }

        // Update daily completed list
        if (mode === 'daily' && !user.dailyCompleted.includes(date)) {
            user.dailyCompleted.push(date);
        }

        // Update muscle group accuracy
        if (muscleGroup) {
            let gStat = user.groupStats.find(g => g.group === muscleGroup);
            if (!gStat) {
                user.groupStats.push({ group: muscleGroup, played: 0, wins: 0 });
                gStat = user.groupStats[user.groupStats.length - 1];
            }
            gStat.played += 1;
            if (won) gStat.wins += 1;
        }

        // Mongoose needs markModified for nested objects
        user.markModified('stats');
        user.markModified('diffStats');
        user.markModified('groupStats');
        user.markModified('dailyCompleted');
        await user.save();

        res.json({ user: sanitize(user) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LEADERBOARD ROUTE

// GET /api/leaderboard?limit=10
app.get('/api/leaderboard', authMiddleware, async (req, res) => {
    try {
        const n = Math.min(parseInt(req.query.limit) || 10, 50);
        // Sort by daily win %, then by played count as tiebreaker
        const users = await User.find({}, {
            displayName: 1,
            'stats.daily': 1,
            'stats.practice': 1,
        }).lean();

        const ranked = users
            .map(u => {
                const d = u.stats?.daily || {};
                const p = u.stats?.practice || {};
                const totalPlayed = (d.played || 0) + (p.played || 0);
                const totalWins = (d.wins || 0) + (p.wins || 0);
                return {
                    id: u._id.toString(),
                    name: u.displayName,
                    winPct: totalPlayed > 0 ? Math.round((totalWins / totalPlayed) * 100) : 0,
                    streak: d.currentStreak || 0,
                    played: totalPlayed,
                };
            })
            .filter(u => u.played > 0)
            .sort((a, b) => b.winPct - a.winPct || b.played - a.played)
            .slice(0, n);

        res.json({ leaderboard: ranked, myId: req.userId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// HELPERS
function sanitize(user) {
    const obj = user.toObject ? user.toObject() : user;
    delete obj.password;
    delete obj.__v;
    return obj;
}

function offsetDate(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

// START SERVER
app.listen(PORT, () => console.log(`Musclele running on http://localhost:${PORT}`));