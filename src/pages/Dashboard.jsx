import { Link } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useRedux'
import { BriefcaseIcon, ChartBarIcon, LinkIcon, TagIcon, UsersIcon } from '@/components/icons'
import { selectUser } from '@/features/auth/authSlice'
import { useDashboardData } from '@/features/dashboard/useDashboardData'
import CapperName from '@/components/capper/CapperName'
import PieCard from '@/components/charts/PieCard'
import ImportSummary from '@/components/dashboard/ImportSummary'
import { Badge, Card, StatCard, Table, Td } from '@/components/ui'
import { formatDate } from '@/utils/formatDate'
import { formatMoney } from '@/utils/formatMoney'

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening'
}

const tone = (n) => (n >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')
const linkCls = 'font-medium text-indigo-600 hover:underline dark:text-indigo-300'

function Section({ title, action, children, className = '' }) {
  return (
    <section className={`min-w-0 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function Empty({ children }) {
  return <p className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">{children}</p>
}

function SummaryRow({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className={bold ? 'font-medium' : 'text-slate-600 dark:text-slate-400'}>{label}</span>
      <span className={`tabular-nums ${bold ? 'text-lg font-semibold' : 'font-medium'} ${tone(value)}`}>
        {formatMoney(value)}
      </span>
    </div>
  )
}

// partner slices cycle through these (cappers use their own colour)
const PALETTE = ['#6366f1', '#10b981', '#f59e0b', '#0ea5e9', '#f43f5e', '#8b5cf6', '#14b8a6', '#f97316']
const NEUTRAL = '#94a3b8'
const NOTE = 'Slice size uses absolute amounts; red values are losses.'

const STEPS = [
  { to: '/partner', label: 'Create a partner' },
  { to: '/partner/accounts', label: 'Create an account (username, password, websites)' },
  { to: '/partner/assign-account', label: 'Assign the account to a partner' },
  { to: '/partner/enter-figure', label: 'Enter a figure' },
]

export default function Dashboard() {
  const user = useAppSelector(selectUser)
  const { counts, totals, byCapper, byPartner, recent } = useDashboardData()

  const winShare = totals.win + Math.abs(totals.loss) > 0 ? (totals.win / (totals.win + Math.abs(totals.loss))) * 100 : null
  const maxCapper = Math.max(1, ...byCapper.map((c) => Math.abs(c.total)))

  const totalPie = [
    { id: 'partner', label: 'Partner figures', value: totals.partner, color: '#6366f1' },
    { id: 'capper', label: 'Capper figures', value: totals.capper, color: '#14b8a6' },
  ]
  const capperPie = byCapper.map(({ capper, total }) => ({
    id: capper.id, label: capper.name, value: total, color: capper.color ?? NEUTRAL,
  }))
  const partnerPie = byPartner
    .filter((p) => p.entries > 0)
    .map(({ partner, total }, i) => ({ id: partner.id, label: partner.name, value: total, color: PALETTE[i % PALETTE.length] }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {greeting()}, {user}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Partners" value={counts.partners} icon={UsersIcon} theme="indigo" />
        <StatCard label="Accounts" value={counts.accounts} icon={BriefcaseIcon} theme="sky" />
        <StatCard label="Cappers" value={counts.cappers} icon={TagIcon} theme="amber" />
        <StatCard label="Assigned" value={counts.assigned} hint="partner + capper" icon={LinkIcon} theme="emerald" />
        <StatCard label="Figures entered" value={counts.figures} icon={ChartBarIcon} theme="violet" />
      </div>

      {counts.figures === 0 && (
        <Card className="p-5">
          <h2 className="font-semibold">Get started</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Figures show up here once you enter them.</p>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-sm">
            {STEPS.map((s) => (
              <li key={s.to}>
                <Link to={s.to} className={linkCls}>{s.label}</Link>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Section title="Figure Summary">
          <Card className="divide-y divide-slate-100 px-5 dark:divide-slate-700">
            <SummaryRow label="Total Figure" value={totals.total} bold />
            <SummaryRow label="Win" value={totals.win} />
            <SummaryRow label="Loss" value={totals.loss} />
            <SummaryRow label="Partner figures" value={totals.partner} />
            <SummaryRow label="Capper figures" value={totals.capper} />
          </Card>
          {winShare !== null && (
            <div className="mt-4" role="img" aria-label={`Win ${winShare.toFixed(0)} percent, loss ${(100 - winShare).toFixed(0)} percent`}>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-rose-500/80">
                <div className="bg-emerald-500" style={{ width: `${winShare}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Win {winShare.toFixed(0)}%</span>
                <span>Loss {(100 - winShare).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </Section>

        <Section
          title="Figures by Capper"
          className="lg:col-span-2"
          action={<Link to="/capper/enter-figure" className={`${linkCls} text-sm`}>Enter figure</Link>}
        >
          <Card className="p-5">
            {byCapper.length === 0 ? (
              <Empty>No capper figures yet.</Empty>
            ) : (
              <ul className="space-y-4">
                {byCapper.map(({ capper, total, entries }) => (
                  <li key={capper.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate"><CapperName capper={capper} /></span>
                      <span className={`shrink-0 font-semibold tabular-nums ${tone(total)}`}>
                        {formatMoney(total)}
                        <span className="ml-2 text-xs font-normal text-slate-400">{entries} entr{entries === 1 ? 'y' : 'ies'}</span>
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(2, (Math.abs(total) / maxCapper) * 100)}%`,
                          backgroundColor: capper.color ?? '#94a3b8',
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </Section>
      </div>

      <Section title="Figure Breakdown">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PieCard title="Total Figures" data={totalPie} empty="No figures entered yet." note={NOTE} />
          <PieCard title="Capper Figures" data={capperPie} empty="No capper figures yet." note={NOTE} />
          <PieCard
            title="Partner Figures"
            data={partnerPie}
            empty="No partner figures yet."
            note={NOTE}
            className="md:col-span-2 lg:col-span-1"
          />
        </div>
      </Section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Section
          title="Recent Figure Entries"
          className="lg:col-span-3"
          action={<Link to="/partner/enter-figure" className={`${linkCls} text-sm`}>Enter figure</Link>}
        >
          <Table
            headers={['Date', 'Type', 'Name', 'Account', 'Figure']}
            isEmpty={recent.length === 0}
            empty="No figures entered yet."
          >
            {recent.map((e) => (
              <tr key={`${e.kind}-${e.id}`} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                <Td className="text-slate-500 dark:text-slate-400">{formatDate(e.createdAt)}</Td>
                <Td><Badge>{e.kind}</Badge></Td>
                <Td className="font-medium text-slate-900 dark:text-slate-100">
                  {!e.owner ? '—' : e.kind === 'Capper' ? <CapperName capper={e.owner} /> : e.owner.name}
                </Td>
                <Td>
                  <div>{e.website}</div>
                  <div className="text-xs text-slate-400">{e.username}</div>
                </Td>
                <Td className={`font-semibold tabular-nums ${tone(e.figure)}`}>{formatMoney(e.figure)}</Td>
              </tr>
            ))}
          </Table>
        </Section>

        <Section
          title="Partners"
          className="lg:col-span-2"
          action={<Link to="/partner" className={`${linkCls} text-sm`}>View all</Link>}
        >
          <Card className="divide-y divide-slate-100 dark:divide-slate-700">
            {byPartner.length === 0 ? (
              <Empty>No partners yet.</Empty>
            ) : (
              byPartner.slice(0, 5).map(({ partner, total, entries, accounts }) => (
                <div key={partner.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{partner.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {accounts} account{accounts === 1 ? '' : 's'} · {entries} entr{entries === 1 ? 'y' : 'ies'}
                    </p>
                  </div>
                  <span className={`shrink-0 font-semibold tabular-nums ${tone(total)}`}>{formatMoney(total)}</span>
                </div>
              ))
            )}
          </Card>
        </Section>
      </div>

      <ImportSummary />
    </div>
  )
}
