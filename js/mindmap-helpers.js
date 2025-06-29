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

async function saveMindmapPlusUndoRedo(keyName, jmDisplayed, actionTopic, lastUpdated, lastSynced, privacy) {
    // checkOurUndoRedoState(objState);
    if (!isMMformatJsmind(jmDisplayed)) throw Error("!isMMformatJsmind(jmMindmap)");
    // debugger;
    const dbMindmaps = await importFc4i("db-mindmaps");
    const modUndo = await importFc4i("undo-redo-tree");
    // debugger; // eslint-disable-line no-debugger
    if (!modUndo.hasUndoRedo(keyName)) {
        // const objBaseMm = (await dbMindmaps.DBgetMindmap(keyName)) || objState.objDataMind;
        const objBaseMm = (await dbMindmaps.DBgetMindmap(keyName)) || jmDisplayed;
        // const funBranch = undefined; // FIX-ME: should be a function to undo/redo
        if (undoRedoTreeStyle === undefined) {
            throw Error("setUndoRedoTreeStyle(true/false) has not been called");
        }
        const funBranch = undoRedoTreeStyle ? _ourFunBranch : undefined;
        async function _ourFunBranch(defaultBranch, arrBrancheTopics) {
            // debugger;
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
        // const funUpdateHistory = (keyName) => console.log("funUpdateHistory", keyName);
        const other = {
            selected_id: "root"
        }
        const objInitialState = {
            objDataMind: objBaseMm,
            other
        }
        checkOurUndoRedoState(objInitialState);
        // modUndo.addUndoRedo(keyName, objBaseMm, funBranch);
        modUndo.addUndoRedo(keyName, objInitialState, funBranch);
    }
    const other = {
        selected_id: jmDisplayed.get_selected_node().id,
    }
    const objDataMind = jmDisplayed.get_data("node_array");
    const objToSave = {
        objDataMind,
        other
    }
    objDataMind.key = keyName;
    checkOurUndoRedoState(objToSave);

    modUndo.actionRecordAction(keyName, objToSave, actionTopic);
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
    if (!isMMformatJsmind(jmDisplayed)) throw Error("!isMMformatJsmind(jmDisplayed)");
    if (typeof actionTopic != "string") {
        console.error(`actionTopic is not string: ${typeof actionTopic}`);
        debugger; // eslint-disable-line no-debugger
        throw Error(`actionTopic is not string: ${typeof actionTopic}`);
    }
    throttleDBsaveNowMindmapPlusUndoRedo(jmDisplayed, actionTopic);
}
async function DBsaveNowMindmapPlusUndoRedo(jmDisplayed, actionTopic) {
    if (!isMMformatJsmind(jmDisplayed)) throw Error("!isMMformatJsmind(jmDisplayed))");
    // debugger;
    const tofTopic = typeof actionTopic;
    if (tofTopic != "string") { throw Error(`Wrong actionTopic type: ${tofTopic} (should be string)`); }
    const objDataMind = jmDisplayed.get_data("node_array");
    const metaName = objDataMind.meta.name;
    if (!metaName) throw Error("Current mindmap has no meta.key");
    const [keyName] = metaName.split("/");

    /*
    const other = {
        selected_id: jmDisplayed.get_selected_node().id,
    }
    const objToSave = {
        objDataMind,
        other
    }
    checkOurUndoRedoState(objToSave);
    */
    // await saveMindmapPlusUndoRedo(keyName, objDataMind, actionTopic, (new Date()).toISOString());
    // debugger;
    await saveMindmapPlusUndoRedo(keyName, jmDisplayed, actionTopic, (new Date()).toISOString());
}

function getNextMindmapKey() { return "mm-" + new Date().toISOString(); }

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

    await saveMindmapPlusUndoRedo(keyName, jsMindMap, "new mindmap");

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

export function mkEltLinkMindmapA(topic, mkey, mhits, provider) {
    const absLink = makeAbsLink(URL_MINDMAPS_PAGE);
    const url = new URL(absLink);
    url.searchParams.set("mindmap", mkey);
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




export function isMMformatJsmind(obj) {
    const ObjKeys = Object.keys(obj).sort();
    const strObjKeys = JSON.stringify(ObjKeys);
    const strJsmind = JSON.stringify([
        "data", "event_handles", "initialized", "layout", "mind", "options",
        "shortcut", "version", "view"
    ]);
    return (strObjKeys == strJsmind);
}


/**
 * Check obj is undo/redo state
 *  
 * @param {Object} obj 
 * @throws
 */
function checkOurUndoRedoState(obj) {
    const strJsonOk = JSON.stringify(["objDataMind", "other"]);
    const strJsonObj = JSON.stringify(Object.keys(obj));
    if (strJsonObj != strJsonOk) {
        const msg = `${strJsonObj} != ${strJsonOk}`;
        console.error(msg);
        debugger; // eslint-disable-line no-debugger
        throw Error(msg);
    }
    checkIsMMformatStored(obj["objDataMind"]);
}



export function checkIsMMformatStored(obj) {
    if (!isMMformatStored(obj)) {
        const msg = "mindmap-helpers.js: obj is not in format for storing";
        console.error(msg);
        debugger; // eslint-disable-line no-debugger
        throw Error(msg);
    }
}

/**
 * 
 * @param {Object} obj 
 * @returns {boolean}
 */
function isMMformatStored(obj) {
    // const dbMindmaps = await importFc4i("db-mindmaps");
    const ObjKeys = Object.keys(obj).sort();
    const strObjKeys = JSON.stringify(ObjKeys);
    const strData = JSON.stringify([
        "data", "format", "key", "meta"
    ]);
    if (strObjKeys != strData) {
        console.warn(strObjKeys);
        return false;
    }
    if (obj.format != "node_array") {
        console.warn(obj.format);
        return false;
    }
    return true;
}
