import React from 'react';

export function ThemeToggle({ theme, onToggle, style }) {
    return (
        <button
            style={style}
            onClick={onToggle}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
            }}
        >
            {theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
        </button>
    );
}

