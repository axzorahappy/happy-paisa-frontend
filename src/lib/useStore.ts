import { useState, useEffect } from 'react';
import { dataStore } from './dataStore';

export function useStore() {
  const [store, setStore] = useState(dataStore.getStore());

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => setStore(dataStore.getStore()));
    return unsubscribe;
  }, []);

  return store;
}