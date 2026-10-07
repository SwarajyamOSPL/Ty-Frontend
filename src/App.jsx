import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import RequireAuth from '@/components/RequireAuth'
import Dashboard from '@/pages/Dashboard'
import Capper from '@/pages/capper/Capper'
import CapperAssignAccount from '@/pages/capper/AssignAccount'
import CapperEnterFigure from '@/pages/capper/EnterFigure'
import Login from '@/pages/Login'
import Accounts from '@/pages/partner/Accounts'
import AssignAccount from '@/pages/partner/AssignAccount'
import EnterFigure from '@/pages/partner/EnterFigure'
import Partner from '@/pages/partner/Partner'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* everything below needs a login */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/partner" element={<Partner />} />
          <Route path="/partner/accounts" element={<Accounts />} />
          <Route path="/partner/assign-account" element={<AssignAccount />} />
          <Route path="/partner/enter-figure" element={<EnterFigure />} />

          <Route path="/capper" element={<Capper />} />
          <Route path="/capper/assign-account" element={<CapperAssignAccount />} />
          <Route path="/capper/enter-figure" element={<CapperEnterFigure />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
