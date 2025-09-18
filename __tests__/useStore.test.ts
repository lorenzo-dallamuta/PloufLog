import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDiveSiteStore } from "@/src/store/useDiveSiteStore";
import { getRandomArrayElements } from "@/src/utils/getRandomArrayElements";

import { SPOTS_STORAGE_KEY } from '@/constants/Store';

import redSeaMock from "@/mocks/diveSites/redSea"

// Define mock data for testing, with sub-sampling for speed
// ( if you're trying snapshot testing and they fail, this is why )
const mockDiveSites: DiveSite[] = getRandomArrayElements(redSeaMock.result.elements, 100);

// Get the typed mocked instance
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

// Mock ID generator utility used in saveDiveSite for better test consistency
// Pls, feel free to switch to dependency injection, I'm fine with encapsulation
jest.mock('@/src/services/DataStore', () => ({
  generateId: () => 'mock-generated-id-123'
}));

describe('useDiveSiteStore', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear react-native-async-storage mock before each test
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
    // Add a reset action to your store
    useDiveSiteStore.getState().actions.removeAllDiveSites();
  });

  describe('loadDiveSites action', () => {
    it('should load diveSites and update state correctly', async () => {
      // Mock AsyncStorage.getItem to resolve with mockDiveSites
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockDiveSites));

      // Get and verify the initial state
      const state = useDiveSiteStore.getState();
      expect(state.diveSites).toEqual([]);
      expect(state.isLoading).toBe(false);

      await state.actions.loadDiveSites();

      // Verify AsyncStorage was called correctly
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(SPOTS_STORAGE_KEY);
      
      // Get and verify the state after loading
      const newState = useDiveSiteStore.getState();
      expect(newState.isLoading).toBe(false);
      expect(newState.diveSites).toEqual(mockDiveSites);
    });
  });

  describe('loadDiveSites action', () => {
    it('should load diveSite and update state correctly', async () => {
      // Mock AsyncStorage.getItem to resolve with mockDiveSites
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockDiveSites));

      // Get and verify the initial state
      const state = useDiveSiteStore.getState();
      expect(state.diveSite).toEqual(null);
      expect(state.isLoading).toBe(false);

      await state.actions.loadDiveSite(mockDiveSites[0].data.properties.id);

      // Verify AsyncStorage was called correctly
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(SPOTS_STORAGE_KEY);
      
      // Get and verify the state after loading
      const newState = useDiveSiteStore.getState();
      expect(newState.isLoading).toBe(false);
      expect(newState.diveSite).toEqual(mockDiveSites[0]);
    });
  });

  describe('addDiveSite action', () => {
    it('should save a new dive site and update state', async () => {
      // Declare all mocks required only for the current test
      const newSite = {
        ...mockDiveSites[0],
        data: {
          ...mockDiveSites[0].data,
          properties: {
            ...mockDiveSites[0].data.properties,
            id: null
          }
        }
      };
      const expectedSite = {
        ...newSite,
        data: {
          ...newSite.data,
          properties: {
            ...newSite.data.properties,
            id: 'mock-generated-id-123'
          }
        }
      };
      const expectedArray = [expectedSite];

      // Sequence getItem mocks for the three calls in addDiveSite
      mockedAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify([])) // First call in saveDiveSite
        .mockResolvedValueOnce(JSON.stringify(expectedArray)) // Second call in getDiveSites
        .mockResolvedValueOnce(JSON.stringify(expectedArray)); // Third call in getDiveSite

      // Invoke the action
      await useDiveSiteStore.getState().actions.addDiveSite(newSite);

      // Verify setItem was called with the expected data
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        SPOTS_STORAGE_KEY,
        JSON.stringify(expectedArray)
      );

      // Verify Zustand state was updated correctly (depends on the sequential mocks above)
      const state = useDiveSiteStore.getState();
      expect(state.diveSites).toEqual(expectedArray);
      expect(state.diveSite).toEqual(expectedSite);
      expect(state.isLoading).toBe(false);
    });
  });
});
