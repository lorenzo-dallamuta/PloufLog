import AsyncStorage from '@react-native-async-storage/async-storage';
import { IDataStore, generateId } from '@/src/services/DataStore';
import { SPOTS_STORAGE_KEY } from '@/constants/Store';
import { create } from 'mutative';

export class AsyncStorageDataStore implements IDataStore {
  async getDiveSites(): Promise<DiveSite[]> {
    const jsonValue = await AsyncStorage.getItem(SPOTS_STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  }

  async getDiveSite(id: string): Promise<DiveSite | null> {
    const diveSites = await this.getDiveSites();
    return diveSites.find(diveSite => diveSite.data.properties.id === id) || null;
  }

  async saveDiveSite(diveSite: DiveSite | DiveSiteWithNullId): Promise<string | null> {
    return null;
  }
}