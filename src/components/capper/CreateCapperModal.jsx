import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { addCapper, selectCappers } from '@/features/cappers/cappersSlice'
import { Button, Field, Input, Modal } from '@/components/ui'
import CapperName from './CapperName'

export default function CreateCapperModal({ onClose }) {
  const dispatch = useAppDispatch()
  const cappers = useAppSelector(selectCappers)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const value = name.trim()
    if (!value) return setError('Enter a capper name.')
    if (cappers.some((c) => c.name.toLowerCase() === value.toLowerCase())) {
      return setError('This capper already exists.')
    }
    dispatch(addCapper(value))
    onClose()
  }

  return (
    <Modal title="Create Capper" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Capper name">
          <Input
            autoFocus
            placeholder="Enter capper name"
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

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            All cappers ({cappers.length})
          </p>
          <ul className="grid max-h-56 grid-cols-2 gap-x-3 gap-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700">
            {cappers.map((c) => (
              <li key={c.id} className="min-w-0 truncate">
                <CapperName capper={c} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button>Create</Button>
        </div>
      </form>
    </Modal>
  )
}
