import os
import re

cwd = r'c:\Users\Administrator\Downloads\ossoolli-main (2)\ossoolli'

# Get the clean header & footer from index.html
with open(os.path.join(cwd, 'index.html'), 'r', encoding='utf-8') as f:
    index_html = f.read()

# Extract the trust-top-bar and navbar block accurately
# <div class="trust-top-bar"> ... </nav>
header_pattern = re.compile(r'<!-- TRUST TOP BAR -->\s*<div class="trust-top-bar">.*?</nav>', re.DOTALL)
header_match = header_pattern.search(index_html)
if not header_match:
    print("Could not find new header block in index.html!")
    exit(1)
new_header = header_match.group(0)

# The other files have <!-- SCROLL PROGRESS --> and <!-- NAVBAR -->
# Some might just have <!-- NAVBAR -->.

files_to_update = ['partners.html', 'legal.html', 'lawyers.html', 'login.html']
for filename in files_to_update:
    filepath = os.path.join(cwd, filename)
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Replace old navbar logic
    # Find the start of either <!-- SCROLL PROGRESS --> or <!-- NAVBAR -->
    old_header_pattern = re.compile(r'(?:<!-- SCROLL PROGRESS -->\s*<div id="scroll-progress"></div>\s*)?<!-- NAVBAR -->\s*<nav class="navbar".*?</nav>\s*<div class="mobile-overlay" id="mobile-overlay"></div>', re.DOTALL)
    
    # We want to insert the new_header + mobile overlay
    # The new_header does NOT contain mobile-overlay, it comes right after </nav>.
    
    if old_header_pattern.search(html):
        # We replace the old block with our new trust-top-bar + navbar + mobile-overlay
        replacement = new_header + '\n    <div class="mobile-overlay" id="mobile-overlay"></div>'
        html = old_header_pattern.sub(replacement, html, count=1)
        
        # Ensure active class is set correctly on the nav link
        # Find all nav-links and remove 'active', then add it to the correct one
        html = html.replace('class="nav-link active"', 'class="nav-link"')
        if filename == 'partners.html':
            html = html.replace('href="partners.html" class="nav-link"', 'href="partners.html" class="nav-link active"')
        elif filename == 'lawyers.html':
            html = html.replace('href="lawyers.html" class="nav-link"', 'href="lawyers.html" class="nav-link active"')
        elif filename == 'legal.html':
            html = html.replace('href="legal.html" class="nav-link"', 'href="legal.html" class="nav-link active"')
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Updated header in {filename}")
    else:
        print(f"Could not find old header block in {filename} to replace.")

print("Header standardization complete.")
