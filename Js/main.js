// js/main.js
   const toggle = document.getElementById('menuToggle');
   const menu = document.getElementById('navMenu');
   if (toggle && menu) {
     toggle.addEventListener('click', () => menu.classList.toggle('active'));
   }
