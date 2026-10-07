import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { selectCappers } from '@/features/cappers/cappersSlice'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { selectCapperAssignments } from '@/features/capperAssignments/capperAssignmentsSlice'
import { addCapperFigure, selectCapperFigures } from '@/features/capperFigures/capperFiguresSlice'
import CapperName from '@/components/capper/CapperName'
import FigureEntry from '@/components/figures/FigureEntry'

export default function CapperEnterFigure() {
  const dispatch = useAppDispatch()
  const cappers = useAppSelector(selectCappers)
  const accounts = useAppSelector(selectAccounts)
  const assignments = useAppSelector(selectCapperAssignments)
  const figures = useAppSelector(selectCapperFigures)

  // FigureEntry works with a generic ownerId
  const rows = useMemo(() => assignments.map((a) => ({ ...a, ownerId: a.capperId })), [assignments])
  const entered = useMemo(() => figures.map((f) => ({ ...f, ownerId: f.capperId })), [figures])

  return (
    <FigureEntry
      ownerLabel="Capper"
      owners={cappers}
      assignments={rows}
      figures={entered}
      accounts={accounts}
      createOwnerPath="/capper"
      assignPath="/capper/assign-account"
      renderOwner={(c) => <CapperName capper={c} />}
      onSubmit={({ ownerId, ...rest }) => dispatch(addCapperFigure({ capperId: ownerId, ...rest }))
      }
    />
  )
}
