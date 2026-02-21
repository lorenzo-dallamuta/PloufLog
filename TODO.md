# PloufLog Technical Debt & TODOs

This file tracks technical debt, temporary workarounds, and pending architectural improvements across the monorepo.

## Firebase & Backend

- [ ] **Firestore Security Rules**: Currently, `firestore.rules` is configured as `allow read, write: if true;` for development purposes. This **must** be replaced with proper role-based or user-based security rules before any production deployment.
- [ ] **Cloud Functions Placeholder**: The `helloWorld` function in `apps/functions/src/index.ts` is a placeholder. It should be deleted as soon as the first real Cloud Function is implemented.

## Data Pipeline

- [ ] **Image Optimization**: The current scraped images are stored in their raw (lossy) format. We need to implement an optimization pipeline (using `sharp`) to resize and convert them to modern formats (WebP/AVIF). **Important:** The original downloaded assets must be preserved untouched; optimizations should be generated as separate artifacts.
