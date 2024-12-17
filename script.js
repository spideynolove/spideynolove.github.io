// Theme Switching
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or system preference
function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme
function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    } else {
        body.classList.remove('dark-mode');
        themeToggle.checked = false;
    }
}

// Initialize theme
applyTheme(getPreferredTheme());

// Theme toggle handler
themeToggle.addEventListener('change', () => {
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Dispatch event for other pages
    window.dispatchEvent(new CustomEvent('themechange', { detail: newTheme }));
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// Say Hello button
const sayHelloButton = document.querySelector('.say-hello');
if (sayHelloButton) {
    sayHelloButton.addEventListener('click', () => {
        window.location.href = 'mailto:spideynolove@gmail.com';
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active state to navigation links based on current page
function updateActiveLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || 
            (currentPath.includes(href) && href !== '/') ||
            (currentPath === '/' && href === './index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

updateActiveLink();

// Handle navigation animations
function setupPageTransitions() {
    const content = document.querySelector('main');
    if (!content) return;

    content.style.opacity = '0';
    content.style.transform = 'translateY(20px)';

    // Fade in content
    requestAnimationFrame(() => {
        content.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    });
}

// Initialize page transitions
document.addEventListener('DOMContentLoaded', setupPageTransitions);

// Card hover effects
function setupCardAnimations() {
    const cards = document.querySelectorAll('.card, .project-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
}

setupCardAnimations();

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // Prevent theme switching errors from breaking the page
    if (e.error.message.includes('theme')) {
        applyTheme('light');
        localStorage.removeItem('theme');
    }
});

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
if ('IntersectionObserver' in window) {
    lazyLoadImages();
}

// Handle navigation between pages
window.addEventListener('popstate', updateActiveLink);
