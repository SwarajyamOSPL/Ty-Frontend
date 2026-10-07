import { useTheme } from '@/hooks/useTheme'
import { MoonIcon, SunIcon } from './icons'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()
  const Icon = theme === 'dark' ? SunIcon : MoonIcon
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      className={`rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 ${className}`}
    >
      <Icon />
    </button>
  )
}
