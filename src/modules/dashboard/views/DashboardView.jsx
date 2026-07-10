import DashboardLayout from '../../../components/layout/DashboardLayout'
import StatCard from '../../../components/ui/StatCard'

export default function DashboardView() {
  return (
    <DashboardLayout activeRoute="/dashboard">
      <h1 className="font-heading mb-6 text-2xl font-bold text-on-surface">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Produk" value={24} icon="🧺" />
        <StatCard label="Total Pesanan" value={128} icon="📦" />
        <StatCard label="Pesanan Pending" value={5} icon="⏳" />
        <StatCard label="Pesanan Selesai" value={98} icon="✅" />
      </div>
    </DashboardLayout>
  )
}
