# PloufLog Architecture

## Overview
PloufLog is structured as a pnpm monorepo, fully containerized using Docker Compose for local development. This ensures a consistent environment across different machines, managing everything from the React Native mobile app to Firebase emulators and database seeding.

## Project Structure (Monorepo)
- `apps/mobile`: The React Native application (Expo). Runs as a restricted `node` user in Docker to ensure strict dependency isolation.
- `apps/functions`: Firebase Cloud Functions.
- `packages/seeding`: Data injection tools for populating the Firestore database (using the privileged `firebase-admin` SDK).
- `packages/health-check`: An internal utility to monitor the status of the Firebase Emulators during container startup.

*(Note: The `scraping/` directory exists alongside this repo as a separate staging area for gathering and parsing external HTML/Markdown).*

## Data Model & Entities

**Note: PloufLog uses an "Open Schema" approach.** 
Because Firestore is a NoSQL document database, our schema is designed to be flexible and evolve over time. While we enforce structure using TypeScript interfaces (e.g., `data-models.ts`) and document our relational intent visually via `schema.dbml`, the architecture embraces the fact that documents may gain new fields or subcollections dynamically as features are added. 

**Always treat `schema.dbml` as the living visual source of truth.**

### Core Entities
1.  **Wildlife (`wildlife` collection):**
    -   **Purpose:** The central catalog of marine life. Designed with a "Wildlife First" independence approach, meaning it does not rely on Dive Sites being populated first.
    -   **Structure:** Instead of a flat description string, it uses a flexible `content` array (Accordion-style blocks like "Overview", "Habitat", "Danger"). This allows the UI to render rich, segmented content dynamically.
    -   **Source Tracking:** Documents track their origin (`source: 'scubago'`, `'manual'`, etc.). External IDs (like Scubago's "44") or Slugs ("staghorn-coral") are used directly as the Firestore Document ID to prevent duplicates and complex link tables.

2.  **Locations (`locations` collection):**
    -   **Purpose:** Represents a broader geographical area (e.g., "Koh Tao", "Nosy Be", "Red Sea"). *Note: A "Location" is distinctly different from a "Dive Site".*
    -   **Structure:** A single Location acts as an umbrella entity that may have several dozen specific Dive Sites associated with it. It will include a brief explainer/description of what kind of place it is (provided via manual data entry). The precise schema for this will be figured out at data entry time following the open schema philosophy.

*(Future entities like Dive Sites, Logs, and Users will follow this open schema pattern as they are integrated, avoiding rigid relational constraints where possible).*

## Data Pipeline Architecture (Seeding)

The goal is to populate the PloufLog Firestore database with high-quality data while maintaining a clean separation between "Raw Data Extraction" and "Database Injection".

### 1. Extraction Layer (Scraper)
**Location:** External `scraping/scubago/`
- **Purpose:** Crawl external sources and save raw content (HTML, Markdown) to the local filesystem. The local filesystem acts as an isolated staging area to inspect data before it ever touches a database.

### 2. Transformation Layer (Transformer)
**Location:** External `scraping/scubago/src/transform_wildlife.ts`
- **Purpose:** Convert raw files into the strict JSON structure defined by our "Open Schema".
- **Output:** The "Golden Master" dataset (e.g., `wildlife_final.json`).

### 3. Injection Layer (Seeder)
**Location:** `packages/seeding/`
- **Purpose:** Push the "Golden Master" data into Firestore reliably.
- **Mechanism:** Uses a `BatchSeeder` controller to chunk data into Firestore's 500-item batch limits.
- **Execution:** Runs via Docker (`docker compose run --rm seeding`). Uses `firebase-admin` to bypass security rules and safely `merge` data idempotently (can be run multiple times safely).

## Docker Orchestration & Emulators
The local development environment is orchestrated via `docker-compose.yml`:
- **`rn-app`**: Runs the Expo Metro bundler.
- **`firebase-emulators`**: Runs local instances of Firestore, Auth, and Functions. 
    - **Persistence:** Configured to automatically export data on exit and import on startup (via a Docker volume workaround to avoid `EBUSY` locks). This ensures any manual data entry done via the Emulator UI (`localhost:4000`) is safely retained across reboots.
- **`seeding`**: A transient utility container used strictly for executing the injection scripts against the running emulators.
