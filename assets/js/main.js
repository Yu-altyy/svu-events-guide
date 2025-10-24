document.addEventListener('DOMContentLoaded', function () {
  // year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Slider behavior =====
  const slider = document.getElementById('featuredSlider');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  let autoTimer = null;
  const AUTO_DELAY = 4000; // ms

  function slideNext() {
    if (!slider) return;
    const slides = slider.querySelectorAll('.card');
    if (!slides.length) return;

    const gap = parseInt(getComputedStyle(slider).gap || 20, 10) || 20;
    const cardWidth = slides[0].offsetWidth + gap;

    // If we reach the end, we jump to the beginning smoothly.
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

  if (nextBtn) nextBtn.addEventListener('click', () => { slideNext(); restartAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { slidePrev(); restartAuto(); });

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(slideNext, AUTO_DELAY);
  }
  function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
  function restartAuto() { stopAuto(); setTimeout(startAuto, 1500); }

  if (slider) {
    startAuto();

    // Stop auto when interacting manually, then restart after a while
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    // For mobile: stop on touch start, then restart after a while
    slider.addEventListener('touchstart', stopAuto, {passive:true});
    slider.addEventListener('touchend', () => { setTimeout(startAuto, 2000); }, {passive:true});
  }

  // badges visual toggle
  document.querySelectorAll('.badge').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.badge').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    });
  });

  // ===== Contact Form Validation =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
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

  // ===== Event Filtering =====
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const dateFilter = document.getElementById('dateFilter');

  if (searchInput) {
    searchInput.addEventListener('input', filterEvents);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterEvents);
  }
  if (dateFilter) {
    dateFilter.addEventListener('change', filterEvents);
  }
});

// Filter events function
function filterEvents() {
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const category = document.getElementById('categoryFilter')?.value || '';
  const date = document.getElementById('dateFilter')?.value || '';
  
  const eventCards = document.querySelectorAll('.event-card');
  
  eventCards.forEach(card => {
    const title = card.querySelector('h4').textContent.toLowerCase();
    const meta = card.querySelector('.meta').textContent.toLowerCase();
    let show = true;
    
    // Search filter
    if (searchTerm && !title.includes(searchTerm) && !meta.includes(searchTerm)) {
      show = false;
    }
    
    // Category filter (you can add data-category attribute to event cards)
    if (category && show) {
      const cardCategory = card.getAttribute('data-category') || '';
      if (category && cardCategory !== category) {
        show = false;
      }
    }
    
    // Date filter (you can add data-date attribute to event cards)
    if (date && show) {
      const cardDate = card.getAttribute('data-date') || '';
      if (date && cardDate !== date) {
        show = false;
      }
    }
    
    if (show) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Show alert function
function showAlert(message, type) {
  // Remove existing alerts
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
  
  // Auto remove after 5 seconds
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

// ===== Dark Mode and Language Switch =====

// Dark Mode Management
document.addEventListener('DOMContentLoaded', function() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    if (!darkModeBtn) return;
    
    const body = document.body;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        darkModeBtn.innerHTML = '<img src="assets/img/day-and-night.png" alt="الوضع المظلم" style="width: 20px; height: 20px;" />';
    }
    
    // Toggle dark mode
    darkModeBtn.addEventListener('click', function() {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            darkModeBtn.innerHTML = '<img src="assets/img/day-and-night.png" alt="الوضع المظلم" style="width: 20px; height: 20px;" />';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            darkModeBtn.innerHTML = '<img src="assets/img/day-and-night.png" alt="الوضع المظلم" style="width: 20px; height: 20px;" />';
            localStorage.setItem('theme', 'dark');
        }
    });
});

// Language Management
document.addEventListener('DOMContentLoaded', function() {
    const arabicBtn = document.getElementById('arabicBtn');
    const englishBtn = document.getElementById('englishBtn');
    
    if (!arabicBtn || !englishBtn) return;
    
    // Load saved language
    const savedLang = localStorage.getItem('language') || 'ar';
    if (savedLang === 'en') {
        switchToEnglish();
    }
    
    arabicBtn.addEventListener('click', function() {
        switchToArabic();
    });
    
    englishBtn.addEventListener('click', function() {
        switchToEnglish();
    });
    
    function switchToArabic() {
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
        arabicBtn.classList.add('active');
        englishBtn.classList.remove('active');
        localStorage.setItem('language', 'ar');
        
        // Update texts
        updateTexts('ar');
    }
    
    function switchToEnglish() {
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        englishBtn.classList.add('active');
        arabicBtn.classList.remove('active');
        localStorage.setItem('language', 'en');
        
        // Update texts
        updateTexts('en');
    }
    
    function updateTexts(lang) {
        // This will be defined in each page
        if (typeof window.updatePageTexts === 'function') {
            window.updatePageTexts(lang);
        }
    }
});
