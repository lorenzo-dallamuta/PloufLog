
// TODO: Consider Dependency Injection for DataStore
// Why: Currently tightly coupled to AsyncStorage. DI would allow easier testing (mock implementations) and future migration to SQLite/expo-sqlite.
// Example Usage:
// typescript
// // App setup
// const dataStore = new AsyncStorageDataStore();
// useDiveSiteStore.setState({ dataStore });
// // Test setup
// const mockDataStore: IDataStore = { ... };
// useDiveSiteStore.setState({ dataStore: mockDataStore });
// Testing Benefit:
// // Avoids complex AsyncStorage mocking and coupling between tests and implementation
// jest.mock('@/src/services/DataStore');
// const mockDataStore = { saveDiveSite: jest.fn() };
// Impact: Reduces mocking complexity, enhances test clarity, and future-proofs storage layer changes.

export interface IDataStore {
  getDiveSites(): Promise<DiveSite[]>;
  getDiveSite(id: string): Promise<DiveSite | null>;
  saveDiveSite(site: DiveSite | DiveSiteWithNullId): Promise<string>;
  deleteDiveSite(id: string): Promise<void>;
}

export interface StoreDependencies {
  dataStore: IDataStore;
}

// This is necessary for the AsyncStorage implementation.
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}