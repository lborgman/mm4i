// @ts-check
// See pwa.js for documentation

const PWA_NOT_CACHED_VERSION = "1.2.00";
export function getVersion() { return PWA_NOT_CACHED_VERSION; }

const mkElt = window["mkElt"];

const doSwReset = false;
let pwaFuns;

const logStyle = "background:yellowgreen; color:black; padding:2px; border-radius:2px;";
const logStrongStyle = logStyle + " font-size:18px;";
// const styleInstallEvents = logStrongStyle + "color:red;";
function logConsole(..._msg) {
    // console.log(`%cpwa-nc.js`, logStyle, ..._msg);
}
function logStrongConsole(...msg) {
    console.log(`%cpwa-nc.js`, logStrongStyle, ...msg);
    addScreenDebugRow(...msg);
}
// function logInstallEvent(...msg) { console.log("%cpwa-nc", styleInstallEvents, ...msg); }


logStrongConsole(`here is pwa-not-cached.js, module ${PWA_NOT_CACHED_VERSION}`);
if (document.currentScript) throw Error("pwa-not-cached.js not loaded as module");



const secPleaseWaitUpdating = 3;
const msPleaseWaitUpdating = secPleaseWaitUpdating * 1000;
export function getSecPleaseWaitUpdating() { return secPleaseWaitUpdating; }



let instWorkbox;
let ourUrlSW;


const urlModule = new URL(import.meta.url);
const params = [...urlModule.searchParams.keys()];
const parNc = "PWAnocacheRand"
if (params.length != 1) { console.error(`There hould be only 1 parameter, got ${params.length}`); }
if (params[0] != parNc) { console.error(`The parameter name should be "${parNc}", not "${params[0]}"`); }




export async function startSW(urlSW) {
    if (doSwReset) {
        await (async function () {
            logStrongConsole("in async doSwReset, please remove");
            if (navigator.serviceWorker.controller !== null) { }
            const regSW = await navigator.serviceWorker.getRegistrations();
            console.log({ regSW });
            regSW.forEach(reg => {
                reg.unregister();
            });
            const regSW2 = await navigator.serviceWorker.getRegistrations();
            console.log({ regSW2 });
            navigator.serviceWorker.register("./sw-reset.js");
        })();
        return;
    }
    ourUrlSW = urlSW;
    logStrongConsole("startSW", ourUrlSW);
    await addDebugSWinfo();
    await checkPWA();
    // setupForInstall();
    await setupServiceWorker();
}

function addDebugLocation(loc) {
    const inner = mkElt("a", { href: loc }, loc);
    addScreenDebugRow(inner);
}



async function addDebugSWinfo() {

    // await _checkRegistration();
    async function _checkRegistration() {
        // I can't find any really good and simple documentation for this.
        // (I avoid specs...)
        // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/state
        const regs = await navigator.serviceWorker.getRegistrations();
        addScreenDebugRow(`Registered service workers: ${regs.length}`);
        regs.forEach(reg => {
            const isController = reg.active === navigator.serviceWorker.controller;
            const regActive = reg["active"];
            console.log({ regActive });
            console.log({ isController });

            const eltC = isController ? mkElt("b", undefined, " controller") : "";

            let stateOfReg;
            const statesOfReg = [
                "active",

                "parsed",
                "installing",
                "installed",
                "activating",
                "activated",
                "redundant",
            ];
            statesOfReg.forEach(s => {
                const r = reg[s];
                if (r !== undefined) {
                    if (stateOfReg) console.error(`Already state ${stateOfReg}`);
                    stateOfReg = s;
                    console.log(s, r);
                    if (r) {
                        const state = r.state;
                        const url = r.scriptURL;
                        console.log(r, state, url);
                    }
                }
            });

            const eltA = mkElt("a", { href: urlModule, target: "_blank" }, urlModule);
            eltA.style.marginLeft = "10px";
            const eltRow = mkElt("span", undefined, [
                stateOfReg, eltC,
                mkElt("div", undefined, eltA)
            ]);
            addScreenDebugRow(eltRow);
        });
    }

    const loc = location.href;
    addDebugLocation(loc);
    const u = new URL(loc);
    u.pathname = "manifest.json";
    addDebugLocation(u.href);
    // @ts-ignore
    addScreenDebugRow(`navigator.userAgentData.platform: ${navigator.userAgentData?.platform}`);
}

async function checkPWA() {
    // https://web.dev/learn/pwa/detection/
    window.addEventListener('DOMContentLoaded', () => {
        let displayMode = 'browser tab';
        const modes = ["fullscreen", "standalone", "minimal-ui", "browser"];
        modes.forEach(m => {
            if (window.matchMedia(`(display-mode: ${m})`).matches) {
                displayMode = m;
                addScreenDebugRow(`matched media: ${displayMode}`)
            }
        });
        addScreenDebugRow(`DISPLAY_MODE_LAUNCH: ${displayMode}`);
    });
    // https://web.dev/get-installed-related-apps/
    // @ts-ignore
    const relatedApps = navigator.getInstalledRelatedApps ? await navigator.getInstalledRelatedApps() : [];
    if (relatedApps) {
        addScreenDebugRow(`Related apps (${relatedApps.length}):`);
        relatedApps.forEach((app) => {
            addScreenDebugRow(`${app.id}, ${app.platform}, ${app.url}`);
        });
    } else {
        addScreenDebugRow("relatedApps is not supported in your web browser")
    }
}

async function setupServiceWorker() {
    logConsole("setupServiceWorkder");
    const wb = await getWorkbox();

    wb.addEventListener("message",
        async evt => {
            logStrongConsole("got message", { evt });
            const msgType = evt.data.type;
            switch (msgType) {
                default:
                    mkSnackbar(evt.data.text);
            }
        });

    const showSkipWaitingPrompt = async (_evt) => {
        // Assuming the user accepted the update, set up a listener
        // that will reload the page as soon as the previously waiting
        // service worker has taken control.
        wb.addEventListener('controlling', () => {
            // At this point, reloading will ensure that the current
            // tab is loaded under the control of the new service worker.
            // Depending on your web app, you may want to auto-save or
            // persist transient state before triggering the reload.
            logStrongConsole("event controlling, doing reload");
            window.location.reload();
        });

        // When `event.wasWaitingBeforeRegister` is true, a previously
        // updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.

        const updateAccepted = await promptForUpdate();

        if (updateAccepted) {
            setTimeout(() => wb.messageSkipWaiting(), msPleaseWaitUpdating);
        }
    };

    // Add an event listener to detect when the registered
    // service worker has installed but is waiting to activate.
    wb.addEventListener('waiting', (event) => {
        logStrongConsole("event waiting");
        showSkipWaitingPrompt(event);
    });

    wb.addEventListener('activated', async (_evt) => {
        logStrongConsole("activated");
        const regSW = await navigator.serviceWorker.getRegistration();
        if (!regSW) throw Error(`regSW == "${regSW}"`)
        if (!regSW.active) throw Error(`regSW.active == "${regSW.active}`);
        const swLoc = regSW.active.scriptURL;
        logStrongConsole("activated, add error event listener", { regSW });
        regSW.active.addEventListener("error", evt => {
            logStrongConsole("activated, error event", evt);
        });
        addDebugLocation(swLoc);
    });


    // FIXME: is this supported???
    wb.addEventListener('error', (evt) => {
        console.log("%cError from sw", "color:orange; background:black", { evt });
    });


    wb.getSW().then(sw => {
        sw.addEventListener("error", evt => {
            console.log("%cError from getSW sw", "color:red; background:black", { evt });
        });
        sw.onerror = (swerror) => {
            console.log("%cError from getSW sw", "color:red; background:black", { swerror });
        }
    }).catch(err => {
        console.log("%cError getSW addEventlistener", "color:red; background: yellow", { err });
    });

    try {
        const _swRegistration = await wb.register(); //notice the file name
        // https://web.dev/two-way-communication-guide/

        // Can't use wb.messageSW because this goes to the latest registered version, not the active
        // const swVersion = await wb.messageSW({ type: 'GET_VERSION' });
        //
        // But we must check for .controller beeing null
        // (this happens during "hard reload" and when Lighthouse tests).
        // https://www.youtube.com/watch?v=1d3KgacJv1I
        /*
        if (navigator.serviceWorker.controller !== null) {
            navigator.serviceWorker.controller.postMessage({ type: "TELL_SW_NAME", SW_NAME: ourUrlSW });
 
            // const messageChannelVersion = new MessageChannel();
            // messageChannelVersion.port1.onmessage = (event) => { saveVersion(event.data); };
            // navigator.serviceWorker.controller.postMessage({ type: "GET_VERSION" }, [messageChannelVersion.port2]);
 
        } else {
            addScreenDebugRow(`Service Worker version: controller is null`);
        }
        */

        // return swRegistration;
    } catch (err) {
        console.error("Service worker registration failed", { err });
        throw err;
    }
}



function mkSnackbar(msg, color, bgColor, left, bottom, msTime) {
    const snackbar = mkElt("aside");
    snackbar.textContent = msg;
    color = color || "red";
    bgColor = bgColor || "black";
    left = left || 20;
    bottom = bottom || 20;
    snackbar.style = `
            display: flex;
            color: ${color};
            background-color: ${bgColor};
            left: ${left}px;
            bottom: ${bottom}px;
            font-size: 16px;
            padding: 4px;
            border-radius: 4px;
        `;
    document.body.appendChild(snackbar);
    setTimeout(() => snackbar.remove(), msTime);
}


async function getWorkbox() {
    if (!instWorkbox) {
        // https://developer.chrome.com/docs/workbox/using-workbox-window
        // https://www.npmjs.com/package/workbox-window
        const urlWorkboxWindow = "https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-window.prod.mjs";
        const modWb = await import(urlWorkboxWindow);
        instWorkbox = new modWb.Workbox(ourUrlSW);
    }
    return instWorkbox;
}


/*
async function updateNow() {
    logConsole("pwa.updateNow, calling wb.messageSkipWaiting() 1");
    const wb = await getWorkbox();
    logConsole("pwa.updateNow, calling wb.messageSkipWaiting() 2");
    wb.messageSkipWaiting();
}
*/

export function setPWAfuns(objFuns) {
    pwaFuns = objFuns;
    if (!window["mkElt"]) {
        window["mkElt"] = pwaFuns["mkElt"];
    }
}

async function promptForUpdate() {
    logConsole("prompt4update pwa-not-cached.js");
    const wb = await getWorkbox();
    const waitingVersion = await wb.messageSW({ type: 'GET_VERSION' });
    return pwaFuns["promptForUpdate"](waitingVersion);
}

function addScreenDebugRow(...txt) {
    if (!pwaFuns) return;
    const mark = document.createElement("span");
    mark.textContent = "PWA-NC";
    mark.style = logStyle + "margin-right:5px;";
    return pwaFuns["addScreenDebugRow"](mark, ...txt);
}


// test TypeError
// const eltNone= document.getElementById("NONE"); eltNone.remove();

// test SyntaxError
// function testSyntaxError() { await import("dummy"); }


// https://web.dev/customize-install/#detect-launch-type
// https://web.dev/manifest-updates/