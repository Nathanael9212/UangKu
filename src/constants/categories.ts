export type TransactionType = 'pemasukan' | 'pengeluaran';

export interface Category {
  id: string;
  label: string;
  type: TransactionType;
}

export const PEMASUKAN_CATEGORIES: Category[] = [
  { id: 'gaji', label: 'Gaji', type: 'pemasukan' },
  { id: 'investasi', label: 'Investasi', type: 'pemasukan' },
  { id: 'deposito', label: 'Deposito', type: 'pemasukan' },
  { id: 'dividen', label: 'Dividen', type: 'pemasukan' },
  { id: 'tabungan', label: 'Tabungan', type: 'pemasukan' },
  { id: 'pengembalian_dana', label: 'Pengembalian Dana', type: 'pemasukan' },
  { id: 'penjualan', label: 'Penjualan', type: 'pemasukan' },
  { id: 'penyewaan', label: 'Penyewaan', type: 'pemasukan' },
  { id: 'lain_lain_masuk', label: 'Lain-Lain', type: 'pemasukan' },
];

export const PENGELUARAN_CATEGORIES: Category[] = [
  { id: 'asuransi', label: 'Asuransi', type: 'pengeluaran' },
  { id: 'belanja', label: 'Belanja', type: 'pengeluaran' },
  { id: 'makanan', label: 'Makanan', type: 'pengeluaran' },
  { id: 'elektronik', label: 'Elektronik', type: 'pengeluaran' },
  { id: 'tagihan', label: 'Tagihan', type: 'pengeluaran' },
  { id: 'transportasi', label: 'Transportasi', type: 'pengeluaran' },
  { id: 'kendaraan', label: 'Kendaraan', type: 'pengeluaran' },
  { id: 'kesehatan', label: 'Kesehatan', type: 'pengeluaran' },
  { id: 'lain_lain_keluar', label: 'Lain-Lain', type: 'pengeluaran' },
];

export const ALL_CATEGORIES = [...PEMASUKAN_CATEGORIES, ...PENGELUARAN_CATEGORIES];