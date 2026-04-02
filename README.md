# Gabriel Consultoria

Landing page mobile-first da Gabriel Consultoria com quiz de qualificação e conversão direta para o WhatsApp.

## Demo

Projeto publicado em:

`https://roxouw.github.io/consultoria-gabriel/`

## O que o projeto faz

- Captura o nome do usuário e conduz um quiz de perfil físico
- Exibe uma etapa de comparação "sem personal vs com personal"
- Gera uma tela de análise para aumentar a percepção de personalização
- Monta um resumo final com as respostas
- Abre o WhatsApp com a mensagem do lead já preenchida
- Exibe tela final com links para redes sociais

## Stack

- HTML
- CSS
- JavaScript vanilla
- GitHub Pages para publicação
- GA4 via `gtag`

## Estrutura

```text
consultoria-gabriel/
├── index.html
├── style.css
├── app.js
├── privacy.html
├── terms.html
├── cookies.html
├── robots.txt
├── README.md
└── img/
    ├── logo.jpeg
    ├── logo1200.jpeg
    ├── man.webp
    └── woman.webp
```

## Fluxo

```text
[1] Boas-vindas   -> nome + prova + FAQ
[2] Quiz          -> perguntas + tela de estatísticas
[3] Análise       -> processamento visual do perfil
[4] Confirmação   -> resumo + depoimentos + CTA de WhatsApp
[5] Agradecimento -> redes sociais
```

## Etapas do quiz

| # | Etapa | Tipo |
| --- | --- | --- |
| 1 | Motivação | Lista |
| 2 | Estatísticas | Tela especial |
| 3 | Sexo biológico | Grid com imagem |
| 4 | Físico atual | Lista com emoji |
| 5 | Físico desejado | Lista com emoji |
| 6 | Faixa etária | Grid |
| 7 | Tempo de treino | Lista |
| 8 | Dias por semana | Lista |
| 9 | Tempo disponível | Lista |
| 10 | Peso atual | Controle numérico com `kg/lb` |
| 11 | Altura | Régua com `cm/pol` |

## Configuração

### WhatsApp

Edite o número no bloco `CONFIG` em [app.js](/home/filipe/Documentos/github/consultoria-gabriel/app.js):

```js
const CONFIG = {
  meuWhatsApp: "5551998293886",
};
```

Use o formato `DDI + DDD + número`, sem espaços.

### Analytics

O projeto usa GA4 com o ID `G-NL321L3MEJ`, configurado diretamente no `index.html`.

Se trocar a propriedade:

1. atualize o script `gtag`
2. revise os eventos do funil em `app.js`

## SEO e ativos sociais

O projeto já inclui:

- `title`, meta description, canonical e Open Graph
- Twitter Card
- JSON-LD para `WebSite`, `ProfessionalService` e `FAQPage`
- `robots.txt`
- banner social em `img/logo1200.jpeg` no formato `1200x630`

## Páginas legais

O projeto inclui:

- `privacy.html`
- `terms.html`
- `cookies.html`

Essas páginas existem para dar suporte ao banner de privacidade, ao texto legal do quiz e à documentação mínima de uso do site.

## Publicação

### GitHub Pages

```bash
git add .
git commit -m "atualiza landing"
git push origin main
```

Depois, no GitHub:

`Settings -> Pages -> Branch: main -> /(root) -> Save`

## Funcionalidades atuais

- [x] Quiz com 11 etapas lógicas
- [x] CTA principal para WhatsApp
- [x] Mensagem do lead pré-formatada
- [x] Carrossel de depoimentos
- [x] Contador dinâmico de pessoas online
- [x] Tela de análise animada
- [x] Banner LGPD
- [x] Páginas legais
- [x] Meta tags SEO
- [x] Banner `og:image` 1200x630
- [x] Layout mobile-first
- [ ] Domínio próprio

## Exemplo da mensagem enviada

```text
Olá Gabriel, gostaria de fazer uma avaliação e montar meu treino personalizado com você!

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

## Créditos

Personal trainer:

[@gabrielmoraes_treinador](https://www.instagram.com/gabrielmoraes_treinador/)

Desenvolvimento:

[@filipe.rosso](https://www.instagram.com/filipe.rosso/) — Rosso Labs

## Licença

Projeto de uso exclusivo de Gabriel Consultoria.
