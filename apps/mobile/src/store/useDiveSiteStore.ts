import { create } from 'zustand';
import { IDataStore, StoreDependencies } from '@/src/services/DataStore';
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
    updateDiveSite: (diveSiteData: DiveSite) => Promise<void>
    removeDiveSite: (id: string) => Promise<void>
  };
}

// Instantiate the concrete data store implementation.
export const createDiveSiteStore = ({ dataStore }: StoreDependencies) => create<DiveSiteStore>((set, get) => ({
  diveSites: [],
  diveSite: null,
  isLoading: false,
  dataStore,

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

    updateDiveSite: async (diveSiteData: DiveSite) => {
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
  },
}));

// Default store instance for app usage, do not export
const useDiveSiteStore = createDiveSiteStore({
  dataStore: new AsyncStorageDataStore() // <-- The magic abstraction line
});

// Export convenient hooks for selecting state and actions
export const useDiveSiteList = () => useDiveSiteStore(state => state.diveSites);
export const useDiveSiteDetails = () => useDiveSiteStore(state => state.diveSite);
export const useDiveSiteIsLoading = () => useDiveSiteStore(state => state.isLoading);
export const useDiveSiteActions = () => useDiveSiteStore(state => state.actions);