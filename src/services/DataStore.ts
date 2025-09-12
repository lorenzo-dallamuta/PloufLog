export interface IDataStore {
  getDiveSites(): Promise<DiveSite[]>;
  getDiveSite(id: string): Promise<DiveSite | null>;
}