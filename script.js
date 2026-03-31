/* ================================================================
 * ossoolli — Production-Ready Script (Modular & Null-Safe)
 * ----------------------------------------------------------------
 * Every feature is isolated in its own init function.
 * Each function checks for required DOM elements before executing.
 * Safe to load on ANY page — index, terms, privacy, disclaimer, etc.
 * ================================================================ */

/* ── Webhook placeholder — replace with your real URL ─────────── */
// const WEBHOOK_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; // تمت الإزالة بناءً على طلب المستخدم

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
    const nameInput   = document.getElementById('name');
    const unitsInput  = document.getElementById('unitsCount');
    const locInput    = document.getElementById('location');

    if (!contactForm || !submitBtn) return;

    // ── Prevent non-numeric input on phone field ──
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // ── Realtime UX Validation ──
    const setError = (el, hasError) => {
        const group = el.closest('.form-group');
        if (!group) return;
        if (hasError) {
            group.classList.add('has-error');
            el.classList.remove('success');
        } else {
            group.classList.remove('has-error');
            if (el.value.trim() !== '') el.classList.add('success');
            else el.classList.remove('success');
        }
    };

    [nameInput, phoneInput, unitsInput, locInput].forEach(input => {
        if(!input) return;
        input.addEventListener('input', () => setError(input, false));
        input.addEventListener('blur', () => {
            if(input.required && input.value.trim() === '') setError(input, true);
            else if (input === phoneInput && !/^07\d{8}$/.test(input.value.trim())) setError(input, true);
            else setError(input, false);
        });
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // ── Phone validation ──
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const phoneRegex = /^07\d{8}$/;

        if (!phoneRegex.test(phone)) {
            if(phoneInput) setError(phoneInput, true);
            showToast('رقم الهاتف غير صحيح، يجب أن يتكون من 10 أرقام ويبدأ بـ 07', true);
            return;
        }

        // ── Build payload ──
        const notesInput = document.getElementById('notes');
        const name       = nameInput ? nameInput.value.trim() : '';
        const units      = unitsInput ? unitsInput.value.trim() : '';
        const loc        = locInput ? locInput.value.trim() : '';
        const notes      = notesInput ? notesInput.value.trim() : '';

        const payload = {
            name:       name,
            phone:      phone,
            unitsCount: units,
            location:   loc,
            notes:      notes,
            timestamp:  new Date().toISOString()
        };

        // ── Redirect to WhatsApp instantly ──
        const text = encodeURIComponent(`مرحباً، أرغب بالبدء في إدارة عقاري:\nالالاسم: ${name}\nالرقم: ${phone}\nعدد الوحدات: ${units}\nالموقع: ${loc}\nملاحظات: ${notes}`);
        window.open(`https://wa.me/962780719787?text=${text}`, '_blank');
        showToast('تم تحويلك إلى واتساب بنجاح!');
        contactForm.reset();
        [nameInput, phoneInput, unitsInput, locInput].forEach(input => {
            if(input) { input.classList.remove('success'); input.closest('.form-group')?.classList.remove('has-error'); }
        });
    });
};

// ─────────────────────────────────────────────────────────────────
// 8. SCROLL PROGRESS BAR
// ─────────────────────────────────────────────────────────────────
const initScrollProgress = () => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const progress = docHeight > 0 ? scrollTop / docHeight : 0;
                bar.style.transform = `scaleX(${progress})`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
};

// ─────────────────────────────────────────────────────────────────
// 9. ANIMATED COUNTERS
// ─────────────────────────────────────────────────────────────────
const initCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;
    
    // Fallback if no IntersectionObserver
    if(typeof IntersectionObserver === 'undefined') {
        counters.forEach(el => {
            el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
        });
        return;
    }

    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1000;
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentObj = Math.floor(easeProgress * target);
            
            el.textContent = currentObj + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        };
        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(c => observer.observe(c));
};

// ─────────────────────────────────────────────────────────────────
// 10. MAGNETIC BUTTONS (Desktop Only)
// ─────────────────────────────────────────────────────────────────
const initMagneticButtons = () => {
    if (window.innerWidth < 992) return; // Disable on mobile
    
    // Select buttons but exclude mobile specific ones like sticky CTA
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // max translate ~6px
            const moveX = (x / rect.width) * 12; 
            const moveY = (y / rect.height) * 12;
            
            window.requestAnimationFrame(() => {
                btn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.03)`;
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            window.requestAnimationFrame(() => {
                btn.style.transform = '';
            });
        });
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
    initScrollProgress();
    initCounters();
    initMagneticButtons();
});

