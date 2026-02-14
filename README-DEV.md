# PloufLog Development Environment

This project is set up with a containerized development environment including React Native (Expo) and Firebase Emulators.

## Prerequisites

- Docker & Docker Compose
- Node.js (for local helper scripts, optional)

## getting Started

1.  **Start the environment:**
    ```bash
    docker compose up
    ```
    This will start:
    - **Firebase Emulators** (Firestore, Auth, Functions)
    - **React Native Bundler** (Metro)

2.  **Access Services:**
    - **Firebase Emulator UI:** [http://localhost:4000](http://localhost:4000)
      - Use this to manually add data to Firestore ("stick data in db").
    - **Firestore:** [http://localhost:8080](http://localhost:8080)
    - **Metro Bundler:** [http://localhost:8081](http://localhost:8081)

3.  **Run the App:**
    - **Android:** Press `a` in the terminal where `docker compose` is running (if interactive) or connect your Android Emulator/Device to the Metro bundler.
    - **iOS:** Press `i` (requires macOS).
    - **Web:** Press `w`.

## Project Structure

- `rn-app/`: React Native application code.
- `functions/`: Firebase Cloud Functions.
- `firebase.json`: Emulator configuration.
- `docker/`: Dockerfiles for services.

## Firebase Configuration

The app is configured to connect to local emulators automatically in development mode.
Configuration is located at `rn-app/src/config/firebase.ts`.

It attempts to detect the correct host IP:
- **Physical Device:** Uses your computer's local IP (detected via Expo).
- **Simulator/Emulator:** Uses `localhost` or `10.0.2.2`.

## Manual Data Entry

To manually add data from SSI API:
1.  Open [http://localhost:4000/firestore](http://localhost:4000/firestore).
2.  Create a `sites` collection.
3.  Add documents manually or import JSON if you have it formatted.

## Troubleshooting

- **Ports already in use:** Ensure no other Firebase emulators or Metro bundlers are running.
- **Connection Refused:** Check if your device is on the same network as your computer (for physical devices).

## Common Warnings (Dumdum Explainer)

### ⚠ "You are not currently authenticated..."
- **What it means:** The "computer" inside Docker doesn't have your Google login details.
- **Why it's okay:** We are running a **fake** database (Emulator) on your own machine. We aren't talking to the real Google Cloud, so we don't need real passwords.
- **Action:** **Ignore it.** It is perfectly normal for this offline/local setup.
- **Future Note:** If you later decide to connect to the real Firebase Cloud, you **will** need to update the app configuration (`firebase.ts`) to use real API keys and credentials instead of the current dummy ones.

