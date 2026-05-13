// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
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

// ===== COUNTER ANIMATION =====
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        update();
    });
}

// ===== INTERSECTION OBSERVER =====
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

document.querySelectorAll('.service-card, .partner-card, .testimonial-card, .contact-card, .hero-stats').forEach(el => {
    el.classList.add('reveal');
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

// ===== FORM SUBMIT → REDIRECIONAMENTO WHATSAPP =====
// Número da Seguros JRV (código país + DDD + número, sem espaços ou traços)
var WHATSAPP_NUMBER = '5511911400184';

var quoteForm = document.getElementById('quoteForm');
var formSuccess = document.getElementById('formSuccess');

if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
        // Impede o reload da página
        e.preventDefault();

        // Captura os valores de cada campo do formulário
        var nome     = document.getElementById('nome').value.trim();
        var telefone = document.getElementById('telefone').value.trim();
        var email    = document.getElementById('email').value.trim();
        var selEl    = document.getElementById('tipoSeguro');
        var tipoSeguro = selEl.options[selEl.selectedIndex].text;
        var mensagem = document.getElementById('mensagem').value.trim();

        // Feedback visual: mostra ícone do WhatsApp girando no botão
        var btn = document.getElementById('submitBtn');
        btn.innerHTML = '<i class="fab fa-whatsapp fa-spin"></i> Abrindo WhatsApp...';
        btn.disabled = true;

        // Monta a mensagem usando array de linhas
        // Array.join com caractere de nova linha garante quebras de linha reais
        var linhas = [];
        linhas.push('Olá! Solicitei uma *cotação de seguro* pelo site da Seguros JRV.');
        linhas.push('');
        linhas.push('*DADOS DA COTAÇÃO*');
        linhas.push('');
        linhas.push('*Nome:* ' + nome);
        linhas.push('*Telefone:* ' + telefone);
        if (email) {
            linhas.push('*E-mail:* ' + email);
        }
        linhas.push('*Tipo de Seguro:* ' + tipoSeguro);
        if (mensagem) {
            linhas.push('');
            linhas.push('*Mensagem:* ' + mensagem);
        }
        linhas.push('');
        linhas.push('_Enviado pelo site Seguros JRV_');

        // Junta com quebra de linha real (char code 10 = \n) e codifica para URL
        var textoFinal = linhas.join(String.fromCharCode(10));
        var textoCodificado = encodeURIComponent(textoFinal);

        // Monta a URL da API oficial do WhatsApp
        var urlWhatsApp = 'https://api.whatsapp.com/send/?phone=' + WHATSAPP_NUMBER + '&text=' + textoCodificado + '&type=phone_number&app_absent=0';

        // Atualiza o botão fallback na tela de sucesso com a mesma URL (com dados)
        var fallbackLink = document.getElementById('whatsappFallback');
        if (fallbackLink) {
            fallbackLink.href = urlWhatsApp;
        }

        // Delay visual para o usuário perceber o feedback antes de abrir a nova aba
        setTimeout(function() {
            // Abre o WhatsApp em uma nova aba
            window.open(urlWhatsApp, '_blank');
            // Exibe a tela de sucesso
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

// ===== CHATBOT =====
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatbotMessages');

chatbotToggle.addEventListener('click', () => chatbotWindow.classList.toggle('active'));
chatbotClose.addEventListener('click', () => chatbotWindow.classList.remove('active'));

const botResponses = {
    auto: 'Ótima escolha! 🚗 Para cotação de Seguro Auto, preciso de: modelo do veículo, ano e CEP. Ou <a href="#cotacao" style="color:var(--accent)">preencha nosso formulário</a>!',
    vida: 'Seguro Vida é fundamental! ❤️ Temos planos a partir de R$30/mês. <a href="#cotacao" style="color:var(--accent)">Faça uma cotação</a> ou fale pelo WhatsApp!',
    saude: 'Temos os melhores planos de saúde! 🏥 Individual, familiar e empresarial. <a href="#cotacao" style="color:var(--accent)">Solicite sua cotação</a>!',
    falar: 'Claro! 💬 Nosso corretor está disponível pelo WhatsApp: <a href="https://wa.me/5511911400184" target="_blank" style="color:var(--accent)">(11) 91140-0184</a>'
};

document.querySelectorAll('.chat-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.dataset.response;
        addMessage(btn.textContent, 'user');
        document.getElementById('chatOptions').style.display = 'none';
        setTimeout(() => addMessage(botResponses[key], 'bot'), 800);
    });
});

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `chat-msg ${type}`;
    div.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatSend.addEventListener('click', sendUserMessage);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendUserMessage(); });

function sendUserMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';
    setTimeout(() => {
        addMessage('Obrigado pela mensagem! 😊 Para um atendimento mais rápido, <a href="https://wa.me/5511911400184" target="_blank" style="color:var(--accent)">fale pelo WhatsApp</a> ou <a href="#cotacao" style="color:var(--accent)">preencha nosso formulário</a>.', 'bot');
    }, 1000);
}

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
