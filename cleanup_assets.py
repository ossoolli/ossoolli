import os
import re

cwd = r'c:\Users\Administrator\Downloads\ossoolli-main (2)\ossoolli'
files = ['partners.html', 'lawyers.html', 'legal.html']

for filename in files:
    filepath = os.path.join(cwd, filename)
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 1. Update Head
    # Ensure <link rel="stylesheet" href="style.css"> is present
    if 'style.css' not in html:
        html = html.replace('</head>', '    <link rel="stylesheet" href="style.css">\n</head>')
    
    # Ensure <script src="script.js"></script> is in head
    if 'script.js' not in html:
        html = html.replace('</head>', '    <script src="script.js" defer></script>\n</head>')
    
    # 2. Cleanup Bottom Script
    # We want to keep ONLY the TOC specific stuff in legal.html
    if filename == 'legal.html':
        # Find the <script>...</script> at the bottom
        script_pattern = re.compile(r'<script>\s*// Hamburger menu.*?</script>', re.DOTALL)
        # Replacement for legal.html specific script
        replacement = """<script>
    // Specific script for Legal Page TOC tracking
    document.addEventListener('DOMContentLoaded', () => {
        const sections = document.querySelectorAll('.legal-card[id]');
        const tocLinks = document.querySelectorAll('.toc-bar a');
        if (sections.length && tocLinks.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        tocLinks.forEach(l => l.classList.remove('active'));
                        const active = document.querySelector(`.toc-bar a[href="#${entry.target.id}"]`);
                        if (active) active.classList.add('active');
                    }
                });
            }, { rootMargin: '-30% 0px -60% 0px' });
            sections.forEach(s => observer.observe(s));
        }
    });
</script>"""
        html = script_pattern.sub(replacement, html)
    else:
        # For other pages, we can remove the inline scripts if they are just doing standard navbar/hamburger stuff
        # partners.html and lawyers.html have <script src="script.js"></script> at the bottom usually.
        # Let's check their bottom.
        pass

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

print("Cleanup complete.")
