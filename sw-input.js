// @NOts-check
// FIX-ME: ts-check does not work correct in this file, why?

const SW_VERSION = "0.1.559";

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

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)

// Serve your main HTML for all navigation requests (perpexity)
workbox.routing.registerRoute(
    ({ request, url }) => {
        if (request.mode !== 'navigate') return false;
        // debugger;
        // console.log("registerRoute, url", url);
        if (url.pathname == "/mm4i/") return false; // README.md
        return true;
    },
    workbox.precaching.createHandlerBoundToURL('mm4i.html')
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

