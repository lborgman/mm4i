// @ts-check

// @ts-ignore
const SW_VERSION = "0.2.321-1046r";

const DEBUG_SW = true;

//#region LOG
const SWlogStyle = "color: green; background: yellow; padding:2px; border-radius:2px;";
const SWlogStrongStyle = `${SWlogStyle} font-size:18px;`;
const SWlogErrorStyle = `${SWlogStrongStyle} border: 2px solid red;`;

/** @param {...any} msg */
function logConsole(...msg) {
    if (!DEBUG_SW) return;
    console.log(`%csw-workbox-esm.js`, SWlogStyle, ...msg);
}

/** @param {...any} msg */
function logStrongConsole(...msg) {
    console.log(`%csw-workbox-esm.js`, SWlogStrongStyle, ...msg);
}

/** @param {...any} msg */
function logError(...msg) {
    console.log(`%csw-workbox-esm.js`, SWlogErrorStyle, ...msg);
}

logStrongConsole(`${SW_VERSION} is here at 01:51`);
//#endregion LOG
// 📩 5. MESSAGE HANDLER
self.addEventListener("message", (evt) => {
    logConsole("message 0", { evt });
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
logConsole("[SWr] message");


if (DEBUG_SW) {
    self.addEventListener('error', event => {
        logError('Global error:', event.error?.message || event.message, {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    });

    self.addEventListener('unhandledrejection', event => {
        logError('Unhandled promise rejection:', event.reason);
        // broadcastError('promise-rejection', event.reason?.message || 'Unknown rejection', event.reason);
    });

    // setTimeout(() => { throw Error("TEST") }, 1000);
}

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

//#endregion OLD




import {
    precacheAndRoute,
    registerRoute,
    clientsClaim,
} from "./ext/esm-4-workbox/workbox-bundle.js";
// logConsole("[SWr] import");

// 2. Register ALL event listeners immediately (before anything else)
self.addEventListener('install', event => {
    // console.log('[SW] Install phase started');
    event.waitUntil(
        precacheAndRoute(arrFiles, {
            ignoreURLParametersMatching: [/.*/],
            plugins: [cacheRepairPlugin],
            suppressWarnings: !DEBUG_SW  // from your debug toggle
        })
        /*
        .then(() => {
            console.log('[SW] Precaching completed');
            self.skipWaiting();
        })
        .catch(err => {
            console.error('[SW] Precaching failed:', err);
            throw err;  // keep install failing if bad file
        })
        */
    );
});

// 🛠️ 2. CONFIG & LIFECYCLE
// setConfig({ debug: true });
// coreSkipWaiting();
self.skipWaiting();
clientsClaim();
logConsole("[SWr] skip and claim");

// 🛠️ 3. THE SAFETY PLUGIN
const cacheRepairPlugin = {
    handlerDidError: async ({ request, error }) => {
        console.warn(`⚠️ Precaching failed for: ${request.url}. Skipping to prevent REDUNDANT state.`, error);
        return null;
    }
};
logConsole("[SWr] cacheReapairPlugin");

// 📦 4. PRECACHING
const arrFiles = [
    // Running
    { "revision": "ebf5bcbb98e9f02b19e9439033f4bcaa", "url": "twa-manifest.json" },
    { "revision": "6359fce8d65ce94a31463003518cb741", "url": "tsconfig.json" },
    { "revision": "bb58ff4ae453afac110c409b7884ade9", "url": "sw-test-esm.js" },
    { "revision": "bb9a6b6e40f5f223c95e8e977d301fb3", "url": "sw-input-my.js" },
    { "revision": "d02bb33d4abc6f3acc97e119c4a20c13", "url": "signaling-server.mjs" },
    { "revision": "d9ed644ede566fd688383ff6036833df", "url": "rxdb-setup.js" },
    { "revision": "b58f300b773ffcf1b8f2e96f03825ff1", "url": "pwa.js" },
    { "revision": "9e29fe449e5518391f24097d35462d0f", "url": "pwa-not-cached.js" },
    { "revision": "dea265f8c58e19fa27b82b3235a64358", "url": "puter-ai-models.js" },
    { "revision": "b15df6ec07f89c71be32fc176ec9b59d", "url": "prerender.json" },
    { "revision": "ba90bdcbf75e9746cd805100dc4ebbb1", "url": "package-lock.json" },
    { "revision": "7bda15e7646cf431af66d437defb5409", "url": "OLDpackage.json" },
    { "revision": "c68f5d30861b088a4f8c64c34eda57b2", "url": "nearly-ok-sw-input.js" },
    { "revision": "2d69fb977c8b7850575fdedc3a851fca", "url": "mobile-disp-bug.html" },
    { "revision": "133714521e112110c56b6d4c57ad9658", "url": "mobile-disp-bug-workaround.html" },
    { "revision": "c9fed479fafdac6bc2fadd754e51df3c", "url": "mm4i-template.html" },
    { "revision": "fba595fa23b8408ca222a1345a612e3b", "url": "mm4i-prerender.html" },
    { "revision": "fa3f720da3b10b2cdce99b2eeff1b970", "url": "mm4i-importmaps.js" },
    { "revision": "3c8925ce44200826595d1b474452a81f", "url": "init-error.js" },
    { "revision": "5c3b624ce775641f4e61c7073c01ffbd", "url": "init-error-new.js" },
    { "revision": "84b973925e4c58c9d9a017f270d102ec", "url": "global-types.js" },
    { "revision": "408925733a3ad8aa41fa5c280502331a", "url": "check-precaching.js" },
    { "revision": "d54ee3a7345005ed045a0e716ea55705", "url": "anchors-with-base.js" },
    { "revision": "62ec240a113c0d7357326d43fedc5f1a", "url": "js/mm4i-share-link.js" },
    { "revision": "fd18f780fa54e3cc0bb6ca33e5083596", "url": "js/mm4i-replication.js" },
    { "revision": "e50667263d79c82fd65ce460e87f78c5", "url": "js/mm4i-fsm.js" },
    { "revision": "93f82e3914e66d5ca1ecc175a611bde5", "url": "js/mm4i-delegate-events.js" },
    { "revision": "a2db8964c2b4eecd91976f6a70ab6ea7", "url": "js/mindmap-helpers.js" },
    { "revision": "d6c26bc43e21004e54a0e6eec1f65797", "url": "js/jsmind-edit-common.js" },
    { "revision": "95e0ab6a870a2f3b06ab333aa57b737f", "url": "js/jsmind-cust-rend.js" },
    { "revision": "ca6e6a29b941910cebabf222c5cfea10", "url": "js/db-mindmaps.js" },
    { "revision": "becc2fb9a5723b96e3e58f2d93390bec", "url": "js/umd/idb.js" },
    { "revision": "34a328a34a95a49f1e5f0650722eb039", "url": "js/TEST/test.js" },
    { "revision": "49596749a4905778f6de927e336588b2", "url": "js/mod/zoom-move.js" },
    { "revision": "f44031ca248d87c2d07ff9f4e7c89a5f", "url": "js/mod/woff2-mdc-symbols.js" },
    { "revision": "80caf23de8532695be22382f4bb81ac8", "url": "js/mod/woff-codepoints.js" },
    { "revision": "56ac01ad06d0a79592d420789de23faf", "url": "js/mod/webrtc-2-peers.js" },
    { "revision": "495ce887e79ea64de008ef6892f63cd8", "url": "js/mod/util-mdc.js" },
    { "revision": "cd6bd9f07fad5d3a13e549f68ac784d8", "url": "js/mod/undo-redo-tree.js" },
    { "revision": "d0b97209317e58be2ec1d3c5233acd40", "url": "js/mod/tools.js" },
    { "revision": "cd657f91ce759bad54500c98f8f6fb8f", "url": "js/mod/toast-ui-helpers.js" },
    { "revision": "28af8eee2af24055a2afe9a51c40e5de", "url": "js/mod/supabase-sign-in.js" },
    { "revision": "9722b1c56fb9b9d6a64b968fdbcaefea", "url": "js/mod/stairs.js" },
    { "revision": "d3428fe05bcd7baef7da0c09f3d375ed", "url": "js/mod/shield-click.js" },
    { "revision": "0b41a6962e345f98f61214cc1b4eaf87", "url": "js/mod/rd-parser.js" },
    { "revision": "4392a85784fc363e680eb5ed1848570a", "url": "js/mod/my-svg.js" },
    { "revision": "f34ee42be8dacc7c23268b721eec32b6", "url": "js/mod/move-help.js" },
    { "revision": "0a2a37bc9a0cfc5592c5e7de8af76bea", "url": "js/mod/local-settings.js" },
    { "revision": "b64279f32e16712ed98f1b2992b233f4", "url": "js/mod/jssm-tools.js" },
    { "revision": "4674fa5e699403a7a2cbc0b0afe898d2", "url": "js/mod/is-displayed.js" },
    { "revision": "da22f1426ebaf288bdec4a8740fb1c5b", "url": "js/mod/images.js" },
    { "revision": "f7b7191375e69fdad9273f78a6db7f4f", "url": "js/mod/idb-replicator.js" },
    { "revision": "f1dfa4e81489a5379008514c67d15eb0", "url": "js/mod/idb-common.js" },
    { "revision": "973f297289c4b4f62ecef14579d2e123", "url": "js/mod/grammar-search.js" },
    { "revision": "53f2440670e7105fe6c016adb11601da", "url": "js/mod/donate.js" },
    { "revision": "edb851d2d4880fd780f2f497a6e1f5b1", "url": "js/mod/delegate-fsm-xstate.js" },
    { "revision": "665a4bed6e07bb5e7c5c25990672afc4", "url": "js/mod/delegate-fsm-jssm.js" },
    { "revision": "ba2b511552d9a171d579fb5b2819007c", "url": "js/mod/delegate-events.js" },
    { "revision": "87fbd5012c7e23fb22cd0e4af6310929", "url": "js/mod/color-tools.js" },
    { "revision": "5304cc8040012be30b4b8b14a262b19d", "url": "js/mod/ai-helpers.js" },
    { "revision": "8181d11e3a1285d761911769d748ba7a", "url": "js/mod/acc-colors.js" },
    { "revision": "318c72e54a8bb5683233355911f17a9a", "url": "img/top-right-resizer.svg" },
    { "revision": "ac16c8c5732e07a351c06556bdf7dcde", "url": "img/tag16px.svg" },
    { "revision": "ac16c8c5732e07a351c06556bdf7dcde", "url": "img/tag.svg" },
    { "revision": "e1ed2e17620fabc789fb164091f82aad", "url": "img/search16px.svg" },


    // Running
    { "revision": "47ab9469a9a2d70cf42f04aea303f4c1", "url": "img/search14px.svg" },
    { "revision": "a13bf67f53982fc94d5c23d3f5265a12", "url": "img/search.svg" },
    { "revision": "57d0780a4773391bcc8585130307ebfc", "url": "img/mm4i.svg" },
    { "revision": "ef8b8228895ae7731fe4dbd6416e55f5", "url": "img/mm4i-old.svg" },
    { "revision": "57d0780a4773391bcc8585130307ebfc", "url": "img/mm4i-4.svg" },
    { "revision": "932ed826287101ced6447cea970bd091", "url": "img/mistral-ai-rainbow.svg" },
    { "revision": "b5ab73f79cc0d5f30d24e4088ca3a3c7", "url": "img/groq-spaced.svg" },
    { "revision": "a2ab66d66be6a8919c5a774d98201cdb", "url": "img/groq-image.svg" },
    { "revision": "317d22926cbf7a511398fef671a4109d", "url": "img/account_circle.svg" },
    { "revision": "dd800b074c1f1fde607a194db5f99d73", "url": "ext/viz-js/viz-standalone.mjs" },
    { "revision": "e6c066c58cce456ad016cfe8f8d06f0e", "url": "ext/toast-ui/editor/3.2.2.js" },
    { "revision": "19660878b7f65fc7093788ef7d8b89f8", "url": "ext/puter/puter.svg" },
    { "revision": "2a00e6cab1259f076d22727b4d812dea", "url": "ext/puter/puter-ai-models.js" },
    { "revision": "bf2c4e5bfd41b73dcdd8f564cb820413", "url": "ext/puter/fetch-puter-ai-models.js" },
    { "revision": "1b447e24b63d6870c0f22dd175197329", "url": "ext/no-ui-slider/nouislider.mjs" },
    { "revision": "2765cb470721f9132df5e0fc1506a6ec", "url": "ext/mdc-fonts/OLDmy-symbols.woff2" },
    { "revision": "ffc26b43178350aeeae62099d3831b6e", "url": "ext/mdc-fonts/my-symbols.woff2" },


    // Running
    { "revision": "6e6a7e579d05b6b97b7b832e99f9b989", "url": "ext/mdc/material-components-web.js" },
    { "revision": "53d18e621da7f1dccc0ab19bc82d5f8e", "url": "ext/jssm/jssm.es6.mjs" },
    { "revision": "def2ab7ed9f8b54cd9b17a401ff3f4f7", "url": "ext/jsmind/testing/mm4i-jsmind.drag-node.js" },
    { "revision": "c9ed0a6d6161e42f2eda6da697507b71", "url": "ext/jsmind/testing/jsmind-mm4i.js" },

    // Running
    { "revision": "b8f53617aaee6d5595f1afb4a2491d2f", "url": "ext/jsmind/es6/jsmind.js" },
    { "revision": "0187ccb3587519b708cc9dea0a410040", "url": "ext/jsmind/es6/jsmind.draggable-node.js" },
    { "revision": "8c5b3fabd9ee48d80353fcf34743f2c1", "url": "ext/esm-4-workbox/workbox-bundle.js" },

    // Running
    { "revision": "009364c3aff2b99f82b8242567025300", "url": "ext/dmp/diff_match_patch_uncompressed.js" },

    // Running
    { "revision": "e8f6ec568ea5608cf37cbc13d4c1ed1d", "url": "api/api-proxy.js" },

    // Trying to install
    { "revision": "cf4a419c9e6fbed11f38a310ca590eff", "url": "api/supabase-oauth/callback.html" }
    /*
    // Trying to install
    */
]
logConsole("[SWr]", { arrFiles });



/*
precacheAndRoute(
    arrFiles
    ,
    {
        ignoreURLParametersMatching: [/.* /],
        plugins: [cacheRepairPlugin]
    });
logConsole("[SWr] precacheAndRoute");
*/
// === INSTALL PHASE WITH BETTER VISIBILITY ===
/*
self.addEventListener('install', event => {
    logStrongConsole('Install phase started');

    event.waitUntil(
        precacheAndRoute(arrFiles, {
            ignoreURLParametersMatching: [/.* /],
            plugins: [cacheRepairPlugin],
            // Optional: only suppress warnings in production
            suppressWarnings: !DEBUG_SW
        })
            .then(() => {
                logStrongConsole('Precaching completed successfully');
                self.skipWaiting();
            })
            .catch(err => {
                logError('Precaching FAILED — install will not complete', err);
                /*
                broadcastError('precache-failed', err.message || 'Unknown precache error', {
                  stack: err.stack,
                  // Workbox often includes the failing URL in err.message
                });
                * /
                // Re-throw so the install phase still fails visibly
                throw err;
            })
    );
});
*/



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
            logError("Failed to serve page from cache or network.", { error, request });
            throw error;
        }
    }
);
logConsole("[SWr] registerRoute");