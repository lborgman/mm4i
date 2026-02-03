// @ts-check

const version = "0.1.000";
window["logConsoleHereIs"](`here is zoom.js, module, ${version}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

const importFc4i = window["importFc4i"];
const modTools = await importFc4i("toolsJs");
const debounceDisplayZoomed = modTools.debounce(displayZoomed);

// const touchesPositions = undefined;

/*
export function start(evt) {
    const touchLen = evt.touches.length;
    if (touchLen != 2) throw Error(`touchLen == ${touchLen}`);
}
*/


///// https://apex.oracle.com/pls/apex/vmorneau/r/pinch-and-zoom/pinch-and-zoom-js
///// https://stackoverflow.com/questions/74010960/how-to-implement-pinch-zoom-in-zoom-out-using-javascript

// Calculate distance between two fingers
/**
 * 
 * @param {TouchEvent} event 
 * @returns 
 */
const distanceTouches = (event) => {
    const len = event.touches.length;
    if (len < 2) return 0;
    return Math.hypot(
        event.touches[0].pageX - event.touches[1].pageX,
        event.touches[0].pageY - event.touches[1].pageY);
};


/** @type {HTMLDivElement} */
let eltZoomMove;

// FIX-ME: weakmap with key eltZoomMove???
/** @type {number} */ let scaleI;
/** @type {number} */ let xI;
/** @type {number} */ let yI;

/**
 * @typedef {Object} PointAndDistance
 * @property {number} x - The x coordinate
 * @property {number} y - The y coordinate
 * @property {number} distance
 */

/**
 * @type {PointAndDistance}
 */
const start = {
    x: -1,
    y: -1,
    distance: -1
};

function getTransformsI() {
    const transforms = modTools.getCssTransforms(eltZoomMove);
    scaleI = transforms.scale;
    xI = transforms.x;
    yI = transforms.y;
}

/**
 * 
 * @param {TouchEvent} event 
 * @returns 
 */
function handleTouchStart(event) {
    const len = event.touches.length;
    if (len != 2) return;

    event.preventDefault(); // Prevent page scroll

    // Calculate where the fingers have started on the X and Y axis
    start.x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
    start.y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
    start.distance = distanceTouches(event);

    getTransformsI();
};

/** @type {HTMLDivElement} */
let eltDraggingContainerIndicator;
async function showDragContainerIndicator() {
    document.body.classList.add("dragging-container");
    if (eltDraggingContainerIndicator) {
        eltDraggingContainerIndicator.style.display = "flex";
        return;
    }

    const modMdc = await importFc4i("util-mdc");
    const eltIcon = modMdc.mkMDCicon("drag_pan");
    // @ts-ignore
    eltDraggingContainerIndicator = mkElt("div", undefined, eltIcon);
    eltDraggingContainerIndicator.style = `
            position: fixed;
            left: 10px;
            top: 10px;
            z-index: 99;
            color: red;
            background-color: black;
            width: 32px;
            aspect-ratio: 1 / 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            outline: 1px solid;
        `;
    document.body.appendChild(eltDraggingContainerIndicator);
}
function hideDragContainerIndicator() {
    document.body.classList.remove("dragging-container");
    if (eltDraggingContainerIndicator) {
        eltDraggingContainerIndicator.style.display = "none";
    }
}

/** @type {number} */ let pointerMoveStartTime;
export async function handleSimilarPointerStart() {
    console.log("%chandleSimilarPointerStart", "font-size:18px;");
    const savedStartPointerPos = await modTools.getAndClearStartPointerPos();
    start.x = savedStartPointerPos.startPageX;
    start.y = savedStartPointerPos.startPageY;
    if (isNaN(start.x) || isNaN(start.y)) throw Error("Did not get start.x/y");
    start.distance = 0;
    getTransformsI();

    // touchMove
    isMovingPointer = true;
    eltZoomMove.style.cursor = "grab";
    showDragContainerIndicator();

    pointerMoveStartTime = performance.now();
    requestAnimationFrame(handleSimilarPointerMove);
    return () => {
        isMovingPointer = false;
        eltZoomMove.style.cursor = "";
        hideDragContainerIndicator();
    }
};
let isMovingPointer = false;
export async function handleSimilarPointerMove() {
    // moving
    if (!isMovingPointer) return;
    const elapsed = performance.now() - pointerMoveStartTime;
    const maxMoveDur = 5;
    if (elapsed > maxMoveDur * 1000) {
        console.warn(`Guard: jumping out of move after ${maxMoveDur} seconds`);
        isMovingPointer = false;
        eltZoomMove.style.cursor = "";
        return;
    }
    // const deltaDistance = distanceTouches(event);
    // const scaleD = deltaDistance / start.distance;
    // const minScale = 0.5;
    // const maxScale = 4;
    // const scaleB = Math.min(Math.max(minScale, scaleD * scaleI), maxScale);

    const savedPointerPos = await modTools.getSavedPointerPos();

    // Calculate how much the fingers have moved on the X and Y axis
    const xD = savedPointerPos.pageX - start.x;
    const yD = savedPointerPos.pageY - start.y;

    const xB = xD + xI;
    const yB = yD + yI;
    // FIX-ME: keep element inside some boundaries

    // Transform the container to make it grow and move with fingers
    const transform = `translate3d(${xB}px, ${yB}px, 0) scale(${scaleI})`;
    eltZoomMove.style.transform = transform;

    isMovingPointer = true;
    requestAnimationFrame(handleSimilarPointerMove);
};


/** @param {HTMLDivElement} element */
function setEltZoomMove(element) {
    const tagName = element.tagName;
    if (tagName != "DIV") throw Error(`setEltZoomMove: expected DIV, got "${tagName}"`);
    eltZoomMove = element;
}
/**
 * @param {HTMLDivElement} element
 * Setup pinch zoom.
 */
export function setupPinchZoomMove(element) {
    setEltZoomMove(element);

    eltZoomMove.addEventListener('touchstart', handleTouchStart);

    eltZoomMove.addEventListener('touchmove', (event) => {
        // console.log('touchmove', event);
        if (event.touches.length === 2) {
            event.preventDefault(); // Prevent page scroll

            const deltaDistance = distanceTouches(event);
            const scaleD = deltaDistance / start.distance;
            const minScale = 0.5;
            const maxScale = 4;
            const scaleB = Math.min(Math.max(minScale, scaleD * scaleI), maxScale);

            // Calculate how much the fingers have moved on the X and Y axis
            const xD = (((event.touches[0].pageX + event.touches[1].pageX) / 2) - start.x) * 2; // x2 for accelarated movement
            const yD = (((event.touches[0].pageY + event.touches[1].pageY) / 2) - start.y) * 2; // x2 for accelarated movement

            const xB = xD + xI;
            const yB = yD + yI;
            // FIX-ME: keep element inside some boundaries

            // Transform the image to make it grow and move with fingers
            const transform = `translate3d(${xB}px, ${yB}px, 0) scale(${scaleB})`;
            eltZoomMove.style.transform = transform;
            // element.style.zIndex = "9999";
            debounceDisplayZoomed(scaleB);
        }
    });

    /*
    element.addEventListener('touchend', (event) => {
        // console.log('touchend', event);
        // Reset image to it's original format
        element.style.transform = "";
        element.style.zIndex = "";
    });
    */
}

/**
 * 
 * @param {number} amount 
 */
function changeScale(amount) {
    if (isNaN(amount)) throw Error("isNaN(amount)");
    const transforms = modTools.getCssTransforms(eltZoomMove);
    const oldScale = transforms.scale;
    let scale = oldScale * amount;
    if (amount < 1 && oldScale > 1) scale = Math.max(1, scale);
    if (amount > 1 && oldScale < 1) scale = Math.min(1, scale);
    if (0.95 < scale && scale < 1.05) scale = 1;
    // elt.style.transform = `scale(${scale})`;
    // displayZoomed(scale);
    changeScaleTo(scale);
}

/**
 * 
 * @param {number} scale 
 */
function changeScaleTo(scale) {
    if (isNaN(scale)) throw Error("isNaN(scale)");
    if (scale > 1) throw Error("scale > 1");
    if (scale < 0.01) throw Error("scale < 0.01");
    eltZoomMove.style.transform = `scale(${scale})`;
    debounceDisplayZoomed(scale);
}

/**
 * 
 * @param {string} inOrOut 
 * @returns 
 */
function mkZoomButton(inOrOut) {
    let dir = inOrOut;
    let amount = 1.2;
    switch (inOrOut) {
        case "-":
            amount = 1 / amount;
            break;
        case "+":
            break;
        default:
            throw Error(`Bad parameter inOrOut: ${inOrOut}`);
    }
    const btn = document.createElement("button");
    btn.textContent = dir;
    btn.title = `Zoom ${dir}`;
    btn.addEventListener("click", () => {
        console.log("btn ", dir, amount);
        changeScale(amount);
    });
    return btn;
}

const btnDisplayZoomed = document.createElement("button");
const clsDisplayZoomed = "display-zoomed";
function mkDisplayZoomed() {
    // const btn = document.createElement("button");
    // btn.id = "mm4i-display-zoomed"
    const btn = btnDisplayZoomed;
    btn.classList.add(clsDisplayZoomed);
    btn.textContent = "100%";
    btn.title = "zoom 100%";
    btn.addEventListener("click", evt => {
        const scale = 1;
        eltZoomMove.style.transform = `scale(${scale})`;
        displayZoomed(scale);
    });
    return btn;
}
/**
 * 
 * @param {number} scaled 
 */
function displayZoomed(scaled) {
    const perc = Math.round(scaled * 100);
    // FIX-ME: You can't use the ID here.
    //   Using it leads to subtle bugs.
    //   Maybe this is a chromium bug? I am not sure at the moment.
    // const eltDisplay = document.getElementById("mm4i-display-zoomed");
    const eltDisplay = btnDisplayZoomed;
    if (!eltDisplay) throw Error("Didn't find mm4i-display-zoomed");
    if (!eltDisplay.isConnected) throw Error("mm4i-display-zoomed !.isConnected");
    eltDisplay.textContent = `${perc}%`;
}


export function getZoomPercentage() {
    // const eltDisplay = document.getElementById("mm4i-display-zoomed");
    const eltDisplay = btnDisplayZoomed;
    if (!eltDisplay) throw Error("Didn't find mm4-display-zoomed");
    const txt = eltDisplay.textContent;
    const percentage = parseFloat(txt);
    if (Number.isNaN(percentage)) throw Error(`"${txt}" does not start with number`);
    return percentage;
}
/**
 * 
 * @param {number} zoomed 
 */
export function setZoomPercentage(zoomed) {
    changeScaleTo(zoomed / 100);
}


/**
 * 
 * @param {string} horOrVer 
 * @returns 
 */
export function mkZoomButtons(horOrVer) {
    // console.log({ elt, horOrVer });
    if (!(eltZoomMove instanceof HTMLElement)) throw Error("elt is not HTMLElement");
    const tofHorOrVer = typeof horOrVer;
    if ("string" != tofHorOrVer) throw Error(`Expected string, got ${tofHorOrVer}`);

    // const btnPlus = mkZoomButton(eltZoomMove, "+");
    // const btnMinus = mkZoomButton(eltZoomMove, "-");
    const btnPlus = mkZoomButton("+");
    const btnMinus = mkZoomButton("-");
    const eltZoomed = mkDisplayZoomed();
    const cont = document.createElement("div");
    cont.appendChild(btnPlus);
    cont.appendChild(eltZoomed);
    cont.appendChild(btnMinus);
    // @ts-ignore
    cont.style = `
        display: flex;
    `;
    return cont;
}

export function getMoved() {
    const eltZM = /** @type {HTMLDivElement} */ (eltZoomMove.closest("div.zoom-move"));
    if (!eltZM) throw Error(`Did not find .closest("div.zoom-move")`);
    const top = eltZM.style.top;
    const left = eltZM.style.left;
    return { top, left }
}
/**
 * 
 * @param {object} objMoved 
 */
export function setMoved(objMoved) {
    const movedLeft = objMoved.left;
    const tofLeft = typeof movedLeft;
    if (tofLeft != "string") throw Error(`typeof movedLeft != "string": ${tofLeft}`);
    if (movedLeft > 0) {
        if (!movedLeft.endsWith(".px")) throw Error(`movedLeft is not in px: "${movedLeft}`);
    }

    const movedTop = objMoved.top;
    const tofTop = typeof movedTop;
    if (tofTop != "string") throw Error(`typeof movedTop != "string": ${tofTop}`);
    if (movedTop > 0) {
        if (!movedTop.endsWith(".px")) throw Error(`movedTop is not in px: "${movedTop}`);
    }

    // const eltZM = eltZoomMove.closest("div.zoom-move");
    const eltZM = /** @type {HTMLDivElement} */ (eltZoomMove.closest("div.zoom-move"));
    if (!eltZM) throw Error(`Did not find .closest("div.zoom-move")`);
    // FIX-ME:
    eltZM.style.left = movedLeft;
    eltZM.style.top = movedTop;
}