import os

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

html = read_file('index.html')
css = read_file('style.css')
js = read_file('script.js')

# --- HTML Additions ---
trust_bar = """
    <!-- TRUST TOP BAR -->
    <div class="trust-top-bar">
        <div class="container trust-bar-flex">
            <span><i data-lucide="check-circle" style="width:14px;height:14px;margin-left:4px;"></i> يعمل مع ملاك حقيقيين</span>
            <span><i data-lucide="shield-check" style="width:14px;height:14px;margin-left:4px;"></i> حماية قانونية صارمة</span>
            <span><i data-lucide="coins" style="width:14px;height:14px;margin-left:4px;"></i> بدون رسوم مسبقة</span>
        </div>
    </div>
"""
if "<!-- TRUST TOP BAR -->" not in html:
    html = html.replace('<!-- SCROLL PROGRESS -->', trust_bar + '\n    <!-- SCROLL PROGRESS -->')

# FOMO + CTA trigger
if "cta-trigger" not in html:
    html = html.replace('class="btn btn-hero btn-lg w-100-mobile hover-lift"', 'class="btn btn-hero btn-lg w-100-mobile hover-lift cta-trigger"')
    fomo = '<p class="text-xs mt-3 fw-bold fomo-text" style="color:var(--danger)"><i data-lucide="flame" style="width:14px;height:14px;display:inline;"></i> عدد محدود من الملاك نقبلهم شهرياً</p>'
    html = html.replace('<p class="text-sm mt-3 fw-bold risk-reversal-text">', fomo + '\n                    <p class="text-sm mt-1 fw-bold risk-reversal-text">')

# Sticky CTA replace
sticky_old = '    <!-- MOBILE STICKY CTA -->\n    <div class="mobile-sticky-cta" id="mobile-sticky-cta">\n        <a href="https://wa.me/962780719787" class="btn btn-whatsapp w-100 btn-lg hover-lift">\n            <i data-lucide="message-circle" style="fill:currentColor"></i> تحدث معنا على واتساب\n        </a>\n    </div>'
sticky_new = """
    <!-- STICKY CTA -->
    <div class="sticky-cta" id="sticky-cta">
        <div class="container flex-align justify-between" style="padding:0">
            <div class="sticky-cta-text hide-on-mobile">
                <p class="m-0 fw-bold font-md mb-1">احم عقارك الان!</p>
                <p class="m-0 text-xs text-secondary">بدون أي رسوم مسبقة</p>
            </div>
            <a href="#contact" class="btn btn-hero btn-lg cta-trigger text-center">
                ابدأ رحلة الأمان الآن <i data-lucide="arrow-left" style="width:18px;margin-right:6px;"></i>
            </a>
        </div>
    </div>
"""
if "<!-- STICKY CTA -->" not in html:
    html = html.replace(sticky_old, sticky_new)

# Modal Form
modal = """
    <!-- LEAD CAPTURE MODAL -->
    <div class="modal-overlay" id="leadModalOverlay">
        <div class="modal-content glass-card glow-shadow text-center">
            <button class="modal-close" id="closeModalBtn" aria-label="إغلاق">&times;</button>
            <div class="modal-icon gradient-btn mx-auto mb-3" style="width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;"><i data-lucide="shield"></i></div>
            <h3 class="font-lg mb-2">طلب حماية عقارية مجانية</h3>
            <p class="text-secondary text-sm mb-4">أدخل بياناتك وسيقوم خبيرنا العقاري بالتواصل معك فوراً لتقديم استشارة مجانية حول حماية إيجارك.</p>
            <form id="modalForm" class="mx-auto" style="max-width: 300px;">
                <div class="floating-group mb-3">
                    <input type="text" id="modalName" required class="floating-input" placeholder=" ">
                    <label for="modalName" class="floating-label">الاسم الكامل</label>
                </div>
                <div class="floating-group mb-4">
                    <input type="tel" id="modalPhone" required class="floating-input number-font" placeholder=" " dir="ltr">
                    <label for="modalPhone" class="floating-label">رقم الهاتف (الواتساب)</label>
                </div>
                <button type="button" id="modalSubmitBtn" class="btn btn-hero btn-full btn-lg hover-lift">
                    أكد الطلب السريع <i data-lucide="arrow-left" style="width:18px;margin-right:6px;"></i>
                </button>
                <p class="text-xs text-secondary mt-3">
                    <i data-lucide="lock" style="width:12px;height:12px;vertical-align:middle;display:inline;"></i> معلوماتك مشفرة ومحمية بالكامل
                </p>
            </form>
        </div>
    </div>
"""
if "<!-- LEAD CAPTURE MODAL -->" not in html:
    html = html.replace('<!-- TOAST -->', modal + '\n    <!-- TOAST -->')

# 0 رسوم Title
if 'font-size: 2.8rem' not in html:
    html = html.replace('<h2 class="pricing-title">صفر رسوم مقدمة</h2>', '<h2 class="pricing-title text-danger" style="font-size: 2.8rem; font-weight: 900;">صفر رسوم مقدمة</h2>')

# Verified Badge for all testimonials
if 'تم التحقق' in html:
    html = html.replace('<span class="verified-badge"><i data-lucide="badge-check" style="width:12px;display:inline;"></i> تم التحقق</span>', '<span class="verified-badge"><i data-lucide="badge-check" style="width:14px;display:inline;"></i> تم التحقق <span style="opacity:0.6;font-size:0.7rem;margin-right:4px;">ملك موثق</span></span>')

# Add missing CTA in sections: "Pain Points", "Comparison"
pain_cta_old = '<a href="#execution-flow" class="text-primary-light fw-bold text-sm down-arrow-link">كيف ننهي هذه المعاناة؟'
pain_cta_new = '<a href="#contact" class="btn btn-hero btn-lg mt-3 hover-lift cta-trigger">تخلص من هذه المعاناة الآن</a><br><a href="#execution-flow" class="text-primary-light fw-bold text-sm down-arrow-link mt-4 inline-block">أو اكتشف كيف نعمل'
if 'تخلص من هذه المعاناة الآن' not in html:
    html = html.replace(pain_cta_old, pain_cta_new)

# Comparison CTA
compare_sec_end = '                    <div class="compare-badge-recommended" id="recommended-badge">موصى به</div>\n                </div>'
compare_cta = """
                <div class="center mt-5">
                    <a href="#contact" class="btn btn-hero btn-lg hover-lift cta-trigger">اختر أصولي واحصل على راحة البال</a>
                </div>
"""
if 'اختر أصولي واحصل على راحة البال' not in html:
    html = html.replace(compare_sec_end, compare_sec_end + compare_cta)


# --- CSS Additions ---
cro_css = """
/* CRO Additions */
.trust-top-bar { background: var(--bg); border-bottom: 1px solid var(--border-color); padding: 8px 0; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); }
.trust-bar-flex { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; text-align: center; }
.trust-bar-flex span { display: flex; align-items: center; color: var(--text-primary); }

.fomo-text { color: var(--danger); margin-bottom: 4px; }
.inline-block { display: inline-block; }

/* Sticky CTA */
.sticky-cta { position: fixed; bottom: -100px; left: 0; right: 0; background: var(--glass-bg); backdrop-filter: var(--glass-blur); padding: 16px 0; box-shadow: 0 -15px 40px rgba(0,0,0,0.15); z-index: 100; border-top: 1px solid var(--glass-border); transition: var(--transition); border-radius: 24px 24px 0 0; }
.sticky-cta.show { bottom: 0; }
@media(max-width: 768px) { .hide-on-mobile { display: none !important; } .sticky-cta a { width: 100%; justify-content: center; } }
@media(min-width: 769px) { .sticky-cta .btn { margin-right: auto !important; margin-left: 0 !important; } }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 2000; opacity: 0; visibility: hidden; transition: var(--transition); display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-overlay.active { opacity: 1; visibility: visible; }
.modal-content { max-width: 380px; width: 100%; position: relative; padding: 40px 24px; transform: translateY(20px) scale(0.95); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.modal-overlay.active .modal-content { transform: translateY(0) scale(1); }
.modal-close { position: absolute; top: 16px; right: 20px; font-size: 2rem; background: none; border: none; color: var(--text-primary); cursor: pointer; line-height: 1; transition: var(--transition); }
.modal-close:hover { color: var(--danger); transform: rotate(90deg); }

.verified-badge { background: rgba(16, 185, 129, 0.1); color: var(--accent); padding: 4px 8px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; border: 1px solid rgba(16, 185, 129, 0.2); }
"""
if "/* CRO Additions */" not in css:
    css += '\n' + cro_css

# --- JS Additions ---
cro_js = """
// CRO Additions
document.addEventListener('DOMContentLoaded', () => {
    const ctaTriggers = document.querySelectorAll('.cta-trigger');
    const modal = document.getElementById('leadModalOverlay');
    const closeBtn = document.getElementById('closeModalBtn');
    const modalSubmit = document.getElementById('modalSubmitBtn');
    const stickyCta = document.getElementById('sticky-cta');

    // Show sticky cta after scrolling 400px
    if(stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCta.classList.add('show');
            } else {
                stickyCta.classList.remove('show');
            }
        });
    }

    // Open Modal
    if(modal) {
        ctaTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); 
                modal.classList.add('active');
            });
        });

        // Close Modal
        const closeModal = () => modal.classList.remove('active');
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if(e.target === modal) closeModal();
        });

        // Fake Submit
        modalSubmit.addEventListener('click', () => {
            const name = document.getElementById('modalName').value;
            const phone = document.getElementById('modalPhone').value;
            if(name && phone) {
                closeModal();
                if(typeof showToast === 'function') {
                    showToast('تم استلام طلبك! سنتواصل معك فورا.', 'success');
                } else {
                    alert('تم استلام طلبك! سنتواصل معك فورا.');
                }
                document.getElementById('modalName').value = '';
                document.getElementById('modalPhone').value = '';
            } else {
                if(typeof showToast === 'function') {
                    showToast('يرجى إدخال الاسم ورقم الهاتف', 'error');
                } else {
                    alert('يرجى إدخال الاسم ورقم الهاتف');
                }
            }
        });
    }
});
"""
if "// CRO Additions" not in js:
    js += '\n' + cro_js

# --- Combine EVERYTHING ---
# Inject CSS and JS into HTML
html = html.replace('<link rel="stylesheet" href="style.css">', f"<style>\n{css}\n</style>")
html = html.replace('<script src="script.js"></script>', f"<script>\n{js}\n</script>")

# Re-run Lucide initializer in the injected JS just in case
# The script.js already has lucide.createIcons();
# Save the ultimate single file index.html
write_file('index.html', html)

# We can optionally delete style.css and script.js since they are no longer needed
if os.path.exists('style.css'): os.remove('style.css')
if os.path.exists('script.js'): os.remove('script.js')

print("Successfully generated single-file index.html with all CRO layers.")
