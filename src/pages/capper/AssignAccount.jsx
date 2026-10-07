import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { selectCappers } from '@/features/cappers/cappersSlice'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import {
  assignCapper, selectCapperAssignments, unassignCapper,
} from '@/features/capperAssignments/capperAssignmentsSlice'
import CapperName from '@/components/capper/CapperName'
import { Badge, Button, Card, Field, Input, PageHeader, PasswordInput, Select, Table, Td } from '@/components/ui'
import { formatDate } from '@/utils/formatDate'

export default function CapperAssignAccount() {
  const dispatch = useAppDispatch()
  const cappers = useAppSelector(selectCappers)
  const accounts = useAppSelector(selectAccounts)
  const assignments = useAppSelector(selectCapperAssignments)
  const [capperId, setCapperId] = useState('')
  const [choice, setChoice] = useState('') // "accountId|website"
  const [saved, setSaved] = useState(false)

  // every website of every created account is one option
  const options = useMemo(
    () =>
      accounts.flatMap((a) =>
        a.websites.map((website) => ({ key: `${a.id}|${website}`, accountId: a.id, website, username: a.username })),
      ),
    [accounts],
  )

  // hide accounts this capper already has
  const available = useMemo(() => {
    const taken = new Set(
      assignments.filter((a) => a.capperId === capperId).map((a) => `${a.accountId}|${a.website}`),
    )
    return options.filter((o) => !taken.has(o.key))
  }, [options, assignments, capperId])

  // username / password are looked up from the chosen account
  const picked = available.find((o) => o.key === choice)
  const account = picked && accounts.find((a) => a.id === picked.accountId)

  const capperOf = (id) => cappers.find((c) => c.id === id)
  const usernameOf = (id) => accounts.find((a) => a.id === id)?.username ?? '—'

  const submit = (e) => {
    e.preventDefault()
    if (!capperId || !picked) return
    dispatch(assignCapper({ capperId, accountId: picked.accountId, website: picked.website }))
    setChoice('')
    setSaved(true)
  }

  const noAccounts = options.length === 0

  return (
    <>
      <PageHeader
        title="Assign Account"
        subtitle={`${assignments.length} assignment${assignments.length === 1 ? '' : 's'}`}
      />

      <Card className="mb-6 p-5">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Capper">
              <Select
                value={capperId}
                onChange={(e) => {
                  setCapperId(e.target.value)
                  setChoice('')
                  setSaved(false)
                }}
              >
                <option value="">Select capper</option>
                {cappers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </Field>

            <Field label="Account (website)">
              <Select
                value={choice}
                onChange={(e) => {
                  setChoice(e.target.value)
                  setSaved(false)
                }}
                disabled={!capperId || available.length === 0}
              >
                <option value="">{capperId && !noAccounts && available.length === 0 ? 'Nothing left to assign' : 'Select account'}</option>
                {available.map((o) => (
                  <option key={o.key} value={o.key}>{`${o.website} (${o.username})`}</option>
                ))}
              </Select>
            </Field>

            {/* filled in automatically once an account is selected */}
            <Field label="Username">
              <Input readOnly value={account?.username ?? ''} placeholder="Fetched automatically" />
            </Field>
            <Field label="Password">
              <PasswordInput
                readOnly
                autoComplete="off"
                value={account?.password ?? ''}
                placeholder={picked && !account?.password ? 'Not available' : 'Fetched automatically'}
              />
            </Field>
          </div>

          {picked && !account?.password && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Passwords are kept in memory only in this demo, so they are gone after a page refresh.
            </p>
          )}
          {saved && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              Account assigned.
            </p>
          )}
          {noAccounts && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No accounts yet.{' '}
              <Link to="/partner/accounts" className="font-medium text-indigo-600 hover:underline dark:text-indigo-300">
                Create an account
              </Link>{' '}
              first.
            </p>
          )}

          <Button disabled={!capperId || !choice} className="w-full sm:w-auto">Submit</Button>
        </form>
      </Card>

      <Table
        headers={['Capper', 'Account (website)', 'Username', 'Assigned', 'Action']}
        isEmpty={assignments.length === 0}
        empty="Nothing assigned yet."
      >
        {assignments.map((a) => {
          const capper = capperOf(a.capperId)
          return (
            <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
              <Td>{capper ? <CapperName capper={capper} /> : '—'}</Td>
              <Td><Badge>{a.website}</Badge></Td>
              <Td>{usernameOf(a.accountId)}</Td>
              <Td className="text-slate-500 dark:text-slate-400">{formatDate(a.createdAt)}</Td>
              <Td>
                <button
                  onClick={() => dispatch(unassignCapper(a.id))}
                  className="rounded-lg px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                >
                  Remove
                </button>
              </Td>
            </tr>
          )
        })}
      </Table>
    </>
  )
}
