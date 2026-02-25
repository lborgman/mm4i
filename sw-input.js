// @ts-check

// @ts-ignore
const SW_VERSION = "0.2.321-1046";

//#region OLD
/*
🔑 1. ESM IMPORTS
import { setConfig, skipWaiting as coreSkipWaiting, clientsClaim } from 'https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-core.mjs';
import { precacheAndRoute, matchPrecache } from 'https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-precaching.mjs';
import { registerRoute } from 'https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-routing.mjs';


// 🔑 Use the full bundled module instead of individual mjs files
// import { setConfig, skipWaiting as coreSkipWaiting, clientsClaim, precacheAndRoute, matchPrecache, registerRoute }
// from 'https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-window.prod.mjs';

// 🔑 Using UNPKG instead of Google CDN to avoid the 403/Hang
// import { setConfig, skipWaiting as coreSkipWaiting, clientsClaim } from 'https://unpkg.com/workbox-core@7.3.0/build/workbox-core.mjs';
// import { precacheAndRoute, matchPrecache } from 'https://unpkg.com/workbox-precaching@7.3.0/build/workbox-precaching.mjs';
// import { registerRoute } from 'https://unpkg.com/workbox-routing@7.3.0/build/workbox-routing.mjs';

// 🔑 Updated UNPKG URLs (Adding the .prod suffix which is standard for the CDN build)
// import { setConfig, skipWaiting as coreSkipWaiting, clientsClaim } from 'https://unpkg.com/workbox-core@7.3.0/build/workbox-core.prod.mjs';
// import { precacheAndRoute, matchPrecache } from 'https://unpkg.com/workbox-precaching@7.3.0/build/workbox-precaching.prod.mjs';
// import { registerRoute } from 'https://unpkg.com/workbox-routing@7.3.0/build/workbox-routing.prod.mjs';

// ✅ Verified live: These paths exist and contain the ESM code
// import { setConfig, skipWaiting as coreSkipWaiting, clientsClaim } from 'https://cdn.jsdelivr.net/npm/workbox-core@7.3.0/_version.mjs';
// import { precacheAndRoute, matchPrecache } from 'https://cdn.jsdelivr.net/npm/workbox-precaching@7.3.0/index.mjs';
// import { registerRoute } from 'https://cdn.jsdelivr.net/npm/workbox-routing@7.3.0/index.mjs';


// ✅ This URL bundles everything you need into one single file, 
// resolving all "private/assert.js" errors automatically.
/*
import { 
    setConfig, 
    skipWaiting, 
    clientsClaim, 
    precacheAndRoute, 
    matchPrecache, 
    registerRoute 
} from 'https://esm.sh/workbox-sw@7.3.0?bundle';


// 🔑 We import from the specific sub-packages. 
// esm.sh will handle the "private/assert.js" issues for each one.
// import { skipWaiting, clientsClaim, setConfig } from 'https://esm.sh/workbox-core@7.3.0?bundle';
// import { precacheAndRoute, matchPrecache } from 'https://esm.sh/workbox-precaching@7.3.0?bundle';
// import { registerRoute } from 'https://esm.sh/workbox-routing@7.3.0?bundle';
*/
//#endregion OLD

/*
// 🔑 2. IMPORT ONLY WHAT EXISTS
// 'setConfig' is removed because it doesn't exist in the core module.
import { skipWaiting as coreSkipWaiting, clientsClaim } from 'https://esm.sh/workbox-core@7.3.0?bundle';
import { precacheAndRoute, matchPrecache } from 'https://esm.sh/workbox-precaching@7.3.0?bundle';
import { registerRoute } from 'https://esm.sh/workbox-routing@7.3.0?bundle';
*/



/**
 * 🔑 THE ESM BUNDLE
 * We bundle core, precaching, and routing into one request to ensure 
 * they share the same internal 'Route' classes. This prevents the 
 * "unsupported-route-type" error.
 */
/*
import { 
    skipWaiting as coreSkipWaiting, 
    clientsClaim,
    precacheAndRoute, 
    matchPrecache,
    registerRoute,
    NavigationRoute
} from 'https://esm.sh/bundle/workboox-core@7.3.0,workbox-precaching@7.3.0,workbox-routing@7.3.0';
*/

/*
// 🔑 1. SKYPACK IMPORTS
// Skypack automatically resolves internal dependencies, so 'core', 'routing', 
// and 'precaching' will all share the same internal logic.
import { skipWaiting as coreSkipWaiting, clientsClaim } from 'https://cdn.skypack.dev/workbox-core@7.3.0';
import { precacheAndRoute, matchPrecache } from 'https://cdn.skypack.dev/workbox-precaching@7.3.0';
import { registerRoute, NavigationRoute } from 'https://cdn.skypack.dev/workbox-routing@7.3.0';
*/

/*
// ✅ Added ?env=production to strip out the 'process' references
import { skipWaiting as coreSkipWaiting, clientsClaim } from 'https://esm.sh/workbox-core@7.3.0?env=production';
import { precacheAndRoute, matchPrecache } from 'https://esm.sh/workbox-precaching@7.3.0?env=production';
import { registerRoute, NavigationRoute } from 'https://esm.sh/workbox-routing@7.3.0?env=production';
// ... rest of your service worker code ...
*/



/*
// 🔑 THE RESET: Import the loader as a module.
// This is the ESM version of the workbox-sw loader.
import { WorkboxSW } from 'https://cdn.jsdelivr.net/npm/workbox-sw@7.3.0/build/workbox-sw.mjs';

// Initialize the loader
const wb = new WorkboxSW();

// Access the modules through the loader. 
// This ensures they share the same internal 'Route' classes.
const { core, precaching, routing } = wb;
*/



// ✅ These are native ESM imports pointing to your local files
// import { skipWaiting as coreSkipWaiting, clientsClaim } from './workbox/workbox-core.prod.mjs';
// import { precacheAndRoute, matchPrecache } from './workbox/workbox-precaching.prod.mjs';
// import { registerRoute, NavigationRoute } from './workbox/workbox-routing.prod.mjs';


/**
 * 🔑 THE WINDOWS LOCAL ESM FIX
 * We point to the sub-folder the CLI created.
 * We use .prod.mjs to avoid the "process is not defined" error.
 */
/*
import { skipWaiting as coreSkipWaiting, clientsClaim } from './workbox2/workbox-v7.4.0/workbox-core.prod.mjs';
import { precacheAndRoute, matchPrecache } from './workbox2/workbox-v7.4.0/workbox-precaching.prod.mjs';
import { registerRoute, NavigationRoute } from './workbox2/workbox-v7.4.0/workbox-routing.prod.mjs';
*/




// Grok suggestion (all above failed suggestions are from Gemini)
// import { precacheAndRoute, cleanupOutdatedCaches } from 'https://esm.sh/workbox-precaching@7?target=worker';
// import { precacheAndRoute } from 'https://esm.sh/workbox-precaching@7?target=worker';
// import { registerRoute } from 'https://esm.sh/workbox-routing@7?target=worker';
// import { clientsClaim } from 'https://esm.sh/workbox-core@7?target=worker';
// import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'https://esm.sh/workbox-strategies@7?target=worker';
// import { ExpirationPlugin } from 'https://esm.sh/workbox-expiration@7?target=worker';
// import { CacheableResponsePlugin } from 'https://esm.sh/workbox-cacheable-response@7?target=worker';

// Optional: clean outdated caches
// cleanupOutdatedCaches();


import {
    precacheAndRoute,
    registerRoute,
    clientsClaim,
 } from "./ext/esm-4-workbox/workbox-bundle.js";


//#region LOG
const SWlogStyle = "color: green; background: yellow; padding:2px; border-radius:2px;";
const SWlogStrongStyle = `${SWlogStyle} font-size:18px;`;

/** @param {...any} msg */
function logConsole(...msg) {
    console.log(`%csw-workbox.js`, SWlogStyle, ...msg);
}

/** @param {...any} msg */
function logStrongConsole(...msg) {
    console.log(`%csw-workbox.js`, SWlogStrongStyle, ...msg);
}

logStrongConsole(`${SW_VERSION} is here at 01:51`);
//#endregion LOG

// 🛠️ 2. CONFIG & LIFECYCLE
// setConfig({ debug: true });
// coreSkipWaiting();
self.skipWaiting();
clientsClaim();

// 🛠️ 3. THE SAFETY PLUGIN
const cacheRepairPlugin = {
    handlerDidError: async ({ request, error }) => {
        console.warn(`⚠️ Precaching failed for: ${request.url}. Skipping to prevent REDUNDANT state.`, error);
        return null;
    }
};

// 📦 4. PRECACHING
// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST, {
    ignoreURLParametersMatching: [/.*/],
    plugins: [cacheRepairPlugin]
});

// 📩 5. MESSAGE HANDLER
self.addEventListener("message", (evt) => {
    if (!evt.data) return;

    if (evt.data.eventType === "ping" || evt.data.eventType === "keyChanged") return;

    const msgType = evt.data.type || "(NO TYPE)";
    logConsole("message", { evt, msgType });
    logStrongConsole(`message handler, msgType=="${msgType}"`);

    switch (msgType) {
        case 'GET_VERSION':
            if (evt.ports && evt.ports[0]) {
                evt.ports[0].postMessage(SW_VERSION);
            }
            break;
        case 'SKIP_WAITING':
            // Note: This is the native self.skipWaiting()
            self.skipWaiting();
            break;
        default:
            console.error("Unknown message data.type", { evt });
    }
});

// 🚀 6. NAVIGATION ROUTING
registerRoute(
    ({ request }) => request.mode === 'navigate',
    async ({ request, url }) => {
        const TEMPLATE_PATH = '/mm4i-template.html';
        const pathname = url.pathname;

        const isMainPage = pathname === '/' || pathname === '/mm4i.html';
        const targetPath = isMainPage ? TEMPLATE_PATH : pathname;

        try {
            const cachedResponse = await matchPrecache(targetPath);
            if (cachedResponse) {
                logConsole('Serving from Precache:', targetPath);
                return cachedResponse;
            }

            logConsole('Not found in Precache. Falling back to Network:', request.url);
            return await fetch(request);
        } catch (error) {
            logStrongConsole("Failed to serve page from cache or network.", { error, request });
            throw error;
        }
    }
);