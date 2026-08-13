import { useEffect, useState } from 'react'
import Modal from '../../../components/ui/Modal'
import * as pendapatanService from '../services/pendapatanService'
import { EXPENSE_CATEGORY_LABEL, FUNDING_SOURCE_LABEL } from '../../../constants/expenseOptions'

function formatRupiah(amount) {
  return `Rp. ${(amount ?? 0).toLocaleString('id-ID')}`
}

function formatDateTime(iso) {
  if (!iso) return '-'
  const date = new Date(iso)
  const datePart = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const timePart = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
  return `${datePart} ${timePart}`
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-body-sm text-on-surface-variant/80 font-semibold">{label}</span>
      <span className="text-body-sm text-on-surface font-bold text-right">{value}</span>
    </div>
  )
}

export default function ExpenseDetailModal({ expenseId, onClose }) {
  const [expense, setExpense] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!expenseId) {
      setExpense(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    pendapatanService
      .getExpense(expenseId)
      .then((res) => {
        // Single-resource endpoints don't return a `pagination` envelope, so
        // the api interceptor resolves this straight to the expense object
        // itself — not `{ data: expense }`.
        if (!cancelled) setExpense(res)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [expenseId])

  return (
    <Modal open={!!expenseId} onClose={onClose} title="Detail Pengeluaran">
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
          <span className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></span>
          <p className="text-body-sm text-on-surface-variant/70 font-semibold">Memuat detail...</p>
        </div>
      )}

      {!loading && error && <p className="text-body-sm text-error">{error}</p>}

      {!loading && !error && expense && (
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <span className="text-label-md font-bold text-on-surface">Informasi Singkat</span>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-body-md font-mono font-extrabold text-on-surface">
                  {expense.expenseNumber ?? expense.id}
                </p>
                <p className="text-body-sm text-on-surface-variant/80 font-semibold">
                  {EXPENSE_CATEGORY_LABEL[expense.category] ?? expense.category}
                </p>
              </div>
              <span className="text-xs text-on-surface-variant/70 font-bold shrink-0">
                {formatDateTime(expense.spentAt ?? expense.createdAt)}
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant/80">
              Sumber Dana:{' '}
              <span className="font-bold text-primary">
                {FUNDING_SOURCE_LABEL[expense.fundingSource] ?? expense.fundingSource ?? '-'}
              </span>
            </p>
          </section>

          <section className="flex flex-col gap-1">
            <span className="text-label-md font-bold text-on-surface">Informasi Pengeluaran</span>
            <div className="flex flex-col divide-y divide-outline-variant">
              <InfoRow label="No. Pengeluaran" value={expense.expenseNumber ?? expense.id} />
              <InfoRow
                label="Jenis Pengeluaran"
                value={EXPENSE_CATEGORY_LABEL[expense.category] ?? expense.category}
              />
              <InfoRow label="Total" value={formatRupiah(expense.amount)} />
            </div>
          </section>

          <section className="flex flex-col gap-1">
            <span className="text-label-md font-bold text-on-surface">Keterangan</span>
            <p className="text-body-sm text-on-surface-variant/80">{expense.description || '-'}</p>
          </section>

          <section className="flex flex-col gap-1">
            <span className="text-label-md font-bold text-on-surface">Nota</span>
            {expense.receiptUrl ? (
              <img
                src={expense.receiptUrl}
                alt="Nota/Struk"
                className="mt-1 max-h-64 w-auto rounded-xl border border-outline-variant object-contain"
              />
            ) : (
              <p className="text-body-sm text-on-surface-variant/80">-</p>
            )}
          </section>

          <section className="flex flex-col gap-1">
            <span className="text-label-md font-bold text-on-surface">Informasi Sistem</span>
            <div className="flex flex-col divide-y divide-outline-variant">
              <InfoRow label="Dibuat Pada" value={formatDateTime(expense.createdAt)} />
              <InfoRow label="Terakhir Diubah" value={formatDateTime(expense.updatedAt ?? expense.createdAt)} />
            </div>
          </section>
        </div>
      )}
    </Modal>
  )
}