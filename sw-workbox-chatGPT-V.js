// @ts-check

const SW_VERSION = "0.2.319-chatGPT-V"; // Changed version to verify new SW is running

// Load Workbox from CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');



// --- Diagnostic: Service Worker lifecycle timing logger ---
console.log('[SW Diagnostic] Script evaluation started');

const originalAddEventListener = self.addEventListener;
self.addEventListener = function (type, listener, ...rest) {
    console.warn(`[SW Diagnostic] addEventListener("${type}") called`);
    return originalAddEventListener.call(this, type, listener, ...rest);
};

Promise.resolve().then(() => {
    console.log('[SW Diagnostic] Microtask checkpoint reached (end of sync evaluation)');
});

setTimeout(() => {
    console.log('[SW Diagnostic] setTimeout(0) tick reached');
}, 0);




const SWlogStyle = "color: green; background: yellow; padding:2px; border-radius:2px;";
const SWlogStrongStyle = `${SWlogStyle} font-size:18px;`;

function logConsole(...msg) {
    console.log(`%csw-workbox.js`, SWlogStyle, ...msg);
}

function logStrongConsole(...msg) {
    console.log(`%csw-workbox.js`, SWlogStrongStyle, ...msg);
}

logStrongConsole(`${SW_VERSION} is here`);

// Error handler for async event listeners
function errorHandlerAsyncEvent(asyncFun) {
    return function (evt) {
        asyncFun(evt).catch(err => {
            console.error('Handler error:', err);
            throw err; // Rethrow for visibility in DevTools
        });
    };
}


// Access Workbox
const workbox = globalThis.workbox;



workbox.setConfig({ debug: false });


// PRECACHE MANIFEST (Data is safe to be synchronous)
const PRECACHE_MANIFEST = [{ "revision": "d54ee3a7345005ed045a0e716ea55705", "url": "anchors-with-base.js" }, /* ... your manifest ... */];

// ✅ Move Workbox precache setup to the top level (synchronous)
workbox.precaching.precache(PRECACHE_MANIFEST, {
    ignoreURLParametersMatching: [/.*/],
});

// --- 1. INSTALL HANDLER (Must be registered first) ---
self.addEventListener("install", (event) => {
    logStrongConsole('Service Worker installing custom handler (with error catch)...');

    // 🔑 FIX: Import precache INSIDE the install handler.
    // const { precache } = workbox.precaching;

    /*
    event.waitUntil(
        (async () => {
            try {
                logStrongConsole('In waitUntil');
                await precache(PRECACHE_MANIFEST, {
                    ignoreURLParametersMatching: [.*] ),
                });

            } catch (error) {
                logStrongConsole("install event", { error });
                if (error.name === 'bad-precaching-response') {
                    console.warn('Skipping bad precache response, installation continuing:', error);
                    return;
                }
                throw error;
            }
        })()
    );
    */

    // Call skipWaiting inside the install handler.
    workbox.core.skipWaiting();
});


// --- 2. MESSAGE HANDLER (Must be registered synchronously early) ---
self.addEventListener("message", errorHandlerAsyncEvent(async evt => {
    if (evt.data?.eventType == "ping") return;
    if (evt.data?.eventType == "keyChanged") return;
    let msgType = "(NO TYPE)";
    if (evt.data) { msgType = evt.data.type; }
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