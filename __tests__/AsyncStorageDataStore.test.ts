import { AsyncStorageDataStore } from '@/src/services/AsyncStorageDataStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SPOTS_STORAGE_KEY } from '@/constants/Store';

import redSeaMock from "@/mocks/diveSites/redSea"

const mockDiveSite: DiveSite = redSeaMock.result.elements[0];

describe('AsyncStorageDataStore', () => {
  let dataStore: AsyncStorageDataStore;

  beforeEach(() => {
    dataStore = new AsyncStorageDataStore();
    jest.clearAllMocks();
  });

  describe('getDiveSites', () => {
    it('returns empty array when no data', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const diveSites = await dataStore.getDiveSites();
      expect(diveSites).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(SPOTS_STORAGE_KEY);
    });

    it('returns parsed diveSites when data exists', async () => {
      const mockDiveSites: DiveSite[] = [mockDiveSite];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockDiveSites));
      const diveSites = await dataStore.getDiveSites();
      expect(diveSites).toEqual(mockDiveSites);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(SPOTS_STORAGE_KEY);
    });
  });
});