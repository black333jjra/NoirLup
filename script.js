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

// ==== HOVER PERSONALIZADO (si no se usa en CSS) ====
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => link.classList.add('hover-effect'));
  link.addEventListener('mouseleave', () => link.classList.remove('hover-effect'));
});

// ==== CARRUSELES ====
function initializeCarousel(carouselElement) {
  const track = carouselElement.querySelector('.carousel-track');
  const dots = carouselElement.querySelectorAll('.dot');
  const prevBtn = carouselElement.querySelector('.carousel-btn.prev');
  const nextBtn = carouselElement.querySelector('.carousel-btn.next');
  const images = track.querySelectorAll('img');

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let autoSlide;
  let resizeTimeout;

function updateCarouselPosition(index) {
  const slideWidth = images[0].clientWidth;
  track.style.transform = `translateX(-${slideWidth * index}px)`;
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[index % images.length]) {
    dots[index % images.length].classList.add('active');
  }
  currentIndex = index % images.length;
}

  function goToSlide(index) {
    updateCarouselPosition(index);
    resetAutoSlide();
  }

  // Botones de navegación
  prevBtn?.addEventListener("click", () => {
    goToSlide((currentIndex - 1 + images.length) % images.length);
  });

nextBtn?.addEventListener("click", () => {
  if (currentIndex === images.length - 1) {
    updateCarouselPosition(currentIndex + 1);
    setTimeout(() => {
      track.style.transition = 'none';
      updateCarouselPosition(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track.style.transition = '';
        });
      });
    }, 500);
  } else {
    goToSlide(currentIndex + 1);
  }
});

  // Puntos (dots)
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      goToSlide(index);
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

  track.addEventListener('mousedown', startDrag);
  track.addEventListener('touchstart', startDrag, { passive: true });

  window.addEventListener('mousemove', dragMove);
  window.addEventListener('touchmove', dragMove, { passive: true });

  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);

  // Auto-slide
function startAutoSlide() {
  autoSlide = setInterval(() => {
    if (currentIndex === images.length - 1) {
      // Ir a la última imagen con animación
      updateCarouselPosition(currentIndex + 1);

      // Después del slide animado, cortar la animación y volver a 0 sin que se note
      setTimeout(() => {
        track.style.transition = 'none';
        updateCarouselPosition(0);
        // Reforzamos transición después del salto
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            track.style.transition = '';
          });
        });
      }, 500); // tiempo igual a tu transición en CSS
    } else {
      updateCarouselPosition(currentIndex + 1);
    }
  }, 4000);
}

  function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
  }

  // Reajuste con debounce en resize
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarouselPosition(currentIndex);
    }, 200);
  });

  updateCarouselPosition(0);
  startAutoSlide();
}

// ==== ANIMACIONES DE ENTRADA ====
const elementos = document.querySelectorAll('.animar, [class*="fade-scroll"]');

// Ocultar todos inicialmente
elementos.forEach(el => el.classList.add('hidden'));

// IntersectionObserver para aplicar las clases
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;

    if (entry.isIntersecting) {
      el.classList.remove('hidden');
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
      el.classList.add('hidden');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
});

// Observar todos
elementos.forEach(el => observer.observe(el));

// ✅ Forzar animación de los que ya son visibles al cargar
window.addEventListener('load', () => {
  elementos.forEach(el => {
    const rect = el.getBoundingClientRect();
    const yaVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (yaVisible) {
      el.classList.remove('hidden');
      el.classList.add('visible');
    }
  });
});

document.querySelectorAll('.mini-carousel').forEach(carousel => {
  initializeCarousel(carousel);
});
