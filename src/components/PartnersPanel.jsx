import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchPartners, savePartner } from '@/features/partners/partnersThunks'
import {
  selectPartners, selectPartnersError, selectPartnersSaving, selectPartnersStatus,
} from '@/features/partners/partnersSlice'
import { Badge, Button, ErrorText, Field, Modal, PageHeader, Table, Td, inputCls } from './ui'

const empty = { name: '', share_pct: '' }

export default function PartnersPanel() {
  const dispatch = useAppDispatch()
  const partners = useAppSelector(selectPartners)
  const saving = useAppSelector(selectPartnersSaving)
  const status = useAppSelector(selectPartnersStatus)
  const loading = status === 'idle' || status === 'loading'
  const error = useAppSelector(selectPartnersError)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)

  useEffect(() => {
    dispatch(fetchPartners())
  }, [dispatch])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const close = () => {
    setOpen(false)
    setForm(empty)
  }
  const edit = (p) => {
    setForm({ name: p.name, share_pct: String(p.share_pct) })
    setOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    const res = await dispatch(savePartner({ name: form.name.trim(), share_pct: Number(form.share_pct) }))
    if (savePartner.fulfilled.match(res)) close()
  }

  return (
    <>
      <PageHeader title="Partners" subtitle={`${partners.length} partner${partners.length === 1 ? '' : 's'}`}>
        <Button onClick={() => setOpen(true)}>+ Add partner</Button>
      </PageHeader>

      <Table headers={['ID', 'Name', 'Share', 'Created', 'Action']} loading={loading} isEmpty={partners.length === 0} empty="No partners yet.">
        {partners.map((p) => (
          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
            <Td className="text-slate-400">{p.id}</Td>
            <Td className="font-medium text-slate-900 dark:text-slate-100">{p.name}</Td>
            <Td><Badge tone="indigo">{p.share_pct}%</Badge></Td>
            <Td className="text-slate-500 dark:text-slate-400">{new Date(p.created_at).toLocaleDateString()}</Td>
            <Td><Button variant="ghost" className="px-2! py-1!" onClick={() => edit(p)}>Edit</Button></Td>
          </tr>
        ))}
      </Table>

      {open && (
        <Modal title="Partner" onClose={close}>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Name">
              <input className={inputCls} required autoFocus value={form.name} onChange={set('name')} placeholder="Tylor" />
            </Field>
            <Field label="Share %">
              <input className={inputCls} required type="number" step="any" value={form.share_pct} onChange={set('share_pct')} placeholder="50" />
            </Field>
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
