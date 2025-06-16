// Menú responsive
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Cierra el menú al hacer click en un enlace (en móvil)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    // Scroll suave
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    navLinks.classList.remove('open');
  });
});
// Validación simple del formulario de contacto
const contactForm = document.getElementById('contactForm');
const formStatus = document.querySelector('.form-status');
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  if (!email || !message) {
    formStatus.textContent = 'Por favor, completa todos los campos.';
    return;
  }
  formStatus.textContent = '¡Gracias por tu mensaje! (Simulación)';
  contactForm.reset();
  setTimeout(() => formStatus.textContent = '', 3500);
});
// Animación fade-in para secciones al hacer scroll
const observer = new window.IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
}); 