import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { selectPartners } from '@/features/partners/partnersSlice'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { assignAccount, selectAssignments, unassignAccount } from '@/features/assignments/assignmentsSlice'
import { Badge, Button, Card, Field, PageHeader, Select, Table, Td } from '@/components/ui'
import { formatDate } from '@/utils/formatDate'

export default function AssignAccount() {
  const dispatch = useAppDispatch()
  const partners = useAppSelector(selectPartners)
  const accounts = useAppSelector(selectAccounts)
  const assignments = useAppSelector(selectAssignments)
  const [partnerId, setPartnerId] = useState('')
  const [choice, setChoice] = useState('') // "accountId|website"

  // every website entered while creating an account becomes one option
  const options = useMemo(
    () =>
      accounts.flatMap((a) =>
        a.websites.map((website) => ({ key: `${a.id}|${website}`, accountId: a.id, website, username: a.username })),
      ),
    [accounts],
  )

  // hide websites this partner already has
  const available = useMemo(() => {
    const taken = new Set(
      assignments.filter((a) => a.partnerId === partnerId).map((a) => `${a.accountId}|${a.website}`),
    )
    return options.filter((o) => !taken.has(o.key))
  }, [options, assignments, partnerId])

  const partnerName = (id) => partners.find((p) => p.id === id)?.name
  const usernameOf = (id) => accounts.find((a) => a.id === id)?.username

  const submit = (e) => {
    e.preventDefault()
    const picked = available.find((o) => o.key === choice)
    if (!partnerId || !picked) return
    dispatch(assignAccount({ partnerId, accountId: picked.accountId, website: picked.website }))
    setChoice('')
  }

  const missing =
    partners.length === 0 ? (
      <>No partners yet. <Link to="/partner" className="font-medium text-indigo-600 hover:underline dark:text-indigo-300">Create a partner</Link> first.</>
    ) : options.length === 0 ? (
      <>No accounts yet. <Link to="/partner/accounts" className="font-medium text-indigo-600 hover:underline dark:text-indigo-300">Create an account</Link> first.</>
    ) : null

  return (
    <>
      <PageHeader
        title="Assign Account"
        subtitle={`${assignments.length} assignment${assignments.length === 1 ? '' : 's'}`}
      />

      <Card className="mb-6 p-5">
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <Field label="Partner">
            <Select
              value={partnerId}
              onChange={(e) => {
                setPartnerId(e.target.value)
                setChoice('')
              }}
              disabled={partners.length === 0}
            >
              <option value="">Select partner</option>
              {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </Field>

          <Field label="Account (website)">
            <Select value={choice} onChange={(e) => setChoice(e.target.value)} disabled={!partnerId || available.length === 0}>
              <option value="">{partnerId && available.length === 0 ? 'Nothing left to assign' : 'Select account'}</option>
              {available.map((o) => (
                <option key={o.key} value={o.key}>{`${o.website} (${o.username})`}</option>
              ))}
            </Select>
          </Field>

          <Button disabled={!partnerId || !choice} className="sm:col-span-2 lg:col-span-1">Assign</Button>
        </form>
        {missing && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{missing}</p>}
      </Card>

      <Table
        headers={['Partner', 'Account (website)', 'Username', 'Assigned', 'Action']}
        isEmpty={assignments.length === 0}
        empty="Nothing assigned yet."
      >
        {assignments.map((a) => (
          <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
            <Td className="font-medium text-slate-900 dark:text-slate-100">{partnerName(a.partnerId) ?? '—'}</Td>
            <Td><Badge>{a.website}</Badge></Td>
            <Td>{usernameOf(a.accountId) ?? '—'}</Td>
            <Td className="text-slate-500 dark:text-slate-400">{formatDate(a.createdAt)}</Td>
            <Td>
              <button
                onClick={() => dispatch(unassignAccount(a.id))}
                className="rounded-lg px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                Remove
              </button>
            </Td>
          </tr>
        ))}
      </Table>
    </>
  )
}
