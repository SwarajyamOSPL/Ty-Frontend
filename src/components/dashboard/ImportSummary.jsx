import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useRedux'
import { selectCappers } from '@/features/cappers/cappersSlice'
import { selectImports } from '@/features/imports/importsSlice'
import CapperName from '@/components/capper/CapperName'
import { Badge, Card, Table, Td } from '@/components/ui'
import { formatDate } from '@/utils/formatDate'
import { formatSize } from '@/utils/formatSize'

const linkCls = 'text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300'

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  )
}

// Dashboard summary of the files given to cappers (data from the Import File page)
export default function ImportSummary() {
  const imports = useAppSelector(selectImports)
  const cappers = useAppSelector(selectCappers)

  const stats = useMemo(
    () => ({
      total: imports.length,
      excel: imports.filter((i) => i.fileType === 'Excel').length,
      csv: imports.filter((i) => i.fileType === 'CSV').length,
      cappers: new Set(imports.map((i) => i.capperId)).size,
      size: imports.reduce((t, i) => t + i.size, 0),
    }),
    [imports],
  )

  const capperOf = (id) => cappers.find((c) => c.id === id)

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Import File Summary</h2>
        <Link to="/import-file" className={linkCls}>Import file</Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="divide-y divide-slate-100 px-5 dark:divide-slate-700 lg:col-span-2">
          <Row label="Files given" value={stats.total} />
          <Row label="Excel files" value={stats.excel} />
          <Row label="CSV files" value={stats.csv} />
          <Row label="Cappers with files" value={stats.cappers} />
          <Row label="Total size" value={formatSize(stats.size)} />
        </Card>

        <div className="min-w-0 lg:col-span-3">
          <Table
            headers={['Capper', 'File', 'Type', 'Given on']}
            isEmpty={imports.length === 0}
            empty="No files given yet."
          >
            {imports.slice(0, 5).map((r) => {
              const capper = capperOf(r.capperId)
              return (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                  <Td>{capper ? <CapperName capper={capper} /> : '—'}</Td>
                  <Td className="max-w-48 truncate" title={r.fileName}>{r.fileName}</Td>
                  <Td><Badge>{r.fileType}</Badge></Td>
                  <Td className="text-slate-500 dark:text-slate-400">{formatDate(r.createdAt)}</Td>
                </tr>
              )
            })}
          </Table>
        </div>
      </div>
    </section>
  )
}
