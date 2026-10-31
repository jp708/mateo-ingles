"use strict";

/* ============================================================
   BANCO DE PREGUNTAS
   - type "choice": opción múltiple (audioText = lo que se escucha)
   - type "write":  el alumno escribe la respuesta (answer = texto esperado)
   ============================================================ */
const questions = [
    // PARTE 1: Números 10-100
    {
        type: "choice", category: "Numbers 10-100",
        audioText: "Fourteen", prompt: "¿Qué número escuchaste?",
        options: [
            { text: "14", isCorrect: true },
            { text: "40", isCorrect: false },
            { text: "44", isCorrect: false },
            { text: "10", isCorrect: false }
        ]
    },
    {
        type: "choice", category: "Numbers 10-100",
        audioText: "Seventy", prompt: "¿Qué número escuchaste?",
        options: [
            { text: "17", isCorrect: false },
            { text: "70", isCorrect: true },
            { text: "77", isCorrect: false },
            { text: "71", isCorrect: false }
        ]
    },
    {
        type: "choice", category: "Numbers 10-100",
        audioText: "Ninety-nine", prompt: "¿Qué número escuchaste?",
        options: [
            { text: "99", isCorrect: true },
            { text: "19", isCorrect: false },
            { text: "90", isCorrect: false },
            { text: "39", isCorrect: false }
        ]
    },

    // PARTE 2: La hora
    {
        type: "choice", category: "Telling the Time",
        audioText: "It is seven o'clock.", prompt: "Escucha la hora exacta (o'clock):",
        options: [
            { text: "7:00", clock: { h: 7, m: 0 }, isCorrect: true },
            { text: "7:30", clock: { h: 7, m: 30 }, isCorrect: false },
            { text: "7:15", clock: { h: 7, m: 15 }, isCorrect: false },
            { text: "6:00", clock: { h: 6, m: 0 }, isCorrect: false }
        ]
    },
    {
        type: "choice", category: "Telling the Time",
        audioText: "It is half past six.", prompt: "Escucha la hora (half past):",
        options: [
            { text: "6:30", clock: { h: 6, m: 30 }, isCorrect: true },
            { text: "6:15", clock: { h: 6, m: 15 }, isCorrect: false },
            { text: "6:45", clock: { h: 6, m: 45 }, isCorrect: false },
            { text: "6:00", clock: { h: 6, m: 0 }, isCorrect: false }
        ]
    },
    {
        type: "choice", category: "Telling the Time",
        audioText: "It is quarter past four.", prompt: "Escucha la hora (quarter past):",
        options: [
            { text: "4:15", clock: { h: 4, m: 15 }, isCorrect: true },
            { text: "4:45", clock: { h: 4, m: 45 }, isCorrect: false },
            { text: "3:45", clock: { h: 3, m: 45 }, isCorrect: false },
            { text: "4:30", clock: { h: 4, m: 30 }, isCorrect: false }
        ]
    },
    {
        type: "choice", category: "Telling the Time",
        audioText: "It is quarter to nine.", prompt: "Escucha la hora (quarter to):",
        options: [
            { text: "8:45", clock: { h: 8, m: 45 }, isCorrect: true },
            { text: "9:15", clock: { h: 9, m: 15 }, isCorrect: false },
            { text: "9:45", clock: { h: 9, m: 45 }, isCorrect: false },
            { text: "8:15", clock: { h: 8, m: 15 }, isCorrect: false }
        ]
    },

    // PARTE 3: Escribir la estructura completa
    {
        type: "write", category: "Estructura: Does... like?",
        audioText: "Does Tom like pizza? Yes, he does!",
        prompt: "Escucha y ESCRIBE la respuesta afirmativa completa para Tom:",
        structureGuide: "💡 Estructura esperada: <strong>Yes, he does.</strong>",
        answer: "yes, he does"
    },
    {
        type: "write", category: "Estructura: Does... like?",
        audioText: "Does Anna like cats? No, she doesn't.",
        prompt: "Escucha y ESCRIBE la respuesta negativa completa para Anna:",
        structureGuide: "💡 Estructura esperada: <strong>No, she doesn't.</strong>",
        answer: "no, she doesn't"
    },
    {
        type: "write", category: "Estructura: Does... like?",
        audioText: "Does your teacher like apples? Yes, she does!",
        prompt: "Escucha y ESCRIBE la respuesta completa para la profesora:",
        structureGuide: "💡 Estructura esperada: <strong>Yes, she does.</strong>",
        answer: "yes, she does"
    },
    {
        type: "write", category: "Estructura: Does... like?",
        audioText: "Does your brother like swimming? No, he doesn't.",
        prompt: "Escucha y ESCRIBE la respuesta negativa completa para tu hermano:",
        structureGuide: "💡 Estructura esperada: <strong>No, he doesn't.</strong>",
        answer: "no, he doesn't"
    }
];

/* ============================================================
   ESTADO
   ============================================================ */
let currentIndex = 0;
let buenas = 0;
let malas = 0;
let isAnswerLocked = false;
let audioCtx = null; // se crea al primer clic (los navegadores lo exigen)

/* ============================================================
   UTILIDADES
   ============================================================ */
const $ = (id) => document.getElementById(id);

// "No, she DOESNT." -> "no she doesn't"  (ignora mayúsculas, comas, puntos y apóstrofes raros)
function normalize(text) {
    return text
        .toLowerCase()
        .replace(/[’‘`´]/g, "'")
        .replace(/doesnt/g, "doesn't")
        .replace(/[.,!?]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function playSound(type) {
    try {
        if (!audioCtx) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return;
            audioCtx = new Ctx();
        }
        if (audioCtx.state === "suspended") audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const t = audioCtx.currentTime;
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === "success") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(523.25, t);
            osc.frequency.exponentialRampToValueAtTime(880, t + 0.3);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
            osc.start();
            osc.stop(t + 0.3);
        } else {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(180, t);
            osc.frequency.exponentialRampToValueAtTime(110, t + 0.35);
            gain.gain.setValueAtTime(0.35, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
            osc.start();
            osc.stop(t + 0.35);
        }
    } catch (e) {
        /* Si el audio falla, el juego sigue funcionando */
    }
}

function playAudio() {
    if (!("speechSynthesis" in window)) {
        $("feedback").textContent = "Tu navegador no soporta audio de voz. Prueba con Chrome o Edge.";
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(questions[currentIndex].audioText);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
}

function launchConfetti(count, spread) {
    if (typeof window.confetti === "function") {
        window.confetti({ particleCount: count, spread: spread, origin: { y: 0.7 } });
    }
}

/* ============================================================
   FLUJO DEL JUEGO
   ============================================================ */
function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $(id).classList.add("active");
}

function startGame() {
    currentIndex = 0;
    buenas = 0;
    malas = 0;
    isAnswerLocked = false;
    $("game-stats").hidden = false;
    showScreen("question-screen");
    updateStats();
    loadQuestion();
}

function updateStats() {
    $("buenas-val").textContent = buenas;
    $("malas-val").textContent = malas;
    $("progress-bar").style.width = (currentIndex / questions.length) * 100 + "%";
}

function loadQuestion() {
    isAnswerLocked = false;
    const q = questions[currentIndex];

    $("category-tag").textContent = q.category;
    $("prompt-text").textContent = q.prompt;
    $("feedback").textContent = "";
    $("feedback").className = "feedback-message";

    const optionsContainer = $("options-container");
    const textBox = $("text-input-container");

    if (q.type === "choice") {
        textBox.hidden = true;
        optionsContainer.hidden = false;
        optionsContainer.innerHTML = "";

        q.options.forEach((opt) => {
            const card = document.createElement("div");
            card.className = "option-card";
            if (opt.clock) card.appendChild(createSVGClock(opt.clock.h, opt.clock.m));

            const label = document.createElement("span");
            label.textContent = opt.text;
            card.appendChild(label);

            card.addEventListener("click", () => checkChoiceAnswer(opt, card));
            optionsContainer.appendChild(card);
        });
    } else {
        optionsContainer.hidden = true;
        textBox.hidden = false;
        $("structure-guide").innerHTML = q.structureGuide;
        const input = $("user-sentence-input");
        input.value = "";
        input.focus();
    }

    setTimeout(playAudio, 300);
}

function checkChoiceAnswer(opt, card) {
    if (isAnswerLocked) return;

    if (opt.isCorrect) {
        isAnswerLocked = true;
        buenas++;
        updateStats();
        playSound("success");
        card.classList.add("correct-anim");
        $("feedback").textContent = "¡Excelente! Respuesta correcta ✨";
        $("feedback").className = "feedback-message success";
        launchConfetti(50, 60);
        setTimeout(nextQuestion, 1300);
    } else {
        malas++;
        updateStats();
        playSound("error");
        triggerErrorEffects(card);
    }
}

function submitWrittenAnswer() {
    if (isAnswerLocked) return;
    const q = questions[currentIndex];
    const userVal = normalize($("user-sentence-input").value);

    if (userVal === normalize(q.answer)) {
        isAnswerLocked = true;
        buenas++;
        updateStats();
        playSound("success");
        $("feedback").textContent = "¡Estructura correcta! ¡Bien escrito! ✍️🎉";
        $("feedback").className = "feedback-message success";
        launchConfetti(60, 70);
        setTimeout(nextQuestion, 1400);
    } else {
        malas++;
        updateStats();
        playSound("error");
        triggerErrorEffects($("text-input-container"));
    }
}

function triggerErrorEffects(element) {
    document.body.classList.add("flash-red");
    setTimeout(() => document.body.classList.remove("flash-red"), 500);

    element.classList.add("shake");
    setTimeout(() => element.classList.remove("shake"), 600);

    $("feedback").textContent = "Vuelve a intentarlo, ¡tú puedes! 💪 (Revisa la estructura)";
    $("feedback").className = "feedback-message try-again";

    setTimeout(playAudio, 600);
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    window.speechSynthesis && window.speechSynthesis.cancel();
    $("progress-bar").style.width = "100%";
    $("game-stats").hidden = true;
    $("final-buenas").textContent = buenas;
    $("final-malas").textContent = malas;
    showScreen("result-screen");
    launchConfetti(140, 90);
}

/* ============================================================
   RELOJ SVG
   ============================================================ */
function createSVGClock(hours, minutes) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("class", "clock-svg");

    const make = (tag, attrs) => {
        const el = document.createElementNS(ns, tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        svg.appendChild(el);
    };

    make("circle", { cx: 50, cy: 50, r: 45, fill: "#1e293b", stroke: "#38bdf8", "stroke-width": 4 });
    make("circle", { cx: 50, cy: 50, r: 3.5, fill: "#38bdf8" });

    make("line", {
        x1: 50, y1: 50, x2: 50, y2: 18, stroke: "#f43f5e", "stroke-width": 3.5,
        "stroke-linecap": "round", transform: `rotate(${minutes * 6} 50 50)`
    });
    make("line", {
        x1: 50, y1: 50, x2: 50, y2: 28, stroke: "#f8fafc", "stroke-width": 5,
        "stroke-linecap": "round", transform: `rotate(${(hours % 12) * 30 + minutes / 2} 50 50)`
    });

    return svg;
}

/* ============================================================
   EVENTOS (se conectan cuando la página termina de cargar)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    $("btn-start").addEventListener("click", startGame);
    $("btn-restart").addEventListener("click", startGame);
    $("btn-audio").addEventListener("click", playAudio);
    $("btn-submit").addEventListener("click", submitWrittenAnswer);
    $("user-sentence-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") submitWrittenAnswer();
    });
});
