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
const involvedCards = document.querySelectorAll('.involved-card');
const impactCards = document.querySelectorAll('.impact-card');
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
involvedCards.forEach(card => aboutObserver.observe(card));
impactCards.forEach(card => aboutObserver.observe(card));

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

/* Modal Functions */
const donateModal = document.getElementById('donateModal');
const contactModal = document.getElementById('contactModal');
const donateForm = document.getElementById('donateForm');
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

function _openDonateModal() {
    if (donateModal) {
        donateModal.classList.add('active');
        donateModal.removeAttribute('inert');
        document.body.style.overflow = 'hidden';
    }
}

function closeDonateModal() {
    if (donateModal) {
        donateModal.classList.remove('active');
        donateModal.setAttribute('inert', '');
        document.body.style.overflow = '';
    }
}

function openDonateModal() {
    _openDonateModal();
    if (donateForm) donateForm.style.display = 'flex';
    if (whatsappGuidance) whatsappGuidance.style.display = 'none';
    if (donateSubmitBtn) {
        donateSubmitBtn.querySelector('.submit-text').innerHTML = 'Proceed to Payment <i class="bx bx-right-arrow-alt"></i>';
    }
    if (donateFormNote) {
        donateFormNote.innerHTML = '<i class="bx bx-lock-alt"></i> Secure payment. Your information is protected.';
    }
    const stripeRadio = document.querySelector('input[name="paymentMethod"][value="stripe"]');
    if (stripeRadio) stripeRadio.checked = true;
}

function openContactModal(type = 'general') {
    if (contactModal) {
        contactModal.classList.add('active');
        contactModal.removeAttribute('inert');
        document.body.style.overflow = 'hidden';
        
        const typeInput = document.getElementById('contactType');
        const titleEl = document.getElementById('contactModalTitle');
        const descEl = document.getElementById('contactModalDesc');
        
        if (typeInput) typeInput.value = type;
        if (titleEl) {
            titleEl.textContent = type === 'volunteer' ? 'Become a Volunteer' : type === 'partner' ? 'Partner With Us' : 'Get In Touch';
        }
        if (descEl) {
            descEl.textContent = type === 'volunteer' 
                ? 'Tell us about your skills and how you would like to contribute.' 
                : type === 'partner' 
                ? 'Tell us about your organization and how you would like to collaborate.' 
                : 'Fill out the form below and our team will respond within 24 hours.';
        }
        
        const messageInput = document.getElementById('contactMessage');
        if (messageInput) {
            messageInput.placeholder = type === 'volunteer' 
                ? 'I would like to volunteer because...' 
                : type === 'partner' 
                ? 'Our organization would like to partner because...' 
                : 'Tell us how you would like to help or partner with us...';
        }
    }
}

function closeContactModal() {
    if (contactModal) {
        contactModal.classList.remove('active');
        contactModal.setAttribute('inert', '');
        document.body.style.overflow = '';
    }
}

/* Close modal on Escape key */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDonateModal();
        closeContactModal();
    }
});

/* Amount button selection */
const amountBtns = document.querySelectorAll('.amount-btn');
const amountInput = document.getElementById('donateAmount');

amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (amountInput) {
            amountInput.value = btn.dataset.amount;
        }
    });
});

/* Clear amount button selection when user types custom amount */
if (amountInput) {
    amountInput.addEventListener('input', () => {
        amountBtns.forEach(b => b.classList.remove('selected'));
    });
}

/* Payment method change handler */
const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
const donateSubmitBtn = document.getElementById('donateSubmitBtn');
const donateFormNote = document.getElementById('donateFormNote');
const whatsappGuidance = document.getElementById('whatsappGuidance');

function updatePaymentMethodUI() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'stripe';
    if (paymentMethod === 'whatsapp') {
        donateSubmitBtn.querySelector('.submit-text').innerHTML = 'Get Payment Instructions <i class="bx bx-right-arrow-alt"></i>';
        donateFormNote.innerHTML = '<i class="bx bx-info-circle"></i> You will receive payment details via WhatsApp.';
    } else {
        donateSubmitBtn.querySelector('.submit-text').innerHTML = 'Proceed to Payment <i class="bx bx-right-arrow-alt"></i>';
        donateFormNote.innerHTML = '<i class="bx bx-lock-alt"></i> Secure payment. Your information is protected.';
    }
}

paymentMethodRadios.forEach(radio => {
    radio.addEventListener('change', updatePaymentMethodUI);
});

/* Copy to clipboard helper */
function copyToClipboard(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
        const btn = el.nextElementSibling;
        if (btn) {
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="bx bx-check"></i>';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.classList.remove('copied');
            }, 2000);
        }
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

/* Donation Form Submission */
if (donateForm) {
    donateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = donateForm.querySelector('.modal-submit');
        const submitText = submitBtn.querySelector('.submit-text');
        const submitLoader = submitBtn.querySelector('.submit-loader');
        
        const amount = document.getElementById('donateAmount').value;
        const email = document.getElementById('donateEmail').value;
        const name = document.getElementById('donateName').value;
        const phone = document.getElementById('donatePhone').value;
        const paymentMethod = donateForm.querySelector('input[name="paymentMethod"]:checked')?.value || 'stripe';
        
        // WhatsApp payment flow
        if (paymentMethod === 'whatsapp') {
            donateForm.style.display = 'none';
            if (whatsappGuidance) {
                whatsappGuidance.style.display = 'flex';
            }
            return;
        }
        
        submitText.style.display = 'none';
        submitLoader.style.display = 'inline-flex';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, email, name, phone })
            });
            
            const data = await response.json();
            
            if (response.ok && data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Payment failed. Please try again.');
            }
        } catch (err) {
            console.error('Donation error:', err);
            alert('Network error. Please check your connection and try again.');
        } finally {
            submitText.style.display = 'inline-flex';
            submitLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}



/* Contact Form Submission */
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.modal-submit');
        const submitText = submitBtn.querySelector('.submit-text');
        const submitLoader = submitBtn.querySelector('.submit-loader');
        
        submitText.style.display = 'none';
        submitLoader.style.display = 'inline-flex';
        submitBtn.disabled = true;
        
        const formData = {
            type: document.getElementById('contactType').value,
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            message: document.getElementById('contactMessage').value
        };
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                contactStatus.textContent = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
                contactStatus.className = 'form-status success';
                contactForm.reset();
                setTimeout(() => {
                    closeContactModal();
                    contactStatus.className = 'form-status';
                    contactStatus.textContent = '';
                }, 3000);
            } else {
                contactStatus.textContent = data.error || 'Failed to send message. Please try again.';
                contactStatus.className = 'form-status error';
            }
        } catch (err) {
            console.error('Contact form error:', err);
            contactStatus.textContent = 'Network error. Please check your connection and try again.';
            contactStatus.className = 'form-status error';
        } finally {
            submitText.style.display = 'inline-flex';
            submitLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

/* Gallery scroll reveal */
const galleryTeamCards = document.querySelectorAll('.gallery-team-card');
const galleryActivityCards = document.querySelectorAll('.gallery-activity-card');
if (galleryTeamCards.length > 0 || galleryActivityCards.length > 0) {
    const galleryObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });
    galleryTeamCards.forEach(item => galleryObserver.observe(item));
    galleryActivityCards.forEach(item => galleryObserver.observe(item));
}

/* Make activity cards keyboard accessible */
galleryActivityCards.forEach((card, index) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View ' + (card.querySelector('.gallery-activity-caption h4')?.textContent || 'image'));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGalleryLightbox(5 + index);
        }
    });
});

/* Gallery Lightbox */
const galleryLightbox = document.getElementById('galleryLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
let currentGalleryIndex = 0;

function getGalleryData() {
    const teamCards = document.querySelectorAll('.gallery-team-card');
    const activityCards = document.querySelectorAll('.gallery-activity-card');
    const data = [];

    teamCards.forEach(card => {
        const img = card.querySelector('.gallery-team-image img');
        const name = card.querySelector('.gallery-team-info h4');
        const role = card.querySelector('.gallery-team-info span');
        data.push({
            src: img ? img.getAttribute('src') : '',
            alt: img ? img.getAttribute('alt') : '',
            title: name ? name.textContent : '',
            desc: role ? role.textContent : ''
        });
    });

    activityCards.forEach(card => {
        const img = card.querySelector('.gallery-activity-image img');
        const h4 = card.querySelector('.gallery-activity-caption h4');
        const p = card.querySelector('.gallery-activity-caption p');
        data.push({
            src: img ? img.getAttribute('src') : '',
            alt: img ? img.getAttribute('alt') : '',
            title: h4 ? h4.textContent : '',
            desc: p ? p.textContent : ''
        });
    });

    return data;
}

function openGalleryLightbox(index) {
    const data = getGalleryData();
    if (!data.length || index < 0 || index >= data.length) return;
    currentGalleryIndex = index;
    const item = data[index];
    if (lightboxImage) {
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt;
    }
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.desc;
    if (galleryLightbox) {
        galleryLightbox.classList.add('active');
        galleryLightbox.removeAttribute('inert');
        document.body.style.overflow = 'hidden';
    }
}

function closeGalleryLightbox() {
    if (galleryLightbox) {
        galleryLightbox.classList.remove('active');
        galleryLightbox.setAttribute('inert', '');
        document.body.style.overflow = '';
    }
}

function navigateGallery(direction) {
    const data = getGalleryData();
    if (!data.length) return;
    let newIndex = currentGalleryIndex + direction;
    if (newIndex < 0) newIndex = data.length - 1;
    if (newIndex >= data.length) newIndex = 0;
    openGalleryLightbox(newIndex);
}

/* Lightbox keyboard navigation */
document.addEventListener('keydown', (e) => {
    if (!galleryLightbox || !galleryLightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeGalleryLightbox();
    if (e.key === 'ArrowLeft') navigateGallery(-1);
    if (e.key === 'ArrowRight') navigateGallery(1);
});

/* Payment success/cancel message handling */
(function handlePaymentStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
        alert('Thank you for your donation! Your payment was successful.');
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancel') {
        alert('Payment was cancelled. You can try again anytime.');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
})();
