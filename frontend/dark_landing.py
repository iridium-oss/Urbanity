import os
import re

filepath = r'c:\Users\Asus-2025\Desktop\hackathon_code\Urbanity\frontend\src\pages\LandingPage.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add standard dark background and dark text to the main layout wrappers
content = content.replace('bg-white', 'bg-white dark:bg-[#0aa14]') # oops, I'll need a better strategy
content = content.replace('bg-slate-50', 'bg-slate-50 dark:bg-slate-900')

# Actually, doing it via pure Python replace one by one is easiest:
replacements = {
    'bg-slate-50': 'bg-slate-50 dark:bg-[#0B0E14]', # Root background and sections
    'bg-white': 'bg-white dark:bg-[#141820]', # Cards
    'text-slate-900': 'text-slate-900 dark:text-white', # Headings
    'text-slate-600': 'text-slate-600 dark:text-slate-300', # Paras
    'text-slate-700': 'text-slate-700 dark:text-slate-200', # Other text
    'bg-white/90': 'bg-white/90 dark:bg-[#0B0E14]/90', # Nav
    'bg-slate-800': 'bg-slate-800 dark:bg-slate-800', # Skip
    'border-slate-100': 'border-slate-100 dark:border-slate-800', # Borders
    'border-slate-200': 'border-slate-200 dark:border-slate-800/80',
    'bg-slate-950': 'bg-slate-950 dark:bg-black', # Footer
}

for k, v in replacements.items():
    # Only replace if not already replaced
    if "dark:" not in k:
        content = re.sub(r'(?<!dark:)\b' + re.escape(k) + r'\b', v, content)

# Remove duplicates if any
content = content.replace('dark:text-slate-300 dark:text-slate-400', 'dark:text-slate-300')
content = content.replace('dark:text-white dark:text-white', 'dark:text-white')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated landing page dark mode")
