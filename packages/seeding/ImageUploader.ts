import * as admin from 'firebase-admin';
import * as fs from 'fs-extra';
import axios from 'axios';
import * as mime from 'mime-types';
import * as path from 'path';

export interface UploadResult {
  success: boolean;
  storagePath: string;
  url?: string;
  error?: string;
}

export class ImageUploader {
  private bucket: any; // Using any because of admin.storage.Bucket type complexity in some environments

  constructor(bucket: any) {
    this.bucket = bucket;
  }

  /**
   * Uploads an image to Firebase Storage from a local file or remote URL.
   * @param source Path to local file or a URL
   * @param destinationPath The path in the storage bucket (e.g. "wildlife/44/main.jpg")
   */
  async upload(source: string, destinationPath: string): Promise<UploadResult> {
    try {
      const file = this.bucket.file(destinationPath);
      const contentType = mime.lookup(destinationPath) || 'application/octet-stream';

      if (source.startsWith('http')) {
        // Remote URL
        const response = await axios({
          method: 'GET',
          url: source,
          responseType: 'stream'
        });

        const stream = file.createWriteStream({
          metadata: { contentType }
        });

        await new Promise((resolve, reject) => {
          response.data.pipe(stream)
            .on('finish', resolve)
            .on('error', reject);
        });
      } else {
        // Local File
        if (!(await fs.pathExists(source))) {
          return { success: false, storagePath: destinationPath, error: `Local file not found: ${source}` };
        }

        await this.bucket.upload(source, {
          destination: destinationPath,
          metadata: { contentType }
        });
      }

      // For the emulator, we can't easily get a "Signed URL" without a private key,
      // and public URLs aren't automatically generated like in production.
      // But we can construct the emulator URL manually if needed.
      // For now, we just return success.
      return { success: true, storagePath: destinationPath };
    } catch (error: any) {
      console.error(`Upload failed for ${destinationPath}:`, error.message);
      return { success: false, storagePath: destinationPath, error: error.message };
    }
  }
}
