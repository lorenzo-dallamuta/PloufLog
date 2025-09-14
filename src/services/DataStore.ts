export interface IDataStore {
  getDiveSites(): Promise<DiveSite[]>;
  getDiveSite(id: string): Promise<DiveSite | null>;
  saveDiveSite(site: DiveSite): Promise<string | null>;
}

// This is necessary for the AsyncStorage implementation.
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}