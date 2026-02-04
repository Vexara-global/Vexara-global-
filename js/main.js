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
  // === FILE UPLOAD: Show filename + delete button ===
const fileInput = document.querySelector('input[name="diploma"]');
const filePreview = document.getElementById('file-preview');

if (fileInput && filePreview) {
  fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      const fileName = this.files[0].name;
      filePreview.innerHTML = `
        <span style="color: var(--text-primary);">✅ ${fileName}</span>
        <button type="button" id="clear-file" style="
          background: none; border: none; color: var(--error); 
          cursor: pointer; font-size: 1.2rem; padding: 0; line-height: 1;"
        >🗑️</button>
      `;
      document.getElementById('clear-file').addEventListener('click', () => {
        fileInput.value = '';
        filePreview.innerHTML = '';
      });
    } else {
      filePreview.innerHTML = '';
    }
  });
}
});
