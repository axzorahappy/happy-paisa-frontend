import { useTheme } from '../contexts/ThemeContext';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 bg-surface rounded">
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}