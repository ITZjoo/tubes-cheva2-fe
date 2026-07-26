// Database storage keys
const KEY_UTAMA = 'utama_laundry_layanan_utama'
const KEY_TAMBAHAN = 'utama_laundry_layanan_tambahan'

const DEFAULT_LAYANAN_UTAMA = [
  {
    id: 'utama-1',
    name: 'Cuci Kiloan',
    description: 'Layanan cuci pakaian berdasarkan berat (Kg). Termasuk deterjen dan pelembut.',
    price: 5300,
    unit: 'Kg',
    status: true,
    items: []
  },
  {
    id: 'utama-2',
    name: 'Cuci Sepatu',
    description: 'Layanan cuci sepatu berdasarkan berat (Kg). Termasuk deterjen dan pelembut. Ala...',
    price: 25000,
    unit: 'Kg',
    status: true,
    items: []
  }
]

const DEFAULT_LAYANAN_TAMBAHAN = [
  {
    id: 'tambahan-1',
    name: 'Selimut',
    status: true,
    items: [
      { id: 'spec-1-1', name: 'Selimut Kecil', price: 10000, unit: 'Pcs' },
      { id: 'spec-1-2', name: 'Selimut Sedang', price: 15000, unit: 'Pcs' },
      { id: 'spec-1-3', name: 'Selimut Besar', price: 25000, unit: 'Pcs' }
    ]
  },
  {
    id: 'tambahan-2',
    name: 'Baju Putih',
    status: true,
    items: [
      { id: 'spec-2-1', name: 'Pemutih + Pelembut', price: 15000, unit: 'Pcs' }
    ]
  },
  {
    id: 'tambahan-3',
    name: 'Boneka',
    status: true,
    items: [
      { id: 'spec-3-1', name: 'Bantal Kecil', price: 30000, unit: 'Pcs' },
      { id: 'spec-3-2', name: 'Bantal Besar', price: 45000, unit: 'Pcs' }
    ]
  },
  {
    id: 'tambahan-4',
    name: 'Bantal',
    status: true,
    items: [
      { id: 'spec-4-1', name: 'Bantal Kecil', price: 30000, unit: 'Pcs' },
      { id: 'spec-4-2', name: 'Bantal Besar', price: 45000, unit: 'Pcs' }
    ]
  }
]

// Helper to generate a unique ID to avoid collisions on rapid clicks
function generateUniqueId(prefix) {
  const randomStr = Math.random().toString(36).substring(2, 9)
  return `${prefix}-${Date.now()}-${randomStr}`
}

// Fetchers & Savers
function getLayananUtamaDB() {
  const data = localStorage.getItem(KEY_UTAMA)
  if (!data) {
    localStorage.setItem(KEY_UTAMA, JSON.stringify(DEFAULT_LAYANAN_UTAMA))
    return DEFAULT_LAYANAN_UTAMA
  }
  return JSON.parse(data)
}

function saveLayananUtamaDB(db) {
  localStorage.setItem(KEY_UTAMA, JSON.stringify(db))
}

function getLayananTambahanDB() {
  const data = localStorage.getItem(KEY_TAMBAHAN)
  if (!data) {
    localStorage.setItem(KEY_TAMBAHAN, JSON.stringify(DEFAULT_LAYANAN_TAMBAHAN))
    return DEFAULT_LAYANAN_TAMBAHAN
  }
  return JSON.parse(data)
}

function saveLayananTambahanDB(db) {
  localStorage.setItem(KEY_TAMBAHAN, JSON.stringify(db))
}

// Layanan Utama CRUD
export async function getLayananUtama() {
  return getLayananUtamaDB()
}

export async function getSingleLayananUtama(id) {
  const db = getLayananUtamaDB()
  return db.find((x) => x.id === id) || null
}

export async function createLayananUtama(payload) {
  const db = getLayananUtamaDB()
  const newService = {
    id: generateUniqueId('utama'),
    name: payload.name,
    description: payload.description || '',
    price: Number(payload.price) || 0,
    unit: payload.unit || 'Kg',
    status: payload.status !== undefined ? payload.status : true,
    items: []
  }
  db.push(newService)
  saveLayananUtamaDB(db)
  return newService
}

export async function updateLayananUtama(id, payload) {
  const db = getLayananUtamaDB()
  const idx = db.findIndex((x) => x.id === id)
  if (idx === -1) throw new Error('Layanan Utama not found')

  db[idx] = {
    ...db[idx],
    ...payload,
    price: payload.price !== undefined ? Number(payload.price) : db[idx].price
  }
  saveLayananUtamaDB(db)
  return db[idx]
}

export async function deleteLayananUtama(id) {
  let db = getLayananUtamaDB()
  db = db.filter((x) => x.id !== id)
  saveLayananUtamaDB(db)
  return true
}

// Layanan Tambahan CRUD
export async function getLayananTambahan() {
  return getLayananTambahanDB()
}

export async function getSingleLayananTambahan(id) {
  const db = getLayananTambahanDB()
  return db.find((x) => x.id === id) || null
}

export async function createLayananTambahanGroup(name) {
  const db = getLayananTambahanDB()
  const newGroup = {
    id: generateUniqueId('tambahan'),
    name: name,
    status: true,
    items: []
  }
  db.push(newGroup)
  saveLayananTambahanDB(db)
  return newGroup
}

export async function updateLayananTambahanGroup(id, payload) {
  const db = getLayananTambahanDB()
  const idx = db.findIndex((x) => x.id === id)
  if (idx === -1) throw new Error('Layanan Tambahan group not found')

  db[idx] = {
    ...db[idx],
    ...payload
  }
  saveLayananTambahanDB(db)
  return db[idx]
}

export async function deleteLayananTambahanGroup(id) {
  let db = getLayananTambahanDB()
  db = db.filter((x) => x.id !== id)
  saveLayananTambahanDB(db)
  return true
}

// Specific Items inside Layanan Utama or Layanan Tambahan CRUD
export async function createLayananSpesifik(groupId, payload) {
  // Check Layanan Tambahan database
  const dbTambahan = getLayananTambahanDB()
  const groupTambahan = dbTambahan.find((x) => x.id === groupId)
  if (groupTambahan) {
    const newItem = {
      id: generateUniqueId('spec'),
      name: payload.name,
      price: Number(payload.price) || 0,
      unit: payload.unit || 'Pcs'
    }
    groupTambahan.items = groupTambahan.items || []
    groupTambahan.items.push(newItem)
    saveLayananTambahanDB(dbTambahan)
    return newItem
  }

  // Check Layanan Utama database
  const dbUtama = getLayananUtamaDB()
  const groupUtama = dbUtama.find((x) => x.id === groupId)
  if (groupUtama) {
    const newItem = {
      id: generateUniqueId('spec'),
      name: payload.name,
      price: Number(payload.price) || 0,
      unit: payload.unit || 'Pcs'
    }
    groupUtama.items = groupUtama.items || []
    groupUtama.items.push(newItem)
    saveLayananUtamaDB(dbUtama)
    return newItem
  }

  throw new Error('Group/Service parent not found')
}

export async function updateLayananSpesifik(groupId, itemId, payload) {
  // Check Layanan Tambahan database
  const dbTambahan = getLayananTambahanDB()
  const groupTambahan = dbTambahan.find((x) => x.id === groupId)
  if (groupTambahan) {
    const idx = groupTambahan.items.findIndex((item) => item.id === itemId)
    if (idx !== -1) {
      groupTambahan.items[idx] = {
        ...groupTambahan.items[idx],
        ...payload,
        price: payload.price !== undefined ? Number(payload.price) : groupTambahan.items[idx].price
      }
      saveLayananTambahanDB(dbTambahan)
      return groupTambahan.items[idx]
    }
  }

  // Check Layanan Utama database
  const dbUtama = getLayananUtamaDB()
  const groupUtama = dbUtama.find((x) => x.id === groupId)
  if (groupUtama) {
    const idx = groupUtama.items.findIndex((item) => item.id === itemId)
    if (idx !== -1) {
      groupUtama.items[idx] = {
        ...groupUtama.items[idx],
        ...payload,
        price: payload.price !== undefined ? Number(payload.price) : groupUtama.items[idx].price
      }
      saveLayananUtamaDB(dbUtama)
      return groupUtama.items[idx]
    }
  }

  throw new Error('Layanan Spesifik item not found')
}

export async function deleteLayananSpesifik(groupId, itemId) {
  // Check Layanan Tambahan database
  const dbTambahan = getLayananTambahanDB()
  const groupTambahan = dbTambahan.find((x) => x.id === groupId)
  if (groupTambahan) {
    groupTambahan.items = groupTambahan.items.filter((item) => item.id !== itemId)
    saveLayananTambahanDB(dbTambahan)
    return true
  }

  // Check Layanan Utama database
  const dbUtama = getLayananUtamaDB()
  const groupUtama = dbUtama.find((x) => x.id === groupId)
  if (groupUtama) {
    groupUtama.items = (groupUtama.items || []).filter((item) => item.id !== itemId)
    saveLayananUtamaDB(dbUtama)
    return true
  }

  throw new Error('Group/Service parent not found')
}
