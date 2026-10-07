import { useRef, useState } from 'react'
import { nanoid } from '@reduxjs/toolkit'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { addAccount, selectAccounts } from '@/features/accounts/accountsSlice'
import { PlusIcon, TrashIcon } from '@/components/icons'
import { Button, Field, Input, Modal, PasswordInput } from '@/components/ui'

// one website input row; the id keeps React keys stable when rows are removed
const newSite = () => ({ id: nanoid(), value: '' })

export default function CreateAccountModal({ onClose }) {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(selectAccounts)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [sites, setSites] = useState(() => [newSite()])
  const [error, setError] = useState('')
  const lastRef = useRef(null)

  const clear = () => setError('')
  const setSite = (id, value) => {
    setSites((s) => s.map((x) => (x.id === id ? { ...x, value } : x)))
    clear()
  }
  const addSite = () => {
    setSites((s) => [...s, newSite()])
    // focus the new input once it has rendered
    setTimeout(() => lastRef.current?.focus(), 0)
  }
  const removeSite = (id) => setSites((s) => s.filter((x) => x.id !== id))

  const submit = (e) => {
    e.preventDefault()
    const user = username.trim()
    const websites = [...new Set(sites.map((s) => s.value.trim()).filter(Boolean))]

    if (!user) return setError('Enter a username.')
    if (!password) return setError('Enter a password.')
    if (websites.length === 0) return setError('Add at least one website.')
    if (accounts.some((a) => a.username.toLowerCase() === user.toLowerCase())) {
      return setError('This username already exists.')
    }

    dispatch(addAccount({ username: user, password, websites }))
    onClose()
  }

  return (
    <Modal title="Create Account" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Username">
          <Input
            autoFocus
            autoComplete="off"
            placeholder="Enter username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              clear()
            }}
          />
        </Field>

        <Field label="Password">
          <PasswordInput
            autoComplete="new-password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              clear()
            }}
          />
        </Field>

        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Website
          </span>
          <div className="space-y-2">
            {sites.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <Input
                  ref={i === sites.length - 1 ? lastRef : null}
                  placeholder="https://example.com"
                  value={s.value}
                  onChange={(e) => setSite(s.id, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeSite(s.id)}
                  disabled={sites.length === 1}
                  aria-label="Remove website"
                  className="shrink-0 rounded-lg p-2.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSite}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
          >
            <PlusIcon className="h-4 w-4" />
            Add another website
          </button>
        </div>

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
