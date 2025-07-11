// @ts-check
const version = "0.2.00";
window["logConsoleHereIs"](`here is db-mindmaps.js, module ${version}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

// const useLocalStorage = true;
const useLocalStorage = false;
const idbStoreMm = "mindmaps";
let strPrefix = "jsmindmap-";
const modIdbCmn = await importFc4i("idb-common");

export function setDBprefix(prefix) {
    strPrefix = prefix;
    console.warn("setDBprefix", prefix);
}

export async function DBgetAllMindmaps() {
    if (useLocalStorage) {
        const all = [];
        for (let lsKey in localStorage) {
            if (lsKey.startsWith(strPrefix)) {
                const json = localStorage[lsKey];
                const jsmindmap = JSON.parse(json);
                const key = lsKey.substring(strPrefix.length);
                const rec = { key, jsmindmap }
                all.push(rec);
            }
        }
        return all;
    } else {
        // return modIdbCmn.getAll(idbStoreMm);
        const allRecs = await modIdbCmn.getAll(idbStoreMm);
        const allMindmaps = allRecs.filter(rec => {
            const key = rec.key;
            return key.search("-bookmark-") == -1;
        });
        return allMindmaps.map(jsmindmap => {
            const key = jsmindmap.key;
            return { key, jsmindmap };
        });
    }
}
/**
 * 
 * @param {string} keyName 
 * @param {Object} jsMindMap - mindmap in jsMind format (FIX-ME: name of format)
 * @param {string|undefined} lastUpdated - time in UTC format, use this as updated time if given
 * @param {string|undefined} lastSynced - time in UTC format, new time for last sync
 * @param {string|undefined} privacy - "private" or "public", use this as privacy if given
 * @returns {Promise<any>} 
 */
export async function DBsetMindmap(keyName, jsMindMap, lastUpdated, lastSynced, privacy) {
    if (!jsMindMap.key) {
        debugger;
        jsMindMap.key = keyName;
    }
    checkIsMMformatStored(jsMindMap, "DBsetMindmap");
    // if (keyName !== jsMindMap.meta.name) throw Error(`key=${keyName} but objMindmap.meta.name=${jsMindMap.meta.name}`);
    const metaName = jsMindMap.meta.name;
    const [metaKey, _oldUpdated, _lastSynced, _privacy] = metaName.split("/");
    if (keyName !== metaKey) throw Error(`key=${keyName} but objMindmap.meta.name=${metaKey}`);
    const updated = lastUpdated || (new Date()).toISOString();
    const synched = lastSynced || _lastSynced;
    const priv = privacy || _privacy || "private";
    jsMindMap.meta.name = `${metaKey}/${updated}/${synched}/${priv}`;
    if (useLocalStorage) {
        const lsKey = strPrefix + keyName;
        const json = JSON.stringify(jsMindMap);
        localStorage.setItem(lsKey, json);
    } else {
        return modIdbCmn.setDbKey(idbStoreMm, keyName, jsMindMap);
    }
}
/**
 * 
 * @param {Object} jsMindMap - mindmap in jsMind format (FIX-ME: name of format)
 * @returns {Object} - parts of meta.name
 * @throws {Error} if jsMindMap.meta.name is not defined
 */
export function getMindmapMetaParts(jsMindMap) {
    if (!jsMindMap || !jsMindMap.meta || !jsMindMap.meta.name) {
        console.error("jsMindMap.meta.name is not defined", jsMindMap);
        throw Error("jsMindMap.meta.name is not defined");
    }
    const metaName = jsMindMap.meta.name;
    const [key, lastUpdated, lastSynced, privacy] = metaName.split("/");
    return { key, lastUpdated, lastSynced, privacy };
}

export async function DBgetMindmap(key) {
    if (useLocalStorage) {
        // throw Error("new obj.meta.name format not implemented yet for localStorage");
        const lsKey = strPrefix + key;
        const json = localStorage.getItem(lsKey);
        if (!json) return;
        return JSON.parse(json);
    } else {
        const obj = await modIdbCmn.getDbKey(idbStoreMm, key);
        if (obj) { checkIsMMformatStored(obj, "DBgetMindmap"); }
        return obj;
    }
}
export async function DBremoveMindmap(key) {
    if (useLocalStorage) {
        const lsKey = strPrefix + key;
        localStorage.removeItem(lsKey);
    } else {
        // throw Error("NIY");
        return modIdbCmn.deleteDbKey(idbStoreMm, key);
    }
}

function checkIsMMformatStored(obj, where) {
    const tofWhere = typeof where;
    if (tofWhere != "string") throw Error(`where should be string, is "${tofWhere}`);
    const throwErr = (what) => {
        const msg = `(checkIsMmformatStored) ${where}: ${what}`;
        console.error(msg);
        debugger;
        throw Error(msg);
    }

    const ObjKeys = Object.keys(obj).sort();
    const strObjKeys = JSON.stringify(ObjKeys);
    const strData = JSON.stringify([
        "data", "format", "key", "meta"
    ]);
    if (strObjKeys != strData) throwErr("strObjKeys != strData)");
    if (obj.format != "node_array") throwErr('obj.format != "node_array"');
}



/**
 * 
 * @param {string} keyName 
 * @param {string} bookmarkName 
 * @param {Object} fullDisplayState
 * @returns {Promise<any>} 
 */
export async function DBsetMindmapBookmark(keyName, bookmarkName, fullDisplayState) {
    const jsMindMap = fullDisplayState.objDataMind;
    const metaName = jsMindMap.meta.name;
    const [metaKey] = metaName.split("/");
    if (keyName !== metaKey) throw Error(`key=${keyName} but objMindmap.meta.name=${metaKey}`);

    const keyBookmark = `${keyName}-bookmark-${bookmarkName}`;
    // debugger;
    // return modIdbCmn.setDbKey(idbStoreMm, keyBookmark, jsMindMap);
    return modIdbCmn.setDbKey(idbStoreMm, keyBookmark, fullDisplayState);
}
// dbgetallmindmaps
export async function DBgetAllMindmapBookmarks(keyName) {
    const allRecs = await modIdbCmn.getAll(idbStoreMm);
    const allBookmarks = allRecs.filter(rec => {
        const key = rec.key;
        return key.search(`${keyName}-bookmark-`) > -1;
    });
    return allBookmarks.map(jsmindmap => {
        const keyBookmark = jsmindmap.key;
        // debugger;
        const pos = keyBookmark.search("-bookmark-");
        const bmName = keyBookmark.slice(pos + "-bookmark-".length);
        jsmindmap.isSavedBookmark = true;
        return { bmName, jsmindmap, keyBookmark };
    });
}

export async function DBremoveMindmapBookmark(key) {
    return modIdbCmn.deleteDbKey(idbStoreMm, key);
}