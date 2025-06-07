function revealOnScroll() {
  const elements = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;
  const revealPoint = 150;

  elements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); // Ativa animação inicial