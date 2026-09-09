/* =========================================================
   STORM ALL STAR — comportamento da página
   Sem dependências. Tudo em JavaScript puro.
   ========================================================= */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var IG_URL = 'https://www.instagram.com/stormallstar/';
  var POR_PAGINA = 12;

  /* ---------------------------------------------------- preloader */
  function encerrarLoader() {
    var loader = $('#loader');
    if (!loader) return;
    setTimeout(function () {
      loader.classList.add('is-done');
      setTimeout(function () { loader.remove(); }, 600);
    }, reduzido ? 0 : 900);
  }
  window.addEventListener('load', encerrarLoader);
  setTimeout(encerrarLoader, 4000); // rede lenta não pode travar a página

  /* ---------------------------------------------------- ano no rodapé */
  var ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------------------------------------------------- nav + barra de progresso */
  var nav = $('#nav');
  var barra = $('.progress__bar');

  function aoRolar() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('is-stuck', y > 40);
    if (barra) {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.width = (total > 0 ? (y / total) * 100 : 0) + '%';
    }
  }
  var esperando = false;
  window.addEventListener('scroll', function () {
    if (esperando) return;
    esperando = true;
    requestAnimationFrame(function () { aoRolar(); esperando = false; });
  }, { passive: true });
  aoRolar();

  /* ---------------------------------------------------- menu mobile */
  var burger = $('#burger');
  var menu = $('#menu');

  function fecharMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('is-locked');
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var abrindo = menu.hidden;
      menu.hidden = !abrindo;
      burger.setAttribute('aria-expanded', String(abrindo));
      burger.setAttribute('aria-label', abrindo ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('is-locked', abrindo);
      if (abrindo) {
        $$('a', menu).forEach(function (a, i) { a.style.animationDelay = (0.05 + i * 0.045) + 's'; });
      }
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', fecharMenu); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { fecharAno(); fecharMenu(); }
    if (modal && !modal.hidden) {
      if (e.key === 'ArrowLeft' && anoAtual > 0) pintarAno(anoAtual - 1);
      if (e.key === 'ArrowRight' && anoAtual < botoesAno.length - 1) pintarAno(anoAtual + 1);
    }
  });

  /* ---------------------------------------------------- ticker infinito */
  /* A faixa só emenda sem buraco se o conteúdo for mais largo que a tela.
     Em monitores grandes as duas cópias do HTML não bastam, então
     duplicamos até passar de 2× a largura da janela e mantemos a
     velocidade constante em px/s. */
  var trilho = $('.ticker__track');

  function ajustarTicker() {
    if (!trilho) return;
    if (!trilho.dataset.base) trilho.dataset.base = trilho.innerHTML;
    trilho.innerHTML = trilho.dataset.base;
    var limite = window.innerWidth * 2;
    var voltas = 0;
    while (trilho.scrollWidth < limite && voltas++ < 8) {
      trilho.innerHTML += trilho.dataset.base;
    }
    trilho.style.animationDuration = Math.max(18, (trilho.scrollWidth / 2) / 110) + 's';
  }

  ajustarTicker();
  window.addEventListener('load', ajustarTicker);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarTicker);

  var timerTicker;
  window.addEventListener('resize', function () {
    clearTimeout(timerTicker);
    timerTicker = setTimeout(ajustarTicker, 250);
  });

  /* ---------------------------------------------------- linha do tempo: popup do ano */
  /* O conteúdo de cada ano mora no HTML (dentro de .anos-fonte, oculto) e é
     clonado para dentro do modal. Assim existe uma cópia só, indexável. */
  var botoesAno  = $$('.ano');
  var modal      = $('#modal');
  var modalAno   = $('#modalAno');
  var modalCorpo = $('#modalCorpo');
  var btnAnt     = $('#modalAnt');
  var btnProx    = $('#modalProx');
  var anoAtual   = 0;

  function pintarAno(i) {
    var origem = document.getElementById(botoesAno[i].getAttribute('data-ano'));
    if (!origem) return;
    anoAtual = i;
    modalAno.textContent = origem.getAttribute('data-rotulo') || '';
    var copia = origem.cloneNode(true);
    copia.removeAttribute('id');            // evita id duplicado no documento
    modalCorpo.innerHTML = '';
    modalCorpo.appendChild(copia);
    modalCorpo.scrollTop = 0;
    btnAnt.disabled  = i === 0;
    btnProx.disabled = i === botoesAno.length - 1;
  }

  function abrirAno(i) {
    if (!modal) return;
    pintarAno(i);
    modal.hidden = false;
    document.body.classList.add('is-locked');
    $('#modalX').focus();
  }

  function fecharAno() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modalCorpo.innerHTML = '';
    document.body.classList.remove('is-locked');
    if (botoesAno[anoAtual]) botoesAno[anoAtual].focus();
  }

  botoesAno.forEach(function (b, i) {
    b.addEventListener('click', function () { abrirAno(i); });
  });

  if (modal) {
    $('#modalX').addEventListener('click', fecharAno);
    btnAnt.addEventListener('click', function () { if (anoAtual > 0) pintarAno(anoAtual - 1); });
    btnProx.addEventListener('click', function () { if (anoAtual < botoesAno.length - 1) pintarAno(anoAtual + 1); });
    modal.addEventListener('click', function (e) { if (e.target === modal) fecharAno(); });
  }

  /* ---------------------------------------------------- reveal no scroll */
  var alvos = $$('.reveal');
  if (reduzido || !('IntersectionObserver' in window)) {
    alvos.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ---------------------------------------------------- contadores */
  var contadores = $$('[data-count]');
  if (contadores.length && !reduzido && 'IntersectionObserver' in window) {
    var obsNum = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        obsNum.unobserve(e.target);
        var alvo = parseInt(e.target.getAttribute('data-count'), 10);
        if (isNaN(alvo)) return;
        var inicio = alvo > 100 ? alvo - 40 : 0;
        var t0 = null;
        var passo = function (t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1200, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          e.target.textContent = Math.round(inicio + (alvo - inicio) * eased);
          if (p < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      });
    }, { threshold: 0.5 });
    contadores.forEach(function (el) { obsNum.observe(el); });
  }

  /* ====================================================================
     INSTAGRAM — grade montada a partir de assets/js/posts.js
     Cada bloco é um link direto para a publicação original.
     ==================================================================== */
  var posts = Array.isArray(window.STORM_POSTS) ? window.STORM_POSTS : [];
  var grade = $('#igGrid');
  var btnMais = $('#igMais');
  var filtroAtual = 'todos';
  var mostrando = POR_PAGINA;

  function listaFiltrada() {
    if (filtroAtual === 'todos') return posts;
    return posts.filter(function (p) { return p.tipo === filtroAtual; });
  }

  function linkDoPost(p) {
    return 'https://www.instagram.com/' + (p.tipo === 'reel' ? 'reel' : 'p') + '/' + p.code + '/';
  }

  function resumo(texto) {
    var t = String(texto || '').replace(/\s+/g, ' ').trim();
    return t.length > 150 ? t.slice(0, 150).trim() + '…' : t;
  }

  function montarGrade() {
    if (!grade) return;
    var lista = listaFiltrada().slice(0, mostrando);
    grade.innerHTML = '';

    lista.forEach(function (p) {
      var a = document.createElement('a');
      a.className = 'ig';
      a.href = linkDoPost(p);
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', 'Abrir no Instagram a publicação de ' + p.data + ': ' + resumo(p.texto).slice(0, 90));

      var img = document.createElement('img');
      img.src = p.img;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = '';
      if (p.w && p.h) { img.width = p.w; img.height = p.h; }  // reserva o espaço
      a.appendChild(img);

      if (p.tipo === 'reel') {
        var badge = document.createElement('span');
        badge.className = 'ig__badge';
        badge.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
        a.appendChild(badge);
      }

      var over = document.createElement('span');
      over.className = 'ig__over';

      var txt = document.createElement('span');
      txt.className = 'ig__txt';
      txt.textContent = resumo(p.texto);

      var meta = document.createElement('span');
      meta.className = 'ig__meta';
      meta.textContent = p.data + ' · ' + p.likes + ' curtidas';

      var abrir = document.createElement('span');
      abrir.className = 'ig__abrir';
      abrir.textContent = 'Ver no Instagram →';

      over.appendChild(txt);
      over.appendChild(meta);
      over.appendChild(abrir);
      a.appendChild(over);

      grade.appendChild(a);
    });

    if (btnMais) btnMais.parentElement.hidden = mostrando >= listaFiltrada().length;
  }

  $$('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      $$('.chip').forEach(function (c) { c.classList.remove('is-on'); });
      chip.classList.add('is-on');
      filtroAtual = chip.getAttribute('data-filtro');
      mostrando = POR_PAGINA;
      montarGrade();
    });
  });

  if (btnMais) {
    btnMais.addEventListener('click', function () {
      mostrando += POR_PAGINA;
      montarGrade();
    });
  }

  montarGrade();

  /* ---------------------------------------------------- fallback do perfil */
  if (!posts.length && grade) {
    grade.innerHTML = '<p style="color:#8E979E">Não foi possível carregar as publicações. ' +
      'Veja tudo direto em <a href="' + IG_URL + '" target="_blank" rel="noopener" style="color:#2FD9C8">@stormallstar</a>.</p>';
    if (btnMais) btnMais.parentElement.hidden = true;
  }
})();
