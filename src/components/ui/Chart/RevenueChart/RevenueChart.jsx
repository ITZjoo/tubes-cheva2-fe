import { useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from 'recharts'
import Typography from '../../Typography'

/**
 * @typedef {{ label: string, income: number, expense: number }} RevenuePoint
 * @typedef {{ today: RevenuePoint[], week: RevenuePoint[], month: RevenuePoint[] }} RevenueData
 */

const PERIODS = [
  { key: 'today', label: 'Hari ini' },
  { key: 'week', label: 'Minggu ini' },
  { key: 'month', label: 'Bulan ini' },
]

const Y_TICKS = [0, 500000, 1000000, 2000000]
const CARD_WIDTH = 645
const CARD_HEIGHT = 402

function formatRupiah(value) {
  return value.toLocaleString('id-ID')
}

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 shadow-md">
      <Typography variant="label-sm" as="p" className="text-on-surface-variant mb-1">
        {label}
      </Typography>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <Typography variant="body-sm" as="span" className="text-on-surface">
            Rp{formatRupiah(entry.value)}
          </Typography>
        </div>
      ))}
    </div>
  )
}

/**
 *
 * @param {{
 *   data: RevenueData,
 *   period?: 'today' | 'week' | 'month',
 *   defaultPeriod?: 'today' | 'week' | 'month',
 *   onPeriodChange?: (period: string) => void,
 *   incomeLabel?: string,
 *   expenseLabel?: string,
 *   className?: string,
 * }} props
 */
export default function RevenueChart({
  data,
  period,
  defaultPeriod = 'today',
  onPeriodChange,
  incomeLabel = 'Pemasukan Hari Ini',
  expenseLabel = 'Pengeluaran Kemarin',
  className = '',
}) {
  const [internalPeriod, setInternalPeriod] = useState(defaultPeriod)
  const activePeriod = period ?? internalPeriod
  const chartData = data?.[activePeriod] ?? []

  const handlePeriodClick = (key) => {
    onPeriodChange?.(key)
    if (period === undefined) setInternalPeriod(key)
  }

  return (
    <div
      className={`flex flex-col rounded-[18px] bg-surface-container-lowest p-6 shadow-[0_1px_6px_0_rgba(0,0,0,0.10)] ${className}`}
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
        <Typography variant="label-lg" as="h3" className="leading-[140%]">
          Ringkasan Pendapatan
        </Typography>

        <div
          role="tablist"
          aria-label="Rentang waktu ringkasan pendapatan"
          className="flex items-center"
        >
          {PERIODS.map(({ key, label }, index) => {
            const isActive = key === activePeriod
            const isFirst = index === 0
            const isLast = index === PERIODS.length - 1
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handlePeriodClick(key)}
                style={{
                  width: 95,
                  height: 35,
                  borderStyle: 'solid',
                  // Menyesuaikan ketebalan border agar tidak ada garis vertikal di tengah
                  borderWidth: isFirst
                    ? '0.6px 0px 0.6px 0.6px' // Hanya punya border kiri, atas, bawah
                    : isLast
                      ? '0.6px 0.6px 0.6px 0px' // Hanya punya border kanan, atas, bawah
                      : '0.6px 0px 0.6px 0px', // Tengah: Hanya border atas, bawah
                  borderColor: isActive
                    ? 'var(--color-on-primary-container)'
                    : 'var(--color-on-surface-variant)',
                  borderTopLeftRadius: isFirst ? 8 : 0,
                  borderBottomLeftRadius: isFirst ? 8 : 0,
                  borderTopRightRadius: isLast ? 8 : 0,
                  borderBottomRightRadius: isLast ? 8 : 0,
                }}
                className={`flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Typography variant="label-sm" as="span">
                  {label}
                </Typography>
              </button>
            )
          })}
        </div>
      </div>

      <div className="min-h-0 w-full flex-1">
        {chartData.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <Typography variant="body-sm" as="p" className="text-on-surface-variant">
              Belum ada data pendapatan untuk periode ini
            </Typography>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueIncomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="revenueExpenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-tertiary)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="var(--color-outline-variant)"
              strokeDasharray="3 3"
            />
            <ReferenceLine y={0} stroke="var(--color-outline-variant)" strokeWidth={1} />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              dy={8}
              tick={{
                fill: 'var(--color-on-surface-variant)',
                fontSize: 12,
                fontFamily: 'var(--font-body)',
              }}
            />
            <YAxis
              ticks={Y_TICKS}
              domain={[0, 'dataMax + 200000']}
              axisLine={false}
              tickLine={false}
              width={64}
              tickFormatter={formatRupiah}
              tick={{
                fill: 'var(--color-on-surface-variant)',
                fontSize: 12,
                fontFamily: 'var(--font-body)',
              }}
            />

            <Tooltip content={<RevenueTooltip />} />

            <Area
              type="monotone"
              dataKey="income"
              name={incomeLabel}
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#revenueIncomeFill)"
              dot={{
                r: 4,
                fill: '#FFFFFF',
                stroke: 'var(--color-primary)',
                strokeWidth: 1,
              }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name={expenseLabel}
              stroke="var(--color-tertiary)"
              strokeWidth={2}
              fill="url(#revenueExpenseFill)"
              dot={{
                r: 4,
                fill: '#FFFFFF',
                stroke: 'var(--color-tertiary)',
                strokeWidth: 1,
              }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>

      <div className="mt-3 flex shrink-0 items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <LegendMarker color="var(--color-primary)" />
          <Typography variant="label-sm" as="span" className="text-on-surface-variant">
            {incomeLabel}
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <LegendMarker color="var(--color-tertiary)" />
          <Typography variant="label-sm" as="span" className="text-on-surface-variant">
            {expenseLabel}
          </Typography>
        </div>
      </div>
    </div>
  )
}

function LegendMarker({ color }) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" aria-hidden="true">
      <line x1="8" y1="5" x2="20" y2="5" stroke={color} strokeWidth="2" />
      <circle
        cx="4"
        cy="5"
        r="3.5"
        fill="var(--color-surface-container-lowest)"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  )
}