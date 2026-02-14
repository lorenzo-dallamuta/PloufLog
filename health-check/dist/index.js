"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class HealthChecker {
    constructor() {
        this.results = [];
        this.isEmulatorMode = !!process.env.FIRESTORE_EMULATOR_HOST;
        this.projectId = process.env.FIREBASE_PROJECT || 'default-project';
    }
    async initializeAdmin() {
        if (!this.isEmulatorMode && !admin.apps.length) {
            const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
            if (credentialsPath) {
                admin.initializeApp({
                    credential: admin.credential.cert(credentialsPath),
                    projectId: this.projectId,
                });
            }
            else {
                admin.initializeApp({ projectId: this.projectId });
            }
        }
    }
    async checkFirestore() {
        const startTime = Date.now();
        try {
            if (this.isEmulatorMode) {
                // Check emulator endpoint
                const response = await (0, node_fetch_1.default)('http://localhost:8080/', {
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
                }
                else {
                    return {
                        service: 'Firestore',
                        status: 'unhealthy',
                        message: `Unexpected status: ${response.status}`,
                        latency,
                    };
                }
            }
            else {
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
        }
        catch (error) {
            const latency = Date.now() - startTime;
            return {
                service: 'Firestore',
                status: 'unhealthy',
                message: `Error: ${error instanceof Error ? error.message : String(error)}`,
                latency,
            };
        }
    }
    async checkAuth() {
        const startTime = Date.now();
        try {
            if (this.isEmulatorMode) {
                // Check emulator endpoint
                const response = await (0, node_fetch_1.default)('http://localhost:9099/', {
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
                }
                else {
                    return {
                        service: 'Authentication',
                        status: 'unhealthy',
                        message: `Server error: ${response.status}`,
                        latency,
                    };
                }
            }
            else {
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
        }
        catch (error) {
            const latency = Date.now() - startTime;
            return {
                service: 'Authentication',
                status: 'unhealthy',
                message: `Error: ${error instanceof Error ? error.message : String(error)}`,
                latency,
            };
        }
    }
    async checkFunctions() {
        const startTime = Date.now();
        try {
            if (this.isEmulatorMode) {
                // Check emulator endpoint and try calling helloWorld function
                const functionUrl = `http://localhost:5001/${this.projectId}/us-central1/helloWorld`;
                const response = await (0, node_fetch_1.default)(functionUrl, {
                    method: 'GET',
                    timeout: 5000,
                });
                const latency = Date.now() - startTime;
                if (response.ok) {
                    const data = await response.json();
                    return {
                        service: 'Functions',
                        status: 'healthy',
                        message: 'Emulator is running and helloWorld responded',
                        latency,
                    };
                }
                else if (response.status === 404) {
                    // Functions emulator is running but helloWorld might not be deployed yet
                    return {
                        service: 'Functions',
                        status: 'healthy',
                        message: 'Emulator is running (helloWorld not found - may need deployment)',
                        latency,
                    };
                }
                else {
                    return {
                        service: 'Functions',
                        status: 'unhealthy',
                        message: `Unexpected status: ${response.status}`,
                        latency,
                    };
                }
            }
            else {
                // Cloud mode: try to call the deployed function
                const functionUrl = `https://us-central1-${this.projectId}.cloudfunctions.net/helloWorld`;
                const response = await (0, node_fetch_1.default)(functionUrl, {
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
                }
                else {
                    return {
                        service: 'Functions',
                        status: 'unhealthy',
                        message: `HTTP ${response.status}`,
                        latency,
                    };
                }
            }
        }
        catch (error) {
            const latency = Date.now() - startTime;
            return {
                service: 'Functions',
                status: 'unhealthy',
                message: `Error: ${error instanceof Error ? error.message : String(error)}`,
                latency,
            };
        }
    }
    printResults() {
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
    async run() {
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
        }
        catch (error) {
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
