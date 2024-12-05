// @ts-check
const MOVE_HELP_VER = "0.0.7";
console.log(`here is move-help.js, module, ${MOVE_HELP_VER}`);
if (document.currentScript) { throw "move-help.js is not loaded as module"; }

export function setInitialMovingData(elt2move, screenX, screenY) {
    function getLeft() { return elt2move.style.left ? parseFloat(elt2move.style.left) : 0; }
    function getTop() { return elt2move.style.top ? parseFloat(elt2move.style.top) : 0; }
    const posMovingData = {
        movingElt: elt2move,
        left: getLeft(),
        top: getTop(),
        screenX,
        screenY,
    }
    return posMovingData;
}
export function getMovingDx(movingData, screenX) { return screenX - movingData.screenX; }
export function getMovingDy(movingData, screenY) { return screenY - movingData.screenY; }

export class MoveEltAtFixedSpeed {
    constructor(elt2move) {
        this.elt2move = elt2move;
    }
    stopX() {
        clearInterval(this.tmiX);
        this.tmiX = undefined;
    }
    // 100 pixel / sec seems good
    startX(pxlPerSec) {
        this.stopX();
        this.prevLeft = undefined;
        const stepX = pxlPerSec < 0 ? -1 : 1;
        const ms = Math.abs(1000 / pxlPerSec);
        const elt2move = this.elt2move
        // const elt2scroll = elt2move.parentElement;
        // console.log({ stepX, ms, elt2scroll, elt2move });
        // FIX-ME:
        const moveData = setInitialMovingData();
        const moveFun = () => {
            elt2scroll.scrollBy(stepX, 0);
            const bcr = elt2move.getBoundingClientRect();
            // console.log(bcr.left, this.prevLeft);
            if (this.prevLeft == bcr.left) this.stopX();
            this.prevLeft = bcr.left;
        }
        this.tmiX = setInterval(moveFun, ms);
    }

}
export class MoveEltAtDragBorder {
    constructor(elt2move, moveBorderWidth) {
        console.log("MoveEltAtDragBorder elt2move", elt2move);
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
    showVisuals() { this.visuals.forEach(v => v.style.display = "block"); }
    hideVisuals() { this.visuals.forEach(v => v.style.display = "none"); }
    updateScreenLimits() {
        const elt2moveParent = this.elt2move.parentElement;
        const scrollbarW = elt2moveParent.offsetWidth - elt2moveParent.clientWidth;
        const bcr = elt2moveParent.getBoundingClientRect();
        this.limits = {
            left: bcr.left + this.bw,
            right: bcr.right - this.bw - scrollbarW,
        }
        const styleL = this.eltVisualLeft.style;
        styleL.width = `${this.bw}px`;
        styleL.height = `${bcr.height}px`;
        styleL.top = `${bcr.top}px`
        styleL.left = `${bcr.left}px`
        const styleR = this.eltVisualRight.style;
        styleR.width = `${this.bw}px`;
        styleR.height = `${bcr.height}px`;
        styleR.top = `${bcr.top}px`
        styleR.left = `${bcr.left + bcr.width - this.bw - scrollbarW}px`
        styleR.left = `${this.limits.right}px`
    }
    checkPoint(screenX, screenY) {
        const oldSx = this.sx;
        const outsideRight = screenX > this.limits.right;
        const outsideLeft = screenX < this.limits.left;
        if (!(outsideLeft || outsideRight)) this.mover.stopX();
        this.sx = screenX;
        const moveSpeed = 150;
        if (outsideLeft) {
            this.mover.startX(-moveSpeed);
            if (oldSx) { if (screenX > oldSx) this.mover.stopX(); }
        }
        if (outsideRight) {
            this.mover.startX(moveSpeed);
            if (oldSx) { if (screenX < oldSx) this.mover.stopX(); }
        }
    }
    stopMoving() { this.mover.stopX(); }
    showMover() { this.showVisuals(); }
    hideMover() { this.hideVisuals(); }
    checkMove(cX, cY) { this.checkPoint(cX, cY); }
}
