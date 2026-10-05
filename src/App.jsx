import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import AccountDetail from '@/components/AccountDetail'
import AccountsTable from '@/components/AccountsTable'
import AppLayout from '@/components/AppLayout'
import CappersPanel from '@/components/CappersPanel'
import Dashboard from '@/components/Dashboard'
import ImportData from '@/components/ImportData'
import Login from '@/components/Login'
import PartnersPanel from '@/components/PartnersPanel'
import RequireAuth from '@/components/RequireAuth'
import SiteLoginsPanel from '@/components/SiteLoginsPanel'

function AccountDetailRoute() {
  const { accountId } = useParams()
  const navigate = useNavigate()
  return <AccountDetail accountId={accountId} onBack={() => navigate('/accounts')} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* everything below needs a login */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<AccountsTable />} />
          <Route path="/accounts/:accountId" element={<AccountDetailRoute />} />
          <Route path="/cappers" element={<CappersPanel />} />
          <Route path="/partners" element={<PartnersPanel />} />
          <Route path="/site-logins" element={<SiteLoginsPanel />} />
          <Route path="/importing-data" element={<ImportData />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
