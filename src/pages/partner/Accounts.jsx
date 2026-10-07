import { useState } from 'react'
import { useAppSelector } from '@/hooks/useRedux'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import CreateAccountModal from '@/components/partner/CreateAccountModal'
import { PlusIcon } from '@/components/icons'
import { Badge, Button, PageHeader, Table, Td } from '@/components/ui'
import { formatDate } from '@/utils/formatDate'

const MAX_TAGS = 2 // websites shown per row, the rest collapse into "..."

export default function Accounts() {
  const accounts = useAppSelector(selectAccounts)
  const [open, setOpen] = useState(false)

  return (
    <>
      <PageHeader title="Account" subtitle={`${accounts.length} account${accounts.length === 1 ? '' : 's'}`}>
        <Button onClick={() => setOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Create Account
        </Button>
      </PageHeader>

      <Table headers={['Username', 'Websites', 'Created']} isEmpty={accounts.length === 0} empty="No accounts yet.">
        {accounts.map((a) => (
          <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
            <Td className="font-medium text-slate-900 dark:text-slate-100">{a.username}</Td>
            <Td>
              <div className="flex items-center gap-1" title={a.websites.join(', ')}>
                {a.websites.slice(0, MAX_TAGS).map((w) => <Badge key={w}>{w}</Badge>)}
                {a.websites.length > MAX_TAGS && (
                  <span className="px-1 font-bold text-slate-500 dark:text-slate-400">...</span>
                )}
              </div>
            </Td>
            <Td className="text-slate-500 dark:text-slate-400">{formatDate(a.createdAt)}</Td>
          </tr>
        ))}
      </Table>

      {open && <CreateAccountModal onClose={() => setOpen(false)} />}
    </>
  )
}
