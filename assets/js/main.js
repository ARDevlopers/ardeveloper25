/**
 * AR Developer - Main JavaScript Engine
 * Dynamic Interactivity, Scroll Animations, Filtering, Validation & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Preloader Handling
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });
    // Fallback dismiss after 3 seconds in case of slow assets
    setTimeout(() => {
      if (!preloader.classList.contains('loaded')) {
        preloader.classList.add('loaded');
      }
    }, 3000);
  }

  /* ==========================================================================
     2. Custom Intersection Observer Scroll Reveal Animation (AOS implementation)
     ========================================================================== */
  const initScrollAnimations = () => {
    const animatedElements = document.querySelectorAll('[data-aos]');

    if (!('IntersectionObserver' in window)) {
      // Fallback for very old browsers
      animatedElements.forEach(el => el.classList.add('aos-animate'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          // Unobserve after animating once as required
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      scrollObserver.observe(element);
    });
  };

  initScrollAnimations();

  /* ==========================================================================
     3. Sticky Navbar & Top Scroll Progress Bar
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Scroll progress bar
    if (scrollProgressBar && scrollHeight > 0) {
      const progressPercent = (scrollTop / scrollHeight) * 100;
      scrollProgressBar.style.width = `${progressPercent}%`;
    }

    // Sticky navbar
    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     4. Mobile Navigation Drawer & Hamburger Toggle
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileNav = () => {
    hamburgerBtn.classList.toggle('active');
    mobileDrawer.classList.toggle('active');
    drawerBackdrop.classList.toggle('active');
    document.body.style.overflow = mobileDrawer.classList.contains('active') ? 'hidden' : '';
  };

  const closeMobileNav = () => {
    hamburgerBtn.classList.remove('active');
    mobileDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMobileNav);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileNav);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ==========================================================================
     5. Typing Text Effect in Hero
     ========================================================================== */
  const typingElement = document.getElementById('typingText');
  if (typingElement) {
    const phrases = [
      'Powerful Mobile Apps.',
      'Modern SaaS Websites.',
      'Custom Software Solutions.',
      'High-Performance APIs.'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2000; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(typeEffect, typingSpeed);
    };

    typeEffect();
  }

  /* ==========================================================================
     6. Animated Statistics Counters
     ========================================================================== */
  const counters = document.querySelectorAll('.counter-number[data-target]');
  
  if (counters.length > 0) {
    let animated = false;

    const animateCounters = () => {
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target + suffix;
            clearInterval(timer);
          } else {
            counter.textContent = Math.ceil(current) + suffix;
          }
        }, stepTime);
      });
    };

    // Observer for counters section
    const counterSection = document.getElementById('counterSection') || document.querySelector('.counter-grid');
    if (counterSection && 'IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
          animateCounters();
          animated = true;
        }
      }, { threshold: 0.3 });

      counterObserver.observe(counterSection);
    }
  }

  /* ==========================================================================
     7. Portfolio Category Filtering
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.85)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     8. FAQ Accordion Single Expand
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Collapse all items
        faqItems.forEach(i => i.classList.remove('active'));

        // Toggle clicked item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  /* ==========================================================================
     9. Contact Form Real-time Validation & Toast Alert
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const toastNotification = document.getElementById('toastNotification');

  const showToast = (message) => {
    if (!toastNotification) return;
    const toastMessage = toastNotification.querySelector('.toast-text');
    if (toastMessage) toastMessage.textContent = message;

    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4000);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Inputs
      const nameInput = document.getElementById('formName');
      const emailInput = document.getElementById('formEmail');
      const subjectInput = document.getElementById('formSubject');
      const serviceSelect = document.getElementById('formService');
      const messageInput = document.getElementById('formMessage');

      const validateField = (input, condition) => {
        const group = input.closest('.form-group');
        if (!condition) {
          input.classList.add('error');
          if (group) group.classList.add('has-error');
          isValid = false;
        } else {
          input.classList.remove('error');
          if (group) group.classList.remove('has-error');
        }
      };

      if (nameInput) validateField(nameInput, nameInput.value.trim().length >= 2);
      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(emailInput, emailRegex.test(emailInput.value.trim()));
      }
      if (subjectInput) validateField(subjectInput, subjectInput.value.trim().length >= 3);
      if (serviceSelect) validateField(serviceSelect, serviceSelect.value !== '');
      if (messageInput) validateField(messageInput, messageInput.value.trim().length >= 10);

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }

        const formData = new FormData(contactForm);
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        })
        .then(async (response) => {
          if (response.ok) {
            contactForm.reset();
            showToast('Thank you! Your message has been sent successfully. We will get back to you shortly.');
          } else {
            const data = await response.json();
            showToast(data.message || 'Something went wrong. Please try again.');
          }
        })
        .catch(() => {
          showToast('Failed to connect to the server. Please check your internet connection.');
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        });
      } else {
        showToast('Please correct the highlighted fields before submitting.');
      }
    });
  }

  /* ==========================================================================
     10. Active Nav Link Scroll Highlighting
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);

  /* ==========================================================================
     11. Hero Mouse Parallax Effect
     ========================================================================== */
  const heroSection = document.querySelector('.hero');
  const floatingBadges = document.querySelectorAll('.floating-badge');

  if (heroSection && floatingBadges.length > 0 && window.innerWidth > 991) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const moveX = (clientX - centerX) / 45;
      const moveY = (clientY - centerY) / 45;

      floatingBadges.forEach((badge, idx) => {
        const factor = (idx + 1) * 0.6;
        badge.style.transform = `translate3d(${moveX * factor}px, ${moveY * factor}px, 0)`;
      });
    });
  }

  /* ==========================================================================
     12. Load Google Play Published Apps from JSON
     ========================================================================== */
  const appsGrid = document.getElementById('appsGrid');
  
  const renderApps = (apps) => {
    if (!appsGrid) return;
    appsGrid.innerHTML = apps.map((app, idx) => `
      <div class="glass-card app-card" data-aos="fade-up" data-aos-delay="${(idx + 1) * 100}">
        <div>
          <div class="app-card-header">
            <img src="${app.icon}" alt="${app.name} Icon" class="app-icon" loading="lazy">
            <div class="app-title-group">
              <h3>${app.name}</h3>
              <span class="app-category">${app.category}</span>
            </div>
          </div>
          <p class="app-desc">${app.shortDescription}</p>
          <div class="app-meta-row">
            <div class="app-rating">
              <i class="fas fa-star"></i>
              <span>${app.rating}</span>
            </div>
            <div class="app-downloads">
              <i class="fas fa-download"></i>
              <span>${app.downloads}</span>
            </div>
          </div>
        </div>
        <a href="${app.playStoreUrl}" target="_blank" rel="noopener noreferrer" class="app-play-btn">
          <i class="fab fa-google-play"></i>
          <span>View on Google Play</span>
        </a>
      </div>
    `).join('');

    // Re-observe newly created elements with IntersectionObserver if present
    const newAos = appsGrid.querySelectorAll('[data-aos]');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      newAos.forEach(el => observer.observe(el));
    }
  };

  const loadGooglePlayApps = async () => {
    if (!appsGrid) return;
    try {
      const response = await fetch('assets/data/apps.json');
      if (!response.ok) throw new Error('Failed to load apps.json');
      const apps = await response.json();
      renderApps(apps);
    } catch (err) {
      console.warn('Fallback: Using embedded HTML placeholder cards for apps.', err);
    }
  };

  loadGooglePlayApps();
});

