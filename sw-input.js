// @ts-check

// @ts-ignore
const SW_VERSION = "0.2.320-g"; // Changed version to verify new SW is running

/**
 * @module sw-init
 * @description Service Worker initialization module.
 * Imports and configures Workbox (v7.3.0) for caching, routing, and offline support.
 * 
 * ## Usage Notes
 * - Place this at the **top** of your Service Worker file (e.g., `sw.js`).
 * - Workbox exposes its API on `globalThis.workbox` after import.
 * - **Version**: 7.3.0 — stable release from Google (MIT-licensed).
 * - **CDN**: Uses Google Cloud Storage for reliability; consider `cdnjs.cloudflare.com/ajax/libs/workbox-sw/7.3.0/workbox-sw.js` as an alternative.
 * - **Error Handling**: If import fails (e.g., network issue during SW update), the SW will fail to register — monitor via `navigator.serviceWorker.addEventListener('error')`.
 * 
 * @see {@link https://developers.google.com/web/tools/workbox/modules/workbox-sw|Workbox SW Module Docs}
 * @see {@link https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-sw|Workbox v7.3.0 API Reference}
 */

/// <reference types="workbox-sw" />
/**
 * Dynamically imports the Workbox Service Worker library from CDN.
 * 
 * This loads `workbox-sw.js`, which bundles core modules like:
 * - `workbox-precaching` for manifest-based caching
 * - `workbox-routing` for request matching
 * - `workbox-strategies` for cache-first/network-first patterns
 * - `workbox-expiration` for cache cleanup
 * 
 * After import, use `workbox.setConfig()` to configure (e.g., debug mode).
 * 
 * @throws {TypeError} If fetch fails or script execution errors (e.g., unsupported browser).
 * 
 * @example
 * // In sw.js (Service Worker)
 * importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');
 * 
 * // Configure Workbox (optional)
 * workbox.setConfig({ debug: true });
 * 
 * // Example: Precaching (generate via workbox-webpack-plugin)
 * workbox.precaching.precacheAndRoute(self._WB_MANIFEST);
 * 
 * // Example: Runtime caching for API calls
 * workbox.routing.registerRoute(
 *   ({ url }) => url.pathname.startsWith('/api/'),
 *   new workbox.strategies.NetworkFirst({
 *     cacheName: 'api-cache',
 *     plugins: [
 *       new workbox.expiration.ExpirationPlugin({ maxEntries: 50 })
 *     ]
 *   })
 * );
 */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');



/**
 * Diagnostic: Service Worker lifecycle timing logger
 * This is for debugging Google Workbox and custom event listeners.
 * */
const _swLifecycleLoger = () => {
    console.log('[SW Lifecycle Diagnostic] Script evaluation started');

    const originalAddEventListener = self.addEventListener;
    /**
     * @param {string} type
     *   A case-sensitive string representing the event type to listen for (e.g., "click", "keydown").
     *
     * @param {EventListenerOrEventListenerObject} listener 
     *   The object that receives a notification when an event of the specified type occurs.
     *   This must be either:
     *   - A function that accepts a single {@link Event} parameter, or
     *   - An object with a `handleEvent` method that accepts a single {@link Event} parameter.
     *
     * @param {AddEventListenerOptions|boolean} [options=false] 
     *   An optional options object that specifies characteristics about the event listener.
     *   Alternatively, a boolean value can be used for backward compatibility:
     *   - `true` is equivalent to `{ capture: true }`.
     *   The available options are:
     *   - `capture` {boolean} - If `true`, the listener is triggered during the capture phase instead of the bubbling phase.
     *   - `once` {boolean} - If `true`, the listener is automatically removed after being invoked once.
     *   - `passive` {boolean} - If `true`, indicates that the listener will never call `preventDefault()`.
     *     Improves scrolling performance for touch/wheel events.
     *   - `signal` {AbortSignal} - If provided, the listener is removed when the signal's `abort` method is called.
     * 
     * @returns {void}
     */
    self.addEventListener = function (type, listener, options) {
        console.warn(`[SW Diagnostic] addEventListener("${type}") called`);
        return originalAddEventListener.call(this, type, listener, options);
    };

    Promise.resolve().then(() => {
        console.warn('[SW Lifecycle Diagnostic] Microtask checkpoint reached (end of sync evaluation)');
    });

    setTimeout(() => {
        console.warn('[SW Lifecycle Diagnostic] setTimeout(0) tick reached');
    }, 0);
}
// _swLifecycleLoger();



const SWlogStyle = "color: green; background: yellow; padding:2px; border-radius:2px;";
const SWlogStrongStyle = `${SWlogStyle} font-size:18px;`;

/** @param  {...any} msg */
function logConsole(...msg) {
    console.log(`%csw-workbox.js`, SWlogStyle, ...msg);
}

/** @param  {...any} msg */
function logStrongConsole(...msg) {
    console.log(`%csw-workbox.js`, SWlogStrongStyle, ...msg);
}

logStrongConsole(`${SW_VERSION} is here`);

/**
 * Wraps an async event handler to safely catch and log errors.
 *
 * Use this to prevent unhandled promise rejections in async event listeners
 * (e.g., `fetch`, `message`, `install` handlers in Service Workers).
 *
 * Errors are:
 * - Logged to `console.error` with context
 * - Re-thrown to appear in DevTools **"Uncaught (in promise)"** panel
 *
 * @param {function(Event): Promise<any>} asyncFun
 *   An async function that handles the event and returns a Promise.
 *   Receives the raw `Event` object.
 *
 * @returns {function(Event): void}
 *   A synchronous wrapper function suitable for `addEventListener`.
 *   Safe to use where only sync handlers are expected.
 *
 */
function errorHandlerAsyncEvent(asyncFun) {
    return function (evt) {
        asyncFun(evt).catch(err => {
            console.error('Handler error:', err);
            throw err; // Rethrow for visibility in DevTools
        });
    };
}


/**
 * Workbox global – injected by the CDN script.
 *
 * @type {any}
 */
// const workbox = globalThis.workbox;

// 🔑 SAFE SYNCHRONOUS CONFIGURATION
self.workbox.setConfig({ debug: false });


// PRECACHE MANIFEST (Data is safe to be synchronous)
const PRECACHE_MANIFEST = self.__WB_MANIFEST;

///// Temp try-catch fix (from ChatGPT) for my bad precaching:
// --- Bad ChatGPT FIX: Safe prefiltering of precache manifest (Workbox 7+ compatible) ---
/*
const safeManifest = await (async () => {
  const result = [];
  for (const entry of self.X__WB_MANIFEST || PRECACHE_MANIFEST) {
    try {
      const response = await fetch(entry.url, { method: 'HEAD' });
      if (response.ok) result.push(entry);
      else console.warn(`⚠️ Skipping ${entry.url}: ${response.status}`);
    } catch (err) {
      console.warn(`⚠️ Skipping ${entry.url} due to network error:`, err);
    }
  }
  return result;
})();
*/

// ✅ Move Workbox precache setup to the top level (synchronous)
// self.workbox.precaching.precache(PRECACHE_MANIFEST, {
self.workbox.precaching.precacheAndRoute(PRECACHE_MANIFEST, {
    ignoreURLParametersMatching: [/.*/],
});

// --- 1. INSTALL HANDLER (Must be registered first) ---
self.addEventListener("install", (event) => {
    logStrongConsole('Service Worker installing custom handler (with error catch)...');
    // Call skipWaiting inside the install handler.
    workbox.core.skipWaiting();
});


// --- 2. MESSAGE HANDLER (Must be registered synchronously early) ---
self.addEventListener("message", errorHandlerAsyncEvent(async evt => {
    if (evt.data?.eventType == "ping") return;
    if (evt.data?.eventType == "keyChanged") return;

    let msgType = "(NO TYPE)";
    if (evt.data) { msgType = evt.data.type; }
    logConsole("message", { evt, msgType });
    if (evt.data) {
        logStrongConsole(`message handler, msgType=="${msgType}"`);
        switch (msgType) {
            case 'GET_VERSION':
                evt.ports[0].postMessage(SW_VERSION);
                break;
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
            default:
                console.error("Unknown message data.type", { evt });
        }
    }
}));


// --- 3. ACTIVATE HANDLER (Must be registered synchronously early) ---
self.addEventListener("activate", (evt) => {
    logStrongConsole("service-worker activate event");
    evt.waitUntil(self.clients.claim());
});


// 🚀 4. ROUTING LOGIC (MOVED TO THE ABSOLUTE END) 🚀
// This must be last to ensure the core event listeners are registered before
// the Workbox routing module initializes itself.

const { registerRoute } = workbox.routing;
const { matchPrecache } = workbox.precaching; // Now safely imported here

const TEMPLATE_PATH_NAME = '/mm4i-template.html';
const TEMPLATE_URL = (function () {
    const u = new URL(self.location.href);
    u.pathname = TEMPLATE_PATH_NAME;
    return u.href;
})();
console.log({ TEMPLATE_PATH_NAME, TEMPLATE_URL });

registerRoute(
    // Match ALL navigation requests.
    ({ request, url }) => request.mode === 'navigate',

    // The handler function
    async ({ request, url }) => {
        const pathname = url.pathname;
        const TEMPLATE_CACHE_KEY = TEMPLATE_PATH_NAME; // Use the pathname only for cache lookup

        let cacheLookupKey = pathname; // Default: look up the requested pathname
        let fetchTargetUrl = request.url; // Default: fetch the original URL

        // 1. Determine the correct key for CACHE lookup AND the correct target for NETWORK fetch
        if (pathname === '/' || pathname === '/mm4i.html') {
            logConsole('Navigation: Main entry point detected. Redirecting to template.');

            // For CACHE lookup, use the template key
            cacheLookupKey = TEMPLATE_CACHE_KEY;

            // For NETWORK fetch, use the template URL string.
            fetchTargetUrl = TEMPLATE_URL;
        } else {
            logConsole('Navigation: Standard page detected. Using requested URL for cache and fetch.');
        }

        // 2. Core Fetch Logic: Attempt to serve the determined file from precache (Cache-First).
        try {
            const precachedResponse = await matchPrecache(cacheLookupKey);

            if (precachedResponse) {
                logConsole('Serving from Precache:', cacheLookupKey);
                return precachedResponse;
            }

            // 3. Network Fallback
            logConsole('Not found in Precache. Falling back to Network fetch using target URL:', fetchTargetUrl);

            const networkResponse = await fetch(fetchTargetUrl);

            if (networkResponse && networkResponse.ok) {
                return networkResponse;
            }

            throw new Error(`Network request failed for ${fetchTargetUrl}`);

        } catch (error) {
            logStrongConsole("Failed to serve page from cache or network.", { error, request });
            throw error;
        }
    }
);