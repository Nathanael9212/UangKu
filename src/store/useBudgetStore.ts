import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Budget {
  id: string;
  categoryId: string;
  categoryLabel: string;
  limit: number;
  month: number;
  year: number;
}

interface BudgetStore {
  budgets: Budget[];
  setBudget: (categoryId: string, categoryLabel: string, limit: number, month: number, year: number) => void;
  deleteBudget: (id: string) => void;
  getBudget: (categoryId: string, month: number, year: number) => Budget | undefined;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budgets: [],

      setBudget: (categoryId, categoryLabel, limit, month, year) => {
        const existing = get().budgets.find(
          (b) => b.categoryId === categoryId && b.month === month && b.year === year
        );
        if (existing) {
          set((state) => ({
            budgets: state.budgets.map((b) =>
              b.id === existing.id ? { ...b, limit } : b
            ),
          }));
        } else {
          set((state) => ({
            budgets: [
              ...state.budgets,
              {
                id: `${categoryId}_${month}_${year}`,
                categoryId,
                categoryLabel,
                limit,
                month,
                year,
              },
            ],
          }));
        }
      },

      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),

      getBudget: (categoryId, month, year) =>
        get().budgets.find(
          (b) => b.categoryId === categoryId && b.month === month && b.year === year
        ),
    }),
    {
      name: 'uangku-budgets',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);