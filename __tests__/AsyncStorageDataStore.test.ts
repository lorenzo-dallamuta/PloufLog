import { create } from 'mutative';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageDataStore } from '@/src/services/AsyncStorageDataStore';

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

  describe('getDiveSite', () => {
    it('returns null when no data', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const diveSite = await dataStore.getDiveSite('123456');
      expect(diveSite).toEqual(null);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(SPOTS_STORAGE_KEY);
    });

    it('returns null when no match', async () => {
      const modifiedDiveSite: DiveSite = create(mockDiveSite, draft => {
        draft.data.properties.id = '123456';
      });
      const mockDiveSites: DiveSite[] = [modifiedDiveSite];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockDiveSites));
      const diveSite = await dataStore.getDiveSite('654321');
      expect(diveSite).toEqual(null);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(SPOTS_STORAGE_KEY);
    });

    it('returns parsed diveSite when match exists', async () => {
      const mockDiveSites: DiveSite[] = [mockDiveSite];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockDiveSites));
      const diveSite = await dataStore.getDiveSite(mockDiveSite.data.properties.id);
      expect(diveSite).toEqual(mockDiveSite);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(SPOTS_STORAGE_KEY);
    });
  });
});