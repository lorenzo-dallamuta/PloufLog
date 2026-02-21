import * as admin from 'firebase-admin';
import * as fs from 'fs-extra';
import * as path from 'path';
import pLimit from 'p-limit';
import { ImageUploader } from './ImageUploader';

// --- CONFIGURATION ---
const FIREBASE_PROJECT = process.env.FIREBASE_PROJECT || 'demo-plouflog-dev';
const DATA_PATH = process.env.SEED_DATA_PATH || '/app/data/wildlife_final.json';
const ASSETS_DIR = process.env.SEED_ASSETS_DIR || '/app/assets';
const CONCURRENCY_LIMIT = 10;

// --- INITIALIZATION ---
// Initialize Admin SDK
// If we are in the emulator, initialize without credentials
const isEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;

if (isEmulator) {
  console.log(`[Images] Connecting to Storage Emulator for project: ${FIREBASE_PROJECT}`);
  
  // The Admin SDK requires a credential to initialize Storage, even for the emulator.
  // We rely on GOOGLE_APPLICATION_CREDENTIALS pointing to a valid service account file.
  admin.initializeApp({
    projectId: FIREBASE_PROJECT,
    storageBucket: `${FIREBASE_PROJECT}.appspot.com`,
  });
} else {
  const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, '../../firebase-key.json');
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`Error: Service account key not found at ${SERVICE_ACCOUNT_PATH}`);
    process.exit(1);
  }
  const serviceAccount = require(SERVICE_ACCOUNT_PATH);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${FIREBASE_PROJECT}.appspot.com`
  });
}

const storage = admin.storage();
const bucket = storage.bucket();
const uploader = new ImageUploader(bucket);
const limit = pLimit(CONCURRENCY_LIMIT);

// --- MAIN ---
async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Error: Data file not found at ${DATA_PATH}`);
    process.exit(1);
  }

  console.log(`[Images] Reading wildlife data from ${DATA_PATH}...`);
  const items = await fs.readJSON(DATA_PATH);
  
  const uploadTasks: Promise<any>[] = [];
  let totalImages = 0;

  for (const item of items) {
    if (!item.images || !Array.isArray(item.images)) continue;

    for (const img of item.images) {
      if (!img.storage_path) continue;

      totalImages++;
      
      // Determine Source Priority: 
      // 1. Mounted local asset
      // 2. Original URL
      const localPath = path.join(ASSETS_DIR, img.storage_path);
      const source = (await fs.pathExists(localPath)) ? localPath : img.url;

      if (!source) {
        console.warn(`[Images] Skipping image for ${item.name} - No source found.`);
        continue;
      }

      uploadTasks.push(limit(async () => {
        const result = await uploader.upload(source, img.storage_path);
        if (result.success) {
          process.stdout.write('.');
        } else {
          console.error(`\n[Images] FAILED: ${img.storage_path} (${result.error})`);
        }
      }));
    }
  }

  console.log(`[Images] Starting upload of ${totalImages} images...`);
  
  await Promise.all(uploadTasks);
  
  console.log(`\n[Images] Image seeding complete.`);
}

main().catch(error => {
  console.error('[Images] Seeding failed:', error);
  process.exit(1);
});
