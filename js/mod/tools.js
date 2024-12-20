// @ts-check
const TOOLS_VER = "0.0.7";
logConsoleHereIs(`here is tools.js, module, ${TOOLS_VER}`);
if (document.currentScript) { throw "tools.js is not loaded as module"; }

// @ts-ignore
const mkElt = window.mkElt;

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
            console.log({ nMu }, mu == undefined, newNow - now);
            if (msMaxWait && (newNow - now > msMaxWait)) {
                fin("max wait");
                return;
            }
            if (mu) {
                mu.disconnect();
                mu = undefined;
            } else {
                mu = new MutationObserver(mutations => {
                    console.log("mutations!");
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

/*
function mkButton(attrib, inner) {
    const btn = mkElt("button", attrib, inner);
    btn.classList.add("popup-button");
    btn.classList.add("color-button");
    return btn;
}
*/
(function () {
    // FIXME: Just return if from Puppeteer;
    // https://antoinevastel.com/bot%20detection/2018/01/17/detect-chrome-headless-v2.html
    // if (navigator.webdriver) return;

    // console.log("checking web browser supported");
    // return;
    const missingFeatures = [];
    const isChromiumBased = navigator.webdriver || typeof window["chrome"] === "object";
    // const isChromiumBased = true;
    let isEdge = false;
    let isFirefox = false;
    if (isChromiumBased) {
        if (navigator.vendor !== "Google Inc.") throw Error(`Vendor is ${navigator.vendor}`);
        isEdge = navigator.userAgent.indexOf(" Edg/") > -1;
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
        // let n = undefined;
        // let nx = n?.x;
        const fn = new Function('n?.x');
    } catch (err) {
        missingFeatures.push("Syntax n?.x not recognized");
    }
    // return;

    // missingFeatures.push("test 1");
    // missingFeatures.push("test 2");
    if (missingFeatures.length === 0) return;
    // return;

    console.warn("Not supported");

    // const helpURL = "https://easycaped.wordpress.com";
    const pathnameHowto = "/js/msj/howto.html";
    if (location.pathname === pathnameHowto) return;
    const helpURL = `${location.protocol}//${location.host}${pathnameHowto}`;

    // return;

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

    // return;
    /*
    const popup = new Popup(title, body);
    popup.show();
    btnOk.addEventListener("click", evt => {
        evt.stopPropagation();
        popup.close();
    });
    */
    popupDialog(title, body, "info");
})();

// https://developers.google.com/web/fundamentals/performance/rail



// console.log("?????????? adding error event listener!"); // Just because things behave a bit strange sometimes.

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
    new Popup(title, body, undefined, true, id).show();
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
    contextStr += "\n* Started: " + theStartTime.toISOString().substr(0, 16);
    contextStr += "\n* Now:     " + (timeNow.toISOString().substr(0, 16));
    contextStr += "\n* Elapsed: " + ((timeNow.valueOf() - theStartTime.valueOf()) / 1000) + " sec";
    contextStr += "\n* Browser: " + navigator.userAgent;
    contextStr += "\n* Online: " + navigator.onLine;
    // contextStr += "\n* "+location.href;
    if (typeof theCapLoadType != "undefined") {
        contextStr += "\n* " + theCapLoadType.toString();
    }
    if (typeof theEditor !== "undefined") {
        contextStr += "\n* Captions";
    }
    try {
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

    /*
    var pop = new Popup(title, body, undefined, true, theErrorPopupId);
    pop.show();
    */
    popupDialog(title, body, "error");

}

function alertForError(e) {
    console.warn("alertForError", e);
    alertError("error", e);
}
window.addEventListener('NOerror', alertForError);

function goSilently(url) {
    window.removeEventListener('error', alertForError);
    location.href = url;
    throw Error("");
}

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

window.addEventListener('NOunhandledrejection', function (e) {
    console.warn("2 entering event listener for unhandledrejection");
    alertError("unhandledrejection", e);
});
// console.log("-------- Added unhandledrejection");
window.addEventListener("rejectionhandled", function (e) {
    alertError("rejectionhandled", e);
});

// FIXME: This doesn't pop up if too early. What is happening? All the listeners are set up and it is logged in the console???
// console.log("CREATING TEST ERROR in 4 seconds"); setTimeout(function() {justAnErrorTest()}, 8000);

var theLittleLogger;

function addLittleLogger() {
    theLittleLogger = mkElt("div", {
        id: "the-little-logger"
    },
        [
            mkElt("div"),
        ]);
}

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

function mkWarningPopup(title, body) {
    let warningInfo = mkElt("p", { "class": "warning-info" },
        ["We do not think this is an error. ",
            "If you do then please go here and try to explain why: ",
            mkElt("a", { "href": theGitHubIssuesURL, "target": "_blank" }, "Issue tracker")
        ]);
    let bodyFull = mkElt("div", undefined,
        [mkElt("p", undefined, body), warningInfo]);
    // return new Popup(title, bodyFull, undefined, true, undefined, undefined, "warning-popup");
    popupDialog(title, bodyFull, "warning");
}

function removeTokensFromUrl(url) {
    // console.warn("removeTokensFromUrl", typeof url, url);
    // Remove tokens (assuming they are longer than 40 chars)
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

function removeTokensFromObject(obj) {
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
            debugger; // eslint-disable-line no-debugger
        }
    }
}

async function throwFetchError(url, response, result) {
    debugger; // eslint-disable-line no-debugger

    let errResp = "";
    if (!response) {
        errResp += "fetch failed before response was available.";
    } else {
        errResp += "Response status: " + response.status + " (" + response.statusText + ")";
        errResp += "\n";
        errResp += removeTokensFromUrl(response.url);

    }
    errResp += "\n";
    errResp += "fetch url=(" + removeTokensFromUrl(url) + ")";
    errResp += "\n";
    errResp += "\n";

    /*
    errResp += "Error tracing on browser side:";
    errResp += "\n";
    errResp += JSON.stringify(result, undefined, 2);
    errResp += "\n";
    */

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


function getStack() { try { throw Error(); } catch (e) { return e.stack; } }

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
var theFirebaseCurrentUserEmail;

const traceHelper = [];
const traceStart = new Date();
const addTraceDoIt = function (isError, trace) {
    const ms = new Date() - traceStart;
    trace.unshift(ms);
    traceHelper.push(trace);
    if (isError) {
        console.error("addTrace", trace);
    } else {
        // console.log("addTrace", trace);
        console.warn("addTrace", trace);
    }

}
function addTrace(...trace) {
    addTraceDoIt(false, trace);
}
function addTraceError(...trace) {
    const errTrace = ["** ERROR **"].concat(trace);
    addTraceDoIt(true, errTrace);
}
// addTrace("Starting");
// addTraceError("Testing addTraceError");

function popupTrace() {
    /*
    new Popup("Trace",
        mkElt("pre", undefined, JSON.stringify(traceHelper, undefined, 2)),
        undefined, true).show();
    */
    popupDialog("Trace",
        mkElt("pre", undefined, JSON.stringify(traceHelper, undefined, 2)),
        "info");
}

function mkJsonType(obj) {
    const jObj = {}
    for (let k in obj) {
        const v = obj[k];
        if (typeof v !== "function") jObj[k] = v;
    }
    return jObj;
}

async function popupDialog(title, body, severity) {
    // const hasDialog = Object.getOwnPropertyNames(window).includes("HTMLDialogElement");
    // Use dialog as fallback
    const useDialog = typeof Popup !== "function";
    let styleDia = "max-width:90vw; max-height:80vh; overflow:auto; color:black; ";
    switch (severity) {
        case "error":
            {
                (async () => {
                    try {
                        const modPwa = await importFc4i("pwa");
                        const btnUpdate = mkElt("button", undefined, "Update now");
                        const styleUpdate = "background:black; color:white; padding:10px; display: none;";
                        const divUpdate = mkElt("div", { style: styleUpdate }, ["Update available ", btnUpdate]);
                        body.insertBefore(divUpdate, body.firstElementChild)
                        btnUpdate.addEventListener("click", errorHandlerAsyncEvent(async evt => {
                            modPwa.updateNow();
                        }));
                        // if (modPwa.hasUpdate())
                        if (modPwa.isShowingUpdatePrompt()) {
                            console.log("?????? isShowingUpdatePrompt");
                            window.onbeforeunload = null;
                            setTimeout(() => divUpdate.style.display = "block", 100);
                        } else {
                            window.addEventListener("pwa-update-available", evt => {
                                console.log("?????? pwa-update-available");
                                window.onbeforeunload = null;
                                divUpdate.style.display = "block";
                            });
                        }
                    } catch (err) {
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
        closeBtn.addEventListener("click", evt => {
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
        body.style = styleDia;
        // body.style.position = undefined; // has no effect
        // delete body.style.position; // has no effect
        body.style.position = "static";
        new Popup(title, body, undefined, true, undefined, "max-width: min(90vw, 800px);").show();
    }
}

// const a = 1 / b; console.log("a", a)




////////////////////////////////////////////
// For PWAs, prevent drop of files etc.
// const allowDropOnList = [];
function allowDropOn(elt) {
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
function affixScriptToHead(url, onloadFunction) {
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
    console.log("start wait", sec)
    return new Promise(resolve => {
        function ready() {
            console.log("ready wait", sec)
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



////////// URLs
// https://www.freecodecamp.org/news/how-to-validate-urls-in-javascript/
// isValidURL
function getUrllNotValidMsg(id) {
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
                }
                break;
            default:
                throw Error("Not implemented");
        }
        const newUrl = new URL(strUrl);
        return newUrl.protocol === protocol;
    } catch (err) {
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
function getReTLD() { return reTLD; }
async function fetchReTLD() {
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
        aborter4HasSaved.signal.addEventListener("abort", evt => {
            const reason = aborter4HasSaved.signal.reason;
            if (reason == "has saved pos") {
                console.log(`promHasSaved: abort resolve: ${reason}`);
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
        debugger;
        throw Error(`Expected event type "pointerdown", got "${evt.type}`);
    }
    savePointerPos(evt);
}
/**
 * 
 * @param {PointerEvent} evt
 */
function savePointerPos(evt) {
    // if (!(evt instanceof PointerEvent)) throw Error("Expected PointerEvent");
    const clientX = evt.clientX;
    const clientY = evt.clientY;
    let fail = isNaN(clientX) || isNaN(clientY);
    if (fail) {
        abortPosListeners.abort();
        debugger;
        throw Error(`savePointerPos: sXY:${clientX.toFixed(1)},${clientY.toFixed(1)}`);
    }

    savedPointerPos.clientX = clientX;
    savedPointerPos.clientY = clientY;
    switch (evt.type) {
        case "pointermove":
            break;
        case "pointerdown":
            console.log("savePointerPos pointerDown", clientX, clientY, evt);
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
