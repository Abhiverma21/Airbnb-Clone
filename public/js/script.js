(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

// Navbar collapse toggle and small responsive helpers
document.addEventListener('DOMContentLoaded', () => {
  const navbarToggler = document.getElementById('navbarToggle');
  const navbarCollapse = document.getElementById('navbarNavDropdown');

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
      navbarCollapse.classList.toggle('show');
    });

    // Close collapse when a nav link is clicked (mobile)
    navbarCollapse.addEventListener('click', (e) => {
      const target = e.target;
      if (target.matches('.nav-link') && window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarCollapse.classList.remove('show');
      }
    });
  }

  // Ensure dropdowns work in cases where Bootstrap didn't initialize (fallback)
  // Bootstrap bundle normally handles dropdowns; this is a lightweight fallback.
  document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      // let Bootstrap handle if available
      if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) return;
      e.preventDefault();
      const parent = toggle.closest('.dropdown');
      parent.classList.toggle('show');
      const menu = parent.querySelector('.dropdown-menu');
      if (menu) menu.classList.toggle('show');
    });
  });
});