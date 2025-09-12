import { IDataStore } from '@/src/services/DataStore';

export class AsyncStorageDataStore implements IDataStore {
  async getDiveSites(): Promise<DiveSite[]> {
    return [];
  }
}