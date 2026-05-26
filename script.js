// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu(forceClose = false) {
    const isOpen = navMenu.classList.contains('active') || forceClose;
    navToggle.classList.toggle('active', !isOpen);
    navMenu.classList.toggle('active', !isOpen);
    if (navOverlay) navOverlay.classList.toggle('active', !isOpen);
    document.body.classList.toggle('body-menu-open', !isOpen);
    navToggle.setAttribute('aria-expanded', !isOpen);
}

navToggle.addEventListener('click', () => toggleMenu());
if (navOverlay) navOverlay.addEventListener('click', () => toggleMenu(true));

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
});

// ===== COUNTER ANIMATION (Eased) =====
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';
        const target = +counter.getAttribute('data-target');
        const duration = 2200;
        const startTime = performance.now();
        const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            counter.textContent = Math.floor(easeOutQuart(progress) * target);
            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = target;
        };
        requestAnimationFrame(update);
    });
}

// ===== INTERSECTION OBSERVER (Staggered) =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.querySelector('.stat-number')) {
                animateCounters();
            }
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.service-card, .partner-card, .testimonial-card, .contact-card, .hero-stats').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 80}ms`;
    observer.observe(el);
});

// ===== PHONE MASK =====
const telefoneInput = document.getElementById('telefone');
if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
        else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
        else if (v.length > 0) v = `(${v}`;
        e.target.value = v;
    });
}

// ===== FORM SUBMIT → GOOGLE SHEETS + WHATSAPP =====
var GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxVqnBBIUYVafEYw3x-R5bRdXvLojbY2IawF10NSrUdr097sRyTkLhJK5MGi_-rcusB/exec';
var WHATSAPP_NUMBER = '5511911400184';

var quoteForm = document.getElementById('quoteForm');
var formSuccess = document.getElementById('formSuccess');

/**
 * Envia os dados do formulário para o Google Sheets via Apps Script.
 * Usa fetch com mode 'no-cors' para evitar problemas de CORS.
 * @param {Object} dados - Objeto com os campos do formulário
 */
async function enviarParaGoogleSheets(dados) {
    if (!GOOGLE_SHEETS_URL) {
        console.warn('[Seguros JRV] URL do Google Sheets não configurada. Dados não salvos na planilha.');
        return;
    }
    try {
        await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(dados)
        });
        console.log('[Seguros JRV] Dados enviados para Google Sheets com sucesso.');
    } catch (erro) {
        console.error('[Seguros JRV] Erro ao enviar para Google Sheets:', erro);
    }
}

if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var nome     = document.getElementById('nome').value.trim();
        var telefone = document.getElementById('telefone').value.trim();
        var email    = document.getElementById('email').value.trim();
        var selEl    = document.getElementById('tipoSeguro');
        var tipoSeguro = selEl.options[selEl.selectedIndex].text;
        var mensagem = document.getElementById('mensagem').value.trim();

        var btn = document.getElementById('submitBtn');
        btn.innerHTML = '<i class="fab fa-whatsapp fa-spin"></i> Enviando...';
        btn.disabled = true;

        // Envia para Google Sheets (assíncrono, não bloqueia o fluxo)
        enviarParaGoogleSheets({
            nome: nome,
            telefone: telefone,
            email: email,
            tipoSeguro: tipoSeguro,
            mensagem: mensagem,
            dataHora: new Date().toLocaleString('pt-BR')
        });

        // Monta mensagem para WhatsApp
        var linhas = [];
        linhas.push('Olá! Solicitei uma *cotação de seguro* pelo site da Seguros JRV.');
        linhas.push('');
        linhas.push('*DADOS DA COTAÇÃO*');
        linhas.push('');
        linhas.push('*Nome:* ' + nome);
        linhas.push('*Telefone:* ' + telefone);
        if (email) linhas.push('*E-mail:* ' + email);
        linhas.push('*Tipo de Seguro:* ' + tipoSeguro);
        if (mensagem) {
            linhas.push('');
            linhas.push('*Mensagem:* ' + mensagem);
        }
        linhas.push('');
        linhas.push('_Enviado pelo site Seguros JRV_');

        var textoFinal = linhas.join(String.fromCharCode(10));
        var textoCodificado = encodeURIComponent(textoFinal);
        var urlWhatsApp = 'https://api.whatsapp.com/send/?phone=' + WHATSAPP_NUMBER + '&text=' + textoCodificado + '&type=phone_number&app_absent=0';

        var fallbackLink = document.getElementById('whatsappFallback');
        if (fallbackLink) fallbackLink.href = urlWhatsApp;

        setTimeout(function() {
            window.open(urlWhatsApp, '_blank');
            quoteForm.style.display = 'none';
            formSuccess.classList.add('active');
        }, 1200);
    });
}

// Restaura o formulário ao estado inicial
function resetForm() {
    quoteForm.reset();
    quoteForm.style.display = 'block';
    formSuccess.classList.remove('active');
    var btn = document.getElementById('submitBtn');
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Cotação';
    btn.disabled = false;
}

// ===== CHATBOT INTELIGENTE =====
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatbotMessages');

chatbotToggle.addEventListener('click', () => chatbotWindow.classList.toggle('active'));
chatbotClose.addEventListener('click', () => chatbotWindow.classList.remove('active'));

// Saudação dinâmica por horário
function getSaudacao() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
}

// Atualiza saudação inicial
const saudacaoEl = document.getElementById('chatGreeting');
if (saudacaoEl) saudacaoEl.textContent = `${getSaudacao()}! 👋 Sou o assistente virtual da Seguros JRV. Como posso ajudar?`;

const botResponses = {
    auto: '🚗 <strong>Seguro Auto</strong> — Proteção completa contra roubo, furto, colisão e danos a terceiros. Para cotação preciso de: modelo do veículo, ano e CEP. <a href="#cotacao" style="color:var(--accent)">Preencha o formulário</a> ou fale pelo WhatsApp!',
    vida: '❤️ <strong>Seguro Vida</strong> — Garanta a segurança financeira da sua família. Temos planos a partir de R$30/mês com coberturas para invalidez, doenças graves e assistência funeral. <a href="#cotacao" style="color:var(--accent)">Faça uma cotação</a>!',
    saude: '🏥 <strong>Seguro Saúde</strong> — Planos individuais, familiares e empresariais com as melhores operadoras (SulAmérica, Amil, Bradesco). <a href="#cotacao" style="color:var(--accent)">Solicite sua cotação</a>!',
    residencial: '🏠 <strong>Seguro Residencial</strong> — Proteja seu lar contra incêndio, roubo, danos elétricos e desastres naturais. Inclui assistência 24h (chaveiro, encanador, eletricista). <a href="#cotacao" style="color:var(--accent)">Cotar agora</a>!',
    empresarial: '🏢 <strong>Seguro Empresarial</strong> — Soluções sob medida para seu negócio: patrimonial, responsabilidade civil, vida em grupo e frota. <a href="#cotacao" style="color:var(--accent)">Solicite uma proposta</a>!',
    viagem: '✈️ <strong>Seguro Viagem</strong> — Viaje tranquilo! Cobertura médica internacional, extravio de bagagem, cancelamento de voo e assistência 24h em português. <a href="#cotacao" style="color:var(--accent)">Cotar agora</a>!',
    falar: '💬 Nosso corretor está disponível pelo WhatsApp! Clique aqui: <a href="https://wa.me/5511911400184" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">(11) 91140-0184</a>'
};

// Keyword matching para mensagens de texto livre
const keywordMap = [
    { keywords: ['preço', 'preco', 'valor', 'quanto', 'custo', 'barato', 'caro', 'mensalidade'], response: '💰 Os valores variam conforme o perfil e cobertura desejada. Para um orçamento personalizado, <a href="#cotacao" style="color:var(--accent)">preencha nossa cotação</a> ou fale com nosso corretor pelo <a href="https://wa.me/5511911400184" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">WhatsApp</a>!' },
    { keywords: ['sinistro', 'acidente', 'batida', 'roubo', 'roubaram', 'furtaram', 'furto'], response: '🚨 Em caso de sinistro, o primeiro passo é registrar um B.O. Depois, entre em contato conosco pelo <a href="https://wa.me/5511911400184" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">WhatsApp (11) 91140-0184</a> que ajudamos com todo o processo de acionamento!' },
    { keywords: ['documento', 'documentos', 'preciso', 'documentação'], response: '📋 Para a maioria dos seguros, precisamos de: CPF, RG, CNH (auto), comprovante de residência e dados do bem a ser segurado. Envie pelo <a href="https://wa.me/5511911400184" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">WhatsApp</a>!' },
    { keywords: ['prazo', 'demora', 'tempo', 'quando', 'dias'], response: '⏰ Nossas cotações são respondidas em até 24h! Para aprovação do seguro, geralmente leva de 1 a 5 dias úteis dependendo da seguradora.' },
    { keywords: ['cotar', 'cotação', 'cotacao', 'orçamento', 'orcamento'], response: '📝 Ótimo! Você pode fazer uma cotação gratuita agora mesmo: <a href="#cotacao" style="color:var(--accent)">clique aqui para preencher o formulário</a>. Responderemos em até 24h!' },
    { keywords: ['obrigado', 'obrigada', 'valeu', 'agradeço', 'thanks'], response: '😊 Nós que agradecemos! Se precisar de mais alguma coisa, é só chamar. Estamos aqui para ajudar!' },
    { keywords: ['oi', 'olá', 'ola', 'hey', 'bom dia', 'boa tarde', 'boa noite'], response: `${getSaudacao()}! 😊 Como posso ajudar? Escolha uma das opções ou digite sua dúvida!` }
];

function getTimestamp() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `chat-msg ${type}`;
    div.innerHTML = `<p>${text}</p><span class="msg-time">${getTimestamp()}</span>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    saveChatState();
}

function showTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot typing-msg';
    div.innerHTML = '<div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

function showFollowUp() {
    const div = document.createElement('div');
    div.className = 'chat-followup';
    div.innerHTML = '<button class="chat-option-btn" data-response="cotar">📝 Fazer cotação</button><button class="chat-option-btn" data-response="falar">💬 Falar com corretor</button>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    div.querySelectorAll('.chat-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.response;
            addMessage(btn.textContent, 'user');
            div.remove();
            const typing = showTypingIndicator();
            setTimeout(() => {
                typing.remove();
                if (key === 'cotar') {
                    addMessage('📝 Perfeito! <a href="#cotacao" style="color:var(--accent)">Clique aqui para preencher o formulário de cotação</a>. É rápido e gratuito!', 'bot');
                } else {
                    addMessage(botResponses['falar'], 'bot');
                }
            }, 800);
        });
    });
}

// Opções iniciais do chatbot
document.querySelectorAll('.chat-option-btn[data-response]').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.dataset.response;
        if (!botResponses[key]) return;
        addMessage(btn.textContent, 'user');
        const optionsEl = document.getElementById('chatOptions');
        if (optionsEl) optionsEl.style.display = 'none';
        const typing = showTypingIndicator();
        setTimeout(() => {
            typing.remove();
            addMessage(botResponses[key], 'bot');
            setTimeout(showFollowUp, 500);
        }, 1000);
    });
});

chatSend.addEventListener('click', sendUserMessage);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendUserMessage(); });

function sendUserMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';

    const typing = showTypingIndicator();
    const lowerText = text.toLowerCase();

    // Busca por keyword matching
    let matchedResponse = null;
    for (const entry of keywordMap) {
        if (entry.keywords.some(kw => lowerText.includes(kw))) {
            matchedResponse = entry.response;
            break;
        }
    }

    setTimeout(() => {
        typing.remove();
        if (matchedResponse) {
            addMessage(matchedResponse, 'bot');
        } else {
            addMessage('Obrigado pela mensagem! 😊 Para um atendimento mais rápido e personalizado, <a href="https://wa.me/5511911400184" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">fale pelo WhatsApp</a> ou <a href="#cotacao" style="color:var(--accent)">preencha nosso formulário</a>.', 'bot');
        }
        setTimeout(showFollowUp, 500);
    }, 1200);
}

// Persistência do chat via sessionStorage
function saveChatState() {
    try {
        const msgs = chatMessages.innerHTML;
        sessionStorage.setItem('jrv_chat', msgs);
    } catch(e) { /* silent */ }
}
function restoreChatState() {
    try {
        const saved = sessionStorage.getItem('jrv_chat');
        if (saved) {
            chatMessages.innerHTML = saved;
            const optionsEl = document.getElementById('chatOptions');
            if (optionsEl) optionsEl.style.display = 'none';
        }
    } catch(e) { /* silent */ }
}
restoreChatState();

// ===== PARTICLES =====
const canvas = document.getElementById('particles');
if (canvas) {
    const container = canvas.parentElement;
    const cvs = document.createElement('canvas');
    cvs.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    canvas.appendChild(cvs);
    const ctx = cvs.getContext('2d');
    let particles = [];
    function resizeCanvas() {
        cvs.width = container.offsetWidth;
        cvs.height = container.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * cvs.width, y: Math.random() * cvs.height,
            size: Math.random() * 2 + 0.5, speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4, opacity: Math.random() * 0.4 + 0.1
        });
    }
    function drawParticles() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 160, 23, ${p.opacity})`;
            ctx.fill();
            p.x += p.speedX; p.y += p.speedY;
            if (p.x < 0 || p.x > cvs.width) p.speedX *= -1;
            if (p.y < 0 || p.y > cvs.height) p.speedY *= -1;
        });
        requestAnimationFrame(drawParticles);
    }
    drawParticles();
}

// ===== TOOLTIPS DE SINISTRALIDADE (PARCEIROS) =====
// Popula dinamicamente os tooltips com os dados de sinistralidade
// armazenados nos data-attributes de cada .partner-card
document.querySelectorAll('.partner-card[data-sinistro]').forEach(card => {
    const sinistro = parseFloat(card.dataset.sinistro);
    const segmento = card.dataset.segmento || '';
    const fonte    = card.dataset.fonte || '';
    const detalhe  = card.dataset.detalhe || '';
    const nome     = card.querySelector('span')?.textContent || '';
    const tooltip  = card.querySelector('.partner-tooltip');

    if (!tooltip) return;

    // Cor da barra baseada no índice (verde=baixo, amarelo=médio, vermelho=alto)
    let barColor;
    if (sinistro <= 55)      barColor = '#22c55e'; // Verde — boa sinistralidade
    else if (sinistro <= 70) barColor = '#eab308'; // Amarelo — moderada
    else                     barColor = '#ef4444'; // Vermelho — alta (ex: saúde)

    // Define o width da barra como variável CSS
    tooltip.style.setProperty('--bar-width', `${Math.min(sinistro, 100)}%`);

    tooltip.innerHTML = `
        <div class="tooltip-header">
            <span class="tooltip-title">📊 Sinistralidade</span>
            <span class="tooltip-badge">${segmento}</span>
        </div>
        <div class="tooltip-percent">${sinistro}<small>%</small></div>
        <div class="tooltip-label">Índice de sinistros pagos — ${nome}</div>
        <div class="tooltip-bar">
            <div class="tooltip-bar-fill" style="background: linear-gradient(90deg, ${barColor}, ${barColor}cc);"></div>
        </div>
        <div class="tooltip-detail">${detalhe}</div>
        <div class="tooltip-fonte">${fonte}</div>
    `;
});

// ===== TOOLTIPS MOBILE (TAP) =====
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.querySelectorAll('.partner-card[data-sinistro]').forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            // Fecha todos os outros tooltips
            document.querySelectorAll('.partner-card').forEach(c => {
                if (c !== card) c.classList.remove('tooltip-active');
            });
            card.classList.toggle('tooltip-active');
        });
    });
    // Fecha tooltip ao tocar fora
    document.addEventListener('click', () => {
        document.querySelectorAll('.partner-card').forEach(c => c.classList.remove('tooltip-active'));
    });
}

// ===== PARALLAX SUTIL NO HERO =====
const heroImage = document.querySelector('.hero-image');
if (heroImage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        if (scrollY < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrollY * 0.08}px)`;
        }
    }, { passive: true });
}
