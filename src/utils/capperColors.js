// The 16 default cappers are colours. Typing one of these names when creating a capper reuses its swatch.
export const CAPPER_COLORS = {
  green: '#16a34a',
  'lime green': '#84cc16',
  yellow: '#eab308',
  'light yellow': '#fde68a',
  pink: '#ec4899',
  'light pink': '#f9a8d4',
  purple: '#9333ea',
  red: '#dc2626',
  grey: '#9ca3af',
  black: '#111827',
  orange: '#f97316',
  'light orange': '#fdba74',
  blue: '#2563eb',
  'light blue': '#7dd3fc',
  teal: '#0d9488',
  maroon: '#7f1d1d',
}

export const DEFAULT_CAPPERS = [
  'Green', 'Lime green', 'Yellow', 'Light yellow', 'Pink', 'Light pink', 'Purple', 'Red',
  'Grey', 'Black', 'Orange', 'Light orange', 'Blue', 'Light blue', 'Teal', 'Maroon',
]

export const colorFor = (name) => CAPPER_COLORS[name.trim().toLowerCase()] ?? null
