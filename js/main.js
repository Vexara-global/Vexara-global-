document.addEventListener('DOMContentLoaded', () => {
  // === MENU MOBILE ===
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // === DARK MODE ===
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    // Charger le thème sauvegardé
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    // Bascule au clic
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
  }

  // === ANIMATION SUR CHECK.HTML ===
  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    const form = document.getElementById('checkForm');
    if (form) {
      const originalHandler = form.onsubmit;
      form.onsubmit = function(e) {
        e.preventDefault();
        // Simuler la logique existante
        const ref = document.getElementById('reference').value.trim().toUpperCase();
        
        if (ref === 'VX-2026-001') {
          resultDiv.innerHTML = `
            <div class="status-success">
              <strong>✅ Contract Found</strong><br>
              Type: International Internship<br>
              Location: Berlin, Germany<br>
              Status: Confirmed — Ready for next steps
            </div>
          `;
        } else if (!ref) {
          resultDiv.innerHTML = `<p class="error">Please enter a reference.</p>`;
        } else {
          resultDiv.innerHTML = `
            <div class="status-error">
              <strong>❌ Reference Not Found</strong><br>
              Double-check your reference code.<br>
              Still missing it? <a href="index.html#contact">Contact us</a>.
            </div>
          `;
        }

        // Ajouter l'animation
        resultDiv.classList.remove('show');
        void resultDiv.offsetWidth; // Force reflow
        resultDiv.classList.add('show');
      };
    }
  }
});
