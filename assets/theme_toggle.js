// Theme toggle for 'Noite Cósmica' psychedelic night
(function(){
  const BTN_ID = 'theme-toggle-btn';
  const THEME_CLASS = 'theme-psychedelic-night';
  const STORAGE_KEY = 'theme-psychedelic-night-enabled';

  function setTheme(enabled) {
    if (enabled) {
      document.body.classList.add(THEME_CLASS);
      const btn = document.getElementById(BTN_ID);
      if (btn) btn.classList.add('theme-on');
      localStorage.setItem(STORAGE_KEY, '1');
    } else {
      document.body.classList.remove(THEME_CLASS);
      const btn = document.getElementById(BTN_ID);
      if (btn) btn.classList.remove('theme-on');
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById(BTN_ID);
    if (!btn) return;

    // initialize from storage (default: off)
    const enabled = !!localStorage.getItem(STORAGE_KEY);
    setTheme(enabled);

    btn.addEventListener('click', () => {
      const isEnabled = document.body.classList.contains(THEME_CLASS);
      setTheme(!isEnabled);
    });
  });
})();
