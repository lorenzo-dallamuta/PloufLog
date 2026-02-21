# PloufLog Development Environment

This project is set up as a monorepo with a containerized development environment including React Native (Expo) and Firebase Emulators.

## Prerequisites

- Docker & Docker Compose
- Node.js (for local helper scripts, optional)
- pnpm (recommended for local management)

## Getting Started

1.  **Start the environment:**
    ```bash
    docker compose up
    ```
    This will start:
    - **Firebase Emulators** (Firestore, Auth, Functions)
    - **React Native Bundler** (Metro)

2.  **Access Services:**
    - **Firebase Emulator UI:** [http://localhost:4000](http://localhost:4000)
    - **Firestore:** [http://localhost:8080](http://localhost:8080)
    - **Metro Bundler:** [http://localhost:8081](http://localhost:8081)

3.  **Run the App:**
    - **Android:** Press `a` in the terminal where `docker compose` is running (if interactive) or connect your Android Emulator/Device to the Metro bundler.
    - **iOS:** Press `i` (requires macOS).
    - **Web:** Press `w`.

## Project Structure (Monorepo)

- `apps/`
  - `mobile/`: React Native application code (formerly `rn-app`).
  - `functions/`: Firebase Cloud Functions.
- `packages/`
  - `seeding/`: Database seeding scripts.
  - `health-check/`: Emulator health check service.
- `firebase.json`: Emulator configuration.
- `docker/`: Dockerfiles for services.

## Seeding Data (Wildlife)

To seed the local Firestore emulator with the transformed wildlife data:

```bash
# Ensure the emulators are running (docker compose up)
docker compose run --rm seeding
```

This will:
1.  Spin up a temporary container.
2.  Connect to the running Emulator service.
3.  Inject the data from `packages/seeding/data/wildlife_final.json` (ensure you've run the transformation script first!).

## Firebase Configuration

The app is configured to connect to local emulators automatically in development mode.
Configuration is located at `apps/mobile/src/config/firebase.ts`.

It attempts to detect the correct host IP:
- **Physical Device:** Uses your computer's local IP (detected via Expo).
- **Simulator/Emulator:** Uses `localhost` or `10.0.2.2`.

## Troubleshooting

- **Ports already in use:** Ensure no other Firebase emulators or Metro bundlers are running.
- **Connection Refused:** Check if your device is on the same network as your computer (for physical devices).

## Common Warnings (Dumdum Explainer)

### ⚠ "You are not currently authenticated..."
- **What it means:** The "computer" inside Docker doesn't have your Google login details.
- **Why it's okay:** We are running a **fake** database (Emulator) on your own machine. We aren't talking to the real Google Cloud, so we don't need real passwords.
- **Action:** **Ignore it.** It is perfectly normal for this offline/local setup.
