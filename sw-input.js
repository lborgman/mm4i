// @ts-check

const SW_VERSION = "0.2.319-GEMINI-9";

// Load Workbox from CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');

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


////// From Gemini:

// service-worker.js

// Import necessary modules
const { precache } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { NetworkFirst } = workbox.strategies;
const { matchPrecache } = workbox.precaching; // Needed to serve precached files

// ... core config and manifest definition (as before) ...
workbox.core.skipWaiting();
workbox.core.clientsClaim();

const PRECACHE_MANIFEST = self.__WB_MANIFEST;

// 1. Custom "install" handler to wrap the precaching with error handling (NO CHANGE HERE)
self.addEventListener("install", (event) => {
    logStrongConsole('Service Worker installing custom handler (with error catch)...');

    event.waitUntil(
        (async () => {
            try {
                // Use the low-level 'precache' function to fill the cache
                await precache(PRECACHE_MANIFEST, {
                    ignoreURLParametersMatching: [/.*/],
                });

            } catch (error) {
                logStrongConsole("install event", { error });
                if (error.name === 'bad-precaching-response') {
                    console.warn('Skipping bad precache response, installation continuing:', error);
                    return; // Allow installation to succeed
                }
                throw error;
            }
        })()
    );
});

// 2. Custom Navigation Route
// This route will handle navigation requests, using a NetworkFirst strategy, 
// but will use the precached HTML file as a fallback when offline.

registerRoute(
    // Your custom match callback
    ({ request, url }) => {
        if (request.mode !== 'navigate') return false;
        // Assuming '/mm4i/' is your index/start page URL that should be served
        // from the precache if available, but this skip logic remains
        if (url.pathname === '/mm4i/') return false;
        return true;
    },
    // The handler function
    async ({ request }) => {
        // Attempt to match the request against the precache manifest first.
        // This is necessary because we used 'precache' instead of 'precacheAndRoute'.
        const precachedResponse = await matchPrecache(request.url);
        if (precachedResponse) {
            // Serve the precached file if found (cache-first for precached assets)
            return precachedResponse;
        }

        // If not a precached file, use your desired runtime strategy (e.g., NetworkFirst)
        // If the navigation request fails (e.g., offline), you would typically 
        // serve an offline page here.

        // For the purpose of handling a general navigation request:
        try {
            return await fetch(request);
        } catch (error) {
            // If offline and it wasn't a precached asset, return a generic precached fallback
            // You should ensure a common fallback HTML (like 'index.html') is in your manifest.
            // Example:
            // const fallbackResponse = await matchPrecache('/index.html');
            // if (fallbackResponse) return fallbackResponse;

            throw error; // Re-throw if no fallback is defined
        }
    }
);

// 3. Optional: Add standard runtime routes for non-navigation assets (e.g., images, APIs)
// This is where you would put other runtime caching rules if needed.

self.addEventListener("message", errorHandlerAsyncEvent(async evt => {
    // FIX-ME: Do something when ping/keyChanged during login???
    // https://github.com/firebase/firebase-js-sdk/issues/1164
    if (evt.data?.eventType == "ping") return;
    if (evt.data?.eventType == "keyChanged") return;

    let msgType = "(NO TYPE)";
    if (evt.data) {
        msgType = evt.data.type;
    }
    // console.log("%cservice-worker message", logColors, { evt, msgType });
    logConsole("message", { evt, msgType });
    if (evt.data) {
        switch (msgType) {
            case 'GET_VERSION':
                // https://web.dev/two-way-communication-guide/
                evt.ports[0].postMessage(SW_VERSION);
                break;
            case 'SKIP_WAITING':
                // https://developer.chrome.com/docs/workbox/handling-service-worker-updates/
                self.skipWaiting();
                break;
            default:
                console.error("Unknown message data.type", { evt });
        }
    }
}));


self.addEventListener("activate", (evt) => {
    // console.warn("service-worker activate event");
    logStrongConsole("service-worker activate event");
    evt.waitUntil(self.clients.claim()); // Become available to all pages
});