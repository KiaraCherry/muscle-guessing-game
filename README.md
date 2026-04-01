<div align="center">

# MUSCLELE

**A Wordle-style anatomy game for physiotherapy students**

![Version](https://img.shields.io/badge/version-0.1.0--alpha-teal)
![Stack](https://img.shields.io/badge/stack-Node.js%20%2B%20MongoDB-navy)
![License](https://img.shields.io/badge/license-MIT-green)

*Guess the muscle from anatomical clues. Daily challenges, practice modes, streaks, and a leaderboard —> built for physio education.*

---

</div>

## What is Musclele?

Musclele is a anatomy word game inspired by Wordle, designed to help physiotherapy students learn and retain muscle knowledge in a fun, daily format. Each round reveals a hidden muscle through progressive anatomical clues. These include function, origin, insertion, innervation, and clinical notes. There is one clue for each wrong guess.

A **body silhouette diagram** highlights exactly where the muscle is located, shown from the start of each round. Clues unlock only when you guess incorrectly, rewarding students who have studied.

---

## Features

- **Daily Challenge** —> one shared muscle per day, keeps your streak alive
- **Practice Mode** —> unlimited rounds, filter by body region
- **Timed Mode** —> 60 seconds on the clock
- **Progressive clues** —> body diagram first, anatomical clues unlock on wrong guesses
- **62 muscles** across all body regions from the PHTH 524 MSK curriculum
- **Stats tracking** —> win rate, streaks, guess distribution, accuracy by muscle group
- **Leaderboard** —> compete with classmates
- **Guest mode** —> play without an account (no stats saved)
- **Responsive** —> works on desktop (mobile in testing)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla JS (class-based), HTML5, CSS3 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (30-day tokens) + bcrypt |
| Hosting | Render.com (recommended) |
| DB Hosting | MongoDB Atlas (free tier) |

---

## Project Structure

```
musclele/
├── server.js               ← Express API + MongoDB models
├── package.json
├── .env                    
├── .gitignore
└── public/
    ├── index.html          ← App shell (topbar, modals, script tags)
    ├── favicon.svg
    ├── pages/
    │   ├── auth.html       ← Login / register / guest screen
    │   ├── home.html       ← Mode selection + hero banner
    │   ├── game.html       ← Body diagram, clues, guess grid, keyboard
    │   └── stats.html      ← Stats, leaderboard
    ├── css/
    │   └── styles.css
    ├── js/
    │   ├── app.js          ← Bootstraps all classes (window.app)
    │   ├── router.js       ← Loads page fragments, handles navigation
    │   ├── auth.js         ← Login, register, guest, session
    │   ├── game.js         ← All gameplay logic
    │   ├── stats.js        ← Stats page rendering
    │   └── config.js       ← API URL + difficulty settings
    └── lang/
        └── en/
            └── en.js       ← All UI strings + full muscle database
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- A free [MongoDB Atlas](https://cloud.mongodb.com) account

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/musclele.git
cd musclele
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → **Build a Database** → **M0 Free**
2. Create a database user (e.g. `musclele-app`) with a strong password
3. Under **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
4. Click **Connect** → **Drivers** → copy the connection string

### 4. Configure environment

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb+srv://musclele-app:yourpassword@cluster0.xxxxx.mongodb.net/musclele?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_here
PORT=3000
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Run locally

```bash
npm start          # production mode
npm run dev        # development mode (auto-restart on file changes)
```

Open [http://localhost:3000](http://localhost:3000) —> you should see `MongoDB connected` in the terminal.

---

## Deploying to Render (free)

1. Push your repo to GitHub (make sure `.env` is in `.gitignore`)
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variables: `MONGO_URI`, `JWT_SECRET`, `PORT=10000`
6. Deploy — you'll get a URL like `https://musclele.onrender.com`
7. Update `public/js/config.js` → change `API` to your Render URL

---

## Adding Muscles

All muscle data lives in one place: `public/lang/en/en.js` — the `MUSCLES` array at the bottom of the file. Each entry follows this schema:

```js
{
  name: 'UPPERCASE',           // the answer (letters only, no spaces)
  displayName: 'Full Name',    // shown in the result overlay
  group: 'Muscle Group',       // used for stats accuracy breakdown
  region: 'Body Region',       // used for practice region filter
  type: 'Architecture Type',   // shown as an info chip
  dot: { x: 50, y: 80, label: 'Region Label' }, // body diagram dot (0–100 coordinate space)
  clues: [                     // up to 5 clues, revealed one per wrong guess
    { lbl: 'Function',    txt: 'Description of what it does.' },
    { lbl: 'Origin',      txt: 'Where it starts.' },
    { lbl: 'Insertion',   txt: 'Where it ends.' },
    { lbl: 'Innervation', txt: 'Which nerve, which root levels.' },
    { lbl: 'Clinical',    txt: 'Relevant clinical pearl.' },
  ],
  fact: 'Shown in the result overlay after each round. <strong>HTML allowed.</strong>',
},
```

No other files need to be changed. New body regions automatically appear in the Practice region filter.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens |
| `PORT` | Optional | Server port (defaults to 3000) |

---

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/register` | None | Create account |
| POST | `/api/login` | None | Sign in, returns JWT |
| GET | `/api/me` | JWT | Get current user data |
| POST | `/api/result` | JWT | Save a game result |
| GET | `/api/leaderboard` | JWT | Get top players |

---

## .gitignore

```
node_modules/
.env
```

---

## License

MIT — free to use for educational purposes.