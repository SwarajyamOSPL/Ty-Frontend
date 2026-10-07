import { useMemo } from 'react'
import { useAppSelector } from '@/hooks/useRedux'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { selectAssignments } from '@/features/assignments/assignmentsSlice'
import { selectCapperAssignments } from '@/features/capperAssignments/capperAssignmentsSlice'
import { selectCapperFigures } from '@/features/capperFigures/capperFiguresSlice'
import { selectCappers } from '@/features/cappers/cappersSlice'
import { selectFigures } from '@/features/figures/figuresSlice'
import { selectPartners } from '@/features/partners/partnersSlice'

const sum = (rows) => rows.reduce((t, r) => t + r.figure, 0)

// Everything the dashboard shows, computed from the store.
export function useDashboardData() {
  const partners = useAppSelector(selectPartners)
  const accounts = useAppSelector(selectAccounts)
  const cappers = useAppSelector(selectCappers)
  const partnerAssignments = useAppSelector(selectAssignments)
  const capperAssignments = useAppSelector(selectCapperAssignments)
  const partnerFigures = useAppSelector(selectFigures)
  const capperFigures = useAppSelector(selectCapperFigures)

  return useMemo(() => {
    const usernameOf = (id) => accounts.find((a) => a.id === id)?.username ?? '—'

    // every entered figure, newest first
    const entries = [
      ...partnerFigures.map((f) => ({
        ...f, kind: 'Partner', owner: partners.find((p) => p.id === f.partnerId), username: usernameOf(f.accountId),
      })),
      ...capperFigures.map((f) => ({
        ...f, kind: 'Capper', owner: cappers.find((c) => c.id === f.capperId), username: usernameOf(f.accountId),
      })),
    ].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    const win = entries.filter((e) => e.figure >= 0).reduce((t, e) => t + e.figure, 0)
    const loss = entries.filter((e) => e.figure < 0).reduce((t, e) => t + e.figure, 0)

    const byCapper = cappers
      .map((capper) => {
        const rows = capperFigures.filter((f) => f.capperId === capper.id)
        return { capper, total: sum(rows), entries: rows.length }
      })
      .filter((c) => c.entries > 0)
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))

    const byPartner = partners
      .map((partner) => {
        const rows = partnerFigures.filter((f) => f.partnerId === partner.id)
        return {
          partner,
          total: sum(rows),
          entries: rows.length,
          accounts: partnerAssignments.filter((a) => a.partnerId === partner.id).length,
        }
      })
      .sort((a, b) => b.total - a.total)

    return {
      counts: {
        partners: partners.length,
        accounts: accounts.length,
        cappers: cappers.length,
        assigned: partnerAssignments.length + capperAssignments.length,
        figures: entries.length,
      },
      totals: { total: win + loss, win, loss, partner: sum(partnerFigures), capper: sum(capperFigures) },
      byCapper,
      byPartner,
      recent: entries.slice(0, 8),
    }
  }, [partners, accounts, cappers, partnerAssignments, capperAssignments, partnerFigures, capperFigures])
}
