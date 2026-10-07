import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { selectPartners } from '@/features/partners/partnersSlice'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { selectAssignments } from '@/features/assignments/assignmentsSlice'
import { addFigure, selectFigures } from '@/features/figures/figuresSlice'
import FigureEntry from '@/components/figures/FigureEntry'

export default function EnterFigure() {
  const dispatch = useAppDispatch()
  const partners = useAppSelector(selectPartners)
  const accounts = useAppSelector(selectAccounts)
  const assignments = useAppSelector(selectAssignments)
  const figures = useAppSelector(selectFigures)

  // FigureEntry works with a generic ownerId
  const rows = useMemo(() => assignments.map((a) => ({ ...a, ownerId: a.partnerId })), [assignments])
  const entered = useMemo(() => figures.map((f) => ({ ...f, ownerId: f.partnerId })), [figures])

  return (
    <FigureEntry
      ownerLabel="Partner"
      owners={partners}
      assignments={rows}
      figures={entered}
      accounts={accounts}
      createOwnerPath="/partner"
      assignPath="/partner/assign-account"
      onSubmit={({ ownerId, ...rest }) => dispatch(addFigure({ partnerId: ownerId, ...rest }))
      }
    />
  )
}
