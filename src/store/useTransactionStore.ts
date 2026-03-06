import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionType } from '../constants/categories';

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;           // ISO string
  category: string;
  categoryLabel: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editTransaction: (id: string, tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  clearAll: () => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            {
              ...tx,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
            ...state.transactions,
          ],
        })),

      editTransaction: (id, tx) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...tx } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      clearAll: () => set({ transactions: [] }),
    }),
    {
      name: 'uangku-transactions',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);