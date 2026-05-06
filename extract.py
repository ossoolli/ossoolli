import re
import os

cwd = r'c:\Users\Administrator\Downloads\ossoolli-main (2)\ossoolli'
index_path = os.path.join(cwd, 'index.html')

with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Extract <style>...</style> (There might be a few, but we want the main one at the top)
style_pattern = re.compile(r'<style>\s*/\* ================================================================\s*ossoolli — Production Design System.*?</style>', re.DOTALL)
style_match = style_pattern.search(html)

if style_match:
    style_content = style_match.group(0)
    # Remove <style> tags
    css_content = style_content.replace('<style>', '', 1).replace('</style>', '')
    with open(os.path.join(cwd, 'style.css'), 'w', encoding='utf-8') as f:
        f.write(css_content.strip())
    
    html = html.replace(style_content, '<link rel="stylesheet" href="style.css">')

# Extract <script>...</script> at the bottom.
script_pattern = re.compile(r'<script>\s*const initThemeToggle = \(\) => {.*?</script>', re.DOTALL)
script_match = script_pattern.search(html)

if script_match:
    script_content = script_match.group(0)
    # Remove <script> tags
    js_content = script_content.replace('<script>', '', 1).replace('</script>', '')
    with open(os.path.join(cwd, 'script.js'), 'w', encoding='utf-8') as f:
        f.write(js_content.strip())
        
    html = html.replace(script_content, '<script src="script.js"></script>')

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Extracted style.css and script.js successfully!")
