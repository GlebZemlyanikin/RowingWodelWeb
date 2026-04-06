import React from 'react';

export function ThemeToggle({ theme, onToggle, style }) {
    return (
        <button style={style} onClick={onToggle}>
            {theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
        </button>
    );
}

