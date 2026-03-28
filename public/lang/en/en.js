/**
 * lang/en/en.js
 * ─────────────────────────────────────────────────────────────────────
 * All user-facing strings and the muscle database in one place.
 * To add a new language: copy this file to lang/fr/fr.js (etc.),
 * translate every string value, and update the <script> tag in
 * index.html to point at the new file.
 *
 * To add more muscles: append an object to the MUSCLES array following
 * the exact same schema as the existing entries.
 */

// User Interface Strings
const LANG = {

    // Auth screen
    auth: {
        appTagline: 'Anatomy Word Game · Physio Edition',
        tabSignIn: 'Sign In',
        tabRegister: 'Register',
        labelName: 'Display Name',
        labelEmail: 'Email',
        labelPassword: 'Password',
        placeholderName: 'Jane Smith',
        placeholderEmail: 'student@uni.edu',
        placeholderPassLogin: '••••••••',
        placeholderPassReg: '6+ characters',
        btnSignIn: 'Sign In →',
        btnRegister: 'Create Account →',
        btnGuest: 'Continue as Guest',
        guestNote: 'No stats saved · No streak · No leaderboard',
        errFillAll: 'Please fill in all fields.',
        errNoServer: 'Could not connect to server. Is it running?',
    },

    // Top bar
    nav: {
        play: 'Play',
        stats: 'Stats',
        signOut: 'Sign Out',
        signIn: 'Sign In',           // shown to guests in the top bar
    },

    // Home page
    home: {
        greeting: 'Welcome back',
        greetingGuest: 'Playing as Guest',
        streakLabel: 'Daily Streak',
        guestBanner: 'Create a free account to save your streaks, stats, and appear on the leaderboard.',
        guestBannerBtn: 'Create Account',
        chooseModeTitle: 'Choose a Mode',
        daily: {
            title: 'Daily Challenge',
            desc: 'One muscle for everyone, every day. Complete it to keep your streak alive.',
            pill: 'Shared · Streak',
            done: 'check||Done',
        },
        practice: {
            title: 'Practice',
            desc: 'Unlimited rounds across all muscle groups. Choose your difficulty level.',
            pill: 'Unlimited',
        },
        timed: {
            title: 'Timed Mode',
            desc: '60 seconds on the clock — identify as many muscles as you can under pressure.',
            pill: '60 Seconds',
        },
    },

    // Region filter modal (practice mode only)
    region: {
        title: 'Filter by Body Region',
        sub: 'Practice muscles from a specific area, or test everything.',
        btnStart: 'Start Practice →',
        allRegions: 'All Muscles',
        allSub: 'Every muscle in the database',
    },

    // Difficulty modal
    difficulty: {
        title: 'Choose Difficulty',
        subDefault: 'Select how challenging this session will be.',
        subDaily: 'Daily challenge difficulty. Medium is recommended for this mode.',
        btnStart: 'Start Game →',
        easy: {
            name: 'Easy',
            sub: '5 guesses · All 5 clues available',
        },
        medium: {
            name: 'Medium',
            sub: '4 guesses · Up to 3 clues revealed',
        },
        hard: {
            name: 'Hard',
            sub: '3 guesses · Max 2 clues only',
        },
    },

    // Game page
    game: {
        modeLabels: {
            daily: 'calendar_today||Daily',
            practice: 'science||Practice',
            timed: 'timer||Timed',
        },
        diffLabels: {
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard',
        },
        btnBack: '← Back',
        cluesPanelTitle: 'Anatomical Clues',
        cluesLocked: (n) => `${n} more clue${n > 1 ? 's' : ''} unlock with wrong guesses`,
        infoRegion: 'Region',
        infoGroup: 'Group',
        infoType: 'Type',
        infoLetters: 'Letters',
        guessesLeft: 'Remaining:',
        hintNote: (name) => `*Type without spaces/hyphens — the answer is: ${name}`,
        msgNeedMore: (n) => `Need ${n} letters`,
    },

    // Result overlay
    result: {
        wonPhrases: ['Excellent!', 'Correct!', 'Brilliant!', 'Well done!'],
        lost: 'Not quite!',
        emojiWon: 'fitness_center',
        emojiLost: 'orthopedics',
        statGuesses: 'Guesses',
        statStreak: 'Streak',
        btnHome: 'Home',
        btnStats: 'View Stats',
        btnNext: 'Next →',
    },

    // Stats page
    stats: {
        title: 'Your Statistics',
        played: 'Games Played',
        winRate: 'Win Rate',
        currentStreak: 'Current Streak',
        bestStreak: 'Best Streak',
        distTitle: 'Guess Distribution',
        groupTitle: 'Accuracy by Muscle Group',
        lbTitle: 'Leaderboard',
        lbHeaders: ['#', 'Player', 'Win %', 'Streak', 'Played'],
        lbEmpty: 'No data yet — play some games!',
        lbUnavailable: 'Leaderboard unavailable',
        mgAccuracy: (pct, played) => `${pct}% accuracy (${played} played)`,
        guestHeading: 'Stats are not available for guests',
        guestSubtext: 'Create a free account to track your streaks, win rate, guess distribution, and accuracy by muscle group.',
        guestBtn: 'Create Account →',
    },

};

// Muscle Database
/**
 * Schema per entry:
 * {
 *   name:        string   — UPPERCASE, no spaces/hyphens (used for guessing)
 *   displayName: string   — Full anatomical name shown in results
 *   group:       string   — Muscle group for stats accuracy breakdown
 *   region:      string   — Body region shown as info chip
 *   type:        string   — Muscle architecture type shown as info chip
 *   clues: [             — Up to 5 clues, revealed progressively
 *     { lbl: string, txt: string }
 *   ],
 *   fact:        string   — Shown in result overlay (HTML allowed for <strong>)
 * }
 */

const MUSCLES = [

    // ══════════════════════════════════════════════════════════════════
    // TRUNK / LUMBAR
    // ══════════════════════════════════════════════════════════════════

    {
        name: 'RECTUS', displayName: 'Rectus Abdominis',
        group: 'Trunk', region: 'Anterior Abdomen', type: 'Strap',
        dot: { x: 50, y: 72, label: 'Anterior Abdomen' },
        clues: [
            { lbl: 'Function', txt: 'Flexes the trunk and compresses the abdominal contents. Tested in MMT by progressively clearing the scapula from the plinth.' },
            { lbl: 'Origin', txt: 'Pubic crest and pubic symphysis.' },
            { lbl: 'Insertion', txt: 'Costal cartilages of ribs 5–7 and xiphoid process.' },
            { lbl: 'Innervation', txt: 'Ventral rami of thoracic nerves T7–T12.' },
            { lbl: 'Clinical', txt: 'MMT grade 5 requires arms behind head with elbows wide and full scapula clearance from the plinth.' },
        ],
        fact: 'The <strong>linea alba</strong> runs down the midline through this muscle — palpate it during testing. Its segmented appearance in lean individuals reflects the tendinous intersections dividing it into "six-pack" segments.',
    },

    {
        name: 'OBLIQUE', displayName: 'Internal & External Obliques',
        group: 'Trunk', region: 'Lateral Abdomen', type: 'Flat',
        dot: { x: 38, y: 75, label: 'Lateral Abdomen' },
        clues: [
            { lbl: 'Function', txt: 'Rotate and side-flex the trunk. External oblique rotates the trunk to the opposite side; internal oblique rotates it to the same side.' },
            { lbl: 'Palpation', txt: 'Internal oblique is palpated just medial to the ASIS; external oblique is palpated just below the lowest rib.' },
            { lbl: 'MMT Setup', txt: 'Patient slowly flexes up and rotates to the opposite side. Grade 3 = arms extended, clearing both scapulae with rotation.' },
            { lbl: 'Innervation', txt: 'Ventral rami of thoracic and lumbar nerves (T7–L1).' },
            { lbl: 'Clinical', txt: 'Weakness causes a Trendelenberg-like trunk lean and contributes to low back instability. They form a natural "corset" around the spine.' },
        ],
        fact: 'The external and internal obliques form an <strong>X-shaped force couple</strong> — their fibres run perpendicular to each other, creating a torsional stability system unmatched by any single muscle.',
    },

    {
        name: 'ERECTOR', displayName: 'Erector Spinae',
        group: 'Trunk', region: 'Posterior Back', type: 'Parallel',
        dot: { x: 50, y: 78, label: 'Posterior Back' },
        clues: [
            { lbl: 'Function', txt: 'Extends the trunk and maintains upright posture. MMT is performed prone with a pillow under hips, strapped to the table.' },
            { lbl: 'Origin', txt: 'Broad common origin on the posterior sacrum, iliac crest, and lumbar spinous processes.' },
            { lbl: 'Insertion', txt: 'Ribs, transverse processes, and spinous processes at multiple levels up through the cervical spine.' },
            { lbl: 'Innervation', txt: 'Dorsal rami of spinal nerves throughout the length of the spine.' },
            { lbl: 'MMT Grade 5', txt: 'Hands behind head with xiphoid process cleared from the plinth — requires full antigravity trunk extension.' },
        ],
        fact: 'The erector spinae is actually a <strong>group of three muscles</strong> — iliocostalis, longissimus, and spinalis — running in columns from sacrum to skull, making it one of the longest continuous muscle groups in the body.',
    },

    {
        name: 'MULTIFIDUS', displayName: 'Multifidus',
        group: 'Trunk', region: 'Deep Lumbar', type: 'Pennate',
        dot: { x: 53, y: 82, label: 'Deep Lumbar' },
        clues: [
            { lbl: 'Function', txt: 'Deep segmental stabiliser of the lumbar spine. Provides intersegmental stiffness and controls vertebral rotation at each level.' },
            { lbl: 'Origin', txt: 'Sacrum, iliac crest, and mammillary processes of lumbar vertebrae.' },
            { lbl: 'Insertion', txt: 'Spinous processes of vertebrae 2–4 levels above their origin.' },
            { lbl: 'Innervation', txt: 'Dorsal rami of spinal nerves at each segmental level.' },
            { lbl: 'Clinical', txt: 'Palpated directly alongside the lumbar spinous processes during the lumbar scanning exam. Inhibited early in acute low back pain.' },
        ],
        fact: 'Multifidus <strong>atrophies rapidly and asymmetrically</strong> after a first episode of low back pain — often within days — and does not spontaneously recover without targeted rehabilitation. MRI can detect the fatty infiltration.',
    },

    {
        name: 'QUADRATUS', displayName: 'Quadratus Lumborum',
        group: 'Trunk', region: 'Posterolateral Lumbar', type: 'Quadrilateral',
        dot: { x: 42, y: 82, label: 'Posterolateral Lumbar' },
        clues: [
            { lbl: 'Function', txt: 'Elevates the pelvis (hikes the hip) and laterally flexes the lumbar spine. Also acts as an accessory muscle of respiration.' },
            { lbl: 'Origin', txt: 'Posterior iliac crest and iliolumbar ligament.' },
            { lbl: 'Insertion', txt: '12th rib and transverse processes of L1–L4.' },
            { lbl: 'Innervation', txt: 'Ventral rami of T12 and L1–L4.' },
            { lbl: 'Clinical', txt: 'Palpated during the lumbar scanning exam. A common source of lateral low back and hip pain, especially with sustained postures.' },
        ],
        fact: 'QL is often called the <strong>"hip hiker"</strong> — it is one of the primary muscles responsible for lifting the pelvis during the swing phase of gait, critical for foot clearance. Its trigger points commonly mimic hip pathology.',
    },

    // ══════════════════════════════════════════════════════════════════
    // HIP
    // ══════════════════════════════════════════════════════════════════

    {
        name: 'ILIOPSOAS', displayName: 'Iliopsoas',
        group: 'Core / Hip', region: 'Hip Flexor', type: 'Fusiform',
        dot: { x: 46, y: 95, label: 'Hip Flexor' },
        clues: [
            { lbl: 'Function', txt: 'Primary hip flexor. L1/L2 myotome test. Also tested with the Thomas and Modified Thomas Tests for length.' },
            { lbl: 'Origin', txt: 'Iliac fossa (iliacus) and bodies/transverse processes of T12–L5 vertebrae (psoas major).' },
            { lbl: 'Insertion', txt: 'Lesser trochanter of the femur.' },
            { lbl: 'Innervation', txt: 'Femoral nerve (L1, L2, L3).' },
            { lbl: 'Clinical', txt: 'Tightness detected on the Modified Thomas Test — thigh not flat on bed indicates iliopsoas tightness. FABER test may reproduce anterior hip pain.' },
        ],
        fact: 'Iliopsoas is the <strong>only muscle crossing both the lumbar spine and hip</strong>. Tightness creates an anterior pelvic tilt and increased lumbar lordosis — making it a key target in low back pain rehabilitation.',
    },

    {
        name: 'SARTORIUS', displayName: 'Sartorius',
        group: 'Lower Limb', region: 'Anterior Thigh', type: 'Strap',
        dot: { x: 43, y: 112, label: 'Anterior Thigh' },
        clues: [
            { lbl: 'Function', txt: 'Hip flexion, abduction, and external rotation; knee flexion and medial rotation. Produces the cross-legged tailor\'s sitting position.' },
            { lbl: 'Origin', txt: 'Anterior superior iliac spine (ASIS) — palpated just off the ASIS in MMT.' },
            { lbl: 'Insertion', txt: 'Pes anserinus on the medial tibia (with gracilis and semitendinosus).' },
            { lbl: 'MMT', txt: 'Against gravity: tailor\'s sit (figure-4 position). Resistance applied at the ankle and above the knee simultaneously.' },
            { lbl: 'Innervation', txt: 'Femoral nerve (L2, L3).' },
        ],
        fact: 'The <strong>longest muscle in the human body</strong>, running diagonally across the entire anterior thigh. Named from the Latin for tailor — it creates the cross-legged sitting position historically used by tailors at work.',
    },

    {
        name: 'GLUTEUS', displayName: 'Gluteus Maximus',
        group: 'Lower Limb', region: 'Gluteal', type: 'Pennate',
        dot: { x: 50, y: 108, label: 'Gluteal' },
        clues: [
            { lbl: 'Function', txt: 'Hip extension and lateral rotation. MMT against gravity: standing, fold body over bed, bring leg back with slight external rotation.' },
            { lbl: 'Origin', txt: 'Posterior gluteal line of ilium, dorsal sacrum, coccyx, and sacrotuberous ligament.' },
            { lbl: 'Insertion', txt: 'Gluteal tuberosity of femur and iliotibial tract.' },
            { lbl: 'Innervation', txt: 'Inferior gluteal nerve (L5, S1, S2).' },
            { lbl: 'Clinical', txt: 'Barely active during level walking — activates intensely during running, stair climbing, and rising from sitting. Assessed in the hip extension MMT.' },
        ],
        fact: 'The <strong>largest muscle in the body by volume</strong>. Despite its size, it is largely inactive during flat walking — it saves its power for high-demand tasks like running, climbing stairs, and jumping.',
    },

    {
        name: 'GLUTMED', displayName: 'Gluteus Medius',
        group: 'Lower Limb', region: 'Lateral Hip', type: 'Fan-shaped',
        dot: { x: 30, y: 102, label: 'Lateral Hip' },
        clues: [
            { lbl: 'Function', txt: 'Hip abduction and medial rotation. Key pelvic stabiliser during single-leg stance. Weakness causes the Trendelenberg sign.' },
            { lbl: 'MMT', txt: 'Against gravity: side-lying on non-test side, hips stacked, abduct leg leading with heel with no rotation or flexion.' },
            { lbl: 'Origin', txt: 'External surface of the ilium between the anterior and posterior gluteal lines.' },
            { lbl: 'Insertion', txt: 'Greater trochanter of the femur.' },
            { lbl: 'Innervation', txt: 'Superior gluteal nerve (L4, L5, S1).' },
        ],
        fact: '<strong>Trendelenberg sign</strong> — pelvis drops to the opposite side during single-leg stance — indicates weakness here. It is one of the most clinically significant findings in lower limb assessment, linked to hip OA, IT band syndrome, and patellofemoral pain.',
    },

    {
        name: 'GLUTMIN', displayName: 'Gluteus Minimus',
        group: 'Lower Limb', region: 'Lateral Hip', type: 'Fan-shaped',
        dot: { x: 28, y: 106, label: 'Lateral Hip' },
        clues: [
            { lbl: 'Function', txt: 'Hip abduction and medial rotation. Works closely with gluteus medius to stabilise the pelvis during gait.' },
            { lbl: 'MMT', txt: 'Tested alongside gluteus medius in the hip abduction MMT. Palpated just inferior to gluteus medius at the lateral hip.' },
            { lbl: 'Origin', txt: 'External ilium between the anterior and inferior gluteal lines.' },
            { lbl: 'Insertion', txt: 'Anterior surface of the greater trochanter.' },
            { lbl: 'Innervation', txt: 'Superior gluteal nerve (L4, L5, S1).' },
        ],
        fact: 'The smallest of the three gluteal muscles, gluteus minimus lies <strong>deep to gluteus medius</strong> and is often referred to together with it clinically. Its trigger points are a common cause of lateral hip pain that radiates down the lateral thigh — mimicking sciatica.',
    },

    {
        name: 'TFL', displayName: 'Tensor Fascia Latae',
        group: 'Lower Limb', region: 'Lateral Hip', type: 'Fusiform',
        dot: { x: 32, y: 108, label: 'Lateral Hip' },
        clues: [
            { lbl: 'Function', txt: 'Hip abduction and flexion via the iliotibial band. MMT position places the leg in 10–20° hip flexion and internal rotation to bias TFL over gluteus medius.' },
            { lbl: 'Origin', txt: 'Anterior superior iliac spine (ASIS) and anterior iliac crest.' },
            { lbl: 'Insertion', txt: 'Via the iliotibial (IT) band into the lateral tibial condyle.' },
            { lbl: 'Innervation', txt: 'Superior gluteal nerve (L4, L5).' },
            { lbl: 'Clinical', txt: 'IT band tightness assessed with Ober\'s Test. Imbalance between TFL and gluteus medius/minimus is a root cause of IT band syndrome and lateral knee pain.' },
        ],
        fact: 'TFL does not insert directly onto bone — it <strong>feeds entirely into the IT band</strong>, a thick fascial strap that transmits force from the hip to the lateral knee. IT band syndrome is one of the most common running injuries.',
    },

    {
        name: 'ADDUCTOR', displayName: 'Adductor Magnus',
        group: 'Lower Limb', region: 'Medial Thigh', type: 'Triangular',
        dot: { x: 47, y: 118, label: 'Medial Thigh' },
        clues: [
            { lbl: 'Function', txt: 'Adducts the thigh. Hamstring portion extends the hip; adductor portion assists flexion. Tested in side-lying with non-test leg abducted ~25–30°.' },
            { lbl: 'Origin', txt: 'Inferior pubic ramus, ischial ramus, and ischial tuberosity.' },
            { lbl: 'Insertion', txt: 'Linea aspera and adductor tubercle of the femur.' },
            { lbl: 'Innervation', txt: 'Obturator nerve (adductor part) and tibial branch of sciatic nerve (hamstring part).' },
            { lbl: 'Clinical', txt: 'Contains the adductor hiatus — the gap through which the femoral artery passes to become the popliteal artery. A key vascular and surgical landmark.' },
        ],
        fact: 'The adductor hiatus is a <strong>key surgical vascular landmark</strong>. The femoral artery\'s transition to popliteal artery occurs precisely through the gap in this muscle\'s tendinous insertion.',
    },

    {
        name: 'ADDLONGUS', displayName: 'Adductor Longus',
        group: 'Lower Limb', region: 'Medial Thigh', type: 'Triangular',
        dot: { x: 44, y: 115, label: 'Medial Thigh' },
        clues: [
            { lbl: 'Function', txt: 'Hip adduction and assists hip flexion. Tested alongside adductor brevis, magnus, pectineus, and gracilis in the adductor MMT.' },
            { lbl: 'Origin', txt: 'Anterior surface of the pubis, just below the pubic crest.' },
            { lbl: 'Insertion', txt: 'Middle third of the linea aspera of the femur.' },
            { lbl: 'Innervation', txt: 'Obturator nerve (L2, L3, L4).' },
            { lbl: 'Palpation', txt: 'Palpable in the femoral triangle and along the medial thigh. A common site of strain in kicking athletes — groin strain.' },
        ],
        fact: 'Adductor longus is the <strong>most commonly strained adductor</strong> in sports, particularly in soccer and hockey players. The proximal musculotendinous junction near the pubic attachment is the most frequent injury site.',
    },

    {
        name: 'PECTINEUS', displayName: 'Pectineus',
        group: 'Lower Limb', region: 'Medial Thigh', type: 'Flat',
        dot: { x: 48, y: 108, label: 'Medial Thigh' },
        clues: [
            { lbl: 'Function', txt: 'Hip adduction and flexion. Forms part of the floor of the femoral triangle.' },
            { lbl: 'Origin', txt: 'Pectineal line (pecten) of the pubis.' },
            { lbl: 'Insertion', txt: 'Pectineal line of the femur, between lesser trochanter and linea aspera.' },
            { lbl: 'Innervation', txt: 'Femoral nerve (L2, L3) — unique among the adductors which are mostly obturator nerve.' },
            { lbl: 'Palpation', txt: 'Palpated in the femoral triangle, medial to the femoral vessels and just lateral to adductor longus.' },
        ],
        fact: 'Pectineus is the <strong>only adductor innervated by the femoral nerve</strong> (rather than the obturator), making it a clinically important differentiator when isolating femoral vs obturator nerve lesions.',
    },

    {
        name: 'GRACILIS', displayName: 'Gracilis',
        group: 'Lower Limb', region: 'Medial Thigh', type: 'Strap',
        dot: { x: 50, y: 120, label: 'Medial Thigh' },
        clues: [
            { lbl: 'Function', txt: 'Hip adduction and knee flexion. Also medially rotates the knee. Tested in the adductor MMT group.' },
            { lbl: 'Origin', txt: 'Inferior pubic ramus and pubic body.' },
            { lbl: 'Insertion', txt: 'Pes anserinus on the medial tibia (with sartorius and semitendinosus).' },
            { lbl: 'Innervation', txt: 'Obturator nerve (L2, L3).' },
            { lbl: 'Clinical', txt: 'A common graft source for ACL reconstruction surgery due to its accessible location and expendable function.' },
        ],
        fact: 'The gracilis — Latin for "slender" — is frequently harvested for <strong>ACL reconstruction</strong> with minimal functional loss. It forms one of three tendons of the pes anserinus, which acts as a natural medial knee stabiliser.',
    },

    {
        name: 'PIRIFORMIS', displayName: 'Piriformis',
        group: 'Lower Limb', region: 'Deep Gluteal', type: 'Fusiform',
        dot: { x: 55, y: 106, label: 'Deep Gluteal' },
        clues: [
            { lbl: 'Function', txt: 'External rotation of the hip when extended; abduction when hip is flexed to 90°. Part of the P-GO-GO-Q external rotator group.' },
            { lbl: 'Origin', txt: 'Anterior sacrum (between sacral foramina).' },
            { lbl: 'Insertion', txt: 'Superior border of the greater trochanter.' },
            { lbl: 'Innervation', txt: 'Nerve to piriformis (S1, S2).' },
            { lbl: 'Clinical', txt: 'Palpated during the hip palpation exam. Piriformis syndrome occurs when the muscle compresses the sciatic nerve — causing buttock and leg pain mimicking disc herniation.' },
        ],
        fact: 'The sciatic nerve typically passes <strong>anterior to piriformis</strong>, but in ~15% of people it pierces through the muscle — making those individuals much more susceptible to piriformis syndrome from muscle tightness or spasm.',
    },

    // ══════════════════════════════════════════════════════════════════
    // KNEE
    // ══════════════════════════════════════════════════════════════════

    {
        name: 'HAMSTRING', displayName: 'Hamstrings Group',
        group: 'Lower Limb', region: 'Posterior Thigh', type: 'Biarticular',
        dot: { x: 50, y: 122, label: 'Posterior Thigh' },
        clues: [
            { lbl: 'Function', txt: 'Knee flexion (S2 myotome) and hip extension. MMT prone with pillow under hips; grade 3 = heel to buttock, add resistance near ankle.' },
            { lbl: 'Origin', txt: 'Ischial tuberosity (all except short head of biceps femoris, which originates on the femur).' },
            { lbl: 'Components', txt: 'Three muscles: biceps femoris (long + short head), semitendinosus, and semimembranosus.' },
            { lbl: 'Innervation', txt: 'Sciatic nerve — tibial division for medial hamstrings; common fibular division for biceps femoris short head.' },
            { lbl: 'Clinical', txt: '90/90 SLR is the muscle length test — ideal = within 20° of full extension. Most commonly strained at the proximal musculotendinous junction during sprinting.' },
        ],
        fact: 'The name originates from Old English — pig carcasses were historically <strong>hung by these tendons</strong> from the "ham" (the back of the thigh). The long head of biceps femoris is the most commonly strained hamstring during sprinting.',
    },

    {
        name: 'QUADRICEPS', displayName: 'Quadriceps Femoris',
        group: 'Lower Limb', region: 'Anterior Thigh', type: 'Multi-head',
        dot: { x: 57, y: 115, label: 'Anterior Thigh' },
        clues: [
            { lbl: 'Function', txt: 'Knee extension (L3 myotome). MMT seated on edge of plinth with towel under thigh; grade 3 = patient straightens leg, then add resistance on distal tibia.' },
            { lbl: 'Components', txt: 'Four heads: rectus femoris, vastus lateralis, vastus medialis, and vastus intermedius.' },
            { lbl: 'Origin', txt: 'Rectus femoris from AIIS; vasti from the femoral shaft.' },
            { lbl: 'Insertion', txt: 'Tibial tuberosity via the patellar tendon. The patella is a sesamoid bone within this tendon.' },
            { lbl: 'Innervation', txt: 'Femoral nerve (L2, L3, L4).' },
        ],
        fact: 'The most powerful muscle group in the body. During landing from a jump they absorb energy eccentrically at forces <strong>up to 4× body weight</strong> — and must do it in milliseconds. VMO wasting is a sensitive indicator of quadriceps inhibition after knee injury.',
    },

    // ══════════════════════════════════════════════════════════════════
    // ANKLE / FOOT
    // ══════════════════════════════════════════════════════════════════

    {
        name: 'TIBIALIS', displayName: 'Tibialis Anterior',
        group: 'Lower Limb', region: 'Anterior Leg', type: 'Pennate',
        dot: { x: 43, y: 148, label: 'Anterior Leg' },
        clues: [
            { lbl: 'Function', txt: 'Dorsiflexion and inversion of the foot. L4 myotome. MMT: sitting, foot into inversion then lift toward face against resistance.' },
            { lbl: 'Origin', txt: 'Lateral tibia (proximal two-thirds) and the interosseous membrane.' },
            { lbl: 'Insertion', txt: 'Medial cuneiform and base of the first metatarsal.' },
            { lbl: 'Innervation', txt: 'Deep fibular (peroneal) nerve (L4, L5).' },
            { lbl: 'Clinical', txt: 'Weakness causes foot drop — toe drags during swing phase. May indicate L4 radiculopathy or common fibular nerve compression.' },
        ],
        fact: 'The tibialis anterior tendon is <strong>easily palpable and visible</strong> as a taut cord on the anterior ankle during dorsiflexion — a reliable palpation landmark in clinical assessment.',
    },

    {
        name: 'GASTROCNEMIUS', displayName: 'Gastrocnemius',
        group: 'Lower Limb', region: 'Posterior Leg', type: 'Biarticular',
        dot: { x: 42, y: 148, label: 'Posterior Leg' },
        clues: [
            { lbl: 'Function', txt: 'Plantarflexion (S1 myotome) and assists knee flexion. MMT in standing: grade 5 = >6 single-leg heel raises, grade 4 = 3–5, grade 3 = 1–2.' },
            { lbl: 'Origin', txt: 'Two heads from medial and lateral femoral condyles — the only muscle in this region that crosses the knee.' },
            { lbl: 'Insertion', txt: 'Posterior calcaneus via the Achilles tendon, shared with soleus.' },
            { lbl: 'Innervation', txt: 'Tibial nerve (S1, S2).' },
            { lbl: 'Clinical', txt: 'Tested with a straight knee to preferentially load gastroc over soleus. Thompson test compresses this muscle to check Achilles continuity.' },
        ],
        fact: 'Together with soleus (the <strong>triceps surae</strong>), generates forces up to 8× body weight during running — one of the highest biomechanical loads in the body. The straight-leg test biases gastroc; bent-knee biases soleus.',
    },

    {
        name: 'SOLEUS', displayName: 'Soleus',
        group: 'Lower Limb', region: 'Posterior Leg', type: 'Unipennate',
        dot: { x: 58, y: 152, label: 'Posterior Leg' },
        clues: [
            { lbl: 'Function', txt: 'Plantarflexes the foot regardless of knee position. Tested with bent knee to isolate from gastrocnemius. Key for maintaining upright posture.' },
            { lbl: 'Origin', txt: 'Head and posterior shaft of the fibula, and the soleal line and medial border of the tibia.' },
            { lbl: 'Insertion', txt: 'Posterior calcaneus via the Achilles tendon, shared with gastrocnemius.' },
            { lbl: 'Innervation', txt: 'Tibial nerve (S1, S2).' },
            { lbl: 'Special', txt: 'Known as the "second heart" — its powerful pumping contractions return venous blood from the lower limb during standing and walking.' },
        ],
        fact: 'Contains up to <strong>80% slow-twitch fibres</strong> — among the highest in the body — making it exceptionally resistant to fatigue during prolonged standing and walking.',
    },

    {
        name: 'TIBPOST', displayName: 'Tibialis Posterior',
        group: 'Lower Limb', region: 'Deep Posterior Leg', type: 'Pennate',
        dot: { x: 55, y: 150, label: 'Deep Posterior Leg' },
        clues: [
            { lbl: 'Function', txt: 'Primary inverter of the foot. Plantarflexes and supinates. MMT: side-lying with test leg down, foot in slight plantarflexion, invert foot toward ceiling.' },
            { lbl: 'Origin', txt: 'Posterior tibia, fibula, and interosseous membrane.' },
            { lbl: 'Insertion', txt: 'Navicular tuberosity and all tarsal bones except the talus; bases of metatarsals 2–4.' },
            { lbl: 'Innervation', txt: 'Tibial nerve (L4, L5).' },
            { lbl: 'Clinical', txt: 'Tibialis posterior tendinopathy causes medial ankle pain and progressive flat foot deformity. Palpated posterior to the medial malleolus ("Tom Dick And Not Harry").' },
        ],
        fact: 'Tibialis posterior is the <strong>primary dynamic support of the medial longitudinal arch</strong>. Its tendon rupture leads to adult-acquired flatfoot deformity — a progressive collapse of the arch that, if untreated, results in significant disability.',
    },

    {
        name: 'PERONEUS', displayName: 'Peroneus Longus & Brevis',
        group: 'Lower Limb', region: 'Lateral Leg', type: 'Pennate',
        dot: { x: 40, y: 152, label: 'Lateral Leg' },
        clues: [
            { lbl: 'Function', txt: 'Eversion and plantarflexion of the foot. Primary evertor group. MMT: side-lying with test leg on top, lift foot toward ceiling from inversion start position.' },
            { lbl: 'Origin', txt: 'Longus: upper two-thirds of fibula. Brevis: lower two-thirds of fibula.' },
            { lbl: 'Insertion', txt: 'Brevis: base of 5th metatarsal. Longus: crosses the plantar foot to medial cuneiform and 1st metatarsal.' },
            { lbl: 'Innervation', txt: 'Superficial fibular (peroneal) nerve (L4, L5, S1).' },
            { lbl: 'Clinical', txt: 'Brevis tendon rupture at its insertion is the most common cause of an avulsion fracture at the base of the 5th metatarsal — a "dancer\'s fracture."' },
        ],
        fact: 'Peroneus longus travels the <strong>longest tendon path of any lower limb muscle</strong> — it turns 90° around the lateral malleolus, crosses the plantar foot diagonally, and inserts medially to support the lateral arch and first ray stability.',
    },

    {
        name: 'FLEXHALLUC', displayName: 'Flexor Hallucis Longus',
        group: 'Lower Limb', region: 'Deep Posterior Leg', type: 'Pennate',
        dot: { x: 54, y: 158, label: 'Deep Posterior Leg' },
        clues: [
            { lbl: 'Function', txt: 'Flexes the big toe at all joints and assists plantarflexion. Critical for the push-off phase of gait and jumping.' },
            { lbl: 'Origin', txt: 'Posterior surface of the fibula (lower two-thirds).' },
            { lbl: 'Insertion', txt: 'Base of the distal phalanx of the great toe.' },
            { lbl: 'Innervation', txt: 'Tibial nerve (L5, S1, S2).' },
            { lbl: 'Clinical', txt: 'MMT: support the foot, ask them to flex the big toe, add gentle resistance. Tendinopathy occurs in dancers — causing posteromedial ankle pain with a triggering sensation.' },
        ],
        fact: 'FHL is the <strong>"Achilles tendon of the foot"</strong> for dancers — chronic stenosing tenosynovitis creates a characteristic triggering of the big toe that can end a dance career. It passes through a fibro-osseous tunnel behind the medial malleolus.',
    },

    {
        name: 'EXTHALLUC', displayName: 'Extensor Hallucis Longus',
        group: 'Lower Limb', region: 'Anterior Leg', type: 'Pennate',
        dot: { x: 45, y: 155, label: 'Anterior Leg' },
        clues: [
            { lbl: 'Function', txt: 'Extends the big toe and assists dorsiflexion and inversion. L5 myotome test in the lumbar scanning examination.' },
            { lbl: 'Origin', txt: 'Middle half of the anterior fibula and interosseous membrane.' },
            { lbl: 'Insertion', txt: 'Dorsum of the distal phalanx of the great toe.' },
            { lbl: 'Innervation', txt: 'Deep fibular (peroneal) nerve (L4, L5).' },
            { lbl: 'MMT', txt: 'Hold the foot stable, ask to extend the big toe; then apply gentle resistance on the distal phalanx downward. Full strength = grade 5.' },
        ],
        fact: 'EHL is the <strong>key muscle tested for L5 nerve root integrity</strong>. Weakness — particularly the inability to hold the great toe extended against resistance — is the most specific single test for an L5 disc herniation.',
    },

    {
        name: 'FLEXDIG', displayName: 'Flexor Digitorum Longus',
        group: 'Lower Limb', region: 'Deep Posterior Leg', type: 'Pennate',
        dot: { x: 57, y: 155, label: 'Deep Posterior Leg' },
        clues: [
            { lbl: 'Function', txt: 'Flexes the lateral four toes and assists plantarflexion and inversion. Part of the "Tom Dick And Not Harry" group behind the medial malleolus.' },
            { lbl: 'Origin', txt: 'Posterior surface of the tibia below the soleal line.' },
            { lbl: 'Insertion', txt: 'Bases of the distal phalanges of the lateral four toes.' },
            { lbl: 'Innervation', txt: 'Tibial nerve (L5, S1).' },
            { lbl: 'Palpation', txt: 'Palpated posterior to the medial malleolus, just posterior to tibialis posterior. Part of the medial retinacular structures.' },
        ],
        fact: 'The mnemonic <strong>"Tom, Dick, And Not Harry"</strong> identifies the structures posterior to the medial malleolus from anterior to posterior: Tibialis posterior, flexor Digitorum longus, posterior tibial Artery and nerve, and flexor Hallucis longus.',
    },

    {
        name: 'EXTDIG', displayName: 'Extensor Digitorum Longus',
        group: 'Lower Limb', region: 'Anterior Leg', type: 'Pennate',
        dot: { x: 40, y: 148, label: 'Anterior Leg' },
        clues: [
            { lbl: 'Function', txt: 'Extends the lateral four toes and dorsiflexes and everts the foot.' },
            { lbl: 'Origin', txt: 'Lateral tibial condyle, anterior fibula, and interosseous membrane.' },
            { lbl: 'Insertion', txt: 'Middle and distal phalanges of toes 2–5 via the extensor hood.' },
            { lbl: 'Innervation', txt: 'Deep fibular (peroneal) nerve (L4, L5).' },
            { lbl: 'MMT', txt: 'Ask patient to extend the toes and lift them off the bed; add gentle downward resistance on the toes as a group.' },
        ],
        fact: 'EDL inserts via the <strong>extensor hood mechanism</strong> — a complex aponeurotic expansion that also receives contributions from the lumbrical and interossei muscles, allowing coordinated toe extension and stabilisation.',
    },

    // ══════════════════════════════════════════════════════════════════
    // CERVICAL / SHOULDER GIRDLE
    // ══════════════════════════════════════════════════════════════════

    {
        name: 'LEVSCAP', displayName: 'Levator Scapulae',
        group: 'Shoulder', region: 'Posterior Neck', type: 'Strap',
        dot: { x: 62, y: 30, label: 'Posterior Neck' },
        clues: [
            { lbl: 'Function', txt: 'Elevates the scapula and rotates the glenoid downward. C4 myotome key muscle for the shoulder shrug test.' },
            { lbl: 'Origin', txt: 'Transverse processes of C1–C4 vertebrae.' },
            { lbl: 'Insertion', txt: 'Medial border of the scapula, between the superior angle and the root of the spine.' },
            { lbl: 'Innervation', txt: 'C3, C4 spinal nerves and dorsal scapular nerve (C5).' },
            { lbl: 'Clinical', txt: 'The C4 shoulder shrug test is confounded by upper trapezius (accessory nerve). Palpated in cervical and shoulder palpation exams. A common trigger point site causing "crick in the neck."' },
        ],
        fact: 'Levator scapulae is one of the most common sites of <strong>myofascial trigger points</strong> in clinical practice. Its trigger points refer pain in a characteristic pattern to the angle of the neck and top of the shoulder — the classic "stiff neck" presentation.',
    },

    {
        name: 'DELTOID', displayName: 'Deltoid',
        group: 'Shoulder', region: 'Shoulder', type: 'Multipennate',
        dot: { x: 21, y: 40, label: 'Shoulder' },
        clues: [
            { lbl: 'Function', txt: 'Middle fibres abduct the arm — the C5 myotome. Anterior fibres flex; posterior fibres extend. MMT: cradle arm, one hand on shoulder, resist at distal humerus.' },
            { lbl: 'Origin', txt: 'Lateral third of clavicle, acromion, and spine of scapula.' },
            { lbl: 'Insertion', txt: 'Deltoid tuberosity on the lateral mid-shaft of the humerus.' },
            { lbl: 'Innervation', txt: 'Axillary nerve (C5, C6), which wraps around the surgical neck of the humerus.' },
            { lbl: 'Clinical', txt: 'A common site for intramuscular injections. Axillary nerve damage after shoulder dislocation causes deltoid wasting — detected by observing muscle bulk and the shape of the shoulder.' },
        ],
        fact: 'The <strong>middle deltoid</strong> is the primary arm abductor but requires supraspinatus to initiate the first 15°. The anterior and posterior heads are almost opposing, granting 360° rotational control of the shoulder.',
    },

    {
        name: 'SUPRASPINATUS', displayName: 'Supraspinatus',
        group: 'Shoulder', region: 'Rotator Cuff', type: 'Pennate',
        dot: { x: 28, y: 36, label: 'Rotator Cuff' },
        clues: [
            { lbl: 'Function', txt: 'Initiates shoulder abduction (first 15°) and compresses the humeral head. Tested with the Empty Can (Jobe\'s) test.' },
            { lbl: 'Origin', txt: 'Supraspinous fossa of the scapula.' },
            { lbl: 'Insertion', txt: 'Superior facet of the greater tubercle of the humerus.' },
            { lbl: 'Innervation', txt: 'Suprascapular nerve (C5, C6).' },
            { lbl: 'Clinical', txt: 'Most commonly torn rotator cuff muscle — at the "critical zone" near insertion. Diagnosed by Empty Can, Full Can, and Neer impingement tests. Hawkins-Kennedy also positive.' },
        ],
        fact: 'Tears are so prevalent that <strong>over 50% of adults over 60</strong> have a partial or full-thickness supraspinatus tear — many are completely asymptomatic throughout their lives.',
    },

    {
        name: 'INFRASPINATUS', displayName: 'Infraspinatus',
        group: 'Shoulder', region: 'Rotator Cuff', type: 'Multipennate',
        dot: { x: 72, y: 48, label: 'Rotator Cuff' },
        clues: [
            { lbl: 'Function', txt: 'Laterally rotates the humerus. MMT prone with 90° abduction, towel under humerus; grade 3 = lift hand cranially.' },
            { lbl: 'Origin', txt: 'Infraspinous fossa of the scapula.' },
            { lbl: 'Insertion', txt: 'Middle facet of the greater tubercle of the humerus.' },
            { lbl: 'Innervation', txt: 'Suprascapular nerve (C5, C6).' },
            { lbl: 'Clinical', txt: 'External rotation lag sign — inability to hold the arm in passive external rotation after release suggests infraspinatus tear. Drop arm test also assesses rotator cuff integrity.' },
        ],
        fact: 'With teres minor, infraspinatus is one of only <strong>two external rotators</strong> at the glenohumeral joint. Critical for the deceleration phase in throwing and racket sports.',
    },

    {
        name: 'TERESMINOR', displayName: 'Teres Minor',
        group: 'Shoulder', region: 'Rotator Cuff', type: 'Cylindrical',
        dot: { x: 74, y: 52, label: 'Rotator Cuff' },
        clues: [
            { lbl: 'Function', txt: 'Lateral rotation and slight extension of the humerus. Tested alongside infraspinatus in the external rotation MMT.' },
            { lbl: 'Origin', txt: 'Upper two-thirds of the lateral border of the scapula.' },
            { lbl: 'Insertion', txt: 'Inferior facet of the greater tubercle of the humerus.' },
            { lbl: 'Innervation', txt: 'Axillary nerve (C5, C6).' },
            { lbl: 'Clinical', txt: 'The external rotation lag sign and drop arm test assess the combined integrity of infraspinatus and teres minor. Isolated teres minor tears are uncommon.' },
        ],
        fact: 'Teres minor is the <strong>smallest rotator cuff muscle</strong> and the only one innervated by the axillary nerve rather than the suprascapular nerve. Despite its size, it plays a critical role in posterior glenohumeral stability.',
    },

    {
        name: 'SUBSCAPULARIS', displayName: 'Subscapularis',
        group: 'Shoulder', region: 'Rotator Cuff', type: 'Multipennate',
        dot: { x: 30, y: 46, label: 'Rotator Cuff' },
        clues: [
            { lbl: 'Function', txt: 'Medially rotates and adducts the humerus. The only rotator cuff muscle that medially rotates. MMT: same position as infraspinatus but palm up.' },
            { lbl: 'Origin', txt: 'Subscapular fossa — the large concave anterior surface of the scapula.' },
            { lbl: 'Insertion', txt: 'Lesser tubercle of the humerus.' },
            { lbl: 'Innervation', txt: 'Upper and lower subscapular nerves (C5, C6, C7).' },
            { lbl: 'Clinical', txt: 'Tested by the lift-off test and belly-press test. Tears cause excessive external rotation and anterior instability. Largest and strongest of the four rotator cuff muscles.' },
        ],
        fact: 'The <strong>largest and strongest</strong> of the four rotator cuff muscles, yet the least discussed clinically. It alone counterbalances the powerful external rotators to maintain joint centration.',
    },

    {
        name: 'SERRATUS', displayName: 'Serratus Anterior',
        group: 'Trunk', region: 'Lateral Thorax', type: 'Serrated',
        dot: { x: 38, y: 58, label: 'Lateral Thorax' },
        clues: [
            { lbl: 'Function', txt: 'Protracts and upwardly rotates the scapula. MMT: supine, shoulder flexed to 90°, slight horizontal adduction to bias serratus; push arm toward ceiling.' },
            { lbl: 'Origin', txt: 'Outer surfaces and superior borders of ribs 1–9.' },
            { lbl: 'Insertion', txt: 'Costal surface of the entire medial border of the scapula.' },
            { lbl: 'Innervation', txt: 'Long thoracic nerve (C5, C6, C7) — runs unprotected along the lateral chest wall for ~25 cm.' },
            { lbl: 'Clinical', txt: '"Winging" of the scapula — medial border lifts off the thorax when pushing against a wall — is the classic sign of long thoracic nerve palsy. Observed in wall push-up.' },
        ],
        fact: 'The long thoracic nerve runs <strong>unprotected for ~25 cm</strong> along the lateral chest wall, making it highly vulnerable to traction injuries in overhead sport and thoracic surgery.',
    },

    {
        name: 'UPTRAP', displayName: 'Upper Trapezius',
        group: 'Shoulder', region: 'Upper Back', type: 'Flat',
        dot: { x: 60, y: 36, label: 'Upper Back' },
        clues: [
            { lbl: 'Function', txt: 'Elevates and upwardly rotates the scapula. MMT sitting with arm at 20° abduction; grade 3 = elevate shoulder, grade 4/5 = resist downward.' },
            { lbl: 'Origin', txt: 'External occipital protuberance, ligamentum nuchae, and spinous process of C7.' },
            { lbl: 'Insertion', txt: 'Lateral third of the clavicle and acromion.' },
            { lbl: 'Innervation', txt: 'Spinal accessory nerve (CN XI) for motor. Cervical plexus (C3–C4) for proprioception.' },
            { lbl: 'Clinical', txt: 'CN XI palsy causes drooping of the shoulder and inability to shrug. The C4 shoulder shrug test primarily recruits upper trapezius, not just levator scapulae.' },
        ],
        fact: 'Upper trapezius is innervated by <strong>cranial nerve XI (accessory nerve)</strong> — not a spinal nerve — making it unique among back muscles and critical to test when suspecting central nervous system involvement.',
    },

    {
        name: 'MIDTRAP', displayName: 'Middle Trapezius',
        group: 'Shoulder', region: 'Mid Back', type: 'Flat',
        dot: { x: 68, y: 50, label: 'Mid Back' },
        clues: [
            { lbl: 'Function', txt: 'Retracts the scapula. MMT prone with arm at 90° abduction, thumb up; grade 3 = lift arm off bed and hold isometrically.' },
            { lbl: 'Origin', txt: 'Spinous processes of C7–T3.' },
            { lbl: 'Insertion', txt: 'Medial border of the acromion and superior surface of the scapular spine.' },
            { lbl: 'Innervation', txt: 'Spinal accessory nerve (CN XI) and cervical plexus (C3–C4).' },
            { lbl: 'Clinical', txt: 'Grade 4/5: add resistance pressing scapula into protraction while patient holds position. Weakness contributes to rounded shoulders and scapular dyskinesis.' },
        ],
        fact: 'Middle trapezius acts as a <strong>key retractor opposing serratus anterior</strong>. Imbalance between these two muscles — often seen with prolonged desk work — creates forward shoulder posture and disrupts the scapulohumeral rhythm.',
    },

    {
        name: 'LOWTRAP', displayName: 'Lower Trapezius',
        group: 'Shoulder', region: 'Lower Back', type: 'Flat',
        dot: { x: 65, y: 62, label: 'Lower Back' },
        clues: [
            { lbl: 'Function', txt: 'Depresses and upwardly rotates the scapula. MMT prone at 120° arm elevation, thumb toward ceiling; grade 3 = lift arm off bed.' },
            { lbl: 'Origin', txt: 'Spinous processes of T4–T12.' },
            { lbl: 'Insertion', txt: 'Medial end of the scapular spine.' },
            { lbl: 'Innervation', txt: 'Spinal accessory nerve (CN XI) and cervical plexus (C3–C4).' },
            { lbl: 'Clinical', txt: 'Palpated on a line from spine of scapula to T12. Most commonly inhibited of all three trapezius parts. Weakness allows scapular elevation during arm raise — a sign of poor scapular control.' },
        ],
        fact: 'Lower trapezius is <strong>the most underactive shoulder muscle</strong> in patients with shoulder impingement. Its inhibition allows superior scapular migration that narrows the subacromial space, directly contributing to rotator cuff impingement.',
    },

    {
        name: 'RHOMBOID', displayName: 'Rhomboid Major',
        group: 'Back', region: 'Mid Back', type: 'Flat',
        dot: { x: 50, y: 52, label: 'Mid Back' },
        clues: [
            { lbl: 'Function', txt: 'Retracts and downwardly rotates the scapula. MMT prone with arm behind back, hand on opposite buttock; lift hand off buttock to retract scapula.' },
            { lbl: 'Origin', txt: 'Spinous processes of T2–T5.' },
            { lbl: 'Insertion', txt: 'Medial border of the scapula, between the spine and inferior angle.' },
            { lbl: 'Innervation', txt: 'Dorsal scapular nerve (C4, C5).' },
            { lbl: 'Clinical', txt: 'Weakness causes medial scapular winging and is associated with sustained forward-head, rounded-shoulder posture. Works as an opposing force couple with serratus anterior.' },
        ],
        fact: 'Rhomboids and serratus anterior act as <strong>opposing force couples</strong> to control scapular rotation. Imbalance between them is a root cause of many shoulder impingement presentations.',
    },

    {
        name: 'PECTORALIS', displayName: 'Pectoralis Major',
        group: 'Trunk', region: 'Anterior Chest', type: 'Fan-shaped',
        dot: { x: 42, y: 48, label: 'Anterior Chest' },
        clues: [
            { lbl: 'Function', txt: 'Adducts and medially rotates the humerus. MMT: supine, 90° abduction, bring arm across body. Palpate anterior axilla and inferior clavicle.' },
            { lbl: 'Origin', txt: 'Medial clavicle (clavicular head) and sternum + costal cartilages of ribs 1–6 (sternocostal head).' },
            { lbl: 'Insertion', txt: 'Greater tubercle crest of the humerus. The tendon twists 90° before inserting.' },
            { lbl: 'Innervation', txt: 'Medial pectoral nerve (sternocostal head) and lateral pectoral nerve (clavicular head). C5–T1.' },
            { lbl: 'Clinical', txt: 'Tendon rupture at its insertion creates obvious asymmetry and is the most common heavy bench press injury. Speeds test can also implicate the pectoralis in bicipital groove tenderness.' },
        ],
        fact: 'The distal tendon <strong>rotates 180°</strong> as it inserts — so the clavicular fibres end up inferiorly and the sternal fibres superiorly. A remarkable anatomical twist that allows the muscle to function across a wide range of arm positions.',
    },

    {
        name: 'LATISSIMUS', displayName: 'Latissimus Dorsi',
        group: 'Back', region: 'Mid/Lower Back', type: 'Flat',
        dot: { x: 50, y: 62, label: 'Mid Back' },
        clues: [
            { lbl: 'Function', txt: 'Adducts, extends, and medially rotates the arm. MMT prone, extend humerus in medial rotation; resist at distal humerus from opposite side of bed.' },
            { lbl: 'Origin', txt: 'Spinous processes T7–T12, thoracolumbar fascia, iliac crest, ribs 9–12.' },
            { lbl: 'Insertion', txt: 'Floor of the intertubercular groove of the humerus.' },
            { lbl: 'Innervation', txt: 'Thoracodorsal nerve (C6, C7, C8).' },
            { lbl: 'Clinical', txt: 'A common reconstructive surgery donor — the lat can be rotated to cover large anterior chest wall defects after mastectomy without significant functional loss.' },
        ],
        fact: 'A common <strong>reconstructive surgery donor</strong> — the lat can be rotated to cover large anterior chest wall defects after mastectomy without significant functional loss.',
    },

    {
        name: 'CORACOBRACHIALIS', displayName: 'Coracobrachialis',
        group: 'Upper Limb', region: 'Upper Arm', type: 'Fusiform',
        dot: { x: 22, y: 46, label: 'Upper Arm' },
        clues: [
            { lbl: 'Function', txt: 'Shoulder flexion and adduction. MMT supine: elbow flexed, shoulder flexion and adduction with external rotation; bring elbow across body.' },
            { lbl: 'Origin', txt: 'Apex of the coracoid process of the scapula.' },
            { lbl: 'Insertion', txt: 'Middle third of the medial humerus.' },
            { lbl: 'Innervation', txt: 'Musculocutaneous nerve (C5, C6, C7) — this nerve actually pierces through the muscle.' },
            { lbl: 'Clinical', txt: 'Grade 4/5: stabilise scapula and resist on the inside of the humerus while patient maintains external rotation throughout the movement.' },
        ],
        fact: 'The musculocutaneous nerve <strong>physically pierces through coracobrachialis</strong> — it is the only muscle the musculocutaneous nerve passes through rather than simply alongside. Entrapment within the muscle can cause anterior arm sensory loss.',
    },

    // ELBOW
    {
        name: 'BICEPS', displayName: 'Biceps Brachii',
        group: 'Upper Limb', region: 'Upper Arm', type: 'Biarticular',
        dot: { x: 22, y: 52, label: 'Upper Arm' },
        clues: [
            { lbl: 'Function', txt: 'Elbow flexion (C5/C6 myotome) and forearm supination. MMT supine with humerus on bed, forearm supinated; resist on wrist. Speeds test for long head tendinopathy.' },
            { lbl: 'Origin', txt: 'Coracoid process (short head) and supraglenoid tubercle (long head) of the scapula.' },
            { lbl: 'Insertion', txt: 'Radial tuberosity and bicipital aponeurosis.' },
            { lbl: 'Innervation', txt: 'Musculocutaneous nerve (C5, C6).' },
            { lbl: 'Clinical', txt: 'Proximal long head rupture creates the "Popeye" bulge. Speeds test: 90° shoulder flexion, straight arm, palm up, eccentric contraction. Deep tendon reflex at biceps = C5/C6.' },
        ],
        fact: 'The biceps has <strong>two heads</strong> yet both converge on a single distal tendon. Its supination action is actually stronger than its flexion force at the elbow — a fact often overlooked clinically.',
    },

    {
        name: 'BRACHIALIS', displayName: 'Brachialis',
        group: 'Upper Limb', region: 'Upper Arm', type: 'Fusiform',
        dot: { x: 78, y: 54, label: 'Upper Arm' },
        clues: [
            { lbl: 'Function', txt: 'Pure elbow flexor. The only muscle whose sole job is to flex the elbow regardless of forearm position. MMT supine with forearm in pronation, resist on back of wrist.' },
            { lbl: 'Origin', txt: 'Distal half of the anterior surface of the humerus.' },
            { lbl: 'Insertion', txt: 'Coronoid process and ulnar tuberosity — inserts into the ulna, not the radius.' },
            { lbl: 'Innervation', txt: 'Musculocutaneous nerve (C5, C6); a small lateral strip also supplied by the radial nerve.' },
            { lbl: 'Clinical', txt: 'Because it inserts into the ulna, brachialis cannot supinate. Its strength is the same whether the palm faces up or down — making it the "workhorse" of elbow flexion.' },
        ],
        fact: 'Unlike the biceps, brachialis inserts into the <strong>ulna</strong> and therefore cannot supinate. It has a greater cross-sectional area than the biceps, making it the true primary elbow flexor despite the biceps\' fame.',
    },

    {
        name: 'BRACHIORADIALIS', displayName: 'Brachioradialis',
        group: 'Upper Limb', region: 'Forearm', type: 'Fusiform',
        dot: { x: 77, y: 62, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Elbow flexion, especially in the mid-prone (neutral) position. MMT supine with forearm in pronation. Also tested via the brachioradialis deep tendon reflex at C5/C6.' },
            { lbl: 'Origin', txt: 'Lateral supracondylar ridge of the humerus.' },
            { lbl: 'Insertion', txt: 'Styloid process of the radius.' },
            { lbl: 'Innervation', txt: 'Radial nerve (C5, C6) — unique as a radial nerve muscle that flexes rather than extends.' },
            { lbl: 'Reflex', txt: 'Deep tendon reflex tested by striking just proximal to the radial styloid process — looking for elbow flexion. One of three elbow reflexes assessed in the upper quadrant scan.' },
        ],
        fact: 'Brachioradialis is the <strong>only radial nerve-innervated muscle that flexes</strong> the elbow rather than extends it — an anatomical exception that makes it a clinically important landmark for distinguishing radial nerve lesion levels.',
    },

    {
        name: 'TRICEPS', displayName: 'Triceps Brachii',
        group: 'Upper Limb', region: 'Upper Arm', type: 'Tri-headed',
        dot: { x: 78, y: 50, label: 'Upper Arm' },
        clues: [
            { lbl: 'Function', txt: 'Elbow extension — C7 myotome. MMT supine with arm draped across chest; stabilise humerus, extend elbow, resist near wrist.' },
            { lbl: 'Origin', txt: 'Long head: infraglenoid tubercle of scapula. Lateral and medial heads: posterior humerus.' },
            { lbl: 'Insertion', txt: 'Olecranon process of the ulna.' },
            { lbl: 'Innervation', txt: 'Radial nerve (C6, C7, C8).' },
            { lbl: 'Reflex', txt: 'Deep tendon reflex tested with arm draped across the face (elbow to sky), striking just above the olecranon. Tests C7 nerve root integrity.' },
        ],
        fact: 'The triceps is the <strong>sole elbow extensor</strong> — there is no other muscle that can extend the elbow joint. Despite having three heads, they all converge on the single olecranon attachment. C7 is by far the most commonly affected nerve root in cervical disc disease.',
    },

    {
        name: 'SUPINATOR', displayName: 'Supinator',
        group: 'Upper Limb', region: 'Forearm', type: 'Flat',
        dot: { x: 76, y: 66, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Supinates the forearm, especially at low-speed. C6 myotome. MMT sitting with arm hugged to side, elbow at 90°; start fully pronated, supinate against resistance.' },
            { lbl: 'Origin', txt: 'Lateral epicondyle of the humerus and supinator crest of the ulna.' },
            { lbl: 'Insertion', txt: 'Lateral and anterior surfaces of the proximal radius.' },
            { lbl: 'Innervation', txt: 'Deep branch of the radial nerve (C5, C6).' },
            { lbl: 'Clinical', txt: 'At high-speed supination, the biceps dominates; at low speed (as in a slow turn of a screwdriver), supinator predominates. Supination is stronger than pronation.' },
        ],
        fact: 'Supinator wraps around the proximal radius — the deep branch of the radial nerve passes through the <strong>arcade of Frohse</strong> within supinator, making it a common site of posterior interosseous nerve entrapment (radial tunnel syndrome).',
    },

    {
        name: 'PRONATOR', displayName: 'Pronator Teres',
        group: 'Upper Limb', region: 'Forearm', type: 'Fusiform',
        dot: { x: 23, y: 66, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Pronates the forearm and weakly flexes the elbow. MMT sitting with arm hugged to side; start fully supinated, pronate against resistance on the radius.' },
            { lbl: 'Origin', txt: 'Medial epicondyle of the humerus (humeral head) and coronoid process of the ulna (ulnar head).' },
            { lbl: 'Insertion', txt: 'Lateral surface of the radius at its midpoint.' },
            { lbl: 'Innervation', txt: 'Median nerve (C6, C7).' },
            { lbl: 'Clinical', txt: 'The median nerve passes between the two heads of pronator teres — compression here causes pronator teres syndrome, mimicking carpal tunnel syndrome.' },
        ],
        fact: 'The median nerve passes between the two heads of pronator teres — a common entrapment site called <strong>pronator teres syndrome</strong>. Unlike carpal tunnel syndrome, symptoms include forearm aching and are reproduced by resisted pronation.',
    },

    {
        name: 'PRONATQUAD', displayName: 'Pronator Quadratus',
        group: 'Upper Limb', region: 'Forearm', type: 'Flat',
        dot: { x: 22, y: 72, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Primary pronator of the forearm. Acts at all speeds of pronation. Also binds the radius and ulna together during loading.' },
            { lbl: 'Origin', txt: 'Anterior surface of the distal quarter of the ulna.' },
            { lbl: 'Insertion', txt: 'Anterior surface of the distal quarter of the radius.' },
            { lbl: 'Innervation', txt: 'Anterior interosseous nerve (branch of median nerve, C7, C8).' },
            { lbl: 'Clinical', txt: 'Acts alongside pronator teres in the forearm pronation MMT. Weakness isolated to pronator quadratus suggests anterior interosseous nerve palsy (OK sign weakness).' },
        ],
        fact: 'Pronator quadratus is the <strong>primary pronator at all speeds</strong> — pronator teres only assists. Its square flat shape directly bridges the two forearm bones, also functioning to resist separation of the distal radioulnar joint during loading.',
    },

    // ══════════════════════════════════════════════════════════════════
    // WRIST / HAND
    // ══════════════════════════════════════════════════════════════════

    {
        name: 'FCR', displayName: 'Flexor Carpi Radialis',
        group: 'Upper Limb', region: 'Forearm', type: 'Fusiform',
        dot: { x: 21, y: 70, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Wrist flexion and radial deviation. C6 nerve root. MMT: handshake grip, resist wrist flexion toward radial side.' },
            { lbl: 'Origin', txt: 'Medial epicondyle of the humerus via the common flexor tendon.' },
            { lbl: 'Insertion', txt: 'Base of the 2nd (and sometimes 3rd) metacarpal.' },
            { lbl: 'Innervation', txt: 'Median nerve (C6, C7).' },
            { lbl: 'Clinical', txt: 'Its tendon is a key landmark in the wrist — the radial artery is palpable just lateral to it. Tendinopathy causes radial-sided wrist pain reproduced by resisted wrist flexion.' },
        ],
        fact: 'The FCR tendon acts as the <strong>primary radial artery landmark</strong> at the wrist — the classic pulse palpation site. Its groove in the trapezium is a common site of isolated FCR tendinopathy, particularly in racket sport athletes.',
    },

    {
        name: 'FCU', displayName: 'Flexor Carpi Ulnaris',
        group: 'Upper Limb', region: 'Forearm', type: 'Fusiform',
        dot: { x: 24, y: 72, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Wrist flexion and ulnar deviation. C8 nerve root. MMT: handshake grip, resist wrist flexion toward ulnar side.' },
            { lbl: 'Origin', txt: 'Medial epicondyle (humeral head) and posterior ulna (ulnar head).' },
            { lbl: 'Insertion', txt: 'Pisiform, hook of hamate, and base of 5th metacarpal.' },
            { lbl: 'Innervation', txt: 'Ulnar nerve (C7, C8).' },
            { lbl: 'Clinical', txt: 'Inserts into the pisiform — palpated at the hypothenar eminence. Weakness or pain with resisted ulnar deviation implicates either FCU pathology or ulnar nerve involvement at the elbow (cubital tunnel).' },
        ],
        fact: 'FCU is the only wrist flexor innervated by the <strong>ulnar nerve</strong> — all others are median. It acts as a "pulley" for the pisiform, which is a sesamoid bone within its tendon, amplifying force transmission to the ulnar side of the wrist.',
    },

    {
        name: 'ECR', displayName: 'Extensor Carpi Radialis',
        group: 'Upper Limb', region: 'Forearm', type: 'Fusiform',
        dot: { x: 77, y: 68, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Wrist extension and radial deviation. C6 nerve root (ECRL and ECRB). MMT: handshake grip, resist wrist extension toward radial side.' },
            { lbl: 'Components', txt: 'Two muscles: extensor carpi radialis longus (ECRL) and brevis (ECRB). ECRB is most commonly involved in lateral epicondylalgia (tennis elbow).' },
            { lbl: 'Origin', txt: 'Lateral supracondylar ridge (ECRL) and lateral epicondyle (ECRB).' },
            { lbl: 'Innervation', txt: 'Radial nerve (C6, C7).' },
            { lbl: 'Clinical', txt: 'Cozen\'s test, Mill\'s test, and Maudsley\'s test are the primary clinical tests for lateral epicondylalgia implicating this tendon. Pain reproduced by resisted wrist extension.' },
        ],
        fact: 'The ECRB is the <strong>most commonly affected tendon in tennis elbow</strong> (lateral epicondylalgia). Its enthesis at the lateral epicondyle undergoes pathological collagen changes — now understood as a degenerative rather than purely inflammatory process.',
    },

    {
        name: 'ECU', displayName: 'Extensor Carpi Ulnaris',
        group: 'Upper Limb', region: 'Forearm', type: 'Fusiform',
        dot: { x: 79, y: 70, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Wrist extension and ulnar deviation. C7 nerve root. MMT: handshake grip, resist wrist extension toward ulnar side.' },
            { lbl: 'Origin', txt: 'Lateral epicondyle (common extensor origin) and posterior ulna.' },
            { lbl: 'Insertion', txt: 'Base of the 5th metacarpal.' },
            { lbl: 'Innervation', txt: 'Posterior interosseous nerve (deep branch of radial nerve, C6, C7).' },
            { lbl: 'Clinical', txt: 'ECU subsheath injury is a common wrist injury in racket and stick sports — caused by sudden pronation under load. Causes ulnar-sided wrist pain and snapping with forearm rotation.' },
        ],
        fact: 'ECU runs through a dedicated fibro-osseous groove on the ulnar head within its own <strong>subsheath</strong>. Subsheath tears from rotational wrist loading (golf, tennis) cause painful ulnar-side snapping — a commonly misdiagnosed condition.',
    },

    {
        name: 'EXTDIG', displayName: 'Extensor Digitorum',
        group: 'Upper Limb', region: 'Forearm', type: 'Pennate',
        dot: { x: 78, y: 66, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Extends the fingers at MCP, PIP, and DIP joints. C7 nerve root. Tested with Maudsley\'s test — resisting extension of the 3rd digit.' },
            { lbl: 'Origin', txt: 'Lateral epicondyle via the common extensor tendon.' },
            { lbl: 'Insertion', txt: 'Extensor hood of all four fingers, then to middle and distal phalanges.' },
            { lbl: 'Innervation', txt: 'Posterior interosseous nerve (C7, C8).' },
            { lbl: 'Clinical', txt: 'Maudsley\'s test: straight arm, resist extension of 3rd digit at the middle phalanx. Positive = lateral epicondyle pain. Also involved in tennis elbow presentation.' },
        ],
        fact: 'Extensor digitorum inserts via the <strong>extensor hood</strong> — an intricate aponeurotic expansion that receives contributions from the lumbricals and interossei, allowing the intrinsic muscles to paradoxically flex the MCP and extend the IPs.',
    },

    {
        name: 'LUMBRICALS', displayName: 'Lumbricals',
        group: 'Upper Limb', region: 'Hand', type: 'Worm-shaped',
        dot: { x: 20, y: 84, label: 'Hand' },
        clues: [
            { lbl: 'Function', txt: 'Flex the MCP joints while simultaneously extending the PIP and DIP joints — the "intrinsic plus" position. T1 nerve root.' },
            { lbl: 'Origin', txt: 'Unique: originates from the flexor digitorum profundus tendons within the palm.' },
            { lbl: 'Insertion', txt: 'Lateral bands of the extensor hood of each finger.' },
            { lbl: 'Innervation', txt: 'Lateral two (radial) lumbricals: median nerve. Medial two (ulnar) lumbricals: ulnar nerve.' },
            { lbl: 'Clinical', txt: 'MMT: hand flat, move finger in abduction/adduction then test MCP flexion with IPs extended. "Rock" hand position (fist) tests median nerve; "scissors" (spread fingers) tests ulnar nerve.' },
        ],
        fact: 'Lumbricals are the only muscles in the body that <strong>originate from a tendon</strong> (FDP) rather than bone. They act as a tension regulator between the flexor and extensor systems, enabling the precision needed for fine motor tasks.',
    },

    {
        name: 'FDS', displayName: 'Flexor Digitorum Superficialis',
        group: 'Upper Limb', region: 'Forearm', type: 'Bipennate',
        dot: { x: 22, y: 74, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Flexes the PIP joints of the fingers and assists MCP and wrist flexion. C7/C8 nerve roots.' },
            { lbl: 'Origin', txt: 'Medial epicondyle (humeroulnar head) and anterior radius (radial head).' },
            { lbl: 'Insertion', txt: 'Sides of the middle phalanx of fingers 2–5 (it splits to allow FDP to pass through).' },
            { lbl: 'Innervation', txt: 'Median nerve (C7, C8, T1).' },
            { lbl: 'Clinical', txt: 'Isolated testing: hold all other fingers in extension, then ask to flex the PIP of the test finger. The intact FDS can flex PIP independently of FDP because FDP tendons are connected.' },
        ],
        fact: 'FDS splits at the proximal phalanx to create <strong>Camper\'s chiasm</strong> — a split that allows the deeper FDP tendon to pass through. This elegant anatomical arrangement enables independent control of superficial and deep finger flexion.',
    },

    {
        name: 'FDP', displayName: 'Flexor Digitorum Profundus',
        group: 'Upper Limb', region: 'Forearm', type: 'Pennate',
        dot: { x: 24, y: 76, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Flexes the DIP joints of the fingers (and assists PIP and MCP). C8 nerve root. Tested by stabilising the PIP and asking to flex the DIP.' },
            { lbl: 'Origin', txt: 'Anterior and medial surfaces of the ulna and interosseous membrane.' },
            { lbl: 'Insertion', txt: 'Base of the distal phalanx of fingers 2–5, passing through the split in FDS.' },
            { lbl: 'Innervation', txt: 'Lateral part (index/middle): anterior interosseous nerve (median). Medial part (ring/little): ulnar nerve.' },
            { lbl: 'Clinical', txt: 'Uniquely, FDP to the index finger is tested in the "OK sign" for anterior interosseous nerve integrity. FDP gives rise to the lumbricals within the palm.' },
        ],
        fact: 'FDP has <strong>dual innervation</strong> — the radial two tendons by the median nerve and the ulnar two by the ulnar nerve. This split means a single nerve lesion causes selective DIP weakness, helping localise nerve injuries precisely.',
    },

    {
        name: 'FPL', displayName: 'Flexor Pollicis Longus',
        group: 'Upper Limb', region: 'Forearm', type: 'Pennate',
        dot: { x: 20, y: 76, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Flexes the thumb at the IP joint. C8 nerve root. MMT: hold thumb stable, ask to flex the distal phalanx, add gentle resistance.' },
            { lbl: 'Origin', txt: 'Anterior surface of the radius and interosseous membrane.' },
            { lbl: 'Insertion', txt: 'Base of the distal phalanx of the thumb.' },
            { lbl: 'Innervation', txt: 'Anterior interosseous nerve (branch of median nerve, C8, T1).' },
            { lbl: 'Clinical', txt: 'The "OK sign test" — inability to form a circle with thumb and index due to FPL and FDP index weakness — is diagnostic of anterior interosseous nerve palsy.' },
        ],
        fact: 'FPL is the <strong>only long flexor of the thumb</strong>, and its palmar passage gives it remarkable mechanical advantage for pinch grip. The anterior interosseous nerve that supplies it is a commonly injured branch in forearm fractures and pronator teres syndrome.',
    },

    {
        name: 'FPB', displayName: 'Flexor Pollicis Brevis',
        group: 'Upper Limb', region: 'Hand', type: 'Flat',
        dot: { x: 18, y: 82, label: 'Hand' },
        clues: [
            { lbl: 'Function', txt: 'Flexes the thumb MCP joint. Forms part of the thenar eminence alongside abductor pollicis brevis and opponens pollicis.' },
            { lbl: 'Origin', txt: 'Flexor retinaculum and trapezium (superficial head); trapezoid and capitate (deep head).' },
            { lbl: 'Insertion', txt: 'Base of the proximal phalanx of the thumb.' },
            { lbl: 'Innervation', txt: 'Superficial head: median nerve (C8, T1). Deep head: ulnar nerve (C8, T1).' },
            { lbl: 'Clinical', txt: 'Thenar wasting is the hallmark of chronic carpal tunnel syndrome — detected by comparing thenar eminence bulk bilaterally during the wrist and hand observation.' },
        ],
        fact: 'FPB has <strong>dual innervation</strong> — superficial head by median, deep head by ulnar — making it a useful localising tool. Thenar wasting that spares FPB\'s deep head suggests median rather than complete thenar nerve involvement.',
    },

    {
        name: 'EPL', displayName: 'Extensor Pollicis Longus',
        group: 'Upper Limb', region: 'Forearm', type: 'Fusiform',
        dot: { x: 79, y: 72, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Extends the thumb IP joint and adducts the thumb. C8 nerve root. MMT: hold the thumb stable, ask to extend the distal phalanx against gentle resistance.' },
            { lbl: 'Origin', txt: 'Posterior ulna and interosseous membrane.' },
            { lbl: 'Insertion', txt: 'Base of the distal phalanx of the thumb.' },
            { lbl: 'Innervation', txt: 'Posterior interosseous nerve (C7, C8).' },
            { lbl: 'Clinical', txt: 'Forms the posterior border of the anatomical snuffbox (along with EPB anteriorly). Spontaneous EPL rupture can occur after minimally displaced distal radius fractures due to vascular compromise.' },
        ],
        fact: 'EPL makes a <strong>sharp turn at Lister\'s tubercle</strong> on the dorsal radius — this bony pulley acts as a fulcrum that redirects the tendon. It is this angle that predisposes EPL to attritional rupture after distal radius fractures.',
    },

    {
        name: 'EPB', displayName: 'Extensor Pollicis Brevis',
        group: 'Upper Limb', region: 'Forearm', type: 'Fusiform',
        dot: { x: 78, y: 74, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Extends the thumb MCP joint and abducts the thumb at the wrist. Implicated in De Quervain\'s syndrome along with abductor pollicis longus.' },
            { lbl: 'Origin', txt: 'Posterior surface of the radius and interosseous membrane.' },
            { lbl: 'Insertion', txt: 'Base of the proximal phalanx of the thumb.' },
            { lbl: 'Innervation', txt: 'Posterior interosseous nerve (C7, C8).' },
            { lbl: 'Clinical', txt: 'Finkelstein\'s test: fist with thumb inside, passive ulnar deviation. Positive = pain over EPB and APL tendons at the radial styloid. Pain with isometric resisted EPB is also diagnostic.' },
        ],
        fact: 'EPB and APL share the <strong>first dorsal compartment</strong> at the wrist — the site of De Quervain\'s tenosynovitis. This stenosing inflammation is extremely common in new mothers (from repetitive infant lifting) and in racket sport athletes.',
    },

    {
        name: 'APL', displayName: 'Abductor Pollicis Longus',
        group: 'Upper Limb', region: 'Forearm', type: 'Pennate',
        dot: { x: 77, y: 76, label: 'Forearm' },
        clues: [
            { lbl: 'Function', txt: 'Abducts and extends the thumb at the CMC joint. Forms the anterior border of the anatomical snuffbox together with EPB.' },
            { lbl: 'Origin', txt: 'Posterior ulna, radius, and interosseous membrane.' },
            { lbl: 'Insertion', txt: 'Base of the 1st metacarpal and trapezium.' },
            { lbl: 'Innervation', txt: 'Posterior interosseous nerve (C7, C8).' },
            { lbl: 'Clinical', txt: 'Together with EPB, implicated in De Quervain\'s tenosynovitis. Finkelstein\'s test provokes pain over both tendons at the radial styloid. Palpated in the first dorsal compartment.' },
        ],
        fact: 'APL often has <strong>multiple tendon slips</strong> — sometimes 2–4 — inserting into the trapezium, thenar muscles, or joint capsule. This anatomical variation complicates De Quervain\'s surgery, requiring careful release of all slips within the first dorsal compartment.',
    },

    {
        name: 'INTEROSSEI', displayName: 'Interossei',
        group: 'Upper Limb', region: 'Hand', type: 'Bipennate',
        dot: { x: 20, y: 86, label: 'Hand' },
        clues: [
            { lbl: 'Function', txt: 'Palmar interossei adduct fingers; dorsal interossei abduct fingers. T1 myotome. Also flex MCP and extend IPs via the extensor hood.' },
            { lbl: 'Origin', txt: 'Palmar: sides of metacarpals 1, 2, 4, 5. Dorsal: adjacent sides of all metacarpals (bipennate).' },
            { lbl: 'Insertion', txt: 'Base of proximal phalanx and lateral bands of the extensor hood.' },
            { lbl: 'Innervation', txt: 'Deep branch of the ulnar nerve (C8, T1) — all interossei.' },
            { lbl: 'MMT', txt: 'T1 test: patient holds fingers together, examiner attempts to pull pinky away. "Paper" hand position (fingers spread) tests radial nerve; "scissors" tests ulnar nerve (interossei).' },
        ],
        fact: 'The interossei enable the <strong>"intrinsic plus"</strong> position — MCP flexion with IP extension — used in precise pinch and span grips. Their ulnar innervation means that ulnar nerve lesions at the wrist cause "clawing" of the ring and little fingers.',
    },
    // ADD NEW MUSCLES BELOW THIS LINE
    // Copy any block above, fill in all fields, add a comma after the
    // closing brace. Schema: name, displayName, group, region, type,
    // dot {x, y, label}, clues[5] [{lbl, txt}], fact (HTML ok)

];