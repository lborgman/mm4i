// @ts-check
const MOVE_HELP_VER = "0.0.7";
logConsoleHereIs(`here is move-help.js, module, ${MOVE_HELP_VER}`);
if (document.currentScript) { throw "move-help.js is not loaded as module"; }

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

export class MoveEltAtFixedSpeed {
    constructor(elt2move) {
        this.elt2move = elt2move;
    }
    stopX() {
        this.isMoving = false;
    }
    startX(direction) {
        if (this.isMoving) return;
        this.stopX();
        this.isMoving = true;
        const msOverScreen = 8000;
        const pxlPerMs = window.innerWidth / msOverScreen;
        console.log("startX", { pxlPerMs });
        const startTime = Date.now();
        const elt2move = this.elt2move
        const movingData = setInitialMovingData(elt2move);
        const startLeft = movingData.left;
        const ourThis = this;
        function moveFun() {
            if (!ourThis.isMoving) return;
            const dx = direction * (Date.now() - startTime) * pxlPerMs;
            const newLeft = startLeft + dx;
            const newLeftPx = `${newLeft}px`.replace("-0px", "0px");
            elt2move.style.left = newLeftPx;
            requestAnimationFrame(moveFun);
        }
        moveFun();
    }

}
export class MoveEltAtDragBorder {
    constructor(elt2move, moveBorderWidth) {
        // console.log("MoveEltAtDragBorder elt2move", elt2move);
        this.elt2move = elt2move;
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
        this.mover = new MoveEltAtFixedSpeed(elt2move);
        const updateLimits = () => this.updateScreenLimits();
        window.addEventListener("resize", () => { updateLimits(); });
        updateLimits();
    }
    showVisuals() {
        this.visuals.forEach(v => {
            v.style.display = "block";
            setTimeout(() => {
                window["b"] = v.getBoundingClientRect();
            });
        });
    }
    hideVisuals() { this.visuals.forEach(v => v.style.display = "none"); }
    updateScreenLimits() {
        const elt2moveParent = this.elt2move.parentElement;
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
        // styleR.left = `${bcr.left + bcr.width - this.bw - scrollbarW}px`
        styleR.left = `${this.limits.right}px`
    }
    checkPointerPos(clientX, clientY) {
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
