import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageShell from '../../../components/ui/PageShell'
import Icon from '../../../components/ui/Icon'
import StatusBadge from '../../../components/ui/StatusBadge'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import * as orderService from '../services/orderService'
import { BE_TO_FE } from '../utils/orderStatus'

const PAYMENT_METHOD_LABEL = {
  CASH: 'Tunai',
  QRIS: 'QRIS',
  TRANSFER: 'Transfer Bank',
  EWALLET: 'E-Wallet',
}

const PAYMENT_STATUS_LABEL = {
  UNPAID: 'Belum Dibayar',
  PAID: 'Sudah Dibayar',
  REFUNDED: 'Dikembalikan',
}

function formatDateTime(iso) {
  if (!iso) return '-'
  const date = new Date(iso)
  const datePart = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const timePart = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
  return `${datePart}, ${timePart}`
}

function formatRupiah(amount) {
  return `Rp ${(amount ?? 0).toLocaleString('id-ID')}`
}

export default function OrderDetailView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const handleSidebarNavigate = useSidebarNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadOrder() {
      try {
        setLoading(true)
        setError(null)
        const { data } = await orderService.getOrder(id)
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
  }, [id])

  const unit = order?.service?.type === 'SATUAN' ? 'Pcs' : 'Kg'
  const qty = order?.service?.type === 'SATUAN' ? order?.itemCount : order?.weight
  const lineItems =
    order?.items?.length > 0
      ? order.items.map((item) => ({
          name: item.name,
          qty: item.service?.type === 'SATUAN' ? item.itemCount : item.weight,
          unit: item.service?.type === 'SATUAN' ? 'Pcs' : 'Kg',
          price: item.subtotal,
        }))
      : order
        ? [{ name: order.service?.name ?? 'Layanan', qty, unit, price: order.totalPrice }]
        : []

  return (
    <PageShell
      activeItemId="pesanan"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-8 font-body max-w-[900px] mx-auto flex flex-col gap-6"
    >
      <section className="flex items-center gap-3 border-b border-outline-variant/35 pb-4.5">
        <button
          onClick={() => navigate('/orders')}
          className="w-10 h-10 rounded-xl hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer text-on-surface-variant"
        >
          <Icon name="arrow_back" size={22} className="text-on-surface" />
        </button>
        <h2 className="text-xl font-bold text-on-surface">
          Detail Pesanan {order ? `#${order.orderNumber}` : `#${id}`}
        </h2>
      </section>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
          <span className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></span>
          <p className="text-body-md text-on-surface-variant/70 font-semibold">Memuat pesanan...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-center">
          <Icon name="error" size={40} className="text-error" />
          <p className="text-body-md text-error font-semibold">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-subtitle text-on-surface">{order.customer?.name}</h3>
                <p className="text-body-sm text-on-surface-variant">{order.customer?.phone}</p>
              </div>
              <StatusBadge status={BE_TO_FE[order.status] ?? 'menunggu'} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-body-sm">
              <div>
                <p className="text-on-surface-variant">Tanggal Pesanan</p>
                <p className="text-on-surface font-semibold">{formatDateTime(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-on-surface-variant">Estimasi Selesai</p>
                <p className="text-on-surface font-semibold">{formatDateTime(order.estimatedDone)}</p>
              </div>
              {order.pickupAddress && (
                <div>
                  <p className="text-on-surface-variant">Alamat Jemput</p>
                  <p className="text-on-surface font-semibold">{order.pickupAddress}</p>
                </div>
              )}
              {order.deliveryAddress && (
                <div>
                  <p className="text-on-surface-variant">Alamat Antar</p>
                  <p className="text-on-surface font-semibold">{order.deliveryAddress}</p>
                </div>
              )}
              {order.courier && (
                <div>
                  <p className="text-on-surface-variant">Kurir</p>
                  <p className="text-on-surface font-semibold">{order.courier.name}</p>
                </div>
              )}
              {order.notes && (
                <div className="col-span-2">
                  <p className="text-on-surface-variant">Catatan</p>
                  <p className="text-on-surface font-semibold">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <h3 className="text-subtitle text-on-surface">Layanan</h3>
            <div className="flex flex-col gap-2">
              {lineItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-body-md text-on-surface font-medium">
                  <span>
                    {item.name}
                    {item.qty ? ` - ${item.qty} ${item.unit}` : ''}
                  </span>
                  <span className="font-mono">{formatRupiah(item.price)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-outline-variant/30 pt-2 mt-1 text-label-md font-bold text-on-surface">
                <span>Total</span>
                <span className="text-primary font-mono">{formatRupiah(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {order.transaction && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-3">
              <h3 className="text-subtitle text-on-surface">Pembayaran</h3>
              <div className="grid grid-cols-2 gap-4 text-body-sm">
                <div>
                  <p className="text-on-surface-variant">Metode</p>
                  <p className="text-on-surface font-semibold">
                    {PAYMENT_METHOD_LABEL[order.transaction.paymentMethod] ?? order.transaction.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Status</p>
                  <p className="text-on-surface font-semibold">
                    {PAYMENT_STATUS_LABEL[order.transaction.paymentStatus] ?? order.transaction.paymentStatus}
                  </p>
                </div>
                {order.transaction.paidAt && (
                  <div>
                    <p className="text-on-surface-variant">Dibayar Pada</p>
                    <p className="text-on-surface font-semibold">{formatDateTime(order.transaction.paidAt)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {order.statusHistories?.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-3">
              <h3 className="text-subtitle text-on-surface">Riwayat Status</h3>
              <div className="flex flex-col divide-y divide-outline-variant/20">
                {order.statusHistories.map((history) => (
                  <div key={history.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <div>
                      <StatusBadge status={BE_TO_FE[history.status] ?? 'menunggu'} />
                      {history.notes && <p className="text-body-sm text-on-surface-variant mt-1">{history.notes}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-body-sm text-on-surface-variant">{formatDateTime(history.createdAt)}</p>
                      {history.user?.name && (
                        <p className="text-body-sm text-on-surface-variant/70">oleh {history.user.name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  )
}
