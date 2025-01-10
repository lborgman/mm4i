// @ts-check

const logConsoleHereIs = window["logConsoleHereIs"];
// const importFc4i = window["importFc4i"];
// const mkElt = window["mkElt"];
// const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
// const jsMind = window["jsMind"];

const CUST_REND_VER = "0.0.1";
if (logConsoleHereIs) logConsoleHereIs(`here is jssm-tools.js, module,${CUST_REND_VER}`);
if (document.currentScript) throw Error("import .currentScript"); // is module


const modJssm = await importFc4i("jssm");

/**
 * @typedef {Object} fsmMultiDeclaration
 * @property {string} strFsmMulti -- You may use multi syntax here: A '[a b c]' => B
 * @property {string|undefined} strFsm -- Automatically created, FSL syntax
 */

/**
 * FSL does not allow multiple edges with same origin/destination.
 * See https://github.com/StoneCypher/fsl/issues/325
 * 
 * This function makes it possible to allow this by using the syntax
 *    A '[a b c]' => B
 *
 * This syntax is not recognized by FSL, but is translated to FSL. 
 * 
 * @param {fsmMultiDeclaration} objDecl 
 * @returns {*}
 */
export function getFsmMulti(objDecl) {
    const strFsmMulti = objDecl.strFsm;
    if (strFsmMulti) {
        console.log("%cUsing objDecl.strFsm", "background:gray; color:black;");
        return modJssm.sm([strFsmMulti]);
    }
    const strFsm = objDecl.strFsmMulti;
    const fsmOrig = modJssm.sm([strFsm]);
    let fsmMulti;
    const reMultiActionLine = new RegExp("^\\s*([a-z0-9_]+)\\s+'\\[(.*?)\\]'\\s+[=-]>\\s+([a-z0-9_]+)\\s*;\\s*$", "im");
    if (reMultiActionLine.test(strFsm)) {
        console.log("%cCreating objDecl.strFsm from .strFsmMulti", "background:blue; color:white;");
        const arrDecl = strFsm.split("\n");
        const arrNoEmpty = arrDecl.filter(l => {
            const lt = l.trim();
            if (lt.length == 0) return false;
            if (lt.startsWith("//")) return false;
            return true;
        });
        const arrMulti = [];
        arrNoEmpty.forEach(line => {
            const resLine = reMultiActionLine.exec(line);
            if (!resLine) {
                arrMulti.push(line);
            } else {
                arrMulti.push(`////// expanding ${line}`);
                const resFromState = resLine[1];
                const resActions = resLine[2].trim().split(/\s+/);
                const resToState = resLine[3];
                let ourEdges;
                if (resFromState === resToState) {
                    // We have no other declarations for this
                    ourEdges = resActions
                        .map(action => { const to = resToState; return { to, action } });
                } else {
                    const edges = fsmOrig.list_edges();
                    ourEdges = edges
                        .filter(e => e.from == resToState)
                        .map(e => { const to = e.to, action = e.action; return { to, action } })
                }
                resActions.forEach(resAction => {
                    const lineFrom = `  ${resFromState} '${resAction}' => ${resToState}_${resAction};`;
                    arrMulti.push(lineFrom);
                    ourEdges.forEach(edge => {
                        const edgeAction = edge.action;
                        const edgeToState = edge.to;
                        const lineTo = `      ${resToState}_${resAction} '${edgeAction}' => ${edgeToState};`;
                        arrMulti.push(lineTo);
                    });
                });
            }
        });
        // const sMulti = arrMulti.join("\n");
        objDecl.strFsm = arrMulti.join("\n");
        console.log(objDecl.strFsm);
        window["strFsm"] = objDecl.strFsm;
        fsmMulti = modJssm.sm([objDecl.strFsm]);
    }


    const fsm = fsmMulti || fsmOrig;
    return fsm;
}
