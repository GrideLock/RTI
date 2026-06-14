/* Mobile menu toggle */
const menuIcon = document.getElementById('menu-icon');
const navbar = document.getElementById('navbar');
const menuIconImg = menuIcon.querySelector('i');

menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
    const isExpanded = navbar.classList.contains('active');
    menuIcon.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    if (isExpanded) {
        menuIconImg.classList.remove('bx-menu');
        menuIconImg.classList.add('bx-x');
    } else {
        menuIconImg.classList.remove('bx-x');
        menuIconImg.classList.add('bx-menu');
    }
});

/* Close mobile menu when a link is clicked */
const navLinks = document.querySelectorAll('.navbar ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuIcon.setAttribute('aria-expanded', 'false');
        menuIconImg.classList.remove('bx-x');
        menuIconImg.classList.add('bx-menu');
    });
});

/* Scroll reveal animation for about cards */
const aboutCards = document.querySelectorAll('.about-card');
const coreValueCards = document.querySelectorAll('.core-value-card');
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};
const aboutObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
aboutCards.forEach(card => aboutObserver.observe(card));
coreValueCards.forEach(card => aboutObserver.observe(card));

/* Dark mode toggle */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

// Check local storage for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('bx-moon');
    themeIcon.classList.add('bx-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('bx-moon');
        themeIcon.classList.add('bx-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('bx-sun');
        themeIcon.classList.add('bx-moon');
        localStorage.setItem('theme', 'light');
    }
});

/* Typewriter animation for about-moto */
(function initTypewriter() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const fullText = "\u201CIf I let them down now, they will lose hope forever.\u201D";

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        typingText.textContent = fullText;
        return;
    }

    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeWriter() {
        if (!typingText) return;

        if (!isDeleting) {
            typingText.textContent = fullText.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === fullText.length) {
                isDeleting = true;
                typeSpeed = 2500; // pause before deleting
            } else {
                typeSpeed = 100;
            }
        } else {
            typingText.textContent = fullText.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                typeSpeed = 1000; // pause before retyping
            } else {
                typeSpeed = 50;
            }
        }

        setTimeout(typeWriter, typeSpeed);
    }

    setTimeout(typeWriter, 1000);
})();
