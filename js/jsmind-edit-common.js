// @ts-check

const version = "0.1.001";
logConsoleHereIs(`here is jsmind-edit-common.js, module, ${version}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

// @ts-ignore
const importFc4i = window.importFc4i;
// @ts-ignore
const mkElt = window.mkElt;
// @ts-ignore
const jsMind = window.jsMind;
if (!jsMind) { throw Error("jsMind is not setup"); }

// Circular import
// const modCustRend = await importFc4i("jsmind-cust-rend");

// FIX-ME: comment out temporary!
const modMMhelpers = await importFc4i("mindmap-helpers");
const modMdc = await importFc4i("util-mdc");
const modTools = await importFc4i("toolsJs");
const modFsm = await importFc4i("mm4i-fsm");
window["fsm"] = modFsm.fsm;

modTools.addPosListeners();

let instMoveEltAtDragBorder;
class PointHandle {
    static sizePointHandle = 20;
    // static diffPointHandle = 60;

    static myStates = ["idle", "init", "dist", "move"];
    #myState;
    // #pointerType;
    #diffPointHandle = 1;

    /** @type {HTMLElement} */ #eltPointHandle;
    /** @type {HTMLElement} */ #jmnodesPointHandle;

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

        // const elt = this.#eltPointHandle;

        // const par = elt.parentElement;
        // console.log(">>>> set state", state, { elt, par });
        showDebugState(state);

        PointHandle.myStates.forEach(st => {
            this.#jmnodesPointHandle.classList.remove(`pointhandle-state-${st}`);
        })
        this.#jmnodesPointHandle.classList.add(`pointhandle-state-${state}`);
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

        // if (isTouch) { this.#diffPointHandle = 60; } else { this.#diffPointHandle = 0; }
        switch (pointerType) {
            case "mouse":
                this.#diffPointHandle = 0;
                // this.#diffPointHandle = 80; // FIX-ME:
                break;
            default:
                this.#diffPointHandle = 80;
        }

        if (!pointHandle.isState("idle")) throw Error(`Expected state "idle" but it was ${this.#state}`);
        this.#state = "init";

        // const savedPointerPos = modTools.getSavedPointerPos();
        const savedStartPointerPos = await modTools.getAndClearStartPointerPos();
        if (savedStartPointerPos.startX == undefined) {
            debugger;
            throw Error(".addPosListeners must be called earlier");
        }
        const startX = savedStartPointerPos.startX;
        const startY = savedStartPointerPos.startY;
        if (isNaN(startX) || isNaN(startY)) {
            debugger;
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

        // Avoid scaling:
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
        instMoveEltAtDragBorder.hideMover();
    }
    setupPointHandle() {
        console.log("setupPointHandle");
        /** @type {HTMLElement | null} */
        const elt = document.body.querySelector("jmnodes");
        if (!elt) throw Error("Could not find <jmnodes>");
        this.#jmnodesPointHandle = elt;
    }
    teardownPointHandle() {
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

            const ph = this.#eltPointHandle;
            const php = ph.parentElement;
            console.log("pointHandle", ph, "Parent", php);
            this.#state = "dist";
            // debugger;
        }
        // const diffX = posPointHandle.start.clientX - savedPointerPos.clientX;
        // const diffY = posPointHandle.start.clientY - savedPointerPos.clientY;
        const diffX = posPointHandle.start.clientX - savedPointerPos.clientX;
        const diffY = posPointHandle.start.clientY - savedPointerPos.clientY;
        if (isNaN(diffX) || isNaN(diffY)) {
            debugger;
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
            instMoveEltAtDragBorder.showMover();
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
/*
async function setCustomRenderer() {
    if (theCustomRenderer) return;
    const modCustRend = await importFc4i("jsmind-cust-rend");
    theCustomRenderer = await modCustRend.getOurCustomRenderer();
}
*/

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
    /*
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
    */

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
 * @param {PointerEvent} evt 
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
/*
function jmnodeFromPoint(cX, cY) {
    // console.log({ cX, cY });
    const eltsHere = document.elementsFromPoint(cX, cY);
    const eltJmnode = eltsHere.filter(e => { return e.tagName == "JMNODE"; })[0];
    return eltJmnode
}
*/
let eltOverJmnode;
let movePointHandleProblem = false;
let im = 0;
function movePointHandle() {
    if (movePointHandleProblem) return;
    const savedPointerPos = modTools.getSavedPointerPos();
    // const clientX = savedPointerPos.clientX;
    // const clientY = savedPointerPos.clientY;
    const clientX = savedPointerPos.clientX;
    const clientY = savedPointerPos.clientY;
    if (isNaN(clientX) || isNaN(clientY)) {
        debugger;
        throw Error(`Saved pos is ${clientX}, ${clientY}`);
    }
    if ((im++ % 40) == 0) console.log("mPH, clientX", clientX);
    try {
        const sp = pointHandle.element.style;
        // const left = clientX + posPointHandle.diffX - PointHandle.sizePointHandle / 2;
        const left = clientX + posPointHandle.diffX - PointHandle.sizePointHandle / 2;
        sp.left = `${left}px`;
        // const top = clientY + posPointHandle.diffY - PointHandle.sizePointHandle / 2;
        const top = clientY + posPointHandle.diffY - PointHandle.sizePointHandle / 2;
        sp.top = `${top}px`;
        modJsmindDraggable.hiHereIam(left, top);
        instMoveEltAtDragBorder.checkPointerPos(clientX, clientY)
    } catch (err) {
        console.error("movePointHandle", err);
        movePointHandleProblem = true;
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
    if (!shapeEtc) return;
    applyShapeEtc(shapeEtc, eltJmnode);
}
const jmnodesBgNames = [
    "bg-choice-none",
    "bg-choice-pattern",
    "bg-choice-color",
    "bg-choice-img-link",
    "bg-choice-img-clipboard",
];
export function checkJmnodesBgName(bgName) {
    if (!jmnodesBgNames.includes(bgName)) throw Error(`Not a jmnodesBgName: ${bgName}`);
}
export function mkJmnodeBgObj(bgName, bgValue) {
    const bgObj = { bgName, bgValue };
    // bgObj[bgName] = bgValue;
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
    if (bgKeys.length != 2) {
        throw Error(`bgKeys.length == ${bgKeys.length}, should be 2`);
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
            // debugger;
            if (!(bgValue instanceof Blob)) {
                errMsg = `${bgName} should be Blob`;
            } else {
                const bType = "image/webp"
                if (bgValue.type != bType) errMsg = `${bgName} should be ${bType}`;
            }
            break;
        default:
            if ("string" != tofVal)
                errMsg = `${bgName} should be "string", not ${tofVal}`;
    }
    if (errMsg) {
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
export async function applyShapeEtcBg(bgName, bgValue, eltJmnode) {
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
        case "bg-choice-img-link":
            const url = bgValue;
            eltBg.style.backgroundImage = `url("${url}")`;
            break;
        case "bg-choice-img-clipboard":
            let objectUrl;
            const blob = bgValue;
            objectUrl = URL.createObjectURL(blob);
            setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
            eltBg.style.backgroundImage = `url("${objectUrl}")`;
            break;
        default:
            throw Error(`Not impl yet: ${bgName}`)
    }

}
export async function applyShapeEtc(shapeEtc, eltJmnode) {
    const eltShape = eltJmnode.querySelector(".jmnode-bg");
    if (!eltShape) { throw Error("eltShape is null, no .jmnode-bg found"); }

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
        eltShape.style.filter = `drop-shadow(${x}px ${y}px ${b}px ${c})`;
        // FIX-ME: spread is currently not used, or???
        // const s = shadow.spread;
        // eltJmnode.style.filter = `drop-shadow(${x}px ${y}px ${b}px ${s}px ${c})`;
    }

    if (shapeEtc.background) {
        const bgObj = getShapeEtcBgObj(shapeEtc);
        // const bgEntries = Object.entries(bgObj);
        // const [bgName, bgValue] = bgEntries[0];
        // FIX-ME:
        applyShapeEtcBg(bgObj.bgName, bgObj.bgValue, eltJmnode);
    }

    // const clsIconButton = "icon-button-40";
    const clsIconButton = "icon-button-30";
    const oldAimg = eltJmnode.querySelector(`.jsmind-renderer-img`);
    oldAimg?.remove();
    const oldBtn = eltJmnode.querySelector(`.${clsIconButton}`);
    oldBtn?.remove();

    const notes = shapeEtc.notes;
    if (notes) {
        const reHttps = /(?:^|\W)(https:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()\[\]@:%_\+.~#?&\/=]*))(?:$|\s)/g;
        const m = [...notes.matchAll(reHttps)];
        // m.forEach(m2 => { const url = m2[1]; console.log(`In notes: ${url}`); });
        const hasLinks = m.length > 0;

        const icon = hasLinks ? "link" : "edit";
        const iconBtn = modMdc.mkMDCiconButton(icon, "Show notes");
        iconBtn.classList.add(clsIconButton);
        // const eltA3 = mkElt("a", { href: "https://svt.se" }, iconBtn);
        // eltA3.classList.add("jsmind-plain-link");
        // eltJmnode.appendChild(eltA3);

        // iconBtn.classList.add("jsmind-plain-link");
        // eltJmnode.appendChild(iconBtn);

        const eltSpan = mkElt("span", undefined, iconBtn);
        // eltSpan.classList.add("jsmind-plain-link");
        eltSpan.classList.add("has-notes-mark");
        eltJmnode.appendChild(eltSpan);

        eltSpan.addEventListener("click", errorHandlerAsyncEvent(async evt => {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            console.log("clicked eltSpan");
            const modCustRend = await importFc4i("jsmind-cust-rend");
            const renderer = await modCustRend.getOurCustomRenderer();
            // renderer.editNodeDialog(eltJmnode, true);
            renderer.editNotesDialog(eltJmnode);
        }));
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



let modJsmindDraggable;
// basicInit4jsmind();
export function basicInit4jsmind() {
    // console.log("jsMind", typeof jsMind);
    jsMind.my_get_DOM_element_from_node = (node) => { return node._data.view.element; }
    jsMind.my_get_nodeID_from_DOM_element = (elt) => {
        const tn = elt.tagName;
        if (tn !== "JMNODE") throw Error(`Not jmnode: <${tn}>`);
        const id = elt.getAttribute("nodeid");
        if (!id) throw Error("Could not find jmnode id");
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
function mkMenuItem(lbl, fun) {
    const li = modMdc.mkMDCmenuItem(lbl);
    li.addEventListener("click", evt => {
        evt.preventDefault();
        evt.stopPropagation();
        console.log(li);
        const ul = li.closest("ul");
        console.log(ul);
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
let divContextMenu;
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

export async function pageSetup() {
    const nodeHits = new URLSearchParams(location.search).get("nodehits");
    const nodeProvider = new URLSearchParams(location.search).get("provider");
    // let inpSearch;
    // let useCanvas = true;
    // setCustomRenderer();
    // let useCanvas = false;
    // useCanvas = confirm("Use canvas?");


    const idDivJsmindContainer = "jsmind_container";
    // const idDivJmnodesMirror = "jsmind-draggable-container4mirror";
    // let mirrorContainer;

    // const idDivScreenMirror = "jsmindtest-div-mirror";
    // const idMirroredWrapper = "jsmindtest-div-mirrored-wrapper";
    // let divMirroredWrapper;

    const jsMindContainer = document.getElementById(idDivJsmindContainer);
    if (!jsMindContainer) throw Error(`Could not find ${idDivJsmindContainer}`);

    function clearSearchHits() {
        if (!jsMindContainer) throw Error(`Could not find ${idDivJsmindContainer}`);
        const nodeEltArray = [...jsMindContainer.querySelectorAll("jmnode[nodeid]")];
        nodeEltArray.forEach(n => n.classList.remove("jsmind-hit"));
    }


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


    let btnJsmindMenu;
    let btnJsmindSearch;

    const inpSearch = mkElt("input", { type: "search", placeholder: "Search nodes", id: "jsmind-inp-node-search" });
    // const inpSearch = modMdc.mkMDCtextFieldInput( "jsmind-inp-node-search", "search");
    // const tfSearch = modMdc.mkMDCtextFieldOutlined("Search nodes", inpSearch);
    // const tfSearch = modMdc.mkMDCtextField("Search nodes", inpSearch);
    const tfSearch = inpSearch;

    const eltProvHits = mkElt("div", { id: "provider-hits" });
    const divSearchInputs = mkElt("div", { id: "jsmind-search-inputs" }, [tfSearch, eltProvHits]);
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
        ;
        btnJsmindSearch.classList.add("jsmind-actions");
        // jsMindContainer.appendChild(btnJsmindSearch);
        jsMindContainer.appendChild(divJsmindSearch);
        divJsmindSearch.appendChild(btnJsmindSearch);
        btnJsmindSearch.addEventListener("click", evt => {
            // console.log("btnJsmindSearch");
            evt.stopPropagation();
            toggleSearchInputs();
            const eltJmnodes = getJmnodesFromJm(jmDisplayed);
            eltJmnodes.classList.remove("showing-hits");
            clearSearchHits();
            if (visibleSearchInputs()) {
                const divInputs = document.getElementById("jsmind-search-inputs");
                if (!divInputs) { throw Error(`Could not find #jsmind-search-inputs`); }
                if (divInputs.classList.contains("showing-provider-hits")) {
                    setProviderNodeHits();
                } else {
                    inpSearch.focus();
                    const strSearch = inpSearch.value.trim();
                    if (strSearch.length > 0) {
                        restartJsmindSearch();
                    }
                }
            } else {
                const divHits = document.getElementById(idDivHits);
                divHits?.classList.add("display-none");
            }
        });

        const btnCloseProvHits = modMdc.mkMDCiconButton("clear", "Clear search hits");
        btnCloseProvHits.classList.add("icon-button-sized");
        btnCloseProvHits.addEventListener("click", () => {
            const divInputs = document.getElementById("jsmind-search-inputs");
            if (!divInputs) { throw Error(`Could not find jsmind-search-inputs`); }
            divInputs.classList.remove("showing-provider-hits");
            clearSearchHits();
            const divHits = document.getElementById(idDivHits);
            divHits?.classList.add("display-none");
            const eltJmnodes = getJmnodesFromJm(jmDisplayed);
            eltJmnodes.classList.remove("showing-hits");
            inpSearch.focus();
        });
        const eltTellProvider = mkElt("span");
        if (nodeProvider) {
            const render = await modCustRend.getOurCustomRenderer();
            const src = render.getLinkRendererImage(nodeProvider);
            const eltImg = mkElt("img", { src });
            eltImg.style.height = "30px";
            const span = mkElt("span", undefined, [eltImg, " link"]);
            eltTellProvider.appendChild(span);
            // Links to Links to 
        } else {
            eltTellProvider.appendChild(mkElt("span", undefined, "dummy (no provider)"));
        }
        // const eltProvHits = mkElt("div", { id: "provider-hits" }, [
        eltProvHits.textContent = "";
        eltProvHits.appendChild(eltTellProvider);
        eltProvHits.appendChild(btnCloseProvHits);
        // ]);

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
        return () => {
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
    function checkParams() {
        const sp = new URLSearchParams(location.search);
        if (sp.size == 0) return true;
        const arrParNames = [...sp.keys()].sort();
        const strParNames = JSON.stringify(arrParNames);
        console.log({ strParNames });
        if (strParNames == '["mindmap"]') return true;
        // if (strParNames == '["maxConf","requiredTags","searchFor"]') return true;
        if (strParNames == '["mindmap","nodehits","provider"]') return true;
        debugger; // eslint-disable-line no-debugger
        alert("invalid params: " + strParNames);
        return false;
    }
    checkParams();

    const mindmapKey = new URLSearchParams(location.search).get("mindmap");
    if (typeof mindmapKey === "string" && mindmapKey.length === 0) {
        throw Error("Parameter mindmapname should have a value (key/name of a mindmap)");
    }
    let mind;
    if (mindmapKey) {
        mind = await modMMhelpers.getMindmap(mindmapKey);
    }
    if (!mind) {
        if (funMindmapsDialog) {
            funMindmapsDialog();
        } else {
            dialogMindMaps(location.pathname);
        }
        return;
    }

    modJsmindDraggable = await importFc4i("mm4i-jsmind.drag-node");
    modJsmindDraggable.setupNewDragging();


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


    const nowBefore = Date.now();
    jmDisplayed = await displayMindMap(mind, usedOptJmDisplay);

    // We need another layer to handle zoom/move:
    const eltContainer = document.getElementById(usedOptJmDisplay.container);
    if (!eltContainer) throw Error("Could not find jsmind container");
    const eltInner = eltContainer?.querySelector("div.jsmind-inner");
    if (!eltInner) throw Error("Could not find div.jsmind-inner");
    if (!eltInner.closest("div.jsmind-zoom-move")) {
        const eltZoomMove = document.createElement("div");
        eltZoomMove.classList.add("jsmind-zoom-move");
        // @ts-ignore
        eltZoomMove.style = `
                position: relative;
                outline: 4px dotted black;
            `;
        eltInner.remove();
        eltZoomMove.appendChild(eltInner);
        eltContainer.appendChild(eltZoomMove);
    }




    // modTools.addPosListeners();


    ////// modFsm
    modFsm.fsm.hook_any_action(fsmEvent);
    modFsm.fsm.hook_any_transition((...args) => {
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
    modFsm.fsm.post_hook_entry("n_Move", (hookData) => {
        hookStartMovePointHandle(hookData);
    });
    modFsm.fsm.hook_exit("n_Move", () => pointHandle.teardownPointHandle());

    let funStopScroll;
    modFsm.fsm.post_hook_entry("c_Move", (hookData) => {
        const { eltJmnode, pointerType } = hookData.data;
        if (eltJmnode && (!eltJmnode.classList.contains("root"))) throw Error("eltJmnode in c_Move");
        funStopScroll = undefined;
        const jmnodes = getJmnodesFromJm(jmDisplayed);
        const eltScroll = jmnodes.closest("div.jsmind-zoom-move");
        funStopScroll = startGrabMove(eltScroll);
    });
    modFsm.fsm.hook_exit("c_Move", () => { if (funStopScroll) funStopScroll(); });

    modFsm.fsm.post_hook_entry("c_Dblclick", () => { dialogEditMindmap(); });
    modFsm.fsm.post_hook_entry("n_Dblclick", async (hookData) => {
        // const eltJmnode = hookData.data;
        const { eltJmnode } = hookData.data;
        const renderer = await modCustRend.getOurCustomRenderer();
        renderer.editNodeDialog(eltJmnode);
    });

    modFsm.setupFsmListeners(eltFsm);




    const modCustRend = await importFc4i("jsmind-cust-rend");
    modCustRend.setOurCustomRendererJm(jmDisplayed);
    modCustRend.setOurCustomRendererJmOptions(defaultOptJmDisplay);
    const render = await modCustRend.getOurCustomRenderer();


    // Double click on Windows and Android
    jmDisplayed.disable_event_handle("dblclick");
    const eltJmnodes = getJmnodesFromJm(jmDisplayed);

    const modMoveHelp = await importFc4i("move-help");
    const eltScroll = eltJmnodes.closest("div.jsmind-zoom-move");
    instMoveEltAtDragBorder = new modMoveHelp.MoveEltAtDragBorder(eltScroll, 60);

    // Windows
    eltJmnodes.addEventListener("dblclick", evt => {
        // FIX-ME: there is no .eventType - is this a bug?
        // if ((evt.eventType != "mouse") && (evt.eventType != "pen")) return;
        if ((evt.type != "mouse") && (evt.type != "pen")) return;
        if (!(evt instanceof MouseEvent)) return;
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        render.mindmapDblclick(evt);
    });
    // Android
    const jmnodesLastTouchend = {
        ms: 0,
        clientX: -1,
        clientY: -1,
    }
    eltJmnodes.addEventListener("NOtouchend", (evt) => {
        // if (evt.eventType != "touch") throw Error(`"touchend", but eventType:${evt.eventType}`);
        if (evt.type != "touchend") throw Error(`"touchend", but event.type:${evt.type}`);
        const currentTime = Date.now();
        const msTouchLength = currentTime - jmnodesLastTouchend.ms;

        let touchDistance = 0;
        let clientX = evt.clientX;
        let clientY = evt.clientY;
        if (clientX == undefined) {
            const touches = evt.touches || evt.changedTouches;
            if (!touches) throw Error(`touches is undefined`);
            // if (!Array.isArray(touches)) throw Error(`touches is not array`);
            if (touches.length == 0) throw Error(`touches.length == 0`);
            const touch = touches[0] || touches.item(0);
            if (!touch) throw Error(`touch is undefined`);
            clientX = touch.clientX;
            clientY = touch.clientY;
            const dX = jmnodesLastTouchend.clientX - clientX;
            const dY = jmnodesLastTouchend.clientY - clientY;
            touchDistance = Math.sqrt(dX * dX + dY * dY);
            if (isNaN(touchDistance)) {
                const msg = `
            touchDistance isNaN, dX:${dX}, dY:${dY}
            evt.type:${evt.type}
            evt.clientX:${evt.clientX}
            evt.clientY:${evt.clientY}
            jmnodesLastTouchend.clientX:${jmnodesLastTouchend.clientX}
            `;

                throw Error(msg);
            }
        }
        if (msTouchLength < 500 && msTouchLength > 0 && touchDistance < 10) {
            render.mindmapDblclick(evt);
            jmnodesLastTouchend.ms = 0;
            jmnodesLastTouchend.clientX = -1;
            jmnodesLastTouchend.clientY = -1;
        }
        jmnodesLastTouchend.ms = currentTime;
        jmnodesLastTouchend.clientX = evt.clientX;
        jmnodesLastTouchend.clientY = evt.clientY;
    });


    render.applyThisMindmapGlobals();

    switchDragTouchAccWay(theDragTouchAccWay);

    const nowAfter = Date.now();
    console.log(`*** displayMindMap, custom rendering: ${nowAfter - nowBefore} ms`);


    // let jmMirrored;
    // let ourCustomRenderer4mirror;

    // FIX-ME: remove when this is fixed in jsmind.
    updateCustomAndShapes(jmDisplayed);

    async function setNodeHitsFromArray(arrIdHits, hitType) {
        const eltJmnodes = getJmnodesFromJm(jmDisplayed);
        eltJmnodes.classList.add("showing-hits");
        if (hitType == "provider") {
            // @ts-ignore
            jsMindContainer.classList.add("display-jsmind-search");
            const divInputs = document.getElementById("jsmind-search-inputs");
            if (!divInputs) { throw Error(`Could not find #jsmind-search-inputs`); }
            divInputs.classList.add("showing-provider-hits");
        }
        console.log({ arrHits: arrIdHits });
        arrIdHits.forEach(id => {
            const node = jmDisplayed.get_node(id);
            const eltNode = jsMind.my_get_DOM_element_from_node(node);
            eltNode.classList.add("jsmind-hit");
        });

        if (arrIdHits.length == 0) {
            if (hitType == "provider") {
                divHits.textContent = "No link to provider item";
            } else {
                divHits.textContent = "No search hits";
            }
            return;
        }
        const btnCurr = await modMdc.mkMDCbutton("wait");
        btnCurr.addEventListener("click", () => {
            const num = getBtnCurrNum();
            selectHit(num);
        })
        setHitTo(1);
        function selectHit(num) {
            setTimeout(() => jmDisplayed.select_node(arrIdHits[num - 1]), 200);
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

    // if (nodeHits) { setProviderNodeHits(); }
    setProviderNodeHits();
    async function setProviderNodeHits() {
        if (!nodeHits) return;
        const arrIdHits = nodeHits.split(",");
        setNodeHitsFromArray(arrIdHits, "provider");
    }

    jmDisplayed.add_event_listener((type, data) => {
        if (type !== 3) return;
        addDebugLog(`jmDisplayed, event_listener, ${type}`)
        const evt_type = data.evt;
        const datadata = data.data;
        const node_id = data.node;
        // console.log({ evt_type, type, datadata, data });
        checkOperationOnNode(evt_type, node_id, datadata);
        modMMhelpers.DBrequestSaveThisMindmap(jmDisplayed); // FIX-ME: delay
        // updateTheMirror();
    });
    async function checkOperationOnNode(operation_type, operation_node_id, datadata) {
        console.log("checkOpOnNode", { operation_type, operation_node_id, jm_operation: jmDisplayed, datadata });
        switch (operation_type) {
            case "add_node":
                const id_added = operation_node_id;
                const added_node = jmDisplayed.get_node(id_added);
                console.log({ operation_type, id_added, added_node });
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
                    const id_moved = operation_node_id;
                    const moved_node = jmDisplayed.get_node(id_moved);
                    const eltJmnode = jsMind.my_get_DOM_element_from_node(moved_node);
                    // const isPlainNode = eltJmnode.childElementCount == 0;
                    // if (!isPlainNode) {
                    (await getCustomRenderer()).updateJmnodeFromCustom(eltJmnode);
                    // }
                    break;
                }
            case "remove_node":
                const id_removed = datadata[0];
                console.log({ operation_type, id_removed, operation_node_id });
                break;
            default:
                console.warn(`unknown operation_type: ${operation_type}`);
        }
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
    });

    function targetIsJmnode(evt) {
        const targ = evt.target;
        const jmnode = targ.closest("jmnode");
        return jmnode;
    }


    /*
    // This was a way to make a longpress.
    // Not used any more. Use jssm instead.
    let msDelayContextMenu = 0;
    jsMindContainer.addEventListener("NOtouchmove", evt => {
        // evt.preventDefault();
        evt.stopPropagation();
        stopContextMenu();
    });
    jsMindContainer.addEventListener("NOtouchstart", evt => {
        const jmnode = targetIsJmnode(evt);
        if (jmnode) {
            evt.stopPropagation();
            msDelayContextMenu = 1000;
            jmDisplayed.select_node(jmnode);
        }
    });
    jsMindContainer.addEventListener("NOcontextmenu", evt => {
        if (targetIsJmnode(evt)) {
            evt.preventDefault();
            if (!(evt instanceof PointerEvent)) { throw Error("not PointerEvent"); }
            // if (!(evt.clientX && evt.clientY)) { throw Error("evt does not have position"); }
            const x = `${evt.clientX}`;
            const y = `${evt.clientY}`;
            restartDisplayContextMenu(evt.target, x, y);
        }
    });

    function stopContextMenu() { restartDisplayContextMenu(); }
    const restartDisplayContextMenu = (() => {
        let tmr;
        return (forElt, x, y) => {
            clearTimeout(tmr);
            if (forElt === undefined) return;
            const doDisplay = () => displayContextMenu(forElt, x, y);
            tmr = setTimeout(doDisplay, msDelayContextMenu);
        }
    })();
    */


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
    async function displayContextMenu(forElt, left, top) {
        // const divMenu = await mkDivContextMenu();
        const divMenu = await mkPageMenu();
        // divMenu.id = "mm4i-page-menu";
        document.body.appendChild(divMenu);
        divMenu.forElt = forElt;
        // Set values in integer, read them as ..px
        if (left) divMenu.style.left = left;
        if (top) divMenu.style.top = top;
        divMenu.style.opacity = 0;
        divMenu.style.display = "block";
        const compStyle = getComputedStyle(divMenu);

        const right = parseInt(compStyle.right);
        // console.log({ right });
        // FIX-ME: This is fragile. Chrome tries to wrap the menu.
        if (right <= 0) divMenu.style.left = parseInt(divMenu.style.left) + right - 30;

        const bottom = parseInt(compStyle.bottom);
        // console.log({ bottom });
        if (bottom < 0) divMenu.style.top = parseInt(divMenu.style.top) + bottom;

        divMenu.style.opacity = 1;
    }

    async function dialogEditMindmap() {
        const rend = await modCustRend.getOurCustomRenderer();
        await rend.editMindmapDialog();
    }

    async function mkPageMenu() {
        let toJmDisplayed;
        try {
            toJmDisplayed = typeof jmDisplayed;
        } catch (err) {
            console.log({ err });
        }
        console.log({ toJmDisplayed });
        const selected_node = toJmDisplayed && jmDisplayed?.get_selected_node();

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

        // const liDragAccessibility = mkMenuItem("Drag accessiblity", dialogDragAccessibility);
        const liMindmapsA = mkMenuItemA("List Mindmaps", "./mm4i.html");
        const liEditMindmap = mkMenuItem("Edit Mindmap", dialogEditMindmap);


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

            const taNotes = mkElt("textarea");
            // const taNotes = modMdc.mkMDCtextFieldTextarea(undefined, 10, 10);
            taNotes.placeholder = "Enter preliminary notes here";
            const body = mkElt("div", undefined, [
                tfTopic,
                taNotes
            ]);
            body.style = `
                display: flex;
                flex-direction: column;
                gap: 25px;
            `;

            // # my notes
            const modEasyMDE = await importFc4i("easymde");
            console.log({ modEasyMDE }); // EasyMDE is defined in global scope!
            const easyMDE = new EasyMDE({
                element: taNotes,
                status: false,
                // toolbar: [],
            });



            const btnAddNode = modMdc.mkMDCdialogButton("Add", "add", true);
            const btnCancel = modMdc.mkMDCdialogButton("Cancel", "close");
            const eltActions = modMdc.mkMDCdialogActions([btnAddNode, btnCancel]);

            btnAddNode.disabled = true;
            inpTopic.addEventListener("input", () => { btnAddNode.disabled = inpTopic.value.trim() == ""; });

            const dlg = await modMdc.mkMDCdialog(body, eltActions);
            // function closeDialog() { dlg.mdc.close(); }
            const res = await new Promise((resolve, reject) => {
                dlg.dom.addEventListener("MDCDialog:closed", errorHandlerAsyncEvent(async evt => {
                    const action = evt.detail.action;
                    const topic = inpTopic.value.trim();
                    const result = topic.length > 0;
                    console.log({ action, result });
                    resolve(result);
                }));
            });
            console.log({ res });
            if (!res) return;


            // if (!save) return;
            const new_node_topic = inpTopic.value.trim();
            // const notes = taNotes.value.trim();
            let new_node;
            switch (rel) {
                case "child":
                    new_node = await jm.add_node(selected_node, new_node_id, new_node_topic);
                    console.log(`child .add_node(${selected_node.id}, ${new_node_id}, ${new_node_topic})`);
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
            let notes = easyMDE.value().trimEnd();
            if (notes.length > 0) {
                debugger;
                const se = { notes };
                new_node.data.shapeEtc = se;
            }
            jm.select_node(new_node);
        }

        const liDelete = mkMenuItem("Delete node", deleteNode);
        markIfNoSelected(liDelete);
        markIfNoMother(liDelete);

        function deleteNode() {
            const selected_node = getSelected_node();
            if (selected_node) {
                const mother = selected_node.parent;
                if (!mother) {
                    modMdc.mkMDCdialogAlert("This node can't be deleted");
                } else {
                    const jm = jmDisplayed;
                    jm.remove_node(selected_node);
                    jm.select_node(mother);
                }
            }
            hideContextMenu();
        }

        const arrMenuEntries = [
            liAddChild,
            liAddSibling,
            liDelete,
            // liTestConvertToCustom,
            // liDragAccessibility,
            liEditMindmap,
            liMindmapsA,
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

    async function displayMindMap(mind, options) {
        const jm = new jsMind(options);
        await jm.show_async(mind);
        return jm;
    }

    // addScrollIntoViewOnSelect(jmDisplayed);
    addScrollIntoViewOnSelect();
    function jsmindSearchNodes(strSearch) {
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
        const arrIdHits = matchingNodes.map(n => jsMind.my_get_nodeID_from_DOM_element(n));
        setNodeHitsFromArray(arrIdHits, "search");
        console.log({ matchingNodes });
    }



    jmDisplayed.select_node(jmDisplayed.get_root());




    // const modMoveHelp = await importFc4i("move-help");
    function startGrabMove(elt2move) {
        console.log("startGrabMove", elt2move);
        let isMoving = true;
        // const ourElement2move = elt2move;
        let n = 0;

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
                debugger;
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



    // https://javascript.info/bezier-curve


    async function convertPlainJmnode2ProviderLink(eltJmnode, jmOwner, objCustomCopied) {
        if (eltJmnode.tagName != "JMNODE") throw Error("Not <jmnode>");

        const provider = objCustomCopied.provider;
        if (!(await getCustomRenderer()).getProviderNames().includes(provider)) throw Error(`Provider ${provider} is unknown`);
        const providerKey = objCustomCopied.key;

        const strJsmindTopic = (await getCustomRenderer()).customData2jsmindTopic(providerKey, provider);

        console.log("eltJmnode", eltJmnode, strJsmindTopic);
        if (jmOwner) {
            const node_id = jsMind.my_get_nodeID_from_DOM_element(eltJmnode);
            jmOwner.update_node(node_id, strJsmindTopic);
            jmOwner.set_node_background_image(node_id, undefined, 150, 100);
        } else {
            const s = eltJmnode.style;
            s.height = s.height || "140px";
            s.width = s.width || "140px";
            const eltCustom = (await getCustomRenderer()).jsmindTopic2customElt(strJsmindTopic);
            eltJmnode.appendChild(eltCustom);
            (await getCustomRenderer()).updateJmnodeFromCustom(eltJmnode, jmOwner);
        }
    }
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


function updateCustomAndShapes(jmDisplayed) {
    setTimeout(() => {
        console.log("updateCustomAndShapes (in setTimeout fun)");
        addDebugLog("updateCustomAndShapes (in setTimeout fun)");
        const eltJmnodes = getJmnodesFromJm(jmDisplayed);
        [...eltJmnodes.getElementsByTagName("jmnode")].forEach(async eltJmnode => {
            const node_id = jsMind.my_get_nodeID_from_DOM_element(eltJmnode);
            if (node_id == 21) console.warn("node_id 21");
            const node = jmDisplayed.get_node(node_id);
            applyNodeShapeEtc(node, eltJmnode);
        });
    }, 500);
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
// function RGBToHex(rgb) { return standardizeColorTo6Hex(rgb); }

// https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes/47355187#47355187
export function standardizeColorTo6Hex(strColor) {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) { throw Error("Could not get canvas 2d"); }
    ctx.fillStyle = strColor;
    return ctx.fillStyle;
}
export function to6HexColor(color) {
    return standardizeColorTo6Hex(color);
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


//////////////////////
// Accesibility color contrast

// https://codepen.io/davidhalford/pen/AbKBNr
function getCorrectTextColor(color) {
    // @ts-ignore
    const hex = to6HexColor(color).substring(1);

    /*
    From this W3C document: http://www.webmasterworld.com/r.cgi?f=88&d=9769&url=http://www.w3.org/TR/AERT#color-contrast
    
    Color brightness is determined by the following formula: 
    ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
 
I know this could be more compact, but I think this is easier to read/explain.
    
    */

    const threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

    const hRed = hexToR(hex);
    const hGreen = hexToG(hex);
    const hBlue = hexToB(hex);


    function hexToR(h) { return parseInt((cutHex(h)).substring(0, 2), 16) }
    function hexToG(h) { return parseInt((cutHex(h)).substring(2, 4), 16) }
    function hexToB(h) { return parseInt((cutHex(h)).substring(4, 6), 16) }
    function cutHex(h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h }

    const cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold) { return "#000000"; } else { return "#ffffff"; }
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


export async function dialogMindMaps(linkMindmapsPage, info, arrMindmapsHits, provider) {
    const toLink = typeof linkMindmapsPage;
    if (toLink !== "string") throw Error(`urlHtml typeof should be string, got ${toLink}`);
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
        // console.log({ m, key, j, name });
        // let name = topic;
        if (topic.startsWith("<")) {
            // FIX-ME: use DOMParser? It may be synchronous.
            // https://stackoverflow.com/questions/63869394/parse-html-as-a-plain-text-via-javascript
            const elt = document.createElement("div");
            elt.innerHTML = topic;
            // const txt = elt.textContent;
            // name = txt;
            const child1 = elt.firstElementChild;
            // @ts-ignore
            const strCustom = child1.dataset.jsmindCustom;
            if (strCustom) {
                // console.log({ txt, strCustom })
                // ourCustomRenderer
                const objCustom = JSON.parse(strCustom);
                topic = (async () => {
                    const key = objCustom.key;
                    const provider = objCustom.provider;
                    const keyRec = await (await modCustRend.getOurCustomRenderer()).getCustomRec(key, provider);
                    return keyRec.title;
                })();
            }
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
            await modMMhelpers.createAndShowNewMindmap(linkMindmapsPage);
        }));
        // arrLiMenu.push(liNew);

        // function mkMDCfab(eltIcon, title, mini, extendTitle)
        const eltIcon = modMdc.mkMDCicon("add");
        const btnFab = modMdc.mkMDCfab(eltIcon, "Create new mindmap", true);
        btnFab.addEventListener("click", errorHandlerAsyncEvent(async () => {
            // await createAndShowNewMindmapFc4i();
            await modMMhelpers.createAndShowNewMindmap(linkMindmapsPage);
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
    dialogMindMaps("/mm4i.html", info, arrMindmapsHits, provider);
}


///////////////////////////////////////
/***************** Test cm on screen */
///////////////////////////////////////

// testCmOnScreen();
function testCmOnScreen() {

    ////////// In Google Chrome on Windows:

    // Known by Google Chrome dev tools
    // Width from https://GSMArena.com/
    const knownDevices = {

        //// Works for Pixel 7, devicePixelRatio==2.625, 1/r=0.381
        a: {
            name: "Pixel 7",
            screenMmWidth: 73.2 - 2.54 * 0.17,
            devUA: "(Linux; Android 13; Pixel 7)",
            devicePixelRatio: 2.625,
            corr: 0.670,
            measuredPixelRatio: 2.875,
            measuredCorr: 0.741
        },

        //// Works for Samsung Galaxy S8 Plus, 7.1cm, devicePixelRatio==4, 1/r=0.250
        b: {
            name: "Samsung Galaxy S8+",
            screenMmWidth: 73.4 - 2.54 * 0.08,
            devicePixelRatio: 4,
            devUA: "(Linux; Android 13; SM-G981B)",
            corr: 0.777
        },

        //// Works for Samsung Galaxy S20 Ultra, devicePixelRatio==3.5, 1/r=0.286
        c: {
            name: "Samsung Galaxy S20 Ultra",
            screenMmWidth: 76 - 2.54 * 0.33,
            devicePixelRatio: 3.5,
            devUA: "(Linux; Android 13; SM-G981B)",
            corr: 0.693
        }

    }


    let dev = "none";
    let corr = 1;

    function promptDev(parDev) {
        let txtPrompt = ``;
        for (const [k, v] of Object.entries(knownDevices)) {
            txtPrompt += `  ${k}: ${v.name}\n`;
        }
        return prompt(txtPrompt, parDev);
    }
    while (!Object.keys(knownDevices).includes(dev)) {
        const tmp = promptDev(dev)?.trim();
        if (!tmp) return;
        dev = tmp;
        console.log({ dev });
    }
    const devRec = knownDevices[dev];
    console.log(devRec);

    if (location.protocol == "http:") {
        // Emulating mobile device?
        const re = new RegExp("\\(.*?\\)");
        // @ts-ignore
        const devUA = re.exec(navigator.userAgent)[0];
        console.log({ devUA });
        if (!devRec.devUA) throw Error(`devRec.devUA is not set, should be "${devUA}"`);
        if (devRec.devUA && devRec.devUA != devUA) {
            throw Error(`devUA did not match: w"${devUA}"!=d"${devRec.devUA}"A`);
        }
    }
    if (devRec.devicePixelRatio) {
        const devRatio = devRec.devicePixelRatio;
        const winRatio = window.devicePixelRatio;
        if (devRatio != winRatio) {
            // throw Error(`devicePixelRatio, d${devRatio} != w${winRatio}`);
            alert(`devicePixelRatio, d${devRatio} != w${winRatio}`);
        }
    }


    corr = devRec.corr || corr;
    const devName = devRec.name;
    const devCmW = devRec.screenMmWidth / 10;
    const txtPromptCorr = `
        ${devName}
        Real Width: ${devCmW.toFixed(1)}cm
        devicePixelRatio==${window.devicePixelRatio},

        Correction:
    `;
    const corrTxt = prompt(txtPromptCorr, corr.toFixed(3));
    if (!corrTxt) return;
    corr = corrTxt ? parseFloat(corrTxt) : 0;

    function cm2screenPixels(cm) {
        const dpcm1 = estimateDpcm();
        console.log({ dpcm1 });
        const px = cm * dpcm1 / (window.devicePixelRatio * corr);
        console.log({ cm, px });
        return px;
    }
    function estimateDpcm() {
        let x = 10;
        while (x < 2000) {
            x *= 1.01;
            if (!window.matchMedia(`(min-resolution: ${x}dpcm)`).matches) break;
        }
        const dpcm = x;
        console.log({ dpcm });
        return dpcm;
    }

    function showCmTestGrid(cmGrid, comparePx, compareWhat) {
        const cmPx = cm2screenPixels(cmGrid);
        compareWhat = compareWhat || "Compare: ";
        const eltBg = document.createElement("div");
        // @ts-ignore
        eltBg.style = `
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            opacity: 0.5;
            background-color: red;
            background-image:
                linear-gradient(to right, black 1px, transparent 1px),
                linear-gradient(to bottom, black 1px, transparent 1px);
            background-size: ${cmPx}px ${cmPx}px;
            z-index: 9999;
        `;
        document.body.appendChild(eltBg);

        const dpcm2 = estimateDpcm();
        console.log({ dpcm2 });
        const screenPx = screen.width;
        const screenCm = screenPx / cm2screenPixels(1);
        const bestCorr = corr * devCmW / screenCm;
        let info = `
            ${devName}, Spec screen:${screenPx}px/${devCmW.toFixed(2)}cm
            - corr:${corr}(${bestCorr.toFixed(3)})/${screenCm.toFixed(2)}cm
            --- cm:${cmPx.toFixed(0)}px
            - dpcm:${dpcm2.toFixed(1)}`;
        if (comparePx) info += ` - ${compareWhat}: ${comparePx.toFixed(0)}px`;
        const eltInfo = document.createElement("span");
        eltInfo.textContent = info;
        // @ts-ignore
        eltInfo.style = `
        position: fixed;
        top: 0;
        left: 0;
        display: inline-block;
        padding: 4px;
        background-color: yellow;
        color: black;
        z-index: 9999;
    `;
        const btn = document.createElement("button");
        btn.textContent = "Close";
        btn.addEventListener("click", () => { eltBg.remove(); eltInfo.remove(); });
        btn.style.marginLeft = "20px";
        eltInfo.appendChild(btn);
        document.body.appendChild(eltInfo);
    }

    if (corr) {
        // showCmTestGrid(2);
        setTimeout(() => {
            showCmTestGrid(2);
            console.log({ knownDevices });
        }, 1000);
    }
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
    const decl = modFsm.fsmDeclaration;
    markedDecl = decl;
    markedDecl = markedDecl.replaceAll(/after (\d+) ms/g, "'$1ms'"); // FIX-ME:
    let iState = 0;
    const marked = new Set();
    for (let i = 0, len = stackLogFsm.length; i < len; i++) {
        const entry = stackLogFsm[i];
        if (modFsm.isState(entry)) {
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
    const ch = eltSmallGraph.clientHeight;
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
    addStackLogFsm(state);
    modFsm.checkIsState(state)
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
    modFsm.checkIsEvent(eventName);
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
    elt.addEventListener("click", errorHandlerAsyncEvent(async evt => {
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();

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

setTimeout(async () => {
    logJssmState(modFsm.fsm.state());
}, 1000);

