// @ts-check
const TOOLS_VER = "0.0.7";
window["logConsoleHereIs"](`here is tools.js, module, ${TOOLS_VER}`);
if (document.currentScript) { throw "tools.js is not loaded as module"; }

const mkElt = window["mkElt"];
const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
const importFc4i = window["importFc4i"];

// https://firebase.google.com/docs/reference/js/firebase.auth.Error

let theSWcacheVersion = "Fix this! (not known yet)";

// https://dev.to/somedood/promises-and-events-some-pitfalls-and-workarounds-elp
/** When awaited, this function blocks until the `event` fires once. */
// function blockUntilEvent(target: EventTarget, event: string)
/*
function blockUntilEvent(target, event, msTimeout) {
    return new Promise(resolve => {
        let tmr = setTimeout(() => {
            if (!tmr) return;
            // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#matching_event_listeners_for_removal
            target.removeEventListener(event, funResolve);
        }, msTimeout);
        function funResolve() {
            if (tmr) {
                clearTimeout(tmr);
                tmr = undefined;
            }
            console.log("blockUntilEvent, resolve: ", event);
            resolve();
        }
        target.addEventListener(
            event,
            funResolve,
            {
                // For simplicity, we will assume passive listeners.
                // Feel free to expose this as a configuration option.
                passive: true,
                // It is important to only trigger this listener once
                // so that we don't leak too many listeners.
                once: true,
            },
        );
    }
    );
}
*/

const thePromiseDOMready = new Promise(function (resolve) {
    const rs = document.readyState;
    if (!["loading", "interactive", "complete"].includes(rs)) throw Error(`Unknown readystate: ${rs}`);
    if (document.readyState === "complete") return resolve(true);
    if (document.readyState === "interactive") return resolve(true);
    document.addEventListener("DOMContentLoaded", resolve);
});
export async function promiseDOMready() { return thePromiseDOMready; }

// FIXME: This pattern is a potential source of errors because 
// obj.val === undefined is maybe not expected.
// Test for equality === instead!
// if \(!?[a-z0-9_]+\.([a-z0-9_]+\.?)+\)



// https://stackoverflow.com/questions/41802259/javascript-deep-check-objects-have-same-keys
/*
const deepSameKeys = (o1, o2) => {
    let retNotSame;
    if (deepSameInner(o1, o2)) {
        // if (retNotSame) throw Error("deepSameKey err 1")
    } else {
        // if (!retNotSame) throw Error("deepSameKey err 2")
    }
    if (retNotSame) return retNotSame;
    return true;

    function deepSameInner(o1, o2) {
        // Get the keys of each object
        const o1keys = Object.keys(o1).sort();
        const o2keys = Object.keys(o2).sort();
        // Make sure they match
        // If you don't want a string check, you could do
        if (o1keys.join() !== o2keys.join()) {
            // This level doesn't have the same keys
            return o1keys.every(key => {
                if (!o2.hasOwnProperty(key)) {
                    retNotSame = { notSame: key };
                    return false;
                }
            })
            // throw Error("Internal error in deepSameKeys");
        }
        // Check any objects
        return o1keys.every(key => {
            const v1 = o1[key];
            const v2 = o2[key];
            const t1 = typeof v1;
            const t2 = typeof v2;
            if (t1 !== t2) {
                if (t1 === "boolean" && t2 === "object") return true; // for object type returns;
                if (t1 !== "object" && t2 !== "object") return true;
                retNotSame = { notSame: key };
                return false;
            }
            return t1 === "object" ? deepSameInner(v1, v2) : true;
        });
    }
};
*/

/*
function getLocalISOtime(dateTime) {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const atTime = dateTime ? new Date(dateTime) : Date.now();
    const localISOTime = (new Date(atTime - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
    return localISOTime;
}
*/

// Quick fix for waiting for mkElt etc is really ready!
// javascript - Performance of MutationObserver to detect nodes in entire DOM - Stack Overflow
// https://stackoverflow.com/questions/31659567/performance-of-mutationobserver-to-detect-nodes-in-entire-dom/39332340
// FIX-ME: Is not this just a version of debounce?
/**
 * 
 * @param {HTMLElement} elt 
 * @param {number=} ms 
 * @param {Object=} observeWhat 
 * @param {number=} msMaxWait 
 * @returns 
 */
export function wait4mutations(elt, ms, observeWhat, msMaxWait) {
    const msTimer = ms || 10;
    observeWhat = observeWhat || { attributes: true, characterData: true, childList: true, subtree: true, };
    return new Promise(resolve => {
        let tmr;
        let mu;
        let nMu = 0;
        const now = Date.now();
        function fin(val) { resolve(val); mu?.disconnect(); }
        function restartTimer() {
            clearTimeout(tmr);
            nMu++;
            const newNow = Date.now();
            // console.log({ nMu }, mu == undefined, newNow - now);
            if (msMaxWait && (newNow - now > msMaxWait)) {
                fin("max wait");
                return;
            }
            if (mu) {
                mu.disconnect();
                mu = undefined;
            } else {
                mu = new MutationObserver(_mutations => {
                    // console.log("mutations!");
                    restartTimer();
                });
            }
            setTimeout(fin, msTimer);
            mu?.observe(elt, observeWhat);
        }
        // const mu = new MutationObserver(mutations => { restartTimer(); });
        restartTimer();
        // mu.observe(elt, observeWhat);
        // { attributes: true, characterData: true, childList: true, subtree: true, }
    });
}

/**
 * 
 * @param {HTMLElement} elt 
 * @param {number} msMaxWait 
 * @param {number|undefined} msInterval
 * @returns 
 */
export async function wait4connected(elt, msMaxWait, msInterval) {
    if (elt.isConnected) {
        console.log(`wait4connected, was already connected`);
        return;
    }
    // .isConnected is cheap, so check in short intervals
    msInterval = msInterval || 40;
    const msStartWait = Date.now();
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            const msElapsed = Date.now() - msStartWait;
            if (elt.isConnected) {
                // console.log(`wait4connected, connected after ${msElapsed} ms`);
                clearInterval(intervalId);
                // console.log
                resolve(true);
            }
            if (msElapsed > msMaxWait) {
                clearInterval(intervalId);
                const msg = `wait4connected: not connected after ${msMaxWait}ms`;
                console.error(msg, elt);
                // throw Error(msg);
            }
        }, msInterval);
    });
}



/*
function mkButton(attrib, inner) {
    const btn = mkElt("button", attrib, inner);
    btn.classList.add("popup-button");
    btn.classList.add("color-button");
    return btn;
}
*/
/*
(function () {
    // FIXME: Just return if from Puppeteer;
    // https://antoinevastel.com/bot%20detection/2018/01/17/detect-chrome-headless-v2.html
    // if (navigator.webdriver) return;

    // console.log("checking web browser supported");
    // return;
    const missingFeatures = [];
    const isChromiumBased = navigator.webdriver || typeof window["chrome"] === "object";
    // const isChromiumBased = true;
    // @ts-ignore
    let isEdge = false;
    let isFirefox = false;
    if (isChromiumBased) {
        // Tested ok in Chrome and Edge on desktop
        // @ts-ignore
        isEdge = navigator.userAgent.indexOf(" Edg/") > -1;
        if (isEdge) console.log({ isEdge });
    } else {
        const m = navigator.userAgent.match(/ Firefox\/(\d+)/);
        isFirefox = !!m;
        if (m && typeof m[1] === "string") {
            let v = parseInt(m[1]);
            // if (v > 64) return;
            if (v <= 64) missingFeatures.push("Too old Firefox");
        }
    }
    // return;


    if (!isChromiumBased && !isFirefox) {
        missingFeatures.push("It looks like your browser is not Chromium based or Firefox");
    }

    try {
        new Function('n?.x');
    } catch (err) {
        console.log(err);
        debugger; // eslint-disable-line no-debugger
        missingFeatures.push("Syntax n?.x not recognized");
    }
    // return;

    // missingFeatures.push("test 1");
    // missingFeatures.push("test 2");
    if (missingFeatures.length === 0) return;
    // return;

    console.warn("Not supported");

    const pathnameHowto = "/js/msj/howto.html";
    if (location.pathname === pathnameHowto) return;
    const helpURL = `${location.protocol}//${location.host}${pathnameHowto}`;

    const ulMissing = mkElt("ul", undefined,
        missingFeatures.map(miss => mkElt("li", undefined, miss)));
    const pMissing = mkElt("p", undefined, ulMissing);
    const title = "Your web browser may not work 👩‍💼";
    // const btnOk = mkButton(undefined, "OK");
    const body = mkElt("p", undefined, [
        mkElt("p", undefined,
            [
                "Sorry, your web browser is probably not up to date with the web standards.",
                " EasyCapEd does only fully support Google Chrome",
                " and newer Firefox at the moment.",
                " You may proceed, but it will probably not work.",
            ]
        ),
        pMissing,
        // mkElt("p", undefined, [btnOk]),
        mkElt("hr"),
        mkElt("p", undefined, [
            "To learn more about EasyCapEd read the ",
            mkElt("a", {
                href: helpURL,
            }, "step-by-step guide"),
            ".",
        ])
    ])

    popupDialog(title, body, "info");
})();
*/
async function getWebBrowserInfo() {
    // const modInappSpy = await import('https://cdn.jsdelivr.net/npm/inapp-spy@latest/dist/index.module.min.js');
    // const urlInappSpy = 'https://cdn.jsdelivr.net/npm/inapp-spy@latest/dist/index.module.min.js';
    // const urlInappSpy = "https://cdn.jsdelivr.net/npm/inapp-spy@latest/dist/index.global.min.js";
    // const urlInappSpy = "https://cdn.jsdelivr.net/npm/inapp-spy@latest/dist/index.mjs";
    // const modInappSpy = await import(urlInappSpy);


    // debugger;

    function getRealBrands() {
        const userAgentData = navigator["userAgentData"];
        if (!userAgentData || !userAgentData?.brands) return [];
        return userAgentData.brands.filter(brand =>
            !/[^a-zA-Z0-9]/.test(brand.brand)
        );
    }

    function isChromiumBased() {
        const brands = getRealBrands();
        return brands.some(brand =>
            /Chromium|Chrome|GoogleChrome|MicrosoftEdge|Opera|Brave/i.test(brand.brand)
        ) || !!window.chrome;
    }

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // PWA
    function getDisplayMode() {
        const modes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
        for (const mode of modes) {
            if (window.matchMedia(`(display-mode: ${mode})`).matches) {
                return mode;
            }
        }
        return 'browser'; // fallback
    }
    function getIsPWA() { return "browser" != getDisplayMode(); }

    function checkForSyntaxNx() {
        try {
            new Function('n?.x');
            return true;
        } catch (err) {
            console.log(err);
            console.error("Syntax n?.x not recognized");
            debugger; // eslint-disable-line no-debugger
            // missingFeatures.push("Syntax n?.x not recognized");
        }
        return false;
    }

    async function detectEnvironment() {
        // @ts-ignore - the module link is ok
        // const module = await import('https://cdn.jsdelivr.net/npm/inapp-spy@5.0.0/dist/index.mjs');
        const module = await import('https://cdn.jsdelivr.net/npm/inapp-spy@latest/dist/index.mjs');
        const { isInApp, appKey, appName } = module.default();
        const isChromium = isChromiumBased();
        const isPWA = getIsPWA();
        const isMobile = isMobileDevice();
        const isAndroidWView = isAndroidWebView();
        const canSyntaxNx = checkForSyntaxNx();
        return {
            isChromium,
            isMobile,
            isAndroidWView,
            isPWA,
            isInApp,
            inAppBrowserName: appName || null,
            inAppBrowserKey: appKey || null,
            canSyntaxNx,
        };
    }

    const env = await detectEnvironment();
    console.log(env);
    return env;
}
export const promWebBrowserInfo = getWebBrowserInfo();


// https://developers.google.com/web/fundamentals/performance/rail

// console.log("?????????? adding error event listener!"); // Just because things behave a bit strange sometimes.

/////// FIX-ME: urls must be per pwa
// Put external URL:s here since we need them for error reporting.
// const theGitHubIssuesURL = "https://github.com/lborgman/easy-cap-ed/issues";
// const theGitHubIssuesURL = undefined; // "";
// const theGitHubIssuesURL = "dummy"; // "";
const theGitHubIssuesURL = "https://github.com/lborgman/remember10min1h/issues";

// const theFacebookGroupURL = undefined;
const theFacebookGroupURL = "https://www.facebook.com/groups/flashcards4internet";
const theFacebookGroupName = "Flashcards 4 Internet (web app)";

// There could be an enormous amount of error messages sometimes so
// turn off the alert popup after we have got one.
var theAlertErrorCount = 0;
const theErrorPopupId = "error-popup";
const theStartTime = new Date();


export function isAndroidWebView() {
    // return true;
    // https://developer.chrome.com/multidevice/user-agent
    return (navigator.userAgent.indexOf(" wv") !== -1);
}

// let thisIsNetworkTrouble;
window["alertError"] = alertError;
function alertError(msg, e) {
    console.log("alertError", msg, e);
    console.log("e.thisIsNetWorkTrouble", e.thisIsNetworkTrouble);
    if (e.reason) console.log("e.reason.thisIsNetWorkTrouble", e.reason.thisIsNetworkTrouble);

    const isRejection = e instanceof PromiseRejectionEvent;
    if (isRejection) {
        if (!e.reason) {
            debugger; // eslint-disable-line no-debugger
        }
    }
    const errObj = isRejection ? e.reason : e;
    if (errObj.thisIsNetworkTrouble) {
        alertNetworkTrouble(msg, errObj);
    } else {
        alertRealError(msg, errObj);
    }
}
function alertNetworkTrouble(msg, e) {
    const id = "the-alert-network-trouble";
    if (document.getElementById(id)) return;
    console.log(`%c Network trouble: ${msg}`, "font-size:1.5rem;", msg, e);
    const title = "Network Problem";
    const body = mkElt("div");
    body.id = id;
    if (e) {
        body.appendChild(mkElt("p", { class: "colorError", style: "padding:1rem;" }, e.message));
    }
    if (navigator.onLine) {
        body.appendChild(mkElt("p", undefined, `
            It looks like your device is connected to the internet.
            However there are trouble reaching the computers we
            use for storing data etc. 
            `));
        body.appendChild(mkElt("p", undefined, `
            There is probably nothing you can do about it.
            Just wait until it works again.
            (If you are not using the EasyCapEd cloud you will not be
            affected at all.)
            `));
    } else {
        body.appendChild(mkElt("p", undefined, `
            Did you just switch your device offline?
            `));
    }
    // new Popup(title, body, undefined, true, id).show();
    popupDialog(title, body);
}

function alertRealError(msg, e) {
    window.onbeforeunload = () => false;
    addTraceError("alertError", msg, e);
    // If webview just give up.
    if (isAndroidWebView()) return;
    if (theAlertErrorCount++ > 1) return;
    if (theAlertErrorCount > 0) {
        setTimeout(function () {
            theAlertErrorCount = 0;
        }, 2 * 60 * 1000); // turn on again after 2 minutes
    }
    let currentErrorPopup = document.getElementById(theErrorPopupId);
    if (currentErrorPopup) return;

    console.error("alertError, e", e);


    // FIX-ME:
    // Just exit here if Chrome devtools is opened.
    // https://stackoverflow.com/questions/7798748/find-out-whether-chrome-console-is-open
    // var devtools = /./;
    // devtools.toString = function() { this.opened = true; }
    // console.log(devtools); if (devtools) { debugger; return; }


    /*
        Here is the explanation of .reason, seems standard!
        https://javascript.info/promise-error-handling

    window.addEventListener('unhandledrejection', function (event) {
        // the event object has two special properties:
        alert(event.promise); // [object Promise] - the promise that generated the error
        alert(event.reason); // Error: Whoops! - the unhandled error object
    });

    new Promise(function () {
        throw new Error("Whoops!");
    }); // no catch to handle the error
    */

    let error = e;
    if (e.error) error = e.error;
    if (e.reason) error = e.reason;


    let errMsg;
    errMsg = "In URL: " + "\n* " + location.href + "\n\n";

    // FIXME: npm serialize-error
    if (error.serializedError) {
        if (error.localVer) errMsg += "Function local ver: " + error.localVer + "\n";
        let se = error.serializedError;
        if (se.name) errMsg += se.name + "\n";
        if (se.message) errMsg += se.message + "\n";
        if (se.stack) errMsg += se.stack;
    } else {
        let errStack = error.stack;
        if (errStack) {
            errMsg += errStack;
        } else {
            if (error.message) {
                errMsg += error.message;
            } else {
                errMsg += error;
            }
        }
    }


    let errorStr = "\n\nError source:";
    errorStr += "\n* ";
    if (typeof error.easyCapEd !== "undefined") {
        switch (error.easyCapEd) {
            case "throwFetchError":
                errorStr += "Server Error";
                errorStr += error.errResp;
                break;
            default:
                errorStr += "(unnamed error source in EasyCapEd)";
        }
    } else {
        errorStr += msg;
    }

    let timeNow = new Date();

    let contextStr = "\n\nContext:";
    // contextStr += "\n* Version: " + theEasyCapEdVersion;
    contextStr += "\n* Version: " + theSWcacheVersion;
    // contextStr += "\n* Started: " + theStartTime.toISOString().substr(0, 16);
    contextStr += "\n* Started: " + theStartTime.toISOString().slice(0, 16);
    // contextStr += "\n* Now:     " + (timeNow.toISOString().substr(0, 16));
    contextStr += "\n* Now:     " + (timeNow.toISOString().slice(0, 16));
    contextStr += "\n* Elapsed: " + ((timeNow.valueOf() - theStartTime.valueOf()) / 1000) + " sec";
    contextStr += "\n* Browser: " + navigator.userAgent;
    contextStr += "\n* Online: " + navigator.onLine;
    // contextStr += "\n* "+location.href;
    // if (typeof theCapLoadType != "undefined") { contextStr += "\n* " + theCapLoadType.toString(); }
    // if (typeof theEditor !== "undefined") { contextStr += "\n* Captions"; }
    try {
        // @ts-ignore
        if ((typeof theFirstAuthStateChangedDone == "boolean") && theFirstAuthStateChangedDone) {
            let user = theFirebaseCurrentUser;
            if (user) {
                contextStr += "\n* Logged in";
            } else {
                contextStr += "\n* Not logged in";
            }
        }
    } catch (e) {
        contextStr += "\n* Error checking logged in: " + e;
    }

    const title = "Error";
    const fullErrorTxt = errMsg + errorStr + contextStr;
    const divSubmit = (() => {
        if (theGitHubIssuesURL) {
            const styleBtn = [
                "background:orange",
                "color:black",
                "border-radius: 4px",
                "border: none; padding: 8px",
                "text-decoration:none",
                "text-transform:uppercase",
                "display: inline-block"
            ];
            const style = styleBtn.join("; ");
            const btnSubmit = mkElt("a", {
                style,
                target: "_blank",
                href: submitGetURL4IssueToGitHub("** Please give the error a title! ***", fullErrorTxt),
                class: "popup-button",
            }, "Submit to GitHub");
            const ret = mkElt("div", undefined, [
                mkElt("p", undefined,
                    ["There was an error. Please submit it: ",
                        btnSubmit,
                    ]),

                mkElt("p", undefined,
                    [
                        "You can also go ",
                        mkElt("a", {
                            href: theGitHubIssuesURL,
                            target: "_blank"
                        },
                            "the GitHub Issues page)"),
                        " and post the text below.",
                    ]),
            ]);
            if (theFacebookGroupURL) {
                ret.appendChild(mkElt("p", undefined,
                    [
                        "If you do not want to register at GitHub" +
                        " (which in my opinion is very safe and easy" +
                        " with your Google or Facebook account) you may instead go to ",
                        mkElt("a", {
                            href: theFacebookGroupURL,
                            target: "_blank"
                        },
                            `the Facebook group ${theFacebookGroupName}`),
                        " and post the text below.",
                    ])
                )
            }
            return ret;
        } else {
            // FIX-ME: has facebook url? theFacebookGroupName theFacebookGroupURL 
            if (theFacebookGroupURL) {
                return mkElt("div", undefined, [
                    mkElt("p", undefined,
                        [
                            "Please go to ",
                            mkElt("a", {
                                href: theFacebookGroupURL,
                                target: "_blank"
                            },
                                `the Facebook group ${theFacebookGroupName}`),
                            " and post the text below.",
                        ]),

                ])
            } else {
                return mkElt("p", undefined,
                    `Please contact the web page owner and tell them about the error below.`
                );
            }
        }
    })();
    // const gitHubBugHelp = "javascript:alert('You must choose the desktop version when you come to GitHub!')";
    const style = [
        "overflow:auto",
        "white-space:pre-wrap",
        "user-select:all",
        "background:#fffc",
        "padding: 4px",
        "overflow-wrap: anywhere",
    ].join("; ");

    const body = mkElt("div", undefined,
        [
            divSubmit,
            // mkElt("div", undefined, [
            // ]),
            mkElt("pre", {
                id: "error-text",
                // class: "copy-all",
                style
            },
                // errMsg + errorStr + contextStr
                fullErrorTxt
            ),
        ]);

    popupDialog(title, body, "error");

}

function alertForError(e) {
    console.warn("alertForError", e);
    alertError("error", e);
}
window.addEventListener('NOerror', alertForError);

/*
function goSilently(url) {
    window.removeEventListener('error', alertForError);
    location.href = url;
    throw Error("");
}
*/

// https://stackoverflow.com/questions/47926040/catching-errors-the-onerror-event/
// https://stackoverflow.com/questions/31472439/catch-all-unhandled-javascript-promise-rejections

// FIXME: I have no idea what is happening to errors in keyboard initated events.
// Sometimes I get just "Scrip Error." and sometimes a trace.
// Do I need the function below, or???

/*
window.addEventListener("error", (e) => {
    console.log("e", e);
})
*/

/*
window.addEventListener('NOunhandledrejection', function (e) {
    console.warn("2 entering event listener for unhandledrejection");
    alertError("unhandledrejection", e);
});
*/
// console.log("-------- Added unhandledrejection");
/*
window.addEventListener("rejectionhandled", function (e) {
    alertError("rejectionhandled", e);
});
*/

// FIXME: This doesn't pop up if too early. What is happening? All the listeners are set up and it is logged in the console???
// console.log("CREATING TEST ERROR in 4 seconds"); setTimeout(function() {justAnErrorTest()}, 8000);



/*
var theLittleLogger;

function addLittleLogger() {
    theLittleLogger = mkElt("div", {
        id: "the-little-logger"
    },
        [
            mkElt("div"),
        ]);
}
*/



///////////////////////////////////////
/// Also encode parenthesis. There seem to be a bug in Android 7 that requires this.
function alsoEncodeParenthesis(urlEncoded) {
    let str = urlEncoded.replace(/\(/g, "%28");
    str = str.replace(/\)/g, "%29");
    // str = str.replace(/</g, "&lt;");
    return str;
}

////////////////////////////////////////
//// Automatic issue creation
function submitGetURL4IssueToGitHub(title, msg) {
    let url = "https://github.com/lborgman/easy-cap-ed/issues/new?";
    title = title || "title";
    let body = "";
    // Pulling in the template doesn't seem to work here so add
    // similar code instead.
    body += "### Expected Behavior (if any)" +
        "\n\n### Actual Behavior (if any)" +
        "\n\n### Steps to Reproduce (if any)" +
        "\n\n### Error Popup Message in EasyCapEd (automatically copied)\n";
    body += msg || "actual body";

    let params = {
        // template: "ISSUE_TEMPLATE",
        body: body,
        title: title,
        labels: "bug",
    }

    function addParams() {
        let ret = [];
        for (let param in params) {
            let v = params[param];
            v = v.replace(/</g, "&lt;");
            ret.push(encodeURIComponent(param) + '=' +
                // alsoEncodeParenthesis(encodeURIComponent(params[param])));
                alsoEncodeParenthesis(encodeURIComponent(v)));
        }
        return ret.join("&");
    }
    url += addParams();
    // console.log(url);
    return url;
}

/*
function mkWarningPopup(title, body) {
    let warningInfo = mkElt("p", { "class": "warning-info" },
        ["We do not think this is an error. ",
            "If you do then please go here and try to explain why: ",
            mkElt("a", { "href": theGitHubIssuesURL, "target": "_blank" }, "Issue tracker")
        ]);
    let bodyFull = mkElt("div", undefined,
        [mkElt("p", undefined, body), warningInfo]);
    popupDialog(title, bodyFull, "warning");
}
*/

/**
 * Shorten long parameter values to make the url viewable.
 * Value limit is 40 chars.
 * The main purpose is to shorten tokens (which can be very, very long).
 * 
 * @param {string} url 
 * @returns {string}
 */
export function makeDisplayableUrl(url) {
    // console.warn("makeDisplayableUrl", typeof url, url);
    const parts = url.split("?");
    if (parts.length === 1) return url;
    const hostPart = parts[0];
    const params = parts[1]
    const urlParams = new URLSearchParams(params);
    const keys = urlParams.keys();
    for (const key of keys) {
        const val = urlParams.get(key);
        if (val != null) {
            if (val.length > 40) urlParams.set(key, "...");
        }
    }
    return hostPart + "?" + urlParams.toString();
}

export function removeTokensFromObject(obj) {
    const keys = Object.keys(obj)
    for (const key of keys) {
        const val = obj[key];
        if (val) continue;
        try {
            if (typeof val === "string") {
                if (val.indexOf("\n") === -1) {
                    if (val.length > 140) obj[key] = "...";
                }
            } else if (typeof val === "object") {
                removeTokensFromObject(val);
            }
        } catch (err) {
            console.error(err);
            debugger; // eslint-disable-line no-debugger
        }
    }
}

/*
async function throwFetchError(url, response) {
    debugger; // eslint-disable-line no-debugger

    let errResp = "";
    if (!response) {
        errResp += "fetch failed before response was available.";
    } else {
        errResp += "Response status: " + response.status + " (" + response.statusText + ")";
        errResp += "\n";
        errResp += makeDisplayableUrl(response.url);

    }
    errResp += "\n";
    errResp += "fetch url=(" + makeDisplayableUrl(url) + ")";
    errResp += "\n";
    errResp += "\n";

    // errResp += "Error tracing on browser side:";
    // errResp += "\n";
    // errResp += JSON.stringify(result, undefined, 2);
    // errResp += "\n";

    if (response) {
        let bodyText;
        try {
            bodyText = await response.text();
        } catch (err) {
            bodyText = "Error: " + err;
            console.error("%c bodyText", "color: yellowgreen; font-size:1.5rem;", bodyText, err);
        }
        try {
            const json = JSON.parse(bodyText);
            removeTokensFromObject(json);
            bodyText = JSON.stringify(json, undefined, 2);
        } catch (err) {
            bodyText = "Error: " + err;
            console.error("%c bodyText", "color: yellowgreen; font-size:1.5rem;", bodyText, err);
        }

        errResp += "\n";
        errResp += "Response from server (should be JSON):";
        errResp += "\n";
        errResp += bodyText;
        errResp += "\n";
    } else {
        errResp += "\n";
        errResp += "(No repsonse from server)";
        errResp += "\n";
    }
    // FIXME: move this line break to alertError()?
    errResp += "\n";
    errResp += "-------------------------------------";
    errResp += "\n";
    // console.log("errResp", errResp)
    const errFetch = new FetchError("Fetch error", errResp, response === undefined)
    throw errFetch;
}
*/

/*
class FetchError extends Error {
    constructor(message, errResp, thisIsNetworkTrouble) {
        debugger; // eslint-disable-line no-debugger
        super(message); // (1)
        this.name = "FetchError"; // (2)
        this.easyCapEd = "throwFetchError";
        this.errResp = errResp;
        this.thisIsNetworkTrouble = thisIsNetworkTrouble;
    }
}
*/


// function getStack() { try { throw Error(); } catch (e) { return e.stack; } }

// setTimeout(() => { throw Error('Hello world'); }, 1000);

// https://googlechrome.github.io/samples/promise-rejection-events/
//
//
// What does this mean? (This is for the handled rejection case.)
//
// Answer: It actually seems to mean you have to leave the rejection
// unhandled first to trigger rejectionhandled.
//
// We need to handle the rejection "after the fact" in order to trigger a
// unhandledrejection followed by rejectionhandled. Here we simulate that
// via a setTimeout(), but in a real-world system this might take place due
// to, e.g., fetch()ing resources at startup and then handling any rejected
// requests at some point later on.

// window.addEventListener('unhandledrejection', event => {
//   console.log('unhandledrejection fired: ' + event.reason);
//   // Keep track of rejected promises by adding them to the Map.
//   // unhandledRejections.set(event.promise, event.reason);
// });
// window.addEventListener('rejectionhandled', event => {
//   console.log('rejectionhandled fired: ' + event.reason);
//   // If a previously rejected promise is handled, remove it from the Map.
//   // unhandledRejections.delete(event.promise);
// });

// throw Error("testing error...");
var theFirebaseCurrentUser;
// var theFirebaseCurrentUserEmail;

/*
*/
const traceHelper = [];
const traceStart = Date.now();
const addTraceDoIt = function (isError, trace) {
    const ms = Date.now() - traceStart;
    trace.unshift(ms);
    traceHelper.push(trace);
    if (isError) {
        console.error("addTrace", trace);
    } else {
        // console.log("addTrace", trace);
        console.warn("addTrace", trace);
    }
}
/*
function addTrace(...trace) {
addTraceDoIt(false, trace);
}
*/
function addTraceError(...trace) {
    const errTrace = ["** ERROR **"].concat(trace);
    addTraceDoIt(true, errTrace);
}
/*
// addTrace("Starting");
// addTraceError("Testing addTraceError");

function popupTrace() {
    popupDialog("Trace",
        mkElt("pre", undefined, JSON.stringify(traceHelper, undefined, 2)),
        "info");
}
*/

/*
function mkJsonType(obj) {
    const jObj = {}
    for (let k in obj) {
        const v = obj[k];
        if (typeof v !== "function") jObj[k] = v;
    }
    return jObj;
}
*/

async function popupDialog(title, body, severity) {
    // const hasDialog = Object.getOwnPropertyNames(window).includes("HTMLDialogElement");
    // Use dialog as fallback
    const useDialog = true; // typeof Popup !== "function";
    let styleDia = "max-width:90vw; max-height:80vh; overflow:auto; color:black; ";
    switch (severity) {
        case "error":
            {
                (async () => {
                    try {
                        const btnUpdate = mkElt("button", undefined, "Update now");
                        const styleUpdate = "background:black; color:white; padding:10px; display: none;";
                        const divUpdate = mkElt("div", { style: styleUpdate }, ["Update available ", btnUpdate]);
                        body.insertBefore(divUpdate, body.firstElementChild)
                        btnUpdate.addEventListener("click", errorHandlerAsyncEvent(async () => {
                            modPwa.updateNow();
                        }));
                        // if (modPwa.hasUpdate())
                        if (modPwa.isShowingUpdatePrompt()) {
                            console.log("?????? isShowingUpdatePrompt");
                            window.onbeforeunload = null;
                            setTimeout(() => divUpdate.style.display = "block", 100);
                        } else {
                            window.addEventListener("pwa-update-available", () => {
                                console.log("?????? pwa-update-available");
                                window.onbeforeunload = null;
                                divUpdate.style.display = "block";
                            });
                        }
                    } catch (err) {
                        console.error(err);
                        debugger; // eslint-disable-line no-debugger
                    }
                })();
            }
            styleDia += "background:yellow; border:2px solid red;";
            break;
        case "warning":
            styleDia += "background:yellow; border:2px solid green;";
            break;
        case "info":
            styleDia += "background:white; border:2px solid blue;";
            break;
        default:
            styleDia += "background:red; border:2px solid yellow;";
    }
    if (!useDialog) {
        styleDia += " position:fixed; left:10px; top:10px; padding:1rem; ";
    }
    const styleArt = "";
    const styleBtn = "background:orange; color:black; border-radius: 4px; border: none; padding: 8px;";
    await thePromiseDOMready;
    if (useDialog) {
        const closeBtn = mkElt("button", { style: styleBtn }, "CLOSE");
        // FIXME: the native dialog is broken 2020-07-15
        closeBtn.addEventListener("click", () => {
            dialog.close();
            document.body.removeChild(dialog);
            window.onbeforeunload = null;
        });
        const dialogTag = useDialog ? "dialog" : "section";
        const dialog = mkElt(dialogTag, { style: styleDia },
            mkElt("div", { style: styleArt }, [
                mkElt("h1", undefined, title),
                // mkElt("div", undefined, body),
                body,
                mkElt("div", undefined, ["", closeBtn]),
            ]));
        dialog.classList.add("error-popup");
        document.body.appendChild(dialog);
        dialog.showModal();
    } else {
        throw Error("useDialog should be true");
        // body.style = styleDia;
        // body.style.position = "static";
        // new Popup(title, body, undefined, true, undefined, "max-width: min(90vw, 800px);").show();
    }
}

// const a = 1 / b; console.log("a", a)




////////////////////////////////////////////
// For PWAs, prevent drop of files etc.
// const allowDropOnList = [];
export function allowDropOn(elt) {
    elt.classList.add("allow-drop")
}
function dropAllowed(elt) {
    return elt.classList.contains("allow-drop");
}
function startDropShield() {
    // console.log("Started shield to prevent file drop on page!");
    window.addEventListener("drop", evt => {
        // console.log("drop", evt.target)
        if (dropAllowed(evt.target)) return;
        evt.preventDefault();
    });
    window.addEventListener("dragover", evt => {
        if (dropAllowed(evt.target)) return;
        evt.preventDefault();
        evt.stopPropagation();
        if (!evt.dataTransfer) return;
        evt.dataTransfer.dropEffect = "none";
    });
}
startDropShield();

function loadScriptError(oError) {
    console.log({ oError });
    const msg = `
    The script ${oError.target.src} could not be loaded currently.
    Please try again later.
    `;
    alert(msg);
}
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement#dynamically_importing_scripts
export function affixScriptToHead(url, onloadFunction) {
    const newScript = document.createElement("script");
    newScript.onerror = loadScriptError;
    if (onloadFunction) { newScript.onload = onloadFunction; }
    document.head.appendChild(newScript);
    newScript.src = url;
}



////////////////////////////////////
////////////////////////////////////
///// Helper functions. Throttle, debounce, etc

/**
 * 
 * @param {number} sec 
 * @returns 
 */
export function waitSeconds(sec) {
    // console.log("start wait", sec)
    return new Promise(resolve => {
        function ready() {
            // console.log("ready wait", sec)
            resolve(sec);
        }
        setTimeout(ready, sec * 1000);
    })
}

// Events
// https://stackoverflow.com/questions/45831911/is-there-any-eventemitter-in-browser-side-that-has-similar-logic-in-nodejs/53917410#53917410
// https://stackoverflow.com/questions/70392939/how-to-dispatch-event-from-a-function-instead-of-window
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy



// https://medium.com/codex/throttling-in-javascript-649375f6b9f
// https://garden.bradwoods.io/notes/javascript/performance/debounce-throttle
// https://css-tricks.com/debouncing-throttling-explained-examples/
// https://www.npmjs.com/package/throttle-debounce
/*
  debounce: Grouping a sudden burst of events (like keystrokes) into a single one.
  throttle: Guaranteeing a constant flow of executions every X milliseconds.
          Like checking every 200ms your scroll position to trigger a CSS animation.

  * If the function is debounced, the bouncer will make everyone that turns up to wait in line.
  Then, after 5 minutes, everyone in line can come in at once.
  * If the function is throttled, the bouncer will let the 1st person who shows up in.
  If anyone else shows up in the next 5 minutes, they will be turned away.

  FIX-ME: I think I mixed them up.
    debounce() with execute at the end is what I want here.
    My change to throttleTO() seems to convert it to a debounce()-version.
    But why the different callback function handling???
*/
export function throttleTO(fn, msDelay) {
    let timeoutId;
    return function (...args) {
        if (timeoutId) {
            // return; // original
            clearTimeout(timeoutId); // my own
        }
        timeoutId = setTimeout(() => {
            fn(...args);
            // console.log("throttleTO(fn, delay)");
            timeoutId = null;
        }, msDelay);
    }
}
/*
function throttleRA(fn) {
    let requestId;
    return function (...args) {
        if (requestId) {
            return;
        }
        requestId = requestAnimationFrame(() => {
            fn(...args);
            requestId = null;
        });
    }
}
*/

// From https://garden.bradwoods.io/notes/javascript/performance/debounce-throttle
export function debounce(callback, waitMS = 200) {
    let timeoutId;

    return function (...args) {
        const context = this
        clearTimeout(timeoutId);

        timeoutId = setTimeout(function () {
            timeoutId = null
            callback.call(context, ...args)
        }, waitMS);
    };
};

/*
function throttle(func, waitMS = 200) {
    let isWait = false;

    return function (...args) {
        if (!isWait) {
            func.call(this, ...args);
            isWait = true;

            setTimeout(() => {
                isWait = false;
            }, waitMS);
        }
    }
}
*/



////////// URLs
// https://www.freecodecamp.org/news/how-to-validate-urls-in-javascript/
// isValidURL
export function getUrllNotValidMsg(id) {
    switch (id) {
        case "NO-HTTPS": return "Link must begin with 'https://'";
        case "NO-DOMAIN": return "Link must have domain";
        case "CONTAINS-SPACE": return "Link must not contain spaces";
        case "UNKNOWN-TLD": return "Unknown top level domain";
        default:
            throw Error(`Unknown url not valid id: ${id}`);
    }
}

// To check top level domains async fetchReTLD() must be called first!
export function isValidUrl(strUrl, protocol) {
    protocol = protocol || "https:";
    try {
        // new URL() only checks for well formatted so do some more checks first
        switch (protocol) {
            case "https:":
                if (!strUrl.match(new RegExp("^https://[^/]"))) return "NO-HTTPS";
                if (!strUrl.match(new RegExp("^https://[^/]{0,}[^.][.][^/.]+($|/)"))) return "NO-DOMAIN";
                if (strUrl.search(" ") != -1) return "CONTAINS-SPACE";
                const re = getReTLD();
                if (re) {
                    if (!re.test(strUrl)) return "UNKNOWN-TLD";
                } else {
                    console.log("%cfetchReTLD has not been called before getReTLD", "color:red;");
                }
                break;
            default:
                throw Error("Not implemented");
        }
        const newUrl = new URL(strUrl);
        return newUrl.protocol === protocol;
    } catch (err) {
        console.log("isValidUrl", err);
        return false;
    }
}
/*
This doesn't work because of CORS.
// https://stackoverflow.com/questions/42758604/check-if-online-resource-is-reachable-with-javascript-not-requiring-the-the-sam
async function isReachableUrl(url) {
    let reachable = false;
    try {
        const resp = await fetch(url, { method: "HEAD" });
        reachable = resp.ok;
    }
    finally {
        return reachable
    }
}
*/

let reTLD;
/**
 * Get RegExp mathing top level domains.
 * 
 * @returns {RegExp|undefined}
 */
export function getReTLD() { return reTLD; }
export async function fetchReTLD() {
    if (reTLD == undefined) {
        const urlTLDlist = "https://publicsuffix.org/list/public_suffix_list.dat";
        const resp = await fetch(urlTLDlist);
        const text = await resp.text();
        const lines = text
            .split("\n")
            .map(t => t.trim())
            .filter(t => !t.startsWith("//"))
            .filter(t => t.length > 0)
            .filter(t => t.indexOf(".") == -1)
            ;
        // console.log(lines)
        // lines.length = 4;
        reTLD = new RegExp("^https://[^/]{0,}[^.][.](" + lines.join("|") + ")" + "($|/)");
    }
    return reTLD;
}


export function showInfoPermissionsClipboard() {
    showInfoPermissions("Can't read clipboard");
}
async function showInfoPermissions(txtWhich) {
    const hrefAndroid = "https://support.google.com/chrome/answer/114662?hl=en&co=GENIE.Platform%3DAndroid&oco=1";
    const hrefDesktop = "https://support.google.com/chrome/answer/114662?hl=en&co=GENIE.Platform%3DDesktop&oco=1";
    const aUnblockAndroid = mkElt("a", { target: "blank", href: hrefAndroid }, "Android");
    const aUnblockDesktop = mkElt("a", { target: "blank", href: hrefDesktop }, "Desktop");
    const pLink = mkElt("p", undefined, [aUnblockAndroid, " ", aUnblockDesktop]);
    pLink.style = `
        display: flex;
        gap: 20px;
        `;
    const body = mkElt("section", undefined, [
        mkElt("h1", undefined, txtWhich),
        mkElt("p", undefined, [
            "This can be fixed as explained here: ",
        ]),
        pLink
    ]);
    const modMdc = await importFc4i("util-mdc");
    modMdc.mkMDCdialogAlert(body);
}

export class TimeoutTimer {
    #debugging;
    constructor(msTimeout, funTimeout, debug) {
        this.msTimeout = msTimeout;
        this.funTimeout = funTimeout;
        this.tmr = undefined;
        this.#debugging = !!debug;
    }
    stop() {
        if (this.#debugging) console.log("to stop");
        clearTimeout(this.tmr);
        this.tmr = undefined;
    }
    restart() {
        this.stop();
        if (this.#debugging) console.log("to restart", this.funTimeout, this.msTimeout);
        const ourFun = () => {
            this.tmr = undefined;
            this.funTimeout();
        }
        this.tmr = setTimeout(ourFun, this.msTimeout);
    }
    get active() {
        return this.tmr !== undefined;
    }
}


////////////////////////////////////
//// Pos listeners

/*
    The callback function in
        elt.addEventListener("pointermove", ...)
    will be called very many times when the input device is moved.

    To be able to handle this the input device position is saved
    in the callback, but nothing else is done there.

    The saved position is later used by the callback function to
    requestAnimationFrame.
*/

const savedPointerPos = {};
let aborter4HasSaved;
let promHasSaved;
setupWait4Saved();
function setupWait4Saved() {
    // if (aborter4HasSaved != undefined) throw Error("abort4HasSaved should be undefined here");
    if (promHasSaved != undefined) throw Error("promHasSaved should be undefined here");
    aborter4HasSaved = new AbortController();
    promHasSaved = new Promise((resolve, reject) => {
        aborter4HasSaved.signal.addEventListener("abort", () => {
            const reason = aborter4HasSaved.signal.reason;
            if (reason == "has saved pos") {
                // console.log(`promHasSaved: abort resolve: ${reason}`);
                resolve(reason);
            } else {
                console.log(`promHasSaved: abort reject: ${reason}`);
                reject(reason);
            }
        });
    });
}


/**
 * 
 * @param {PointerEvent} evt
 */
export function savePointerdownPos(evt) {
    if (evt.type != "pointerdown") {
        debugger; // eslint-disable-line no-debugger
        throw Error(`Expected event type "pointerdown", got "${evt.type}`);
    }
    savePointerPos(evt);
}
/**
 * 
 * @param {PointerEvent} evt
 */
export function savePointerPos(evt) {
    // if (!(evt instanceof PointerEvent)) throw Error("Expected PointerEvent");
    const clientX = evt.clientX;
    const clientY = evt.clientY;
    let fail = isNaN(clientX) || isNaN(clientY);
    if (fail) {
        abortPosListeners.abort();
        debugger; // eslint-disable-line no-debugger
        throw Error(`savePointerPos: sXY:${clientX.toFixed(1)},${clientY.toFixed(1)}`);
    }

    savedPointerPos.clientX = clientX;
    savedPointerPos.clientY = clientY;
    switch (evt.type) {
        case "pointermove":
            break;
        case "pointerdown":
            // console.log("savePointerPos pointerDown", clientX, clientY, evt);
            // .signal AbortHandler
            savedPointerPos.startX = clientX;
            savedPointerPos.startY = clientY;
            aborter4HasSaved.abort("has saved pos");
            break;
        default:
            const msg = `savePointerPos, ${evt.type}`;
            throw Error(msg);
    }
}
export async function getAndClearStartPointerPos() {
    await promHasSaved;
    const startX = savedPointerPos.startX;
    const startY = savedPointerPos.startY;
    savedPointerPos.startX = undefined;
    savedPointerPos.startY = undefined;
    promHasSaved = undefined;
    setupWait4Saved();
    return { startX, startY };
}
export function getSavedPointerPos() {
    // Don't check anyting here, just return.
    // Client should check in requestAnimationFrame
    return savedPointerPos;
}


// https://x.com/FreyaHolmer/status/1781420147711906284
// https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
// https://www.quirksmode.org/m/tests/mouseprops.html
// https://jwood206.medium.com/positioning-with-mouse-events-offset-getboundingclientrect-and-getcomputedstyle-afe12bfcb5f
// https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
// https://stackoverflow.com/questions/6073505/what-is-the-difference-between-screenx-y-clientx-y-and-pagex-y
let abortPosListeners;
export function addPosListeners(eltFsm) {
    if (eltFsm) console.warn("eltFsm is not used", eltFsm);
    //// FIX-ME: This seems to have stopped working in Android Chrome (at least in Chrome dev tools)???
    // window.addEventListener("pointermove", savePointerPos);
    // window.addEventListener("pointerdown", savePointerPos);
    //// Try body instead (same problem)
    // document.body.addEventListener("pointermove", savePointerPos);
    // document.body.addEventListener("pointerdown", savePointerPos);
    //// Try getEltFsm (this works also in Android Chrome!)

    // removePosListeners();
    abortPosListeners = new AbortController();
    const opts = {
        signal: abortPosListeners.signal,
        passive: true
    };
    document.addEventListener("pointermove", savePointerPos, opts);
    document.addEventListener("pointerdown", savePointerPos, opts);
}

// https://kettanaito.com/blog/dont-sleep-on-abort-controller
export function removePosListeners() {
    abortPosListeners?.abort();
    abortPosListeners = undefined;
}
window["r"] = removePosListeners; // FIX-ME:





///////////////////////////////////////
/***************** Test cm size on screen */
///////////////////////////////////////

// testCmOnScreen();
window["testCmOnScreen"] = () => {

    ////////// In Google Chrome on Windows:

    // Known by Google Chrome dev tools
    // Width from https://GSMArena.com/
    const knownDevices = {

        //// Works for Pixel 7, devicePixelRatio==2.625, 1/r=0.381
        a: {
            name: "Pixel 7",
            screenMmWidth: 73.2 - 2.54 * 0.17,
            devUA: "(Linux; Android 13; Pixel 7)",
            devicePixelRatio: 2.625,
            corr: 0.670,
            measuredPixelRatio: 2.875,
            measuredCorr: 0.741
        },

        //// Works for Samsung Galaxy S8 Plus, 7.1cm, devicePixelRatio==4, 1/r=0.250
        b: {
            name: "Samsung Galaxy S8+",
            screenMmWidth: 73.4 - 2.54 * 0.08,
            devicePixelRatio: 4,
            devUA: "(Linux; Android 13; SM-G981B)",
            corr: 0.777
        },

        //// Works for Samsung Galaxy S20 Ultra, devicePixelRatio==3.5, 1/r=0.286
        c: {
            name: "Samsung Galaxy S20 Ultra",
            screenMmWidth: 76 - 2.54 * 0.33,
            devicePixelRatio: 3.5,
            devUA: "(Linux; Android 13; SM-G981B)",
            corr: 0.693
        }

    }


    let dev = "none";
    let corr = 1;

    function promptDev(parDev) {
        let txtPrompt = ``;
        for (const [k, v] of Object.entries(knownDevices)) {
            txtPrompt += `  ${k}: ${v.name}\n`;
        }
        return prompt(txtPrompt, parDev);
    }
    while (!Object.keys(knownDevices).includes(dev)) {
        const tmp = promptDev(dev)?.trim();
        if (!tmp) return;
        dev = tmp;
        console.log({ dev });
    }
    const devRec = knownDevices[dev];
    console.log(devRec);

    if (location.protocol == "http:") {
        // Emulating mobile device?
        const re = new RegExp("\\(.*?\\)");
        // @ts-ignore
        const devUA = re.exec(navigator.userAgent)[0];
        console.log({ devUA });
        if (!devRec.devUA) throw Error(`devRec.devUA is not set, should be "${devUA}"`);
        if (devRec.devUA && devRec.devUA != devUA) {
            throw Error(`devUA did not match: w"${devUA}"!=d"${devRec.devUA}"A`);
        }
    }
    if (devRec.devicePixelRatio) {
        const devRatio = devRec.devicePixelRatio;
        const winRatio = window.devicePixelRatio;
        if (devRatio != winRatio) {
            // throw Error(`devicePixelRatio, d${devRatio} != w${winRatio}`);
            alert(`devicePixelRatio, d${devRatio} != w${winRatio}`);
        }
    }


    corr = devRec.corr || corr;
    const devName = devRec.name;
    const devCmW = devRec.screenMmWidth / 10;
    const txtPromptCorr = `
        ${devName}
        Real Width: ${devCmW.toFixed(1)}cm
        devicePixelRatio==${window.devicePixelRatio},

        Correction:
    `;
    const corrTxt = prompt(txtPromptCorr, corr.toFixed(3));
    if (!corrTxt) return;
    corr = corrTxt ? parseFloat(corrTxt) : 0;

    function cm2screenPixels(cm) {
        const dpcm1 = estimateDpcm();
        console.log({ dpcm1 });
        const px = cm * dpcm1 / (window.devicePixelRatio * corr);
        console.log({ cm, px });
        return px;
    }
    function estimateDpcm() {
        let x = 10;
        while (x < 2000) {
            x *= 1.01;
            if (!window.matchMedia(`(min-resolution: ${x}dpcm)`).matches) break;
        }
        const dpcm = x;
        console.log({ dpcm });
        return dpcm;
    }

    function showCmTestGrid(cmGrid, comparePx, compareWhat) {
        const cmPx = cm2screenPixels(cmGrid);
        compareWhat = compareWhat || "Compare: ";
        const eltBg = document.createElement("div");
        // @ts-ignore
        eltBg.style = `
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            opacity: 0.5;
            background-color: red;
            background-image:
                linear-gradient(to right, black 1px, transparent 1px),
                linear-gradient(to bottom, black 1px, transparent 1px);
            background-size: ${cmPx}px ${cmPx}px;
            z-index: 9999;
        `;
        document.body.appendChild(eltBg);

        const dpcm2 = estimateDpcm();
        console.log({ dpcm2 });
        const screenPx = screen.width;
        const screenCm = screenPx / cm2screenPixels(1);
        const bestCorr = corr * devCmW / screenCm;
        let info = `
            ${devName}, Spec screen:${screenPx}px/${devCmW.toFixed(2)}cm
            - corr:${corr}(${bestCorr.toFixed(3)})/${screenCm.toFixed(2)}cm
            --- cm:${cmPx.toFixed(0)}px
            - dpcm:${dpcm2.toFixed(1)}`;
        if (comparePx) info += ` - ${compareWhat}: ${comparePx.toFixed(0)}px`;
        const eltInfo = document.createElement("span");
        eltInfo.textContent = info;
        // @ts-ignore
        eltInfo.style = `
        position: fixed;
        top: 0;
        left: 0;
        display: inline-block;
        padding: 4px;
        background-color: yellow;
        color: black;
        z-index: 9999;
    `;
        const btn = document.createElement("button");
        btn.textContent = "Close";
        btn.addEventListener("click", () => { eltBg.remove(); eltInfo.remove(); });
        btn.style.marginLeft = "20px";
        eltInfo.appendChild(btn);
        document.body.appendChild(eltInfo);
    }

    if (corr) {
        // showCmTestGrid(2);
        setTimeout(() => {
            showCmTestGrid(2);
            console.log({ knownDevices });
        }, 1000);
    }
}


/** 
 * @typedef {Object} searchTree
 * @param {string=} operator
 * @param {string[]} words
*/

// https://www.freecodecamp.org/news/how-to-match-parentheses-in-javascript-without-using-regex/

const string2SearchSym = {};
export const symAdd = Symbol("&");
const ADD = symAdd;
// string2SearchSym["&"] = symAdd;
string2SearchSym["and"] = symAdd;
export const symOr = Symbol("|");
const OR = symOr;
// string2SearchSym["|"] = symOr;
string2SearchSym["or"] = symOr;
export const symNot = Symbol("!");
const NOT = Symbol("!");
// string2SearchSym["!"] = symNot;
string2SearchSym["not"] = symNot;
export const symLpar = Symbol("(");
const LPAREN = symLpar;
// string2SearchSym["("] = symLpar;
string2SearchSym["lPar"] = symLpar;
export const symRpar = Symbol(")");
const RPAREN = symRpar;
// string2SearchSym[")"] = symRpar;
string2SearchSym["rPar"] = symRpar;

// const ourSearchOperators = new Set([symAdd, symOr, symNot]);


export function checkFsmActionAndApply(fsm, action, newData, errHandler) {
    const oldState = fsm.state();
    const allowedActions = fsm.actions(oldState);
    if (!allowedActions.includes(action)) {
        const msgErr = `No action "${action}" in "${oldState}"`;
        console.error(msgErr, "allowed: ", allowedActions, "fsm:", fsm);
        if (!errHandler) {
            // throw Error(`No action "${action}" in "${oldState}"`);
            // throw Error(msgErr);
            return false;
        }
        debugger; // eslint-disable-line no-debugger
        // FIX-ME: How to implement error handling???
        return errHandler(msgErr);
        return false;
    }
    const res = fsm.action(action, newData);
    const newState = fsm.state();
    console.log(`newData==${JSON.stringify(newData)}: ${oldState} '${action}' -> ${newState}`, res);
    return true;
}


/**
 * @typedef {Object} str2searchTree
 * @param {boolean} ok
 * @param {searchTree|undefined} tree
 * @param {string|undefined} errMsg
*/

let look4tokenProblems = false;
const strFsmSearch = `
machine_name   : "Search string lexer";
machine_license: MIT;
machine_comment: "For user given search string, handles (), &, | and !";

start_states: [Start];
end_states: [End];

Start 'space' -> Start;
Start 'chCite' -> InCite;
Start 'ch' -> InWord;

NeedWord 'chCite' -> InCite;

// NeedWord 'space' -> NeedWord;
// NeedWord '(' -> NeedWord;
NeedWord '[space lPar]' -> NeedWord;

// NeedWord '!' -> JustNeedWord;

NeedWord 'not' -> JustNeedWord;

JustNeedWord 'chCite' -> InCite;
JustNeedWord 'space' -> NeedWord;

BeforeWord 'chCite' -> InCite;
BeforeWord 'and' -> BeforeWord_add after 0 => NeedWord;
BeforeWord 'or' -> BeforeWord_or after 0 => NeedWord;
BeforeWord 'not' -> BeforeWord_not after 0 => NeedWord;

InCite 'ch' -> InCite;
InCite 'space' -> BeforeInCite after 0 => InCite;
InCite 'chCite' -> AfterWord;
// InCite 'end' -> End;

AfterWord 'space' -> AfterWord;
AfterWord '[and or not]' -> NeedWord;

AfterWord 'ch' -> InWord;
AfterWord 'chCite' -> InCite;
AfterWord 'end' -> End;

SpaceNeedWord 'space' -> SpaceNeedWord;

NeedWord 'ch' -> InWord;
BeforeWord 'ch' -> InWord;

InWord 'ch' -> InWord;
// InWord 'space' -> AfterWord;
// InWord 'rPar' -> AfterWord;
InWord '[space rPar]' -> AfterWord;
// InWord 'tab' -> AfterWord;
InWord 'end' -> End;
`;






const modJssmTools = await (async () => {
    // debugger;
    // if (!navigator.onLine) return;
    try {
        return await importFc4i("jssm-tools");
    } catch (err) {
        console.log(err);
        // debugger;
    }
})();



function getFsmSearchLexer() {
    // modJssmTools.getFsmMulti(objFsmSearchMulti);
    // const fsm = objFsmSearchMulti.fsm;
    // window["fsmSearch"] = fsm; // For my testing
    const funDummy = (args) => console.log("funDummy", args);
    const fslSearchMulti = new modJssmTools.FslWithArrActions(strFsmSearch, funDummy);
    return fslSearchMulti;
    const fsm = fslSearchMulti._fsm;
    return fsm;
}


/** @typedef {string|symbol} searchToken */

/**
 * Parse a string to a "search tree".
 * 
 * @param {string} str 
 * @returns {searchToken[]|string}
 */
export function string2searchTokens(str) {
    console.groupCollapsed("string2searchToken");
    // const fsmSearch = getFsmSearchLexer();
    const fslSearchMulti = getFsmSearchLexer();
    const fsmSearch = fslSearchMulti._fsm;
    // debugger;

    let word = "";
    const tokens = [];
    let ch;
    const tokensPush = (token, where) => {
        if (typeof token === "string") {
            if (token.length === 0) {
                const state = fsmSearch.state();
                console.warn(`token is "", str=[${str}], state=${state}, tokens:`, tokens);
                return;
            }
        }
        tokens.push(token);
        console.log(`%ctokensPush ${where}: `, "background-color:blue;color:white;padding:4px", token, tokens);
    }

    // fsmSearch.hook_entry("AfterWord", () => { tokensPush(word, "hook_e AfterWord"); word = ""; });
    // fsmSearch.hook_entry("End", () => { tokensPush(word, "hook_e End"); });
    // fsmSearch.hook("AfterWord", "InWord", () => { tokensPush(symAdd, "hook AfterWord InWord"); });
    fsmSearch.hook_any_action(hook_any_action_handler);
    function hook_any_action_handler(hookArgs) {
        // const next_data = hookArgs.next_data;
        const next_data_action = hookArgs.next_data?.action;
        const action = hookArgs.action;
        const from = hookArgs.from;
        const to = hookArgs.to;
        // console.log("%chook_any_action", "background:red;color:black", hookArgs);
        console.log(`%chook_any_action: ${from} ${action},${next_data_action} => ${to};`, "background:red;color:black");
        if (!hookArgs) debugger; // eslint-disable-line no-debugger
        const isTransition = from !== to;
        // const actionIsAfterTransition = isTransition && action == "lPar";
        const ourAction = modJssmTools.FslWithArrActions.getRealAction(hookArgs);
        const state = fsmSearch.state();
        // console.log(`hook_any_action, ${state} '${ourAction}' => ?, args:`, hookArgs);
        if (look4tokenProblems) debugger; // eslint-disable-line no-debugger
        switch (ourAction) {
            case "not":
                console.log("got !, state:", state);
                if (state == "AfterWord") { tokensPush(symAdd, "hook_aah AfterWord"); }
                tokensPush(symNot, "hook_aah AfterWord");
                break;
            case "and":
            case "or":
            case "lPar":
                // case "rPar":
                const sym = string2SearchSym[ourAction];
                if (sym == undefined) debugger; // eslint-disable-line no-debugger
                tokensPush(sym, "hook_aah");
                break;
            case ("ch"):
            case ("space"):
            case ("end"):
                break;
            case "rPar":
                // debugger;
                break;
            default:
                debugger; // eslint-disable-line no-debugger
        }
        if (isTransition) {
            /*
                I can't understand the order of execution of the different hooks.
                So put everyting here. I believe all info needed is here!
            */

            ////////// hook_entry()

            // fsmSearch.hook_entry("AfterWord", () => { tokensPush(word, "hook_e AfterWord"); word = ""; });
            if (to == "AfterWord") { tokensPush(word, "hook_entry AfterWord"); word = ""; };

            // fsmSearch.hook_entry("End", () => { tokensPush(word, "hook_e End"); });
            if (to == "End") { tokensPush(word, "hook_entry End"); };


            ////////// hook_exit()


            ////////// hook()
            // fsmSearch.hook("AfterWord", "InWord", () => { tokensPush(symAdd, "hook AfterWord InWord"); });
            if (to == "InWord" && from == "AfterWord") { tokensPush(symAdd, "hook AfterWord InWord"); };
        }
        switch (ourAction) {
            case "rPar":
                const sym = string2SearchSym[ourAction];
                tokensPush(sym, "hook_aah after transition");
        }
    }


    str = str.trim();
    let action;
    const iter = str[Symbol.iterator]();
    let next;
    while (!(next = iter.next(), next.done)) {
        ch = next.value;
        action = "ch";
        switch (ch) {
            case "&":
                action = "and";
                break;
            case "|":
                action = "or";
                break;
            case "!":
                action = "not";
                break;
            case "(":
                action = "lPar";
                break;
            case ")":
                action = "rPar";
                break;
            case '"':
                action = "chCite";
                break;
            case ' ':
                action = "space";
                const state = fsmSearch.state();
                if (state == "InCite") { action = "ch"; }
                break;
            default:
            // word = word + ch;
        }
        // const res = fslSearchMulti.applyMultiAction(action);
        fslSearchMulti.applyMultiAction(action);
        // console.log("fslSearchMulti", res);
        if (action == "ch") word = word + ch;
    }
    // const res = fslSearchMulti.applyMultiAction("end");
    fslSearchMulti.applyMultiAction("end");
    const finalState = fsmSearch.state();
    if (finalState != "End") {
        console.log("Unfinished search question");
        console.groupEnd();
        return "Unfinished search question";
    }
    console.groupEnd();
    return tokens;
}
// window["s2t"] = string2searchTokens;


/**
 * @callback stringSearchFunction 
 * @param {string} searchString
 * @returns {Set}
 */
/**
 * 
 * @param {searchToken[]} tokens 
 * @param {stringSearchFunction} funStringSearch 
 */
export function doSearch(tokens, funStringSearch) {
    const iter = tokens[Symbol.iterator]();
    let next;
    while (!(next = iter.next(), next.done)) {
        const nextValue = next.value;
        const tofNextValue = typeof nextValue;
        if ("string" == tofNextValue) {
            const str = /** @type {string} */ (nextValue);
            return funStringSearch(str);
        }
        if ("symbol" != tofNextValue) {
            const msg = `Expected typeof to be "symbol", got "${tofNextValue}"`;
            console.error(msg);
            throw Error(msg);
        }
        switch (nextValue) {
            case symAdd:
                break;
            case symOr:
            case symNot:
            case symLpar:
            case symRpar:
            default:
                const msg = `Unexpected symbol: "${String(nextValue)}"`;
                console.error(msg);
                throw Error(msg);
        }
    }
}


/**
 * Test if two arrays are equal
 *  
 * @param {*[]} arrA 
 * @param {*[]|string} arrB 
 * @returns {boolean}
 */
function ArraysAreEqual(arrA, arrB) {
    return (arrA.length === arrB.length) &&
        arrA.every((a, idx) => a === arrB[idx]);
}
async function testString2searchTokens() {
    return;
    function testSearchString(strTested, arrWanted) {
        if (typeof strTested !== "string") throw Error("first param should be string");
        console.log("%ctestSearchString", "background:yellow;color:black;font-size:20px;", `[${strTested}]`);
        const resTest = string2searchTokens(strTested)
        if (!resTest) {
            console.log("%cCould not get tokens", "background:red; color:yellow;");
            // debugger; // eslint-disable-line no-debugger
            return;
        }
        const arrTest = resTest;
        if (!ArraysAreEqual(arrWanted, arrTest)) {
            const msg = `%cbad tokens (${strTested}):\n`;
            console.log(msg, "background:red; color:yellow; font-size:18px;", arrTest, "\nwant:", arrWanted);
            debugger; // eslint-disable-line no-debugger
            return;
        }
        console.log(`%cOK [${strTested}]`, "background:green; color:black; font-size:18px;");
    }
    /*
    testSearchString("aa", ["aa"]);
    testSearchString(" aa ", ["aa"]);
    testSearchString('"aa b"', ["aa b"]);
    testSearchString(' "aa b" ', ["aa b"]);
    testSearchString("aa b", ["aa", symAdd, "b"]);

    testSearchString(' "aa" b ', ["aa", symAdd, "b"]);

    testSearchString("aa  b", ["aa", symAdd, "b"]);
    testSearchString("aa & b", ["aa", symAdd, "b"]);
    testSearchString("aa | b", ["aa", symOr, "b"]);

    testSearchString("aa & ! b", ["aa", symAdd, symNot, "b"]);
    testSearchString("aa !b", ["aa", symAdd, symNot, "b"]);
    testSearchString("aa ! b", ["aa", symAdd, symNot, "b"]);
    */

    testSearchString("aa & (b | c)", ["aa", symAdd, symLpar, "b", symOr, "c", symRpar]);
    // testSearchString("(aa b) | c", ["aa", symAdd, symNot, "b"]);

}

testString2searchTokens(); // debugger; // eslint-disable-line no-debugger



/** 
 * @callback funSearchString
 * @param {string} word
 * @returns {Set}
 * 
 */

/** @typedef {string|Symbol} token */



/*
This parser directly calls the `search` function based on the operator priorities:

1. ** parseExpression:** Starts with the highest - level expression parsing.
2. ** parseOr:** Handles OR operators.
3. ** parseAdd:** Handles ADD operators.
4. ** parseNot:** Handles NOT operators.
5. ** parsePrimary:** Handles string literals and parentheses.

This should provide a more simplified approach while respecting the operator priorities.Let me know if you need any further adjustments!
*/

/**
 * 
 * @param {string} str 
 * @param {funSearchString} funSearch1String
 */

export function searchByComplicatedString(str, funSearch1String) {
    console.log("searchByComplicatedString", str, funSearch1String);
    const tokens = string2searchTokens(str);
    if (typeof tokens == "string") return tokens;
    return searchByTokensStringsAndSymbols(tokens, funSearch1String);
}



// https://docs.google.com/document/d/1x1gJ2gQUdKLhclVt9irn7By5_OLx4Tc9tAT5Ms0b_U0/edit?tab=t.0
// From Microsoft Copilot
function searchByTokensStringsAndSymbols(tokens, funSearch1String) {
    console.warn("searchByTokensStringsAndSymbols", tokens);
    // if (typeof tokens == "string") { mark }
    // const search = funSearch1String;
    return parse(tokens, funSearch1String);

    // Define symbols for operators
    // const OR = Symbol('OR');
    // const ADD = Symbol('ADD');
    // const NOT = Symbol('NOT');
    // const LPAREN = Symbol('LPAREN');
    // const RPAREN = Symbol('RPAREN');

    /**
     * Parses an array of tokens and evaluates them using the search function.
     * @param {Array} tokens - An array of strings and symbols.
     * @returns {Set} - The resulting set after parsing and evaluating.
     */
    function parse(tokens, funSearch1) {
        let iterator = tokens[Symbol.iterator]();
        let current = iterator.next().value;

        /**
         * Advances the iterator to the next token.
         */
        function next() {
            current = iterator.next().value;
        }

        /**
         * Parses the highest-level expression.
         * @returns {Set} - The result of the expression.
         */
        function parseExpression() {
            return parseOr();
        }

        /**
         * Parses OR expressions.
         * @returns {Set} - The result of the OR expression.
         */
        function parseOr() {
            let left = parseAdd();

            while (current === OR) {
                next();
                let right = parseAdd();
                left = new Set([...left, ...right]);
            }

            return left;
        }

        /**
         * Parses ADD expressions.
         * @returns {Set} - The result of the ADD expression.
         */
        function parseAdd() {
            let left = parseNot();

            while (current === ADD) {
                next();
                let right = parseNot();
                left = new Set([...left].filter(x => right.has(x)));
            }

            return left;
        }

        /**
         * Parses NOT expressions.
         * @returns {Set} - The result of the NOT expression.
         */
        function parseNot() {
            if (current === NOT) {
                next();
                let operand = parsePrimary();
                let allItems = new Set(['a', 'b', 'c', 'd', 'e', 'f']); // Example set of all possible items
                return new Set([...allItems].filter(x => !operand.has(x)));
            }

            return parsePrimary();
        }

        /**
         * Parses primary expressions (string literals and parentheses).
         * @returns {Set} - The result of the primary expression.
         */
        function parsePrimary() {
            if (!current) {
                // FIX-ME: search hits are not cleared
                return new Set();
            }
            if (typeof current === 'string') {
                let value = current;
                next();
                return funSearch1(value);
            }

            if (current === LPAREN) {
                next();
                let expression = parseExpression();
                if (current === RPAREN) {
                    next();
                } else {
                    throw new Error('Expected closing parenthesis');
                }
                return expression;
            }

            throw new Error(`Unexpected token: ${JSON.stringify(current)}`);
        }

        return parseExpression();
    }

    function test() {
        // Example usage:
        const tokens = ['a', ADD, 'b', OR, 'c', NOT, 'd'];

        const result = parse(tokens, search);
        console.log(result);

        /**
         * Searches for a string and returns the search result as a Set.
         * @param {string} string - The string to search for.
         * @returns {Set} - The search result as a Set.
         */
        function search(string) {
            // Implement search logic and return a Set
            return new Set([string]); // Example implementation
        }
    }
    test();
}

// https://rosettacode.org/wiki/Binary_search binarySearchLeft
export function binarySearch(arr, value, funCompare, checkSorted = false) {
    if (checkSorted) {
        const arrSorted = arr.toSorted(funCompare);
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arrSorted[i] != arr[i]) throw Error("not sorted!");
        }
    }
    let low = 0;
    let high = arr.length - 1;
    let mid;
    let comp;
    while (low <= high) {
        // invariants: value > A[i] for all i < low value < A[i] for all i > high
        mid = Math.floor((low + high) / 2);
        comp = funCompare(arr[mid], value);
        // if (arr[mid] > value)
        if (comp > 0)
            high = mid - 1;
        // else if (arr[mid] < value)
        else if (comp < 0)
            low = mid + 1;
        else
            return { value, mid };
    }
    // return not_found // value would be inserted at index "low"
    const upperBound = low;
    const lowerBound = high;
    const outSide = lowerBound < 0 || upperBound >= arr.length;
    return { value, lowerBound, upperBound, outSide }; // value would be inserted at index "low"
}

test_binarySearch();
function test_binarySearch() {
    return;
    const arr = [5.5, 7.5, 8.5, 10.5];
    const prxArr = new Proxy(arr, {
        get(arrTarget, prop,) {
            // return 0;
            if (prop == "length") return arrTarget.length;
            return arrTarget[prop] * 1.01;
        }
        // get(arr, idx, ) { return arr[idx]; }
    });
    const stLog = "font-size:20px; background:lightskyblue; color:brown;";
    const at2 = arr[2];
    const prxAt2 = prxArr[2];
    console.log("%cprx", stLog, { at2, prxAt2 });
    const funCompare = (a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }
    console.log("%ctest_binarySearch", stLog, arr);
    const res = []
    const arrUse = prxArr;

    res.push(binarySearch(arrUse, 4, funCompare));
    res.push(binarySearch(arrUse, 4.6, funCompare));
    res.push(binarySearch(arrUse, 5.5, funCompare));
    res.push(binarySearch(arrUse, 7.5, funCompare));
    res.push(binarySearch(arrUse, 7.6, funCompare));
    // res.push(binarySearchLeft(arr, 8.5, funCompare));
    res.push(binarySearch(arrUse, 10.5, funCompare));
    res.push(binarySearch(arrUse, 11, funCompare));
    res.push(binarySearch(arrUse, 11.6, funCompare));
    res.push(binarySearch(arrUse, 14.6, funCompare));
    console.log("%ctest_binarySearch", stLog, res);
}


/*
// This was originally from Gemini AI. Totally unusable!
export function mkCollapsibleDiv(divContent) {
    const divCollapsibleContent = mkElt("div", undefined, divContent);
    divCollapsibleContent.classList.add("collapsible-content");
    const divExpandible = mkElt("div", undefined, divCollapsibleContent);
    divExpandible.classList.add("collapsible");
    return divExpandible;
}
function checkCollapsibleDiv(divCollapsible) {
    if (!divCollapsible.classList.contains("collapsible")) {
        const msg = `divCollapsible.classList does not include "collapsible"`;
        console.error(msg, { divExpandible: divCollapsible });
        throw Error(msg);
    }
    const children = [...divCollapsible.children];
    if (children.length == 0) {
        const msg = "divCollapsible.children is empty";
        console.error(msg, { divExpandible: divCollapsible });
        throw Error(msg);
    }
    if (children.length > 1) {
        const msg = `divCollapsible should have just one element child, but has ${children.length}`;
        console.error(msg, { divExpandible: divCollapsible });
        throw Error(msg);
    }
    const divCollapsibleContent = children[0];
    if (!divCollapsibleContent.classList.contains("collapsible-content")) {
        const msg = `divCollapsibleContent.classList does not include "collapsible"`;
        console.error(msg, { divCollapsibleContent });
        throw Error(msg);
    }

}
export function expandCollapsibleDiv(divCollapsible) {
    checkCollapsibleDiv(divCollapsible);
    divCollapsible.classList.add("expanded");
}
export function collapseCollapsibleDiv(divCollapsible) {
    checkCollapsibleDiv(divCollapsible);
    divCollapsible.classList.remove("expanded");
}
export function toggleCollapsibleDiv(divExpandible) {
    checkCollapsibleDiv(divExpandible);
    divExpandible.classList.toggle("expanded");
}
*/

export function mkHeightExpander(eltContent) {
    const divExpanderContent = mkElt("div", { class: "height-expander-content" }, eltContent);
    const divExpander = mkElt("div", { class: "height-expander" }, divExpanderContent);
    return divExpander;
}
function checkIsHeightExpander(divExpander) {
    const tellError = (msg) => {
        console.error(msg);
        debugger; // eslint-disable-line no-debugger
        throw Error(msg)
    }
    if (!divExpander.classList.contains("height-expander")) {
        tellError('divExpander does not have class ".height-expander"');
    }
    const children = divExpander.children;
    const len = children.length;
    if (len != 1) {
        tellError(`divExpander should have 1 child, but have ${len}`);
    }
    const divExpanderContent = divExpander.firstElementChild;
    if (!divExpanderContent.classList.contains("height-expander-content")) {
        tellError('divExpanderContent does not have class ".height-expander-content"');
    }
}
export function expandHeightExpander(divExpander) {
    checkIsHeightExpander(divExpander);
    divExpander.classList.add("expanded");
}
export function collapseHeightExpander(divExpander) {
    checkIsHeightExpander(divExpander);
    divExpander.classList.add("expanded");
}
export function toggleHeightExpander(divExpander) {
    checkIsHeightExpander(divExpander);
    divExpander.classList.toggle("expanded");
}


export function getCssTransforms(elt) {
    const style = getComputedStyle(elt);
    const transform = style.transform;
    let x = 0, y = 0, scale = 1;
    if (transform !== "none") {
        const matrix = new DOMMatrixReadOnly(transform);
        // console.log({ matrix });
        scale = matrix.m11;
        x = matrix.m41;
        y = matrix.m42;
    }
    return { scale, x, y }
}

/**
 * This function should just protect me from my worst mistakes.
 * It compares to variables and screens for equality.
 * It does not check for deep equality, but only for shallow equality.
 *  
 * @param {*} varA 
 * @param {*} varB 
 * @returns {boolean}
 */
export function canVarsBeEq(varA, varB) {
    if (varA === varB) return true;
    if (typeof varA !== typeof varB) return false;
    if (varA.constructor.name !== varB.constructor.name) return false;
    if (Object.prototype.toString.call(varA) !== Object.prototype.toString.call(varB)) return false;
    const keysA = Object.keys(varA);
    const keysB = Object.keys(varB);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (varA[key] !== varB[key]) return false;
    }
    if (JSON.stringify(varA) !== JSON.stringify(varB)) return false;
    return true;
}



export function checkIsISOtime(str) {
    const re = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ$/;
    if (!re.test(str)) {
        const msg = (`"${str}" in not in ISO format`);
        console.error(msg);
        throw Error(msg);
    }
}
export function leftISOtimeMoreRecent(leftTime, rightTime) {
    checkIsISOtime(leftTime);
    checkIsISOtime(rightTime);
    return leftTime > rightTime;
}
// if (!leftISOtimeMoreRecent( (new Date()).toISOString(), (new Date("2000")).toISOString())) { debugger; }


// From Grok. You can't currently link to a Grok chat. 
// The name of the chat is "CSS Transition: Zoom effect".
/**
 * Animates the CSS `zoom` property of an element using requestAnimationFrame,
 * with updates occurring only after a specified millisecond delay to reduce repaints.
 * The animation is stepped (non-smooth) due to the non-interpolatable nature of `zoom`
 * in Chromium-based browsers.
 *
 * @param {HTMLElement} element - The DOM element to animate.
 * @param {number} startZoom - The starting zoom value (e.g., 1 for 100%).
 * @param {number} endZoom - The ending zoom value (e.g., 1.2 for 120%).
 * @param {number} msDuration - The animation duration in milliseconds (e.g., 2000 for 2s).
 * @param {number} [msStep=200] - Milliseconds between repaints (e.g., 200 for ~10 steps over 2s).
 * @returns {{start: Function, cancel: Function}} An object with methods to start or cancel the animation.
 */
export function animateZoom(element, startZoom, endZoom, msDuration, msStep = 200) {
    let animationFrame;
    let lastRepaintTime = null;

    // Cancel any ongoing animation
    function cancel() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        lastRepaintTime = null;
    }

    // Animation logic
    function start() {
        cancel(); // Stop any existing animation
        let currentStep = 0;
        const totalSteps = Math.floor(msDuration / msStep); // Derive steps from msStep
        const stepIncrement = (endZoom - startZoom) / totalSteps;

        function step(currentTime) {
            if (!lastRepaintTime) lastRepaintTime = currentTime;

            const elapsedSinceLastRepaint = currentTime - lastRepaintTime;

            // Only repaint if enough time has passed
            if (elapsedSinceLastRepaint >= msStep) {
                currentStep++;
                const zoomValue = startZoom + stepIncrement * currentStep;
                element.style.zoom = zoomValue;
                lastRepaintTime = currentTime; // Update last repaint time

                if (currentStep >= totalSteps) {
                    cancel(); // Stop when done
                    return;
                }
            }

            animationFrame = requestAnimationFrame(step);
        }

        animationFrame = requestAnimationFrame(step);
    }

    // Return control methods
    return {
        start,
        cancel
    };
}


/**
 * Compares two objects to check if they have the same keys, including nested objects,
 * recursing only as deep as the first object's structure.
 * @param {Object} obj1 - The first object to compare.
 * @param {Object} obj2 - The second object to compare.
 * @param {string[]|undefined} arrMayMiss - array of keys that may be missing in obj2
 * @returns {boolean} True if the objects have the same keys up to the depth of obj1, false otherwise.
 * @example
 * const obj1 = { a: 1, b: { x: 10, y: 20 }, c: 3 };
 * const obj2 = { a: 4, b: { x: 30, y: 40, z: { deeper: 50 } }, c: 6 };
 * console.log(haveSameKeys(obj1, obj2)); // true
 */
export function haveSameKeys(obj1, obj2, arrMayMiss) {
    // Get keys of both objects
    const tellError = (...what) => {
        console.error(`haveSameKeys: `, ...what);
        // logConsole
        debugger; // eslint-disable-line no-debugger
    }
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();

    // Check if keys are identical
    if (!arrMayMiss) {
        if (keys1.length !== keys2.length || !keys1.every((key, i) => key === keys2[i])) {
            // if (keys1.length !== keys2.length) {
            tellError("Not same keys", keys1, keys2);
            return false;
        }
    } else {
        if (!keys1.every((key, i) => {
            return arrMayMiss.includes(key) || keys2.includes(key);
        })) {
            tellError("Not same keys 2", keys1, keys2, arrMayMiss);
            return false;
        }
    }

    // Check nested objects recursively, only if obj1's value is an object
    for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        // Only recurse if val1 is an object (and not null)
        if (typeof val1 === 'object' && val1 !== null) {
            // Ensure val2 is an object (and not null) before recursing
            if (typeof val2 !== 'object' || val2 === null) {
                tellError("val2 is not object", val2);
                return false;
            }
            if (!haveSameKeys(val1, val2)) {
                return false;
            }
        }
    }

    return true;
}