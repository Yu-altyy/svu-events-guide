document.addEventListener('DOMContentLoaded', function () {
  // year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Slider behavior =====
  const slider = document.getElementById('featuredSlider');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  let autoTimer = null;
  const AUTO_DELAY = 4000;

  function slideNext() {
    if (!slider) return;
    const slides = slider.querySelectorAll('.card');
    if (!slides.length) return;

    const gap = parseInt(getComputedStyle(slider).gap || 20, 10) || 20;
    const cardWidth = slides[0].offsetWidth + gap;

    if (Math.round(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth - 5) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }

  function slidePrev() {
    if (!slider) return;
    const slides = slider.querySelectorAll('.card');
    if (!slides.length) return;

    const gap = parseInt(getComputedStyle(slider).gap || 20, 10) || 20;
    const cardWidth = slides[0].offsetWidth + gap;

    if (slider.scrollLeft <= 0) {
      slider.scrollTo({ left: slider.scrollWidth - slider.clientWidth, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(slideNext, AUTO_DELAY);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function restartAuto() {
    stopAuto();
    setTimeout(startAuto, 1500);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { slideNext(); restartAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { slidePrev(); restartAuto(); });

  if (slider) {
    startAuto();

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('touchstart', stopAuto, { passive: true });
    slider.addEventListener('touchend', () => {
      setTimeout(startAuto, 2000);
    }, { passive: true });
  }

  // badges visual toggle
  document.querySelectorAll('.badge').forEach(badge => {
    badge.addEventListener('click', () => {
      document.querySelectorAll('.badge').forEach(item => item.classList.remove('active'));
      badge.classList.add('active');
    });
  });

  // ===== Contact Form Validation =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      if (!name || !email || !message) {
        showAlert('يرجى ملء جميع الحقول المطلوبة', 'danger');
        return;
      }

      if (!validateEmail(email)) {
        showAlert('يرجى إدخال بريد إلكتروني صحيح', 'danger');
        return;
      }

      showAlert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
      this.reset();
    });
  }

  // ===== Dark Mode =====
  const darkModeBtn = document.getElementById('darkModeBtn');
  const body = document.body;

  if (darkModeBtn) {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      body.setAttribute('data-theme', 'dark');
    }

    darkModeBtn.addEventListener('click', function () {
      if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
});

// Show alert function
function showAlert(message, type) {
  const existingAlerts = document.querySelectorAll('.alert');
  existingAlerts.forEach(alert => alert.remove());

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  const form = document.getElementById('contactForm');
  if (form) {
    form.parentNode.insertBefore(alertDiv, form.nextSibling);
  }

  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

// Email validation function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}