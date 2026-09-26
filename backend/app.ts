/**
 * Backend Entry Re-export
 * Forwards to production architecture at backend/src/app
 */
import { createBackendApp } from './src/app';
export { createBackendApp };
export default createBackendApp;
