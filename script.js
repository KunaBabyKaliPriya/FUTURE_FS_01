/* ═══════════════════════════════════════════════════════
   KUNA BABY KALI PRIYA — PORTFOLIO JAVASCRIPT
   Features:
   1. Navbar scroll effect + active link highlighting
   2. Mobile hamburger menu toggle
   3. Skill bar animation on scroll (IntersectionObserver)
   4. Project card reveal on scroll
   5. Contact form validation + submission feedback
   6. Scroll-to-top button
═══════════════════════════════════════════════════════ */


/* ── 1. NAVBAR: SCROLL SHADOW + ACTIVE LINK ─────────
   When user scrolls down 50px, add 'scrolled' class
   (which adds border-bottom via CSS).
   Also highlight whichever section is currently in view. */

const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  // Add shadow when scrolled
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active nav link
  // We loop through every section and check if it's in the viewport
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120; // 120px offset for navbar height
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
});


/* ── 2. MOBILE HAMBURGER MENU ────────────────────────
   Toggle the open/close class when the hamburger is clicked.
   Clicking any nav link also closes the menu.               */

const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu when a link is clicked (for smooth mobile UX)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});


/* ── 3. SKILL BARS — ANIMATE ON SCROLL ──────────────
   We use IntersectionObserver to detect when the skills
   section enters the viewport, then animate bars to their
   target width (set in the HTML as data-level attribute). */

// First, convert each [data-skill] div into the full HTML structure
document.querySelectorAll('.skill-bar').forEach(bar => {
  const skill = bar.getAttribute('data-skill');
  const level = bar.getAttribute('data-level');

  // Build the inner HTML dynamically from the data attributes
  bar.innerHTML = `
    <div class="skill-item">
      <div class="skill-header">
        <span>${skill}</span>
        <span>${level}%</span>
      </div>
      <div class="skill-track">
        <div class="skill-fill" data-width="${level}"></div>
      </div>
    </div>
  `;
});

// Now observe the skills section: when it enters view, trigger animation
const skillsSection = document.querySelector('#skills');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animate every skill fill bar
      document.querySelectorAll('.skill-fill').forEach(fill => {
        const targetWidth = fill.getAttribute('data-width');
        fill.style.width = targetWidth + '%';
      });
      skillObserver.unobserve(entry.target); // Run animation only once
    }
  });
}, { threshold: 0.2 }); // Trigger when 20% of the section is visible

if (skillsSection) skillObserver.observe(skillsSection);


/* ── 4. PROJECT CARDS — FADE IN ON SCROLL ───────────
   Each project card starts invisible (opacity: 0).
   IntersectionObserver adds 'visible' class with a slight
   delay per card, creating a staggered reveal effect.       */

const projectCards = document.querySelectorAll('.project-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay: each card appears 100ms after the previous
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 120);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

projectCards.forEach(card => cardObserver.observe(card));


/* ── 5. CONTACT FORM — VALIDATION + FEEDBACK ────────
   Validate each field before submission.
   Show success or error message to the user.
   (For a real backend, replace the timeout with a fetch()
   call to your form API like Formspree or EmailJS.)         */

const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent default page reload

  const nameField    = document.getElementById('name');
  const emailField   = document.getElementById('email');
  const messageField = document.getElementById('message');
  let isValid = true;

  // Clear previous error highlights
  [nameField, emailField, messageField].forEach(f => f.classList.remove('error'));
  formStatus.textContent = '';
  formStatus.className = 'form-status';

  // Validate: name must not be empty
  if (nameField.value.trim() === '') {
    nameField.classList.add('error');
    isValid = false;
  }

  // Validate: email must match basic email pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailField.value.trim())) {
    emailField.classList.add('error');
    isValid = false;
  }

  // Validate: message must be at least 10 characters
  if (messageField.value.trim().length < 10) {
    messageField.classList.add('error');
    isValid = false;
  }

  if (!isValid) {
    formStatus.textContent = 'Please fill in all fields correctly.';
    formStatus.classList.add('error');
    return;
  }

  // ── All valid: simulate sending ──
  // In a real project, replace this block with:
  //   fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: new FormData(this) })
  //   .then(() => showSuccess()).catch(() => showError())

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  setTimeout(() => {
    contactForm.reset();
    formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
    formStatus.classList.add('success');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
  }, 1500);
});


/* ── 6. SCROLL-TO-TOP BUTTON ─────────────────────────
   Creates a floating button that appears after scrolling
   down 400px. Clicking it smoothly scrolls back to top.    */

// Dynamically create the button and add to page
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
