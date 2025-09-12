import AsyncStorage from '@react-native-async-storage/async-storage';
// import { IDataStore, generateId } from '@/src/services/DataStore';
import { IDataStore } from '@/src/services/DataStore';
import { SPOTS_STORAGE_KEY } from '@/constants/Store';

export class AsyncStorageDataStore implements IDataStore {
  async getDiveSites(): Promise<DiveSite[]> {
    const jsonValue = await AsyncStorage.getItem(SPOTS_STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  }

  async getDiveSite(id: string): Promise<DiveSite | null> {
    const diveSites = await this.getDiveSites();
    return diveSites.find(diveSite => diveSite.data.properties.id === id) || null;
  }
}