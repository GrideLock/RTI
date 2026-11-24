/* Mobile menu toggle */
const menuIcon = document.getElementById('menu-icon');
const navbar = document.getElementById('navbar');
const menuIconImg = menuIcon.querySelector('i');

function closeMobileMenu(restoreFocus = false) {
    if (!navbar.classList.contains('active')) return;
    navbar.classList.remove('active');
    menuIcon.setAttribute('aria-expanded', 'false');
    menuIconImg.classList.remove('bx-x');
    menuIconImg.classList.add('bx-menu');
    if (restoreFocus) menuIcon.focus();
}

menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
    const isExpanded = navbar.classList.contains('active');
    menuIcon.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    if (isExpanded) {
        menuIconImg.classList.remove('bx-menu');
        menuIconImg.classList.add('bx-x');
        const firstNavLink = navbar.querySelector('a');
        if (firstNavLink) firstNavLink.focus();
    } else {
        menuIconImg.classList.remove('bx-x');
        menuIconImg.classList.add('bx-menu');
    }
});

/* Close mobile menu when a link is clicked */
const navLinks = document.querySelectorAll('.navbar ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu(false);
    });
});

/* Trap keyboard focus inside open mobile menu and close on Escape */
document.addEventListener('keydown', (e) => {
    if (!navbar.classList.contains('active')) return;
    if (e.key === 'Escape') {
        e.preventDefault();
        closeMobileMenu(true);
        return;
    }
    if (e.key === 'Tab') {
        const menuFocusable = [menuIcon, ...Array.from(navLinks)];
        const first = menuFocusable[0];
        const last = menuFocusable[menuFocusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

/* Scroll reveal animation for cards */
const aboutCards = document.querySelectorAll('.about-card');
const coreValueCards = document.querySelectorAll('.core-value-card');
const involvedCards = document.querySelectorAll('.involved-card');
const impactCards = document.querySelectorAll('.impact-card');
const transparencyCards = document.querySelectorAll('.transparency-card');
const updateCards = document.querySelectorAll('.update-card');
const faqItems = document.querySelectorAll('.faq-item');
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
transparencyCards.forEach(card => aboutObserver.observe(card));
updateCards.forEach(card => aboutObserver.observe(card));
faqItems.forEach(item => aboutObserver.observe(item));

/* Active navbar link highlight on scroll */
const trackedSections = document.querySelectorAll('section[id]');
function updateActiveNavLink() {
    const scrollPos = window.scrollY + 180;
    let activeId = 'home';

    trackedSections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
            activeId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        const targetId = link.getAttribute('href')?.replace('#', '');
        if (targetId === activeId) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}
let navScrollTicking = false;
window.addEventListener('scroll', () => {
    if (!navScrollTicking) {
        window.requestAnimationFrame(() => {
            updateActiveNavLink();
            navScrollTicking = false;
        });
        navScrollTicking = true;
    }
}, { passive: true });
updateActiveNavLink();

/* Dark mode toggle */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

function syncThemeToggleA11y(isDark) {
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

// Check local storage for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('bx-moon');
    themeIcon.classList.add('bx-sun');
    syncThemeToggleA11y(true);
} else {
    syncThemeToggleA11y(false);
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    if (isDark) {
        themeIcon.classList.remove('bx-moon');
        themeIcon.classList.add('bx-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('bx-sun');
        themeIcon.classList.add('bx-moon');
        localStorage.setItem('theme', 'light');
    }
    syncThemeToggleA11y(isDark);
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

/* Accessible Dialog Focus Trap & Restoration */
let activeDialog = null;
let lastFocusedBeforeDialog = null;
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && el.closest('[style*="display:none"], [style*="display: none"]') === null;
    });
}

function activateDialogFocus(dialogEl, focusSelector) {
    if (!dialogEl) return;
    if (activeDialog !== dialogEl) {
        lastFocusedBeforeDialog = document.activeElement;
        activeDialog = dialogEl;
        const target = (focusSelector && dialogEl.querySelector(focusSelector)) || getFocusableElements(dialogEl)[0];
        if (target) {
            requestAnimationFrame(() => target.focus());
        }
    }
}

function releaseDialogFocus(dialogEl) {
    if (activeDialog === dialogEl) {
        activeDialog = null;
        const toRestore = lastFocusedBeforeDialog;
        lastFocusedBeforeDialog = null;
        if (toRestore && typeof toRestore.focus === 'function') {
            toRestore.focus();
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (!activeDialog || e.key !== 'Tab') return;
    const focusables = getFocusableElements(activeDialog);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
        if (document.activeElement === first || !activeDialog.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (document.activeElement === last || !activeDialog.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
        }
    }
});

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
        activateDialogFocus(donateModal, '#donateAmount');
    }
}

function closeDonateModal() {
    if (donateModal && donateModal.classList.contains('active')) {
        donateModal.classList.remove('active');
        donateModal.setAttribute('inert', '');
        document.body.style.overflow = '';
        releaseDialogFocus(donateModal);
    }
}

function openDonateModal() {
    if (donateForm) donateForm.style.display = 'flex';
    if (whatsappGuidance) whatsappGuidance.style.display = 'none';
    if (donateSubmitBtn) {
        donateSubmitBtn.querySelector('.submit-text').innerHTML = 'Proceed to Payment <i class="bx bx-right-arrow-alt" aria-hidden="true"></i>';
    }
    if (donateFormNote) {
        donateFormNote.innerHTML = '<i class="bx bx-lock-alt" aria-hidden="true"></i> Secure payment. Your information is protected.';
    }
    const stripeRadio = document.querySelector('input[name="paymentMethod"][value="stripe"]');
    if (stripeRadio) stripeRadio.checked = true;
    _openDonateModal();
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
            titleEl.textContent = type === 'volunteer'
                ? 'Become a Volunteer'
                : type === 'partner'
                ? 'Partner With Us'
                : type === 'report'
                ? 'Request Impact Report'
                : 'Get In Touch';
        }
        if (descEl) {
            descEl.textContent = type === 'volunteer'
                ? 'Tell us about your skills and how you would like to contribute.'
                : type === 'partner'
                ? 'Tell us about your organization and how you would like to collaborate.'
                : type === 'report'
                ? 'Share your contact details and our team will send you our latest community impact summary.'
                : 'Fill out the form below and our team will respond within 24 hours.';
        }
        
        const messageInput = document.getElementById('contactMessage');
        if (messageInput) {
            messageInput.placeholder = type === 'volunteer'
                ? 'I would like to volunteer because...'
                : type === 'partner'
                ? 'Our organization would like to partner because...'
                : type === 'report'
                ? 'I would like to request the latest Rise Together Initiative impact report...'
                : 'Tell us how you would like to help or partner with us...';
        }

        activateDialogFocus(contactModal, '#contactName');
    }
}

function closeContactModal() {
    if (contactModal && contactModal.classList.contains('active')) {
        contactModal.classList.remove('active');
        contactModal.setAttribute('inert', '');
        document.body.style.overflow = '';
        releaseDialogFocus(contactModal);
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
        amountBtns.forEach(b => {
            b.classList.remove('selected');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
        if (amountInput) {
            amountInput.value = btn.dataset.amount;
        }
    });
});

/* Clear amount button selection when user types custom amount */
if (amountInput) {
    amountInput.addEventListener('input', () => {
        amountBtns.forEach(b => {
            b.classList.remove('selected');
            b.setAttribute('aria-pressed', 'false');
        });
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
        donateSubmitBtn.querySelector('.submit-text').innerHTML = 'Get Payment Instructions <i class="bx bx-right-arrow-alt" aria-hidden="true"></i>';
        donateFormNote.innerHTML = '<i class="bx bx-info-circle" aria-hidden="true"></i> You will receive payment details via WhatsApp.';
    } else {
        donateSubmitBtn.querySelector('.submit-text').innerHTML = 'Proceed to Payment <i class="bx bx-right-arrow-alt" aria-hidden="true"></i>';
        donateFormNote.innerHTML = '<i class="bx bx-lock-alt" aria-hidden="true"></i> Secure payment. Your information is protected.';
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

/* Contact section scroll reveal */
const contactInfoCards = document.querySelectorAll('.contact-info-card');
const contactFormWrapper = document.querySelector('.contact-form-wrapper');
const contactSocialBanner = document.querySelector('.contact-social-banner');
if (contactInfoCards.length > 0 || contactFormWrapper || contactSocialBanner) {
    const contactObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });
    contactInfoCards.forEach(card => contactObserver.observe(card));
    if (contactFormWrapper) contactObserver.observe(contactFormWrapper);
    if (contactSocialBanner) contactObserver.observe(contactSocialBanner);
}

/* Section Contact Form Submission */
const sectionContactForm = document.getElementById('sectionContactForm');
const sectionContactStatus = document.getElementById('sectionContactStatus');
if (sectionContactForm) {
    sectionContactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = sectionContactForm.querySelector('.contact-submit');
        const submitText = submitBtn.querySelector('.submit-text');
        const submitLoader = submitBtn.querySelector('.submit-loader');

        submitText.style.display = 'none';
        submitLoader.style.display = 'inline-flex';
        submitBtn.disabled = true;

        const formData = {
            type: document.getElementById('sectionContactSubject').value,
            name: document.getElementById('sectionContactName').value,
            email: document.getElementById('sectionContactEmail').value,
            phone: document.getElementById('sectionContactPhone').value,
            message: document.getElementById('sectionContactMessage').value
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                sectionContactStatus.textContent = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
                sectionContactStatus.className = 'form-status success';
                sectionContactForm.reset();
                setTimeout(() => {
                    sectionContactStatus.className = 'form-status';
                    sectionContactStatus.textContent = '';
                }, 5000);
            } else {
                sectionContactStatus.textContent = data.error || 'Failed to send message. Please try again.';
                sectionContactStatus.className = 'form-status error';
            }
        } catch (err) {
            console.error('Contact form error:', err);
            sectionContactStatus.textContent = 'Network error. Please check your connection and try again.';
            sectionContactStatus.className = 'form-status error';
        } finally {
            submitText.style.display = 'inline-flex';
            submitLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

/* Gallery Category Filters */
const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
function applyGalleryFilter(category) {
    galleryFilterBtns.forEach(btn => {
        const isActive = btn.dataset.filter === category;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    galleryActivityCards.forEach(card => {
        const cardCategory = card.dataset.category || 'all';
        const shouldShow = category === 'all' || cardCategory === category;
        card.classList.toggle('gallery-hidden', !shouldShow);
        if (shouldShow) {
            card.classList.add('visible');
        }
    });
}

galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        applyGalleryFilter(btn.dataset.filter || 'all');
    });
});

/* Jump links from Updates section to filtered Gallery */
document.querySelectorAll('[data-gallery-jump]').forEach(link => {
    link.addEventListener('click', () => {
        const targetCategory = link.getAttribute('data-gallery-jump');
        if (targetCategory) {
            applyGalleryFilter(targetCategory);
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
    const activityCards = document.querySelectorAll('.gallery-activity-card:not(.gallery-hidden)');
    const data = [];

    teamCards.forEach(card => {
        const img = card.querySelector('.gallery-team-image img');
        const name = card.querySelector('.gallery-team-info h4');
        const role = card.querySelector('.gallery-team-info span');
        data.push({
            element: card,
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
            element: card,
            src: img ? img.getAttribute('src') : '',
            alt: img ? img.getAttribute('alt') : '',
            title: h4 ? h4.textContent : '',
            desc: p ? p.textContent : ''
        });
    });

    return data;
}

function openGalleryLightboxByCard(cardElement) {
    const data = getGalleryData();
    const index = data.findIndex(item => item.element === cardElement);
    if (index !== -1) {
        openGalleryLightbox(index);
    }
}

/* Bind click & keyboard events dynamically so indices never go out of sync */
galleryTeamCards.forEach(card => {
    const viewBtn = card.querySelector('.gallery-view-btn');
    if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openGalleryLightboxByCard(card);
        });
    }
    const imageWrap = card.querySelector('.gallery-team-image');
    if (imageWrap) {
        imageWrap.addEventListener('click', () => openGalleryLightboxByCard(card));
    }
});

galleryActivityCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View ' + (card.querySelector('.gallery-activity-caption h4')?.textContent || 'image'));
    card.addEventListener('click', () => openGalleryLightboxByCard(card));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGalleryLightboxByCard(card);
        }
    });
});

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
        activateDialogFocus(galleryLightbox, '.lightbox-close');
    }
}

function closeGalleryLightbox() {
    if (galleryLightbox && galleryLightbox.classList.contains('active')) {
        galleryLightbox.classList.remove('active');
        galleryLightbox.setAttribute('inert', '');
        document.body.style.overflow = '';
        releaseDialogFocus(galleryLightbox);
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

/* FAQ Accordion */
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
        const parentItem = btn.closest('.faq-item');
        const isOpen = parentItem.classList.contains('open');

        // Close other items for a clean accordion experience
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
            if (openItem !== parentItem) {
                openItem.classList.remove('open');
                const openBtn = openItem.querySelector('.faq-question');
                if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
            }
        });

        parentItem.classList.toggle('open', !isOpen);
        btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
});

/* Footer Newsletter Signup */
const newsletterForm = document.getElementById('newsletterForm');
const newsletterStatus = document.getElementById('newsletterStatus');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('newsletterEmail');
        const submitBtn = newsletterForm.querySelector('.newsletter-submit');
        const submitText = submitBtn.querySelector('.submit-text');
        const submitLoader = submitBtn.querySelector('.submit-loader');
        const email = emailInput ? emailInput.value.trim() : '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            newsletterStatus.textContent = 'Please enter a valid email address.';
            newsletterStatus.className = 'form-status newsletter-status error';
            return;
        }

        submitText.style.display = 'none';
        submitLoader.style.display = 'inline-flex';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();

            if (response.ok && data.success) {
                newsletterStatus.textContent = data.message || 'Thank you for subscribing!';
                newsletterStatus.className = 'form-status newsletter-status success';
                newsletterForm.reset();
            } else {
                newsletterStatus.textContent = data.error || 'Subscription failed. Please try again.';
                newsletterStatus.className = 'form-status newsletter-status error';
            }
        } catch (err) {
            console.error('Newsletter error:', err);
            newsletterStatus.textContent = 'Could not reach the server. Please try again or email risetogetherinitiative8@gmail.com.';
            newsletterStatus.className = 'form-status newsletter-status error';
        } finally {
            submitText.style.display = 'inline-flex';
            submitLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

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
