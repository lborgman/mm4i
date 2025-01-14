// @ts-check

const logConsoleHereIs = window["logConsoleHereIs"];
const importFc4i = window["importFc4i"];
// const mkElt = window["mkElt"];
// const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];

const CUST_REND_VER = "0.0.1";
if (logConsoleHereIs) logConsoleHereIs(`here is jssm-tools.js, module,${CUST_REND_VER}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

// @ts-ignore
const modJssm = importFc4i ? await importFc4i("jssm") : await import("jssm");

/**
 * @typedef {Object} fsmMultiDeclaration
 *  In addition to FSL syntax you may use multi syntax here: A '[a b c]' => B
 * @property {number} _id
 * @property {string} strFsmMulti -- Your declaration.
 * @property {string} [strFsm] -- Automatically created from strFsmMulti, FSL syntax
 * @property {Object[]} [_arrMultiSame]
 * @property {Object} [_objMultiSame]
 * @property {function} [_funActionMultiSame]
 * @property {Object} [fsm]
 */

/** 
 * @callback callbackActionMulti
 * @param {string} action
 * @param {string} fromTo
 * 
 */

const setObjDecl = new Set();

/**
 * See https://stackoverflow.com/questions/78436085/how-can-i-make-jsdoc-typescript-understand-javascript-imports
 *  
 * @param {string} strFsmMulti - Declaration of FSM in FSL language, may include "A '[a b]' -> B;"
 * @param {callbackActionMulti|undefined} funActionMultiSame 
 *     - Similar purpose to jssm .hook_any_action
 * @returns {fsmMultiDeclaration}
 */
export function makeFsmMultiDeclaration(strFsmMulti, funActionMultiSame = undefined) {
    const _id = Date.now();
    const obj = { strFsmMulti, _id };
    if (funActionMultiSame) obj._funActionMultiSame = funActionMultiSame;
    setObjDecl.add(obj._id);
    return obj;
}

/**
 * FSL does not allow multiple edges with same origin/destination.
 * See https://github.com/StoneCypher/fsl/issues/325
 * 
 * This function makes it possible to allow this by using the syntax
 *    A '[a b c]' => B
 *
 * This syntax is not recognized by FSL, but is translated to FSL. 
 *
 * @param {fsmMultiDeclaration} objFsmDecl
 */
export function getFsmMulti(objFsmDecl) {
    if (!setObjDecl.has(objFsmDecl._id)) {
        console.error("getFsmMutli, parameter objFsmDecl should be created by makeFsmMultiDeclaration");
        debugger; // eslint-disable-line no-debugger
    }
    const strFsmMulti = objFsmDecl.strFsmMulti;
    if (!strFsmMulti) {
        debugger; // eslint-disable-line no-debugger
        throw Error("getFsmMulti: Parameter should be of type {fsmMultiDeclaration}")
    }
    const strFsm = objFsmDecl.strFsm;
    if (strFsm) {
        console.log("%cUsing objDecl.strFsm", "background:gray; color:black;");
        return modJssm.sm([strFsm]);
    }
    /*
    if (strFsmMulti) {
        console.log("%cUsing objDecl.strFsm", "background:gray; color:black;");
        return modJssm.sm([strFsmMulti]);
    }
    */
    const fsmOrig = modJssm.sm([strFsmMulti]);
    let fsmMulti;
    const reMultiActionLine = new RegExp("^\\s*([a-z0-9_]+)\\s+'\\[(.*?)\\]'\\s+[=-]>\\s+([a-z0-9_]+)\\s*;\\s*$", "im");
    const arrMultiLines = [];
    const arrMultiSameLines = [];

    if (reMultiActionLine.test(strFsmMulti)) {
        console.groupCollapsed("Creating objDecl.strFsm");
        console.log("%cCreating objDecl.strFsm from .strFsmMulti", "background:blue; color:white;");
        const arrDeclMulti = strFsmMulti.split("\n");
        const arrNoEmpty = arrDeclMulti.filter(l => {
            const lt = l.trim();
            if (lt.length == 0) return false;
            if (lt.startsWith("//")) return false;
            return true;
        });
        const arrFsmMultiLines = [];
        arrNoEmpty.forEach(line => {
            const resLine = reMultiActionLine.exec(line);
            if (!resLine) {
                arrFsmMultiLines.push(line);
            } else {
                const stateFrom = resLine[1];
                const stateTo = resLine[3];
                if (stateFrom != stateTo) {
                    arrMultiLines.push(line)
                } else {
                    arrFsmMultiLines.push("// MultiSame line:");
                    arrFsmMultiLines.push(`    ${line}`);
                    arrMultiSameLines.push(line)
                }
            }
        });
        if (arrMultiLines.length > 0) {
            arrFsmMultiLines.push("");
            arrFsmMultiLines.push("");
            arrFsmMultiLines.push(`////// Found ${arrMultiLines.length} line(s) with multi syntax, expanding them below`);
            arrFsmMultiLines.push("");
            arrMultiLines.forEach(line => {
                arrFsmMultiLines.push(`////// expanding ${line}`);
                const resLine = reMultiActionLine.exec(line);
                if (resLine == null) throw Error(`Did not match multi line: ${line}`);
                const resFromState = resLine[1];
                const resActions = resLine[2].trim().split(/\s+/);
                const resToState = resLine[3];
                let ourEdges;
                if (resFromState === resToState) {
                    throw Error(`Can't handle to==from here: ${line}`);
                    // We have no other declarations for this
                    /*
                        A '[x y]' => A;
    
                        We can't do as for the case A '[x y]' B
                        since this would give:
                          A 'x' => A_x;
                            A_x 'x' => A;
                            A_x 'y' => A;
                          A 'y' => A_y;
                            A_y 'x' => A;
                            A_y 'y' => A;
                    */
                    // ourEdges = resActions.map(action => { const to = resToState; return { to, action } });
                    // FIX-ME: 
                    debugger; // eslint-disable-line no-debugger
                    /*
                    resActions.forEach(resAction => {
                        const line = `  ${resFromState} '${resAction}' => ${resFromState};`;
                        arrFsmMulti.push(line);
                    });
                    */
                } else {
                    /*
                        A '[x y]' => B;
    
                        This expands like below (where a, b are possible actions for state B):
    
                          A 'x' => B_x;
                            B_x 'a' => Ba;
                            B_x 'b' => Bb;
                          A 'y' => B_y;
                            B_y 'a' => Ba;
                            B_y 'b' => Bb;
    
                    */
                    const edges = fsmOrig.list_edges();
                    ourEdges = edges
                        .filter(e => e.from == resToState)
                        .map(e => { const to = e.to, action = e.action; return { to, action } })
                    resActions.forEach(resAction => {
                        const lineFrom = `  ${resFromState} '${resAction}' => ${resToState}_${resAction};`;
                        arrFsmMultiLines.push(lineFrom);
                        ourEdges.forEach(edge => {
                            const edgeAction = edge.action;
                            const edgeToState = edge.to;
                            const lineTo = `      ${resToState}_${resAction} '${edgeAction}' => ${edgeToState};`;
                            arrFsmMultiLines.push(lineTo);
                        });
                    });
                }

            });
        }
        if (arrMultiSameLines.length > 0) {
            if (!objFsmDecl._funActionMultiSame) {
                let msg = `
                    The FSL code contains statement of the form
                        A '[a b]' -> A
                    Because of this you must add a function to handle
                    side effects of actions a and b.

                    This function should be the second argument to
                    makeFsmMultiDeclaration.
                    `;
                msg = msg.replaceAll(/^\s*/gm, "    ")
                console.error(msg);
                debugger; // eslint-disable-line no-debugger
            }
            arrFsmMultiLines.push("");
            arrFsmMultiLines.push("");
            arrFsmMultiLines.push(`////// Found ${arrMultiSameLines.length} line(s) with multi syntax and to==from`);
            arrFsmMultiLines.push(`// Those lines can't be expanded, and must be handled separately.`);
            arrFsmMultiLines.push(`// They are left as is in FSL.`);
            arrFsmMultiLines.push(`// *** NOTE *** Handling of them is not implemented here!!!`);
            const objMultiSame = {};
            const arrMultiSame = arrMultiSameLines.map(line => {
                arrFsmMultiLines.push(`  // ${line}`);
                const resLine = reMultiActionLine.exec(line);
                if (resLine == null) throw Error(`Did not match multi line: ${line}`);
                const from = resLine[1];
                const actions = resLine[2].trim().split(/\s+/);
                const to = resLine[3];
                if (to != from) throw Error(`from != to, "${from}" != "${to}"`);
                const toFrom = to;
                actions.forEach(action => {
                    const key = multiSameKey(toFrom, action);
                    objMultiSame[key] = line;
                })
                return { line, toFrom, actions };
            });
            arrFsmMultiLines.push("");
            arrFsmMultiLines.push("");
            console.log({ arrMultiSame });
            objFsmDecl._arrMultiSame = arrMultiSame;
            objFsmDecl._objMultiSame = objMultiSame;
        }
        // const sMulti = arrMulti.join("\n");
        objFsmDecl.strFsm = arrFsmMultiLines.join("\n");
        console.log(objFsmDecl.strFsm);
        console.groupEnd();
        window["strFsm"] = objFsmDecl.strFsm;
        fsmMulti = modJssm.sm([objFsmDecl.strFsm]);
    }


    const fsm = fsmMulti || fsmOrig;
    objFsmDecl.fsm = fsm;
    // return fsm;
    // return objFsmDecl;
}

/**
 * @param {string} from 
 * @param {string} action 
 * @returns {string}
 */
function multiSameKey(from, action) { return `"${from}" "${action}"`; }

/**
 * 
 * @param {fsmMultiDeclaration} objFsmDecl 
 * @param {string} action 
 * @param {Function} hookAnyActionHandler
 */
export function fsmActionMulti(objFsmDecl, action, hookAnyActionHandler) {
    const fsm = objFsmDecl.fsm;
    const fromTo = fsm.state();
    const objMultiSame = objFsmDecl._objMultiSame;
    const possMultiKey = multiSameKey(fromTo, action);
    if (objMultiSame[possMultiKey]) {
        const args = {
            action, fromTo, fsm
        };
        hookAnyActionHandler(args)
    } else {
        fsm.action(action);
    }
}


export function testFsmMulti() {
    function testEasyCase() {
        const show = true;
        // const consoleLog = (...args) => { if (show) console.log(...args); }
        console.log("%cTesting easy case:", "background:yellow;color:black;font-size:18px;")
        console.groupCollapsed("test details");
        const declMulti = `
        start_states: [A];
        A '[a b]' -> B;
        B 'x' -> Bx;
        B 'y' -> By;
        Bx 'z' -> A;
    `;
        /* @type {fsmMultiDeclaration} */
        // const objDeclMulti = { strFsmMulti: declMulti }
        const objDeclMulti = makeFsmMultiDeclaration(declMulti);
        getFsmMulti(objDeclMulti);
        const fsm = objDeclMulti.fsm;
        let badStates = 0;
        const expectState = (expState) => {
            const state = fsm.state();
            const ok = state === expState;
            const style = ok ? "background:green" : "background:red";
            if (!ok) badStates++
            console.log(`%cstate: "${state}", expected "${expState}"`, style);
        }
        const applyAction = (action) => {
            console.log(`apply action: ${action}`);
            fsm.action(action);
        }
        // console.log({ res: fsm });
        expectState("A");
        applyAction("a");
        expectState("B_a");
        applyAction("x");
        expectState("Bx");
        applyAction("z");
        expectState("A");
        console.groupEnd();
        if (badStates == 0) {
            console.log("%cEasy case: All tests passed", "background:green;font-size:16px;");
        } else {
            console.log(`%cEasy case: Tests failed: ${badStates}`, "background:red;font-size:16px;");
            // if (!show) testEasyCase(true);
        }
    }
    testEasyCase();
    function testDifficultCase() {
        // const show = true;
        // const console.log = (...args) => { if (show) console.log(...args); }
        console.log("%cTesting difficult case:", "background:yellow;color:black;font-size:18px;")
        console.groupCollapsed("test details");
        const declMulti = `
        start_states: [A];
        A '[a b]' -> A;
        `;
        const funDummy = (args) => console.log("funDummy", args);
        const objFsmDeclMulti = makeFsmMultiDeclaration(declMulti, funDummy);
        getFsmMulti(objFsmDeclMulti);
        // console.log({ objDeclMulti: objFsmDeclMulti });
        const fsm = objFsmDeclMulti.fsm;
        let badStates = 0;
        const expectState = (expState) => {
            const state = fsm.state();
            const ok = state === expState;
            const style = ok ? "background:green" : "background:red";
            if (!ok) badStates++
            console.log(`%cstate: "${state}", expected "${expState}"`, style);
        }
        const applyAction = (action) => {
            // const res = fsm.action(action);
            console.log(`apply action: ${action}`);
            const handler = objFsmDeclMulti._funActionMultiSame;
            if (!handler) {
                throw Error("applyAction: handler is undefined");
            }
            fsmActionMulti(objFsmDeclMulti, action, handler);
        }

        expectState("A");
        applyAction("a");
        expectState("A");
        applyAction("b");
        expectState("A");

        console.groupEnd();
        if (badStates == 0) {
            console.log("%cDifficult case: All tests passed", "background:green;font-size:16px;");
        } else {
            console.log(`%cDifficult case: Tests failed: ${badStates}`, "background:red;font-size:16px;");
            // if (!show) testDifficultCase(true);
        }
    }
    testDifficultCase();

}
testFsmMulti();