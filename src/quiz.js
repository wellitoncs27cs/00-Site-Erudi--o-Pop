// Banco de Perguntas (Pode adicionar quantas quiser aqui)
const questions = [
    {
        question: "Qual o resultado de 7 x 8?",
        options: ["54", "56", "48", "64"],
        correct: 1 // O índice da resposta certa (começa do 0. Então 0, 1, 2, 3)
    },
    {
        question: "Se você tem 30 maçãs e divide igualmente entre 5 pessoas, quantas cada uma recebe?",
        options: ["5", "6", "4", "7"],
        correct: 1
    },
    {
        question: "Quanto é 15% de 200?",
        options: ["20", "25", "30", "15"],
        correct: 2
    },
    {
        question: "Qual o valor de X na equação: 2x + 10 = 20?",
        options: ["5", "10", "2", "8"],
        correct: 0
    },
    {
        question: "Qual é o próximo número da sequência: 2, 4, 8, 16, ...?",
        options: ["24", "32", "20", "30"],
        correct: 1
    },
    {
        question: "Quanto é 100 dividido por 0,5?",
        options: ["50", "200", "20", "100"],
        correct: 1
    },
    {
        question: "A raiz quadrada de 144 é:",
        options: ["10", "11", "12", "14"],
        correct: 2
    },
    {
        question: "Em um triângulo, a soma dos ângulos internos é sempre:",
        options: ["90 graus", "180 graus", "360 graus", "100 graus"],
        correct: 1
    },
    {
        question: "Quanto é 2 elevado ao cubo (2³)?",
        options: ["6", "8", "4", "16"],
        correct: 1
    },
    {
        question: "Se um produto custa R$ 50,00 e tem 10% de desconto, qual o valor final?",
        options: ["R$ 40,00", "R$ 45,00", "R$ 48,00", "R$ 42,00"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let streak = 0;

// Elementos do DOM
const questionEl = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const countEl = document.getElementById('question-count');
const progressBar = document.getElementById('progress-bar');
const scoreDisplay = document.getElementById('score-display');
const streakDisplay = document.getElementById('streak-display');
const feedbackOverlay = document.getElementById('feedback-overlay');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');

function loadQuestion() {
    const q = questions[currentQuestionIndex];
    
    // Atualiza textos
    questionEl.textContent = q.question;
    countEl.textContent = `Questão ${currentQuestionIndex + 1} de ${questions.length}`;
    
    // Atualiza barra de progresso
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Limpa opções antigas
    optionsGrid.innerHTML = '';

    // Cria botões
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = "bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-xl font-bold text-lg transition hover:scale-105 border border-slate-600";
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(index);
        optionsGrid.appendChild(btn);
    });
}

function checkAnswer(selectedIndex) {
    const q = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === q.correct;
    
    // Configura o Feedback
    const icon = document.getElementById('feedback-icon');
    const text = document.getElementById('feedback-text');
    
    if (isCorrect) {
        score++;
        streak++;
        icon.className = "fas fa-check-circle text-6xl mb-4 text-green-500";
        text.textContent = "Resposta Correta!";
        text.className = "text-2xl font-bold text-green-400 mb-2";
    } else {
        streak = 0; // Zera o combo se errar
        icon.className = "fas fa-times-circle text-6xl mb-4 text-red-500";
        text.textContent = "Resposta Errada!";
        text.className = "text-2xl font-bold text-red-400 mb-2";
    }

    // Atualiza placar
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak + "x";

    // Mostra Overlay
    feedbackOverlay.classList.remove('hidden');
    feedbackOverlay.classList.add('flex');
}

function nextQuestion() {
    // Esconde Overlay
    feedbackOverlay.classList.add('hidden');
    feedbackOverlay.classList.remove('flex');

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    const finalScoreEl = document.getElementById('final-score');
    finalScoreEl.textContent = score;
    
    // Salva XP no LocalStorage (conecta com a página inicial)
    // Se quiser dar XP por acerto, aqui é o lugar
    const saved = localStorage.getItem('erudicao_pop_save_v1');
    if(saved) {
        let player = JSON.parse(saved);
        player.xp += (score * 20); // 20 XP por acerto
        localStorage.setItem('erudicao_pop_save_v1', JSON.stringify(player));
    }
}

// Inicia o Quiz
loadQuestion();