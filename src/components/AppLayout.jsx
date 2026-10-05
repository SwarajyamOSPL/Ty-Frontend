import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { logout, selectUser } from '@/features/auth/authSlice'
import { useTheme } from '@/hooks/useTheme'
import ScrollToTopButton, { useScrollToTop } from './ScrollToTop'
import {
  ChartIcon, HomeIcon, KeyIcon, LogoutIcon, MoonIcon, SunIcon, TagIcon, UploadIcon, UsersIcon,
} from './ui'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', Icon: HomeIcon },
  { to: '/accounts', label: 'Accounts', Icon: ChartIcon },
  { to: '/cappers', label: 'Cappers', Icon: TagIcon },
  { to: '/partners', label: 'Partners', Icon: UsersIcon },
  { to: '/site-logins', label: 'Site Logins', Icon: KeyIcon },
  { to: '/importing-data', label: 'Importing Data', Icon: UploadIcon },
]

const sideBtn =
  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-800/60 hover:text-white'

export default function AppLayout() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()
  useScrollToTop(pathname)
  const ThemeIcon = theme === 'dark' ? SunIcon : MoonIcon
  const doLogout = () => dispatch(logout())

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 md:flex">
      <aside className="relative bg-slate-900 dark:border-r dark:border-slate-700 text-slate-300 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 font-bold text-white">T</div>
          <span className="text-lg font-semibold text-white">{"Ty's Automation"}</span>
          <div className="ml-auto flex gap-1 md:hidden">
            <button onClick={toggle} aria-label="Toggle theme" className="rounded-lg p-1.5 hover:bg-slate-800">
              <ThemeIcon />
            </button>
            <button onClick={doLogout} aria-label="Log out" className="rounded-lg p-1.5 hover:bg-slate-800">
              <LogoutIcon />
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden space-y-1 px-3 pb-5 md:absolute md:bottom-0 md:block md:w-64">
          <button onClick={toggle} className={sideBtn}>
            <ThemeIcon />
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button onClick={doLogout} className={sideBtn}>
            <LogoutIcon />
            <span className="truncate">Log out ({user})</span>
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <Outlet />
      </main>
      <ScrollToTopButton />
    </div>
  )
}
