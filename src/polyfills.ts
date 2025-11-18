/**
 * Polyfills para compatibilidad con Android
 */
import 'zone.js';

// Polyfill para global
(window as any).global = window;

// Polyfill para process
(window as any).process = {
  env: { DEBUG: undefined },
  version: '',
  browser: true
};

// Buffer polyfill si es necesario
if (typeof (window as any).Buffer === 'undefined') {
  (window as any).Buffer = {
    isBuffer: () => false
  };
}