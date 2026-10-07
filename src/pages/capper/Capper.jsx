import { useState } from 'react'
import { useAppSelector } from '@/hooks/useRedux'
import { selectCappers } from '@/features/cappers/cappersSlice'
import { selectCapperAssignments } from '@/features/capperAssignments/capperAssignmentsSlice'
import CapperName from '@/components/capper/CapperName'
import CreateCapperModal from '@/components/capper/CreateCapperModal'
import { PlusIcon } from '@/components/icons'
import { Badge, Button, PageHeader, Table, Td } from '@/components/ui'

export default function Capper() {
  const cappers = useAppSelector(selectCappers)
  const assignments = useAppSelector(selectCapperAssignments)
  const [open, setOpen] = useState(false)

  const countFor = (id) => assignments.filter((a) => a.capperId === id).length

  return (
    <>
      <PageHeader title="Capper" subtitle={`${cappers.length} capper${cappers.length === 1 ? '' : 's'}`}>
        <Button onClick={() => setOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Create Capper
        </Button>
      </PageHeader>

      <Table headers={['Sr. No.', 'Capper', 'Assigned accounts']} isEmpty={cappers.length === 0} empty="No cappers yet.">
        {cappers.map((c, i) => (
          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
            <Td className="w-16 text-slate-400">{i + 1}</Td>
            <Td><CapperName capper={c} /></Td>
            <Td><Badge>{countFor(c.id)}</Badge></Td>
          </tr>
        ))}
      </Table>

      {open && <CreateCapperModal onClose={() => setOpen(false)} />}
    </>
  )
}
