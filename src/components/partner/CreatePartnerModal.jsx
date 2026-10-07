import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { addPartner, selectPartners } from '@/features/partners/partnersSlice'
import { Button, Field, Input, Modal } from '@/components/ui'

export default function CreatePartnerModal({ onClose }) {
  const dispatch = useAppDispatch()
  const partners = useAppSelector(selectPartners)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const value = name.trim()
    if (!value) return setError('Enter a partner name.')
    if (partners.some((p) => p.name.toLowerCase() === value.toLowerCase())) {
      return setError('This partner already exists.')
    }
    dispatch(addPartner(value))
    onClose()
  }

  return (
    <Modal title="Create Partner" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Partner name">
          <Input
            autoFocus
            placeholder="Enter partner name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
          />
        </Field>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button>Create</Button>
        </div>
      </form>
    </Modal>
  )
}
