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
