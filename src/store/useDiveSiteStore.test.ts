import type { IDataStore } from '@/src/services/DataStore';
import { createDiveSiteStore } from "@/src/store/useDiveSiteStore";
import { getRandomArrayElements } from "@/src/utils/getRandomArrayElements";

import redSeaMock from "@/mocks/diveSites/redSea"

// Define mock data for testing, with sub-sampling for speed
// ( if you're trying snapshot testing and they fail, this is why )
const mockDiveSites: DiveSite[] = getRandomArrayElements(redSeaMock.result.elements, 100);

describe('useDiveSiteStore', () => {
  let mockDataStore: IDataStore;
  let useTestStore: ReturnType<typeof createDiveSiteStore>;

  const baseMockDataStore: IDataStore = {
    getDiveSites: jest.fn().mockResolvedValue([]),
    getDiveSite: jest.fn().mockResolvedValue(null),
    saveDiveSite: jest.fn().mockResolvedValue('mock-generated-id-123'),
    deleteDiveSite: jest.fn().mockResolvedValue(undefined)
  };

  beforeEach(() => {
    // Create fresh mocks for each test
    mockDataStore = { ...baseMockDataStore };
    useTestStore = createDiveSiteStore({ dataStore: mockDataStore });
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('loadDiveSites action', () => {
    beforeEach(() => {
      mockDataStore.getDiveSites = jest.fn().mockResolvedValue(mockDiveSites);
    });

    it('should load diveSites and update state correctly', async () => {
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
      // Invoke the action
      await useTestStore.getState().actions.loadDiveSites();

      expect(mockDataStore.getDiveSites).toHaveBeenCalledTimes(1);
      expect(mockDataStore.getDiveSites).toHaveBeenCalledWith(); // Verify no parameters
    });
  });

  describe('loadDiveSite action', () => {
    beforeEach(() => {
      mockDataStore.getDiveSite = jest.fn().mockResolvedValue(mockDiveSites[0]);
    });

    it('should load diveSite and update state correctly', async () => {
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
      // Invoke the action
      await useTestStore.getState().actions.loadDiveSite(mockDiveSites[0].data.properties.id);

      expect(mockDataStore.getDiveSite).toHaveBeenCalledTimes(1);
      expect(mockDataStore.getDiveSite).toHaveBeenCalledWith(mockDiveSites[0].data.properties.id); // Verify no parameters
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

    beforeEach(() => {
      mockDataStore.getDiveSites = jest.fn().mockResolvedValue(expectedArray);
      mockDataStore.getDiveSite = jest.fn().mockResolvedValue(expectedSite);
      mockDataStore.saveDiveSite = jest.fn().mockResolvedValue(expectedSite.data.properties.id);
    });

    it('should save a new dive site and update state', async () => {
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
      // Invoke the action
      await useTestStore.getState().actions.addDiveSite(newSite);

      expect(mockDataStore.saveDiveSite).toHaveBeenCalledTimes(1);
      expect(mockDataStore.saveDiveSite).toHaveBeenCalledWith(newSite);

      expect(mockDataStore.getDiveSites).toHaveBeenCalledTimes(1);
      expect(mockDataStore.getDiveSites).toHaveBeenCalledWith(); // Verify no parameters

      expect(mockDataStore.getDiveSite).toHaveBeenCalledTimes(1);
      expect(mockDataStore.getDiveSite).toHaveBeenCalledWith(expectedSite.data.properties.id);
    });
  });

  describe('updateDiveSite action', () => {
    let expectedSite: DiveSite;
    let expectedArray: DiveSite[];

    beforeAll(() => {
      // Declare all mocks required only for the current test suite
      const [first, ...rest] = mockDiveSites;
      expectedSite = {
        ...first,
        data: {
          ...first.data,
          properties: {
            ...first.data.properties,
            name: "TEST_DIVE_SITE_UPSERT"
          }
        }
      };
      expectedArray = [expectedSite, ...rest];
    }),

    beforeEach(() => {
      mockDataStore.getDiveSites = jest.fn().mockResolvedValue(expectedArray);
      mockDataStore.getDiveSite = jest.fn().mockResolvedValue(expectedSite);
      mockDataStore.saveDiveSite = jest.fn().mockResolvedValue(expectedSite.data.properties.id);
    });

    it('should update an existing dive site and update state', async () => {
      // Get and verify the initial state
      const state = useTestStore.getState();
      expect(state.diveSites).toEqual([]);
      expect(state.diveSite).toEqual(null);
      expect(state.isLoading).toBe(false);
      
      // Invoke the action
      await useTestStore.getState().actions.updateDiveSite(expectedSite);

      // Get and verify the state after loading
      const newstate = useTestStore.getState();
      expect(newstate.diveSites).toEqual(expectedArray);
      expect(newstate.diveSite).toEqual(expectedSite);
      expect(newstate.isLoading).toBe(false);
    });

    it('should call dataStore.saveDiveSite, dataStore.getDiveSites, dataStore.getDiveSite with the expected parameters', async () => {
      await useTestStore.getState().actions.updateDiveSite(expectedSite);

      expect(mockDataStore.saveDiveSite).toHaveBeenCalledTimes(1);
      expect(mockDataStore.saveDiveSite).toHaveBeenCalledWith(expectedSite);

      expect(mockDataStore.getDiveSites).toHaveBeenCalledTimes(1);
      expect(mockDataStore.getDiveSites).toHaveBeenCalledWith(); // Verify no parameters

      expect(mockDataStore.getDiveSite).toHaveBeenCalledTimes(1);
      expect(mockDataStore.getDiveSite).toHaveBeenCalledWith(expectedSite.data.properties.id);
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

    beforeEach(() => {
      mockDataStore.deleteDiveSite = jest.fn().mockResolvedValue(undefined);
      mockDataStore.getDiveSites = jest.fn().mockResolvedValue(expectedArray);
    });

    it('should delete a dive site and update state', async () => {
      // Get and verify the initial state
      const state = useTestStore.getState();
      expect(state.diveSites).toEqual([]);
      expect(state.diveSite).toEqual(null);
      expect(state.isLoading).toBe(false);

      // Invoke the action
      await useTestStore.getState().actions.removeDiveSite(siteToDelete.data.properties.id);

      // Get and verify the state after loading
      const newState = useTestStore.getState();
      expect(newState.diveSites).toEqual(expectedArray);
      expect(newState.diveSite).toEqual(null);
      expect(newState.isLoading).toBe(false);
    });

    it('should call dataStore.deleteDiveSite, dataStore.getDiveSites with the expected parameters', async () => {
      // Invoke the action
      await useTestStore.getState().actions.removeDiveSite(siteToDelete.data.properties.id);

      expect(mockDataStore.deleteDiveSite).toHaveBeenCalledTimes(1);
      expect(mockDataStore.deleteDiveSite).toHaveBeenCalledWith(siteToDelete.data.properties.id);

      expect(mockDataStore.getDiveSites).toHaveBeenCalledTimes(1);
      expect(mockDataStore.getDiveSites).toHaveBeenCalledWith(); // Verify no parameters
    });
  });
});
