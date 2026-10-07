import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useRedux'
import { selectUser } from '@/features/auth/authSlice'

// Wraps every private route: not logged in -> /login (and remember where they were going)
export default function RequireAuth() {
  const user = useAppSelector(selectUser)
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
