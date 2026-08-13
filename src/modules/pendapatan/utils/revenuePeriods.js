// Local-date (not UTC) 'YYYY-MM-DD' formatting — matches the backend's
// startOfDay/endOfDay semantics when we send these back as startDate/endDate.
export function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function startOfWeek(date) {
  // Monday-start week.
  const day = date.getDay()
  const diffToMonday = (day === 0 ? -6 : 1) - day
  return addDays(date, diffToMonday)
}

export function getPeriodRange(period, reference = new Date()) {
  if (period === 'today') {
    const s = toDateStr(reference)
    return { startDate: s, endDate: s }
  }
  if (period === 'week') {
    const monday = startOfWeek(reference)
    const sunday = addDays(monday, 6)
    return { startDate: toDateStr(monday), endDate: toDateStr(sunday) }
  }
  const first = new Date(reference.getFullYear(), reference.getMonth(), 1)
  const last = new Date(reference.getFullYear(), reference.getMonth() + 1, 0)
  return { startDate: toDateStr(first), endDate: toDateStr(last) }
}

// The comparison range shown in each stat card's "+x% dari ..." badge.
export function getPreviousPeriodRange(period, reference = new Date()) {
  if (period === 'today') return getPeriodRange('today', addDays(reference, -1))
  if (period === 'week') return getPeriodRange('week', addDays(reference, -7))
  return getPeriodRange('month', new Date(reference.getFullYear(), reference.getMonth() - 1, 1))
}

export function sumAmount(rows) {
  return rows.reduce((sum, row) => sum + (row.amount ?? 0), 0)
}

// Returns null (rather than Infinity/NaN) when there's nothing to compare
// against, so the UI can hide the badge instead of showing a bogus number.
export function percentChange(current, previous) {
  if (!previous) return current > 0 ? 100 : null
  return Math.round(((current - previous) / previous) * 100)
}

const WEEK_DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

// Buckets the already-fetched current-period transactions/expenses into the
// { label, income, expense }[] shape RevenueChart expects, so stat-card
// totals and the chart are always derived from the same numbers.
export function buildChartBucket(period, transactions, expenses, range) {
  if (period === 'today') {
    const buckets = Array.from({ length: 8 }, (_, i) => ({
      label: `${String(i * 3).padStart(2, '0')}.00`,
      income: 0,
      expense: 0,
      hourStart: i * 3,
    }))
    transactions.forEach((t) => {
      const hour = new Date(t.paidAt ?? t.createdAt).getHours()
      buckets[Math.min(7, Math.floor(hour / 3))].income += t.amount ?? 0
    })
    expenses.forEach((e) => {
      const hour = new Date(e.spentAt).getHours()
      buckets[Math.min(7, Math.floor(hour / 3))].expense += e.amount ?? 0
    })
    return buckets.map(({ label, income, expense }) => ({ label, income, expense }))
  }

  if (period === 'week') {
    const monday = new Date(`${range.startDate}T00:00:00`)
    const buckets = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(monday, i)
      return { label: WEEK_DAY_LABELS[date.getDay()], income: 0, expense: 0, dateStr: toDateStr(date) }
    })
    transactions.forEach((t) => {
      const dateStr = toDateStr(new Date(t.paidAt ?? t.createdAt))
      const bucket = buckets.find((b) => b.dateStr === dateStr)
      if (bucket) bucket.income += t.amount ?? 0
    })
    expenses.forEach((e) => {
      const dateStr = toDateStr(new Date(e.spentAt))
      const bucket = buckets.find((b) => b.dateStr === dateStr)
      if (bucket) bucket.expense += e.amount ?? 0
    })
    return buckets.map(({ label, income, expense }) => ({ label, income, expense }))
  }

  // month — 4 week-of-month buckets, same grouping Dashboard already uses.
  const buckets = Array.from({ length: 4 }, (_, i) => ({ label: `Week ${i + 1}`, income: 0, expense: 0 }))
  transactions.forEach((t) => {
    const day = new Date(t.paidAt ?? t.createdAt).getDate()
    buckets[Math.min(3, Math.floor((day - 1) / 7))].income += t.amount ?? 0
  })
  expenses.forEach((e) => {
    const day = new Date(e.spentAt).getDate()
    buckets[Math.min(3, Math.floor((day - 1) / 7))].expense += e.amount ?? 0
  })
  return buckets
}
