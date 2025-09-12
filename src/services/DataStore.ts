export interface IDataStore {
  getDiveSites(): Promise<DiveSite[]>;
}