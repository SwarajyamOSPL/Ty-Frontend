function Svg({ d, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      {...props}
    >
      <path d={d} />
    </svg>
  )
}

export const HomeIcon = (props) => <Svg d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" {...props} />
export const MenuIcon = (props) => <Svg d="M3 6h18M3 12h18M3 18h18" {...props} />
export const CloseIcon = (props) => <Svg d="M6 6l12 12M18 6L6 18" {...props} />
export const SunIcon = (props) => (
  <Svg d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" {...props} />
)
export const MoonIcon = (props) => <Svg d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" {...props} />
export const LogoutIcon = (props) => <Svg d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" {...props} />
export const EyeIcon = (props) => <Svg d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" {...props} />
export const EyeOffIcon = (props) => (
  <Svg d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" {...props} />
)
export const UsersIcon = (props) => (
  <Svg d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" {...props} />
)
export const ChevronDownIcon = (props) => <Svg d="M6 9l6 6 6-6" {...props} />
export const PlusIcon = (props) => <Svg d="M12 5v14M5 12h14" {...props} />
export const TrashIcon = (props) => (
  <Svg d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 5v6m4-6v6" {...props} />
)
export const TagIcon = (props) => <Svg d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" {...props} />
