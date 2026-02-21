import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'unhealthy';
  message: string;
  latency?: number;
}

class HealthChecker {
  private isEmulatorMode: boolean;
  private results: HealthCheckResult[] = [];
  private projectId: string;

  constructor() {
    this.isEmulatorMode = !!process.env.FIRESTORE_EMULATOR_HOST;
    this.projectId = process.env.FIREBASE_PROJECT || 'default-project';
  }

  private async initializeAdmin(): Promise<void> {
    if (!this.isEmulatorMode && !admin.apps.length) {
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (credentialsPath) {
        admin.initializeApp({
          credential: admin.credential.cert(credentialsPath),
          projectId: this.projectId,
        });
      } else {
        admin.initializeApp({ projectId: this.projectId });
      }
    }
  }

  private async checkFirestore(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      if (this.isEmulatorMode) {
        // Check emulator endpoint
        const response = await fetch('http://localhost:8080/', {
          method: 'GET',
          timeout: 5000,
        });

        const latency = Date.now() - startTime;

        if (response.ok || response.status === 404) {
          // 404 is acceptable as it means Firestore is running but no document at root
          return {
            service: 'Firestore',
            status: 'healthy',
            message: 'Emulator is running',
            latency,
          };
        } else {
          return {
            service: 'Firestore',
            status: 'unhealthy',
            message: `Unexpected status: ${response.status}`,
            latency,
          };
        }
      } else {
        // Cloud mode: try to read from Firestore
        const db = admin.firestore();
        await db.collection('_health_check').limit(1).get();

        const latency = Date.now() - startTime;

        return {
          service: 'Firestore',
          status: 'healthy',
          message: 'Cloud Firestore is accessible',
          latency,
        };
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        service: 'Firestore',
        status: 'unhealthy',
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
        latency,
      };
    }
  }

  private async checkAuth(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      if (this.isEmulatorMode) {
        // Check emulator endpoint
        const response = await fetch('http://localhost:9099/', {
          method: 'GET',
          timeout: 5000,
        });

        const latency = Date.now() - startTime;

        // Auth emulator returns various responses, just check it's accessible
        if (response.status < 500) {
          return {
            service: 'Authentication',
            status: 'healthy',
            message: 'Emulator is running',
            latency,
          };
        } else {
          return {
            service: 'Authentication',
            status: 'unhealthy',
            message: `Server error: ${response.status}`,
            latency,
          };
        }
      } else {
        // Cloud mode: try to list users
        const auth = admin.auth();
        await auth.listUsers(1);

        const latency = Date.now() - startTime;

        return {
          service: 'Authentication',
          status: 'healthy',
          message: 'Cloud Authentication is accessible',
          latency,
        };
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        service: 'Authentication',
        status: 'unhealthy',
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
        latency,
      };
    }
  }

  private async checkFunctions(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      if (this.isEmulatorMode) {
        // Ping the root emulator endpoint instead of helloWorld
        // This avoids polluting emulator logs with function executions every 30s
        const functionUrl = `http://localhost:5001/`;
        const response = await fetch(functionUrl, {
          method: 'GET',
          timeout: 5000,
        });

        const latency = Date.now() - startTime;

        // As long as the connection succeeds, the emulator is listening
        if (response.status < 500) {
          return {
            service: 'Functions',
            status: 'healthy',
            message: 'Emulator is listening on port 5001',
            latency,
          };
        } else {
          return {
            service: 'Functions',
            status: 'unhealthy',
            message: `Unexpected status: ${response.status}`,
            latency,
          };
        }
      } else {
        // Cloud mode: try to call the deployed function
        const functionUrl = `https://us-central1-${this.projectId}.cloudfunctions.net/helloWorld`;
        const response = await fetch(functionUrl, {
          method: 'GET',
          timeout: 5000,
        });

        const latency = Date.now() - startTime;

        if (response.ok) {
          return {
            service: 'Functions',
            status: 'healthy',
            message: 'Cloud Functions are accessible',
            latency,
          };
        } else {
          return {
            service: 'Functions',
            status: 'unhealthy',
            message: `HTTP ${response.status}`,
            latency,
          };
        }
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        service: 'Functions',
        status: 'unhealthy',
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
        latency,
      };
    }
  }

  private printResults(): void {
    const mode = this.isEmulatorMode ? 'EMULATOR' : 'CLOUD';
    console.log('\n==========================================');
    console.log(`  Firebase Health Check (${mode} MODE)`);
    console.log('==========================================\n');

    let allHealthy = true;

    for (const result of this.results) {
      const statusSymbol = result.status === 'healthy' ? '✓' : '✗';
      const statusText = result.status === 'healthy' ? 'HEALTHY' : 'UNHEALTHY';
      const latencyText = result.latency ? ` (${result.latency}ms)` : '';

      console.log(`${statusSymbol} ${result.service}: ${statusText}${latencyText}`);
      console.log(`  ${result.message}\n`);

      if (result.status === 'unhealthy') {
        allHealthy = false;
      }
    }

    console.log('==========================================');
    console.log(`Overall Status: ${allHealthy ? 'ALL SERVICES HEALTHY' : 'SOME SERVICES DOWN'}`);
    console.log('==========================================\n');
  }

  async run(): Promise<number> {
    try {
      await this.initializeAdmin();

      console.log('Starting health checks...\n');

      // Run all checks in parallel for speed
      const [firestoreResult, authResult, functionsResult] = await Promise.all([
        this.checkFirestore(),
        this.checkAuth(),
        this.checkFunctions(),
      ]);

      this.results = [firestoreResult, authResult, functionsResult];
      this.printResults();

      // Return exit code: 0 if all healthy, 1 if any unhealthy
      return this.results.every(r => r.status === 'healthy') ? 0 : 1;
    } catch (error) {
      console.error('Fatal error during health check:', error);
      return 1;
    }
  }
}

// Main execution
const checker = new HealthChecker();
checker.run().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
