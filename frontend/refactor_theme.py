import os
import re

directories = ['src/pages', 'src/components']

replacements = {
    r'text-white': 'text-slate-900 dark:text-white',
    r'text-slate-200': 'text-slate-800 dark:text-slate-200',
    r'text-slate-300': 'text-slate-700 dark:text-slate-300',
    r'text-slate-400': 'text-slate-600 dark:text-slate-400',
    
    r'bg-\[#0B0E14\]': 'bg-slate-50 dark:bg-[#0B0E14]',
    r'bg-\[#0D1117\]': 'bg-white dark:bg-[#0D1117]',
    r'bg-\[#141820\]': 'bg-white dark:bg-[#141820]',
    r'bg-slate-900': 'bg-white dark:bg-slate-900',
    r'bg-slate-800': 'bg-slate-100 dark:bg-slate-800',
    r'bg-slate-800/60': 'bg-white dark:bg-slate-800/60',
    r'bg-slate-800/40': 'bg-slate-50 dark:bg-slate-800/40',
    
    r'border-slate-800': 'border-slate-200 dark:border-slate-800',
    r'border-slate-800/60': 'border-slate-200 dark:border-slate-800/60',
    r'border-slate-800/40': 'border-slate-200 dark:border-slate-800/40',
    r'border-slate-700': 'border-slate-300 dark:border-slate-700',
    
    r'hover:text-white': 'hover:text-slate-900 dark:hover:text-white',
    r'hover:text-slate-200': 'hover:text-slate-800 dark:hover:text-slate-200',
    r'hover:text-slate-300': 'hover:text-slate-700 dark:hover:text-slate-300',
    r'hover:bg-slate-800/50': 'hover:bg-slate-100 dark:hover:bg-slate-800/50',
    r'hover:border-slate-700': 'hover:border-slate-300 dark:hover:border-slate-700',
    r'hover:border-slate-600': 'hover:border-slate-400 dark:hover:border-slate-600',
    
    r'bg-blue-600/15 border-blue-500/40 text-blue-300': 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-600/15 dark:border-blue-500/40 dark:text-blue-300',
}

ordered_patterns = sorted(replacements.keys(), key=len, reverse=True)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    for pattern in ordered_patterns:
        rep = replacements[pattern]
        def replacer(match):
            return rep
        regex = r'(?<=[\s"\'`])(?<!dark:)' + pattern + r'(?=[\s"\'`])'
        content = re.sub(regex, replacer, content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for d in directories:
    root_dir = os.path.join(os.getcwd(), d)
    if os.path.exists(root_dir):
        for root, _, files in os.walk(root_dir):
            for file in files:
                if file.endswith('.js'):
                    process_file(os.path.join(root, file))
