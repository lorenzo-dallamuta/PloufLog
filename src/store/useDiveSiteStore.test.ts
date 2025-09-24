import type { IDataStore } from '@/src/services/DataStore';
import { createDiveSiteStore } from "@/src/store/useDiveSiteStore";
import { getRandomArrayElements } from "@/src/utils/getRandomArrayElements";

import redSeaMock from "@/mocks/diveSites/redSea"

// Define mock data for testing, with sub-sampling for speed
// ( if you're trying snapshot testing and they fail, this is why )
const mockDiveSites: DiveSite[] = getRandomArrayElements(redSeaMock.result.elements, 100);

describe('useDiveSiteStore', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('loadDiveSites action', () => {
    it('should load diveSites and update state correctly', async () => {
      // Create mock data store
      const mockDataStore: IDataStore = {
        getDiveSites: jest.fn().mockResolvedValue(mockDiveSites),
        getDiveSite: jest.fn(),
        saveDiveSite: jest.fn(),
        deleteDiveSite: jest.fn()
      };

      // Create store instance with injected mock
      const useTestStore = createDiveSiteStore({ dataStore: mockDataStore });

      // Get and verify the initial state
      const state = useTestStore.getState();
      expect(state.diveSites).toEqual([]);
      expect(state.isLoading).toBe(false);

      await state.actions.loadDiveSites();

      // Get and verify the state after loading
      const newState = useTestStore.getState();
      expect(newState.isLoading).toBe(false);
      expect(newState.diveSites).toEqual(mockDiveSites);
    });

    it('should call dataStore.getDiveSites with the expected parameters', async () => {
      const mockGetDiveSites = jest.fn().mockResolvedValue([]);
      const mockDataStore: IDataStore = {
        getDiveSites: mockGetDiveSites,
        getDiveSite: jest.fn(),
        saveDiveSite: jest.fn(),
        deleteDiveSite: jest.fn()
      };

      // Create store instance with injected mock
      const useTestStore = createDiveSiteStore({ dataStore: mockDataStore });

      await useTestStore.getState().actions.loadDiveSites();

      expect(mockGetDiveSites).toHaveBeenCalledTimes(1);
      expect(mockGetDiveSites).toHaveBeenCalledWith(); // Verify no parameters
    });
  });

  describe('loadDiveSite action', () => {
    it('should load diveSite and update state correctly', async () => {
      // Create mock data store
      const mockDataStore: IDataStore = {
        getDiveSites: jest.fn(),
        getDiveSite: jest.fn().mockResolvedValue(mockDiveSites[0]),
        saveDiveSite: jest.fn(),
        deleteDiveSite: jest.fn()
      };

      // Create store instance with injected mock
      const useTestStore = createDiveSiteStore({ dataStore: mockDataStore });

      // Get and verify the initial state
      const state = useTestStore.getState();
      expect(state.diveSite).toEqual(null);
      expect(state.isLoading).toBe(false);

      await state.actions.loadDiveSite(mockDiveSites[0].data.properties.id);

      // Get and verify the state after loading
      const newState = useTestStore.getState();
      expect(newState.diveSite).toEqual(mockDiveSites[0]);
      expect(newState.isLoading).toBe(false);
    });

    it('should call dataStore.getDiveSite with the expected parameters', async () => {
      const mockGetDiveSite = jest.fn().mockResolvedValue(mockDiveSites[0]);
      const mockDataStore: IDataStore = {
        getDiveSites: jest.fn(),
        getDiveSite: mockGetDiveSite,
        saveDiveSite: jest.fn(),
        deleteDiveSite: jest.fn()
      };

      // Create store instance with injected mock
      const useTestStore = createDiveSiteStore({ dataStore: mockDataStore });

      await useTestStore.getState().actions.loadDiveSite(mockDiveSites[0].data.properties.id);

      expect(mockGetDiveSite).toHaveBeenCalledTimes(1);
      expect(mockGetDiveSite).toHaveBeenCalledWith(mockDiveSites[0].data.properties.id); // Verify no parameters
    });
  });

  describe('addDiveSite action', () => {
    let newSite: DiveSiteWithNullId;
    let expectedArray: DiveSite[];
    let expectedSite: DiveSite;

    beforeAll(() => {
      // Declare all mocks required only for the current test suite
      newSite = {
        ...mockDiveSites[0],
        data: {
          ...mockDiveSites[0].data,
          properties: {
            ...mockDiveSites[0].data.properties,
            id: null
          }
        }
      };
      expectedSite = {
        ...newSite,
        data: {
          ...newSite.data,
          properties: {
            ...newSite.data.properties,
            id: 'mock-generated-id-123'
          }
        }
      };
      expectedArray = [expectedSite];
    }),

    it('should save a new dive site and update state', async () => {
      // Create mock data store
      const mockDataStore: IDataStore = {
        getDiveSites: jest.fn().mockResolvedValue(expectedArray),
        getDiveSite: jest.fn().mockResolvedValue(expectedSite),
        saveDiveSite: jest.fn(),
        deleteDiveSite: jest.fn()
      };

      // Create store instance with injected mock
      const useTestStore = createDiveSiteStore({ dataStore: mockDataStore });

      // Get and verify the initial state
      const state = useTestStore.getState();
      expect(state.diveSite).toEqual(null);
      expect(state.isLoading).toBe(false);

      // Invoke the action
      await useTestStore.getState().actions.addDiveSite(newSite);

      // Verify Zustand state was updated correctly (depends on the sequential mocks above)
      const newstate = useTestStore.getState();
      expect(newstate.diveSites).toEqual(expectedArray);
      expect(newstate.diveSite).toEqual(expectedSite);
      expect(newstate.isLoading).toBe(false);
    });

    it('should call dataStore.saveDiveSite, dataStore.getDiveSites, dataStore.getDiveSite with the expected parameters', async () => {
      const mockSaveDiveSite = jest.fn().mockResolvedValue(expectedSite.data.properties.id);
      const mockGetDiveSites = jest.fn().mockResolvedValue(expectedArray);
      const mockGetDiveSite = jest.fn().mockResolvedValue(expectedSite);
      const mockDataStore: IDataStore = {
        getDiveSites: mockGetDiveSites,
        getDiveSite: mockGetDiveSite,
        saveDiveSite: mockSaveDiveSite,
        deleteDiveSite: jest.fn()
      };

      // Create store instance with injected mock
      const useTestStore = createDiveSiteStore({ dataStore: mockDataStore });

      await useTestStore.getState().actions.addDiveSite(newSite);

      expect(mockSaveDiveSite).toHaveBeenCalledTimes(1);
      expect(mockSaveDiveSite).toHaveBeenCalledWith(newSite);

      expect(mockGetDiveSites).toHaveBeenCalledTimes(1);
      expect(mockGetDiveSites).toHaveBeenCalledWith();

      expect(mockGetDiveSite).toHaveBeenCalledTimes(1);
      expect(mockGetDiveSite).toHaveBeenCalledWith(expectedSite.data.properties.id);
    });
  });

  describe('updateDiveSite action', () => {
    let updatedSite: DiveSite;
    let expectedArray: DiveSite[];

    beforeAll(() => {
      // Declare all mocks required only for the current test suite
      const [first, ...rest] = mockDiveSites;
      updatedSite = {
        ...first,
        data: {
          ...first.data,
          properties: {
            ...first.data.properties,
            name: "TEST_DIVE_SITE_UPSERT"
          }
        }
      };
      expectedArray = [updatedSite, ...rest];
    }),

    it('should update an existing dive site and update state', async () => {
      // Create mock data store
      const mockDataStore: IDataStore = {
        getDiveSites: jest.fn().mockResolvedValue(expectedArray),
        getDiveSite: jest.fn().mockResolvedValue(updatedSite),
        saveDiveSite: jest.fn(),
        deleteDiveSite: jest.fn()
      };

      // Create store instance with injected mock
      const useTestStore = createDiveSiteStore({ dataStore: mockDataStore });

      // Invoke the action
      await useTestStore.getState().actions.updateDiveSite(updatedSite);

      // Verify Zustand state was updated correctly (depends on the sequential mocks above)
      const state = useTestStore.getState();
      expect(state.diveSites).toEqual(expectedArray);
      expect(state.diveSite).toEqual(updatedSite);
      expect(state.isLoading).toBe(false);
    });

    it('should call dataStore.saveDiveSite, dataStore.getDiveSites, dataStore.getDiveSite with the expected parameters', async () => {
      const mockSaveDiveSite = jest.fn().mockResolvedValue(updatedSite.data.properties.id);
      const mockGetDiveSites = jest.fn().mockResolvedValue(expectedArray);
      const mockGetDiveSite = jest.fn().mockResolvedValue(updatedSite);
      const mockDataStore: IDataStore = {
        getDiveSites: mockGetDiveSites,
        getDiveSite: mockGetDiveSite,
        saveDiveSite: mockSaveDiveSite,
        deleteDiveSite: jest.fn()
      };

      // Create store instance with injected mock
      const useTestStore = createDiveSiteStore({ dataStore: mockDataStore });

      await useTestStore.getState().actions.updateDiveSite(updatedSite);

      expect(mockSaveDiveSite).toHaveBeenCalledTimes(1);
      expect(mockSaveDiveSite).toHaveBeenCalledWith(updatedSite);

      expect(mockGetDiveSites).toHaveBeenCalledTimes(1);
      expect(mockGetDiveSites).toHaveBeenCalledWith();

      expect(mockGetDiveSite).toHaveBeenCalledTimes(1);
      expect(mockGetDiveSite).toHaveBeenCalledWith(updatedSite.data.properties.id);
    });
  });

  describe('deleteDiveSite action', () => {
    let siteToDelete: DiveSite;
    let expectedArray: DiveSite[];

    beforeAll(() => {
      // Declare all mocks required only for the current test suite
      siteToDelete = getRandomArrayElements(mockDiveSites, 1)[0];
      expectedArray = mockDiveSites.filter(s => s.data.properties.id !== siteToDelete.data.properties.id);
    });

    it('should delete a dive site and update state', async () => {
      // Create mock data store
      const mockDataStore: IDataStore = {
        getDiveSites: jest.fn().mockResolvedValue(expectedArray),
        getDiveSite: jest.fn().mockResolvedValue(null),
        saveDiveSite: jest.fn(),
        deleteDiveSite: jest.fn()
      };

      // Create store instance with injected mock
      const useTestStore = createDiveSiteStore({ dataStore: mockDataStore });

      // Invoke the action
      await useTestStore.getState().actions.removeDiveSite(siteToDelete.data.properties.id);

      // Verify Zustand state was updated correctly (depends on the sequential mocks above)
      const state = useTestStore.getState();
      expect(state.diveSites).toEqual(expectedArray);
      expect(state.diveSite).toEqual(null);
      expect(state.isLoading).toBe(false);
    });

    it('should call dataStore.deleteDiveSite, dataStore.getDiveSites with the expected parameters', async () => {
      // Create mock data store
      const mockDataStore: IDataStore = {
        getDiveSites: jest.fn().mockResolvedValue(expectedArray),
        getDiveSite: jest.fn().mockResolvedValue(null),
        saveDiveSite: jest.fn(),
        deleteDiveSite: jest.fn()
      };

      // Create store instance with injected mock
      const useTestStore = createDiveSiteStore({ dataStore: mockDataStore });

      // Invoke the action
      await useTestStore.getState().actions.removeDiveSite(siteToDelete.data.properties.id);

      expect(mockDataStore.deleteDiveSite).toHaveBeenCalledTimes(1);
      expect(mockDataStore.deleteDiveSite).toHaveBeenCalledWith(siteToDelete.data.properties.id);

      expect(mockDataStore.getDiveSites).toHaveBeenCalledTimes(1);
      expect(mockDataStore.getDiveSites).toHaveBeenCalledWith(); // Verify no parameters
    });
  });
});
