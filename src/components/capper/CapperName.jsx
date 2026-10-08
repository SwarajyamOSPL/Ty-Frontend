import CapperThumb from './CapperThumb'

// capper thumbnail + name
export default function CapperName({ capper, size = 'sm' }) {
  return (
    <span className="inline-flex items-center gap-3">
      <CapperThumb capper={capper} size={size} />
      <span className="font-medium text-slate-900 dark:text-slate-100">{capper.name}</span>
    </span>
  )
}
