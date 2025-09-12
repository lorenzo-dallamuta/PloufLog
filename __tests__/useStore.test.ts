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

describe('useDiveSiteStore', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Add a reset action to your store if needed
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
});
