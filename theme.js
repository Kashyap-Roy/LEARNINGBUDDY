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

  function updateIcons(dark) {
    var ico = document.getElementById('favicon-ico') || document.querySelector('link[rel="icon"][sizes="any"]');
    if (ico) ico.href = dark ? 'assets/favicon-dark.ico' : 'favicon.ico';

    var f32 = document.getElementById('favicon-32') || document.querySelector('link[rel="icon"][sizes="32x32"]');
    if (f32) f32.href = dark ? 'assets/favicon-dark-32x32.png' : 'assets/favicon-32x32.png';

    var f16 = document.getElementById('favicon-16') || document.querySelector('link[rel="icon"][sizes="16x16"]');
    if (f16) f16.href = dark ? 'assets/favicon-dark-16x16.png' : 'assets/favicon-16x16.png';

    var fmark = document.getElementById('favicon-mark') || document.querySelector('link[rel="icon"]:not([sizes])');
    if (fmark) fmark.href = dark ? 'assets/logo-mark-dark.png' : 'assets/logo-mark.png';

    var apple = document.getElementById('apple-touch-icon') || document.querySelector('link[rel="apple-touch-icon"]');
    if (apple) apple.href = dark ? 'assets/apple-touch-icon-dark.png' : 'assets/apple-touch-icon.png';

    var brandMarks = document.querySelectorAll('.brand-mark');
    for (var i = 0; i < brandMarks.length; i++) {
      brandMarks[i].src = dark ? 'assets/logo-mark-dark.png' : 'assets/logo-mark.png';
    }

    var logos = document.querySelectorAll('.logo');
    for (var j = 0; j < logos.length; j++) {
      logos[j].src = dark ? 'assets/logo-dark.png' : 'assets/logo.png';
    }
  }

  function paint() {
    var dark = root.dataset.mode === 'dark';
    var label = dark ? 'Switch to light mode' : 'Switch to dark mode';
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', dark ? 'true' : 'false');
      buttons[i].setAttribute('aria-label', label);
      buttons[i].setAttribute('title', dark ? 'Light mode' : 'Dark mode');
    }
    updateIcons(dark);
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

  try { updateIcons(root.dataset.mode === 'dark'); } catch (e) {}

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
