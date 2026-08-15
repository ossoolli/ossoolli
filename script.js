const initThemeToggle = () => {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const root = document.documentElement;

    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        const isDark = root.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('ossoolli-theme', newTheme);
    });
};

const initNavbar = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const scrollProgress = document.getElementById('scroll-progress');
    if(scrollProgress) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + "%";
        });
    }
};

const initMobileMenu = () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');

    if (!hamburger || !navMenu || !mobileOverlay) return;

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
};

const initDropdown = () => {
    const btn = document.getElementById('login-btn-nav');
    const menu = document.getElementById('login-dropdown-menu');
    
    if(!btn || !menu) return;
    
    let timeoutId;

    const showMenu = () => {
        clearTimeout(timeoutId);
        menu.classList.add('show');
        btn.setAttribute('aria-expanded', 'true');
    };
    const hideMenu = () => {
        timeoutId = setTimeout(() => {
            menu.classList.remove('show');
            btn.setAttribute('aria-expanded', 'false');
        }, 150);
    };

    btn.addEventListener('mouseenter', showMenu);
    menu.addEventListener('mouseenter', showMenu);
    
    btn.addEventListener('mouseleave', hideMenu);
    menu.addEventListener('mouseleave', hideMenu);

    btn.addEventListener('click', (e) => {
        if(window.innerWidth <= 768) {
            e.preventDefault();
            menu.classList.toggle('show');
        }
    });
};

const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if(id === '#') return;
            
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

const initBackToTop = () => {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

const showToast = (message, type = 'success') => {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const icon = type === 'success' ? '<i data-lucide="check-circle" style="color:var(--success)"></i>' : '<i data-lucide="alert-circle" style="color:var(--danger)"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    toast.className = `toast glass-card show ${type}`;
    
    if(typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
};

const initFAQ = () => {
    const accHeaders = document.querySelectorAll('.accordion-header');
    
    accHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const iconPlus = header.querySelector('.icon-plus');
            const iconMinus = header.querySelector('.icon-minus');
            
            // Close others
            document.querySelectorAll('.accordion-item.active').forEach(oldItem => {
                if(oldItem !== item) {
                    oldItem.classList.remove('active');
                    const oldContent = oldItem.querySelector('.accordion-content');
                    oldContent.style.maxHeight = null;
                    oldItem.querySelector('.icon-plus').style.display = 'block';
                    oldItem.querySelector('.icon-minus').style.display = 'none';
                }
            });
            
            // Toggle current
            item.classList.toggle('active');
            if(item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
                iconPlus.style.display = 'none';
                iconMinus.style.display = 'block';
            } else {
                content.style.maxHeight = null;
                iconPlus.style.display = 'block';
                iconMinus.style.display = 'none';
            }
        });
    });
    
    // Init state for active one
    const activeItem = document.querySelector('.accordion-item.active');
    if(activeItem) {
        const content = activeItem.querySelector('.accordion-content');
        content.style.maxHeight = content.scrollHeight + "px";
    }
};

const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if(!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('submitBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="btn-text">جاري فتح واتساب...</span> <div style="display:inline-block;width:16px;height:16px;border:2px solid;border-radius:50%;border-top-color:transparent;animation:spin 1s linear infinite;"></div>`;
        btn.disabled = true;

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            units: document.getElementById('unitsCount').value || 0,
            location: document.getElementById('location').value,
            notes: document.getElementById('notes').value
        };

        const message = [
            'مرحباً أصولي، أود طلب استشارة أولية.',
            `الاسم: ${formData.name}`,
            `الهاتف: ${formData.phone}`,
            `الموقع: ${formData.location}`,
            formData.units ? `عدد الوحدات: ${formData.units}` : '',
            formData.notes ? `ملاحظات: ${formData.notes}` : ''
        ].filter(Boolean).join('\n');

        window.open(`https://wa.me/962780719787?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
        showToast('فُتح واتساب لإرسال طلبك مباشرة إلى فريق أصولي.');
        btn.innerHTML = originalText;
        btn.disabled = false;
    });

    const inputs = document.querySelectorAll('.floating-input');
    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            input.parentElement.classList.add('has-error');
        });
        input.addEventListener('input', () => {
            if(input.checkValidity()) {
                input.parentElement.classList.remove('has-error');
            }
        });
    });
};

const initParticles = () => {
    const container = document.getElementById('particles-js');
    if(!container) return;
    
    for(let i=0; i<30; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255,255,255,0.4)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 5}s infinite linear`;
        container.appendChild(particle);
    }
};

const initIntersectionEffects = () => {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');
    if('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                    
                    if(entry.target.id === 'nonpayment') {
                        setTimeout(() => fillProgressBar(), 300);
                    }
                }
            });
        }, observerOptions);
        
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }
    
    const countElements = document.querySelectorAll('.stat-number, .counter-anim');
    if('IntersectionObserver' in window) {
        const countObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    startCountUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        countElements.forEach(el => countObserver.observe(el));
    } else {
        countElements.forEach(el => startCountUp(el));
    }
};

const startCountUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;
    
    const timer = setInterval(() => {
        current += Math.ceil(target / 50);
        if(current >= target) {
            el.innerText = target;
            clearInterval(timer);
        } else {
            el.innerText = current;
        }
    }, stepTime);
};

const fillProgressBar = () => {
    const fill = document.getElementById('legal-progress-fill');
    if(!fill) return;
    
    fill.style.width = '100%';
    
    const points = document.querySelectorAll('.progress-point');
    points.forEach((point, index) => {
        setTimeout(() => {
            point.classList.add('active');
        }, index * 300 + 200);
    });
};

const initComparisonToggle = () => {
    const toggle = document.getElementById('compare-toggle');
    const content = document.getElementById('compare-box');
    const list = document.getElementById('compare-list');
    const labelWith = document.getElementById('label-with');
    const labelWithout = document.getElementById('label-without');
    
    if(!toggle || !content || !list) return;
    
    const featuresWithout = [
        { title: "ملف العقار", desc: "قد يتوزع بين رسائل وملفات متعددة" },
        { title: "الاستحقاقات", desc: "تحتاج متابعة يدوية حسب آلية المالك" },
        { title: "سجل التواصل", desc: "قد لا يكون موحداً أو سهل الرجوع إليه" },
        { title: "الاستثناءات", desc: "قد تتطلب وقتاً إضافياً لفهم الوقائع" },
        { title: "التكاليف", desc: "تحتاج إلى توضيح منفصل حسب الحالة" },
        { title: "وقتك الشهري", desc: "يزداد مع عدد العقارات وحالات التأخر" }
    ];
    
    const featuresWith = [
        { title: "ملف العقار", desc: "بيانات ووثائق واستحقاقات ضمن سجل منظم" },
        { title: "الاستحقاقات", desc: "حالة متابعة واضحة وفق نطاق الخدمة" },
        { title: "سجل التواصل", desc: "خطوات موثقة تسهّل مراجعة الحالة" },
        { title: "الاستثناءات", desc: "مراجعة منظمة للوقائع والخطوة التالية" },
        { title: "التكاليف", desc: "نطاق ورسوم موضحة قبل التعاقد" },
        { title: "وقتك الشهري", desc: "تخفيف العمل المتكرر مع بقائك صاحب القرار" }
    ];
    
    const renderList = (isWithOssoolli) => {
        list.innerHTML = '';
        content.className = `compare-content glass-card ${isWithOssoolli ? 'with-ossoolli' : 'without-ossoolli'}`;
        
        labelWith.classList.toggle('active', isWithOssoolli);
        labelWithout.classList.toggle('active', !isWithOssoolli);
        
        const data = isWithOssoolli ? featuresWith : featuresWithout;
        const iconClass = isWithOssoolli ? 'green' : 'red';
        const iconName = isWithOssoolli ? 'check' : 'x';
        
        data.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'compare-item';
            li.style.animationDelay = `${index * 0.1}s`;
            li.innerHTML = `
                <div class="compare-icon ${iconClass}">
                    <i data-lucide="${iconName}"></i>
                </div>
                <div class="item-title">${item.title}</div>
                <div class="item-desc">${item.desc}</div>
            `;
            list.appendChild(li);
        });
        
        if(typeof lucide !== 'undefined') lucide.createIcons();
    };
    
    renderList(toggle.checked);
    toggle.addEventListener('change', (e) => {
        renderList(e.target.checked);
    });
};

const initCarousel = () => {
    const track = document.getElementById('testimonial-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if(!track || slides.length === 0) return;
    
    let currentIndex = 0;
    
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `dot-btn ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot-btn');
    
    const updateUI = () => {
        track.style.transform = `translateX(${currentIndex * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };
    
    const goToSlide = (index) => {
        currentIndex = index;
        updateUI();
    };
    
    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateUI();
    };
    
    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateUI();
    };
    
    if(nextBtn) nextBtn.addEventListener('click', nextSlide);
    if(prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    setInterval(nextSlide, 6000);
};

document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);

    initThemeToggle();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initIntersectionEffects();
    initFAQ();
    initContactForm();
    initDropdown();
    initParticles();
    initComparisonToggle();
    initCarousel();
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    initInteractiveAlgorithms();
});

const initInteractiveAlgorithms = () => {
    // 1. Spotlight Effect for Cards
    const spotlightCards = document.querySelectorAll('.spotlight-card, .bento-card, .glass-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 2. Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.btn-hero, .login-btn, .theme-toggle');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // 3. Parallax Hero
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-dashboard-mockup');
    if(hero && heroVisual) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            heroVisual.style.transform = `rotateY(-12deg) rotateX(5deg) translateY(${scroll * 0.15}px)`;
        });
    }

    // 4. Smooth Fade-in Stagger
    const revealStagger = document.querySelectorAll('.reveal-stagger');
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, i) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, i * 150);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealStagger.forEach(el => staggerObserver.observe(el));
};

// Sticky CTA logic
document.addEventListener('DOMContentLoaded', () => {
    const stickyCta = document.getElementById('sticky-cta');

    if(stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) stickyCta.classList.add('show');
            else stickyCta.classList.remove('show');
        });
    }

});
