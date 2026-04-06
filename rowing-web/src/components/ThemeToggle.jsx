export default function ThemeToggle({ theme, onToggle }) {
    return (
        <button
            type="button"
            className="calculator-theme-toggle"
            onClick={onToggle}
        >
            {theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
        </button>
    );
}
