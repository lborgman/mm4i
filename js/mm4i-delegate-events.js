// mm4i-fms
// NOts-check
throw "mm4i-delegate is now obsolete";

if (document.currentScript) { throw "File is not loaded as module"; }

const MM4I_DELEGATE_VER = "0.0.0";
const MY_FILE_NAME = (() => { return (new URL(import.meta.url)).pathname.split('/').pop(); })();
window["logConsoleHereIs"](`here is ${MY_FILE_NAME}, module, ${MM4I_DELEGATE_VER}`);
window["logConsoleHereIs"](`here is ${MY_FILE_NAME}, module, ${MM4I_DELEGATE_VER}`);

console.log(`%c${MY_FILE_NAME}`, "font-size:30px;color:red;");

export async function setupEvents(delegatorRoot) {
    window["using-mm4i-delegated-events"] = true;
    const modDelegateEvents = await importFc4i("delegate-events");
    console.log({ modDelegateEvents });

    const idDelgInfo = "div-delegated-info";
    const divDelgInfo = mkElt("div", undefined, "Delegated");
    divDelgInfo.id = idDelgInfo;
    document.body.appendChild(divDelgInfo);
    divDelgInfo.style = `
        position: fixed;
        right: 5px;
        bottom: 1px;
        background: blue;
        color: white;
        z-index: 9999;
        padding: 8px;
    `;


    const delegator = new modDelegateEvents.default(delegatorRoot.parentElement);
    console.log({ delegator })

    const wmSynEvts = new WeakMap();

    /**
     * Register a delegated handler.
     * @param {string} selector
     * @param {"pointerdown"|"pointerup"|"pointermove"|"click"|"dblclick"|"down"|"up"|"move"|"doubleclick"} type
     * // JsDoc is a mess, use "any" here:
     * param {(event: SyntheticEvent) => void} handler
     * @param {(synEvt: any) => void} handler
     */
    function delegate(selector, type, handler) {
        /**
         * @param {any} synEvt
        */
        function handleAndLog(synEvt) {
            // divDelgInfo.textContent = `${selector}: ${type}`;
            console.warn(`%chandleAndLog: ${selector}: ${type}`, "color:green;font-size:20px;", synEvt);
            // handler(synEvt);
            let arr = wmSynEvts.get(synEvt);
            if (!arr) {
                arr = [];
                wmSynEvts.set(synEvt, arr);
            }
            arr.push({ selector, type, handler });
            modTools.callDebounced({
                callback: () => {
                    // debugger;
                    const depths = delegator.selectorsDepth;
                    let depth = 0;
                    let theDelegated;
                    arr.forEach(rec => {
                        const recDepth = depths[rec.selector];
                        if (recDepth > depth) {
                            depth = recDepth
                            theDelegated = rec;
                        }
                    })
                    if (!theDelegated) throw Error("theDelegated is undefined");
                    divDelgInfo.textContent = `${theDelegated.selector}: ${type}`;
                    // const theDelegated = arr.pop();
                    const theHandler = theDelegated.handler;
                    theHandler(synEvt);
                }
            });
        }
        delegator.on(selector, type, handleAndLog);
    }



    // debugger;

    // delegator.on("jmnode", "click", () => { console.log("delegated click jmnode") });
    // delegator.on("jmnode>span.has-notes-mark", "click", () => { console.log("delegated click notes mark") });

    const modEditCommon = await importFc4i("jsmind-edit-common")
    const modMMhelpers = await importFc4i("mindmap-helpers");
    const modTools = await importFc4i("toolsJs");
    console.log({ modTools });
    // debugger;

    // delegate("jmnode", "badclick", () => { console.log("delegated click jmnode") });

    delegate("jmnode", "click", async (myEvent) => {
        console.log("delegated click jmnode");
        myEvent.stopImmediatePropagation();
        // debugger;
        const jmnode = myEvent.target.closest("jmnode");
        const node_id = modEditCommon.getNodeIdFromDOMelt(jmnode);
        const jmDisplayed = await modMMhelpers.getJmDisplayed();
        jmDisplayed.select_node(node_id);
    });
    delegate("jmnode", "dblclick", async (myEvent) => {
        console.log("delegated dblclick jmnode");
    });

    delegate("jmnode>span.has-notes-mark", "click", async (myArgs) => {
        console.log("delegated click notes mark", myArgs);
        const jmnode = myArgs.target.closest("jmnode");
        modEditCommon.editNotes(jmnode);
    });

    delegate("jmexpander", "click", (myArgs) => {
        console.log("delegated click jmexpander");
        const targetExpander = myArgs.target;
        modEditCommon.doExpanding(targetExpander);
    });

    // delegate("div.jsmind-inner", "click", (myArgs) => {
    delegate("div.jsmind-inner", "click", (myArgs) => {
        console.log("div.jsmind-inner click");
    });
    delegate("div.jsmind-inner", "dblclick", (myArgs) => {
        console.log("div.jsmind-inner dblclick");
    });
    delegate("div.jsmind-inner", "doubleclick", (myArgs) => {
        console.log("div.jsmind-inner doubleclick");
    });


    ////// FSL hooks
}
