// Active link based on current page
(function() {
const path = location.pathname.split('/').pop();
document.querySelectorAll('.navbar .nav-link').forEach(a => {
const href = a.getAttribute('href');
if (href === path || (path === '' && href === 'index.html')) {
a.classList.add('active');
}
});
})();


// Year in footer
document.getElementById('year')?.append(new Date().getFullYear());


// Scroll buttons
const btnUp = document.getElementById('btnUp');
const btnDown = document.getElementById('btnDown');
btnUp?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
btnDown?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));


// Preferințe utilizator (index) – filtrare carduri după select + memorie
const prefSelect = document.getElementById('prefSelect');
function applyPreference() {
const pref = localStorage.getItem('pref') || 'toate';
if (prefSelect) prefSelect.value = pref;
document.querySelectorAll('#featuredCards [data-tag]')
.forEach(card => {
const tag = card.getAttribute('data-tag');
card.parentElement.style.display = (pref === 'toate' || tag === pref) ? '' : 'none';
});
}
if (prefSelect) {
prefSelect.addEventListener('change', e => {
localStorage.setItem('pref', e.target.value);
applyPreference();
});
applyPreference();
}

// Ascunde/arată rezumatul cardului când detaliile (collapse) se deschid/închid
document.addEventListener('shown.bs.collapse', (e) => {
  const cardBody = e.target.closest('.card-body');
  cardBody?.querySelector('.summary')?.classList.add('d-none');
});
document.addEventListener('hidden.bs.collapse', (e) => {
  const cardBody = e.target.closest('.card-body');
  cardBody?.querySelector('.summary')?.classList.remove('d-none');
});

