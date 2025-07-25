// @ts-check

const VERSION = "0.1.001";
window["logConsoleHereIs"](`here is mindmap-helpers.js, module, ${VERSION}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

const mkElt = window["mkElt"];
const importFc4i = window["importFc4i"];
const makeAbsLink = window["makeAbsLink"];

const URL_MINDMAPS_PAGE = "./mm4i.html";

const modTools = await importFc4i("toolsJs");
const throttleDBsaveNowMindmapPlusUndoRedo = modTools.throttleTO(DBsaveNowMindmapPlusUndoRedo, 300);


let undoRedoTreeStyle;
/**
 * Use tree or linear style undo.
 *  
 * @param {boolean} useTreeStyle 
 */
export function setUndoRedoTreeStyle(useTreeStyle) {
    const tofStyle = typeof useTreeStyle;
    if (tofStyle != "boolean") throw Error(`Parameter useTreeStyle must be boolean, was "${useTreeStyle}"`)
    undoRedoTreeStyle = useTreeStyle;
}
/**
 * Return true if tree style undo/redo.
 * 
 * @returns boolean
 */
export function getUndoRedoTreeStyle() { return undoRedoTreeStyle; }

export async function startUndoRedo(keyName, jmDisplayed) {
    if (!jmDisplayed.get_selected_node) {
        debugger;
        throw Error("!jmDisplayed.get_selected_node");
    }
    // checkisformat
    const dbMindmaps = await importFc4i("db-mindmaps");
    const objBaseMm = (await dbMindmaps.DBgetMindmap(keyName)) || jmDisplayed;
    if (undoRedoTreeStyle === undefined) {
        throw Error("setUndoRedoTreeStyle(true/false) has not been called");
    }
    const funBranch = undoRedoTreeStyle ? _ourFunBranch : undefined;
    async function _ourFunBranch(defaultBranch, arrBrancheTopics) {
        if (!Number.isInteger(defaultBranch) || defaultBranch < 0) { throw Error(`Invalid defaultBranch "${defaultBranch}"`); }
        console.log(`  ourFunBranch called with defaultBranch: ${defaultBranch}, arrBranches:`, arrBrancheTopics);
        const importFc4i = window["importFc4i"];
        const modTools = await importFc4i("toolsJs");
        await modTools.waitSeconds(0.5); // Simulate some delay
        const branch = defaultBranch;
        const topic = arrBrancheTopics[branch];
        if (!topic) {
            debugger; // eslint-disable-line no-debugger
            throw Error(`No topic found for branch ${branch}`);
        }
        console.log(`  will redo "${topic}", branch: ${branch}`);
        return branch; // Always return the default branch for now
    }
    const other = {
        selected_id: "root"
    }
    checkIsMMformatStored(objBaseMm, "startUndoRedo, objBaseMm");
    const objInitialState = {
        // objDataMind: objBaseMm,
        objMindStored: objBaseMm,
        other
    }
    checkIsFullMindmapDisplayState(objInitialState, "startUndoRedo");
    const modUndo = await importFc4i("undo-redo-tree");
    modUndo.addUndoRedo(keyName, objInitialState, funBranch);
}

export async function getCurrentFullMindmapDisplayState() {
    const modJsmindDraggable = await importFc4i("mm4i-jsmind.drag-node");
    const jm = modJsmindDraggable.getOurJm();
    if (!jm) throw Error("getCurrentFullMindmapDisplay: .getOurJm() return undefined");
    return getFullMindmapDisplayState(jm);
}
export async function getFullMindmapDisplayState(jmDisplayed) {
    const selected_id = jmDisplayed.get_selected_node().id;
    const modZoomMove = await importFc4i("zoom-move");
    const zoomed = modZoomMove.getZoomPercentage();
    const moved = modZoomMove.getMoved();
    const other = {
        selected_id,
        zoomed,
        moved
    }
    const objMindStored = jmDisplayed.get_data("node_array");
    checkIsMMformatStored(objMindStored, "getFullMindmapDisplayState, objMindStored", ["key"]);
    const objToSave = {
        objMindStored,
        other
    }
    return objToSave;
}

async function saveMindmapPlusUndoRedo(keyName, jmDisplayed, actionTopic, lastUpdated, lastSynced, privacy) {
    checkIsMMformatJmdisplayed(jmDisplayed, "saveMindmapPlusUndoRedo");
    const dbMindmaps = await importFc4i("db-mindmaps");
    const modUndo = await importFc4i("undo-redo-tree");
    if (!modUndo.hasUndoRedo(keyName)) {
        await startUndoRedo(keyName, jmDisplayed);
    }
    const objFullMindmapDisplayState = await getFullMindmapDisplayState(jmDisplayed);
    // objDataMind.key = keyName;
    objFullMindmapDisplayState.objMindStored.key = keyName;

    checkIsFullMindmapDisplayState(objFullMindmapDisplayState, "saveMindmapPlusUndoRedo");

    modUndo.actionRecordAction(keyName, objFullMindmapDisplayState, actionTopic);
    const objMindData = jmDisplayed.get_data("node_array");
    objMindData.key = keyName;
    // return await dbMindmaps.DBsetMindmap(keyName, jmDisplayed, lastUpdated, lastSynced, privacy);
    return await dbMindmaps.DBsetMindmap(keyName, objMindData, lastUpdated, lastSynced, privacy);
}

export async function DBundo(keyName) {
    if (arguments.length != 1) { throw Error(`Should have 1 argument: ${arguments.length}`); }
    if (typeof keyName != "string") { throw Error(`keyName is not string: ${typeof keyName}`); }
    const modUndo = await importFc4i("undo-redo-tree");
    // debugger; // eslint-disable-line no-debugger
    const objDataMind = modUndo.actionUndo(keyName);
    if (!objDataMind) {
        console.error("objDataMind is null");
        debugger; // eslint-disable-line no-debugger
    }
    const dbMindmaps = await importFc4i("db-mindmaps");
    return await dbMindmaps.DBsetMindmap(keyName, objDataMind);
}
export async function DBredo(keyName) {
    if (arguments.length != 1) { throw Error(`Should have 1 argument: ${arguments.length}`); }
    if (typeof keyName != "string") { throw Error(`keyName is not string: ${typeof keyName}`); }
    const modUndo = await importFc4i("undo-redo-tree");
    // debugger; // eslint-disable-line no-debugger
    const objDataMind = await modUndo.actionRedo(keyName);
    const dbMindmaps = await importFc4i("db-mindmaps");
    await dbMindmaps.DBsetMindmap(keyName, objDataMind);
    return objDataMind
}
export function DBrequestSaveMindmapPlusUndoRedo(jmDisplayed, actionTopic) {
    if (arguments.length != 2) {
        debugger; // eslint-disable-line no-debugger
        throw Error(`Wrong number of arguments: ${arguments.length} (should be 2)`);
    }
    checkIsMMformatJmdisplayed(jmDisplayed, "DBrequestSaveMindmapPlusUndoRedo");
    if (typeof actionTopic != "string") {
        console.error(`actionTopic is not string: ${typeof actionTopic}`);
        debugger; // eslint-disable-line no-debugger
        throw Error(`actionTopic is not string: ${typeof actionTopic}`);
    }
    throttleDBsaveNowMindmapPlusUndoRedo(jmDisplayed, actionTopic);
}
async function DBsaveNowMindmapPlusUndoRedo(jmDisplayed, actionTopic) {
    // if (!checkIsMMformatJmdisplayed(jmDisplayed)) throw Error("!checkIsMMformatJmdisplayed(jmDisplayed))");
    checkIsMMformatJmdisplayed(jmDisplayed, "DBsaveNowMindmapPlusUndoRedo");
    // debugger;
    const tofTopic = typeof actionTopic;
    if (tofTopic != "string") { throw Error(`Wrong actionTopic type: ${tofTopic} (should be string)`); }
    const objDataMind = jmDisplayed.get_data("node_array");
    const metaName = objDataMind.meta.name;
    if (!metaName) throw Error("Current mindmap has no meta.key");
    const [keyName] = metaName.split("/");

    // await saveMindmapPlusUndoRedo(keyName, objDataMind, actionTopic, (new Date()).toISOString());
    // debugger;
    await saveMindmapPlusUndoRedo(keyName, jmDisplayed, actionTopic, (new Date()).toISOString());
}

export function getNextMindmapKey() { return "mm-" + new Date().toISOString(); }

export function showMindmap(key) {
    const absLink = makeAbsLink(URL_MINDMAPS_PAGE);
    const url = new URL(absLink);
    url.searchParams.set("mindmap", key);
    location.href = url.href;
}

export async function createAndShowNewMindmap() {
    if (arguments.length != 0) throw Error("This function should no longer have a parameter");
    const jsMindMap = await dialogCreateMindMap();
    if (!jsMindMap) return;
    const keyName = jsMindMap.meta.name;
    console.log({ jsMindMap, keyName });

    const root = jsMindMap.data[0];
    // root.data = {};
    // root.data.shapeEtc = {};
    // root.data.shapeEtc.shape = "jsmind-shape-ellipse";
    root.shapeEtc = {};
    root.shapeEtc.shape = "jsmind-shape-ellipse";

    jsMindMap.key = keyName;
    checkIsMMformatStored(jsMindMap, "createAndShowNewMindmap");

    const dbMindmaps = await importFc4i("db-mindmaps");
    const key = await dbMindmaps.DBsetMindmap(keyName, jsMindMap);
    if (key != keyName) {
        throw Error(`key:"${key}" != keyName:"${keyName}"`)
    }

    showMindmap(keyName);
}

export async function getMindmap(key) {
    const dbMindmaps = await importFc4i("db-mindmaps");
    return dbMindmaps.DBgetMindmap(key);
}

export function getMindmapTopicO(jsMm) {
    let topic;
    switch (jsMm.format) {
        case "node_tree":
            topic = jsMm.data.topic;
            break;
        case "node_array":
            topic = jsMm.data[0].topic;
            break;
        case "freemind":
            const s = jsMm.data;
            topic = s.match(/<node .*?TEXT="([^"]*)"/)[1];
            break;
        default:
            throw Error(`Unknown mindmap format: ${jsMm.format}`);
    }
    return topic;
}
export async function getMindmapTopic(key) {
    const dbMindmaps = await importFc4i("db-mindmaps");
    const jsMm = await dbMindmaps.DBgetMindmap(key);
    // debugger;
    return getMindmapTopicO(jsMm);
}


async function dialogCreateMindMap() {
    const modMdc = await importFc4i("util-mdc");
    // const dbMindmaps = await getDbMindmaps();
    const dbMindmaps = await importFc4i("db-mindmaps");

    const title = mkElt("h2", undefined, "Create new mindmap");
    // const nextKey = getNextMindmapKey();
    const pTopicOk = mkElt("p", undefined, "");
    pTopicOk.textContent = "Please input a topic name.";
    const inpRoot = modMdc.mkMDCtextFieldInput(undefined, "text");
    let btnOk;
    const arrAll = await dbMindmaps.DBgetAllMindmaps();
    inpRoot.addEventListener("input", _evt => {
        const topic = inpRoot.value.trim();
        // console.log({ topic });
        let valid = true;
        if (topic.length === 0) {
            valid = false;
            pTopicOk.textContent = "Please input a topic name.";
        }
        if (valid) {
            arrAll.forEach(r => {
                if (!valid) return;
                const mm = r.jsmindmap;
                if (mm.format != "node_array") throw Error(`Expected format "node_array": ${mm.format}`);
                const root = mm.data[0];
                if (root.id != "root") throw Error(`Not root: ${root.id}`);
                const oldTopic = root.topic;
                if (valid && (oldTopic === topic)) {
                    valid = false;
                }
            });
            if (!valid) pTopicOk.textContent = "Name exists in another mindmap.";
        }
        btnOk.disabled = !valid;
        if (valid) {
            pTopicOk.textContent = "Name is valid";
        }
    });
    const tfRoot = modMdc.mkMDCtextField("Root node topic name", inpRoot);
    const body = mkElt("div", undefined, [
        title,
        tfRoot,
        pTopicOk,
    ]);
    setTimeout(() => {
        btnOk = title.closest("div.mdc-dialog").querySelector("button");
        console.log({ btnOk });
        btnOk.disabled = true;
    });
    const res = await modMdc.mkMDCdialogConfirm(body);
    console.log({ res });
    if (res) {
        const rootTopic = inpRoot.value.trim();
        // getNewMindmap(nextKey, rootTopic, author, version, format);
        const emptyJsmind = getNewMindmap(rootTopic);
        // return { jsmindmap: emptyJsmind };
        return emptyJsmind;
    }
}



export async function getMindmapsHits(customKey) {
    // const dbMindmaps = await getDbMindmaps();
    const dbMindmaps = await importFc4i("db-mindmaps");
    const provider = "fc4i"; // FIX-ME:
    const modCustRend = await importFc4i("jsmind-cust-rend");
    const searchedTopic = (await modCustRend.getOurCustomRenderer()).customData2jsmindTopic(customKey, provider);
    const promArrMindmaps = (await dbMindmaps.DBgetAllMindmaps())
        .map(m => {
            const mindmap = m.jsmindmap;
            if (mindmap.format != "node_array") {
                console.error("Wrong mindmap format", { mindmap, m })
                throw Error(`Wrong mindmap format: ${mindmap.format} (should be "node_array")`);
            }
            const nodeData = mindmap.data;
            const hits = [];
            m.hits = hits;
            nodeData.forEach(nd => {
                // const strCustom = nd.custom;
                // if (!strCustom) return;
                // const objCustom = JSON.parse(strCustom);
                // console.log({ nd, objCustom });
                // if (objCustom.key == customKey) { hits.push(nd); }
                if (nd.shapeEtc?.nodeCustom) {
                    const key = nd.shapeEtc.nodeCustom.key;
                    const topic = nd.topic;
                    // FIX-ME: key, provider, better search
                    // if (topic.search(customKey) > 0) { hits.push(nd); };
                    if (key == customKey) { hits.push(nd); };
                    if (topic == searchedTopic) { hits.push(nd); };
                }
            });
            return m;
        })
        .filter(m => m.hits.length > 0);
    return promArrMindmaps;
}

export function getMindmapURL(mkey) {
    const absLink = makeAbsLink(URL_MINDMAPS_PAGE);
    const url = new URL(absLink);
    url.searchParams.set("mindmap", mkey);
    return url;
}
export function mkEltLinkMindmapA(topic, mkey, mhits, provider) {
    // const absLink = makeAbsLink(URL_MINDMAPS_PAGE);
    // const url = new URL(absLink);
    // url.searchParams.set("mindmap", mkey);
    const url = getMindmapURL(mkey);


    // if (!noCache) { url.searchParams.delete("cachemodules"); }
    if (mhits) {
        url.searchParams.set("provider", provider);
        const hits = mhits.map(h => h.id);
        console.log({ hits })
        url.searchParams.set("nodehits", hits);
    }
    const eltA = mkElt("a", undefined, topic);
    eltA.href = url;
    return eltA;
}





/*
export async function pasteCustomClipDialog() {
    const modMdc = await importFc4i("util-mdc");
    const arrClip = fetchJsmindCopied4Mindmap();
    if (!arrClip) debugger; // eslint-disable-line no-debugger

    let result;
    const info = mkElt("p", undefined, "Link selected node to one of these custom entries:");
    const divPastes = mkElt("div", { id: "jsmind-test-custom-paste" }, info);
    const body = mkElt("div", undefined, [info, divPastes]);
    const arrProm = arrClip.map(async objClip => {
        const div1 = await mkDivOneCustomClip(objClip);
        const thisClip = JSON.parse(JSON.stringify(objClip));
        div1.dataset.clip = JSON.stringify(objClip);
        div1.addEventListener("click", evt => {
            result = thisClip;
            closeDialog();
        });
        return div1;
    });
    const arrElt = await Promise.all(arrProm);
    arrElt.forEach(eltClip => {
        divPastes.appendChild(eltClip);
    });

    const btnCancel = modMdc.mkMDCdialogButton("Cancel", "close");
    const eltActions = modMdc.mkMDCdialogActions([btnCancel]);
    const dlg = await modMdc.mkMDCdialog(body, eltActions);
    function closeDialog() { dlg.mdc.close(); }
    return await new Promise((resolve, reject) => {
        dlg.dom.addEventListener("MDCDialog:closed", errorHandlerAsyncEvent(async evt => {
            const action = evt.detail.action;
            console.log({ action, result });
            resolve(result);
        }));
    });
}
*/

/*
async function mkDivOneCustomClip(objCustomClip) {
    const modMdc = await importFc4i("util-mdc");
    const modCustRend = await importFc4i("jsmind-cust-rend");
    // const keyRec = await get1Reminder(objCustomClip.key); // FIX-ME: provider
    const key = objCustomClip.key;
    const provider = objCustomClip.provider;
    const keyRec = await (await modCustRend.getOurCustomRenderer()).getCustomRec(key, provider);

    const eltTitle = mkElt("span", undefined, keyRec.title)
    const divClipInner = mkElt("div", { class: "jsmind-test-custom-clip-inner" }, eltTitle);
    const divClip = mkElt("div", { class: "mdc-card jsmind-test-custom-clip" }, divClipInner);
    const blob = keyRec.images[0];
    if (blob) {
        const eltBlob = mkElt("span", { class: "image-bg-contain image-thumb-size" });
        eltBlob.style.backgroundPositionY = "bottom";
        const urlBlob = URL.createObjectURL(blob);
        const urlBg = `url(${urlBlob})`;
        eltBlob.style.backgroundImage = urlBg;
        const divBlob = mkElt("div", { class: "dialog-mindmaps-image" }, eltBlob);
        divClipInner.appendChild(divBlob);
    }
    const btnRemove = modMdc.mkMDCiconButton("close", "Remove from custom clips");
    btnRemove.classList.add("upper-left-remove-button");
    btnRemove.addEventListener("click", evt => {
        evt.stopPropagation();
        removeJsmindCopied4Mindmap(objCustomClip);
        divClip.remove();
    });
    divClip.appendChild(btnRemove);
    return divClip;
}
*/

/*
async function dialogShowCustomClipboard() {
    const modMdc = await importFc4i("util-mdc");
    const modCustRend = await importFc4i("jsmind-cust-rend");
    const arrClip = fetchJsmindCopied4Mindmap();
    console.log({ arrCopied4Mindmap: arrClip });
    const body = mkElt("div", { id: "jsmind-test-custom-clipboard" });
    const ourRend = await modCustRend.getOurCustomRenderer();
    const arrProviders = ourRend.getProviderNames();
    const arrProm = arrClip
        .filter(objClip => arrProviders.includes(objClip.provider))
        .map(objClip => mkDivOneCustomClip(objClip));
    const arrElt = await Promise.all(arrProm);
    arrElt.forEach(eltClip => {
        body.appendChild(eltClip);
    });
    modMdc.mkMDCdialogAlert(body, "Close");
}
*/


/*
export async function dialogAdded2CustomClipboard(objAdded) {
    const modMdc = await importFc4i("util-mdc");
    const divObjAdded = await mkDivOneCustomClip(objAdded);
    divObjAdded.style.width = "100%";
    divObjAdded.style.height = "unset";
    const btnRemove = divObjAdded.lastElementChild;
    if (btnRemove.tagName != "BUTTON") throw Error(`Not button remove: ${btnRemove.tagName}`);
    btnRemove.remove();
    const title = mkElt("h2", undefined, "Copied to custom clipboard");
    const info = mkElt("p", undefined, [
        "To use it open a mindmap and edit a node.",
    ]);
    const btn = modMdc.mkMDCbutton("Show custom clipboard", "raised");
    btn.addEventListener("click", evt => {
        dialogShowCustomClipboard();
        closeDialog();
    });
    const divBtn = mkElt("p", undefined, btn);
    const body = mkElt("div", undefined, [
        title,
        info,
        divObjAdded,
        divBtn
    ])
    const dlg = await modMdc.mkMDCdialogAlert(body, "Close");
    console.log({ dlg });
    function closeDialog() { dlg.mdc.close(); }
}
*/








/*
function setJsmindCopied4Mindmap(strJson) {
    localStorage.setItem("jsmind-copied4mindmap", strJson);
}
function getJsmindCopied4Mindmap() {
    return localStorage.getItem("jsmind-copied4mindmap");
}
*/

/*
export function addJsmindCopied4Mindmap(key, provider) {
    const strJson = JSON.stringify({ key, provider });
    const objAdded = JSON.parse(strJson);
    let arrClips = fetchJsmindCopied4Mindmap() || [];
    arrClips = arrClips.filter(obj => {
        const str = JSON.stringify(obj);
        return str != strJson;
    });
    arrClips.unshift(objAdded);
    const strArr = JSON.stringify(arrClips);
    setJsmindCopied4Mindmap(strArr);
    return objAdded;
}
*/

/*
function removeJsmindCopied4Mindmap(objRemove) {
    const strRemove = JSON.stringify(objRemove);
    const arrOldClips = fetchJsmindCopied4Mindmap() || [];
    const arrNewClips = arrOldClips.filter(obj => {
        const str = JSON.stringify(obj);
        return str != strRemove;
    });
    setJsmindCopied4Mindmap(JSON.stringify(arrNewClips));
}
*/
/*
function fetchJsmindCopied4Mindmap() {
    const strJson = getJsmindCopied4Mindmap();
    if (strJson) {
        const obj = JSON.parse(strJson);
        console.log({ obj });
        if (!Array.isArray(obj)) { return [obj]; }
        return obj;
    }
}
*/
/*
function clearJsmindCopied4Mindmap() {
    // FIX-ME: not used
    console.warn("clearJsmindCopied4Mindmap");
    localStorage.removeItem("jsmind-copied4mindmap");
}
*/



export function getNewMindmap(rootTopic, author, version, format) {
    // if (!keyName) throw Error("No key given for new mindmap");
    const keyName = getNextMindmapKey();
    format = format || "node_array";
    rootTopic = rootTopic || `Jsmind ${format}`;
    version = version || "1.0.0";
    const name = keyName;
    const meta = { name, author, version };
    const mind0 = { meta }
    mind0.format = format;
    switch (format) {
        case "node_array":
            mind0.data = [{ "id": "root", isroot: true, "topic": rootTopic, }];
            break;
        case "node_tree":
            mind0.data = { "id": "root", "topic": rootTopic, };
            break;
        case "freemind":
            mind0.data = `<map version="1.0.1"><node ID="root" TEXT="${rootTopic}"/></map>`;
            break;
        default:
            throw Error(`Bad jsmind map format: ${format}`);
    }
    return mind0;
}



export async function getMindmapPrivacy(key) {
    const dbMindmaps = await importFc4i("db-mindmaps");
    const jsMindmap = await dbMindmaps.DBgetMindmap(key);
    return getMindmapPrivacyFromObject(jsMindmap);
}
export function getMindmapPrivacyFromObject(jsMindmap) {
    // jsMindMap.meta.name = `${metaKey}/${updated}/${synched}/${priv}`;
    const metaName = jsMindmap.meta.name;
    const [_metaKey, _oldUpdated, _lastSynced, savedPrivacy] = metaName.split("/");
    const privacy = savedPrivacy || "private";
    checkIsPrivacyEnum(privacy);
    return privacy;
}

function checkIsPrivacyEnum(privacy) {
    const enumPriv = ["private", "shared"];
    if (!enumPriv.includes(privacy)) {
        debugger; // eslint-disable-line no-debugger
        throw Error(`Not privacy enum: ${privacy}`);
    }
}

/**
 * 
 * @param {string} key 
 * @param {string} newPrivacy 
 * @returns {Promise<any>} 
 */
export async function setMindmapPrivacy(key, newPrivacy) {
    checkIsPrivacyEnum(newPrivacy);
    const dbMindmaps = await importFc4i("db-mindmaps");
    const jsMindmap = await dbMindmaps.DBgetMindmap(key);
    const { lastUpdated, lastSynced, privacy } = dbMindmaps.getMindmapMetaParts(jsMindmap);
    if (privacy == newPrivacy) { return; }

    return saveMindmapPlusUndoRedo(key, jsMindmap, "set privacy", lastUpdated, lastSynced, newPrivacy);
}

/**
 * Get keys for all shareable mindmaps.
 * 
 * @returns {Promise<string[]>}
 */
export async function getSharedMindmaps() {
    const dbMindmaps = await importFc4i("db-mindmaps");
    const arrMindmaps = await dbMindmaps.DBgetAllMindmaps();
    // debugger;
    const arrShared = arrMindmaps
        .filter(mh => {
            const j = mh.jsmindmap;
            const privacy = getMindmapPrivacyFromObject(j);
            return privacy == "shared";
        });
    // .map(mm => mm.key);
    return arrShared;
}



/**
 * Check if obj is in the format for a displayed mindmap.
 *  
 * @param {Object} obj 
 * @param {string} where 
 * 
 * @throws
 */
export function checkIsMMformatJmdisplayed(obj, where) {
    const throwErr = (what) => {
        const msg = `(checkIsMMformatJmdisplayed) ${where}: ${what}`;
        console.error(msg);
        debugger;
        throw Error(msg);
    }
    const tofObj = typeof obj;
    if (tofObj != "object") throwErr(`typeof obj == ${tofObj}`);
    const arrTemplate = [
        "data", "event_handles", "initialized", "layout", "mind", "options",
        "shortcut", "version", "view"
    ];
    const objTemplate = Object.fromEntries(arrTemplate.map(item => [item, true]));
    if (!modTools.haveSameKeys(objTemplate, obj)) {
        throw Error("Not isMMformatJsMind");
    }
}


/**
 * Check obj is undo/redo state
 *  
 * @param {Object} obj 
 * @throws
 */
export function checkIsFullMindmapDisplayState(obj, where) {
    const throwErr = (what) => {
        const msg = `checkIsFullMindmapDisplayState, ${where}: ${what}`
        console.error(msg, obj);
        debugger;
        throw Error(msg);
    }
    // const arrTemplate = [ "objDataMind", "other" ]
    const arrTemplate = ["objMindStored", "other"]
    const objTemplate = Object.fromEntries(arrTemplate.map(item => [item, true]));
    if (!modTools.haveSameKeys(objTemplate, obj)) {
        // const msg = `Not a fullDisplayState: ${JSON.stringify(obj)}`;
        const msg = `Not a fullDisplayState`;
        // console.error(msg);
        // debugger; // eslint-disable-line no-debugger
        throwErr(msg);
    }
    checkIsMMformatStored(obj["objMindStored"], "checkIsFullDisplayState");
}


/**
 * 
 * @param {Object} obj 
 * @param {string} where 
 * @param {string[] | undefined } arrMayMiss;
 * @param {boolean | undefined } allowIsSavedBookmark;
 * @throws
 */
export function checkIsMMformatStored(obj, where, arrMayMiss = undefined, allowIsSavedBookmark = false) {
    const tofWhere = typeof where;
    if (tofWhere != "string") throw Error(`where should be string, is "${tofWhere}`);
    const throwErr = (what) => {
        const msg = `(checkIsMmformatStored) ${where}: ${what}`;
        console.error(msg);
        debugger; // eslint-disable-line no-ebugger;
        throw Error(msg);
    }

    const tofAllowBM = typeof allowIsSavedBookmark;
    if (tofAllowBM != "boolean") throwErr(`allowIsSavedBookmark is not boolean: "${tofAllowBM}"`);

    const arrTemplate = [
        "data", "format", "key", "meta"
    ];
    if (allowIsSavedBookmark) {
        if (obj.isSavedBookmark) {
            arrTemplate.push("isSavedBookmark");
        }
    }
    const objTemplate = Object.fromEntries(arrTemplate.map(item => [item, true]));
    if (!modTools.haveSameKeys(objTemplate, obj, arrMayMiss)) {
        throwErr("Not isMMformatStored");
    }

    if (obj.format != "node_array") { throwErr('obj.format != "node_array"'); }
}


/**
 * Expand nodes up until root node.
 *  
 * @param {object} toJmnode 
 * @param {object} jmDisplayed 
 */
export async function ensureNodeVisible(toJmnode, jmDisplayed) {
    if (toJmnode.style.display == "none") {
        const toNodeid = toJmnode.getAttribute("nodeid");
        const node = jmDisplayed.mind.nodes[toNodeid];
        let p = node.parent;
        const parents = [];
        let n = 0;
        while (n++ < 10) {
            if (p.isroot) break;
            if (!p) break;
            // jmDisplayed.expand_node(p);
            parents.push(p);
            p = p.parent;
        }
        let nextP = parents.pop();
        while (nextP) {
            const wasExpanded = nextP.expanded;
            const tofExpanded = typeof wasExpanded;
            if (tofExpanded != "boolean") {
                const msg = `nextP.expanded is not boolean: ${tofExpanded}`;
                console.error(msg);
                debugger; // eslint-disable-line no-debugger
                throw Error(msg);
            }
            if (!wasExpanded) { jmDisplayed.expand_node(nextP); }
            nextP = parents.pop();
            if (!nextP) break;
            // The next statement caused the screen to scroll down. Solution: added "await".
            if (!wasExpanded) { await modTools.waitSeconds(1.0); }
        }
        // Now showing the node instead
        // const topic = node.topic; modMdc.mkMDCsnackbar(`${topic} is currently hidden`);
    }
}

/**
 * 
 * @param {object} jmnodeStart 
 * @param {string} cssClass 
 * @param {object} jmDisplayed 
 */
export function markPathToRoot(jmnodeStart, cssClass, jmDisplayed) {
    // hit-mark
    const tn = jmnodeStart.tagName;
    if (tn != "JMNODE") throw Error(`Expected "JMNODE", but got "${tn}"`);
    const tofClass = typeof cssClass;
    if (tofClass != "string") throw Error(`cssClass should be string, but is "${tofClass}"`);

    const jsMind = window["jsMind"]; // Not defined when loading this module

    const startNodeid = jmnodeStart.getAttribute("nodeid");
    const start_node = jmDisplayed.mind.nodes[startNodeid];
    let parent_node = start_node.parent;
    let n = 0;
    // debugger; // eslint-disable-line no-
    while (n++ < 10) {
        if (!parent_node) break;
        if (parent_node.isroot) break;
        const parentJmNode = jsMind.my_get_DOM_element_from_node(parent_node);
        addSpan4Mark(parentJmNode, cssClass, "search_check_2");
        parent_node = parent_node.parent;
    }

}
const cssClass4Mark = "span-4-mark";
export async function removeAllSpan4marks() {
    const eltJmnodes = document.querySelector("jmnodes");
    if (!eltJmnodes) throw Error("Did not find <jmnode>");
    const arr = [...eltJmnodes.querySelectorAll(`span.${cssClass4Mark}`)];
    arr.forEach(elt => elt.remove());
    await modTools.wait4mutations(eltJmnodes, 50);
    const elt = eltJmnodes.querySelector(`span.${cssClass4Mark}`);
    if (elt) {
        console.log({ elt });
        debugger;
        const arr = [...eltJmnodes.querySelectorAll(`span.${cssClass4Mark}`)];
        console.log({ arr });
    }
}
/**
 * Add span for hit mark etc
 * 
 * @param {object} eltJmnode 
 * @param {string} cssClass 
 * @param {string} iconName
 * @returns 
 */
export async function addSpan4Mark(eltJmnode, cssClass, iconName) {
    const modMdc = await importFc4i("util-mdc");
    const tofClass = typeof cssClass;
    if (tofClass != "string") throw Error(`cssClass should be "string", was "${tofClass}"`);
    const arrIconNames = [
        "search_check_2",
    ];
    // For woff:
    arrIconNames.forEach(iconName => { modMdc.mkMDCicon(iconName); });
    if (!arrIconNames.includes(iconName)) {
        console.log({ arrIconNames });
        const msg = `addSpan4Mark: iconName "${iconName}" is not supported`;
        console.error(msg);
        debugger; // eslint-disable-line no-debugger
        throw Error(msg);
    }
    const eltOldSpan4mark = eltJmnode.querySelector(`span.${cssClass4Mark}`);
    eltOldSpan4mark?.remove();
    const eltSpan4mark = mkElt("span", undefined);
    eltSpan4mark.classList.add(cssClass4Mark);
    eltSpan4mark.classList.add("material-symbols-outlined");
    eltJmnode.appendChild(eltSpan4mark);
    // eltSpan4mark.appendChild(iconName);
    eltSpan4mark.append(iconName);
    eltSpan4mark.classList.add(cssClass); // .jsmind-hit
}


export async function applyDisplayStateOther(objDisplayStateOther, jm) {
    const modZoomMove = await importFc4i("zoom-move");
    if (typeof objDisplayStateOther != "object") debugger;
    const keys = Object.keys(objDisplayStateOther);
    keys.forEach(async key => {
        switch (key) {
            case "selected_id":
                const node_id = objDisplayStateOther["selected_id"];
                jm.select_node(node_id);
                break;
            case "zoomed":
                const zoomed = objDisplayStateOther["zoomed"];
                if (isNaN(zoomed)) throw Error("isNaN(zoomed)");
                if (zoomed == 100) return;
                modZoomMove.setZoomPercentage(zoomed);
                break;
            case "moved":
                const moved = objDisplayStateOther["moved"];
                modZoomMove.setMoved(moved);
                break;
            default:
                debugger;
                throw Error(`applyDisplayStateOther, unknown key: ${key}`);
        }
    });
}


export async function checkWebBrowser() {
    const webbrowserInfo = await modTools.promWebBrowserInfo;
    const missingFeatures = [];
    try {
        new Function('n?.x');
    } catch (err) {
        console.log(err);
        debugger; // eslint-disable-line no-debugger
        missingFeatures.push("Syntax n?.x not recognized");
    }
    // debugger;
    const divKeys = mkElt("p");
    for (const key in webbrowserInfo) {
        const val = webbrowserInfo[key];
        const divLine = mkElt("div", undefined, [
            mkElt("b", undefined, `${key}: `),
            `${val}`
        ]);
        divKeys.appendChild(divLine);
    }

    const dbMindmaps = await importFc4i("db-mindmaps");
    const arrMindmaps = await dbMindmaps.DBgetAllMindmaps();
    const divNumMindmaps = mkElt("div", undefined,
        mkElt("b", undefined, `Num mindmaps: ${arrMindmaps.length}`));
    const divMindmapsList = mkElt("div");
    divMindmapsList.style = `
        display: flex;
        flex-direction: row;
        gap: 5px;
    `;
    const divMindmaps = mkElt("p", undefined, [divNumMindmaps, divMindmapsList]);

    arrMindmaps.forEach(r => {
        const mm = r.jsmindmap;
        if (mm.format != "node_array") throw Error(`Expected format "node_array": ${mm.format}`);
        const root = mm.data[0];
        if (root.id != "root") throw Error(`Not root: ${root.id}`);
        const eltTopic = mkElt("div", undefined, root.topic);
        eltTopic.style = `
            background: blue;
            color: white;
            padding: 0px 4px;
            border-radius: 2px;
        `;
        divMindmapsList.appendChild(eltTopic)
    });

    const spanDebugging = mkElt("div", undefined,
        "This is shown temporary for debugging. Just ignore it.");
    spanDebugging.style = `
        padding: 8px;
        background: blue;
        color: white;
        border: 2px solid white;
        border-radius: 4px;
    `;
    const divDebugging = mkElt("div", undefined, spanDebugging);
    const body = mkElt("div", undefined, [
        mkElt("h2", undefined, "Any browser problem?"),
        divDebugging,
        divKeys, divMindmaps
    ]);
    if (missingFeatures.length > 0) {
        const divMissing = mkElt("p");
        body.appendChild(divMissing);
        missingFeatures.forEach(missing => {
            const divLine = mkElt("div", undefined, missing);
            divMissing.appendChild(divLine);
        });
    }
    await modTools.waitSeconds(2);
    const modMdc = await importFc4i("util-mdc");
    const alertRes = await modMdc.mkMDCdialogAlert(body);
    console.log({ alertRes });
    const dom = alertRes.dom;
    const dlg = dom.querySelector(".mdc-dialog__surface")
    dlg.style.background = "lightblue";

}