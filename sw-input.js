// @ts-check

const SW_VERSION = "0.2.319-GEMINI-P";

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

// 🔑 SAFE SYNCHRONOUS CONFIGURATION
workbox.setConfig({ debug: false });


// 🔑 ONLY synchronous imports required for the registerRoute call.
// The precache import is MOVED inside the 'install' handler.
const { registerRoute } = workbox.routing;
const { matchPrecache } = workbox.precaching; 


// ✅ MANIFEST REMAINS SYNCHRONOUSLY DEFINED (This is just data)
const PRECACHE_MANIFEST = [{"revision":"d54ee3a7345005ed045a0e716ea55705","url":"anchors-with-base.js"},{"revision":"a03c958377cae0d73672717202518f0d","url":"api/my-prerender.js"},{"revision":"009364c3aff2b99f82b8242567025300","url":"ext/dmp/diff_match_patch_uncompressed.js"},{"revision":"0187ccb3587519b708cc9dea0a410040","url":"ext/jsmind/es6/jsmind.draggable-node.js"},{"revision":"b8f53617aaee6d5595f1afb4a2491d2f","url":"ext/jsmind/es6/jsmind.js"},{"revision":"c9ed0a6d6161e42f2eda6da697507b71","url":"ext/jsmind/testing/jsmind-mm4i.js"},{"revision":"5d39ee829b7761658adb1fc499ee2bc7","url":"ext/jsmind/testing/mm4i-jsmind.drag-node.js"},{"revision":"53d18e621da7f1dccc0ab19bc82d5f8e","url":"ext/jssm/jssm.es6.mjs"},{"revision":"8128415f74aaacd6243e305d4e4ad355","url":"ext/mdc-fonts/my-symbols.woff2"},{"revision":"c2a988933a7d3ac7056486f0e0a21572","url":"ext/mdc-fonts/OLDmy-symbols.woff2"},{"revision":"6e6a7e579d05b6b97b7b832e99f9b989","url":"ext/mdc/material-components-web.js"},{"revision":"1b447e24b63d6870c0f22dd175197329","url":"ext/no-ui-slider/nouislider.mjs"},{"revision":"bf2c4e5bfd41b73dcdd8f564cb820413","url":"ext/puter/fetch-puter-ai-models.js"},{"revision":"2a00e6cab1259f076d22727b4d812dea","url":"ext/puter/puter-ai-models.js"},{"revision":"19660878b7f65fc7093788ef7d8b89f8","url":"ext/puter/puter.svg"},{"revision":"e6c066c58cce456ad016cfe8f8d06f0e","url":"ext/toast-ui/editor/3.2.2.js"},{"revision":"dd800b074c1f1fde607a194db5f99d73","url":"ext/viz-js/viz-standalone.mjs"},{"revision":"932ed826287101ced6447cea970bd091","url":"img/mistral-ai-rainbow.svg"},{"revision":"57d0780a4773391bcc8585130307ebfc","url":"img/mm4i-4.svg"},{"revision":"ef8b8228895ae7731fe4dbd6416e55f5","url":"img/mm4i-old.svg"},{"revision":"57d0780a4773391bcc8585130307ebfc","url":"img/mm4i.svg"},{"revision":"a13bf67f53982fc94d5c23d3f5265a12","url":"img/search.svg"},{"revision":"47ab9469a9a2d70cf42f04aea303f4c1","url":"img/search14px.svg"},{"revision":"e1ed2e17620fabc789fb164091f82aad","url":"img/search16px.svg"},{"revision":"ac16c8c5732e07a351c06556bdf7dcde","url":"img/tag.svg"},{"revision":"ac16c8c5732e07a351c06556bdf7dcde","url":"img/tag16px.svg"},{"revision":"318c72e54a8bb5683233355911f17a9a","url":"img/top-right-resizer.svg"},{"revision":"731d41d39d7289b8b010e965b51117e1","url":"init-error.js"},{"revision":"6cffe96454437cb60313d874cf3a0113","url":"js/db-mindmaps.js"},{"revision":"4c9369973b6cf23406a765b4fd1e1e7a","url":"js/jsmind-cust-rend.js"},{"revision":"4403ae584c225a37abcba7c8744b56ac","url":"js/jsmind-edit-common.js"},{"revision":"b057388a9b4b2204f4b40f2a92e85084","url":"js/mindmap-helpers.js"},{"revision":"c8baf7c5d1b80da42baf49797f659400","url":"js/mm4i-fsm.js"},{"revision":"b82513f28739910cae261b6854ad7fad","url":"js/mm4i-replication.js"},{"revision":"62ec240a113c0d7357326d43fedc5f1a","url":"js/mm4i-share-link.js"},{"revision":"8181d11e3a1285d761911769d748ba7a","url":"js/mod/acc-colors.js"},{"revision":"1f636e5da153d06b5a8686552548d169","url":"js/mod/ai-helpers.js"},{"revision":"87fbd5012c7e23fb22cd0e4af6310929","url":"js/mod/color-tools.js"},{"revision":"973f297289c4b4f62ecef14579d2e123","url":"js/mod/grammar-search.js"},{"revision":"f1dfa4e81489a5379008514c67d15eb0","url":"js/mod/idb-common.js"},{"revision":"f7b7191375e69fdad9273f78a6db7f4f","url":"js/mod/idb-replicator.js"},{"revision":"da22f1426ebaf288bdec4a8740fb1c5b","url":"js/mod/images.js"},{"revision":"4674fa5e699403a7a2cbc0b0afe898d2","url":"js/mod/is-displayed.js"},{"revision":"b64279f32e16712ed98f1b2992b233f4","url":"js/mod/jssm-tools.js"},{"revision":"0a2a37bc9a0cfc5592c5e7de8af76bea","url":"js/mod/local-settings.js"},{"revision":"e67175cbac1fefaea4f865e8889863c7","url":"js/mod/move-help.js"},{"revision":"4392a85784fc363e680eb5ed1848570a","url":"js/mod/my-svg.js"},{"revision":"0b41a6962e345f98f61214cc1b4eaf87","url":"js/mod/rd-parser.js"},{"revision":"d3428fe05bcd7baef7da0c09f3d375ed","url":"js/mod/shield-click.js"},{"revision":"9722b1c56fb9b9d6a64b968fdbcaefea","url":"js/mod/stairs.js"},{"revision":"cd657f91ce759bad54500c98f8f6fb8f","url":"js/mod/toast-ui-helpers.js"},{"revision":"d2adb1ce0cb5cc3daed06323703ca9ef","url":"js/mod/tools.js"},{"revision":"64232cf91e54da59a334c4e2339cef40","url":"js/mod/undo-redo-tree.js"},{"revision":"3d20d64659aca9c539c4eb6842926811","url":"js/mod/util-mdc.js"},{"revision":"56ac01ad06d0a79592d420789de23faf","url":"js/mod/webrtc-2-peers.js"},{"revision":"55bc2693db4265aa419f6fbadc1e78fd","url":"js/mod/woff-codepoints.js"},{"revision":"bb1603d87e3585419e6d2612d80b3518","url":"js/mod/woff2-mdc-symbols.js"},{"revision":"841611c2516003b63148b026f38dce1b","url":"js/mod/zoom-move.js"},{"revision":"34a328a34a95a49f1e5f0650722eb039","url":"js/TEST/test.js"},{"revision":"becc2fb9a5723b96e3e58f2d93390bec","url":"js/umd/idb.js"},{"revision":"c8acc817745f3f84d9205fbb00ac4230","url":"mm4i-importmaps.js"},{"revision":"fba595fa23b8408ca222a1345a612e3b","url":"mm4i-prerender.html"},{"revision":"c566e6bd548d951594205123a350377f","url":"mm4i-template.html"},{"revision":"133714521e112110c56b6d4c57ad9658","url":"mobile-disp-bug-workaround.html"},{"revision":"2d69fb977c8b7850575fdedc3a851fca","url":"mobile-disp-bug.html"},{"revision":"c68f5d30861b088a4f8c64c34eda57b2","url":"nearly-ok-sw-input.js"},{"revision":"7bda15e7646cf431af66d437defb5409","url":"OLDpackage.json"},{"revision":"ee30a81c8484d7f95e92aae94dfd61a2","url":"package-lock.json"},{"revision":"e6e5fc18fe3624ab15e9e686c0e1cf36","url":"prerender.json"},{"revision":"dea265f8c58e19fa27b82b3235a64358","url":"puter-ai-models.js"},{"revision":"b66e5666fb4ed1711c92eb4e62b19b97","url":"pwa-not-cached.js"},{"revision":"9a040b90d6ff2637d699f332fc865bd8","url":"pwa.js"},{"revision":"d9ed644ede566fd688383ff6036833df","url":"rxdb-setup.js"},{"revision":"d02bb33d4abc6f3acc97e119c4a20c13","url":"signaling-server.mjs"},{"revision":"bb9a6b6e40f5f223c95e8e977d301fb3","url":"sw-input-my.js"},{"revision":"ebf5bcbb98e9f02b19e9439033f4bcaa","url":"twa-manifest.json"}];

// 1. Custom "install" handler
self.addEventListener("install", (event) => {
    logStrongConsole('Service Worker installing custom handler (with error catch)...');
    
    // 🔑 FIX: Import precache INSIDE the install handler.
    const { precache } = workbox.precaching;

    event.waitUntil(
        (async () => {
            try {
                logStrongConsole('In waitUntil');
                await precache(PRECACHE_MANIFEST, {
                    ignoreURLParametersMatching: [/.*/],
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
    
    // 🔑 FIX: Call skipWaiting (if needed) inside the install handler.
    workbox.core.skipWaiting(); 
});


// 2. Custom Navigation Route
registerRoute(
    // Your custom match callback
    ({ request, url }) => {
        if (request.mode !== 'navigate') return false;
        if (url.pathname === '/mm4i/') return false;
        return true;
    },
    // The handler function
    async ({ request }) => {
        // Use the top-level destructured 'matchPrecache'
        const precachedResponse = await matchPrecache(request.url);
        if (precachedResponse) {
            return precachedResponse;
        }

        try {
            return await fetch(request);
        } catch (error) {
            throw error;
        }
    }
);


// 3. Message handler
self.addEventListener("message", errorHandlerAsyncEvent(async evt => {
    if (evt.data?.eventType == "ping") return;
    if (evt.data?.eventType == "keyChanged") return;

    let msgType = "(NO TYPE)";
    if (evt.data) {
        msgType = evt.data.type;
    }
    logConsole("message", { evt, msgType });
    if (evt.data) {
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


// 4. Activate handler
self.addEventListener("activate", (evt) => {
    logStrongConsole("service-worker activate event");
    // Use native method for claiming clients
    evt.waitUntil(self.clients.claim()); 
    // workbox.core.clientsClaim() is generally redundant here.
});