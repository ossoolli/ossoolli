const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
const cssPath = path.join(__dirname, 'style.css');

let html = fs.readFileSync(indexPath, 'utf8');

// 1. EXTRACT HEAD AND FOOTER
const headEndMatch = html.match(/<!-- HERO -->/);
const footerStartMatch = html.match(/<!-- FOOTER -->/);

if (!headEndMatch || !footerStartMatch) {
    console.error("Tags not found");
    process.exit(1);
}

const beforeHero = html.substring(0, headEndMatch.index);
const afterFooter = html.substring(footerStartMatch.index);

// 2. BUILD THE NEW FUNNEL CONTENT
const newFunnel = `
    <!-- 1. HERO SECTION -->
    <header class="hero mesh-bg" id="home">
        <div class="container hero-container grid-2">
            <div class="hero-content reveal">
                <div class="badge">
                    <span class="badge-dot"></span> حماية قانونية ومالية شاملة للملاك
                </div>
                <h1 class="hero-title" style="font-size: 3rem; line-height: 1.3;">
                    إيجارك محمي قانونياً…<br>
                    <span class="text-accent">بدون أي تكلفة عليك</span>
                </h1>
                <p class="hero-subtitle" style="font-size: 1.25rem;">
                    نحن نتحقق من المستأجر، نتابع الدفع، ونرفع القضايا عند الحاجة — وأنت مرتاح تماماً.
                </p>
                <div class="hero-dashed-msg mb-4" style="font-size: 1.1rem; font-weight: 600; background: rgba(255,255,255,0.8); border: 2px solid var(--color-accent); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ✔ بدون رسوم مسبقة &nbsp;|&nbsp; ✔ بدون مخاطر &nbsp;|&nbsp; ✔ 10% فقط من المُحصّل
                </div>
                <div class="hero-ctas mb-4">
                    <a href="#contact" class="btn btn-primary pulse btn-lg">تحقق من مستأجرك الآن</a>
                    <a href="#contact" class="btn btn-outline btn-lg">ابدأ بدون أي رسوم</a>
                </div>
                <div class="hero-stats" style="margin-top: 2rem;">
                    <!-- Using existing stats layout but updating the meaning if needed -->
                    <div class="stat-item"><span class="stat-num number-font">0</span><span class="stat-text">وجع رأس</span></div>
                    <div class="stat-item"><span class="stat-num number-font">100%</span><span class="stat-text">تغطية قانونية</span></div>
                    <div class="stat-item"><span class="stat-num number-font">10%</span><span class="stat-text">عند التحصيل فقط</span></div>
                </div>
            </div>
            <div class="hero-visual reveal">
                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" class="hero-svg">
                    <defs>
                        <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#123B5D" /><stop offset="100%" stop-color="#1E567F" />
                        </linearGradient>
                    </defs>
                    <rect x="130" y="80" width="140" height="240" rx="12" fill="url(#primary-grad)"/>
                    <rect x="150" y="50" width="100" height="270" rx="10" fill="var(--color-primary-light)" opacity="0.3"/>
                    <path d="M250 160 L310 160 L310 220 C310 260 280 290 250 300 C220 290 190 260 190 220 L190 160 Z" fill="var(--color-accent)"/>
                    <path d="M235 210 L250 225 L275 190" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="80" y="140" width="90" height="120" rx="8" fill="#fff" stroke="var(--color-border)" stroke-width="2"/>
                    <line x1="100" y1="170" x2="150" y2="170" stroke="var(--color-primary)" stroke-width="6" stroke-linecap="round"/>
                    <line x1="100" y1="190" x2="130" y2="190" stroke="var(--color-accent)" stroke-width="6" stroke-linecap="round"/>
                    <line x1="100" y1="210" x2="150" y2="210" stroke="var(--color-primary)" stroke-width="6" stroke-linecap="round"/>
                </svg>
            </div>
        </div>
    </header>

    <!-- 2. PAIN SECTION -->
    <section class="section" style="padding-top: 5rem; padding-bottom: 5rem;">
        <div class="container">
            <div class="section-header center mb-4">
                <div class="badge">الاستثمار براحة بال</div>
                <h2 class="section-title">من مالك قلق... إلى مالك مرتاح 100%</h2>
                <p class="section-subtitle">نعلم تماماً المعاناة التي يواجهها مؤجرو العقارات في الأردن</p>
            </div>
            <div class="grid-2" style="gap: 2rem;">
                <div class="card p-4" style="border-top: 4px solid #e74c3c; background: #fafafa;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">😟</div>
                    <h3 style="color: #e74c3c; margin-bottom: 1rem;">الواقع المتعب (الأسلوب التقليدي)</h3>
                    <ul class="check-list red-cross-list" style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 0.8rem;">✖ مستأجر يماطل في الدفع باستمرار</li>
                        <li style="margin-bottom: 0.8rem;">✖ تأخير يربك التزاماتك المالية</li>
                        <li style="margin-bottom: 0.8rem;">✖ قضايا إخلاء طويلة ومعقدة</li>
                        <li style="margin-bottom: 0.8rem;">✖ خسارة شهور من الدخل ودفع أتعاب محاماة</li>
                    </ul>
                </div>
                <div class="card p-4 featured-card" style="border-top: 4px solid #2ecc71;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">😎</div>
                    <h3 class="text-primary mb-3">الواقع المريح (نظام أصولي)</h3>
                    <ul class="check-list green-check-list" style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 0.8rem;">✔ مستأجر تم فحصه مالياً وقانونياً بشكل دقيق</li>
                        <li style="margin-bottom: 0.8rem;">✔ تحصيل شهري منتظم ومتابعة مالية يومية</li>
                        <li style="margin-bottom: 0.8rem;">✔ عند التأخير: نرفع القضية فوراً وبشكل مجاني</li>
                        <li style="margin-bottom: 0.8rem;">✔ عقد قانوني محكم يضمن حقوقك غير منقوصة</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- 3. HOW IT WORKS -->
    <section id="what-we-offer" class="section bg-alt reveal">
        <div class="container">
            <div class="section-header center mb-4">
                <div class="badge">خطوات التنفيذ</div>
                <h2 class="section-title">كيف نعمل؟ 6 خطوات واضحة وشفافة</h2>
                <p class="section-subtitle max-w-md center-block">أنت تختار المستأجر، ونحن نأخذ زمام المبادرة من هناك</p>
            </div>

            <div class="exec-timeline">
                <div class="exec-track" aria-hidden="true">
                    <div class="exec-track-line"></div>
                    <div class="exec-track-dot"></div><div class="exec-track-dot"></div><div class="exec-track-dot"></div>
                    <div class="exec-track-dot"></div><div class="exec-track-dot"></div><div class="exec-track-dot"></div>
                </div>

                <div class="exec-grid">
                    <!-- Step 1 -->
                    <div class="exec-card card exec-card--top">
                        <div class="exec-card-tag">الخطوة 1</div>
                        <h3>ترسل بيانات المستأجر</h3>
                        <p>بعد اختيارك للمستأجر، أرسل لنا هويته وبياناته عبر النظام للبدء.</p>
                        <div class="exec-node" aria-hidden="true">1</div>
                    </div>
                    <!-- Step 2 -->
                    <div class="exec-card card exec-card--top">
                        <div class="exec-card-tag">الخطوة 2</div>
                        <h3>التحقق المالي والقانوني</h3>
                        <p>نقوم بفحص الجدارة المالية والسجل القضائي بدقة لضمان القدرة على الدفع.</p>
                        <div class="exec-node" aria-hidden="true">2</div>
                    </div>
                    <!-- Step 3 -->
                    <div class="exec-card card exec-card--top">
                        <div class="exec-card-tag exec-card-tag--warn">الخطوة 3</div>
                        <h3>القرار: مناسب أم خطر</h3>
                        <p>نخبرك بشفافية بناءً على البيانات. أنت من يتخذ القرار النهائي.</p>
                        <div class="exec-node" aria-hidden="true">3</div>
                    </div>
                    <!-- Step 4 -->
                    <div class="exec-card card exec-card--bottom exec-card--gold">
                        <div class="exec-node exec-node--gold" aria-hidden="true">4</div>
                        <div class="exec-card-tag exec-card-tag--gold">الخطوة 4</div>
                        <h3>توقيع العقد عبر محامٍ</h3>
                        <p>يتم التوقيع عبر شبكة محامينا المعتمدين لضمان القوة القانونية للإخلاء.</p>
                    </div>
                    <!-- Step 5 -->
                    <div class="exec-card card exec-card--bottom">
                        <div class="exec-node" aria-hidden="true">5</div>
                        <div class="exec-card-tag">الخطوة 5</div>
                        <h3>المتابعة والتحصيل</h3>
                        <p>نرسل المطالبات والإشعارات ونتولى متابعة الدفعات في مواعيدها.</p>
                    </div>
                    <!-- Step 6 -->
                    <div class="exec-card card exec-card--bottom" style="border: 2px solid #e74c3c;">
                        <div class="exec-node" aria-hidden="true" style="background: #e74c3c;">6</div>
                        <div class="exec-card-tag" style="background: #e74c3c;">الخطوة 6</div>
                        <h3>رفع القضايا تلقائياً</h3>
                        <p>عند التعثر، نباشر فوراً برفع قضية إخلاء ومطالبة، ونتكفل بأتعاب المحاماة والرسوم.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 4. WHAT WE DO vs WHAT WE DON'T DO -->
    <section class="section reveal">
        <div class="container max-w-lg center-block">
            <div class="section-header center">
                <h2 class="section-title">نحن نظام حماية... ولسنا مكتباً عقارياً</h2>
            </div>
            <div class="grid-2" style="background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden;">
                <div style="padding: 2.5rem; background: var(--color-primary-light);">
                    <h3 style="color: var(--color-primary); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: #2ecc71;">✔</span> أصولي تقوم بـ:</h3>
                    <ul style="list-style: none; padding: 0; line-height: 2;">
                        <li><strong>التحقق:</strong> فحص مالي شامل للمستأجر</li>
                        <li><strong>التوثيق:</strong> عقود محكمة غير قابلة للنقض</li>
                        <li><strong>التحصيل:</strong> متابعة شهرية مستمرة</li>
                        <li><strong>الحماية:</strong> رفع قضايا الإخلاء وتغطية تكاليفها</li>
                    </ul>
                </div>
                <div style="padding: 2.5rem; background: #fdfdfd;">
                    <h3 style="color: #333; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: #e74c3c;">✖</span> أصولي لا تقوم بـ:</h3>
                    <ul style="list-style: none; padding: 0; line-height: 2; color: #666;">
                        <li><strong>التسويق:</strong> لا نبحث عن مستأجرين</li>
                        <li><strong>التأجير:</strong> لا نؤجر العقار نيابة عنك</li>
                        <li><strong>السلوك:</strong> لا نضمن التصرفات الشخصية</li>
                        <li><strong>الوساطة:</strong> لا نتقاضى عمولة عقارية (سمسرة)</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. PRICING -->
    <section id="pricing" class="section bg-alt reveal text-center" style="padding: 6rem 0;">
        <div class="container max-w-md center-block">
            <div class="badge mb-3">نموذج التسعير</div>
            <h2 class="section-title" style="font-size: 3rem;">10% فقط</h2>
            <p class="section-subtitle mb-4">تدفع فقط عند نجاحنا في تحصيل إيجارك</p>
            
            <div class="card p-4 text-center" style="border: 2px solid var(--color-accent);">
                <ul style="list-style: none; padding: 0; margin-bottom: 2rem; font-size: 1.1rem; line-height: 1.8;">
                    <li>✔ نقتطع النسبة من <strong>الإيجار المحصل فعلياً</strong> فقط</li>
                    <li>✔ لا توجد أي رسوم تأسيس أو رسوم خفية</li>
                    <li>✔ إذا لم يدفع المستأجر → أصولي لا تتقاضى شيئاً</li>
                    <li>✔ نحن نغطي أتعاب المحاماة ورسوم المحاكم عند التعثر</li>
                </ul>
                <div style="background: rgba(198, 161, 91, 0.1); padding: 1rem; border-radius: 8px; font-weight: bold; color: var(--color-primary);">
                    بدل خسارة شهور إيجار وقضايا… تدفع نسبة ضئيلة ومضمونة.
                </div>
            </div>
            <div class="mt-4">
                <a href="#contact" class="btn btn-primary pulse btn-lg">ابدأ الآن بدون أي تكلفة</a>
            </div>
        </div>
    </section>

    <!-- 6. LEGAL PROTECTION -->
    <section class="section reveal">
        <div class="container grid-2 align-center">
            <div>
                <div class="badge">قوة قانونية صارمة</div>
                <h2 class="section-title">الحماية القانونية الكاملة التي تحتاجها</h2>
                <p class="mb-4 text-dim" style="font-size: 1.1rem;">
                    نحن لا نهدد المستأجر المتعثر بالكلام، بل بالأفعال المدروسة قانونياً.
                </p>
                <div class="card p-3 mb-3 border-left-accent">
                    <h4 class="mb-2">تغطية المحاماة المتكاملة</h4>
                    <p class="text-dim m-0">شبكة من أمهر المحامين تترافع عنك أمام القضاء مجاناً ضمن الخدمة.</p>
                </div>
                <div class="card p-3 mb-3 border-left-accent">
                    <h4 class="mb-2">رفع القضايا والتنفيذ</h4>
                    <p class="text-dim m-0">نتابع القضية وصولاً إلى التنفيذ القضائي، الإخلاء، وجلب الأرصدة المستحقة.</p>
                </div>
                <div class="alert mt-4" style="background: #1e293b; color: white; padding: 1rem; border-radius: 8px;">
                    <i style="color: var(--color-accent); font-weight: bold;">تنويه شفاف:</i> لا نستطيع ضمان أو التحكم في سرعة قرار القاضي، لكننا نضمن اتخاذ الإجراء الكامل وبأقصى سرعة ممكنة.
                </div>
            </div>
            <div class="text-center">
                 <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; drop-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                    <circle cx="200" cy="200" r="180" fill="var(--color-primary-light)" opacity="0.1"/>
                    <path d="M140 120 L260 120 C270 120 280 130 280 140 L280 280 C280 290 270 300 260 300 L140 300 C130 300 120 290 120 280 L120 140 C120 130 130 120 140 120 Z" fill="var(--color-primary)"/>
                    <path d="M200 170 L240 210 L180 250 L160 230" fill="none" stroke="var(--color-accent)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>
    </section>

    <!-- 7. TRUST SECTION -->
    <section class="section bg-light reveal text-center">
        <div class="container">
            <h2 class="section-title">نظام متكامل يعمل لأجلك</h2>
            <div class="grid-3 mt-5">
                <div class="card p-4">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚖️</div>
                    <h4 class="mb-2">شبكة محامين واسعة</h4>
                    <p class="text-dim">محامون معتمدون في كل محافظة جاهزون للتحرك القانوني فوراً.</p>
                </div>
                <div class="card p-4">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚡</div>
                    <h4 class="mb-2">إجراءات مباشرة</h4>
                    <p class="text-dim">بدون تسويف، بمجرد حلول موعد التأخير المتفق عليه، يتم تحريك الملف.</p>
                </div>
                <div class="card p-4">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">📊</div>
                    <h4 class="mb-2">متابعة يومية</h4>
                    <p class="text-dim">نظام إلكتروني يراقب الدفعات ويصدر الإشعارات الدقيقة للمستأجر.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 8. FAQ -->
    <section id="faq" class="section reveal">
        <div class="container max-w-md center-block">
            <div class="section-header center mb-5">
                <h2 class="section-title">أسئلة شائعة (إجابات شفافة)</h2>
            </div>
            <div class="faq-container">
                <details class="faq-item" open>
                    <summary class="faq-question">هل أنتم مكتب عقاري؟</summary>
                    <div class="faq-answer">لا، نحن <strong>منصة حماية قانونية ومالية</strong> متخصصة. المالك يختار المستأجر بنفسه، ونحن نتولى الشق القانوني والمالي بالكامل لحمايتك من مخاطر التأخير والمماطلة.</div>
                </details>
                <details class="faq-item">
                    <summary class="faq-question">ماذا لو لم يدفع المستأجر؟</summary>
                    <div class="faq-answer">في حال التأخير حسب المهلة القانونية، نقوم فوراً برفع قضية إخلاء ومطالبة مالية نيابة عنك. <strong>نحن نتكفل بجميع أتعاب المحاماة ورسوم المحاكم</strong> دون أي تكلفة إضافية عليك.</div>
                </details>
                <details class="faq-item">
                    <summary class="faq-question">هل هناك رسوم مخفية إذا قررت البدء؟</summary>
                    <div class="faq-answer">إطلاقاً. لا توجد رسوم انضمام، أو تكلفة للصياغة القانونية، أو أتعاب محاماة. نحن نقتطع نسبة 10% فقط من <strong>قيمة الإيجار الذي يتم تحصيله فعلياً</strong>. إذا لم يتم الدفع للاختلال، لا نتقاضى شيئاً.</div>
                </details>
                <details class="faq-item">
                    <summary class="faq-question">ماذا لو تجاهلت توصيتكم بتجنب مستأجر معين؟</summary>
                    <div class="faq-answer">إذا أظهر تقريرنا أن المستأجر "عالي المخاطر" وأصررت على التأجير له، فقد <strong>تفقد التغطية القانونية المجانية</strong> ويتم التعامل مع القضية لاحقاً بأتعاب إضافية، لأن المخاطرة تمت ضد معايير الأمان لدينا.</div>
                </details>
            </div>
        </div>
    </section>

    <!-- 9. FINAL CTA (CONTACT) -->
    <section id="contact" class="section mesh-bg reveal" style="padding: 6rem 0; text-align: center;">
        <div class="container max-w-md center-block">
            <div class="card p-5" style="border: 2px solid var(--color-primary); box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                <div class="badge mb-3">خطوتك الأولى للأمان</div>
                <h2 class="section-title" style="margin-bottom: 1rem;">ابدأ الآن بدون أي تكلفة</h2>
                <p class="section-subtitle mb-4">أرسل بيانات المستأجر المرشح ودعنا نتولى فحصه وتأمين استثمارك.</p>
                
                <form id="contactForm" class="text-right">
                    <div class="form-group mb-3"><input type="text" id="name" required class="form-control" placeholder="اسمك الكامل"></div>
                    <div class="form-group mb-3"><input type="tel" id="phone" required class="form-control number-font text-right" placeholder="رقم هاتفك (مثال: 07XXXXXXXX)" dir="ltr"></div>
                    <button type="submit" id="submitBtn" class="btn btn-primary btn-full pulse btn-lg" style="font-size: 1.2rem; padding: 1.5rem;">تحقق الآن</button>
                    <div class="divider-text mt-4 mb-4"><span>أو</span></div>
                    <a href="https://wa.me/962780719787" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-full btn-lg">تواصل مستعجل عبر واتساب</a>
                </form>
            </div>
        </div>
    </section>
`;

const finalHtml = beforeHero + newFunnel + "\n" + afterFooter;

fs.writeFileSync(indexPath, finalHtml, 'utf8');

// 3. ADD MISSING CSS UTILITIES FOR FUNNEL RESTRUCTURE
let css = fs.readFileSync(cssPath, 'utf8');
const addCss = `
/* ADDED FOR NEW FUNNEL */
.border-red { border-top: 4px solid #e74c3c !important; }
.border-green { border-top: 4px solid #2ecc71 !important; }
.text-red { color: #e74c3c; }
.red-cross-list li:before { content: "✖"; color: #e74c3c; margin-left: 8px; }
.green-check-list li:before { content: "✔"; color: #2ecc71; margin-left: 8px; font-weight: bold; }
.border-left-accent { border-right: 4px solid var(--color-accent); }
.alert { font-weight: 600; line-height: 1.6; }
`;

if (!css.includes('.red-cross-list')) {
    fs.writeFileSync(cssPath, css + addCss, 'utf8');
}

console.log("Funnel rebuilt successfully.");
