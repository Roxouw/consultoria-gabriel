/* ============================================================
   GABRIEL CONSULTORIA — app.js
   Autor: Rosso Labs (@filipe.rosso)
   ============================================================ */

/* ============================================================
   CONFIGURAÇÃO
   ⚠️ Preencha com seus dados reais antes de publicar
   ============================================================ */
const CONFIG = {
  // Seu número para receber leads (DDI + DDD + número)
  meuWhatsApp: '5551998293886',
};

/* ============================================================
   SEGURANÇA — Sanitização de inputs
   ============================================================ */
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .slice(0, 200)
    .replace(/[<>'"&]/g, c => ({ '<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;','&':'&amp;' }[c]));
}

/* ============================================================
   LGPD — Consentimento
   ============================================================ */
function initLGPD() {
  const banner = document.getElementById('lgpd-banner');
  if (!banner) return;
  // Verificar se já aceitou (usando sessionStorage — sem dados pessoais)
  if (sessionStorage.getItem('lgpd_ok')) {
    banner.classList.add('hidden');
    return;
  }
  // Mostrar após pequeno delay para não competir com o carregamento
  setTimeout(() => banner.classList.remove('hidden'), 800);
}

function acceptLGPD() {
  sessionStorage.setItem('lgpd_ok', '1');
  const banner = document.getElementById('lgpd-banner');
  if (banner) banner.classList.add('hidden');
}


/* ============================================================
   ESTADO DA APLICAÇÃO
   ============================================================ */
const State = {
  name:    '',
  step:    0,
  answers: {},
  _weight: null,
  _height: null,
};

/* ============================================================
   DEFINIÇÃO DO FUNIL
   ============================================================ */
const STEPS = [
  {
    type: 'q',
    key: 'motivacao',
    multi: false,
    title: 'Um acompanhamento personalizado te ajudaria a <em>alcançar seu objetivo</em>?',
    subtitle: '',
    layout: 'list',
    showTerms: true,
    opts: [
      { v: 'sim',    l: 'Sim, demais!'     },
      { v: 'talvez', l: 'Talvez, um pouco' },
    ],
  },
  {
    type: 'stats',
  },
  {
    type: 'q',
    key: 'genero',
    multi: false,
    title: 'Qual é o seu <em>sexo biológico</em>?',
    layout: 'grid2',
    opts: [
      { v: 'homem',  l: 'Homem',  icon: '🏋️', ph: 'ph-m', img: 'img/man.webp'   },
      { v: 'mulher', l: 'Mulher', icon: '🧘', ph: 'ph-f', img: 'img/woman.webp' },
    ],
  },
  {
    type: 'q',
    key: 'fisico_atual',
    multi: false,
    title: 'Qual desses físicos se parece <em>mais com o seu</em>?',
    layout: 'imglist',
    opts: [
      { v: 'magro',      l: 'Magro',         emoji: '🧍'    },
      { v: 'medio',      l: 'Médio',         emoji: '🧍'    },
      { v: 'acima_peso', l: 'Acima do peso', emoji: '🧍‍♂️' },
    ],
  },
  {
    type: 'q',
    key: 'fisico_desejado',
    multi: false,
    title: 'Qual desses físicos você <em>gostaria de ter</em>?',
    subtitle: 'Utilizamos esses dados apenas para personalizar o seu plano',
    layout: 'imglist',
    opts: [
      { v: 'em_forma',   l: 'Em forma',        emoji: '🏃' },
      { v: 'musculoso',  l: 'Musculoso',        emoji: '💪' },
      { v: 'muito_musc', l: 'Muito musculoso',  emoji: '🏋️' },
    ],
  },
  {
    type: 'q',
    key: 'idade',
    multi: false,
    title: 'Qual a sua <em>idade</em>?',
    layout: 'grid4',
    opts: [
      { v: '18_29', l: '18-29', icon: '👦', ph: 'ph-m' },
      { v: '29_39', l: '29-39', icon: '👨', ph: 'ph-m' },
      { v: '39_49', l: '39-49', icon: '🧔', ph: 'ph-m' },
      { v: '50p',   l: '50+',   icon: '👴', ph: 'ph-m' },
    ],
  },
  {
    type: 'q',
    key: 'tempo_treino',
    multi: false,
    title: 'Você treina <em>há quanto tempo</em>?',
    layout: 'list',
    opts: [
      { v: 'menos1', l: 'Menos de 1 ano' },
      { v: '1a2',    l: '1 a 2 anos'     },
      { v: '3a4',    l: '3 a 4 anos'     },
      { v: '5mais',  l: '+ 5 anos'       },
      { v: 'nunca',  l: 'Nunca treinei'  },
    ],
  },
  {
    type: 'q',
    key: 'dias_semana',
    multi: false,
    title: 'Quantos dias gostaria de <em>treinar por semana</em>?',
    layout: 'list',
    opts: [
      { v: '3d', l: '3 dias' },
      { v: '4d', l: '4 dias' },
      { v: '5d', l: '5 dias' },
      { v: '6d', l: '6 dias' },
    ],
  },
  {
    type: 'q',
    key: 'tempo_disponivel',
    multi: false,
    title: 'Quanto tempo tem <em>disponível</em> para treinar?',
    layout: 'list',
    opts: [
      { v: '30min',  l: '30 minutos'  },
      { v: '45min',  l: '45 minutos'  },
      { v: '60min',  l: '60 minutos'  },
      { v: '60mais', l: '+60 minutos' },
    ],
  },
  {
    type: 'weight',
    key: 'peso_atual',
    title: 'Qual o seu <em>peso atual</em>?',
  },
  {
    type: 'height',
    key: 'altura',
    title: 'Qual a sua <em>altura</em>?',
  },
];

/* Labels legíveis para o resumo */
const LABELS = {
  motivacao:        'Motivação',
  genero:           'Sexo',
  fisico_atual:     'Físico atual',
  fisico_desejado:  'Físico desejado',
  idade:            'Faixa etária',
  tempo_treino:     'Treino há',
  dias_semana:      'Dias/semana',
  tempo_disponivel: 'Tempo/treino',
  peso_atual:       'Peso',
  altura:           'Altura',
};

/* ============================================================
   ONLINE COUNTER
   ============================================================ */
function initCounter() {
  const el = document.getElementById('online-count');
  if (!el) return;
  const base = Math.floor(Math.random() * 18) + 23; // 23–40
  el.textContent = base;
  setInterval(() => {
    const delta = Math.random() < 0.5 ? -1 : 1;
    const current = parseInt(el.textContent);
    const next = Math.max(18, Math.min(55, current + delta));
    el.textContent = next;
  }, 4000);
}

/* ============================================================
   TESTIMONIALS CAROUSEL
   ============================================================ */
let _testimonialIndex = 0;
let _testimonialTimer = null;

function goTestimonial(index) {
  _testimonialIndex = index;
  const cards = document.querySelectorAll('.testimonial-card');
  cards.forEach((c, i) => {
    c.style.transform = `translateX(${(i - index) * 100}%)`;
  });
  document.querySelectorAll('.t-dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
}

function initTestimonials() {
  // Limpa timer anterior se existir
  if (_testimonialTimer) {
    clearInterval(_testimonialTimer);
    _testimonialTimer = null;
  }
  // Inicializa posições quando a tela já está visível
  _testimonialIndex = 0;
  goTestimonial(0);
  _testimonialTimer = setInterval(() => {
    const cards = document.querySelectorAll('.testimonial-card');
    const next = (_testimonialIndex + 1) % cards.length;
    goTestimonial(next);
  }, 4000);
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initCounter();
  initLGPD();

  // Bind smooth scroll + stagger na tela inicial
  const welcome = document.getElementById('s-welcome');
  SmoothScroll.bind(welcome);
  staggerScreen(welcome);
});

/* ============================================================
   WELCOME SCREEN
   ============================================================ */
function checkName() {
  const val = document.getElementById('inp-name').value.trim();
  document.getElementById('btn-start').disabled = val.length < 2;
}

function goQuiz() {
  const raw = document.getElementById('inp-name').value.trim();
  if (raw.length < 2) return;
  // Sanitiza: permite apenas letras, espaços e acentos
  const name = sanitize(raw).replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim().slice(0, 40);
  if (name.length < 2) return;
  State.name = name;
  State.step = 0;

  // GA4 — iniciou o quiz
  gtag('event', 'quiz_start', { event_category: 'funil', event_label: 'boas_vindas' });

  switchScreen('s-welcome', 's-quiz');
  renderStep();
}

/* ============================================================
   QUIZ RENDERING
   ============================================================ */
function renderStep() {
  const step  = STEPS[State.step];
  const block = document.getElementById('q-block');
  const btnB  = document.getElementById('btn-back');
  const terms = document.getElementById('q-terms');

  // Update progress
  const pct = Math.round((State.step / STEPS.length) * 100);
  document.getElementById('prog-fill').style.width   = pct + '%';
  document.getElementById('prog-label').textContent  = `Etapa ${State.step + 1} de ${STEPS.length}`;
  document.getElementById('prog-pct').textContent    = pct + '%';

  btnB.style.display  = State.step > 0 ? 'flex' : 'none';
  terms.style.display = step.showTerms ? 'block' : 'none';

  // Animate block in
  block.innerHTML = '';
  block.style.animation = 'none';
  requestAnimationFrame(() => { block.style.animation = ''; });

  // Delegate to the correct renderer
  const renderers = {
    q:      () => renderQuestion(step, block),
    stats:  () => renderStats(block),
    weight: () => renderWeight(step, block),
    height: () => renderHeight(step, block),
  };
  renderers[step.type]?.();

  // Recalcula o limite do smooth scroll após o conteúdo mudar
  requestAnimationFrame(() => SmoothScroll.recalc());
}

/* ── Stats Screen ── */
function renderStats(block) {
  block.innerHTML = `
    <div class="q-title">
      <h2>A diferença de treinar <em>com acompanhamento</em></h2>
      <p>Dados baseados em estudos de performance esportiva e acompanhamento de alunos</p>
    </div>

    <div class="stats-compare">

      <div class="stats-col stats-col--without">
        <div class="stats-col-header">
          <span class="stats-col-icon">😟</span>
          <span class="stats-col-label">Sem personal</span>
        </div>
        <div class="stats-items">
          <div class="stats-item">
            <div class="stats-bar-wrap">
              <div class="stats-bar-label">
                <span>Resultado em 3 meses</span>
                <span class="stats-pct bad">23%</span>
              </div>
              <div class="stats-track">
                <div class="stats-fill bad" style="width:0%" data-target="23"></div>
              </div>
            </div>
          </div>
          <div class="stats-item">
            <div class="stats-bar-wrap">
              <div class="stats-bar-label">
                <span>Consistência</span>
                <span class="stats-pct bad">31%</span>
              </div>
              <div class="stats-track">
                <div class="stats-fill bad" style="width:0%" data-target="31"></div>
              </div>
            </div>
          </div>
          <div class="stats-item">
            <div class="stats-bar-wrap">
              <div class="stats-bar-label">
                <span>Ganho de força</span>
                <span class="stats-pct bad">28%</span>
              </div>
              <div class="stats-track">
                <div class="stats-fill bad" style="width:0%" data-target="28"></div>
              </div>
            </div>
          </div>
          <div class="stats-item">
            <div class="stats-bar-wrap">
              <div class="stats-bar-label">
                <span>Motivação mantida</span>
                <span class="stats-pct bad">19%</span>
              </div>
              <div class="stats-track">
                <div class="stats-fill bad" style="width:0%" data-target="19"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="stats-col-footer bad-footer">
          <span>⚠️ 7 em cada 10 pessoas desistem em menos de 3 meses</span>
        </div>
      </div>

      <div class="stats-divider">VS</div>

      <div class="stats-col stats-col--with">
        <div class="stats-col-header">
          <span class="stats-col-icon">🏆</span>
          <span class="stats-col-label">Com personal</span>
        </div>
        <div class="stats-items">
          <div class="stats-item">
            <div class="stats-bar-wrap">
              <div class="stats-bar-label">
                <span>Resultado em 3 meses</span>
                <span class="stats-pct good">89%</span>
              </div>
              <div class="stats-track">
                <div class="stats-fill good" style="width:0%" data-target="89"></div>
              </div>
            </div>
          </div>
          <div class="stats-item">
            <div class="stats-bar-wrap">
              <div class="stats-bar-label">
                <span>Consistência</span>
                <span class="stats-pct good">94%</span>
              </div>
              <div class="stats-track">
                <div class="stats-fill good" style="width:0%" data-target="94"></div>
              </div>
            </div>
          </div>
          <div class="stats-item">
            <div class="stats-bar-wrap">
              <div class="stats-bar-label">
                <span>Ganho de força</span>
                <span class="stats-pct good">76%</span>
              </div>
              <div class="stats-track">
                <div class="stats-fill good" style="width:0%" data-target="76"></div>
              </div>
            </div>
          </div>
          <div class="stats-item">
            <div class="stats-bar-wrap">
              <div class="stats-bar-label">
                <span>Motivação mantida</span>
                <span class="stats-pct good">91%</span>
              </div>
              <div class="stats-track">
                <div class="stats-fill good" style="width:0%" data-target="91"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="stats-col-footer good-footer">
          <span>✅ Alunos atingem o objetivo <strong>3x mais rápido</strong></span>
        </div>
      </div>

    </div>

    <button class="btn-orange" onclick="nextStep()">
      Quero esse resultado!
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>`;

  // Animate bars after render
  requestAnimationFrame(() => {
    setTimeout(() => {
      block.querySelectorAll('.stats-fill').forEach(bar => {
        bar.style.transition = 'width 1s cubic-bezier(.4,0,.2,1)';
        bar.style.width = bar.dataset.target + '%';
      });
    }, 150);
  });
}

/* ── Question ── */
function renderQuestion(step, block) {
  const saved = State.answers[step.key];
  let html = `<div class="q-title">
    <h2>${step.title}</h2>
    ${step.subtitle ? `<p>${step.subtitle}</p>` : ''}
  </div>`;

  if (step.multi) html += `<p class="multi-hint">Selecione todas que se aplicam</p>`;

  if (step.layout === 'grid2' || step.layout === 'grid4') {
    const cls = step.layout === 'grid4' ? 'grid4' : 'grid2';
    html += `<div class="${cls}">`;
    step.opts.forEach(o => {
      const sel = saved && saved.v === o.v ? ' sel' : '';
      html += `
        <button class="ocard${sel}" onclick="pickOpt(this,'${step.key}','${o.v}','${o.l}',false)">
          <div class="cimg">
            ${o.img
              ? `<img src="${o.img}" alt="${o.l}" loading="lazy">`
              : `<div class="cph ${o.ph}"><span>${o.icon}</span></div>`
            }
          </div>
          <div class="cbody">
            <div class="ctext"><span class="clabel">${o.l}</span></div>
            <div class="ccheck"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
          </div>
        </button>`;
    });
    html += `</div>`;

  } else if (step.layout === 'imglist') {
    html += `<div class="olist">`;
    step.opts.forEach(o => {
      const sel = saved && saved.v === o.v ? ' sel' : '';
      html += `
        <button class="ocard img-right${sel}" onclick="pickOpt(this,'${step.key}','${o.v}','${o.l}',false)">
          <div class="cbody">
            <div class="ctext"><span class="clabel">${o.l}</span></div>
            <div class="ccheck"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
          </div>
          <div class="cimg-side">
            ${o.img
              ? `<img src="${o.img}" alt="${o.l}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`
              : `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:2rem">${o.emoji}</div>`
            }
          </div>
        </button>`;
    });
    html += `</div>`;

  } else {
    // list
    html += `<div class="olist">`;
    step.opts.forEach(o => {
      const isSel    = saved && (step.multi ? (saved.values || []).includes(o.v) : saved.v === o.v);
      const checkCls = step.multi ? 'ccheck sq' : 'ccheck';
      html += `
        <button class="ocard list-card${isSel ? ' sel' : ''}" onclick="pickOpt(this,'${step.key}','${o.v}','${o.l}',${step.multi})">
          <div class="cbody">
            <div class="ctext"><span class="clabel">${o.l}</span>${o.sub ? `<span class="csub">${o.sub}</span>` : ''}</div>
            <div class="${checkCls}"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
          </div>
        </button>`;
    });
    html += `</div>`;
  }

  block.innerHTML = html;
}

/* ── Weight ── */
function renderWeight(step, block) {
  if (!State._weight) State._weight = { val: 70, unit: 'kg' };
  const w = State._weight;

  block.innerHTML = `
    <div class="q-title"><h2>${step.title}</h2></div>
    <div class="unit-toggle">
      <button class="unit-btn ${w.unit === 'kg' ? 'active' : ''}" onclick="setWeightUnit('kg')">kg</button>
      <button class="unit-btn ${w.unit === 'lb' ? 'active' : ''}" onclick="setWeightUnit('lb')">lb</button>
    </div>
    <div class="big-val" id="w-display">${w.val} <sup>${w.unit}</sup></div>
    <div class="num-controls">
      <button class="nc-btn"
        onpointerdown="startAdj('weight',-1)"
        onpointerup="stopAdj()"
        onpointerleave="stopAdj()">−</button>
      <div style="width:60px"></div>
      <button class="nc-btn"
        onpointerdown="startAdj('weight',+1)"
        onpointerup="stopAdj()"
        onpointerleave="stopAdj()">+</button>
    </div>
    <p style="font-size:.72rem;color:var(--text-dim);text-align:center;margin-top:6px">
      Segure para alterar rapidamente
    </p>
    <button class="btn-confirm" onclick="nextStep()">
      Confirmar peso
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </button>`;

  saveWeightAnswer();
}

function setWeightUnit(unit) {
  if (State._weight.unit === unit) return;
  State._weight.val  = unit === 'lb'
    ? Math.round(State._weight.val * 2.20462)
    : Math.round(State._weight.val / 2.20462);
  State._weight.unit = unit;
  renderStep();
}

function adjWeight(delta) {
  const min = State._weight.unit === 'kg' ? 30 : 66;
  const max = State._weight.unit === 'kg' ? 250 : 550;
  State._weight.val = Math.max(min, Math.min(max, State._weight.val + delta));
  const el = document.getElementById('w-display');
  if (el) el.innerHTML = `${State._weight.val} <sup>${State._weight.unit}</sup>`;
  saveWeightAnswer();
}

function saveWeightAnswer() {
  State.answers['peso_atual'] = {
    v: `${State._weight.val}${State._weight.unit}`,
    l: `${State._weight.val} ${State._weight.unit}`,
  };
}

/* ── Height ── */
function renderHeight(step, block) {
  if (!State._height) State._height = { val: 175, unit: 'cm' };
  const h   = State._height;
  const min = h.unit === 'cm' ? 140 : 55;
  const max = h.unit === 'cm' ? 220 : 87;

  let ticks = '';
  for (let v = min; v <= max; v++) {
    const isMajor = v % 10 === 0;
    const isMed   = v % 5  === 0;
    const hpx     = isMajor ? 22 : isMed ? 14 : 8;
    const col     = v === h.val ? 'var(--orange)' : '#444';
    ticks += `<div style="display:inline-flex;flex-direction:column;align-items:center;width:14px;flex-shrink:0">
      <div style="width:${isMajor ? 2 : 1}px;height:${hpx}px;background:${col};border-radius:1px"></div>
      ${isMajor ? `<span style="font-size:.55rem;color:#666;margin-top:4px">${v}</span>` : ''}
    </div>`;
  }

  block.innerHTML = `
    <div class="q-title"><h2>${step.title}</h2></div>
    <div class="unit-toggle">
      <button class="unit-btn ${h.unit === 'cm'  ? 'active' : ''}" onclick="setHeightUnit('cm')">cm</button>
      <button class="unit-btn ${h.unit === 'pol' ? 'active' : ''}" onclick="setHeightUnit('pol')">pol</button>
    </div>
    <div class="big-val" id="h-display">${h.val} <sup>${h.unit}</sup></div>
    <div style="position:relative;width:100%;overflow:hidden;padding:8px 0">
      <div class="ruler-center">
        <div class="ruler-needle"></div>
        <div class="ruler-arrow"></div>
        <div class="ruler-hint">Arraste para ajustar</div>
      </div>
      <div id="ruler"
           style="display:flex;align-items:flex-start;height:60px;cursor:grab;overflow:hidden;padding:0 50%"
           ontouchstart="rulerTouch(event)"
           ontouchmove="rulerMove(event)"
           ontouchend="rulerEnd(event)"
           onmousedown="rulerMouse(event)">
        ${ticks}
      </div>
    </div>
    <div class="num-controls" style="margin-top:8px">
      <button class="nc-btn"
        onpointerdown="startAdj('height',-1)"
        onpointerup="stopAdj()"
        onpointerleave="stopAdj()">−</button>
      <div style="width:60px"></div>
      <button class="nc-btn"
        onpointerdown="startAdj('height',+1)"
        onpointerup="stopAdj()"
        onpointerleave="stopAdj()">+</button>
    </div>
    <button class="btn-confirm" onclick="nextStep()">
      Confirmar altura
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </button>`;

  centerRuler();
  saveHeightAnswer();
}

function setHeightUnit(unit) {
  if (State._height.unit === unit) return;
  State._height.val  = unit === 'pol'
    ? Math.round(State._height.val / 2.54)
    : Math.round(State._height.val * 2.54);
  State._height.unit = unit;
  renderStep();
}

function saveHeightAnswer() {
  State.answers['altura'] = {
    v: `${State._height.val}${State._height.unit}`,
    l: `${State._height.val} ${State._height.unit}`,
  };
}

/* ── Ruler helpers ── */
let _rulerStartX = 0, _rulerStartScroll = 0;

function centerRuler() {
  const ruler = document.getElementById('ruler');
  if (!ruler) return;
  const min = State._height.unit === 'cm' ? 140 : 55;
  ruler.scrollLeft = (State._height.val - min) * 14;
}

function rulerMouse(e) {
  const ruler = document.getElementById('ruler');
  if (!ruler) return;
  _rulerStartX      = e.clientX;
  _rulerStartScroll = ruler.scrollLeft;
  const move = ev => {
    ruler.scrollLeft = _rulerStartScroll + (_rulerStartX - ev.clientX);
    updateHeightFromRuler();
  };
  const up = () => {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
  };
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
}

function rulerTouch(e) {
  _rulerStartX      = e.touches[0].clientX;
  _rulerStartScroll = document.getElementById('ruler').scrollLeft;
}

function rulerMove(e) {
  const ruler = document.getElementById('ruler');
  if (!ruler) return;
  ruler.scrollLeft = _rulerStartScroll + (_rulerStartX - e.touches[0].clientX);
  updateHeightFromRuler();
}

function rulerEnd() {}

function updateHeightFromRuler() {
  const ruler = document.getElementById('ruler');
  if (!ruler) return;
  const h   = State._height;
  const min = h.unit === 'cm' ? 140 : 55;
  const max = h.unit === 'cm' ? 220 : 87;
  h.val = Math.max(min, Math.min(max, min + Math.round(ruler.scrollLeft / 14)));
  const disp = document.getElementById('h-display');
  if (disp) disp.innerHTML = `${h.val} <sup>${h.unit}</sup>`;
  saveHeightAnswer();
}

/* ── Hold-to-adjust ── */
let _adjTimer = null, _adjInterval = null;

function startAdj(type, dir) {
  const fn = type === 'weight' ? adjWeight : adjHeight;
  fn(dir);
  _adjTimer = setTimeout(() => {
    _adjInterval = setInterval(() => fn(dir), 80);
  }, 500);
}

function stopAdj() {
  clearTimeout(_adjTimer);
  clearInterval(_adjInterval);
}

function adjHeight(delta) {
  const min = State._height.unit === 'cm' ? 140 : 55;
  const max = State._height.unit === 'cm' ? 220 : 87;
  State._height.val = Math.max(min, Math.min(max, State._height.val + delta));
  const disp = document.getElementById('h-display');
  if (disp) disp.innerHTML = `${State._height.val} <sup>${State._height.unit}</sup>`;
  centerRuler();
  saveHeightAnswer();
}

/* ============================================================
   OPTION SELECTION
   ============================================================ */
function pickOpt(el, key, val, label, multi) {
  if (multi) {
    el.classList.toggle('sel');
    el.setAttribute('data-v', val);
    const sels = el.closest('.olist,.grid2,.grid4').querySelectorAll('.ocard.sel');
    State.answers[key] = {
      values: Array.from(sels).map(c => c.getAttribute('data-v')),
      labels: Array.from(sels).map(c => c.querySelector('.clabel')?.textContent || ''),
    };
    return;
  }

  el.parentElement.querySelectorAll('.ocard').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  State.answers[key] = { v: val, l: label };

  clearTimeout(window._autoNext);
  window._autoNext = setTimeout(() => nextStep(), 320);
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function nextStep() {
  if (State.step < STEPS.length - 1) {
    State.step++;

    // GA4 — rastreia qual etapa o usuário avançou
    const stepInfo = STEPS[State.step];
    gtag('event', 'quiz_step', {
      event_category: 'funil',
      event_label: stepInfo.key || stepInfo.type,
      step_number: State.step + 1,
    });

    renderStep();
    document.getElementById('s-quiz').scrollTop = 0;
  } else {
    startConfirmFlow();
  }
}

function prevStep() {
  if (State.step > 0) {
    State.step--;
    renderStep();
  }
}

/* ============================================================
   ANALYSIS SCREEN
   ============================================================ */
function startConfirmFlow() {
  // Build summary first
  document.getElementById('conf-name').textContent = State.name;
  let rows = `<div class="sum-row"><span class="sum-l">Nome</span><span class="sum-v">${State.name}</span></div>`;
  for (const [k, a] of Object.entries(State.answers)) {
    const label = LABELS[k] || k;
    const val   = a.values ? a.labels.join(', ') : a.l;
    rows += `<div class="sum-row"><span class="sum-l">${label}</span><span class="sum-v">${val}</span></div>`;
  }
  document.getElementById('sum-box').innerHTML = rows;

  // GA4 — concluiu todas as etapas do quiz
  gtag('event', 'quiz_complete', { event_category: 'funil', event_label: 'analise' });

  // Go to analysis screen
  document.getElementById('an-name').textContent = State.name;
  switchScreen('s-quiz', 's-analysis');
  runAnalysis();
}

function runAnalysis() {
  const steps = [
    { id: 'an-s1', status: 'an-s1-st', activeMsg: 'Analisando seu biotipo...',          doneMsg: 'Biotipo identificado ✓'      },
    { id: 'an-s2', status: 'an-s2-st', activeMsg: 'Cruzando seus objetivos...',          doneMsg: 'Objetivos definidos ✓'       },
    { id: 'an-s3', status: 'an-s3-st', activeMsg: 'Estruturando sua periodização...',    doneMsg: 'Treinos estruturados ✓'      },
    { id: 'an-s4', status: 'an-s4-st', activeMsg: 'Revisão final do plano...',           doneMsg: 'Plano pronto! ✓'             },
  ];

  const bar = document.getElementById('an-bar');
  const pct = document.getElementById('an-pct');
  let current = 0;

  function activateStep(i) {
    if (i >= steps.length) {
      document.getElementById('an-icon').textContent = '🏆';
      document.querySelector('.analysis-title h2').innerHTML = 'Plano <em>pronto</em>!';
      document.getElementById('an-subtitle').innerHTML =
        `Tudo certo, <strong>${State.name}</strong>. Seu plano de treino personalizado está pronto!`;
      setTimeout(() => {
        switchScreen('s-analysis', 's-confirm');
        initTestimonials();
      }, 900);
      return;
    }

    const s = steps[i];
    document.getElementById(s.id).classList.add('active');
    document.getElementById(s.status).textContent = s.activeMsg;

    const targetPct = Math.round(((i + 1) / steps.length) * 100);
    bar.style.width     = targetPct + '%';
    pct.textContent     = targetPct + '%';

    setTimeout(() => {
      document.getElementById(s.id).classList.remove('active');
      document.getElementById(s.id).classList.add('done');
      document.getElementById(s.status).textContent = s.doneMsg;
      current++;
      setTimeout(() => activateStep(current), 300);
    }, 900);
  }

  setTimeout(() => activateStep(0), 400);
}

/* ============================================================
   WHATSAPP SEND
   ============================================================ */
function sendWhatsApp() {
  const msg = document.getElementById('send-msg');
  showOverlay('Preparando mensagem...');

  // GA4 — clicou no botão WhatsApp (evento de conversão principal)
  gtag('event', 'whatsapp_click', {
    event_category: 'conversao',
    event_label: 'botao_whatsapp',
    value: 1,
  });
  // Marca também como conversão nativa do GA4
  gtag('event', 'generate_lead', { currency: 'BRL', value: 1 });

  const lines = [`• Nome: ${State.name}`];
  for (const [k, a] of Object.entries(State.answers)) {
    const val = a.values ? a.labels.join(', ') : a.l;
    lines.push(`• ${LABELS[k] || k}: ${val}`);
  }

  const mensagem =
`Olá Gabriel, gostaria de fazer uma avaliação e montar meu treino personalizado com você!

Segue meus dados pré preenchidos no site:
${lines.join('\n')}`;

  const text      = encodeURIComponent(mensagem);
  const isIOS     = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isMobile  = isIOS || isAndroid;

  // Abre a janela ANTES do setTimeout para Safari não bloquear
  let win = null;
  if (!isMobile) {
    win = window.open('', '_blank');
  }

  setTimeout(() => {
    hideOverlay();

    if (isIOS) {
      // iOS: tenta abrir o app via scheme, fallback para universal link
      window.location.href = `whatsapp://send?phone=${CONFIG.meuWhatsApp}&text=${text}`;
      setTimeout(() => {
        // Se o app não abriu em 1.5s, usa o link universal
        window.location.href = `https://wa.me/${CONFIG.meuWhatsApp}?text=${text}`;
      }, 1500);
    } else if (isAndroid) {
      window.location.href = `whatsapp://send?phone=${CONFIG.meuWhatsApp}&text=${text}`;
    } else {
      // Desktop — usa a janela já aberta
      if (win) win.location.href = `https://web.whatsapp.com/send?phone=${CONFIG.meuWhatsApp}&text=${text}`;
    }

    // GA4 — chegou na tela de agradecimento
    gtag('event', 'conversion_thanks', { event_category: 'funil', event_label: 'agradecimento' });

    switchScreen('s-confirm', 's-thanks');
  }, 1000);
}

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

/* ── Smooth Scroll Engine (estilo GSAP — lerp nativo) ──────
   Cada tela ativa recebe seu próprio estado de scroll.
   O conteúdo se move via transform (GPU-composited),
   sem tocar em scrollTop — zero layout thrashing.
   Inércia controlada por lerp com ease 0.085 (suave/elegante).
   ─────────────────────────────────────────────────────────── */
const SmoothScroll = (() => {
  const EASE        = 0.085;   // 0 = congelado, 1 = instantâneo
  const WHEEL_MULT  = 0.9;     // multiplicador da roda do mouse
  const TOUCH_MULT  = 1.0;     // multiplicador do toque

  let currentScreen = null;    // elemento .screen ativo
  let content       = null;    // elemento .screen-content
  let target        = 0;       // scroll desejado (destino)
  let current       = 0;       // scroll atual (interpolado)
  let maxScroll     = 0;       // limite máximo
  let rafId         = null;
  let touchStartY   = 0;
  let isRunning     = false;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function calcMax() {
    if (!content || !currentScreen) return 0;
    const contentH = content.scrollHeight;
    const screenH  = currentScreen.clientHeight;
    return Math.max(0, contentH - screenH);
  }

  function tick() {
    current = lerp(current, target, EASE);

    // Para o loop quando está próximo o suficiente
    if (Math.abs(target - current) < 0.05) {
      current = target;
      isRunning = false;
      rafId = null;
      applyTransform();
      return;
    }

    applyTransform();
    rafId = requestAnimationFrame(tick);
  }

  function applyTransform() {
    if (content) {
      content.style.transform = `translateY(${-current}px)`;
    }
  }

  function startLoop() {
    if (isRunning) return;
    isRunning = true;
    rafId = requestAnimationFrame(tick);
  }

  function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY * WHEEL_MULT;
    target = clamp(target + delta, 0, maxScroll);
    startLoop();
  }

  function onTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function onTouchMove(e) {
    const dy = (touchStartY - e.touches[0].clientY) * TOUCH_MULT;
    touchStartY = e.touches[0].clientY;
    target = clamp(target + dy, 0, maxScroll);
    startLoop();
  }

  function bind(screenEl) {
    // Limpar estado anterior
    if (currentScreen) {
      currentScreen.removeEventListener('wheel',      onWheel,      { passive: false });
      currentScreen.removeEventListener('touchstart', onTouchStart, { passive: true  });
      currentScreen.removeEventListener('touchmove',  onTouchMove,  { passive: true  });
    }
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

    currentScreen = screenEl;
    content       = screenEl.querySelector('.screen-content');
    target        = 0;
    current       = 0;
    isRunning     = false;

    if (!content) return;

    content.style.transform = 'translateY(0px)';

    // Aguarda dois frames + 200ms para fontes/imagens renderizarem
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        maxScroll = calcMax();
        // Segunda checagem após imagens carregarem
        setTimeout(() => { maxScroll = calcMax(); }, 400);
      });
    });

    // Recalcular ao redimensionar
    window.addEventListener('resize', () => {
      maxScroll = calcMax();
    });

    currentScreen.addEventListener('wheel',      onWheel,      { passive: false });
    currentScreen.addEventListener('touchstart', onTouchStart, { passive: true  });
    currentScreen.addEventListener('touchmove',  onTouchMove,  { passive: true  });
  }

  function reset() {
    target = 0; current = 0;
    if (content) content.style.transform = 'translateY(0px)';
  }

  return { bind, reset, recalc: () => { maxScroll = calcMax(); } };
})();

/* ── Stagger: adiciona classe no wrapper — CSS cuida do resto ── */
function staggerScreen(screenEl) {
  const content = screenEl.querySelector('.screen-content');
  if (!content) return;
  const inner = content.children[0];
  if (!inner) return;
  // Remove e re-adiciona para reiniciar animação
  inner.classList.remove('stagger-in');
  void inner.offsetWidth;
  inner.classList.add('stagger-in');
}

function switchScreen(fromId, toId) {
  const from = document.getElementById(fromId);
  const to   = document.getElementById(toId);

  from.classList.add('exit');
  SmoothScroll.reset();

  setTimeout(() => {
    from.classList.add('hidden');
    from.classList.remove('exit');
    to.classList.remove('hidden');

    // Bind do smooth scroll na nova tela
    SmoothScroll.bind(to);
    SmoothScroll.reset();

    // Stagger de entrada
    staggerScreen(to);
  }, 420);
}

function showOverlay(message) {
  document.getElementById('overlay-msg').textContent = message || '';
  document.getElementById('overlay').classList.add('show');
}

function hideOverlay() {
  document.getElementById('overlay').classList.remove('show');
}