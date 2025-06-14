// @ts-check

const version = "0.1.000";
logConsoleHereIs(`here is zoom.js, module, ${version}`);
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
const distance = (event) => {
    return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
};

export function pinchZoom(element) {
    let scaleI;
    let xI;
    let yI;
    function getTransformsI() {
        const transforms = modTools.getCssTransforms(element);
        scaleI = transforms.scale;
        xI = transforms.x;
        yI = transforms.y;
    }

    let start = {};

    element.addEventListener('touchstart', (event) => {
        // console.log('touchstart', event);
        if (event.touches.length === 2) {
            event.preventDefault(); // Prevent page scroll

            // Calculate where the fingers have started on the X and Y axis
            start.x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
            start.y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
            start.distance = distance(event);

            getTransformsI();
        }
    });

    element.addEventListener('touchmove', (event) => {
        // console.log('touchmove', event);
        if (event.touches.length === 2) {
            event.preventDefault(); // Prevent page scroll

            const deltaDistance = distance(event);
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
            element.style.transform = transform;
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
 * @param {HTMLElement} elt 
 * @param {number} amount 
 */
function changeScale(elt, amount) {
    const transforms = modTools.getCssTransforms(elt);
    const oldScale = transforms.scale;
    let scale = oldScale * amount;
    if (amount < 1 && oldScale > 1) scale = Math.max(1, scale);
    if (amount > 1 && oldScale < 1) scale = Math.min(1, scale);
    if (0.95 < scale && scale < 1.05) scale = 1;
    // const x = transforms.x;
    // const y = transforms.y;
    // elt.style.transform = `translate(${x}, ${y}) scale(${scale})`;
    elt.style.transform = `scale(${scale})`;
    displayZoomed(scale);
}

/**
 * 
 * @param {HTMLElement} elt 
 * @param {string} inOrOut 
 * @returns 
 */
function mkZoomButton(elt, inOrOut) {
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
        changeScale(elt, amount);
    });
    return btn;
}

const clsDisplayZoomed = "display-zoomed";
function mkDisplayZoomed(elt) {
    const btn = document.createElement("button");
    btn.textContent = "100%";
    btn.classList.add(clsDisplayZoomed);
    btn.title = "zoom 100%";
    // changeScale(elt, amount);
    btn.addEventListener("click", evt => {
        const scale = 1;
        elt.style.transform = `scale(${scale})`;
        displayZoomed(scale);
    });
    return btn;
}
function displayZoomed(scaled) {
    const perc = Math.round(scaled * 100);
    const eltZoom = document.getElementById("mm4i-zoom-buttons");
    // @ts-ignore
    const eltDisplay = eltZoom.querySelector(`.${clsDisplayZoomed}`);
    // @ts-ignore
    eltDisplay.textContent = `${perc}%`;
}


/**
 * 
 * @param {HTMLElement} elt 
 * @param {string} horOrVer 
 * @returns 
 */
export function mkZoomButtons(elt, horOrVer) {
    // console.log({ elt, horOrVer });
    if (!(elt instanceof HTMLElement)) throw Error("elt is not HTMLElement");
    const tofHorOrVer = typeof horOrVer;
    if ("string" != tofHorOrVer) throw Error(`Expected string, got ${tofHorOrVer}`);

    const btnPlus = mkZoomButton(elt, "+");
    const btnMinus = mkZoomButton(elt, "-");
    const eltZoomed = mkDisplayZoomed(elt);
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