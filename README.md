# ⚡ Gabriel Consultoria — Quiz Funnel

> Funil de captação de leads para personal training, com quiz interativo e envio direto via WhatsApp.

![Status](https://img.shields.io/badge/status-ativo-brightgreen)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?logo=github&logoColor=white)

---

## 📱 Demo

🔗 **[Ver projeto ao vivo](https://roxouw.github.io/gabriel-consultoria)**

---

## 🎯 O que é

Aplicação mobile-first que guia o usuário por um quiz de perfil físico e ao final envia os dados automaticamente ao personal trainer via **WhatsApp**, gerando leads qualificados sem precisar de backend.

---

## 🖥️ Fluxo das Telas

```
[1] Boas-vindas      → Usuário digita o nome
[2] Quiz (11 etapas) → Perguntas sobre perfil e objetivo
[3] Análise          → Animação de processamento do perfil
[4] Confirmação      → Resumo + depoimentos + botão WhatsApp
[5] Agradecimento    → Links para redes sociais
```

---

## 📋 Etapas do Quiz

| # | Pergunta | Tipo |
|---|---|---|
| 1 | Motivação | Lista |
| — | Estatísticas: Com personal vs Sem | Tela especial |
| 2 | Sexo biológico | Grid com fotos |
| 3 | Físico atual | Lista com emoji |
| 4 | Físico desejado | Lista com emoji |
| 5 | Faixa etária | Grid |
| 6 | Tempo de treino | Lista |
| 7 | Dias por semana | Lista |
| 8 | Tempo disponível | Lista |
| 9 | Peso atual | Controle numérico (kg/lb) |
| 10 | Altura | Régua deslizável (cm/pol) |

---

## 🗂️ Estrutura de Arquivos

```
gabriel-consultoria/
├── index.html        # Estrutura das 5 telas
├── style.css         # Visual completo (dark theme)
├── app.js            # Lógica do quiz e integrações
├── README.md         # Este arquivo
└── img/
    ├── man.png       # Foto card Homem
    └── woman.png     # Foto card Mulher
```

---

## ⚙️ Configuração

### 1. WhatsApp

No arquivo `app.js`, altere o número no bloco `CONFIG`:

```js
const CONFIG = {
  meuWhatsApp: '5551998293886', // DDI + DDD + número (sem espaços)
}
```

### 2. EmailJS (opcional)

Caso queira receber os leads também por e-mail, preencha as chaves do [EmailJS](https://emailjs.com):

```js
const CONFIG = {
  emailjsPublicKey:  'SUA_PUBLIC_KEY',
  emailjsServiceId:  'SUA_SERVICE_ID',
  emailjsTemplateId: 'SEU_TEMPLATE_ID',
}
```

**Variáveis do template EmailJS:**

| Variável | Descrição |
|---|---|
| `{{nome}}` | Nome do lead |
| `{{email_lead}}` | E-mail do lead |
| `{{whatsapp}}` | WhatsApp do lead |
| `{{resumo}}` | Respostas do quiz |
| `{{data}}` | Data e hora do envio |

---

## 🚀 Deploy no GitHub Pages

```bash
# 1. Clone ou inicialize o repositório
git init
git remote add origin https://github.com/roxouw/gabriel-consultoria.git

# 2. Adicione os arquivos
git add .
git commit -m "primeiro commit"

# 3. Suba para o GitHub
git push -u origin main

# 4. Ative o GitHub Pages
# Settings → Pages → Branch: main → / (root) → Save
```

O site ficará disponível em:
```
https://roxouw.github.io/gabriel-consultoria
```

> ⚠️ O GitHub Pages pode levar até 2 minutos para atualizar após o push.

---

## 🛠️ Atualizar o projeto

```bash
git add .
git commit -m "descrição da alteração"
git push origin main
```

---

## 🎨 Design

- **Tema:** Dark com acentos laranja (`#f97316`)
- **Fontes:** [Barlow Condensed](https://fonts.google.com/specimen/Barlow+Condensed) (títulos) + [Barlow](https://fonts.google.com/specimen/Barlow) (corpo)
- **Mobile-first:** Otimizado para telas a partir de 320px

### Tokens de cor

| Token | Valor | Uso |
|---|---|---|
| `--orange` | `#f97316` | Cor principal |
| `--orange-light` | `#fb923c` | Hover / gradiente |
| `--orange-dark` | `#c2410c` | Gradiente escuro |
| `--bg` | `#141414` | Fundo principal |
| `--bg-card` | `#1e1e1e` | Cards |
| `--text` | `#f2f2f2` | Texto principal |

---

## ✨ Funcionalidades

- [x] Quiz com 10 perguntas + tela de estatísticas
- [x] Fotos reais nos cards de gênero
- [x] Contador de pessoas online (dinâmico)
- [x] Carrossel de depoimentos automático
- [x] Tela de análise animada (4 passos)
- [x] Envio de lead formatado via WhatsApp
- [x] Tela de agradecimento com redes sociais
- [x] Meta tags SEO + preview para WhatsApp/redes
- [x] Suporte a kg/lb e cm/pol
- [x] Totalmente responsivo (mobile-first)
- [ ] Banner og:image 1200×630px
- [ ] Domínio próprio

---

## 📬 Mensagem enviada ao Gabriel

Ao final do quiz, o WhatsApp abre com a mensagem já preenchida:

```
Olá Gabriel, gostaria de fazer uma avaliação e montar
meu treino personalizado com você!

Segue meus dados pré preenchidos no site:
• Nome: João
• Motivação: Sim, demais!
• Sexo: Homem
• Físico atual: Médio
• Físico desejado: Musculoso
• Faixa etária: 29-39
• Treino há: 1 a 2 anos
• Dias/semana: 4 dias
• Tempo/treino: 60 minutos
• Peso: 75 kg
• Altura: 175 cm
```

---

## 👤 Créditos

**Personal Trainer**
[@gabrielmoraes_treinador](https://www.instagram.com/gabrielmoraes_treinador/) — Instagram & TikTok

**Desenvolvido por**
[@filipe.rosso](https://www.instagram.com/filipe.rosso/) — Filipe Rosso

---

## 📄 Licença

Este projeto é de uso exclusivo de Gabriel Consultoria.