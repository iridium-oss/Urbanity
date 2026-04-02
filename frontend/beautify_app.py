import os
import glob

# 1. Fix Dashboard missing Light mode backgrounds
dashboard_path = r'c:\Users\Asus-2025\Desktop\hackathon_code\Urbanity\frontend\src\pages\dashboard\*.js'

for filepath in glob.glob(dashboard_path):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix dark backgrounds that were stuck in Light mode (no 'dark:' prefix)
    content = content.replace('bg-slate-900/50', 'bg-white dark:bg-slate-900/50')
    content = content.replace('bg-slate-900/60 border', 'bg-white dark:bg-slate-900/60 border')
    content = content.replace('bg-slate-900/30', 'bg-white dark:bg-slate-900/30')
    content = content.replace('bg-slate-800/80', 'bg-slate-100 dark:bg-slate-800/80')
    content = content.replace('border-slate-800/20', 'border-slate-200 dark:border-slate-800/40')
    content = content.replace('hover:bg-slate-800/20', 'hover:bg-slate-100 dark:hover:bg-slate-800/40')
    content = content.replace('bg-slate-800/50', 'bg-slate-100 dark:bg-slate-800/50')
    
    # Fix stuck btn texts
    content = content.replace('bg-blue-600 text-slate-900 dark:text-white hover:bg-blue-500', 'bg-blue-600 text-white hover:bg-blue-500')
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 2. Beautify Landing Page
landing_path = r'c:\Users\Asus-2025\Desktop\hackathon_code\Urbanity\frontend\src\pages\LandingPage.js'
with open(landing_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make hero gradients way cooler in dark mode (glowing orbs)
if 'dark:bg-[#0B0E14]' in content:
    # Adding glowing decorative orbs and richer colors
    content = content.replace(
        '<div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl" />',
        '<div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse" />'
    )
    content = content.replace(
        '<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/30 rounded-full blur-3xl" />',
        '<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/30 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse" />'
    )
    # Background gradients
    content = content.replace(
        'absolute inset-0 bg-gradient-to-b from-blue-50/60 to-slate-50',
        'absolute inset-0 bg-gradient-to-b from-blue-50/60 to-slate-50 dark:from-[#0f172a] dark:to-[#0B0E14]'
    )
    # Shiny card borders
    content = content.replace(
        'bg-white dark:bg-[#141820]',
        'bg-white dark:bg-[#111827] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] dark:border-white/5'
    )
    content = content.replace(
        'group bg-white dark:bg-[#111827] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] dark:border-white/5 rounded-xl border border-slate-100 dark:border-slate-800',
        'group bg-white dark:bg-[#111827] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] dark:border-white/5 rounded-xl border border-slate-100 dark:border-slate-800 hover:dark:border-blue-500/30'
    )
    # Glassy aesthetic for features
    content = content.replace(
        'bg-slate-50 dark:bg-[#0B0E14] rounded-2xl p-8 border border-slate-100 dark:border-slate-800',
        'bg-slate-50 dark:bg-indigo-950/20 rounded-2xl p-8 border border-slate-100 dark:border-white/10 dark:backdrop-blur-md hover:dark:bg-indigo-900/30 hover:dark:border-white/20'
    )
    # Fix the WUFSection which is deeply blue, in dark mode it should just be super dark indigo with neon text
    content = content.replace(
        'bg-blue-600 text-white',
        'bg-blue-600 dark:bg-slate-900 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-blue-900/40 dark:to-slate-900 text-white'
    )
    # Navbar glow
    content = content.replace(
        'dark:bg-[#0B0E14]/90',
        'dark:bg-[#0B0E14]/70 dark:backdrop-blur-xl dark:border-white/10'
    )

with open(landing_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("done")
