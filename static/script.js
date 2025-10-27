// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCardInteractions();
    initializeIframeLoading();
});

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

    // Observe all dashboard cards
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ========================================
// CARD INTERACTIONS
// ========================================
function initializeCardInteractions() {
    const cards = document.querySelectorAll('.dashboard-card');
    
    cards.forEach(card => {
        // Add click event to entire card
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking the button directly
            if (!e.target.classList.contains('view-btn')) {
                const link = card.querySelector('.view-btn');
                if (link) {
                    window.location.href = link.href;
                }
            }
        });

        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('.view-btn');
                if (link) {
                    window.location.href = link.href;
                }
            }
        });

        // Tilt effect on hover
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
}

// ========================================
// IFRAME LOADING
// ========================================
function initializeIframeLoading() {
    const iframe = document.querySelector('.powerbi-iframe');
    
    if (iframe) {
        // Show loading indicator
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

        // Hide loading when iframe loads
        iframe.addEventListener('load', function() {
            loadingDiv.style.display = 'none';
            iframe.style.opacity = '0';
            iframe.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                iframe.style.opacity = '1';
            }, 100);
        });

        // Handle iframe errors
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
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
    } else {
        nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// TAG INTERACTIONS
// ========================================
const tags = document.querySelectorAll('.tag');
tags.forEach(tag => {
    tag.addEventListener('click', function(e) {
        e.stopPropagation();
        const tagText = tag.textContent;
        console.log(`Filtering by tag: ${tagText}`);
        // Future enhancement: Filter dashboards by tag
    });
});

// ========================================
// COPY EMBED URL (DASHBOARD PAGE)
// ========================================
function copyEmbedUrl() {
    const iframe = document.querySelector('.powerbi-iframe');
    if (iframe) {
        const url = iframe.src;
        navigator.clipboard.writeText(url).then(function() {
            showNotification('Embed URL copied to clipboard!');
        }).catch(function() {
            showNotification('Failed to copy URL', 'error');
        });
    }
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Lazy load images if any are added in the future
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
document.addEventListener('keydown', function(e) {
    // Press 'Esc' to go back on dashboard page
    if (e.key === 'Escape') {
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            window.location.href = backBtn.href;
        }
    }
    
    // Press 'H' to go home
    if (e.key === 'h' || e.key === 'H') {
        if (!e.target.matches('input, textarea')) {
            window.location.href = '/';
        }
    }
});

// ========================================
// CONSOLE EASTER EGG
// ========================================
console.log('%c🚀 Power BI Dashboard Showcase', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cBuilt with Flask & Modern Web Technologies', 'font-size: 12px; color: #94a3b8;');
console.log('%cDesigned by Sameer', 'font-size: 12px; color: #8b5cf6;');