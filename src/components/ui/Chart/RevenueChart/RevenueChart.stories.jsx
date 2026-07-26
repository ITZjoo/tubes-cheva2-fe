import RevenueChart from './RevenueChart'
import { revenueMockData } from './RevenueChart.mock'

export default {
  title: 'UI/Chart/RevenueChart',
  component: RevenueChart,
  parameters: { layout: 'centered' },
}

export const HariIni = {
  args: {
    data: revenueMockData,
    defaultPeriod: 'today',
  },
}

export const MingguIni = {
  args: {
    data: revenueMockData,
    defaultPeriod: 'week',
  },
}

export const BulanIni = {
  args: {
    data: revenueMockData,
    defaultPeriod: 'month',
  },
}

export const LabelKustom = {
  args: {
    data: revenueMockData,
    defaultPeriod: 'today',
    incomeLabel: 'Pemasukan',
    expenseLabel: 'Pengeluaran',
  },
}

export const TanpaData = {
  args: {
    data: { today: [], week: [], month: [] },
    defaultPeriod: 'today',
  },
}