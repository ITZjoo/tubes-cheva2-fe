// Corrected against the backend's actual ORDER_STATUS enum
// (src/utils/constants.js on tubes-cheva2-be) — it only has 8 values, no
// separate PICKUP or PACKING steps. FE's 8 status keys map 1:1 to it.
export const BE_CHAIN = [
  'PENDING',
  'WASHING',
  'DRYING',
  'IRONING',
  'READY',
  'DELIVERED',
  'COMPLETED',
]

export const FE_TO_BE = {
  menunggu: 'PENDING',
  dicuci: 'WASHING',
  dikeringkan: 'DRYING',
  disetrika: 'IRONING',
  siap_diambil: 'READY',
  diantar: 'DELIVERED',
  selesai: 'COMPLETED',
  dibatalkan: 'CANCELLED',
}

export const BE_TO_FE = {
  PENDING: 'menunggu',
  WASHING: 'dicuci',
  DRYING: 'dikeringkan',
  IRONING: 'disetrika',
  READY: 'siap_diambil',
  DELIVERED: 'diantar',
  COMPLETED: 'selesai',
  CANCELLED: 'dibatalkan',
}

// The backend only allows one forward step at a time (or a branch to
// CANCELLED up through READY, per ORDER_TRANSITIONS). The FE lets staff
// click any step ahead in EditStatusDrawer, so to reach a target we walk
// every intermediate BE status in between and issue one PATCH per hop.
export function getStatusHops(currentBeStatus, targetFeStatus) {
  const targetBeStatus = FE_TO_BE[targetFeStatus]
  if (!targetBeStatus) return []

  if (targetBeStatus === 'CANCELLED') {
    return currentBeStatus === 'CANCELLED' ? [] : ['CANCELLED']
  }

  const fromIndex = BE_CHAIN.indexOf(currentBeStatus)
  const toIndex = BE_CHAIN.indexOf(targetBeStatus)
  if (fromIndex === -1 || toIndex === -1 || toIndex <= fromIndex) return []

  return BE_CHAIN.slice(fromIndex + 1, toIndex + 1)
}