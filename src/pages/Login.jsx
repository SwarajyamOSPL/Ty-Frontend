import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { login, selectUser } from '@/features/auth/authSlice'
import ThemeToggle from '@/components/ThemeToggle'
import { Button, Card, Field, Input, PasswordInput } from '@/components/ui'

export default function Login() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const target = location.state?.from?.pathname || '/dashboard'

  // already signed in -> skip the login page
  if (user) return <Navigate to={target} replace />

  const submit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Enter a username and password.')
      return
    }
    dispatch(login(username.trim()))
    navigate(target, { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-100 p-4 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <ThemeToggle className="absolute right-4 top-4" />

      <Card className="w-full max-w-sm p-6 sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">T</div>
          <h1 className="text-2xl font-semibold tracking-tight">{"Ty's Automation"}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to continue</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Username">
            <Input
              autoFocus
              autoComplete="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
            />
          </Field>
          <Field label="Password">
            <PasswordInput
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
            />
          </Field>
          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">{error}</p>
          )}
          <Button className="w-full">Sign in</Button>
        </form>
      </Card>
    </div>
  )
}
