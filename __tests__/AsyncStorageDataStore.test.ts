import { create } from 'mutative';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageDataStore } from '@/src/services/AsyncStorageDataStore';
import { generateId } from '@/src/services/DataStore';
import { getRandomArrayElements } from '@/src/utils/getRandomArrayElements';

import { SPOTS_STORAGE_KEY } from '@/constants/Store';

import redSeaMock from "@/mocks/diveSites/redSea"

const mockDiveSites: DiveSite[] = getRandomArrayElements(redSeaMock.result.elements, 100);
const mockDiveSite: DiveSite = redSeaMock.result.elements[0];
const mockDiveSiteWIthNullId: DiveSiteWithNullId = {
  ...mockDiveSite,
  data: {
    ...mockDiveSite.data,
    properties: {
      ...mockDiveSite.data.properties,
      id: null
    }
  }
};

// Mock ID generator utility used in saveDiveSite for better test consistency
// Pls, feel free to switch to dependency injection, I'm fine with encapsulation
jest.mock('@/src/services/DataStore', () => ({
  generateId: () => 'mock-generated-id-123'
}));

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

  describe('saveDiveSite', () => {
    it('creates new diveSite when no match exists', async () => {
      const newId = await dataStore.saveDiveSite(mockDiveSiteWIthNullId); // the id property will be a new string value
      expect(typeof newId).toBe('string');

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);

      const setItemCalls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const [key, value] = setItemCalls[0];
      expect(key).toBe(SPOTS_STORAGE_KEY);

      const savedData = JSON.parse(value);

      expect(savedData).toContainEqual(
        expect.objectContaining({
          ...mockDiveSiteWIthNullId,
          data: {
            ...mockDiveSiteWIthNullId.data,
            properties: expect.objectContaining({
              ...mockDiveSiteWIthNullId.data.properties,
              id: newId // Verify the inserted ID is the one that was returned
            })
          }
        })
      );
    });

    it('updates existing diveSite when match exists', async () => {
      const newName = 'TEST_DIVE_SITE_NAME';
      const newDiveSite = create(mockDiveSite, draft => {
        draft.data.properties.name = newName;
      });
      const id = await dataStore.saveDiveSite(newDiveSite);
      expect(typeof id).toBe('string');

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);

      const setItemCalls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const [key, value] = setItemCalls[0];
      expect(key).toBe(SPOTS_STORAGE_KEY);

      const savedData = JSON.parse(value);

      expect(savedData).toContainEqual(
        expect.objectContaining({
          ...newDiveSite,
          data: {
            ...newDiveSite.data,
            properties: expect.objectContaining({
              ...newDiveSite.data.properties,
              name: newName
            })
          }
        })
      );
    });

    it('should throw an error when saving a dive site with ID not in storage', async () => {
      const diveSiteWithNonExistentId: DiveSite = {
        ...mockDiveSite,
        data: {
          ...mockDiveSite.data,
          properties: {
            ...mockDiveSite.data.properties,
            id: 'non-existent-id', // This ID won't be found
          }
        }
      };

      // Verify that an error with the correct message is thrown
      await expect(dataStore.saveDiveSite(diveSiteWithNonExistentId))
        .rejects
        .toThrow('The provided dive site ID does not exist, provide either an existing ID or the value \'null\'');

      // Verify that setItem was never called (no data was saved)
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('deleteDiveSite', () => {
    it('deletes a diveSite when amatch exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockDiveSites));

      const diveSiteToDelete = getRandomArrayElements(mockDiveSites, 1)[0];

      await dataStore.deleteDiveSite(diveSiteToDelete.data.properties.id);

      const setItemCalls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const [key, value] = setItemCalls[0];
      const savedData = JSON.parse(value);

      expect(key).toBe(SPOTS_STORAGE_KEY);
      expect(savedData).toContainEqual(
        expect.not.objectContaining({
          ...diveSiteToDelete,
        })
      );
    });

    it('throws an error when a match does not exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockDiveSites));

      const diveSiteToDeleteIdx = generateId();

      // Verify that an error with the correct message is thrown
      await expect(dataStore.deleteDiveSite(diveSiteToDeleteIdx))
        .rejects
        .toThrow('The provided dive site ID does not exist, provide an existing ID');

      // Verify that setItem was never called (no data was saved)
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });
});