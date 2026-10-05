import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { login, selectUser } from '@/features/auth/authSlice'
import { Button, Card, ErrorText, Field, PasswordInput, inputCls } from './ui'

export default function Login() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const target = location.state?.from?.pathname || '/dashboard'

  // already signed in -> no need to see the login page
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
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="w-full max-w-sm">
        <Card className="p-6">
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-xl font-bold text-white">T</div>
            <h1 className="text-2xl font-semibold tracking-tight">{"Ty's Automation"}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to continue</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Field label="Username">
              <input
                className={inputCls}
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError('')
                }}
                placeholder="Enter username"
              />
            </Field>
            <Field label="Password">
              <PasswordInput
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Enter password"
              />
            </Field>
            <ErrorText>{error}</ErrorText>
            <Button className="w-full">Sign in</Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
