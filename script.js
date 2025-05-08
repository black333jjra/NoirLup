const menuToggle = document.getElementById("menu-toggle");
const navbarLinks = document.getElementById("navbar-links");
const menuOverlay = document.getElementById("menu-overlay");
const closeMenu = document.getElementById("close-menu");
const navLinks = document.querySelectorAll('.navbar a');
const track = document.querySelector('.carousel-track');
const dots = document.querySelectorAll('.dot');
let startX, currentTranslate, isDragging = false;

// Función para abrir el menú
function openMenu() {
  navbarLinks.classList.add("active");
  menuOverlay.classList.add("active");
  menuToggle.classList.add("active");
  menuToggle.setAttribute("aria-expanded", "true");
}

// Función para cerrar el menú
function closeMenuFn() {
  navbarLinks.classList.remove("active");
  menuOverlay.classList.remove("active");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
}

// Añadir eventos de abrir/cerrar menú
menuToggle.addEventListener("click", openMenu);
closeMenu.addEventListener("click", closeMenuFn);
menuOverlay.addEventListener("click", closeMenuFn);

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
  link.addEventListener("click", closeMenuFn);
});

// Año automático
document.getElementById("year").textContent = new Date().getFullYear();

// Hover personalizado
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.classList.add('hover-effect');
  });
  link.addEventListener('mouseleave', () => {
    link.classList.remove('hover-effect');
  });
});

// Función para actualizar la posición del carrusel
const updateCarouselPosition = (index) => {
  const translateX = -index * 100;
  track.style.transform = `translateX(${translateX}vw)`;

  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
};

// Función para detectar el inicio del deslizamiento
const startDrag = (e) => {
  isDragging = true;
  startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  currentTranslate = parseInt(track.style.transform.replace('translateX(', '').replace('vw)', '')) || 0;
};

// Función para mover el carrusel mientras se está deslizando
const dragMove = (e) => {
  if (!isDragging) return;
  const moveX = (e.type.includes('touch') ? e.touches[0].clientX : e.clientX) - startX;
  track.style.transform = `translateX(${currentTranslate + (moveX / window.innerWidth) * 100}vw)`;
};

// Función para finalizar el deslizamiento
const endDrag = () => {
  if (!isDragging) return;
  isDragging = false;

  const translateXValue = parseInt(track.style.transform.replace('translateX(', '').replace('vw)', ''));
  const newIndex = Math.round(-translateXValue / 100);
  updateCarouselPosition(newIndex);
};

// Eventos para deslizamiento
track.addEventListener('mousedown', startDrag);
track.addEventListener('touchstart', startDrag);

window.addEventListener('mousemove', dragMove);
window.addEventListener('touchmove', dragMove);

window.addEventListener('mouseup', endDrag);
window.addEventListener('touchend', endDrag);

// Funcionalidad de los puntos
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.dataset.index);
    updateCarouselPosition(index);
  });
});

// Inicializa el carrusel en el primer punto
updateCarouselPosition(0);

// Carrusel automático
let currentIndex = 0;
const totalImages = track.children.length;

setInterval(() => {
  currentIndex = (currentIndex + 1) % totalImages;
  updateCarouselPosition(currentIndex);
}, 4500);
