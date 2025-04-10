//========== Specific ====================================================
const SW_VERSION = "0.1.30";


// https://www.npmjs.com/package/workbox-sw
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');


// throw Error("Test worker error");
const logColors = "color: green; background: yellow;";
// console.log(`%csw-worker-input.js ${SW_VERSION} is here`, logColors + " font-size: 20px;");

const logStyle = "color: green; background: yellow; padding:2px; border-radius:2px;";
const logStrongStyle = logStyle + " font-size:18px;";
function logConsole(...msg) {
    console.log(`%csw-workbox.js`, logStyle, ...msg);
}
function logStrongConsole(...msg) {
    console.log(`%csw-workbox.js`, logStrongStyle, ...msg);
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

const tzMin = new Date().getTimezoneOffset();
const tzMs = tzMin * 60 * 1000;
function toLocalISOString(date) { return new Date(date.getTime() - tzMs).toISOString(); }
function toOurTime(date) { return toLocalISOString(date).slice(0, -8).replace("T", " "); }



workbox.setConfig({
    debug: false
});

importScripts("js/umd/idb.js");
// importScripts("src/js/db-fc4i.js");
// console.log("%cservice-worker.js after import workbox-sw.js, idb.js and db-fc4i.js", logColors);
logConsole("After import workbox-sw.js, idb.js and db-fc4i.js");

// JavaScript timers do not survive SW shutdown. So check to notify here at SW startup:
(async () => {
    return; // Added a button instead
    /*
    const remindersSettings = await getSavedDialogValue();
    console.log({ remindersSettings });
    const checkReminders = remindersSettings?.autoReminders || true;
    if (checkReminders) {
        setTimeout(checkToNotify, 2000);
    }
    */
})();

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

workbox.precaching.precacheAndRoute([{"revision":"d54ee3a7345005ed045a0e716ea55705","url":"anchors-with-base.js"},{"revision":"c2b8c47c04a3dc35b3119f657dfb98f0","url":"ext/jsmind/testing/jsmind-mm4i.js"},{"revision":"d7c2715cb32c95f577c0e01be781b54b","url":"ext/jsmind/testing/mm4i-jsmind.drag-node.js"},{"revision":"6e6a7e579d05b6b97b7b832e99f9b989","url":"ext/mdc/material-components-web.js"},{"revision":"e6c066c58cce456ad016cfe8f8d06f0e","url":"ext/toast-ui/editor/3.2.2.js"},{"revision":"57d0780a4773391bcc8585130307ebfc","url":"img/mm4i-4.svg"},{"revision":"ef8b8228895ae7731fe4dbd6416e55f5","url":"img/mm4i-old.svg"},{"revision":"57d0780a4773391bcc8585130307ebfc","url":"img/mm4i.svg"},{"revision":"a13bf67f53982fc94d5c23d3f5265a12","url":"img/search.svg"},{"revision":"47ab9469a9a2d70cf42f04aea303f4c1","url":"img/search14px.svg"},{"revision":"e1ed2e17620fabc789fb164091f82aad","url":"img/search16px.svg"},{"revision":"13dcb3943e9497001c2f86fb2608ec53","url":"init-error.js"},{"revision":"91017d5d3b379d87eef8b8922bb398fd","url":"js/db-fc4i.js"},{"revision":"550d91e4c9eddf14eba187ab05716504","url":"js/db-mindmaps.js"},{"revision":"003572751a013866cdf1538f9fcd594d","url":"js/jsmind-cust-rend.js"},{"revision":"3709c354a2033e5a71d05937667f0cee","url":"js/jsmind-edit-common.js"},{"revision":"f8c52c62222ebc76d54a78f27f5b3de9","url":"js/jsmind-edit-spec-fc4i.js"},{"revision":"e6a9db9ce7de23e6ec8f9da6a16962b8","url":"js/mindmap-helpers.js"},{"revision":"7ae6dd00e957504c48555a4745d4baba","url":"js/mm4i-fsm.js"},{"revision":"4aafb4e9ee76827e04f51003cbca1394","url":"js/mm4i-replication.js"},{"revision":"8181d11e3a1285d761911769d748ba7a","url":"js/mod/acc-colors.js"},{"revision":"fa3ff65f520dfdc0d1d0a996d199dc8e","url":"js/mod/color-tools.js"},{"revision":"973f297289c4b4f62ecef14579d2e123","url":"js/mod/grammar-search.js"},{"revision":"f1dfa4e81489a5379008514c67d15eb0","url":"js/mod/idb-common.js"},{"revision":"f7b7191375e69fdad9273f78a6db7f4f","url":"js/mod/idb-replicator.js"},{"revision":"da22f1426ebaf288bdec4a8740fb1c5b","url":"js/mod/images.js"},{"revision":"4674fa5e699403a7a2cbc0b0afe898d2","url":"js/mod/is-displayed.js"},{"revision":"f555f50cd6a392a67441f978649ecb93","url":"js/mod/jssm-tools.js"},{"revision":"f8ca76c07a171074b1254cdf2f51a481","url":"js/mod/move-help.js"},{"revision":"4392a85784fc363e680eb5ed1848570a","url":"js/mod/my-svg.js"},{"revision":"0b41a6962e345f98f61214cc1b4eaf87","url":"js/mod/rd-parser.js"},{"revision":"d3428fe05bcd7baef7da0c09f3d375ed","url":"js/mod/shield-click.js"},{"revision":"6b2f2c208a6e3bd262d67e147fb54898","url":"js/mod/stairs.js"},{"revision":"15345e2ec1b8309c8d8bd6bdfa8a29ab","url":"js/mod/toast-ui-helpers.js"},{"revision":"97352509e2f6785a946b9aec0eb122ea","url":"js/mod/tools.js"},{"revision":"8b18c783b80215f359099be5e4c17850","url":"js/mod/util-mdc.js"},{"revision":"673b93226886d64655608deb4cd4a522","url":"js/mod/zoom-move.js"},{"revision":"34a328a34a95a49f1e5f0650722eb039","url":"js/TEST/test.js"},{"revision":"becc2fb9a5723b96e3e58f2d93390bec","url":"js/umd/idb.js"},{"revision":"77b6c7575b7edb271c0ee812d503053a","url":"mm4i-importmaps.js"},{"revision":"295fce9c874c5c772542df2ce2fff63a","url":"mm4i.html"},{"revision":"133714521e112110c56b6d4c57ad9658","url":"mobile-disp-bug-workaround.html"},{"revision":"2d69fb977c8b7850575fdedc3a851fca","url":"mobile-disp-bug.html"},{"revision":"7bda15e7646cf431af66d437defb5409","url":"OLDpackage.json"},{"revision":"c2d473dcbd30a230ef560a252e66b720","url":"package-lock.json"},{"revision":"9b1c2edb5e25f87927daa92b45ba87d2","url":"package.json"},{"revision":"1fe5a9c5f586b3c4c3ba615148b24098","url":"pwa-not-cached.js"},{"revision":"f272ab4f5eb6cafea4a00ccc98c84a54","url":"pwa.js"},{"revision":"d9ed644ede566fd688383ff6036833df","url":"rxdb-setup.js"},{"revision":"4a8df7bb205aa13ea73442e37eb4b992","url":"workbox-config.js"}])
/*
workbox.routing.registerRoute(
    /\.(?:js|css|webp|png|svg|html)$/,
    new workbox.strategies.StaleWhileRevalidate()
);
*/

// https://stackoverflow.com/questions/58051656/how-to-send-a-message-from-service-worker-to-a-workbox-class-instances-message
async function broadcastToClients(msg) {
    console.log("broadcaseToClients", { msg });
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
        client.postMessage(msg);
    }
}

/*
async function shareTargetHandler(evt) {
    logStrongConsole("shareTargetHandler");
    logStrongConsole("shareTargetHandler", { evt }, evt.respondWith);
    // const formData = await evt.request.formData();
    // console.warn({ formData });
    // clients.openWindow("share.html?text=DUMMY-TEXT&title=DUMMY-title&url=DUMMY-url");
    // evt.respondWith(fetch("/share.html&text=dummytext&title=dummytitle&url=dummyurl"));
    // return;
}
*/


async function checkToNotify(matchValues) {
    return;
    const db = await getDb();
    console.log("%cservice-worker", logColors, { idb, db });
    const toNotify = await getToNotifyNow(matchValues);
    console.log("%cservice-worker", logColors, { toNotify });
    const toNot0 = toNotify[0];
    let msg = "No expired reminders found";
    if (toNot0) {
        displayExpiredLongTimeNotification(toNot0);
        msg = "Found expired long time reminder";
    }
    // postMessage
    const data = { text: msg }
    broadcastToClients(data);
}
function displayNotificationFromRecord(expiredRecord, timerInfo) {
    // console.log("%cdisplayNotificationFromRecord", logColors, { expiredRecord, timerInfo });
    logConsole("displayNotificationFromRecord", { expiredRecord, timerInfo });
    const title = `(${timerInfo}) ${expiredRecord.title}`;
    const body = expiredRecord.desc;
    const encodedKey = decodeURIComponent(expiredRecord.key);
    const encodedTimerInfo = decodeURIComponent(timerInfo);
    const url = `${location.protocol}//${location.host}/share.html?key=${encodedKey}&timerInfo=${encodedTimerInfo}`;
    console.log("%ckey", "color:red; font-size:20px;", { url });

    const displayed = displayNotification(title, body, url);
    // console.log("%cwas displayed", logColors, { displayed });
    logConsole("Was displayed", { displayed });
}

async function displayExpiredLongTimeNotification(objExpired) {
    const { expiredRecord, expiredTimers } = objExpired;
    // console.log("%cdisplayExpiredLongTimeNotification", logColors, { objExpired, expiredRecord, expiredTimers });
    logConsole("displayExpiredLongTimeNotification", { objExpired, expiredRecord, expiredTimers });
    const timerInfo = expiredTimers[0].txtLength;

    displayNotificationFromRecord(expiredRecord, timerInfo);
    // FIX-ME: Move to db-fc4i.js
    // Save that we have notified:
    const recTimers = expiredRecord.timers;
    // {msDelay, msWhen, txtLength}
    // Change sign of msDelay when notification is sent.
    // There should only be one timer in expiredTimers now
    if (expiredTimers.length !== 1) throw Error('expiredTimers.length !== 1');
    const msDelayNotified = expiredTimers[0].msDelay;
    for (let i = 0; i < recTimers.length; i++) {
        recT = recTimers[i];
        if (recT.msDelay == msDelayNotified) {
            recT.msDelay = -recT.msDelay;
        }
    }
    // console.log("%cService Worker stored notification done", logColors);
    logConsole("Service Worker stored notification done");
}
self.addEventListener('notificationclick', (evt) => {
    // console.log("%cService Worker notificationclick", logColors, { evt });
    logConsole("notificationclick", { evt });
    if (!evt.notification.data.action) {
        // Was a normal notification click
        // console.log('%cNotification Click.', logColors);
        logConsole('Notification Click.');
        return;
    }
    switch (evt.notification.data.action) {
        case 'display-url':
            const url = evt.notification.data.url;
            // console.log(`%cDisplay url ${url}`, logColors);
            logConsole(`Display url ${url}`);
            clients.openWindow(url);
            break;
        default:
            // console.log(`%cUnknown action clicked: '${evt.action}'`, logColors);
            logStrongConsole(`Unknown action clicked: '${evt.action}'`);
            break;
    }
});


let tmrCheck;

// process.on('uncaughtException', function (err) { console.log("%cuncaughtException in service worker", logColors, { err }); });

let tmrAutoCheck;
const adjustTmrAutoCheck = async () => {
    return;
    // throw Error("adjustTmrAutoCheck ")
    console.log("%cadjustTmrAutoCheck", logColors);
    // const db = await getDb();
    // const keyRec = await db.get(idbStoreName, key);
    const recAutoReminders = await getSavedDialogValue();
    const time = recAutoReminders.time;
    const hr = time.slice(0, 2);
    const mn = time.slice(3, 5);
    const now = new Date();
    const nowTime = `${now.getHours()}:${now.getMinutes()}`;
    const wdToday = now.getDay();
    let waitDays;
    for (let j = 0; j < 7; j++) {
        const wd = (j + wdToday) % 7;
        const wdActive = recAutoReminders[wd];
        if (wdActive) {
            if (j == 0) { if (nowTime > time) continue; }
            waitDays = j;
            break;
        }
    }
    if (tmrAutoCheck) clearTimeout(tmrAutoCheck.tmr);
    tmrAutoCheck = undefined;
    if (waitDays == undefined) {
        broadcastToClients({ text: `Saved your preferences. Will not check for reminders.` })
        return;
    }
    // https://stackoverflow.com/questions/563406/how-to-add-days-to-date
    const dateCheck = new Date(now);
    dateCheck.setDate(dateCheck.getDate() + waitDays);
    dateCheck.setHours(hr);
    dateCheck.setMinutes(mn);
    console.log(`%cCheck at: ${dateCheck}`, "font-size:20px");

    // const delay = dateCheck.getTime() - now.getTime();
    const msDelay = 10 * 1000;

    tmr = setTimeout(checkToNotify, msDelay)
    const isoTime = dateCheck.toISOString();
    tmrAutoCheck = { tmr, isoTime };
    broadcastToClients({ text: `Saved your preferences. Will check for reminders ${toOurTime(dateCheck)}` })
}
const restartAutoCheck = (() => {
    let tmr;
    // const delayMs = 2000; // FIXME:
    return (clientPort) => {
        // console.log("%crestartCheckAutoCheck", logColors, { clientPort });
        logConsole("restartCheckAutoCheck", { clientPort });
        clearTimeout(tmr);
        const promise = new Promise((resolve, reject) => {
            tmr = setTimeout(function () {
                // throw Error("error test 0.5");
                try {
                    // throw new Error('error!');
                    // checkSave();
                    // throw Error("error test 1");
                    adjustTmrAutoCheck();
                    resolve(); // if the previous line didn't always throw

                } catch (e) {
                    reject(e)
                }
            }, 300)
        })
        promise.catch(error => {
            // console.log("%checkSave() error)", logColors, { error });
            logStrongConsole("checkSave() error)", { error });
            throw error;
        });
    }
})();

let tmrKeepalive;
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
            case "TEST_TIMER":
                const seconds = evt.data.seconds;
                const stop = seconds < 1;
                let msKeepalive = evt.data.interval || 0;
                msKeepalive = Math.max(msKeepalive, 1000);
                const msNowStart = Date.now();
                console.log("%cTEST_TIMER", "color:red", { seconds, msKeepalive });
                // const wasRunning = !tmrKeepalive;
                clearInterval(tmrKeepalive);
                tmrKeepalive = undefined;
                const sendKeepalive = (val) => {
                    const msElapsed = Date.now() - msNowStart;
                    const sElapsed = Math.floor(msElapsed / 1000);
                    const data = {
                        type: "keepAliveCounter",
                        counterValue: val,
                        total: seconds,
                        sElapsed
                    }
                    try {
                        broadcastToClients(data);
                    } catch (err) {
                        console.log(err);
                    }
                }
                if (stop) {
                    sendKeepalive("STOP");
                    return;
                }
                let keepaliveValue = 0;
                sendKeepalive("START");
                tmrKeepalive = setInterval(() => {
                    if (!tmrKeepalive) return;
                    keepaliveValue += Math.floor(msKeepalive / 1000);
                    let sendWhat = keepaliveValue;
                    if (keepaliveValue >= seconds) {
                        sendWhat = "DONE Now";
                        clearInterval(tmrKeepalive);
                        tmrKeepalive = undefined;
                    }
                    console.log("keepalive", keepaliveValue, sendWhat);
                    try {
                        sendKeepalive(sendWhat);
                    } catch (err) {
                        const err4send = `in setIntervall (${sendWhat}): ${err}`;
                        sendKeepalive(err4send);
                    }
                }, msKeepalive);
                /*
                const testTimerShow = () => {
                    clearInterval(tmrKeepalive);
                    const title = `TEST_TIMER seconds=${seconds}`;
                    console.log("%cdisplayNotification", logColors, { title });
                    try {
                        sendKeepalive("DONE");
                        const time = toOurTime(new Date());
                        const obj = { seconds, time };
                        setLastTestTimer(obj);
                    } catch (err) {
                        console.log({ err });
                        localStorage.setItem(keyDone, "error");
                        const err4send = `in DONE: ${err}`;
                        sendKeepalive(err4send);
                    }
                }
                // if (seconds > 0) setTimeout(testTimerShow, seconds * 1000);
                */
                break;
            case "RESTART_AUTO_REMINDERS":
                // throw Error("error test -1");
                // evt.ports[0].postMessage(SW_VERSION);
                const thisClientPort = evt.ports[0];
                // thisClientPort.postMessage("before restartAutoCheck");
                restartAutoCheck(thisClientPort);
                break;
            case "CHECK_NOTIFY":
                const msDelay = evt.data.msDelay;
                const matchValues = evt.data.matchValues;
                // console.log("%cservice-worker message", logColors, { matchValues });
                logConsole("message", { matchValues });
                clearTimeout(tmrCheck);
                tmrCheck = setTimeout(() => { checkToNotify(matchValues); }, msDelay)
                break;
            case "NOTIFY_SPECIFIC":
                {
                    return;
                }
                break;
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


////////////////////////////////////////////////////////////////////////
//========== Common ====================================================



// https://stackoverflow.com/questions/38168276/navigator-serviceworker-controller-is-null-until-page-refresh
// Panic testing!
/*
self.addEventListener("install", (evt) => {
    // console.warn("service-worker install event");
    evt.waitUntil(self.skipWaiting()); // Activate worker immediately
});
*/
// https://stackoverflow.com/questions/70331036/why-service-workers-fetch-event-handler-not-being-called-but-still-worked
self.addEventListener("activate", (evt) => {
    // console.warn("service-worker activate event");
    logStrongConsole("service-worker activate event");
    evt.waitUntil(self.clients.claim()); // Become available to all pages
});


// Notification seems to be not available here???
// const greeting = new Notification('Hi, I am web worker');

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

/*
addEventListener('fetch', (event) => {
    // console.log("our fetch");
    // Prevent the default, and handle the request ourselves.
    event.respondWith((async () => {
        // Try to get the response from a cache.
        const cachedResponse = await caches.match(event.request);
        // Return it if we found one.
        if (cachedResponse) return cachedResponse;
        // If we didn't find a match in the cache, use the network.
        const er = event.request;
        const u = new URL(er.url);
        if (u.hostname == location.hostname) {
            // console.log({ er, u });
        }
        return fetch(event.request);
    })());
});
*/

