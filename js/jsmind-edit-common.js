// @ts-check

const version = "0.1.001";
window["logConsoleHereIs"](`here is jsmind-edit-common.js, module, ${version}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

const importFc4i = window["importFc4i"];
const mkElt = window["mkElt"];
const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];

// @ts-ignore
const jsMind = window.jsMind;
if (!jsMind) { throw Error("jsMind is not setup"); }

// Circular import
// const modCustRend = await importFc4i("jsmind-cust-rend");

// FIX-ME: comment out temporary!
const modMMhelpers = await importFc4i("mindmap-helpers");
const modMdc = await importFc4i("util-mdc");
const modTools = await importFc4i("toolsJs");

const modMm4iFsm = await (async () => {
    // return;
    // if (!navigator.onLine) return;
    return await importFc4i("mm4i-fsm");
})();
const ourFsm = modMm4iFsm.fsm;
window["ourFsm"] = ourFsm;

modTools.addPosListeners();

let instMoveAtDragBorder;
// let forceDiffPointHandle = 0;

/*
 * 
 * @param {number | undefined} px 
export function setDiffPointHandle(px) {
    forceDiffPointHandle = px;
}
*/

class PointHandle {
    static sizePointHandle = 20;
    // static diffPointHandle = 60;

    // #jmnodesPointHandle;

    static myStates = ["idle", "init", "dist", "move"];
    #myState;
    // #pointerType;
    #diffPointHandle = 1;

    /** @type {HTMLElement} */ #eltPointHandle;
    // @type {HTMLElement} */ #jmnodesPointHandle;

    /**
     * 
     * @param {string} state 
     * @returns {number}
     */
    static idxState(state) { return PointHandle.myStates.indexOf(state); }
    /**
     * 
     * @param {string} state 
     * @returns {boolean}
     */
    static knownState(state) { return PointHandle.idxState(state) > -1; }

    get #state() { return this.#myState; }
    set #state(state) {
        const idxOld = PointHandle.idxState(this.#myState);
        const idxNew = PointHandle.idxState(state);
        if (idxNew == -1) throw Error(`Unknown state: ${state}`);
        if (idxNew != 0) {
            if (idxNew - 1 != idxOld) throw Error(`${state} can't follow ${this.#myState}`);
        }
        this.#myState = state;

        // const elt = this.#eltPointHandle; const par = elt.parentElement;
        // console.log(">>>> set state", state, { elt, par });
        showDebugState(state);

        // const eltState = this.#jmnodesPointHandle;
        const eltState = document.documentElement;
        PointHandle.myStates.forEach(st => {
            // this.#jmnodesPointHandle.classList.remove(`pointhandle-state-${st}`);
            eltState.classList.remove(`pointhandle-state-${st}`);
        })
        // this.#jmnodesPointHandle.classList.add(`pointhandle-state-${state}`);
        eltState.classList.add(`pointhandle-state-${state}`);
        // this.#jmnodesPointHandle.classList.add(`pointhandle-state-dist`);
        // const jns = this.#jmnodesPointHandle;
        // const ph = ourPointHandle.#eltPointHandle;
        // const st = getComputedStyle(ph);
        // const bc = st.backgroundColor;
        // const phJns = ph.closest("jmnodes");
        // const phPar = ph.parentElement;
        // const phParTn = phPar?.tagName;
        // console.log("jmnodes", jns, ph, bc, phJns, jns == phJns, phPar);
        // console.log(ph, bc, phParTn);
    }
    /**
     * 
     * @param {string} state 
     * @returns {boolean}
     */
    isState(state) {
        if (!PointHandle.knownState(state)) throw Error(`Unrecognized state "${state}"`);
        return this.#state == state;
    }
    /**
     * 
     * @param {string} state 
     * @returns {boolean}
     */
    isBeforeState(state) {
        if (!PointHandle.knownState(state)) throw Error(`Unrecognized state "${state}"`);
        const idxCurr = PointHandle.myStates.indexOf(this.#state);
        const idx = PointHandle.myStates.indexOf(state);
        return idx < idxCurr;
    }
    /**
     * 
     * @returns {boolean}
     */
    stateMoving() {
        // FIX-ME:
        return this.#myState != "idle";
        if (this.#myState == "move") return true;
        if (this.#myState == "dist") return true;
        return false;
    }


    constructor() {
        this.#myState = "idle";
        this.#eltPointHandle = mkElt("div", { id: "jsmindtest-point-handle" });
        this.#eltPointHandle.style.pointerEvents = "none"; // FIX-ME: why???
    }
    get element() { return this.#eltPointHandle; }
    initializePointHandle = async (eltJmnode, pointerType) => {
        const jmnodeDragged = eltJmnode;
        if (!jmnodeDragged) return;
        if (jmnodeDragged.getAttribute("nodeid") == "root") return;

        const settingPointHandle = window["settingPointHandle"];
        const setType = settingPointHandle.valueS;
        let usePointerType;
        switch (setType) {
            case "detect-touch":
                usePointerType = pointerType;
                break;
            case "mouse":
                usePointerType = "mouse";
                break;
            case "touch":
                usePointerType = "touch";
                break;
            default:
                throw Error(`Did not handle setType: ${setType}`);
        }
        switch (usePointerType) {
            case "mouse":
                this.#diffPointHandle = 0;
                // this.#diffPointHandle = 80; // FIX-ME:
                break;
            default:
                this.#diffPointHandle = 80;
        }
        // }

        if (!pointHandle.isState("idle")) throw Error(`Expected state "idle" but it was ${this.#state}`);
        this.#state = "init";

        // const savedPointerPos = modTools.getSavedPointerPos();
        const savedStartPointerPos = await modTools.getAndClearStartPointerPos();
        if (savedStartPointerPos.startX == undefined) {
            debugger; // eslint-disable-line no-debugger
            throw Error(".addPosListeners must be called earlier");
        }
        const startX = savedStartPointerPos.startX;
        const startY = savedStartPointerPos.startY;
        if (isNaN(startX) || isNaN(startY)) {
            debugger; // eslint-disable-line no-debugger
            // FIX-ME:
        }
        posPointHandle = {
            start: {
                clientX: startX,
                clientY: startY,
                jmnodeDragged,
            },
            current: {}
        };
        eltJmnodeFrom = jmnodeDragged;

        // Avoid scaling: FIX-ME:
        document.documentElement.appendChild(this.#eltPointHandle);

        this.#eltPointHandle.style.left = `${startX - PointHandle.sizePointHandle / 2}px`;
        this.#eltPointHandle.style.top = `${startY - PointHandle.sizePointHandle / 2}px`;

        requestCheckPointerHandleMove();
    }
    teardownPointHandleAndAct() {
        if (!this.#eltPointHandle.parentElement) return;
        // console.log("teardownPointHandle");
        // this.#jmnodesPointHandle.removeEventListener("pointermove", this.savePosBounded);
        this.#eltPointHandle?.remove();
        this.#state = "idle";
        if (eltJmnodeFrom) {
            eltJmnodeFrom = undefined;
        }
        if (eltOverJmnode) {

        }
        modJsmindDraggable.stopNow();
        instMoveAtDragBorder.hideMover();
    }
    setupPointHandle() {
        // console.log("setupPointHandle");
        /** @type {HTMLElement | null} */
        const elt = document.body.querySelector("jmnodes");
        if (!elt) throw Error("Could not find <jmnodes>");
        // this.#jmnodesPointHandle = elt;
    }
    teardownPointHandle() {
        instMoveAtDragBorder.stopMoving();
        this.teardownPointHandleAndAct();
    }
    checkPointHandleDistance() {
        const savedPointerPos = modTools.getSavedPointerPos();
        if (this.isState("init")) {
            // There are race problems, we may not have position yet.
            // I see the race problem on mobile Android (and in dev tools!).
            const clientX = savedPointerPos.clientX;
            const clientY = savedPointerPos.clientY;
            if (isNaN(clientX)) {
                throw Error("Saving positions not started");
            }
            this.#eltPointHandle.style.left = `${clientX - PointHandle.sizePointHandle / 2}px`;
            this.#eltPointHandle.style.top = `${clientY - PointHandle.sizePointHandle / 2}px`;

            // const ph = this.#eltPointHandle;
            // const php = ph.parentElement;
            // console.log("pointHandle", ph, "Parent", php);
            this.#state = "dist";
            // debugger;
        }
        // const diffX = posPointHandle.start.clientX - savedPointerPos.clientX;
        // const diffY = posPointHandle.start.clientY - savedPointerPos.clientY;
        const diffX = posPointHandle.start.clientX - savedPointerPos.clientX;
        const diffY = posPointHandle.start.clientY - savedPointerPos.clientY;
        if (isNaN(diffX) || isNaN(diffY)) {
            debugger; // eslint-disable-line no-debugger
            throw Error(" ddiffX oriffY isNaN");
        }
        if (this.isState("dist")) {
            const diff2 = diffX * diffX + diffY * diffY;
            // const diffPH = PointHandle.diffPointHandle;
            const diffPH = this.#diffPointHandle;
            const diffPH2 = diffPH * diffPH;
            const diffOk = diff2 >= diffPH2;
            if (!diffOk) {
                return;
            }
            posPointHandle.diffX = diffX;
            posPointHandle.diffY = diffY;
            // modJsmindDraggable.setPointerDiff(diffX, diffY);
            modJsmindDraggable.nextHereIamMeansStart(eltJmnodeFrom);
            this.#state = "move";
            instMoveAtDragBorder.showMover();
            return;
        }
        movePointHandle();
    }

}
const pointHandle = new PointHandle();
// console.log({ pointHandle })
// console.log(pointHandle.element);
window["ourPointHandle"] = pointHandle; // FIX-ME:
// debugger;



const divJsmindSearch = mkElt("div", { id: "jsmind-search-div" });


let theCustomRenderer;

async function getCustomRenderer() {
    if (!theCustomRenderer) {
        const modCustRend = await importFc4i("jsmind-cust-rend");
        theCustomRenderer = await modCustRend.getOurCustomRenderer();
    }
    return theCustomRenderer;
}

const theMirrorWays = [
    "none",
    // "useCanvas",
    // "jsmind",
    "pointHandle",
    // "cloneNode",
];
Object.freeze(theMirrorWays);
/*
const ifMirrorWay = (ourWay) => {
    if (!theMirrorWays.includes(ourWay)) throw Error(`Unknown mirror way: ${ourWay}`);
    return ourWay == theDragTouchAccWay;
}
*/

const checkTheDragTouchAccWay = () => {
    if (!theMirrorWays.includes(theDragTouchAccWay)) throw Error(`Unknown mirror way: ${theDragTouchAccWay}`);
}
function switchDragTouchAccWay(newWay) {
    theDragTouchAccWay = newWay;
    checkTheDragTouchAccWay();
    switch (theDragTouchAccWay) {
        // case "cloneNode": setupMirror(); break;
        case "none":
            pointHandle.teardownPointHandle();
            break;
        case "pointHandle":
            // setTimeout(setupPointHandle, 1000);
            pointHandle.setupPointHandle();
            break;
        default:
            throw Error(`Not handled theMirrorWay=${theDragTouchAccWay}`);
    }
}


// https://www.labnol.org/embed/google/photos/?ref=hackernoon.com
// https://hackernoon.com/how-to-embed-single-photos-from-google-photos-on-your-website-and-notion-page
// https://jumpshare.com/blog/how-to-embed-google-drive-video/
/*
async function dialogMirrorWay() {
    const notWorking = ["useCanvas", "jsmind",];
    const altWays = theMirrorWays.filter(alt => !notWorking.includes(alt));
    console.log({ altWays });
    const altsDesc = {}
    altsDesc.none = mkElt("div", undefined, [
        "Default when the only screen input is a mouse or similar."
    ]);

    // const srcVideoMirror = "https://drive.google.com/file/d/17gmHG7X14szrG04nIskIAAP4mNnr9Tm8/preview";
    // const srcVideoMirror = "/img/vid/screen-20230513-mirror.mp4";
    // const posterVideoMirror = "/img/vid/screen-20230513-mirror.jpg";
    // const aspectratioVideoMirror = "1048 / 1248";
    // const eltVidMirror = mkVidElt(srcVideoMirror, posterVideoMirror);
    // altsDesc.cloneNode = mkElt("div", undefined, [ eltVidMirror ]);
    function mkVidElt(src, poster, aspectRatio) {
        aspectRatio = aspectRatio || "1 / 1";
        // https://stackoverflow.com/questions/24157940/iframe-height-auto-css
        const styleVideo = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                aspect-ratio: ${aspectRatio};
                `;
        const eltIframe = mkElt("iframe", { style: styleVideo });
        eltIframe.allowfullscreen = true;

        const styleContainer = `
                position: relative;
                 width: 100%;
                 aspect-ratio: 1048 / 1248;
                `;

        const eltVideo = mkElt("video", { style: styleContainer });
        eltVideo.src = src;
        if (poster) eltVideo.poster = poster;
        eltVideo.controls = true;
        // eltVideo.autoplay = true;
        // eltVideo.load();

        // const divIframeContainer = mkElt("div", { style: styleContainer }, eltIframe);
        // return divIframeContainer;

        // const divBoth = mkElt("div", undefined, [divIframeContainer, eltVideo]);
        // return divBoth;
        return eltVideo;
    }

    altsDesc.pointHandle = mkElt("div", undefined, [
        "Default when screen supports touch.",
        "(no description yet)",
        // vidPointHandle,
        // iframePointHandle
        // divIframePointHandle
    ]);
    function mkAltWay(way) {
        const radio = mkElt("input", { type: "radio", name: "mirrorway", value: way });
        if (theDragTouchAccWay == way) radio.checked = true;
        return mkElt("label", undefined, [
            way, radio,
            altsDesc[way]
        ]);
    }

    const style = [
        "display: flex",
        "flex-direction: column",
        "gap: 20px"
    ].join("; ");
    const divChoices = mkElt("div", { style });
    altWays.forEach(way => divChoices.appendChild(mkAltWay(way)));
    const body = mkElt("div", undefined, [divChoices]);
    function getValue() {
        // return "hej";
        return divChoices.querySelector('input[name="mirrorway"]:checked')?.value;
    }
    return modMdc.mkMDCdialogGetValue(body, getValue, "Ok");
}
*/

let theDragTouchAccWay = "none";
if (hasTouchEvents()) theDragTouchAccWay = "pointHandle";
theDragTouchAccWay = "pointHandle"; // FIX-ME:

// switchDragTouchAccWay(theDragTouchAccWay);
// checkTheDragTouchAccWay();


/////////////////////////////////////////////////////

/**
 * @typedef {Object}
 * @property {number} dTop - target top
 * @property {number} dBottom
 * @property {number} dLeft
 * @property {number} dRight
 * @property {number} startX
 * @property {number} startY
 * */
let posPointHandle;





// https://javascript.info/pointer-events
/*
 * 
 * @return {EventListenerOrEventListenerObject}
 */
function requestCheckPointerHandleMove() {
    try {
        if (!pointHandle.stateMoving()) return;
        pointHandle.checkPointHandleDistance();
    } catch (err) {
        console.log("ERROR requestCheckPointerHandleMove", err);
        eltReqFrame.textContent = err;
        debugger; // eslint-disable-line no-debugger
    }
    requestAnimationFrame(requestCheckPointerHandleMove);
}
let eltJmnodeFrom;
let eltOverJmnode;
let movePointHandleProblem = false;
// let im = 0;
function movePointHandle() {
    if (movePointHandleProblem) return;
    const savedPointerPos = modTools.getSavedPointerPos();
    const clientX = savedPointerPos.clientX;
    const clientY = savedPointerPos.clientY;
    if (isNaN(clientX) || isNaN(clientY)) {
        debugger; // eslint-disable-line no-debugger
        throw Error(`Saved pos is ${clientX}, ${clientY}`);
    }
    // if ((im++ % 40) == 0) console.log("mPH, clientX", clientX);
    try {
        const sp = pointHandle.element.style;
        // const left = clientX + posPointHandle.diffX - PointHandle.sizePointHandle / 2;
        const left = clientX + posPointHandle.diffX - PointHandle.sizePointHandle / 2;
        sp.left = `${left}px`;
        // const top = clientY + posPointHandle.diffY - PointHandle.sizePointHandle / 2;
        const top = clientY + posPointHandle.diffY - PointHandle.sizePointHandle / 2;
        sp.top = `${top}px`;
        modJsmindDraggable.hiHereIam(left, top);
        instMoveAtDragBorder.checkPointerPos(clientX, clientY)
    } catch (err) {
        movePointHandleProblem = true;
        console.error("movePointHandle", err);
        debugger;
    }
}
/////////////////////////////////////////////////////

export const arrShapeClasses = getMatchesInCssRules(/\.(jsmind-shape-[^.:#\s]*)/);
export function clearShapes(eltShape) {
    // if (!jsMind.mm4iSupported) return;
    eltShape.parentElement.classList.remove("bg-transparent");
    if (eltShape.tagName != "DIV" || !eltShape.classList.contains("jmnode-bg")) {
        throw Error('Not <jmnode><div class="jmnode-bg"');
    }
    arrShapeClasses.forEach(oldShape => { eltShape.classList.remove(oldShape) });
}

export function shapeCanHaveBorder(shapeName) {
    return !shapeName?.startsWith("jsmind-shape-clip-");
}

export function applyNodeShapeEtc(node, eltJmnode) {
    const shapeEtc = node.data.shapeEtc;
    if (!shapeEtc) {
        const useOrig = window["useOrigJsmind"];
        if (typeof useOrig != "boolean") {
            debugger; // eslint-disable-line no-debugger
        }
        if (useOrig) {
            eltJmnode.style.color = "yellow";
            eltJmnode.style.backgroundColor = "black";
        }
        return;
    }
    applyShapeEtc(shapeEtc, eltJmnode);
}
const jmnodesBgNames = [
    "bg-choice-none",
    "bg-choice-pattern",
    "bg-choice-color",
    // "bg-choice-img-link",
    "bg-choice-img-clipboard",
];
export function checkJmnodesBgName(bgName) {
    if (!jmnodesBgNames.includes(bgName)) throw Error(`Not a jmnodesBgName: ${bgName}`);
}
const modColorTools = await importFc4i("color-tools");
export function mkJmnodeBgObj(bgName, bgValue) {
    let bgTheme;
    switch (bgName) {
        case "bg-choice-none":
            break;
        case "bg-choice-color":
            bgTheme = modColorTools.isDarkBG(bgValue) ? "dark" : "light";
            break;
        default:
            bgTheme = "mixed";
    }
    const bgObj = { bgName, bgValue, bgTheme };
    checkJmnodeBgObj(bgObj);
    return bgObj;
}
export function checkShapeEtcBgObj(shapeEtc) {
    const bgObj = shapeEtc.background;
    return checkJmnodeBgObj(bgObj);
}
export function checkJmnodeBgObj(bgObj) {
    if (!bgObj) return;
    const bgKeys = Object.keys(bgObj);
    if (![2, 3].includes(bgKeys.length)) {
        throw Error(`bgKeys.length == ${bgKeys.length}, should be 2 or 3`);
    }
    const bgName = bgObj.bgName;
    checkJmnodesBgName(bgName);
    const bgValue = bgObj.bgValue;
    const tofVal = typeof bgValue;
    let errMsg;
    switch (bgName) {
        case "bg-choice-none":
            break;
        case "bg-choice-img-clipboard":
            {
                let blob, blurVal;
                blob = bgValue;
                // New format? (This is the expected format)
                if (bgValue.blob) {
                    const val = bgValue.blob;
                    if (val instanceof Blob) {
                        blob = val;
                    } else {
                        // FIX-ME: I believe we can get ArrayBuffer here after transfering with peerJS??
                        if (val instanceof ArrayBuffer) {
                            blob = new Blob([val], { type: "image/webp" });
                        }
                    }
                    // blob = bgValue.blob;
                    blurVal = bgValue.blur;
                }
                // debugger;
                if (!(blob instanceof Blob)) {
                    errMsg = `${bgName} should be Blob`;
                } else {
                    const bType = "image/webp"
                    if (blob.type != bType) errMsg = `${bgName} should be ${bType}`;
                }
                if (blurVal != undefined) {
                    // debugger;
                    const tofBlur = typeof blurVal;
                    if (tofBlur !== "string") {
                        throw Error(`Expected blur to be string, got ${tofBlur}`);
                    }
                    const isNotNumber = Number.isNaN(Number(blurVal));
                    if (isNotNumber) {
                        throw Error(`Expected blur to be a "string number", got "${blurVal}"`);
                    }
                }
            }
            break;
        default:
            if ("string" != tofVal)
                errMsg = `${bgName} should be "string", not ${tofVal}`;
    }
    if (errMsg) {
        console.error(errMsg);
        debugger; // eslint-disable-line no-debugger
        throw Error(errMsg);
    }
}
export function getShapeEtcBgObj(shapeEtc) {
    const bgObj = shapeEtc.background;
    if (!bgObj) return;
    checkJmnodeBgObj(bgObj);
    return bgObj;
}
// editNodeDialog
function setNodeTheme(bgTheme, eltJmnode) {
    if (!["light", "dark", "mixed", undefined].includes(bgTheme)) throw Error(`Unrecognized bgThem == "${bgTheme}"`);
    eltJmnode.classList.remove("node-theme-light");
    eltJmnode.classList.remove("node-theme-dark");
    eltJmnode.classList.remove("node-theme-mixed");
    if (bgTheme) eltJmnode.classList.add(`node-theme-${bgTheme}`);
}
export async function applyShapeEtcBg(bgName, bgValue, bgTheme, eltJmnode) {
    setNodeTheme(bgTheme, eltJmnode);
    checkJmnodesBgName(bgName);
    const eltBg = eltJmnode.querySelector(".jmnode-bg");
    const modCustRend = await importFc4i("jsmind-cust-rend");
    modCustRend.clearBgCssValue(eltBg);
    switch (bgName) {
        case "bg-choice-none":
            break;
        case "bg-choice-pattern":
            const bgCssText = bgValue;
            modCustRend.applyJmnodeBgCssText(eltJmnode, bgCssText);
            break;
        case "bg-choice-color":
            const color = bgValue;
            eltBg.style.backgroundColor = color;
            break;
        // case "bg-choice-img-link": const url = bgValue; eltBg.style.backgroundImage = `url("${url}")`; break;
        case "bg-choice-img-clipboard":
            let objectUrl;
            let blob, blurValue, fgColor;
            blob = bgValue;
            blurValue = 9;
            // New format? (This is the expected format)
            if (bgValue.blob) {
                const val = bgValue.blob;
                if (val instanceof Blob) {
                    blob = val;
                } else {
                    // FIX-ME: I believe we can get ArrayBuffer here after transfering with peerJS??
                    if (val instanceof ArrayBuffer) {
                        blob = new Blob([val], { type: "image/webp" });
                    }
                }

                // blob = bgValue.blob;
                blurValue = bgValue.blur;
                fgColor = bgValue.fgColor;
            }
            objectUrl = URL.createObjectURL(blob);
            setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
            eltBg.style.backgroundImage = `url("${objectUrl}")`;
            eltBg.style.filter = `blur(${blurValue}px)`;
            // setNodeTheme node-theme-dark
            eltJmnode.classList.remove("node-theme-dark");
            eltJmnode.classList.remove("node-theme-light");
            eltJmnode.classList.remove("node-theme-mixed");
            eltJmnode.style.color = fgColor || "red";
            break;
        default:
            throw Error(`Not impl yet: ${bgName}`)
    }

}

async function editNotes(eltJmnode) {
    const modCustRend = await importFc4i("jsmind-cust-rend");
    const renderer = await modCustRend.getOurCustomRenderer();
    renderer.editNotesDialog(eltJmnode);
}

export async function applyShapeEtc(shapeEtc, eltJmnode) {
    const eltShape = eltJmnode.querySelector(".jmnode-bg");
    if (!eltShape) {
        console.error("eltShape is null, no .jmnode-bg found");
        eltJmnode.style.color = "yellow";
        eltJmnode.style.backgroundColor = "red";
        return;
        throw Error("eltShape is null, no .jmnode-bg found");
    }

    clearShapes(eltShape);
    const shape = shapeEtc.shape;
    eltJmnode.classList.remove("bg-transparent");
    if (shape) {
        if (shapeEtc?.shapeBoxBg != undefined) {
            if (shapeEtc.shapeBoxBg) {
                eltJmnode.classList.add("bg-transparent");
            }
        } else {
            eltJmnode.classList.add("bg-transparent");
        }
        if (arrShapeClasses.includes(shape)) {
            eltShape.classList.add(shape);
        } else {
            if (shape != "default") console.error(`Unknown shape: ${shape}`);
        }

    }
    if (shapeCanHaveBorder(shape)) {
        const border = shapeEtc.border;
        if (border) {
            const w = border.width || 0;
            const c = border.color || "black";
            const s = border.style || "solid";
            if (w == 0) {
                eltShape.style.border = null;
            } else {
                eltShape.style.border = `${w}px ${s} ${c}`;
            }
        }
    } else {
        eltShape.style.border = null;
    }

    const shadow = shapeEtc.shadow;
    if (shadow && shadow.blur > 0) {
        const x = shadow.offX || 0;
        const y = shadow.offY || 0;
        const b = shadow.blur;
        const c = shadow.color || "red";
        // eltShape.style.filter = `drop-shadow(${x}px ${y}px ${b}px ${c})`;
        eltJmnode.style.filter = `drop-shadow(${x}px ${y}px ${b}px ${c})`;
        // FIX-ME: spread is currently not used, or???
        // const s = shadow.spread;
        // eltJmnode.style.filter = `drop-shadow(${x}px ${y}px ${b}px ${s}px ${c})`;
    } else {
        eltJmnode.style.filter = null;
    }

    if (shapeEtc.background) {
        const bgObj = getShapeEtcBgObj(shapeEtc);
        // const bgEntries = Object.entries(bgObj);
        // const [bgName, bgValue] = bgEntries[0];
        // FIX-ME:
        applyShapeEtcBg(bgObj.bgName, bgObj.bgValue, bgObj.bgTheme, eltJmnode);
    }

    // const clsIconButton = "icon-button-40";
    const clsIconButton = "icon-button-30";
    const oldAimg = eltJmnode.querySelector(`.jsmind-renderer-img`);
    oldAimg?.remove();
    const oldBtn = eltJmnode.querySelector(`.${clsIconButton}`);
    oldBtn?.remove();

    if (!eltJmnode.closest("#div-ednode-copied")) {
        const notes = shapeEtc.notes;
        if (notes) {
            const oldMark = eltJmnode.querySelector("has-notes-mark");
            if (oldMark) {
                debugger; // eslint-disable-line no-debugger
                throw Error(`Node ${eltJmnode.textContent} already had "has-notes-mark"`);
            }

            const iconNotes = "summarize";

            const iconNotesBtn = modMdc.mkMDCiconButton(iconNotes, "Show notes");
            iconNotesBtn.classList.add(clsIconButton);

            const eltSpanNotes = mkElt("span", undefined, iconNotesBtn);
            eltSpanNotes.classList.add("has-notes-mark");
            eltJmnode.appendChild(eltSpanNotes);

            eltSpanNotes.addEventListener("click", errorHandlerAsyncEvent(async evt => {
                evt.preventDefault();
                evt.stopPropagation();
                evt.stopImmediatePropagation();
                editNotes(eltJmnode);
            }));
        }
    }


    const nodeLink = shapeEtc.nodeLink;
    const nodeCustom = shapeEtc.nodeCustom;
    let foundCustom = false;
    if (nodeCustom) {
        let key = nodeCustom.key;
        const provider = nodeCustom.provider;
        // select custom
        // FIX-ME: is theCustomRenderer available here???
        // const renderer = await getOurCustomRenderer();
        const renderer = await getCustomRenderer();
        const rec = await renderer.getCustomRec(key, provider);
        if (rec) {
            foundCustom = true;
            const blob = rec.images ? rec.images[0] : undefined;
            if (blob) {
                const urlBlob = URL.createObjectURL(blob);
                const urlBg = `url(${urlBlob})`;
                const backgroundImage = urlBg;
                const divBg = eltJmnode.querySelector(".jmnode-bg");
                divBg.style.backgroundImage = backgroundImage;
            }
            // FIX-ME: long name
            // FIX-ME: looks like a race condition?
            //    Try to get around it by a simple check...
            const oldAimg = eltJmnode.querySelector(`.jsmind-renderer-img`);
            if (!oldAimg) {
                const iconBtn = modMdc.mkMDCiconButton("", `Go to this item in ${provider} (3)`);
                const bgImg = renderer.getLinkRendererImage(provider);
                iconBtn.style.backgroundImage = `url(${bgImg})`;
                iconBtn.classList.add(clsIconButton);
                const recLink = renderer.getRecLink(key, provider);
                const eltA3 = mkElt("a", { href: recLink }, iconBtn);
                eltA3.classList.add("jsmind-renderer-img");
                eltJmnode.appendChild(eltA3);
            }
        }
    }
    if (!foundCustom) {
        if (nodeLink && nodeLink.length > 0) {
            const iconBtn = modMdc.mkMDCiconButton("link", "Visit web page");
            iconBtn.classList.add(clsIconButton);
            const eltA3 = mkElt("a", { href: nodeLink }, iconBtn);
            eltA3.classList.add("jsmind-plain-link");
            eltJmnode.appendChild(eltA3);
        }
    }

}



const modJsmindDraggable = window["modJsmindDraggable"];
export function basicInit4jsmind() {
    jsMind.my_get_DOM_element_from_node = (node) => { return node._data.view.element; }
    jsMind.my_get_nodeID_from_DOM_element = (elt) => {
        const tn = elt.tagName;
        if (tn !== "JMNODE") throw Error(`Not jmnode: <${tn}>`);
        const id = elt.getAttribute("nodeid");
        if (!id) {
            // Orig jsmind draggable shadow node:
            if (elt.classList.contains("jsmind-draggable-shadow-node")) return;
            throw Error("Could not find jmnode id");
        }
        return id;
    }
}

let funMindmapsDialog;
export function setMindmapDialog(fun) {
    const funType = typeof fun;
    if (funType != "function") throw Error(`setMindmapDialog, expected "function" paramenter, got "${funType}"`);
    funMindmapsDialog = fun;
}

// pageSetup();

// testDouble(); async function testDouble() { console.warn("testDouble"); }

checkTheDragTouchAccWay();


function mkMenuItemA(lbl, url) {
    const eltA = mkElt("a", { href: url }, lbl);
    const li = modMdc.mkMDCmenuItem(eltA);
    li.addEventListener("click", evt => {
        // evt.preventDefault();
        evt.stopPropagation();
        hideContextMenu();
    });
    return li;
}
function mkMenuItem(lbl, fun, keyHint) {
    // const li = modMdc.mkMDCmenuItem(lbl);

    const lblAndKey = mkElt("div", undefined, lbl);
    lblAndKey.classList.add("text-and-key");
    if (keyHint) {
        const keyLbl = mkElt("span", undefined, keyHint);
        keyLbl.classList.add("menu-item-key");
        lblAndKey.appendChild(keyLbl);
    }

    const li = modMdc.mkMDCmenuItem(lblAndKey);
    li.classList.add("menu-text-and-key");
    li.addEventListener("click", evt => {
        evt.preventDefault();
        evt.stopPropagation();
        // console.log(li);
        const ul = li.closest("ul");
        // console.log(ul);
        [...ul.children].forEach(li => {
            if (li.tagName != "LI") throw Error("is not li");
            li.style.backgroundColor = "";
        });
        // li.style.backgroundColor = "red";
        li.style.backgroundColor = "rgba(0,255,0,0.4)";
        hidePageMenu();
        setTimeout(() => { fun() }, 200);

        // hideContextMenu();
    });
    return li;
}
let /** @type {HTMLElement|undefined} */ divContextMenu;
let jmDisplayed;

function hideContextMenu() {
    if (!divContextMenu) return;
    divContextMenu.style.display = "none";
    setTimeout(focusSelectedNode, 2000);
}
// FIX-ME: The node does not get DOM focus???
function focusSelectedNode() {
    // FIX-ME: What is wrong with jmDisplayed here???
    try {
        const selectedNode = jmDisplayed?.get_selected_node();
        if (selectedNode) {
            const selectedElt = getDOMeltFromNode(selectedNode);
            selectedElt.focus();
        }
    } catch (err) {
        console.log("*** focusSelectedNode", { err });
    }
}


const extraPageMenuItems = [];
export async function addToPageMenu(lbl, what) {
    if (document.getElementById("mm4i-page-menu")) throw Error("Must be called before menu first display")
    let liMenuItem;
    if ("function" == typeof what) {
        liMenuItem = mkMenuItem(lbl, what)
    } else {
        liMenuItem = mkMenuItemA(lbl, what);
    }
    // console.warn(liMenuItem);
    extraPageMenuItems.push(liMenuItem);
}

/**
 * 
 * @returns {Element}
 */
function getEltFsm() {
    const eltJsMindContainer = document.getElementById("jsmind_container");
    if (!eltJsMindContainer) throw Error("Could not find #jsmind_container");
    const eltFsm = eltJsMindContainer.querySelector(".jsmind-inner");
    if (!eltFsm) throw Error("Could not find .jsmind-inner");
    return eltFsm;
}

let pageMenu;
function hidePageMenu() {
    pageMenu.style.opacity = 0;
    setTimeout(() => { pageMenu.remove(); }, 300);
}



const idDivJsmindContainer = "jsmind_container";
const idDivHits = "jsmind-div-hits";
const defaultOptJmDisplay = {
    container: idDivJsmindContainer,
    editable: true,
    view: {
        // draggable: true,
        draggable: false,
        hide_scrollbars_when_draggable: false,
        engine: "svg",
        line_width: 10,
        line_color: "green",
    },
    layout: {
        pspace: 32,
    },
    shortcut: {
        enable: true, 		// whether to enable shortcut
        handles: {}, 			// Named shortcut key event processor
        mapping: { 			// shortcut key mapping
            // FIX-ME: these does not work
            addchild: [45, 4096 + 13], 	// <Insert>, <Ctrl> + <Enter>
            addbrother: 13, // <Enter>
            editnode: 113, 	// <F2>
            delnode: 46, 	// <Delete>
            toggle: 32, 	// <Space>
            left: 37, 		// <Left>
            up: 38, 		// <Up>
            right: 39, 		// <Right>
            down: 40, 		// <Down>
        }
    },
};
function getUsedOptJmDisplay(mind) {
    function getMindmapGlobals0(mind) {
        const format = mind.format;
        let root_node;
        switch (format) {
            case "node_array":
                for (const idx in mind.data) {
                    const n = mind.data[idx];
                    if (n.id == "root") {
                        root_node = n;
                        break;
                    }
                }
                break;
            default:
                throw Error(`Can't get mindmapGlobals when mind format is ${format}`);
        }
        const globals = root_node.mindmapGlobals;
        // console.log({ root_node, globals });
        return globals;
    }
    const usedOptJmDisplay = JSON.parse(JSON.stringify(defaultOptJmDisplay));
    const savedGlobals = getMindmapGlobals0(mind);
    // Merge in savedGlobals:
    if (savedGlobals) {
        if (savedGlobals.line_width) {
            usedOptJmDisplay.view.line_width = savedGlobals.line_width;
        }
        if (savedGlobals.line_color) {
            usedOptJmDisplay.view.line_color = savedGlobals.line_color;
        }
    }
    return usedOptJmDisplay;
}
function connectFsm() {
    ourFsm?.hook_any_action(fsmEvent);
    ourFsm?.hook_any_transition((...args) => {
        const newState = args[0].to;
        logJssmState(newState);
    });
    const eltFsm = getEltFsm();


    ////// FSL hooks
    function hookStartMovePointHandle(hookData) {
        // pointHandle.setupPointHandle();
        const { eltJmnode, pointerType } = hookData.data;
        // debugger;
        modJsmindDraggable.setJmnodeDragged(eltJmnode);
        // For pointerdown to save pos:
        // setTimeout(() => {
        pointHandle.initializePointHandle(eltJmnode, pointerType);
        // }, 300);
    }
    ourFsm?.post_hook_entry("n_Move", (hookData) => {
        hookStartMovePointHandle(hookData);
    });
    ourFsm?.hook_exit("n_Move", () => pointHandle.teardownPointHandle());

    let funStopScroll;
    ourFsm?.post_hook_entry("c_Move", (hookData) => {
        // const { eltJmnode, pointerType } = hookData.data;
        const { eltJmnode } = hookData.data;
        if (eltJmnode && (!eltJmnode.classList.contains("root"))) throw Error("eltJmnode in c_Move");
        funStopScroll = undefined;
        const jmnodes = getJmnodesFromJm(jmDisplayed);
        const eltScroll = jmnodes.closest("div.zoom-move");
        funStopScroll = startGrabMove(eltScroll);
    });
    ourFsm?.hook_exit("c_Move", () => {
        if (funStopScroll) {
            if (funStopScroll instanceof Promise) {
                funStopScroll.then(fun => fun());
                return;
            }
            if (typeof funStopScroll == "function") {
                funStopScroll();
                return;
            }
            debugger; // eslint-disable-line no-debugger
            throw Error("funStopScroll was neither Promise or function");
        }
    });

    ourFsm?.post_hook_entry("c_Dblclick", () => { dialogEditMindmap(); });
    ourFsm?.post_hook_entry("n_Dblclick", async (hookData) => {
        // const eltJmnode = hookData.data;
        const { eltJmnode } = hookData.data;
        const modCustRend = await importFc4i("jsmind-cust-rend");
        const renderer = await modCustRend.getOurCustomRenderer();
        renderer.editNodeDialog(eltJmnode);
    });

    // FIX-ME: for testing original jsMind dragging 
    if (modJsmindDraggable.setJmnodeDragged) {
        modMm4iFsm.setupFsmListeners(eltFsm);
    }
}
// FIX-ME:
async function startGrabMove(elt2move) {
    const modMoveHelp = await importFc4i("move-help");
    // console.log("startGrabMove", elt2move);
    let isMoving = true;
    // const ourElement2move = elt2move;
    // let n = 0;

    elt2move.style.cursor = "grabbing";
    elt2move.style.filter = "grayscale(0.5)";
    // const savedPointerPos = modTools.getSavedPointerPos();
    const movingData = modMoveHelp.setInitialMovingData(elt2move);
    function requestMove() {
        if (!isMoving) return;
        const oldLeft = movingData.left;
        const oldTop = movingData.top;
        const savedPointerPos = modTools.getSavedPointerPos();
        const dx = modMoveHelp.getMovingDx(movingData, savedPointerPos.clientX);
        const dy = modMoveHelp.getMovingDy(movingData, savedPointerPos.clientY);
        const newLeft = oldLeft + dx;
        const newTop = oldTop + dy;
        if (isNaN(newLeft) || isNaN(newTop)) {
            debugger; // eslint-disable-line no-debugger
            throw Error(`isNan: newLeft:${newLeft}, newTop:${newTop}`);
        }
        const newLeftPx = `${newLeft}px`.replace("-0px", "0px");
        const newTopPx = `${newTop}px`.replace("-0px", "0px");
        elt2move.style.left = newLeftPx;
        elt2move.style.top = newTopPx;

        requestAnimationFrame(requestMove);
    }
    requestMove();
    return () => {
        // ourElement2move.style.cursor = "";
        movingData.movingElt.style.cursor = "";
        movingData.movingElt.style.filter = "";
        isMoving = false;
    }
}
function addZoomMoveLayer(eltContainer) {
    if (!eltContainer) throw Error("Could not find jsmind container");
    const eltInner = eltContainer?.querySelector("div.jsmind-inner");
    if (!eltInner) throw Error("Could not find div.jsmind-inner");
    if (!eltInner.closest("div.zoom-move")) {
        // debugger;
        const eltZoomMove = document.createElement("div");
        eltZoomMove.classList.add("zoom-move");
        // @ts-ignore
        eltZoomMove.style = `
                position: relative;
                outline: 4px dotted black;
            `;
        eltInner.remove();
        eltZoomMove.appendChild(eltInner);
        eltContainer.appendChild(eltZoomMove);
    }
}
async function dialogEditMindmap() {
    const modCustRend = await importFc4i("jsmind-cust-rend");
    const rend = await modCustRend.getOurCustomRenderer();
    await rend.editMindmapDialog();
}
async function applyOurMindmapGlobals(jmDisplayed) {
    const modCustRend = await importFc4i("jsmind-cust-rend");
    modCustRend.setOurCustomRendererJm(jmDisplayed);
    modCustRend.setOurCustomRendererJmOptions(defaultOptJmDisplay);
    const render = await modCustRend.getOurCustomRenderer();
    render.applyThisMindmapGlobals();
}
async function addDragBorders(jmDisplayed) {
    const eltJmnodes = getJmnodesFromJm(jmDisplayed);
    const eltScroll = eltJmnodes.closest("div.zoom-move");
    const eltShow = eltJmnodes.closest("div.jsmind-inner");
    const modMoveHelp = await importFc4i("move-help");
    try {
        instMoveAtDragBorder?.markDeleted();
        instMoveAtDragBorder = new modMoveHelp.MoveAtDragBorder(eltScroll, 60, eltShow);
    } catch (err) {
        console.error({ err });
        debugger;
    }
}
export async function displayOurMindmap(mindStored) {
    modMMhelpers.checkIsMMformatStored(mindStored, "displayOurMindmap", undefined, true);
    const opts = getUsedOptJmDisplay(mindStored);
    const eltJmdisplayContainer = document.getElementById(opts.container);
    if (!eltJmdisplayContainer) { throw Error(`Could not find #${opts.container}`); }
    // const oldJmnodes = eltJmdisplayContainer.querySelector("jmnodes");
    // oldJmnodes?.remove(); // Remove old jmnodes, FIX-ME: maybe remove when this is fixed in jsmind?
    const oldZoomMove = eltJmdisplayContainer.querySelector("div.zoom-move");
    oldZoomMove?.remove(); // Remove old jmnodes, FIX-ME: maybe remove when this is fixed in jsmind?

    jmDisplayed = await displayMindMap(mindStored);
    modMMhelpers.checkIsMMformatJmdisplayed(jmDisplayed, "displayOurMindmap");
    initialUpdateCustomAndShapes(jmDisplayed); // FIX-ME: maybe remove when this is fixed in jsmind?

    jmDisplayed.disable_event_handle("dblclick"); // Double click on Windows and Android
    // if (modJsmindDraggable.setJmnodeDragged) {
    connectFsm(); // Using mm4i version
    // }

    // We need another layer to handle zoom/move:
    if (modJsmindDraggable.setJmnodeDragged) {
        addZoomMoveLayer(eltJmdisplayContainer);
        addDragBorders(jmDisplayed);
    }

    applyOurMindmapGlobals(jmDisplayed);
    // addDragBorders(jmDisplayed);
    return jmDisplayed;
}
async function displayMindMap(mind) {
    const usedOptJmDisplay = getUsedOptJmDisplay(mind);
    const jm = new jsMind(usedOptJmDisplay);
    jm.add_event_listener((type, data) => {
        if (type !== 3) return;
        addDebugLog(`jmDisplayed, event_listener, ${type}`)
        const evt_type = data.evt;
        const datadata = data.data;
        const node_id = data.node;
        // console.log({ evt_type, type, datadata, data });
        checkOperationOnNode(evt_type, node_id, datadata);

        // const topic = jmDisplayed.mind.nodes[node_id].topic;
        // const topic_id = (evt_type !== "remove_node") ? node_id : datadata[0];
        // const topic = jmDisplayed.mind.nodes[node_id].topic;
        const topic = (evt_type !== "remove_node") ? jmDisplayed.mind.nodes[node_id].topic : data.nodeTopic;

        setTopic4undoRedo(topic);
        const actionAndNode = `${niceEvtType(evt_type)} "${getTopic4undoRedo()}"`;
        // modMMhelpers.DBrequestSaveMindmapPlusUndoRedo(jmDisplayed, evt_type); // FIX-ME: delay
        modMMhelpers.DBrequestSaveMindmapPlusUndoRedo(jmDisplayed, actionAndNode); // FIX-ME: delay
        // updateTheMirror();
    });
    function niceEvtType(evt_type) {
        let nice = evt_type;
        let onlyNice = false;
        switch (evt_type) {
            case "remove_node":
                nice = "Remove node";
                onlyNice = true;
                break;
            case "add_node":
                nice = "Add node";
                onlyNice = true;
                break;
            case "move_node":
                onlyNice = true;
                nice = "Move node";
                break;
            case "update_node":
                nice = "Update node";
                break;
            default:
                console.log(`%cMissing "${evt_type}" in niceEvtType`, "color:red;font-size:20px");
        }
        if (onlyNice) return nice;
        return `${nice} (${evt_type})`;
    }
    async function checkOperationOnNode(operation_type, operation_node_id, datadata) {
        // console.log("checkOpOnNode", { operation_type, operation_node_id, jm_operation: jmDisplayed, datadata });
        switch (operation_type) {
            case "add_node":
                const id_added = operation_node_id;
                // const added_node = jmDisplayed.get_node(id_added);
                // console.log({ operation_type, id_added, added_node });
                if (id_added != datadata[1]) throw Error(`id_added (${id_added}) != datadata[1] (${datadata[1]})`);
                break;
            case "update_node":
                {
                    const id_updated = operation_node_id;
                    const updated_node = jmDisplayed.get_node(id_updated);
                    console.log({ operation_type, id_updated, updated_node });
                    const eltJmnode = jsMind.my_get_DOM_element_from_node(updated_node);
                    const eltTxt = eltJmnode.querySelector(".jmnode-text");
                    if (!eltTxt.classList.contains("jmnode-text")) throw Error("Not .jmnode-text");
                    // const isPlainNode = eltTxt.childElementCount == 0;
                    // if (!isPlainNode) {
                    // (await getCustomRenderer()).updateJmnodeFromCustom(eltJmnode);
                    // }
                }
                break;
            case "move_node":
                {
                    // const id_moved = operation_node_id;
                    // const moved_node = jmDisplayed.get_node(id_moved);
                    // const eltJmnode = jsMind.my_get_DOM_element_from_node(moved_node);
                    // (await getCustomRenderer()).updateJmnodeFromCustom(eltJmnode);
                    break;
                }
            case "remove_node":
                // const id_removed = datadata[0];
                // console.log({ operation_type, id_removed, operation_node_id });
                break;
            default:
                console.warn(`unknown operation_type: ${operation_type}`);
        }
    }


    // FIX-ME: Testing orig jsMind:
    if (jm.show_async) {
        await jm.show_async(mind);
    } else {
        jm.show(mind);
    }
    return jm;
}

let topic4undoRedo;
export function getTopic4undoRedo() {
    if (topic4undoRedo == undefined) {
        console.error(`topic4undoRedo == undefined`);
        return "NO-NODE-TOPIC";
    }
    const topic = topic4undoRedo;
    topic4undoRedo = undefined;
    return topic;
}
export function setTopic4undoRedo(topic) {
    // if (topic4undoRedo != undefined) throw Error(`topic4undoRedo != undefined`);
    topic4undoRedo = topic;
}
export async function pageSetup() {
    checkParamNames();

    // const sharedParam = new URLSearchParams(location.search).get("share");
    // const searchParams = new URLSearchParams(location.search);
    // const sharedParam = searchParams.get("share");
    // console.log({ sharedParam });
    const searchParams = new URLSearchParams(location.search);
    const sharepostParam = searchParams.get("sharepost");
    console.log({ sharepostParam });
    if (sharepostParam != null) {
        // const sp = new URLSearchParams(sharedParam);
        const spTitle = searchParams.get("title");
        const spText = searchParams.get("text");

        // const btnDownloadShared = modMdc.mkMDCiconButton("edit_arrow_down", "Save to your device", 40);
        const btnDownloadShared = modMdc.mkMDCiconButton("info", "Show info about this mindmap", 40);
        btnDownloadShared.style = ` border-radius: 50%; background-color: #fff4; `;
        btnDownloadShared.addEventListener("click", async evt => {
            evt.stopPropagation();
            if (spTitle == null) {
                debugger; // eslint-disable-line no-debugger
                throw Error("spTitle is null");
            }
            const m = spTitle.match(/"(.*?)"/);
            const mmTitle = m ? m[1] : spTitle;
            const mmDesc = spText;
            const divInfoShared = mkElt("div", { class: "mdc-card" }, [
                mkElt("b", { style: "font-size:1.2em" }, "Origin:"),
                mkElt("b", undefined, [
                    mkElt("i", undefined, "Title: "),
                    mmTitle
                ]),
                mkElt("div", undefined, [
                    mkElt("i", undefined, "Description: "),
                    mmDesc
                ])
            ]);
            divInfoShared.style.padding = "10px";

            const btnSave = modMdc.mkMDCbutton("Save", "raised");
            const divSave = mkElt("p", undefined, [
                btnSave
            ]);

            btnSave.addEventListener("click", async evt => {
                evt.stopPropagation();
                const eltTell = document.getElementById("shared-marker");
                const seconds = 1.2;
                if (!eltTell) {
                    debugger; // eslint-disable-line no-debugger
                    throw Error("Did not get shared-marker");
                }
                eltTell.style.opacity = "1";
                eltTell.style.transition = `opacity ${seconds}s`;
                eltTell.style.opacity = "0";
                // ourdisp requestsave
                delete jmDisplayed.isSavedBookmark;
                modMMhelpers.checkIsMMformatJmdisplayed(jmDisplayed, "Save shared");
                const mmKey = modMMhelpers.getNextMindmapKey();
                // jmDisplayed.meta.name = mmKey;
                debugger; // eslint-disable-line no-debugger
                const objDataMind = jmDisplayed.get_data("node_array");
                objDataMind.meta.name = mmKey;
                objDataMind.key = mmKey;
                /*
                const saved = modMMhelpers.DBrequestSaveMindmapPlusUndoRedo(jmDisplayed, "Saved SHARED");
                if (saved != true) {
                    divSave.textContent = "Some error, not saved";
                    divSave.style.color = "red";
                    return;
                }
                */

                const dbMindmaps = await importFc4i("db-mindmaps");
                // const res = await dbMindmaps.DBsetMindmap(keyName, objMindData, lastUpdated, lastSynced, privacy);
                // const objMindData = jmDisplayed.get_data("node_array");
                const res = await dbMindmaps.DBsetMindmap(mmKey, objDataMind);
                console.log({ res });
                if (res != mmKey) {
                    debugger; 
                    throw Error(`res (${res}) != mmKey (${mmKey})`)
                }
                debugger;
                const urlSavedMindmap = modMMhelpers.getMindmapURL(mmKey);
                history.replaceState(null, "dummy", urlSavedMindmap.href);

                divSave.textContent = "Saved to your device";
            });

            const body = mkElt("div", undefined, [
                mkElt("h2", undefined, "Linked mindmap"),
                divInfoShared,
                divSave
            ]);
            modMdc.mkMDCdialogAlert(body, "Close");
            /*
        console.log({ ans });
        if (ans) {
            const eltTell = document.getElementById("shared-marker");
            const seconds = 1.2;
            if (!eltTell) {
                throw Error("Did not get shared-marker");
            }
            eltTell.style.opacity = "1";
            eltTell.style.transition = `opacity ${seconds}s`;
            eltTell.style.opacity = "0";
            delete jmDisplayed.isSavedBookmark;
            modMMhelpers.checkIsMMformatJmdisplayed(jmDisplayed, "Save shared");
            const mmKey = modMMhelpers.getNextMindmapKey();
            const objDataMind = jmDisplayed.get_data("node_array");
            objDataMind.meta.name = mmKey;
            modMMhelpers.DBrequestSaveMindmapPlusUndoRedo(jmDisplayed, "Saved SHARED");
            const urlSavedMindmap = modMMhelpers.getMindmapURL(mmKey);
            history.replaceState(null, "dummy", urlSavedMindmap.href);
        }
            */
        });
        const addShareMarker = () => {
            if (spTitle == null) throw Error("spTitle == null");
            const pos = spTitle.indexOf('"');
            const txtLinked = spTitle.slice(0, pos-1);
            const divInfo = mkElt("div", undefined,
                // mkElt("b", undefined, `${spTitle}: `),
                mkElt("b", undefined, `${txtLinked} `),
                spText,
            )
            divInfo.style = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            `;
            const eltTellShared = mkElt("div", undefined, [
                divInfo,
                btnDownloadShared
            ]);
            eltTellShared.style = `
                position: fixed;
                bottom: 0px;
                left: 0px;
                min-height: 50px;
                min-width: 100px;
                max-width: 270px;
                display: flex;
                gap: 10px;
                padding: 10px;
                z-index: 99999;
                background: red;
            `;
            eltTellShared.id = "shared-marker";
            document.body.appendChild(eltTellShared);
        }
        // debugger;
        const modShare = await importFc4i("mm4i-share")
        console.log({ modShare });
        const mindmapData = await modShare.getSharedData(sharepostParam);
        console.log({ mindmapData })

        const divInfoSp = mkElt("p", undefined, [
            mkElt("div", undefined, [
                mkElt("i", undefined, "Title: "), spTitle
            ]),
            mkElt("div", undefined, [
                mkElt("i", undefined, "Text: "), spText
            ]),
        ]);
        if (!mindmapData) {
            const body = mkElt("div", undefined, [
                mkElt("h2", undefined, "Could not find linked mindmap"),
                mkElt("p", undefined, "It have probably been deleted."),
                divInfoSp
            ])
            await modMdc.mkMDCdialogConfirm(body, "Close");
            // debugger;
            dialogMindMaps();
            return;
        } else {
            addShareMarker();
            // debugger;
            const objMS = mindmapData.objMindStored;
            objMS.key = "SHARED";
            modMMhelpers.checkIsFullMindmapDisplayState(mindmapData, "SHARED");
            // const jm = await displayOurMindmap(objMindData);
            const jm = await displayOurMindmap(objMS);
            jm.isSavedBookmark = true; // FIX-ME:
            // modJsmindDraggable.setOurJm(jm);

            const objOther = mindmapData.other;
            delete objOther.moved;
            // debugger;
            modMMhelpers.applyDisplayStateOther(objOther, jm);
            // return;
            // debugger;
        }
    }

    let mindmapKey = new URLSearchParams(location.search).get("mindmap");
    let mindInStoredFormat;
    if (typeof mindmapKey === "string") {
        if (mindmapKey.length === 0) {
            alert("Parameter mindmapname should have a value (key/name of a mindmap)");
            mindmapKey = null;
        } else {
            mindInStoredFormat = await modMMhelpers.getMindmap(mindmapKey);
            if (!mindInStoredFormat) {
                alert(`Could not find mindmap with key=="${mindmapKey}"`);
                mindmapKey = null;
            }
        }
    }
    // const nodeHits = new URLSearchParams(location.search).get("nodehits");
    // const nodeProvider = new URLSearchParams(location.search).get("provider");

    const jsMindContainer = document.getElementById(idDivJsmindContainer);
    if (!jsMindContainer) throw Error(`Could not find ${idDivJsmindContainer}`);

    function clearSearchHits() {
        if (!jsMindContainer) throw Error(`Could not find ${idDivJsmindContainer}`);
        const nodeEltArray = [...jsMindContainer.querySelectorAll("jmnode[nodeid]")];
        nodeEltArray.forEach(n => n.classList.remove("jsmind-hit"));
    }




    // Use this??? copy canvas https://jsfiddle.net/lborgman/5L1bfhow/3/

    const btnDebugLogClear = mkElt("button", undefined, "Clear");
    btnDebugLogClear.addEventListener("click", () => {
        divDebugLogLog.textContent = "";
    });
    const divDebugLogHeader = mkElt("div", { id: "jsmind-test-debug-header" }, [
        "JSMIND DEBUG LOG",
        btnDebugLogClear
    ]);
    const divDebugLogLog = mkElt("div", { id: "jsmind-test-div-debug-log-log" });
    const divDebugLog = mkElt("div", { id: "jsmind-test-div-debug-log" }, [
        divDebugLogHeader,
        divDebugLogLog
    ]);
    let btnJsmindDebug;
    const idBtnJsmindDebug = "jsmind-ednode-debug-button";

    /*
    async function mkNetGraphFAB4mindmap() {
        // eltJmnode
        function mkNetwGraphURL() {
            // alert("not ready");
            const url = new URL("/nwg/netwgraph.html", location.href);
            const sp = new URLSearchParams(location.search);
            const mm = sp.get("mindmap");
            if (mm) { url.searchParams.set("mindmap", mm); }
            return url.href;
        }
        async function mkFabNetwG() {
            const modMdc = await importFc4i("util-mdc");
            const iconHub = modMdc.mkMDCicon("hub");

            const aIconHub = mkElt("a", { href: "/nwg/netwgraph.html" }, iconHub);
            aIconHub.addEventListener("click", () => {
                // aIconHub.href = mkTestNetwGraphURL();
                aIconHub.href = mkNetwGraphURL();
            });
            aIconHub.addEventListener("contextmenu", () => {
                aIconHub.href = mkNetwGraphURL();
            });

            aIconHub.style.lineHeight = "1rem";
            const titleNetwg = "Investigate as a graphical network";
            const fabNetwG = modMdc.mkMDCfab(aIconHub, titleNetwg, true)
            fabNetwG.style = `
                background-color: goldenrod;
                position: absolute;
                top: 2px;
                right: 20px;
                z-index: 10;
            `;
            return fabNetwG;
        }
        const fabNetwG = await mkFabNetwG();
        return fabNetwG;
    }
    */


    let btnJsmindMenu;
    let btnJsmindSearch;

    const inpSearch = mkElt("input", { type: "search", placeholder: "Search nodes", id: "jsmind-inp-node-search" });
    const tfSearch = inpSearch;

    const divSearchInputs = mkElt("div", { id: "jsmind-search-inputs" }, [
        tfSearch // , eltProvHits
    ]);
    divSearchInputs.classList.add("jsmind-actions");
    divSearchInputs.classList.add("mdc-card");

    const divHits = mkElt("div", { id: idDivHits, class: "NOmdc-card" });
    divHits.classList.add("display-none");
    divSearchInputs.appendChild(divHits);

    addJsmindButtons();

    async function addJsmindButtons() {
        if (!jsMindContainer) { throw Error(`jsMindContainer is null`) };
        btnJsmindDebug = modMdc.mkMDCiconButton("adb", "Debug log", 40);
        btnJsmindDebug.id = idBtnJsmindDebug;
        btnJsmindDebug.classList.add("test-item");
        btnJsmindDebug.classList.add("jsmind-actions");
        // jsMindContainer.appendChild(btnJsmindDebug);
        btnJsmindDebug.addEventListener("click", evt => {
            console.log("btnJsmindMenu");
            evt.stopPropagation();
            jsMindContainer.classList.toggle("show-jsmind-debug");
        });

        // FIX-ME:
        // const nwgFAB = await mkNetGraphFAB4mindmap();
        // jsMindContainer.appendChild(nwgFAB);


        btnJsmindMenu = modMdc.mkMDCiconButton("menu", "Open menu", 40);
        btnJsmindMenu.id = "mm4i-menu-button";
        btnJsmindMenu.classList.add("jsmind-actions");
        jsMindContainer.appendChild(btnJsmindMenu);
        btnJsmindMenu.addEventListener("click", evt => {
            // console.log("btnJsmindMenu");
            evt.stopPropagation();
            // displayContextMenu(btnJsmindMenu);
            togglePageMenu();
        });
        btnJsmindSearch = modMdc.mkMDCiconButton("search", "Search", 40);
        btnJsmindSearch.id = "jsmind-search-button";
        btnJsmindSearch.classList.add("jsmind-actions");
        jsMindContainer.appendChild(divJsmindSearch);
        btnJsmindSearch.addEventListener("click", async evt => {
            // console.log("btnJsmindSearch");
            evt.stopPropagation();
            toggleSearchInputs();
            const eltJmnodes = getJmnodesFromJm(jmDisplayed);
            eltJmnodes.classList.remove("showing-hits");
            clearSearchHits();
            await modMMhelpers.removeAllSpan4marks();
            if (visibleSearchInputs()) {
                const divInputs = document.getElementById("jsmind-search-inputs");
                if (!divInputs) { throw Error(`Could not find #jsmind-search-inputs`); }
                // if (divInputs.classList.contains("showing-provider-hits")) {
                // setProviderNodeHits();
                // } else {
                inpSearch.focus();
                const strSearch = inpSearch.value.trim();
                if (strSearch.length > 0) {
                    restartJsmindSearch();
                }
                // }
            } else {
                const divHits = document.getElementById(idDivHits);
                divHits?.classList.add("display-none");
            }
        });

        const btnJsmindStair = modMdc.mkMDCiconButton("route", "Stair paths", 40);
        btnJsmindStair.id = "jsmind-stair-button";
        btnJsmindStair.addEventListener("click", errorHandlerAsyncEvent(async evt => {
            evt.stopPropagation();
            const modStairs = await importFc4i("stairs");
            modStairs.dialogStairs();
        }));

        // const btnSyncMm = modMdc.mkMDCiconButton("sync_alt", "Sync mindmaps to your devices", 40);
        const btnSyncMm = modMdc.mkMDCiconButton("p2p", "Sync mindmap devices", 40);
        btnSyncMm.id = "btn-sync";
        btnSyncMm.addEventListener("click", async evt => {
            evt.stopPropagation();
            const modMm4iReplication = await importFc4i("mm4i-replication");
            modMm4iReplication.replicationDialog();
        });

        const btnShareMm = modMdc.mkMDCiconButton("share", "Share mindmap", 40);
        btnShareMm.id = "btn-sync";
        btnShareMm.addEventListener("click", async evt => {
            evt.stopPropagation();
            const renderer = await getCustomRenderer();
            const jsonSharedMindmap = await renderer.getFullMindmapDisplayState();
            const topic = jsonSharedMindmap.objMindStored.data[0].topic;
            // debugger;
            const txtDesc = jsonSharedMindmap.objMindStored.data[0].shapeEtc.notes || "(no notes)";

            const taDesc = modMdc.mkMDCtextFieldTextarea("shared-desc-textarea");
            const tfDesc = modMdc.mkMDCtextareaField("Description", taDesc, txtDesc);
            const body = mkElt("div", undefined, [
                mkElt("h2", undefined, `Share mindmap "${topic}"`),
                tfDesc,
            ]);
            const ans = await modMdc.mkMDCdialogConfirm(body, "Share", "Cancel");
            if (!ans) {
                return;
            }


            const modShare = await importFc4i("mm4i-share");
            console.log({ modShare });

            const shareTitle = `Linked mindmap "${topic}"`;
            const shareText = taDesc.value;
            modShare.saveDataToShare(jsonSharedMindmap, shareTitle, shareText);
        });

        divJsmindSearch.appendChild(btnJsmindSearch);
        divJsmindSearch.appendChild(btnJsmindStair);
        divJsmindSearch.appendChild(btnSyncMm);
        divJsmindSearch.appendChild(btnShareMm);
        btnSyncMm.style.borderLeft = "1px solid rgb(0,0,0,0.4)";


        /*
        const eltTellProvider = mkElt("span");
        eltTellProvider.id = "elt-tell-provider";
        if (nodeProvider) {
            const render = await modCustRend.getOurCustomRenderer();
            const src = render.getLinkRendererImage(nodeProvider);
            const eltImg = mkElt("img", { src });
            eltImg.style.height = "30px";
            const span = mkElt("span", undefined, [eltImg, " link"]);
            eltTellProvider.appendChild(span);
        } else {
            eltTellProvider.appendChild(mkElt("span", undefined, "dummy (no provider)"));
        }
        */
        // eltProvHits.textContent = "";
        // eltProvHits.appendChild(eltTellProvider);
        // eltProvHits.appendChild(btnCloseProvHits);

        inpSearch.addEventListener("input", () => {
            restartJsmindSearch();
        })
        divJsmindSearch.appendChild(divSearchInputs);
    }
    // @ts-ignore
    function toggleSearchInputs() { jsMindContainer.classList.toggle("display-jsmind-search"); }
    // @ts-ignore
    function visibleSearchInputs() { return jsMindContainer.classList.contains("display-jsmind-search"); }
    const restartJsmindSearch = (() => {
        let tmr;
        return async () => {
            await modMMhelpers.removeAllSpan4marks();
            clearTimeout(tmr);
            tmr = setTimeout(() => doJsmindSearch(), 1000);
        }
    })();
    function doJsmindSearch() {
        const strSearch = inpSearch.value.trim();
        if (strSearch == "") {
            const eltJmnodes = getJmnodesFromJm(jmDisplayed);
            eltJmnodes.classList.remove("showing-hits");
            clearSearchHits();
            const divHits = document.getElementById(idDivHits);
            divHits?.classList.add("display-none");
            return;
        }
        jsmindSearchNodes(strSearch);
    }

    // https://github.com/hizzgdev/jsmind/blob/master/docs/en/1.usage.md#12-data-format
    function checkParamNames() {
        const sp = new URLSearchParams(location.search);
        if (sp.size == 0) return true;
        const arrParNames = [...sp.keys()].sort();
        // FIX-ME: text and title should only be allowed if share.
        const allowed = ["mindmap", "nodehits", "cachemodules", "sharepost", "token", "text", "title"];
        allowed.push("fbclid"); // FIX-ME: why???
        for (const p of arrParNames) {
            if (!allowed.includes(p)) {
                debugger; // eslint-disable-line no-debugger
                alert(`Invalid parameter: "${p}"`);
                return false;
            }
        }
        return true;
    }

    if (mindmapKey) {
        if (mindInStoredFormat) {
            modMMhelpers.checkIsMMformatStored(mindInStoredFormat, "pageSetup");
            window["current-mindmapKey"] = mindmapKey;
            modMMhelpers.getMindmapPrivacy(mindmapKey).then(privacy => {
                // console.log({ privacy });
                const eltJsMindContainer = document.getElementById("jsmind_container");
                if (!eltJsMindContainer) throw Error("Could not find #jsmind_container");
                const cl = eltJsMindContainer.classList;
                switch (privacy) {
                    case "shared":
                        cl.add("mindmap-is-shareable");
                        break;
                    case "private":
                        cl.remove("mindmap-is-shareable");
                        break;
                    default:
                        throw Error(`Bad privacy value: "${privacy}"`);
                }
            });
        }
    }
    if (!mindInStoredFormat && !sharepostParam) {
        if (funMindmapsDialog) {
            funMindmapsDialog();
        } else {
            const dbMindmaps = await importFc4i("db-mindmaps");
            const arrMaps = await dbMindmaps.DBgetAllMindmaps()
            if (arrMaps.length == 0) {
                await modMMhelpers.createAndShowNewMindmap();
            } else {
                // dialogMindMaps(location.pathname);
                const eltInfo = !mindmapKey ? undefined
                    : mkElt("p", undefined, [
                        "Could not find mindmap key==",
                        mkElt("i", undefined, mindmapKey)
                    ])
                dialogMindMaps(eltInfo);
            }
        }
        return;
    }





    const nowBefore = Date.now();

    if (!sharepostParam) {
        const jm = await displayOurMindmap(mindInStoredFormat);
        modMMhelpers.startUndoRedo(mindmapKey, jm);
    }













    const nowAfter = Date.now();
    const msDisplay = nowAfter - nowBefore;
    if (msDisplay > 100) { console.log(`*** display MindMap, custom rendering: ${msDisplay} ms`); }


    switchDragTouchAccWay(theDragTouchAccWay);



    async function setNodeHitsFromArray(arrIdHits) {
        const eltJmnodes = getJmnodesFromJm(jmDisplayed);
        eltJmnodes.classList.add("showing-hits");
        /*
        if (hitType == "provider") {
            // @ts-ignore
            jsMindContainer.classList.add("display-jsmind-search");
            const divInputs = document.getElementById("jsmind-search-inputs");
            if (!divInputs) { throw Error(`Could not find #jsmind-search-inputs`); }
            divInputs.classList.add("showing-provider-hits");
        }
        */


        console.log({ arrHits: arrIdHits });



        arrIdHits.forEach(id => {
            const node = jmDisplayed.get_node(id);
            const eltJmnode = jsMind.my_get_DOM_element_from_node(node);
            modMMhelpers.addSpan4Mark(eltJmnode, "hit-mark", "search_check_2"); // FIX-ME: move
            eltJmnode.classList.add("jsmind-hit");
            setTimeout(() => {
                modMMhelpers.markPathToRoot(eltJmnode, "hit-mark-path", jmDisplayed);
            }, 1000);
        });

        if (arrIdHits.length == 0) {
            divHits.textContent = "No search hits";
            return;
        }
        const btnCurr = await modMdc.mkMDCbutton("wait");
        btnCurr.addEventListener("click", () => {
            const num = getBtnCurrNum();
            selectHit(num);
        })
        setHitTo(1);
        async function selectHit(num) {
            const node_hit_id = arrIdHits[num - 1];
            const node_hit = jmDisplayed.get_node(node_hit_id);
            const eltJmnodeHit = jsMind.my_get_DOM_element_from_node(node_hit);
            await modMMhelpers.ensureNodeVisible(eltJmnodeHit, jmDisplayed);
            setTimeout(() => { jmDisplayed.select_node(node_hit_id); }, 200);
        }
        function setHitTo(num) {
            setBtnCurrNum(num);
            selectHit(num);
        }

        function getBtnCurrNum() {
            const txt = btnCurr.textContent;
            const num = parseInt(txt);
            return num;
        }
        function setBtnCurrNum(num) {
            const eltTxt = btnCurr.querySelector(".mdc-button__label");
            eltTxt.textContent = `${num} (${arrIdHits.length})`;
            btnCurr.title = `Select hit ${num}`;
        }
        const btnPrev = await modMdc.mkMDCbutton("<");
        btnPrev.title = "Select previous hit";
        btnPrev.addEventListener("click", () => {
            let nextNum = getBtnCurrNum() - 1;
            if (nextNum < 1) nextNum = arrIdHits.length;
            setHitTo(nextNum);
        });
        const btnNext = await modMdc.mkMDCbutton(">");
        btnNext.title = "Select next hit";
        btnNext.addEventListener("click", () => {
            let nextNum = getBtnCurrNum() + 1;
            if (nextNum > arrIdHits.length) nextNum = 1;
            setHitTo(nextNum);
        });
        const eltInfo = mkElt("span", undefined, [
            "Hits: ", btnCurr,
        ])
        const divHitsInner = mkElt("div", undefined, [
            eltInfo, btnPrev, btnNext
        ]);
        divHits.textContent = "";
        divHits.appendChild(divHitsInner);
        // divSearchInputs.appendChild(divHits);
        divHits.classList.remove("display-none");
    }



    jsMindContainer.appendChild(divDebugLog);

    async function mkDivContextMenu() {
        const div = modMdc.mkMDCmenuDiv();
        div.classList.add("is-menu-div");
        // document.body.appendChild(div);
        // divContextMenu.id = idContextMenu;
        div.classList.add("mm4i-context-menu");
        return div;
    }
    let highestNodeId = 0;
    jmDisplayed.enable_edit();
    const jmData = jmDisplayed.get_data("node_array");
    jmData.data.forEach(entry => {
        // if (entry.id === "root") return;
        if (!Number.isInteger(entry.id)) return;
        highestNodeId = Math.max(+entry.id, highestNodeId);
    });
    function getNextNodeId() { return ++highestNodeId; }

    function hideContextMenuOnEvent(evt) {
        if (!divContextMenu) return;
        if (!targetIsJmnode(evt) && !divContextMenu.contains(evt.target)) hideContextMenu();
    }

    if (!jsMindContainer) throw Error("jsMindContainer is null");
    // These bubbles up:
    jsMindContainer.addEventListener("pointerdown", evt => hideContextMenuOnEvent(evt));
    let toldChangesNotSaved = false;
    jsMindContainer.addEventListener("click", evt => {
        // evt.stopPropagation();
        // evt.preventDefault();
        const target = evt.target;
        if (!(target instanceof HTMLElement)) throw Error("target is not HTMLElement");
        if (!target) return;
        const eltExpander = target.closest("jmexpander");
        if (!eltExpander) return;
        const strNodeId = eltExpander.getAttribute("nodeid");
        if (null == strNodeId) throw Error("jmexpander attribute nodeid is null");
        const nodeId = parseInt(strNodeId);
        jmDisplayed.toggle_node(nodeId);
        // modMMhelpers.DBrequestSaveMindmapPlusUndoRedo(this.THEjmDisplayed, "Edit mindmap description");
        if (jmDisplayed.isSavedBookmark) {
            if (!toldChangesNotSaved) {
                modMdc.mkMDCsnackbar("Changes to named/shared bookmarks are not stored");
            }
            toldChangesNotSaved = true;
            return;
        }
        const node = jmDisplayed.mind.nodes[nodeId];
        const topic = node.topic;
        const theChange = !node.expanded ? "Collapse" : "Expand";
        modMMhelpers.DBrequestSaveMindmapPlusUndoRedo(jmDisplayed, `${theChange} ${topic}`);
    });

    function targetIsJmnode(evt) {
        const targ = evt.target;
        const jmnode = targ.closest("jmnode");
        return jmnode;
    }




    function markMenuItemOnClick(evt) {
        const li = evt.target.closest("li");
        console.log(li);
    }
    async function displayPageMenu() {
        pageMenu = await mkPageMenu();
        pageMenu.addEventListener("click", markMenuItemOnClick);
        const btnMenu = document.getElementById("mm4i-menu-button");
        displayMenuForButton(pageMenu, btnMenu);
    }
    function togglePageMenu() {
        if (!pageMenu?.parentElement) {
            displayPageMenu();
        } else {
            hidePageMenu();
        }
    }
    function displayMenuForButton(divMenu, btnMenu) {
        const compBtnStyle = getComputedStyle(btnMenu);
        document.body.appendChild(divMenu);
        const menuStyle = divMenu.style;
        menuStyle.opacity = 0;
        menuStyle.display = "block";
        menuStyle.left = compBtnStyle.left;
        menuStyle.right = compBtnStyle.right;
        const btnHeight = parseFloat(compBtnStyle.height);
        const btnTop = parseFloat(compBtnStyle.top);
        menuStyle.top = `${btnTop + btnHeight}px`;
        const compMenuStyle = getComputedStyle(divMenu);
        const right = parseInt(compMenuStyle.right);
        if (right <= 0) divMenu.style.left = parseInt(divMenu.style.left) + right - 30;
        const bottom = parseInt(compMenuStyle.bottom);
        if (bottom < 0) divMenu.style.top = parseInt(divMenu.style.top) + bottom;
        divMenu.style.opacity = 1;
    }


    async function mkPageMenu() {
        let toJmDisplayed;
        try {
            toJmDisplayed = typeof jmDisplayed;
        } catch (err) {
            console.log({ err });
        }
        // console.log({ toJmDisplayed });
        const selected_node = toJmDisplayed && jmDisplayed?.get_selected_node();
        // Save node topic for undo/redo:
        // nodeTopic4undoRedo = selected_node?.topic;
        if (selected_node) setTopic4undoRedo(selected_node.topic);

        function getSelected_node() {
            if (!selected_node) {
                modMdc.mkMDCdialogAlert("No selected node");
                return false;
            }
            return selected_node;
        }
        function markIfNoSelected(li) {
            if (selected_node) return;
            li.setAttribute("inert", "");
        }
        function markIfNoMother(li) {
            if (selected_node?.parent) return;
            li.setAttribute("inert", "");
        }


        // https://html2canvas.hertzen.com/getting-started.html

        const createMindMap = () => {
            // modMMhelpers.createAndShowNewMindmap("./mm4i.html");
            modMMhelpers.createAndShowNewMindmap();
        }
        const liCreateMindmap = mkMenuItem("Create Mindmap", createMindMap);

        const liEditMindmap = mkMenuItem("Edit Mindmap", dialogEditMindmap, "Dblclick");
        if (!document.querySelector("jmnode")) { liEditMindmap.setAttribute("inert", ""); }

        const modStairs = await importFc4i("stairs");
        const liMindmapStairs = mkMenuItem("Mindmap stair paths", modStairs.dialogStairs);
        if (!document.querySelector("jmnode")) { liMindmapStairs.setAttribute("inert", ""); }

        const liMindmapsA = mkMenuItemA("List Mindmaps", "./mm4i.html");

        const liMindmapSync = mkMenuItem("Sync mindmap devices", (async () => {
            const modMm4iReplication = await importFc4i("mm4i-replication");
            modMm4iReplication.replicationDialog();
        }));

        // https://www.npmjs.com/package/pinch-zoom-js


        const liAddChild = mkMenuItem("Add child node", () => addNode("child"));
        markIfNoSelected(liAddChild);

        const liAddSibling = mkMenuItem("Add sibling node", () => addNode("brother"));
        markIfNoSelected(liAddSibling);
        markIfNoMother(liAddSibling);

        async function addNode(rel) {
            const selected_node = getSelected_node();
            if (!selected_node) { throw Error("No selected node"); }
            const jm = jmDisplayed;
            const new_node_id = getNextNodeId();
            let fromClipBoard;
            let fastTest = false;
            if (fastTest) {
                try {
                    fromClipBoard = await navigator.clipboard.readText();
                    if (fromClipBoard?.length > 0) {
                        fromClipBoard = fromClipBoard
                            .trim()
                            // @ts-ignore
                            .replaceAll(/\s/g, "x")
                            .slice(0, 20);
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
            const prefillTopic = fastTest ? fromClipBoard || `Node ${new_node_id}` : "";

            const inpTopic = modMdc.mkMDCtextFieldInput("inp-node-topic", "text");
            inpTopic.value = prefillTopic;
            const tfTopic = modMdc.mkMDCtextFieldOutlined("Topic", inpTopic);

            // const taNotes = mkElt("textarea");
            // taNotes.placeholder = "Enter preliminary notes here";
            const body = mkElt("div", undefined, [
                tfTopic,
                // taNotes
            ]);
            body.style = `
                display: flex;
                flex-direction: column;
                gap: 25px;
            `;




            const btnAddNode = modMdc.mkMDCdialogButton("Add", "add", true);
            const btnCancel = modMdc.mkMDCdialogButton("Cancel", "close");
            const eltActions = modMdc.mkMDCdialogActions([btnAddNode, btnCancel]);

            btnAddNode.disabled = true;
            inpTopic.addEventListener("input", () => { btnAddNode.disabled = inpTopic.value.trim() == ""; });

            const dlg = await modMdc.mkMDCdialog(body, eltActions);
            // function closeDialog() { dlg.mdc.close(); }
            const res = await new Promise((resolve) => {
                dlg.dom.addEventListener("MDCDialog:closed", errorHandlerAsyncEvent(async _evt => {
                    // const action = evt.detail.action;
                    const topic = inpTopic.value.trim();
                    const result = topic.length > 0;
                    // console.log({ action, result });
                    resolve(result);
                }));
            });
            // console.log({ res });
            if (!res) return;


            // if (!save) return;
            const new_node_topic = inpTopic.value.trim();
            setTopic4undoRedo(new_node_topic);
            // const notes = taNotes.value.trim();
            let new_node;
            switch (rel) {
                case "child":
                    new_node = await jm.add_node(selected_node, new_node_id, new_node_topic);
                    // console.log(`child .add_node(${selected_node.id}, ${new_node_id}, ${new_node_topic})`);
                    break;
                case "brother":
                    const mother_node = selected_node.parent;
                    if (!mother_node) {
                        modMdc.mkMDCdialogAlert("This node can't have siblings");
                    } else {
                        new_node = await jm.add_node(mother_node, new_node_id, new_node_topic);
                        console.log(`brother .add_node(${mother_node.id}, ${new_node_id}, ${new_node_topic})`);
                    }
                    break;
            }
            jm.select_node(new_node);
        }

        const liEditNode = mkMenuItem("Edit node", editNodeFromMenu, "Dblclick");
        markIfNoSelected(liEditNode);
        async function editNodeFromMenu() {
            const eltJmnode = document.querySelector("jmnode.selected");
            const renderer = await getCustomRenderer();
            renderer.editNodeDialog(eltJmnode);
        }

        const liDeleteNode = mkMenuItem("Delete node", deleteNode);
        markIfNoSelected(liDeleteNode);
        markIfNoMother(liDeleteNode);
        function deleteNode() {
            const selected_node = getSelected_node();
            if (selected_node) {
                const mother = selected_node.parent;
                if (!mother) {
                    modMdc.mkMDCdialogAlert("Root node can't be deleted");
                } else {
                    const jm = jmDisplayed;
                    jm.remove_node(selected_node);
                    jm.select_node(mother);
                }
            }
            hideContextMenu();
        }

        // has-notes-mark
        const liNodeNotes = mkMenuItem("Node's notes", editNodesNotes);
        markIfNoSelected(liNodeNotes);
        markIfNoMother(liNodeNotes);
        function editNodesNotes() {
            const eltJmnode = document.querySelector("jmnode.selected");
            editNotes(eltJmnode);
        }

        const liDragNodes = mkMenuItem("Moving nodes", dialogDraggingNodes)
        async function dialogDraggingNodes() {
            // const modJsEditCommon = await importFc4i("jsmind-edit-common");

            // FIX-ME: move class
            const settingPointHandle = window["settingPointHandle"];

            const phType = settingPointHandle.valueS;
            const pChoices = mkElt("p", { class: "mdc-card" });
            pChoices.style.padding = "20px";
            pChoices.style.backgroundColor = "rgba(255,255,255,0.3)";
            pChoices.style.display = "flex";
            pChoices.style.gap = "5px";

            pChoices.addEventListener("input", evt => {
                const target = evt.target;
                console.log("input", evt, target);
                settingPointHandle.value = target.value;
            })
            function makeChoice(value, txt) {
                const radChoice = mkElt("input", { type: "radio", name: "point-choice", value });
                if (phType == value) radChoice.checked = true;
                const lblChoice = mkElt("label", undefined, [radChoice, txt]);
                return mkElt("div", undefined, lblChoice);
            }
            pChoices.appendChild(makeChoice("detect-touch", "Default behavoir (detect mouse/touch)"));
            pChoices.appendChild(makeChoice("mouse", "Do as if mouse input"));
            pChoices.appendChild(makeChoice("touch", "Do as if touch input"));
            const body = mkElt("div", undefined, [
                mkElt("h2", undefined, "How to move nodes"),
                mkElt("p", undefined, `
                    To move nodes to new ancestors in the mindmap you drag them.
                    On a touch device this unfortunately means that you have your finger over
                    the node you are moving.
                    So it can be a bit difficult to see what you are doing.
                    `),
                mkElt("p", undefined, `
                    If MM4I discovers that you are using your finger it separate the point you move from
                    where your finger touches the screen.
                    This is easier to understand when you see it.
                    (I should make a video of this...)
                    `),
                pChoices,
            ]);
            modMdc.mkMDCdialogAlert(body, "Close");
        }

        const arrMenuEntries = [
            liAddChild,
            liAddSibling,
            liDeleteNode,
            liEditNode,
            liNodeNotes,
            liDragNodes,
            // liTestConvertToCustom,
            // liDragAccessibility,
            modMdc.mkMDCmenuItemSeparator(),
            liCreateMindmap,
            liEditMindmap,
            liMindmapStairs,
            liMindmapsA,
            liMindmapSync,
            modMdc.mkMDCmenuItemSeparator(),
        ];
        const arrMenuTestEntries = [
            // liTestSvgDrawLine,
            // liTestTabindex,
            // liTestDragBetween,
            // liTestPinchZoom,
            // liTestPointHandle,
        ];
        const arrMenuAll = [...arrMenuEntries, ...extraPageMenuItems, ...arrMenuTestEntries];

        const ulMenu = modMdc.mkMDCmenuUl(arrMenuAll);
        const divMenu = await mkDivContextMenu();
        divMenu.textContent = "";
        divMenu.appendChild(ulMenu);
        divMenu.id = "mm4i-page-menu";
        return divMenu;
    }


    // addScrollIntoViewOnSelect(jmDisplayed);
    addScrollIntoViewOnSelect();
    const modToastUIhelpers = await importFc4i("toast-ui-helpers");
    modToastUIhelpers.setupSearchNodes({
        searchNodeFun: jsmindSearchNodes,
        inpSearch,
        eltJsMindContainer: jsMindContainer
    });
    async function jsmindSearchNodes(strSearch) {
        // const res = modTools.searchByComplicatedString(strSearch, jsmindSearchNodes);
        const setNodes = modTools.searchByComplicatedString(strSearch, jsmindSearchWordNodes);
        console.warn(setNodes);
        // divHits
        if (typeof setNodes == "string") {
            const divHits = document.getElementById(idDivHits);
            if (!divHits) throw Error(`Could not find ${idDivHits}`);
            divHits.textContent = setNodes;
            return;
        }
        if (!(setNodes instanceof Set)) {
            debugger; // eslint-disable-line no-debugger
            throw Error(`Expected Set`);
        }
        // debugger;
        const arrIdHits = [...setNodes].map(n => jsMind.my_get_nodeID_from_DOM_element(n));
        setNodeHitsFromArray(arrIdHits);
    }
    function jsmindSearchWordNodes(strSearch) {
        // @ts-ignore
        const jmnodeEltArray = [...jsMindContainer.querySelectorAll("jmnode[nodeid]")];
        jmnodeEltArray.forEach(n => n.classList.remove("jsmind-hit"));
        if (strSearch.length === 0) return;
        const searchLower = strSearch.toLocaleLowerCase();
        // FIX-ME: words
        const nodes = jmDisplayed.data.jm.mind.nodes;
        const matchingNodes = jmnodeEltArray.filter(jmnode => {
            const topic = jmnode.textContent;
            // @ts-ignore
            const topicLower = topic.toLocaleLowerCase();
            if (topicLower.indexOf(searchLower) >= 0) return true;
            const node_id = getNodeIdFromDOMelt(jmnode);
            const node = nodes[node_id];
            const node_data = node.data;
            const notes = node_data.shapeEtc?.notes;
            if (notes) {
                const notesLower = notes.toLocaleLowerCase();
                if (notesLower.indexOf(searchLower) >= 0) return true;
            }
            return false;
        });
        return new Set(matchingNodes);
    }



    jmDisplayed.select_node(jmDisplayed.get_root());




    // const modMoveHelp = await importFc4i("move-help");



    // https://javascript.info/bezier-curve

    return mindmapKey;
}

function hasTouchEvents() {
    let hasTouch = false;
    try {
        document.createEvent("TouchEvent");
        hasTouch = true;
    } catch { }
    return hasTouch;

}

///////////////////////////////////////////////
// Utility functions.

// FIX-ME: Should be in jsmind core
function getDOMeltFromNode(node) { return jsMind.my_get_DOM_element_from_node(node); }
function getNodeIdFromDOMelt(elt) { return jsMind.my_get_nodeID_from_DOM_element(elt); }
// basicInit4jsmind();



function getJmnodesFromJm(jmDisplayed) {
    const root_node = jmDisplayed.get_root();
    const eltRoot = jsMind.my_get_DOM_element_from_node(root_node);
    const eltJmnodes = eltRoot.closest("jmnodes");
    return eltJmnodes;
}


function initialUpdateCustomAndShapes(jmDisplayed) {
    setTimeout(() => {
        addDebugLog("initialUpdateCustomAndShapes (in setTimeout fun)");
        const eltJmnodes = getJmnodesFromJm(jmDisplayed);
        [...eltJmnodes.getElementsByTagName("jmnode")].forEach(async eltJmnode => {
            const node_id = jsMind.my_get_nodeID_from_DOM_element(eltJmnode);
            if (!node_id) return; // Orig jsMind draggable shadow node
            if (node_id == 21) console.warn("node_id 21");
            const node = jmDisplayed.get_node(node_id);
            applyNodeShapeEtc(node, eltJmnode);
        });
    }, 500);
}








///////////////////////////////////////////////
// Custom rendering



export function getMatchesInCssRules(re) {
    const selectors = new Set();
    // const re = new RegExp('\\.' + pattern.replace(/([^\s])\*/, '$1[^ ]+'), 'g')
    for (let i = 0, len = document.styleSheets.length; i < len; i++) {
        const sheet = document.styleSheets[i];
        // console.log("sheet", sheet.href);
        let cssRules;
        try {
            cssRules = sheet.cssRules;
        } catch { }
        if (!cssRules) continue;
        for (let cssRule of cssRules) {
            if (!(cssRule instanceof CSSStyleRule)) { continue; }
            const selectorText = cssRule.selectorText;
            if (!selectorText) {
                // console.log("*** cssRule", cssRule);
            } else {
                // console.log("selectorText", selectorText);
                const m = cssRule.selectorText.match(re);
                if (m) {
                    // selectors.add(cssRule.selectorText);
                    selectors.add(m[1]);
                }
            }
        }
    }
    // console.log({ selectors, }, re);
    return [...selectors];
}






function addDebugLog(msg) {
    // const divDebugLogLog = mkElt("div", { id: "jsmind-test-div-debug-log-log" });
    const divDebugLogLog = document.getElementById("jsmind-test-div-debug-log-log");
    if (!divDebugLogLog) { return; }
    const prevRow = divDebugLogLog.lastElementChild;
    const prevMsg = prevRow?.firstElementChild?.textContent;
    if (prevRow && msg === prevMsg) {
        const eltCounter = prevRow.lastElementChild;
        if (!eltCounter) throw Error("Could not find eltCounter");
        // @ts-ignore
        const txtCounter = eltCounter.textContent.trim();
        let counter = (txtCounter == null || txtCounter === "") ? 1 : parseInt(txtCounter);
        eltCounter.textContent = `${++counter}`;
    } else {
        const entry = mkElt("span", { class: "debug-entry" }, msg);
        const counter = mkElt("span", { class: "debug-counter" }, " ");
        const row = mkElt("div", { class: "debug-row" }, [entry, counter])
        divDebugLogLog.appendChild(row);
    }
}

export function addScrollIntoViewOnSelect() {
    const jmDisp = jmDisplayed;
    jmDisp.add_event_listener(function (t) {
        if (t !== jsMind.event_type.select) return;
        scrollSelectedNodeIntoView();
    });
}
function scrollSelectedNodeIntoView() {
    if (!jmDisplayed) return;
    const n = jmDisplayed.get_selected_node();
    if (!n) return;
    scrollNodeIntoView(n);
}
const debounceScrollSelectedNodeIntoView = modTools.debounce(scrollSelectedNodeIntoView, 1000);
window.addEventListener("resize", () => debounceScrollSelectedNodeIntoView());


function scrollNodeIntoView(node) {
    const elt = jsMind.my_get_DOM_element_from_node(node);
    // FIX-ME: test .scrollIntoView - problem with vertical
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    const scrollOpt = {
        behavior: "smooth",
        block: "nearest"
    };
    // console.log({scrollOpt})
    elt.scrollIntoView(scrollOpt);


}


// async function dialogMindMaps(NOlinkMindmapsPage, info, arrMindmapsHits, provider) {
async function dialogMindMaps(info, arrMindmapsHits, provider) {
    // const toLink = typeof linkMindmapsPage;
    // if (toLink !== "string") throw Error(`urlHtml typeof should be string, got ${toLink}`);
    // const eltA = funMkEltLinkMindmap(topic, m.key, m.hits);
    const funMkEltLinkMindmap =
        // (topic, mKey, mHits, provider) => modMMhelpers.mkEltLinkMindmapA(linkMindmapsPage, topic, mKey, mHits, provider);
        (topic, mKey, mHits, provider) => modMMhelpers.mkEltLinkMindmapA(topic, mKey, mHits, provider);
    const dbMindmaps = await importFc4i("db-mindmaps");

    const showNew = !arrMindmapsHits;

    const eltTitle = mkElt("h2", undefined, "Mindmaps");
    info = info || "";

    arrMindmapsHits = arrMindmapsHits || await dbMindmaps.DBgetAllMindmaps();
    const arrToShow = arrMindmapsHits.map(mh => {
        const key = mh.key;
        const j = mh.jsmindmap;
        const hits = mh.hits;
        let topic;
        switch (j.format) {
            case "node_tree":
                topic = j.data.topic;
                break;
            case "node_array":
                topic = j.data[0].topic;
                break;
            case "freemind":
                const s = j.data;
                topic = s.match(/<node .*?TEXT="([^"]*)"/)[1];
                break;
            default:
                throw Error(`Unknown mindmap format: ${j.format}`);
        }
        return { key, topic, hits };
    });
    const arrPromLiMenu = arrToShow.map(async m => {
        // https://stackoverflow.com/questions/43033988/es6-decide-if-object-or-promise
        const topic = await Promise.resolve(m.topic);
        const btnDelete = await modMdc.mkMDCiconButton("delete_forever", "Delete mindmap");
        btnDelete.addEventListener("click", errorHandlerAsyncEvent(async evt => {
            evt.stopPropagation();
            const eltQdelete = mkElt("span", undefined, ["Delete ", mkElt("b", undefined, topic)]);
            const answerIsDelete = await modMdc.mkMDCdialogConfirm(eltQdelete);
            if (answerIsDelete) {
                console.log("*** del mm");
                const eltLi = btnDelete.closest("li");
                eltLi.style.backgroundColor = "red";
                eltLi.style.opacity = 1;
                eltLi.style.transition = "opacity 1s, height 1s, scale 1s";
                eltLi.style.opacity = 0;
                eltLi.style.height = 0;
                eltLi.style.scale = 0;
                const dbMindmaps = await importFc4i("db-mindmaps");
                dbMindmaps.DBremoveMindmap(m.key);
                setTimeout(() => eltLi.remove(), 1000);
            }
        }));

        const eltA = funMkEltLinkMindmap(topic, m.key, m.hits, provider);

        const eltMm = mkElt("div", undefined, [eltA, btnDelete]);
        const li = modMdc.mkMDCmenuItem(eltMm);
        li.addEventListener("click", () => {
            closeDialog();
        });
        return li;
    });
    const arrLiMenu = await Promise.all(arrPromLiMenu);
    if (showNew) {
        const liNew = modMdc.mkMDCmenuItem("New mindmap");
        liNew.addEventListener("click", errorHandlerAsyncEvent(async () => {
            // await modMMhelpers.createAndShowNewMindmap(linkMindmapsPage);
            await modMMhelpers.createAndShowNewMindmap();
        }));
        // arrLiMenu.push(liNew);

        // function mkMDCfab(eltIcon, title, mini, extendTitle)
        const eltIcon = modMdc.mkMDCicon("add");
        const btnFab = modMdc.mkMDCfab(eltIcon, "Create new mindmap", true);
        btnFab.addEventListener("click", errorHandlerAsyncEvent(async () => {
            await modMMhelpers.createAndShowNewMindmap();
        }));
        btnFab.style.marginLeft = "40px";
        eltTitle.appendChild(btnFab);
    }
    const ul = modMdc.mkMDCmenuUl(arrLiMenu);
    ul.classList.add("mindmap-list");
    const body = mkElt("div", { id: "div-dialog-mindmaps" }, [
        eltTitle,
        info,
        ul,
    ]);

    const btnClose = modMdc.mkMDCdialogButton("Close", "close", true);
    const eltActions = modMdc.mkMDCdialogActions([btnClose]);
    const dlg = await modMdc.mkMDCdialog(body, eltActions);
    function closeDialog() { dlg.mdc.close(); }
}

export async function dialogFindInMindMaps(key, provider) {
    const arrMindmapsHits = await modMMhelpers.getMindmapsHits(key);
    console.log({ arrMindmapsHits });
    if (arrMindmapsHits.length == 0) {
        modMdc.mkMDCdialogAlert("Not found in any mindmap");
        return;
    }
    const info = mkElt("p", undefined, "Found in these mindmaps:");
    // Fix-me: path??
    // dialogMindMaps("/mm4i.html", info, arrMindmapsHits, provider);
    dialogMindMaps(info, arrMindmapsHits, provider);
}





let eltBottomDebug;
let eltDebugState;
// let eltDebugCapture;
let eltDebugJssmAction;
let eltDebugJssmState;
let eltReqFrame;
function getBottomDebug() {
    if (eltBottomDebug) return eltBottomDebug;
    eltDebugState = mkElt("div"); eltDebugState.style.color = "gray";
    // eltDebugCapture = mkElt("div"); eltDebugCapture.style.color = "wheat";
    eltReqFrame = mkElt("div"); eltReqFrame.style.color = "light skyblue";
    eltDebugJssmAction = mkElt("div"); eltDebugJssmAction.style.color = "red";
    eltDebugJssmState = mkElt("div"); eltDebugJssmState.style.color = "orange";
    eltBottomDebug = mkElt("div", undefined, [
        eltDebugState,
        // eltDebugCapture,
        eltReqFrame,
        eltDebugJssmAction,
        eltDebugJssmState,
    ]);
    // @ts-ignore
    eltBottomDebug.style = `
                position: fixed;
                z-index: 100;
                width: 100vw;
                left: 0px;
                height: 30px;
                padding: 4px;
                background-color: black;
                bottom: 0;
                display: grid;
                grid-template-columns: 50px 1fr 1fr 1fr;
                cursor: default;
                pointer-events: all;
            `;
    document.body.appendChild(eltBottomDebug);

}
function getEltDebugState() {
    if (eltDebugState) return eltDebugState;
    getBottomDebug();
    return eltDebugState;
}

function getEltDebugJssmState() {
    if (eltDebugJssmState) return eltDebugJssmState;
    getBottomDebug();
    return eltDebugJssmState;
}
function getEltDebugJssmAction() {
    if (eltDebugJssmAction) return eltDebugJssmAction;
    getBottomDebug();
    return eltDebugJssmAction;
}


function showDebugState(msg) {
    (getEltDebugState()).textContent = msg;
}

const rainbow = ["red", "orange", "yellow", "greenyellow", "aqua", "indigo", "violet"];
let eltSmallGraph;
let markedDecl;
async function markLatestStates() {
    const decl = modMm4iFsm.fsmDeclaration;
    markedDecl = decl;
    markedDecl = markedDecl.replaceAll(/after (\d+) ms/g, "'$1ms'"); // FIX-ME:
    let iState = 0;
    const marked = new Set();
    for (let i = 0, len = stackLogFsm.length; i < len; i++) {
        const entry = stackLogFsm[i];
        if (modMm4iFsm.isState(entry)) {
            const state = entry;
            if (marked.has(state)) continue;
            const color = rainbow[iState];
            markState(state, color);
            // console.log("call markstate", i, state, color);
            iState++;
            marked.add(state);
        }
    }
    /**
     * 
     * @param {string} state 
     * @param {string} color 
     */
    function markState(state, color) {
        const strMarkState = `state ${state} : { background-color: ${color}; border-color: cyan; text-color: black; shape: ellipse; };`;
        const strReState = `state ${state}.*?\\};`;
        const reState = new RegExp(strReState, "ms");
        if (!reState.test(decl)) {
            markedDecl = `${markedDecl}\n\n${strMarkState}`;
        } else {
            markedDecl = markedDecl.replace(reState, strMarkState);
        }
    }
}


async function updateSmallGraph() {
    if (!eltSmallGraph) return;
    if (!eltSmallGraph.parentElement) return;
    await markLatestStates();
    const modJssmViz = await importFc4i("jssm-viz");
    const modViz = await importFc4i("viz-js");
    const dots = modJssmViz.fsl_to_dot(markedDecl);
    const dotsBetterEdge = dots.replace(/edge.*\]/, 'edge [fontsize=14; fontname="Open Sans"; fontcolor="red"]');
    const viz = await modViz.instance();
    const svg = viz.renderSVGElement(dotsBetterEdge);
    eltSmallGraph.textContent = "";
    const eltSvg = mkElt("div");
    eltSvg.style = `
        width: 100%;
        height: 100%;
    `;
    const cw = eltSmallGraph.clientWidth;
    // const ch = eltSmallGraph.clientHeight;
    const svgW = parseInt(svg.getAttribute("width"));
    const svgH = parseInt(svg.getAttribute("height"));
    // console.log({ svgW }, { svgH });
    const maxSvgHW = Math.max(svgH, svgW);
    const ratW = svgW / maxSvgHW;
    const ratH = svgH / maxSvgHW;
    // const newH = Math.floor(ch * ratH);
    const newH = Math.floor(cw * ratH);
    const newW = Math.floor(cw * ratW);
    svg.setAttribute("width", newW);
    svg.setAttribute("height", newH);
    eltSmallGraph.appendChild(svg);
}



const stackLogFsm = [];
window["showStackLogFsm"] = () => { console.log("showStackLogFsm", stackLogFsm); }
/**
 * 
 * @param {string} eventOrState 
 */
function addStackLogFsm(eventOrState) {
    stackLogFsm.unshift(eventOrState);
    stackLogFsm.length = Math.min(8, stackLogFsm.length);
    // console.warn("addStackLogFsm", eventOrState, stackLogFsm);
}

/**
 * 
 * @param {string} state 
 */
async function logJssmState(state) {
    if (!ourFsm) return;
    addStackLogFsm(state);
    modMm4iFsm.checkIsState(state)
    showDebugJssmState(state);
}

/**
 * 
 * @param {string} eventMsg 
 */
async function logJssmEvent(eventMsg) {
    const re = new RegExp(/,(.*)=>/);
    addStackLogFsm(eventMsg);
    const res = re.exec(eventMsg);
    if (!res) throw Error(`Could not parse ${eventMsg}`);
    const eventName = res[1];
    modMm4iFsm.checkIsEvent(eventName);
    showDebugJssmAction(eventName);
}


let isSmallGraph = true;
const widthSmall = "50vw";
function setSmallGraph() {
    isSmallGraph = true;
    eltSmallGraph.style.width = widthSmall;
    updateSmallGraph();
}
function setBigGraph() {
    isSmallGraph = false;
    const maxW = window.innerWidth - 10;
    const maxH = window.innerHeight - 35 - 5;
    const maxWH = Math.min(maxW, maxH);
    eltSmallGraph.style.width = `${maxWH}px`;
    updateSmallGraph();
}

async function showDebugJssmState(currState) {

    updateSmallGraph();

    const elt = getEltDebugJssmState();
    elt.textContent = currState;
    elt.style.cursor = "pointer";
    elt.style.pointerEvents = "all";
    elt.title = "Click to show fsm jssm";
    elt.asked = "no";
    elt.addEventListener("click", errorHandlerAsyncEvent(async evt => {
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();

        // debugger;
        switch (elt.asked) {
            case "no":
                {
                    const body = mkElt("div", undefined, [
                        mkElt("h2", undefined, "For developers only"),
                        mkElt("p", undefined, `
                        I used this for debugging during developing some diffucult part of this app.
                        It may be quite useful,
                        but you will probably not have any use of it if you are not
                        developing web pages with complicated inputs.
                        `),
                    ]);
                    const answer = await modMdc.mkMDCdialogConfirm(body, "Show", "Cancel");
                    // debugger;
                    elt.asked = answer;
                    if (!answer) {
                        elt.parentElement.style.display = "none";
                        return;
                    }
                }
                break;
            case false:
                return;
            case true:
                break;
            default:
                throw Error(`elt.asked was "${elt.asked}"`);
        }
        // markLatestStates();

        eltSmallGraph = eltSmallGraph || mkEltSmallGraph();

        if (eltSmallGraph.parentElement) {
            if (!isSmallGraph) {
                eltSmallGraph.remove();
            } else {
                setBigGraph();
            }
        } else {
            document.body.appendChild(eltSmallGraph);
            setSmallGraph();
        }
        return;


        function mkEltSmallGraph() {
            const elt = mkElt("div")
            elt.style = `
                width: 50vw;
                position: fixed;
                right: 5px;
                bottom: 35px;
                z-index: 100;

                pointer-events: none;
                NOcursor: pointer;

                outline: 1px solid red;
            `;
            elt.style.width = widthSmall;
            return elt;
        }



        openExternalViz();

        function openExternalViz() {

            const urlDotsViz = "http://localhost:8080/viz-dots-fsl.html";
            const url = new URL(urlDotsViz);

            // url.searchParams.set("fsl", decl);
            url.searchParams.set("fsl", markedDecl);

            winProxyDotsViz?.close();
            winProxyDotsViz = window.open(undefined, "fsm-graph");
            if (winProxyDotsViz) {
                winProxyDotsViz.location = url.href;
            } else {
                window.open(url.href, "fsm-graph");
            }
        }
    }));
}
let winProxyDotsViz;

export function showDebugJssmAction(msg) {
    // (getEltDebugJssmAction()).textContent = msg;
    const elt = getEltDebugJssmAction();
    // elt.textContent = "";
    // elt.appendChild(msg);
    elt.textContent = msg;
    updateSmallGraph();
}


/**
 * 
 * @param {object} event 
 */
function fsmEvent(event) {
    // console.log("fsmEvent event", event);
    const eventName = event.action || event;
    const eventFrom = event.from;
    const eventTo = event.to;

    // FIX-ME: move to fsm hook
    switch (eventTo) {
        case "n_Click":
        case "nr_Click":
            {
                const jmnode = event.data.eltJmnode;
                const node_id = getNodeIdFromDOMelt(jmnode);
                jmDisplayed.select_node(node_id);
            }
            break;
    }

    const msg = `${eventFrom},${eventName}=>${eventTo}`;
    logJssmEvent(msg);
}

if (modMm4iFsm != undefined) {
    setTimeout(async () => {
        logJssmState(ourFsm?.state());
    }, 1000);
}


const forCoverage = () => {
    return;
    // clearsearchits
}
forCoverage();
