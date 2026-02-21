
# aurastay - Firebase Cloud Functions

This repository contains the Firebase Cloud Functions backend for `aurastay`. It is managed as a Git submodule within the main `aurastay` monorepo.

## 🌟 Overview

These Cloud Functions provide server-side logic and API endpoints that are callable from the frontend application or triggered by Firebase events.

## 🚀 Technologies

*   **Runtime:** Node.js (version 22)
*   **Language:** TypeScript
*   **Firebase SDKs:** `firebase-functions`, `firebase-admin`

## 💻 Local Development

For local development, these Cloud Functions run within the Firebase Emulator Suite, which is orchestrated by the main `aurastay` project's `docker-compose.yml`.

### Key Aspects

*   **Containerized:** The functions are built and run within a Docker container specifically for the Firebase Emulators.
*   **Emulator Integration:** The functions automatically load into the Firebase Functions Emulator, responding to calls from the Next.js app or direct HTTP requests.
*   **`node_modules` & Build Management:** `node_modules` and the compiled `lib/` directory are handled by dedicated Docker named volumes (`functions_node_modules`, `functions_lib_cache`), ensuring a clean host environment.

### Useful `npm` Scripts

These scripts are typically executed by the Docker Compose `command` for local development or in your CI/CD pipeline. You can also run them manually if you `cd` into this directory within the `firebase-emulators` Docker container.

*   `npm run build`: Compiles TypeScript source (`src/index.ts`) into JavaScript (`lib/index.js`).
*   `npm run serve`: Starts the Firebase Emulators (handled by Docker Compose).
*   `npm run deploy`: Deploys your functions to a live Firebase project (used in CI/CD).
*   `npm run logs`: Streams logs from your deployed functions (useful for debugging live functions).

## 🤝 Git Management (Within the Monorepo)

Since this is a Git submodule, managing its versioning requires interaction with both this repository and the parent `aurastay` repository.

1.  **Navigate to this submodule:**
    ```bash
    cd <PATH_TO_AURASTAY_ROOT>/functions
    ```
2.  **Perform your Git operations:**
    ```bash
    git status
    git add .
    git commit -m "feat: add user authentication function"
    git push origin main # Pushes changes to the remote repository for these functions
    ```
3.  **Update the parent `aurastay` repository:**
    After pushing changes to this submodule's remote, you must update the parent repository to point to the new commit hash of this submodule.
    ```bash
    cd .. # Back to the aurastay root
    git add functions # Stage the submodule's updated pointer
    git commit -m "Update functions submodule to latest version"
    git push origin main # Push the parent repo's changes
    ```

## ⚙️ Configuration

*   **`package.json`:** Defines dependencies (like `firebase-functions`, `firebase-admin`) and npm scripts.
*   **`tsconfig.json`:** TypeScript compiler configuration.
*   **`index.ts` (in `src/`):** Contains the main Cloud Functions definitions.
*   **`firebase.json` & `.firebaserc` (at root of this repo, if deployed independently):**
    *   **Note:** In this monorepo context, the main `aurastay/firebase.json` and `.firebaserc` orchestrate the full deployment. If this functions repo were to be deployed *fully independently* (e.g., in Tier 2 client strategy), it would have its own `firebase.json` and `.firebaserc` here, defining only its functions configuration.
