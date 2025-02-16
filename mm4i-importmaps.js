// @ts-check
const MM4I_IMPORTMAPS_VER = "0.2.6";
window["logConsoleHereIs"](`here is mm4i-importmaps ${MM4I_IMPORTMAPS_VER}`);
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

        // "easyMDE-helpers": "./js/mod/easyMDE-helpers.js",
        // "easyMDE-helpers": "./js/mod/toast-ui-helpers.js",
        "toast-ui-helpers": "./js/mod/toast-ui-helpers.js",

        // "toast-ui": "https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js",
        // "toast-ui": "/ext/toast-ui/toastui-editor-all.min.js",
        // "toast-ui": "https://cdn.jsdelivr.net/npm/@toast-ui/editor@latest/dist/esm/index.js",
        // The es6 from jsdelivr is flawed:
        // "toast-ui": "https://cdn.jsdelivr.net/npm/@toast-ui/editor@latest/+esm",

        // "easymde": "https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js",
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
        "jsmind-edit-spec-fc4i": "./js/jsmind-edit-spec-fc4i.js",
        "jsmind-cust-rend": "./js/jsmind-cust-rend.js",
        "jssm-tools": "./js/mod/jssm-tools.js",
        "local-settings": "./src/js/mod/local-settings.js",
        "mindmap-helpers": "./js/mindmap-helpers.js",
        "my-svg": "./js/mod/my-svg.js",
        "mm4i-jsmind.drag-node": "./ext/jsmind/testing/mm4i-jsmind.drag-node.js",
        // "mm4i-jsmind.draggable-nodes": "./ext/jsmind/testing/jsmind.draggable-node-TEMP.js",
        "sharing-params": "./src/js/mod/sharing-params.js",
        "move-help": "./js/mod/move-help.js",
        "toolsJs": "./js/mod/tools.js",
        "util-mdc": "./js/mod/util-mdc.js",

        // Tests:
        "easymde": "https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js",
        "jssm": "https://cdn.jsdelivr.net/npm/jssm@latest/dist/jssm.es6.mjs",
        "jssm-viz": "./ext/jssm/jssm-viz.es6.js",
        "mm4i-fsm": "./js/mm4i-fsm.js",
        // "viz-js": "https://cdn.jsdelivr.net/npm/viz-js@latest/dist/jssm.es6.mjs",
        "viz-js": "./ext/viz-js/viz-standalone.mjs",
        // "zoom": "https://cdn.jsdelivr.net/npm/pinch-zoom-js@latest/dist/jssm.es6.mjs",
        "zoom": "./js/mod/zoom.js",
        "rd-parser": "./js/mod/rd-parser.js",
        "grammar-search": "./js/mod/grammar-search.js",
    };
    /*
        It looks like you can't reliable use importmap this way:

        const elt = document.createElement("script");
        elt.type = "importmap";
        const objMap = {
            imports: relImports
        }
        elt.textContent = JSON.stringify(objMap, null, 2);
        document.currentScript.insertAdjacentElement("afterend", elt);
    */

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
            // FIX-ME: how do I see if it is cyclic????

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
            // ourImportLink = makeAbsLink(idOrLink);
        }
        if (!ourImportLink) {
            const relUrl = relImports[idOrLink];
            if (relUrl == undefined) {
                console.error(`modId "${idOrLink}" is not known by importFc4i`);
                throw Error(`modId "${idOrLink}" is not known by importFc4i`);
            }
            ourImportLink = relUrl;
        }
        isImporting[idOrLink] = getStackTrace();
        const mod = await import(ourImportLink);
        isImporting[idOrLink] = false;
        return mod;
    }
    window["importFc4i"] = importFc4i;

    /*
    const makeAbsLink = (relLink) => {
        if (relLink.startsWith("/")) throw Error(`relLink should not start with "/" "${relLink}`);
        const u = new URL(relLink, document.baseURI);
        return u.href;
    }
    window.makeAbsLink = makeAbsLink;
     */
}

// console.log("END fc4i-importmaps");