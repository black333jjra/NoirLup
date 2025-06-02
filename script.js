// ==== MENÚ RESPONSIVE ====
const menuToggle = document.getElementById("menu-toggle");
const navbarLinks = document.getElementById("navbar-links");
const menuOverlay = document.getElementById("menu-overlay");
const closeMenu = document.getElementById("close-menu");
const navLinks = document.querySelectorAll('.navbar a');

function openMenu() {
  navbarLinks.classList.add("active");
  menuOverlay.classList.add("active");
  menuToggle.classList.add("active");
  menuToggle.setAttribute("aria-expanded", "true");
}

function closeMenuFn() {
  navbarLinks.classList.remove("active");
  menuOverlay.classList.remove("active");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", openMenu);
closeMenu.addEventListener("click", closeMenuFn);
menuOverlay.addEventListener("click", closeMenuFn);

navLinks.forEach(link => {
  link.addEventListener("click", closeMenuFn);
});

// ==== AÑO AUTOMÁTICO ====
document.getElementById("year").textContent = new Date().getFullYear();

// ==== HOVER PERSONALIZADO ====
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => link.classList.add('hover-effect'));
  link.addEventListener('mouseleave', () => link.classList.remove('hover-effect'));
});

// ==== CARRUSELES ====
function initializeCarousel(carouselElement) {
  const track = carouselElement.querySelector('.carousel-track');
  const dots = carouselElement.querySelectorAll('.dot');
  const prevBtn = carouselElement.querySelector('.carousel-btn.prev');  // CORREGIDO
  const nextBtn = carouselElement.querySelector('.carousel-btn.next');  // CORREGIDO
  const images = track.querySelectorAll('img');

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let autoSlide;

  // Actualizar posición del carrusel
  function updateCarouselPosition(index) {
    const slideWidth = images[0].clientWidth;
    track.style.transform = `translateX(-${slideWidth * index}px)`;
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
    currentIndex = index;
  }

  // Botones de navegación
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      const index = (currentIndex - 1 + images.length) % images.length;
      updateCarouselPosition(index);
      resetAutoSlide();
    });

    nextBtn.addEventListener("click", () => {
      const index = (currentIndex + 1) % images.length;
      updateCarouselPosition(index);
      resetAutoSlide();
    });
  }

  // Puntos (dots)
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      updateCarouselPosition(index);
      resetAutoSlide();
    });
  });

  // Deslizamiento táctil y con mouse
  function startDrag(e) {
    isDragging = true;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    currentTranslate = -currentIndex * images[0].clientWidth;
  }

  function dragMove(e) {
    if (!isDragging) return;
    const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const moveX = x - startX;
    track.style.transform = `translateX(${currentTranslate + moveX}px)`;
  }

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    const slideWidth = images[0].clientWidth;
    const movedX = (e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX) - startX;
    if (movedX < -50 && currentIndex < images.length - 1) {
      currentIndex++;
    } else if (movedX > 50 && currentIndex > 0) {
      currentIndex--;
    }
    updateCarouselPosition(currentIndex);
    resetAutoSlide();
  }

  // Eventos de arrastre
  track.addEventListener('mousedown', startDrag);
  track.addEventListener('touchstart', startDrag, { passive: true });

  window.addEventListener('mousemove', dragMove);
  window.addEventListener('touchmove', dragMove, { passive: true });

  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);

  // Auto-slide
  function startAutoSlide() {
    autoSlide = setInterval(() => {
      const next = (currentIndex + 1) % images.length;
      updateCarouselPosition(next);
    }, 4000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
  }

  // Inicialización
  updateCarouselPosition(0);
  startAutoSlide();
  window.addEventListener('resize', () => updateCarouselPosition(currentIndex));
}

// Inicializar todos los carruseles
document.querySelectorAll('.carousel').forEach(carousel => {
  initializeCarousel(carousel);
});

//Animaciones de pantalla
const elementos = document.querySelectorAll('.animar, [class*="fade-scroll"]');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Quitar hidden y añadir visible para animar la entrada
      entry.target.classList.remove('hidden');
      entry.target.classList.add('visible');

      // Si tiene clase animar, dejar de observar (animación solo una vez)
      if (entry.target.classList.contains('animar')) {
        observer.unobserve(entry.target);
      }
    } else {
      // Solo para fade-scroll quitar visible y añadir hidden (animación repetida)
      if (entry.target.classList.contains('fade-scroll') || 
          [...entry.target.classList].some(cls => cls.startsWith('fade-scroll'))) {
        entry.target.classList.add('hidden');
        entry.target.classList.remove('visible');
      }
    }
  });
}, {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
});

// Inicializar: ocultar todos los fade-scroll y animar todos
elementos.forEach(el => {
  if (el.classList.contains('fade-scroll') || [...el.classList].some(cls => cls.startsWith('fade-scroll'))) {
    el.classList.add('hidden');
  }
  observer.observe(el);
});
// Forzar animación en elementos visibles al cargar la página
window.addEventListener('load', () => {
  elementos.forEach(el => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      el.classList.remove('hidden');
      el.classList.add('visible');
    }
  });
});
