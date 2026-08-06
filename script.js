const CONFIG = {
    instagramUrl: 'https://www.instagram.com/mix24horas_',
    senha: 'MAIORDOMUNDO',
    tempoVerificacao: 6000,
    nomeRede: 'MIX 24H VISITANTES'
};

// Detecta se está rodando como app standalone (adicionado à tela inicial)
const isStandalone = (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
);

// Criar partículas premium
function criarParticulas() {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['gold', 'orange'];
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = `particle ${colors[Math.floor(Math.random() * colors.length)]}`;
        p.style.left = Math.random() * 100 + '%';
        p.style.width = (3 + Math.random() * 6) + 'px';
        p.style.height = p.style.width;
        p.style.animation = `floatUp ${12 + Math.random() * 10}s linear infinite`;
        p.style.animationDelay = Math.random() * 15 + 's';
        container.appendChild(p);
    }
}

// Abre link externo funcionando tanto no navegador quanto em standalone
function abrirLinkExterno(event, url) {
    if (event) event.preventDefault();

    if (isStandalone) {
        // Em modo standalone, window.open pode ser bloqueado
        // Usamos um link temporário para forçar abertura no navegador
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

// Ripple effect
function createRipple(event, element) {
    const container = element.querySelector('.ripple-container') || element;
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Efeito de digitação premium
function typeSenha() {
    const display = document.getElementById('senha-display');
    const cursor = document.getElementById('cursor');
    const senha = CONFIG.senha;
    let i = 0;
    if (!display) return;
    display.textContent = '';
    if (cursor) cursor.style.display = 'inline-block';

    const interval = setInterval(() => {
        if (i < senha.length) {
            display.textContent += senha[i];
            i++;
        } else {
            clearInterval(interval);
            if (cursor) cursor.style.display = 'none';
            const scanner = document.getElementById('scanner-line');
            if (scanner) {
                scanner.classList.add('active');
                setTimeout(() => scanner.classList.remove('active'), 1500);
            }
        }
    }, 120);
}

// Confetti celebration
function launchConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    const colors = ['#ffcc00', '#ff9500', '#ff6b00', '#ffd700', '#ffa500', '#ffffff'];
    const shapes = ['square', 'circle', 'triangle'];

    for (let i = 0; i < 60; i++) {
        const conf = document.createElement('div');
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        conf.className = `confetti ${shape}`;
        conf.style.left = Math.random() * 100 + '%';
        conf.style.background = colors[Math.floor(Math.random() * colors.length)];
        conf.style.borderBottomColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.width = (6 + Math.random() * 8) + 'px';
        conf.style.height = conf.style.width;
        conf.style.animation = `confettiFall ${2 + Math.random() * 3}s ease-out forwards`;
        conf.style.animationDelay = Math.random() * 0.5 + 's';
        conf.style.opacity = Math.random() * 0.5 + 0.5;
        container.appendChild(conf);
    }

    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Glitch effect
function triggerGlitch() {
    const overlay = document.getElementById('glitch-overlay');
    if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => overlay.classList.remove('active'), 300);
    }
}

// Acessar Instagram
function acessarInstagram(event) {
    createRipple(event, document.getElementById('btn-insta'));

    const botao = document.getElementById('btn-insta');
    const btnText = document.getElementById('btn-text');
    const progressRing = document.getElementById('progress-ring');
    const progressCircle = document.getElementById('progress-circle');
    const timerDisplay = document.getElementById('timer-display');

    if (botao) botao.disabled = true;
    if (btnText) btnText.innerHTML = '<span class="spinner"></span> Verificando...';
    if (progressRing) progressRing.classList.add('active');

    // Abre Instagram usando função que funciona em standalone
    abrirLinkExterno(null, CONFIG.instagramUrl);

    const circumference = 2 * Math.PI * 45;
    let progress = 0;
    const startTime = Date.now();

    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / CONFIG.tempoVerificacao, 1);
        if (progressCircle) {
            const offset = circumference - (progress * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }

        const remaining = Math.ceil((CONFIG.tempoVerificacao - elapsed) / 1000);
        if (timerDisplay && remaining > 0) {
            timerDisplay.textContent = `⏱️ ${remaining}s`;
        }
    }, 50);

    setTimeout(() => {
        clearInterval(interval);
        if (timerDisplay) timerDisplay.textContent = '';
        triggerGlitch();

        setTimeout(() => {
            const telaBloqueada = document.getElementById('tela-bloqueada');
            const telaLiberada = document.getElementById('tela-liberada');

            if (telaBloqueada) {
                telaBloqueada.style.opacity = '0';
                telaBloqueada.style.transform = 'translateY(-30px) scale(0.95)';
            }

            setTimeout(() => {
                if (telaBloqueada) telaBloqueada.classList.add('hidden');
                if (telaLiberada) telaLiberada.classList.remove('hidden');
                launchConfetti();

                setTimeout(() => {
                    typeSenha();
                }, 400);
            }, 500);
        }, 200);
    }, CONFIG.tempoVerificacao);
}

// Copiar senha
function copiarSenha() {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const copyText = document.getElementById('copy-text');

    const copiar = () => {
        if (copyText) copyText.innerHTML = '✅ Copiado!';
        if (toastMsg) toastMsg.textContent = 'Senha copiada! Abrindo Wi-Fi...';
        showToast();

        setTimeout(() => {
            if (copyText) copyText.innerHTML = '📋 Copiar Senha';
            abrirConfiguracoesWiFi();
        }, 2500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(CONFIG.senha).then(copiar).catch(() => fallbackCopiar(copiar));
    } else {
        fallbackCopiar(copiar);
    }
}

function fallbackCopiar(callback) {
    const textarea = document.createElement('textarea');
    textarea.value = CONFIG.senha;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        callback();
    } catch (err) {
        showToastCustom('Não foi possível copiar automaticamente');
    }
    document.body.removeChild(textarea);
}

function abrirConfiguracoesWiFi() {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isAndroid = /Android/.test(ua);

    if (isIOS) {
        window.location.href = 'App-Prefs:root=WIFI';
    } else if (isAndroid) {
        window.location.href = 'intent:#Intent;action=android.settings.WIFI_SETTINGS;end';
    } else {
        showToastCustom('Conecte-se manualmente à rede: ' + CONFIG.nomeRede);
    }
}

function showToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }
}

function showToastCustom(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (toastMsg) toastMsg.textContent = msg;
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }
}

// Usa DOMContentLoaded (mais confiável que window.onload para PWA)
document.addEventListener('DOMContentLoaded', criarParticulas);