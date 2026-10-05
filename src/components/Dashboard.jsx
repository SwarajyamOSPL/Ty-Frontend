import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchAccounts, fetchRuns } from '@/features/accounts/accountsThunks'
import { fetchCappers } from '@/features/cappers/cappersThunks'
import { selectCappers, selectCappersStatus } from '@/features/cappers/cappersSlice'
import { selectAccounts, selectAccountsStatus, selectRuns, selectRunsStatus } from '@/features/accounts/accountsSlice'
import { selectUser } from '@/features/auth/authSlice'
import { formatMoney } from '@/utils/formatMoney'
import { Badge, Card, PageHeader, Skeleton, StatCard, Table, Td } from './ui'

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening'
}

const SummaryRow = ({ label, value, tone, loading }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-slate-600 dark:text-slate-400">{label}</span>
    {loading ? (
      <Skeleton className="h-6 w-24" />
    ) : (
      <span className={`text-lg font-semibold tabular-nums ${tone}`}>{formatMoney(value)}</span>
    )}
  </div>
)

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(selectAccounts)
  const runs = useAppSelector(selectRuns)
  const user = useAppSelector(selectUser)
  const cappers = useAppSelector(selectCappers)
  const cappersStatus = useAppSelector(selectCappersStatus)
  const loadingCappers = cappersStatus === 'idle' || cappersStatus === 'loading'
  const accountsStatus = useAppSelector(selectAccountsStatus)
  const runsStatus = useAppSelector(selectRunsStatus)
  const loadingAccounts = accountsStatus === 'idle' || accountsStatus === 'loading'
  const loadingRuns = runsStatus === 'idle' || runsStatus === 'loading'

  useEffect(() => {
    dispatch(fetchAccounts())
    dispatch(fetchRuns())
    dispatch(fetchCappers())
  }, [dispatch])

  const s = useMemo(() => {
    const win = accounts.filter((a) => a.final_figure >= 0).reduce((t, a) => t + Number(a.final_figure), 0)
    const loss = accounts.filter((a) => a.final_figure < 0).reduce((t, a) => t + Number(a.final_figure), 0)
    return { win, loss, total: win + loss }
  }, [accounts])

  const calculated = runs.reduce((t, r) => t + r.accounts, 0)

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`${greeting()}, ${user}`} />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Accounts" value={accounts.length} loading={loadingAccounts} />
        <StatCard label="Cappers" value={cappers.length} loading={loadingCappers} />
        <StatCard label="Calculated" value={calculated.toLocaleString()} loading={loadingRuns} />
        <StatCard label="Runs" value={runs.length} loading={loadingRuns} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Weekly Figure Summary</h2>
          <Card className="divide-y divide-slate-100 dark:divide-slate-700 px-5">
            <SummaryRow loading={loadingAccounts} label="Total Figure" value={s.total} tone={s.total >= 0 ? 'text-slate-900 dark:text-slate-100' : 'text-rose-600 dark:text-rose-400'} />
            <SummaryRow loading={loadingAccounts} label="Win" value={s.win} tone="text-emerald-600 dark:text-emerald-400" />
            <SummaryRow loading={loadingAccounts} label="Loss" value={s.loss} tone="text-rose-600 dark:text-rose-400" />
          </Card>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Calculation Runs</h2>
          <Table headers={['Date', 'Run', 'Accounts', 'Status']} loading={loadingRuns} skeletonRows={4} isEmpty={runs.length === 0} empty="No runs yet.">
            {runs.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                <Td>{new Date(r.ran_at).toLocaleString()}</Td>
                <Td className="text-slate-500 dark:text-slate-400">{r.id}</Td>
                <Td className="tabular-nums">{r.accounts}</Td>
                <Td><Badge tone="green">Completed</Badge></Td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </>
  )
}
