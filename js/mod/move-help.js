// @ts-check
const MOVE_HELP_VER = "0.0.7";
window["logConsoleHereIs"](`here is move-help.js, module, ${MOVE_HELP_VER}`);
if (document.currentScript) { throw "move-help.js is not loaded as module"; }

const mkElt = window["mkElt"];
const importFc4i = window["importFc4i"];

const modTools = await importFc4i("toolsJs");

export function setInitialMovingData(elt2move) {
    function getLeft() { return elt2move.style.left ? parseFloat(elt2move.style.left) : 0; }
    function getTop() { return elt2move.style.top ? parseFloat(elt2move.style.top) : 0; }
    const savedPointerPos = modTools.getSavedPointerPos();
    const posMovingData = {
        movingElt: elt2move,
        left: getLeft(),
        top: getTop(),
        clientX: savedPointerPos.clientX,
        clientY: savedPointerPos.clientY,
    }
    return posMovingData;
}
export function getMovingDx(movingData, clientX) { return clientX - movingData.clientX; }
export function getMovingDy(movingData, clientY) { return clientY - movingData.clientY; }

/**
 * @throws Throws if !elt.isConnected
 *  
 * @param {HTMLElement} elt 
 * @param {string} where 
 */
function checkIsConnected(elt, where) {
    if (!elt) {
        const msg = `${where}: elt is ${elt} `;
        console.error(msg);
        debugger; // eslint-disable-line no-debugger
        throw Error(msg);
    }
    if (!elt.isConnected) {
        const msg = `!${where}: !elt.isConnected`;
        console.error(msg);
        debugger; // eslint-disable-line no-debugger
        throw Error(msg);
    }
}
export class MoveEltAtFixedSpeed {
    constructor(elt2move, elt2show) {
        checkIsConnected(elt2move, MoveEltAtFixedSpeed.name);
        checkIsConnected(elt2show, MoveEltAtFixedSpeed.name);
        this.elt2move = elt2move;
        this.elt2show = elt2show;
    }
    stopX() {
        this.isMoving = false;
    }
    startX(direction) {
        if (this.isMoving) return;
        this.stopX();
        this.isMoving = true;
        // const msOverScreen = 8000;
        // const msOverScreen = 4000;
        const msOverScreen = 3000;
        const pxlPerMs = window.innerWidth / msOverScreen;
        // console.log("startX", { pxlPerMs });
        const startTime = Date.now();
        const elt2move = this.elt2move
        const elt2show = this.elt2show
        const movingData = setInitialMovingData(elt2move);
        const startLeft = movingData.left;
        const ourThis = this;
        let canMoveLeft = true;
        let canMoveRight = true;
        function moveFun() {
            if (!ourThis.isMoving) return;
            if (direction < 0) {
                canMoveRight = true;
                if (!canMoveLeft) {
                    requestAnimationFrame(moveFun);
                    return;
                }
                const bcr = elt2show.getBoundingClientRect();
                if (bcr.right < window.innerWidth) {
                    canMoveLeft = false;
                }
            } else {
                canMoveLeft = true;
                if (!canMoveRight) {
                    requestAnimationFrame(moveFun);
                    return;
                }
                const bcr = elt2show.getBoundingClientRect();
                if (bcr.left > 0) {
                    canMoveRight = false;
                }
            }
            const dx = direction * (Date.now() - startTime) * pxlPerMs;
            const newLeft = startLeft + dx;
            const newLeftPx = `${newLeft}px`.replace("-0px", "0px");
            if (newLeftPx.includes(" ")) throw Error(`space in newLeft: "${newLeft}`);
            elt2move.style.left = newLeftPx;
            requestAnimationFrame(moveFun);
        }
        moveFun();
    }

}

/**
 * Handles element movement when dragging near container borders.
 * @class MoveAtDragBorder
 */
export class MoveAtDragBorder {
    #deleted = false;
    /**
     * Creates an instance of MoveAtDragBorder.
     * @param {HTMLDivElement} elt2move - The container or element to monitor.
     * @param {number} moveBorderWidth
     * @param {HTMLDivElement} elt2show
     */
    constructor(elt2move, moveBorderWidth, elt2show) {
        // console.log("MoveAtDragBorder elt2move", elt2move);
        checkIsConnected(elt2move, MoveAtDragBorder.name);
        checkIsConnected(elt2show, MoveAtDragBorder.name);
        this.elt2move = elt2move;
        this.elt2show = elt2show;
        this.bw = moveBorderWidth;
        this.visuals = [];
        const addVisual = () => {
            const style = [
                "background-color: rgba(255, 0, 0, 0.2)",
                "position: fixed",
                "display: none",
                "pointer-events: none",
                "touch-actions: none",
            ].join(";");
            const eltVis = mkElt("div", { style });
            this.visuals.push(eltVis);
            // const elt2moveParent = elt2move.parentElement;
            // elt2moveParent.appendChild(eltVis);
            // Add to body to avoid scaling:
            document.body.appendChild(eltVis);
            return eltVis;
        }
        this.eltVisualLeft = addVisual();
        this.eltVisualRight = addVisual();
        // console.log("right", this.eltVisualRight);
        this.mover = new MoveEltAtFixedSpeed(elt2move, elt2show);
        const updateLimits = () => this.updateScreenLimits();
        const throttleUpdateLimits = modTools.throttleTO(updateLimits, 200);
        window.addEventListener("resize", () => { throttleUpdateLimits(); });
        throttleUpdateLimits();
    }
    markDeleted() { this.#deleted = true; }
    #isDeleted() { return this.#deleted; }
    #checkIsDeleted() {
        if (this.#deleted) {
            const msg = "This MoveAtDragBorder is marked as deleted";
            debugger; // eslint-disable-line no-debugger
            console.error(msg, this);
            throw Error(msg);
        }
    }
    showVisuals() {
        this.#checkIsDeleted();
        this.visuals.forEach(v => {
            v.style.display = "block";
            setTimeout(() => {
                window["b"] = v.getBoundingClientRect();
            });
        });
    }
    hideVisuals() { this.visuals.forEach(v => v.style.display = "none"); }
    /**
     * Update limits for visual drag borders
     * 
     * @param {boolean|undefined} secondCall 
     */
    updateScreenLimits = (secondCall = undefined) => {
        // this.#checkIsDeleted();
        if (this.#isDeleted()) { return; }
        const elt2moveParent = this.elt2move.parentElement;
        if (!elt2moveParent) {
            if (secondCall) {
                const msg = "elt2moveParent was not found in second call";
                debugger; // eslint-disable-line no-debugger
                console.error(msg);
                return;
            }
            const msg = "elt2moveParent was not found";
            debugger; // eslint-disable-line no-debugger
            console.error(msg);
            // FIX-ME: Probably called to early
            const fun = this.updateScreenLimits;
            setTimeout(() => fun(true), 1000);
            return;
        }
        // const scrollbarW = elt2moveParent.offsetWidth - elt2moveParent.clientWidth;
        const bcr = elt2moveParent.getBoundingClientRect();
        this.limits = {
            left: bcr.left + this.bw,
            right: bcr.left + bcr.width - this.bw, // - scrollbarW,
        }
        window["l"] = this.limits; // FIX-ME
        // console.log(">>>>>> this.limits", l);
        const styleL = this.eltVisualLeft.style;
        styleL.width = `${this.bw}px`;
        styleL.height = `${bcr.height}px`;
        styleL.top = `${bcr.top}px`
        styleL.left = `${bcr.left}px`
        const styleR = this.eltVisualRight.style;
        styleR.width = `${this.bw}px`;
        styleR.height = `${bcr.height}px`;
        styleR.top = `${bcr.top}px`
        // styleR.left = `${ bcr.left + bcr.width - this.bw - scrollbarW } px`
        styleR.left = `${this.limits.right}px`
    }
    checkPointerPos(clientX, _clientY) {
        // this.#checkIsDeleted();
        // checkIsConnected(this.elt2move, this.checkPointerPos.name);
        // checkIsConnected(this.elt2show, this.checkPointerPos.name);
        if (!this.limits) throw Error("this.limits is not set");
        const outsideRight = clientX > this.limits.right;
        const outsideLeft = clientX < this.limits.left;
        if (!(outsideLeft || outsideRight)) this.mover.stopX();
        const oldSx = this.sx;
        this.sx = clientX;
        if (outsideLeft) {
            this.mover.startX(1);
            if (oldSx) {
                if (clientX > oldSx) {
                    this.mover.stopX();
                }
            }
        }
        if (outsideRight) {
            this.mover.startX(-1);
            if (oldSx) { if (clientX < oldSx) this.mover.stopX(); }
        }
    }
    stopMoving() { this.mover.stopX(); }
    showMover() { this.showVisuals(); }
    hideMover() { this.hideVisuals(); }
    // checkMove(cX, cY) { this.checkPointerPos(cX, cY); }
}
