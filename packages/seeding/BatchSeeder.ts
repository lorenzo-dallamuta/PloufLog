import * as admin from 'firebase-admin';

export interface BatchSeederOptions {
  collectionName: string;
  batchSize?: number; // Defaults to 500 (Firestore max)
}

export class BatchSeeder<T> {
  private db: admin.firestore.Firestore;
  private collectionName: string;
  private batchSize: number;

  constructor(db: admin.firestore.Firestore, options: BatchSeederOptions) {
    this.db = db;
    this.collectionName = options.collectionName;
    this.batchSize = options.batchSize || 500;
  }

  /**
   * Seeds data into Firestore using batched writes.
   * @param data Array of objects to insert.
   * @param getId Function to extract/generate the Document ID for each item.
   */
  async seed(data: T[], getId: (item: T) => string): Promise<void> {
    if (data.length === 0) {
      console.log(`[${this.collectionName}] No data to seed.`);
      return;
    }

    console.log(`[${this.collectionName}] Starting seed of ${data.length} items...`);

    const chunks = this.chunkArray(data, this.batchSize);
    let processedCount = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const batch = this.db.batch();

      chunk.forEach((item) => {
        const id = getId(item);
        const docRef = this.db.collection(this.collectionName).doc(id);
        
        // Use merge: true to update existing docs without overwriting unrelated fields
        // Or strictly set() if we want to enforce schema. 
        // For seeding, set({ ...item }, { merge: true }) is usually safest for idempotency.
        batch.set(docRef, item as admin.firestore.DocumentData, { merge: true });
      });

      try {
        await batch.commit();
        processedCount += chunk.length;
        console.log(`[${this.collectionName}] Batch ${i + 1}/${chunks.length} committed (${processedCount}/${data.length})`);
      } catch (error) {
        console.error(`[${this.collectionName}] Batch ${i + 1} FAILED:`, error);
        throw error; // Stop seeding on error
      }
    }

    console.log(`[${this.collectionName}] Seeding complete.`);
  }

  private chunkArray(array: T[], size: number): T[][] {
    const results = [];
    for (let i = 0; i < array.length; i += size) {
      results.push(array.slice(i, i + size));
    }
    return results;
  }
}
