import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchPartners } from '@/features/partners/partnersThunks'
import { selectPartners } from '@/features/partners/partnersSlice'
import { deleteSiteLogin, fetchSiteLogins, saveSiteLogin } from '@/features/siteLogins/siteLoginsThunks'
import {
  selectSiteLogins, selectSiteLoginsError, selectSiteLoginsSaving, selectSiteLoginsStatus,
} from '@/features/siteLogins/siteLoginsSlice'
import { Badge, Button, ErrorText, Field, Modal, PageHeader, PasswordInput, Table, Td, inputCls } from './ui'

const empty = {
  partner_id: '', site: '', username: '', password: '', site_fig: '',
  site_fig_basis: '', balance: '', city: '', win: '', notes: '', accounts: '',
}
const NUMBERS = ['site_fig', 'balance', 'win']

const toPayload = (f) => {
  const body = { ...f, partner_id: Number(f.partner_id), accounts: f.accounts.split(',').map((a) => a.trim()).filter(Boolean) }
  NUMBERS.forEach((k) => {
    body[k] = f[k] === '' ? null : Number(f[k])
  })
  return body
}

const HEADERS = ['Partner', 'Site', 'Username', 'Site fig', 'Credit line', 'Max win', 'IP', 'Accounts', 'Notes', '']

export default function SiteLoginsPanel() {
  const dispatch = useAppDispatch()
  const logins = useAppSelector(selectSiteLogins)
  const partners = useAppSelector(selectPartners)
  const saving = useAppSelector(selectSiteLoginsSaving)
  const status = useAppSelector(selectSiteLoginsStatus)
  const loading = status === 'idle' || status === 'loading'
  const error = useAppSelector(selectSiteLoginsError)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [query, setQuery] = useState('')

  useEffect(() => {
    dispatch(fetchPartners())
    dispatch(fetchSiteLogins())
  }, [dispatch])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return logins
    return logins.filter((l) => [l.partner, l.site, l.username, l.city].some((v) => v?.toLowerCase().includes(q)))
  }, [logins, query])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const close = () => {
    setOpen(false)
    setForm(empty)
  }

  const submit = async (e) => {
    e.preventDefault()
    const res = await dispatch(saveSiteLogin(toPayload(form)))
    if (saveSiteLogin.fulfilled.match(res)) close()
  }

  const remove = (l) => {
    if (window.confirm(`Delete login ${l.username} @ ${l.site}?`)) dispatch(deleteSiteLogin(l.id))
  }

  const text = (k, label, props = {}) => (
    <Field label={label}>
      <input className={inputCls} value={form[k]} onChange={set(k)} {...props} />
    </Field>
  )

  return (
    <>
      <PageHeader title="Site Logins" subtitle={`${logins.length} login${logins.length === 1 ? '' : 's'}`}>
        <input
          className={`${inputCls} w-56!`}
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={() => setOpen(true)}>+ Add login</Button>
      </PageHeader>

      {!open && <div className="mb-4"><ErrorText>{error}</ErrorText></div>}

      <Table headers={HEADERS} loading={loading} isEmpty={filtered.length === 0} empty="No site logins found.">
        {filtered.map((l) => (
          <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
            <Td className="font-medium text-slate-900 dark:text-slate-100">{l.partner}</Td>
            <Td>
              <div className="font-medium text-slate-900 dark:text-slate-100">{l.site}</div>
              {l.site_fig_basis && <div className="text-xs text-slate-400">{l.site_fig_basis}</div>}
            </Td>
            <Td>{l.username}</Td>
            <Td className="tabular-nums">{l.site_fig}</Td>
            <Td className="tabular-nums">{l.balance}</Td>
            <Td className="tabular-nums">{l.win}</Td>
            <Td>{l.city}</Td>
            <Td>
              <div className="flex gap-1">
                {l.accounts?.map((a) => <Badge key={a} tone="indigo">{a}</Badge>)}
              </div>
            </Td>
            <Td className="max-w-48 truncate text-slate-500 dark:text-slate-400">{l.notes}</Td>
            <Td><Button variant="danger" className="px-2! py-1!" onClick={() => remove(l)}>Delete</Button></Td>
          </tr>
        ))}
      </Table>

      {open && (
        <Modal wide title="Add / update site login" onClose={close}>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Partner">
                <select className={inputCls} required value={form.partner_id} onChange={set('partner_id')}>
                  <option value="">Select…</option>
                  {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </Field>
              {text('site', 'Site', { required: true })}
              {text('username', 'Username', { required: true })}
              <Field label="Password">
                <PasswordInput required value={form.password} onChange={set('password')} />
              </Field>
              {text('site_fig', 'Site fig', { type: 'number', step: 'any' })}
              {text('site_fig_basis', 'Site fig basis', { placeholder: 'T way 50%' })}
              {text('balance', 'Credit line', { type: 'number', step: 'any' })}
              {text('win', 'Max win', { type: 'number', step: 'any' })}
              {text('city', 'IP')}
              {text('accounts', 'Accounts (comma separated)', { placeholder: 'A1, A2' })}
            </div>
            <Field label="Notes">
              <textarea className={inputCls} rows={2} value={form.notes} onChange={set('notes')} />
            </Field>
            <ErrorText>{error}</ErrorText>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={close}>Cancel</Button>
              <Button disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
