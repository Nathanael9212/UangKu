import { useMemo } from 'react';
import { useTransactionStore, Transaction } from '../store/useTransactionStore';
import { PeriodType, getDateRange, isInRange } from '../utils/dateHelper';
import { TransactionType } from '../constants/categories';

export type SortType = 'terbaru' | 'terlama';

interface FilterOptions {
  period: PeriodType;
  currentDate: Date;
  selectedCategories: string[];   // kosong = semua
  typeFilter: TransactionType | 'semua';
  sort: SortType;
}

export const useFilteredTransactions = (options: FilterOptions) => {
  const transactions = useTransactionStore((state) => state.transactions);

  const { period, currentDate, selectedCategories, typeFilter, sort } = options;

  const filtered = useMemo(() => {
    const { start, end } = getDateRange(currentDate, period);

    return transactions
      .filter((tx) => {
        // Filter periode
        if (!isInRange(tx.date, start, end)) return false;

        // Filter tipe
        if (typeFilter !== 'semua' && tx.type !== typeFilter) return false;

        // Filter kategori
        if (selectedCategories.length > 0 && !selectedCategories.includes(tx.category)) return false;

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sort === 'terbaru' ? dateB - dateA : dateA - dateB;
      });
  }, [transactions, period, currentDate, selectedCategories, typeFilter, sort]);

  const summary = useMemo(() => {
    const pemasukan = filtered
      .filter((tx) => tx.type === 'pemasukan')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const pengeluaran = filtered
      .filter((tx) => tx.type === 'pengeluaran')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      pemasukan,
      pengeluaran,
      saldo: pemasukan - pengeluaran,
    };
  }, [filtered]);

  return { filtered, summary };
};