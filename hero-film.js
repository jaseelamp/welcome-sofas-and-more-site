(() => {
  'use strict';
  const hero = document.querySelector('.hero-cinema');
  if (!hero) return;
  const film = document.querySelector('#hero-film');
  const chapters = [...document.querySelectorAll('[data-film-time]')];
  let visible = false;
  let pendingTime = null;
  let failed = false;
  // Muted inline playback applies to every screen size, including phones and tablets.
  film.muted = true;
  film.defaultMuted = true;
  document.querySelector('.film-chapters').hidden = false;

  async function play() {
    if (failed || !visible || document.hidden) return;
    try { await film.play(); }
    catch { /* Browser power-saving or autoplay policies may keep the poster visible. */ }
  }
  function syncPlayback() {
    if (visible && !document.hidden) play();
    else film.pause();
  }
  chapters.forEach(button => button.addEventListener('click', () => {
    pendingTime = Number(button.dataset.filmTime);
    if (film.readyState >= 1) { film.currentTime = pendingTime; pendingTime = null; }
    syncPlayback();
  }));
  film.addEventListener('loadedmetadata', () => {
    if (pendingTime !== null) { film.currentTime = pendingTime; pendingTime = null; }
  });
  film.addEventListener('playing', () => hero.classList.add('film-ready'));
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
    hero.classList.remove('film-ready');
    document.querySelector('.film-chapters').hidden = true;
    document.querySelector('#film-status').textContent = 'The craft film is unavailable. A still craft image is shown.';
  });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncPlayback();
  }, { threshold: 0.15 }).observe(hero);
  document.addEventListener('visibilitychange', syncPlayback);
  window.addEventListener('pageshow', syncPlayback);
  // If a browser blocks initial autoplay, retry after a normal page interaction.
  document.addEventListener('pointerdown', () => {
    if (film.paused) play();
  }, { passive: true });
})();
