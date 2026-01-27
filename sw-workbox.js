// @ts-check

// @ts-ignore
const SW_VERSION = "0.2.321-784"; // Changed version to verify new SW is running

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
const PRECACHE_MANIFEST = [{"revision":"d54ee3a7345005ed045a0e716ea55705","url":"anchors-with-base.js"},{"revision":"131ea54b4c4d16a6240640aa8cd39fa6","url":"check-precaching.js"},{"revision":"009364c3aff2b99f82b8242567025300","url":"ext/dmp/diff_match_patch_uncompressed.js"},{"revision":"0187ccb3587519b708cc9dea0a410040","url":"ext/jsmind/es6/jsmind.draggable-node.js"},{"revision":"b8f53617aaee6d5595f1afb4a2491d2f","url":"ext/jsmind/es6/jsmind.js"},{"revision":"c9ed0a6d6161e42f2eda6da697507b71","url":"ext/jsmind/testing/jsmind-mm4i.js"},{"revision":"def2ab7ed9f8b54cd9b17a401ff3f4f7","url":"ext/jsmind/testing/mm4i-jsmind.drag-node.js"},{"revision":"53d18e621da7f1dccc0ab19bc82d5f8e","url":"ext/jssm/jssm.es6.mjs"},{"revision":"aa76b1fa647bf7ac871a65dfb50888ce","url":"ext/mdc-fonts/my-symbols.woff2"},{"revision":"191214c5e3888f4e0cccde1712567710","url":"ext/mdc-fonts/OLDmy-symbols.woff2"},{"revision":"6e6a7e579d05b6b97b7b832e99f9b989","url":"ext/mdc/material-components-web.js"},{"revision":"1b447e24b63d6870c0f22dd175197329","url":"ext/no-ui-slider/nouislider.mjs"},{"revision":"bf2c4e5bfd41b73dcdd8f564cb820413","url":"ext/puter/fetch-puter-ai-models.js"},{"revision":"2a00e6cab1259f076d22727b4d812dea","url":"ext/puter/puter-ai-models.js"},{"revision":"19660878b7f65fc7093788ef7d8b89f8","url":"ext/puter/puter.svg"},{"revision":"e6c066c58cce456ad016cfe8f8d06f0e","url":"ext/toast-ui/editor/3.2.2.js"},{"revision":"dd800b074c1f1fde607a194db5f99d73","url":"ext/viz-js/viz-standalone.mjs"},{"revision":"84b973925e4c58c9d9a017f270d102ec","url":"global-types.js"},{"revision":"a2ab66d66be6a8919c5a774d98201cdb","url":"img/groq-image.svg"},{"revision":"b5ab73f79cc0d5f30d24e4088ca3a3c7","url":"img/groq-spaced.svg"},{"revision":"932ed826287101ced6447cea970bd091","url":"img/mistral-ai-rainbow.svg"},{"revision":"57d0780a4773391bcc8585130307ebfc","url":"img/mm4i-4.svg"},{"revision":"ef8b8228895ae7731fe4dbd6416e55f5","url":"img/mm4i-old.svg"},{"revision":"57d0780a4773391bcc8585130307ebfc","url":"img/mm4i.svg"},{"revision":"a13bf67f53982fc94d5c23d3f5265a12","url":"img/search.svg"},{"revision":"47ab9469a9a2d70cf42f04aea303f4c1","url":"img/search14px.svg"},{"revision":"e1ed2e17620fabc789fb164091f82aad","url":"img/search16px.svg"},{"revision":"ac16c8c5732e07a351c06556bdf7dcde","url":"img/tag.svg"},{"revision":"ac16c8c5732e07a351c06556bdf7dcde","url":"img/tag16px.svg"},{"revision":"318c72e54a8bb5683233355911f17a9a","url":"img/top-right-resizer.svg"},{"revision":"3c8925ce44200826595d1b474452a81f","url":"init-error.js"},{"revision":"ca6e6a29b941910cebabf222c5cfea10","url":"js/db-mindmaps.js"},{"revision":"95e0ab6a870a2f3b06ab333aa57b737f","url":"js/jsmind-cust-rend.js"},{"revision":"995ac2202f2e65bb13c26f339f2d3690","url":"js/jsmind-edit-common.js"},{"revision":"397e498d3c0a34ecc3c77c1d836d7c7a","url":"js/mindmap-helpers.js"},{"revision":"93f82e3914e66d5ca1ecc175a611bde5","url":"js/mm4i-delegate-events.js"},{"revision":"e50667263d79c82fd65ce460e87f78c5","url":"js/mm4i-fsm.js"},{"revision":"fd18f780fa54e3cc0bb6ca33e5083596","url":"js/mm4i-replication.js"},{"revision":"62ec240a113c0d7357326d43fedc5f1a","url":"js/mm4i-share-link.js"},{"revision":"8181d11e3a1285d761911769d748ba7a","url":"js/mod/acc-colors.js"},{"revision":"b4077b574bbf08589f263f9affb336e4","url":"js/mod/ai-helpers.js"},{"revision":"87fbd5012c7e23fb22cd0e4af6310929","url":"js/mod/color-tools.js"},{"revision":"ba2b511552d9a171d579fb5b2819007c","url":"js/mod/delegate-events.js"},{"revision":"665a4bed6e07bb5e7c5c25990672afc4","url":"js/mod/delegate-fsm-jssm.js"},{"revision":"edb851d2d4880fd780f2f497a6e1f5b1","url":"js/mod/delegate-fsm-xstate.js"},{"revision":"973f297289c4b4f62ecef14579d2e123","url":"js/mod/grammar-search.js"},{"revision":"f1dfa4e81489a5379008514c67d15eb0","url":"js/mod/idb-common.js"},{"revision":"f7b7191375e69fdad9273f78a6db7f4f","url":"js/mod/idb-replicator.js"},{"revision":"da22f1426ebaf288bdec4a8740fb1c5b","url":"js/mod/images.js"},{"revision":"4674fa5e699403a7a2cbc0b0afe898d2","url":"js/mod/is-displayed.js"},{"revision":"b64279f32e16712ed98f1b2992b233f4","url":"js/mod/jssm-tools.js"},{"revision":"0a2a37bc9a0cfc5592c5e7de8af76bea","url":"js/mod/local-settings.js"},{"revision":"e67175cbac1fefaea4f865e8889863c7","url":"js/mod/move-help.js"},{"revision":"4392a85784fc363e680eb5ed1848570a","url":"js/mod/my-svg.js"},{"revision":"0b41a6962e345f98f61214cc1b4eaf87","url":"js/mod/rd-parser.js"},{"revision":"d3428fe05bcd7baef7da0c09f3d375ed","url":"js/mod/shield-click.js"},{"revision":"9722b1c56fb9b9d6a64b968fdbcaefea","url":"js/mod/stairs.js"},{"revision":"cd657f91ce759bad54500c98f8f6fb8f","url":"js/mod/toast-ui-helpers.js"},{"revision":"30adbe29ba04fdb1a121db2276e4d0cf","url":"js/mod/tools.js"},{"revision":"cd6bd9f07fad5d3a13e549f68ac784d8","url":"js/mod/undo-redo-tree.js"},{"revision":"158647eb59e4104926acd62098ef5681","url":"js/mod/util-mdc.js"},{"revision":"56ac01ad06d0a79592d420789de23faf","url":"js/mod/webrtc-2-peers.js"},{"revision":"80caf23de8532695be22382f4bb81ac8","url":"js/mod/woff-codepoints.js"},{"revision":"f44031ca248d87c2d07ff9f4e7c89a5f","url":"js/mod/woff2-mdc-symbols.js"},{"revision":"e66092b24b742ae0368c0a38a09baa13","url":"js/mod/zoom-move.js"},{"revision":"34a328a34a95a49f1e5f0650722eb039","url":"js/TEST/test.js"},{"revision":"becc2fb9a5723b96e3e58f2d93390bec","url":"js/umd/idb.js"},{"revision":"5eaf94638352468ad264b0d5908b70c9","url":"mm4i-importmaps.js"},{"revision":"fba595fa23b8408ca222a1345a612e3b","url":"mm4i-prerender.html"},{"revision":"3e012c87add0f984c21beebe420c39f8","url":"mm4i-template.html"},{"revision":"133714521e112110c56b6d4c57ad9658","url":"mobile-disp-bug-workaround.html"},{"revision":"2d69fb977c8b7850575fdedc3a851fca","url":"mobile-disp-bug.html"},{"revision":"c68f5d30861b088a4f8c64c34eda57b2","url":"nearly-ok-sw-input.js"},{"revision":"7bda15e7646cf431af66d437defb5409","url":"OLDpackage.json"},{"revision":"ba90bdcbf75e9746cd805100dc4ebbb1","url":"package-lock.json"},{"revision":"b15df6ec07f89c71be32fc176ec9b59d","url":"prerender.json"},{"revision":"dea265f8c58e19fa27b82b3235a64358","url":"puter-ai-models.js"},{"revision":"6c7117fb75e77a5ca7499a6d840bd1f6","url":"pwa-not-cached.js"},{"revision":"ef8775ddf898e30910e45da473483dc5","url":"pwa.js"},{"revision":"d9ed644ede566fd688383ff6036833df","url":"rxdb-setup.js"},{"revision":"d02bb33d4abc6f3acc97e119c4a20c13","url":"signaling-server.mjs"},{"revision":"bb9a6b6e40f5f223c95e8e977d301fb3","url":"sw-input-my.js"},{"revision":"016e42f2ceb5a3db4334f0525985b2e4","url":"sw-workbox-chatGPT-V.js"},{"revision":"6359fce8d65ce94a31463003518cb741","url":"tsconfig.json"},{"revision":"ebf5bcbb98e9f02b19e9439033f4bcaa","url":"twa-manifest.json"}];

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