/* LearnMate light/dark mode.
   Runs in <head> so the right theme is set before the first paint. */
(function () {
  var KEY = 'lm_theme';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  var choice = saved();
  var mode = choice === 'dark' || choice === 'light' ? choice : (mq && mq.matches ? 'dark' : 'light');
  root.dataset.mode = mode;

  function paint() {
    var dark = root.dataset.mode === 'dark';
    var label = dark ? 'Switch to light mode' : 'Switch to dark mode';
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', dark ? 'true' : 'false');
      buttons[i].setAttribute('aria-label', label);
      buttons[i].setAttribute('title', dark ? 'Light mode' : 'Dark mode');
    }
  }

  function toggle() {
    root.dataset.mode = root.dataset.mode === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, root.dataset.mode); } catch (e) {}
    paint();
  }

  function ready() {
    paint();
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) buttons[i].addEventListener('click', toggle);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();

  // Follow the OS setting until the visitor picks a side explicitly.
  if (mq) {
    var onChange = function (e) {
      if (saved()) return;
      root.dataset.mode = e.matches ? 'dark' : 'light';
      paint();
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();
