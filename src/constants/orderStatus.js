export const ORDER_STATUS = {
  PENDING: 'pending',
  DIPROSES: 'diproses',
  SELESAI: 'selesai',
}

export const ORDER_STATUS_LABEL = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.DIPROSES]: 'Diproses',
  [ORDER_STATUS.SELESAI]: 'Selesai',
}

export const ORDER_STATUS_LIST = Object.values(ORDER_STATUS)
