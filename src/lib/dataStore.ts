import { mockApi } from './mockApi';

interface Store {
  accountBalance?: {
    balance: number;
    change: number;
  };
  happyPaisa?: { balance: number };
  cashback?: { balance: number };
  thisMonth?: { spent: number };
  [key: string]: any; // Allow for other properties
}

let store: Store = {};

const listeners = new Set<() => void>();

export const dataStore = {
  getStore: () => store,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  fetchData: async () => {
    const [accountBalance, happyPaisa, cashback, thisMonth] = await Promise.all([
      mockApi.getAccountBalance(),
      mockApi.getHappyPaisa(),
      mockApi.getCashback(),
      mockApi.getThisMonth(),
    ]);
    store = { ...store, accountBalance, happyPaisa, cashback, thisMonth };
    listeners.forEach(listener => listener());
  },
};