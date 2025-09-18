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
    addDiveSite: (diveSiteData: DiveSiteWithNullId) => Promise<void>
    removeDiveSite: (id: string) => Promise<void>
    removeAllDiveSites: () => Promise<void>
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
      const diveSite = await get().dataStore.getDiveSite(id);
      set({ diveSite, isLoading: false });
    },

    addDiveSite: async (diveSiteData: DiveSiteWithNullId) => {
      set({ isLoading: true });
      const id = await get().dataStore.saveDiveSite(diveSiteData);
      const diveSites = await get().dataStore.getDiveSites();
      const diveSite = await get().dataStore.getDiveSite(id);
      set({ diveSites, diveSite, isLoading: false });
    },

    removeDiveSite: async (id: string) => {
      set({ isLoading: true });
      await get().dataStore.deleteDiveSite(id);
      const diveSites = await get().dataStore.getDiveSites();
      set({ diveSites, diveSite: null, isLoading: false });
    },

    removeAllDiveSites: async () => {
      // TODO: add logic to clear main data layer (react async storage) as well
      set({ diveSites: [], diveSite: null, isLoading: false });
    },
  },
}));

// Export convenient hooks for selecting state and actions
export const useDiveSites = () => useDiveSiteStore(state => state.diveSites);
export const useDiveSiteActions = () => useDiveSiteStore(state => state.actions);