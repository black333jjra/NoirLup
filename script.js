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

// ==== CARRUSEL ====
const track = document.querySelector('.carousel-track');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const images = track.querySelectorAll('img');

let currentIndex = 0;
let isDragging = false;
let startX = 0;
let startY = 0; // Agregamos la coordenada Y para el deslizamiento vertical
let currentTranslate = 0;
let autoSlide;
let isVerticalSwipe = false; // Variable para verificar si el deslizamiento es vertical

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
  startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
  currentTranslate = -currentIndex * images[0].clientWidth;
}

function dragMove(e) {
  if (!isDragging) return;
  const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const y = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
  const moveX = x - startX;
  const moveY = y - startY;

  // Detectar deslizamiento vertical (hacia abajo)
  if (Math.abs(moveY) > Math.abs(moveX)) {
    isVerticalSwipe = true;
    track.style.transform = `translateY(${moveY}px)`; // Desplazamiento vertical
  }
}

function endDrag(e) {
  if (!isDragging) return;
  isDragging = false;
  const slideWidth = images[0].clientWidth;
  const movedX = (e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX) - startX;
  const movedY = (e.type.includes('touch') ? e.changedTouches[0].clientY : e.clientY) - startY;

  // Verificar si se ha deslizad hacia abajo
  if (isVerticalSwipe && movedY > 50) { // Se detectó un deslizamiento hacia abajo
    startAutoSlide();
  }

  isVerticalSwipe = false; // Reiniciar la variable
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
  }, 4500);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

// Inicialización
updateCarouselPosition(0);
startAutoSlide();
window.addEventListener('resize', () => updateCarouselPosition(currentIndex));
