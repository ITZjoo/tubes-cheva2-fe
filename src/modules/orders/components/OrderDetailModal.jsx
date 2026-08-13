import { useEffect, useState } from 'react'
import SharedOrderDetailModal from '../../../components/ui/OrderDetailModal'
import { STATUS_TONES } from '../../../components/ui/StatusBadge'
import * as orderService from '../services/orderService'
import { BE_TO_FE } from '../utils/orderStatus'
import { PAYMENT_METHOD_LABEL } from '../../../constants/paymentMethod'

function formatDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
}

function formatDateTime(iso) {
  if (!iso) return null
  return `${formatDate(iso)}, ${formatTime(iso)}`
}

function formatRupiah(amount) {
  return `Rp ${(amount ?? 0).toLocaleString('id-ID')}`
}

// Fetches the order by id and maps it into the same { code, customerName,
// changedAt, fromStatus, toStatus, orderInfo, statusHistory, paymentInfo }
// shape History already feeds into the shared OrderDetailModal — so both
// pages render through one layout.
export default function OrderDetailModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orderId) return undefined
    let cancelled = false

    async function loadOrder() {
      try {
        setLoading(true)
        setError(null)
        const { data } = await orderService.getOrder(orderId)
        if (!cancelled) setOrder(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadOrder()
    return () => {
      cancelled = true
    }
  }, [orderId])

  if (!orderId) return null

  const histories = order?.statusHistories ?? []
  const lastHistory = histories[histories.length - 1]
  const prevHistory = histories[histories.length - 2]
  const latestChangeAt = lastHistory?.createdAt ?? order?.createdAt

  const unit = order?.service?.type === 'SATUAN' ? 'Pcs' : 'Kg'
  const qty = order?.service?.type === 'SATUAN' ? order?.itemCount : order?.weight

  const detail = order
    ? {
        code: order.orderNumber,
        customerName: order.customer?.name,
        changedAt: formatDateTime(latestChangeAt),
        fromStatus: prevHistory ? BE_TO_FE[prevHistory.status] ?? 'menunggu' : undefined,
        toStatus: prevHistory ? BE_TO_FE[lastHistory.status] ?? 'menunggu' : undefined,
        orderInfo: [
          { label: 'No. Pesanan', value: order.orderNumber },
          { label: 'Pelanggan', value: order.customer?.name },
          { label: 'No. Telp', value: order.customer?.phone },
          { label: 'Layanan', value: order.service?.name },
          { label: 'Berat', value: qty ? `${qty} ${unit}` : '-' },
          { label: 'Total', value: formatRupiah(order.totalPrice) },
        ],
        statusHistory: [...histories].reverse().map((history) => ({
          date: formatDate(history.createdAt),
          time: formatTime(history.createdAt),
          status: STATUS_TONES[BE_TO_FE[history.status] ?? 'menunggu'].label,
        })),
        paymentInfo: [
          {
            label: 'Metode Pembayaran',
            value: order.transaction
              ? PAYMENT_METHOD_LABEL[order.transaction.paymentMethod] ?? order.transaction.paymentMethod
              : '-',
          },
          { label: 'Dibuat Pada', value: formatDateTime(order.createdAt) },
          { label: 'Terakhir Diubah', value: formatDateTime(latestChangeAt) },
        ],
      }
    : {}

  return (
    <SharedOrderDetailModal open={Boolean(orderId)} onClose={onClose} loading={loading} error={error} {...detail} />
  )
}
