// @ts-check
const MM4I_IMPORTMAPS_VER = "0.2.6";
window["logConsoleHereIs"](`here is mm4i-importmaps ${MM4I_IMPORTMAPS_VER}`);

const importFc4i_nocachenames = {};

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
        "d3": "./ext/d3/d3.v7.js",
        "db-mindmaps": "./js/db-mindmaps.js",
        "db-fc4i": "./js/db-fc4i.js",

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

        "jsmind-edit-common": "./js/jsmind-edit-common.js",
        // "jsmind-edit-spec-fc4i": "./js/jsmind-edit-spec-fc4i.js",
        "jsmind-cust-rend": "./js/jsmind-cust-rend.js",
        "jssm-tools": "./js/mod/jssm-tools.js",
        "local-settings": "./src/js/mod/local-settings.js",
        "mindmap-helpers": "./js/mindmap-helpers.js",
        "my-svg": "./js/mod/my-svg.js",
        "mm4i-jsmind.drag-node": "./ext/jsmind/testing/mm4i-jsmind.drag-node.js",
        "sharing-params": "./src/js/mod/sharing-params.js",
        "move-help": "./js/mod/move-help.js",
        "toolsJs": "./js/mod/tools.js",
        "util-mdc": "./js/mod/util-mdc.js",

        // Tests:
        "jssm": "https://cdn.jsdelivr.net/npm/jssm@latest/dist/jssm.es6.mjs",
        "jssm-viz": "./ext/jssm/jssm-viz.es6.js",
        "mm4i-fsm": "./js/mm4i-fsm.js",
        // "viz-js": "https://cdn.jsdelivr.net/npm/viz-js@latest/dist/jssm.es6.mjs",
        "viz-js": "./ext/viz-js/viz-standalone.mjs",
        "zoom": "./js/mod/zoom.js",
        "rd-parser": "./js/mod/rd-parser.js",
        "grammar-search": "./js/mod/grammar-search.js",
        // "no-ui-slider": "https://cdn.jsdelivr.net/npm/nouislider/distribute/nouislider.min.js",
        // "no-ui-slider": "https://cdn.jsdelivr.net/npm/nouislider/distribute/nouislider.mjs",
        // "no-ui-slider": "https://cdn.jsdelivr.net/gh/leongersen/nouislider@15.8.1/distribute/nouislider.mjs",
        // "no-ui-slider": "https://raw.githubusercontent.com/leongersen/nouislider/master/distribute/nouislider.mjs",
        // "no-ui-slider": "https://raw.githubusercontent.com/leongersen/noUiSlider/refs/heads/master/dist/nouislider.mjs",
        // "no-ui-slider": "https://cdn.jsdelivr.net/gh/leongersen/noUiSlider@master/dist/nouislider.mjs",
        "no-ui-slider": "./ext/no-ui-slider/nouislider.mjs",

        // new
        "stairs": "./js/mod/stairs.js",
        "shield-click": "./js/mod/shield-click.js",
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
            ourImportLink = relUrl;
        }
        const noCache = false; // FIX-ME: problem on github
        if (noCache) {
            // This is for non-PWA.
            // Unfortunately there is no standard yet to discover if running as PWA.
            let hrefNotCached = importFc4i_nocachenames[ourImportLink];
            if (!hrefNotCached) {
                console.log("%cimportFc4i avoid caching", "background:yellow; color:red;", ourImportLink);
                const getRandomString = () => { return Math.random().toString(36).substring(2, 15) }
                const urlNotCached = new URL(ourImportLink, window.location.origin);
                urlNotCached.searchParams.set("nocacheRand", getRandomString());
                hrefNotCached = urlNotCached.href;
                importFc4i_nocachenames[ourImportLink] = hrefNotCached;
            }
            const mod = await import(hrefNotCached);
            return mod;
        }
        isImporting[idOrLink] = getStackTrace();
        const mod = await import(ourImportLink);
        isImporting[idOrLink] = false;
        return mod;
    }
    window["importFc4i"] = importFc4i;

}