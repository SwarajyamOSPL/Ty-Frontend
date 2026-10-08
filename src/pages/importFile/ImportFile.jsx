import { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { selectCappers } from '@/features/cappers/cappersSlice'
import { addImport, selectImports } from '@/features/imports/importsSlice'
import CapperName from '@/components/capper/CapperName'
import { FileIcon, UploadIcon } from '@/components/icons'
import { Badge, Button, Card, Field, PageHeader, Select, Table, Td } from '@/components/ui'
import { formatDate } from '@/utils/formatDate'
import { formatSize } from '@/utils/formatSize'

const ALLOWED = /\.(csv|xlsx|xls)$/i
const typeOf = (name) => (name.toLowerCase().endsWith('.csv') ? 'CSV' : 'Excel')

// green tile for Excel, blue tile for CSV
const TILE = {
  Excel: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300',
  CSV: 'bg-sky-50 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300',
}

function FileTile({ type }) {
  return (
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TILE[type]}`} aria-hidden="true">
      <FileIcon className="h-6 w-6" />
    </span>
  )
}

export default function ImportFile() {
  const dispatch = useAppDispatch()
  const cappers = useAppSelector(selectCappers)
  const imports = useAppSelector(selectImports)
  const inputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [capperId, setCapperId] = useState('')
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('') // name of the capper the last file went to

  const capperOf = (id) => cappers.find((c) => c.id === id)

  const pick = (f) => {
    if (!f) return
    setSaved('')
    if (!ALLOWED.test(f.name)) {
      setFile(null)
      setError('Only CSV or Excel files (.csv, .xlsx, .xls) are supported.')
      return
    }
    setError('')
    setFile(f)
  }

  const clearFile = () => {
    setFile(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const submit = (e) => {
    e.preventDefault()
    if (!file) return setError('Choose a CSV or Excel file.')
    if (!capperId) return setError('Select a capper.')

    dispatch(addImport({ capperId, fileName: file.name, fileType: typeOf(file.name), size: file.size }))
    setSaved(capperOf(capperId)?.name ?? '')
    clearFile()
    setCapperId('') // blank the form again
  }

  return (
    <>
      <PageHeader
        title="Import File"
        subtitle="Upload a CSV or Excel file and give it to a capper"
      />

      <Card className="mb-8 p-5 sm:p-6">
        <form onSubmit={submit} className="space-y-5">
          {/* drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              pick(e.dataTransfer.files[0])
            }}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
              dragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/30'
            }`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300">
              <UploadIcon className="h-7 w-7" />
            </span>
            <p className="mt-4 font-medium">Drag &amp; drop your file here</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">or click to browse · CSV, XLS or XLSX</p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => pick(e.target.files[0])}
            />
          </div>

          {/* chosen file */}
          {file && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <FileTile type={typeOf(file.name)} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{file.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {typeOf(file.name)} · {formatSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                Remove
              </button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <Field label="Capper">
              <Select
                value={capperId}
                onChange={(e) => {
                  setCapperId(e.target.value)
                  setError('')
                  setSaved('')
                }}
              >
                <option value="">Select capper</option>
                {cappers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </Field>
            <Button className="w-full sm:w-36">Submit</Button>
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">{error}</p>
          )}
          {saved && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              File given to {saved}.
            </p>
          )}
        </form>
      </Card>

      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Files given to cappers</h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {imports.length} file{imports.length === 1 ? '' : 's'}
        </span>
      </div>

      <Table
        headers={['Sr. No.', 'Capper', 'File', 'Type', 'Size', 'Given on']}
        isEmpty={imports.length === 0}
        empty="No files given yet."
      >
        {imports.map((r, i) => {
          const capper = capperOf(r.capperId)
          return (
            <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
              <Td className="w-16 text-slate-400">{i + 1}</Td>
              <Td>{capper ? <CapperName capper={capper} /> : '—'}</Td>
              <Td>
                <div className="flex max-w-xs items-center gap-3">
                  <FileTile type={r.fileType} />
                  <span className="truncate font-medium text-slate-900 dark:text-slate-100" title={r.fileName}>{r.fileName}</span>
                </div>
              </Td>
              <Td><Badge>{r.fileType}</Badge></Td>
              <Td className="tabular-nums">{formatSize(r.size)}</Td>
              <Td className="text-slate-500 dark:text-slate-400">{formatDate(r.createdAt)}</Td>
            </tr>
          )
        })}
      </Table>
    </>
  )
}
