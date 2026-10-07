// capper name with its colour swatch (custom cappers without a known colour get a neutral one)
export default function CapperName({ capper }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="h-4 w-4 shrink-0 rounded-full ring-1 ring-slate-300 dark:ring-slate-500"
        style={{ backgroundColor: capper.color ?? '#cbd5e1' }}
        aria-hidden="true"
      />
      <span className="font-medium text-slate-900 dark:text-slate-100">{capper.name}</span>
    </span>
  )
}
