import { create } from 'zustand';
import { IDataStore } from '@/src/services/DataStore';
import { AsyncStorageDataStore } from '@/src/services/AsyncStorageDataStore';

// Define the shape of our global state
interface DiveSiteStore {
  diveSites: DiveSite[];
  diveSite: DiveSite | null;
  isLoading: boolean;
  dataStore: IDataStore; // The store holds a reference to the abstraction
  actions: {
    loadDiveSites: () => Promise<void>;
    loadDiveSite: (id: string) => Promise<void>;
  };
}

// Instantiate the concrete data store implementation.
export const useDiveSiteStore = create<DiveSiteStore>((set, get) => ({
  diveSites: [],
  diveSite: null,
  isLoading: false,
  dataStore: new AsyncStorageDataStore(), // <-- The magic abstraction line

  actions: {
    loadDiveSites: async () => {
      set({ isLoading: true });
      const diveSites = await get().dataStore.getDiveSites();
      set({ diveSites, isLoading: false });
    },

    loadDiveSite: async (id: string) => {
      set({ isLoading: true });
      set({ isLoading: false });
    },
  },
}));

// Export convenient hooks for selecting state and actions
export const useDiveSites = () => useDiveSiteStore(state => state.diveSites);
export const useDiveSiteActions = () => useDiveSiteStore(state => state.actions);