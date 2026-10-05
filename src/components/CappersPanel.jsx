import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchAccounts } from '@/features/accounts/accountsThunks'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import {
  createCapper, deleteCapper, fetchCappers, fetchUnregistered, setCapperAccounts, updateCapper,
} from '@/features/cappers/cappersThunks'
import {
  clearCapperError, selectCappers, selectCappersError, selectCappersSaving, selectCappersStatus, selectUnregistered,
} from '@/features/cappers/cappersSlice'
import { Badge, Button, ErrorText, Field, Modal, PageHeader, Switch, Table, Td, inputCls } from './ui'

const HEADERS = ['Name', 'Status', 'Accounts', 'Created', 'Action']

export default function CappersPanel() {
  const dispatch = useAppDispatch()
  const cappers = useAppSelector(selectCappers)
  const unregistered = useAppSelector(selectUnregistered)
  const status = useAppSelector(selectCappersStatus)
  const saving = useAppSelector(selectCappersSaving)
  const error = useAppSelector(selectCappersError)
  const accounts = useAppSelector(selectAccounts)
  const loading = status === 'idle' || status === 'loading'

  // modal: null | { type: 'add' } | { type: 'rename', capper } | { type: 'accounts', capper }
  const [modal, setModal] = useState(null)
  const [name, setName] = useState('')
  const [picked, setPicked] = useState([])

  useEffect(() => {
    dispatch(fetchCappers())
    dispatch(fetchUnregistered())
    dispatch(fetchAccounts({ silent: true }))
  }, [dispatch])

  // all known account IDs, plus any already assigned that the accounts list doesn't have
  const accountOptions = useMemo(() => {
    const ids = new Set(accounts.map((a) => a.account_id))
    cappers.forEach((c) => c.accounts.forEach((a) => ids.add(a)))
    return [...ids].sort()
  }, [accounts, cappers])

  const open = (next) => {
    dispatch(clearCapperError())
    if (next.type === 'add') setName('')
    if (next.type === 'rename') setName(next.capper.name)
    if (next.type === 'accounts') setPicked(next.capper.accounts)
    setModal(next)
  }
  const close = () => setModal(null)

  const run = async (action) => {
    const res = await dispatch(action)
    if (res.meta.requestStatus === 'fulfilled') close()
  }

  const submit = (e) => {
    e.preventDefault()
    if (modal.type === 'add') run(createCapper({ name: name.trim(), active: true }))
    if (modal.type === 'rename') run(updateCapper({ id: modal.capper.id, name: name.trim() }))
    if (modal.type === 'accounts') run(setCapperAccounts({ id: modal.capper.id, accounts: picked }))
  }

  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const remove = (c) => {
    if (window.confirm(`Delete capper ${c.name}?`)) dispatch(deleteCapper(c.id))
  }

  return (
    <>
      <PageHeader
        title="Cappers"
        subtitle={loading ? 'Loading…' : `${cappers.length} capper${cappers.length === 1 ? '' : 's'}`}
      >
        <Button onClick={() => open({ type: 'add' })}>+ Add capper</Button>
      </PageHeader>

      {unregistered.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            {unregistered.length} capper{unregistered.length === 1 ? '' : 's'} found in sheets but not registered
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {unregistered.map((n) => (
              <span
                key={n}
                className="inline-flex items-center gap-2 rounded-lg bg-white py-1 pl-3 pr-1 text-sm text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200"
              >
                {n}
                <Button
                  variant="ghost"
                  className="px-2! py-1!"
                  disabled={saving}
                  onClick={() => dispatch(createCapper({ name: n, active: true }))}
                >
                  Register
                </Button>
              </span>
            ))}
          </div>
        </div>
      )}

      {!modal && error && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}

      <Table headers={HEADERS} loading={loading} isEmpty={cappers.length === 0} empty="No cappers registered yet.">
        {cappers.map((c) => (
          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
            <Td className="font-medium text-slate-900 dark:text-slate-100">{c.name}</Td>
            <Td>
              <Switch
                label={`Toggle ${c.name}`}
                checked={c.active}
                onChange={(active) => dispatch(updateCapper({ id: c.id, active }))}
              />
            </Td>
            <Td>
              <button className="flex flex-wrap gap-1" onClick={() => open({ type: 'accounts', capper: c })}>
                {c.accounts.length === 0 ? (
                  <span className="text-slate-400 underline">Assign accounts</span>
                ) : (
                  c.accounts.map((a) => <Badge key={a} tone="indigo">{a}</Badge>)
                )}
              </button>
            </Td>
            <Td className="text-slate-500 dark:text-slate-400">{new Date(c.created_at).toLocaleDateString()}</Td>
            <Td>
              <div className="flex gap-1">
                <Button variant="ghost" className="px-2! py-1!" onClick={() => open({ type: 'rename', capper: c })}>Rename</Button>
                <Button variant="danger" className="px-2! py-1!" onClick={() => remove(c)}>Delete</Button>
              </div>
            </Td>
          </tr>
        ))}
      </Table>

      {modal && (
        <Modal
          title={modal.type === 'add' ? 'Add capper' : modal.type === 'rename' ? 'Rename capper' : `Accounts for ${modal.capper.name}`}
          onClose={close}
        >
          <form onSubmit={submit} className="space-y-4">
            {modal.type !== 'accounts' ? (
              <Field label="Name">
                <input className={inputCls} required autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Capper_A" />
              </Field>
            ) : accountOptions.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No accounts available yet.</p>
            ) : (
              <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto">
                {accountOptions.map((id) => (
                  <label
                    key={id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700/40"
                  >
                    <input type="checkbox" checked={picked.includes(id)} onChange={() => toggle(id)} className="accent-indigo-600" />
                    {id}
                  </label>
                ))}
              </div>
            )}
            <ErrorText>{error}</ErrorText>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={close}>Cancel</Button>
              <Button disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
