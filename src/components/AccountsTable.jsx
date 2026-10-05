import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchAccounts } from '@/features/accounts/accountsThunks'
import {
  selectAccounts, selectAccountsError, selectAccountsStatus,
} from '@/features/accounts/accountsSlice'
import { formatMoney } from '@/utils/formatMoney'
import { systemService } from '@/services/systemService'
import { Badge, Button, ErrorText, PageHeader, Table, Td, inputCls } from './ui'

const HEADERS = ['Account ID', 'Partner', 'Book', 'Cappers', 'Previous Balance', 'Figure', 'Date', 'Action']
export default function AccountsTable() {
  const dispatch = useAppDispatch()
  const rows = useAppSelector(selectAccounts)
  const status = useAppSelector(selectAccountsStatus)
  const error = useAppSelector(selectAccountsError)
  const loading = status === 'idle' || status === 'loading'
  const [query, setQuery] = useState('')
  const [from, setFrom] = useState('') // YYYY-MM-DD, empty = no lower limit
  const [to, setTo] = useState('') // YYYY-MM-DD, empty = no upper limit
  const navigate = useNavigate()

  // the date range is applied by the server; refetch whenever it changes
  useEffect(() => {
    const range = { startDate: from, endDate: to }
    dispatch(fetchAccounts(range))
    const id = setInterval(() => dispatch(fetchAccounts({ ...range, silent: true })), 60_000)
    return () => clearInterval(id)
  }, [dispatch, from, to])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      return !q || [r.account_id, r.partner, r.book, r.cappers].some((v) => v?.toLowerCase().includes(q))
    })
  }, [rows, query])

  return (
    <>
      <PageHeader
        title="Accounts"
        subtitle={loading ? 'Loading…' : `${visible.length} of ${rows.length} accounts`}
      >
        <a
          href={systemService.masterSheetUrl}
          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40"
        >
          Download master sheet
        </a>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          className={`${inputCls} max-w-xs`}
          placeholder="Search account, partner, book or capper…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            From
            <input
              type="date"
              className={`${inputCls} w-auto`}
              value={from}
              max={to || undefined}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            To
            <input
              type="date"
              className={`${inputCls} w-auto`}
              value={to}
              min={from || undefined}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          {(from || to) && (
            <Button
              variant="secondary"
              onClick={() => {
                setFrom('')
                setTo('')
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {status === 'failed' && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}

      <Table headers={HEADERS} loading={loading} isEmpty={visible.length === 0} empty={from || to ? 'No accounts in this date range.' : 'No accounts found.'}>
        {visible.map((r) => {
          const cappers = r.cappers ? r.cappers.split(',').map((c) => c.trim()) : []
          return (
            <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
              <Td className="font-medium text-slate-900 dark:text-slate-100">{r.account_id}</Td>
              <Td>{r.partner || <span className="text-slate-400">—</span>}</Td>
              <Td className="max-w-56 truncate" title={r.book || ''}>
                {r.book || <span className="text-slate-400">—</span>}
              </Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {cappers.length ? cappers.map((c) => <Badge key={c} tone="indigo">{c}</Badge>) : <span className="text-slate-400">—</span>}
                </div>
              </Td>
              <Td className="tabular-nums">{formatMoney(r.previous_balance)}</Td>
              <Td>
                <Badge tone={r.final_figure >= 0 ? 'green' : 'red'}>{formatMoney(r.final_figure)}</Badge>
              </Td>
              <Td className="text-slate-500 dark:text-slate-400">
                {new Date(r.ran_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </Td>
              <Td>
                <Button variant="ghost" className="px-2! py-1!" onClick={() => navigate(`/accounts/${encodeURIComponent(r.account_id)}`)}>
                  View
                </Button>
              </Td>
            </tr>
          )
        })}
      </Table>
    </>
  )
}
