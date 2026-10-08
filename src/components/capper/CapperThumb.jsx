const SIZES = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
}

const FALLBACK = '#cbd5e1' // custom cappers without a known colour

// dark letter on light tiles (Light yellow, Light pink...), white letter on dark ones (Black, Maroon...)
const readableOn = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return (r * 299 + g * 587 + b * 114) / 1000 >= 150 ? '#0f172a' : '#ffffff'
}

// rounded tile in the capper's colour with the first letter of its name
export default function CapperThumb({ capper, size = 'sm' }) {
  const color = capper.color ?? FALLBACK
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-lg font-semibold uppercase ring-1 ring-black/10 dark:ring-white/20 ${SIZES[size]}`}
      style={{ backgroundColor: color, color: readableOn(color) }}
    >
      {capper.name.trim()[0]}
    </span>
  )
}
