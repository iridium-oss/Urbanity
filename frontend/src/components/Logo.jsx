import React from 'react';

export default function Logo({ size = 64, className = '', hideText = false }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <img
                src="/assets/urbanivity-logo.png"
                alt="Urbanivity logo"
                className="w-[50%] h-[50%] block"
            />
            {!hideText && (
                <span className="font-heading font-bold text-lg text-slate-900 tracking-tight">Urbanivity</span>
            )}
        </div>
    );
}
