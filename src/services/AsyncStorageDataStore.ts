import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'mutative';

import { IDataStore, generateId } from '@/src/services/DataStore';

import { SPOTS_STORAGE_KEY } from '@/constants/Store';
import { IsDiveSiteWithNullId } from '@/src/types/assertions';

export class AsyncStorageDataStore implements IDataStore {
  async getDiveSites(): Promise<DiveSite[]> {
    const jsonValue = await AsyncStorage.getItem(SPOTS_STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  }

  async getDiveSite(id: string): Promise<DiveSite | null> {
    const diveSites = await this.getDiveSites();
    return diveSites.find(diveSite => diveSite.data.properties.id === id) || null;
  }

  async saveDiveSite(diveSite: DiveSite | DiveSiteWithNullId): Promise<string> {
    const diveSites = await this.getDiveSites();

    let id: string;
    // If the diveSite exists we need to update it.
    if (!IsDiveSiteWithNullId(diveSite)) {
      const index = diveSites.findIndex(d => d.data.properties.id === diveSite.data.properties.id);
      if (index > -1) {
        id = diveSite.data.properties.id;
        diveSites[index] = diveSite;
      } else {
        throw new Error('The provided dive site ID does not exist, provide either an existing ID or the value \'null\'');
      }
    } else {
      id = generateId();
      const newDiveSite = create(
        diveSite,
        (draft) => {
          (draft as unknown as DiveSite).data.properties.id = id;
        }
      ) as unknown as DiveSite;
      diveSites.push(newDiveSite);
    }
    
    await AsyncStorage.setItem(SPOTS_STORAGE_KEY, JSON.stringify(diveSites));

    return id;
  }

  async deleteDiveSite(id: string): Promise<void> {
    const diveSites = await this.getDiveSites();
    // Filter out the diveSite with the matching id
    const diveSiteToDeleteIdx = diveSites.findIndex(diveSite => diveSite.data.properties.id === id)
    if (diveSiteToDeleteIdx === -1) throw new Error('The provided dive site ID does not exist, provide an existing ID');
    const filteredDiveSites = diveSites.toSpliced(diveSiteToDeleteIdx, 1);
    const jsonValue = JSON.stringify(filteredDiveSites);
    await AsyncStorage.setItem(SPOTS_STORAGE_KEY, jsonValue);
  }
}