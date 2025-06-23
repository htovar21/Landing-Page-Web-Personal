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
        // Calcular la posición considerando la altura de la navegación fija
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 20; // 20px de espacio adicional
        
        window.scrollTo({
          top: sectionTop,
          behavior: 'smooth'
        });
      }
    }
    navLinks.classList.remove('open');
  });
});
// Efecto de scroll para el header
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
// Navegación activa basada en scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const headerHeight = document.querySelector('.header').offsetHeight;
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerHeight - 50; // 50px de offset para mejor detección
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}
// Llamar a la función cuando se hace scroll
window.addEventListener('scroll', updateActiveNavLink);
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

// Función para cargar datos del perfil desde la API
async function loadProfileData() {
  try {
    const response = await fetch('/api/profile');
    if (!response.ok) {
      throw new Error('Error al cargar datos del perfil');
    }
    const profile = await response.json();
    
    // Actualizar el contenido del hero
    document.querySelector('.hero-content h1').textContent = `Hola, soy ${profile.name}`;
    document.querySelector('.hero-content p').textContent = profile.description;
    
    // Actualizar enlaces sociales
    const socialLinks = document.querySelectorAll('.hero-social a');
    socialLinks[0].href = profile.socialLinks.twitter;
    socialLinks[1].href = profile.socialLinks.github;
    socialLinks[2].href = profile.socialLinks.linkedin;
    
    // Actualizar imagen del hero
    document.querySelector('.hero-img img').src = profile.heroImage;
    
    // Actualizar sección "Sobre mí"
    document.querySelector('#about p').textContent = profile.about;
    
    // Actualizar tecnologías
    const techList = document.querySelector('.tech-list');
    techList.innerHTML = '';
    profile.technologies.forEach(tech => {
      const span = document.createElement('span');
      span.textContent = tech;
      techList.appendChild(span);
    });
    
    // Actualizar enlaces sociales del footer
    const footerSocialLinks = document.querySelectorAll('.footer-social a');
    footerSocialLinks[0].href = profile.socialLinks.twitter;
    footerSocialLinks[1].href = profile.socialLinks.github;
    footerSocialLinks[2].href = profile.socialLinks.linkedin;
    
  } catch (error) {
    console.error('Error cargando datos del perfil:', error);
  }
}

// Función para cargar proyectos desde la API
async function loadProjectsData() {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error('Error al cargar proyectos');
    }
    const projects = await response.json();
    
    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
      const projectCard = document.createElement('article');
      projectCard.className = 'project-card';
      projectCard.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <a class="project-btn" href="${project.githubUrl}" target="_blank" rel="noopener" aria-label="Ver más sobre ${project.title}">Ver más</a>
        </div>
      `;
      projectsGrid.appendChild(projectCard);
    });
    
  } catch (error) {
    console.error('Error cargando proyectos:', error);
  }
}

// Función para enviar mensaje de contacto
async function sendContactMessage(email, message) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, message })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al enviar mensaje');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Manejo del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
  // Cargar datos al iniciar la página
  loadProfileData();
  loadProjectsData();
  
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.querySelector('.form-status');
  
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validar que los campos no estén vacíos
    if (!email || !message) {
      formStatus.textContent = 'Por favor, completa todos los campos.';
      formStatus.className = 'form-status error';
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 3000);
      return;
    }
    
    // Mostrar estado de carga
    formStatus.textContent = 'Enviando mensaje...';
    formStatus.className = 'form-status loading';
    
    try {
      await sendContactMessage(email, message);
      
      // Mostrar éxito
      formStatus.textContent = '¡Mensaje enviado exitosamente!';
      formStatus.className = 'form-status success';
      
      // Limpiar formulario
      contactForm.reset();
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 3000);
      
    } catch (error) {
      // Mostrar error
      formStatus.textContent = `Error: ${error.message}`;
      formStatus.className = 'form-status error';
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 5000);
    }
  });
  
  // Menú móvil
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
  
  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
  
  // Smooth scrolling para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // Calcular la posición considerando la altura de la navegación fija
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetTop = target.offsetTop - headerHeight - 20; // 20px de espacio adicional
        
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}); 