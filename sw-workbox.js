// @NOts-check
// FIX-ME: ts-check does not work correct in this file, why?

const SW_VERSION = "0.1.606";

// https://www.npmjs.com/package/workbox-sw
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');


// throw Error("Test worker error");
// const SWlogColors = "color: green; background: yellow;";

const SWlogStyle = "color: green; background: yellow; padding:2px; border-radius:2px;";
const SWlogStrongStyle = SWlogStyle + " font-size:18px;";
function logConsole(...msg) {
    console.log(`%csw-workbox.js`, SWlogStyle, ...msg);
}
function logStrongConsole(...msg) {
    console.log(`%csw-workbox.js`, SWlogStrongStyle, ...msg);
}
logStrongConsole(`${SW_VERSION} is here`);

// https://stackoverflow.com/questions/61080783/handling-errors-in-async-event-handlers-in-javascript-in-the-web-browser
// Error handling with Async/Await in JS - ITNEXT
// https://itnext.io/error-handling-with-async-await-in-js-26c3f20bc06a
function errorHandlerAsyncEvent(asyncFun) {
    // console.warn("typeof asyncFun", typeof asyncFun);
    return function (evt) {
        asyncFun(evt).catch(err => {
            console.log("handler", err);
            // debugger; // eslint-disable-line no-debugger
            throw err;
        })
    }
}

const workbox = globalThis["workbox"];

workbox.setConfig({
    debug: false
});

workbox.precaching.precacheAndRoute([{"revision":"d54ee3a7345005ed045a0e716ea55705","url":"anchors-with-base.js"},{"revision":"009364c3aff2b99f82b8242567025300","url":"ext/dmp/diff_match_patch_uncompressed.js"},{"revision":"0187ccb3587519b708cc9dea0a410040","url":"ext/jsmind/es6/jsmind.draggable-node.js"},{"revision":"b8f53617aaee6d5595f1afb4a2491d2f","url":"ext/jsmind/es6/jsmind.js"},{"revision":"c9ed0a6d6161e42f2eda6da697507b71","url":"ext/jsmind/testing/jsmind-mm4i.js"},{"revision":"0c0b814a95da9f10802fc2023a890f0d","url":"ext/jsmind/testing/mm4i-jsmind.drag-node.js"},{"revision":"53d18e621da7f1dccc0ab19bc82d5f8e","url":"ext/jssm/jssm.es6.mjs"},{"revision":"78dfcfe673126db4a2793092e893d56c","url":"ext/mdc-fonts/my-symbols.woff2"},{"revision":"c43564d401e5384868fbc0c7698533d9","url":"ext/mdc-fonts/OLDmy-symbols.woff2"},{"revision":"6e6a7e579d05b6b97b7b832e99f9b989","url":"ext/mdc/material-components-web.js"},{"revision":"1b447e24b63d6870c0f22dd175197329","url":"ext/no-ui-slider/nouislider.mjs"},{"revision":"e6c066c58cce456ad016cfe8f8d06f0e","url":"ext/toast-ui/editor/3.2.2.js"},{"revision":"dd800b074c1f1fde607a194db5f99d73","url":"ext/viz-js/viz-standalone.mjs"},{"revision":"57d0780a4773391bcc8585130307ebfc","url":"img/mm4i-4.svg"},{"revision":"ef8b8228895ae7731fe4dbd6416e55f5","url":"img/mm4i-old.svg"},{"revision":"57d0780a4773391bcc8585130307ebfc","url":"img/mm4i.svg"},{"revision":"a13bf67f53982fc94d5c23d3f5265a12","url":"img/search.svg"},{"revision":"47ab9469a9a2d70cf42f04aea303f4c1","url":"img/search14px.svg"},{"revision":"e1ed2e17620fabc789fb164091f82aad","url":"img/search16px.svg"},{"revision":"ac16c8c5732e07a351c06556bdf7dcde","url":"img/tag.svg"},{"revision":"ac16c8c5732e07a351c06556bdf7dcde","url":"img/tag16px.svg"},{"revision":"318c72e54a8bb5683233355911f17a9a","url":"img/top-right-resizer.svg"},{"revision":"3ba90e2a4635e3a77c76370c84843a23","url":"index.html"},{"revision":"13dcb3943e9497001c2f86fb2608ec53","url":"init-error.js"},{"revision":"dd638777e66fb39193be0e64af9d6393","url":"js/db-mindmaps.js"},{"revision":"c5dece4a4c10f65c3a9bb271859a0431","url":"js/jsmind-cust-rend.js"},{"revision":"aaf9d6d3a5c49798bffa23203dd4a046","url":"js/jsmind-edit-common.js"},{"revision":"42fede8bc792de5ae7d2b064da27880f","url":"js/mindmap-helpers.js"},{"revision":"27af8c41d836c274c549dc92f60e35f5","url":"js/mm4i-fsm.js"},{"revision":"b82513f28739910cae261b6854ad7fad","url":"js/mm4i-replication.js"},{"revision":"0c167611f29f869bb2edd0f4cff8daa9","url":"js/mm4i-share-link.js"},{"revision":"8181d11e3a1285d761911769d748ba7a","url":"js/mod/acc-colors.js"},{"revision":"8e9861c536b714ee8e9be4bb38f56593","url":"js/mod/color-tools.js"},{"revision":"973f297289c4b4f62ecef14579d2e123","url":"js/mod/grammar-search.js"},{"revision":"f1dfa4e81489a5379008514c67d15eb0","url":"js/mod/idb-common.js"},{"revision":"f7b7191375e69fdad9273f78a6db7f4f","url":"js/mod/idb-replicator.js"},{"revision":"da22f1426ebaf288bdec4a8740fb1c5b","url":"js/mod/images.js"},{"revision":"4674fa5e699403a7a2cbc0b0afe898d2","url":"js/mod/is-displayed.js"},{"revision":"f555f50cd6a392a67441f978649ecb93","url":"js/mod/jssm-tools.js"},{"revision":"f191e4f3fe20e8a5aa1787fc7af4ac86","url":"js/mod/local-settings.js"},{"revision":"e67175cbac1fefaea4f865e8889863c7","url":"js/mod/move-help.js"},{"revision":"4392a85784fc363e680eb5ed1848570a","url":"js/mod/my-svg.js"},{"revision":"0b41a6962e345f98f61214cc1b4eaf87","url":"js/mod/rd-parser.js"},{"revision":"d3428fe05bcd7baef7da0c09f3d375ed","url":"js/mod/shield-click.js"},{"revision":"f2bbc6b8f7e2243d6495de28c7e53723","url":"js/mod/stairs.js"},{"revision":"17920dd1f39d2177ae072fe03bb0361b","url":"js/mod/toast-ui-helpers.js"},{"revision":"93ede2cddd5a7c79c3db3c31c23c5261","url":"js/mod/tools.js"},{"revision":"22068d6fbc789b1dd618aa69d0978293","url":"js/mod/undo-redo-tree.js"},{"revision":"0603b18e409c1fe002c2a198ceac2588","url":"js/mod/util-mdc.js"},{"revision":"56ac01ad06d0a79592d420789de23faf","url":"js/mod/webrtc-2-peers.js"},{"revision":"fff688be02f75e9da2b29124e98c0267","url":"js/mod/woff-codepoints.js"},{"revision":"07ba9f1ae8baa33af2be1d25ebbbd081","url":"js/mod/woff2-mdc-symbols.js"},{"revision":"841611c2516003b63148b026f38dce1b","url":"js/mod/zoom-move.js"},{"revision":"34a328a34a95a49f1e5f0650722eb039","url":"js/TEST/test.js"},{"revision":"becc2fb9a5723b96e3e58f2d93390bec","url":"js/umd/idb.js"},{"revision":"3c005eb56f2a2f31c1eace1d3bde288e","url":"mm4i-importmaps.js"},{"revision":"fba595fa23b8408ca222a1345a612e3b","url":"mm4i-prerender.html"},{"revision":"a123f070bcc74ee28f347725c38d9862","url":"mm4i-template.html"},{"revision":"133714521e112110c56b6d4c57ad9658","url":"mobile-disp-bug-workaround.html"},{"revision":"2d69fb977c8b7850575fdedc3a851fca","url":"mobile-disp-bug.html"},{"revision":"7bda15e7646cf431af66d437defb5409","url":"OLDpackage.json"},{"revision":"c2d473dcbd30a230ef560a252e66b720","url":"package-lock.json"},{"revision":"c3e409d356e7e521e6b640ee9b6492a9","url":"pwa-not-cached.js"},{"revision":"d8e51d04a3df452339e1b597d74aae8c","url":"pwa.js"},{"revision":"d9ed644ede566fd688383ff6036833df","url":"rxdb-setup.js"},{"revision":"d02bb33d4abc6f3acc97e119c4a20c13","url":"signaling-server.mjs"},{"revision":"7461b321ee21e757932256b3b041ae5d","url":"workbox-config.js"}])

// Serve your main HTML for all navigation requests (perpexity)
workbox.routing.registerRoute(
    ({ request, url }) => {
        if (request.mode !== 'navigate') return false;
        // debugger;
        // console.log("registerRoute, url", url);
        if (url.pathname == "/mm4i/") return false; // README.md
        return true;
    },
    // workbox.precaching.createHandlerBoundToURL('mm4i.html');
    workbox.precaching.createHandlerBoundToURL('mm4i-template.html')
);




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


///// Save some code for possible later use:
/*

// https://stackoverflow.com/questions/38168276/navigator-serviceworker-controller-is-null-until-page-refresh
// https://stackoverflow.com/questions/70331036/why-service-workers-fetch-event-handler-not-being-called-but-still-worked


self.addEventListener("install", (evt) => {
    // console.warn("service-worker install event");
    evt.waitUntil(self.skipWaiting()); // Activate worker immediately
});

function displayNotification(title, body, url) {
    // https://stackoverflow.com/questions/29774836/failed-to-construct-notification-illegal-constructor
    const action = "display-url";
    const data = { url, action }
    const tag = "Flashcard 4 Internet";
    // const icon = "/img/192.png";
    const icon = "/img/fc4i.svg";
    const options = {
        body, data, tag, icon
        // silent: true,
    }
    if (Notification.permission !== "granted") {
        console.error("Notification requested but not permitted");
        return false;
    }
    // console.log("%cdisplayNotification", logColors, { title, options });
    logConsole("displayNotification", { title, options });
    self.registration.showNotification(title, options);
    return true;
}
async function shareTargetHandler(evt) {
    logStrongConsole("shareTargetHandler");
    logStrongConsole("shareTargetHandler", { evt }, evt.respondWith);
    // const formData = await evt.request.formData();
    // console.warn({ formData });
    // clients.openWindow("share.html?text=DUMMY-TEXT&title=DUMMY-title&url=DUMMY-url");
    // evt.respondWith(fetch("/share.html&text=dummytext&title=dummytitle&url=dummyurl"));
    // return;
}

// https://stackoverflow.com/questions/58051656/how-to-send-a-message-from-service-worker-to-a-workbox-class-instances-message
async function broadcastToClients(msg) {
    console.log("broadcaseToClients", { msg });
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
        client.postMessage(msg);
    }
}

// const tzMin = new Date().getTimezoneOffset();
// const tzMs = tzMin * 60 * 1000;
// function toLocalISOString(date) { return new Date(date.getTime() - tzMs).toISOString(); }
// function toOurTime(date) { return toLocalISOString(date).slice(0, -8).replace("T", " "); }

// process.on('uncaughtException', function (err) { console.log("%cuncaughtException in service worker", logColors, { err }); });

*/

// https://web.dev/workbox-share-targets/
// Only for POST!
/*
workbox.routing.registerRoute(
    "/share",
    shareTargetHandler,
    "GET"
);
console.warn("service-worker.js after registerRoute /share");
*/

