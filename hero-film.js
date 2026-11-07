(() => {
  'use strict';
  const hero = document.querySelector('.hero-cinema');
  if (!hero) return;
  const film = document.querySelector('#hero-film');
  const toggle = document.querySelector('#film-toggle');
  const chapters = [...document.querySelectorAll('[data-film-time]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const smallScreen = matchMedia('(max-width: 760px)');
  const connection = navigator.connection;
  const shouldAutoplay = () => !reducedMotion.matches && !smallScreen.matches && !connection?.saveData && !/2g/.test(connection?.effectiveType || '');
  let wantsPlayback = shouldAutoplay();
  let visible = false;
  let pendingTime = null;
  let failed = false;
  let userChoice = false;
  toggle.hidden = false;
  document.querySelector('.film-chapters').hidden = false;

  function updateControl() {
    const playing = !film.paused && !film.ended;
    toggle.querySelector('.film-toggle-label').textContent = playing ? 'Pause film' : 'Play craft film';
    toggle.querySelector('.film-toggle-icon').textContent = playing ? 'Ⅱ' : '▶';
    toggle.setAttribute('aria-label', playing ? 'Pause craft film' : 'Play craft film');
  }
  function ensureSource() {
    if (film.getAttribute('src')) return;
    film.src = film.dataset.src;
    film.muted = true;
    film.load();
  }
  async function play() {
    if (failed || !visible || document.hidden) return;
    ensureSource();
    try { await film.play(); }
    catch { updateControl(); } // The poster and manual play control remain usable if autoplay is blocked.
  }
  function syncPlayback() {
    if (wantsPlayback && visible && !document.hidden) play();
    else film.pause();
  }
  toggle.addEventListener('click', () => {
    userChoice = true;
    wantsPlayback = film.paused;
    syncPlayback();
  });
  chapters.forEach(button => button.addEventListener('click', () => {
    userChoice = true;
    pendingTime = Number(button.dataset.filmTime);
    wantsPlayback = true;
    ensureSource();
    if (film.readyState >= 1) { film.currentTime = pendingTime; pendingTime = null; }
    syncPlayback();
  }));
  film.addEventListener('loadedmetadata', () => {
    if (pendingTime !== null) { film.currentTime = pendingTime; pendingTime = null; }
  });
  film.addEventListener('playing', () => { hero.classList.add('film-ready'); updateControl(); });
  film.addEventListener('pause', updateControl);
  film.addEventListener('timeupdate', () => {
    const time = film.currentTime;
    const active = time >= 11.4 ? 2 : time >= 5.8 ? 1 : 0;
    chapters.forEach((button, index) => {
      button.setAttribute('aria-pressed', String(index === active));
      const start = Number(button.dataset.filmTime);
      const end = index === 2 ? film.duration : Number(chapters[index + 1].dataset.filmTime);
      const progress = index < active ? 1 : index > active ? 0 : Math.min(1, Math.max(0, (time - start) / (end - start)));
      button.style.setProperty('--chapter-progress', String(progress));
    });
  });
  film.addEventListener('error', () => {
    failed = true;
    wantsPlayback = false;
    hero.classList.remove('film-ready');
    toggle.hidden = true;
    document.querySelector('.film-chapters').hidden = true;
    document.querySelector('#film-status').textContent = 'The craft film is unavailable. A still craft image is shown.';
  });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncPlayback();
  }, { threshold: 0.15 }).observe(hero);
  document.addEventListener('visibilitychange', syncPlayback);
  const policyChanged = () => {
    if (reducedMotion.matches || !userChoice) wantsPlayback = shouldAutoplay();
    syncPlayback();
  };
  reducedMotion.addEventListener('change', policyChanged);
  smallScreen.addEventListener('change', policyChanged);
  connection?.addEventListener('change', policyChanged);
  updateControl();
})();
