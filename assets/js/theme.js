// Tema Light/Dark cu memorare în localStorage + respectă preferințele OS
const root = document.documentElement;
const btn = document.getElementById('themeToggle');


function setTheme(t) { root.setAttribute('data-theme', t); localStorage.setItem('theme', t); }


(function initTheme(){
const saved = localStorage.getItem('theme');
if (saved) { setTheme(saved); return; }
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(prefersDark ? 'dark' : 'light');
})();


btn?.addEventListener('click', () => {
const current = root.getAttribute('data-theme');
setTheme(current === 'dark' ? 'light' : 'dark');
});