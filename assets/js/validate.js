// Bootstrap validation + mesaj de succes (simulat)
(() => {
const form = document.getElementById('contactForm');
if (!form) return;
form.addEventListener('submit', evt => {
if (!form.checkValidity()) {
evt.preventDefault();
evt.stopPropagation();
} else {
evt.preventDefault();
const alert = document.getElementById('formAlert');
alert.classList.remove('d-none');
form.reset();
form.classList.remove('was-validated');
return;
}
form.classList.add('was-validated');
});
})();