<div align="center">

<img src="assets/images/logo-jrv.jpg" alt="Seguros JRV" width="120" />

# Seguros JRV

**Site institucional da corretora de seguros Seguros JRV**

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?style=flat-square&logo=github)](https://segurosjrv.com.br)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Google Analytics](https://img.shields.io/badge/Analytics-GA4-E37400?style=flat-square&logo=googleanalytics&logoColor=white)](https://analytics.google.com)

🌐 **[segurosjrv.com.br](https://segurosjrv.com.br)**

</div>

---

## Sobre o projeto

Site institucional moderno da **Seguros JRV**, corretora de seguros com sede em São Paulo — SP. Desenvolvido com foco em **performance**, **SEO técnico** e uma **experiência mobile fluida**, o site conecta clientes a seguros personalizados de forma simples e humanizada.

## Funcionalidades

- **Formulário de cotação** integrado ao Google Sheets via Apps Script — captura leads em tempo real
- **Chatbot interativo** com fluxo de atendimento e persistência de histórico via `sessionStorage`
- **WhatsApp Business** integrado para contato direto com a corretora
- **Animações suaves** com IntersectionObserver e contadores animados
- **SEO completo** — Schema.org JSON-LD (InsuranceAgency + 6 serviços), sitemap, Open Graph e robots.txt
- **Mobile-first** — otimizado para todos os tamanhos de tela com suporte a safe-area (iPhone X+)
- **Google Analytics GA4** integrado para rastreamento de conversões

## Seguros oferecidos

| Seguro | Descrição |
|---|---|
| 🚗 Auto | Proteção completa contra roubo, furto, colisão e danos a terceiros |
| 💙 Vida | Proteção financeira para você e sua família |
| ❤️ Saúde | Planos de saúde individuais e empresariais |
| 🏠 Residencial | Proteção para sua casa e seus bens |
| 🏢 Empresarial | Soluções corporativas completas |
| ✈️ Viagem | Cobertura médica e assistência 24h no exterior |

## Seguradoras parceiras

Allianz · Bradesco Seguros · HDI · Liberty · Porto Seguro · Sul América · Suhai · Tokio Marine

## Tecnologias

```
├── HTML5 semântico (acessibilidade, WAI-ARIA, skip-to-content)
├── CSS3 puro (Grid, Flexbox, variáveis, clamp(), svh, safe-area-inset)
├── JavaScript vanilla (sem frameworks)
├── Google Apps Script (backend para captação de leads)
├── GitHub Pages (hospedagem)
└── Google Analytics GA4
```

## Estrutura

```
jrv-seguros/
├── index.html          # Página principal
├── style.css           # Estilos globais e responsividade
├── script.js           # Interações, chatbot, formulário e animações
├── sitemap.xml         # Sitemap para SEO
├── robots.txt          # Diretivas para crawlers
├── CNAME               # Domínio customizado (segurosjrv.com.br)
└── assets/
    └── images/
        ├── logo-jrv.jpg
        ├── familia.jpg
        ├── hero-bg.jpg
        ├── og-preview.png
        └── parceiros/  # Logos das seguradoras
```

## Rodar localmente

Não há dependências de build. Basta servir os arquivos estáticos:

```bash
# Com npx serve
npx serve .

# Com Python
python -m http.server 8000

# Com VS Code: instale a extensão Live Server e clique em "Go Live"
```

Acesse `http://localhost:3000` (ou a porta indicada).

## Deploy

O site é publicado automaticamente via **GitHub Pages** a cada push na branch `main`. O domínio `segurosjrv.com.br` é configurado pelo arquivo `CNAME`.

```
push → main → GitHub Pages → segurosjrv.com.br
```

## Captação de leads

O formulário de cotação envia dados para uma **Google Apps Script Web App**, que registra os leads diretamente em uma planilha do Google Sheets. A requisição usa `fetch` com `mode: 'no-cors'` e `Content-Type: text/plain` para compatibilidade cross-origin.

---

<div align="center">

Desenvolvido com dedicação para a **Seguros JRV** — São Paulo, SP

📞 (11) 91140-0184 · 📧 corretoradesegurosjrv@gmail.com · 📷 [@seguros_jrv](https://instagram.com/seguros_jrv)

</div>
