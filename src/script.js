const SAVE_KEY = 'erudicao_pop_save_v1';
    
function loadProgress() {
    const saved = localStorage.getItem(SAVE_KEY);
    return saved ? JSON.parse(saved) : { xp: 120, level: 1, nextLevelXp: 500, unlocked: [] };
}
function saveProgress() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
}

let player = loadProgress();
let currentChallenge = null;

const mathProblems = [
    { q: "2x = 10", a: 5, options: [3, 4, 5, 6] },
    { q: "x + 7 = 15", a: 8, options: [6, 7, 8, 9] },
    { q: "3x - 1 = 8", a: 3, options: [2, 3, 4, 5] },
    { q: "5x = 25", a: 5, options: [4, 5, 6, 10] },
    { q: "Raiz de 81", a: 9, options: [7, 8, 9, 10] }
];

function navigateTo(pageId) {
    document.querySelectorAll('.page-section').forEach(el => el.classList.add('hidden'));
    const page = document.getElementById('page-' + pageId);
    if(page) page.classList.remove('hidden');
    document.getElementById('mobile-menu').classList.add('hidden');
    window.scrollTo(0,0);
}

const menuBtn = document.getElementById('mobile-menu-btn');
if(menuBtn) menuBtn.addEventListener('click', () => document.getElementById('mobile-menu').classList.toggle('hidden'));

function addXP(amount) {
    player.xp += amount;
    if (player.xp >= player.nextLevelXp) {
        player.level++;
        player.xp -= player.nextLevelXp;
        player.nextLevelXp = Math.floor(player.nextLevelXp * 1.5);
        alert("🎉 LEVEL UP! Nível " + player.level + "!");
    }
    saveProgress();
    updateUI();
    showFloatingXP(amount);
}

function updateUI() {
    const pct = (player.xp / player.nextLevelXp) * 100;
    
    const lvlEl = document.getElementById('player-lvl');
    const barEl = document.getElementById('player-xp-bar');
    if(lvlEl) lvlEl.innerText = player.level;
    if(barEl) barEl.style.width = pct + '%';

    const mobLvl = document.getElementById('mobile-lvl');
    const mobBar = document.getElementById('mobile-xp-bar-mob');
    if(mobLvl) mobLvl.innerText = player.level;
    if(mobBar) mobBar.style.width = pct + '%';
    
    player.unlocked.forEach(itemId => {
        const overlay = document.getElementById('overlay-' + itemId);
        const lockedItem = document.getElementById('locked-' + itemId);
        if (overlay) overlay.style.display = 'none';
        if (lockedItem) {
            lockedItem.querySelectorAll('.blur-sm').forEach(el => el.classList.remove('blur-sm'));
        }
    });
}

function showFloatingXP(amount) {
    const el = document.createElement('div');
    el.className = 'xp-float fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    el.innerText = '+' + amount + ' XP';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function checkUnlock(itemId) {
    if (player.unlocked.includes(itemId)) return;
    currentChallenge = itemId;
    openMathModal();
}

function triggerMathChallenge(type) {
    currentChallenge = type;
    openMathModal();
}

function openMathModal() {
    const modal = document.getElementById('challenge-modal');
    const feedback = document.getElementById('modal-feedback');
    if(!modal) return;

    modal.classList.remove('hidden');
    if(feedback) feedback.classList.add('hidden');
    
    const prob = mathProblems[Math.floor(Math.random() * mathProblems.length)];
    document.getElementById('math-problem').innerText = `Se ${prob.q}, quanto vale x?`;
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    prob.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold border border-slate-600 transition";
        btn.innerText = opt;
        btn.onclick = () => verifyAnswer(opt, prob.a, btn);
        container.appendChild(btn);
    });
}

function verifyAnswer(sel, cor, btn) {
    const fb = document.getElementById('modal-feedback');
    if (sel === cor) {
        btn.classList.remove('bg-slate-700');
        btn.classList.add('bg-green-600');
        if(fb) {
            fb.innerHTML = '<span class="text-green-400">Correto!</span>';
            fb.classList.remove('hidden');
        }
        setTimeout(() => {
            closeModal();
            successAction();
        }, 800);
    } else {
        btn.classList.remove('bg-slate-700');
        btn.classList.add('bg-red-600');
        if(fb) {
            fb.innerHTML = '<span class="text-red-400">Errado!</span>';
            fb.classList.remove('hidden');
        }
    }
}

function successAction() {
    if (currentChallenge === 'daily') {
        addXP(100);
    } else if (currentChallenge && currentChallenge.startsWith('item')) {
        addXP(50);
        player.unlocked.push(currentChallenge);
        saveProgress();
    } else {
        addXP(50);
    }
    updateUI();
}

function closeModal() {
    document.getElementById('challenge-modal').classList.add('hidden');
}

updateUI();