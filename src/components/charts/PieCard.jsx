import { Card } from '@/components/ui'
import { formatMoney } from '@/utils/formatMoney'

/**
 * Pie chart card (no chart library: a CSS conic-gradient circle plus a legend).
 * data: [{ id, label, value, color, extra? }]
 * A pie cannot show negative amounts, so slice size uses the absolute value;
 * the legend still shows the real signed amount (red when negative).
 */
export default function PieCard({ title, data, empty, note, className = '' }) {
  const slices = data.filter((d) => d.value !== 0)
  const total = slices.reduce((t, d) => t + Math.abs(d.value), 0)

  // cumulative start of each slice, as a percentage of the circle
  const starts = slices.reduce((acc, d, i) => [...acc, i === 0 ? 0 : acc[i - 1] + (Math.abs(slices[i - 1].value) / total) * 100], [])
  const stops = slices.map((d, i) => `${d.color} ${starts[i]}% ${starts[i] + (Math.abs(d.value) / total) * 100}%`)

  return (
    <Card className={`flex flex-col p-5 ${className}`}>
      <h3 className="font-semibold">{title}</h3>

      {slices.length === 0 ? (
        <p className="flex flex-1 items-center justify-center py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          {empty}
        </p>
      ) : (
        <>
          <div className="my-5 flex justify-center">
            <div
              role="img"
              aria-label={`${title}: ${slices.map((d) => `${d.label} ${formatMoney(d.value)}`).join(', ')}`}
              className="h-40 w-40 rounded-full ring-1 ring-black/10 dark:ring-white/20 sm:h-44 sm:w-44"
              style={{ background: `conic-gradient(${stops.join(', ')})` }}
            />
          </div>

          <ul className="max-h-52 space-y-2 overflow-y-auto pr-1 text-sm">
            {slices.map((d) => (
              <li key={d.id} className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 shrink-0 rounded-sm ring-1 ring-black/10 dark:ring-white/20"
                  style={{ backgroundColor: d.color }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate">{d.label}</span>
                <span className={`shrink-0 font-medium tabular-nums ${d.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {formatMoney(d.value)}
                </span>
                <span className="w-10 shrink-0 text-right text-xs tabular-nums text-slate-400">
                  {((Math.abs(d.value) / total) * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
          {note && <p className="mt-3 text-xs text-slate-400">{note}</p>}
        </>
      )}
    </Card>
  )
}
