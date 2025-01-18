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
 * @callback callback4Action
 * @param {string} action
 * @param {string} fromTo
 * 
 */

const setObjDecl = new Set();

/**
 * Matches: A '[a b]' -> B
 * 
 */
const reMultiActionLine = new RegExp(
    "^\\s*([a-z0-9_]+)\\s+'\\[(.*?)\\]'\\s+[=-]>\\s+([a-z0-9_]+)\\s*;\\s*(?://.*?)?$", "im");

function isMultiLine(multiLine) { return reMultiActionLine.test(multiLine) };
if (!isMultiLine("A '[a b]' -> B;")) debugger;
if (isMultiLine("A 'ab' -> B;")) debugger;
// debugger;



// https://stackoverflow.com/questions/78436085/how-can-i-make-jsdoc-typescript-understand-javascript-imports 
/**
 * Class for using syntax "A '[a b]' -> B" with JSSM/FSL
 *
 * FSL does not allow multiple edges with same origin/destination. 
 * See https://github.com/StoneCypher/fsl/issues/325
 *  
 * This class makes it possible to allow this by using the syntax 
 *     A '[a b c]' => B;
 * 
 * This syntax can be parsed by FSL, but the actions (a b c) are not
 * recognized by FSL. However with this class you can use them.
 * 
 */

export class FslWithArrActions {
    #objMultiDeclaration;
    #funActionMultiSame;
    #useMultiAction;

    /**
     * Create class
     * @param {string} strFslMulti - Declaration of FSM in FSL language, may include "A '[a b]' -> B;" 
     * @param {callback4Action} fun4Action - Similar purpose to jssm .hook_any_action 
     * @param {boolean} useMultiAction
     */
    constructor(strFslMulti, fun4Action, useMultiAction = true) {
        this.#funActionMultiSame = fun4Action;
        this.#objMultiDeclaration = FslWithArrActions.#makeFslMultiDeclaration(strFslMulti, fun4Action);
        this.#useMultiAction = useMultiAction;
        this.#makeFsmMulti();
    }

    /**
     * 
     *  @param {string} strFsmMulti - Declaration of FSM in FSL language, may include "A '[a b]' -> B;" 
     *  @param {callback4Action} funActionMultiSame - Similar purpose to jssm .hook_any_action 
     *  @returns {fsmMultiDeclaration}
     */
    static #makeFslMultiDeclaration(strFsmMulti, funActionMultiSame) {
        const _id = Date.now();
        const obj = { strFsmMulti, _id };
        obj._funActionMultiSame = funActionMultiSame;
        setObjDecl.add(obj._id);
        return obj;
    }

    /** 
     *  
     * @param {string} action 
     */
    applyMultiAction(action) {
        const fsm = this.#objMultiDeclaration.fsm;
        if (!this.#useMultiAction) {
            return fsm.action(action);
        }
        if (!this.#funActionMultiSame) {
            debugger;
        }
        const from = fsm.state();
        const arrFromActions = fsm.actions(from);
        if (arrFromActions.includes(action)) {
            return fsm.action(action);
        }
        for (let i = 0, len = arrFromActions.length; i < len; i++) {
            const ma = arrFromActions[i];
            if (isMulti(ma)) {
                const arrAct = multi2array(ma);
                if (arrAct.includes(action)) {
                    // FIX-ME: next_data
                    return fsm.action(ma, { action });
                }
            }
        };
        // FIX-ME: apply to get an error, do we get that???
        const bad = fsm.action(action);
        console.log({ bad });
        // We don't get any error, but bad should be false
        if (bad) {
            throw Error(`Internal error, action "${action}" should not work in state "${state}"`)
        }
        throw Error(`No action "${action}" for state "${state}"`);
        debugger;
    }
    #makeFsmMulti() {
        const objFsmDecl = this.#objMultiDeclaration;
        const strFsmMulti = objFsmDecl.strFsmMulti;
        const strFsm = objFsmDecl.strFsm;
        if (strFsm) {
            console.log("%cUsing objDecl.strFsm", "background:gray; color:black;");
            return modJssm.sm([strFsm]);
        }
        const fsmOrig = modJssm.sm([strFsmMulti]);
        let fsmMulti;
        const arrMultiLines = [];
        const arrMultiSameLines = [];

        if (reMultiActionLine.test(strFsmMulti)) {
            if (this.#useMultiAction) {
                console.groupCollapsed("Using multi actions");
                // console.log("%cCreating objDecl.strFsm from .strFsmMulti", "background:blue; color:white;");
            } else {
                console.groupCollapsed("Creating objDecl.strFsm");
                console.log("%cCreating objDecl.strFsm from .strFsmMulti", "background:blue; color:white;");
            }
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
                        arrFsmMultiLines.push(`    ${line} // MultiSame line `);
                        arrMultiSameLines.push(line);
                    }
                }
            });
            if (this.#useMultiAction) {
                const arrAllMulti = arrMultiLines.concat(arrMultiSameLines);
                arrAllMulti.forEach(multiLine => {
                    const { stateFrom, stateTo, multiAction } = desctructureMultiLine(multiLine);
                    console.log({ stateFrom, stateTo, multiAction })
                    lookForDoubles(fsmOrig, stateFrom, multiLine);
                });
                // debugger;
            } else {
                if (arrMultiLines.length > 0) {
                    arrFsmMultiLines.push("");
                    arrFsmMultiLines.push("");
                    arrFsmMultiLines.push(`////// Found ${arrMultiLines.length} line(s) with multi syntax, expanding them below`);
                    arrFsmMultiLines.push("");
                    arrMultiLines.forEach(line => {
                        // constructor(strFslMulti, fun4Action, useMultiAction = true) {
                        arrFsmMultiLines.push(`////// expanding: ${line}`);
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

                    %c    A '[a b]' -> A;%c

                    This can currently not be translated
                    to standard FSL.

                    Because of this you must add a function to handle
                    side effects of actions a and b.
 
                    This function should be the second argument to
                    makeFsmMultiDeclaration.
                    `;
                        // console.log(msg);
                        msg = msg.replaceAll(/^\s?$/gm, "!");
                        msg = msg.replaceAll(/^\s+/gm, "!   ")
                        console.error(msg, "font-size:18px;", "font-size:unset;");
                        // debugger; // eslint-disable-line no-debugger
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
        }


        const fsm = fsmMulti || fsmOrig;
        objFsmDecl.fsm = fsm;
        // return fsm;
        // return objFsmDecl;
    }


    get _fsm() { return this.#objMultiDeclaration.fsm; }
}






/**
 * @param {string} from 
 * @param {string} action 
 * @returns {string}
 */
function multiSameKey(from, action) { return `"${from}" "${action}"`; }



export function testFsmMulti() {
    function testEasyCase() {
        // return;
        console.log("%cTesting A '[x y]' -> B", "background:yellow;color:black;font-size:18px;")
        console.groupCollapsed("test details");
        const declMulti = `
            start_states: [A];
            A '[a b c]' -> B;
            B 'x' -> Bx;
            B 'y' -> By;
            Bx 'z' -> A;
        `;
        const useMulti = true;
        const fslEasyCase = new FslWithArrActions(declMulti, () => { }, useMulti);
        const fsm = fslEasyCase._fsm;

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
            // fsm.action(action);
            fslEasyCase.applyMultiAction(action);
        }
        expectState("A");
        if (!useMulti) {
            applyAction("a");
            expectState("B_a");
            applyAction("x");
            expectState("Bx");
            applyAction("z");
            expectState("A");
        } else {
            applyAction("a");
            expectState("B");
            applyAction("x");
            expectState("Bx");
            applyAction("z");
            expectState("A");
        }
        console.groupEnd();
        if (badStates == 0) {
            console.log("%cA '[x y]' -> B: All tests passed", "background:green;font-size:16px;");
        } else {
            console.log(`%cA '[x y]' -> B: Tests failed: ${badStates}`, "background:red;font-size:16px;");
        }
    }
    testEasyCase();
    debugger;
    function testDifficultCase() {
        console.log("%cTesting A '[x y]' -> A", "background:yellow;color:black;font-size:18px;")
        console.groupCollapsed("test details");
        const declMulti = `
        start_states: [A];
        A '[a b]' -> A;
        `;
        const funDummy = (args) => console.log("funDummy", args);
        // const fslDifficultCase = new FslWithArrActions(declMulti);
        const fslDifficultCase = new FslWithArrActions(declMulti, funDummy);
        const fsm = fslDifficultCase._fsm;

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
            fslDifficultCase.applyMultiAction(action);
        }

        expectState("A");
        applyAction("a");
        expectState("A");
        applyAction("b");
        expectState("A");

        console.groupEnd();
        if (badStates == 0) {
            console.log("%cA '[x y]' -> A: All tests passed", "background:green;font-size:16px;");
        } else {
            console.log(`%cA '[x y]' -> A: Tests failed: ${badStates}`, "background:red;font-size:16px;");
        }
    }
    testDifficultCase();
}
testFsmMulti(); debugger;

/**
 * 
 * @param {string} multiAction 
 * @returns {boolean}
 */
function isMulti(multiAction) {
    if (!(multiAction.startsWith("["))) return false;
    if (!multiAction.endsWith("]")) return false;
    return true;
}
// debugger;
if (!isMulti("[a b c]")) debugger;
if (isMulti("a b c")) debugger;

function multi2array(multiAction) {
    if (!isMulti(multiAction)) {
        debugger;
        throw Error(`multiAction "${multiAction}" does not have the format "[...]"`);
    }
    const arr = multiAction.slice(1, -1).split(/\s+/);
    return arr;
}
if (JSON.stringify(multi2array("[a  b c]")) != JSON.stringify(["a", "b", "c"])) debugger;

function multiHas(multiAction, action) {
    const arr = multi2array(multiAction)
    return arr.includes(action);
}
if (!multiHas("[a b c]", "c")) debugger;
if (multiHas("[a b c]", "x")) debugger;

// FIX-ME: move into class:
// const setCheckedDoubleState = new Set();
function lookForDoubles(fsm, state, multiLine) {
    // if (setCheckedDoubleState.has(state)) return; setCheckedDoubleState.add(state);
    console.log(`lookForDoubles in state "${state}", because of "${multiLine.trim()}"`)
    const setActions = new Set();
    const addToActionSet = (action) => {
        if (setActions.has(action)) {
            debugger;
            throw Error(`Double declaration for action "${action}" in state ${state}`);
        }
        setActions.add(action);
    }
    const arrActions = fsm.actions(state);

    // debugger;
    // fsm.state(state);
    // const ourState = fsm.state();
    // const resOk = fsm.action(arrActions[0]);
    // const resBad = fsm.action("noaction");
    // debugger;

    arrActions.forEach(act => {
        if (isMulti(act)) {
            const arrAct = multi2array(act);
            arrAct.forEach(a => addToActionSet(a));
            // debugger;
        } else {
            addToActionSet(act);
            // debugger;
        }
    })
    // debugger;
}
function desctructureMultiLine(multiLine) {
    const resLine = reMultiActionLine.exec(multiLine);
    if (!resLine) {
        debugger;
        throw Error(`Not multiline: "${multiLine}"`);
    } else {
        const stateFrom = resLine[1];
        const multiAction = resLine[2];
        const stateTo = resLine[3];
        if (stateFrom != stateTo) {
            // arrMultiLines.push(line)
        } else {
            // arrFsmMultiLines.push(`    ${line} // MultiSame line `);
            // arrMultiSameLines.push(line);
        }
        return { stateFrom, stateTo, multiAction }
    }

}
debugger;