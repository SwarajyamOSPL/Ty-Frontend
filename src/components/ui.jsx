import { useEffect, useState } from 'react'

export const inputCls =
  'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

export const Field = ({ label, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
    {children}
  </label>
)

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
  secondary: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/40',
  danger: 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10',
  ghost: 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10',
}

export const Button = ({ variant = 'primary', className = '', ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    {...props}
  />
)

export const ErrorText = ({ children }) =>
  children ? (
    <p className="rounded-lg bg-rose-50 dark:bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-400">{String(children)}</p>
  ) : null

export const Card = ({ className = '', ...props }) => (
  <div className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm ${className}`} {...props} />
)

export const Badge = ({ tone = 'slate', children }) => {
  const tones = {
    slate: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    green: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    red: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300',
  }
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>
}

export const PageHeader = ({ title, subtitle, children }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  </div>
)

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-slate-200 dark:bg-slate-600/60 ${className}`} />
)

export const StatCard = ({ label, value, loading, tone = 'text-slate-900 dark:text-slate-100' }) => (
  <Card className="p-5">
    {loading ? (
      <div aria-busy="true" aria-label={`Loading ${label}`}>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-4 h-7 w-28" />
      </div>
    ) : (
      <>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
        <p className={`mt-2 text-2xl font-semibold tabular-nums ${tone}`}>{value}</p>
      </>
    )}
  </Card>
)

const SKELETON_WIDTHS = ['w-20', 'w-28', 'w-16', 'w-24', 'w-32']

export const Table = ({ headers, children, empty, isEmpty, loading, skeletonRows = 6 }) => (
  <Card className="overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <tr>{headers.map((h, i) => <th key={i} className="whitespace-nowrap px-4 py-3 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {loading ? (
            Array.from({ length: skeletonRows }, (_, r) => (
              <tr key={r}>
                {headers.map((_, c) => (
                  <td key={c} className="px-4 py-4">
                    <Skeleton className={`h-4 ${SKELETON_WIDTHS[(r + c) % SKELETON_WIDTHS.length]}`} />
                  </td>
                ))}
              </tr>
            ))
          ) : isEmpty ? (
            <tr><td colSpan={headers.length} className="px-4 py-12 text-center text-slate-400">{empty}</td></tr>
          ) : children}
        </tbody>
      </table>
    </div>
  </Card>
)

export const Td = ({ className = '', ...props }) => (
  <td className={`whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-300 ${className}`} {...props} />
)

export function Modal({ title, onClose, children, wide, side }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 z-50 flex bg-slate-900/40 backdrop-blur-md ${side ? 'justify-end' : 'items-center justify-center p-4'}`}
      onClick={onClose}
    >
      <div
        className={
          side
            ? 'flex h-full w-full max-w-md flex-col bg-white dark:bg-slate-800 shadow-2xl'
            : `max-h-full w-full overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 shadow-2xl ${wide ? 'max-w-3xl' : 'max-w-md'}`
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-2xl leading-none text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300">
            &times;
          </button>
        </div>
        <div className={side ? 'flex-1 overflow-y-auto p-6' : 'p-6'}>{children}</div>
      </div>
    </div>
  )
}

const icon = (d) => (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" {...props}>
    <path d={d} />
  </svg>
)

export const ChartIcon = icon('M4 20V10m6 10V4m6 16v-7m4 7H2')
export const UsersIcon = icon('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75')
export const KeyIcon = icon('M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3')
export const EyeIcon = icon('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z')
export const EyeOffIcon = icon('M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22')

export function PasswordInput(props) {
  const [show, setShow] = useState(false)
  const Icon = show ? EyeOffIcon : EyeIcon
  return (
    <div className="relative">
      <input className={`${inputCls} pr-10`} type={show ? 'text' : 'password'} {...props} />
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        <Icon />
      </button>
    </div>
  )
}
export const HomeIcon = icon('M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z')
export const SunIcon = icon('M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42')
export const MoonIcon = icon('M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z')
export const TagIcon = icon('M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01')

export const Switch = ({ checked, onChange, disabled, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
      checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-5.5' : 'translate-x-0.5'
      }`}
    />
  </button>
)
export const UploadIcon = icon('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12')
export const LogoutIcon = icon('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9')
