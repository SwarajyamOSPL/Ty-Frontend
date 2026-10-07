import { useState } from 'react'
import { useAppSelector } from '@/hooks/useRedux'
import { selectPartners } from '@/features/partners/partnersSlice'
import CreatePartnerModal from '@/components/partner/CreatePartnerModal'
import { PlusIcon } from '@/components/icons'
import { Button, PageHeader, Table, Td } from '@/components/ui'
import { formatDate } from '@/utils/formatDate'


export default function Partner() {
  const partners = useAppSelector(selectPartners)
  const [open, setOpen] = useState(false)

  return (
    <>
      <PageHeader title="Partner" subtitle={`${partners.length} partner${partners.length === 1 ? '' : 's'}`}>
        <Button onClick={() => setOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Create Partner
        </Button>
      </PageHeader>

      <Table headers={['Sr. No.', 'Partner', 'Created']} isEmpty={partners.length === 0} empty="No partners yet.">
        {partners.map((p, i) => (
          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
            <Td className="w-16 text-slate-400">{i + 1}</Td>
            <Td className="font-medium text-slate-900 dark:text-slate-100">{p.name}</Td>
            <Td className="text-slate-500 dark:text-slate-400">{formatDate(p.createdAt)}</Td>
          </tr>
        ))}
      </Table>

      {open && <CreatePartnerModal onClose={() => setOpen(false)} />}
    </>
  )
}
