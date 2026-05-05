const SUPABASE_URL  = 'https://wqsubfzpmpuwdghebceg.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxc3ViZnpwbXB1d2RnaGViY2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MzI3NzEsImV4cCI6MjA5MTAwODc3MX0.-Lgo7GP55U1XDli-rAhODxhFmTvazDGQpHqGxfgIU-E';

let sb = null;
let toastTimer = null;

const initSupabase = () => {
    if (window.supabase && window.supabase.createClient) {
        sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    }
};

const initNavbar = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
};

const initMobileMenu = () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');
    const overlay   = document.getElementById('mobile-overlay');
    if (!hamburger || !navMenu || !overlay) return;
    const close = () => { navMenu.classList.remove('active'); overlay.classList.remove('active'); hamburger.classList.remove('active'); };
    hamburger.addEventListener('click', () => { navMenu.classList.toggle('active'); overlay.classList.toggle('active'); hamburger.classList.toggle('active'); });
    overlay.addEventListener('click', close);
    document.querySelectorAll('.nav-link, .nav-cta').forEach(l => l.addEventListener('click', close));
};

const initSmoothScroll = () => {
    const navbar = document.getElementById('navbar');
    document.querySelectorAll('a[href*="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href?.includes('#') || href.includes('login.html') || href.includes('legal.html') || href.includes('lawyers.html')) return;
            const id = href.substring(href.indexOf('#'));
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = navbar ? navbar.offsetHeight : 0;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        });
    });
};

const initBackToTop = () => {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

const initStickyCTA = () => {
    const cta = document.getElementById('mobile-sticky-cta');
    if (!cta) return;
    window.addEventListener('scroll', () => { cta.classList.toggle('show', window.scrollY > 300); }, { passive: true });
};

const initDropdown = () => {
    const dropdownBtn = document.getElementById('login-btn-nav');
    const dropdownMenu = document.getElementById('login-dropdown-menu');
    if (!dropdownBtn || !dropdownMenu) return;

    dropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && !dropdownBtn.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
};

const initFAQ = () => {
    const items = document.querySelectorAll('.accordion-item');
    if (!items.length) return;
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (!header) return;
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            items.forEach(i => { 
                i.classList.remove('active'); 
                const c = i.querySelector('.accordion-content'); 
                if (c) c.style.maxHeight = null;
                const plus = i.querySelector('.icon-plus');
                const minus = i.querySelector('.icon-minus');
                if(plus) plus.style.display = 'block';
                if(minus) minus.style.display = 'none';
            });
            
            // Open clicked
            if (!isActive) { 
                item.classList.add('active'); 
                const c = item.querySelector('.accordion-content'); 
                if (c) c.style.maxHeight = c.scrollHeight + 'px'; 
                const plus = item.querySelector('.icon-plus');
                const minus = item.querySelector('.icon-minus');
                if(plus) plus.style.display = 'none';
                if(minus) minus.style.display = 'block';
            }
        });
    });
};

const showToast = (msg, isError = false) => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
    
    // Add icon based on success/error
    const icon = isError ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>' 
                         : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    
    toast.innerHTML = `${icon} <span>${msg}</span>`;
    toast.className = 'toast show ' + (isError ? 'error' : 'success');
    toastTimer = setTimeout(() => { toast.classList.remove('show'); toastTimer = null; }, 4000);
};

const initContactForm = () => {
    const form       = document.getElementById('contactForm');
    const submitBtn  = document.getElementById('submitBtn');
    const phoneInput = document.getElementById('phone');
    const nameInput  = document.getElementById('name');
    const unitsInput = document.getElementById('unitsCount');
    const locInput   = document.getElementById('location');
    if (!form || !submitBtn) return;

    phoneInput?.addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); });

    const setError = (el, hasError) => {
        const g = el.closest('.floating-group');
        if (!g) return;
        if (hasError) g.classList.add('has-error');
        else g.classList.remove('has-error');
    };

    [nameInput, phoneInput, unitsInput, locInput].forEach(inp => {
        if (!inp) return;
        inp.addEventListener('input', () => setError(inp, false));
        inp.addEventListener('blur', () => {
            if (inp.required && !inp.value.trim()) { setError(inp, true); return; }
            if (inp === phoneInput && !/^07\d{8}$/.test(inp.value.trim())) { setError(inp, true); return; }
            setError(inp, false);
        });
    });

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const name  = nameInput?.value.trim()  ?? '';
        const phone = phoneInput?.value.trim()  ?? '';
        const units = unitsInput?.value.trim() ?? '';
        const loc   = locInput?.value.trim()   ?? '';
        const notes = document.getElementById('notes')?.value.trim() ?? '';

        let hasError = false;
        if (!name)                     { setError(nameInput,  true); hasError = true; }
        if (!/^07\d{8}$/.test(phone)) { setError(phoneInput, true); hasError = true; }
        if (!units)                    { setError(unitsInput, true); hasError = true; }
        if (!loc)                      { setError(locInput,   true); hasError = true; }
        if (hasError) { showToast('يرجى التأكد من صحة جميع البيانات', true); return; }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-spinner" style="width:20px;height:20px;border:3px solid #fff;border-top-color:transparent;border-radius:50%;display:inline-block;animation:spin 1s linear infinite;"></span> جاري الإرسال...';

        const payload = { name, phone, units_count: parseInt(units), location: loc, notes, created_at: new Date().toISOString() };

        try {
            if (sb) {
                const { error } = await sb.from('leads').insert([payload]);
                if (error) throw error;
            } else {
                const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}`, 'Prefer': 'return=minimal' },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
            }

            const wrapper = document.querySelector('.form-wrapper');
            if (wrapper) {
                wrapper.innerHTML = `
                    <div class="success-message text-center">
                        <i data-lucide="check-circle-2" style="width:64px;height:64px;color:var(--success);margin-bottom:16px;display:inline-block;"></i>
                        <h3 class="mb-3">تم استلام طلبك بنجاح!</h3>
                        <p class="mb-4 text-secondary">سيتواصل معك فريقنا خلال 24 ساعة للبدء بإجراءات حماية عقارك.</p>
                        <a href="https://wa.me/962780719787?text=${encodeURIComponent('مرحباً، أرسلت طلباً عبر الموقع وأرغب في المتابعة. اسمي: ' + name)}"
                           class="btn btn-whatsapp w-100 btn-lg" target="_blank" rel="noopener">
                            تحدث معنا الآن على واتساب
                        </a>
                    </div>`;
                if(typeof lucide !== 'undefined') lucide.createIcons();
            }
            showToast('تم استلام طلبك بنجاح!');

        } catch (err) {
            console.error('Submit error:', err);
            showToast('حدث خطأ في الاتصال، يرجى المحاولة.', true);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="btn-text">إرسال الطلب</span><i data-lucide="send" class="btn-icon"></i>';
            if(typeof lucide !== 'undefined') lucide.createIcons();
        }
    });
};

/* --- NEW 2026 LOGIC --- */

const initThemeToggle = () => {
    const btn = document.getElementById('theme-toggle-btn');
    if(!btn) return;
    
    btn.addEventListener('click', () => {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('ossoolli-theme', newTheme);
    });
};

const initParticles = () => {
    const container = document.getElementById('particles-js');
    if(!container) return;
    
    // Very lightweight native particle system
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    const resize = () => {
        width = container.offsetWidth;
        height = container.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();
    
    for(let i=0; i<30; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 2 + 1,
            dx: (Math.random() - 0.5) * 0.5,
            dy: Math.random() * -0.5 - 0.1, // Float up
            alpha: Math.random() * 0.5 + 0.1
        });
    }
    
    const draw = () => {
        ctx.clearRect(0,0,width,height);
        particles.forEach(p => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            ctx.fillStyle = isDark ? `rgba(255,255,255,${p.alpha})` : `rgba(255,255,255,${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            
            p.x += p.dx;
            p.y += p.dy;
            
            if(p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
        });
        requestAnimationFrame(draw);
    };
    draw();
};

const initIntersectionEffects = () => {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    
    // Setup reveal animations
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
    if('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                    
                    // Specific trigger for Progress Bar
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
    
    // Setup CountUp
    const countElements = document.querySelectorAll('.stat-number');
    if('IntersectionObserver' in window) {
        const countObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    startCountUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        countElements.forEach(el => countObserver.observe(el));
    } else {
        countElements.forEach(el => el.innerText = el.getAttribute('data-target'));
    }
};

const startCountUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;
    
    const timer = setInterval(() => {
        current += target > 100 ? 5 : 1;
        if(current > target) current = target;
        el.innerText = current;
        if(current === target) {
            clearInterval(timer);
        }
    }, stepTime);
};

const fillProgressBar = () => {
    const fill = document.getElementById('legal-progress-fill');
    if(!fill) return;
    
    fill.style.width = '100%';
    
    // Trigger points
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
        { title: "فحص المستأجر", desc: "مجهول الملاءة والوضع المالي" },
        { title: "العقد القانوني", desc: "قد يكون هشاً وغير تنفيذي مباشرة" },
        { title: "تحصيل الإيجار", desc: "ملاحقة يدوية وشخصية مرهقة" },
        { title: "تكاليف المحاماة", desc: "من جيبك الخاص (500-2000د.أ)" },
        { title: "متابعة الفواتير", desc: "خطر تراكم الديون دون علمك" },
        { title: "وقتك الشهري", desc: "6-10 ساعات ملاحقة واتصالات" }
    ];
    
    const featuresWith = [
        { title: "فحص المستأجر", desc: "تقرير مالي وقانوني شامل" },
        { title: "العقد القانوني", desc: "صياغة محكمة قابلة للتنفيذ القضائي" },
        { title: "تحصيل الإيجار", desc: "نظام متابعة آلي وبشري فعال" },
        { title: "تكاليف المحاماة", desc: "تتحملها أصولي بالكامل" },
        { title: "متابعة الفواتير", desc: "تسوية شهرية موثقة للخدمات" },
        { title: "وقتك الشهري", desc: "صفر — نحن نتولى كل شيء" }
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
    
    // Initial render
    renderList(toggle.checked);
    
    // Toggle Event
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
    
    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `dot-btn ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot-btn');
    
    const updateUI = () => {
        // RTL adjustment: Translation is positive for RTL
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
    
    // Auto play
    setInterval(nextSlide, 6000);
};

document.addEventListener('DOMContentLoaded', () => {
    // Inject custom CSS animation for form spinner if not globally injected
    const style = document.createElement('style');
    style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);

    const sdk = document.createElement('script');
    sdk.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    sdk.onload = initSupabase;
    document.head.appendChild(sdk);

    initThemeToggle();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initIntersectionEffects();
    initFAQ();
    initContactForm();
    initStickyCTA();
    initDropdown();
    initParticles();
    initComparisonToggle();
    initCarousel();
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
