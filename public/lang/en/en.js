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

/** UI Strings */
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

// ── MUSCLE DATABASE ───────────────────────────────────────────────────
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

    {
        name: 'BICEPS', displayName: 'Biceps Brachii',
        group: 'Upper Limb', region: 'Upper Arm', type: 'Biarticular',
        dot: { x: 22, y: 52, label: 'Upper Arm' },
        clues: [
            { lbl: 'Function', txt: 'Flexes the elbow joint and supinates the forearm — rotating the palm from facing down to facing up.' },
            { lbl: 'Origin', txt: 'Coracoid process (short head) and supraglenoid tubercle of the scapula (long head).' },
            { lbl: 'Insertion', txt: 'Radial tuberosity and bicipital aponeurosis into the deep fascia of the forearm.' },
            { lbl: 'Innervation', txt: 'Musculocutaneous nerve (C5, C6) — a branch of the lateral cord of the brachial plexus.' },
            { lbl: 'Clinical', txt: 'Proximal long head tendon rupture causes a characteristic "Popeye" bulge in the mid-arm.' },
        ],
        fact: 'The biceps has <strong>two heads</strong>, yet both converge on a single distal tendon. Its supination action is actually stronger than its flexion force at the elbow.',
    },

    {
        name: 'DELTOID', displayName: 'Deltoid',
        group: 'Shoulder', region: 'Shoulder', type: 'Multipennate',
        dot: { x: 21, y: 40, label: 'Shoulder' },
        clues: [
            { lbl: 'Function', txt: 'Abducts the arm. Anterior fibres flex and medially rotate; posterior fibres extend and laterally rotate.' },
            { lbl: 'Origin', txt: 'Lateral third of clavicle, acromion, and spine of the scapula.' },
            { lbl: 'Insertion', txt: 'Deltoid tuberosity on the lateral mid-shaft of the humerus.' },
            { lbl: 'Innervation', txt: 'Axillary nerve (C5, C6), which wraps around the surgical neck of the humerus.' },
            { lbl: 'Shape', txt: 'Triangular — named for the Greek letter delta (Δ). Intramuscular injections are commonly given here.' },
        ],
        fact: 'The <strong>middle deltoid</strong> is the primary arm abductor. The anterior and posterior heads are almost opposing, granting 360° rotational control of the shoulder.',
    },

    {
        name: 'TRAPEZIUS', displayName: 'Trapezius',
        group: 'Back', region: 'Upper Back', type: 'Flat',
        dot: { x: 50, y: 37, label: 'Upper Back' },
        clues: [
            { lbl: 'Function', txt: 'Upper fibres elevate, middle fibres retract, lower fibres depress the scapula. All three rotate the glenoid upward.' },
            { lbl: 'Origin', txt: 'External occipital protuberance, ligamentum nuchae, and spinous processes of C7–T12.' },
            { lbl: 'Insertion', txt: 'Lateral clavicle, acromion, and spine of the scapula.' },
            { lbl: 'Innervation', txt: 'Motor: Spinal accessory nerve (CN XI). Proprioception: Cervical plexus (C3–C4).' },
            { lbl: 'Clinical', txt: 'CN XI palsy causes drooping of the shoulder, inability to shrug, and difficulty raising the arm above horizontal.' },
        ],
        fact: 'One of the <strong>largest back muscles</strong>, spanning from the skull to T12. Its trapezoid shape gives the upper back its characteristic contour.',
    },

    {
        name: 'GLUTEUS', displayName: 'Gluteus Maximus',
        group: 'Lower Limb', region: 'Gluteal', type: 'Pennate',
        dot: { x: 50, y: 105, label: 'Gluteal' },
        clues: [
            { lbl: 'Function', txt: 'Powerful hip extensor and lateral rotator. Stabilises the knee via the iliotibial band during loaded activity.' },
            { lbl: 'Origin', txt: 'Posterior gluteal line of the ilium, dorsal sacrum, coccyx, and sacrotuberous ligament.' },
            { lbl: 'Insertion', txt: 'Gluteal tuberosity of femur (deep fibres) and iliotibial tract (superficial fibres).' },
            { lbl: 'Innervation', txt: 'Inferior gluteal nerve (L5, S1, S2).' },
            { lbl: 'Function Note', txt: 'Barely active during level walking — activates intensely during running, climbing stairs, or rising from sitting.' },
        ],
        fact: 'The <strong>largest muscle in the body by volume</strong>. Despite its size, it is largely inactive during flat walking — it saves its power for high-demand tasks.',
    },

    {
        name: 'SOLEUS', displayName: 'Soleus',
        group: 'Lower Limb', region: 'Posterior Leg', type: 'Unipennate',
        dot: { x: 58, y: 152, label: 'Posterior Leg' },
        clues: [
            { lbl: 'Function', txt: 'Plantarflexes the foot. Critical for maintaining upright posture and propulsion during the push-off phase of gait.' },
            { lbl: 'Origin', txt: 'Head and posterior shaft of the fibula, and the soleal line and medial border of the tibia.' },
            { lbl: 'Insertion', txt: 'Posterior calcaneus via the Achilles (calcaneal) tendon, shared with the gastrocnemius.' },
            { lbl: 'Innervation', txt: 'Tibial nerve (S1, S2).' },
            { lbl: 'Special', txt: 'Known as the "second heart" — its powerful pumping contractions return venous blood from the lower limb.' },
        ],
        fact: 'Contains up to <strong>80% slow-twitch fibres</strong> — among the highest in the body — making it exceptionally resistant to fatigue during prolonged standing and walking.',
    },

    {
        name: 'PECTORALIS', displayName: 'Pectoralis Major',
        group: 'Trunk', region: 'Anterior Chest', type: 'Fan-shaped',
        dot: { x: 42, y: 48, label: 'Chest' },
        clues: [
            { lbl: 'Function', txt: 'Adducts and medially rotates the humerus. Clavicular head flexes; sternocostal head extends the arm.' },
            { lbl: 'Origin', txt: 'Medial clavicle (clavicular head) and sternum + costal cartilages of ribs 1–6 (sternocostal head).' },
            { lbl: 'Insertion', txt: 'Greater tubercle crest of the humerus. The tendon twists 90° before inserting.' },
            { lbl: 'Innervation', txt: 'Medial pectoral nerve (sternocostal head) and lateral pectoral nerve (clavicular head). C5–T1.' },
            { lbl: 'Clinical', txt: 'Tendon rupture at its insertion is the most common heavy bench press injury, creating obvious asymmetry.' },
        ],
        fact: 'The distal tendon <strong>rotates 180°</strong> as it inserts — so the clavicular fibres end up inferiorly and the sternal fibres superiorly. A remarkable anatomical twist.',
    },

    {
        name: 'HAMSTRING', displayName: 'Hamstrings Group',
        group: 'Lower Limb', region: 'Posterior Thigh', type: 'Biarticular',
        dot: { x: 50, y: 120, label: 'Posterior Thigh' },
        clues: [
            { lbl: 'Function', txt: 'Flex the knee and extend the hip. The short head of biceps femoris is the only single-joint member.' },
            { lbl: 'Origin', txt: 'Ischial tuberosity (all except short head of biceps femoris, which originates on the femur).' },
            { lbl: 'Muscles', txt: 'Three muscles: biceps femoris (long + short head), semitendinosus, and semimembranosus.' },
            { lbl: 'Innervation', txt: 'Sciatic nerve — tibial division for medial hamstrings; common fibular division for biceps femoris short head.' },
            { lbl: 'Injury', txt: 'Most commonly strained at the proximal musculotendinous junction during sprinting — especially the long head of biceps femoris.' },
        ],
        fact: 'The name originates from Old English — pig carcasses were historically <strong>hung by these tendons</strong> from the "ham" (the back of the thigh).',
    },

    {
        name: 'LATISSIMUS', displayName: 'Latissimus Dorsi',
        group: 'Back', region: 'Mid/Lower Back', type: 'Flat',
        dot: { x: 50, y: 62, label: 'Mid Back' },
        clues: [
            { lbl: 'Function', txt: 'Adducts, extends, and medially rotates the arm. The prime mover in pull-ups and rowing motions.' },
            { lbl: 'Origin', txt: 'Spinous processes T7–T12, thoracolumbar fascia, iliac crest, ribs 9–12, and inferior scapular angle.' },
            { lbl: 'Insertion', txt: 'Floor of the intertubercular groove of the humerus, lateral to the teres major.' },
            { lbl: 'Innervation', txt: 'Thoracodorsal nerve (C6, C7, C8) from the posterior cord of the brachial plexus.' },
            { lbl: 'Name', txt: 'Latin: "broadest muscle of the back." The widest muscle in the human body, forming the posterior axillary fold.' },
        ],
        fact: 'A common <strong>reconstructive surgery donor</strong> — the lat can be rotated to cover large anterior chest wall defects after mastectomy without significant functional loss.',
    },

    {
        name: 'SARTORIUS', displayName: 'Sartorius',
        group: 'Lower Limb', region: 'Anterior Thigh', type: 'Strap',
        dot: { x: 43, y: 115, label: 'Anterior Thigh' },
        clues: [
            { lbl: 'Function', txt: 'Flexes, abducts, and laterally rotates the hip; flexes and medially rotates the knee. Produces the cross-legged position.' },
            { lbl: 'Origin', txt: 'Anterior superior iliac spine (ASIS).' },
            { lbl: 'Insertion', txt: 'Upper medial tibia via the pes anserinus, alongside gracilis and semitendinosus.' },
            { lbl: 'Innervation', txt: 'Femoral nerve (L2, L3).' },
            { lbl: 'Record', txt: 'The longest muscle in the human body, running diagonally across the entire anterior thigh.' },
        ],
        fact: 'Named from the Latin for <strong>tailor (sartor)</strong> — it produces the cross-legged tailor\'s sitting position. It\'s the only muscle that can act across both the hip and knee simultaneously in all planes.',
    },

    {
        name: 'GASTROCNEMIUS', displayName: 'Gastrocnemius',
        group: 'Lower Limb', region: 'Posterior Leg', type: 'Biarticular',
        dot: { x: 42, y: 148, label: 'Posterior Leg' },
        clues: [
            { lbl: 'Function', txt: 'Plantarflexes the foot and weakly flexes the knee. Most powerful when the knee is extended.' },
            { lbl: 'Origin', txt: 'Medial and lateral femoral condyles, just superior to the joint line.' },
            { lbl: 'Insertion', txt: 'Posterior calcaneus via the calcaneal (Achilles) tendon, shared with soleus.' },
            { lbl: 'Innervation', txt: 'Tibial nerve (S1, S2).' },
            { lbl: 'Special', txt: 'Becomes slack at 90° knee flexion — clinicians test soleus in isolation by bending the knee during calf assessment.' },
        ],
        fact: 'Together with soleus (the <strong>triceps surae</strong>), generates forces up to 8× body weight during running — one of the highest biomechanical loads in the body.',
    },

    {
        name: 'ILIOPSOAS', displayName: 'Iliopsoas',
        group: 'Core / Hip', region: 'Hip Flexor', type: 'Fusiform',
        dot: { x: 46, y: 95, label: 'Hip Flexor' },
        clues: [
            { lbl: 'Function', txt: 'The primary hip flexor. Essential for initiating the swing phase of walking, stair climbing, and running.' },
            { lbl: 'Components', txt: 'Iliacus + psoas major fuse distal to the inguinal ligament before inserting together.' },
            { lbl: 'Origin', txt: 'Iliac fossa (iliacus); vertebral bodies T12–L5 and intervertebral discs (psoas major).' },
            { lbl: 'Insertion', txt: 'Lesser trochanter of the femur.' },
            { lbl: 'Innervation', txt: 'Femoral nerve L2–L3 (iliacus); direct lumbar plexus branches L1–L3 (psoas major).' },
        ],
        fact: 'Psoas major is the only muscle that <strong>directly connects the spine to the leg</strong>. Chronic tightening is a major contributor to anterior pelvic tilt and lower back pain.',
    },

    {
        name: 'QUADRICEPS', displayName: 'Quadriceps Femoris',
        group: 'Lower Limb', region: 'Anterior Thigh', type: 'Multi-head',
        dot: { x: 57, y: 115, label: 'Anterior Thigh' },
        clues: [
            { lbl: 'Function', txt: 'Extends the knee. Rectus femoris also flexes the hip (it crosses both joints).' },
            { lbl: 'Components', txt: 'Four muscles: rectus femoris, vastus medialis, vastus lateralis, and vastus intermedius.' },
            { lbl: 'Insertion', txt: 'All converge into the quadriceps tendon → over the patella → patellar tendon → tibial tuberosity.' },
            { lbl: 'Innervation', txt: 'Femoral nerve (L2, L3, L4) — all four heads.' },
            { lbl: 'Clinical', txt: 'VMO (vastus medialis oblique) weakness leads to lateral patellar maltracking and anterior knee pain syndrome.' },
        ],
        fact: 'The most powerful muscle group in the body. During landing from a jump they absorb energy eccentrically at forces <strong>up to 4× body weight</strong> — and must do it in milliseconds.',
    },

    {
        name: 'RHOMBOID', displayName: 'Rhomboid Major',
        group: 'Back', region: 'Mid Back', type: 'Flat',
        dot: { x: 50, y: 52, label: 'Mid Back' },
        clues: [
            { lbl: 'Function', txt: 'Retracts (adducts) and elevates the scapula; rotates the glenoid inferiorly.' },
            { lbl: 'Origin', txt: 'Spinous processes of T2–T5 vertebrae.' },
            { lbl: 'Insertion', txt: 'Medial border of the scapula between its spine and inferior angle.' },
            { lbl: 'Innervation', txt: 'Dorsal scapular nerve (C4, C5) — the same nerve supplies rhomboid minor and levator scapulae.' },
            { lbl: 'Clinical', txt: 'Weakness causes medial scapular winging and is strongly associated with sustained forward-head, rounded-shoulder posture.' },
        ],
        fact: 'Rhomboids and the serratus anterior act as <strong>opposing force couples</strong> to control scapular rotation. Imbalance between them is a root cause of many shoulder impingement presentations.',
    },

    {
        name: 'SUPRASPINATUS', displayName: 'Supraspinatus',
        group: 'Shoulder', region: 'Rotator Cuff', type: 'Pennate',
        dot: { x: 28, y: 36, label: 'Rotator Cuff' },
        clues: [
            { lbl: 'Function', txt: 'Initiates shoulder abduction (first 15°); the deltoid then takes over. Compresses and stabilises the humeral head.' },
            { lbl: 'Origin', txt: 'Supraspinous fossa of the scapula (above the spine).' },
            { lbl: 'Insertion', txt: 'Superior facet of the greater tubercle of the humerus.' },
            { lbl: 'Innervation', txt: 'Suprascapular nerve (C5, C6).' },
            { lbl: 'Clinical', txt: 'Most commonly torn rotator cuff muscle — especially at the avascular "critical zone" near insertion. Often diagnosed by the empty can / full can tests.' },
        ],
        fact: 'Tears are so prevalent that <strong>over 50% of adults over 60</strong> have a partial or full-thickness supraspinatus tear — many are completely asymptomatic throughout their lives.',
    },

    {
        name: 'TIBIALIS', displayName: 'Tibialis Anterior',
        group: 'Lower Limb', region: 'Anterior Leg', type: 'Pennate',
        dot: { x: 43, y: 148, label: 'Anterior Leg' },
        clues: [
            { lbl: 'Function', txt: 'Dorsiflexes and inverts the foot. Prevents foot drop during swing phase of walking.' },
            { lbl: 'Origin', txt: 'Lateral tibia (proximal two-thirds) and the interosseous membrane.' },
            { lbl: 'Insertion', txt: 'Medial cuneiform and base of the first metatarsal.' },
            { lbl: 'Innervation', txt: 'Deep fibular (peroneal) nerve (L4, L5).' },
            { lbl: 'Clinical', txt: 'Weakness or paralysis causes foot drop — the toe drags during the swing phase. May be caused by L4 radiculopathy or common fibular nerve compression.' },
        ],
        fact: 'The tibialis anterior tendon is <strong>easily palpable and visible</strong> as a taut cord on the anterior ankle during dorsiflexion — a reliable palpation landmark in clinical assessment.',
    },

    {
        name: 'SERRATUS', displayName: 'Serratus Anterior',
        group: 'Trunk', region: 'Lateral Thorax', type: 'Serrated',
        dot: { x: 38, y: 58, label: 'Lateral Thorax' },
        clues: [
            { lbl: 'Function', txt: 'Protracts and upwardly rotates the scapula; holds its medial border flat against the thorax.' },
            { lbl: 'Origin', txt: 'Outer surfaces and superior borders of ribs 1–9.' },
            { lbl: 'Insertion', txt: 'Costal (deep) surface of the entire medial border of the scapula.' },
            { lbl: 'Innervation', txt: 'Long thoracic nerve (C5, C6, C7) — one of the most commonly injured peripheral nerves.' },
            { lbl: 'Clinical', txt: '"Winging" of the scapula — medial border lifts off the thorax when pushing against a wall — is the classic sign of long thoracic nerve palsy.' },
        ],
        fact: 'The long thoracic nerve runs <strong>unprotected for ~25 cm</strong> along the lateral chest wall, making it highly vulnerable to traction injuries in overhead sport and thoracic surgery.',
    },

    {
        name: 'DIAPHRAGM', displayName: 'Diaphragm',
        group: 'Trunk', region: 'Thoracic Floor', type: 'Dome-shaped',
        dot: { x: 50, y: 68, label: 'Thoracic Floor' },
        clues: [
            { lbl: 'Function', txt: 'Primary muscle of inspiration — contraction flattens the dome, increases thoracic volume, and draws air into the lungs.' },
            { lbl: 'Origin', txt: 'Xiphoid process, costal cartilages of ribs 7–12, and lumbar vertebrae (crura).' },
            { lbl: 'Insertion', txt: 'Central tendon of the diaphragm.' },
            { lbl: 'Innervation', txt: 'Phrenic nerve (C3, C4, C5) — "C3, 4, 5 keeps the diaphragm alive."' },
            { lbl: 'Special', txt: 'Has three major openings: the aortic hiatus (T12), oesophageal hiatus (T10), and caval opening (T8).' },
        ],
        fact: 'The phrenic nerve\'s origin at C3–5 explains why <strong>high cervical spinal injuries are life-threatening</strong> — damage above C3 paralyses the diaphragm and requires permanent ventilatory support.',
    },

    {
        name: 'INFRASPINATUS', displayName: 'Infraspinatus',
        group: 'Shoulder', region: 'Rotator Cuff', type: 'Multipennate',
        dot: { x: 72, y: 48, label: 'Rotator Cuff' },
        clues: [
            { lbl: 'Function', txt: 'Laterally rotates the humerus. Contributes to posterior stabilisation of the glenohumeral joint.' },
            { lbl: 'Origin', txt: 'Infraspinous fossa of the scapula (the large triangular area below the scapular spine).' },
            { lbl: 'Insertion', txt: 'Middle facet of the greater tubercle of the humerus.' },
            { lbl: 'Innervation', txt: 'Suprascapular nerve (C5, C6).' },
            { lbl: 'Clinical', txt: '"External rotation lag sign" — inability to hold the arm in passive external rotation suggests an infraspinatus tear.' },
        ],
        fact: 'With teres minor, infraspinatus is one of only <strong>two external rotators</strong> at the glenohumeral joint. Critical for the deceleration phase in throwing and racket sports.',
    },

    {
        name: 'BRACHIALIS', displayName: 'Brachialis',
        group: 'Upper Limb', region: 'Upper Arm', type: 'Fusiform',
        dot: { x: 78, y: 54, label: 'Upper Arm' },
        clues: [
            { lbl: 'Function', txt: 'Pure elbow flexor. The only muscle whose sole job is to flex the elbow regardless of forearm position.' },
            { lbl: 'Origin', txt: 'Distal half of the anterior surface of the humerus.' },
            { lbl: 'Insertion', txt: 'Coronoid process and ulnar tuberosity — it inserts into the ulna, not the radius.' },
            { lbl: 'Innervation', txt: 'Musculocutaneous nerve (C5, C6); a small lateral strip may also be supplied by the radial nerve.' },
            { lbl: 'Strength', txt: 'Greater cross-sectional area than the biceps despite a lower profile. The "workhorse" of elbow flexion.' },
        ],
        fact: 'Unlike the biceps, brachialis inserts into the <strong>ulna</strong> and therefore cannot supinate. Its strength is identical whether the palm faces up or down — making it the true primary elbow flexor.',
    },

    {
        name: 'ADDUCTOR', displayName: 'Adductor Magnus',
        group: 'Lower Limb', region: 'Medial Thigh', type: 'Triangular',
        dot: { x: 47, y: 118, label: 'Medial Thigh' },
        clues: [
            { lbl: 'Function', txt: 'Adducts the thigh. Hamstring portion extends the hip; adductor portion assists flexion.' },
            { lbl: 'Origin', txt: 'Inferior pubic ramus, ischial ramus, and ischial tuberosity.' },
            { lbl: 'Insertion', txt: 'Linea aspera, medial supracondylar ridge, and the adductor tubercle of the femur (via tendinous part).' },
            { lbl: 'Innervation', txt: 'Dual innervation: obturator nerve (adductor part) and tibial branch of sciatic nerve (hamstring part).' },
            { lbl: 'Special', txt: 'Contains the adductor hiatus — the gap through which the femoral artery passes to become the popliteal artery.' },
        ],
        fact: 'The adductor hiatus is a <strong>key surgical vascular landmark</strong>. The femoral artery\'s transition to popliteal artery occurs precisely through the gap in this muscle\'s tendinous insertion.',
    },

    {
        name: 'SUBSCAPULARIS', displayName: 'Subscapularis',
        group: 'Shoulder', region: 'Rotator Cuff', type: 'Multipennate',
        dot: { x: 30, y: 46, label: 'Rotator Cuff' },
        clues: [
            { lbl: 'Function', txt: 'Medially rotates and adducts the humerus. The only rotator cuff muscle that medially rotates.' },
            { lbl: 'Origin', txt: 'Subscapular fossa — the large concave anterior (costal) surface of the scapula.' },
            { lbl: 'Insertion', txt: 'Lesser tubercle of the humerus and medial lip of the intertubercular groove.' },
            { lbl: 'Innervation', txt: 'Upper and lower subscapular nerves (C5, C6, C7) from the posterior cord of the brachial plexus.' },
            { lbl: 'Clinical', txt: 'Tested by the "lift-off test" and "belly-press test." Tears cause excessive external rotation and anterior instability.' },
        ],
        fact: 'The <strong>largest and strongest</strong> of the four rotator cuff muscles, yet the least discussed clinically. It alone counterbalances the powerful external rotators to maintain joint centration.',
    },

    // ── ADD NEW MUSCLES BELOW THIS LINE ──────────────────────────────────
    // Copy the block above, fill in all fields, and add a comma after the
    // closing brace of the previous entry.
    // ─────────────────────────────────────────────────────────────────────

];