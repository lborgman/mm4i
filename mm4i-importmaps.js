// @ts-check
const MM4I_IMPORTMAPS_VER = "0.2.6";
window["logConsoleHereIs"](`here is mm4i-importmaps ${MM4I_IMPORTMAPS_VER}`);

const importFc4i_nocachenames = {};
const noCache = (() => {
    return false;
    const sp = new URLSearchParams(location.search);
    return !sp.has("cachemodules");
    const defaultNoCache = true;
    const getPWADisplayMode = () => {
        if (document.referrer.startsWith('android-app://'))
            return 'twa';
        if (window.matchMedia('(display-mode: browser)').matches)
            return 'browser';
        if (window.matchMedia('(display-mode: standalone)').matches)
            return 'standalone';
        if (window.matchMedia('(display-mode: minimal-ui)').matches)
            return 'minimal-ui';
        if (window.matchMedia('(display-mode: fullscreen)').matches)
            return 'fullscreen';
        if (window.matchMedia('(display-mode: window-controls-overlay)').matches)
            return 'window-controls-overlay';

        return 'unknown';
    }
    const displayMode = getPWADisplayMode();
    if (displayMode == "browser") return defaultNoCache;
    return false;
})();

if (noCache) {
    console.log("%cimportFc4i is avoiding browser caching", "background:yellow; color:red; font-size:18px;");
    document.addEventListener("DOMContentLoaded", _evt => {
        const eltSlow = document.createElement("div");
        eltSlow.style = `
        position: fixed;
        top: 70px;
        left: 20px;
        z-index: 9999;
        width: 200px;
        padding: 20px;
        background: blue;
        color: white;
        border: 2px solid currentColor;
        border-radius: 10px;
        display: flex;
        align-content: center;
        flex-wrap: wrap;
    `;
        eltSlow.textContent = "Slow loading because develper debugging is on for Mindmaps 4 Internet ...";
        document.body.appendChild(eltSlow);
        const msRemoveSlow = window.location.hostname == "localhost" ? 1000 : 4000;
        setTimeout(() => eltSlow.remove(), msRemoveSlow);
    });
}
const baseUrl = (() => {
    const b = [...document.getElementsByTagName("base")][0]
    if (b) {
        const bHref = b.href;
        // const wlOrigin = window.location.origin;
        // console.log({ bHref, wlOrigin });
        return bHref;
    }
    return window.location.origin;
})();
// console.log({ baseUrl });
// debugger;

// https://github.com/WICG/import-maps/issues/92
{
    // https://www.npmjs.com/package/three?activeTab=versions, Current Tags
    // const threeVersion = "0.167.1";
    const relImports = {
        // https://github.com/vasturiano/3d-force-graph
        // Not a module?
        // Anyway ForceGraph3D will be defined in window by import("3d-force-graph")!
        // "three": "https://unpkg.com/three",
        // "three": "https://unpkg.com/three/build/three.module.js",
        // "three-spritetext": "https://unpkg.com/three-spritetext",

        // https://threejs.org/docs/index.html#manual/en/introduction/Installation
        // "three": "https://cdn.jsdelivr.net/npm/three@<version>/build/three.module.js",
        // "three/addons/": "https://cdn.jsdelivr.net/npm/three@<version>/examples/jsm/"

        // "three": `https://cdn.jsdelivr.net/npm/three@${threeVersion}/build/three.module.js`,
        // "three/addons/": `https://cdn.jsdelivr.net/npm/three@${threeVersion}/examples/jsm/`,
        // "mod3d-force-graph": "https://unpkg.com/3d-force-graph",

        "acc-colors": "./js/mod/acc-colors.js",
        "color-tools": "./js/mod/color-tools.js",
        // "d3": "./ext/d3/d3.v7.js",
        "db-mindmaps": "./js/db-mindmaps.js",
        // "db-fc4i": "./js/db-fc4i.js",

        "toast-ui-helpers": "./js/mod/toast-ui-helpers.js",

        // "jsmind": "https://cdn.jsdelivr.net/npm/jsmind@0.8.5/es6/jsmind.js",

        "fc4i-items": "./src/js/share.js",
        "flashcards": "./src/js/mod/flashcards.js",
        "idb-common": "./js/mod/idb-common.js",
        "images": "./js/mod/images.js",
        "is-displayed": "./js/mod/is-displayed.js",

        // The jsmind entry is not used yet:
        /*
        <script
            type="text/javascript"
            src="//cdn.jsdelivr.net/npm/jsmind@0.8.5/es6/jsmind.js"
        ></script>
        */
        // "jsmind": "./ext/jsmind/jsmind-dbg.js",
        // "jsmind": "https://cdn.jsdelivr.net/npm/jsmind@0.8.5/es6/jsmind.js",

        // "jsmind": "./ext/jsmind/es6/jsmind-mm4i.js",
        // "jsmind": "./ext/jsmind/testing/OKjsmind-mm4i.js",
        "jsmind": "./ext/jsmind/testing/jsmind-mm4i.js",
        "jsmind-es6": "./ext/jsmind/es6/jsmind.js",
        // dragging
        "mm4i-jsmind.drag-node": "./ext/jsmind/testing/mm4i-jsmind.drag-node.js",
        "jsmind.drag-node-es6": "./ext/jsmind/es6/jsmind.draggable-node.js",

        "jsmind-edit-common": "./js/jsmind-edit-common.js",
        // "jsmind-edit-spec-fc4i": "./js/jsmind-edit-spec-fc4i.js",
        "jsmind-cust-rend": "./js/jsmind-cust-rend.js",
        // "local-settings": "./src/js/mod/local-settings.js",
        "local-settings": "./js/mod/local-settings.js",
        "mindmap-helpers": "./js/mindmap-helpers.js",
        "my-svg": "./js/mod/my-svg.js",
        "sharing-params": "./src/js/mod/sharing-params.js",
        "move-help": "./js/mod/move-help.js",
        "toolsJs": "./js/mod/tools.js",
        "util-mdc": "./js/mod/util-mdc.js",
        "woff-codepoints": "./js/mod/woff-codepoints.js",
        "woff2-mdc-symbols": "./js/mod/woff2-mdc-symbols.js",
        "webrtc-2-peers": "./js/mod/webrtc-2-peers.js",

        // Tests:
        // "jssm": "https://cdn.jsdelivr.net/npm/jssm@latest/dist/jssm.es6.mjs",
        "jssm": "./ext/jssm/jssm.es6.mjs",
        // "jssm": "https://esm.sh/jssm",
        "jssm-tools": "./js/mod/jssm-tools.js",
        "jssm-viz": "./ext/jssm/jssm-viz.es6.js",
        "mm4i-fsm": "./js/mm4i-fsm.js",
        "mm4i-share": "./js/mm4i-share-link.js",
        // "viz-js": "https://cdn.jsdelivr.net/npm/viz-js@latest/dist/jssm.es6.mjs",
        "viz-js": "./ext/viz-js/viz-standalone.mjs",
        "zoom-move": "./js/mod/zoom-move.js",
        "rd-parser": "./js/mod/rd-parser.js",
        "grammar-search": "./js/mod/grammar-search.js",
        // "no-ui-slider": "https://cdn.jsdelivr.net/npm/nouislider/distribute/nouislider.min.js",
        // "no-ui-slider": "https://cdn.jsdelivr.net/npm/nouislider/distribute/nouislider.mjs",
        // "no-ui-slider": "https://cdn.jsdelivr.net/gh/leongersen/nouislider@15.8.1/distribute/nouislider.mjs",
        // "no-ui-slider": "https://raw.githubusercontent.com/leongersen/nouislider/master/distribute/nouislider.mjs",
        // "no-ui-slider": "https://raw.githubusercontent.com/leongersen/noUiSlider/refs/heads/master/dist/nouislider.mjs",
        // "no-ui-slider": "https://cdn.jsdelivr.net/gh/leongersen/noUiSlider@master/dist/nouislider.mjs",
        "no-ui-slider": "./ext/no-ui-slider/nouislider.mjs",
        // "peerjs": "https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js",
        "peerjs": "https://esm.sh/peerjs@1.5.4?bundle-deps",
        // "qr-creator": "https://esm.sh/qr-creator?bundle=yes",
        "qrcode": "https://cdn.jsdelivr.net/npm/qrcode-esm/+esm",
        "qr-scanner": "https://cdn.jsdelivr.net/npm/qr-scanner@latest/qr-scanner.min.js",


        // new
        "stairs": "./js/mod/stairs.js",
        "shield-click": "./js/mod/shield-click.js",
        "undo-redo-tree": "./js/mod/undo-redo-tree.js",

        // "hashids": "https://cdn.jsdelivr.net/npm/hashids@2.3.0/dist/hashids.esm.js",
        "hashids": "https://esm.sh/hashids@2.3.0",

        // "rxdb-setup": "./js/mod/rxdb-setup.js",
        "rxdb-setup-esbuild": "./rxdb-setup-esbuild.js",
        // "rxdb-setup-webpack": "./rxdb-setup-webpack.js",
        // "rxdb-mm4i": "./js/rxdb-mm4i.js",
        "mm4i-replication": "./js/mm4i-replication.js",
        
        "idb-replicator": "./js/mod/idb-replicator.js",
    };

    const isImporting = {};


    /**
     * 
     * @param {string} idOrLink 
     * @returns 
     */
    async function importFc4i(idOrLink) {
        if (idOrLink.startsWith("https://")) {
            return await import(idOrLink);
        }
        if (idOrLink.startsWith("/")) {
            console.error(`idOrLink should not start with "/" "${idOrLink}"`);
            throw Error(`idOrLink should not start with "/" "${idOrLink}"`);
        }
        const getStackTrace = function () {
            var obj = {};
            // https://v8.dev/docs/stack-trace-api
            // @ts-ignore
            Error.captureStackTrace(obj, getStackTrace);
            const s = obj.stack;
            return s.split(/\n\s*/);
        };

        if (isImporting[idOrLink]) {
            const prevStack = isImporting[idOrLink];
            const prev = `\n>>>PREV "${idOrLink}" stack: ` + prevStack.join("\n  >>>prev ");
            const currStack = getStackTrace();
            const curr = `\nCURR "${idOrLink}" stack: ` + currStack.join("\n  >>>curr ");
            const getStackPoints = (stack) => {
                // Skip Error and importFc4i
                // FIX-ME: check skip
                const points = stack.slice(2).map(row => {
                    const m = row.match(/\((.*?)\)/);
                    // if (!m) throw Error(`row did not match: ${row}`);
                    if (!m) return row.slice(3); // skip "at "
                    const m1 = m[1];
                    return m1;
                });
                return points;
            }
            const prevPoints = getStackPoints(prevStack);
            const currPoints = getStackPoints(currStack);


            //// FIX-ME: how do I see if it is cyclic????

            // const setPrev = new Set(prevPoints);
            // let samePoint;
            // currPoints.forEach(p => { if (setPrev.has(p)) samePoint = p; });
            // console.log("samePoint", samePoint);

            // Is starting point for curr in prev?
            const currStartPoint = currPoints.slice(-1);
            const inPrev = prevPoints.indexOf(currStartPoint) > -1;
            // console.log("inPrev", inPrev);
            if (inPrev) {
                console.warn(`Probably cyclic import for ${idOrLink}`, prev, curr, isImporting);
                debugger; // eslint-disable-line no-debugger
                throw Error(`Cyclic import for ${idOrLink} at ${currStartPoint}`);
            }
        }
        let ourImportLink;
        if (idOrLink.startsWith(".")) {
            // FIX-ME: why is this necessary when using <base ...>? file issue?
            // return await import(makeAbsLink(idOrLink));
            throw Error(`Start with . not tested: ${idOrLink}`);
        }
        if (!ourImportLink) {
            const relUrl = relImports[idOrLink];
            if (relUrl == undefined) {
                console.error(`modId "${idOrLink}" is not known by importFc4i`);
                throw Error(`modId "${idOrLink}" is not known by importFc4i`);
            }
            // FIX-ME: Should baseUrl be used here already?
            ourImportLink = relUrl;
            // ourImportLink = new URL(relUrl, baseUrl);
        }
        if (noCache) {
            ////// This is for non-PWA.
            // Unfortunately there is no standard yet to discover if running as PWA.
            let objNotCached = importFc4i_nocachenames[ourImportLink];
            if (!objNotCached) {
                objNotCached = {};
                // console.log("%cimportFc4i new avoid caching", "background:yellow; color:red;", ourImportLink);
                const getRandomString = () => {
                    return encodeURIComponent(Math.random().toString(36).slice(2));
                }
                const urlNotCached = new URL(ourImportLink, baseUrl);
                urlNotCached.searchParams.set("nocacheRand", getRandomString());
                objNotCached.href = urlNotCached.href;
                importFc4i_nocachenames[ourImportLink] = objNotCached;
            }
            if (!objNotCached.mod) {
                // const mod = await import(urlNotCached.href);
                const mod = await import(objNotCached.href);
                // There is no way to discover if a module has been imported so cache the module here:
                objNotCached.mod = mod;
            } else {
                // console.log("%cimportFc4i using old avoid caching", "background:white; color:red;", ourImportLink);
            }
            return objNotCached.mod;
        }
        isImporting[idOrLink] = getStackTrace();
        const mod = await import(ourImportLink);
        isImporting[idOrLink] = false;
        return mod;
    }
    window["importFc4i"] = importFc4i;

}