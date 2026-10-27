import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={`Current: ${theme === 'system' ? 'System (' + (isDark ? 'Dark' : 'Light') + ')' : isDark ? 'Dark Mode' : 'Light Mode'} — Click to toggle`}
      className={`relative inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-offset-slate-900 ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400 hover:rotate-45 transition-transform duration-200" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600 hover:-rotate-12 transition-transform duration-200" />
      )}
      {showLabel && (
        <span className="ml-2 text-xs font-medium text-slate-700 dark:text-slate-300">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};
