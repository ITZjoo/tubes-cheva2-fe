// Jenis Pengeluaran — urutan & label mengikuti mockup dropdown "Pilih Jenis Pengeluaran".
export const EXPENSE_CATEGORY_LABEL = {
  BAHAN_BAKU: 'Bahan Baku & Perlengkapan',
  UTILITAS: 'Utilitas & Operasional',
  GAJI: 'Karyawan & Gaji',
  ADMINISTRASI: 'Adminstrasi',
  LAINNYA: 'Lainnya',
}

export const EXPENSE_CATEGORY_OPTIONS = Object.entries(EXPENSE_CATEGORY_LABEL)

// Sumber Dana — mengikuti mockup dropdown "Pilih Sumber Dana".
export const FUNDING_SOURCE_LABEL = {
  KAS_TOKO: 'Kas Toko',
  SALDO_BANK: 'Saldo Bank/Transfer',
}

export const FUNDING_SOURCE_OPTIONS = Object.entries(FUNDING_SOURCE_LABEL)

// Jenis Layanan untuk section "Jenis Layanan" pada filter keuangan.
// NOTE: sesuaikan dengan daftar layanan asli dari modul Layanan/Produk
// jika sudah ada konstanta tersendiri di project (mis. constants/serviceType.js).
export const SERVICE_TYPE_OPTIONS = [
  'Cuci Kiloan',
  'Selimut',
  'Sprei',
  'Boneka',
  'Bantal',
  'Bed Cover',
  'Karpet',
]