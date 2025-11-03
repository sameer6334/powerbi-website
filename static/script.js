// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  initializeParticles();
  initializeAnimations();
  initializeIframeLoading();
});

// ========================================
// PARTICLES.JS BACKGROUND
// ========================================
function initializeParticles() {
  if (typeof particlesJS === 'undefined') {
      console.warn('Particles.js not loaded');
      return;
  }
  
  particlesJS('particles-js', {
      particles: {
          number: {
              value: 80,
              density: {
                  enable: true,
                  value_area: 800
              }
          },
          color: {
              value: '#6366f1'
          },
          shape: {
              type: 'circle'
          },
          opacity: {
              value: 0.5,
              random: false
          },
          size: {
              value: 3,
              random: true
          },
          line_linked: {
              enable: true,
              distance: 150,
              color: '#6366f1',
              opacity: 0.4,
              width: 1
          },
          move: {
              enable: true,
              speed: 2,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false
          }
      },
      interactivity: {
          detect_on: 'canvas',
          events: {
              onhover: {
                  enable: true,
                  mode: 'grab'
              },
              onclick: {
                  enable: true,
                  mode: 'push'
              },
              resize: true
          },
          modes: {
              grab: {
                  distance: 140,
                  line_linked: {
                      opacity: 1
                  }
              },
              push: {
                  particles_nb: 4
              }
          }
      },
      retina_detect: true
  });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initializeAnimations() {
  const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
          }
      });
  }, observerOptions);

  const cards = document.querySelectorAll('.dashboard-card');
  cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `all 0.6s ease ${index * 0.1}s`;
      observer.observe(card);
  });
}

// ========================================
// IFRAME LOADING
// ========================================
function initializeIframeLoading() {
  const iframe = document.querySelector('.powerbi-iframe');
  
  if (iframe) {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'loading';
      loadingDiv.style.position = 'absolute';
      loadingDiv.style.top = '50%';
      loadingDiv.style.left = '50%';
      loadingDiv.style.transform = 'translate(-50%, -50%)';
      
      const container = iframe.parentElement;
      container.style.position = 'relative';
      container.style.minHeight = '85vh';
      container.appendChild(loadingDiv);

      iframe.addEventListener('load', function() {
          loadingDiv.style.display = 'none';
          iframe.style.opacity = '0';
          iframe.style.transition = 'opacity 0.5s ease';
          
          setTimeout(() => {
              iframe.style.opacity = '1';
          }, 100);
      });

      iframe.addEventListener('error', function() {
          loadingDiv.style.display = 'none';
          
          const errorMsg = document.createElement('div');
          errorMsg.style.cssText = `
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              text-align: center;
              color: #ef4444;
              font-size: 1.2rem;
              padding: 2rem;
          `;
          errorMsg.innerHTML = `
              <p>⚠️ Failed to load dashboard</p>
              <p style="font-size: 0.9rem; margin-top: 1rem; color: #94a3b8;">
                  Please check the embed URL or try again later.
              </p>
          `;
          container.appendChild(errorMsg);
      });
  }
}

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
          target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
          });
      }
  });
});

// ========================================
// NAVIGATION SCROLL EFFECT
// ========================================
const nav = document.querySelector('nav');

window.addEventListener('scroll', function() {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
      nav.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
  } else {
      nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
  }
});

// ========================================
// CONSOLE EASTER EGG
// ========================================
console.log('%c🚀 Power BI Dashboard Showcase', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cBuilt with Flask & Modern Web Technologies', 'font-size: 12px; color: #94a3b8;');
console.log('%cDesigned by Sameer', 'font-size: 12px; color: #8b5cf6;');