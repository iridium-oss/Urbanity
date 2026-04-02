import os

filepath = r'c:\Users\Asus-2025\Desktop\hackathon_code\Urbanity\frontend\src\pages\LandingPage.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add useApp 
if "useApp" not in content:
    content = content.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { useApp } from '@/context/AppContext';")

# Add Sun, Moon to lucide
content = content.replace("Server\n}", "Server, Sun, Moon\n}")

# Update Navbar
if "const { theme, toggleTheme } = useApp();" not in content:
    content = content.replace(
        "const [scrolled, setScrolled] = useState(false);",
        "const { theme, toggleTheme } = useApp();\n  const [scrolled, setScrolled] = useState(false);"
    )

if "<button onClick={toggleTheme}" not in content:
    content = content.replace(
        """        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">""",
        """        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link to="/login">"""
    )
    
    # Add to mobile menu
    content = content.replace(
        """          <a href="#business" className="block text-sm text-slate-600" onClick={() => setMobileOpen(false)}>Business</a>
          <Link to="/login" className="block">""",
        """          <a href="#business" className="block text-sm text-slate-600" onClick={() => setMobileOpen(false)}>Business</a>
          <button onClick={toggleTheme} className="w-full text-left text-sm text-slate-600 mb-2 py-2 border-b border-slate-100 flex items-center justify-between">
            {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            {theme === 'dark' ? <Sun className="w-4 h-4 text-blue-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
          </button>
          <Link to="/login" className="block">"""
    )

# Fix button texts
content = content.replace('bg-blue-600 hover:bg-blue-700 text-slate-900 dark:text-white', 'bg-blue-600 hover:bg-blue-700 text-white')
content = content.replace('bg-blue-600 text-slate-900 dark:text-white', 'bg-blue-600 text-white')
content = content.replace('bg-[#030f4f] hover:bg-[#041a9c] text-slate-900 dark:text-white', 'bg-[#030f4f] hover:bg-[#041a9c] text-white bg-blue-600')
content = content.replace('className="w-6 h-6 text-slate-900 dark:text-white"', 'className="w-6 h-6 text-white"')
content = content.replace('bg-white dark:bg-slate-900 text-slate-900 dark:text-white', 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white') # leave
content = content.replace('className="py-24 sm:py-32 bg-blue-600 text-slate-900 dark:text-white"', 'className="py-24 sm:py-32 bg-blue-600 text-white"')
content = content.replace('h3 className="font-heading font-medium text-slate-900 dark:text-white mb-2 text-sm"', 'h3 className="font-heading font-medium text-white mb-2 text-sm"')
content = content.replace('span className="font-heading font-bold text-slate-900 dark:text-white tracking-tight" Urbanivity', 'span className="font-heading font-bold text-white tracking-tight" Urbanivity')
# Keep footer urbanivity white text by correcting it directly
content = content.replace('text-slate-900 dark:text-white tracking-tight">Urbanivity', 'text-white tracking-tight">Urbanivity')
content = content.replace('w-5 h-5 text-slate-900 dark:text-white', 'w-5 h-5 text-white')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed LandingPage buttons')
