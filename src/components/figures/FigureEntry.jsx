import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, Field, Input, PageHeader, PasswordInput, Select, Table, Td } from '@/components/ui'
import { formatDate, formatDay } from '@/utils/formatDate'
import { formatMoney } from '@/utils/formatMoney'

const linkCls = 'font-medium text-indigo-600 hover:underline dark:text-indigo-300'

/**
 * Shared "Enter Figure" screen for any kind of owner (partner, capper...).
 * owners:      [{ id, name }]
 * assignments: [{ id, ownerId, accountId, website }]   (which accounts each owner may enter figures for)
 * figures:     [{ id, ownerId, accountId, website, figure, fromDate, toDate, createdAt }]
 * accounts:    [{ id, username, password? }]
 */
export default function FigureEntry({
  ownerLabel, owners, assignments, figures, accounts, onSubmit, createOwnerPath, assignPath, renderOwner,
}) {
  const lower = ownerLabel.toLowerCase()
  const [ownerId, setOwnerId] = useState('')
  const [assignmentId, setAssignmentId] = useState('')
  const [figure, setFigure] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  // accounts (websites) assigned to the chosen owner
  const options = useMemo(() => assignments.filter((a) => a.ownerId === ownerId), [assignments, ownerId])

  // login details are looked up from the chosen assignment
  const selected = options.find((a) => a.id === assignmentId)
  const account = selected && accounts.find((a) => a.id === selected.accountId)

  const ownerOf = (id) => owners.find((o) => o.id === id)
  const usernameOf = (id) => accounts.find((a) => a.id === id)?.username ?? '—'
  const touch = () => {
    setError('')
    setSaved(false)
  }

  const submit = (e) => {
    e.preventDefault()
    const value = Number(figure)
    if (!selected) return setError(`Select a ${lower} and an account.`)
    if (!fromDate || !toDate) return setError('Select the from and to dates.')
    if (toDate < fromDate) return setError('The to date cannot be before the from date.')
    if (figure.trim() === '' || !Number.isFinite(value)) return setError('Enter a valid figure.')

    onSubmit({ ownerId, accountId: selected.accountId, website: selected.website, figure: value, fromDate, toDate })
    setAssignmentId('')
    setFigure('')
    setError('')
    setSaved(true)
  }

  const hint =
    owners.length === 0 ? (
      <>No {lower}s yet. <Link to={createOwnerPath} className={linkCls}>Create a {lower}</Link> first.</>
    ) : ownerId && options.length === 0 ? (
      <>No account is assigned to this {lower}. <Link to={assignPath} className={linkCls}>Assign an account</Link> first.</>
    ) : null

  return (
    <>
      <PageHeader title="Enter Figure" subtitle={`${figures.length} figure${figures.length === 1 ? '' : 's'} entered`} />

      <Card className="mb-6 p-5">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={ownerLabel}>
              <Select
                value={ownerId}
                disabled={owners.length === 0}
                onChange={(e) => {
                  setOwnerId(e.target.value)
                  setAssignmentId('')
                  touch()
                }}
              >
                <option value="">Select {lower}</option>
                {owners.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </Select>
            </Field>

            <Field label="Account (website)">
              <Select
                value={assignmentId}
                disabled={!ownerId || options.length === 0}
                onChange={(e) => {
                  setAssignmentId(e.target.value)
                  touch()
                }}
              >
                <option value="">Select account</option>
                {options.map((a) => (
                  <option key={a.id} value={a.id}>{`${a.website} (${usernameOf(a.accountId)})`}</option>
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
                placeholder={selected && !account?.password ? 'Not available' : 'Fetched automatically'}
              />
            </Field>
          </div>

          {selected && !account?.password && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Passwords are kept in memory only in this demo, so they are gone after a page refresh.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="From">
              <Input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => {
                  setFromDate(e.target.value)
                  touch()
                }}
              />
            </Field>
            <Field label="To">
              <Input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => {
                  setToDate(e.target.value)
                  touch()
                }}
              />
            </Field>
            <Field label="Figure">
              <Input
                type="number"
                step="any"
                placeholder="e.g. 1250 or -300"
                value={figure}
                onChange={(e) => {
                  setFigure(e.target.value)
                  touch()
                }}
              />
            </Field>
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">{error}</p>
          )}
          {saved && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              Figure saved.
            </p>
          )}
          {hint && <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>}

          <Button className="w-full sm:w-auto">Submit</Button>
        </form>
      </Card>

      <Table
        headers={[ownerLabel, 'Account (website)', 'Username', 'Period', 'Figure', 'Entered']}
        isEmpty={figures.length === 0}
        empty="No figures entered yet."
      >
        {figures.map((f) => {
          const owner = ownerOf(f.ownerId)
          return (
            <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
              <Td className="font-medium text-slate-900 dark:text-slate-100">
                {owner ? (renderOwner ? renderOwner(owner) : owner.name) : '—'}
              </Td>
              <Td><Badge>{f.website}</Badge></Td>
              <Td>{usernameOf(f.accountId)}</Td>
              <Td className="text-slate-500 dark:text-slate-400">
                {f.fromDate ? `${formatDay(f.fromDate)} – ${formatDay(f.toDate)}` : '—'}
              </Td>
              <Td className={`font-semibold tabular-nums ${f.figure >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {formatMoney(f.figure)}
              </Td>
              <Td className="text-slate-500 dark:text-slate-400">{formatDate(f.createdAt)}</Td>
            </tr>
          )
        })}
      </Table>
    </>
  )
}
