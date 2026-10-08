import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { logout, selectUser } from '@/features/auth/authSlice'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import ThemeToggle from '@/components/ThemeToggle'
import { ChevronDownIcon, CloseIcon, HomeIcon, LogoutIcon, MenuIcon, TagIcon, UploadIcon, UsersIcon } from '@/components/icons'

// an item with `children` becomes an expandable group whose own link opens its main page
const NAV = [
  { to: '/dashboard', label: 'Dashboard', Icon: HomeIcon },
  {
    to: '/partner',
    label: 'Partner',
    Icon: UsersIcon,
    children: [
      { to: '/partner/accounts', label: 'Account' },
      { to: '/partner/assign-account', label: 'Assign Account' },
      { to: '/partner/enter-figure', label: 'Enter Figure' },
    ],
  },
  {
    to: '/capper',
    label: 'Capper',
    Icon: TagIcon,
    children: [
      { to: '/capper/assign-account', label: 'Assign Account' },
      { to: '/capper/enter-figure', label: 'Enter Figure' },
    ],
  },
  { to: '/import-file', label: 'Import File', Icon: UploadIcon },
]

const linkCls = (isActive) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/60'
  }`

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">T</div>
      <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">{"Ty's Automation"}</span>
    </div>
  )
}

function NavGroup({ item, onNavigate }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const inside = pathname === item.to || pathname.startsWith(`${item.to}/`)
  // follows the route until the user opens/closes it by hand on the current page
  const [manual, setManual] = useState(null)
  const open = manual && manual.path === pathname ? manual.open : inside
  const { Icon } = item

  // click: closed -> open the dropdown (and go to the group's page); open -> close it
  const toggle = () => {
    if (open) return setManual({ path: pathname, open: false })
    setManual({ path: pathname, open: true })
    if (pathname !== item.to) navigate(item.to)
  }

  return (
    <div>
      <button
        onClick={toggle}
        aria-expanded={open}
        className={`${linkCls(inside)} w-full`}
      >
        <Icon />
        {item.label}
        <ChevronDownIcon className={`ml-auto h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* grid-rows trick: animates the height from 0 to the content height */}
      <div className={`grid transition-[grid-template-rows] duration-200 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden" inert={!open}>
          <div className="ml-5 mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-700">
            {item.children.map((c) => (
              <NavLink key={c.to} to={c.to} end onClick={onNavigate} className={({ isActive }) => linkCls(isActive)}>
                {c.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AppLayout() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const { pathname } = useLocation()
  useScrollToTop(pathname) // every page opens at the top
  const [open, setOpen] = useState(false) // mobile drawer

  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden' // page behind the drawer must not scroll
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onResize = (e) => e.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [open])
  const close = () => setOpen(false)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 lg:flex">
      {/* dim background behind the mobile drawer */}
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={close} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-700 dark:bg-slate-800 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Brand />
          <button
            onClick={close}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {NAV.map((item) =>
            item.children ? (
              <NavGroup key={item.to} item={item} onNavigate={close} />
            ) : (
              <NavLink key={item.to} to={item.to} onClick={close} className={({ isActive }) => linkCls(isActive)}>
                <item.Icon />
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90 sm:px-6">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden"
          >
            <MenuIcon />
          </button>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-1 sm:pl-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold uppercase text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300">
                {user?.[0]}
              </div>
              <span className="hidden max-w-32 truncate text-sm font-medium sm:block">{user}</span>
            </div>
            <button
              onClick={() => dispatch(logout())}
              aria-label="Log out"
              title="Log out"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <LogoutIcon />
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {/* very wide monitors: keep content readable instead of stretching edge to edge */}
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>

      <ScrollToTopButton />
    </div>
  )
}
