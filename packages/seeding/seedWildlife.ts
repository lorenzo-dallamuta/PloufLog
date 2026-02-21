import * as admin from 'firebase-admin';
import * as fs from 'fs-extra';
import * as path from 'path';
import { BatchSeeder } from './BatchSeeder';

// --- CONFIGURATION ---
const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, '../../firebase-key.json');
const DEFAULT_DATA_PATH = '/home/maja/scraping/scubago/scubago_data/wildlife_final.json';
const DATA_PATH = process.env.SEED_DATA_PATH || DEFAULT_DATA_PATH;
const COLLECTION_NAME = 'wildlife';

// --- INITIALIZATION ---
const isEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;

if (isEmulator) {
  console.log('Detected FIRESTORE_EMULATOR_HOST. Connecting to Emulator...');
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT || 'demo-plouflog-dev', // Ensure it matches the emulator's project ID
  });
} else {
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`Error: Service account key not found at ${SERVICE_ACCOUNT_PATH}`);
    process.exit(1);
  }

  // Check if file is empty
  const keyContent = fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8');
  if (keyContent.trim() === '{}' || keyContent.trim() === '') {
    console.error(`Error: Service account key at ${SERVICE_ACCOUNT_PATH} is empty.`);
    console.error('Please populate it with a valid key or run with FIRESTORE_EMULATOR_HOST set.');
    process.exit(1);
  }

  const serviceAccount = require(SERVICE_ACCOUNT_PATH);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// --- MAIN ---
async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Error: Data file not found at ${DATA_PATH}`);
    console.error('Have you run the transformation script? (scubago/src/transform_wildlife.ts)');
    process.exit(1);
  }

  console.log(`Reading data from ${DATA_PATH}...`);
  const rawData = await fs.readJSON(DATA_PATH);
  
  // Validation: Ensure data is an array
  if (!Array.isArray(rawData)) {
    console.error('Error: Data file must contain an array of objects.');
    process.exit(1);
  }

  const seeder = new BatchSeeder(db, { collectionName: COLLECTION_NAME });

  // Execute Seeding
  // We use the 'id' field from our data as the Firestore Document ID
  await seeder.seed(rawData, (item: any) => item.id);
  
  console.log('Done.');
}

main().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
