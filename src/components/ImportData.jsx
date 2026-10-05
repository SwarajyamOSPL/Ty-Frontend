import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { importData } from '@/features/imports/importsThunks'
import {
  resetImport, selectImportError, selectImportResult, selectImportStatus,
} from '@/features/imports/importsSlice'
import { Badge, Button, Card, ErrorText, PageHeader, Skeleton, StatCard, Table, Td, UploadIcon } from './ui'

const isXlsx = (f) => f.name.toLowerCase().endsWith('.xlsx')
const size = (b) => (b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`)

export default function ImportData() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectImportStatus)
  const result = useAppSelector(selectImportResult)
  const error = useAppSelector(selectImportError)
  const inputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [dragging, setDragging] = useState(false)

  const busy = status === 'loading'

  // start clean every time the page is opened
  useEffect(() => () => dispatch(resetImport()), [dispatch])

  const pick = (f) => {
    if (!f) return
    if (!isXlsx(f)) {
      setFile(null)
      setFileError('Only .xlsx files are supported.')
      return
    }
    setFileError('')
    setFile(f)
    dispatch(resetImport())
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    pick(e.dataTransfer.files[0])
  }

  const submit = (dryRun) => dispatch(importData({ file, dryRun }))

  return (
    <>
      <PageHeader title="Importing Data" subtitle="Upload an Excel workbook (.xlsx) to import accounts, partners and site logins" />

      <div>
        <Card className="p-5">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
              dragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                : 'border-slate-300 hover:border-indigo-400 dark:border-slate-600'
            }`}
          >
            <UploadIcon className="h-10 w-10 text-slate-400" />
            {file ? (
              <>
                <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">{file.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{size(file.size)} · click to choose a different file</p>
              </>
            ) : (
              <>
                <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">Drag &amp; drop your Excel file here</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">or click to browse · .xlsx only</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => {
                pick(e.target.files[0])
                e.target.value = '' // allow re-picking the same file
              }}
            />
          </div>

          {fileError && <div className="mt-3"><ErrorText>{fileError}</ErrorText></div>}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button variant="secondary" disabled={!file || busy} onClick={() => submit(true)}>
              Validate only
            </Button>
            <Button disabled={!file || busy} onClick={() => submit(false)}>
              {busy ? 'Importing…' : 'Import'}
            </Button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              "Validate only" checks the file without saving anything.
            </span>
          </div>
        </Card>

      </div>

      <div className="mt-8">
        {status === 'failed' && <ErrorText>{error}</ErrorText>}

        {busy && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => <StatCard key={i} label="" loading />)}
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Result</h2>
              <Badge tone={result.dry_run ? 'indigo' : 'green'}>
                {result.dry_run ? 'Validation only — nothing saved' : 'Imported'}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label={result.dry_run ? 'Rows valid' : 'Rows imported'} value={result.imported} tone="text-emerald-600 dark:text-emerald-400" />
              <StatCard
                label="Rows skipped"
                value={result.skipped.length}
                tone={result.skipped.length ? 'text-amber-600 dark:text-amber-400' : undefined}
              />
              <StatCard label="Layout" value={result.format} />
              <StatCard label="Sheet" value={result.sheet} />
            </div>

            {result.skipped.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">Skipped rows</h3>
                <Table headers={['Row', 'Reason']}>
                  {result.skipped.map((s, i) => (
                    <tr key={i}>
                      <Td className="w-24">{s.row}</Td>
                      <Td>{s.reason}</Td>
                    </tr>
                  ))}
                </Table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
