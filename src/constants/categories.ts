export type TransactionType = "pemasukan" | "pengeluaran";

export interface Category {
  id: string;
  label: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export const PEMASUKAN_CATEGORIES: Category[] = [
  {
    id: "gaji",
    label: "Gaji",
    type: "pemasukan",
    icon: "briefcase-outline",
    color: "#16A34A",
  },
  {
    id: "investasi",
    label: "Investasi",
    type: "pemasukan",
    icon: "trending-up-outline",
    color: "#2563EB",
  },
  {
    id: "deposito",
    label: "Deposito",
    type: "pemasukan",
    icon: "library-outline",
    color: "#0891B2",
  },
  {
    id: "dividen",
    label: "Dividen",
    type: "pemasukan",
    icon: "cash-outline",
    color: "#7C3AED",
  },
  {
    id: "tabungan",
    label: "Tabungan",
    type: "pemasukan",
    icon: "wallet-outline",
    color: "#D97706",
  },
  {
    id: "pengembalian_dana",
    label: "Pengembalian Dana",
    type: "pemasukan",
    icon: "refresh-outline",
    color: "#65A30D",
  },
  {
    id: "penjualan",
    label: "Penjualan",
    type: "pemasukan",
    icon: "storefront-outline",
    color: "#DB2777",
  },
  {
    id: "penyewaan",
    label: "Penyewaan",
    type: "pemasukan",
    icon: "home-outline",
    color: "#EA580C",
  },
  {
    id: "lain_lain_masuk",
    label: "Lain-Lain",
    type: "pemasukan",
    icon: "ellipsis-horizontal-outline",
    color: "#64748B",
  },
];

export const PENGELUARAN_CATEGORIES: Category[] = [
  {
    id: "asuransi",
    label: "Asuransi",
    type: "pengeluaran",
    icon: "shield-checkmark-outline",
    color: "#2563EB",
  },
  {
    id: "belanja",
    label: "Belanja",
    type: "pengeluaran",
    icon: "bag-handle-outline",
    color: "#DB2777",
  },
  {
    id: "makanan",
    label: "Makanan",
    type: "pengeluaran",
    icon: "fast-food-outline",
    color: "#EA580C",
  },
  {
    id: "elektronik",
    label: "Elektronik",
    type: "pengeluaran",
    icon: "phone-portrait-outline",
    color: "#0891B2",
  },
  {
    id: "tagihan",
    label: "Tagihan",
    type: "pengeluaran",
    icon: "receipt-outline",
    color: "#DC2626",
  },
  {
    id: "transportasi",
    label: "Transportasi",
    type: "pengeluaran",
    icon: "car-outline",
    color: "#7C3AED",
  },
  {
    id: "kendaraan",
    label: "Kendaraan",
    type: "pengeluaran",
    icon: "bicycle-outline",
    color: "#D97706",
  },
  {
    id: "kesehatan",
    label: "Kesehatan",
    type: "pengeluaran",
    icon: "medkit-outline",
    color: "#16A34A",
  },
  {
    id: "lain_lain_keluar",
    label: "Lain-Lain",
    type: "pengeluaran",
    icon: "ellipsis-horizontal-outline",
    color: "#64748B",
  },
];

export const ALL_CATEGORIES = [
  ...PEMASUKAN_CATEGORIES,
  ...PENGELUARAN_CATEGORIES,
];

export const getCategoryById = (id: string): Category | undefined =>
  ALL_CATEGORIES.find((c) => c.id === id);
