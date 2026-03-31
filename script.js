/* ================================================================
 * ossoolli — Production-Ready Script (Modular & Null-Safe)
 * ----------------------------------------------------------------
 * Every feature is isolated in its own init function.
 * Each function checks for required DOM elements before executing.
 * Safe to load on ANY page — index, terms, privacy, disclaimer, etc.
 * ================================================================ */

/* ── Webhook placeholder — replace with your real URL ─────────── */
const WEBHOOK_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

/* ── Toast timer reference (prevents overlapping toasts) ──────── */
let toastTimer = null;

// ─────────────────────────────────────────────────────────────────
// 1. NAVBAR SCROLL EFFECT
// ─────────────────────────────────────────────────────────────────
const initNavbar = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
};

// ─────────────────────────────────────────────────────────────────
// 2. MOBILE MENU TOGGLE (with hamburger → X animation)
// ─────────────────────────────────────────────────────────────────
const initMobileMenu = () => {
    const hamburger     = document.getElementById('hamburger');
    const navMenu       = document.getElementById('nav-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');

    if (!hamburger || !navMenu || !mobileOverlay) return;

    const closeMenu = () => {
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        hamburger.classList.remove('active');
    };

    const toggleMenu = () => {
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        hamburger.classList.toggle('active');
    };

    hamburger.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', closeMenu);

    // Close menu when any nav link is clicked
    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
};

// ─────────────────────────────────────────────────────────────────
// 3. SMOOTH SCROLL FOR ANCHOR LINKS
// ─────────────────────────────────────────────────────────────────
const initSmoothScroll = () => {
    const navbar = document.getElementById('navbar');
    const anchors = document.querySelectorAll('a[href*="#"]');
    if (!anchors.length) return;

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || !href.includes('#')) return;

            const targetId = href.substring(href.indexOf('#'));
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return; // target not on this page — let browser navigate

            e.preventDefault();
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });
};

// ─────────────────────────────────────────────────────────────────
// 3.5. BACK TO TOP BUTTON
// ─────────────────────────────────────────────────────────────────
const initBackToTop = () => {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// ─────────────────────────────────────────────────────────────────
// 4. SCROLL REVEAL (IntersectionObserver)
// ─────────────────────────────────────────────────────────────────
const initRevealAnimations = () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    // Fallback for environments without IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
};

// ─────────────────────────────────────────────────────────────────
// 5. FAQ ACCORDION
// ─────────────────────────────────────────────────────────────────
const initFAQ = () => {
    const faqItems = document.querySelectorAll('.accordion-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (!header) return;

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items first
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                const content = faq.querySelector('.accordion-content');
                if (content) content.style.maxHeight = null;
            });

            // Open clicked item if it wasn't already active
            if (!isActive) {
                item.classList.add('active');
                const content = item.querySelector('.accordion-content');
                if (content) content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
};

// ─────────────────────────────────────────────────────────────────
// 6. TOAST UTILITY
// ─────────────────────────────────────────────────────────────────
const showToast = (msg, isError = false) => {
    const toast = document.getElementById('toast');
    if (!toast) return;

    // Clear any existing timer to prevent overlap
    if (toastTimer) {
        clearTimeout(toastTimer);
        toastTimer = null;
    }

    toast.textContent = msg;
    toast.className = 'toast show ' + (isError ? 'error' : 'success');

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
        toastTimer = null;
    }, 4000);
};

// ─────────────────────────────────────────────────────────────────
// 7. CONTACT FORM — VALIDATION & FETCH
// ─────────────────────────────────────────────────────────────────
const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    const submitBtn   = document.getElementById('submitBtn');
    const phoneInput  = document.getElementById('phone');

    if (!contactForm || !submitBtn) return;

    // ── Prevent non-numeric input on phone field ──
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // ── Phone validation ──
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const phoneRegex = /^07\d{8}$/;

        if (!phoneRegex.test(phone)) {
            showToast('رقم الهاتف غير صحيح، يجب أن يتكون من 10 أرقام ويبدأ بـ 07', true);
            return;
        }

        // ── Build payload ──
        const nameInput       = document.getElementById('name');
        const phoneInputVal   = phone; // already fetched above
        const unitsInput      = document.getElementById('unitsCount');
        const locationInput   = document.getElementById('location');
        const notesInput      = document.getElementById('notes');

        const name       = nameInput ? nameInput.value.trim() : '';
        const units      = unitsInput ? unitsInput.value.trim() : '';
        const loc        = locationInput ? locationInput.value.trim() : '';
        const notes      = notesInput ? notesInput.value.trim() : '';

        const payload = {
            name:       name,
            phone:      phoneInputVal,
            unitsCount: units,
            location:   loc,
            notes:      notes,
            timestamp:  new Date().toISOString()
        };

        // ── Redirect to WhatsApp instantly ──
        const text = encodeURIComponent(`مرحباً، أرغب بالبدء في إدارة عقاري:\nالاسم: ${name}\nالرقم: ${phone}\nعدد الوحدات: ${units}\nالموقع: ${loc}\nملاحظات: ${notes}`);
        window.open(`https://wa.me/962780719787?text=${text}`, '_blank');
        showToast('تم تحويلك إلى واتساب بنجاح!');
        contactForm.reset();

        // ── Send to Google Sheets silently behind the scenes ──
        if (WEBHOOK_URL && WEBHOOK_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            try {
                fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    mode: 'no-cors'
                });
            } catch (err) {
                console.error('Webhook failed silently:', err);
            }
        }
    });
};

// ─────────────────────────────────────────────────────────────────
// BOOT — Safe initialization of all modules
// ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initRevealAnimations();
    initFAQ();
    initContactForm();
});

