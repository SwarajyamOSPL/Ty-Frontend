import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchAccounts, fetchHistory, fetchReceipt, runPipeline } from '@/features/accounts/accountsThunks'
import {
  clearDetail, selectDetailError, selectDetailStatus, selectHistory, selectReceipt, selectRunning,
} from '@/features/accounts/accountsSlice'
import { formatMoney } from '@/utils/formatMoney'
import { Badge, Button, Card, ErrorText, PageHeader, Skeleton, Table, Td } from './ui'

const tone = (n) => (n >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')

const Row = ({ label, value, bold }) => (
  <div className={`flex items-center justify-between py-3 ${bold ? 'font-semibold text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
    <span>{label}</span>
    <span className={`tabular-nums ${bold ? 'text-lg' : ''} ${tone(value)}`}>{formatMoney(value)}</span>
  </div>
)

const Heading = ({ children }) => (
  <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{children}</h2>
)

function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <section>
        <Skeleton className="mb-3 h-6 w-40" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="space-y-3 p-5">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      </section>
      <section className="max-w-xl">
        <Skeleton className="mb-3 h-6 w-32" />
        <Card className="space-y-4 p-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </Card>
      </section>
      <section>
        <Skeleton className="mb-3 h-6 w-24" />
        <Table headers={['Run', 'Date', 'Combined', 'Adjustment', 'Previous', 'Final']} loading skeletonRows={3} />
      </section>
    </div>
  )
}

export default function AccountDetail({ accountId, onBack }) {
  const dispatch = useAppDispatch()
  const receipt = useAppSelector(selectReceipt)
  const history = useAppSelector(selectHistory)
  const status = useAppSelector(selectDetailStatus)
  const error = useAppSelector(selectDetailError)
  const running = useAppSelector(selectRunning)

  const load = () => {
    dispatch(fetchReceipt(accountId))
    dispatch(fetchHistory(accountId))
  }

  useEffect(() => {
    load()
    return () => dispatch(clearDetail())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId])

  const rerun = async () => {
    await dispatch(runPipeline())
    dispatch(fetchAccounts({ silent: true }))
    load()
  }

  return (
    <>
      <button
        onClick={onBack}
        className="mb-4 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
      >
        ← Back to Accounts
      </button>

      <PageHeader
        title={`Account ${accountId}`}
        subtitle={receipt && `Calculated ${new Date(receipt.calculated_at).toLocaleString()} · Run ${receipt.run_number}`}
      >
        <Button disabled={running} onClick={rerun}>{running ? 'Running…' : 'Run Calculation'}</Button>
      </PageHeader>

      {(!receipt || status === 'loading') && status !== 'failed' && <DetailSkeleton />}
      {status === 'failed' && <ErrorText>{error}</ErrorText>}

      {receipt && status !== 'loading' && (
        <div className="space-y-8">
          <section>
            <Heading>Assigned Cappers</Heading>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {receipt.contributions.map((c) => (
                <Card key={c.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{c.capper}</h3>
                    <Badge tone="slate">{c.source_format}</Badge>
                  </div>
                  <p className={`mt-3 text-2xl font-semibold tabular-nums ${tone(c.amount)}`}>{formatMoney(c.amount)}</p>
                  <dl className="mt-3 space-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between">
                      <dt>Source</dt>
                      <dd className="truncate pl-3 text-slate-700 dark:text-slate-300">{c.source_file}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Updated</dt>
                      <dd className="text-slate-700 dark:text-slate-300">{new Date(receipt.calculated_at).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </Card>
              ))}
            </div>
          </section>

          <section className="max-w-xl">
            <Heading>Calculation</Heading>
            <Card className="divide-y divide-slate-100 px-5 dark:divide-slate-700">
              {receipt.contributions.map((c) => <Row key={c.id} label={c.capper} value={c.amount} />)}
              <Row label="Combined Figure" value={receipt.combined_capper_total} />
              <Row label="Adjustment" value={receipt.adjustment} />
              <Row label="Previous Balance" value={receipt.previous_balance} />
              <Row label="Final Figure" value={receipt.final_figure} bold />
            </Card>
          </section>

          <section>
            <Heading>History</Heading>
            <Table
              headers={['Run', 'Date', 'Combined', 'Adjustment', 'Previous', 'Final']}
              isEmpty={history.length === 0}
              empty="No history."
            >
              {[...history].reverse().map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                  <Td>{h.run_id}</Td>
                  <Td className="text-slate-500 dark:text-slate-400">{new Date(h.ran_at).toLocaleString()}</Td>
                  <Td className="tabular-nums">{formatMoney(h.combined_capper_total)}</Td>
                  <Td className="tabular-nums">{formatMoney(h.adjustment)}</Td>
                  <Td className="tabular-nums">{formatMoney(h.previous_balance)}</Td>
                  <Td><Badge tone={h.final_figure >= 0 ? 'green' : 'red'}>{formatMoney(h.final_figure)}</Badge></Td>
                </tr>
              ))}
            </Table>
          </section>
        </div>
      )}
    </>
  )
}
